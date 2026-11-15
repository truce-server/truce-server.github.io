import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IconSearch, IconX } from '@tabler/icons-react';
import PatronsBar from './PatronsBar';
import PatronCard, { PatronCardPlaceholder, PatronsRule } from './PatronCard';
import PatronDialog from './PatronDialog';
import { PATRONS_STOCK } from '../seasons';
import { useJson } from '../hooks/useJson';
import { useStock } from '../hooks/useStock';
import { formatNumber, pluralize, publicUrl } from '../utils/chats';
import { PATRONS_PATH, PATRONS_URL, filterPatrons, seasonSpan, seasonTint, sortPatrons } from '../utils/patrons';
import { revealInRow } from '../utils/ui';

const PLACEHOLDER_CARDS = 14;
// Keeps a line's height while the numbers it shows are still loading.
const BLANK = ' ';

/** The dashed box that says nothing matched, or that the list didn't load. */
function PatronsNotice({ role, children }) {
  return <div className="patrons-notice" role={role}>{children}</div>;
}

const LOAD_ERROR = "The patrons didn't load. Reload the page to try again.";

function PatronSearch({ value, onChange, inputRef }) {
  const labelId = useId();

  return (
    <label className="patrons-search">
      <IconSearch size={16} stroke={2} aria-hidden="true" />
      <span id={labelId} className="visually-hidden">Search patrons</span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="Search by name, region or franchise"
        aria-labelledby={labelId}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
      />
      {value && (
        <button
          type="button"
          className="patrons-search__clear"
          aria-label="Clear search"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
        >
          <IconX size={14} stroke={2} aria-hidden="true" />
        </button>
      )}
    </label>
  );
}

