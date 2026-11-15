'use strict';
// Zugriffszaehler: Auswertung im Cockpit (Reiter Zugriffe) und Erfassung der Beitrags-Adresse im Besucherweg.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const L = require('./lib.cjs');
const S = require('./linkscan.cjs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { chromium = null; }

function load() {
  const ctx = { Date, Math, Object, String, Number, isNaN, Array, Promise };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(L.read('assets/intern/secZG.js'), ctx);
  return ctx.window.EQIN.secZG({ NA: 'NA', esc: (s) => String(s), qx: null });
}
const NOW = Date.parse('2026-11-20T12:00:00Z');
const ev = (d, o) => Object.assign({ ereignis: 'aufruf', besucher: 'b1', seite: '/', zeit: new Date(NOW - d * 86400000).toISOString() }, o);

test('Auswertung zaehlt Aufrufe je Seite und Zeitraum, Besucher nur einmal', () => {
  const a = load().aggregate([ev(1), ev(2), ev(2, { besucher: 'b2' }), ev(10, { seite: '/kontakt.html' }), ev(40), ev(95), ev(1, { ereignis: 'klick_call' })], NOW);
  assert.deepEqual(JSON.parse(JSON.stringify(a.total)), { d7: 3, d30: 4, d90: 5 });
  assert.equal(a.vis30, 2);
  assert.equal(a.pages['index.html'].d7, 3);
  assert.equal(a.pages['kontakt.html'].d30, 1);
});

test('Auswertung ordnet Blog-Aufrufe ueber die Adresse des Beitrags zu und liest Wix-Datumswerte', () => {
  const a = load().aggregate([ev(1, { seite: '/blog-beitrag.html', ziel: 'mein-beitrag' }), { ereignis: 'aufruf', seite: '/blog-beitrag.html', ziel: 'mein-beitrag', besucher: 'b9', zeit: { $date: new Date(NOW - 3600000).toISOString() } }, ev(2, { seite: '/blog-beitrag.html' })], NOW);
  assert.equal(a.posts['mein-beitrag'].d7, 2);
  assert.equal(Object.keys(a.posts).length, 1);
});

test('Startwerte aus Wix werden je Quelle summiert und nach Wochen gezeigt', () => {
  const item = { daten: { von: '2026-11-02', bis: '2026-11-15', quellen: { core: { name: 'Wix Core (app)', tage: [['2026-11-02', 2, 2], ['2026-11-03', 3, 3], ['2026-11-09', 4, 4]] }, light: { name: 'Wix Light (Website)', tage: [['2026-11-04', 5, 5]] } } } };
  const h = load().startHtml(item);
  assert.match(h, /<b>9<\/b><span>Sitzungen, Wix Core/);
  assert.match(h, /<b>5<\/b><span>Sitzungen, Wix Light/);
  assert.match(h, /Woche ab[\s\S]*09\.11\.[\s\S]*02\.11\./);
  assert.equal(load().startHtml(null), '');
});

test('Cockpit hat den Reiter Zugriffe und laedt den Abschnitt', () => {
  const html = L.read('intern.html'), js = L.read('assets/intern.js');
  assert.match(html, /assets\/intern\/secZG\.js/);
  assert.match(js, /data-tab=zugriffe/);
  assert.match(js, /data-tp=zugriffe/);
  assert.match(js, /secZG\.mount/);
});

test('Besucherweg meldet bei Beitragsseiten die Adresse des Beitrags (nur mit Einwilligung)', async () => {
  if (!chromium) throw new Error('Playwright fehlt');
  const { srv, url } = await L.startServer();
  const browser = await chromium.launch();
  try {
    const run = async (consent) => {
      const posts = [];
      const r = await S.openPage(browser, url, 'blog-beitrag.html', {
        query: '?slug=mein-beitrag', wait: 1500,
        before: async (ctx, page) => {
          if (consent) await ctx.addInitScript(() => { try { localStorage.setItem('eqc_consent', JSON.stringify({ v: 1, ts: Date.now(), c: { statistik: true } })); } catch (e) {} });
          page.on('request', (q) => { if (/wix-data\/v2\/items$/.test(q.url()) && q.method() === 'POST') { try { posts.push(JSON.parse(q.postData())); } catch (e) {} } });
        },
      });
      await r.ctx.close();
      return posts.filter((p) => p.dataCollectionId === 'reise');
    };
    const mit = await run(true);
    assert.ok(mit.length >= 1, 'Mit Einwilligung wurde kein Aufruf gemeldet');
    const d = mit[0].dataItem.data;
    assert.equal(d.ereignis, 'aufruf');
    assert.equal(d.ziel, 'mein-beitrag');
    const ohne = await run(false);
    assert.equal(ohne.length, 0, 'Ohne Einwilligung darf nichts gesendet werden');
  } finally { await browser.close(); srv.close(); }
});

test('Banner bietet die Kategorie Statistik, standardmaessig aus, und die Datenschutzerklaerung beschreibt sie', async () => {
  if (!chromium) throw new Error('Playwright fehlt');
  const ds = L.read('datenschutz.html');
  assert.match(ds, /Reichweitenmessung \(Kategorie Statistik\)/);
  assert.match(ds, /eqc_vid/);
  assert.match(ds, /nach sechs Monaten gelöscht/);
  assert.match(ds, /eqc_ft/);
  assert.doesNotMatch(ds, /ohne Reichweitenmessung, Tracking/);
  const { srv, url } = await L.startServer();
  const browser = await chromium.launch();
  try {
    const r = await S.openPage(browser, url, 'index.html', { wait: 1200 });
    await r.page.click('.eqc-l');
    const d = await r.page.evaluate(() => { const i = document.querySelector('.eqc input[aria-label="Statistik"]'); return i ? { checked: i.checked, disabled: i.disabled } : null; });
    assert.deepEqual(d, { checked: false, disabled: false });
    await r.page.click('.eqc-b.n');
    const st = await r.page.evaluate(() => JSON.parse(localStorage.getItem('eqc_consent')).c);
    assert.equal(st.statistik, false);
    assert.equal(await r.page.evaluate(() => localStorage.getItem('eqc_vid')), null);
    await r.ctx.close();
  } finally { await browser.close(); srv.close(); }
});

test('blogHtml: Startwerte je Beitrag plus neu gezaehlte Aufrufe, sortiert nach Gesamt', () => {
  const z = load();
  const item = { daten: { stand: '2026-11-15', beitraege: [
    { slug: 'a', titel: 'Alpha', datum: '2026-04-14', ansichten: 118 },
    { slug: 'b', titel: 'Beta', datum: '2026-01-01', ansichten: 7 } ] } };
  const now = Date.now();
  const rows = [
    { ereignis: 'aufruf', seite: 'blog-beitrag.html', ziel: 'b', zeit: new Date(now).toISOString(), besucher: 'x' },
    { ereignis: 'aufruf', seite: 'blog-beitrag.html', ziel: 'c', zeit: new Date(now).toISOString(), besucher: 'x' } ];
  const h = z.blogHtml(item, z.aggregate(rows, now));
  assert.match(h, /Alpha[\s\S]*Beta[\s\S]*>c</);
  assert.match(h, /Ansichten gesamt<\/span><span class="in-sub">Startwerte 125 plus neu gezählt 2/);
  assert.equal(z.blogHtml(null, null), '');
  assert.match(z.blogHtml(item, null), /Alpha/);
});

test('blogHtml: Summen aus dem Monatslauf und Aufrufe aelter als 90 Tage zaehlen mit', () => {
  const z = load();
  const item = { daten: { stand: '2026-11-15', beitraege: [{ slug: 'a', titel: 'Alpha', datum: '2026-04-14', ansichten: 10 }] } };
  const now = Date.now();
  const old = new Date(now - 120 * 86400000).toISOString();
  const rows = [{ ereignis: 'aufruf', seite: 'blog-beitrag.html', ziel: 'a', zeit: old, besucher: 'x' }];
  const agg = z.aggregate(rows, now);
  assert.equal(agg.postAll.a, 1);
  assert.equal(agg.total.d90, 0);
  const sum = { daten: { bis: '2027-03-01T00:00:00.000Z', beitraege: { a: 4, neu: 2 } } };
  const h = z.blogHtml(item, agg, sum);
  assert.match(h, /Startwerte 10 plus neu gezählt 7/);
  assert.match(h, />neu</);
});
