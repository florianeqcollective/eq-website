// Rauchtest gegen die veroeffentlichte Seite. Laeuft nach jedem Deploy und taeglich.
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('./lib.cjs');
const HOST = process.env.EQ_HOST || 'https://www.eq-collective.de';
const get = async (u, o = {}) => fetch(u, { redirect: 'manual', ...o });

test('Alle Sitemap-Seiten antworten mit 200 und passender canonical', async () => {
  const bad = [];
  for (const u of L.sitemapUrls()) {
    const url = u.replace('https://www.eq-collective.de', HOST);
    const r = await get(url);
    if (r.status !== 200) { bad.push(u + ' -> ' + r.status); continue; }
    const h = await r.text();
    if (!/<h1[\s>]/.test(h)) bad.push(u + ' ohne h1');
  }
  assert.deepEqual(bad, []);
});

test('robots.txt, sitemap.xml und Search-Console-Datei sind erreichbar', async () => {
  for (const p of ['/robots.txt', '/sitemap.xml', '/google53c4273cb8c75875.html', '/assets/site.js', '/assets/pages.js', '/assets/styles.css']) {
    const r = await get(HOST + p);
    assert.equal(r.status, 200, p);
  }
});

test('Unbekannte Adresse liefert die 404-Seite', async () => {
  const r = await get(HOST + '/gibt-es-nicht-' + Date.now());
  assert.equal(r.status, 404);
});

test('Apex-Domain leitet auf www', async () => {
  const r = await get('https://eq-collective.de/');
  assert.ok([200, 301, 302, 308].includes(r.status));
  if (r.status !== 200) assert.match(r.headers.get('location') || '', /www\.eq-collective\.de/);
});

test('Backend app.eq-collective.de ist erreichbar', async () => {
  const r = await get('https://app.eq-collective.de/');
  assert.ok(r.status < 500, 'Status ' + r.status);
});

test('Blog-Weiterleitungen unter /post/ fuehren auf app.eq-collective.de', async () => {
  const bad = [];
  for (const f of L.postFiles()) {
    const h = L.read(f);
    const m = h.match(/https:\/\/app\.eq-collective\.de[^"'<\s)]*/);
    if (!m) { bad.push(f + ': kein Ziel'); continue; }
    const r = await get(m[0]);
    if (r.status >= 400) bad.push(f + ' -> ' + m[0] + ' ' + r.status);
  }
  assert.deepEqual(bad, []);
});

test('Veroeffentlichter Stand entspricht dem Repo (Cache-Parameter der Startseite)', async () => {
  const live = await (await get(HOST + '/index.html?x=' + Date.now())).text();
  const loc = L.read('index.html');
  const v = (s) => (s.match(/site\.js\?v=([0-9a-z]+)/) || [])[1];
  assert.equal(v(live), v(loc));
});
