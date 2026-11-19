/* EQ Cockpit (Dashboard), Kern. Eigene Datei: Aenderungen hier koennen die oeffentlichen Seiten nicht beschaedigen. Wird nur von intern.html nach pages.js und vor site.js geladen. */
(function(){
var P=window.PAGES;
P['intern']={title:'Intern',nav:'',html:function(){return '<section class="sec"><div class="wrap">'+
'<p class="kick">Intern</p><h1>Interner Bereich</h1>'+
'<div id="in-login" hidden><p style="max-width:620px">Dieser Bereich ist nur für uns drei. Meldet euch mit eurem Google-Konto an.</p><p><button class="btn" id="in-go" type="button">Mit Google anmelden</button></p><p class="fmsg err" id="in-err" hidden></p></div>'+
'<div id="in-app" hidden>'+
'<p class="in-top"><span id="in-heute"></span><span><button class="btn out sm" id="in-out" type="button">Abmelden</button></span></p>'+
'<div class="in-tabs" role="tablist"><button type="button" class="in-tab" role="tab" data-tab="kpi">KPI</button><button type="button" class="in-tab" role="tab" data-tab="heute">Anstehende Lieferungen</button><button type="button" class="in-tab" role="tab" data-tab="vertrieb">Vertriebskennzahlen</button><button type="button" class="in-tab" role="tab" data-tab="finanzen">Finanzkennzahlen</button><button type="button" class="in-tab" role="tab" data-tab="content">Content-Plan</button><button type="button" class="in-tab" role="tab" data-tab="betrieb">KI-Betrieb</button><button type=button class=in-tab role=tab data-tab=verbesserung>Lernen und Verbesserung</button><button type=button class=in-tab role=tab data-tab=zugriffe>Zugriffe</button><button type=button class=in-tab role=tab data-tab=architektur>Dokumentation</button></div>'+
'<div class="in-tp" data-tp="kpi"><h2 class="in-h">KPI</h2><div id="s-kp"></div></div><div class="in-tp" data-tp="heute"><h2 class="in-h">Lieferungen</h2><div id="s-l"></div></div>'+
'<div class="in-tp" data-tp="vertrieb"><div id="s-v"></div><div id="s-e" hidden></div></div>'+
'<div class="in-tp" data-tp="finanzen"><div id="s-fz"></div></div>'+
'<div class="in-tp" data-tp="content"><h2 class="in-h">Content-Plan</h2><div id="s-c"></div><h2 class="in-h">Kennzahlen</h2><div id="s-k"></div></div>'+
'<div class="in-tp" data-tp="betrieb"><div id="s-op"></div><div id="s-z" hidden></div><details class="in-fold"><summary>Wochenvolumen und Guthaben (Flos Konto)</summary><div class="in-fb"><div id="s-n"></div></div></details><div id="s-gr"></div></div>'+

'<div class=in-tp data-tp=verbesserung><h2 class=in-h>Lernen und Verbesserung</h2><div id=s-vb></div><details class=in-fold><summary>Lernschleifen je Funktion (Messen, Auswerten, Anpassen, Wirkung)</summary><div class=in-fb><p class=in-note style="margin:0 0 10px">Wie jede Funktion misst, auswertet, Änderungen vorschlägt und die Wirkung prüft. Änderungen setzen wir nur nach unserem Ja um.</p><div id=s-ls></div></div></details></div>'+
'<div class=in-tp data-tp=zugriffe><h2 class=in-h>Zugriffe</h2><div id=s-zg></div></div>'+
'<div class=in-tp data-tp=architektur><div id=s-ar></div></div>'+
'</div><p id="in-wait" class="muted">Einen Moment …</p></div></section>'},
init:function(){
var CID='b40ee72d-5f62-4889-9f72-e1b5949339f7',API='https://www.wixapis.com',GID='0e6a50f5-b523-4e29-990d-f37fa2ffdd69',RU=location.origin+location.pathname,KS='eq_in_tok',VS='eq_in_pkce';
var $=function(i){return document.getElementById(i)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var sget=function(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},sset=function(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var b64u=function(b){var s='';new Uint8Array(b).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
var rnd=function(n){var a=new Uint8Array(n);crypto.getRandomValues(a);return b64u(a)};
function show(w){['in-login','in-app','in-wait'].forEach(function(i){$(i).hidden=(i!==w)})}
function err(t){var e=$('in-err');e.textContent=t;e.hidden=false}
function tokReq(body){return fetch(API+'/oauth2/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()}).then(function(j){if(!j.access_token)throw new Error('token');var t={a:j.access_token,r:j.refresh_token||body.refreshToken,e:Date.now()+((j.expires_in||14400)-120)*1000};sset(KS,t);return t})}
function access(){var t=sget(KS);if(!t)return Promise.reject(new Error('no'));if(Date.now()<t.e)return Promise.resolve(t.a);return tokReq({clientId:CID,grantType:'refresh_token',refreshToken:t.r}).then(function(n){return n.a})}
function login(){var v=rnd(48),s=rnd(16);crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)).then(function(h){var ch=b64u(h);sset(VS,{v:v,s:s});return EQ.token().then(function(t){return fetch(API+'/_api/redirects-api/v1/redirect-session',{method:'POST',headers:{'Content-Type':'application/json',Authorization:t},body:JSON.stringify({auth:{authRequest:{redirectUri:RU,clientId:CID,codeChallenge:ch,codeChallengeMethod:'S256',responseMode:'fragment',responseType:'code',scope:'offline_access',state:s,idp:GID}}})})})}).then(function(r){return r.json()}).then(function(j){var u=(j.redirectSession&&j.redirectSession.fullUrl)||j.fullUrl;if(!u)throw new Error('url');location.href=u}).catch(function(){err('Die Anmeldung konnte nicht gestartet werden. Bitte versucht es gleich noch einmal.')})}
function qx(coll,filter,sort,limit){return access().then(function(a){return fetch(API+'/wix-data/v2/items/query',{method:'POST',headers:{'Content-Type':'application/json',Authorization:a},body:JSON.stringify({dataCollectionId:coll,query:{filter:filter,sort:sort||[],paging:{limit:limit}}})}).then(function(r){if(r.status===401||r.status===403)throw new Error('auth');if(!r.ok)throw new Error('http');return r.json()})}).then(function(j){return(j.dataItems||[]).map(function(i){return i.data})})}
function q(filter,sort,limit){return Promise.all([qx('KIDaten',filter,sort,limit),qx('kennzahlen',filter,sort,limit).catch(function(){return[]})]).then(function(p){var m={},o=[];p[0].forEach(function(d){m[d.dokId||d._id]=d});p[1].forEach(function(d){var k=d.dokId||d._id,v=m[k];if(!v||String(d.zeit||'')>=String(v.zeit||''))m[k]=d});for(var k in m)o.push(m[k]);return o})}
var heute=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'});
var IDS=['zaehler-vernetzen','zaehler-posteingang','zaehler-kommentare','zaehler-gruesse','zaehler-content','zaehler-kalender','zaehler-bericht','betrieb','puffer-kennzahlen','kpi-kombiniert','kpi-beitraege','funnel','nutzung-je-tag','kpi-monate','netzwerk-events','lieferungen','luecken','plan','kpi-manuell','soll','lead-stand','lernschleifen','lernen-bauen','verbesserung','verbesserung-system','aufwand','kontaktpflege','ziel','finanzen','kpi-zahlen','onepager'];
var BM={ann:0.26,ant:0.176,cal:0.074},KAP=100,GRW=15,ZIEL=1;
var MN=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
var NA='<p class="muted">Daten gerade nicht verfügbar.</p>';
var nf=function(n,d){return n==null?'noch keine Daten':Number(n).toLocaleString('de-DE',{maximumFractionDigits:d==null?1:d})};
var dm=function(d){var x=String(d||'');return x.slice(8,10)+'.'+x.slice(5,7)+'.'};
var tms=function(x){return Date.parse(String(x).slice(0,10)+'T'+String(x).slice(11,16)+':00Z')};
var hm=function(x){return String(x||'').slice(11,16)};
var mark=function(q){return q==='abgeleitet'?'~':(q==='geschätzt'?'≈':'')};


function wrap(t,n){var w=String(t||'').split(' '),l=[],c='';w.forEach(function(x){if((c+' '+x).trim().length>n&&c){l.push(c);c=x}else{c=(c+' '+x).trim()}});if(c)l.push(c);return l}
function nice(v){var m=[10,20,40,50,60,80,100,120,150,200];for(var i=0;i<m.length;i++){if(v<=m[i])return m[i]}return Math.ceil(v/50)*50}
function berlinNow(){return new Date().toLocaleString('sv-SE',{timeZone:'Europe/Berlin'})}
function pbar(ist,soll){if(!soll)return '';var p=Math.max(0,Math.min(100,Math.round(100*(ist||0)/soll)));return '<span class="in-pb'+(p>=100?' ok':'')+'" role="img" aria-label="'+p+' Prozent vom Soll"><i style="width:'+p+'%"></i></span>'}







function pick(o,a30,a7){return o&&o[a30]?{o:o[a30],d:30}:{o:o?o[a7]:null,d:7}}



function frow(name,w,q,hint,max,extra){var p=w==null?0:Math.max(w>0?2:0,Math.round(100*w/max));var tip=q==='geschätzt'?' title="geschätzt: '+esc(hint||'')+'"':'';
return '<div class="fr"><div class="fr-h"><span>'+esc(name)+'</span><b'+tip+'>'+mark(q)+nf(w,0)+'</b></div><div class="fr-b"><i style="width:'+p+'%"></i>'+(extra||'')+'</div>'+(hint?'<div class="fr-n">'+esc(hint)+'</div>':'')+'</div>'}
function byId(list,id){var r=null;(list||[]).forEach(function(x){if(x.id===id)r=x});return r}
function quote(label,num,den,formel){if(!num||!den||num.wert==null||den.wert==null||!den.wert)return '<div class="in-tile"><b>noch keine Daten</b><span>'+esc(label)+'</span><span class="in-sub">'+esc(formel)+'</span></div>';
var q=worst(num.qualitaet,den.qualitaet),pc=Math.round(1000*num.wert/den.wert)/10,small=den.wert<20;
return '<div class="in-tile"><b>'+mark(q)+nf(pc,1)+' %</b><span>'+esc(label)+'</span><span class="in-sub">'+nf(num.wert,0)+' von '+nf(den.wert,0)+'</span><span class="in-sub">'+esc(formel)+(small?'. Kleine Basis, noch wenig aussagekräftig.':'')+'</span></div>'}


function sv(x){return x<10?nf(x,1):nf(x,0)}
function zielCard(hw,gw,wk){var a=byId(hw,'anfragen'),g=byId(hw,'angenommen'),n=byId(hw,'nachricht'),r=byId(hw,'antwort'),c=byId(hw,'call'),gr=byId(gw,'gruss'),ga=byId(gw,'gruss_antwort'),op=byId(gw,'opener_entwurf'),og=byId(gw,'opener_gesendet'),oa=byId(gw,'opener_antwort'),gc=byId(gw,'gruss_call');
var ra=(a&&g&&a.wert&&g.wert!=null)?g.wert/a.wert:null,rr=(n&&r&&n.wert&&r.wert!=null)?r.wert/n.wert:null,rc=(r&&c&&r.wert>=20&&c.wert!=null)?c.wert/r.wert:null,rg=(gr&&ga&&gr.wert)?ga.wert/gr.wert:null,ro=(gr&&op&&gr.wert)?op.wert/gr.wert:null,roa=(og&&oa&&og.wert>0)?oa.wert/og.wert:null,roc=(oa&&gc&&oa.wert>=20)?gc.wert/oa.wert:null;
var opR=ro==null?0.06:ro,pm=BM.ann*BM.ant*BM.cal,pb=opR*BM.ant*BM.cal,f=Math.pow(ZIEL/(KAP*pm+GRW*pb),1/3),pc=function(x){return x==null?'noch keine Daten':nf(Math.round(x*1000)/10,1)+' %'};
var n2=KAP*BM.ann*f,n4=n2*BM.ant*f,n5=n4*BM.cal*f,b2=GRW*opR*f,b3=b2*BM.ant*f,b4=b3*BM.cal*f;
var bench=Math.ceil((ZIEL-GRW*pb)/pm),bdNow=GRW*pb,bdHi=GRW*opR*0.364*0.15,bdMax=GRW*(rg==null?0.3:rg)*0.364*0.15;
var last=null;wk.forEach(function(w){if(w.von)last=w});var lv=function(k){return last&&last[k]!=null?nf(last[k],0):'–'};
var h='<div class="in-card"><h3>Quoten im Vergleich</h3><table class="rt"><thead><tr><th>Quote</th><th>Richtwert Branche</th><th>Unser Stand</th></tr></thead><tbody>';
[['Annahmequote',pc(BM.ann),pc(ra)],['Antwortquote auf Opener',pc(BM.ant),pc(rr)],['Discovery-Call-Quote (je Antwort)',pc(BM.cal),pc(rc)],['Antwort auf Geburtstagsgruß','12,2 % (Extrapolation)',pc(rg)],['Geburtstagsgrüße mit vorbereitetem Opener','keiner gefunden',pc(ro)],['Antwort auf Opener','17,6 % bis 36,4 % (Extrapolation)',pc(roa)],['Discovery-Call-Quote (je Antwort auf Opener)','7,4 % bis 15 % (Extrapolation)',pc(roc)]].forEach(function(x){h+='<tr><td data-l="Quote"><b>'+x[0]+'</b></td><td data-l="Richtwert Branche">'+x[1]+'</td><td data-l="Unser Stand">'+x[2]+'</td></tr>'});
h+='</tbody></table><div class="in-note">Hauptweg: Belkins LinkedIn Outreach Study 2026 (Annahme 26 %, 17,6 % der Vernetzten antworten, 1,3 % buchen ein Meeting, daraus 7,4 % Discovery Call je Antwort) und Expandi Benchmarks 2026 zur Gegenprobe (Beratung: 28 % Annahme, 9,2 % Antwort je Nachricht). Für Geburtstagsgrüße gibt es keine belastbare Studie, deshalb sind diese Richtwerte Extrapolationen und unsicher: 12,2 % Antwort bei bestehenden Kontakten (Belkins, 15,1 Mio. Kontakte), 36,4 % Antwort auf Nachrichten nach öffentlichem Anlass gegenüber 11,4 % beim kalten Pitch (Melanie Goodman, 8.423 Gespräche, über Fuzzy AI), 15 % Discovery Call je Antwort bei Anlass-Nachrichten als Obergrenze (Aurium, Anbieterangabe ohne Quelle). Discovery-Call-Quote erst ab 20 Antworten aus eigenen Daten.</div></div>';
h+='<div class="in-card"><h3>Wochen-Soll für einen Discovery Call, Hauptweg und Geburtstagsweg zusammen</h3><table class="rt"><thead><tr><th>Stufe</th><th>Letzte Woche'+(last&&last.kw?' ('+esc(last.kw)+')':'')+'</th><th>Soll Hauptweg</th><th>Soll Geburtstagsweg</th></tr></thead><tbody>';
[['Anfragen oder Geburtstagsgrüße',lv('anfragen')+' oder '+lv('gruesse'),KAP,GRW],['Angenommen oder Opener gesendet','–',n2,b2],['Antworten auf Opener',lv('antworten'),n4,b3],['Discovery Calls',lv('calls'),n5,b4]].forEach(function(x){h+='<tr><td data-l="Stufe">'+x[0]+'</td><td data-l="Letzte Woche">'+x[1]+'</td><td data-l="Soll Hauptweg">'+sv(x[2])+'</td><td data-l="Soll Geburtstagsweg">'+sv(x[3])+'</td></tr>'});
h+='<tr><td data-l="Stufe"><b>Discovery Calls insgesamt</b></td><td data-l="Letzte Woche">'+lv('calls')+'</td><td data-l="Soll" colspan="2"><b>'+ZIEL+' pro Woche</b></td></tr></tbody></table>';
h+='<p class="in-sub" style="margin-top:10px">Annahmen: '+KAP+' Anfragen (20 am Tag, 5 Tage) und '+GRW+' Geburtstagsgrüße pro Woche, beides Platzhalter. Die Opener-Quote kommt aus unseren Zahlen ('+pc(opR)+' der Geburtstagsgrüße), alle anderen Stufen aus den Richtwerten. Damit alle Stufen zusammen einen Discovery Call pro Woche ergeben, müssen die Quoten etwa um den Faktor '+nf(f,1)+' über den Richtwerten liegen. Der Geburtstagsweg bringt bei heutigen Quoten und den Hauptweg-Richtwerten nur etwa '+nf(bdNow,2)+' Discovery Calls pro Woche, mit den Anlass-Richtwerten (36,4 % Antwort, 15 % Discovery Call) etwa '+nf(bdHi,2)+'. Würde jeder Geburtstagsgruß mit Antwort ('+pc(rg)+') zu einem Opener, wären es etwa '+nf(bdMax,2)+'. Die meisten dieser Kontakte kennen uns nicht persönlich, deshalb ist eher die untere Zahl realistisch. Mit den Hauptweg-Richtwerten und den Geburtstagsgrüßen bräuchten wir rund '+nf(bench,0)+' Anfragen pro Woche statt '+KAP+'.</p></div>';
return h}

function manuell(it){if(!it||!it.daten)return '';var d=it.daten,ks=d.kampagnen||[];var pc=function(a,b){return b?nf(Math.round(1000*a/b)/10,1)+' %':'–'};
var h='<div class="in-card" style="margin-top:14px"><h3 class="in-h3">Vorgeschichte: manuelle Nachrichten, '+esc(d.zeitraum||'')+'</h3><div class="in-note" style="margin:0 0 10px">'+esc(d.hinweis||'')+'</div><table class="rt"><thead><tr><th>Aktion</th><th>Zeitraum</th><th>Unterhaltungen</th><th>Antworten</th><th>Antwortquote</th><th>Zusagen</th><th>Discovery Calls</th></tr></thead><tbody>'+ks.map(function(k){return '<tr><td data-l="Aktion"><b>'+esc(k.name)+'</b></td><td data-l="Zeitraum">'+esc(k.zeitraum)+'</td><td data-l="Unterhaltungen">≈'+nf(k.unterhaltungen,0)+'</td><td data-l="Antworten">≈'+nf(k.antwort,0)+'</td><td data-l="Antwortquote">≈'+pc(k.antwort,k.unterhaltungen)+'</td><td data-l="Zusagen">≈'+nf(k.zusage,0)+'</td><td data-l="Discovery Calls">'+nf(k.calls,0)+'</td></tr>'}).join('')+'</tbody></table>';
ks.forEach(function(k){h+='<details class="in-det"><summary>'+esc(k.name)+': Texte und Hinweis</summary><p>'+esc(k.text||'')+'</p>'+(k.nachfassen?'<p><b>Nachfassen:</b> '+esc(k.nachfassen)+'</p>':'')+(k.ping?'<p><b>Ping:</b> '+esc(k.ping)+'</p>':'')+'<p class="muted">'+esc(k.hinweis||'')+'</p></details>'});
return h+'</div>'}

var WTG=['So','Mo','Di','Mi','Do','Fr','Sa'],DAY=864e5,_tk=null;

function pl(n,e,m){return n+' '+(n===1?e:m)}
function dlParts(ms){var neg=ms<0,a=Math.abs(ms),w=Math.floor(a/(7*DAY)),d=Math.floor(a%(7*DAY)/DAY),h=Math.floor(a%DAY/36e5),mi=Math.floor(a%36e5/6e4),s=Math.floor(a%6e4/1e3);
return {main:(neg?'+':'−')+pl(w,'Woche','Wochen')+', '+pl(d,'Tag','Tage')+', '+pl(h,'Stunde','Stunden'),sub:'und '+mi+' Min '+(s<10?'0':'')+s+' Sek'+(neg?' seit dem Stichtag':'')}}
function tickDL(){var now=Date.now();Array.prototype.forEach.call(document.querySelectorAll('[data-dl]'),function(e){var r=dlParts(Number(e.getAttribute('data-dl'))-now),m=e.querySelector('.dl-m'),s=e.querySelector('.dl-s');if(m)m.textContent=r.main;if(s)s.textContent=r.sub})}
function startTick(){tickDL();if(!_tk)_tk=setInterval(tickDL,1000)}













var ALLOW=['florian@eq-collective.de','franziska@eq-collective.de','michael@eq-collective.de'];
function lost(e){var m=e&&e.message;return m==='auth'||m==='no'||m==='token'}
function who(){return access().then(function(a){return fetch(API+'/members/v1/members/my',{headers:{Authorization:a}})}).then(function(r){if(r.status===401||r.status===403)throw new Error('auth');if(!r.ok)throw new Error('http');return r.json()}).then(function(j){return j&&j.member&&j.member.loginEmail?String(j.member.loginEmail).toLowerCase():''})}
function dsave(el){var o=[];Array.prototype.forEach.call(el.querySelectorAll('details'),function(d,i){if(d.open)o.push(i)});return o}
function drest(el,o){if(!o||!o.length)return;var ds=el.querySelectorAll('details');o.forEach(function(i){if(ds[i])ds[i].open=true})}
function setH(el,html){var o=dsave(el);el.innerHTML=html;drest(el,o)}
function tipify(){var app=$('in-app'),w=app.closest('.wrap');if(w)w.style.maxWidth='1600px';
var skip=/^[\d.,]+ von [\d.,]+$/;
Array.prototype.forEach.call(app.querySelectorAll('.in-note,.fr-n,.in-sub'),function(el){var tx=(el.textContent||'').trim();if(!tx||skip.test(tx)||el.closest('.in-det')||el.closest('.in-top'))return;
var f=el.closest('.fr'),tl=el.closest('.in-tile'),cd=el.closest('.in-card');
var tg=f?f.querySelector('.fr-h span'):tl?tl.querySelector('span'):cd?cd.querySelector('h3'):null;
if(!tg){var p=el.previousElementSibling;while(p&&!/^H[1-6]$/.test(p.tagName))p=p.previousElementSibling;if(!p&&el.parentElement)p=el.parentElement.previousElementSibling;if(p&&/^H[1-6]$/.test(p.tagName))tg=p}
if(!tg)return;
var tp=null;Array.prototype.forEach.call(tg.children,function(c){if(c.className==='tip')tp=c});
if(!tp){tp=document.createElement('span');tp.className='tip';tp.tabIndex=0;tp.setAttribute('data-tip','');tp.textContent='i';tg.appendChild(tp)}
var cur=tp.getAttribute('data-tip');tp.setAttribute('data-tip',cur?cur+'\n\n'+tx:tx);el.classList.add('tipsrc')});
Array.prototype.forEach.call(app.querySelectorAll('.tip'),function(tp){tp.onmouseenter=tp.onfocus=function(){var b=tp.getBoundingClientRect();tp.classList.toggle('r',b.left>window.innerWidth/2)}})}
function qc(c,filter,sort,limit){return access().then(function(a){return fetch(API+'/wix-data/v2/items/query',{method:'POST',headers:{'Content-Type':'application/json',Authorization:a},body:JSON.stringify({dataCollectionId:c,query:{filter:filter,sort:sort||[],paging:{limit:limit}}})}).then(function(r){if(r.status===401||r.status===403)throw new Error('auth');if(!r.ok)throw new Error('http');return r.json()})}).then(function(j){return(j.dataItems||[]).map(function(i){return i.data})})}

function loadPL(by){var el=$('s-pl');if(!el)return;Promise.all([qc('status',{$or:[{_id:{$startsWith:'aufgabe-'}},{_id:{$eq:'scheduler'}}]},[],100),qc('befunde',{offen:{$eq:true}},[{fieldName:'datum',order:'DESC'}],50),qc('kennzahlen',{schluessel:{$eq:'tagesbericht'}},[{fieldName:'datum',order:'DESC'}],1)]).then(function(r){var st=r[0],miss=!st.some(function(i){return i&&i._id==='scheduler'});return(miss?qc('status',{_id:{$eq:'scheduler'}},[],1).catch(function(){return[]}):Promise.resolve([])).then(function(s){var n=[];if(r[0].length>=100)n.push('Statuszeilen');if(r[1].length>=50)n.push('offene Befunde');setH(el,secPL(st.concat(s),r[1],r[2],by&&by['betrieb']&&by['betrieb'].daten)+(n.length?'<p class="muted" style="margin:8px 0 0">Hinweis: weitere '+n.join(' und ')+' nicht gezeigt (Limit erreicht).</p>':''))})}).catch(function(e){if(lost(e)){sset(KS,null);show('in-login')}else{el.innerHTML=NA}})}function load(){
who().then(function(em){if(em&&ALLOW.indexOf(em)<0){sset(KS,null);show('in-login');err('Dieses Konto ist für diese Seite nicht freigeschaltet.');return null}return q({_id:{$in:IDS}},[],50)}).then(function(items){if(items===null)return;
var by={},latest='';items.forEach(function(i){if(i&&i._id){by[i._id]=i;if(i.zeit&&i._id!=='betrieb'&&i._id!=='onepager'&&String(i.zeit)>latest)latest=String(i.zeit)}});
$('in-heute').textContent='Heute ist '+heute+' (Berlin). Alle Zeiten in Berliner Ortszeit. '+(latest?'Daten von '+latest+'.':'');
[['s-l',secL],['s-c',secC],['s-z',secZ],['s-k',secK],['s-v',secV],['s-e',secE],['s-n',secN],['s-ls',secLS],['s-fz',secFZ],['s-kp',secKP],['s-op',secOP],['s-vb',secVB]].forEach(function(p){var html;try{html=p[1](by)}catch(e){html=NA}setH($(p[0]),html)});try{tipify()}catch(e){}try{startTick()}catch(e){}try{if(sget('eq_in_tab')==='architektur')secAR($('s-ar'))}catch(e){}try{if(sget('eq_in_tab')==='zugriffe'&&secZG)secZG.mount($('s-zg'))}catch(e){}
show('in-app')}).catch(function(e){if(lost(e)){sset(KS,null);show('in-login')}else{show('in-app');['s-l','s-c','s-z','s-k','s-v','s-e','s-n','s-ls','s-fz','s-kp','s-op','s-vb'].forEach(function(i){$(i).innerHTML=NA})}})}
var secAR=EQIN.secAR({q:q,esc:esc,NA:NA});var secZG=EQIN.secZG?EQIN.secZG({qx:qx,esc:esc,NA:NA}):null;var TB=Array.prototype.slice.call(document.querySelectorAll('.in-tab')),TP=Array.prototype.slice.call(document.querySelectorAll('.in-tp'));function goTab(k){if(!TP.some(function(p){return p.getAttribute('data-tp')===k}))k='kpi';TB.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-tab')===k?'true':'false')});TP.forEach(function(p){p.hidden=(p.getAttribute('data-tp')!==k)});sset('eq_in_tab',k);if(k==='architektur')secAR($('s-ar'));if(k==='zugriffe'&&secZG)secZG.mount($('s-zg'))}
TB.forEach(function(b){b.onclick=function(){goTab(b.getAttribute('data-tab'))}});goTab(sget('eq_in_tab')||'kpi');var LSX=$('s-ls');if(LSX)LSX.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.in-ls-b'):null;if(!b)return;var c=b.closest('.in-ls-c'),k=b.getAttribute('data-k'),w=c.querySelector('.in-ls-w[data-w="'+k+'"]'),op=!!w&&w.hidden;Array.prototype.forEach.call(c.querySelectorAll('.in-ls-w'),function(x){x.hidden=true});Array.prototype.forEach.call(c.querySelectorAll('.in-ls-b'),function(x){x.setAttribute('aria-expanded','false')});if(op){w.hidden=false;b.setAttribute('aria-expanded','true')}});
var VX=$('s-v');if(VX)VX.addEventListener('click',function(e){var mb=e.target&&e.target.closest?e.target.closest('.in-v-m'):null;if(mb){var mm=mb.getAttribute('data-m');EQIN.vMode=mm;try{localStorage.setItem('eq_v_mode',mm)}catch(x){}try{setH(VX,secV(EQIN.vBy))}catch(x){}return}var b=e.target&&e.target.closest?e.target.closest('.in-v-r,.in-v-t'):null;if(!b)return;var w=b.classList.contains('in-v-t')?VX.querySelector('.in-v-tw[data-w="'+b.getAttribute('data-w')+'"]'):b.nextElementSibling;if(!w)return;var op=w.hidden;Array.prototype.forEach.call(VX.querySelectorAll('.in-v-w,.in-v-tw'),function(x){x.hidden=true});Array.prototype.forEach.call(VX.querySelectorAll('.in-v-r.on,.in-v-t.on'),function(x){x.classList.remove('on')});if(op){w.hidden=false;b.classList.add('on')}});
var secKP=EQIN.secKP({MN:MN,NA:NA,esc:esc,heute:heute,nf:nf});
var secZ=EQIN.secZ({IDS:IDS,berlinNow:berlinNow,dm:dm,esc:esc,heute:heute,hm:hm,pbar:pbar,tms:tms});
var secK=EQIN.secK({MN:MN,NA:NA,dm:dm,esc:esc,heute:heute,nf:nf,nice:nice,pick:pick,tms:tms});
var secL=EQIN.secL({DAY:DAY,NA:NA,WTG:WTG,dlParts:dlParts,esc:esc});
var secC=EQIN.secC({DAY:DAY,NA:NA,dm:dm,esc:esc,heute:heute,tms:tms});
var secF=EQIN.secF({NA:NA,byId:byId,dm:dm,esc:esc,heute:heute,mark:mark,nf:nf});
var secE=EQIN.secE({dm:dm,esc:esc,nf:nf});
var secLS=EQIN.secLS({NA:NA,esc:esc});
var secVB=EQIN.secVB({NA:NA,esc:esc,nf:nf});
var secV=EQIN.secV({NA:NA,byId:byId});
var secFZ=EQIN.secFZ({NA:NA});
var secN=EQIN.secN({NA:NA,dm:dm,esc:esc,heute:heute,nf:nf,nice:nice,tms:tms});
var secPL=EQIN.secPL({NA:NA,berlinNow:berlinNow,esc:esc,heute:heute,hm:hm,nf:nf,pbar:pbar,tms:tms});
var secBW=EQIN.secBW?EQIN.secBW({NA:NA,esc:esc,tms:tms,berlinNow:berlinNow}):function(){return NA};
var secOP=EQIN.secOP?EQIN.secOP({NA:NA,esc:esc,nf:nf}):function(){return NA};
var secGR=EQIN.secGR?EQIN.secGR({NA:NA,esc:esc}):null;
if(secGR){setInterval(function(){var el=$('s-gr');if(el&&el.getAttribute('data-gr')!=='1'){el.setAttribute('data-gr','1');secGR.mount(el)}},1000)}
$('in-go').onclick=login;$('in-out').onclick=function(){sset(KS,null);show('in-login')};
var m=/[#&]code=([^&]+)/.exec(location.hash),st=/[#&]state=([^&]+)/.exec(location.hash),pk=sget(VS);
if(m&&st&&pk&&decodeURIComponent(st[1])===pk.s){history.replaceState(null,'',location.pathname);sset(VS,null);tokReq({clientId:CID,grantType:'authorization_code',redirectUri:RU,code:decodeURIComponent(m[1]),codeVerifier:pk.v}).then(load).catch(function(){show('in-login');err('Die Anmeldung hat nicht geklappt. Bitte versucht es noch einmal.')})}
else if(sget(KS)){load()}else{show('in-login')}
setInterval(function(){if(sget(KS)&&!$('in-app').hidden)load()},120000)}};
})();

/* EQ_IMMER_OFFEN (12.11.2026, Flo): Im internen Bereich wird nichts weggeklappt. Alle details sind immer offen, Klicks auf summary klappen nicht, die Begruendungen der Lernschleifen sind immer sichtbar. */
(function(){
try{var st=document.createElement('style');st.textContent='details>summary{cursor:default;list-style:none}details>summary::-webkit-details-marker{display:none}details>summary::marker{content:""}details>summary{font-weight:600}.in-ls-b{cursor:default}';document.head.appendChild(st)}catch(e){}
function fix(root){var r=root&&root.querySelectorAll?root:document;var ds=r.querySelectorAll('details');for(var i=0;i<ds.length;i++){if(!ds[i].open)ds[i].open=true}var ws=r.querySelectorAll('.in-ls-w');for(var j=0;j<ws.length;j++){if(ws[j].hidden)ws[j].hidden=false}}
document.addEventListener('click',function(e){var s=e.target&&e.target.closest?e.target.closest('details>summary'):null;if(s&&!e.target.closest('a,button,input,select,textarea'))e.preventDefault()},true);
document.addEventListener('toggle',function(e){if(e.target&&e.target.tagName==='DETAILS'&&!e.target.open)e.target.open=true},true);
function start(){fix(document);try{new MutationObserver(function(ms){var need=false;for(var i=0;i<ms.length&&!need;i++){var m=ms[i];if(m.type==='childList')need=true;else if(m.target&&m.target.tagName==='DETAILS'&&!m.target.open)need=true;else if(m.target&&m.target.classList&&m.target.classList.contains('in-ls-w')&&m.target.hidden)need=true}if(need)fix(document)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open']})}catch(e){}}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
