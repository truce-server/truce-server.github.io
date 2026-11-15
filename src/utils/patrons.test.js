import fs from 'fs';
import path from 'path';
import data from '../../public/patrons.json';
import { filterPatrons, fold, initials, patronImageSmall, seasonKey, seasonSpan, sortPatrons, tagLabel } from './patrons';

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

test('a tag reads as its value, with its note in brackets', () => {
  expect(tagLabel({ kind: 'flag', value: 'Format-changing' })).toBe('Format-changing');
  expect(tagLabel({ kind: 'flag', value: 'Usable outside realm', note: 'excluding FC' })).toBe('Usable outside realm (excluding FC)');
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
