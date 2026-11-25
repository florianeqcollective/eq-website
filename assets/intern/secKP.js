/* Cockpit-Abschnitt secKP. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secKP=function(D){
var MN=D.MN,NA=D.NA,esc=D.esc,heute=D.heute,nf=D.nf;
function secKP(by){var it=by['kpi-zahlen'];if(!it||!it.daten)return NA;var d=it.daten,Y=heute.slice(0,4),cm=heute.slice(0,7),h='';
var vl=(by['kpi-verlauf']&&by['kpi-verlauf'].daten)||{},km=(by['kpi-monate']&&by['kpi-monate'].daten&&by['kpi-monate'].daten.monate)||[];
var eu=function(v){return v==null?'noch keine Daten':nf(v,0)+' €'};
var dy=function(s){return s?String(s).slice(8,10)+'.'+String(s).slice(5,7)+'.'+String(s).slice(0,4):''};
function mSvg(r,ug,lbl,ul,euro){var W=900,H=150,pl=8,pr=8,pt=22,pb=22,bw=(W-pl-pr)/12,vs=[],i,k;
for(i=0;i<12;i++){k=Y+'-'+(i<9?'0':'')+(i+1);vs.push(r&&r[k]!=null?r[k]:null)}
var mx=Math.max.apply(null,vs.filter(function(v){return v!=null}).concat([ug||0,1]))*1.18,Yp=function(v){return pt+(H-pt-pb)*(1-v/mx)};
var o='<svg class="in-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(lbl)+'"><line x1="'+pl+'" y1="'+Yp(0)+'" x2="'+(W-pr)+'" y2="'+Yp(0)+'" stroke="#c9d6d8"/>';
vs.forEach(function(v,i){var x=pl+bw*i+bw*0.2,w=bw*0.6,cx=pl+bw*i+bw/2;
if(v!=null){var y=Yp(v);o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(0,Yp(0)-y)+'" fill="var(--t)" rx="3"/><text x="'+cx+'" y="'+(y-5)+'" text-anchor="middle" font-size="11" font-weight="600">'+nf(v,0)+'</text>'}
o+='<text x="'+cx+'" y="'+(H-6)+'" text-anchor="middle" font-size="10.5" class="m">'+MN[i]+'</text>'});
if(ug!=null){var yu=Yp(ug);o+='<line x1="'+pl+'" y1="'+yu+'" x2="'+(W-pr)+'" y2="'+yu+'" stroke="#b0413e" stroke-width="1.5" stroke-dasharray="5 4"/><text x="'+(W-pr)+'" y="'+(yu-4)+'" text-anchor="end" font-size="11" fill="#b0413e">'+esc((ul||'Untergrenze')+' '+nf(ug,0))+'</text>'}
return o+'</svg>'}
var pc=function(v,s){if(!s)return '';var p=Math.max(0,Math.min(100,Math.round(100*(v||0)/s))),c=p>=100?'#2f8f6b':(p>=60?'#d9a520':'#b0413e');return '<span class="in-pb" role="img" aria-label="'+p+' Prozent"><i style="width:'+p+'%;background:'+c+'"></i></span>'};
var tile=function(big,label,v,ug,ugTxt,sub){return '<div class="in-tile"><b>'+big+'</b><span>'+esc(label)+'</span>'+(ug!=null?pc(v,ug)+'<small class="muted">'+esc(ugTxt)+'</small>':'')+(sub?'<small class="muted">'+esc(sub)+'</small>':'')+'</div>'};
var row=function(t,name,reihe,ug,ul,note){var stale=reihe&&reihe[cm]==null&&note!==false;return '<div class="kp-row">'+t+'<div class="kp-ch"><h3>'+esc(name)+'</h3>'+(reihe?mSvg(reihe,ug,name,ul):'<p class="muted">Verlauf folgt, sobald die monatliche Speicherung läuft.</p>')+(stale?'<small class="kp-old">Für '+esc(MN[+cm.slice(5)-1])+' liegt noch kein Wert vor.</small>':'')+'</div></div>'};
var fw=function(re){var r=null;(d.werte||[]).forEach(function(w){if(!r&&re.test(w.name||''))r=w});return r};
var mo=function(id){var m=null;(d.monatlich||[]).forEach(function(q){if(!m&&q.id===id)m=q});return m};
var mrow=function(id,label){var m=mo(id);if(!m)return '';var v=m.reihe?m.reihe[cm]:null,ug=m.untergrenze;return row(tile(v==null?'noch keine Daten':nf(v,0),label,v,ug,'Untergrenze '+nf(ug||0,0)+' je Monat'),m.name,m.reihe,ug,m.ugLabel)};
var eng={};km.forEach(function(m){eng[m.monat]=((m.flo&&m.flo.engagement)||0)+((m.company&&m.company.engagement)||0)});
var ev=eng[cm],EUG=200;
var um=fw(/umsatz/i),ae=fw(/auftrag/i),bk=fw(/bank/i),g=d.gespraeche,sh=d.stundensatz;
var aeR=vl.ae?vl.ae.reihe:null,bkR=vl.bank?vl.bank.reihe:null;
var css='<style>.kp-d{margin:0 0 14px}.kp-d>summary{cursor:pointer;font-size:1.15rem;font-weight:700;padding:6px 0}.kp-row{display:grid;grid-template-columns:minmax(200px,240px) minmax(0,1fr);gap:14px;align-items:stretch;margin:0 0 12px}.kp-row .in-tile{margin:0;height:100%;box-sizing:border-box}.kp-ch{border:1px solid #dbe5e7;border-radius:10px;padding:8px 12px;min-width:0}.kp-ch h3{margin:0 0 2px;font-size:.95rem}.kp-ch .in-svg{width:100%;height:auto;display:block}.kp-old{color:#b0413e}@media(max-width:700px){.kp-row{grid-template-columns:minmax(0,1fr)}}</style>';
var alt='';
alt+=mrow('events','Netzwerk-Events im laufenden Monat');
alt+=row(tile(ev==null?'noch keine Daten':nf(ev,0),'LinkedIn-Engagement im laufenden Monat (Flo + Company)',ev,EUG,'Untergrenze '+EUG+' je Monat'),'LinkedIn-Engagement je Monat (Flo + Company)',eng,EUG,'Untergrenze');
alt+=mrow('besucher','Einzigartige Website-Besucher im laufenden Monat');
alt+=mrow('newsletter','Newsletter-Abonnent*innen');
alt+=mrow('leads','Leads im laufenden Monat');
alt+=mrow('qualifiziert','Qualifizierte Leads im laufenden Monat');
if(ae)alt+=row(tile(eu(ae.wert),'Gewichteter Auftragseingang',ae.wert,ae.untergrenze,'Untergrenze '+eu(ae.untergrenze),ae.stand?'Stand '+dy(ae.stand):''),'Gewichteter Auftragseingang je Monat in €',aeR,ae.untergrenze,'Untergrenze');
if(bk)alt+=row(tile(eu(bk.wert),'Bankbestand',bk.wert,bk.untergrenze,'Untergrenze '+eu(bk.untergrenze),bk.stand?'Stand '+dy(bk.stand):''),'Bankbestand je Monat in €',bkR,bk.untergrenze,'Untergrenze');
var neu='',umm=mo('umsatz'),ug2=d.ae_jahr&&d.ae_jahr.untergrenze!=null?d.ae_jahr.untergrenze:(ae?ae.untergrenze:null);
if(um)neu+=row(tile(eu(um.wert),'Umsatz im Kalenderjahr',null,null,'',um.stand?'Stand '+dy(um.stand):''),'Umsatz je Monat in €',umm?umm.reihe:null,null);
if(um&&d.ae_jahr){var cum={},s=0,i,k;if(umm&&umm.reihe){for(i=0;i<12;i++){k=Y+'-'+(i<9?'0':'')+(i+1);if(umm.reihe[k]!=null){s+=umm.reihe[k];cum[k]=Math.round(s)}}}
var tot=(um.wert||0)+(d.ae_jahr.wert||0);neu+=row(tile(eu(tot),'Umsatz plus Auftragseingang bis Jahresende',tot,ug2,'Untergrenze '+eu(ug2)),'Umsatz im Jahr kumuliert in €',cum,ug2,'Untergrenze',false)}
if(g)neu+=row(tile(nf(g.wert,0),'Aktive Gespräche',g.wert,g.soll,'Untergrenze '+nf(g.soll,0)+' gleichzeitig'),'Aktive Gespräche',(mo('gespraeche')||{}).reihe,g.soll,'Soll');
if(sh&&sh.stunden)neu+=row(tile(nf(sh.wert,2)+' € je Std.','Stundensatz',null,null,'',nf(sh.stunden,0)+' Std. gemeinsam'),'Stundensatz',null,null);
h=css+'<details class="kp-d" open><summary>KPI (alt)</summary>'+alt+'</details><details class="kp-d" open><summary>KPI (neu)</summary>'+neu+'</details>';
return h}
return secKP;
};
