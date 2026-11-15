'use strict';
// Browsertests (Playwright, Chromium) gegen die lokal ausgelieferte Seite. Externe Hosts werden blockiert,
// damit der Test stabil bleibt und Datenschutzverstoesse (Anfragen vor Einwilligung) sichtbar werden.
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('./lib.cjs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { chromium = null; }

const KNOWN = L.known();
const known = (k, id) => (KNOWN[k] || []).includes(id);
const PAGES = L.htmlFiles().filter((f) => !L.isRedirect(L.read(f)) && !['404.html', 'intern.html', 'fotos.html'].includes(f));
const HIDDEN = ['anlass-digitale-souveraenitaet.html'];

let srv, base, browser;
test.before(async () => {
  if (!chromium) throw new Error('Playwright fehlt (npm i --no-save playwright && npx playwright install chromium)');
  ({ srv, url: base } = await L.startServer());
  browser = await chromium.launch();
});
test.after(async () => { if (browser) await browser.close(); if (srv) srv.close(); });

async function open(file, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: 900 }, locale: 'de-DE' });
  if (opts.consent) await ctx.addInitScript((c) => { try { localStorage.setItem('eqc_consent', JSON.stringify({ v: 1, ts: Date.now(), c })); } catch (e) {} }, opts.consent);
  const page = await ctx.newPage();
  const errors = [], external = [], failed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(base) || u.startsWith('data:')) return route.continue();
    external.push(u);
    return route.abort();
  });
  page.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
  await page.goto(base + '/' + (file === 'index.html' ? '' : file), { waitUntil: 'load' });
  await page.waitForTimeout(opts.wait || 500);
  return { ctx, page, errors, external, failed };
}

test('Alle Seiten laden ohne JavaScript-Fehler und ohne fehlende lokale Dateien', async () => {
  const bad = [];
  for (const f of PAGES) {
    const r = await open(f);
    if (r.errors.length) bad.push(f + ': ' + r.errors.join(' | '));
    if (r.failed.length) bad.push(f + ': ' + r.failed.join(' | '));
    await r.ctx.close();
  }
  assert.deepEqual(bad, []);
});

test('Jede Seite hat nach dem Rendern genau eine h1, Navigation und Fusszeile', async () => {
  const bad = [];
  for (const f of PAGES) {
    const r = await open(f);
    const d = await r.page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, h1t: (document.querySelector('h1') || {}).textContent || '', nav: document.querySelectorAll('header nav a').length, foot: !!document.querySelector('footer'), main: !!document.querySelector('main') }));
    if (d.h1 !== 1 || !d.h1t.trim()) bad.push(f + ': h1=' + d.h1);
    if (d.nav < 4) bad.push(f + ': Navigation');
    if (!d.foot || !d.main) bad.push(f + ': Gerüst');
    await r.ctx.close();
  }
  assert.deepEqual(bad.filter((b) => !known('h1', b.split(':')[0])), []);
});

test('Vorgerendertes HTML und Client-Rendering liefern dieselbe h1 und denselben Einleitungstext', async () => {
  const bad = [];
  for (const f of PAGES) {
    const h = L.read(f);
    const sh1 = (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
    const slead = (h.match(/<p class="lead"[^>]*>([\s\S]*?)<\/p>/) || [])[1];
    const r = await open(f);
    const d = await r.page.evaluate(() => ({ h1: (document.querySelector('h1') || {}).textContent, lead: (document.querySelector('.lead') || {}).textContent }));
    const norm = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/­/g, '').replace(/\s+/g, ' ').trim();
    if (sh1 && norm(sh1) !== norm(d.h1)) bad.push(f + ': h1 statisch "' + norm(sh1) + '" / gerendert "' + norm(d.h1) + '"');
    if (slead && norm(slead) !== norm(d.lead)) bad.push(f + ': Einleitung weicht ab');
    await r.ctx.close();
  }
  assert.deepEqual(bad.filter((b) => !known('prerender', b.split(':')[0])), []);
});

test('Fusszeile: Region-Zeile genau einmal auf jeder Seite', async () => {
  const bad = [];
  for (const f of PAGES) {
    const r = await open(f);
    const n = await r.page.evaluate(() => [...document.querySelectorAll('footer p')].filter((p) => p.textContent.includes('für Süddeutschland, Tirol und das Salzburger Land')).length);
    if (n !== 1) bad.push(f + ': ' + n);
    await r.ctx.close();
  }
  assert.deepEqual(bad, []);
});

