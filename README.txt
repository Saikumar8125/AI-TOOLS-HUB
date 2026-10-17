AI Tools Hub - deploy package
Upload this whole folder to any static host: Netlify Drop, Vercel, GitHub Pages or Cloudflare Pages. No build step. Entry: index.html.
After you have a domain: add <link rel="canonical" href="https://YOUR-DOMAIN/"> and make og:image an absolute URL for best WhatsApp/LinkedIn previews.
Tool submission form: set `endpoint` (Formspree / Google Apps Script URL) in the config near the top of index.html; empty = email/copy fallback.

HOW TO ADD / EDIT TOOLS (full control)
All tools live in ONE file: data.js. You never need to touch index.html.
- Add: copy any line in AITH_TOOLS, paste it, change n/u/c/p. Then add a matching line in AITH_DESC.
- Edit: change the text on that tool's line.
- Remove: delete its line in both lists.
Counts (592 etc.) and categories update automatically from the data.
On GitHub: open data.js -> pencil icon -> edit -> Commit changes. Site updates in 1-2 minutes.

LEGAL PAGES: privacy.html and terms.html (linked in the footer). Edit the text directly if needed.
AFTER GITHUB PAGES IS LIVE: Settings -> Pages -> tick "Enforce HTTPS".

EXTRA PAGES (all in the same folder, no subfolders): d2c.html (D2C tools), guide-amazon.html, guide-shopify.html, guide-whatsapp.html, each with its own .css file. Upload all files together.
