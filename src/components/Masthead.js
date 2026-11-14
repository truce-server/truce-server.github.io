import React from 'react';
import { Link } from 'react-router-dom';
import { IconListTree, IconSearch } from '@tabler/icons-react';
import { ALL_SEASONS } from '../seasons';
import { publicUrl } from '../utils/chats';
import { MOD_KEY } from '../utils/ui';

/**
 * The bar across the top of every page: the way home, a tab per season, and search.
 * `current` is the id of the season being shown (none on the home page).
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

      {(onContents || onSearch) && (
        <div className="masthead__tools">
          {onContents && (
            <button type="button" className="btn masthead__contents" onClick={onContents}>
              <IconListTree size={16} stroke={2} aria-hidden="true" />
              Contents
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
