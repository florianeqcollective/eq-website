/* Cockpit-Abschnitt secN. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secN=function(D){
var NA=D.NA,dm=D.dm,esc=D.esc,heute=D.heute,nf=D.nf,nice=D.nice,tms=D.tms;
var fx=function(v){return Number(v).toFixed(2).replace('.',',')};
function barSvg(es,key,col,pat,unit,aria,dec){var W=560,H=220,pl=46,pr=10,pt=28,pb=46,n=es.length,bw=(W-pl-pr)/Math.max(n,1),yb=H-pb,T=nice(Math.max.apply(null,es.map(function(e){return e[key]||0}).concat([10]))),sc=(H-pt-pb)/T;
var o='<svg class="in-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(aria)+'"><defs><pattern id="'+pat+'" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3.5" height="7" fill="'+col+'"/></pattern></defs>';
[0,T/2,T].forEach(function(g){var y=yb-g*sc;o+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" stroke="#c9d6d8"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" class="m">'+nf(g,0)+' '+unit+'</text>'});
es.forEach(function(e,i){var v=e[key],cx=pl+bw*i+bw/2,bwid=Math.min(40,Math.max(4,bw-6)),gap=e.gemessen==='nein'||(e.von&&e.bis&&e.von!==e.bis),hh=(v||0)*sc;
if(v>0)o+='<rect x="'+(cx-bwid/2)+'" y="'+(yb-hh)+'" width="'+bwid+'" height="'+hh+'" fill="'+(gap?'url(#'+pat+')':col)+'" stroke="'+col+'" stroke-width="'+(gap?1.5:0)+'"/>';
if(bw>=26)o+='<text x="'+cx+'" y="'+(yb-hh-(gap?16:5))+'" text-anchor="middle" font-size="10" font-weight="600">'+(v==null?'–':(dec?fx(v):nf(v,0)))+'</text>';
if(gap&&bw>=26)o+='<text x="'+cx+'" y="'+(yb-hh-5)+'" text-anchor="middle" font-size="9" style="fill:var(--k)">Lücke</text>';
if(bw>=26||i%2===0)o+='<text x="'+cx+'" y="'+(yb+15)+'" text-anchor="middle" font-size="9.5" class="m">'+dm(e.bis||e.von)+'</text>'});
return o+'</svg>'}
function secN(by){var it=by['nutzung-je-tag'];if(!it||!it.daten||!it.daten.eintraege)return NA;var d=it.daten,cut=new Date(tms(heute+' 00:00')-28*86400000).toISOString().slice(0,10),all=d.eintraege.slice().sort(function(a,b){return a.von<b.von?-1:1}),es=all.filter(function(e){return String(e.bis||e.von||'')>=cut});
var lg='<div class="in-leg"><span><i style="background:repeating-linear-gradient(45deg,#888 0 2px,#fff 2px 4px)"></i>Lücke: nicht je Tag gemessen</span></div>';
var h='<div class="in-grid"><div class="in-card"><h3>Wochenvolumen: genutzte Prozentpunkte je Tag</h3>'+(es.length?barSvg(es,'wochenvolumen_punkte','var(--t)','hxn1','P','Wochenvolumen je Tag, letzte 4 Wochen',false):'<p class="muted">noch keine Daten</p>')+'<div class="in-note">Letzte 4 Wochen. Ein Punkt ist ein Prozentpunkt des Wochenlimits.</div></div>';
h+='<div class="in-card"><h3>Guthaben-Verbrauch je Tag in US-Dollar</h3>'+(es.length?barSvg(es,'guthaben_usd','var(--k)','hxn2','$','Guthaben-Verbrauch je Tag, letzte 4 Wochen',true):'<p class="muted">noch keine Daten</p>')+'<div class="in-note">Letzte 4 Wochen.</div></div></div>'+lg+'<div class="in-note">'+esc(d.hinweis||'')+'</div>';
h+='<details class="in-det"><summary>Werte als Tabelle</summary><table class="rt"><thead><tr><th>Zeitraum</th><th>Punkte</th><th>Guthaben USD</th><th>Wochenstand Ende</th><th>Gemessen</th><th>Hinweis</th></tr></thead><tbody>'+es.map(function(e){return '<tr><td data-l="Zeitraum"><b>'+esc(e.label)+'</b></td><td data-l="Punkte">'+nf(e.wochenvolumen_punkte,0)+'</td><td data-l="Guthaben USD">'+(e.guthaben_usd==null?'–':fx(e.guthaben_usd))+'</td><td data-l="Wochenstand Ende">'+(e.wochenstand_ende==null?'–':nf(e.wochenstand_ende,0)+' %')+'</td><td data-l="Gemessen">'+esc(e.gemessen||'')+'</td><td data-l="Hinweis">'+esc(e.hinweis||'')+'</td></tr>'}).join('')+'</tbody></table></details>';
return h}
return secN;
};
