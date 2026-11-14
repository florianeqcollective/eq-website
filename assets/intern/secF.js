/* Cockpit-Abschnitt secF. Kopfzeile var ...=D.x nennt alles, was aus dem Kern gebraucht wird. */
window.EQIN=window.EQIN||{};
EQIN.secF=function(D){
var NA=D.NA,byId=D.byId,dm=D.dm,esc=D.esc,heute=D.heute,mark=D.mark,nf=D.nf;
var worst=function(a,b){var r={'gemessen':0,'abgeleitet':1,'geschätzt':2};return (r[a]||0)>=(r[b]||0)?a:b};
var LBL={anfragen:'Anfragen',angenommen:'Angenommen',nachricht:'Opener gesendet',aufgewaermt:'Aufgewärmt (Kommentar oder Like)',antwort:'Antwort auf Opener',call:'Discovery Call',angebot:'Angebot erstellt',auftrag:'Auftrag'},RBL={gruss:'Geburtstagsgruß gesendet',gruss_antwort:'Antwort auf Geburtstagsgruß',opener_gesendet:'Opener gesendet',opener_antwort:'Antwort auf Opener',gruss_call:'Discovery Call'};
function splitSvg(rows){var W=900,rh=64,gp=4,H=rows.length*(rh+gp)+6,cx=450,mw=150,mx=1;
rows.forEach(function(r){[r.l,r.r].forEach(function(x){if(x&&x.wert>mx)mx=x.wert})});
var wd=function(x){return !x||x.wert==null?0:Math.max(3,mw*x.wert/mx)};
var o='<svg class="in-svg in-fun" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Funnel: links Hauptweg, rechts Geburtstagsweg und Kommentarweg">';
var m0=-1;rows.forEach(function(r,i){if(r.m&&m0<0)m0=i});
if(m0>=0){var by0=m0*(rh+gp)-2;o+='<rect x="0" y="'+by0+'" width="'+W+'" height="'+((rows.length-m0)*(rh+gp))+'" fill="var(--tl)"/><text x="6" y="'+(by0+13)+'" text-anchor="start" font-size="10" class="m">ab hier derselbe Weg</text>'}
rows.forEach(function(r,i){var y=i*(rh+gp),nx=rows[i+1],pv=rows[i-1];
[['l','var(--t)',-1],['r','var(--k)',1]].forEach(function(s){var x=r[s[0]];if(!x||x.wert==null)return;var w0=wd(x),w1=nx&&nx[s[0]]?wd(nx[s[0]]):w0*0.85;
o+='<polygon points="'+cx+','+y+' '+(cx+s[2]*w0)+','+y+' '+(cx+s[2]*w1)+','+(y+rh)+' '+cx+','+(y+rh)+'" fill="'+s[1]+'" fill-opacity="'+(x.q==='geschätzt'?0.55:1)+'" stroke="#fff" stroke-width="1"/>'});
var ln=function(k,yy,col,left){var x=k==='l'||k==='r'?r[k]:k;if(!x)return '';var key=k==='l'||k==='r'?k:null;var p=key&&pv&&pv[key]&&pv[key].wert?Math.round(1000*(x.wert||0)/pv[key].wert)/10:null;
var sq=left?cx-mw-14:cx+mw+12,tx=left?cx-mw-20:cx+mw+27;
return '<rect x="'+sq+'" y="'+(yy-9)+'" width="9" height="9" fill="'+col+'"/><text x="'+tx+'" y="'+yy+'" font-size="12.5"'+(left?' text-anchor="end"':'')+'><tspan font-weight="700">'+esc(x.name)+'</tspan> '+mark(x.q)+nf(x.wert,0)+(p==null?'':' ('+nf(p,1)+' %)')+'</text>'};
o+=ln('l',y+18,'var(--t)',true)+ln('r',y+18,'var(--k)',false);
if(r.k)r.k.forEach(function(kx,j){o+=ln(kx,y+18+j*17,'#d9a441',false)});
if(r.m&&r.l&&r.r)o+='<text x="'+(cx+mw+27)+'" y="'+(y+36)+'" font-size="12" font-weight="700">zusammen '+nf((r.l.wert||0)+(r.r.wert||0),0)+'</text>';
var nt=[(r.l&&r.l.note)||'',(r.r&&r.r.note)||''].filter(Boolean).join(' ');
if(nt)o+='<rect x="0" y="'+y+'" width="'+W+'" height="'+rh+'" fill="transparent"><title>'+esc(nt)+'</title></rect>'});
return o+'</svg>'}
function erwCard(by,hw,gw,wk){var so=by['soll']&&by['soll'].daten;
if(!so||!so.quoten)return '<div class="in-card"><h3>Was wir erwarten können</h3>'+NA+'</div>';
var Q=so.quoten,E=so.erwartung_calls_pro_woche||{},KA=so.anfragen_pro_woche||100,GW=so.gruesse_pro_woche||0;
var a=byId(hw,'anfragen'),g=byId(hw,'angenommen'),n=byId(hw,'nachricht'),r=byId(hw,'antwort'),c=byId(hw,'call'),gr=byId(gw,'gruss'),ga=byId(gw,'gruss_antwort');
var last=null;wk.forEach(function(w){if(w.von&&w.bis&&w.bis<heute)last=w});
var pc=function(x){return nf(Math.round(x*1000)/10,1)+' %'};
var tile=function(titel,val,sub1,sub2){return '<div class="in-tile"><b>'+val+'</b><span>'+esc(titel)+'</span><span class="in-sub">'+esc(sub1)+'</span>'+(sub2?'<span class="in-sub">'+esc(sub2)+'</span>':'')+'</div>'};
var cw=function(x){return x==null?'offen':'ca. '+nf(x,2)};
var h='';
var st=[{k:'annahme',name:'Annahme',unit:'je Anfrage',num:g,den:a,soll:Q.annahme},{k:'antwort',name:'Antwort',unit:'je gesendetem Opener',num:r,den:n,soll:Q.opener_antwort_von_angenommen},{k:'call',name:'Discovery Call',unit:'je Antwort',num:c,den:r,soll:Q.call_von_antwort}];
var ok=function(s){return s.num&&s.den&&s.den.wert>=20&&s.num.wert!=null&&s.den.wert>0};
var eff=function(s){return ok(s)?s.num.wert/s.den.wert:s.soll};
var calls=function(over){var v=KA;st.forEach(function(s){v*=(over===s.k?s.soll:eff(s))});return v};
var now=calls(null);
var kb=by['kpi-kombiniert']&&by['kpi-kombiniert'].daten,bw=(kb&&kb.beitraege_wochen)||[],rs=0,rn=0;bw.forEach(function(w){rs+=(Number(w.kommentare)||0)+(Number(w.reaktionen)||0);rn++});
var RW=rn?rs/rn:(so.reaktionen_pro_woche||0),RL=so.reaktion_lead_anteil!=null?so.reaktion_lead_anteil:0.25;
var vA=last&&last.anfragen!=null?last.anfragen:KA,vG=last&&last.gruesse!=null?last.gruesse:GW;
var rN=Q.opener_antwort_von_angenommen,rC=Q.call_von_antwort;
var gIst=(gr&&ga&&gr.wert>=20)?ga.wert/gr.wert:Q.gruss_antwort;
var cA=vA*eff(st[0])*eff(st[1])*eff(st[2]),cAr=vA*Q.annahme*rN*rC;
var cG=vG*gIst*Q.gruss_lead_anteil*rN*rC,cGr=vG*Q.gruss_antwort*Q.gruss_lead_anteil*rN*rC;
var cR=RW*RL*rN*rC,tot=cA+cG+cR,totR=cAr+cGr+cR;
var wann=tot>0?', etwa alle '+nf(Math.max(1,Math.round(1/tot)),0)+' Wochen ein Call':'';
h+='<div class="in-card"><h3>Was wir erwarten können, wenn die Zahlen so bleiben</h3><p style="margin:0 0 10px"><b style="font-size:1.5em">ca. '+nf(tot,2)+'</b> Discovery Calls pro Woche'+wann+'. Mit den Richtwerten statt unserer bisherigen Quoten wären es ca. '+nf(totR,2)+'.</p><div class="in-tiles in-t3">'
+tile('Aus Anfragen',cw(cA),nf(vA,0)+' Anfragen pro Woche (letzte volle Woche)','Jetzt: '+nf(vA,0)+' Anfragen × Annahme '+pc(eff(st[0]))+' × Antwort auf Opener '+pc(eff(st[1]))+' × Discovery Call '+pc(eff(st[2]))+' = ca. '+nf(cA,2)+' Calls (Quoten mit weniger als 20 Fällen gelten mit dem Richtwert).\nStandard (Richtwert): '+nf(vA,0)+' Anfragen × Annahme '+pc(Q.annahme)+' × Antwort '+pc(rN)+' × Discovery Call '+pc(rC)+' = ca. '+nf(cAr,2)+' Calls.')
+tile('Aus Geburtstagsgrüßen',cw(cG),nf(vG,0)+' Grüße pro Woche (letzte volle Woche)','Jetzt: '+nf(vG,0)+' Grüße × Antwort auf den Gruß '+pc(gIst)+' × '+pc(Q.gruss_lead_anteil)+' passend nach Kriterien × Antwort auf Opener '+pc(rN)+' × Discovery Call '+pc(rC)+' = ca. '+nf(cG,2)+' Calls.\nStandard (Richtwert): '+nf(vG,0)+' Grüße × Antwort auf den Gruß '+pc(Q.gruss_antwort)+' × '+pc(Q.gruss_lead_anteil)+' passend nach Kriterien × '+pc(rN)+' × '+pc(rC)+' = ca. '+nf(cGr,2)+' Calls.')
+tile('Aus Beiträgen und Kommentaren','≈ '+nf(cR,2),'Geschätzt: '+nf(RW,0)+' Reaktionen und Kommentare pro Woche unter unseren Beiträgen','Rechnung: '+nf(RW,0)+' Reaktionen und Kommentare × '+pc(RL)+' Anteil passend nach Kriterien (Platzhalter) × Antwort auf Opener '+pc(rN)+' × Discovery Call '+pc(rC)+' = ca. '+nf(cR,2)+' Calls. Dafür gibt es noch keinen Messwert, deshalb gilt hier der Standard (Richtwert) und die Zahl ist eine Schätzung.\nNicht eingerechnet: die '+nf(so.kommentare_pro_tag||10,0)+' Kommentare am Tag unter fremden Beiträgen, sie wärmen die Kontakte im Funnel auf. Ersetzen, sobald Neue Kontakte aus Reaktionen Messwerte hat.')+'</div></div>';

h+='<div class="in-card"><h3>Ist und Soll je Stufe</h3><table class="rt"><thead><tr><th>Stufe</th><th>Ist</th><th>Soll</th></tr></thead><tbody>';
h+='<tr><td data-l="Stufe"><b>Anfragen pro Woche</b></td><td data-l="Ist">'+(last&&last.anfragen!=null?nf(last.anfragen,0)+' ('+esc(last.kw||'')+')':'noch keine Daten')+'</td><td data-l="Soll">'+nf(KA,0)+'</td></tr>';
st.forEach(function(s){var ist=ok(s)?pc(s.num.wert/s.den.wert)+' ('+mark(worst(s.num.qualitaet,s.den.qualitaet))+nf(s.num.wert,0)+' von '+nf(s.den.wert,0)+')':'zu wenig Daten'+(s.num&&s.den&&s.den.wert!=null?' ('+nf(s.num.wert,0)+' von '+nf(s.den.wert,0)+', ab 20 Fällen)':'');
var below=ok(s)&&s.num.wert/s.den.wert<s.soll;
h+='<tr><td data-l="Stufe"><b>'+esc(s.name)+'</b> <span class="muted">'+esc(s.unit)+'</span></td><td data-l="Ist"'+(below?' class="in-bad"':'')+'>'+ist+'</td><td data-l="Soll">'+pc(s.soll)+'</td></tr>'});
var gq=(gr&&ga&&gr.wert)?ga.wert/gr.wert:null;
h+='<tr><td data-l="Stufe"><b>Geburtstagsgrüße pro Woche</b></td><td data-l="Ist">'+(last&&last.gruesse!=null?nf(last.gruesse,0)+' ('+esc(last.kw||'')+')':'noch keine Daten')+'</td><td data-l="Soll">'+nf(GW,0)+'</td></tr>';
h+='<tr><td data-l="Stufe"><b>Antwort auf Geburtstagsgruß</b></td><td data-l="Ist">'+(gq==null?'noch keine Daten':pc(gq)+' ('+mark(ga.qualitaet)+nf(ga.wert,0)+' von '+nf(gr.wert,0)+')')+'</td><td data-l="Soll">'+pc(Q.gruss_antwort)+'</td></tr>';
h+='</tbody></table><div class="in-note">Ist unter Soll ist rot markiert. Stufen mit weniger als 20 Fällen werden nicht bewertet und gehen mit ihrem Soll in die Rechnung ein. Ein Discovery Call pro Woche wird nicht als Ziel gezeigt. Richtwerte: Belkins 2025 und Expandi 2026, Herstellerdaten, US-lastig.</div></div>';
return h}
function bestandCard(by){var it=by['lead-stand'],d=it&&it.daten;if(!d||!d.stufen)return '<div class="in-card"><h3>Leads je Stufe</h3>'+NA+'</div>';
var mx=1;d.stufen.concat(d.ausserhalb||[]).forEach(function(x){if(x.wert>mx)mx=x.wert});
var row=function(x,g){return '<div class="fr"><div class="fr-h"><span>'+esc(x.name)+'</span><b>'+nf(x.wert,0)+'</b></div><div class="fr-b"><i style="width:'+(x.wert?Math.max(1,Math.round(1000*x.wert/mx)/10):0)+'%'+(g?';background:#9aa9ac':'')+'"></i></div>'+(x.hinweis?'<div class="fr-n">'+esc(x.hinweis)+'</div>':'')+'</div>'};
var inF=d.stufen.reduce(function(s,x){return s+(x.wert||0)},0);
return '<div class="in-card"><h3>Leads je Stufe: Bestand heute</h3>'+d.stufen.map(function(x){return row(x,0)}).join('')+'<h3 class="in-h3" style="margin-top:16px">Außerhalb des Funnels</h3>'+(d.ausserhalb||[]).map(function(x){return row(x,1)}).join('')+'<div class="in-note">'+esc(d.hinweis||'')+' Stand '+esc(d.stand||'')+'. Im Funnel stehen '+nf(inF,0)+' von '+nf(d.summe||0,0)+' Leads in der Liste. Quelle: '+esc(d.quelle||'')+'.</div></div>'}
function secF(by){var it=by['funnel'];if(!it||!it.daten)return NA;var d=it.daten,hw=d.hauptweg||[],gw=d.geburtstagsweg||[],vs=d.vorstufe,wk=d.wochen||[];
var h='<div class="in-note" style="margin:0 0 12px">Stand '+esc(d.stand||'')+(d.seit?', seit '+dm(d.seit):'')+'. '+esc(d.hinweis||'')+' Zeichen: ~ abgeleitet, ≈ geschätzt, ohne Zeichen gemessen. Die Breite zeigt die Menge, beide Hälften sind gleich skaliert.</div>';
var S=function(id){var x=byId(hw,id);return x?{name:LBL[id],wert:x.wert,q:x.qualitaet,note:x.hinweis||''}:null},R=function(id){var x=byId(gw,id);if(!x)return null;var o={name:RBL[id],wert:x.wert,q:x.qualitaet,note:x.hinweis||''};if(id==='opener_gesendet'){var e=byId(gw,'opener_entwurf');if(e&&e.wert!=null)o.note='Vorbereitet: '+nf(e.wert,0)+'. '+o.note}return o};
var au=byId(hw,'ausstehend');var s1=S('anfragen');if(s1&&au&&au.wert!=null)s1.note='Davon noch ausstehend: '+nf(au.wert,0)+'. '+s1.note;
var rw=d.reaktionsweg||[],KW=function(){return [['reaktion_lead','Neue Kontakte aus Reaktionen'],['kommentar_antwort','Antworten auf Kommentare']].map(function(p){var x=byId(rw,p[0]);return x?{name:p[1],wert:x.wert,q:x.qualitaet,note:x.hinweis||''}:null}).filter(Boolean)};
var rows=[{l:s1,r:R('gruss')},{l:S('angenommen'),r:R('gruss_antwort')},{l:S('aufgewaermt'),r:null,k:KW()},{l:S('nachricht'),r:R('opener_gesendet'),m:true},{l:S('antwort'),r:R('opener_antwort'),m:true},{l:S('call'),r:R('gruss_call'),m:true},{l:S('angebot'),r:null,m:true},{l:S('auftrag'),r:null,m:true}].filter(function(x){return x.l||x.r});
h+='<div class="in-grid"><div class="in-card"><h3>Funnel: Hauptweg und Geburtstagsweg</h3>'+(vs?'<p class="in-sub">'+esc(vs.name)+': '+mark(vs.qualitaet)+nf(vs.wert,0)+', davon abgelehnt nach unseren Kriterien: '+mark(vs.qualitaet)+nf(vs.abgelehnt||0,0)+'. Der Geburtstagsweg startet bei Kontakten, die schon vernetzt sind.</p>':'')+(rows.length?splitSvg(rows):'<p class="muted">noch keine Daten</p>')+'<div class="in-leg"><span><i style="background:var(--t)"></i>Hauptweg: Kontaktanfrage</span><span><i style="background:var(--k)"></i>Geburtstagsweg: Geburtstagsgruß (wärmt auf)</span><span><i style="background:#d9a441"></i>Kommentarweg: Reaktionen auf Beiträge und Kommentare</span></div></div>'+bestandCard(by)+'</div><div class="in-grid">'+erwCard(by,hw,gw,wk)+'</div>';

return h}
return secF;
};
