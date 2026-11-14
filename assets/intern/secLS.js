/* Cockpit-Abschnitt secLS. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secLS=function(D){
var NA=D.NA,esc=D.esc;
function secLS(by){var it=by['lernschleifen'];if(!it||!it.daten)return NA;var d=it.daten,F=d.funktionen||[],k=d.kennzahlen||{},R=d.register||[],T=['messen','auswerten','anpassen','wirkung'],TN={messen:'Messen',auswerten:'Auswerten',anpassen:'Anpassen',wirkung:'Wirkung'},LS={umgesetzt:'umgesetzt, Wirkung wird geprüft',wirkt:'wirkt',wirkt_nicht:'wirkt nicht',zurueckgenommen:'zurückgenommen'};
var vf=function(x){return x&&typeof x==='object'?(x.wert!=null?x.wert:''):(x==null?'':x)};
var cnt={geschlossen:0,teilweise:0,offen:0,manuell:0};F.forEach(function(f){if(cnt[f.status]!=null)cnt[f.status]++});
var h='<p class="in-ls-sum"><b class="in-ok">'+cnt.geschlossen+' geschlossen</b>, '+cnt.teilweise+' teilweise, <b class="in-bad">'+cnt.offen+' offen</b>'+(cnt.manuell?', '+cnt.manuell+' bewusst manuell':'')+'. Lernvorschläge offen: '+esc(k.vorschlaege_offen||0)+', umgesetzt: '+esc(k.umgesetzt||0)+', wirkt: '+esc(k.wirkt||0)+', wirkt nicht: '+esc(k.wirkt_nicht||0)+'. Die Begründung steht unter jeder Phase.</p><div class="in-ls-grid">';
F.forEach(function(f){var c=f.status==='geschlossen'?'g':f.status==='teilweise'?'t':f.status==='offen'?'o':'',w=f.warum||{};
h+='<div class="in-ls-c '+c+'"><div class="in-ls-st">'+esc(f.status)+'</div><h3>'+esc(f.name)+'</h3>';
if(f.status!=='manuell'){h+='<div class="in-ls-p">'+T.map(function(t){var v=f[t]||'nein';return '<button type="button" class="in-ls-b '+esc(v)+'" data-k="'+t+'" aria-expanded="false" title="'+esc(TN[t]+': '+v)+'">'+TN[t]+'</button>'}).join('')+'</div>'+T.map(function(t){return '<div class="in-ls-w" data-w="'+t+'" hidden><b>'+TN[t]+': '+esc(f[t]||'nein')+'.</b> '+esc(w[t]||'Noch keine Begründung hinterlegt.')+'</div>'}).join('')}
h+='<div class="in-ls-f">'+esc(f.faelle||'')+'</div>'+(f.offene_aenderung?'<div class="in-ls-oa"><b>Offene Änderung:</b> '+esc(f.offene_aenderung)+'</div>':'');
var L=R.filter(function(r){return (r.funktion===f.id||r.funktion===f.name)&&LS[r.status]});
h+='<details class="in-ls-det"><summary>Gelernt und umgesetzt ('+L.length+')</summary>'+(L.length?'<ul>'+L.map(function(r){return '<li><b>'+esc(r.id)+'</b> '+esc(r.hypothese)+'<br><span class="muted">'+esc(LS[r.status])+(r.kennzahl?' · '+esc(r.kennzahl)+': '+esc(vf(r.vorher))+' → '+esc(vf(r.jetzt)):'')+(r.ergebnis?' · '+esc(r.ergebnis):'')+'</span></li>'}).join('')+'</ul>':'<p class="muted" style="margin:8px 0 0">Noch nichts gelernt und umgesetzt.</p>')+'</details></div>'});
h+='</div>';
if(R.length){h+='<h3 style="margin-top:22px">Register der Änderungen</h3><div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Nr.</th><th>Funktion</th><th>Hypothese</th><th>Status</th><th>Kennzahl</th><th>Vorher</th><th>Jetzt</th></tr></thead><tbody>'+R.map(function(r){return '<tr><td>'+esc(r.id)+'</td><td>'+esc(r.funktion)+'</td><td>'+esc(r.hypothese)+'</td><td>'+esc(r.status)+'</td><td>'+esc(r.kennzahl)+'</td><td>'+esc(vf(r.vorher))+'</td><td>'+esc(vf(r.jetzt))+'</td></tr>'}).join('')+'</tbody></table></div>'}
else h+='<p class="in-note">Noch keine Änderungen im Register. Der Lauf Lernstand legt Lernvorschläge an, sobald genug Fälle da sind.</p>';
var ZZ=by['lernen-bauen'],ZP=(ZZ&&ZZ.daten&&ZZ.daten.punkte)||[];
if(ZP.length){h+='<h3 style="margin-top:22px">Noch zu bauen ('+ZP.length+')</h3><div class="in-ls-tw"><table class="in-ls-t"><thead><tr><th>Was</th><th>Kennzahl</th><th>Bereit</th></tr></thead><tbody>'+ZP.map(function(p){return '<tr><td>'+esc(p.name)+'</td><td>'+esc(p.kennzahl)+'</td><td>'+esc(p.bereit)+'</td></tr>'}).join('')+'</tbody></table></div>'}
return h+'<div class="in-note">Stand '+esc(d.stand||'')+'. Quelle: '+esc(d.quelle||'')+'. Keine Namen, nur Gruppen und Zahlen.</div>'}
return secLS;
};
