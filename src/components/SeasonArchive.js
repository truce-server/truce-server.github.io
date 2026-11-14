import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import Masthead from './Masthead';
import Contents from './Contents';
import SeasonLanding from './SeasonLanding';
import ChannelView from './ChannelView';
import ChatlogViewer from './ChatlogViewer';
import SearchPalette, { openSearch, searchActions } from './SearchPalette';
import { MapPlaceholder } from './SeasonMap';
import { folderLabel, normalizeFile } from '../seasons';
import { useJson } from '../hooks/useJson';
import { useStock } from '../hooks/useStock';
import { archiveUrl, chatId, chatName, parseArchivePath, publicUrl } from '../utils/chats';

function Notice({ title, text, children }) {
  return (
    <div className="notice" role="alert">
      <div className="notice__icon"><IconAlertTriangle size={26} stroke={2} aria-hidden="true" /></div>
      <div className="notice__body">
        <h1>{title}</h1>
        <p>{text}</p>
        {children && <div className="notice__actions">{children}</div>}
      </div>
    </div>
  );
}

function SeasonArchive({ season }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  // The season's full contents list opens from the Contents button in the top bar, at every width.
  const [contentsOpened, { open: openContents, close: closeContents }] = useDisclosure(false);
  const keepContentsOpenFor = useRef(null);
  const phone = useMediaQuery('(max-width: 48em)');

  const sitemapRequest = useJson(publicUrl(season.sitemapUrl));
  const { data: meta } = useJson(publicUrl('/chat-meta.json'));
  const sitemap = sitemapRequest.data;

  useStock(season.stock);

  useEffect(() => {
    navigateRef.current = navigate;
  });

  // The URL is the source of truth for what's on screen.
  const route = parseArchivePath(location.pathname, season.path);
  const folder = route.folder ? season.folderAliases[route.folder] || route.folder : null;
  const file = folder && route.file ? normalizeFile(folder, route.file) : null;
  const folderFiles = sitemap && folder ? sitemap[folder] : null;
  const notFound = Boolean(sitemap) && Boolean(folder) && (!folderFiles || Boolean(file && !folderFiles.includes(file)));
  const view = file ? 'chat' : folder ? 'category' : 'overview';

  // Old links (renamed categories, Song of Life's "Season 2/" prefix) are rewritten to the current address.
  useEffect(() => {
    if (route.folder && (folder !== route.folder || file !== route.file)) {
      navigate(archiveUrl(season.path, folder, file), { replace: true });
    }
  }, [route.folder, route.file, folder, file, navigate, season.path]);

  // The contents close after you pick something, except when you open a category from them.
  useEffect(() => {
    const keepOpen = keepContentsOpenFor.current === location.pathname;
    keepContentsOpenFor.current = null;
    if (!keepOpen) closeContents();
  }, [location.pathname, closeContents]);

  useEffect(() => {
    const parts = [];
    if (!notFound && file) parts.push(chatName(file));
    if (!notFound && folder) parts.push(folderLabel(season, folder));
    parts.push(season.label, 'Truce Archives');
    document.title = parts.join(' · ');
  }, [season, folder, file, notFound]);

  const actions = useMemo(
    () => searchActions(season, sitemap, meta, (url) => navigateRef.current(url)),
    [season, sitemap, meta]
  );

  let content;
  if (sitemapRequest.error) {
    content = (
      <Notice title="This season's chats didn't load" text="Check your connection and try again.">
        <button type="button" className="btn btn--solid" onClick={sitemapRequest.retry}>Try again</button>
      </Notice>
    );
  } else if (!sitemap) {
    content = <MapPlaceholder />;
  } else if (notFound) {
    content = (
      <Notice title="We couldn't find that chat" text="It may have been moved or renamed.">
        <Link className="btn btn--solid" to={season.path}>Go to {season.label}</Link>
      </Notice>
    );
  } else if (view === 'chat') {
    content = (
      <ChatlogViewer
        key={`${folder}/${file}`}
        season={season}
        folder={folder}
        file={file}
        files={folderFiles}
        info={meta?.[chatId(file)]}
      />
    );
  } else if (view === 'category') {
    content = <ChannelView season={season} folder={folder} files={folderFiles} sitemap={sitemap} meta={meta} />;
  } else {
    content = <SeasonLanding season={season} sitemap={sitemap} meta={meta} />;
  }

  const fill = view === 'chat' && Boolean(sitemap) && !notFound;

  const contents = sitemap && (
    <Contents
      season={season}
      sitemap={sitemap}
      activeFolder={notFound ? null : folder}
      activeFile={notFound ? null : file}
      onFolderClick={(url) => {
        keepContentsOpenFor.current = url;
      }}
    />
  );

  return (
    <div className={`page${fill ? ' page--fill' : ''}`}>
      <Masthead
        current={season.id}
        onSearch={openSearch}
        onContents={sitemap ? openContents : undefined}
      />

      <div className="page__body">
        <main className="page__main" key={notFound ? 'not-found' : `${folder || ''}/${file || ''}`}>
          {content}
        </main>
      </div>

      <Drawer
        opened={contentsOpened}
        onClose={closeContents}
        position="left"
        size={phone ? '100%' : 360}
        title="Contents"
        radius={0}
        shadow="none"
        overlayProps={{ backgroundOpacity: 0.35, blur: 0 }}
        transitionProps={{ duration: 0 }}
        classNames={{ content: 'sheet', header: 'sheet__header', title: 'sheet__title', body: 'sheet__body', close: 'sheet__close' }}
      >
        {contents}
      </Drawer>

      <SearchPalette actions={actions} />
    </div>
  );
}

export default SeasonArchive;
