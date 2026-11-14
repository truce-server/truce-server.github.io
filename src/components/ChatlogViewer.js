import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@mantine/core';
import { useClipboard, useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconLink,
  IconSearch,
  IconShare,
  IconX,
} from '@tabler/icons-react';
import { findFolder, folderLabel } from '../seasons';
import { archiveUrl, chatName, chatSummary, encodePath, formatNumber, playersLabel, pluralize, publicUrl, sortChats } from '../utils/chats';
import { withAlpha } from '../utils/ui';

const HIGHLIGHT_CLASS = 'chatlog__message-container--highlighted';
const READY_MESSAGE = 'truce-chat-ready';
const MAX_LISTED_RESULTS = 100;
const NO_RESULTS = [];
const TEXT_SELECTOR = [
  '.chatlog__content',
  '.chatlog__embed-title',
  '.chatlog__embed-description',
  '.chatlog__embed-field-name',
  '.chatlog__embed-field-value',
].join(', ');

// Added to every export. These only make it fit the frame (margins, overflow, phone sizes) and mark the
// message a search jumped to; the export's own Discord look is left alone in every season.
// Everything is !important because the exports' own styles load after these.
function frameStyles(season) {
  const highlight = withAlpha(season.accent, 0.22);
  const css = `
    html, body { margin: 0 !important; }
    body { overflow-x: hidden !important; }
    .chatlog__timestamp a, .chatlog__short-timestamp { pointer-events: none !important; cursor: default !important; text-decoration: none !important; }
    .chatlog__markdown-pre--multiline { max-width: 100% !important; overflow-x: auto !important; }
    .${HIGHLIGHT_CLASS} { background-color: ${highlight} !important; }
    @media (max-width: 600px) {
      body { font-size: 15px !important; }
      .preamble { padding: 0.75rem !important; }
      .preamble__guild-icon { max-width: 48px !important; max-height: 48px !important; }
      .preamble__entries-container { margin-left: 0.75rem !important; }
      .preamble__entry { font-size: 1.1rem !important; }
      .chatlog__message-aside { width: 52px !important; }
      .chatlog__avatar { width: 32px !important; height: 32px !important; }
      .chatlog__reply-symbol { margin-left: 26px !important; }
      .chatlog__embed, .chatlog__attachment-generic, .chatlog__attachment-media { max-width: 100% !important; }
    }`;

  return `<style>${css}</style><base target="_blank">`;
}

// Links open in a new tab, in-page anchors scroll, and the parent hears when the chat has rendered.
const FRAME_SCRIPT = `<script>
document.addEventListener('click', function (event) {
  var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
  if (!link) return;
  var href = link.getAttribute('href') || '';
  event.preventDefault();
  if (href.charAt(0) === '#') {
    var target = document.getElementById(href.slice(1));
    if (target) target.scrollIntoView({ block: 'center' });
    return;
  }
  if (/^javascript:/i.test(href)) return;
  window.open(link.href, '_blank', 'noopener,noreferrer');
}, true);
parent.postMessage({ type: '${READY_MESSAGE}' }, '*');
</script>`;

// The exports are minified without </head> or </body>, so add styles right after <head> and the script at the end.
function prepareHtml(raw, styles) {
  const start = raw.slice(0, 4096);
  const head = /<head[^>]*>/i.exec(start) || /<!doctype[^>]*>/i.exec(start);
  const at = head ? head.index + head[0].length : 0;
  return `${raw.slice(0, at)}${styles}${raw.slice(at)}${FRAME_SCRIPT}`;
}

const cleanName = (name) => name.replace(/\s*\[[^\]]*\]\s*$/, '').trim();

// Built from the iframe's own document the first time someone searches, so the chat is only parsed once.
function buildIndex(doc) {
  const items = [];
  doc.querySelectorAll('.chatlog__message-group').forEach((group) => {
    const author = cleanName(group.querySelector('.chatlog__author')?.textContent || '');
    group.querySelectorAll('.chatlog__message-container').forEach((container) => {
      if (!container.id) return;
      const text = Array.from(container.querySelectorAll(TEXT_SELECTOR), (node) => node.textContent)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!text) return;
      const stamp = container.querySelector('.chatlog__timestamp, .chatlog__short-timestamp');
      items.push({
        id: container.id,
        author,
        time: stamp?.getAttribute('title') || stamp?.textContent.trim() || '',
        text,
        haystack: `${author} ${text}`.toLowerCase(),
      });
    });
  });
  return items;
}

