import fs from 'fs';
import path from 'path';
import data from '../../public/patrons.json';
import {
  PATRON_CLASSES,
  STAT_KEYS,
  STAT_MAX,
  filterPatrons,
  fold,
  initials,
  nameTier,
  patronImageSmall,
  seasonKey,
  seasonSpan,
  sortPatrons,
  tagLabel,
} from './patrons';

test('initials follow the plate rule', () => {
  expect(initials('Abraham Lincoln')).toBe('AL');
  expect(initials('Amaterasu')).toBe('Am');
  expect(initials('Izanagi & Izanami')).toBe('II');
  expect(initials('Yong, Yo, Kyo')).toBe('YY');
  expect(initials('Joan of Arc')).toBe('JA');
  expect(initials('The Narrator')).toBe('Na');
  expect(initials('Jörmungandr')).toBe('Jö');
  expect(initials('GlaDOS')).toBe('Gl');
  expect(initials('Flying Spaghetti Monster')).toBe('FS');
});

test('season badge and span', () => {
  expect(seasonKey('Season 3')).toBe('S3');
  expect(seasonSpan(data.seasons)).toBe('Seasons 1 to 3');
  expect(seasonSpan([data.seasons[1]])).toBe('Season 2');
});

test('the file is already in A to Z order, with 33, 32 and 24 patrons per season', () => {
  expect(sortPatrons(data.patrons).map((patron) => patron.id)).toEqual(data.patrons.map((patron) => patron.id));
  const counts = {};
  data.patrons.forEach((patron) => { counts[patron.season] = (counts[patron.season] || 0) + 1; });
  expect(counts).toEqual({ 'season-1': 33, 'season-2': 32, 'season-3': 24 });
});

test('search ignores case and accents, matches name or origin, and combines with the season', () => {
  const names = (season, query) => filterPatrons(data.patrons, season, query).map((patron) => patron.name);
  expect(fold('Yemọja')).toBe('yemoja');
  expect(names('all', 'jormungandr')).toEqual(['Jörmungandr']);
  expect(names('all', 'HALO')).toEqual(['Master Chief']);
  expect(names('all', 'brazil')).toEqual(['Jaci', 'Lampião']);
  expect(names('season-1', 'norse')).toHaveLength(4);
  expect(names('season-3', 'norse')).toEqual([]);
  expect(names('all', '   ')).toHaveLength(89);
});

test('a portrait has a card-sized copy beside it', () => {
  expect(patronImageSmall('/images/patrons/aloy.webp')).toBe('/images/patrons/aloy-sm.webp');
  expect(patronImageSmall('/images/patrons/izanagi-and-izanami.webp')).toBe('/images/patrons/izanagi-and-izanami-sm.webp');
});

test('a tag reads as its value and mark, with its note and who it applies to in brackets', () => {
  expect(tagLabel({ kind: 'flag', value: 'Format-changing' })).toBe('Format-changing');
  expect(tagLabel({ kind: 'flag', value: 'Format-changing', mark: '*' })).toBe('Format-changing*');
  expect(tagLabel({ kind: 'flag', value: 'Usable outside realm', note: 'excluding FC' })).toBe('Usable outside realm (excluding FC)');
  expect(tagLabel({ kind: 'flag', value: 'Usable outside realm', note: 'excluding FC', as: 'Izanagi' }))
    .toBe('Usable outside realm (excluding FC) (as Izanagi)');
  expect(tagLabel({ kind: 'visibility', value: 'Private', as: 'Izanami' }, { withNote: false })).toBe('Private (as Izanami)');
  expect(tagLabel({ kind: 'visibility', value: 'Unique', note: 'Nullified votes appear as (null).' }, { withNote: false }))
    .toBe('Unique');
});

test("a name's size step comes from its longest word, so no word is split", () => {
  expect(nameTier('Hornet')).toBe(1);
  expect(nameTier('Krishna')).toBe(1);
  expect(nameTier('Izanagi & Izanami')).toBe(1);
  expect(nameTier('Yong, Yo, Kyo')).toBe(1);
  expect(nameTier("Chang'e")).toBe(1);
  expect(nameTier('Yemọja')).toBe(1);
  expect(nameTier('Yemọja'.normalize('NFD'))).toBe(1);
  expect(nameTier('Amaterasu')).toBe(2);
  expect(nameTier('Flying Spaghetti Monster')).toBe(2);
  expect(nameTier('Scaramouche')).toBe(3);
  expect(nameTier('Jörmungandr')).toBe(3);
  expect(nameTier('Scheherazade')).toBe(3);
  expect(nameTier('Nyarlathotep')).toBe(3);
  expect(nameTier('Huitzilopochtli')).toBe(4);
});

test('every patron has a class and six whole-number stats from 1 to 5', () => {
  data.patrons.forEach((patron) => {
    expect({ id: patron.id, class: PATRON_CLASSES.includes(patron.class) }).toEqual({ id: patron.id, class: true });
    expect({ id: patron.id, keys: Object.keys(patron.stats || {}).sort() }).toEqual({ id: patron.id, keys: [...STAT_KEYS].sort() });
    STAT_KEYS.forEach((key) => {
      const value = patron.stats[key];
      expect({ id: patron.id, key, ok: Number.isInteger(value) && value >= 1 && value <= STAT_MAX })
        .toEqual({ id: patron.id, key, ok: true });
    });
    if ('lore' in patron) expect(typeof patron.lore).toBe('string');
  });
});

test('a banned flag, where a patron has one, is true or false', () => {
  const banned = data.patrons.filter((patron) => 'banned' in patron);
  expect(banned.length).toBeGreaterThan(0);
  banned.forEach((patron) => {
    expect({ id: patron.id, type: typeof patron.banned }).toEqual({ id: patron.id, type: 'boolean' });
  });
});

test('every portrait the list names is on disk at both sizes', () => {
  const publicDir = path.join(__dirname, '../../public');
  const withImage = data.patrons.filter((patron) => patron.image);
  expect(withImage.length).toBeGreaterThan(80);
  withImage.forEach((patron) => {
    expect(patron.image).toBe(`/images/patrons/${patron.id}.webp`);
    expect(fs.existsSync(path.join(publicDir, patron.image))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, patronImageSmall(patron.image)))).toBe(true);
  });
});
