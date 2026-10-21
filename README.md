# AI Tools Hub

A curated directory of **585 AI tools in 26 categories**, built for Indian small businesses: shop owners, restaurants, CA firms and D2C brands.

**Live:** https://aitoolshub-in.vercel.app/

## Features

- Search, category and "by job" filters
- Tool details popup with pricing (Free / Freemium / Paid) and highlights
- India badges for tools verified as made in or built for India
- D2C seller section and guides (Amazon, Shopify, WhatsApp)
- Save and compare tools (stored locally in the browser)
- Dark / light theme, works offline-friendly on mobile

## Tech stack

Plain HTML, CSS and vanilla JavaScript. No framework, no build step.
Hosted on Vercel and GitHub Pages.

## Project structure

```
index.html        Home page and tool directory
data.js           All tools (name, link, category, pricing, description)
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
python3 -m http.server 8000
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
