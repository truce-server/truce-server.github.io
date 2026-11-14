import { useEffect } from 'react';

const TOKENS = ['paper', 'ink', 'soft', 'hair', 'wash', 'accent', 'field', 'visited'];

/** CSS variables for a stock, for elements that show a season's colours inside another page. */
export function stockVars(stock) {
  return Object.fromEntries(TOKENS.map((name) => [`--${name}`, stock[name]]));
}

/**
 * Prints the whole page on a season's stock. The variables go on <html> so the page background,
 * dialogs and drawers all pick them up, and the browser's own toolbar colour follows the paper.
 */
export function useStock(stock) {
  useEffect(() => {
    const root = document.documentElement;
    TOKENS.forEach((name) => root.style.setProperty(`--${name}`, stock[name]));
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', stock.paper);
  }, [stock]);
}
