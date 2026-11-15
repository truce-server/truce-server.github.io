// Helpers for the patron list in public/patrons.json: every patron from the three Patron sheets,
// copied from the Truce Archives design system (assets/Data/patrons.json). The file holds `seasons`
// ({ id, label, name, originLabel, rules }) and `patrons` ({ id, name, season, origin, gender, abilities }).

import { ALL_SEASONS } from '../seasons';

export const PATRONS_URL = '/patrons.json';
export const PATRONS_PATH = '/patrons';

/** A patron's address: the grid with that patron's dialog open. Ids are already URL slugs ("izanagi-and-izanami"). */
export const patronPath = (id) => `${PATRONS_PATH}/${id}`;

/** Lowercase with accents taken off, so "jormungandr" finds "Jörmungandr". */
export const fold = (text) => String(text || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

const sortKey = (name) => fold(name).replace(/^the\s+/, '');

/** A to Z by name, ignoring case, accents and a leading "The" ("The Narrator" files under N). */
export const sortPatrons = (patrons) => [...patrons].sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name), 'en'));

const SKIPPED_WORDS = new Set(['the', 'of', 'and']);

/**
 * The monogram that stands in for a portrait: the first letters of the first two words ("Abraham Lincoln" → "AL"),
 * or a capital and a small letter for a one-word name ("Amaterasu" → "Am"). "The", "of" and "and" don't count.
 */
export function initials(name) {
  const words = String(name || '').split(/[\s,&]+/).filter((word) => word && !SKIPPED_WORDS.has(word.toLowerCase()));
  if (words.length > 1) return (Array.from(words[0])[0] + Array.from(words[1])[0]).toUpperCase();
  const [first = '', second = ''] = Array.from(words[0] || '');
  return first.toUpperCase() + second.toLowerCase();
}

/** A portrait's card-sized copy, cut alongside it: "/images/patrons/aloy.webp" → "/images/patrons/aloy-sm.webp". */
export const patronImageSmall = (path) => String(path).replace(/(\.[a-z0-9]+)$/i, '-sm$1');

/** An ability tag as it reads in the dialog: "Usable outside realm (excluding FC)". */
export const tagLabel = (tag) => (tag.note ? `${tag.value} (${tag.note})` : tag.value);

/** "Season 3" → "S3", for the badge on each card. */
export const seasonKey = (label) => `S${String(label).replace(/\D/g, '')}`;

/** A season's colour, from src/seasons.js. */
export const seasonTint = (id) => ALL_SEASONS.find((season) => season.id === id)?.accent;

/** "Seasons 1 to 3" for a list of seasons in order, or "Season 2" for just one. */
export function seasonSpan(seasons) {
  if (!seasons.length) return '';
  const first = seasons[0].label.replace(/\D/g, '');
  const last = seasons[seasons.length - 1].label.replace(/\D/g, '');
  return seasons.length > 1 ? `Seasons ${first} to ${last}` : seasons[0].label;
}

/**
 * The patrons in `season` ('all' for every season) whose name or origin contains `query`,
 * matched without case or accents. The order of `patrons` is kept.
 */
export function filterPatrons(patrons, season, query) {
  const needle = fold(query).trim();
  return patrons.filter((patron) => (season === 'all' || patron.season === season)
    && (!needle || fold(patron.name).includes(needle) || fold(patron.origin).includes(needle)));
}
