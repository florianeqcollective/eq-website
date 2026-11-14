/* Cockpit-Abschnitt secPL (Reiter KI-Betrieb): Statusseite. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird.
   Stand 08.11.2026 spaet: Gesamtampel, Komponenten-Ampeln, Fortschritt heute, Braucht dich, Rest eingeklappt. Freigaben und Kosten aus KIDaten/betrieb (daten.freigaben, daten.kosten). */
window.EQIN=window.EQIN||{};
EQIN.secPL=function(D){
var NA=D.NA,berlinNow=D.berlinNow,esc=D.esc,heute=D.heute,hm=D.hm,nf=D.nf,tms=D.tms;
var NAME={blog:'Blog-Entwurf',call_vorbereitung:'Call-Vorbereitung',content:'Redaktionsplan',follower_einladen:'Follower einladen',freigaben:'Freigaben senden',kommentare:'Kommentare',kontakte_abgleich:'Kontakte abgleichen',kpis:'Kennzahlen',lead_puffer:'Lead-Puffer',lernstand:'Lernstand',monat_algorithmus:'Monat: Algorithmus',monat_erfolgsmuster:'Monat: Erfolgsmuster',monat_ki_klang:'Monat: KI-Klang',monat_stimmprofil:'Monat: Stimmprofil',posteingang:'Posteingang',quartal_rueckblick:'Quartal: Rückblick',quartal_stilanalyse:'Quartal: Stilanalyse',vernetzen:'Vernetzen'};
function nm(k){k=String(k||'');return NAME[k]||k.replace(/_/g,' ')}
function dmy(s){s=String(s||'');return s?s.slice(8,10)+'.'+s.slice(5,7)+'.':''}
function kurz(t,n){t=String(t||'');return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,'')+' …':t}
function wann(s,nowB){if(!s)return 'noch nie';var d=s.slice(0,10),h=s.slice(11,16),diff=(tms(nowB)-tms(s.slice(0,16)))/60000;if(diff>=0&&diff<60)return 'vor '+Math.max(1,Math.round(diff))+' Min.';var y=new Date(tms(heute+' 00:00')-864e5).toISOString().slice(0,10);if(d===heute)return 'heute '+h;if(d===y)return 'gestern '+h;return d.slice(8,10)+'.'+d.slice(5,7)+'. '+h}
var CSS='<style>'
+'.in-st{display:flex;flex-direction:column;gap:22px}'
+'.in-st .g{--c:#1f7a4d}.in-st .a{--c:#d9951a}.in-st .r{--c:#cf5f64}.in-st .n{--c:#9aa9ac}'
+'.in-st-d{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--c);flex:none;margin-top:5px}'
+'.in-st-ban{display:flex;align-items:center;gap:18px;flex-wrap:wrap;border:1px solid var(--g);border-left:10px solid var(--c);background:#fff;padding:20px 22px}'
+'.in-st-ban .in-st-d{width:26px;height:26px;margin:0}'
+'.in-st-bt{flex:1 1 260px;min-width:0}.in-st-bt b{display:block;font-size:1.7rem;line-height:1.2;color:var(--c)}.in-st-bt span{color:var(--gm);font-size:14px}'
+'.in-st-ch{display:flex;gap:8px;flex-wrap:wrap}.in-st-ch span{border:1px solid var(--g);border-radius:99px;padding:5px 12px;font-size:13px;white-space:nowrap;background:#fff}.in-st-ch b{font-size:15px}'
+'.in-st-h{font-size:12px;text-transform:uppercase;letter-spacing:.09em;color:var(--gm);font-weight:700;margin:0 0 8px}'
+'.in-st-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:10px}'
+'.in-st-c{border:1px solid #d5e0e2;border-top:4px solid var(--c);background:#fff;padding:11px 13px;min-width:0}'
+'.in-st-c>i{display:block;font-style:normal;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--gm);font-weight:700}'
+'.in-st-c>b{display:flex;gap:8px;align-items:flex-start;font-size:1.05rem;line-height:1.3;margin-top:4px}'
+'.in-st-c>b .in-st-d{margin-top:5px}'
+'.in-st-c>span{display:block;font-size:12px;color:var(--gm);margin-top:3px;overflow-wrap:anywhere}'
+'.in-st-pb{height:14px;background:#e1e8ea;border-radius:7px;overflow:hidden}.in-st-pb i{display:block;height:100%;background:#1f7a4d;border-radius:7px}'
+'.in-st-pbm{height:6px;background:#e1e8ea;border-radius:3px;overflow:hidden;margin-top:5px}.in-st-pbm i{display:block;height:100%;background:var(--t)}'
+'.in-st-cap{display:flex;justify-content:space-between;gap:10px;font-size:13px;margin:6px 0 12px;color:var(--gm)}.in-st-cap b{color:var(--x);font-size:15px}'
+'.in-st-tasks{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px 18px}'
+'.in-st-t{display:flex;gap:9px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--g);min-width:0}'
+'.in-st-t>div{flex:1;min-width:0}.in-st-t b{font-size:14px}.in-st-t small{display:block;font-size:12px;color:var(--gm)}'
+'.in-st-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:14px}'
+'.in-st-box{border:1px solid #d5e0e2;background:#fff;padding:14px 16px;min-width:0}'
+'.in-st-box .in-st-h{display:flex;justify-content:space-between}'
+'.in-st-r{display:flex;gap:9px;align-items:flex-start;padding:9px 0;border-top:1px solid var(--g);min-width:0}'
+'.in-st-r:first-of-type{border-top:0}'
+'.in-st-r>div{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere}'
+'.in-st-r small{color:var(--gm);font-size:12px;margin-right:6px}'
+'.in-st-r details summary{cursor:pointer;list-style:none}.in-st-r details summary::-webkit-details-marker{display:none}'
+'.in-st-r details p{margin:6px 0 0;color:var(--x)}'
+'.in-st-ok{color:var(--gm);font-size:14px;margin:0}'
+'.in-st-fold{border:1px solid var(--g);background:#fff}.in-st-fold>summary{cursor:pointer;padding:11px 16px;font-weight:700;font-size:14px}'
+'.in-st-fold>div{padding:4px 16px 12px;border-top:1px solid var(--g)}'
+'.in-fold{border:1px solid var(--g);background:#fff;margin:22px 0 0}.in-fold>summary{cursor:pointer;padding:12px 16px;font-weight:700;font-size:1.05rem}'
+'.in-fold[open]>summary{border-bottom:1px solid var(--g)}.in-fold>.in-fb{padding:6px 16px 14px}'
+'</style>';
function dot(c){return '<span class="in-st-d '+c+'"></span>'}
function card(c,t,v,s){return '<div class="in-st-c '+c+'"><i>'+esc(t)+'</i><b>'+dot(c)+'<span>'+esc(v)+'</span></b>'+(s?'<span>'+esc(s)+'</span>':'')+'</div>'}
function befundRow(b){var txt=String(b.text||''),hoch=b.schwere==='hoch',c=hoch?'r':'a',d='<small>'+esc(dmy(b.datum))+'</small>';
var body=txt.length>110?'<details><summary>'+d+esc(kurz(txt,110))+'</summary><p>'+esc(txt)+'</p></details>':d+esc(txt);
return '<div class="in-st-r '+c+'">'+dot(c)+'<div>'+body+'</div></div>'}
function secPL(st,bf,tb,bt){var nowB=berlinNow(),hr=parseInt(nowB.slice(11,13),10),dow=new Date(tms(nowB)).getUTCDay(),wt=dow>=1&&dow<=5,sch=null,rows=[];
st.forEach(function(i){if(i._id==='scheduler')sch=i;else if(i.daten&&i.daten.aufgabe)rows.push(i)});
var t=tb&&tb[0]&&tb[0].datum===heute?(tb[0].daten||{}):null,hoch=bf.filter(function(b){return b.schwere==='hoch'}),kenntnis=bf.filter(function(b){return b.schwere!=='hoch'});
var hang=sch&&sch.zustand==='laeuft'&&sch.laeuftSeit&&(tms(nowB)-tms(sch.laeuftSeit)>55*60000);
var fb=bt&&bt.freigaben?bt.freigaben:null,fo=fb?Number(fb.offen)||0:0,fr=fb?Number(fb.freigegeben)||0:0;
var fl0=fb&&Array.isArray(fb.liste)?fb.liste.filter(Boolean):[];
var age=bt&&bt.stand?Math.round((tms(nowB)-tms(String(bt.stand).slice(0,16)))/60000):null;
if(age!=null&&!isFinite(age))age=null;
var lz=sch&&sch.letzterLauf?String(sch.letzterLauf):'';
var cur=rows.filter(function(i){return i.daten.datum===heute}),rest=rows.filter(function(i){return i.daten.datum!==heute});
var done=cur.filter(function(i){return /erledigt|erreicht|voll/.test(i.daten.stand||'')}).length;
/* Gesamtampel */
var ban,bT,bS;
var steuerRot=wt&&bt&&bt.werktag!==false&&age!=null&&age>75,berichtFehlt=wt&&hr>=18&&!t;
if(hang){ban='r';bT='Eine Arbeitsrunde hängt';bS='Seit '+hm(sch.laeuftSeit)+' Uhr ohne Fortschritt.'}
else if(berichtFehlt){ban='r';bT='Tagesbericht fehlt';bS='Die Tagesprüfung sollte nachsehen.'}
else if(steuerRot){ban='r';bT='Die Steuerung meldet sich nicht';bS='Seit '+Math.round(age/60)+' Std. keine Meldung, normal ist stündlich.'}
else if(hoch.length){ban='r';bT=hoch.length===1?'Eine Sache braucht dich':hoch.length+' Sachen brauchen dich';bS='Siehe unten unter Braucht dich.'}
else if(!sch||!sch.letzterLauf){ban='a';bT='Noch nichts gelaufen';bS='Die erste Arbeitsrunde steht noch aus.'}
else{ban='g';bT='Alles läuft';bS='Keine dringenden Punkte.'}
var chips='<div class="in-st-ch"><span><b>'+hoch.length+'</b> dringend</span><span><b>'+done+' von '+cur.length+'</b> Aufgaben heute</span></div>';
var head='<div class="in-st-ban '+ban+'">'+dot(ban)+'<div class="in-st-bt"><b>'+esc(bT)+'</b><span>'+esc(bS)+'</span></div>'+chips+'</div>';
/* Komponenten */
var c1,v1,s1;
if(hang){c1='r';v1='hängt';s1='seit '+hm(sch.laeuftSeit)+' Uhr'}
else if(sch&&sch.zustand==='laeuft'){c1='g';v1='läuft gerade';s1='seit '+hm(sch.laeuftSeit)+' Uhr'}
else if(!lz){c1='n';v1='noch nichts gelaufen';s1=''}
else if(!wt){c1='n';v1='Pause am Wochenende';s1='letzte Runde '+wann(lz,nowB)}
else{c1='g';v1='bereit';s1='letzte Runde '+wann(lz,nowB)}
var c2,v2,s2;
if(age==null){c2='n';v2='keine Meldung';s2=''}
else if(bt.werktag===false||!wt){c2='n';v2='Pause am Wochenende';s2='zuletzt '+(age<60?'vor '+age+' Min.':'vor '+Math.round(age/60)+' Std.')}
else if(age>75){c2='r';v2='meldet sich nicht';s2='zuletzt vor '+Math.round(age/60)+' Std.'}
else{c2='g';v2='aktiv';s2='zuletzt vor '+Math.max(0,age)+' Min.'}
var c3,v3,s3;
if(t){c3='g';v3='liegt vor';s3='von heute'}
else if(!wt){c3='n';v3='kein Werktag';s3=''}
else if(hr>=18){c3='r';v3='fehlt';s3='sollte um 18 Uhr da sein'}
else{c3='n';v3='kommt abends';s3='gegen 18 Uhr'}
var c4=fo?'a':'g',v4=fb?(fo?fo+' warten auf dich':'nichts offen'):'keine Daten',s4=fb?(fr+' bereit zum Senden'+(fb.aelteste?', älteste vom '+dmy(fb.aelteste):'')):'';
if(!fb)c4='n';
var c5=hoch.length?'r':(kenntnis.length?'a':'g'),v5=hoch.length?hoch.length+' dringend':(kenntnis.length?kenntnis.length+' zur Kenntnis':'nichts offen'),s5=hoch.length&&kenntnis.length?'dazu '+kenntnis.length+' zur Kenntnis':'';
var kk=bt&&bt.kosten,kr=kk&&kk.kurs&&kk.kurs.usdEur>0?kk.kurs:null,c6='n',v6=kk&&kk.laeufe?nf(kk.gesamtProzent||0,1)+' % Wochenvolumen (ca. '+nf((kk.gesamtProzent||0)*0.207692,2)+' € netto)':'Messung ab Montag',s6=kk&&kk.laeufe?'und '+(kr?nf((kk.gesamtUsd||0)*kr.usdEur,2)+' € Zukauf':nf(kk.gesamtUsd||0,2)+' USD Zukauf')+', letzte 7 Tage, '+kk.laeufe+' Läufe':'Prozent und Zukauf in Euro';
var grid='<div><p class="in-st-h">Systemstatus</p><div class="in-st-grid">'+card(c1,'Arbeitsrunde',v1,s1)+card(c2,'Steuerung in Wix',v2,s2)+card(c3,'Tagesbericht',v3,s3)+card(c5,'Hinweise',v5,s5)+card(c6,'Kosten',v6,s6)+'</div></div>';
/* Heute */
var pct=cur.length?Math.round(100*done/cur.length):0;
var tasks=cur.map(function(i){var z=i.daten,s=z.stand||'offen',ok=/erledigt|erreicht|voll/.test(s),c=ok?'g':(/pausiert/.test(s)?'r':'a');
var w=z.soll?'<div class="in-st-pbm"><i style="width:'+Math.max(0,Math.min(100,Math.round(100*(z.ist||0)/z.soll)))+'%"></i></div>':'';
return '<div class="in-st-t '+c+'">'+dot(c)+'<div><b>'+esc(nm(z.aufgabe))+'</b><small>'+esc(s)+(z.soll?', '+(z.ist==null?0:z.ist)+' von '+z.soll:'')+(z.minutenHeute?', '+nf(z.minutenHeute,0)+' Min.':'')+'</small>'+w+(z.grund?'<small>'+esc(kurz(z.grund,90))+'</small>':'')+'</div></div>'}).join('');
var restList=rest.length?'<details class="in-st-fold"><summary>'+(cur.length?'Weitere ':'')+rest.length+' Aufgaben, heute nicht dran</summary><div style="line-height:1.9;color:var(--gm);font-size:14px">'+rest.sort(function(a,b){return nm(a.daten.aufgabe)<nm(b.daten.aufgabe)?-1:1}).map(function(i){return esc(nm(i.daten.aufgabe))}).join(' · ')+'</div></details>':'';
var heuteBox='<div><p class="in-st-h">Heute</p>'+(cur.length?'<div class="in-st-pb" role="img" aria-label="'+pct+' Prozent erledigt"><i style="width:'+pct+'%"></i></div><div class="in-st-cap"><span><b>'+done+' von '+cur.length+'</b> Aufgaben erledigt</span><span>'+pct+' %</span></div><div class="in-st-tasks">'+tasks+'</div>':'<p class="in-st-ok">Heute war noch nichts dran.</p>')+'</div>'+restList;
/* Braucht dich */
var hl=hoch.slice(0,5).map(befundRow).join('')+(hoch.length>5?'<p class="muted" style="margin:8px 0 0">und '+(hoch.length-5)+' weitere dringende</p>':'');
var boxA='<div class="in-st-box"><p class="in-st-h"><span>Braucht dich</span><span>'+hoch.length+'</span></p>'+(hoch.length?hl:'<p class="in-st-ok">Nichts Dringendes.</p>')+'</div>';
var fl=fl0.length?fl0.slice(0,5).map(function(f){return '<div class="in-st-r a">'+dot('a')+'<div><small>'+esc(dmy(f.erstellt))+' '+esc(f.art||'Freigabe')+'</small><br>'+esc(kurz(f.titel,110))+'</div></div>'}).join('')+(fo>Math.min(5,fl0.length)?'<p class="muted" style="margin:8px 0 0">und '+(fo-Math.min(5,fl0.length))+' weitere</p>':''):'<p class="in-st-ok">'+(fb?'Nichts offen.':'Noch keine Daten.')+'</p>';
var boxB='<div class="in-st-box"><p class="in-st-h"><span>Freigaben warten</span><span>'+fo+'</span></p>'+fl+'</div>';
var kd=kenntnis.length?'<details class="in-st-fold"><summary>'+kenntnis.length+' Hinweise zur Kenntnis</summary><div>'+kenntnis.map(befundRow).join('')+'</div></details>':'';
return CSS+'<div class="in-st">'+head+grid+heuteBox+'<div class="in-st-two">'+boxA+'</div>'+kd+'</div>'}
return secPL;
};