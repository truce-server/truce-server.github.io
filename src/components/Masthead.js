import React from 'react';
import { Link } from 'react-router-dom';
import { IconListTree, IconSearch } from '@tabler/icons-react';
import { ALL_SEASONS } from '../seasons';
import { prefetchJson } from '../hooks/useJson';
import { publicUrl } from '../utils/chats';
import { PATRONS_PATH, PATRONS_URL } from '../utils/patrons';
import { MOD_KEY } from '../utils/ui';

const prefetchPatrons = () => prefetchJson(publicUrl(PATRONS_URL));

/**
 * The bar across the top of every page: the way home, a tab per season, the Patrons tab, and search.
 * `current` is the id of the season being shown, or 'patrons' (none on the home page).
 */
function Masthead({ current, onSearch, searchLabel = 'Search chats, categories or players', onContents }) {
  return (
    <header className="masthead">
      <Link to="/" className="masthead__brand" aria-label="Truce Archives, all seasons">
        <img src={publicUrl('/images/logo.webp')} alt="" width="30" height="30" />
        <span>Truce Archives</span>
      </Link>

      <nav className="masthead__tabs" aria-label="Seasons">
        {ALL_SEASONS.map((season) => (
          <Link
            key={season.id}
            to={season.path}
            aria-current={season.id === current ? 'page' : undefined}
            title={season.name ? `${season.label}: ${season.name}` : season.label}
          >
            {season.label}
          </Link>
        ))}
      </nav>

      {/* A tab group of its own, so Patrons never reads as a fifth season. */}
      <nav className="masthead__tabs" aria-label="Patrons">
        <Link
          to={PATRONS_PATH}
          aria-current={current === 'patrons' ? 'page' : undefined}
          onPointerEnter={prefetchPatrons}
          onFocus={prefetchPatrons}
        >
          Patrons
        </Link>
      </nav>

      {(onContents || onSearch) && (
        <div className="masthead__tools">
          {onContents && (
            <button type="button" className="btn masthead__contents" onClick={onContents}>
              <IconListTree size={16} stroke={2} aria-hidden="true" />
              <span className="masthead__contents-label">Contents</span>
            </button>
          )}
          {onSearch && (
            <button type="button" className="masthead__search" onClick={onSearch} aria-label={searchLabel}>
              <IconSearch size={16} stroke={2} aria-hidden="true" />
              <span>{searchLabel}</span>
              <kbd>{MOD_KEY} K</kbd>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Masthead;
