// Minimal static server for tests: serves public/ the way vercel.json does (cleanUrls).
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "public");
const PORT = +process.env.PORT || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if ((!fs.existsSync(f) || fs.statSync(f).isDirectory()) && fs.existsSync(f + ".html")) f += ".html";
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log("test server on " + PORT));
