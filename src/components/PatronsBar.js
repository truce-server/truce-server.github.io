import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ALL_SEASONS } from '../seasons';
import { publicUrl } from '../utils/chats';
import { PATRONS_PATH } from '../utils/patrons';
import { revealInRow } from '../utils/ui';

/**
 * The bar across the top of the Patrons pages, printed in night and gold: the way home,
 * then every season and Patrons, which is always the current page here.
 */
function PatronsBar() {
  const navRef = useRef(null);

  // On a phone the links scroll sideways and Patrons comes last, so start with it in view.
  useLayoutEffect(() => {
    const nav = navRef.current;
    revealInRow(nav, nav?.querySelector('[aria-current="page"]'));
  }, []);

  return (
    <header className="patrons-bar">
      <Link to="/" className="patrons-bar__brand" aria-label="Truce Archives, all seasons">
        <img src={publicUrl('/images/logo.webp')} alt="" width="30" height="30" />
        <span>Truce Archives</span>
      </Link>

      <nav ref={navRef} className="patrons-bar__nav" aria-label="Archive">
        {ALL_SEASONS.map((season) => (
          <Link key={season.id} to={season.path} title={season.name ? `${season.label}: ${season.name}` : season.label}>
            {season.label}
          </Link>
        ))}
        <Link to={PATRONS_PATH} aria-current="page">Patrons</Link>
      </nav>
    </header>
  );
}

export default PatronsBar;
