import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import ChatTable from './ChatTable';
import { EraRow } from './SeasonMap';
import { buildGroups, findFolder, folderLabel } from '../seasons';
import { formatDateRange, pluralize, summarize } from '../utils/chats';

/** One category: where it sits in its era, then a table of its chats. */
function ChannelView({ season, folder, files, sitemap, meta }) {
  const label = folderLabel(season, folder);
  const description = findFolder(season, folder).folder?.description;
  const group = useMemo(
    () => buildGroups(season, sitemap).find((item) => item.folders.some((entry) => entry.name === folder)),
    [season, sitemap, folder]
  );
  const sections = useMemo(() => [{ folder, files }], [folder, files]);
  const totals = useMemo(() => summarize(files, meta), [files, meta]);

  const facts = [pluralize(totals.chats, 'chat')];
  if (meta && totals.known) facts.push(pluralize(totals.messages, 'message'));
  if (meta && totals.start) facts.push(formatDateRange(totals.start, totals.end));

  return (
    <div className="category">
      <Link to={season.path} className="back-link">
        <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
        {season.name ? `${season.label}: ${season.name}` : season.label}
      </Link>

      {group && (
        <nav className="map map--strip" aria-label={`Other categories in ${group.label}`}>
          <EraRow season={season} group={group} sitemap={sitemap} currentFolder={folder} compact headingLevel={null} />
        </nav>
      )}

      <header className="category__head">
        <h1>{label}</h1>
        <p className="facts">{facts.join(' · ')}</p>
        {description && <p className="lead">{description}</p>}
      </header>

      <ChatTable season={season} sections={sections} meta={meta} label={`chats in ${label}`} />
    </div>
  );
}

export default ChannelView;