function snippet(text, needle) {
  const max = 160;
  if (text.length <= max) return text;
  const index = text.toLowerCase().indexOf(needle);
  const start = index > 40 ? index - 40 : 0;
  const end = Math.min(text.length, start + max);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

// The exports keep Discord's own dark ground, so the loading and error states sit on it too.
const CHAT_BACKGROUND = '#36393e';

/** Wraps each match of `needle` in <mark>. */
function Marked({ text, needle }) {
  if (!needle) return text;
  const lower = text.toLowerCase();
  const parts = [];
  let from = 0;
  let at = lower.indexOf(needle);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={at}>{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
    at = lower.indexOf(needle, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

function ShareButton({ url, title }) {
  const clipboard = useClipboard({ timeout: 2000 });
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleClick = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    clipboard.copy(url);
  };

  let label = 'Copy link';
  if (clipboard.copied) label = 'Link copied';
  else if (canShare) label = 'Share';

  let Icon = IconLink;
  if (clipboard.copied) Icon = IconCheck;
  else if (canShare) Icon = IconShare;

  return (
    <button
      type="button"
      className="btn btn--tool"
      onClick={handleClick}
      aria-label={canShare ? 'Share this chat' : 'Copy a link to this chat'}
      title={label}
    >
      <Icon size={16} stroke={2} aria-hidden="true" />
      <span className="btn__label" aria-live="polite">{label}</span>
    </button>
  );
}

function ChatlogViewer({ season, folder, file, files, info }) {
  const name = chatName(file);
  const category = folderLabel(season, folder);
  const { group } = findFolder(season, folder);
  const categoryUrl = archiveUrl(season.path, folder);
  const fileUrl = publicUrl(`/${encodePath(season.resolveChat(folder, file))}`);
  const shareUrl = `${window.location.origin}${archiveUrl(season.path, folder, file)}`;
  const details = [info ? chatSummary(file, info) : chatSummary(file, null), playersLabel(info, 4)].filter(Boolean).join(' · ');

  // The chats either side of this one, in the order the category lists them.
  const siblings = useMemo(() => sortChats(files || [file]), [files, file]);
  const position = siblings.indexOf(file);
  const previous = position > 0 ? siblings[position - 1] : null;
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;

  const styles = useMemo(() => frameStyles(season), [season]);

  const [load, setLoad] = useState({ status: 'loading', html: '' });
  const [attempt, setAttempt] = useState(0);
  const [frameReady, setFrameReady] = useState(false);
  const iframeRef = useRef(null);
  const indexRef = useRef(null);

  // Wide screens search from the header and list matches beside the chat; narrow ones use a drawer.
  const wide = useMediaQuery('(min-width: 62em)', true, { getInitialValueInEffect: false });
  const phone = useMediaQuery('(max-width: 48em)', false, { getInitialValueInEffect: false });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query.trim(), 200);
  const [results, setResults] = useState(NO_RESULTS);
  const [active, setActive] = useState(-1);
  const highlightRef = useRef({ element: null, timer: 0 });
  const listRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading', html: '' });
    setFrameReady(false);
    indexRef.current = null;

    fetch(fileUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        return response.text();
      })
      .then((text) => {
        // A missing file can come back as the app's own page, so only accept real exports.
        if (!text.includes('chatlog__')) throw new Error('Not a chat export');
        setLoad({ status: 'ready', html: prepareHtml(text, styles) });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoad({ status: 'error', html: '' });
      });

    return () => controller.abort();
  }, [fileUrl, styles, attempt]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === READY_MESSAGE && event.source === iframeRef.current?.contentWindow) {
        setFrameReady(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const jumpTo = useCallback((item) => {
    const element = iframeRef.current?.contentDocument?.getElementById(item.id);
    if (!element) return;
    element.scrollIntoView({ block: 'center' });
    const state = highlightRef.current;
    window.clearTimeout(state.timer);
    if (state.element && state.element !== element) state.element.classList.remove(HIGHLIGHT_CLASS);
    element.classList.add(HIGHLIGHT_CLASS);
    state.element = element;
    state.timer = window.setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), 2200);
  }, []);

  useEffect(() => {
    const state = highlightRef.current;
    return () => window.clearTimeout(state.timer);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || !frameReady) {
      setResults(NO_RESULTS);
      setActive(-1);
      return;
    }
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    if (!indexRef.current) indexRef.current = buildIndex(doc);
    const needle = debouncedQuery.toLowerCase();
    const found = indexRef.current.filter((item) => item.haystack.includes(needle));
    setResults(found.length ? found : NO_RESULTS);
    setActive(found.length ? 0 : -1);
    if (found.length) jumpTo(found[0]);
  }, [debouncedQuery, frameReady, jumpTo]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (step) => {
    if (!results.length) return;
    const nextIndex = (active + step + results.length) % results.length;
    setActive(nextIndex);
    jumpTo(results[nextIndex]);
  };

  const select = (index) => {
    setActive(index);
    jumpTo(results[index]);
    if (!wide) setDrawerOpen(false);
  };

  const handleSearchKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      go(event.shiftKey ? -1 : 1);
    } else if (event.key === 'Escape' && query) {
      event.stopPropagation();
      setQuery('');
    }
  };

  const needle = debouncedQuery.toLowerCase();
  let status = 'Search messages and names. Enter jumps to the next match.';
  if (debouncedQuery && !frameReady) status = 'The chat is still loading…';
  else if (debouncedQuery && results.length === 0) status = 'No messages match.';
  else if (debouncedQuery) {
    status = pluralize(results.length, 'match', 'matches');
    if (results.length > MAX_LISTED_RESULTS) status += ` · showing the first ${MAX_LISTED_RESULTS}`;
  }

  const searchField = (autoFocus) => (
    <label className="field reader__search">
      <IconSearch size={16} stroke={2} aria-hidden="true" />
      <input
        type="search"
        data-autofocus={autoFocus || undefined}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyDown={handleSearchKey}
        placeholder="Search this chat"
        aria-label="Search this chat"
        autoComplete="off"
      />
      {query && (
        <button type="button" className="field__clear" onClick={() => setQuery('')} aria-label="Clear search">
          <IconX size={14} stroke={2} aria-hidden="true" />
        </button>
      )}
    </label>
  );

  const resultList = (
    <>
      <p className="results__status" aria-live="polite">{status}</p>
      <div className="results__list" ref={listRef}>
        {results.slice(0, MAX_LISTED_RESULTS).map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="result"
            data-active={index === active}
            onClick={() => select(index)}
          >
            <span className="result__who">{[item.author, item.time].filter(Boolean).join(' · ')}</span>
            <span className="result__text"><Marked text={snippet(item.text, needle)} needle={needle} /></span>
          </button>
        ))}
      </div>
    </>
  );

  const showOverlay = load.status === 'loading' || (load.status === 'ready' && !frameReady);
  const loadingText = info?.n >= 2000 ? `Loading ${formatNumber(info.n)} messages…` : 'Loading chat…';
  const showResults = wide && Boolean(debouncedQuery) && load.status === 'ready';

  return (
    <div className="reader" style={{ '--chat-bg': CHAT_BACKGROUND, '--c': group?.color }}>
      <header className="reader__head">
        <div className="reader__titles">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to={season.path}>{season.label}</Link>
            <IconChevronRight size={14} stroke={2} aria-hidden="true" />
            <Link to={categoryUrl}>
              <i className="swatch" aria-hidden="true" />
              {category}
            </Link>
          </nav>
          <h1 title={name}>{name}</h1>
          <p className="reader__meta">{details}</p>
        </div>

        <div className="reader__tools">
          {wide ? searchField(false) : (
            <button type="button" className="btn btn--tool" onClick={() => setDrawerOpen(true)} aria-label="Search this chat" title="Search this chat">
              <IconSearch size={16} stroke={2} aria-hidden="true" />
              <span className="btn__label">Search</span>
            </button>
          )}
          <ShareButton url={shareUrl} title={name} />
          <a className="btn btn--tool" href={fileUrl} target="_blank" rel="noopener noreferrer" aria-label="Open the original file in a new tab" title="Open the original file">
            <IconExternalLink size={16} stroke={2} aria-hidden="true" />
            <span className="btn__label">Original</span>
          </a>

          {siblings.length > 1 && (
            <nav className="pager" aria-label={`Chats in ${category}`}>
              {previous ? (
                <Link className="pager__step" to={archiveUrl(season.path, folder, previous)} aria-label={`Previous chat: ${chatName(previous)}`} title={`Previous: ${chatName(previous)}`}>
                  <IconChevronLeft size={18} stroke={2} aria-hidden="true" />
                </Link>
              ) : (
                <span className="pager__step" aria-hidden="true" data-disabled><IconChevronLeft size={18} stroke={2} /></span>
              )}
              <span className="pager__count">{formatNumber(position + 1)} of {formatNumber(siblings.length)}</span>
              {next ? (
                <Link className="pager__step" to={archiveUrl(season.path, folder, next)} aria-label={`Next chat: ${chatName(next)}`} title={`Next: ${chatName(next)}`}>
                  <IconChevronRight size={18} stroke={2} aria-hidden="true" />
                </Link>
              ) : (
                <span className="pager__step" aria-hidden="true" data-disabled><IconChevronRight size={18} stroke={2} /></span>
              )}
            </nav>
          )}
        </div>
      </header>

      <div className="reader__body">
        <div className="reader__stage">
          {debouncedQuery && load.status === 'ready' && (
            <div className="matchbar">
              <p>
                {results.length
                  ? `${formatNumber(active + 1)} of ${formatNumber(results.length)} for “${debouncedQuery}”`
                  : `No matches for “${debouncedQuery}”`}
              </p>
              <button type="button" className="icon-btn" onClick={() => go(-1)} disabled={!results.length} aria-label="Previous match" title="Previous match">
                <IconArrowUp size={16} stroke={2} aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn" onClick={() => go(1)} disabled={!results.length} aria-label="Next match" title="Next match">
                <IconArrowDown size={16} stroke={2} aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn" onClick={() => setQuery('')} aria-label="Clear search" title="Clear search">
                <IconX size={16} stroke={2} aria-hidden="true" />
              </button>
            </div>
          )}

          {load.status === 'ready' && (
            <iframe
              ref={iframeRef}
              className="reader__frame"
              title={`Chat: ${name}`}
              srcDoc={load.html}
              sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => {
                // Fallback for the ready message; ignore any load of the empty placeholder document.
                if (iframeRef.current?.contentDocument?.querySelector('.chatlog')) setFrameReady(true);
              }}
            />
          )}

          {showOverlay && (
            <div className="reader__overlay" role="status">
              <span className="loading-steps" aria-hidden="true"><i /><i /><i /></span>
              <p>{loadingText}</p>
            </div>
          )}

          {load.status === 'error' && (
            <div className="reader__overlay" role="alert">
              <IconAlertTriangle size={28} stroke={2} aria-hidden="true" />
              <p className="reader__overlay-title">This chat didn't load</p>
              <p>Check your connection and try again.</p>
              <div className="reader__overlay-actions">
                <button type="button" className="btn btn--solid" onClick={() => setAttempt((count) => count + 1)}>Try again</button>
                <Link className="btn" to={categoryUrl}>Back to {category}</Link>
              </div>
            </div>
          )}
        </div>

        {showResults && (
          <aside className="reader__results" aria-label="Matches in this chat">{resultList}</aside>
        )}
      </div>

      <Drawer
        opened={!wide && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size={phone ? '100%' : 380}
        title="Search this chat"
        radius={0}
        shadow="none"
        overlayProps={{ backgroundOpacity: 0.35, blur: 0 }}
        transitionProps={{ duration: 0 }}
        classNames={{ content: 'sheet', header: 'sheet__header', title: 'sheet__title', body: 'sheet__body sheet__body--search', close: 'sheet__close' }}
      >
        {searchField(true)}
        {resultList}
      </Drawer>
    </div>
  );
}

export default ChatlogViewer;