/** All, then each season that has patrons, with its count. `options` is empty until the list loads. */
function SeasonTabs({ options, value, onChange }) {
  const rowRef = useRef(null);

  // On a phone the tabs scroll sideways, so keep the chosen one in view (a link can open on Season 3).
  useLayoutEffect(() => {
    const row = rowRef.current;
    revealInRow(row, row?.querySelector('[aria-pressed="true"]'));
  }, [value, options.length]);

  if (!options.length) return <div ref={rowRef} className="patrons-tabs" aria-hidden="true" />;

  return (
    <div ref={rowRef} className="patrons-tabs" role="group" aria-label="Show patrons from">
      {options.map((option) => {
        const pressed = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className="patrons-tab"
            aria-pressed={pressed}
            aria-label={`${option.label}, ${pluralize(option.count, 'patron')}`}
            onClick={() => !pressed && onChange(option.id)}
            style={option.tint ? { '--tint': option.tint } : undefined}
          >
            {option.tint && <i className="patrons-tab__swatch" aria-hidden="true" />}
            <span>{option.label}</span>
            <span className="patrons-tab__count">{formatNumber(option.count)}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Every patron a Herald has played, A to Z, in one grid. The season and the search live in the address
 * (?season=season-3&q=halo), so a filtered list can be shared and survives opening a patron.
 * /patrons/:id is the same page with that patron's dialog open over the grid.
 */
function PatronsPage() {
  const [params, setParams] = useSearchParams();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, error } = useJson(publicUrl(PATRONS_URL));
  const searchRef = useRef(null);

  useStock(PATRONS_STOCK);

  const seasonsById = useMemo(() => Object.fromEntries((data?.seasons || []).map((season) => [season.id, season])), [data]);

  const patrons = useMemo(
    () => (data ? sortPatrons(data.patrons.filter((patron) => seasonsById[patron.season])) : []),
    [data, seasonsById]
  );

  // Only seasons with patrons get a tab (Song of Life has none).
  const seasons = useMemo(() => {
    const counts = {};
    patrons.forEach((patron) => {
      counts[patron.season] = (counts[patron.season] || 0) + 1;
    });
    return (data?.seasons || [])
      .filter((season) => counts[season.id])
      .map((season) => ({ ...season, count: counts[season.id], tint: seasonTint(season.id) }));
  }, [data, patrons]);

  const query = params.get('q') || '';
  const picked = seasons.find((season) => season.id === params.get('season')) || null;
  const season = picked ? picked.id : 'all';
  const shown = useMemo(() => filterPatrons(patrons, season, query), [patrons, season, query]);

  // Filters replace the address rather than adding to the history, so Back leaves the page.
  const updateParams = (changes) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      return next;
    }, { replace: true });
  };

  const showEveryPatron = () => {
    updateParams({ q: null, season: null });
    searchRef.current?.focus();
  };

  const options = data ? [{ id: 'all', label: 'All', count: patrons.length }, ...seasons] : [];

  // The patron in the address, if any. The last one shown stays in the dialog while it fades out.
  const openPatron = (id && patrons.find((item) => item.id === id)) || null;
  const [lastPatron, setLastPatron] = useState(openPatron);
  if (openPatron && openPatron !== lastPatron) setLastPatron(openPatron);
  const dialogPatron = openPatron || lastPatron;

  useEffect(() => {
    document.title = [openPatron?.name, 'Patrons', 'Truce Archives'].filter(Boolean).join(' · ');
  }, [openPatron]);

  // An address for a patron who isn't in the list falls back to the grid.
  useEffect(() => {
    if (id && data && !openPatron) navigate({ pathname: PATRONS_PATH, search: location.search }, { replace: true });
  }, [id, data, openPatron, navigate, location.search]);

  // Opened from a card, the grid is one step back, so closing goes back (and Forward reopens it).
  // Opened from a shared link, there's nothing behind it, so closing swaps the address for the grid's.
  const closePatron = () => {
    if (location.state?.overGrid) navigate(-1);
    else navigate({ pathname: PATRONS_PATH, search: location.search }, { replace: true });
  };

  let status = 'Loading patrons';
  if (error) status = '';
  else if (data) {
    status = shown.length === patrons.length
      ? `Showing all ${pluralize(patrons.length, 'patron')}`
      : `Showing ${formatNumber(shown.length)} of ${pluralize(patrons.length, 'patron')}`;
  }

  let body;
  if (error) {
    body = (
      <PatronsNotice role="alert">
        <p className="patrons-notice__line">{LOAD_ERROR}</p>
      </PatronsNotice>
    );
  } else if (data && shown.length === 0) {
    body = (
      <PatronsNotice>
        <p className="patrons-notice__line">
          No patrons match “{query.trim()}”{picked ? ` in ${picked.label}` : ''}.
        </p>
        <button type="button" className="patrons-button" onClick={showEveryPatron}>Show every patron</button>
      </PatronsNotice>
    );
  } else {
    body = (
      <ul className="patrons-grid" aria-label="Patrons" aria-busy={data ? undefined : 'true'}>
        {data
          ? shown.map((patron) => (
            <li key={patron.id}>
              <PatronCard patron={patron} season={seasonsById[patron.season]} search={location.search} />
            </li>
          ))
          : Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
            <li key={index} aria-hidden="true">
              <PatronCardPlaceholder />
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div className="page patrons-page">
      <PatronsBar />

      <main className="patrons-main">
        <header className="patrons-hero">
          <p className="patrons-hero__eyebrow">{data ? `Truce · ${seasonSpan(seasons)}` : BLANK}</p>
          <h1 className="patrons-hero__title">Patrons</h1>
          <PatronsRule />
          <p className="patrons-hero__lead">Every patron a Herald has played, A to Z.</p>
          <p className="patrons-hero__facts">
            {data ? `${pluralize(patrons.length, 'patron')} · ${pluralize(seasons.length, 'season')}` : BLANK}
          </p>
        </header>

        <div className="patrons-tools">
          <PatronSearch value={query} onChange={(text) => updateParams({ q: text })} inputRef={searchRef} />
          <SeasonTabs
            options={options}
            value={season}
            onChange={(id) => updateParams({ season: id === 'all' ? null : id })}
          />
          <p className="patrons-status" role="status">{status}</p>
        </div>

        {body}
      </main>

      <PatronDialog
        patron={dialogPatron}
        season={dialogPatron ? seasonsById[dialogPatron.season] : null}
        opened={Boolean(openPatron)}
        onClose={closePatron}
      />
    </div>
  );
}

export default PatronsPage;
