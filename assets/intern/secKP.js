/* Cockpit-Abschnitt secKP. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secKP=function(D){
var MN=D.MN,NA=D.NA,esc=D.esc,heute=D.heute,nf=D.nf;
function secKP(by){var it=by['kpi-zahlen'];if(!it||!it.daten)return NA;var d=it.daten,Y=heute.slice(0,4),cm=heute.slice(0,7),h='';
var vl=(by['kpi-verlauf']&&by['kpi-verlauf'].daten)||{},km=(by['kpi-monate']&&by['kpi-monate'].daten&&by['kpi-monate'].daten.monate)||[],AMP=vl.ampel||{},EVD=vl.events_detail||{};
var CG='#2f8f6b',CY='#d9a520',CR='#b0413e';
var eu=function(v){return v==null?'noch keine Daten':nf(v,0)+' €'};
var dy=function(s){return s?String(s).slice(8,10)+'.'+String(s).slice(5,7)+'.'+String(s).slice(0,4):''};
var fm=function(v,e){return nf(v,0)+(e?' €':'')};
var amp=function(id,ug){var a=AMP[id];if(a&&a.gruen_ab!=null)return a;if(ug)return {rot_bis:ug*0.6,gruen_ab:ug};return null};
var lvl=function(v,a){if(!a||v==null)return null;return v>=a.gruen_ab?CG:(v>=a.rot_bis?CY:CR)};
function mSvg(r,a,lbl,euro,tips){var W=900,H=150,pl=8,pr=8,pt=22,pb=22,N=10,bw=(W-pl-pr)/N,vs=[],i,k,ks=[],ml=[];
for(i=0;i<N;i++){var dd=new Date(+cm.slice(0,4),+cm.slice(5)-1-(N-1-i),1),mi=dd.getMonth();k=dd.getFullYear()+'-'+(mi<9?'0':'')+(mi+1);ks.push(k);ml.push(MN[mi]+(i===0||mi===0?' '+String(dd.getFullYear()).slice(2):''));vs.push(r&&r[k]!=null?r[k]:null)}
var mx=Math.max.apply(null,vs.filter(function(v){return v!=null}).concat([a?a.gruen_ab:0,1]))*1.18,Yp=function(v){return pt+(H-pt-pb)*(1-v/mx)};
var o='<svg class="in-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(lbl)+'">';
if(a){var y0=Yp(0),yr=Yp(a.rot_bis),yg=Yp(a.gruen_ab),yt=Yp(mx);
o+='<rect x="'+pl+'" y="'+yr+'" width="'+(W-pl-pr)+'" height="'+(y0-yr)+'" fill="'+CR+'" opacity=".13"/><rect x="'+pl+'" y="'+yg+'" width="'+(W-pl-pr)+'" height="'+(yr-yg)+'" fill="'+CY+'" opacity=".16"/><rect x="'+pl+'" y="'+yt+'" width="'+(W-pl-pr)+'" height="'+(yg-yt)+'" fill="'+CG+'" opacity=".13"/>'}
o+='<line x1="'+pl+'" y1="'+Yp(0)+'" x2="'+(W-pr)+'" y2="'+Yp(0)+'" stroke="#c9d6d8"/>';
vs.forEach(function(v,i){var x=pl+bw*i+bw*0.2,w=bw*0.6,cx=pl+bw*i+bw/2,tp=(tips&&tips[ks[i]])||(v!=null?ml[i]+': '+fm(v,euro):ml[i]+': keine Daten');
o+='<g><title>'+esc(tp)+'</title><rect x="'+(pl+bw*i)+'" y="0" width="'+bw+'" height="'+H+'" fill="transparent"/>';
if(v!=null){var y=Yp(v);o+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(0,Yp(0)-y)+'" fill="var(--t)" rx="3"/><text x="'+cx+'" y="'+(y-5)+'" text-anchor="middle" font-size="11" font-weight="600">'+nf(v,0)+'</text>'}
o+='<text x="'+cx+'" y="'+(H-6)+'" text-anchor="middle" font-size="10.5" class="m">'+ml[i]+'</text></g>'});
return o+'</svg>'}
var legend=function(a,euro){if(!a)return '';return '<div class="kp-lg"><i style="background:'+CG+'"></i>Grün ab '+fm(a.gruen_ab,euro)+' <i style="background:'+CY+'"></i>Gelb ab '+fm(a.rot_bis,euro)+' <i style="background:'+CR+'"></i>darunter Rot'+(a.vorschlag?' <span class="kp-vs">(Vorschlag)</span>':'')+'</div>'};
var tile=function(big,label,v,a,sub){var c=lvl(v,a),p=a&&v!=null?Math.max(0,Math.min(100,Math.round(100*v/a.gruen_ab))):null;
return '<div class="in-tile"'+(c?' style="border-left:6px solid '+c+'"':'')+'><b>'+big+'</b><span>'+esc(label)+'</span>'+(p!=null?'<span class="in-pb" role="img" aria-label="'+p+' Prozent"><i style="width:'+p+'%;background:'+c+'"></i></span>':'')+(sub?'<small class="muted">'+esc(sub)+'</small>':'')+'</div>'};
var row=function(t,name,reihe,a,euro,tips,note){var stale=reihe&&reihe[cm]==null&&note!==false;return '<div class="kp-row">'+t+'<div class="kp-ch"><h3>'+esc(name)+'</h3>'+legend(a,euro)+(reihe?mSvg(reihe,a,name,euro,tips):'<p class="muted">Verlauf folgt, sobald die monatliche Speicherung läuft.</p>')+(stale?'<small class="kp-old">Für '+esc(MN[+cm.slice(5)-1])+' liegt noch kein Wert vor.</small>':'')+'</div></div>'};
var lastv=function(r){var k=null;if(r)Object.keys(r).sort().forEach(function(x){if(x<=cm&&r[x]!=null)k=x});return k};
var shown=function(r,label){var k=lastv(r);if(k==null)return {v:null,label:label};if(k===cm)return {v:r[k],label:label};return {v:r[k],label:label.replace(' im laufenden Monat','')+' (zuletzt '+MN[+k.slice(5)-1]+')'}};
var fw=function(re){var r=null;(d.werte||[]).forEach(function(w){if(!r&&re.test(w.name||''))r=w});return r};
var mo=function(id){var m=null;(d.monatlich||[]).forEach(function(q){if(!m&&q.id===id)m=q});return m};
var mrow=function(id,label,tips){var m=mo(id);if(!m)return '';var sh0=shown(m.reihe,label),v=sh0.v,a=amp(id,m.untergrenze);return row(tile(v==null?'noch keine Daten':nf(v,0),sh0.label,v,a,''),m.name,m.reihe,a,false,tips)};
var eng={},etip={};km.forEach(function(m){var f=(m.flo&&m.flo.engagement)||0,c=(m.company&&m.company.engagement)||0,z=(m.franzi&&m.franzi.engagement)||0;eng[m.monat]=f+c+z;var i=+m.monat.slice(5)-1;etip[m.monat]=MN[i]+': '+(f+c+z)+' (Flo '+f+', Franzi '+(m.franzi?z:'k. A.')+', Company '+c+')'});
var ev=eng[cm],aE=amp('engagement',200);
var tipEv={};(d.monatlich||[]).forEach(function(q){if(q.id==='events'&&q.reihe)Object.keys(q.reihe).forEach(function(k){var l=EVD[k],i=+k.slice(5)-1,t=MN[i]+': '+q.reihe[k]+' Events';if(l&&l.length){t+='\n'+l.map(function(e){return e.d+' '+e.t+' ('+(e.w||[]).join(', ')+')'}).join('\n');if(l.length<q.reihe[k])t+='\n(Liste unvollständig, Zahl aus der alten KPI-Tabelle)'}else t+='\n(keine Einzelliste, Zahl aus der alten KPI-Tabelle)';tipEv[k]=t})});
var um=fw(/umsatz/i),ae=fw(/auftrag/i),bk=fw(/bank/i),g=d.gespraeche,sh=d.stundensatz;
var aeR=vl.ae?vl.ae.reihe:null,bkR=vl.bank?vl.bank.reihe:null;
var css='<style>.kp-d{margin:0 0 14px}.kp-d>summary{cursor:pointer;font-size:1.15rem;font-weight:700;padding:6px 0}.kp-row{display:grid;grid-template-columns:minmax(220px,260px) minmax(0,1fr);gap:14px;align-items:stretch;margin:0 0 12px}.kp-row .in-tile{margin:0;height:100%;box-sizing:border-box}.kp-row .in-tile>span:not(.in-pb){display:block;font-size:1.05rem;font-weight:600;line-height:1.3;margin-top:4px}.kp-row .in-tile small{display:block;font-size:.88rem;margin-top:4px}.kp-ch{border:1px solid #dbe5e7;border-radius:10px;padding:8px 12px;min-width:0}.kp-ch h3{margin:0 0 2px;font-size:1rem}.kp-ch .in-svg{width:100%;height:auto;display:block}.kp-lg{font-size:.85rem;margin:0 0 2px;color:#4a5a5e}.kp-lg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 4px 0 10px;vertical-align:-1px}.kp-lg i:first-child{margin-left:0}.kp-vs{font-style:italic}.kp-old{color:#b0413e}@media(max-width:700px){.kp-row{grid-template-columns:minmax(0,1fr)}}</style>';
var alt='';
alt+=mrow('events','Netzwerk-Events im laufenden Monat',tipEv);
var se=shown(eng,'LinkedIn-Engagement im laufenden Monat (Flo, Franzi, Company)');alt+=row(tile(se.v==null?'noch keine Daten':nf(se.v,0),se.label,se.v,aE,''),'LinkedIn-Engagement je Monat (Flo, Franzi, Company)',eng,aE,false,etip);
alt+=mrow('besucher','Einzigartige Website-Besucher im laufenden Monat');
alt+=mrow('newsletter','Newsletter-Abonnent*innen');
alt+=mrow('leads','Leads im laufenden Monat');
alt+=mrow('qualifiziert','Qualifizierte Leads im laufenden Monat');
if(ae){var a1=amp('ae',ae.untergrenze);alt+=row(tile(eu(ae.wert),'Gewichteter Auftragseingang',ae.wert,a1,ae.stand?'Stand '+dy(ae.stand):''),'Gewichteter Auftragseingang je Monat in €',aeR,a1,true)}
if(bk){var a2=amp('bank',bk.untergrenze);alt+=row(tile(eu(bk.wert),'Bankbestand',bk.wert,a2,bk.stand?'Stand '+dy(bk.stand):''),'Bankbestand je Monat in €',bkR,a2,true)}
var neu='',umm=mo('umsatz'),ug2=d.ae_jahr&&d.ae_jahr.untergrenze!=null?d.ae_jahr.untergrenze:(ae?ae.untergrenze:null);
if(um){var a3=amp('umsatz',null);neu+=row(tile(eu(um.wert),'Umsatz im Kalenderjahr',null,null,um.stand?'Stand '+dy(um.stand):''),'Umsatz je Monat in €',umm?umm.reihe:null,a3,true)}
if(um&&d.ae_jahr){var cum={},s=0,i,k;if(umm&&umm.reihe){var yy=null;Object.keys(umm.reihe).sort().forEach(function(k){if(k.slice(0,4)!==yy){yy=k.slice(0,4);s=0}if(umm.reihe[k]!=null){s+=umm.reihe[k];cum[k]=Math.round(s)}})}
var a4=amp('umsatzkum',ug2),tot=(um.wert||0)+(d.ae_jahr.wert||0);neu+=row(tile(eu(tot),'Umsatz plus Auftragseingang bis Jahresende',tot,a4,''),'Umsatz im Jahr kumuliert in €',cum,a4,true,null,false)}
if(g){var a5=amp('gespraeche',g.soll);neu+=row(tile(nf(g.wert,0),'Aktive Gespräche',g.wert,a5,'Soll '+nf(g.soll,0)+' gleichzeitig'),'Aktive Gespräche',(mo('gespraeche')||{}).reihe,a5,false)}
if(sh&&sh.stunden){var a6=amp('stundensatz',null);neu+=row(tile(nf(sh.wert,2)+' € je Std.','Stundensatz',sh.wert,a6,nf(sh.stunden,0)+' Std. gemeinsam'),'Stundensatz',null,a6,true)}
h=css+'<details class="kp-d" open><summary>KPI (alt)</summary>'+alt+'</details><details class="kp-d" open><summary>KPI (neu)</summary>'+neu+'</details>';
return h}
return secKP;
};
