'use strict';
// Tote Links im Netz finden: Daten aus Wix (Newsletter-Archiv, Blog) und alle festen externen Adressen.
// Laeuft nach jedem Deploy und taeglich (Workflow Tests, Job live). Braucht kein Playwright.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const L = require('./lib.cjs');

const KNOWN = L.known();
const API = 'https://www.wixapis.com';
const CID = 'b40ee72d-5f62-4889-9f72-e1b5949339f7';
const APP = 'https://app.eq-collective.de';
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; eq-link-check/1.0; +https://www.eq-collective.de)' };

async function status(url, tries = 3) {
  let last = 'keine Antwort';
  for (let i = 0; i < tries; i++) {
    try {
      const c = new AbortController(); const t = setTimeout(() => c.abort(), 20000);
      let r = await fetch(url, { redirect: 'follow', signal: c.signal, headers: UA });
      clearTimeout(t);
      last = r.status;
      if (r.status < 400) return r.status;
      if ([404, 410].includes(r.status)) return r.status;
    } catch (e) { last = 'Fehler ' + (e.cause && e.cause.code ? e.cause.code : e.message); }
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  return last;
}
const dead = (s) => s === 404 || s === 410 || (typeof s === 'string' && /ENOTFOUND|ECONNREFUSED|CERT/.test(s));

async function core(path, body) {
  const t = await (await fetch(API + '/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: CID, grantType: 'anonymous' }) })).json();
  assert.ok(t.access_token, 'Kein anonymes Token von Wix');
  const r = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: t.access_token }, body: JSON.stringify(body) });
  assert.equal(r.status, 200, path + ' -> ' + r.status);
  return r.json();
}
// dieselbe Umschreibung wie in assets/site.js
const rewrite = (u) => String(u).replace(/^https?:\/\/(www\.)?(eq-collective|zebra-kollektiv)\.de\/so\//, APP + '/so/');

test('Newsletter-Archiv aus Wix: jeder Eintrag fuehrt (nach Umschreibung) zu einer erreichbaren Seite', async () => {
  const j = await core('/wix-data/v2/items/query', { dataCollectionId: 'NewsletterArchiv', query: { sort: [{ fieldName: 'datum', order: 'DESC' }], paging: { limit: 100 } } });
  const items = (j.dataItems || []).map((x) => x.data).filter((x) => x && x.titel && x.url);
  assert.ok(items.length > 0, 'Archiv ist leer');
  const bad = [];
  for (const it of items) {
    const u = rewrite(it.url);
    const s = await status(u);
    if (typeof s !== 'number' || s >= 400) bad.push(it.titel + ' -> ' + u + ' (' + s + ')');
  }
  assert.deepEqual(bad, []);
});

test('Blog aus Wix: jeder Beitrag ist unter app.eq-collective.de/post/ erreichbar', async () => {
  const j = await core('/blog/v3/posts/query', { query: { paging: { limit: 100 } }, fieldsets: ['URL'] });
  const posts = j.posts || [];
  assert.ok(posts.length > 0, 'Keine Blogbeitraege');
  const bad = [];
  for (const p of posts) {
    const u = APP + '/post/' + encodeURI(p.slug);
    const s = await status(u);
    if (typeof s !== 'number' || s >= 400) bad.push(p.title + ' -> ' + u + ' (' + s + ')');
  }
  assert.deepEqual(bad, []);
});

// feste Adressen aus HTML und Skripten
const IGNORE_HOST = /(^|\.)(w3\.org|schema\.org|googleapis\.com|gstatic\.com|example\.(com|org)|wixapis\.com)$/i;
function externalUrls() {
  const files = [...L.htmlFiles(), ...fs.readdirSync(path.join(L.ROOT, 'assets')).filter((f) => f.endsWith('.js')).map((f) => 'assets/' + f)];
  const set = new Map();
  for (const f of files) {
    const s = L.read(f);
    for (const m of s.matchAll(/https?:\/\/[A-Za-z0-9.-]+(?:\/[^\s"'<>)\\`]*)?/g)) {
      let u = m[0].replace(/[.,;]+$/, '');
      const after = s.slice(m.index + m[0].length, m.index + m[0].length + 2);
      if (/^['"]\s*\+/.test(after) || /\+\s*$/.test(u)) continue; // zusammengesetzte Adresse, nur Anfang bekannt
      let host; try { host = new URL(u).hostname; } catch (e) { continue; }
      if (/\/so\/$/.test(u)) continue; // Anfang der Kurzlink-Adresse in site.js, kein ganzer Link
      if (IGNORE_HOST.test(host) || host === 'www.eq-collective.de' || host === 'eq-collective.de') continue;
      if (!set.has(u)) set.set(u, f);
    }
  }
  return set;
}

test('Feste externe Links in HTML und Skripten sind nicht tot (404, 410, Domain weg)', async () => {
  const urls = externalUrls();
  const allow = new Set(KNOWN.externalLinks || []);
  const bad = [], warn = [];
  const list = [...urls].filter(([u]) => !allow.has(u));
  let i = 0;
  const worker = async () => {
    while (i < list.length) {
      const [u, f] = list[i++];
      const s = await status(u);
      if (typeof s === 'number' && s < 400) continue;
      if (dead(s)) bad.push(f + ': ' + u + ' (' + s + ')'); else warn.push(f + ': ' + u + ' (' + s + ')');
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  if (warn.length) console.log('Hinweis, nicht eindeutig tot (Sperre gegen Pruefprogramme moeglich):\n' + warn.join('\n'));
  assert.deepEqual(bad, []);
});
