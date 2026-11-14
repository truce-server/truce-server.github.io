import React from 'react';
import { Link } from 'react-router-dom';
import { folderLabel } from '../seasons';
import { archiveUrl, formatDateRange, pluralize, summarize } from '../utils/chats';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * One era of the season table: a header cell, then a cell per category.
 * Each cell grows with the number of chats it holds, but never shrinks below its own label.
 */
export function EraRow({ season, group, sitemap, meta, currentFolder, compact = false, roomy = false, headingLevel = 2 }) {
  // The compact strip above a category's own title is a label, not a heading.
  const Heading = headingLevel ? `h${headingLevel}` : 'div';
  const headingId = `era-${season.id}-${slug(group.label)}`;

  return (
    <section
      className={`map__era${compact ? ' map__era--compact' : ''}`}
      style={{ '--c': group.color }}
      aria-labelledby={headingId}
    >
      <Heading className="map__head" id={headingId}>
        <span>{group.label}</span>
        {!compact && group.description && <small>{group.description}</small>}
      </Heading>
      <ul className="map__cells">
        {group.folders.map((item) => {
          const count = sitemap[item.name].length;
          const url = archiveUrl(season.path, item.name);
          const label = folderLabel(season, item.name);

          // With only a few categories there's room to say what each one holds.
          if (roomy) {
            const totals = summarize(sitemap[item.name], meta);
            const facts = [pluralize(count, 'chat')];
            if (meta && totals.known) facts.push(pluralize(totals.messages, 'message'));
            return (
              <li key={item.name} style={{ '--n': count }}>
                <Link to={url} className="map__cell map__cell--roomy">
                  <strong>{label}</strong>
                  {item.description && <span className="map__about">{item.description}</span>}
                  <span>
                    {facts.join(' · ')}
                    {meta && totals.start && <><br />{formatDateRange(totals.start, totals.end)}</>}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.name} style={{ '--n': count }}>
              <Link
                to={url}
                className="map__cell"
                aria-current={item.name === currentFolder ? 'page' : undefined}
                title={item.description || undefined}
              >
                {label}
                <span>{pluralize(count, 'chat')}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The whole season as one table: an era per row, in the order the season ran. */
export function SeasonMap({ season, groups, sitemap, meta, roomy = false }) {
  return (
    <nav className={`map${roomy ? ' map--roomy' : ''}`} aria-label={`Categories in ${season.label}`}>
      {groups.map((group) => (
        <EraRow key={group.label} season={season} group={group} sitemap={sitemap} meta={meta} roomy={roomy} />
      ))}
    </nav>
  );
}

/** A small, unlabelled copy of the season table, used as a preview on the home page. */
export function MiniMap({ groups, sitemap }) {
  return (
    <div className="minimap" aria-hidden="true">
      {groups.map((group) => (
        <div key={group.label} className="minimap__row" style={{ '--c': group.color }}>
          {group.folders.map((item) => (
            <span key={item.name} style={{ '--n': sitemap[item.name].length }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Stands in for the table while the list of chats loads. */
export function MapPlaceholder({ rows = 6, label = 'Loading chats…' }) {
  const widths = [[5, 9, 3], [8, 4], [3, 6, 4, 2], [10, 5], [4, 4, 7], [6, 3], [2, 8, 5], [7]];
  return (
    <div className="map map--placeholder" role="status">
      <span className="visually-hidden">{label}</span>
      {widths.slice(0, rows).map((cells, row) => (
        <div key={row} className="map__era" aria-hidden="true">
          <div className="map__head" />
          <div className="map__cells">
            {cells.map((n, index) => (
              <span key={index} className="map__cell" style={{ '--n': n }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