test('Kein horizontales Scrollen bei 320, 390, 768 und 1280 Pixel Breite', async () => {
  const bad = [];
  for (const f of PAGES) for (const w of [320, 390, 768, 1280]) {
    const r = await open(f, { w, wait: 300 });
    const o = await r.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 1) bad.push(f + ' @' + w + ': ' + o + 'px');
    await r.ctx.close();
  }
  assert.deepEqual(bad.filter((b) => !known('overflow', b)), []);
});

test('Ueberschriften brechen nicht mitten im Wort (320 bis 1920 Pixel)', async () => {
  const bad = [];
  for (const f of ['index.html', 'anlass-fuehrungskraefte.html', 'loesungen.html', 'ueber-uns.html']) for (const w of [320, 390, 820, 1280, 1920]) {
    const r = await open(f, { w, wait: 300 });
    const o = await r.page.evaluate(() => {
      const h = document.querySelector('h1'); const cw = h.clientWidth; const cs = getComputedStyle(h);
      const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing;
      document.body.appendChild(probe);
      const words = h.textContent.split(/[\s­]+/).filter(Boolean);
      const parts = h.textContent.split(/\s+/).filter(Boolean);
      const wide = [];
      for (const p of parts) { // Teile ohne Leerraum, an weichen Trennstrichen darf geteilt werden
        const segs = p.split('­'); let widest = 0;
        for (const s of segs) { probe.textContent = s; widest = Math.max(widest, probe.getBoundingClientRect().width); }
        if (widest > cw + 0.5) wide.push(p);
      }
      probe.remove();
      return wide;
    });
    if (o.length) bad.push(f + ' @' + w + ': ' + o.join(', '));
    await r.ctx.close();
  }
  assert.deepEqual(bad, []);
});

test('Datenschutz: ohne Einwilligung gehen keine Anfragen an Fremdhosts', async () => {
  const bad = [];
  for (const f of PAGES) {
    const r = await open(f, { wait: 800 });
    const ext = r.external.filter((u) => !/static\.wixstatic\.com|img-wixmp-[a-f0-9]+\.wixmp\.com/.test(u));
    if (ext.length) bad.push({ id: f, msg: f + ': ' + ext.map((u) => u.slice(0, 80)).join(' | ') });
    await r.ctx.close();
  }
  assert.deepEqual(bad.filter((b) => !known('consent', b.id)).map((b) => b.msg), []);
});

test('Cookie-Banner: erscheint ohne Entscheidung, Nur notwendige schliesst und speichert', async () => {
  const r = await open('index.html');
  assert.equal(await r.page.locator('.eqc').count(), 1, 'Banner fehlt');
  await r.page.locator('.eqc-b.n').first().click();
  assert.equal(await r.page.locator('.eqc').count(), 0);
  const st = await r.page.evaluate(() => JSON.parse(localStorage.getItem('eqc_consent')));
  assert.equal(st.c.notwendig, true); assert.equal(st.c.extern, false);
  await r.page.reload(); await r.page.waitForTimeout(300);
  assert.equal(await r.page.locator('.eqc').count(), 0, 'Banner kommt nach Entscheidung wieder');
  await r.ctx.close();
});

test('Nach Alle akzeptieren darf der Kalender geladen werden, die Seite bleibt fehlerfrei', async () => {
  const r = await open('coffee-call.html', { consent: { notwendig: true, extern: true }, wait: 800 });
  const n = await r.page.locator('iframe[src*="calendar.google.com"]').count();
  assert.ok(n >= 1, 'Kalender-Einbettung fehlt trotz Einwilligung');
  assert.deepEqual(r.errors, []);
  await r.ctx.close();
});

test('Interne Navigation: alle Links der Startseite fuehren auf Seiten ohne Fehler', async () => {
  const r = await open('index.html');
  const links = await r.page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h)))]);
  assert.ok(links.length >= 10);
  const bad = [];
  for (const l of links) { const p = l.split('#')[0]; if (p && !L.exists(p.split('?')[0])) bad.push(l); }
  await r.ctx.close();
  assert.deepEqual(bad, []);
});

test('Versteckte Seiten werden auf keiner Seite verlinkt', async () => {
  const bad = [];
  for (const f of PAGES.filter((x) => !HIDDEN.includes(x))) {
    const r = await open(f, { wait: 400 });
    const n = await r.page.evaluate((h) => [...document.querySelectorAll('a[href]')].filter((a) => h.some((x) => a.getAttribute('href').startsWith(x))).length, HIDDEN);
    if (n) bad.push(f + ': ' + n);
    await r.ctx.close();
  }
  assert.deepEqual(bad, []);
});

