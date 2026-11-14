// Helpers for the exported chat files.
// Filenames look like "<server> - <Discord category> - <channel> [<channel id>].html".

const DISCORD_EPOCH = 1420070400000;
const TIMESTAMP_SHIFT = 4194304; // 2^22

const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');

/** Absolute path to a file in public/, e.g. publicUrl('/sitemap.json'). */
export const publicUrl = (path) => `${PUBLIC_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Encodes each segment of a slash-separated path. */
export const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');

export function chatId(file) {
  const match = /\[(\d+)\]\.html$/i.exec(file);
  return match ? match[1] : '';
}

/** The Discord channel name, e.g. "aeris-cian". */
export function chatName(file) {
  const base = file.replace(/\.html$/i, '').replace(/\s*\[\d+\]\s*$/, '');
  const parts = base.split(' - ');
  return parts[parts.length - 1].trim() || base;
}

/** When the channel was created, read from its Discord ID. */
export function chatCreatedAt(id) {
  if (!id) return null;
  const ms = Math.floor(Number(id) / TIMESTAMP_SHIFT) + DISCORD_EPOCH;
  return Number.isFinite(ms) ? ms : null;
}

function compareIds(a, b) {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Oldest channel first; files without an ID go last, by name. */
export function compareChats(fileA, fileB) {
  const idA = chatId(fileA);
  const idB = chatId(fileB);
  if (idA && idB) return compareIds(idA, idB);
  if (idA) return -1;
  if (idB) return 1;
  return chatName(fileA).localeCompare(chatName(fileB));
}

export const sortChats = (files) => [...files].sort(compareChats);

const numberFormat = new Intl.NumberFormat();
const dateFormat = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
const dayKey = (ms) => new Date(ms).toDateString();

export const formatNumber = (value) => numberFormat.format(value);

export const pluralize = (count, word, plural = `${word}s`) => `${formatNumber(count)} ${count === 1 ? word : plural}`;

export const formatDate = (ms) => dateFormat.format(new Date(ms));

export function formatDateRange(start, end) {
  if (!start) return '';
  if (!end || dayKey(start) === dayKey(end)) return formatDate(start);
  if (typeof dateFormat.formatRange === 'function') {
    return dateFormat.formatRange(new Date(start), new Date(end));
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** "Aeris, Cian, Don +3" from a chat-meta.json entry. */
export function playersLabel(info, max = 3) {
  if (!info?.p?.length) return '';
  const shown = info.p.slice(0, max);
  const extra = (info.pc || info.p.length) - shown.length;
  return extra > 0 ? `${shown.join(', ')} +${extra}` : shown.join(', ');
}

/** "52 messages · Oct 13 – 18, 2025", falling back to the channel's creation date. */
export function chatSummary(file, info) {
  if (info) {
    const dates = formatDateRange(info.s, info.e);
    return [pluralize(info.n, 'message'), dates].filter(Boolean).join(' · ');
  }
  const created = chatCreatedAt(chatId(file));
  return created ? `Started ${formatDate(created)}` : '';
}

export function archiveUrl(seasonPath, folder, file) {
  let url = seasonPath;
  if (folder) url += `/${encodeURIComponent(folder)}`;
  if (folder && file) url += `/${encodeURIComponent(file)}`;
  return url;
}

function safeDecode(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Splits "/season-1/<folder>/<file>" into decoded parts. Split first so an encoded "/" stays inside its segment. */
export function parseArchivePath(pathname, seasonPath) {
  const baseLength = seasonPath.split('/').filter(Boolean).length;
  const parts = pathname.split('/').filter(Boolean).slice(baseLength).map(safeDecode);
  return {
    folder: parts[0] || null,
    file: parts.length > 1 ? parts.slice(1).join('/') : null,
  };
}

/** Totals for a list of chat files: how many, how many messages, and when the first and last were sent. */
export function summarize(files, meta) {
  let messages = 0;
  let start = null;
  let end = null;
  let known = 0;
  files.forEach((file) => {
    const info = meta?.[chatId(file)];
    if (!info) return;
    known += 1;
    messages += info.n || 0;
    if (info.s && (start === null || info.s < start)) start = info.s;
    if (info.e && (end === null || info.e > end)) end = info.e;
  });
  return { chats: files.length, messages, start, end, known };
}

/** "Oct 4 – 13, 2025" for a chat, or when its channel was made if no messages were counted. */
export function chatDates(file, info) {
  if (info?.s) return formatDateRange(info.s, info.e);
  const created = chatCreatedAt(chatId(file));
  return created ? `Started ${formatDate(created)}` : '';
}
