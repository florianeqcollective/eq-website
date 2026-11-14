'use strict';
// Gemeinsame Helfer fuer alle Tests. Keine Abhaengigkeiten ausser Playwright (nur Browser-Tests).
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://www.eq-collective.de';

const EXCLUDE_FILES = new Set(['google53c4273cb8c75875.html']);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const htmlFiles = () => fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !EXCLUDE_FILES.has(f)).sort();
const postFiles = () => (exists('post') ? fs.readdirSync(path.join(ROOT, 'post')).filter((f) => f.endsWith('.html')).sort().map((f) => 'post/' + f) : []);

const meta = (h, name) => { const m = h.match(new RegExp('<meta[^>]+name="' + name + '"[^>]*content="([^"]*)"', 'i')); return m ? m[1] : null; };
const metaProp = (h, p) => { const m = h.match(new RegExp('<meta[^>]+property="' + p + '"[^>]*content="([^"]*)"', 'i')); return m ? m[1] : null; };
const title = (h) => { const m = h.match(/<title>([^<]*)<\/title>/i); return m ? m[1].trim() : null; };
const canonical = (h) => { const m = h.match(/<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i); return m ? m[1] : null; };
const robots = (h) => meta(h, 'robots');
const isRedirect = (h) => /http-equiv="refresh"/i.test(h);
const isNoindex = (h) => /noindex/i.test(robots(h) || '');
const visibleText = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<head[\s\S]*?<\/head>/i, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const hrefs = (h) => [...h.matchAll(/<a\b[^>]*\shref="([^"]*)"/gi)].map((m) => m[1]);
const srcs = (h) => [...h.matchAll(/<(?:img|script|source|iframe)\b[^>]*\ssrc="([^"]*)"/gi)].map((m) => m[1]);
const sitemapUrls = () => [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urlToFile = (u) => { const p = u.replace(BASE, '').replace(/^\//, ''); return p === '' ? 'index.html' : p; };
const known = () => JSON.parse(read('tests/known-issues.json'));

function startServer(port = 0) {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      let f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { f = path.join(ROOT, '404.html'); res.statusCode = 404; }
      res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
      res.end(fs.readFileSync(f));
    });
    srv.listen(port, '127.0.0.1', () => resolve({ srv, url: 'http://127.0.0.1:' + srv.address().port }));
  });
}
module.exports = { ROOT, BASE, read, exists, htmlFiles, postFiles, meta, metaProp, title, canonical, robots, isRedirect, isNoindex, visibleText, hrefs, srcs, sitemapUrls, urlToFile, known, startServer, EXCLUDE_FILES };
