# AI Tools Hub

A curated directory of **585 AI tools in 26 categories**, built for Indian small businesses: shop owners, restaurants, CA firms and D2C brands.

**Live:** https://aitoolshub-in.vercel.app/

## Features

- Search, category and "by job" filters
- Tool details popup with pricing (Free / Freemium / Paid) and highlights
- India badges for tools verified as made in or built for India
- D2C seller section and guides (Amazon, Shopify, WhatsApp)
- Save tools (kept in this browser via localStorage) and compare them side by side
- Dark / light theme, works offline-friendly on mobile

## Tech stack

Plain HTML, CSS and vanilla JavaScript. No framework. A small Node build
(`node build.js`) generates the tool, category and guide pages, the sitemap,
and `public/`, which Vercel serves.

## Design system

One token set in `home.css` (design-system section at the end) (`--ds-*`: background, three surfaces,
two hairlines, text, muted, faint, one gold accent) for dark and light themes.
Inter 400/500/600 is the only font. No glass, glow or entrance animation;
only state changes (hover, open, press) animate, and `prefers-reduced-motion`
turns those off. `pages.css` uses the same palette for generated pages.

## Project structure

```
index.html        Home page markup
home.css          Home page styles (one file, cascade order)
home.js           Home page scripts (one file)
data.js           All tools (name, link, category, pricing, description)
build.js          Generates public/: tool, category and guide pages, sitemap
d2c.html          Tools for Indian D2C sellers
guide-*.html/css  Guides
styles.css        Base styles and design tokens
hero.css          Hero section styles
main.js           Nav, theme toggle and shared UI
privacy.html, terms.html, 404.html
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

Counts and categories update automatically.

## Contributing

Found a dead link or a wrong price? Open an issue: https://github.com/Saikumar8125/AI-TOOLS-HUB/issues

## License

MIT © 2026 J. Venkata Sai Kumar
