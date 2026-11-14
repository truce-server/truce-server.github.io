import React, { useState } from 'react';
import IntroOverlay from './IntroOverlay';
import { buildGroups } from '../seasons';
import { peekJson } from '../hooks/useJson';
import { stockVars } from '../hooks/useStock';
import { publicUrl } from '../utils/chats';

// Seasons without a table of their own (Season 3, for now) still get bands, in their one colour.
const PLACEHOLDER_BANDS = [[2, 3, 1], [3, 2], [1, 2, 2, 1], [4, 1], [2, 2]];

function bandsFor(season) {
  if (!season.groups) return PLACEHOLDER_BANDS.map((cells) => ({ color: season.stock.accent, cells }));

  // The home page has usually loaded the season's chat list already, so the bands can be the real
  // table: same rows, each cell as wide as its share of the chats. Without it, cells are equal.
  const sitemap = peekJson(publicUrl(season.sitemapUrl));
  if (sitemap) {
    return buildGroups(season, sitemap).map((group) => ({
      color: group.color,
      cells: group.folders.map((item) => sitemap[item.name].length),
    }));
  }
  return season.groups.map((group) => ({ color: group.color, cells: group.folders.map(() => 1) }));
}

/**
 * The season's table wipes across the screen row by row in its own colours, then its title lands.
 * Plays once when a season is picked from the home page. All timing lives in global.css.
 */
function SeasonIntro({ season, onDone }) {
  // Worked out once, so the bands don't change shape if the list arrives mid-intro.
  const [bands] = useState(() => bandsFor(season));

  return (
    <IntroOverlay className="intro--season" duration={1250} onDone={onDone} style={stockVars(season.stock)}>
      <div className="intro__bands" aria-hidden="true">
        {bands.map((band, index) => (
          <div key={index} className="intro__band" style={{ '--c': band.color, '--i': index }}>
            {band.cells.map((size, cell) => <span key={cell} style={{ '--n': size }} />)}
          </div>
        ))}
      </div>
      <div className="intro__plate">
        <p className="intro__title">{season.title}</p>
        {season.name && <p className="intro__label">{season.label}</p>}
      </div>
    </IntroOverlay>
  );
}

export default SeasonIntro;
