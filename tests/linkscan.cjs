'use strict';
// Gemeinsamer Scanner fuer die Link-Tests: oeffnet jede Seite im Browser, wartet auf das Rendern
// und liefert alle Links sowie alle Anker-Ziele aus dem fertigen DOM (nicht nur aus dem HTML-Quelltext).
// Externe Hosts werden nicht geladen. Die Wix-Daten (Token, Newsletter-Archiv, Blog) werden mit festen
// Testdaten beantwortet, damit auch die dynamisch erzeugten Links geprueft werden.
const L = require('./lib.cjs');

const SKIP = ['404.html', 'intern.html', 'fotos.html'];
const pages = () => L.htmlFiles().filter((f) => !L.isRedirect(L.read(f)) && !SKIP.includes(f));

// Absichtlich mit den alten, kaputten Adressen: so faellt auf, wenn die Umschreibung in site.js verschwindet.
const ARCHIV = [
  { titel: 'Testausgabe A', datum: '2026-11-05', url: 'https://www.eq-collective.de/so/AAA111' },
  { titel: 'Testausgabe B', datum: '2026-10-01', url: 'https://zebra-kollektiv.de/so/BBB222' },
  { titel: 'Testausgabe C', datum: '2026-09-01', url: 'https://app.eq-collective.de/so/CCC333' },
];
const POSTS = [
  { title: 'Testbeitrag', slug: 'testbeitrag', firstPublishedDate: '2026-11-01T10:00:00Z', minutesToRead: 3, excerpt: 'Kurztext', richContent: { nodes: [] } },
];

async function stubWix(page) {
  await page.route(/wixapis\.com/, (route) => {
    const u = route.request().url();
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    let body = {};
    if (/oauth2\/token/.test(u)) body = { access_token: 'test-token' };
    else if (/wix-data\/v2\/items\/query/.test(u)) body = { dataItems: ARCHIV.map((d) => ({ data: d })) };
    else if (/blog\/v3\/posts\/query/.test(u)) body = { posts: POSTS };
    return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

async function openPage(browser, base, file, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  const external = [];
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(base) || u.startsWith('data:')) return route.continue();
    external.push(u);
    return route.abort();
  });
  await stubWix(page); // zuletzt registriert, gewinnt vor dem Sammel-Block
  await page.goto(base + '/' + (file === 'index.html' ? '' : file) + (opts.query || ''), { waitUntil: 'load' });
  await page.waitForTimeout(opts.wait || 700);
  return { ctx, page, external };
}

const collect = () => ({
  links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 40), inArch: !!a.closest('.arch') })),
  ids: [...document.querySelectorAll('[id],a[name]')].map((e) => e.id || e.getAttribute('name')),
  forms: [...document.querySelectorAll('form[action]')].map((f) => f.getAttribute('action')),
});

async function scan(browser, base, files = pages()) {
  const out = {};
  for (const f of files) {
    const r = await openPage(browser, base, f);
    out[f] = await r.page.evaluate(collect);
    await r.ctx.close();
  }
  return out;
}
module.exports = { pages, scan, openPage, collect, ARCHIV, POSTS, SKIP };
