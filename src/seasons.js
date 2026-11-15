// Everything that differs between seasons lives here: names, colors, where the chats are,
// and how the categories are grouped and described on the season page and in the contents list.
//
// Each season is "printed" on its own stock: `paper` is the page, `ink` is text and rules, `soft` is
// secondary text, `hair` and `wash` are hairlines and table shading, `accent` is the season colour,
// `field` is the fill of inputs and tables, `visited` marks chats you've already opened.
// Groups are listed in the order the season ran, and each group's `color` fills its cells in the table.

/** The stock used outside any season (the home page). */
export const HOUSE_STOCK = {
  paper: '#ffffff', ink: '#17181c', soft: '#55534d', hair: '#cccccd', wash: '#f1f1f1',
  accent: '#d4af37', field: '#ffffff', visited: '#6a4f8f',
};

/**
 * The stock the Patrons pages are printed on: night, with cream ink. The gold trim and the rest of their
 * palette are in styles/patrons.css. `accent` is the dim gold so selected text stays legible on it.
 */
export const PATRONS_STOCK = {
  paper: '#070b12', ink: '#ece4d2', soft: '#9a9586', hair: '#2c384b', wash: '#0b121d',
  accent: '#6f5a32', field: '#070b12', visited: '#e8cf8f',
};

const TRIBE_FULL = 'Tribe hall, group chats and 1-on-1s.';
const TRIBE_CHANNELS_FULL = 'Tribe channels, group chats and 1-on-1s.';

const SEASON_ONE = {
  id: 'season-1',
  path: '/season-1',
  label: 'Season 1',
  name: 'The Apotheion',
  title: 'Truce: The Apotheion',
  accent: '#d4af37',
  stock: {
    paper: '#f4f1ea', ink: '#17181c', soft: '#5d5a52', hair: '#c3c1bd', wash: '#e7e4de',
    accent: '#d4af37', field: '#fffdf8', visited: '#6a4f8f',
  },
  art: {
    src: '/images/season-1.webp', width: 960, height: 537,
    alt: 'The Apotheion title art: a figure in a gown lifting a star beneath a full moon',
  },
  sitemapUrl: '/sitemap.json',
  resolveChat: (folder, file) => `SeasonOneChat/${folder}/${file}`,
  // Old links used "Main" for this category.
  folderAliases: {
    Main: 'The Apotheion',
    'Varanitilan 1on1s': 'Varanitlan 1-on-1s',
    'Varantilan Alliances': 'Varanitlan Alliances',
  },
  groups: [
    {
      label: 'The Apotheion',
      color: '#e2c56a',
      description: "Announcement channels and every player's temple.",
      folders: [
        { name: 'The Apotheion', description: 'Chronicles and proclamations.' },
        { name: 'Temples', description: "Each player's temple, plus the finale temples." },
      ],
    },
    {
      label: 'Greek Era',
      color: '#c0a0e0',
      description: 'Tribes Aether, Khaos, Pontus and Erebus.',
      folders: [
        { name: 'Aether', description: TRIBE_FULL },
        { name: 'Khaos', description: TRIBE_FULL },
        { name: 'Pontus', description: TRIBE_FULL },
        { name: 'Erebus', description: 'Tribe hall, group chats and a 1-on-1.' },
      ],
    },
    {
      label: 'Egyptian Era',
      color: '#e8b840',
      description: 'Tribes Aaru, Akhet and Nun, plus group chats across tribes.',
      folders: [
        { name: 'Aaru', description: TRIBE_FULL },
        { name: 'Akhet', description: 'Tribe hall and a group chat.' },
        { name: 'Nun', description: 'Tribe hall, group chats and a 1-on-1.' },
        { name: 'Across Realms - Egypt', description: 'Group chats between players from different tribes.' },
      ],
    },
    {
      label: 'Norse Era',
      color: '#80a8d8',
      description: 'Tribes Bifröst, Midgard and Asgard.',
      folders: [
        { name: 'Bifrost', label: 'Bifröst', description: 'Tribe hall and 1-on-1s.' },
        { name: 'Midgard', description: 'Tribe hall, a group chat and 1-on-1s.' },
        { name: 'Asgard', description: 'Tribe hall and 1-on-1s.' },
      ],
    },
    {
      label: 'Chinese Era',
      color: '#e88060',
      description: "Tribes Lingshan and Chang'an.",
      folders: [
        { name: 'Lingshan', description: 'Tribe hall and 1-on-1s.' },
        { name: 'Chaangan', label: "Chang'an", description: TRIBE_FULL },
      ],
    },
    {
      label: 'Varanitlan Era',
      color: '#a0c8a0',
      description: 'The late game: 1-on-1s, alliance chats and Valhalla.',
      folders: [
        { name: 'Varanitlan 1-on-1s', description: '1-on-1 chats and the Varanitlan hall.' },
        { name: 'Varanitlan Alliances', description: 'Alliance group chats.' },
        { name: 'Valhalla', description: '1-on-1 chats from Helheim.' },
      ],
    },
    {
      label: 'Finale',
      color: '#f0c060',
      description: 'Jury questioning and the final episode.',
      folders: [
        { name: 'Finale', description: "Jury questioning, the finalists' quarters and the grand hall." },
      ],
    },
    {
      label: 'General',
      color: '#b9bfc9',
      description: 'Eliminations, challenges and server-wide channels.',
      folders: [
        { name: 'Eliminations', description: 'One channel per elimination.' },
        { name: 'Challenges', description: 'Challenge channels from every tribe.' },
        { name: 'General', description: 'Server-wide channels like Limbo, Olympus and Ponderosa.' },
      ],
    },
  ],
};

