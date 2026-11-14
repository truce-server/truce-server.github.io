import React, { useDeferredValue, useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowDown, IconArrowUp, IconArrowsSort, IconSearch, IconX } from '@tabler/icons-react';
import { findFolder, folderLabel } from '../seasons';
import { archiveUrl, chatDates, chatId, chatName, formatNumber, playersLabel, pluralize, sortChats } from '../utils/chats';

// `order` is the order the channels were made in, which is how the chats are listed by default.
const SORTS = {
  order: { label: 'Season order' },
  name: { label: 'Name', firstDirection: 'asc', compare: (a, b) => a.name.localeCompare(b.name) },
  messages: { label: 'Messages', firstDirection: 'desc', compare: (a, b) => a.messages - b.messages },
  active: { label: 'Dates', firstDirection: 'asc', compare: (a, b) => a.started - b.started },
};

const MOBILE_SORTS = [
  ['order:asc', 'Season order'],
  ['messages:desc', 'Most messages'],
  ['active:desc', 'Newest first'],
  ['active:asc', 'Oldest first'],
  ['name:asc', 'Name, A to Z'],
];

function SortHeader({ id, sort, onSort, align }) {
  const active = sort.key === id;
  let Icon = IconArrowsSort;
  if (active) Icon = sort.direction === 'asc' ? IconArrowUp : IconArrowDown;
  let ariaSort = 'none';
  if (active) ariaSort = sort.direction === 'asc' ? 'ascending' : 'descending';

  return (
    <th scope="col" aria-sort={ariaSort} className={align === 'end' ? 'chat-table__end' : undefined}>
      <button type="button" onClick={() => onSort(id)} data-active={active || undefined}>
        {SORTS[id].label}
        <Icon size={14} stroke={2} aria-hidden="true" />
      </button>
    </th>
  );
}

/**
 * A table of chats. `sections` is a list of { folder, files }: one section for a category page,
 * every category for the season's full index. Stats come from chat-meta.json, so no chat files load here.
 */
