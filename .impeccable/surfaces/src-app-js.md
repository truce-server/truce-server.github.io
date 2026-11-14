---
version: 1
slug: "src-app-js"
primary_target: "src/App.js"
related_targets: ["src/components/SeasonArchive.js","src/components/SeasonLanding.js","src/components/ChannelView.js","src/components/ChatlogViewer.js","src/components/Home.js","src/components/SeasonMap.js","src/components/ChatTable.js","src/components/Contents.js","src/styles/global.css","src/seasons.js"]
---

# Truce Archives: whole-site redesign

## Scope and mode

Every surface: home, season page, category page, chat reader, search, Season 3 page, season intros. Visitor mode: Read. Built code-led.

## Audience and job

Players, fans and newcomers who arrive to find one chat, category or player and read it. A shared link opens a single chat cold.

- Action: pick a category from the season table, then a chat. Search (Ctrl/Cmd K) stays.
- Content: the real sitemaps, chat-meta.json stats, season art in public/images, group and category descriptions in src/seasons.js.
- Constraints: messages stay looking like Discord. Finding a chat must not take more steps than before. Seasons must not look alike. It must not read as a dashboard template or a Discord clone.
- Decided by the user after the first finish review: (1) every season's chats are shown exactly as exported, so the navy and plum tint the old code put on Season 2 and Song of Life chats is removed; (2) no side column anywhere: the season's full contents list opens from a Contents button in the top bar at every width, accepting one more click for a non-adjacent chat in exchange for not echoing Discord's layout.

## Direction contract

THESIS: The archive is Truce's own season wiki. A season is one proportional, era-coloured table read like a voting-history chart. It refuses the dashboard shell (sidebar, stat tiles, card grid) and the Discord clone.

OWN-WORLD: Each season is printed on its own stock in its own ink: Season 1 ivory and black, Season 2 ice and navy, Song of Life lilac and plum, Season 3 mint and green-black, home white. Solid era-colour cells divided by 2px ink rules, zero radius, no shadows or gradients. Source Serif 4 headings, Libre Franklin text with tabular figures. An infobox carries the art plate and the facts. The current tab is solid ink.

STORY: The visitor sees how the season ran, finds their era by colour, reaches a category in one click and a chat in two, and reads the Discord record untouched inside a calm frame.

FIRST VIEWPORT: Masthead with wordmark, season tabs and search. Left: serif h1 "Truce: The Apotheion", a short lead, then the season table: era rows in date order, a header cell per row, category cells sized by chat count. Right: a 318px infobox with ink header, art and facts. The primary action is any table cell.

FORM: Fan-wiki season page and voting-history table. Position 1 on the ordered list (chosen as the pick card). seed:f34c3721b9990672. Signature interaction: table cells invert on hover and focus, and the same era row marks "you are here" on category pages. Motion grammar: bands wipe in once on the season intro; nothing decorative loops (the only repeating motion is the three-step loading mark while a chat loads).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The season table itself: one glance shows how big each era and tribe was, in the season's own colours.

## Unresolved

- Spoiler handling is still an open product decision (see PRODUCT.md).
