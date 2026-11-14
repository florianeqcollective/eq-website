/* Cockpit-Abschnitt secGR (unten im Reiter KI-Betrieb, 14.11.2026): Grenzen ansehen und aendern. Version 1.0.
   Die Seite schickt NUR den Wunsch an /_functions/grenzen (Zugangs-Token des angemeldeten Kontos). Wer aendern darf, was gueltig ist
   (Art, Bereich, Querbeziehungen) und das Protokoll entscheidet der Code in Wix (grenzen_pflege.js), nicht diese Seite.
   Die Anzeige wird nicht von der Auffrischung der Seite (alle 2 Minuten) neu gezeichnet, damit eine angefangene Eingabe bleibt.
   Texte, Listen, Adressen und Sicherheitsgrenzen sind nur lesbar. Jede Aenderung braucht einen Grund und wird erst nach Bestaetigung gespeichert. */
window.EQIN=window.EQIN||{};
EQIN.secGR=function(D){
var esc=D.esc;
var EP='https://app.eq-collective.de/_functions/grenzen',KS='eq_in_tok';
var KERN=['vernetzen_tag_max','vernetzen_woche_max','linkedin_tag_max','vernetzen_vorrat_zuschlag_prozent','gruesse_tag_max','kommentare_tag','freigaben_pro_scheibe_max','scheibe_budget_min','scheibe_hart_min','betrieb_alle_tage','betrieb_stunde_von','betrieb_stunde_bis','kein_aufgeben_vernetzen','cloud_aktiv','trockenlauf'];
var CSS='<style>'
+'#s-gr .gr{--ink:#161616;--mut:#5a6b6e;--line:#d5e0e2;--tl:#eef4f5;--bad:#b3261e;--ok:#1f7a4d;--w:#d9951a;color:var(--ink)}'
+'#s-gr .gr-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 14px}'
+'#s-gr .gr-tools input[type=search]{flex:1 1 220px;min-width:0;padding:8px 10px;border:1px solid var(--line);border-radius:8px;font:inherit}'
+'#s-gr .gr-tools label{display:flex;gap:6px;align-items:center;font-size:13px;color:var(--mut)}'
+'#s-gr .gr-g{margin:18px 0 6px;font-size:15px;font-weight:600}'
+'#s-gr .gr-t{width:100%;border-collapse:collapse;font-size:14px}'
+'#s-gr .gr-w{overflow-x:auto;border:1px solid var(--line);border-radius:10px}'
+'#s-gr .gr-t td{padding:8px 10px;border-top:1px solid var(--line);vertical-align:top}'
+'#s-gr .gr-t tr:first-child td{border-top:0}'
+'#s-gr .gr-k{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;overflow-wrap:anywhere;min-width:190px}'
+'#s-gr .gr-n{display:block;color:var(--mut);font-size:12px;margin-top:2px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px}'
+'#s-gr .gr-v{white-space:nowrap}'
+'#s-gr .gr-v input,#s-gr .gr-v select{width:110px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff;color:var(--ink)}'
+'#s-gr .gr-v input.ch,#s-gr .gr-v select.ch{border-color:var(--w);background:#fff8e8}'
+'#s-gr .gr-ro{color:var(--mut);overflow-wrap:anywhere;white-space:normal;max-width:260px;font-size:13px}'
+'#s-gr .gr-u{color:var(--mut);font-size:13px;min-width:90px}'
+'#s-gr .gr-s{color:var(--mut);font-size:12px;white-space:nowrap}'
+'#s-gr .gr-b{padding:6px 12px;border:1px solid var(--ink);border-radius:8px;background:var(--ink);color:#fff;font:inherit;cursor:pointer}'
+'#s-gr .gr-b[disabled]{opacity:.35;cursor:default}'
+'#s-gr .gr-b.sek{background:#fff;color:var(--ink)}'
+'#s-gr .gr-c td{background:var(--tl)}'
+'#s-gr .gr-c .gr-in{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:8px}'
+'#s-gr .gr-c input[type=text]{flex:1 1 260px;min-width:0;padding:8px 10px;border:1px solid var(--line);border-radius:8px;font:inherit}'
+'#s-gr .gr-err{color:var(--bad);margin:6px 0 0;font-size:13px}'
+'#s-gr .gr-ok{color:var(--ok);margin:6px 0 0;font-size:13px}'
+'#s-gr .gr-pill{display:inline-block;padding:1px 8px;border-radius:99px;background:var(--tl);color:var(--mut);font-size:12px}'
+'</style>';
var root=null,items=[],edits={},open=null,msg={},loaded=false,loading=false,filter='',nurAenderbar=false,abgerufen='',fehler='',busy=false,focusKey=null;
function token(){try{var t=JSON.parse(localStorage.getItem(KS)||'null');return t&&t.a&&Date.now()<t.e?t.a:null}catch(e){return null}}
function post(body){var a=token();if(!a)return Promise.reject(new Error('token'));
return fetch(EP,{method:'POST',headers:{'Content-Type':'application/json',Authorization:a},body:JSON.stringify(Object.assign({token:a},body))}).then(function(r){return r.json().catch(function(){return{ok:false,fehler:['Antwort nicht lesbar']}}).then(function(j){j.status=r.status;return j})})}
function nf(v){return typeof v==='number'?v.toLocaleString('de-DE',{maximumFractionDigits:6}):String(v)}
function anzeige(it){if(it.art==='schalter')return it.wert?'an':'aus';return String(it.wert)}
function gruppe(k){var m=/^([a-z0-9]+)_/.exec(k);return m?m[1]:'weitere'}
function find(k){for(var i=0;i<items.length;i++)if(items[i].schluessel===k)return items[i];return null}
function eingabe(it){
var cur=edits.hasOwnProperty(it.schluessel)?edits[it.schluessel]:null;
if(it.art==='schalter'){var v=cur===null?(it.wert?'an':'aus'):cur;
return '<select data-k="'+esc(it.schluessel)+'" class="gr-e'+(cur!==null&&cur!==(it.wert?'an':'aus')?' ch':'')+'" aria-label="'+esc(it.schluessel)+'"><option value="an"'+(v==='an'?' selected':'')+'>an</option><option value="aus"'+(v==='aus'?' selected':'')+'>aus</option></select>'}
var val=cur===null?String(it.wert):cur;
return '<input type="text" inputmode="decimal" data-k="'+esc(it.schluessel)+'" class="gr-e'+(cur!==null&&cur!==String(it.wert)?' ch':'')+'" value="'+esc(val)+'" aria-label="'+esc(it.schluessel)+'">'}
function geaendert(it){if(!edits.hasOwnProperty(it.schluessel))return false;var c=edits[it.schluessel];return it.art==='schalter'?c!==(it.wert?'an':'aus'):String(c).trim()!==String(it.wert)}
function zeile(it){
var k=it.schluessel,h='<tr data-r="'+esc(k)+'"><td class="gr-k">'+esc(k)+(it.notiz?'<span class="gr-n" title="'+esc(it.notiz)+'">'+esc(String(it.notiz).slice(0,160))+(String(it.notiz).length>160?' ...':'')+'</span>':'')+'</td>';
if(it.bearbeitbar){h+='<td class="gr-v">'+eingabe(it)+'</td><td class="gr-u">'+esc(it.einheit||'')+'</td><td class="gr-s">'+esc(it.stand||'')+'</td><td><button type="button" class="gr-b" data-a="aendern" data-k="'+esc(k)+'"'+(geaendert(it)&&!busy?'':' disabled')+'>Ändern</button></td></tr>'}
else{h+='<td class="gr-v gr-ro" title="'+esc(it.grund||'')+'">'+esc(String(it.wert).slice(0,120))+(String(it.wert).length>120?' ...':'')+'</td><td class="gr-u">'+esc(it.einheit||'')+'</td><td class="gr-s">'+esc(it.stand||'')+'</td><td><span class="gr-pill" title="'+esc(it.grund||'')+'">nur lesbar</span></td></tr>'}
if(open===k){var c=edits[k],neuTxt=it.art==='schalter'?c:String(c).trim();
h+='<tr class="gr-c" data-c="'+esc(k)+'"><td colspan="5"><strong>'+esc(k)+':</strong> '+esc(anzeige(it))+' → <strong>'+esc(neuTxt)+'</strong> '+esc(it.einheit||'')
+'<div class="gr-in"><input type="text" id="gr-grund" maxlength="200" placeholder="Grund (Pflicht, zum Beispiel: Flo will mehr Vorrat)" value="'+esc(msg.grund||'')+'" aria-label="Grund"><button type="button" class="gr-b" data-a="speichern"'+(busy?' disabled':'')+'>Speichern</button><button type="button" class="gr-b sek" data-a="abbrechen">Abbrechen</button></div>'
+(msg.err&&msg.k===k?'<p class="gr-err">'+msg.err.map(esc).join('<br>')+'</p>':'')+'</td></tr>'}
else if(msg.ok&&msg.k===k){h+='<tr class="gr-c"><td colspan="5"><span class="gr-ok">'+esc(msg.ok)+'</span></td></tr>'}
else if(msg.err&&msg.k===k){h+='<tr class="gr-c"><td colspan="5"><span class="gr-err">'+msg.err.map(esc).join('<br>')+'</span></td></tr>'}
return h}
function tabelle(liste){return '<div class="gr-w"><table class="gr-t"><tbody>'+liste.map(zeile).join('')+'</tbody></table></div>'}
function sichtbar(it){if(nurAenderbar&&!it.bearbeitbar)return false;if(!filter)return true;var f=filter.toLowerCase();return it.schluessel.toLowerCase().indexOf(f)>=0||String(it.einheit||'').toLowerCase().indexOf(f)>=0||String(it.notiz||'').toLowerCase().indexOf(f)>=0}
function render(){
if(!root)return;
var h=CSS+'<div class="gr"><h2 class="in-h">Grenzen</h2><p class="muted" style="margin:0;max-width:720px">Alle Zahlen, nach denen die Plattform rechnet. Eine Änderung gilt ab dem nächsten Lauf und wird mit Datum, Konto und Grund protokolliert. Texte, Listen, Adressen und Sicherheitsgrenzen sind nur lesbar.</p>';
if(fehler){h+='<p class="gr-err">'+esc(fehler)+'</p><p><button type="button" class="gr-b sek" data-a="laden">Neu laden</button></p></div>';root.innerHTML=h;return}
if(!loaded){h+='<p class="muted">'+(loading?'Grenzen werden geladen ...':'Grenzen werden geladen, sobald dieser Reiter offen ist.')+'</p></div>';root.innerHTML=h;return}
h+='<div class="gr-tools"><input type="search" id="gr-f" placeholder="Suchen (Name, Einheit, Notiz)" value="'+esc(filter)+'" aria-label="Grenzen suchen"><label><input type="checkbox" id="gr-nur"'+(nurAenderbar?' checked':'')+'> nur änderbare</label><button type="button" class="gr-b sek" data-a="laden">Neu laden</button><span class="muted" style="font-size:12px">'+items.length+' Grenzen, abgerufen '+esc(abgerufen)+'</span></div>';
var vis=items.filter(sichtbar);
if(!filter){var kern=KERN.map(find).filter(function(x){return x&&sichtbar(x)});if(kern.length)h+='<h3 class="gr-g">Kernzahlen</h3>'+tabelle(kern)}
var gr={},ord=[];vis.forEach(function(it){if(!filter&&KERN.indexOf(it.schluessel)>=0)return;var g=gruppe(it.schluessel);if(!gr[g]){gr[g]=[];ord.push(g)}gr[g].push(it)});
ord.sort();
ord.forEach(function(g){h+='<h3 class="gr-g">'+esc(g)+' <span class="muted" style="font-weight:400;font-size:13px">('+gr[g].length+')</span></h3>'+tabelle(gr[g])});
if(!vis.length)h+='<p class="muted">Nichts gefunden.</p>';
root.innerHTML=h+'</div>';
if(focusKey){var el=root.querySelector('[data-k="'+focusKey.replace(/"/g,'')+'"].gr-e');if(el){el.focus();try{var n=el.value.length;el.setSelectionRange&&el.setSelectionRange(n,n)}catch(e){}}focusKey=null}}
function laden(){
if(loading)return;
if(!token()){fehler='Die Anmeldung ist abgelaufen. Bitte die Seite neu laden.';render();return}
loading=true;fehler='';render();
post({aktion:'lesen'}).then(function(j){loading=false;
if(j.status===200&&j.ok){items=j.grenzen||[];abgerufen=j.abgerufen||'';loaded=true;fehler=''}
else fehler=((j.fehler&&j.fehler[0])||'Grenzen konnten nicht geladen werden.')+(j.hinweis?' (Kopf '+(j.hinweis.kopf?'ja':'nein')+', Körper '+(j.hinweis.koerper?'ja':'nein')+(j.hinweis.befund?', Abfrage '+JSON.stringify(j.hinweis.befund):'')+')':'');
render()}).catch(function(){loading=false;fehler='Grenzen konnten nicht geladen werden (keine Verbindung oder Anmeldung abgelaufen).';render()})}
function speichern(){
var k=open,it=find(k);if(!it||busy)return;
var gEl=root.querySelector('#gr-grund'),grund=gEl?gEl.value.trim():'';msg.grund=grund;
if(grund.length<3){msg={k:k,err:['Bitte einen Grund eintragen (mindestens 3 Zeichen).'],grund:grund};render();return}
busy=true;msg={k:k,grund:grund};render();
var neu=it.art==='schalter'?edits[k]:String(edits[k]).trim();
post({aktion:'speichern',schluessel:k,wert:neu,alt:it.wert,grund:grund}).then(function(j){busy=false;
if(j.status===200&&j.ok){it.wert=j.wert;it.stand=j.stand;delete edits[k];open=null;msg={k:k,ok:'Gespeichert: '+k+' ist jetzt '+(typeof j.wert==='boolean'?(j.wert?'an':'aus'):nf(j.wert))+'. Gilt ab dem nächsten Lauf.'};render()}
else if(j.status===409){msg={k:k,err:j.fehler||['Der Wert wurde inzwischen geändert.']};open=null;delete edits[k];loaded=false;render();laden()}
else{msg={k:k,err:j.fehler||['Speichern nicht möglich.'],grund:grund};render()}}).catch(function(){busy=false;msg={k:k,err:['Speichern nicht möglich (keine Verbindung oder Anmeldung abgelaufen). Es wurde nichts geändert.'],grund:grund};render()})}
function klick(e){
var b=e.target&&e.target.closest?e.target.closest('[data-a]'):null;if(!b)return;
var a=b.getAttribute('data-a'),k=b.getAttribute('data-k');
if(a==='laden'){loaded=false;laden()}
else if(a==='aendern'){var it=find(k);if(!it||!geaendert(it))return;open=k;msg={};render();var g=root.querySelector('#gr-grund');if(g)g.focus()}
else if(a==='abbrechen'){open=null;msg={};render()}
else if(a==='speichern')speichern()}
function eingeben(e){
var t=e.target;if(!t)return;
if(t.id==='gr-f'){filter=t.value.trim();var pos=t.selectionStart;render();var n=root.querySelector('#gr-f');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}return}
if(t.id==='gr-nur'){nurAenderbar=t.checked;render();return}
if(t.id==='gr-grund'){msg.grund=t.value;return}
if(t.classList&&t.classList.contains('gr-e')){var k=t.getAttribute('data-k');edits[k]=t.value;if(open===k){open=null;msg={}}
var tr=t.closest('tr'),it=find(k),btn=tr&&tr.querySelector('[data-a="aendern"]');
if(btn&&it)btn.disabled=!(geaendert(it)&&!busy);t.classList.toggle('ch',!!it&&geaendert(it));
var alt=tr&&tr.nextElementSibling;if(alt&&alt.classList.contains('gr-c')&&alt.parentNode)alt.parentNode.removeChild(alt)}}
function sichtbarJetzt(){return !!root&&root.offsetParent!==null}
return{
mount:function(el){root=el;if(!root)return;root.addEventListener('click',klick);root.addEventListener('input',eingeben);root.addEventListener('change',eingeben);render();
setInterval(function(){if(!loaded&&!loading&&!fehler&&sichtbarJetzt()&&token())laden()},1500)},
reload:function(){loaded=false;laden()}};
};
