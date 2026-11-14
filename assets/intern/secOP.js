/* Cockpit-Abschnitt secOP (oben im Reiter KI-Betrieb): Systemzustand mit Ampeln, Kennzahlen und den groessten Problemen.
   Quelle aller Zahlen: KIDaten/onepager, vom Code (onepager.js) gerechnet und nach jedem Start und Paket, mindestens stuendlich, aufgefrischt.
   Hier steht keine Zahl von Hand: Grenzen, Zaehler und Zeiten kommen aus den Daten; fehlt eine Grenze, steht "fehlt". Die Probleme folgen festen Regeln (keine Schaetzung, kein Modell). Zeiten in Berliner Ortszeit. */
window.EQIN=window.EQIN||{};
EQIN.secOP=function(D){
var esc=D.esc,nf=D.nf;
var ST='<style>'
+'.op{--ink:#161616;--mut:#5a6b6e;--line:#d5e0e2;--tl:#eef4f5;--bad:#b3261e;--ok:#1f7a4d;--w:#d9951a;width:100%;background:#fff;border:1px solid var(--line);padding:18px 22px;font-size:14px;line-height:1.5;color:var(--ink)}'
+'.op *{box-sizing:border-box}'
+'.op-head{display:flex;gap:12px;align-items:baseline;justify-content:space-between;flex-wrap:wrap;border-bottom:3px solid #348292;padding-bottom:8px;margin-bottom:14px}'
+'.op-head h2{margin:0;font-size:24px;line-height:1.1}.op-head p{margin:2px 0 0;color:var(--mut);font-size:13px}'
+'.op-stand{text-align:right;font-size:13px;color:var(--mut)}.op-stand b{color:var(--ink)}'
+'.op-alt{display:inline-block;background:var(--bad);color:#fff;font-weight:700;padding:1px 9px;border-radius:99px;margin-left:6px}'
+'.op h3{margin:18px 0 8px;font-size:12.5px;text-transform:uppercase;letter-spacing:.08em;color:#2a6b78}'
+'.op-prob{display:flex;gap:10px;align-items:flex-start;padding:10px 14px;border:1px solid var(--line);border-left:6px solid var(--ok);background:var(--tl);font-size:15px}'
+'.op-prob.y{border-left-color:var(--w)}.op-prob.r{border-left-color:var(--bad)}.op-prob b{white-space:nowrap}'
+'.op-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}'
+'.op-t{border:1px solid var(--line);padding:10px 12px;position:relative}.op-t b{display:block;font-size:28px;line-height:1.1}.op-t .l{display:block;font-size:13px;font-weight:600;margin-top:2px}.op-t .c{display:block;font-size:12px;color:var(--mut);margin-top:2px}'
+'.op-d{position:absolute;right:10px;top:10px;width:14px;height:14px;border-radius:50%;background:var(--ok)}.op-d.y{background:var(--w)}.op-d.r{background:var(--bad)}'
+'.op-bad{color:var(--bad)}.op-ok{color:var(--ok)}.op-w{color:var(--w)}'
+'.op-cols{display:grid;grid-template-columns:3fr 2fr;gap:20px;align-items:start}'
+'.op-tab{width:100%;border-collapse:collapse;font-size:13px}.op-tab th,.op-tab td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--line);vertical-align:middle}.op-tab th{background:var(--tl);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em}'
+'.op-bar{display:inline-block;vertical-align:middle;width:110px;height:9px;background:#e4ecee;margin-left:8px;border-radius:5px;overflow:hidden}.op-bar i{display:block;height:100%;background:#348292}.op-bar.ok i{background:var(--ok)}'
+'.op-gr{display:grid;gap:8px}.op-gr div{display:grid;grid-template-columns:110px 1fr 70px;gap:8px;align-items:center;font-size:13px}.op-gr .bar{height:12px;background:#e4ecee;border-radius:6px;overflow:hidden}.op-gr .bar i{display:block;height:100%;background:#348292}.op-gr .bar.ok i{background:var(--ok)}'
+'.op-foot{margin-top:16px;border-top:1px solid var(--line);padding-top:8px;font-size:12px;color:var(--mut)}'
+'@media (max-width:760px){.op{padding:14px}.op-cols{grid-template-columns:1fr}.op-gr div{grid-template-columns:90px 1fr 60px}}'
+'</style>';
function bnow(){return Date.parse(new Date().toLocaleString('sv-SE',{timeZone:'Europe/Berlin'}).replace(' ','T').slice(0,16)+':00Z')}
function bts(x){var s=String(x||'');if(s.length<16)return NaN;return Date.parse(s.slice(0,10)+'T'+s.slice(11,16)+':00Z')}
function minVor(x){var t=bts(x);return isNaN(t)?null:Math.max(0,Math.round((bnow()-t)/60000))}
function pct(a,b){return b>0?Math.round(100*a/b):null}
function secOP(by){
var it=by&&by['onepager'];
if(!it||!it.daten)return ST+'<div class="op"><p class="muted">Noch keine Zahlen in Wix. Sie entstehen nach dem nächsten Start oder Paket einer Scheibe, spätestens zur vollen Stunde.</p></div>';
var d=it.daten,g=d.grenzen||{};
function gn(k){var v=Number(g[k]);return (g[k]===undefined||g[k]===null||g[k]===''||isNaN(v))?null:v}
function G(k,u){var v=g[k];return (v===undefined||v===null||v==='')?'<b class="op-bad">'+esc(k)+' fehlt</b>':'<b>'+esc(v)+(u||'')+'</b>'}
var alterMin=d.erzeugtMs?Math.round((Date.now()-Number(d.erzeugtMs))/60000):null,altGrenze=gn('onepager_alt_min'),alt=(alterMin==null)||(altGrenze!=null&&alterMin>altGrenze);
var v=d.version||{},sc=d.scheiben||{},pk=d.pakete||{},fz=d.freigaben||{},ns=fz.nachStatus||{},bf=d.befunde||{},sp=d.sperre||{},sd=d.scheduler||{},qu=d.quellen,ls=d.letzteScheibe,gj=d.gruppeJetzt||{};
var auf=d.aufgaben||[],still=gn('scheibe_still_min'),ablauf=gn('sperre_ablauf_min');
var seitScheibe=ls?minVor(ls.start):null,seitSperre=sp.belegt?minVor(sp.seit):null;
/* Betriebszeit der Scheiben aus den Grenzen (Mo bis Fr); fehlt eine Grenze, wird kein Stillstand gemeldet */
var bVon=gn('betrieb_stunde_von'),bBis=gn('betrieb_stunde_bis'),nowB=new Date().toLocaleString('sv-SE',{timeZone:'Europe/Berlin'}),wt=new Date(nowB.slice(0,10)+'T12:00:00Z').getUTCDay(),std=Number(nowB.slice(11,13)),inBetrieb=(bVon!=null&&bBis!=null)?(wt>=1&&wt<=5&&std>=bVon&&std<=bBis):null;
var stillMin=null;if(inBetrieb){var stMs=Date.parse(nowB.slice(0,10)+'T'+(bVon<10?'0':'')+bVon+':00:00Z'),lm=ls?bts(ls.start):NaN,refMs=(isNaN(lm)||lm<stMs)?stMs:lm;stillMin=Math.round((bnow()-refMs)/60000)}
var steht=!!(inBetrieb&&still!=null&&stillMin!=null&&stillMin>still);
/* Soll-Erfuellung: je Aufgabe hoechstens das Soll zaehlt, damit ein Ueberschuss ein Defizit nicht verdeckt */
var sollSum=0,istSum=0,gr={},luecken=[];
auf.forEach(function(a){if(a.soll>0){var i=Math.min(a.ist||0,a.soll);sollSum+=a.soll;istSum+=i;var k=a.gruppe||'überall';gr[k]=gr[k]||{ist:0,soll:0};gr[k].ist+=i;gr[k].soll+=a.soll;if((a.ist||0)<a.soll)luecken.push({k:a.k,fehlt:a.soll-(a.ist||0),ist:a.ist||0,soll:a.soll})}});
luecken.sort(function(x,y){return y.fehlt-x.fehlt});
var erf=pct(istSum,sollSum),besQ=pct(sc.besetzt,sc.gestartet),arbQ=pct(sc.gearbeitet,sc.gestartet),pkJe=sc.gearbeitet>0?Math.round(10*pk.gesamt/sc.gearbeitet)/10:null;
/* Probleme nach fester Rangfolge, die ersten zwei werden genannt */
var P=[];
if(alt)P.push({s:'r',t:'Die Zahlen sind '+(alterMin==null?'ohne Zeitstempel':nf(alterMin,0)+' Minuten alt')+', der Betrieb hat länger nichts neu gerechnet.'});
if(steht)P.push({s:'r',t:'Seit '+nf(stillMin,0)+' Minuten hat keine Scheibe mehr gestartet, die Arbeit steht.'});
if(pk.fehler>0||sc.fehler>0)P.push({s:'r',t:nf((pk.fehler||0)+(sc.fehler||0),0)+' Fehler bei Start oder Paket heute.'});
if(d.ergebnisseOhnePaket>0)P.push({s:'r',t:nf(d.ergebnisseOhnePaket,0)+' Ergebnisse haben kein Paket: gearbeitet, aber nicht verbucht.'});
if(ablauf!=null&&seitSperre!=null&&seitSperre>ablauf)P.push({s:'r',t:'Das LinkedIn-Schloss ist seit '+nf(seitSperre,0)+' Minuten belegt, länger als erlaubt.'});
if(bf.hoch>0)P.push({s:'r',t:nf(bf.hoch,0)+' offene Befunde mit hoher Dringlichkeit.'});
if(sc.gestartet>0&&sc.besetzt>0)P.push({s:'y',t:nf(sc.besetzt,0)+' von '+nf(sc.gestartet,0)+' Scheiben ('+besQ+' %) fanden das LinkedIn-Fenster besetzt und konnten dort nicht arbeiten.'});
if(luecken.length)P.push({s:'y',t:'Größte Lücke heute: '+esc(luecken[0].k)+' mit '+nf(luecken[0].ist,0)+' von '+nf(luecken[0].soll,0)+'.'});
var top=P.slice(0,2),pc=top.some(function(x){return x.s==='r'})?'r':(top.length?'y':'');
function T(a,big,l,c){return '<div class="op-t"><i class="op-d'+(a==='g'?'':' '+a)+'"></i><b>'+big+'</b><span class="l">'+l+'</span><span class="c">'+(c||'')+'</span></div>'}
var h=ST+'<div class="op">';
h+='<div class="op-head"><div><h2>KI-Betrieb heute</h2><p>Zustand des Systems, Zahlen aus dem Code</p></div>';
h+='<div class="op-stand">Zahlen von <b>'+esc(d.jetzt||'?')+' Uhr</b>'+(alterMin==null?'':' (vor '+alterMin+' Min)')+(alt?'<span class="op-alt">veraltet</span>':'')+'<br>Architektur '+esc(v.architektur||'?')+(v.stand?', Stand '+esc(v.stand):'')+'</div></div>';
h+='<div class="op-prob '+pc+'"><b>Größte Probleme</b><span>'+(top.length?top.map(function(x){return x.t}).join(' '):'Aktuell erkennt der Code kein Problem.')+'</span></div>';
h+='<h3>Heute ('+esc(d.tag||'')+')</h3><div class="op-tiles">';
h+=T(steht?'r':'g',nf(sc.gestartet,0),'Scheiben gestartet','davon '+nf(sc.gearbeitet,0)+' gearbeitet'+(arbQ!=null?' ('+arbQ+' %)':'')+(seitScheibe!=null?', letzte vor '+nf(seitScheibe,0)+' Min':'')+(inBetrieb===false?', außerhalb der Betriebszeit':''));
h+=T(sc.besetzt>0?'y':'g',besQ==null?'–':besQ+' %','Besetzt-Quote',nf(sc.besetzt,0)+' von '+nf(sc.gestartet,0)+' Starts fanden das Fenster belegt');
h+=T(pk.fehler>0?'r':'g',nf(pk.gesamt,0),'Pakete verbucht',nf(pk.fehler,0)+' mit Fehler'+(pkJe!=null?', '+nf(pkJe,1)+' je gearbeitete Scheibe':''));
h+=T(d.ergebnisseOhnePaket>0?'r':'g',d.ergebnisseOhnePaket==null?'?':nf(d.ergebnisseOhnePaket,0),'Ergebnisse ohne Paket','Prüfung nach '+esc(g.debug_paket_wartet_min==null?'?':g.debug_paket_wartet_min)+' Min');
h+=T(erf==null?'y':(erf>=100?'g':'y'),erf==null?'–':erf+' %','Soll erfüllt',nf(istSum,0)+' von '+nf(sollSum,0)+' Soll-Einheiten, Überschuss zählt nicht');
h+=T(bf.hoch>0?'r':(bf.offen>0?'y':'g'),nf(bf.offen,0),'Offene Befunde',nf(bf.hoch,0)+' mit hoher Dringlichkeit');
h+=T(ns.offen>0?'y':'g',nf(ns.offen||0,0),'Freigaben offen',nf(ns.freigegeben||0,0)+' bereit zum Senden, '+nf(fz.gesamt,0)+' gesamt');
h+=T(d.debug&&d.debug.fehler24h>0?'r':'g',nf(d.debug&&d.debug.fehler24h,0),'Fehler im Debug-Protokoll','letzte 24 h, '+nf(d.debug&&d.debug.eintraege24h,0)+' Einträge');
if(qu)h+=T(qu.ruhen>0?'y':'g',nf(qu.anzahl,0),'Quellen im Plan',nf(qu.ruhen,0)+' ruhen'+((qu.reihe||[]).length?', als Nächste: '+esc((qu.reihe||[]).slice(0,3).join(', ')):''));
else h+=T('r','–','Quellenplan','fehlt in Wix');
h+='</div>';
var keys=Object.keys(gr).sort();
h+='<div class="op-cols"><div><h3>Aufgaben heute: Ist gegen Soll</h3><table class="op-tab"><thead><tr><th>Aufgabe</th><th>Gruppe</th><th>Ist</th><th>Soll</th><th>Stand</th></tr></thead><tbody>';
var rows=auf.filter(function(a){return (a.soll>0)||(a.ist>0)});
rows.forEach(function(a){var p=a.soll>0?Math.max(0,Math.min(100,Math.round(100*(a.ist||0)/a.soll))):0;h+='<tr><td><b>'+esc(a.k)+'</b></td><td>'+esc(a.gruppe||'überall')+'</td><td>'+nf(a.ist,0)+(a.soll>0?'<span class="op-bar'+(p>=100?' ok':'')+'"><i style="width:'+p+'%"></i></span>':'')+'</td><td>'+(a.soll>0?nf(a.soll,0):'–')+'</td><td>'+esc(a.stand||'')+'</td></tr>'});
if(!rows.length)h+='<tr><td colspan="5">Heute noch keine Aufgabe mit Soll oder Ist.</td></tr>';
var rest=auf.length-rows.length;
h+='</tbody></table>'+(rest>0?'<p style="margin:4px 0 0;color:var(--mut);font-size:12px">'+nf(rest,0)+' weitere Aufgaben ohne Soll und Ist heute.</p>':'')+'</div><div>';
h+='<h3>Soll-Erfüllung je Gruppe</h3><div class="op-gr">';
keys.forEach(function(k){var p=pct(gr[k].ist,gr[k].soll)||0;h+='<div><span><b>'+esc(k)+'</b></span><span class="bar'+(p>=100?' ok':'')+'"><i style="width:'+Math.min(100,p)+'%"></i></span><span>'+p+' %</span></div>'});
if(!keys.length)h+='<p class="muted">Heute noch kein Soll.</p>';
h+='</div>';
var ng=sc.nachGruppe||{},gk=Object.keys(ng).sort();
h+='<h3>Scheiben heute nach Gruppe</h3><div class="op-gr">';
gk.forEach(function(k){var p=pct(ng[k],sc.gestartet)||0;h+='<div><span><b>'+esc(k)+'</b></span><span class="bar"><i style="width:'+p+'%"></i></span><span>'+nf(ng[k],0)+' ('+p+' %)</span></div>'});
if(!gk.length)h+='<p class="muted">Noch keine Scheibe heute.</p>';
h+='</div>';
if(luecken.length>1){h+='<h3>Größte Lücken</h3><table class="op-tab"><tbody>'+luecken.slice(0,4).map(function(x){return '<tr><td><b>'+esc(x.k)+'</b></td><td>fehlen '+nf(x.fehlt,0)+'</td><td>'+nf(x.ist,0)+' von '+nf(x.soll,0)+'</td></tr>'}).join('')+'</tbody></table>'}
h+='</div></div>';
h+='<h3>Zustand jetzt</h3><div class="op-tiles">';
h+=T(sp.belegt?(ablauf!=null&&seitSperre!=null&&seitSperre>ablauf?'r':'y'):'g',sp.belegt?'belegt':'frei','LinkedIn-Schloss',sp.belegt?'von '+esc(sp.halter)+' seit '+esc(sp.seit)+(seitSperre!=null?' ('+nf(seitSperre,0)+' Min)':''):'Ablauf nach '+G('sperre_ablauf_min',' Min'));
h+=T(sd.zustand==='bereit'||sd.zustand==='laeuft'?'g':'y',esc(sd.zustand||'?'),'Scheduler',(sd.laeuftVon?esc(sd.laeuftVon)+' seit '+esc(sd.laeuftSeit):'seit '+esc(sd.laeuftSeit||'?'))+(sd.neustarts!=null?', Neustarts: '+nf(sd.neustarts,0):''));
h+=T('g',esc(gj.gruppe||'alle'),'Gruppe zu dieser Minute',esc(gj.grund||'')||'nach Plan: '+esc((d.gruppen||[]).map(function(s){return ':'+s.minute+' '+s.gruppe}).join(', ')));
h+=T('g',ls?esc(ls.gruppe||'alle'):'–','Letzte Scheibe',ls?esc(ls.lauf)+', Start '+esc(ls.start)+', '+nf(ls.pakete,0)+' Pakete':'heute noch keine');
h+='</div>';
h+='<div class="op-foot">Alle Zahlen kommen aus Wix und werden vom Code gerechnet (onepager.js), nichts ist von Hand eingetragen. Ampel: grün in Ordnung, gelb beachten, rot braucht Eingriff; Schwellen sind die Grenzen in Wix. Die Problemsätze folgen festen Regeln, nicht einer Schätzung. Aufgefrischt nach jedem Start und Paket, mindestens stündlich; die Seite lädt alle zwei Minuten neu. Zeiten in Berliner Ortszeit.</div></div>';
return h}
return secOP};