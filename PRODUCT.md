# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mixed audience: current and former Truce players, fans who followed the show from outside, and newcomers arriving from a shared link. Each arrives wanting to read a specific chat, season, or era, or to understand what Truce is before reading.

## Product Purpose

Truce Archives is the public record of every season of Truce: the Discord chat exports for each season, browsable by season, era, tribe, and channel, with a search (Ctrl K / ⌘K) that finds chats by name, category, or player. Success means a visitor finds the chat they came for and reads it in full, and can share a link to that exact conversation.

## Positioning

Season-by-season atmosphere. Each season (Season 1 "The Apotheion", Season 2 "Rite of Apothea", Song of Life) has its own identity, palette, banner, and transition, so moving through the archive feels like entering that season's world. A neighboring chat viewer that shows the same logs in one neutral list cannot make that claim.

## Operating Context

- Visitors browse on desktop and phone; mobile is a first-class context, not an afterthought.
- Content is Discord chat exports (DiscordChatExporter HTML), rebuilt into the site by `scripts/build-index.mjs`. Chats are the source; the site presents them.
- Shared links point to individual chats, so a single conversation must render well when opened cold.
- Deployed as a static build to GitHub Pages on every push to `main`.

## Capabilities and Constraints

- Season, era, category, and chat navigation; sidebar; spotlight search; per-chat share links.
- Client-side routing on a static host (GitHub Pages), with a 404 redirect path for deep links.
- Stack: React + Mantine, built with react-scripts. Existing and not up for change.
- Chat content is generated data under `public/`; the design does not change how it is produced.

## Brand Commitments

- Chat content is the record. Messages, names, and attachments are shown as exported and are never restyled, edited, or summarized.
- Season names, accents, and palettes are part of the product: Season 1 gold (`#d4af37`), Season 2 ice blue (`#a8d4f0`), and the Song of Life identity stay distinct from one another.
- The existing logo (`Assets/TruceLogo.png`, `public/TruceLogo.png`) and season banners (`public/images/`, sourced from `Assets/`) stay in use as provided.

## Evidence on Hand

- Full chat exports for Season 1 (`public/SeasonOneChat/`), Season 2 (`public/SeasonTwoChat/`), and Song of Life (`public/NEEDIMPLEMENT/SOL/`), with per-chat stats in `public/chat-meta.json`.
- Season artwork in `Assets/` (Season1, Season2, Season3, SongOfLife, SolLogo) and `public/images/`.
- No testimonials, press, usage metrics, or case studies are on hand. Future work must not invent any.

## Product Principles

- The archive is a faithful record: preserve the chats as exported, never curate them away.
- Every season is its own world, but the reading experience stays consistent across all of them.
- A shared link lands on the exact chat, readable without prior context.
- Navigation should get a reader from season to chat in as few steps as possible.

## Open Decisions

- Spoiler handling: not decided. Whether landing and overview pages may hint at outcomes, and whether any content warning is needed before opening a chat, is still open.
