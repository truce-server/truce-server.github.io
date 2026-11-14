import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { IconSearch, IconX } from '@tabler/icons-react';
import { SEASONS, buildGroups, folderLabel } from '../seasons';
import { useJson, useJsonAll } from '../hooks/useJson';
import { archiveUrl, chatId, chatName, playersLabel, pluralize, publicUrl, sortChats } from '../utils/chats';

const META_URL = publicUrl('/chat-meta.json');
const SITEMAP_URLS = SEASONS.map((season) => publicUrl(season.sitemapUrl));

export const openSearch = () => spotlight.open();

/**
 * Search entries for one season: a group per category, an entry per chat.
 * Player names are keywords, so searching a name finds the chats that person is in.
 * `go` is called with the address of the chosen chat.
 */
export function searchActions(season, sitemap, meta, go, { prefix = '' } = {}) {
  if (!sitemap) return [];
  return buildGroups(season, sitemap)
    .flatMap((group) => group.folders)
    .map(({ name: folder }) => {
      const label = folderLabel(season, folder);
      return {
        group: `${prefix}${label}`,
        actions: sortChats(sitemap[folder]).map((file) => {
          const info = meta?.[chatId(file)];
          // The players are listed as well as searched, so a match on a name shows why it matched.
          const details = [`${prefix}${label}`];
          if (info) details.push(pluralize(info.n, 'message'), playersLabel(info, 6));
          return {
            id: `${season.id}/${folder}/${file}`,
            label: chatName(file),
            description: details.filter(Boolean).join(' · '),
            keywords: info ? [folder, ...info.p] : [folder],
            onClick: () => go(archiveUrl(season.path, folder, file)),
          };
        }),
      };
    });
}

/**
 * Search across every season at once, for pages that don't belong to one (home, Season 3).
 * Also hands back what it loaded, keyed by season id, so those pages don't fetch it twice.
 */
export function useEverySeasonSearch() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const { data: meta } = useJson(META_URL);
  const loadedSitemaps = useJsonAll(SITEMAP_URLS);

  useEffect(() => {
    navigateRef.current = navigate;
  });

  // The list is rebuilt on every render, so compare what's in it rather than the list itself.
  const sitemaps = useMemo(
    () => Object.fromEntries(SEASONS.map((season, index) => [season.id, loadedSitemaps[index]])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadedSitemaps
  );

  const actions = useMemo(() => SEASONS.flatMap((season) => searchActions(
    season,
    sitemaps[season.id],
    meta,
    (url) => navigateRef.current(url),
    { prefix: `${season.label} · ` }
  )), [sitemaps, meta]);

  return { actions, sitemaps, meta };
}

const CLASS_NAMES = {
  content: 'palette',
  body: 'palette__body',
  search: 'palette__search',
  actionsList: 'palette__list',
  actionsGroup: 'palette__group',
  action: 'palette__action',
  actionLabel: 'palette__label',
  actionDescription: 'palette__description',
  empty: 'palette__empty',
};

/** The Ctrl/Cmd K search box. */
function SearchPalette({ actions, placeholder = 'Search chats, categories or players' }) {
  const phone = useMediaQuery('(max-width: 48em)');

  return (
    <Spotlight
      actions={actions}
      limit={50}
      scrollable
      maxHeight={phone ? '100dvh' : 440}
      fullScreen={phone}
      nothingFound="No chats found"
      highlightQuery
      shortcut="mod + K"
      radius={0}
      shadow="none"
      overlayProps={{ backgroundOpacity: 0.35, blur: 0 }}
      transitionProps={{ duration: 0 }}
      classNames={CLASS_NAMES}
      searchProps={{
        placeholder,
        leftSection: <IconSearch size={18} stroke={2} />,
        // On a phone the box fills the screen, so it needs its own way out.
        rightSection: phone ? (
          <button type="button" className="palette__close" onClick={() => spotlight.close()} aria-label="Close search">
            <IconX size={18} stroke={2} aria-hidden="true" />
          </button>
        ) : undefined,
        rightSectionPointerEvents: 'all',
        rightSectionWidth: phone ? 52 : undefined,
      }}
    />
  );
}

export default SearchPalette;
