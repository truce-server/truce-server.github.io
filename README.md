# Truce Archives

The chat archives for every season of Truce, hosted at https://truce-server.github.io.

Pick a season, browse its categories, and open any chat. Every chat page has its own link you can share,
and the search (Ctrl K / ⌘K) finds chats by name, category or player.

## Running it locally

```bash
npm ci
npm start
```

This opens http://localhost:3000. To check it on your phone, open `http://<your computer's IP>:3000`
while both are on the same Wi-Fi.

`npm run build` makes the production version in `build/`. GitHub Actions builds and deploys it on every
push to `main` (see `.github/workflows/deploy-react.yml`).

## Adding chats

Chats are DiscordChatExporter HTML files. Each folder becomes a category on the site.

| Season | Folder |
| --- | --- |
| Season 1 | `SeasonOneChat/<category>/` |
| Season 2 | `SeasonTwoChat/<category>/` |
| Song of Life | `NEEDIMPLEMENT/SOL/` (Season 1) and `NEEDIMPLEMENT/SOL/<season>/` |

The deploy copies these folders into `public/`. To see new chats locally, copy them into the same
folders under `public/` too.

The chat lists (`public/sitemap*.json`) and the stats shown on each chat card (`public/chat-meta.json`)
are rebuilt from `public/` by `scripts/build-index.mjs`. That runs automatically before `npm start` and
`npm run build`, or on its own with `npm run index`.

To place a new category in a season's table, add it to that season's groups in `src/seasons.js`.
Categories that aren't listed there still show up under "Other".

## How a season looks

Each season's page is one table: a row per group (an era), a cell per category, sized by how many chats
it holds. All of it comes from `src/seasons.js`:

- `groups` are listed in the order the season ran, and each group's `color` fills its cells.
- `stock` is the season's paper and ink: the page background, the text and rule colour, and a few
  shades between them. Change these to change the whole season's look.
- `art` is the picture in the fact box and on the home page.

The fonts (Libre Franklin, Source Serif 4, and Cinzel for the Patrons pages) are served from `src/fonts/`.

## Patrons

`/patrons` lists every patron a Herald has played, A to Z, with a season filter and a search. The season
and the search are kept in the address (`/patrons?season=season-3&q=halo`), so a filtered list can be shared.

- The list is `public/patrons.json`, copied from the Truce Archives design system (`assets/Data/patrons.json`,
  made from the three Patron sheets). To update it, replace that file; keep names and origins as the sheets
  wrote them, and carry over each patron's `class`, `stats` and `lore` (below), which the sheets don't have.
- The Patrons pages are printed in night and gold instead of a season's paper: `PATRONS_STOCK` in
  `src/seasons.js` and everything in `src/styles/patrons.css`. Each card takes its season's colour from
  `src/seasons.js`. Their top bar is the same masthead as every other page (`src/components/Masthead.js`),
  printed on that stock.
- Opening a patron (`/patrons/<id>`) shows their own page full screen over the list: their portrait, name, lore,
  class and stats, then both abilities in their season's colours. "All patrons" or Esc goes back to the list as
  it was. `src/components/PatronPage.js` draws it.
- Each patron's portrait is their `image` (`public/images/patrons/<id>.webp`, with a `-sm` copy for the cards).
  A patron without one gets the diamonds and initials instead.
- Three fields in `patrons.json` feed the patron's page:
  - `class`: `"offence"`, `"defence"` or `"support"`.
  - `stats`: `offence`, `defence`, `difficulty`, `survivability`, `utility` and `support`, each a whole number
    from 1 to 5.
  - `lore`: two to four sentences. Until a patron has some, their page says "Lore coming soon, stay tuned."

## Images

The banners and logo in `public/images/` are smaller WebP copies of the originals in `Assets/`. If you
change an original, regenerate its copy, for example:

```bash
cwebp -q 80 -resize 960 0 Assets/Season1.png -o public/images/season-1.webp
```
