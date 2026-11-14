/* Cockpit-Abschnitt secAR (Dokumentation). Laedt das Dokument aus KIDaten (Eintrag architektur, Feld daten.html = Inhalt) und zeigt es im normalen Seitenfluss mit Inhaltsverzeichnis links (klebt beim Scrollen). */
window.EQIN=window.EQIN||{};
EQIN.secAR=function(D){
var q=D.q,esc=D.esc,NA=D.NA,done=false;
var CSS=`
.ar{display:grid;grid-template-columns:250px minmax(0,1fr);gap:32px;align-items:start;margin-top:8px}
.ar-toc{position:sticky;top:110px;max-height:calc(100vh - 130px);overflow-y:auto;font-size:13px;padding-right:4px}
.ar-toc .t{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gm);margin-bottom:8px;font-weight:600}
.ar-toc a{display:block;color:var(--gm);text-decoration:none;padding:4px 8px;border-left:2px solid var(--g);line-height:1.35;cursor:pointer}
.ar-toc a.s{padding-left:20px;font-size:12.5px}
.ar-toc a:hover{color:var(--x)}
.ar-toc a.on{color:var(--td);border-left-color:var(--t);background:var(--tl);font-weight:600}
.ar-doc{min-width:0;font-size:15px;line-height:1.55;color:var(--x)}
.ar-doc .wrap{max-width:none;padding:0}
.ar-doc h1{font-size:clamp(26px,4vw,38px);margin:0;line-height:1.2}
.ar-doc h2{font-size:22px;line-height:1.2;margin:44px 0 0;padding-top:22px;border-top:1px solid var(--g);scroll-margin-top:110px}
.ar-doc h3{font-size:16px;line-height:1.2;margin:24px 0 0;color:var(--td);scroll-margin-top:110px}
.ar-doc p{margin:8px 0 0;max-width:72ch}
.ar-doc .lead{font-size:17px;max-width:64ch;margin-top:14px}
.ar-doc .meta{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--gm)}
.ar-doc .fig{margin-top:16px;border:1px solid var(--g);background:#fff;border-radius:10px;padding:16px;overflow-x:auto}
.ar-doc pre.mermaid{margin:0;text-align:center;background:#fff;font-family:inherit}
.ar-doc .cap{font-size:13px;color:var(--gm);margin-top:8px;max-width:80ch}
.ar-doc .tablewrap{overflow-x:auto;margin-top:14px;border:1px solid var(--g);border-radius:10px;background:#fff}
.ar-doc table{border-collapse:collapse;width:100%;min-width:720px;font-size:13.5px}
.ar-doc th{text-align:left;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--gm);padding:10px 12px;border-bottom:1.5px solid var(--x);font-weight:600;background:none}
.ar-doc td{padding:9px 12px;border-bottom:1px solid var(--g);vertical-align:top}
.ar-doc tr:last-child td{border-bottom:0}
.ar-doc td:first-child{font-weight:600}
.ar-doc td.nr{color:var(--td);width:44px}
.ar-doc .rules{margin:14px 0 0;padding:0;list-style:none;display:grid;gap:8px;max-width:80ch;counter-reset:r}
.ar-doc .rules li{counter-increment:r;display:grid;grid-template-columns:34px minmax(0,1fr);gap:12px;align-items:start;border:1px solid var(--g);background:#fff;border-radius:10px;padding:10px 14px;margin:0}
.ar-doc .rules li::before{content:counter(r);display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1.5px solid var(--t);color:var(--td);font-size:13px;font-weight:600}
.ar-doc .rules b{display:block}
.ar-doc footer{margin-top:48px;padding-top:16px;border-top:1px solid var(--g);font-size:12.5px;color:var(--gm)}
@media(max-width:900px){.ar{grid-template-columns:minmax(0,1fr)}.ar-toc{position:static;max-height:none}.ar-toc a.s{display:none}}
`;
function mount(el,d){
if(!document.getElementById('ar-css')){var st=document.createElement('style');st.id='ar-css';st.textContent=CSS;document.head.appendChild(st)}
el.innerHTML='<p class="in-note" style="margin:0 0 8px">Stand '+esc(d.stand||'')+', Version '+esc(d.version||'')+'.</p><div class="ar"><nav class="ar-toc" aria-label="Inhaltsverzeichnis"></nav><div class="ar-doc">'+d.html+'</div></div>';
var toc=el.querySelector('.ar-toc'),hs=[].slice.call(el.querySelectorAll('.ar-doc h2,.ar-doc h3')),h='<div class="t">Inhalt</div>';
hs.forEach(function(e,i){h+='<a data-i="'+i+'" class="'+(e.tagName==='H3'?'s':'')+'">'+esc(e.textContent)+'</a>'});
toc.innerHTML=h;
var as=[].slice.call(toc.querySelectorAll('a'));
toc.addEventListener('click',function(ev){var a=ev.target.closest('a');if(!a)return;ev.preventDefault();hs[+a.getAttribute('data-i')].scrollIntoView({behavior:'smooth',block:'start'})});
function up(){if(!document.body.contains(toc))return;var c=0;hs.forEach(function(e,i){if(e.getBoundingClientRect().top<=140)c=i});as.forEach(function(a,i){a.classList.toggle('on',i===c)});var a=as[c];if(a&&window.innerWidth>900){var r=a.getBoundingClientRect(),t=toc.getBoundingClientRect();if(r.top<t.top||r.bottom>t.bottom)toc.scrollTop+=r.top-t.top-40}}
window.addEventListener('scroll',up,{passive:true});up();
function runM(){try{window.mermaid.initialize({startOnLoad:false,theme:'neutral'});window.mermaid.run({nodes:[].slice.call(el.querySelectorAll('pre.mermaid'))})}catch(e){}}
function go(){var n=0;(function w(){if(el.offsetWidth>0||n++>120)runM();else setTimeout(w,500)})()}if(window.mermaid){go()}else{var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';s.onload=go;document.head.appendChild(s)}
}
function secAR(el){if(done||!el)return;done=true;el.innerHTML='<p class="muted">Dokumentation wird geladen …</p>';
q({_id:{$eq:'architektur'}},[],1).then(function(r){var d=r[0]&&r[0].daten;if(!d||!d.html){done=false;el.innerHTML=NA;return}mount(el,d)}).catch(function(){done=false;el.innerHTML=NA})}
return secAR};