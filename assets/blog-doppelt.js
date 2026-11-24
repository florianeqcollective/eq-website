/* Blog-Beitrag: doppelten Teaser und doppeltes Titelbild entfernen.
   Der Artikeltext aus Wix beginnt oft mit dem Teaser und dem Titelbild, die die Seite oben schon zeigt. */
(function () {
  var done = false;
  function nz(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function ellip(s) { return s.replace(/\s*(\.\.\.|…)$/, ''); }
  function empty(el) { return el && el.tagName === 'P' && !nz(el.textContent) && !el.querySelector('img'); }
  function dropWithGap(el) {
    var nx = el.nextElementSibling;
    el.parentNode.removeChild(el);
    if (empty(nx)) nx.parentNode.removeChild(nx);
  }
  function fix() {
    var root = document.getElementById('ba');
    if (done || !root || !root.querySelector('.post-meta')) return;
    done = true;
    var lead = root.querySelector('p.lead');
    var cimg = root.querySelector('figure.cover img');
    var cid = '';
    if (cimg) { var m = /\/media\/([^\/]+)\//.exec(cimg.getAttribute('src') || ''); if (m) { try { cid = decodeURIComponent(m[1]); } catch (e) { cid = m[1]; } } }
    var full = lead ? nz(lead.textContent) : '';
    var cut = ellip(full);
    var el = cimg ? cimg.closest('figure.cover') : lead;
    var seenText = false, n = 0, dropLead = false, rm = [];
    el = el ? el.nextElementSibling : null;
    while (el && n < 8) {
      n++;
      var t = nz(el.textContent);
      if (el.tagName === 'P' && t && !seenText && lead) {
        seenText = true;
        if (t === full && full.length > 20) rm.push(el);
        else if (cut !== full && cut.length > 40 && t.indexOf(cut) === 0) dropLead = true;
      } else if (cid) {
        var im = el.tagName === 'IMG' ? el : el.querySelector('img');
        var src = im ? (im.getAttribute('src') || '') : '';
        var dec = src; try { dec = decodeURIComponent(src); } catch (e2) { }
        if (im && dec.indexOf('/media/' + cid + '/') > -1) rm.push(el);
      }
      el = el.nextElementSibling;
    }
    rm.forEach(function (x) { if (x.parentNode) dropWithGap(x); });
    if (dropLead && lead && lead.parentNode) lead.parentNode.removeChild(lead);
  }
  function start() {
    var root = document.getElementById('ba');
    if (root) {
      var ob = new MutationObserver(function () { fix(); if (done) ob.disconnect(); });
      ob.observe(root, { childList: true, subtree: true });
      fix();
      setTimeout(function () { ob.disconnect(); }, 20000);
    } else {
      var ob2 = new MutationObserver(function () { if (document.getElementById('ba')) { ob2.disconnect(); start(); } });
      ob2.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { ob2.disconnect(); }, 20000);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