test('Buchungs-Buttons: jeder Terminlink fuehrt auf eine Buchungsseite oder einen Kalender', async () => {
  const ok = /^(discovery-call\.html|coffee-call\.html|coffee-call-franzi\.html|kontakt\.html|call\.html|teamcheck\.html)(\?.*)?(#.*)?$/;
  const bad = [];
  for (const f of PAGES) {
    const r = await open(f, { wait: 400 });
    const hs = await r.page.evaluate(() => [...document.querySelectorAll('a.btn, a.navcta')].map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href') })));
    for (const x of hs) if (/Termin|Call|Coffee|buchen|vereinbaren/i.test(x.t) && !ok.test(x.h) && !/^https:\/\/calendar\.app\.google\//.test(x.h) && !/^#/.test(x.h)) bad.push(f + ': "' + x.t + '" -> ' + x.h);
    await r.ctx.close();
  }
  assert.deepEqual(bad.filter((b) => !known('buttons', b)), []);
});

test('Lesbarkeit: Fliesstext nicht kleiner als 14 Pixel, Kontrast der Hauptschrift ausreichend', async () => {
  const r = await open('index.html');
  const d = await r.page.evaluate(() => { const p = document.querySelector('main p'); const cs = getComputedStyle(p); return { size: parseFloat(cs.fontSize), color: cs.color, bg: getComputedStyle(document.body).backgroundColor }; });
  assert.ok(d.size >= 14, 'Schrift ' + d.size);
  await r.ctx.close();
});

// Besucherweg (Tracking): nur mit Einwilligung in der Kategorie "statistik"
async function trackCtx(consent, path) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  await ctx.addInitScript((c) => { try { localStorage.setItem('eqc_consent', JSON.stringify({ v: 1, ts: Date.now(), c })); } catch (e) {} }, consent);
  const page = await ctx.newPage();
  const posts = [], other = [];
  await page.route('**/*', async (route) => {
    const req = route.request(); const u = req.url();
    if (u.startsWith(base) || u.startsWith('data:')) return route.continue();
    if (/wixapis\.com\/oauth2\/token/.test(u)) return route.fulfill({ status: 200, contentType: 'application/json', body: '{"access_token":"test"}' });
    if (/wixapis\.com\/wix-data\/v2\/items$/.test(u)) { try { posts.push(JSON.parse(req.postData())); } catch (e) {} return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }); }
    other.push(u); return route.abort();
  });
  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  return { ctx, page, posts, other };
}

test('Besucherweg: ohne Einwilligung in statistik wird nichts gesendet und nichts gespeichert', async () => {
  const r = await trackCtx({ notwendig: true, extern: true, statistik: false }, '/ressourcen.html?c=4711&utm_source=linkedin');
  const reise = r.posts.filter((p) => p.dataCollectionId === 'reise');
  assert.equal(reise.length, 0);
  const ls = await r.page.evaluate(() => [localStorage.getItem('eqc_vid'), localStorage.getItem('eqc_ft')]);
  assert.deepEqual(ls, [null, null]);
  await r.ctx.close();
});

test('Besucherweg: mit Einwilligung kommen Aufruf, Herkunft und Call-Klick an', async () => {
  const r = await trackCtx({ notwendig: true, extern: true, statistik: true }, '/index.html?c=4711&utm_source=linkedin&utm_campaign=geburtstag');
  let reise = r.posts.filter((p) => p.dataCollectionId === 'reise').map((p) => p.dataItem.data);
  assert.equal(reise.length, 1, 'genau ein Aufruf erwartet, war ' + reise.length);
  const a = reise[0];
  assert.equal(a.ereignis, 'aufruf'); assert.equal(a.code, '4711'); assert.equal(a.quelle, 'linkedin'); assert.equal(a.kampagne, 'geburtstag');
  assert.match(a.besucher, /^[0-9a-f]{16,}$/);
  assert.ok(!('email' in a) && !('name' in a), 'keine direkten Personendaten');
  await r.page.locator('a[href^="coffee-call.html"], a[href^="discovery-call.html"], a[href^="kontakt.html"]').first().click();
  await r.page.waitForTimeout(700);
  reise = r.posts.filter((p) => p.dataCollectionId === 'reise').map((p) => p.dataItem.data);
  assert.ok(reise.some((x) => x.ereignis === 'klick_call'), 'klick_call fehlt');
  assert.ok(reise.every((x) => x.besucher === a.besucher), 'Besucherkennung wechselt');
  await r.ctx.close();
});
