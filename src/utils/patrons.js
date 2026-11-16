// Helpers for the patron list in public/patrons.json: every patron from the three Patron sheets,
// copied from the Truce Archives design system (assets/Data/patrons.json). The file holds `seasons`
// ({ id, label, name, originLabel, rules }) and `patrons` ({ id, name, season, origin, gender, image, abilities }).
//
// Three more fields feed the patron's page, and each is optional:
//   class  "offence", "defence" or "support", shown as an icon and a label
//   stats  { offence, defence, difficulty, survivability, utility, support }, whole numbers from 1 to 5
//   lore   two to four sentences of plain text; without it the page says the lore is coming soon
// The class and stats panel only shows when a patron has both.

import { ALL_SEASONS } from '../seasons';

export const PATRONS_URL = '/patrons.json';
export const PATRONS_PATH = '/patrons';

export const PATRON_CLASSES = ['offence', 'defence', 'support'];

/** The stats in the order the patron page lists them. */
export const STAT_KEYS = ['offence', 'defence', 'difficulty', 'survivability', 'utility', 'support'];

/** The top of every stat's scale. */
export const STAT_MAX = 5;

/** A patron's address: their page, over the grid. Ids are already URL slugs ("izanagi-and-izanami"). */
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

/**
 * An ability tag as the sheet wrote it: the value and any mark, then its note and who it applies to, in brackets.
 * "Usable outside realm (excluding FC)", "Private (as Izanami)", "Format-changing*". A visibility tag's note is
 * shown under the tags instead, so it's left out with `withNote: false`.
 */
export const tagLabel = (tag, { withNote = true } = {}) => [
  `${tag.value}${tag.mark || ''}`,
  withNote && tag.note && `(${tag.note})`,
  tag.as && `(as ${tag.as})`,
].filter(Boolean).join(' ');

/**
 * The number of letters in the longest word of a name: "Izanagi & Izanami" → 7, "Jörmungandr" → 11, "Chang'e" → 6.
 * A letter is a character with an upper and a lower case, so apostrophes and combining accents don't count.
 * (A \p{L} regex would do the same, but compiles to several kilobytes for older browsers.)
 */
const isLetter = (char) => char.toLowerCase() !== char.toUpperCase();
const longestWord = (name) => Math.max(
  0,
  ...String(name || '').split(/[\s,&]+/).map((word) => Array.from(word).filter(isLetter).length)
);

/**
 * How big a patron's name can be set without breaking a word: 1 for names whose longest word has 7 letters
 * or fewer, 2 for 8 to 10, 3 for 11 or 12, and 4 for 13 or more ("Huitzilopochtli").
 */
export function nameTier(name) {
  const letters = longestWord(name);
  if (letters <= 7) return 1;
  if (letters <= 10) return 2;
  if (letters <= 12) return 3;
  return 4;
}

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
