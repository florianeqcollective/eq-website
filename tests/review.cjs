'use strict';
// Review der EQ-Website: ergaenzt die Tests um Begriffe, Look, Vorrendern und Personenfotos.
// Aufruf: node tests/review.cjs [--live] [--out=ordner] [--seiten=a.html,b.html]
//   ohne --live: externe Hosts (Bilder, Kalender) werden blockiert, die Seite laeuft offline.
//   mit  --live: Wix-Bilder duerfen laden, dann wird geprueft, ob jedes Bild wirklich da ist.
// Ergebnis: <out>/report.json, <out>/report.md, <out>/shots/*.png (Desktop und Handy je Seite).
// Exit-Code 1, wenn es BLOCK-Befunde gibt. WARN blockiert nicht, muss aber im Bericht stehen.
const fs = require('fs');
const os = require('os');
const path = require('path');
const L = require('./lib.cjs');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const OUT = (args.find((a) => a.startsWith('--out=')) || '').slice(6) || path.join(os.tmpdir(), 'eq-review');
const ONLY = ((args.find((a) => a.startsWith('--seiten=')) || '').slice(9) || '').split(',').filter(Boolean);
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

const findings = [];
const add = (sev, area, page, msg) => findings.push({ sev, area, page, msg });

// ---------------------------------------------------------------- Regeln, die aus Flos Vorgaben gewachsen sind
const VERBOTEN = [
  [/Future Skills Check/, 'Future Skills Check ist kein Angebot mehr (Review 15.11.2026)'],
  [/\bvier R(ä|ae)ume\b/, 'Die vier Bereiche heissen Quadranten'],
  [/\bBausteine?\b/, 'Module statt Bausteine (Kibun als Baustein unter mehreren ist erlaubt)', /Kibun ist ein Baustein/],
  [/[–—]/, 'Gedankenstrich im Text (Stimme: keine Gedankenstriche)'],
  [/schonmal|Shareholder-Value|Lösungsorientiert/, 'Schreibweise (schon mal, Shareholder Value)'],
  [/Lorem|Platzhalter(?!:)|TODO|XXX/, 'Platzhaltertext sichtbar', /Platzhalter: Formate|Platzhalter\./],
  [/\bKI-gestützt\b|\bnahtlos\b|\bganzheitlich(e|en)? Ansatz\b|im Zeitalter von/, 'KI-Klang (siehe KI-Klang-Liste)', null, 'WARN'],
  [/\s{2,}\./, 'Leerzeichen vor Punkt'],
];
// Personenfotos: nur freigegebene Dateien duerfen auf einer Personenseite die Person zeigen.
let FOTOS = {};
try { FOTOS = JSON.parse(fs.readFileSync(path.join(__dirname, 'review-fotos.json'), 'utf8')); } catch (e) { /* keine Liste */ }
const PERSONEN = { 'franziska.html': 'Franzi', 'florian.html': 'Flo', 'michael.html': 'Michi' };

const normMain = (h) => h.replace(/\s+/g, ' ').replace(/ ?(style|data-q|class)="[^"]*"/g, '').replace(/<!--.*?-->/g, '').trim();