const SEASON_TWO = {
  id: 'season-2',
  path: '/season-2',
  label: 'Season 2',
  name: 'Rite of Apothea',
  title: 'Truce: Rite of Apothea',
  accent: '#a8d4f0',
  stock: {
    paper: '#e8f4fd', ink: '#0d3b6e', soft: '#2a6a9e', hair: '#b8cbdd', wash: '#dbe9f4',
    accent: '#a8d4f0', field: '#f7fbff', visited: '#6b4aa0',
  },
  art: {
    src: '/images/season-2.webp', width: 960, height: 485,
    alt: 'Rite of Apothea title art: a small figure before a pale blue forest under a falling star',
  },
  sitemapUrl: '/sitemap-season2.json',
  resolveChat: (folder, file) => `SeasonTwoChat/${folder}/${file}`,
  // Old links used the export's folder names (emoji, "Archives", separate 1-on-1s and finale folders).
  folderAliases: {
    'Ayodhya Archives 🪷': 'Ayodhya',
    'Ayodhya 1-on-1s 🪷': 'Ayodhya',
    'Ayodhya 1-on-1s': 'Ayodhya',
    'Haridwar Archives 🦢': 'Haridwar',
    'Haridwar 1-on-1s 🦢': 'Haridwar',
    'Haridwar 1-on-1s': 'Haridwar',
    'Kashi Archives 🦚': 'Kashi',
    'Kashi 1-on-1s 🦚': 'Kashi',
    'Kashi 1-on-1s': 'Kashi',
    'Tirupati  Archives 🪔': 'Tirupati',
    'Tirupati 1-on-1s 🪔': 'Tirupati',
    'Tirupati 1-on-1s': 'Tirupati',
    'Mount Fuji Archives 🌸': 'Mount Fuji',
    'Mount Fuji 1-on-1s 🌸': 'Mount Fuji',
    'Mount Fuji 1-on-1s': 'Mount Fuji',
    'Mount Haku Archives 🫧': 'Mount Haku',
    'Mount Haku 1-on-1s 🫧': 'Mount Haku',
    'Mount Haku 1-on-1s': 'Mount Haku',
    'Mount Tateyama Archives 🪭': 'Mount Tateyama',
    'Mount Tateyama 1-on-1s 🪭': 'Mount Tateyama',
    'Mount Tateyama 1-on-1s': 'Mount Tateyama',
    'Aiye Archives 🐝': 'Aiye',
    'Aiye 1-on-1s 🐝': 'Aiye',
    'Aiye 1-on-1s': 'Aiye',
    'Orun Archives ☁️': 'Orun',
    'Orun 1-on-1s ☁️': 'Orun',
    'Orun 1-on-1s': 'Orun',
    'Igbodu Archives 🪻': 'Igbodu',
    'Igbodu 1-on-1s 🪻': 'Igbodu',
    'Igbodu 1-on-1s': 'Igbodu',
    'Euphrates Archives 🐫': 'Euphrates',
    'Euphrates 1-on-1s 🐫': 'Euphrates',
    'Euphrates 1-on-1s': 'Euphrates',
    'Tigris Archives 🐪': 'Tigris',
    'Tigris 1-on-1s 🐪': 'Tigris',
    'Tigris 1-on-1s': 'Tigris',
    'Adlivun Archives 🌌': 'Adlivun',
    'Adlivun 1-on-1s 🌌': 'Adlivun',
    'Adlivun 1-on-1s': 'Adlivun',
    'Adlivun Archives 🌌 2': 'Adlivun',
    'Adlivun Archives 🌌 3': 'Adlivun',
    'Adlivun 2': 'Adlivun',
    'Adlivun 3': 'Adlivun',
    'Temple Archives ☆': 'Temples',
    'Finale Temples 🦋': 'Temples',
    'Finale Temples': 'Temples',
    'Rite of Apothea ☆': 'Rite of Apothea',
    'Sacrifice ☆': 'Sacrifice',
    'General Archives ☆': 'General',
    'Finale 🦋': 'Finale',
    'Jury ☆': 'Finale',
    'Jury': 'Finale',
  },
  groups: [
    {
      label: 'General',
      color: '#dcbb52',
      description: 'Announcements, temples, sacrifices and server-wide channels.',
      folders: [
        { name: 'Temples', description: "Each player's temple, plus the finale temples." },
        { name: 'Rite of Apothea', description: 'Chronicles, proclamations and trials.' },
        { name: 'Sacrifice', description: 'One channel per sacrifice.' },
        { name: 'General', description: 'Server-wide channels like Underworld, Salty Shores and The Stake.' },
      ],
    },
    {
      label: 'Hindu Era',
      color: '#cba3f7',
      description: 'Tribes Ayodhya, Haridwar, Kashi and Tirupati.',
      folders: [
        { name: 'Ayodhya', description: TRIBE_CHANNELS_FULL },
        { name: 'Haridwar', description: TRIBE_CHANNELS_FULL },
        { name: 'Kashi', description: TRIBE_CHANNELS_FULL },
        { name: 'Tirupati', description: TRIBE_CHANNELS_FULL },
      ],
    },
    {
      label: 'Shinto Era',
      color: '#f5a0c0',
      description: 'Tribes Mount Fuji, Mount Haku and Mount Tateyama.',
      folders: [
        { name: 'Mount Fuji', description: TRIBE_CHANNELS_FULL },
        { name: 'Mount Haku', description: TRIBE_CHANNELS_FULL },
        { name: 'Mount Tateyama', description: TRIBE_CHANNELS_FULL },
      ],
    },
    {
      label: 'Yoruba Era',
      color: '#f5c542',
      description: 'Tribes Aiye, Orun and Igbodu.',
      folders: [
        { name: 'Aiye', description: TRIBE_CHANNELS_FULL },
        { name: 'Orun', description: TRIBE_CHANNELS_FULL },
        { name: 'Igbodu', description: TRIBE_CHANNELS_FULL },
      ],
    },
    {
      label: 'Mesopotamian Era',
      color: '#e8c07a',
      description: 'Tribes Euphrates and Tigris.',
      folders: [
        { name: 'Euphrates', description: TRIBE_CHANNELS_FULL },
        { name: 'Tigris', description: TRIBE_CHANNELS_FULL },
      ],
    },
    {
      label: 'Adlivun Era',
      color: '#7ec8e3',
      description: 'The late game: tribe channels, group chats and lots of 1-on-1s.',
      folders: [
        { name: 'Adlivun', description: 'Announcements, challenges, the tribe hall, group chats and 1-on-1s.' },
      ],
    },
    {
      label: 'Finale',
      color: '#a8d4f0',
      description: 'The finalists\' temples, the jury and the final episode.',
      folders: [
        { name: 'Finale', description: 'Jury questions, finalist speeches, Ponderosa and the grand hall.' },
      ],
    },
  ],
};

