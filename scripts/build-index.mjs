#!/usr/bin/env node
/**
 * Builds the chat lists and the chat stats index from the exported chats in public/.
 *
 * Writes:
 *   public/sitemap.json          Season 1      { category: [file, ...] }
 *   public/sitemap-season2.json  Season 2      { category: [file, ...] }
 *   public/sitemap-sol.json      Song of Life  { category: [file, ...] }
 *   public/chat-meta.json        stats per chat, keyed by Discord channel ID:
 *                                { n: messages, s: first message (ms), e: last message (ms),
 *                                  p: [most active players], pc: player count (only when > p.length) }
 *
 * Runs automatically before `npm start` and `npm run build`. Run it by hand with `npm run index`.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const DISCORD_EPOCH = 1420070400000n;
const MAX_PLAYERS = 6;

const byLowerCase = (a, b) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x !== y) return x < y ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
};

async function exists(dir) {
  try {
    return (await fs.stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

async function listEntries(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => !entry.name.startsWith('.'));
}

const htmlFilesIn = (entries) =>
  entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.html'))
    .map((entry) => entry.name)
    .sort(byLowerCase);

/** One category per sub-folder; loose .html files go into `rootCategory` when given. */
async function scanSeason(baseDir, rootCategory) {
  const sitemap = {};
  const files = [];
  if (!(await exists(baseDir))) {
    console.warn(`  ! ${path.relative(ROOT, baseDir)} not found, writing an empty list`);
    return { sitemap, files };
  }

  const entries = await listEntries(baseDir);
  if (rootCategory) {
    const loose = htmlFilesIn(entries);
    if (loose.length) {
      sitemap[rootCategory] = loose;
      loose.forEach((file) => files.push(path.join(baseDir, file)));
    }
  }

  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort(byLowerCase);
  for (const folder of folders) {
    const chats = htmlFilesIn(await listEntries(path.join(baseDir, folder)));
    sitemap[folder] = chats;
    chats.forEach((file) => files.push(path.join(baseDir, folder, file)));
  }
  return { sitemap, files };
}

const snowflakeToMs = (id) => Number((BigInt(id) >> 22n) + DISCORD_EPOCH);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodeEntities = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });

// Nicknames carry placement tags such as "Dorm [S1 - 20th]".
const cleanPlayerName = (name) => decodeEntities(name).replace(/\s*\[[^\]]*\]\s*$/, '').trim();

function readStats(html) {
  const stats = {};

  const exported = html.match(/Exported ([\d,]+) message/);
  const messageIds = html.match(/data-message-id="?(\d+)/g) || [];
  stats.n = exported ? parseInt(exported[1].replace(/,/g, ''), 10) : messageIds.length;

  if (messageIds.length) {
    const firstId = messageIds[0].replace(/\D/g, '');
    const lastId = messageIds[messageIds.length - 1].replace(/\D/g, '');
    stats.s = snowflakeToMs(firstId);
    stats.e = snowflakeToMs(lastId);
  }

  // Author names appear once per message group; good enough for ranking who talks most.
  const players = new Map();
  // Bots are followed by a "BOT" tag (chatlog__author-tag here, chatlog__bot-label in older exports).
  const authorPattern = /<span class="?chatlog__author"?(?=[\s>])([^>]*)>([^<]*)<\/span>(\s*<span class="?chatlog__(?:author-tag|bot-label))?/g;
  for (const [, attrs, rawName, botLabel] of html.matchAll(authorPattern)) {
    if (botLabel) continue;
    const name = cleanPlayerName(rawName);
    if (!name) continue;
    const key = attrs.match(/data-user-id="?(\d+)/)?.[1] || name;
    const player = players.get(key);
    if (player) player.count += 1;
    else players.set(key, { name, count: 1, order: players.size });
  }

  const ranked = [...players.values()].sort((a, b) => b.count - a.count || a.order - b.order);
  stats.p = ranked.slice(0, MAX_PLAYERS).map((player) => player.name);
  if (ranked.length > stats.p.length) stats.pc = ranked.length;
  return stats;
}

async function writeIfChanged(file, content) {
  const target = path.join(PUBLIC, file);
  try {
    if ((await fs.readFile(target, 'utf8')) === content) return false;
  } catch {
    // File doesn't exist yet.
  }
  await fs.writeFile(target, content, 'utf8');
  return true;
}

async function main() {
  const started = Date.now();
  const seasons = [
    { label: 'Season 1', out: 'sitemap.json', dir: path.join(PUBLIC, 'SeasonOneChat') },
    { label: 'Season 2', out: 'sitemap-season2.json', dir: path.join(PUBLIC, 'SeasonTwoChat') },
    { label: 'Song of Life', out: 'sitemap-sol.json', dir: path.join(PUBLIC, 'NEEDIMPLEMENT', 'SOL'), rootCategory: 'Season 1' },
  ];

  const allFiles = [];
  for (const season of seasons) {
    const { sitemap, files } = await scanSeason(season.dir, season.rootCategory);
    const changed = await writeIfChanged(season.out, `${JSON.stringify(sitemap, null, 2)}\n`);
    console.log(`  ${season.label}: ${Object.keys(sitemap).length} categories, ${files.length} chats -> ${season.out}${changed ? '' : ' (unchanged)'}`);
    allFiles.push(...files);
  }

  const entries = [];
  for (const file of allFiles) {
    const id = path.basename(file).match(/\[(\d+)\]\.html$/i)?.[1];
    if (!id) {
      console.warn(`  ! no channel ID in ${path.relative(PUBLIC, file)}, skipping stats`);
      continue;
    }
    entries.push([id, readStats(await fs.readFile(file, 'utf8'))]);
  }

  entries.sort(([a], [b]) => (a.length - b.length) || (a < b ? -1 : a > b ? 1 : 0));
  const meta = {};
  for (const [id, stats] of entries) {
    if (meta[id]) console.warn(`  ! duplicate channel ID ${id}, keeping the first`);
    else meta[id] = stats;
  }

  const changed = await writeIfChanged('chat-meta.json', `${JSON.stringify(meta)}\n`);
  console.log(`  Stats for ${Object.keys(meta).length} chats -> chat-meta.json${changed ? '' : ' (unchanged)'}`);
  console.log(`  Done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
