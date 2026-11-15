# Handoff spec: Patrons A–Z (League-style)

For Claude Code, working in `truce-server/truce-server.github.io`.
Design source: the canvas "Truce Archives — Patrons A–Z" (https://claude.ai/artifact/QwddyUT1bDgpt1GKbyN7ts). The artboards are `Main.dc.html` (desktop) and `Phone.dc.html` (390px, Season 3 picked). Their markup is attached as `patrons-canvas-reference.dc.html`. Read it for values and structure only; it is not runnable code.

---

## Prompt to paste into Claude Code

> Build the Patrons index page at `/patrons` from `PATRONS_HANDOFF.md`, using the site's existing stack: React, react-router, Mantine for behaviour only, and plain CSS. Do **not** add shadcn/ui, Tailwind, Radix or any other UI or styling library. Put the styles in the site's CSS (`src/styles/global.css`, or a new `src/styles/patrons.css` imported the same way), using the tokens in this spec. Load patron data from `public/patrons.json`. Match the spec's states, responsive rules and accessibility notes exactly. Before you start, read `src/App.js`, `src/components/Masthead.js`, `src/seasons.js` and `src/styles/global.css` so the new page follows their conventions. Ask me about the open questions at the end of the spec if the code doesn't answer them.

---

## Constraints

- **No shadcn, Tailwind or Radix.** The site styles every surface in its own CSS. Mantine is used for behaviour only and is never the look.
- **Square corners, no shadows, no gradients**, as on the rest of the site.
- **Copy rules from the design system still hold:**
  - Sentence case in the source, uppercase only through CSS `text-transform`.
  - Exact counts with thousands separators.
  - Patron names and origins exactly as the sheets wrote them, including "Fr*nch" and "Brazillian".
  - No emoji in the page's own interface.
- **Not Riot's design.** The look is a dark, gold-trimmed character roster in the League style. Don't use Riot's fonts (Beaufort, Spiegel), logo or colours.

## Overview

This is an A–Z grid of every Patron a Herald has played: 89 patrons across Seasons 1–3 (33 / 32 / 24). It has two filters, by season and by search. Clicking a card opens that patron's page at `/patrons/:id`; that page isn't designed yet, so leave the route ready for it. Song of Life has no patrons, so it gets no season tab.

**Page structure, top to bottom:**
1. Top bar
2. Hero
3. Filter bar
4. Card grid (or the empty state)

## Data

- **Source.** Copy `assets/Data/patrons.json` from the Truce Archives design system into `public/patrons.json`.
  - It holds `seasons[]` (`id`, `label`, `name`, `originLabel`) and `patrons[]` (`id`, `name`, `season`, `origin`, `gender`, `abilities`), already in A–Z order.
  - The index uses only `id`, `name`, `season` and `origin`.
- **Sort order.** Sort by name, ignoring case and accents, and ignoring a leading "The". "The Narrator" files under N, "Jörmungandr" under J. The JSON is already in this order; keep it, and don't re-sort by season.
- **Search.**
  - Match case- and accent-blind, using NFKD with combining marks stripped (`/[̀-ͯ]/g`).
  - Match against `name` and `origin`, as a substring.
  - Combine it with the season filter (AND).
- **Initials** for the monogram (this is the system's own `initials()` rule):
  - Split the name on spaces, commas and `&`, and drop the words "the", "of" and "and".
  - Two or more words: the first letter of the first two words, uppercased ("Abraham Lincoln" → "AL").
  - One word: the first letter uppercase plus the second lowercase ("Amaterasu" → "Am"). Cinzel shows lowercase as small caps, which is intended.
- **Season badge:** `"S" + digits of season.label` (S1, S2, S3).
- **Card link:** `/patrons/${id}` through react-router `<Link>`.

## Layout

| Region | Spec |
|---|---|
| Page | Background `--pt-void`, `min-height: 100vh` |
| Top bar | 60px tall, `padding: 0 32px`, `gap: 28px`, background `--pt-night`, 1px bottom border `--pt-line-nav`. Brand (logo 30×30 + "Truce Archives") on the left, then the nav links |
| Main | `max-width: 1360px`, centred, `padding: 56px 32px 96px` |
| Hero | Centred column: eyebrow → 12px → title → 18px → divider (260px wide) → 18px → lead (max 60ch) → 10px → facts |
| Filter bar | 40px below the hero. `display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; padding: 10px 16px`, background `--pt-panel`, 1px top and bottom borders `--pt-gold-dim`. Order: search (`flex: 0 1 320px`), season tabs, status (`margin-left: auto`) |
| Grid | 28px below the bar. `grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 16px`. That gives 7 columns at 1360px. Each `<li>` is `display: flex` so the cards in a row are the same height |

**Divider:** a 1px line in `--pt-gold-dim`, then an 8×8 square rotated 45° with a 1px `--pt-gold` border, then another 1px line. The lines flex to fill the 260px width; the gap between parts is 12px.

### Card anatomy

1. **Frame:** a `<a>` with `display: flex; flex-direction: column`, a 1px `--pt-line` border and background `--pt-card`.
2. **Portrait well:** `aspect-ratio: 4 / 5`, background `--pt-well`, a 1px `--pt-line` bottom border and `overflow: hidden`. It is `aria-hidden`. It holds:
   - **Emblem layer** (`position: absolute; inset: 0; display: grid; place-items: center`). This whole layer scales on hover. Inside it:
     - an outer diamond: a square 64% of the well's width, rotated 45°, with a 1px border in the season tint at opacity 0.3;
     - an inner diamond: 46% wide, opacity 0.6;
     - the monogram, in the season tint, style `pt-monogram`.
   - **Season badge**, 8px from the top and left: `padding: 4px 7px; gap: 6px`, background `--pt-void`, a 1px `--pt-line` border. It shows a 6×6 rotated square in the season tint, then "S1", in style `pt-chip`.
3. **Text block:** `padding: 12px 12px 14px`.
   - The name in style `pt-name` and colour `--pt-text`. Long names wrap (`overflow-wrap: anywhere`) and are never truncated.
   - The origin 4px below, in style `pt-origin` and colour `--pt-origin`.

**When portraits exist:** pass `image` and show it `object-fit: cover` in the well, replacing the diamonds and monogram. Keep the season badge, and keep portraits at 4:5.

### Season tints

These are the system's existing fixed tokens:

| Token | Value |
|---|---|
| `--season-1` | `#d4af37` |
| `--season-2` | `#a8d4f0` |
| `--season-3` | `#19b97c` |

## Design tokens

These are new tokens, scoped to the Patrons pages: `[data-theme='patrons']` on the page root, or the `.patrons-page` class.

| Token | Value | Usage |
|---|---|---|
| `--pt-void` | `#070b12` | Page background, search field, season badge |
| `--pt-night` | `#04070c` | Top bar |
| `--pt-panel` | `#0b121d` | Filter bar |
| `--pt-panel-on` | `#121c2b` | Selected season tab background |
| `--pt-card` | `#0a1019` | Card and text block |
| `--pt-well` | `#0c1420` | Portrait well |
| `--pt-line` | `#2c384b` | Card, field and badge borders |
| `--pt-line-nav` | `#1f2836` | Top bar underline; nav divider on phones |
| `--pt-gold` | `#c9a85c` | Eyebrow, search icon, selected-tab bar, hover and focus borders, selected count |
| `--pt-gold-light` | `#e8cf8f` | Current nav link, selected tab text, hovered name, focus ring, reset button text |
| `--pt-gold-dim` | `#6f5a32` | Filter bar rules, divider lines, empty-state border |
| `--pt-text` | `#ece4d2` | Title, names, facts, input text |
| `--pt-text-soft` | `#9a9586` | Lead, status, empty-state body |
| `--pt-text-mute` | `#a7a295` | Idle nav links, idle tabs |
| `--pt-origin` | `#958f80` | Origin line |
| `--pt-count` | `#8f8a7c` | Idle tab counts, search placeholder |
| `--pt-chip` | `#c8c2b3` | Season badge text |
| `--radius-none` | `0` | Everything (existing token) |

### Type

- **`--font-pt-display`:** Cinzel at 500/600/700 (OFL), self-hosted as woff2 in `src/fonts/` like the other families. Include `latin` and `latin-ext`. Fallbacks: `'Source Serif 4', Georgia, serif`.
- **`--font-text`:** the existing Libre Franklin.

| Style | Family | Size / line height | Weight | Tracking | Case | Use |
|---|---|---|---|---|---|---|
| `pt-title` | Cinzel | 72px / 1.05 (44px under 768px) | 700 | 0.06em | upper | "Patrons" h1 |
| `pt-brand` | Cinzel | 17px / 1 | 700 | 0.08em | upper | "Truce Archives" in the top bar |
| `pt-name` | Cinzel | 15px / 1.2 | 700 | 0.06em | upper | Card name |
| `pt-monogram` | Cinzel | 40px / 1 | 700 | 0.04em | as computed | Initials |
| `pt-eyebrow` | Franklin | 12px | 600 | 0.3em | upper | "Truce · Seasons 1 to 3", gold |
| `pt-nav` | Franklin | 12px | 600 | 0.14em | upper | Top bar links |
| `pt-tab` | Franklin | 12px | 600 | 0.12em | upper | Season tabs, reset button |
| `pt-lead` | Franklin | 16px / 1.5 | 400 | 0 | sentence | Lead |
| `pt-facts` | Franklin | 13px | 600 | 0.08em | upper | "89 patrons · 3 seasons", tabular figures |
| `pt-status` | Franklin | 13px | 400 | 0 | sentence | "Showing 24 of 89 patrons", tabular figures |
| `pt-origin` | Franklin | 11.5px / 1.3 | 600 | 0.08em | upper | Origin line |
| `pt-chip` | Franklin | 11px / 1 | 600 | 0.1em | upper | S1 / S2 / S3 |
| input | Franklin | 14px | 400 | 0 | sentence | Search text |

## Components

| Component | Props | Notes |
|---|---|---|
| `PatronsPage` | none | Route `/patrons`. Fetches `/patrons.json` and owns `season` (`'all'` by default) and `query` state. Optionally reads `?season=season-3` to set the starting tab |
| Top bar | `current="patrons"` | See open question 1 (reuse `Masthead` or build a dark bar). Links: Season 1, Season 2, Season 3, Song of Life, Patrons (current) |
| `PatronSearch` | `value`, `onChange` | `<label>` wrapping a search icon (Tabler `search`, stroke 2, 16px, `--pt-gold`), a visually hidden "Search patrons" and an `<input type="search">`. 40px tall, `padding: 0 12px`, `gap: 8px`, 1px `--pt-line` border, background `--pt-void`. Placeholder: "Search by name, region or franchise". Hide the native cancel button and add a clear (x) icon button when there's text, as the site's `.field__clear` does. The canvas leaves this out |
| `SeasonTabs` | `options`, `value`, `onChange` | `role="group"`, `aria-label="Show patrons from"`. Options: All (89), then each season that has patrons, with its count. Each is a `<button aria-pressed>`, 44px tall, `padding: 0 14px`, `gap: 8px`: a 7×7 rotated swatch in the season tint (none for All), the label, then the count in weight 500 with tabular figures |
| `PatronCard` | `patron`, `season` | `<Link>` as described under "Card anatomy". `aria-label`: "{name}, {season.label} patron, {season.originLabel}: {origin}" |
| `PatronEmblem` | `name`, `tint`, `image?` | The portrait well's content |
| Empty state | `query`, `season`, `onReset` | See "Edge cases" |

## States and interactions

| Element | State | Behaviour |
|---|---|---|
| Card | Default | 1px `--pt-line` border |
| Card | Hover / focus-visible | Border `--pt-gold`, name `--pt-gold-light`, emblem layer scales to 1.07 |
| Card | Focus-visible | A 2px `--pt-gold-light` outline, offset 3px, in addition to the hover state |
| Card | Click | Goes to `/patrons/:id` |
| Season tab | Idle | Transparent background, text `--pt-text-mute`, count `--pt-count`, transparent 2px bottom border |
| Season tab | Hover | Text `--pt-text` |
| Season tab | Selected | Background `--pt-panel-on`, text `--pt-gold-light`, count `--pt-gold`, 2px `--pt-gold` bottom border, `aria-pressed="true"` |
| Season tab | Focus-visible | A 2px `--pt-gold-light` outline, inset 2px |
| Search | Focus | Border turns `--pt-gold`. The input itself has no outline; the label shows the focus |
| Search | Typing | Filters as you type, with no debounce needed at 89 items. Status updates |
| Nav link | Idle / hover | `--pt-text-mute` / `--pt-text` |
| Nav link | Current | Text `--pt-gold-light`, 2px `--pt-gold` bottom border, `aria-current="page"` |
| Reset button | Default | 40px tall, `padding: 0 18px`, 1px `--pt-gold` border, transparent background, text `--pt-gold-light` |
| Reset button | Hover | Fill `--pt-gold`, text `--pt-void` |
| Status | Always | "Showing all 89 patrons", or "Showing 24 of 89 patrons" when filtered |

## Responsive behaviour

The site's breakpoints are 68.74em (1100px) and 48em (768px).

| Width | Changes |
|---|---|
| Over 1100px | Default layout, 7 columns at full width |
| 768–1100px | The grid reflows by `auto-fill`, the filter bar wraps naturally, and the status stays right-aligned |
| Under 768px | Top bar in two rows: the brand row is 52px with `padding: 0 16px`; the nav row spans the full width, scrolls sideways, has 44px links with `padding: 0 10px`, and a 1px `--pt-line-nav` top border |
| Under 768px | Main `padding: 32px 16px 64px`; title 44px; filter bar `padding: 12px` |
| Under 768px | Search goes full width; the tabs sit on one row that scrolls sideways (`flex-wrap: nowrap`); the status sits on its own line, left-aligned |
| Under 768px | Grid `minmax(150px, 1fr)`, `gap: 12px`, giving 2 columns at 390px |
| `pointer: coarse` | Search, tabs and reset button are at least 44px tall, following the site's existing coarse-pointer rules |

## Edge cases

- **Empty result:** a box 28px below the bar with `padding: 32px`, a 1px dashed `--pt-gold-dim` border and centred text.
  - It says "No patrons match "{query}"." in `--pt-text` at weight 600. When a season is picked, add " in Season N" before the full stop.
  - Below that, the reset button "Show every patron", which clears the query and sets the season to All.
- **Loading** (fetching `patrons.json`):
  - Show 14 placeholder cards: the well colour plus a 2-line text block in `--pt-line`, with no text.
  - Set `aria-busy="true"` on the grid.
  - Keep the status reading "Loading patrons".
- **Fetch error:** in place of the grid, show "The patrons didn't load. Reload the page to try again." in the empty-state box, without the reset button.
- **Long names and origins:** "Flying Spaghetti Monster" and "Doki Doki Literature Club" wrap onto 2–3 lines. Never truncate or abbreviate them.
- **Characters outside Cinzel's set:** "ọ" in Yemọja falls back to the next font in the stack. Accept this; don't rewrite the name.
- **Missing data:** a patron with no `origin` hides the origin line. A season with no patrons gets no tab.
- **Portraits:** none exist yet. The emblem is the intended stand-in, not a bug.

## Motion

| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Card border | Hover / focus | Colour to `--pt-gold` | 160ms | ease-out |
| Card name | Hover / focus | Colour to `--pt-gold-light` | 160ms | ease-out |
| Emblem layer | Hover / focus | `transform: scale(1.07)` | 320ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Nav link, tab | Hover / select | Text and background colour | 120ms | ease-out |
| Everything | `prefers-reduced-motion: reduce` | No transitions; the emblem doesn't scale | — | — |

## Accessibility

- **Focus order:** brand → nav links → search → season tabs → cards (A–Z) → reset button (empty state only).
- **Landmarks:** the top bar is a `<header>` containing `<nav aria-label="Archive">`; the content is in `<main>`; the hero title is the only `<h1>`.
- **Status:** `role="status"` (polite), so screen readers hear the new count after each filter change.
- **Decoration:** the portrait well, the divider and the swatches are `aria-hidden`. The card's `aria-label` carries the name, season and origin.
- **Measured contrast** (WCAG AA needs 4.5:1):

  | Pair | Contrast |
  |---|---|
  | Text on void | 15.6:1 |
  | Name on card | 15.1:1 |
  | Soft on void | 6.6:1 |
  | Status on panel | 6.3:1 |
  | Origin on card | 5.9:1 |
  | Idle tab on panel | 7.4:1 |
  | Idle count on panel | 5.5:1 |
  | Selected tab text | 11.2:1 |
  | Nav link on night | 7.9:1 |
  | Badge text | 11.1:1 |
  | Monogram S1 / S2 / S3 on well | 8.8 / 11.7 / 7.3:1 |

- **Rules:** keep every text pairing at 4.5:1 or better. The 1px `--pt-line` borders are decorative; the focus ring carries focus.

## Open questions for Sanje

1. **Scope of the dark look:** does it cover only `/patrons` and the future patron pages, with the rest of the site staying on its paper stocks?
2. **Masthead:**
   - Option A: reuse the shared `Masthead` and give it a `patrons` stock, so its variables turn it dark. Note that its current tab is a solid fill, not the gold underline on the canvas.
   - Option B: build the canvas's dark top bar for Patrons pages only.
   - Pick one.
3. **Letter index:** the League-style grid drops the system's A–Z letter index and letter headings. Is that intended for the live site too?
4. **Season deep link:** should `?season=` be supported (useful for linking to "Season 3 patrons")?
