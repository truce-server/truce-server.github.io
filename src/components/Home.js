import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import Masthead from './Masthead';
import SearchPalette, { openSearch, useEverySeasonSearch } from './SearchPalette';
import { MiniMap } from './SeasonMap';
import { ALL_SEASONS, HOUSE_STOCK, SEASONS, buildGroups } from '../seasons';
import { prefetchJson } from '../hooks/useJson';
import { stockVars, useStock } from '../hooks/useStock';
import { formatDateRange, formatNumber, pluralize, publicUrl, summarize } from '../utils/chats';

const META_URL = '/chat-meta.json';

/** One season on the home page: its art, its totals, and a small copy of its table. */
function SeasonRow({ season, sitemap, meta, onPick }) {
  const groups = useMemo(() => (sitemap ? buildGroups(season, sitemap) : null), [season, sitemap]);
  const totals = useMemo(
    () => (sitemap ? summarize(Object.values(sitemap).flat(), meta) : null),
    [sitemap, meta]
  );

  const prefetch = () => {
    if (season.upcoming) return;
    prefetchJson(publicUrl(season.sitemapUrl));
    prefetchJson(publicUrl(META_URL));
  };

  let facts = ' ';
  let dates = ' ';
  if (season.upcoming) {
    facts = 'Not in the archive yet';
    dates = 'Its chats will show up here after the season ends.';
  } else if (totals) {
    const parts = [
      pluralize(Object.keys(sitemap).length, 'category', 'categories'),
      pluralize(totals.chats, 'chat'),
    ];
    if (meta) parts.push(pluralize(totals.messages, 'message'));
    facts = parts.join(' · ');
    if (meta && totals.start) dates = formatDateRange(totals.start, totals.end);
  }

  return (
    <li style={stockVars(season.stock)}>
      <Link
        to={season.path}
        className="season-row"
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onClick={(event) => {
          // Plain clicks play the season's intro; new-tab clicks behave like any link.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          onPick(season.id);
        }}
      >
        <img
          className="season-row__art"
          src={publicUrl(season.art.src)}
          alt=""
          width={season.art.width}
          height={season.art.height}
          decoding="async"
        />
        <span className="season-row__text">
          <span className="season-row__name" role="heading" aria-level="2">
            {season.name ? <><span>{season.label}</span> {season.name}</> : season.label}
          </span>
          <span className="season-row__facts">{facts}</span>
          <span className="season-row__dates">{dates}</span>
        </span>
        <span className="season-row__map">
          {groups
            ? <MiniMap groups={groups} sitemap={sitemap} />
            : <span className={`minimap minimap--empty${season.upcoming ? ' minimap--upcoming' : ''}`} aria-hidden="true" />}
        </span>
        <span className="season-row__go" aria-hidden="true"><IconArrowRight size={22} stroke={2} /></span>
      </Link>
    </li>
  );
}

/** The home page: every season as a row of one table. */
function Home({ onPick }) {
  // From here, search covers every season at once.
  const { actions, sitemaps, meta } = useEverySeasonSearch();

  useStock(HOUSE_STOCK);

  useEffect(() => {
    document.title = 'Truce Archives';
  }, []);

  const totalChats = SEASONS.every((season) => sitemaps[season.id])
    ? SEASONS.reduce((sum, season) => sum + Object.values(sitemaps[season.id]).flat().length, 0)
    : null;

  return (
    <div className="page">
      <Masthead onSearch={openSearch} searchLabel="Search every season" />

      <main className="home">
        <header className="home__head">
          <h1>Truce Archives</h1>
          <p className="lead">
            Read the chats from every season of Truce.
            {totalChats !== null && ` ${formatNumber(totalChats)} chats so far, each with its own link to share.`}
          </p>
        </header>

        <ul className="seasons" aria-label="Seasons">
          {ALL_SEASONS.map((season) => (
            <SeasonRow
              key={season.id}
              season={season}
              sitemap={sitemaps[season.id]}
              meta={meta}
              onPick={onPick}
            />
          ))}
        </ul>

        <footer className="home__foot">Built and maintained by SJferno</footer>
      </main>

      <SearchPalette actions={actions} placeholder="Search every season: chats, categories or players" />
    </div>
  );
}

export default Home;
