/** "#d4af37" + 0.2 -> "rgba(212, 175, 55, 0.2)" */
export function withAlpha(hex, alpha) {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const int = parseInt(full, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

/** Label for the Ctrl/Cmd key in shortcut hints. */
export const MOD_KEY = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '')
  ? '⌘'
  : 'Ctrl';

/**
 * Scrolls a row that scrolls sideways (tabs on a phone) just enough to show `item` in full.
 * Only the row moves, never the page, and nothing happens when the row fits.
 */
export function revealInRow(row, item) {
  if (!row || !item || row.scrollWidth <= row.clientWidth) return;
  const bounds = row.getBoundingClientRect();
  const box = item.getBoundingClientRect();
  if (box.left < bounds.left) row.scrollLeft -= bounds.left - box.left;
  else if (box.right > bounds.right) row.scrollLeft += box.right - bounds.right;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
