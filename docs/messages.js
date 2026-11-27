'use strict';
/* Mensagens privadas entre perfis (apenas com sessão). Quem pode enviar e ler é decidido na base de dados (RLS).
   Sem tempo real: a conversa aberta é atualizada de poucos em poucos segundos. */
const DM_WHO=[['all','Todas'],['following','Quem sigo'],['none','Ninguém']];
const MSG_COLS='id,sender_id,recipient_id,body,created_at,read_at';
const MSG_PEOPLE=['sender','recipient'].map(k=>k+':profiles!messages_'+k+'_id_fkey(username,avatar_url)').join(',');
Object.assign(LOAD,{
 inbox:()=>{const me=S.auth.uid;return rest('messages?select='+MSG_COLS+','+MSG_PEOPLE+'&or=(sender_id.eq.'+me+',recipient_id.eq.'+me+')&order=created_at.desc&limit=500')},
 dmpref:()=>rest('message_settings?select=who&user_id=eq.'+S.auth.uid)
});
const thread=id=>{const me=S.auth.uid,u=encodeURIComponent(id);return rest('messages?select='+MSG_COLS+'&or=(and(sender_id.eq.'+me+',recipient_id.eq.'+u+'),and(sender_id.eq.'+u+',recipient_id.eq.'+me+'))&order=created_at.desc&limit=100')};

/* ---------- avisos de mensagens por ler ---------- */
function paintBadge(){const n=online()?C.unread:0,t=document.querySelector('#tabs [data-v="me"]');if(t)t.classList.toggle('dot',n>0);document.querySelectorAll('[data-unread]').forEach(e=>{e.textContent=n>99?'99+':n||'';e.hidden=!n})}
let unreadAt=0;
async function checkUnread(force){
 checkOwner();if(!online()||(!force&&Date.now()-unreadAt<20000))return;unreadAt=Date.now();const mine=C;
 try{const l=await rest('messages?select=sender_id&recipient_id=eq.'+S.auth.uid+'&read_at=is.null&limit=100');if(mine!==C)return;C.unread=l.length;paintBadge()}catch(e){console.warn(e.message)}
}
const msgButton=()=>`<button class="btn small ghost" data-act="go" data-v="inbox">${ic(P.chat,16)} Mensagens <b class="count" data-unread data-nt hidden></b></button>`;

/* ---------- lista de conversas ---------- */
function threads(){
 const me=S.auth.uid,m=new Map();
 C.inbox.forEach(x=>{const mine=x.sender_id===me,id=mine?x.recipient_id:x.sender_id;if(blockedId(id))return;
  let t=m.get(id);if(!t)m.set(id,t={id:id,who:mine?x.recipient:x.sender,last:x,mine:mine,n:0});if(!mine&&!x.read_at)t.n++});
 return [...m.values()];
}
const threadRow=t=>`<button class="prsn thread" data-act="go" data-v="chat" data-id="${esc(t.id)}">${face(t.who,44)}<span class="tx" data-nt><b>${esc((t.who&&t.who.username)||'Utilizadora')}</b><small>${t.mine?'↩ ':''}${esc(t.last.body.slice(0,80))}</small></span>${t.n?`<b class="count" data-nt>${t.n}</b>`:''}</button>`;
V.inbox={tab:'me',html:()=>{checkOwner();if(!online())return needsLogin('Mensagens');return `<div class="page">${head('Mensagens','As tuas conversas privadas.')}<button class="btn small" data-act="go" data-v="people" style="margin-bottom:16px">Encontrar pessoas</button>${C.inbox?(threads().map(threadRow).join('')||'<div class="empty">Ainda não tens mensagens. Abre um perfil para começar uma conversa.</div>'):waiting('inbox')}</div>`},
 after:()=>{if(online()){load('inbox');load('blocks');checkUnread(true)}}};

/* ---------- conversa ---------- */
const bubbles=id=>{const l=C.chat[id],me=S.auth.uid;if(!l)return '<div class="empty">A carregar…</div>';
 return l.slice().sort(byDate).map(m=>{const mine=m.sender_id===me,name=(C.member[id]&&C.member[id][0]&&C.member[id][0].username)||'';return `<div class="m ${mine?'me':''}"><span data-nt>${esc(m.body)}</span><div class="meta2"><span>${ago(m.created_at)}</span>${mine?`<button class="mini" data-act="dmdel" data-r="${esc(id)}" data-id="${m.id}">Apagar</button>`:mod('dm',m.id,id,name)}</div></div>`}).join('')||'<div class="empty">Ainda não há mensagens nesta conversa.</div>'};
