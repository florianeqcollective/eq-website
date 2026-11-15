(function(){
var hd=document.head;[['meta','name','viewport','content','width=device-width,initial-scale=1'],['meta','name','robots','content','noindex,nofollow']].forEach(function(m){if(hd.querySelector('meta[name='+m[2]+']'))return;var e=document.createElement('meta');e.setAttribute(m[1],m[2]);e.setAttribute(m[3],m[4]);hd.appendChild(e)});
[['assets/styles.css?v=20261116']].forEach(function(l){if(hd.querySelector('link[rel=stylesheet]'))return;var e=document.createElement('link');e.rel='stylesheet';e.href=l[0];hd.appendChild(e)});
if(!hd.querySelector('link[rel=icon]')){var fv=document.createElement('link');fv.rel='icon';fv.type='image/svg+xml';fv.href='assets/favicon.svg';hd.appendChild(fv);var pl=document.createElement('link');pl.rel='preload';pl.as='font';pl.type='font/woff2';pl.crossOrigin='anonymous';pl.href='assets/fonts/montserrat-var.woff2';hd.appendChild(pl)}
var M='https://static.wixstatic.com/media/';
var P={'2477':'cb50edaecf9545acbce58e84abeab11f','1484':'b031a65eaefd45f3ae4b140c19c6e2e6','9149':'8cf795fcaa9844688563dec0f1052bed','3692':'359035c052b64925acce8b792c90b07a','9218':'dca6e55e74314351a2fc17f8fa8abcc3','2440':'20cf7de0249142949aa13e610e6c3241','1138':'ffd3217f926e4f5e9633524a7d8944bf','1290':'d3eb272c353045fcb16e4c1af8d28b65','1656':'092403c7cbf642aaabceb170d7696d31','2571':'2698283575b94947b70b3b9f8fe11612','3690':'3c1a6cf9a5df462190d3822e156c9ad9','3782':'130bbf_4ed5fef36aed47c58d7c5f25ab596e25~mv2.jpg','9117':'bff21fabaded433d8fc84c34b1af0997','9129':'063b0e8f2e4f4633a4de0b3e46ef0b0e','9154':'598867d9bb8947a1b37b5396c5d0dcb1','9177':'3c5895c9357a47e486915f0032b1781a','9190':'a42aa931d53b44279108a473d7c0e790','9229':'222a27a805b44aec877edf621f7650c2','9240':'770b0117c7b74f968cfea87033976e0d','9259':'d5047955e03b41269c5cd8346637cfa4','9287':'5921bd1ada83458d90d55416e295ebc2','9315':'33bb13a685cc4293a834d53a2a2a9605','9437':'44c1138e99e0439f8e104832b1ccfb75','9452':'d637ad43835d493fb5d16cbf56f0e75c','0195':'c8e7dd01b2ae41798b2314b439bb9a3c','0125':'277c774d84814c48968e10c244a0b5a4','0053':'7b27e4e418254151863dc8f43054f7d0','0111':'c67a85c9939f417d84c90e3f164d10e4','9623':'75b89088ce604e668db8f7a4c987177a','9560':'379a29b97f894eff87e883dfd10fe1db','9579':'895e1a01ce2640f68a1e45480f5ca51d','1499':'0102a90ed1fa49d48cf5cd29bb64b3e2','0589':'e14a56205be3426aa0ad4eb843c863a1','0786':'ae627d10a4bd4615a3c4168b5bc60bab','1045':'f0c57ca76c3c41a780a10ebde3349d7a','1251':'48d3187d3137426c8a2397c45bf1c34d','1481':'010d6db21ad34388b5127e588b372016','2407':'7d25353487f8479497dd5e4efc45e81f','1947':'8f064be12ed44d82b2eda2929057524c','0043':'0d7f023e02a9482cabdda7d82cfacd3e','3527':'108c0fbf67794650b7eb20c6e2fefcbe','3651':'440b8a72a59c4701ba627b2be3c1ca33','3678':'f41b7ffcc5644ce1a190028e5736d4d5','3082':'a28fee1edaa0451591844e809a95db58','0901':'dc0bbe12fec444ecbf9e651ca9904108','1610':'d1aa94f59eee4a029fe81f6b334e0dee','9206':'0765d56961394effa1bad901ac2d431c','1443':'e6387601cbb74453b5b36ab8e6b365da','2659':'257ecaf9d8e749d3921d8be149b6af56','1759':'af6850bf33ad4d1aba3738dab9ad78d3','0563':'4f35ce1367484b37965a7d9e0c082ff1','9186':'facb779f49cb4d038500c07e861277b4','1401':'50f9fc73e36d4b03a91e5ad7c52cfe4a','9144':'e31f012ff4ba4a7db62acc48f258feef','3943':'3c10d920299d47dbb47ca925752566ac','1195':'0dbf8bb62b0749c586c3b0ee8e4c9fa4','1451':'65bce48e44d34909b09f726d94a8fc8b','0369':'ca5f639b03fa4f2b81ad68f68504c270','1706':'71358de25f164ebf916cb2b8325c3572','1682':'3c06354baaa14f36b55925932b8d0495','1548':'0a12a3524d2f4d3bbd9960ecd22af162','1790':'3bd043aef1ba4157a2ee9bf85adbf768','0937':'25ba11b8f79242abace7ccdc6706e60a','0597':'7a4e42e7a47645029bc4cc00c1bf55ff','1163':'1899ea4cdeeb4530ad678f6bf2272a9e'};
window.EQ_PHOTO_MAP=P;
// Horizontaler Bildausschnitt in Prozent (50 = Mitte, kleiner = Ausschnitt nach links)
var OP={'9623':50,'9560':58,'9579':40,'1548':72};
var VY={'9560':2};
var key=document.body.getAttribute('data-page');
var pg=window.PAGES&&window.PAGES[key];
document.title=(pg?pg.title+' | ':'')+'EQ Collective';if(pg&&pg.desc){var md=hd.querySelector('meta[name=description]');if(!md){md=document.createElement('meta');md.setAttribute('name','description');hd.appendChild(md)}md.setAttribute('content',pg.desc);var od=hd.querySelector('meta[property="og:description"]');if(od)od.setAttribute('content',pg.desc);var ot=hd.querySelector('meta[property="og:title"]');if(ot)ot.setAttribute('content',document.title)}
var nav=[['ueber-uns.html','Über uns'],['loesungen.html','Lösungen'],['teamcheck.html','Teamcheck'],['ressourcen.html','Blog'],['newsletter.html','Newsletter'],['discovery-call.html','Discovery Call buchen','navcta']];
var act=pg&&pg.nav||'';
var h='';
h+='<header class="top"><div class="wrap nav"><a class="logo" href="index.html"><img src="assets/logo.svg" alt="EQ Collective"></a><button class="burger" aria-label="Menü" id="bg">☰</button><nav class="m" id="nv">';
nav.forEach(function(n){h+='<a href="'+n[0]+'"'+(n[2]?' class="navcta"':(act===n[0]?' class="on"':''))+'>'+n[1]+'</a>'});
h+='</nav></div></header>';
var main='<main>'+(pg?pg.html():'')+'</main>';
var f='<footer class="f"><div class="wrap fg"><div><p class="fl">Wir gestalten Zusammenarbeit neu. Mit Methoden, die in Teams wirken.</p><p class="fl" style="font-size:.88rem;margin-top:10px">Training und Organisationsentwicklung aus Rosenheim, für Süddeutschland, Tirol und das Salzburger Land.</p><p class="fm"><a href="mailto:aloha@eq-collective.de">aloha@eq-collective.de</a><a href="tel:+4916099340307">+49 (0) 160 99 34 03 07</a></p></div>';
f+='<div><h4>Lösungen</h4><a href="new-leadership.html">New Leadership</a><a href="selbstorganisation.html">Wirksame Selbstorganisation</a><a href="wertschaetzende-beziehungen.html">Wertschätzende Beziehungen</a><a href="ki-zeitalter.html">KI-Zeitalter</a><a href="organisationen.html">Für Organisationen</a><a href="kibun.html">Kibun</a><a href="themen.html">Anlässe</a></div>';
f+='<div><h4>Lesen und prüfen</h4><a href="teamcheck.html">Teamcheck</a><a href="blog-vorschau.html">Blog</a><a href="newsletter.html">Newsletter</a></div>';
f+='<div><h4>Kontakt</h4><a href="discovery-call.html">Discovery Call</a><a href="coffee-call.html">Coffee Call</a><a href="kontakt.html">Kontakt</a><a href="ueber-uns.html">Über uns</a></div></div><div class="wrap fleg"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="agb.html">AGB</a><a href="intern.html">Intern</a></div>';
f+='<div class="fband"><div class="wrap"><img class="fz" src="assets/zebra-w.svg" alt=""></div></div></footer>';
var svg='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="ci" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".17 1"/><feFuncG type="table" tableValues=".38 1"/><feFuncB type="table" tableValues=".45 1"/></feComponentTransfer></filter></svg>';
document.body.innerHTML=svg+h+main+f;

/* ZK_OFFLINE: Lösung Zusammenarbeit im KI-Zeitalter ist noch nicht fertig und bleibt offline. Läuft nach dem Rendern. */
(function(){
var SL='zusammenarbeit-ki-zeitalter.html';
document.querySelectorAll('a[href^="'+SL+'"]').forEach(function(a){var c=a.closest('.card,.lbox,li');if(c&&c.parentNode)c.parentNode.removeChild(c);else if(a.parentNode)a.parentNode.removeChild(a)});
var R=[[/Zwei unserer Lösungen behandeln gezielt, was KI für Führung und Zusammenarbeit bedeutet/,'Eine unserer Lösungen behandelt gezielt, was KI für Führung bedeutet'],[/Zwei der vier Lösungen behandeln, was KI für Führung und Zusammenarbeit bedeutet/,'Eine der drei Lösungen behandelt, was KI für Führung bedeutet'],[/Zwei Lösungen setzen genau hier an\. Beide behandeln, was KI für Führung und Zusammenarbeit bedeutet\./,'Unsere Lösung New Leadership setzt genau hier an. Sie behandelt, was KI für Führung bedeutet.'],[/Vier Lösungen/g,'Drei Lösungen'],[/vier Lösungen/g,'drei Lösungen']];
var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,L=[];while((n=w.nextNode()))L.push(n);
L.forEach(function(t){var v=t.nodeValue,o=v;R.forEach(function(r){v=v.replace(r[0],r[1])});if(v!==o)t.nodeValue=v});
})();
/*DS_OFFLINE*/
(function(){if(document.body.getAttribute('data-page')==='anlass-digitale-souveraenitaet')return;document.querySelectorAll('a[href^="anlass-digitale-souveraenitaet.html"]').forEach(function(a){var c=a.closest('.card,.lbox,li');if(c&&c.parentNode)c.parentNode.removeChild(c);else if(a.parentNode)a.parentNode.removeChild(a)})})();
document.getElementById('bg').onclick=function(){var nv=document.getElementById('nv'),o=nv.classList.toggle('open');this.classList.toggle('x',o);this.setAttribute('aria-expanded',o?'true':'false');this.setAttribute('aria-label',o?'Menü schließen':'Menü')};
document.querySelectorAll('img[data-foto]').forEach(function(el){var id=el.getAttribute('data-foto'),w=+el.getAttribute('data-w')||1000;var r=el.getAttribute('data-r');var u=M+(P[id].indexOf('~')>0?P[id]:'5156bf_'+P[id]+'~mv2.jpg');if(r){var W=Math.round(w*(r==='h'?1.9:2));el.src=u+'/v1/fill/w_'+W+',h_'+Math.round(W*2/3)+',al_c,q_80/foto.jpg';el.style.objectPosition=(OP[id]||50)+'% 50%';if(r==='h'&&VY[id]){el.style.transform='translateY('+VY[id]+'%) scale('+(1+2*VY[id]/100)+')'}}else{el.src=u+'/v1/fill/w_'+w+',h_'+Math.round(w*2/3)+',al_c,q_80/foto.jpg'};el.setAttribute('data-quelle','TANNE9_EQ-Collective-'+id+'_LR.jpg')});
// Herkunft merken und an Buchungslinks weitergeben
var q='';try{var u=new URLSearchParams(location.search).get('q');if(u){sessionStorage.setItem('q',u)}q=sessionStorage.getItem('q')||''}catch(e){}
window.EQ_SOURCE=q;
window.EQ_TAG=function(root){(root||document).querySelectorAll('a[href^="discovery-call.html"],a[href^="coffee-call.html"],a[href^="coffee-call-franzi.html"]').forEach(function(a){if(a.hasAttribute('data-q')){a.href=a.getAttribute('href').split('?')[0]+'?q='+encodeURIComponent(a.getAttribute('data-q'))}else if(q){a.href=a.getAttribute('href').split('?')[0]+'?q='+encodeURIComponent(q)}})};
window.EQ_TAG();

// Zugriff auf Wix (alte Seite EQ Collective): Blog lesen, Formulare in CMS-Sammlungen speichern
var CID='b40ee72d-5f62-4889-9f72-e1b5949339f7',API='https://www.wixapis.com';
var EQ=window.EQ={};
EQ.token=function(){if(!EQ._t){EQ._t=fetch(API+'/oauth2/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:CID,grantType:'anonymous'})}).then(function(r){return r.json()}).then(function(j){if(!j.access_token)throw new Error('token');return j.access_token})}return EQ._t};
EQ.call=function(path,body){return EQ.token().then(function(t){return fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:t},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json()})})};
EQ.insert=function(col,data){return EQ.call('/wix-data/v2/items',{dataCollectionId:col,dataItem:{data:data}})};
EQ.subscribe=function(d){var sm={email:d.email,form_field_fcdc:true,name:d.vorname||'',nachname_8924:d.nachname||''};return EQ.call('/form-submission-service/v4/submissions',{submission:{formId:'78ab5a7a-53d9-4480-8d38-1da3435574f5',submissions:sm}}).catch(function(){return EQ.insert('Newsletter',{email:d.email,vorname:d.vorname||'',nachname:d.nachname||'',einwilligung:true,status:'neu-ohne-doi',quelle:d.quelle||''})})};
EQ.posts=function(rich){return EQ.call('/blog/v3/posts/query',{query:{paging:{limit:100}},fieldsets:rich?['URL','RICH_CONTENT']:['URL']}).then(function(j){var l=j.posts||[];l.sort(function(a,b){return a.firstPublishedDate<b.firstPublishedDate?1:-1});return l})};

// Formulare mit data-col speichern ihre Eingaben in einer Wix-Sammlung
document.querySelectorAll('form[data-col]').forEach(function(fm){fm.addEventListener('submit',function(ev){ev.preventDefault();var msg=fm.querySelector('.fmsg');var say=function(t,ok){if(msg){msg.textContent=t;msg.className='fmsg '+(ok?'ok':'err')}};
var d={};var bad=false;fm.querySelectorAll('[name]').forEach(function(el){if(el.type==='checkbox'){d[el.name]=el.checked;if(el.required&&!el.checked)bad=true}else{d[el.name]=el.value.trim();if(el.required&&!d[el.name])bad=true}});
if(d.email!==undefined&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))bad=true;
if(bad){say('Bitte fülle die Pflichtfelder aus, gib eine gültige E-Mail-Adresse an und stimme der Verarbeitung zu.',false);return}
if(d.website){fm.innerHTML='<p class="fmsg ok">Danke.</p>';return}delete d.website;
var wantNl=d.newsletter===true;delete d.newsletter;d.status='neu';d.quelle=window.EQ_SOURCE||'';
var btn=fm.querySelector('button[type=submit]');if(btn)btn.disabled=true;say('Wird gesendet …',true);
(fm.getAttribute('data-col')==='Newsletter'?EQ.subscribe({email:d.email,vorname:d.vorname,nachname:d.nachname,quelle:d.quelle}):EQ.insert(fm.getAttribute('data-col'),d)).then(function(){if(wantNl){EQ.subscribe({email:d.email,vorname:d.name||'',quelle:'teamcheck'}).catch(function(){})}fm.innerHTML='<p class="fmsg ok">'+fm.getAttribute('data-ok')+(wantNl?' Für den Newsletter haben wir dir eine Bestätigungsmail geschickt. Bitte bestätige dort deine Anmeldung.':'')+'</p>';var okm=fm.querySelector('.fmsg.ok');if(okm&&okm.scrollIntoView)okm.scrollIntoView({block:'center',behavior:'smooth'});var n=fm.getAttribute('data-next');if(n){var el=document.getElementById(n);if(el)el.hidden=false}}).catch(function(){if(btn)btn.disabled=false;say('Das hat gerade nicht geklappt. Schreib uns bitte kurz an aloha@eq-collective.de.',false)})})});
if(pg&&pg.init)pg.init();
(function(){var ar=document.querySelector('.arch');if(!ar||!window.EQ)return;EQ.call('/wix-data/v2/items/query',{dataCollectionId:'NewsletterArchiv',query:{sort:[{fieldName:'datum',order:'DESC'}],paging:{limit:100}}}).then(function(j){var l=(j.dataItems||[]).map(function(x){return x.data}).filter(function(x){return x&&x.titel&&x.url}).map(function(x){x.url=String(x.url).replace(/^https?:\/\/(www\.)?(eq-collective|zebra-kollektiv)\.de\/so\//,'https://app.eq-collective.de/so/');return x});if(!l.length)return;var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};ar.innerHTML=l.map(function(x){var d=(x.datum||'').split('-');var dt=d.length==3?d[2]+'.'+d[1]+'.'+d[0]:'';var t=x.titel.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,'').trim();return '<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+(x.bild?'<img src="'+esc(x.bild)+'" alt="" loading="lazy">':'')+'<p class="post-meta">'+dt+'</p><h3>'+esc(t)+'</h3></a>'}).join('')}).catch(function(){})})();
})();
/* EQ_RECOLOR: Illustrationen (Adobe Stock, Viktoria Kurpas) auf die CI Farben umfärben.
   Gelb wird Olivgelb (#d7da5b), Rot und Orange Koralle (#e2787c), Teal bleibt CI Teal (#348292), Marine wird Anthrazit oder Flieder (#9791ba). Läuft im Browser per Canvas. */
(function(){
var cache={};var CROP={'1000339534':[.42,0,.31,1],'1355021857':[.10,.04,.46,.94]};
function hsl(H,S,L){var C=(1-Math.abs(2*L-1))*S,X=C*(1-Math.abs((H/60)%2-1)),m=L-C/2,R,G,B,k=Math.floor(H/60)%6;if(k===0){R=C;G=X;B=0}else if(k===1){R=X;G=C;B=0}else if(k===2){R=0;G=C;B=X}else if(k===3){R=0;G=X;B=C}else if(k===4){R=X;G=0;B=C}else{R=C;G=0;B=X}return [Math.round((R+m)*255),Math.round((G+m)*255),Math.round((B+m)*255)]}
function map(d){for(var i=0;i<d.length;i+=4){var r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,s=0,h=0,dl=mx-mn;if(dl>0.001){s=dl/(1-Math.abs(2*l-1));if(mx===r)h=((g-b)/dl+6)%6;else if(mx===g)h=(b-r)/dl+2;else h=(r-g)/dl+4;h*=60}
if(s<0.14||l>0.94)continue;var H=h,S=s,L=l;
if(h>=38&&h<80){if(h<44||l<.52){H=358;S=.62;L=Math.min(.78,.66+(l-.55)*.6)}else{H=62;S=.6;L=Math.min(.8,.6+(l-.58)*.9)}}
else if(h>=80&&h<150){H=66;S=Math.min(.55,s*.7);L=Math.min(.78,l+.05)}
else if(h>=150&&h<205){H=192;S=Math.min(.55,s*.8)}
else if(h>=205&&h<260){if(l>=.33){H=252;S=.2;L=Math.min(.75,.55+(l-.33)*.5)}else{H=196;S=.22;L=l*.9}}
else if(h>=340||h<14){H=358;S=Math.min(.7,s*.85)}
else continue;
var c=hsl(H,S,L);d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2]}}
function load(u){if(cache[u])return cache[u];cache[u]=new Promise(function(res){var i=new Image();i.crossOrigin='anonymous';i.onload=function(){try{var c=document.createElement('canvas');var cm=u.match(/F_(\d+)_/),cr=(cm&&CROP[cm[1]])||[0,0,1,1],sx=Math.round(cr[0]*i.naturalWidth),sy=Math.round(cr[1]*i.naturalHeight),sw=Math.round(cr[2]*i.naturalWidth),sh=Math.round(cr[3]*i.naturalHeight);c.width=sw;c.height=sh;var x=c.getContext('2d');x.drawImage(i,sx,sy,sw,sh,0,0,sw,sh);var im=x.getImageData(0,0,sw,sh);map(im.data);x.putImageData(im,0,0);res(c.toDataURL('image/jpeg',.9))}catch(e){res(u)}};i.onerror=function(){res(u)};i.src=u});return cache[u]}
var SVGR=/shapes\/5156bf_(b48a6618|6547f380|3aae2547|0a040189|1560b032)[0-9a-f]*\.svg/;
function recSvg(img){img.setAttribute('data-rc','1');var u=img.src;fetch(u).then(function(r){return r.text()}).then(function(t){t=t.replace(/#([0-9a-fA-F]{6})\b/g,function(m,h){var d=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),255];map(d);return '#'+[d[0],d[1],d[2]].map(function(v){return ('0'+v.toString(16)).slice(-2)}).join('')});img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t);img.classList.add('rc')})['catch'](function(){img.classList.add('rc')})}
function go(img){/*PRE_NORC*/if(/[?&]pre=1/.test(location.search))return;if(img.getAttribute('data-rc'))return;if(SVGR.test(img.src)){recSvg(img);return}if(/wixstatic/.test(img.src)){img.setAttribute('data-rc','1');img.classList.add('rc');return}img.setAttribute('data-rc','1');img.loading='eager';var u=img.src;load(u).then(function(n){img.src=n;img.classList.add('rc')})}
function scan(){var l=document.querySelectorAll('.ill img');for(var i=0;i<l.length;i++)go(l[i])}
function start(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});setTimeout(function(){var l=document.querySelectorAll('.ill img');for(var i=0;i<l.length;i++)l[i].classList.add('rc')},6000)}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start)})();
(function(){var s=function(){document.documentElement.style.setProperty('--sbw',(window.innerWidth-document.documentElement.clientWidth)+'px')};s();window.addEventListener('resize',s);window.addEventListener('load',s)})();

/*EQC_CONSENT*/
(function(){
if(/[?&]pre=1/.test(location.search))return;
var KEY='eqc_consent',VER=1,MAXAGE=365*24*3600*1000;
var CATS=[
{id:'notwendig',t:'Notwendig',d:'Damit die Seite funktioniert und sicher bleibt, zum Beispiel die Zuordnung zum richtigen Server und das Merken dieser Entscheidung. Immer aktiv.',lock:1},
{id:'extern',t:'Externe Dienste',d:'Eingebettete Inhalte von Dritten, zum Beispiel unser Terminkalender von Google. Er wird nur mit eurer Zustimmung geladen.'},
{id:'statistik',t:'Statistik',d:'Wir messen, welche Seiten gelesen werden und über welchen Weg Besucher zu uns finden, damit wir die Seite verbessern können. Dafür speichern wir eine zufällige Kennung in eurem Browser und übertragen Seitenaufrufe und Klicks an unser System bei Wix. Namen oder E-Mail-Adressen sind nicht dabei.'}
];
function rd(){try{var o=JSON.parse(localStorage.getItem(KEY)||'null');if(o&&o.v===VER&&o.c&&Date.now()-o.ts<MAXAGE)return o}catch(e){}return null}
var st=rd(),root=null,last=null;
function wr(c){var o={v:VER,ts:Date.now(),c:c};try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}st=o;try{document.dispatchEvent(new CustomEvent('eqc:change',{detail:o}))}catch(e){}}
window.EQC={allowed:function(id){return id==='notwendig'||!!(st&&st.c&&st.c[id])},open:function(){render(true)},state:function(){return st}};
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function btn(cls,txt,fn){var b=el('button','eqc-b '+cls,txt);b.type='button';b.addEventListener('click',fn);return b}
function close(){if(root&&root.parentNode)root.parentNode.removeChild(root);root=null;if(last&&last.focus){try{last.focus({preventScroll:true})}catch(e){}}last=null}
function decide(c){var m={};CATS.forEach(function(k){m[k.id]=k.lock?true:!!c[k.id]});wr(m);close()}
function all(v){var c={};CATS.forEach(function(k){c[k.id]=v});return c}
function render(settings){
var keep=last;close();last=keep||document.activeElement;
root=el('div','eqc');root.setAttribute('role','dialog');root.setAttribute('aria-modal','false');root.setAttribute('aria-labelledby','eqc-t');root.tabIndex=-1;
var h=el('h2','eqc-h',settings?'Cookie-Einstellungen':'Eure Privatsphäre');h.id='eqc-t';root.appendChild(h);
var p=el('p','eqc-p');
if(!settings){
p.innerHTML='Diese Seite kommt ohne Werbe-Cookies aus. Technisch notwendige Speicherungen sind immer aktiv. Eine einfache Reichweitenmessung und Inhalte von Dritten, etwa Google Kalender, schalten wir nur mit eurer Zustimmung ein. Ihr könnt jederzeit ablehnen und eure Wahl später ändern. Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.';
root.appendChild(p);
var r=el('div','eqc-row');
r.appendChild(btn('n','Nur notwendige',function(){decide(all(false))}));
r.appendChild(btn('a','Alle akzeptieren',function(){decide(all(true))}));
root.appendChild(r);
var l=el('button','eqc-l','Einstellungen');l.type='button';l.addEventListener('click',function(){render(true)});root.appendChild(l);
}else{
p.innerHTML='Hier könnt ihr festlegen, was wir laden dürfen. Eure Wahl gilt zwölf Monate und lässt sich jederzeit über den Link Cookie-Einstellungen im Fußbereich ändern. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.';
root.appendChild(p);
var inputs={};
CATS.forEach(function(k){
var row=el('div','eqc-c');var ct=el('div','eqc-ct');ct.appendChild(el('strong','',k.t));ct.appendChild(el('span','',k.d));
var sw=el('label','eqc-sw');var i=document.createElement('input');i.type='checkbox';i.setAttribute('role','switch');i.setAttribute('aria-label',k.t);
i.checked=k.lock?true:!!(st&&st.c&&st.c[k.id]);if(k.lock)i.disabled=true;inputs[k.id]=i;
sw.appendChild(i);sw.appendChild(el('span','eqc-tr'));row.appendChild(ct);row.appendChild(sw);root.appendChild(row)});
if(st){var d=new Date(st.ts);root.appendChild(el('p','eqc-meta','Zuletzt gespeichert am '+d.toLocaleDateString('de-DE')+'.'))}
var r2=el('div','eqc-row');r2.style.marginTop='16px';
r2.appendChild(btn('n','Nur notwendige',function(){decide(all(false))}));
r2.appendChild(btn('s','Auswahl speichern',function(){var c={};for(var id in inputs)c[id]=inputs[id].checked;decide(c)}));
r2.appendChild(btn('a','Alle akzeptieren',function(){decide(all(true))}));
root.appendChild(r2);
}
document.documentElement.appendChild(root);
try{root.focus({preventScroll:true})}catch(e){}
}
function addLink(){var f=document.querySelector('.fleg');if(!f||f.querySelector('[data-eqc-open]'))return;var a=document.createElement('a');a.href='#cookie-einstellungen';a.setAttribute('data-eqc-open','');a.textContent='Cookie-Einstellungen';var ds=f.querySelector('a[href^="datenschutz"]');if(ds&&ds.nextSibling)f.insertBefore(a,ds.nextSibling);else f.appendChild(a)}
document.addEventListener('click',function(e){var t=e.target&&e.target.closest?e.target.closest('[data-eqc-open]'):null;if(t){e.preventDefault();last=t;render(true)}});
var q=false;function sched(){if(q)return;q=true;(window.requestAnimationFrame||setTimeout)(function(){q=false;addLink()})}
function start(){addLink();new MutationObserver(sched).observe(document.documentElement,{childList:true,subtree:true});if(!st)setTimeout(function(){if(!st&&!root){last=null;render(false)}},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

/*EQ_PHCLEAN*/
(function(){
if(/[?&]keepph=1/.test(location.search))return;
var pg=(document.body&&document.body.getAttribute('data-page'))||'';
if(pg==='zusammenarbeit-ki-zeitalter')return;
var TAILS=[
[/Platzhalter: Beispielauswertung, die wir mit echten Rückmeldungen ersetzen\./,'Ein Beispiel dafür, wie eine Auswertung aussehen kann.'],
[/Platzhalter: Dauer und Teilnehmende\./,'Dauer und Teilnehmende legen wir mit euch fest.'],
[/Platzhalter: Formate wie Coaching oder Reviews\./,'Das geht zum Beispiel mit Coaching oder Reviews.'],
[/Platzhalter: Zeitpunkt im Ablauf\./,'Den Zeitpunkt stimmen wir mit euch ab.'],
[/Platzhalter: Anzahl und Abstand der Termine\./,'Anzahl und Abstand der Termine legen wir mit euch fest.'],
[/Platzhalter: Abstände und Anzahl der Termine im Ablauf mit Franzi und Michi abstimmen\./,'Anzahl und Abstand der Termine legen wir mit euch fest.']
];
var PREFIX=['Platzhalter: Format und Dauer klären wir im Discovery Call.','Platzhalter: Das hängt von Größe und Ziel ab.','Platzhalter: Geschäftsführung und Personen'];
var KEEP=/^\b$/;
function rm(n){if(n&&n.parentNode)n.parentNode.removeChild(n)}
function clean(){
var b=document.body;if(!b||b.textContent.indexOf('Platzhalter')<0)return;
var w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT,null,false),n,list=[];
while(n=w.nextNode()){if(n.nodeValue.indexOf('Platzhalter')>=0){var pt=n.parentNode&&n.parentNode.nodeName;if(pt==='SCRIPT'||pt==='STYLE')continue;list.push(n)}}
list.forEach(function(t){
var v=t.nodeValue,i;
if(KEEP.test(v))return;
for(i=0;i<TAILS.length;i++)v=v.replace(TAILS[i][0],TAILS[i][1]);
if(v.indexOf('Platzhalter')<0){t.nodeValue=v;return}
var tr=v.replace(/^\s+/,'');
var isPre=false;for(i=0;i<PREFIX.length;i++){if(tr.indexOf(PREFIX[i])===0)isPre=true}
if(isPre){t.nodeValue=v.replace('Platzhalter: ','');return}
if(tr.indexOf('Platzhalter')===0){
var el=t.parentNode;if(!el)return;
var det=el.closest&&el.closest('details');
if(det){rm(det);return}
if(/^H[1-4]$/.test(el.nodeName)){var s=el.closest('section');rm(s||el);return}
var cd=el.closest&&el.closest('.card,.lbox,li,.tc');
if(cd&&cd!==document.body&&cd.textContent.length<400){rm(cd);return}
rm(el);return}
t.nodeValue=v.replace(/\s*Platzhalter:[^.]*\.?/g,'').replace(/\s+$/,'');
});
}
function run(){try{clean()}catch(e){}}
function start(){run();var q=0;var mo=new MutationObserver(function(){if(q)return;q=setTimeout(function(){q=0;run()},80)});mo.observe(document.body,{childList:true,subtree:true,characterData:true});setTimeout(function(){mo.disconnect()},10000);window.addEventListener('load',run)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

/*NODUPIMG*/
(function(){function fix(){var a=document.querySelector('.article');if(!a||a.getAttribute('data-nodup'))return;/*DEDUPE*/var seen={};[].slice.call(a.querySelectorAll('img')).forEach(function(im){var m=/media\/([^\/?~]+)/.exec(im.getAttribute('src')||'');if(!m)return;if(seen[m[1]]){var f=im.closest('figure')||im;if(f&&f.parentNode&&f!==a)f.parentNode.removeChild(f)}else seen[m[1]]=1});var fig=[].filter.call(a.children,function(e){return e.tagName==='FIGURE'&&!e.classList.contains('cover')});if(!fig.length)return;a.setAttribute('data-nodup','1');fig.forEach(function(f){var q=f.previousElementSibling;if(q&&q.tagName==='P'&&q.textContent.length<90&&!q.querySelector('img'))q=q.previousElementSibling;if(q&&q.tagName==='FIGURE'){var n=f.nextElementSibling,s=0;while(n&&!(n.tagName==='P'&&n.textContent.length>120)&&s<6){n=n.nextElementSibling;s++}if(n&&n.parentNode)n.parentNode.insertBefore(f,n.nextSibling)}})}function go(){fix();new MutationObserver(fix).observe(document.body,{childList:true,subtree:true})}if(document.body)go();else document.addEventListener('DOMContentLoaded',go)})();

/* SK_TOUCH: Tooltips der Skill-Chips auf Touchgeräten schließbar (Tippen außerhalb, erneutes Tippen, Escape) */
(function(){var was=null;var act=function(){var a=document.activeElement;return a&&a.classList&&a.classList.contains('sk')?a:null};document.addEventListener('pointerdown',function(e){var s=e.target.closest?e.target.closest('.sk'):null;var a=act();was=(s&&s===a)?s:null;if(a&&s!==a)a.blur()},true);document.addEventListener('click',function(e){var s=e.target.closest?e.target.closest('.sk'):null;if(s&&was===s){s.blur()}was=null},true);document.addEventListener('keydown',function(e){if(e.key==='Escape'){var a=act();if(a)a.blur()}})})();

/*EQ_IFRAMEGATE*/
(function(){
function mk(f){var u=f.getAttribute('data-eqc-src');var d=document.createElement('div');d.setAttribute('data-eqc-ph','');d.style.cssText='padding:28px 22px;border:1px solid #d9d9d9;background:#f6f6f4;color:#161616;font:400 15px/1.55 Montserrat,system-ui,sans-serif';
var p=document.createElement('p');p.style.margin='0 0 14px';p.textContent='Der Terminkalender kommt von Google. Er lädt erst, wenn ihr Inhalte von Dritten erlaubt.';d.appendChild(p);
var b=document.createElement('button');b.type='button';b.setAttribute('data-eqc-open','');b.textContent='Einstellungen öffnen';b.style.cssText='min-height:44px;padding:10px 16px;border:2px solid #161616;background:#161616;color:#fff;font:600 12px/1.2 Montserrat,system-ui,sans-serif;letter-spacing:1.2px;text-transform:uppercase;cursor:pointer;margin:0 14px 8px 0';d.appendChild(b);
var a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Kalender direkt bei Google öffnen';a.style.cssText='color:#161616;text-decoration:underline';d.appendChild(a);return d}
function gate(){var ok=window.EQC&&window.EQC.allowed('extern');var l=document.querySelectorAll('iframe[data-eqc-src]');for(var i=0;i<l.length;i++){var f=l[i],pv=f.previousElementSibling,has=pv&&pv.hasAttribute&&pv.hasAttribute('data-eqc-ph');
if(ok){f.setAttribute('src',f.getAttribute('data-eqc-src'));f.removeAttribute('data-eqc-src');f.style.display='';if(has)pv.parentNode.removeChild(pv)}
else{f.style.display='none';if(!has)f.parentNode.insertBefore(mk(f),f)}}}
var q=false;function s(){if(q)return;q=true;(window.requestAnimationFrame||setTimeout)(function(){q=false;gate()})}
document.addEventListener('eqc:change',gate);
function go(){gate();new MutationObserver(s).observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/*EQ_REISE*/
(function(){
// Besucherweg, nur mit Einwilligung (Kategorie statistik). Ohne Einwilligung wird nichts gespeichert und nichts gesendet.
var VK='eqc_vid',FK='eqc_ft',sent={};
function ok(){return !!(window.EQC&&window.EQC.allowed&&window.EQC.allowed('statistik')&&window.EQ&&window.EQ.insert)}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function rid(){var a='';try{var b=new Uint8Array(12);crypto.getRandomValues(b);for(var i=0;i<b.length;i++)a+=('0'+b[i].toString(16)).slice(-2)}catch(e){a=String(Date.now())+Math.random().toString(16).slice(2)}return a}
function qs(k){try{return new URLSearchParams(location.search).get(k)||''}catch(e){return ''}}
function host(u){try{var h=new URL(u).hostname;return /(^|\.)eq-collective\.de$/.test(h)?'':h}catch(e){return ''}}
function trim(s,n){return String(s||'').slice(0,n||120)}
function vid(){var v=ls(VK);if(!v){v=rid();ls(VK,v)}return v}
function first(){var f=ls(FK);if(f){try{return JSON.parse(f)}catch(e){}}
f={t:new Date().toISOString(),q:window.EQ_SOURCE||qs('q'),c:qs('c'),s:qs('utm_source'),m:qs('utm_medium'),k:qs('utm_campaign'),r:host(document.referrer)};ls(FK,JSON.stringify(f));return f}
function send(ev,ziel){if(!ok())return;var f=first(),c=qs('c')||f.c;
var d={besucher:vid(),zeit:new Date().toISOString(),ereignis:ev,seite:trim(location.pathname,80),ziel:trim(ziel,120),quelle:trim(qs('utm_source')||f.s||f.q,60),medium:trim(qs('utm_medium')||f.m,40),kampagne:trim(qs('utm_campaign')||f.k,60),code:trim(c,20),q:trim(window.EQ_SOURCE||qs('q')||f.q,60),referrer:trim(f.r,80)};
window.EQ.insert('reise',d).catch(function(){})}
function view(){if(sent.v)return;if(!ok())return;sent.v=1;send('aufruf',/blog-beitrag\.html$/.test(location.pathname)?qs('slug'):'')}
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a||!ok())return;var h=a.getAttribute('href')||'';
if(/^(discovery-call|coffee-call|coffee-call-franzi|kontakt|teamcheck)\.html/.test(h))send('klick_call',h.split('#')[0]);
else if(/^https:\/\/calendar\.app\.google\//.test(h))send('klick_kalender_extern','calendar.app.google')
else if(/^https?:\/\/app\.eq-collective\.de\//.test(h))send('klick_blog',h.replace(/^https?:\/\/app\.eq-collective\.de/,'').slice(0,100))});
document.addEventListener('eqc:change',function(){if(ok()){view()}else{ls(VK,null);ls(FK,null);sent={}}});
function start(){view()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.EQ_REISE={state:function(){return{aktiv:ok(),besucher:ok()?ls(VK):null}}};
})();