const SONG_OF_LIFE = {
  id: 'song-of-life',
  path: '/song-of-life',
  label: 'Song of Life',
  name: null,
  title: 'Truce: Song of Life',
  accent: '#C799D3',
  stock: {
    paper: '#f1e0ff', ink: '#331e3c', soft: '#61356b', hair: '#c7b5d4', wash: '#e6d4f3',
    accent: '#c799d3', field: '#fbf4ff', visited: '#7446a8',
  },
  art: {
    src: '/images/song-of-life.webp', width: 848, height: 475,
    alt: 'Song of Life title art: a gramophone and sheet music on deep purple',
  },
  sitemapUrl: '/sitemap-sol.json',
  // Season 1 chats sit at the top of the SOL folder; later seasons have their own sub-folder.
  resolveChat: (folder, file) => (folder === 'Season 1'
    ? `NEEDIMPLEMENT/SOL/${file}`
    : `NEEDIMPLEMENT/SOL/${folder}/${file}`),
  folderAliases: {},
  groups: [
    {
      label: 'Seasons',
      color: '#C799D3',
      description: '',
      folders: [
        { name: 'Season 1', description: 'The green room and the studio.' },
        { name: 'Season 2', description: 'One submissions channel per player.' },
      ],
    },
  ],
};

// Season 3 has a page and a tab, but no chats until the season ends.
export const SEASON_THREE = {
  id: 'season-3',
  path: '/season-3',
  label: 'Season 3',
  name: 'Beyond the Veil',
  title: 'Truce: Beyond the Veil',
  accent: '#19b97c',
  art: {
    src: '/images/season-3.webp', width: 960, height: 320,
    alt: 'Beyond the Veil title art: green lines of light crossing in a grid',
  },
  upcoming: true,
  stock: {
    paper: '#e4f6ec', ink: '#0b2a1f', soft: '#1f5c44', hair: '#b4c9bf', wash: '#d7eae0',
    accent: '#19b97c', field: '#f5fcf8', visited: '#3d5a8c',
  },
};

