/* Cockpit-Abschnitt secKP. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secKP=function(D){
var MN=D.MN,NA=D.NA,esc=D.esc,heute=D.heute,nf=D.nf;
function secKP(by){var it=by['kpi-zahlen'];if(!it||!it.daten)return NA;var d=it.daten,Y=heute.slice(0,4),h='';
var eu=function(v){return v==null?'noch keine Daten':nf(v,0)+' €'};
var dy=function(s){return s?String(s).slice(8,10)+'.'+String(s).slice(5,7)+'.'+String(s).slice(0,4):''};
function mSvg(r,ug,lbl,ul){var W=560,H=200,pl=8,pr=8,pt=24,pb=26,bw=(W-pl-pr)/12,vs=[],i,k;
for(i=0;i<12;i++){k=Y+'-'+(i<9?'0':'')+(i+1);vs.push(r&&r[k]!=null?r[k]:null)}
var mx=Math.max.apply(null,vs.filter(function(v){return v!=null}).concat([ug||0,1]))*1.18,Yp=function(v){return pt+(H-pt-pb)*(1-v/mx)};
var o='<svg class="in-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(lbl)+'"><line x1="'+pl+'" y1="'+Yp(0)+'" x2="'+(W-pr)+'" y2="'+Yp(0)+'" stroke="#c9d6d8"/>';
vs.forEach(function(v,i){var x=pl+bw*i+bw*0.15,w=bw*0.7,cx=pl+bw*i+bw/2;
if(v!=null){var y=Yp(v);o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(0,Yp(0)-y)+'" fill="var(--t)" rx="3"/><text x="'+cx+'" y="'+(y-5)+'" text-anchor="middle" font-size="10.5" font-weight="600">'+nf(v,0)+'</text>'}
o+='<text x="'+cx+'" y="'+(H-8)+'" text-anchor="middle" font-size="10" class="m">'+MN[i]+'</text>'});
if(ug!=null){var yu=Yp(ug);o+='<line x1="'+pl+'" y1="'+yu+'" x2="'+(W-pr)+'" y2="'+yu+'" stroke="#b0413e" stroke-width="1.5" stroke-dasharray="5 4"/><text x="'+(W-pr)+'" y="'+(yu-4)+'" text-anchor="end" font-size="10.5" fill="#b0413e">'+esc((ul||'Untergrenze')+' '+nf(ug,0))+'</text>'}
return o+'</svg>'}
var fw=function(re){var r=null;(d.werte||[]).forEach(function(w){if(!r&&re.test(w.name||''))r=w});return r};
var um=fw(/umsatz/i),ae=fw(/auftrag/i),bk=fw(/bank/i),g=d.gespraeche;
var pc=function(v,s){if(!s)return '';var p=Math.max(0,Math.min(100,Math.round(100*(v||0)/s))),c=p>=100?'#2f8f6b':(p>=60?'#d9a520':'#b0413e');return '<span class="in-pb" role="img" aria-label="'+p+' Prozent"><i style="width:'+p+'%;background:'+c+'"></i></span>'};
var tl=function(v,l,ug){return '<div class="in-tile"><b>'+eu(v)+'</b><span>'+esc(l)+'</span>'+(ug!=null?pc(v,ug)+'<small class="muted">Untergrenze '+eu(ug)+'</small>':'')+'</div>'};
var tiles=[];
if(um)tiles.push(tl(um.wert,'Umsatz im Kalenderjahr'));
if(ae)tiles.push(tl(ae.wert,'Rollierender Auftragseingang (gewichtet)',ae.untergrenze));
if(um&&d.ae_jahr)tiles.push(tl((um.wert||0)+(d.ae_jahr.wert||0),'Umsatz plus Auftragseingang bis Jahresende',d.ae_jahr.untergrenze!=null?d.ae_jahr.untergrenze:(ae?ae.untergrenze:null)));
if(bk)tiles.push(tl(bk.wert,'Bankbestand',bk.untergrenze));
if(g)tiles.push('<div class="in-tile"><b>'+nf(g.wert,0)+'</b><span>Aktive Gespräche</span>'+pc(g.wert,g.soll)+'<small class="muted">Untergrenze '+nf(g.soll,0)+' gleichzeitig</small></div>');
var sh=d.stundensatz;if(sh&&sh.stunden)tiles.push('<div class="in-tile"><b>'+nf(sh.wert,2)+' € je Std.</b><span>Stundensatz</span><small class="muted">'+nf(sh.stunden,0)+' Std. gemeinsam</small></div>');var nMain=tiles.length;var cm=heute.slice(0,7);[[/Netzwerk-Events/,'Netzwerk-Events im laufenden Monat'],[/Website-Besucher/,'Einzigartige Website-Besucher im laufenden Monat'],[/Newsletter/,'Newsletter-Abonnent*innen'],[/^Leads$/,'Leads im laufenden Monat'],[/Qualifizierte/,'Qualifizierte Leads im laufenden Monat']].forEach(function(x){var m=null;(d.monatlich||[]).forEach(function(q){if(!m&&x[0].test(q.name||''))m=q});if(!m)return;var v=m.reihe?m.reihe[cm]:null,ug=m.untergrenze;tiles.push('<div class="in-tile"><b>'+(v==null?'noch keine Daten':nf(v,0))+'</b><span>'+esc(x[1])+'</span>'+(ug!=null?pc(v,ug)+'<small class="muted">Untergrenze '+nf(ug,0)+'</small>':'')+'</div>')});
h+='<div class="in-tiles">'+tiles.slice(0,nMain).join('')+'</div><div class="in-tiles" style="margin-top:10px">'+tiles.slice(nMain).join('')+'</div>';
h+='<h2 class="in-h">Verlauf je Monat '+esc(Y)+'</h2><div class="in-grid">'+(d.monatlich||[]).filter(function(m){return !/Bankbestand|Gewichteter Auftragseingang/i.test(m.name||'')}).map(function(m){return '<div class="in-card"><h3>'+esc(m.name)+'</h3>'+mSvg(m.reihe,m.untergrenze,m.name,m.ugLabel)+'</div>'}).join('')+'</div>';
return h}
return secKP;
};
