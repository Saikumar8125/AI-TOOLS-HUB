# Changelog

## v3.14 · 3 Nov 2026
- Different sounds for different controls (when sound is on): primary buttons click, other buttons tap, chips select, tabs switch, theme and sound buttons toggle, FAQ expand and collapse, menu open and close. Eight new Kenney CC0 sounds (see SFX-LICENSES.md); build.js checks all twelve.
- Menu button: the three lines now morph into an x and back (CSS, follows aria-expanded), replacing the instant icon swap.

## v3.13 · 3 Nov 2026
- FAQ ("Questions, answered" and guide FAQs): answers open and close smoothly (height eases, text fades in) instead of snapping, with the plus turning to an x. `sfx.js` handles every `<details>`.
- Mobile menu: grows open from the header so the page slides down with it, links stagger in, and the menu icon spins to x; closing reverses. A tap mid-animation reverses from where it is.
- Sounds (when turned on): "open" when a FAQ answer or the menu opens, "click" when they close, and "click" on every button, chip and tab. A page's own sound (add, open, success) still wins.
- Reduced motion: menu and FAQ snap open with no animation.

## v3.12 · 3 Nov 2026
- New logo: magnifier over a tool grid, in the site's teal, paper and marigold. New app icons and share image (og-image.png).
- India facts checked on official pages for 35 more popular tools; 35 tools are now Verified for India (was 10). Each tool shows its own check date.
- Removed 2 shut-down tools: Lovo (company liquidated May 2026) and Hashtagify (offline since 2024). Their old pages 301 to their category (vercel.json). Now 583 tools.
- Fixed links: Paper Digest (paperdigest.org), Skybox AI (blockadelabs.com), Summarize.tech (www).

## v3.2.2 · 2 Nov 2026
- Contact & Grievances page (`contact.html`) removed at the owner's request, with its footer, related-page and sitemap links. Privacy and Terms keep their own Contact sections with placeholders; a working contact channel is still needed before public launch.

## v3.2.1 · 2 Nov 2026
- Sound files moved flat to the repo root (`click.mp3`, `open.mp3`, `add.mp3`, `success.mp3`) so they upload from a phone without folders. `sfx.js` loads `/<name>.mp3`; `build.js` fails if one is missing. `assets/` folder removed.

## v3.2 · 2 Nov 2026
Optional interface sounds. Off by default; nothing loads until you turn them on.

