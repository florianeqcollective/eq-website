/* Cockpit-Abschnitt secV. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secV=function(D){
var NA=D.NA,byId=D.byId;
function secV(by){
var F=by['funnel'],S=by['soll'],LSt=by['lead-stand'],AU=by['aufwand'];
if(!F||!F.daten)return NA;
EQIN.vBy=by;var M30=(EQIN.vMode||(function(){try{return localStorage.getItem('eq_v_mode')}catch(e){return null}})())==='30';
var d=F.daten,hw=d.hauptweg||[],gw=d.geburtstagsweg||[],rw=d.reaktionsweg||[],vs=d.vorstufe||null,sd=(S&&S.daten)||{},sq=sd.quoten||{};
var es=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')};
var num=function(n,dd){return n==null?'–':Number(n).toLocaleString('de-DE',{maximumFractionDigits:dd==null?0:dd})};
var pz=function(x){return Math.round(x*100)+' %'};
var gv=function(list,id){var x=byId(list,id);if(!x)return null;var v=(M30&&x.wert30!=null)?x.wert30:x.wert;return v!=null?Number(v):null};var gvT=function(list,id){var x=byId(list,id);return x&&x.wert!=null?Number(x.wert):null};var vw=vs?((M30&&vs.wert30!=null)?vs.wert30:vs.wert):null,vab=vs?((M30&&vs.abgelehnt30!=null)?vs.abgelehnt30:vs.abgelehnt):null;
var cmp=function(a,s){return s==null?'':(a<s?'lo':'hi')};
var row=function(r,max){var w=r.z!=null&&max?Math.max(3,Math.round(100*r.z/max)):3;
return '<button type="button" class="in-v-r"><span class="in-v-n">'+es(r.n)+'</span><span class="in-v-bw"><i style="width:'+w+'%"></i></span><span class="in-v-z">'+num(r.z)+'</span><span class="in-v-q '+(r.c||'')+'">'+(r.q||'–')+'</span></button><div class="in-v-w" hidden>'+es(r.e)+'</div>'};
var card=function(title,L){var mx=0;L.forEach(function(r){if(r.z!=null&&r.z>mx)mx=r.z});return '<div class="in-card"><h3>'+es(title)+'</h3>'+L.map(function(r){return row(r,mx)}).join('')+'</div>'};
var an=gv(hw,'anfragen'),ag=gv(hw,'angenommen'),au=gv(hw,'aufgewaermt'),ns=gv(hw,'nachricht'),ant=gv(hw,'antwort'),nfa=gv(hw,'nachfassen'),ca=gv(hw,'call_angebot'),cl=gv(hw,'call'),ao=gv(hw,'angebot'),at=gv(hw,'auftrag');
var anT=gvT(hw,'anfragen'),agT=gvT(hw,'angenommen'),nsT=gvT(hw,'nachricht'),antT=gvT(hw,'antwort'),caT=gvT(hw,'call_angebot'),clT=gvT(hw,'call');
var H=[];
if(vs&&vw){var okc=vw-(vab||0);H.push({n:'Kandidaten mit erfüllten Kriterien',z:okc,q:'<b>'+pz(okc/vw)+'</b> von '+num(vw),e:'Von '+num(vw)+' geprüften Kandidaten erfüllen '+num(okc)+' unsere Kriterien. Der Gegentest, ob die Auswahl stimmt, ist die Annahmequote darunter.'})}
if(an&&ag!=null)H.push({n:'Angenommene Anfrage',z:ag,q:'<b>'+pz(ag/an)+'</b>'+(sq.annahme!=null?' Soll '+pz(sq.annahme):''),c:cmp(ag/an,sq.annahme),e:num(ag)+' von '+num(an)+' Anfragen angenommen'+(sq.annahme!=null?', Soll '+pz(sq.annahme):'')+'. Rund '+num(an-ag)+' Anfragen sind noch offen oder unbeantwortet, die Quote kann also noch steigen.'});
if(au!=null)H.push({n:'Aufgewärmte Kontakte',z:au,e:'Aufwärmen mit Kommentar oder Like vor dem Opener. Die Wirkung zeigt sich in der Antwortquote auf den Opener.'});
if(ant!=null&&ag)H.push({n:'Antwort nach Opener',z:ant,q:'<b>'+pz(ant/ag)+'</b>'+(sq.opener_antwort_von_angenommen!=null?' Soll '+pz(sq.opener_antwort_von_angenommen):''),c:cmp(ant/ag,sq.opener_antwort_von_angenommen),e:num(ant)+' Antworten auf '+num(ns)+' gesendete Opener, das sind '+pz(ant/ag)+' der Angenommenen. Gemessen wird je Variante, Anrede, Blog-Link und Aufwärm-Art, ein Vergleich zählt ab 20 Fällen je Gruppe.'});
if(nfa!=null)H.push({n:'Nachfassen nach Opener',z:nfa,e:'Nachfassen 1 und 2 gesendet. Ausgewertet wird je Stufe und mit oder ohne Blog-Link, ab 20 Fällen je Gruppe.'});
if(ca!=null)H.push({n:'Call-Angebot nach Antwort',z:ca,q:'<b>'+num(ca)+' von '+num(ant)+'</b>',e:'Von '+num(ant)+' Antworten wurde in '+num(ca)+' Fällen ein Call angeboten. Gemessen werden Quote und Tage bis zum Call-Angebot.'});
if(cl!=null)H.push({n:'Gebuchter Call nach Angebot',z:cl,e:'Gebuchte Calls seit Start: '+num(cl)+'. Gemessen wird die Quote von Call angeboten bis gebucht und die Zeit bis zur Buchung.'});
var cf=gv(hw,'coffee'),di=gv(hw,'discovery');
if(cf!=null)H.push({n:'Gebuchter Coffee Call',z:cf,e:'Coffee Calls seit Start: '+num(cf)+'. Der Coffee Call ist meist die Vorstufe zum Discovery Call, er senkt die Hürde und qualifiziert den Lead. Er ist keine feste Stufe, wer gleich einen Discovery Call bucht, überspringt ihn. Gezählt wird aus dem Kalender.'});
if(di!=null)H.push({n:'Gebuchter Discovery Call',z:di,q:cf?'<b>'+num(di)+' von '+num(cf)+'</b> Coffee Calls':'–',e:'Discovery Calls seit Start: '+num(di)+', mit oder ohne vorherigen Coffee Call. Gemessen wird die Quote von Coffee Call zu Discovery Call. Die Abschlussquote im Discovery Call ist höher als die im ersten Gespräch.'});
if(ao!=null)H.push({n:'Angebot nach Call',z:ao,e:'Erstellte Angebote seit Start: '+num(ao)+'. Gemessen wird die Quote von Call bis Angebot, bei Nein mit Grund.'});
if(at!=null)H.push({n:'Auftrag nach Angebot',z:at,e:'Aufträge seit Start: '+num(at)+'. Gemessen wird die Quote von Angebot bis Auftrag, bei Absage mit Grund.'});
var gr=gv(gw,'gruss'),ga=gv(gw,'gruss_antwort'),gl=gv(gw,'gruss_anlass'),oe=gv(gw,'opener_gesendet'),oa=gv(gw,'opener_antwort');
var G=[];
if(gr&&ga!=null)G.push({n:'Antwort auf Gruß',z:ga,q:'<b>'+pz(ga/gr)+'</b>'+(sq.gruss_antwort!=null?' Soll '+pz(sq.gruss_antwort):''),c:cmp(ga/gr,sq.gruss_antwort),e:num(ga)+' von '+num(gr)+' Grüßen beantwortet. Dank, Emoji oder Like zählen als Kontakt, nicht als Lead. Der Lead entsteht erst mit der Antwort auf den Opener.'});
if(oe!=null)G.push({n:'Antwort nach Opener',z:oa,q:'<b>'+num(oa)+' von '+num(oe)+'</b>',e:num(oe)+' Opener nach einem Gruß gesendet, '+num(oa)+' Antworten darauf.'});
var R=[];
var rl=gv(rw,'reaktion_lead'),kaw=gv(rw,'kommentar_antwort'),rlT=gvT(rw,'reaktion_lead');
R.push({n:'Neuer Kontakt nach Reaktion',z:rl,e:'Neue Kontakte aus Reaktionen und Kommentaren unter unseren Beiträgen: '+num(rl)+'. Die Beitrags-Schleife misst Reichweite, hier wird gemessen, was daraus für den Vertrieb folgt.'});
R.push({n:'Antwort des Autors nach Kommentar',z:kaw,e:'Kommentare von uns unter fremden Beiträgen, auf die der Autor geantwortet hat: '+num(kaw)+'.'});
var st=LSt&&LSt.daten&&byId(LSt.daten.stufen,'antwort');
var A=(AU&&AU.daten&&AU.daten.tage)||[];A=A.slice(-8);
var EURr=Number((by['ziel']&&by['ziel'].daten&&by['ziel'].daten.usd_zu_eur)||0);
var cost=function(key){if(A.length<2||!EURr)return null;var a=A[0],b=A[A.length-1],dk=(b[key]||0)-(a[key]||0);if(!(dk>0))return null;var m=0,ok=0;for(var i=1;i<A.length;i++){if(A[i].usd_laeufe!=null){m+=Number(A[i].usd_laeufe)||0;ok++}}if(!ok)return null;return {m:m/dk*EURr,dk:dk,n:A.length-1}};
var NUe=(by['nutzung-je-tag']&&by['nutzung-je-tag'].daten&&by['nutzung-je-tag'].daten.eintraege)||[];
var usdS=0,usdN=0;var vF=(M30&&d.fenster30)?d.fenster30.von:null;NUe.forEach(function(e){if(vF&&String(e.bis||e.von||'')<vF)return;var k=e.kosten_usd!=null?e.kosten_usd:e.guthaben_usd;if(k!=null){usdS+=Number(k)||0;usdN++}});
var eurS=EURr?usdS*EURr:null,kont=(ag||0)+(rl||0),leadn=(ant||0)+(oa||0);
var ck=(eurS!=null&&usdN>0&&kont>0)?{m:eurS/kont,dk:kont,n:usdN}:null,cle=(eurS!=null&&usdN>0&&leadn>0)?{m:eurS/leadn,dk:leadn,n:usdN}:null;
var ckv=ck?num(ck.m,2)+' €':'–',clv=cle?num(cle.m,2)+' €':'–';
var cbase='Grundlage ist der Verbrauch aus dem Reiter KI-Betrieb '+(M30?'in den letzten 30 Tagen':'seit Beginn der Messung')+', Wochenvolumen in Euro umgerechnet plus Guthaben-Verbrauch: '+num(usdS,2)+' US-Dollar, umgerechnet '+num(eurS||0,2)+' Euro (1 US-Dollar = '+num(EURr,2)+' Euro). Das ist grob: der Verbrauch enthält auch Flos eigene Nutzung und Zeiträume ohne Einzelmessung. Neue Messwerte laufen täglich dazu und machen die Zahl mit der Zeit genauer.';
var ckt=ck?'Euro je neuen Kontakt auf LinkedIn: '+num(ck.dk)+' neue Kontakte seit Start (angenommene Anfragen und neue Kontakte aus Reaktionen). '+cbase:'Noch nicht berechenbar, es fehlen Kosten oder neue Kontakte. '+cbase;
var clt=cle?'Euro je neuen Lead auf LinkedIn: '+num(cle.dk)+' Antworten auf einen Opener seit Start. Nach der Definition ist ein Lead eine Antwort mit eindeutigem Interesse am Thema, ein Dank oder Emoji zählt nicht. Gezählt wird bisher jede Antwort, die Zahl der Leads ist damit eher zu hoch und der Wert eher zu niedrig. '+cbase:'Noch nicht berechenbar, es fehlen Kosten oder Antworten auf einen Opener. '+cbase;
var Z=by['ziel'],zd=(Z&&Z.daten)||null,ZLW=null,ZDW=null,DQ=1,zr2=null,zw=46,zk=10000,zrk=0,zneed=0,zs=null,zr=null;
var zpe=function(v){return Number(v*100).toLocaleString('de-DE',{maximumFractionDigits:1})+' %'};
if(zd&&zd.stufen&&zd.real){
zw=zd.wochen||46;zs=zd.stufen;zk=zd.kundenwert||10000;zr=zd.real;
var zan=(zd.anfragen_pro_woche||100)*zw,zgb=(zd.geburtstage_calls_pro_woche||0)*zw;
zrk=zr.calls*zr.abschluss;zneed=zd.umsatz_ziel/zk;
var zf=function(k){var a=Math.min(zs.annahme*k,1),o=Math.min(zs.antwort*k,1),c=Math.min(zs.coffee*k,1),cd=Math.min(zs.discovery*k,1),da=Math.min(zs.auftrag*k,1),cof=zan*a*o*c+zgb*k*k;return {cof:cof,dis:cof*cd,kun:cof*cd*da,q:[a,o,c,cd,da]}};
var zx=1,zlo=1,zhi=3,zi=0;
if(zf(1).kun<zneed){for(zi=0;zi<60;zi++){zx=(zlo+zhi)/2;if(zf(zx).kun<zneed)zlo=zx;else zhi=zx}zx=zhi}
zr2=zf(zx);ZLW=zr2.cof/zw;ZDW=zr2.dis/zw;DQ=zs.discovery;
}
var ex=sd.erwartung_calls_pro_woche||{},zl=ZDW||1,MIN=20;
var gr=gv(gw,'gruss'),gga=gv(gw,'gruss_antwort'),grT=gvT(gw,'gruss'),ggaT=gvT(gw,'gruss_antwort'),oaT=gvT(gw,'opener_antwort');
var Q=[];
var pick=function(name,meas,n,soll,unit){var ok=meas!=null&&n!=null&&n>=MIN&&isFinite(meas);Q.push({n:name,v:ok?meas:soll,m:ok,s:soll,c:n,u:unit});return ok?meas:soll};
var qa=pick('Annahme der Anfrage',anT?agT/anT:null,anT,sq.annahme,'Anfragen');
var qo=pick('Antwort auf Opener (je angenommenem Kontakt)',agT?antT/agT:null,nsT,sq.opener_antwort_von_angenommen,'Opener');
var qc=pick('Call-Angebot nach Antwort',antT?caT/antT:null,antT,sq.call_von_antwort,'Antworten');
var qg=pick('Antwort auf Geburtstagsgruß',grT?ggaT/grT:null,grT,sq.gruss_antwort,'Grüße');
var ev=null;if(sd.anfragen_pro_woche&&qa!=null&&qo!=null&&qc!=null){ev=sd.anfragen_pro_woche*qa*qo*qc;if(ex.geburtstage!=null)ev+=ex.geburtstage*(sq.gruss_antwort&&qg!=null?qg/sq.gruss_antwort:1)*(sq.call_von_antwort&&qc!=null?qc/sq.call_von_antwort:1)}
var evc=ev;if(ev!=null)ev=ev*DQ;
var nm=Q.filter(function(q){return q.m}).length;
var evt=ev!=null?'Hochgerechnet mit den Quoten, die wir real erreichen, bei '+num(sd.anfragen_pro_woche)+' Anfragen und '+num(sd.gruesse_pro_woche)+' Grüßen pro Woche. Eine Quote gilt als gemessen, sobald mindestens '+MIN+' Fälle vorliegen, davor steht der Erwartungswert aus Studien und Branchenzahlen. Erwartet sind '+num(ev,2)+' Discovery Calls pro Woche, ausgehend von '+num(evc,2)+' Coffee Calls, von denen wir '+pz(DQ)+' als Discovery Call ansetzen (Schätzung). Ziel '+num(zl,2)+'. Jetzt gemessen: '+nm+' von '+Q.length+'. '+(ev!=null&&qc?'Dafür braucht es rund '+num(evc/qc,0)+' neue Gespräche pro Woche. ':'')+Q.map(function(q){return q.n+': '+pz(q.v)+(q.m?' gemessen ('+num(q.c)+' '+q.u+')':' Erwartung, bisher '+num(q.c||0)+' von '+MIN+' '+q.u)}).join('; ')+'. Gebucht sind seit Start '+num(clT)+'. Das Ziel von '+num(zl,2)+' Discovery Calls pro Woche folgt aus dem Jahresziel.':'Noch keine Erwartung berechnet.';
var kpa=Number((by['kontaktpflege']&&by['kontaktpflege'].daten&&by['kontaktpflege'].daten.aktiv)||0);
var tiles='<div class="in-v-tiles"><button type="button" class="in-v-t" data-w="t1"><em class="in-v-tt">Aktive Gespräche</em><b>'+((st||kpa)?num((st?Number(st.wert):0)+kpa):'–')+'</b><span>LinkedIn und Kontakte</span></button><button type="button" class="in-v-t" data-w="t2"><em class="in-v-tt">LinkedIn: Aufwand je Kontakt</em><b>'+ckv+'</b><span>Token-Kosten je neuer Kontakt</span></button><button type="button" class="in-v-t" data-w="t3"><em class="in-v-tt">LinkedIn: Aufwand je Lead</em><b>'+clv+'</b><span>Token-Kosten je neuer Lead</span></button><button type="button" class="in-v-t" data-w="t4"><em class="in-v-tt">Erwartete Discovery Calls</em><b>'+(ev!=null?num(ev,2):'–')+' <small>von '+num(zl,2)+'</small></b><i class="in-v-gb"><u style="width:'+(ev!=null?Math.min(100,Math.round(100*ev/zl)):0)+'%"></u></i><span>'+(ev>0?'Das entspricht einem Gespräch alle '+num(5/ev,0)+' Werktage / '+num(1/ev,1)+' Wochen':'–')+'</span></button></div>';
var tw='<div class="in-v-tw" data-w="t1" hidden>Zusammen '+num((st?Number(st.wert):0)+kpa)+' aktive Gespräche. LinkedIn: '+num(st?Number(st.wert):0)+' Personen, die geantwortet haben und noch nicht beim Call oder ausgeschieden sind (Status Antwort erhalten, ohne Bewegung in 30 Tagen scheidet ein Gespräch durch Timeout aus). Kontakte: '+num(kpa)+' Kontakte in aktiver Pflege, also Kontakte mit dem Label persönliches Netzwerk in Wix, die wir regelmäßig ansprechen.</div><div class="in-v-tw" data-w="t2" hidden>'+es(ckt)+'</div><div class="in-v-tw" data-w="t3" hidden>'+es(clt)+'</div><div class="in-v-tw" data-w="t4" hidden>'+es(evt)+'</div>';
var KP=by['kontaktpflege'],kd=(KP&&KP.daten)||null,RW=[];
if(kd&&kd.gesamt!=null){var ks=kd.status||{},kg=kd.gesamt,kl=(ks.lead||0)+(ks.qualifizierter_lead||0)+(ks.kunde||0),kq=(ks.qualifizierter_lead||0)+(ks.kunde||0),kk=ks.kunde||0;
RW.push({n:'Kontakte in aktiver Pflege',z:kd.aktiv,e:'Kontakte mit der Quelle persönliches Netzwerk. Das sind die Menschen aus der To-Do-Liste Kontakte und Leads, die Flo regelmäßig anspricht. Der Wochenabgleich legt sie in Wix an, gezählt wird in Wix.'});
RW.push({n:'Kontakte insgesamt',z:kg,e:'Alle Kontakte in Wix mit der Quelle persönliches Netzwerk, Event oder Empfehlung, egal wer sie pflegt. Stand '+es(kd.stand||'')+'.'});
RW.push({n:'Lead',z:kl,q:kg?'<b>'+pz(kl/kg)+'</b> der Kontakte':'–',e:'Kontakte mit dem Label Lead, Qualifizierter Lead oder Kunde. Ein Lead hat auf eine Nachricht geantwortet und zeigt eindeutig Interesse.'});
RW.push({n:'Qualifizierter Lead',z:kq,q:kl?'<b>'+pz(kq/kl)+'</b> der Leads':'–',e:'Persönliche Beziehung, konkretes Interesse, BANT-C passt und ist bekannt. Gezählt werden Qualifizierter Lead und Kunde.'});
RW.push({n:'Kunde',z:kk,q:kq?'<b>'+pz(kk/kq)+'</b>':'–',e:'Kontakte mit dem Label Kunde.'});
RW.push({n:'Lost Lead',z:ks.lost_lead||0,e:'Kontakte mit dem Label Lost Lead, nur von Hand gesetzt. Der Funnel in Wix wird gerade umgebaut, die Stufen kommen dann hier an.'})}
else{RW.push({n:'Wird gezählt',z:null,e:'Der Eintrag kontaktpflege liegt noch nicht vor.'})}
var NE=by['netzwerk-events'],nev=(NE&&NE.daten&&NE.daten.events)||[],nsum=function(k){return nev.reduce(function(s,e){return s+(Number(e[k])||0)},0)};
RW.unshift({n:'Geplante Netzwerkevents',z:nev.length,q:nev.length?'<b>'+num(nsum('kontakte'))+'</b> neue Kontakte':'–',e:nev.length?(num(nev.length)+' geplante Events, '+num(nsum('kontakte'))+' neue Kontakte, '+num(nsum('gespraeche'))+' Folgegespräche, '+num(nsum('calls'))+' Discovery Calls, '+num(nsum('auftraege'))+' Aufträge. Je Event zählen Datum, Name, Ort, neue Kontakte, Folgegespräche, Calls und Aufträge.'):'Geplante Events, die später aus den Kalendern eingelesen werden. Bisher ist nichts eingetragen. Je Event zählen Datum, Name, Ort, neue Kontakte, Folgegespräche, Calls und Aufträge.'});
var ZC='';
if(zr2){
var zset=function(nm,txt,cls,ex){H.forEach(function(r){if(r.n===nm){r.q=txt;r.c=cls||'';if(ex)r.e=r.e+' '+ex}})};
var zsoll=function(a,b,s){return (a!=null&&b)?'<b>'+pz(a/b)+'</b> Soll '+zpe(s):'Soll '+zpe(s)};
var zcl=function(a,b,s){return (a!=null&&b)?cmp(a/b,s):''};
zset('Angenommene Anfrage',zsoll(ag,an,zr2.q[0]),zcl(ag,an,zr2.q[0]));
zset('Antwort nach Opener',zsoll(ant,ag,zr2.q[1]),zcl(ant,ag,zr2.q[1]));
zset('Gebuchter Coffee Call',zsoll(cf!=null?cf:cl,ant,zr2.q[2]),zcl(cf!=null?cf:cl,ant,zr2.q[2]));
zset('Gebuchter Discovery Call',zsoll(di,cf,zr2.q[3]),zcl(di,cf,zr2.q[3]),'Soll auf das Jahresziel hochgerechnet. Ausgangswert ist eine Schätzung ('+zpe(zs.discovery)+'), bis Messwerte da sind.');
zset('Auftrag nach Angebot','Soll '+zpe(zr2.q[4])+' je Discovery Call','','Soll auf das Jahresziel hochgerechnet. Ausgangswert ist eine Schätzung ('+zpe(zs.auftrag)+' je Discovery Call), bis Messwerte da sind.');
ZC='<div style="margin:0 0 12px"><button type="button" class="in-v-r"><span class="in-v-n">Ziel '+es(zd.jahr||'')+': '+num(zd.umsatz_ziel)+' € Umsatz über LinkedIn = '+num(zd.umsatz_ziel/zk,1)+' Kunden, andere Wege zählen nicht</span></button><div class="in-v-w" hidden>'+es('Bei '+num(zk)+' € je Kunde. Alle '+num(zneed,1)+' Kunden kommen aus Kontaktanfragen, Geburtstagsweg und Reaktionen bei LinkedIn. Kunden aus Calls im persönlichen Netzwerk ('+num(zrk,1)+' aus '+num(zr.calls)+' Calls im Jahr) zählen dafür nicht mit. Dafür brauchen wir etwa '+num(zr2.cof/zw,2)+' Coffee Calls und '+num(zr2.dis/zw,2)+' Discovery Calls je Woche bei '+num(zd.anfragen_pro_woche)+' Anfragen pro Woche und '+num(zw)+' Wochen. Die Soll-Werte in den Stufen sind darauf hochgerechnet. '+(zd.hinweis||''))+'</div></div>';
}
if(M30){[H,G,R].forEach(function(L){L.forEach(function(r){if(r.e)r.e=r.e.replace(/seit Start/g,'in den letzten 30 Tagen')})})}
var mode='<style>.in-v-mode{display:inline-flex;border:1px solid #cfdcde;border-radius:6px;overflow:hidden;margin:0 0 12px}.in-v-m{font:inherit;font-size:13px;font-weight:700;padding:7px 14px;background:none;border:0;cursor:pointer;color:var(--gm)}.in-v-m.on{background:var(--t);color:#fff}</style><div class="in-v-mode" role="group" aria-label="Zeitraum"><button type="button" class="in-v-m'+(M30?'':' on')+'" data-m="ges">Insgesamt</button><button type="button" class="in-v-m'+(M30?' on':'')+'" data-m="30">Letzte 30 Tage</button></div>'+(M30?'<p class="in-note" style="margin:0 0 10px">'+(d.fenster30?'Zeitraum '+es(d.fenster30.von)+' bis '+es(d.fenster30.bis)+'. ':'')+es(d.hinweis30||'Noch keine Werte für 30 Tage berechnet.')+' Die Kosten je Kontakt und je Lead gelten ebenfalls für diesen Zeitraum, Quoten-Erwartung und die anderen Kacheln rechnen mit allen Daten.</p>':'');
return mode+tiles+tw+ZC+'<div class="in-grid">'+card('LinkedIn: Kontaktanfrage',H)+'<div class="in-v-col">'+card('LinkedIn: Geburtstag',G)+card('LinkedIn: Reaktion',R)+card('Kontakte und Netzwerk',RW)+'</div></div><div class="in-note">Stand '+es(d.stand||'')+'. Ein Klick auf eine Kachel oder Stufe zeigt die Erklärung.</div>'}
return secV;
};