(async () => {
  const { srv, url: base } = await L.startServer();
  const browser = await chromium.launch();
  const all = L.htmlFiles().filter((f) => !L.isRedirect(L.read(f)) && !['intern.html', 'blog-beitrag.html'].includes(f));
  const pages = (ONLY.length ? all.filter((f) => ONLY.includes(f)) : all);
  const meta = {};
  const navLabels = {};

  // ---------- Cache-Parameter
  const vs = new Set();
  for (const f of L.htmlFiles()) for (const m of L.read(f).matchAll(/\?v=([0-9a-z]+)/g)) vs.add(m[1]);
  if (vs.size !== 1) add('BLOCK', 'Technik', '*', 'Cache-Parameter nicht einheitlich: ' + [...vs].join(', '));

  for (const f of pages) {
    const html = L.read(f);
    const isApp = /data-page=/.test(html);
    const ctxOpt = (w) => ({ viewport: { width: w, height: 900 }, locale: 'de-DE', deviceScaleFactor: 1 });
    const prep = async (ctx) => {
      await ctx.addInitScript(() => { try { localStorage.setItem('eqc_consent', JSON.stringify({ v: 1, ts: Date.now(), c: { notwendig: true } })); } catch (e) {} });
    };
    const guard = (page, ext) => page.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith(base) || u.startsWith('data:')) return route.continue();
      if (LIVE && /^https:\/\/static\.wixstatic\.com\//.test(u)) return route.continue();
      ext.push(u); return route.abort();
    });

    // ---------- Vorgerendert gegen Browser-Render
    if (isApp && f !== '404.html') {
      const c1 = await browser.newContext({ ...ctxOpt(1280), javaScriptEnabled: false });
      const p1 = await c1.newPage(); await guard(p1, []);
      await p1.goto(base + '/' + f); const stat = await p1.evaluate(() => (document.querySelector('main') || {}).innerHTML || '');
      await c1.close();
      const c2 = await browser.newContext(ctxOpt(1280)); await prep(c2);
      const p2 = await c2.newPage(); await guard(p2, []);
      await p2.goto(base + '/' + f); await p2.waitForTimeout(700);
      const dyn = await p2.evaluate(() => (document.querySelector('main') || {}).innerHTML || '');
      await c2.close();
      if (normMain(stat) !== normMain(dyn) && !((L.known().review || []).includes(f + ':vorgerendert'))) {
        const a = normMain(stat), b = normMain(dyn); let i = 0; while (i < a.length && a[i] === b[i]) i++;
        add('BLOCK', 'Technik', f, 'Vorgerenderter main weicht vom Browser-Render ab (Suchmaschinen sehen alten Text). Erste Abweichung: "' + a.slice(Math.max(0, i - 30), i + 50) + '" gegen "' + b.slice(Math.max(0, i - 30), i + 50) + '"');
      }
    }

    // ---------- Desktop und Handy
    for (const [tag, w] of [['d', 1280], ['m', 390]]) {
      const ctx = await browser.newContext(ctxOpt(w)); await prep(ctx);
      const page = await ctx.newPage();
      const errors = [], ext = [], failed = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
      page.on('response', (r) => { if (r.status() >= 400 && (r.url().startsWith(base) || /wixstatic/.test(r.url()))) failed.push(r.status() + ' ' + r.url()); });
      await guard(page, ext);
      await page.goto(base + '/' + f); await page.waitForTimeout(700);
      // Lazy Bilder laden lassen
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(LIVE ? 1500 : 300);
      const d = await page.evaluate((live) => {
        const out = { overflow: document.documentElement.scrollWidth - window.innerWidth, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()), imgs: [], contrast: [], tiny: [], navs: [], leer: [], title: document.title };
        out.navs = [...document.querySelectorAll('header nav a')].map((a) => a.textContent.trim());
        document.querySelectorAll('img').forEach((i) => out.imgs.push({ src: i.getAttribute('src') || '', alt: i.getAttribute('alt'), ok: i.naturalWidth > 0, w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), nw: i.naturalWidth, nh: i.naturalHeight }));
        const rgb = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
        const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
        const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = rgb(cs.backgroundColor); if (c && c.a > 0.95) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
        const seen = new Set();
        document.querySelectorAll('h1,h2,h3,h4,p,a,li,span,button,label,small').forEach((el) => {
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2)) return;
          const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.2) return;
          const fg = rgb(cs.color), bg = bgOf(el); if (!fg || !bg) return;
          const a = fg.a; const mix = { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) };
          const l1 = lum(mix), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700; const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
          if (ratio < need) { const k = el.textContent.trim().slice(0, 40) + '|' + ratio.toFixed(1); if (!seen.has(k)) { seen.add(k); out.contrast.push({ t: el.textContent.trim().slice(0, 50), ratio: +ratio.toFixed(2), need, size }); } }
          if (size < 13 && !/^(small)$/i.test(el.tagName)) out.tiny.push(el.textContent.trim().slice(0, 40) + ' ' + size + 'px');
        });
        document.querySelectorAll('section').forEach((s) => { if (s.textContent.trim().length < 3 && !s.querySelector('img,iframe,svg,video')) out.leer.push(s.className); });
        return out;
      }, LIVE);
      if (errors.length) add('BLOCK', 'Technik', f + ' (' + tag + ')', 'JavaScript-Fehler: ' + errors.slice(0, 2).join(' | '));
      if (failed.length) add('BLOCK', 'Technik', f + ' (' + tag + ')', 'Fehlende Dateien: ' + failed.slice(0, 3).join(' | '));
      if (d.overflow > 1) add('BLOCK', 'Look', f + ' (' + tag + ')', 'Seite laeuft ' + d.overflow + 'px ueber den Rand (waagerechter Scroll)');
      if (isApp && f !== '404.html' && d.h1.length !== 1) add('BLOCK', 'Look', f, 'h1 vorhanden: ' + d.h1.length);
      for (const i of d.imgs) {
        if (!/\.svg(\?|$)/.test(i.src) && (i.alt === null || i.alt === '')) add('WARN', 'Look', f, 'Bild ohne Alternativtext: ' + i.src.slice(0, 80));
        if (LIVE && !i.ok && !/^data:/.test(i.src)) add('BLOCK', 'Look', f + ' (' + tag + ')', 'Bild laedt nicht: ' + i.src.slice(0, 100));
        if (LIVE && i.ok && i.w > 0 && (i.nw < i.w * 0.8)) add('WARN', 'Look', f + ' (' + tag + ')', 'Bild unscharf, ' + i.nw + 'px fuer ' + i.w + 'px Anzeige: ' + i.src.slice(0, 80));
      }
      if (tag === 'd') {
        navLabels[f] = d.navs.join('|');
        meta[f] = { title: d.title, h1: d.h1[0] || '', imgs: d.imgs.length };
        for (const c of d.contrast.slice(0, 6)) add('WARN', 'Look', f, 'Kontrast ' + c.ratio + ':1 (noetig ' + c.need + ':1) bei "' + c.t + '"');
        if (d.leer.length) add('WARN', 'Look', f, 'Leere Sektionen: ' + d.leer.join(', '));
      } else {
        for (const t of d.tiny.slice(0, 3)) add('WARN', 'Look', f + ' (m)', 'Sehr kleine Schrift: ' + t);
      }
      await page.screenshot({ path: path.join(OUT, 'shots', f.replace(/\.html$/, '') + '-' + tag + '.png'), fullPage: true }).catch(() => {});
      await ctx.close();
    }

    // ---------- Begriffe und Schreibweisen im sichtbaren Text
    const text = L.visibleText(html);
    for (const [rx, msg, ausnahme, sev] of VERBOTEN) {
      const m = text.match(rx);
      if (m && !(ausnahme && ausnahme.test(text))) add(sev || 'BLOCK', 'Inhalt', f, msg + ' ("' + m[0].slice(0, 40) + '")');
    }

    // ---------- Personenfotos
    const person = PERSONEN[f];
    if (person) {
      const ok = new Set(FOTOS[person] || []);
      for (const m of html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)) {
        const id = (m[1].match(/media\/([^\/]+?)(~mv2)?\.(jpg|png)/) || [])[1] || m[1];
        if (!/Franz|Flo|Micha|Purr|Schäffer/.test(m[0])) continue;
        if (![...ok].some((x) => id.includes(x))) add('WARN', 'Look', f, 'Foto nicht als "zeigt ' + person + '" freigegeben (review-fotos.json): ' + id.slice(0, 60));
      }
    }
  }

  // ---------- Navigation ueberall gleich
  const navSet = new Set(Object.values(navLabels));
  if (navSet.size > 1) add('BLOCK', 'Look', '*', 'Navigation nicht ueberall gleich: ' + [...navSet].join(' ## '));

  // ---------- Zahlen und Begriffe gegen die Seiten
  try {
    const lh = L.visibleText(L.read('loesungen.html'));
    const m = lh.match(/\b(Zwei|Drei|Vier|Fuenf|Fünf) Lösungen\b/);
    const karten = (L.read('loesungen.html').match(/class="card[^"]*link"/g) || []).length;
    meta.__loesungen = { text: m && m[0], karten };
  } catch (e) { /* Seite fehlt */ }

  await browser.close(); srv.close();

  // ---------- Bericht
  const groups = new Map();
  for (const x of findings) { const k = x.sev + '|' + x.area + '|' + x.msg.replace(/^(.{0,160}).*$/s, '$1'); const pg = x.page.replace(/ \((d|m)\)$/, ''); const g = groups.get(k) || { ...x, pages: new Set() }; g.pages.add(pg); groups.set(k, g); }
  const grouped = [...groups.values()].map((g) => ({ sev: g.sev, area: g.area, msg: g.msg, pages: [...g.pages] }));
  const by = (s) => grouped.filter((x) => x.sev === s);
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ stand: new Date().toISOString(), live: LIVE, seiten: pages.length, block: by('BLOCK').length, warn: by('WARN').length, findings: grouped, meta }, null, 1));
  const md = ['# Review ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + (LIVE ? ' (live)' : ' (lokal)'), '', 'Seiten: ' + pages.length + ', Befunde (gruppiert), BLOCK: ' + by('BLOCK').length + ', WARN: ' + by('WARN').length, ''];
  for (const s of ['BLOCK', 'WARN']) { if (!by(s).length) continue; md.push('## ' + s, ''); for (const x of by(s)) md.push('- [' + x.area + '] ' + x.msg + ' (' + (x.pages.length > 4 ? x.pages.length + ' Seiten, z. B. ' + x.pages.slice(0, 3).join(', ') : x.pages.join(', ')) + ')'); md.push(''); }
  fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n'));
  console.log(md.join('\n'));
  console.log('Bericht und Screenshots: ' + OUT);
  process.exit(by('BLOCK').length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
