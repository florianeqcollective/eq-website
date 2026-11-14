'use strict';
// Tote Links finden, bevor deployt wird. Geprueft wird das gerenderte DOM jeder Seite (also auch alles,
// was assets/site.js und assets/pages.js erst im Browser erzeugen), nicht nur der HTML-Quelltext.
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('./lib.cjs');
const S = require('./linkscan.cjs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { chromium = null; }

const KNOWN = L.known();
const known = (k, id) => (KNOWN[k] || []).includes(id);
const APP = 'https://app.eq-collective.de';
const LEGACY = /^https?:\/\/(www\.)?(zebra-kollektiv\.de|[a-z0-9-]+\.wixsite\.com|[a-z0-9-]+\.editorx\.io)/i;

let srv, base, browser, data;
test.before(async () => {
  if (!chromium) throw new Error('Playwright fehlt (npm i --no-save playwright && npx playwright install chromium)');
  ({ srv, url: base } = await L.startServer());
  browser = await chromium.launch();
  data = await S.scan(browser, base);
});
test.after(async () => { if (browser) await browser.close(); if (srv) srv.close(); });

// Zielseite einer internen Adresse als Dateiname bestimmen (null = nicht intern)
function target(fromFile, href) {
  let u;
  try { u = new URL(href, base + '/' + (fromFile === 'index.html' ? '' : fromFile)); } catch (e) { return { bad: 'ungueltige Adresse' }; }
  const own = u.origin === base || u.origin === L.BASE;
  if (!own) return null;
  let p = u.pathname.replace(/^\//, '');
  if (p === '') p = 'index.html';
  return { file: p, hash: decodeURIComponent(u.hash.replace(/^#/, '')) };
}

test('Interne Links im gerenderten DOM zeigen auf vorhandene Dateien', () => {
  const bad = [];
  for (const [f, d] of Object.entries(data)) {
    for (const l of d.links) {
      if (/^(mailto:|tel:|javascript:|data:)/i.test(l.href) || l.href === '#' || l.href === '') continue;
      const t = target(f, l.href);
      if (!t) continue;
      if (t.bad) { bad.push(f + ': ' + l.href + ' (' + t.bad + ')'); continue; }
      if (!L.exists(t.file) && !known('links', f + ' ' + l.href)) bad.push(f + ': ' + l.href + ' -> Datei fehlt (' + t.file + ')');
    }
  }
  assert.deepEqual(bad, []);
});

test('Anker (#ziel) existieren auf der Zielseite, auch seitenuebergreifend', async () => {
  // gerenderte ids der Zielseiten nachladen, falls die Zielseite nicht im Scan ist
  const idsOf = async (file) => {
    if (data[file]) return new Set(data[file].ids);
    const r = await S.openPage(browser, base, file);
    const ids = new Set((await r.page.evaluate(S.collect)).ids);
    await r.ctx.close();
    return ids;
  };
  const cache = {};
  const bad = [];
  for (const [f, d] of Object.entries(data)) {
    for (const l of d.links) {
      if (/^(mailto:|tel:|javascript:|data:)/i.test(l.href)) continue;
      if (l.href === '#cookie-einstellungen') continue; // oeffnet die Einwilligung (data-eqc-open), kein Seitenanker
      const t = target(f, l.href);
      if (!t || t.bad || !t.hash || !L.exists(t.file)) continue;
      cache[t.file] = cache[t.file] || (await idsOf(t.file));
      const key = t.file + '#' + t.hash;
      if (!cache[t.file].has(t.hash) && !known('anchors', key) && !known('anchors', f + ' ' + l.href)) bad.push(f + ': ' + l.href + ' -> Anker #' + t.hash + ' fehlt in ' + t.file);
    }
  }
  assert.deepEqual(bad, []);
});

test('mailto- und tel-Links sind wohlgeformt', () => {
  const bad = [];
  for (const [f, d] of Object.entries(data)) {
    for (const l of d.links) {
      if (/^mailto:/i.test(l.href) && !/^mailto:[^\s@?]+@[^\s@?]+\.[a-z]{2,}(\?.*)?$/i.test(l.href)) bad.push(f + ': ' + l.href);
      if (/^tel:/i.test(l.href) && !/^tel:\+?[0-9][0-9 ()-]{5,}$/.test(l.href)) bad.push(f + ': ' + l.href);
      if (/^javascript:/i.test(l.href)) bad.push(f + ': ' + l.href);
    }
  }
  assert.deepEqual(bad, []);
});

test('Keine Links auf alte Hosts (zebra-kollektiv, wixsite) und keine www-Kurzlinks /so/', () => {
  const bad = [];
  for (const [f, d] of Object.entries(data)) {
    for (const l of d.links) {
      if (LEGACY.test(l.href)) bad.push(f + ': ' + l.href);
      if (/^https?:\/\/(www\.)?eq-collective\.de\/so\//i.test(l.href)) bad.push(f + ': ' + l.href + ' (Kurzlinks liegen auf app.eq-collective.de)');
    }
  }
  assert.deepEqual(bad, []);
});

test('Newsletter-Archiv: Links aus den Wix-Daten werden auf app.eq-collective.de umgeschrieben', () => {
  const arch = data['newsletter.html'].links.filter((l) => l.inArch);
  assert.equal(arch.length, S.ARCHIV.length, 'Archiv zeigt nicht alle Testeintraege');
  const bad = arch.filter((l) => !l.href.startsWith(APP + '/so/'));
  assert.deepEqual(bad.map((l) => l.href), []);
});

test('Feste Archiv- und Blog-Listen in pages.js enthalten nur gueltige Zieladressen', () => {
  const js = L.read('assets/pages.js');
  const urls = [...js.matchAll(/https?:\/\/[^"'\s)\\]+/g)].map((m) => m[0]).filter((u) => /eq-collective\.de|zebra-kollektiv/.test(u));
  const bad = urls.filter((u) => LEGACY.test(u) || /\/\/(www\.)?eq-collective\.de\/(so|post)\//.test(u));
  assert.deepEqual([...new Set(bad)], []);
});

test('Interne Links in HTML-Quelltext und Skripten sind nie leer', () => {
  const bad = [];
  for (const [f, d] of Object.entries(data)) for (const l of d.links) if (l.href.trim() === '') bad.push(f + ': leerer href (' + l.text + ')');
  assert.deepEqual(bad, []);
});
