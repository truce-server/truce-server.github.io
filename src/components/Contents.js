import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronDown, IconChevronRight, IconSearch, IconX } from '@tabler/icons-react';
import { buildGroups, folderLabel } from '../seasons';
import { archiveUrl, chatName, sortChats } from '../utils/chats';

/** The season's full contents: eras, their categories, and the chats inside each one. */
function Contents({ season, sitemap, activeFolder, activeFile, onFolderClick }) {
  const [query, setQuery] = useState('');
  const search = useDeferredValue(query.trim().toLowerCase());
  const [openFolders, setOpenFolders] = useState(() => new Set(activeFolder ? [activeFolder] : []));
  const activeLinkRef = useRef(null);

  // The category you're in always opens.
  useEffect(() => {
    if (!activeFolder) return;
    setOpenFolders((current) => (current.has(activeFolder) ? current : new Set(current).add(activeFolder)));
  }, [activeFolder]);

  // Keep the open chat in view (e.g. after following a shared link).
  useEffect(() => {
    if (!activeFile) return undefined;
    const timer = window.setTimeout(() => activeLinkRef.current?.scrollIntoView({ block: 'nearest' }), 120);
    return () => window.clearTimeout(timer);
  }, [activeFolder, activeFile]);

  const groups = useMemo(() => buildGroups(season, sitemap), [season, sitemap]);

  const chatsByFolder = useMemo(() => {
    const result = {};
    Object.entries(sitemap).forEach(([folder, files]) => {
      result[folder] = sortChats(files).map((file) => {
        const name = chatName(file);
        return { file, name, search: name.toLowerCase() };
      });
    });
    return result;
  }, [sitemap]);

  // While filtering: whole categories match by name, otherwise individual chats do.
  const matches = useMemo(() => {
    if (!search) return null;
    const result = {};
    Object.entries(chatsByFolder).forEach(([folder, chats]) => {
      const folderMatches = `${folder} ${folderLabel(season, folder)}`.toLowerCase().includes(search);
      const found = folderMatches ? chats : chats.filter((chat) => chat.search.includes(search));
      if (found.length) result[folder] = found;
    });
    return result;
  }, [chatsByFolder, search, season]);

  const visibleGroups = groups
    .map((group) => ({ ...group, folders: group.folders.filter((item) => !matches || matches[item.name]) }))
    .filter((group) => group.folders.length > 0);

  const setFolderOpen = (folder, opened) => {
    setOpenFolders((current) => {
      const next = new Set(current);
      if (opened) next.add(folder);
      else next.delete(folder);
      return next;
    });
  };

  return (
    <nav className="contents" aria-label={`${season.label} contents`}>
      <div className="contents__top">
        <Link to={season.path} className="contents__season" aria-current={!activeFolder ? 'page' : undefined}>
          {season.name ? `${season.label}: ${season.name}` : season.label}
        </Link>
        <label className="field">
          <IconSearch size={16} stroke={2} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Filter chats"
            aria-label="Filter chats"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="field__clear" onClick={() => setQuery('')} aria-label="Clear filter">
              <IconX size={14} stroke={2} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      <div className="contents__scroll">
        {visibleGroups.length === 0 && (
          <p className="contents__empty">No chats match “{query.trim()}”.</p>
        )}

        {visibleGroups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <div className="contents__era" style={{ '--c': group.color }}>{group.label}</div>
            <ul>
              {group.folders.map(({ name: folder }) => {
                const chats = matches ? matches[folder] : chatsByFolder[folder];
                const folderUrl = archiveUrl(season.path, folder);
                const label = folderLabel(season, folder);
                const open = Boolean(matches) || openFolders.has(folder);
                const isCurrent = folder === activeFolder && !activeFile;

                return (
                  <li key={folder}>
                    <div className="contents__folder" data-within={folder === activeFolder || undefined}>
                      <Link
                        to={folderUrl}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={() => {
                          onFolderClick?.(folderUrl);
                          setFolderOpen(folder, true);
                        }}
                      >
                        <span>{label}</span>
                        <span className="contents__count">{chats.length}</span>
                      </Link>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={`${open ? 'Hide' : 'Show'} chats in ${label}`}
                        disabled={Boolean(matches)}
                        onClick={() => setFolderOpen(folder, !open)}
                      >
                        {open
                          ? <IconChevronDown size={16} stroke={2} aria-hidden="true" />
                          : <IconChevronRight size={16} stroke={2} aria-hidden="true" />}
                      </button>
                    </div>

                    {open && (
                      <ul className="contents__chats">
                        {chats.map((chat) => {
                          const isActive = folder === activeFolder && chat.file === activeFile;
                          return (
                            <li key={chat.file}>
                              <Link
                                ref={isActive ? activeLinkRef : undefined}
                                to={archiveUrl(season.path, folder, chat.file)}
                                aria-current={isActive ? 'page' : undefined}
                                title={chat.name}
                              >
                                {chat.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}

export default Contents;
