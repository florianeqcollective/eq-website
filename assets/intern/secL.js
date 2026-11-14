/* Cockpit-Abschnitt secL (Reiter Anstehende Lieferungen). Version 2.0, 11.11.2026.
   Anzeige: Karten, drei je Zeile. Nach dem Termin steht "geliefert" statt des Zaehlers, nach loeschenNachTagen (aus den Daten) verschwindet die Karte.
   Pflege (neu, aendern, loeschen) im Eingabefenster: Die Seite schickt NUR den Wunsch an /_functions/lieferung (Zugangs-Token des angemeldeten Kontos).
   Wer schreiben darf und was gueltig ist, entscheidet der Code in Wix (lieferungen.js), nicht diese Seite. */
window.EQIN=window.EQIN||{};
EQIN.secL=function(D){
var DAY=D.DAY,NA=D.NA,WTG=D.WTG,dlParts=D.dlParts,esc=D.esc;
var EP='https://app.eq-collective.de/_functions/lieferung',KS='eq_in_tok';
function bMs(y,m,d,h,mi){var g=Date.UTC(y,m-1,d,h,mi),o=Date.parse(new Date(g).toLocaleString('sv-SE',{timeZone:'Europe/Berlin'}).replace(' ','T')+'Z')-g;return g-o}
var PPL={florian:['Florian Schäffer','75b89088ce604e668db8f7a4c987177a',50],franziska:['Franziska Purr','379a29b97f894eff87e883dfd10fe1db',58],michael:['Michael Bayer','895e1a01ce2640f68a1e45480f5ca51d',40]};
function ppl(a){if(!a||!a.length)return '';return '<div class="in-lf-p">'+a.map(function(k){var p=PPL[k];if(!p)return '';return '<img src="https://static.wixstatic.com/media/5156bf_'+p[1]+'~mv2.jpg/v1/fill/w_144,h_96,al_c,q_80/foto.jpg" style="object-position:'+p[2]+'% 50%" alt="'+p[0]+'" title="'+p[0]+'" loading="lazy">'}).join('')+'</div>'}
var CSS='<style>'
+'#s-l .in-lfs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}'
+'#s-l .in-lf{width:auto;max-width:none;margin:0;min-width:0;position:relative}'
+'#s-l .in-lf-t{min-width:0}#s-l .in-lf h3{overflow-wrap:anywhere}'
+'#s-l .in-lf-c.done .dl-m{color:#1f7a4d}'
+'#s-l .lf-bar{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:0 0 14px}'
+'#s-l .lf-act{display:flex;gap:6px;margin-top:10px}'
+'#s-l .lf-b{font:inherit;font-size:13px;padding:5px 12px;border:1px solid #348292;background:#fff;color:#1d5a66;border-radius:4px;cursor:pointer}'
+'#s-l .lf-b:hover{background:#eef4f5}#s-l .lf-b.pri{background:#348292;color:#fff}#s-l .lf-b.del{border-color:#b3261e;color:#b3261e}#s-l .lf-b.del.sure{background:#b3261e;color:#fff}'
+'#s-l .lf-msg{margin:0 0 10px;font-size:13px;color:#b3261e}'
+'@media (max-width:1100px){#s-l .in-lfs{grid-template-columns:repeat(2,minmax(0,1fr))}}'
+'@media (max-width:640px){#s-l .in-lfs{grid-template-columns:minmax(0,1fr)}}'
+'</style>';
var OVCSS='#in-lf-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:2000;padding:16px}#in-lf-ov[hidden]{display:none}'
+'#in-lf-ov form{background:#fff;color:#161616;width:100%;max-width:520px;max-height:100%;overflow:auto;padding:20px 22px;border-radius:6px;font-size:14px;box-sizing:border-box}'
+'#in-lf-ov h3{margin:0 0 12px;font-size:20px}#in-lf-ov label{display:block;margin:10px 0 3px;font-weight:600;font-size:13px}'
+'#in-lf-ov input[type=text],#in-lf-ov input[type=date],#in-lf-ov input[type=time],#in-lf-ov textarea{width:100%;box-sizing:border-box;font:inherit;padding:7px 9px;border:1px solid #b9c8cb;border-radius:4px}'
+'#in-lf-ov .r2{display:grid;grid-template-columns:1fr 1fr;gap:10px}#in-lf-ov .ck{display:flex;gap:16px;flex-wrap:wrap;margin-top:4px}#in-lf-ov .ck label{display:flex;gap:6px;align-items:center;margin:0;font-weight:400}'
+'#in-lf-ov .fe{margin:10px 0 0;color:#b3261e;font-size:13px}#in-lf-ov .bt{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}#in-lf-ov .bt button{font:inherit;padding:7px 16px;border:1px solid #348292;background:#fff;color:#1d5a66;border-radius:4px;cursor:pointer}#in-lf-ov .bt button.pri{background:#348292;color:#fff}#in-lf-ov .bt button:disabled{opacity:.6;cursor:wait}';
var cur=null,ov=null,sure=null;
function liste(by){var it=by&&by['lieferungen'];return it&&it.daten?it:null}
function token(){try{var t=JSON.parse(localStorage.getItem(KS)||'null');return t&&t.a&&Date.now()<t.e?t.a:null}catch(e){return null}}
function karten(L,keep,now){return L.map(function(x){var s=String(x.stichtag||''),p=s.split(/[- :]/),ms=bMs(+p[0],+p[1],+p[2],p[3]?+p[3]:23,p[4]?+p[4]:59);if(isNaN(ms))return '';
if(keep!=null&&now-ms>keep*DAY)return '';
var done=ms-now<0,r=dlParts(ms-now),wd=WTG[new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()],dt=p[2]+'.'+p[1]+'.'+p[0]+(p[3]?', '+p[3]+':'+(p[4]||'00')+' Uhr':'');
var cnt=done?'<div class="in-lf-c done"><span class="dl-m">geliefert</span></div>':'<div class="in-lf-c" data-dl="'+ms+'"><span class="dl-m">'+esc(r.main)+'</span><small class="dl-s">'+esc(r.sub)+'</small></div>';
return '<div class="in-lf v2'+(!done&&ms-now<=7*DAY?' soon':'')+'"><div class="in-lf-t"><h3>'+esc(x.titel)+'</h3><div class="in-lf-d">'+esc(wd+', '+dt)+(x.ort?' · '+esc(x.ort):'')+'</div>'+cnt+(x.notiz?'<div class="in-lf-v">'+esc(x.notiz)+'</div>':'')+'<div class="lf-act"><button type="button" class="lf-b" data-lf="edit" data-id="'+esc(x.id||'')+'">Bearbeiten</button><button type="button" class="lf-b del" data-lf="del" data-id="'+esc(x.id||'')+'">Löschen</button></div></div>'+ppl(x.zustaendig)+'</div>'}).join('')}
function render(by){cur=by;var it=liste(by);if(!it)return NA;var d=it.daten,keep=Number(d.loeschenNachTagen),now=Date.now();keep=(isNaN(keep)||keep<=0)?null:keep;
var L=(d.liste||[]).slice().sort(function(a,b){return String(a.stichtag)<String(b.stichtag)?-1:1}),c=karten(L,keep,now);
var bar='<div class="lf-bar"><button type="button" class="lf-b pri" data-lf="neu">Neue Lieferung</button><span class="muted" id="lf-top"></span></div>';
var note='<div class="in-note">Der Zähler zeigt, wie viel Zeit bis zum jeweiligen Termin bleibt (Berliner Zeit). Rot: weniger als 7 Tage. Nach dem Termin steht „geliefert“'+(keep?', nach '+keep+' Tagen verschwindet die Karte':'')+'. Die Termine pflegen wir hier selbst, zuletzt am '+esc(String(d.stand||'').split('-').reverse().join('.'))+'.</div>';
return CSS+bar+(c?'<div class="in-lfs">'+c+'</div>':'<p class="muted">Keine Lieferungen eingetragen.</p>')+note}
function neu(by){var el=document.getElementById('s-l');if(!el)return;el.innerHTML=render(by);}
function msg(t){var m=document.getElementById('lf-top');if(m){m.textContent=t||'';m.className=t?'lf-msg':'muted'}}
function sende(aktion,eintrag){var a=token();if(!a)return Promise.reject(new Error('Die Anmeldung ist abgelaufen. Bitte die Seite neu laden und anmelden.'));
return fetch(EP,{method:'POST',headers:{'Content-Type':'application/json',Authorization:a},body:JSON.stringify({aktion:aktion,eintrag:eintrag})}).then(function(r){return r.json().then(function(j){return {s:r.status,j:j}},function(){return {s:r.status,j:null}})}).then(function(x){if(x.s===200&&x.j&&x.j.ok){var by={lieferungen:{daten:x.j.daten}};neu(by);return by}
throw new Error((x.j&&x.j.fehler&&x.j.fehler.join(' '))||('Speichern nicht möglich (Fehler '+x.s+').'))},function(e){if(e&&e.message&&!/Failed to fetch|NetworkError|Load failed/i.test(e.message))throw e;throw new Error('Keine Verbindung zum Speichern. Bitte später noch einmal versuchen.')})}
function ovBauen(){if(ov)return ov;var st=document.createElement('style');st.textContent=OVCSS;document.head.appendChild(st);
ov=document.createElement('div');ov.id='in-lf-ov';ov.hidden=true;
ov.innerHTML='<form novalidate><h3 id="lf-h">Neue Lieferung</h3><label for="lf-titel">Titel</label><input type="text" id="lf-titel" autocomplete="off"><div class="r2"><div><label for="lf-datum">Datum</label><input type="date" id="lf-datum"></div><div><label for="lf-zeit">Uhrzeit (Berlin)</label><input type="time" id="lf-zeit" value="09:00"></div></div><label for="lf-ort">Ort</label><input type="text" id="lf-ort" autocomplete="off"><label for="lf-notiz">Notiz</label><textarea id="lf-notiz" rows="3"></textarea><label>Zuständig</label><div class="ck"><label><input type="checkbox" value="florian"> Florian</label><label><input type="checkbox" value="franziska"> Franziska</label><label><input type="checkbox" value="michael"> Michael</label></div><p class="fe" id="lf-fe" hidden></p><div class="bt"><button type="button" id="lf-x">Abbrechen</button><button type="submit" class="pri" id="lf-ok">Speichern</button></div></form>';
document.body.appendChild(ov);
ov.addEventListener('click',function(e){if(e.target===ov||e.target.id==='lf-x')ov.hidden=true});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov&&!ov.hidden)ov.hidden=true});
ov.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var f=ov.querySelector('form'),id=f.getAttribute('data-id')||'',d=f.querySelector('#lf-datum').value,z=f.querySelector('#lf-zeit').value,fe=f.querySelector('#lf-fe'),ok=f.querySelector('#lf-ok');
var zu=[];Array.prototype.forEach.call(f.querySelectorAll('.ck input'),function(c){if(c.checked)zu.push(c.value)});
var en={titel:f.querySelector('#lf-titel').value,stichtag:(d&&z)?d+' '+z:'',ort:f.querySelector('#lf-ort').value,notiz:f.querySelector('#lf-notiz').value,zustaendig:zu};if(id)en.id=id;
fe.hidden=true;ok.disabled=true;sende('speichern',en).then(function(){ov.hidden=true},function(er){fe.textContent=er.message;fe.hidden=false}).then(function(){ok.disabled=false})});
return ov}
function oeffnen(x){var o=ovBauen(),f=o.querySelector('form');f.setAttribute('data-id',x?x.id:'');f.querySelector('#lf-h').textContent=x?'Lieferung bearbeiten':'Neue Lieferung';
var s=x?String(x.stichtag||''):'';f.querySelector('#lf-titel').value=x?x.titel||'':'';f.querySelector('#lf-datum').value=s.slice(0,10);f.querySelector('#lf-zeit').value=s.slice(11,16)||'09:00';f.querySelector('#lf-ort').value=x?x.ort||'':'';f.querySelector('#lf-notiz').value=x?x.notiz||'':'';
Array.prototype.forEach.call(f.querySelectorAll('.ck input'),function(c){c.checked=!!(x&&(x.zustaendig||[]).indexOf(c.value)>=0)});f.querySelector('#lf-fe').hidden=true;o.hidden=false;f.querySelector('#lf-titel').focus()}
function finden(id){var it=liste(cur);return it?(it.daten.liste||[]).filter(function(e){return e.id===id})[0]:null}
if(!EQIN._lfInit){EQIN._lfInit=true;document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('#s-l [data-lf]'):null;if(!b)return;var k=b.getAttribute('data-lf'),id=b.getAttribute('data-id');
if(k==='neu'){oeffnen(null);return}
if(k==='edit'){var x=finden(id);if(x)oeffnen(x);return}
if(k==='del'){if(sure!==id){sure=id;b.classList.add('sure');b.textContent='Wirklich löschen?';setTimeout(function(){if(sure===id){sure=null;b.classList.remove('sure');b.textContent='Löschen'}},4000);return}
sure=null;b.disabled=true;sende('loeschen',{id:id}).then(function(){msg('')},function(er){b.disabled=false;msg(er.message)})}})}
return render};