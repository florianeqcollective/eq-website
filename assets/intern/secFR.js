/* Cockpit-Abschnitt secFR (Reiter Freigaben): vollstaendige Karten der Freigaben, die auf Flo warten. Leseansicht, entschieden wird im Freigabe-Chat.
   Quelle: KIDaten/betrieb, daten.freigaben (karten, bereit, zurueck), vom Orchestrator ab Version 1.6 stuendlich geschrieben. Zeiten in Berliner Ortszeit. */
window.EQIN=window.EQIN||{};
EQIN.secFR=function(D){
var NA=D.NA,esc=D.esc;
function dmyhm(s){s=String(s||'');return s?s.slice(8,10)+'.'+s.slice(5,7)+'. '+s.slice(11,16)+' Uhr':''}
var ST='<style>.in-fr{display:flex;flex-direction:column;gap:18px}'
+'.in-fr-top{border:1px solid var(--g);border-left:10px solid var(--c);background:#fff;padding:16px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}'
+'.in-fr-top.g{--c:#1f7a4d}.in-fr-top.a{--c:#d9951a}'
+'.in-fr-top b{display:block;font-size:1.5rem;line-height:1.2;color:var(--c)}.in-fr-top span{color:var(--gm);font-size:14px}'
+'.in-fr-k{border:1px solid #d5e0e2;border-left:6px solid #d9951a;background:#fff;padding:14px 16px;min-width:0}'
+'.in-fr-k header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:10px}'
+'.in-fr-art{font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--td);background:var(--tl);padding:3px 8px;border-radius:99px}'
+'.in-fr-k header b{font-size:1.05rem;flex:1 1 240px;min-width:0;overflow-wrap:anywhere}'
+'.in-fr-w{white-space:pre-wrap;overflow-wrap:anywhere;background:#f6f9f9;border:1px solid #d5e0e2;padding:12px 14px;font-size:14px;line-height:1.55}'
+'.in-fr-k details{margin-top:10px}.in-fr-k summary{cursor:pointer;font-weight:700;font-size:14px;color:var(--td)}'
+'.in-fr-v{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.55;margin-top:8px}'
+'.in-fr-f{margin-top:10px;font-size:12px;color:var(--gm);overflow-wrap:anywhere}'
+'.in-fr-r{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;padding:8px 0;border-top:1px solid var(--g);font-size:14px}.in-fr-r:first-of-type{border-top:0}'
+'.in-fr-r span:last-child{color:var(--gm);font-size:12px;margin-left:auto}'
+'.in-fr-box{border:1px solid #d5e0e2;background:#fff;padding:12px 16px}'
+'</style>';
function karte(c){var vermerk=String(c.vermerk||'');
return '<article class="in-fr-k"><header><span class="in-fr-art">'+esc(c.art||'Freigabe')+'</span><b>'+esc(c.titel||c.id)+'</b><span class="muted" style="font-size:12px">'+esc(dmyhm(c.erstellt))+'</span></header>'
+'<p class="in-st-h">Entwurf</p><div class="in-fr-w">'+esc(c.wortlaut||'(leer)')+'</div>'+((c.wortlautGekuerzt===true||c.wortlautGekuerzt==='true')?'<p class="muted" style="margin:6px 0 0;font-size:12px">Entwurf gekürzt angezeigt, vollständiger Text im Freigabe-Chat</p>':'')
+(vermerk?'<details><summary>Kontext und Begründung</summary><div class="in-fr-v">'+esc(vermerk)+'</div></details>':'')
+'<div class="in-fr-f">'+esc(c.id)+(c.ki_check?' · KI-Check: '+esc(c.ki_check):'')+(c.quelle?' · Quelle: '+esc(String(c.quelle).slice(0,200)):'')+'</div></article>'}
function secFR(by){var it=by['betrieb'],f=it&&it.daten&&it.daten.freigaben;
if(!f)return ST+'<p class="muted">Noch keine Daten. Die Steuerung in Wix liefert sie mit ihrer nächsten stündlichen Meldung.</p>';
var kk=(Array.isArray(f.karten)?f.karten:[]).filter(Boolean),fo=Number(f.offen)||0,bereit=(Array.isArray(f.bereit)?f.bereit:[]).filter(Boolean),fr=Number(f.freigegeben)||0,zu=Number(f.zurueckgestellt)||0;
var c=fo?'a':'g',tt=fo?(fo===1?'Eine Freigabe wartet auf dich':fo+' Freigaben warten auf dich'):'Nichts wartet auf dich';
var top='<div class="in-fr-top '+c+'"><div><b>'+esc(tt)+'</b><span>Entschieden wird im Freigabe-Chat (dort schreiben: Freigaben bearbeiten). Hier siehst du alles vollständig, ohne ein Dokument zu öffnen.</span></div></div>';
var offen=kk.length?kk.map(karte).join(''):'<div class="in-fr-box"><span class="muted">Keine offene Freigabe.</span></div>';
var mehr=fo>kk.length?'<p class="muted" style="margin:0">und '+(fo-kk.length)+' weitere, im Freigabe-Chat sichtbar.</p>':'';
var br='<div class="in-fr-box"><p class="in-st-h" style="display:flex;justify-content:space-between"><span>Bereit zum Senden</span><span>'+fr+'</span></p>'+(bereit.length?bereit.map(function(b){return '<div class="in-fr-r"><span class="in-fr-art">'+esc(b.art||'')+'</span><span>'+esc(String(b.titel||b.id).slice(0,140))+'</span><span>'+esc(dmyhm(b.erstellt))+'</span></div>'}).join(''):'<span class="muted">Nichts, die nächste Arbeitsrunde sendet freigegebene Zeilen.</span>')+'</div>';
var zz='<div class="in-fr-box"><span class="muted">Zurückgestellt: '+zu+(f.rest?', sonstige Zeilen: '+(Number(f.rest)||0):'')+'. Stand '+esc(String(it.daten.stand||''))+' (Berliner Zeit).</span></div>';
return ST+'<div class="in-fr">'+top+offen+mehr+br+zz+'</div>'}
return secFR;
};