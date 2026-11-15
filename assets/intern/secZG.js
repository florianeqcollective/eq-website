/* Cockpit-Abschnitt secZG (Reiter Zugriffe): zaehlt die Aufrufe aus der Wix-Sammlung reise (Besucherweg, nur mit Einwilligung in Statistik).
   Es gibt keine Zaehler in der Seite selbst. Die Zahlen entstehen erst hier aus den Einzelereignissen. Gezaehlt werden also nur Besuche mit Einwilligung. */
window.EQIN=window.EQIN||{};
EQIN.secZG=function(D){
var NA=D.NA,esc=D.esc,qx=D.qx;
var DAY=86400000;
function zt(z){var v=z&&z.zeit;if(v&&v.$date)v=v.$date;var t=Date.parse(v);return isNaN(t)?null:t}
function nf(n){return Number(n||0).toLocaleString('de-DE')}
function pageKey(r){var s=String(r.seite||'').replace(/^\//,'').replace(/\/$/,'')||'index.html';return s}
// Reine Auswertung, ohne Zugriff auf die Seite. Wird auch im Test benutzt.
function aggregate(rows,now){
var out={total:{d7:0,d30:0,d90:0},vis30:0,pages:{},posts:{},src:{}},v30={};
(rows||[]).forEach(function(r){
if(!r||r.ereignis!=='aufruf')return;var t=zt(r);if(t==null)return;var age=now-t;if(age<0||age>90*DAY)return;
var tick=function(o,k){var e=o[k]||(o[k]={d7:0,d30:0,d90:0,v:{}});e.d90++;if(age<=30*DAY){e.d30++;if(r.besucher)e.v[r.besucher]=1}if(age<=7*DAY)e.d7++};
out.total.d90++;if(age<=30*DAY){out.total.d30++;if(r.besucher)v30[r.besucher]=1}if(age<=7*DAY)out.total.d7++;
var pk=pageKey(r);tick(out.pages,pk);
if(pk==='blog-beitrag.html'&&r.ziel)tick(out.posts,String(r.ziel));
if(age<=30*DAY){var q=String(r.quelle||r.q||r.referrer||'direkt')||'direkt';out.src[q]=(out.src[q]||0)+1}
});
out.vis30=Object.keys(v30).length;
return out}
function sorted(o){return Object.keys(o).map(function(k){return{k:k,e:o[k]}}).sort(function(a,b){return b.e.d30-a.e.d30||b.e.d90-a.e.d90||(a.k<b.k?-1:1)})}
function rows(list,label,max){if(!list.length)return '<p class="muted">Noch keine Zahlen.</p>';
return '<table class="rt"><thead><tr><th>'+esc(label)+'</th><th>7 Tage</th><th>30 Tage</th><th>90 Tage</th><th>Besucher in 30 Tagen</th></tr></thead><tbody>'+list.slice(0,max||30).map(function(x){return '<tr><td data-l="'+esc(label)+'">'+esc(x.k)+'</td><td data-l="7 Tage">'+nf(x.e.d7)+'</td><td data-l="30 Tage">'+nf(x.e.d30)+'</td><td data-l="90 Tage">'+nf(x.e.d90)+'</td><td data-l="Besucher in 30 Tagen">'+nf(Object.keys(x.e.v).length)+'</td></tr>'}).join('')+'</tbody></table>'}
function html(a,capped){
if(!a.total.d90)return '<p class="muted">Noch keine Zugriffe gezählt. Die Zählung läuft nur mit Einwilligung in die Kategorie Statistik und startet, sobald diese im Banner freigegeben ist.</p>';
var src=Object.keys(a.src).map(function(k){return{k:k,n:a.src[k]}}).sort(function(x,y){return y.n-x.n}).slice(0,10);
return '<div class="in-tiles"><div class="in-tile"><b>'+nf(a.total.d7)+'</b><span>Aufrufe, 7 Tage</span></div><div class="in-tile"><b>'+nf(a.total.d30)+'</b><span>Aufrufe, 30 Tage</span></div><div class="in-tile"><b>'+nf(a.vis30)+'</b><span>Besucher, 30 Tage</span></div><div class="in-tile"><b>'+nf(a.total.d90)+'</b><span>Aufrufe, 90 Tage</span></div></div>'+
'<p class="in-note">Gezählt werden nur Besuche mit Einwilligung in Statistik. Die echten Zahlen liegen darüber.'+(capped?' Es sind mehr als 1000 Ereignisse im Zeitraum, die Zahlen sind deshalb eine Untergrenze.':'')+'</p>'+
'<h3 class="in-h">Seiten</h3>'+rows(sorted(a.pages),'Seite',40)+
'<h3 class="in-h">Blog-Beiträge</h3>'+rows(sorted(a.posts),'Beitrag',40)+
'<h3 class="in-h">Herkunft in 30 Tagen</h3>'+(src.length?'<table class="rt"><thead><tr><th>Quelle</th><th>Aufrufe</th></tr></thead><tbody>'+src.map(function(x){return '<tr><td data-l="Quelle">'+esc(x.k)+'</td><td data-l="Aufrufe">'+nf(x.n)+'</td></tr>'}).join('')+'</tbody></table>':'<p class="muted">Noch keine Zahlen.</p>')}
function mount(el){if(!el||!qx)return;el.innerHTML='<p class="muted">Einen Moment …</p>';
var since=new Date(Date.now()-90*DAY).toISOString();
qx('reise',{ereignis:{$eq:'aufruf'},zeit:{$gte:since}},[{fieldName:'zeit',order:'DESC'}],1000).then(function(r){var a=aggregate(r,Date.now());el.innerHTML=html(a,r.length>=1000)}).catch(function(){el.innerHTML=NA})}
return{mount:mount,aggregate:aggregate};
};
