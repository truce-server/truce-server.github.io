import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import Masthead from './Masthead';
import Infobox from './Infobox';
import SearchPalette, { openSearch, useEverySeasonSearch } from './SearchPalette';
import { SEASON_THREE } from '../seasons';
import { useStock } from '../hooks/useStock';

// Season 3's page until its chats are added: the same layout as any season, with an empty table.
function Season3Teaser() {
  const season = SEASON_THREE;
  // Nothing of Season 3 to search yet, so search here covers the seasons that are in.
  const { actions } = useEverySeasonSearch();
  useStock(season.stock);

  useEffect(() => {
    document.title = `${season.label} · Truce Archives`;
  }, [season]);

  return (
    <div className="page">
      <Masthead current={season.id} onSearch={openSearch} searchLabel="Search every season" />

      <div className="page__body">
        <main className="page__main">
          <div className="season season--upcoming">
            <div className="season__top">
              <div className="season__main">
                <h1>{season.title}</h1>
                <p className="lead">
                  Season 3 isn't in the archive yet. Its chats will show up here after the season ends.
                </p>

                <div className="map map--upcoming" aria-hidden="true">
                  {[4, 3, 2].map((cells, row) => (
                    <div key={row} className="map__era">
                      <div className="map__head" />
                      <div className="map__cells">
                        {Array.from({ length: cells }, (_, index) => (
                          <span key={index} className="map__cell" style={{ '--n': (index + row) % 3 + 1 }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/" className="btn btn--solid season__back">
                  <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
                  Back to all seasons
                </Link>
              </div>

              <Infobox
                season={season}
                image={season.art}
                rows={[
                  ['Title', season.name],
                  ['Status', 'Not in the archive yet'],
                ]}
              />
            </div>
          </div>
        </main>
      </div>

      <SearchPalette actions={actions} placeholder="Search every season: chats, categories or players" />
    </div>
  );
}

export default Season3Teaser;
