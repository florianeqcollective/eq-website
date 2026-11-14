/* Cockpit-Abschnitt secVB (13.11.2026): Lernen und Verbesserung in einem Dashboard.
   Quellen: KIDaten/verbesserung (Trichter, Stellschrauben, Lernpfade, vom Code um 2:50), KIDaten/verbesserung-system (Betrieb, System, Content,
   Stimme, Datenfrische, Hypothesen, vom Code um 2:55), KIDaten/lernschleifen (Funktionen, Register, ganz unten als Fold). Alles immer offen. */
window.EQIN=window.EQIN||{};
EQIN.secVB=function(D){
var NA=D.NA,esc=D.esc,nf=D.nf;
var ROLLE={'vertriebsbegleitung':'Vertriebsbegleitung','content-manager':'Content-Manager','website-guru':'Website-Guru','bwl-justus':'BWL-Justus'};
var PS={beobachten:'wird beobachtet',vorschlag:'Vorschlag liegt in den Freigaben',umgesetzt:'umgesetzt, Wirkung wird gemessen',wirkt:'wirkt',wirkt_nicht:'wirkt nicht',unklar:'unklar, zu wenig Fälle',verworfen:'abgelehnt',verfallen:'ohne Entscheidung verfallen',zurueckgenommen:'zurückgenommen'};
var BER=['Vertrieb','Betrieb','System','Content','Stimme','Daten'];
var ST={ok:['ok','in-ok'],auffaellig:['auffällig','in-bad'],beobachten:['beobachten',''],zu_wenig_daten:['zu wenig Daten','muted'],keine_quelle:['Quelle fehlt','muted']};
function rn(r){return ROLLE[r]||r}
function fv(k){return k.wert==null?'noch keine Daten':nf(k.wert,Math.abs(k.wert)<10?1:0)+' '+k.einheit}
function fr(k){if(k.referenz==null)return '<span class="muted">keine Referenz</span>';return (k.richtung==='hoch'?'≥ ':'≤ ')+esc(nf(k.referenz,Math.abs(k.referenz)<10?1:0))+' '+esc(k.einheit)+(k.referenz_quelle?'<br><span class="muted">'+esc(k.referenz_quelle)+'</span>':'')}
function zs(k){var s=ST[k.status]||[k.status,''];return '<b class="'+s[1]+'">'+esc(s[0])+'</b>'+(k.grund?'<br><span class="muted">'+esc(k.grund)+'</span>':'')}
function trichter(d){return (d.stufen||[]).map(function(s){var q=s.art==='quote';
 var st=s.zustand==='unter Referenz'?'auffaellig':(s.zustand==='ok'?'ok':'zu_wenig_daten');
 return {id:'trichter_'+s.id,bereich:'Vertrieb',name:s.name,einheit:q?'%':'Anzahl',richtung:'hoch',besitzer:rn(s.rolle),wert:s.wert,referenz:s.ref,referenz_quelle:'Soll aus KIDaten/soll',n:s.n,status:st,grund:st==='zu_wenig_daten'&&s.fehlen!=null?'noch '+s.fehlen+(q?' Fälle':' Monate'):''}})}
function tabelle(rows){return '<div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Kennzahl</th><th>Besitzer</th><th>Wert</th><th>Referenz</th><th>Fälle</th><th>Status</th></tr></thead><tbody>'+rows.map(function(k){return '<tr><td>'+esc(k.name)+(k.hinweis?'<br><span class="muted">'+esc(k.hinweis)+'</span>':'')+'</td><td>'+esc(k.besitzer)+'</td><td>'+esc(fv(k))+'</td><td>'+fr(k)+'</td><td>'+esc(k.n)+'</td><td>'+zs(k)+'</td></tr>'}).join('')+'</tbody></table></div>'}
function details(k){var d=k.detail||{},h='';
 if(k.id==='befunde_wiederkehr'&&(d.gruppen||[]).length)h+='<li><b>Wiederkehrende Ursachen:</b> '+d.gruppen.map(function(g){return esc(g.n)+' mal, '+esc(g.offen)+' offen: '+esc(g.beispiel)}).join(' | ')+'</li>';
 if(k.id==='befunde_alt')h+='<li><b>Offene Befunde:</b> '+esc(d.offen)+', davon hoch '+esc(d.hoch)+', ältester '+esc(d.aeltester_tage)+' Tage, mittlere Zeit bis Schließen '+(d.median_tage_bis_schliessen==null?'unbekannt':esc(nf(d.median_tage_bis_schliessen,1))+' Tage')+'</li>';
 if(k.id==='freigegeben_offen'&&(d.zeilen||[]).length)h+='<li><b>Freigegeben, nicht ausgeführt:</b> '+d.zeilen.map(function(z){return esc(z.id)+' ('+esc(z.art)+', seit '+esc(z.seit)+', '+esc(z.alter)+' Tage)'}).join(' | ')+'</li>';
 if(k.id==='zaehler_erfuellung'&&(d.je_aufgabe||[]).length)h+='<li><b>Zähler am '+esc(d.datum)+':</b> '+d.je_aufgabe.map(function(z){return esc(z.aufgabe)+' '+esc(z.ist)+' von '+esc(z.soll)}).join(' | ')+'</li>';
 if(k.id==='content_vs_schnitt'&&(d.je_konto||[]).length)h+='<li><b>Je Konto:</b> '+d.je_konto.map(function(z){return esc(z.konto)+' '+esc(z.impressionen_neu)+' gegen '+esc(z.impressionen_frueher)+' ('+esc(z.quote)+' %)'}).join(' | ')+'</li>';
 if(k.id==='blog_linkedin'&&d.mit_linkedin)h+='<li><b>Blog:</b> mit LinkedIn-Verlinkung '+esc(d.mit_linkedin.n)+' Beiträge, '+(d.mit_linkedin.je_tag==null?'–':esc(nf(d.mit_linkedin.je_tag,2)))+' Aufrufe je Tag; ohne '+esc(d.ohne_linkedin.n)+' Beiträge, '+(d.ohne_linkedin.je_tag==null?'–':esc(nf(d.ohne_linkedin.je_tag,2)))+' je Tag. Beiträge ab Mindestalter: '+(d.beitraege||[]).map(function(b){return esc(b.titel)+' ('+esc(nf(b.aufrufe,0))+' Aufrufe, '+esc(b.alter)+' Tage'+(b.mit_linkedin?', mit LinkedIn':'')+')'}).join(' | ')+'</li>';
 if(k.id==='plan_einhaltung'&&(d.nicht_veroeffentlicht||[]).length)h+='<li><b>Nicht veröffentlicht:</b> '+d.nicht_veroeffentlicht.map(function(z){return esc(z.id)+' '+esc(z.datum)+' ('+esc(z.status)+')'}).join(' | ')+'</li>';
 if(k.id==='laeufe_ohne_ergebnis'&&d.je_aufgabe){var a=[];for(var t in d.je_aufgabe)a.push(esc(t)+' '+esc(d.je_aufgabe[t]));if(a.length)h+='<li><b>Ohne Ergebnis oder mit Fehler je Aufgabe:</b> '+a.join(', ')+'</li>'}
 if(k.id==='scheiben_abbruch'&&(d.beispiele||[]).length)h+='<li><b>Abgebrochen:</b> '+d.beispiele.map(function(z){return esc(z.lauf)+' ('+esc(z.zeit)+')'}).join(' | ')+'</li>';
 return h}
function secVB(by){
 var A=by['verbesserung'],B=by['verbesserung-system'],ad=A&&A.daten,bd=B&&B.daten;
 if(!ad&&!bd)return '<p class="in-note">Noch kein Lauf. Der Code misst jede Nacht um 2:50 (Trichter) und 2:55 Berlin (Betrieb, System, Content, Stimme, Datenfrische). Danach steht hier alles, was gemessen wird, mit Referenz, Besitzer und Status.</p>';
 var rows=[];if(ad)rows=rows.concat(trichter(ad));if(bd)rows=rows.concat(bd.kennzahlen||[]);
 var cnt=function(f){return rows.filter(f).length};
 var h='<p class="in-ls-sum"><b class="in-bad">'+cnt(function(k){return k.status==='auffaellig'})+' auffällig</b>, <b class="in-ok">'+cnt(function(k){return k.status==='ok'})+' ok</b>, '+cnt(function(k){return k.status==='beobachten'})+' ohne Referenz (beobachten), '+cnt(function(k){return k.status==='zu_wenig_daten'||k.status==='keine_quelle'})+' mit zu wenig Daten oder ohne Quelle. Der Code misst jede Nacht, das Modell formuliert nur Hypothese und Eingriff, ihr entscheidet in den Freigaben. Ein Hebel je Rolle gleichzeitig.</p>';
 if(!ad)h+='<p class="in-note">Trichter-Kennzahlen: erster Lauf heute Nacht um 2:50.</p>';
 if(!bd)h+='<p class="in-note">Betrieb, System, Content und Stimme: erster Lauf heute Nacht um 2:55.</p>';
 var fd=bd&&bd.frische||[],alt=fd.filter(function(x){return !x.frisch});
 if(alt.length)h+='<p class="in-note"><b class="in-bad">Datenlage:</b> '+alt.length+' von '+fd.length+' Dokumenten sind veraltet ('+alt.map(function(x){return esc(x.id)+' Stand '+esc(x.stand||'unbekannt')}).join(', ')+'). Kennzahlen, die darauf beruhen, zeigen alte Werte. Der Befund liegt in den Befunden.</p>';
 BER.forEach(function(b){var r=rows.filter(function(k){return k.bereich===b});if(!r.length)return;
  var titel={Vertrieb:'Vertrieb: Trichter',Betrieb:'Betrieb',System:'System-Verhalten',Content:'Content',Stimme:'Stimme und Entscheidungen',Daten:'Datenfrische'}[b];
  h+='<h3 style="margin-top:22px">'+esc(titel)+' ('+r.length+')</h3>'+tabelle(r);
  var dl=r.map(details).filter(Boolean).join('');if(dl)h+='<details class="in-fold"><summary>Details zu '+esc(titel)+'</summary><div class="in-fb"><ul>'+dl+'</ul></div></details>'});
 if(fd.length)h+='<h3 style="margin-top:22px">Datenfrische je Dokument</h3><div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Dokument</th><th>Stand</th><th>Alter</th><th>Erwartet höchstens</th><th>Status</th></tr></thead><tbody>'+fd.map(function(x){return '<tr><td>'+esc(x.id)+'</td><td>'+esc(x.stand||'unbekannt')+'</td><td>'+(x.alter==null?'–':esc(x.alter)+' Tage')+'</td><td>'+esc(x.erwartet)+' Tage</td><td>'+(x.frisch?'<b class="in-ok">frisch</b>':'<b class="in-bad">veraltet</b>')+'</td></tr>'}).join('')+'</tbody></table></div>';
 var K=(ad&&ad.kandidaten)||[],H=(bd&&bd.hypothesen)||[],P=(ad&&ad.pfade)||[];
 h+='<h3 style="margin-top:22px">Stellschrauben und Hypothesen ('+(K.length+H.length)+')</h3>';
 if(K.length)h+='<div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Rolle</th><th>Trichter-Kennzahl</th><th>Wert</th><th>Referenz</th><th>Abstand</th></tr></thead><tbody>'+K.map(function(k){return '<tr><td>'+esc(rn(k.rolle))+'</td><td>'+esc(k.name)+'</td><td>'+esc(nf(k.wert,1))+'</td><td>'+esc(nf(k.ref,1))+'</td><td>'+esc(nf(100*k.abstand,0))+' %</td></tr>'}).join('')+'</tbody></table></div>';
 if(H.length)h+='<div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Bereich</th><th>Besitzer</th><th>Hypothese des Codes</th></tr></thead><tbody>'+H.map(function(x){return '<tr><td>'+esc(x.bereich)+'</td><td>'+esc(x.besitzer)+'</td><td>'+esc(x.text)+'</td></tr>'}).join('')+'</tbody></table></div>';
 h+=(K.length+H.length)?'<p class="in-note">Zu jeder Zeile legt die nächtliche Lernrunde eine Hypothese und einen Eingriff als Lernvorschlag in die Freigaben.</p>':'<p class="in-note">Keine Stellschraube und keine Hypothese fällig. Entweder liegt alles innerhalb der Referenz, oder es fehlen Fälle, oder die Rolle hat schon einen Hebel in Arbeit.</p>';
 h+='<h3 style="margin-top:22px">Lernpfade ('+P.length+')</h3>';
 h+=P.length?'<div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Nr.</th><th>Rolle</th><th>Kennzahl</th><th>Status</th><th>Hypothese</th><th>Eingriff</th><th>Vorher</th><th>Jetzt</th><th>Ergebnis</th></tr></thead><tbody>'+P.map(function(p){var v=function(x){return x==null?'':nf(x,1)};return '<tr><td>'+esc(p.id)+'</td><td>'+esc(rn(p.rolle))+'</td><td>'+esc(p.name)+'</td><td>'+esc(PS[p.status]||p.status)+'</td><td>'+esc(p.hypothese)+'</td><td>'+esc(p.eingriff)+'</td><td>'+esc(v(p.vorher))+'</td><td>'+esc(v(p.jetzt))+'</td><td>'+esc(p.ergebnis)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="in-note">Noch kein Lernpfad. Er entsteht, sobald ein Vorschlag von euch freigegeben und umgesetzt wird, und läuft dann bis zum Urteil wirkt oder wirkt nicht.</p>';
 var stand=[];if(ad)stand.push('Trichter '+esc(ad.stand||''));if(bd)stand.push('Betrieb, System, Content, Stimme '+esc(bd.stand||''));
 return h+'<div class="in-note">Stand '+stand.join(', ')+'. Die Quelle jeder Referenz steht in der Sammlung grenzen. Keine Namen, nur Gruppen und Zahlen.</div>'}
return secVB;
};