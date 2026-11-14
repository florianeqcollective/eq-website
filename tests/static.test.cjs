'use strict';
// Statische Pruefungen ohne Browser. Laufzeit: unter 2 Sekunden.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
const L = require('./lib.cjs');
const files = L.htmlFiles();
const pages = files.filter((f) => !L.isRedirect(L.read(f)));
const redirects = files.filter((f) => L.isRedirect(L.read(f)));
const KNOWN = L.known();
const isKnown = (kind, id) => (KNOWN[kind] || []).includes(id);
const fails = (kind, list) => list.filter((x) => !isKnown(kind, typeof x === 'string' ? x : x.id)).map((x) => (typeof x === 'string' ? x : x.msg));

const INTERNAL = ['intern.html', 'fotos.html', '404.html']; // Werkzeug- und Fehlerseiten, nur noindex noetig
const PUBLIC = pages.filter((f) => !INTERNAL.includes(f));
const INDEXABLE = PUBLIC.filter((f) => !L.isNoindex(L.read(f)));

test('Grundbestand: erwartete Dateien sind da', () => {
  for (const f of ['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'assets/site.js', 'assets/pages.js', 'assets/styles.css', 'google53c4273cb8c75875.html', '.nojekyll']) assert.ok(L.exists(f), 'fehlt: ' + f);
  assert.equal(L.read('CNAME').trim(), 'www.eq-collective.de');
  assert.equal(L.read('google53c4273cb8c75875.html').trim(), 'google-site-verification: google53c4273cb8c75875.html');
});

test('robots.txt erlaubt alles und nennt die Sitemap', () => {
  const r = L.read('robots.txt');
  assert.match(r, /User-agent: \*/);
  assert.match(r, /Allow: \//);
  assert.doesNotMatch(r, /Disallow: \/\s*$/m);
  assert.match(r, /Sitemap: https:\/\/www\.eq-collective\.de\/sitemap\.xml/);
});

test('Interne Seiten und Fehlerseite sind noindex', () => {
  for (const f of INTERNAL) assert.ok(L.isNoindex(L.read(f)) || isKnown('noindex', f), f + ' ist indexierbar');
});

test('Jede oeffentliche Seite hat Doctype, lang=de, Viewport, Title, Canonical', () => {
  const bad = [];
  for (const f of PUBLIC) {
    const h = L.read(f);
    if (!/^<!doctype html>/i.test(h)) bad.push(f + ': Doctype');
    if (!/<html lang="de"/.test(h)) bad.push(f + ': lang=de');
    if (!/name="viewport"/.test(h)) bad.push(f + ': viewport');
    const t = L.title(h);
    if (!t) bad.push(f + ': title fehlt');
    if (!L.canonical(h)) bad.push(f + ': canonical fehlt');
  }
  assert.deepEqual(bad, []);
});

test('Title: eindeutig, 15 bis 75 Zeichen, Marke am Ende (indexierbare Seiten)', () => {
  const seen = new Map();
  const bad = [];
  for (const f of INDEXABLE) {
    const t = L.title(L.read(f));
    if (t.length < 15 || t.length > 75) bad.push({ id: f, msg: f + ': Title-Laenge ' + t.length });
    if (!/\| EQ Collective$/.test(t) && f !== 'index.html') bad.push({ id: f + ':marke', msg: f + ': Marke fehlt am Ende' });
    if (seen.has(t)) bad.push({ id: f + ':dup', msg: f + ': Title doppelt mit ' + seen.get(t) });
    seen.set(t, f);
  }
  assert.deepEqual(fails('title', bad), []);
});

test('Description: vorhanden, 70 bis 175 Zeichen, eindeutig (indexierbare Seiten)', () => {
  const seen = new Map();
  const bad = [];
  for (const f of INDEXABLE) {
    const d = L.meta(L.read(f), 'description');
    if (!d) { bad.push({ id: f, msg: f + ': description fehlt' }); continue; }
    if (d.length < 70 || d.length > 175) bad.push({ id: f, msg: f + ': description-Laenge ' + d.length });
    if (seen.has(d)) bad.push({ id: f + ':dup', msg: f + ': description doppelt mit ' + seen.get(d) });
    seen.set(d, f);
  }
  assert.deepEqual(fails('description', bad), []);
});

test('Canonical zeigt auf die eigene Adresse (indexierbare Seiten)', () => {
  const bad = [];
  for (const f of INDEXABLE) {
    const c = L.canonical(L.read(f));
    const expect = f === 'index.html' ? L.BASE + '/' : L.BASE + '/' + f;
    if (c !== expect) bad.push(f + ': ' + c + ' statt ' + expect);
  }
  assert.deepEqual(bad, []);
});

test('Open Graph: og:title, og:description, og:url, og:image passen zu Title und Canonical', () => {
  const bad = [];
  for (const f of INDEXABLE) {
    const h = L.read(f);
    if (L.metaProp(h, 'og:title') !== L.title(h)) bad.push({ id: f, msg: f + ': og:title weicht ab' });
    if (!L.metaProp(h, 'og:description')) bad.push({ id: f + ':ogd', msg: f + ': og:description fehlt' });
    if (L.metaProp(h, 'og:url') !== L.canonical(h)) bad.push({ id: f + ':ogu', msg: f + ': og:url weicht ab' });
    if (!L.metaProp(h, 'og:image')) bad.push({ id: f + ':ogi', msg: f + ': og:image fehlt' });
  }
  assert.deepEqual(fails('og', bad), []);
});

test('Sitemap und indexierbare Seiten sind deckungsgleich', () => {
  const urls = L.sitemapUrls();
  assert.equal(new Set(urls).size, urls.length, 'doppelte Eintraege');
  const inMap = new Set(urls.map(L.urlToFile));
  const should = new Set(INDEXABLE);
  const missing = [...should].filter((f) => !inMap.has(f) && !isKnown('sitemap', f));
  const extra = [...inMap].filter((f) => !should.has(f) && !isKnown('sitemap', f));
  assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
  for (const f of inMap) assert.ok(L.exists(f), 'Sitemap nennt fehlende Datei ' + f);
  for (const m of L.read('sitemap.xml').matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
});

test('Seiten ohne Sitemap-Eintrag sind noindex oder Weiterleitung', () => {
  const inMap = new Set(L.sitemapUrls().map(L.urlToFile));
  const bad = pages.filter((f) => !inMap.has(f) && !L.isNoindex(L.read(f)) && !isKnown('noindex', f) && !INTERNAL.includes(f));
  assert.deepEqual(bad, [], 'indexierbar, aber nicht in der Sitemap: ' + bad.join(', '));
});

test('Genau eine h1 im statischen HTML jeder Seite', () => {
  const bad = [];
  for (const f of PUBLIC) {
    if (L.isNoindex(L.read(f))) continue; // noindex-Hilfsseiten brauchen keine h1
    const n = (L.read(f).match(/<h1[\s>]/g) || []).length;
    if (n !== 1 && !isKnown('h1', f)) bad.push(f + ': ' + n + ' h1');
  }
  assert.deepEqual(bad, []);
});

test('Interne Links und Ressourcen zeigen auf vorhandene Dateien', () => {
  const bad = [];
  for (const f of [...pages, ...redirects]) {
    const h = L.read(f);
    for (const x of [...L.hrefs(h), ...L.srcs(h), ...[...h.matchAll(/<link[^>]+href="([^"]*)"/g)].map((m) => m[1])]) {
      if (/^(https?:|mailto:|tel:|#|data:|javascript:|\/\/)/.test(x)) continue;
      const p = x.split('#')[0].split('?')[0];
      if (!p) continue;
      if (!L.exists(p)) bad.push({ id: f + '>' + x, msg: f + ' -> ' + x });
    }
  }
  assert.deepEqual(fails('links', bad), []);
});

test('Anker-Links (#id) zeigen auf vorhandene ids der Zielseite oder werden zur Laufzeit erzeugt', () => {
  // Statisch nur prueft: Anker auf andere Seiten verweisen auf existierende Seiten (siehe oben). Hier: gleiche Seite.
  const bad = [];
  for (const f of pages) {
    const h = L.read(f);
    for (const x of L.hrefs(h)) {
      if (!/^#./.test(x)) continue;
      const id = x.slice(1);
      if (!new RegExp('id="' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(h) && !isKnown('anchors', f + x)) bad.push(f + ' -> ' + x);
    }
  }
  assert.deepEqual(bad, []);
});

test('Cache-Parameter ?v= ist je Datei in allen HTML-Dateien identisch', () => {
  const by = {};
  for (const f of [...files, ...L.postFiles()]) for (const m of L.read(f).matchAll(/assets\/([a-z.]+\.(?:js|css))\?v=([0-9a-z]+)/g)) (by[m[1]] = by[m[1]] || new Set()).add(m[2]);
  const bad = Object.entries(by).filter(([, v]) => v.size > 1).map(([k, v]) => k + ': ' + [...v].join(', '));
  assert.deepEqual(bad, []);
  // pages.js und site.js laufen immer gemeinsam
  assert.deepEqual([...by['pages.js']], [...by['site.js']]);
});

test('JavaScript-Dateien sind syntaktisch gueltig', () => {
  for (const f of ['assets/site.js', 'assets/pages.js', 'assets/intern.js']) {
    assert.doesNotThrow(() => new vm.Script(L.read(f), { filename: f }), f);
  }
});

test('JSON-LD ist gueltiges JSON mit @context und @type', () => {
  const bad = [];
  for (const f of pages) {
    for (const m of L.read(f).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { const j = JSON.parse(m[1]); if (!j['@context'] || !j['@type']) bad.push(f + ': @context/@type fehlt'); } catch (e) { bad.push(f + ': ' + e.message); }
    }
  }
  assert.deepEqual(bad, []);
});

test('Startseite traegt ProfessionalService mit Einsatzgebiet, Kontakt stimmt', () => {
  const h = L.read('index.html');
  const j = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(j['@type'], 'ProfessionalService');
  const area = JSON.stringify(j.areaServed);
  for (const w of ['Süddeutschland', 'Tirol', 'Salzburger Land', 'Rosenheim']) assert.ok(area.includes(w), w);
  assert.equal(j.email, 'aloha@eq-collective.de');
  assert.equal(j.telephone, '+4916099340307');
  assert.equal(j.address.addressLocality, 'Rosenheim');
});

test('FAQ-Seiten: FAQPage-Daten passen zu den sichtbaren Fragen', () => {
  const h = L.read('anlass-fuehrungskraefte.html');
  const j = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(j['@type'], 'FAQPage');
  assert.ok(j.mainEntity.length >= 5);
  const text = L.visibleText(h);
  for (const q of j.mainEntity) assert.ok(text.includes(q.name.replace(/\s+/g, ' ')), 'Frage nicht sichtbar: ' + q.name);
});

test('Weiterleitungsseiten: meta refresh, canonical, Ziel existiert', () => {
  assert.ok(redirects.length >= 6);
  const bad = [];
  for (const f of [...redirects, ...L.postFiles()]) {
    const h = L.read(f);
    const m = h.match(/http-equiv="refresh"[^>]*content="0;\s*url=([^"]+)"/i);
    if (!m) { bad.push(f + ': kein meta refresh'); continue; }
    const target = m[1];
    if (!/^https:\/\/app\.eq-collective\.de\/post\//.test(target) && !target.startsWith('https://') && !L.exists(target)) bad.push(f + ': Ziel fehlt ' + target);
    if (!/location\.replace/.test(h)) bad.push(f + ': JS-Weiterleitung fehlt');
    if (!L.canonical(h)) bad.push(f + ': canonical fehlt');
  }
  assert.deepEqual(bad, []);
});

test('Alte Wix-Adressen haben eine Weiterleitung', () => {
  for (const f of ['fuer-teams.html', 'teams.html', 'fuer-organisationen.html', 'blog.html', 'contact.html', 'about.html']) assert.ok(L.isRedirect(L.read(f)), f);
  assert.ok(L.postFiles().length >= 18, 'Blog-Weiterleitungen unter post/: ' + L.postFiles().length);
});

test('Verbotene Begriffe tauchen nirgends auf', () => {
  const banned = [/Rollencheck/i, /lorem ipsum/i, /\bTODO\b/, /\bundefined\b/, /\bNaN\b/, /\[object Object\]/, /Zebra-Profil/i, /wixsite\.com/i, /1f0f29f7-ee7e-44df-bb71-896f534c2a54/];
  const bad = [];
  for (const f of [...files, 'assets/pages.js', 'assets/site.js']) {
    const raw = L.read(f);
    if (!f.endsWith('.html')) continue; // Skripte enthalten legitim 'undefined'; Laufzeit prueft der Browsertest
    for (const b of banned) if (b.test(L.visibleText(raw))) bad.push({ id: f + ':' + b, msg: f + ' enthaelt ' + b });
  }
  assert.deepEqual(fails('banned', bad), []);
});

test('Stimme: keine Gedankenstriche im sichtbaren Text', () => {
  const bad = [];
  for (const f of pages) {
    const t = L.visibleText(L.read(f));
    const m = t.match(/.{0,30}[–—].{0,30}/);
    if (m) bad.push({ id: f, msg: f + ': "' + m[0] + '"' });
  }
  assert.deepEqual(fails('dashes', bad), []);
});

test('Stimme: keine Gedankenstriche in den Texten von pages.js', () => {
  const t = L.read('assets/pages.js');
  const bad = [];
  for (const m of t.matchAll(/'((?:[^'\\\n]|\\.){12,})'/g)) if (/[–—]/.test(m[1]) && !isKnown('dashes-js', m[1].slice(0, 40))) bad.push(m[1].slice(0, 60));
  assert.deepEqual(bad, []);
});

test('Stimme: keine typischen KI-Floskeln im sichtbaren Text', () => {
  const rx = [/in der heutigen (?:schnelllebigen )?(?:Zeit|Welt)/i, /tauchen (?:wir|sie) ein/i, /Zusammenfassend l(?:ae|ä)sst sich/i, /nicht nur[^.]{3,60}sondern auch/i, /ein echter Game[- ]?Changer/i, /gamechanger/i, /\bnahtlos\b/i, /ganzheitlich(?:e|er|en)? Ansatz/i];
  const bad = [];
  for (const f of pages) { const t = L.visibleText(L.read(f)); for (const r of rx) { const m = t.match(r); if (m && !isKnown('floskeln', f + ':' + m[0])) bad.push({ id: f + ':' + m[0], msg: f + ': ' + m[0] }); } }
  assert.deepEqual(bad.map((b) => b.msg), []);
});

test('Kontaktdaten sind ueberall dieselben', () => {
  const okMail = new Set(['aloha@eq-collective.de', 'poststelle@lda.bayern.de']);
  const bad = [];
  for (const f of [...pages, 'assets/pages.js', 'assets/site.js']) {
    const raw = L.read(f);
    for (const m of raw.matchAll(/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g)) {
      const mail = m[0].toLowerCase();
      if (/^(?:\d|.*\.(?:png|jpg|svg|woff2?))/.test(mail)) continue;
      if (!okMail.has(mail) && !isKnown('mails', f + ':' + mail)) bad.push({ id: f + ':' + mail, msg: f + ': ' + mail });
    }
    for (const m of raw.matchAll(/tel:([+0-9]+)/g)) if (m[1] !== '+4916099340307' && !isKnown('tel', f + ':' + m[1])) bad.push({ id: f + ':' + m[1], msg: f + ': Telefon ' + m[1] });
  }
  assert.deepEqual(fails('contacts', bad), []);
});

test('Footer: Region-Zeile steht in der Vorlage fuer alle Seiten', () => {
  const s = L.read('assets/site.js');
  assert.ok(s.includes('Training und Organisationsentwicklung aus Rosenheim, für Süddeutschland, Tirol und das Salzburger Land.'));
  assert.ok(!/key==='index'\?''/.test(s), 'Startseite darf die Region-Zeile in der Fußzeile nicht verlieren');
});

test('Bilder: alt-Attribut vorhanden, Quelle gueltig (statisches HTML)', () => {
  const bad = [];
  for (const f of pages) {
    for (const m of L.read(f).matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      if (!/\balt=/.test(tag)) bad.push({ id: f + ':noalt', msg: f + ': img ohne alt' });
      const s = (tag.match(/\ssrc="([^"]*)"/) || [])[1];
      if (s && /^https?:\/\//.test(s) && !/^https:\/\/(?:static\.wixstatic\.com|img-wixmp-[a-f0-9]+\.wixmp\.com)\//.test(s)) bad.push({ id: f + ':' + s, msg: f + ': fremde Bildquelle ' + s });
    }
  }
  assert.deepEqual(fails('img', bad), []);
});

test('Datenschutz: keine Fremd-Skripte im statischen HTML, Kalender erst nach Einwilligung', () => {
  const bad = [];
  for (const f of [...files, ...L.postFiles()]) {
    const h = L.read(f);
    for (const s of L.srcs(h).filter((x) => /^https?:\/\//.test(x) && !/^https:\/\/(?:static\.wixstatic\.com|img-wixmp-[a-f0-9]+\.wixmp\.com)\//.test(x))) bad.push(f + ': ' + s);
    for (const m of h.matchAll(/<iframe\b[^>]*>/gi)) if (/\ssrc="/i.test(m[0])) bad.push(f + ': iframe mit src im statischen HTML (laedt vor der Einwilligung)');
  }
  assert.deepEqual(bad, []);
  const p = L.read('assets/pages.js');
  assert.ok(/data-src=/.test(p) || /consent/i.test(p), 'Kalender-Einbettung muss an Einwilligung haengen');
});

test('Versteckte Seiten sind nicht in Sitemap und werden nicht verlinkt', () => {
  const hidden = ['anlass-digitale-souveraenitaet.html', 'zusammenarbeit-ki-zeitalter.html'];
  const urls = L.sitemapUrls().join(' ');
  for (const h of hidden) assert.ok(!urls.includes(h), h + ' in Sitemap');
  assert.match(L.read('assets/site.js'), /anlass-digitale-souveraenitaet/);
});

test('Anlass-Seiten: gleicher Aufbau (Hero, Einstieg, FAQ-Block, CTA-Band)', () => {
  const anl = pages.filter((f) => /^anlass-/.test(f) && !/digitale/.test(f));
  assert.ok(anl.length >= 5);
  for (const f of anl) {
    const t = L.read(f);
    assert.ok(/class="hero/.test(t), f + ': Hero');
    assert.ok(/ctaband/.test(t), f + ': CTA-Band');
    assert.ok(/discovery-call\.html|coffee-call\.html|kontakt\.html/.test(t), f + ': Terminlink');
  }
});

test('Anlass-Seiten sind in themen.html verlinkt', () => {
  const t = L.read('themen.html');
  for (const f of pages.filter((x) => /^anlass-/.test(x) && !/digitale/.test(x))) assert.ok(t.includes(f), 'themen.html verlinkt ' + f + ' nicht');
});

test('Personenseiten: Buttons fuehren auf bestehende Seiten, kein Kalender-Fremdlink im statischen HTML', () => {
  assert.match(L.read('florian.html'), /href="coffee-call\.html">15 Min\. Coffee Call mit Flo/);
  assert.match(L.read('franziska.html'), /href="kontakt\.html">Kontakt zu Franzi aufnehmen/);
  assert.doesNotMatch(L.read('florian.html'), /calendar\.app\.google/);
});

test('Sitemap: weder Weiterleitungen noch noindex-Seiten', () => {
  for (const u of L.sitemapUrls()) { const f = L.urlToFile(u); const h = L.read(f); assert.ok(!L.isRedirect(h), f + ' ist Weiterleitung'); assert.ok(!L.isNoindex(h), f + ' ist noindex'); }
});

test('Dateigroessen: keine ausser Kontrolle geratenen Dateien', () => {
  const fs = require('fs'); const path = require('path');
  const big = [];
  for (const f of fs.readdirSync(L.ROOT)) { const p = path.join(L.ROOT, f); if (fs.statSync(p).isFile() && fs.statSync(p).size > 600 * 1024) big.push(f); }
  assert.deepEqual(big, []);
});