let chatSeq=0;
async function loadChat(id){
 checkOwner();if(!online())return;const mine=C,seq=++chatSeq;
 try{const l=await thread(id);if(mine!==C||seq!==chatSeq)return;
  const changed=JSON.stringify(C.chat[id])!==JSON.stringify(l);C.chat[id]=l;
  const box=$('#dmlist');if(changed&&box&&cur().v==='chat'&&cur().p.id===id){box.innerHTML=bubbles(id);const v=$('#view');v.scrollTop=v.scrollHeight}
  if(l.some(m=>m.sender_id===id&&!m.read_at)){await rest('messages?sender_id=eq.'+encodeURIComponent(id)+'&recipient_id=eq.'+S.auth.uid+'&read_at=is.null',{method:'PATCH',headers:{Prefer:'return=minimal'},body:{read_at:new Date().toISOString()}});C.at.inbox=0;checkUnread(true)}
 }catch(e){const box=$('#dmlist');if(mine===C&&box&&!C.chat[id])box.innerHTML='<div class="empty">Não foi possível carregar.</div>';console.warn(e.message)}
}
V.chat={tab:'me',html:p=>{checkOwner();if(!online())return needsLogin('Mensagens');
 const u=C.member[p.id]&&C.member[p.id][0];
 if(blockedId(p.id))return `<div class="page">${head('Mensagens','')}<div class="empty">Bloqueaste esta conta.</div></div>`;
 return `<div class="page">${head('Mensagens','')}${u?`<div class="prsn">${person(p.id,face(u,44)+`<span class="tx" data-nt><b>${esc(u.username)}</b></span>`)}</div>`:''}<p class="note c" style="margin:0 0 14px">Só tu e a outra pessoa veem esta conversa. Se denunciares uma mensagem, a equipa vê essa mensagem.</p><div class="msgs" id="dmlist">${bubbles(p.id)}</div><form class="cmform" data-form="dm" data-id="${esc(p.id)}"><input class="field" id="dm-t" name="t" placeholder="Escreve uma mensagem" maxlength="1000" aria-label="Mensagem" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar mensagem">${ic(P.send,18)}</button></form></div>`},
 after:p=>{if(online()){load('member:'+p.id);load('blocks');loadChat(p.id)}}};
let sending=false;
FORM.dm=async(fd,f)=>{const t=fd.get('t').trim(),id=f.dataset.id;if(!t||sending)return;sending=true;
 try{await add('messages',{sender_id:S.auth.uid,recipient_id:id,body:t});f.reset();C.at.inbox=0;await loadChat(id)}
 catch(e){toast(e.offline?e.message:e.code==='42501'?'Esta pessoa não aceita as tuas mensagens.':e.code==='P0001'?'Demasiadas tentativas. Espera um pouco e tenta de novo.':'Não foi possível concluir.');console.warn(e.message)}
 finally{sending=false}};
ACT.dmdel=async d=>{try{await remove('messages?id=eq.'+d.id);C.at.inbox=0;toast('Apagado');await loadChat(d.r)}catch(e){toast(e.offline?e.message:'Não foi possível concluir.')}};

/* ---------- quem me pode escrever ---------- */
const dmPref=()=>{const l=C.dmpref;if(!l)return waiting('dmpref');const now=(l[0]&&l[0].who)||'all';return `<div class="seg">${DM_WHO.map(x=>`<button class="${now===x[0]?'on':''}" data-act="dmwho" data-w="${x[0]}" aria-pressed="${now===x[0]}">${x[1]}</button>`).join('')}</div>`};
ACT.dmwho=d=>act(()=>add('message_settings?on_conflict=user_id',{user_id:S.auth.uid,who:d.w},'resolution=merge-duplicates,return=minimal'),'Preferência guardada',['dmpref']);

setInterval(()=>{if(document.hidden||!online())return;const c=cur();if(c.v==='chat')loadChat(c.p.id);else{if(c.v==='inbox')load('inbox',true);checkUnread()}},5000);
/* o primeiro ecrã já foi desenhado quando este ficheiro carrega */
if(online()){render(true);checkUnread(true)}