- **Sound toggle** in the header next to the theme button on the home page, every generated page (build.js), the seller guides, the legal pages and the 404 page. A button with `aria-pressed`, label "Sound effects", Lucide `volume-x` / `volume-2` icons (added to `icons.svg`, ISC). Preference in localStorage `aith-sound` (`"1"` / `"0"`).
- **sfx.js** (new, no dependencies): four sounds at volume 0.08, one at a time (the previous one stops), `play()` rejections caught, nothing plays while the tab is hidden, files fetched only once sound is on. Sounds: `click` (primary action buttons such as Find tools, Compare and Open GitHub issue; not the search button), `open` (tool details sheet), `add` (add to compare, save a tool on the home page or a tool page), `success` (Copy details in the suggest form, only when the copy worked). No sound on hover, typing, scrolling, page load or filters.
- **assets/sfx/**: `click.mp3`, `open.mp3`, `add.mp3`, `success.mp3` from Kenney's Interface Sounds pack (CC0), mono MP3, 1–3 KB each. Sources and licence in `SFX-LICENSES.md`. build.js now copies `assets/` to `public/assets/`.
- **Privacy Policy** lists `aith-sound`; the Privacy and Cookie pages say the sound files load from this site itself (no other legal text changed). The Clear-data button also removes `aith-sound`.
- Footer version: v3.2 · Updated 2 Nov 2026.
- Tests: sound off by default with no `/assets/sfx/` requests, toggle state, persistence and keyboard use, the right sound for each action, no sound on typing/hover/scroll/filters, no console errors, files exist, are copied by the build, are under 20 KB and return 200, licences listed.

## v3.1 · 2 Nov 2026
Legal and copyright pages. Plain-language drafts, not yet reviewed by a lawyer (each page says so).

- **Privacy Policy** (`privacy.html`) rewritten from an audit of the code: the four localStorage keys (`aith-theme`, `aith-saved`, `aith-compare`, `aith-recent`) in a table, search words in the page address (`?q=`), no analytics or tracking scripts (checked in the code), the suggest/report flow that opens GitHub and sends nothing to the site, Vercel hosting logs, Google Fonts, Google's s2 favicon service, retention, security, rights, children (under 18 under the DPDP Act) and the DPDP Act 2023 / DPDP Rules 2025 phase-in dates (13 Nov 2025, ~13 Nov 2026, ~13 May 2027) with PIB and MeitY sources. No compliance claim.
- **Terms & Conditions** (`terms.html`) rewritten: website use, third-party tools and links, pricing accuracy, availability, suggestions via prefilled GitHub issues, prohibited activities, intellectual property, no professional advice, limitation of liability, governing law, changes, contact.
- **New pages**: Cookie Policy (`cookies.html`: the site sets no cookies; localStorage and third-party requests explained), Copyright & Trademark Policy (`copyright.html`: trademarks, no endorsement, favicon/Lucide ISC/Geist OFL attribution, complaint, review and correction/removal process), Third-Party Disclaimer (`disclaimer.html`), Contact & Grievances (`contact.html`).
- Owner details that are not on record are shown as marked placeholders (owner email, postal address, grievance contact, response time, courts' city). Nothing invented.
- Every legal page: same header and nav, breadcrumb, visible "Last updated 2 Nov 2026", draft note, table of contents on long pages, title, description, canonical, Open Graph, Twitter and robots tags, WebPage JSON-LD.
- **Footers**: a "Legal" column with all six pages on the home page, every generated page (build.js), the seller guides and the legal pages; legal links in the D2C and 404 footers.
- **build.js**: `LEGAL` list feeds the footer and the sitemap; the build stops with a clear message if a legal page is missing from the repo root. Sitemap: 643 URLs (639 + 4 new pages).
- **Privacy controls**: "Clear AI Tools Hub data in this browser" button on the privacy and cookie pages (removes only the four `aith-*` keys).
- **d2c.html**: tool favicons now load with `referrerpolicy="no-referrer"`, like the rest of the site.
- **vercel.json**: security headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` (camera, microphone, geolocation, payment, usb off). CSP not added yet (inline scripts would need hashes first).
- Footer version: v3.1 · Updated 2 Nov 2026.
- Tests: legal pages build and return 200, meta/canonical/Last updated/draft note, TOC anchors, placeholders present and no invented contact or company details, policy matches the code (keys, no cookies or analytics), footer links on home/tool/category/guide/d2c/404/legal pages, every internal link on the legal pages resolves, axe (light and dark), no overflow at 360/390/768/1440, sitemap, Clear-data button.

## v3.0.1 · 2 Nov 2026
- India status is now explicit for every tool: **Verified for India** (10 tools, facts confirmed on official pages 11 Oct 2026), **India availability not verified** (575), **Not available in India** (only with a confirmed official source; 0 today).
- Directory filter is a 3-way "India status" select (`?india=verified|unverified|unavailable`; old `?india=1` still works).
- Cards, tool sheet, compare table, tool pages, FAQ and India section use the same three labels. No tool is marketed as India-supported without verified facts.

## v3.0 (2026-11-02)
Premium redesign and product upgrade. Same vanilla HTML/CSS/JS, same data, same URLs.

- **Design system** (`ds.css`): one token set for colour, type, spacing, radius, shadow and motion; neutral light theme and deep charcoal dark theme with one electric-blue accent; Geist (Google Fonts, swap) with Inter/system fallback; Lucide icons as a local SVG sprite (`icons.svg`, ISC). Shared by every page: home, tool/category/guide pages, D2C, seller guides, privacy, terms, 404.
- **Homepage** rebuilt: task-first hero search with live suggestions and reasons, popular searches, one-line stats from data.js, tool of the day, "Start here" tabs (Featured, Trending picks, Best free, Latest additions), AI Tool Finder, categories bento (pre-rendered by build.js, crawlable), directory, India section, guides, FAQ (+ FAQPage JSON-LD), Suggest a tool form, recently viewed.
- **Search** (`finder.js`): one deterministic matcher for the hero, the Ctrl/Cmd+K palette, the directory and the Finder. Synonyms + weighted fields (name, category, highlights, description, website), prefix matching while typing, and a "why it matches" reason for every result.
- **Directory**: real-time search, category, pricing, India-verified filter, job chips, sort (Featured / Best match / A–Z / Latest additions), active-filter chips, clear all, result count, pagination, and URL state (`?q=&cat=&price=&india=&job=&sort=&page=`) restored on load and shareable. `?tool=<slug>` opens a tool sheet.
- **Tool cards**: logo, name, category, description, pricing badge, free-plan line, India-verified badge (only from `#india-data`), Visit, Details, Save, Compare.
- **Tool sheet** (side drawer on desktop, bottom sheet on mobile): overview, key features, use cases, facts (directory data, links checked 27 Oct 2026), platforms (Not verified), India availability (verified with sources, or Not verified), alternatives in the category, similar tools in other categories, guides that pick it, report link, focus trap and Escape.
- **AI Tool Finder**: task, ₹ budget, pricing model and must-haves; transparent scoring with reasons; budget maps to pricing models only (no INR prices in our data) and says so; `AITHFinder.setEngine()` / `recommendAsync()` ready for a future LLM.
- **Compare**: up to 4 tools (5th blocked with a message), persisted in `aith-compare`, table with pricing, free plan, features, use cases, platforms, India support, pros and limitations from our data; scrolls sideways on mobile.
- **Recently viewed** (`aith-recent`), also recorded on tool pages; tool pages get a Save button that shares `aith-saved`.
- **Suggest a tool**: validated form (required fields, https URL, duplicate name/URL detection) that opens a prefilled GitHub issue, with a Copy details fallback. No backend, nothing stored.
- **Honesty fixes**: removed "Trusted tools", "people are talking about", "Saved for this visit", "We re-check every month" and the unverified "widely used by Indian sellers / pay via international card" note; "Trending" and "Featured" are labelled as hand-picked; "Latest additions" is based on data.js order (the 19 tools appended after the category-grouped catalogue), no dates shown.
- **Privacy policy** corrected to match the site (localStorage keys, GitHub issues, Google Fonts; the old jsDelivr mention was out of date).
- **Generated pages**: new header (search, theme toggle), breadcrumbs, India availability panel, platforms "Not verified", free-plan line, favicons on cards, no eyebrow labels.
- **Removed**: intro splash, canvas background, grain, marquees, drifting tiles, count-up, sound effects, pull-to-refresh on home, dead `SUBMIT_CONFIG` code, `hero.css`, `styles.css`, `main.js`.
- **Accessibility**: 0 serious/critical axe issues (WCAG 2.1 A/AA) on home (light and dark, with sheet, compare and palette open), tool pages, category, guide, D2C and seller guide pages; visible focus, skip links, reduced-motion support.
- **Tests**: data, finder unit, UI (desktop, tablet, mobile), overflow at 360–1920 px and axe suites.

## v2.1 (2026-11-01)
- Home stats now match data.js (89 free, 379 freemium); build.js writes the counts into the static HTML so they can't drift
- One link-check date everywhere (27 Oct 2026, the last real check); removed unsupported "re-checked monthly/regularly" claims
- "Report a wrong link or price" on every tool sheet and tool page, plus "Suggest a tool" and "Report a problem" in footers (prefilled GitHub issues, no backend)
- Guides: 21 in total = 18 business-type guides + 3 seller guides

## v2.0 (2026-11-01)
- Saved tools (favourites) now persist across visits (localStorage `aith-saved`); bad stored data is ignored safely
- Home page CSS and JS moved out of index.html (355 KB to 50 KB) into home.css and home.js
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
