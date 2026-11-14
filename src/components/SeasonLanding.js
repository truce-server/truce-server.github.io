import React, { useMemo } from 'react';
import ChatTable from './ChatTable';
import Infobox from './Infobox';
import { SeasonMap } from './SeasonMap';
import { buildGroups } from '../seasons';
import { formatDateRange, formatNumber, summarize } from '../utils/chats';
import { MOD_KEY } from '../utils/ui';

/** A season's page: the whole season as one table, its facts beside it, then every chat in a list. */
function SeasonLanding({ season, sitemap, meta }) {
  const groups = useMemo(() => buildGroups(season, sitemap), [season, sitemap]);

  const sections = useMemo(
    () => groups.flatMap((group) => group.folders.map((item) => ({ folder: item.name, files: sitemap[item.name] }))),
    [groups, sitemap]
  );

  const totals = useMemo(() => summarize(Object.values(sitemap).flat(), meta), [sitemap, meta]);
  const counted = Boolean(meta);

  // A season with only a few categories (Song of Life) has a short table, so its cells say more
  // and the list of chats moves up beside the fact box instead of waiting underneath it.
  const small = sections.length <= 4;

  const index = (
    <section className="season__index" aria-labelledby="all-chats">
      <h2 id="all-chats">All chats</h2>
      <ChatTable season={season} sections={sections} meta={meta} label={`chats in ${season.label}`} />
    </section>
  );

  return (
    <div className={`season${small ? ' season--small' : ''}`}>
      <div className="season__top">
        <div className="season__main">
          <h1>{season.title}</h1>
          <p className="lead">
            Every chat from {season.label}, in the order {small ? 'it' : 'the season'} ran. Each cell is a category,
            sized by how many chats it holds.{' '}
            <span className="only-wide">Pick one, or press {MOD_KEY} K to search every chat.</span>
            <span className="only-narrow">Pick one, or use search to find a chat.</span>
          </p>
          <SeasonMap season={season} groups={groups} sitemap={sitemap} meta={meta} roomy={small} />
          {small && index}
        </div>

        <Infobox
          season={season}
          image={season.art}
          rows={[
            ['Title', season.name],
            ['Active', counted && totals.start ? formatDateRange(totals.start, totals.end) : null],
            ['Categories', formatNumber(Object.keys(sitemap).length)],
            ['Chats', formatNumber(totals.chats)],
            ['Messages', counted ? formatNumber(totals.messages) : null],
          ]}
          note={groups.length > 1 ? 'Colours follow the eras. Rows run in date order, top to bottom.' : null}
        />
      </div>

      {!small && index}
    </div>
  );
}

export default SeasonLanding;