/** Seasons with chats in the archive. */
export const SEASONS = [SEASON_ONE, SEASON_TWO, SONG_OF_LIFE];

/** Every season in the order the tabs and the home page list them. */
export const ALL_SEASONS = [SEASON_ONE, SEASON_TWO, SEASON_THREE, SONG_OF_LIFE];

export const SEASON_THREE_PATH = SEASON_THREE.path;

export function findFolder(season, folder) {
  for (const group of season.groups) {
    const match = group.folders.find((item) => item.name === folder);
    if (match) return { group, folder: match };
  }
  return { group: null, folder: null };
}

export function folderLabel(season, folder) {
  return findFolder(season, folder).folder?.label || folder.replace(/\s{2,}/g, ' ');
}

/** Old Song of Life links repeat the category inside the file name ("Season 2/…"). */
export function normalizeFile(folder, file) {
  const prefix = `${folder}/`;
  return file && file.startsWith(prefix) ? file.slice(prefix.length) : file;
}

/**
 * Groups as shown in the season table and the contents list, limited to categories that exist.
 * Categories that aren't listed in the config are collected under "Other" so they never disappear.
 */
export function buildGroups(season, sitemap) {
  const known = new Set();
  const groups = season.groups
    .map((group) => {
      group.folders.forEach((item) => known.add(item.name));
      return { ...group, folders: group.folders.filter((item) => sitemap[item.name]) };
    })
    .filter((group) => group.folders.length > 0);

  const others = Object.keys(sitemap)
    .filter((name) => !known.has(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, description: '' }));

  if (others.length) {
    groups.push({ label: 'Other', color: '#b9bfc9', description: '', folders: others });
  }
  return groups;
}