function ChatTable({ season, sections, meta, label }) {
  const navigate = useNavigate();
  const filterId = useId();
  const [query, setQuery] = useState('');
  const needle = useDeferredValue(query.trim().toLowerCase());
  const [sort, setSort] = useState({ key: 'order', direction: 'asc' });
  const many = sections.length > 1;
  // A season with a single group has no eras worth naming on every row.
  const showEra = season.groups.length > 1;

  const groups = useMemo(() => sections.map(({ folder, files }) => {
    const { group } = findFolder(season, folder);
    const name = folderLabel(season, folder);
    return {
      folder,
      name,
      color: group?.color,
      era: group?.label,
      rows: sortChats(files).map((file, index) => {
        const info = meta?.[chatId(file)];
        const chat = chatName(file);
        return {
          file,
          folder,
          folderName: name,
          color: group?.color,
          number: index + 1,
          name: chat,
          info,
          messages: info?.n ?? -1,
          started: info?.s ?? Number.MAX_SAFE_INTEGER,
          haystack: `${chat} ${(info?.p || []).join(' ')}`.toLowerCase(),
        };
      }),
    };
  }), [season, sections, meta]);

  const visible = useMemo(() => {
    const filtered = groups
      .map((group) => ({ ...group, rows: needle ? group.rows.filter((row) => row.haystack.includes(needle)) : group.rows }))
      .filter((group) => group.rows.length > 0);
    if (sort.key === 'order') return filtered;

    // Any other sort mixes the categories into one list.
    const compare = SORTS[sort.key].compare;
    const rows = filtered.flatMap((group) => group.rows).sort((a, b) => (
      sort.direction === 'asc' ? compare(a, b) : compare(b, a)
    ));
    return rows.length ? [{ folder: null, rows }] : [];
  }, [groups, needle, sort]);

  const total = groups.reduce((sum, group) => sum + group.rows.length, 0);
  const shown = visible.reduce((sum, group) => sum + group.rows.length, 0);
  const flat = sort.key !== 'order';
  const showCategory = many && flat;
  const columns = showCategory ? 6 : 5;

  const handleSort = (key) => {
    setSort((current) => {
      if (current.key !== key) return { key, direction: SORTS[key].firstDirection };
      // A second click reverses the column; a third goes back to season order.
      if (current.direction === SORTS[key].firstDirection) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: 'order', direction: 'asc' };
    });
  };

  const openRow = (event, url) => {
    // Clicks on the link itself are handled by the link, so new-tab clicks keep working.
    if (event.target.closest('a')) return;
    navigate(url);
  };

  let status = pluralize(total, 'chat');
  if (needle) status = shown ? `${formatNumber(shown)} of ${pluralize(total, 'chat')}` : 'No chats match';

  return (
    <div className="chat-list">
      <div className="chat-list__tools">
        <label className="field chat-list__filter" htmlFor={filterId}>
          <IconSearch size={16} stroke={2} aria-hidden="true" />
          <input
            id={filterId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Filter by chat or player"
            aria-label={`Filter ${label} by chat or player`}
            autoComplete="off"
          />
          {query && (
            <button type="button" className="field__clear" onClick={() => setQuery('')} aria-label="Clear filter">
              <IconX size={14} stroke={2} aria-hidden="true" />
            </button>
          )}
        </label>

        <label className="chat-list__sort">
          <span>Sort</span>
          <select
            value={`${sort.key}:${sort.direction}`}
            onChange={(event) => {
              const [key, direction] = event.currentTarget.value.split(':');
              setSort({ key, direction });
            }}
          >
            {MOBILE_SORTS.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </label>

        <p className="chat-list__status" aria-live="polite">{status}</p>
      </div>

      <table className="chat-table">
        <caption className="visually-hidden">{label}</caption>
        <thead>
          <tr>
            <th scope="col" className="chat-table__num"><span>No.</span></th>
            <SortHeader id="name" sort={sort} onSort={handleSort} />
            {showCategory && <th scope="col"><span>Category</span></th>}
            <SortHeader id="messages" sort={sort} onSort={handleSort} align="end" />
            <SortHeader id="active" sort={sort} onSort={handleSort} />
            <th scope="col"><span>Players</span></th>
          </tr>
        </thead>

        {visible.length === 0 && (
          <tbody>
            <tr className="chat-table__empty">
              <td colSpan={columns}>
                No chats match “{query.trim()}”.{' '}
                <button type="button" className="link-button" onClick={() => setQuery('')}>Clear the filter</button>
              </td>
            </tr>
          </tbody>
        )}

        {visible.map((group) => (
          <tbody key={group.folder || 'all'}>
            {many && group.folder && (
              <tr className="chat-table__group" style={{ '--c': group.color }}>
                <th colSpan={columns} scope="rowgroup">
                  <Link to={archiveUrl(season.path, group.folder)}>{group.name}</Link>
                  <span>
                    {showEra && group.era && group.era !== group.name ? `${group.era} · ` : ''}
                    {pluralize(group.rows.length, 'chat')}
                  </span>
                </th>
              </tr>
            )}
            {group.rows.map((row, index) => {
              const url = archiveUrl(season.path, row.folder, row.file);
              const players = playersLabel(row.info);
              return (
                <tr key={`${row.folder}/${row.file}`} className="chat-table__row" onClick={(event) => openRow(event, url)}>
                  {/* In season order this is the chat's place in its category; once sorted, its rank. */}
                  <td className="chat-table__num">{flat ? index + 1 : row.number}</td>
                  <td className="chat-table__name"><Link to={url}>{row.name}</Link></td>
                  {showCategory && (
                    <td className="chat-table__category">
                      <i className="swatch" style={{ '--c': row.color }} aria-hidden="true" />
                      {row.folderName}
                    </td>
                  )}
                  <td className="chat-table__end chat-table__messages">
                    {row.info ? (
                      <>{formatNumber(row.info.n)}<span className="chat-table__unit"> {row.info.n === 1 ? 'message' : 'messages'}</span></>
                    ) : (
                      <span className="chat-table__none" title="Not counted">–</span>
                    )}
                  </td>
                  <td className="chat-table__dates">
                    {chatDates(row.file, row.info) || <span className="chat-table__none" title="No dates recorded">–</span>}
                  </td>
                  <td className="chat-table__players">{players}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default ChatTable;
