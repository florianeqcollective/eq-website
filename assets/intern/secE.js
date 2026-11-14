/* Cockpit-Abschnitt secE. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secE=function(D){
var dm=D.dm,esc=D.esc,nf=D.nf;
function secE(by){var it=by['netzwerk-events'],ev=(it&&it.daten&&it.daten.events)||[],has=ev.length>0;
var sum=function(k){return ev.reduce(function(s,e){return s+(Number(e[k])||0)},0)};
var h='<div class="in-tiles">'+[['Events',ev.length],['Neue Kontakte',sum('kontakte')],['Folgegespräche',sum('gespraeche')],['Discovery Calls',sum('calls')],['Aufträge',sum('auftraege')]].map(function(p){return '<div class="in-tile"><b>'+(has?nf(p[1],0):'–')+'</b><span>'+p[0]+'</span></div>'}).join('')+'</div>';
if(has){h+='<table class="rt" style="margin-top:14px"><thead><tr><th>Datum</th><th>Event</th><th>Ort</th><th>Kontakte</th><th>Folgegespräche</th><th>Calls</th><th>Aufträge</th><th>Ergebnis</th></tr></thead><tbody>'+ev.slice().sort(function(a,b){return a.datum<b.datum?1:-1}).map(function(e){return '<tr><td data-l="Datum">'+dm(e.datum)+'</td><td data-l="Event"><b>'+esc(e.name)+'</b></td><td data-l="Ort">'+esc(e.ort||'')+'</td><td data-l="Kontakte">'+nf(e.kontakte,0)+'</td><td data-l="Folgegespräche">'+nf(e.gespraeche,0)+'</td><td data-l="Calls">'+nf(e.calls,0)+'</td><td data-l="Aufträge">'+nf(e.auftraege,0)+'</td><td data-l="Ergebnis">'+esc(e.ergebnis||'')+'</td></tr>'}).join('')+'</tbody></table>'}
else{h+='<div class="in-note" style="margin-top:12px">Noch keine Events eingetragen. Je Event zählen Datum, Name, Ort, neue Kontakte, Folgegespräche, Calls, Aufträge und ein kurzes Ergebnis. Der Funnel oben zählt nur LinkedIn, Events laufen hier getrennt, damit beide Wege vergleichbar bleiben.</div>'}
return h}
return secE;
};
