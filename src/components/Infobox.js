import React from 'react';
import { publicUrl } from '../utils/chats';

/**
 * The fact box beside a season's table: its art, then one row per fact.
 * `rows` is a list of [label, value] pairs; rows without a value are left out.
 */
function Infobox({ season, rows, note, image }) {
  const facts = rows.filter(([, value]) => value !== null && value !== undefined && value !== '');

  return (
    <aside className="infobox" aria-label={`${season.label} at a glance`}>
      <h2 className="infobox__title">{season.label}</h2>
      {image && (
        <img
          className="infobox__art"
          src={publicUrl(image.src)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          decoding="async"
        />
      )}
      <dl className="infobox__facts">
        {facts.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      {note && <p className="infobox__note">{note}</p>}
    </aside>
  );
}

export default Infobox;
