import React from 'react';
import { Link } from 'react-router-dom';
import { IconBan } from '@tabler/icons-react';
import { publicUrl } from '../utils/chats';
import { initials, nameTier, patronImageSmall, patronPath, seasonKey, seasonTint } from '../utils/patrons';

/**
 * The rule under a Patrons title: a line, a small diamond, a line. Gold, or the patron's season colours on their
 * page (`className="patrons-rule--season"`).
 */
export function PatronsRule({ className }) {
  return (
    <div className={className ? `patrons-rule ${className}` : 'patrons-rule'} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

/**
 * What fills a patron's portrait well: their portrait from the Patron decks, cut to 4:5, or, for a patron
 * without one, two diamonds and their initials in the season's colour. `sizes` says how wide the well is
 * drawn, so the browser picks the card-sized copy or the large one. The colour comes from `tint`, or from
 * a `--tint` set further up.
 */
export function PatronEmblem({ name, tint, image, sizes = '(max-width: 48em) 50vw, 200px', eager = false }) {
  const style = tint ? { '--tint': tint } : undefined;

  if (image) {
    return (
      <img
        className="patron-emblem patron-emblem--image"
        src={publicUrl(patronImageSmall(image))}
        srcSet={`${publicUrl(patronImageSmall(image))} 336w, ${publicUrl(image)} 720w`}
        sizes={sizes}
        width="336"
        height="420"
        alt=""
        style={style}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <span className="patron-emblem" style={style}>
      <span className="patron-emblem__diamond" />
      <span className="patron-emblem__diamond patron-emblem__diamond--inner" />
      <span className="patron-emblem__initials">{initials(name)}</span>
    </span>
  );
}

/**
 * One patron in the grid: the portrait well with its season badge (and a Banned tag in the other corner for a
 * banned patron), then the name and the region or franchise. The whole card is the link. It opens the patron's
 * page over the grid, keeping the grid's filters (`search`) in the address; `overGrid` tells the page the grid
 * is one step back in history. The badges say what they mean in words, so neither is told by colour alone.
 * Long names get smaller rather than breaking a word.
 */
function PatronCard({ patron, season, search = '' }) {
  const label = [
    `${patron.name}, ${season.label} patron`,
    patron.banned && 'banned',
    patron.origin && `${season.originLabel}: ${patron.origin}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Link
      to={{ pathname: patronPath(patron.id), search }}
      state={{ overGrid: true }}
      className="patron-card"
      style={{ '--tint': seasonTint(patron.season) }}
      aria-label={label}
      aria-haspopup="dialog"
    >
      <span className="patron-card__well" aria-hidden="true">
        <PatronEmblem name={patron.name} image={patron.image} />
        <span className="patron-card__badge">
          <i />
          {seasonKey(season.label)}
        </span>
        {patron.banned && (
          <span className="patron-card__badge patron-card__badge--banned">
            <IconBan size={11} stroke={2.5} />
            Banned
          </span>
        )}
      </span>
      <span className="patron-card__text">
        <span className={`patron-card__name patron-card__name--t${nameTier(patron.name)}`}>{patron.name}</span>
        {patron.origin && <span className="patron-card__origin">{patron.origin}</span>}
      </span>
    </Link>
  );
}

/** Stands in for a card while the list loads: the empty well, then two bars where the name and origin go. */
export function PatronCardPlaceholder() {
  return (
    <span className="patron-card patron-card--placeholder">
      <span className="patron-card__well" />
      <span className="patron-card__text">
        <span className="patron-card__bar" />
        <span className="patron-card__bar patron-card__bar--short" />
      </span>
    </span>
  );
}

export default PatronCard;
