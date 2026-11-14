/* Cockpit-Abschnitt secZ. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secZ=function(D){
var IDS=D.IDS,berlinNow=D.berlinNow,dm=D.dm,esc=D.esc,heute=D.heute,hm=D.hm,pbar=D.pbar,tms=D.tms;
function secZ(by){var nowB=berlinNow(),nowMs=tms(nowB),hr=parseInt(nowB.slice(11,13),10),dow=new Date(nowMs).getUTCDay(),dayShift=dow>=1&&dow<=5&&hr>=7&&hr<19;
var rows=IDS.slice(0,8).map(function(id,i){var it=by[id];if(!it||!it.daten)return '<tr><td data-l="Aufgabe" colspan="5">'+esc(id.replace('zaehler-',''))+': Daten gerade nicht verfügbar.</td></tr>';
var z=it.daten,cur=z.datum===heute,st=z.stand||'offen',cls=/erledigt|erreicht|voll/.test(st)?'in-ok':(/pausiert|blocker/.test(st)?'in-bad':'in-w'),ls=z.letzter_start||'',stale=dayShift&&ls&&(nowMs-tms(ls)>6*3600000);
return '<tr><td data-l="Aufgabe"><b>'+esc(z.name||id)+'</b></td><td data-l="Soll">'+(z.soll?z.soll+' '+esc(z.einheit||''):'–')+'</td><td data-l="Ist">'+(cur?(z.ist==null?0:z.ist)+pbar(z.ist,z.soll):'–')+'</td><td data-l="Stand" class="'+cls+'">'+esc(st)+(cur?'':' <span class="muted">(vom '+dm(z.datum)+')</span>')+(z.grund?'<br><span class="muted">'+esc(z.grund)+'</span>':'')+'</td><td data-l="Letzter Start">'+(ls?(stale?'<span class="in-bad">veraltet seit '+hm(ls)+'</span>':'Stand '+hm(ls)):'–')+'</td></tr>'});
return '<table class="rt"><thead><tr><th>Aufgabe</th><th>Soll</th><th>Ist</th><th>Stand</th><th>Letzter Start</th></tr></thead><tbody>'+rows.join('')+'</tbody></table>'}
return secZ;
};
