# Changelog

## v2.0 (2026-11-01)
- Saved tools (favourites) now persist across visits (localStorage `aith-saved`); bad stored data is ignored safely
- Home page CSS and JS moved out of index.html (355 KB to 50 KB) into css/home and js/home
- New flat design system: one palette, Inter only, no glass, glows or WebGL background
- Removed Lenis (CDN) and Exo 2; all home scripts deferred
- Accessibility: 0 axe WCAG A/AA issues on home, tool sheet, tool and guide pages in both themes; mobile tool sheet overlap fixed
- 404 page is noindex and works at any depth
- Playwright suite: 9 data/SEO tests and 21 UI tests on desktop, tablet and mobile

## v1.6 (2026-10-27)
- 18 industry guides (/guides/name) from guides.js: CA firms, restaurants, kirana shops, clinics, coaching centres and more
- /guides index page, Guides link in page headers and the home footer

## v1.5 (2026-10-27)
- Static page for every tool (/tools/name) and category (/category/name), plus /categories and /all-tools
- build.js generates the pages and the full sitemap on each Vercel deploy, straight from data.js
- 1200x630 share image, summary_large_image cards on all pages
- "Full details" link in the tool popup, category links in the footer
- Link check on 27 Oct 2026; replaced the "Updated weekly" claim with the real check date

## v1.4 (2026-10-21)
- Code cleanup: renamed stylesheets and scripts, removed unused chart files
- Added README, LICENSE and this changelog
- Version and source link in the footer

## v1.3 (2026-10-20)
- Removed dead, duplicate and redirected tools (now 585)
- Windsurf listed as Devin Desktop, Galileo AI as Google Stitch
- Removed the submit-a-tool form

## v1.2 (2026-10-20)
- Sitemap, robots.txt and canonical URLs
- Google Search Console verification

## v1.1 (2026-10-17)
- Deployed on Vercel and GitHub Pages

## v1.0 (2026-10-15)
- First release: 592 tools in 26 categories, D2C section and guides
