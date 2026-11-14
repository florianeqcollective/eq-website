/* Cockpit-Abschnitt secC. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secC=function(D){
var DAY=D.DAY,NA=D.NA,dm=D.dm,esc=D.esc,heute=D.heute,tms=D.tms;
function easter(y){var a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return Date.UTC(y,mo-1,da)}
function feiertag(ms){var y=new Date(ms).getUTCFullYear(),k=function(m,d){return Date.UTC(y,m-1,d)},e=easter(y),H={};
H[k(1,1)]='Neujahr';H[k(1,6)]='Heilige Drei Könige';H[e-2*DAY]='Karfreitag';H[e+DAY]='Ostermontag';H[k(5,1)]='Tag der Arbeit';H[e+39*DAY]='Christi Himmelfahrt';H[e+50*DAY]='Pfingstmontag';H[e+60*DAY]='Fronleichnam';H[k(8,15)]='Mariä Himmelfahrt';H[k(10,3)]='Tag der Deutschen Einheit';H[k(11,1)]='Allerheiligen';H[k(12,25)]='1. Weihnachtstag';H[k(12,26)]='2. Weihnachtstag';return H[ms]||null}
function secC(by){var lk=by['luecken'],kb=by['kpi-beitraege'],pn=by['plan'];if(!lk||!lk.daten)return NA;
var d=lk.daten,L=d.liste||[],gapBy={},pubBy={},planBy={};
L.forEach(function(x){gapBy[x.datum]=x});
((kb&&kb.daten&&kb.daten.eintraege)||[]).forEach(function(x){(pubBy[x.datum]=pubBy[x.datum]||[]).push(x)});
((pn&&pn.daten&&pn.daten.liste)||[]).forEach(function(x){(planBy[x.datum]=planBy[x.datum]||[]).push(x)});
var TT=EQIN._tt={};
function tt(iso,pr,ti){var k=iso+'|'+pr,l=planBy[iso]||[],p=l.filter(function(y){return y.profil===pr})[0]||l[0];TT[k]={t:ti||(p&&p.titel)||'',x:(p&&p.text)||''};return ' data-tt="'+esc(k)+'"'}
var t0=tms(heute+' 00:00'),dw0=new Date(t0).getUTCDay(),mon=(dw0===0||dw0===6)?t0+((8-dw0)%7||1)*DAY:t0-(dw0-1)*DAY,hz=(d.stand?tms(d.stand+' 00:00'):t0)+14*DAY,SO={1:'Flo',3:'Flo',5:'Flo',4:'Company'},WH=['Mo','Di','Mi','Do','Fr'];
var heuteIso=heute,in7=new Date(t0+7*DAY).toISOString().slice(0,10),open=L.filter(function(x){return x.datum>=heuteIso}),open7=open.filter(function(x){return x.datum<=in7});
var h='<style>.cal-e[data-tt]{cursor:pointer}#cal-pop{position:fixed;z-index:2000;width:360px;max-width:calc(100vw - 16px);max-height:250px;overflow:auto;background:#fff;color:#161616;border:1px solid #348292;border-radius:6px;padding:10px 12px;box-shadow:0 4px 16px rgba(0,0,0,.2);font-size:13px;white-space:pre-wrap}#cal-pop b{display:block;margin-bottom:6px}</style><p class="cal-sum">'+(open.length?'<b class="in-bad">'+open.length+' '+(open.length===1?'Lücke':'Lücken')+'</b> in den nächsten 14 Tagen, davon '+open7.length+' in den nächsten 7 Tagen.':'<b class="in-ok">Keine Lücke</b> in den nächsten 14 Tagen, alle Soll-Tage sind eingeplant.')+'</p><div class="in-cal">'+WH.map(function(w){return '<div class="cal-h">'+w+'</div>'}).join('');
for(var w=0;w<4;w++){for(var i=0;i<5;i++){var ms=mon+(w*7+i)*DAY,iso=new Date(ms).toISOString().slice(0,10),so=SO[i+1],fe=feiertag(ms),past=ms<t0,tod=ms===t0,pubs=pubBy[iso]||[],pls=planBy[iso]||[],g=gapBy[iso],body='';
pubs.forEach(function(x){body+='<div class="cal-e pub '+(x.konto==='Company'?'co':'flo')+'"'+tt(iso,x.konto,x.titel)+'><b>'+esc(x.konto)+'</b> '+esc(x.titel)+'<small>veröffentlicht</small></div>'});
if(!pubs.length){
if(fe){body+='<div class="cal-e fr"><b>frei</b><small>'+esc(fe)+'</small></div>'}
else if(pls.length){pls.forEach(function(x){body+='<div class="cal-e ok '+(x.profil==='Company'?'co':'flo')+'"'+tt(iso,x.profil||'',x.titel)+'><b>'+esc(x.profil||'')+'</b> '+esc(x.titel||'')+'<small>'+esc(x.status||'eingeplant')+'</small></div>'})}
else if(so){
if(past){}
else if(g)body+='<div class="cal-e gap"><b>'+esc(g.profil||so)+': Lücke</b><small>'+esc(g.art||'')+'</small></div>';
else if(ms<=hz)body+='<div class="cal-e ok '+(so==='Company'?'co':'flo')+'"><b>'+so+'</b><small>eingeplant</small></div>';
else body+='<div class="cal-e unk"><b>'+so+'</b><small>noch nicht geprüft</small></div>'}}
h+='<div class="cal-d'+(past?' past':'')+(tod?' today':'')+(body?'':' emp')+'"><div class="cal-n"><span class="cal-wd">'+WH[i]+'</span><span>'+dm(iso)+'</span></div>'+body+'</div>'}}
h+='</div><div class="in-leg"><span><i style="background:var(--t)"></i>Flo</span><span><i style="background:var(--k)"></i>Company</span><span><i style="background:#fff;border:1px dashed var(--kd)"></i>Lücke</span><span><i style="background:var(--tl);border:1px solid var(--t)"></i>eingeplant</span><span><i style="background:#fff;border:1px dashed #9aa9ac"></i>noch nicht geprüft</span></div>';
h+='<p class="cal-foot">Soll: Mo, Mi, Fr Flo, Do Company, Di keiner, bayerische Feiertage frei. Als abgedeckt zählt nur „eingeplant“ oder „veröffentlicht“. LinkedIn zuletzt gelesen am '+esc(d.plan_stand||'?')+', Lücken berechnet am '+esc(d.stand||'')+'. Veröffentlichte Beiträge stammen aus den Kennzahlen'+(kb&&kb.daten&&kb.daten.stand?' (Stand '+esc(kb.daten.stand)+')':'')+'. Quelle: '+esc(d.quelle||'Redaktionsplan und LinkedIn')+'.</p>';
return h}
if(!EQIN._ttInit){EQIN._ttInit=true;document.addEventListener('click',function(e){var p=document.getElementById('cal-pop'),el=e.target&&e.target.closest?e.target.closest('.cal-e[data-tt]'):null,k=el?el.getAttribute('data-tt'):'';if(p)p.remove();if(!el||(p&&p.getAttribute('data-k')===k))return;var v=(EQIN._tt||{})[k];if(!v)return;var r=el.getBoundingClientRect(),d=document.createElement('div');d.id='cal-pop';d.setAttribute('data-k',k);d.innerHTML='<b></b><div></div>';d.firstChild.textContent=v.t;d.lastChild.textContent=v.x||'kein Text gespeichert';d.style.top=Math.max(8,Math.min(r.bottom+6,window.innerHeight-260))+'px';d.style.left=Math.max(8,Math.min(r.left,window.innerWidth-380))+'px';document.body.appendChild(d)});document.addEventListener('keydown',function(e){if(e.key==='Escape'){var p=document.getElementById('cal-pop');if(p)p.remove()}})}
return secC;
};
