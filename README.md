# AI Tools Hub

A curated directory of **585 AI tools in 26 categories**, built for Indian small businesses: shop owners, restaurants, CA firms, creators and D2C brands.

**Live:** https://aitoolshub-in.vercel.app/

## Features (v3.0)

- Task-first search everywhere (hero, Ctrl/Cmd+K or `/` palette, directory, Tool Finder) with a "why it matches" reason for each result
- Directory filters that combine: category, Free / Freemium / Paid, India status (Verified for India / not verified / Not available in India), jobs, sort; the view lives in the URL so you can share it
- Tool details drawer: features, use cases, facts, India availability (verified with sources, or "Not verified"), alternatives, similar tools, report link
- AI Tool Finder: task + ₹ budget + pricing model + must-haves, ranked with transparent reasons
- Compare up to 4 tools, saved tools, recently viewed (all kept in this browser only)
- India-first: INR, UPI, GST and Indian-language labels shown only when verified on official pages (11 Oct 2026); D2C page and seller guides
- Suggest a tool form and "Report a wrong link or price" links that open prefilled GitHub issues (no backend)
- Light and dark themes, mobile first, keyboard accessible, reduced-motion aware
- Optional interface sounds (v3.2), off by default: a Sound button in the header turns on four short clicks for primary buttons, opening a tool, adding to compare or saved, and copying

## Tech stack

Plain HTML, CSS and vanilla JavaScript. No framework, no runtime dependencies. A small Node build
(`node build.js`) generates the tool, category and guide pages, the sitemap, the search index and `public/`, which Vercel serves.

## Design system

`ds.css` holds every token (colour, type scale, spacing, radius, shadow, motion) for the light and dark themes and the shared components:
buttons, search field, chips, segmented control, switch, badges, favicon logo, tool card, skeleton, empty state, sheet/drawer, dialog, toast.
One accent (electric blue), Geist font with Inter/system fallback. Icons are [Lucide](https://lucide.dev) (ISC License), copied into
`icons.svg` as a local sprite, so no icon CDN is loaded. Motion uses transform/opacity with an ease-out curve and turns off under `prefers-reduced-motion`.

## Files (all in the repo root, so they can be uploaded from GitHub web)

```
index.html        Home page markup (+ #india-data: verified India facts, the only source for India labels)
ds.css            Design system: tokens + shared components (every page)
home.css          Home page layout
home.js           Home page app: directory, sheet, compare, finder UI, palette, favourites, recently viewed, suggest form
finder.js         Search + Tool Finder scoring (pure functions; works in the browser and in Node)
icons.svg         Lucide icon sprite
data.js           All tools (name, link, category, pricing, description, highlights)
guides.js         18 business guides (build.js turns them into /guides/<slug>)
build.js          Generates public/: tool, category and guide pages, sitemap, search index, home stats and category tiles
sfx.js            Optional UI sounds: Sound toggle (localStorage aith-sound, off by default), AITHSfx.play(name), volume 0.08
assets/sfx/       click.mp3, open.mp3, add.mp3, success.mp3 (Kenney Interface Sounds, CC0; see SFX-LICENSES.md). build.js copies assets/ to public/
pages.css/.js     Generated pages, seller guides, legal pages, 404 (search palette, theme, Save, progress bar, Clear-data button)
d2c.html          Tools for Indian D2C sellers (own 130-tool list with verified labels)
guide-*.html/css  Seller guides (Amazon, Shopify, WhatsApp)
privacy.html, terms.html, cookies.html, copyright.html, disclaimer.html, contact.html   Legal pages (static; build.js copies them,
                  links them in every generated footer, lists them in the sitemap and stops the build if one is missing)
404.html, robots.txt, sitemap.xml, vercel.json (build settings + security headers), manifest.webmanifest, icons and images
```

## Run locally

```bash
git clone https://github.com/Saikumar8125/AI-TOOLS-HUB.git
cd AI-TOOLS-HUB
node build.js     # builds public/ (Vercel runs this)
python3 -m http.server 8000 -d public
```

Then open http://localhost:8000

## Adding or editing a tool

All tools live in `data.js`.

1. Add a line to `AITH_TOOLS`: `{"n": "Name", "u": "https://...", "c": "Category", "p": "Freemium"}`
2. Add a matching entry to `AITH_DESC` with a one-line description and up to 3 highlights.

Counts, categories, pages and the sitemap update automatically. New tools appended at the end of `AITH_TOOLS`
show up first under "Latest additions". India labels go in `#india-data` in `index.html` only after checking the official page.

## Tool Finder and future AI

`finder.js` scores tools with fixed weights and a synonym list, and records a reason for every point. To plug in an LLM later:

```js
AITHFinder.setEngine(async (query, prefs, tools) => [{ tool, score, reasons }]);
AITHFinder.recommendAsync(index, prefs); // falls back to the deterministic recommend() on any error
```

## What needs a backend (not built, by design)

- Newsletter sign-up (needs an email provider and consent storage)
- Storing tool suggestions and reports on the site (today they open GitHub issues)
- Automatic scheduled link checks and price monitoring
- Accounts / syncing saved tools across devices
- Real popularity or trending data (needs analytics)
- An LLM-backed Tool Finder (needs a server-side API key)

## Contributing

Found a dead link or a wrong price? Open an issue: https://github.com/Saikumar8125/AI-TOOLS-HUB/issues

## License

MIT © 2026 J. Venkata Sai Kumar. Lucide icons © Lucide Contributors, ISC License. Sound effects by Kenney (kenney.nl), CC0 1.0 (see SFX-LICENSES.md).
