'use strict';
/* Comunidade partilhada e painel de administração (apenas com sessão iniciada).
   Sem sessão, a app continua a mostrar os exemplos locais.
   Quem pode ver ou fazer o quê é decidido na base de dados (RLS). */
const isStaff=()=>online()&&(S.role==='admin'||S.role==='moderator');
const emptyC=owner=>({owner:owner,posts:{},groups:null,qa:null,blocks:[],admin:null,at:{},err:{}});
let C=emptyC(null);
const SAMPLE_BOOKS=BOOKS.slice();
const rest=(path,o)=>api('/rest/v1/'+path,o);
const add=(t,body,prefer)=>rest(t,{method:'POST',headers:{Prefer:prefer||'return=minimal'},body:body});
const patch=(path,body)=>rest(path,{method:'PATCH',headers:{Prefer:'return=representation'},body:body}).then(r=>{if(!r||!r.length)throw new Error('Sem permissão')});
const remove=path=>rest(path,{method:'DELETE',headers:{Prefer:'return=representation'}}).then(r=>{if(!r||!r.length)throw new Error('Sem permissão')});
const AUTHOR=t=>'author:profiles!'+t+'_author_id_fkey(username)';
const who=r=>(r.author&&r.author.username)||'Utilizadora';
const byDate=(a,b)=>String(a.created_at).localeCompare(String(b.created_at));
function ago(s){const m=Math.floor((Date.now()-new Date(s))/60000);if(m<1)return 'agora';if(m<60)return m+' min';if(m<1440)return Math.floor(m/60)+' h';const d=Math.floor(m/1440);return d===1?'ontem':'há '+d+' dias'}

/* ---------- carregar ---------- */
const LOAD={
 async posts(sc){
  const f=sc==='main'?'group_id=is.null':'group_id=eq.'+encodeURIComponent(sc);
  return rest('posts?select=id,body,status,created_at,author_id,group_id,'+AUTHOR('posts')+',comments(id,body,created_at,author_id,'+AUTHOR('comments')+'),post_likes(user_id)&'+f+'&order=created_at.desc&limit=60');
 },
 groups:()=>rest('groups?select=id,name,description,topic,rules,status,owner_id,group_members(user_id)&order=created_at.desc&limit=200'),
 qa:()=>rest('questions?select=id,body,created_at,author_id,'+AUTHOR('questions')+',answers(id,body,created_at,author_id,'+AUTHOR('answers')+')&order=created_at.desc&limit=60'),
 blocks:()=>rest('blocks?select=blocked_id,who:profiles!blocks_blocked_id_fkey(username)&blocker_id=eq.'+S.auth.uid),
 books:()=>rest('books?select=id,title,author,tag,blurb,approved&order=created_at.asc&limit=300'),
 async admin(){
  const reports=await rest('reports?select=id,target_type,target_id,reason,created_at,reporter:profiles!reports_reporter_id_fkey(username)&status=eq.open&order=created_at.asc&limit=100');
  const info={post:['posts','id,body,author_id,status,'+AUTHOR('posts')],comment:['comments','id,body,author_id,'+AUTHOR('comments')],group:['groups','id,name,owner_id,status'],question:['questions','id,body,author_id,'+AUTHOR('questions')],answer:['answers','id,body,author_id,'+AUTHOR('answers')],profile:['profiles','id,username']};
  const targets={};
  await Promise.all(Object.keys(info).map(async k=>{const ids=reports.filter(r=>r.target_type===k).map(r=>r.target_id);if(!ids.length)return;(await rest(info[k][0]+'?select='+info[k][1]+'&id=in.('+ids.join(',')+')')).forEach(x=>{targets[k+x.id]=x})}));
  const [books,posts,groups,banned,members]=await Promise.all([
   rest('books?select=id,title,author,blurb&approved=eq.false&order=created_at.asc'),
   rest('posts?select=id,body,'+AUTHOR('posts')+'&status=eq.hidden&order=created_at.desc&limit=50'),
   rest('groups?select=id,name&status=eq.hidden'),
   S.role==='admin'?rest('rpc/admin_list_banned',{method:'POST',body:{}}):[],
   rest('profiles?select=id&limit=1000')]);
  return {reports:reports,targets:targets,books:books,posts:posts,groups:groups,banned:banned,members:members.length};
 }
};
function applyData(key,data){
 if(key.startsWith('posts:'))C.posts[key.slice(6)]=data;
 else if(key==='blocks'){C.blocks=data.map(b=>({id:b.blocked_id,name:(b.who&&b.who.username)||'Utilizadora'}));S.blocked=C.blocks.map(b=>b.name);store()}
 else if(key==='books'){BOOKS.splice(0,BOOKS.length,...data.map(b=>({id:b.id,t:b.title,a:b.author,tag:b.approved?(b.tag||'Indicação'):'A aguardar aprovação',d:b.blurb||''})));S.mybooks=[]}
 else C[key]=data;
}
function checkOwner(){
 const o=online()?S.auth.uid:null;
 if(C.owner!==o){C=emptyC(o);BOOKS.splice(0,BOOKS.length,...SAMPLE_BOOKS)}
}
async function load(key,force){
 checkOwner();if(!online())return;
 if(!force&&Date.now()-(C.at[key]||0)<15000)return;
 C.at[key]=Date.now();const mine=C,seq=C.at[key];
 const read=()=>JSON.stringify(key.startsWith('posts:')?[C.posts[key.slice(6)],C.err[key]]:key==='books'?[BOOKS,C.err[key]]:[C[key],C.err[key]]);
 const was=read();
 try{const data=await(key.startsWith('posts:')?LOAD.posts(key.slice(6)):LOAD[key]());if(mine!==C||C.at[key]!==seq)return;delete C.err[key];applyData(key,data)}
 catch(e){if(mine!==C)return;C.err[key]=e.offline?e.message:'Não foi possível carregar.';console.warn(key,e.message)}
 const a=document.activeElement;
 if(read()!==was&&!(a&&/INPUT|TEXTAREA/.test(a.tagName)&&a.value))render(true);
}
/* executa uma ação e volta a carregar o ecrã */
let working=false;
async function act(fn,msg,keys){
 if(working)return false;working=true;
 try{await fn();closeSheet();if(document.activeElement)document.activeElement.blur();if(msg)toast(msg);C.at={};render(true);(keys||[]).forEach(k=>load(k,true));return true}
 catch(e){toast(e.offline?e.message:e.code==='23505'?'Já estava registado.':'Não foi possível concluir.');console.warn(e.message);return false}
 finally{working=false}
}

/* ---------- peças ---------- */
const waiting=key=>`<div class="empty">${C.err[key]?esc(C.err[key])+`<br><button class="link" data-act="retry" data-k="${key}">Tentar de novo</button>`:'A carregar…'}</div>`;
const mod=(type,id,authorId,name)=>`<button class="mini" data-act="sheet" data-s="srvreport" data-type="${type}" data-id="${id}">Denunciar</button>${authorId?`<button class="mini" data-act="sheet" data-s="srvblock" data-id="${authorId}" data-who="${esc(name)}">Bloquear</button>`:''}`;
function srvPost(p,sc,manage){
 const me=S.auth.uid,mine=p.author_id===me,likes=p.post_likes||[],on=likes.some(l=>l.user_id===me),name=who(p);
 return `<article class="post"><div class="who">${mine?avatar(36):`<span class="av" style="width:36px;height:36px;font-size:16px">${esc(name.charAt(0).toUpperCase())}</span>`}<b>${esc(name)}</b><span>${ago(p.created_at)}</span></div>${p.status==='hidden'?'<span class="tg rose">Oculta pela equipa</span>':''}<p>${esc(p.body)}</p><div class="acts"><button class="like ${on?'on':''}" data-act="srvlike" data-sc="${sc}" data-id="${p.id}" aria-pressed="${on}">${ic(P.heart,16)} ${likes.length}</button>${mine||manage||isStaff()?`<button class="mini" data-act="srvdel" data-t="posts" data-sc="${sc}" data-id="${p.id}">Apagar</button>`:''}${mine?'':mod('post',p.id,p.author_id,name)}</div>${(p.comments||[]).slice().sort(byDate).map(c=>`<div class="cm"><b>${esc(who(c))}</b> ${esc(c.body)} ${c.author_id===me||isStaff()?`<button class="mini" data-act="srvdel" data-t="comments" data-sc="${sc}" data-id="${c.id}">Apagar</button>`:mod('comment',c.id,c.author_id,who(c))}</div>`).join('')}<form class="cmform" data-form="comment" data-sc="${sc}" data-id="${p.id}"><input class="field" id="cm-${p.id}" name="t" placeholder="Comentar" maxlength="200" aria-label="Comentar" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar comentário">${ic(P.send,18)}</button></form></article>`;
}
const feed=(sc,manage,none)=>{const l=C.posts[sc];return l?(l.map(p=>srvPost(p,sc,manage)).join('')||`<div class="empty">${none}</div>`):waiting('posts:'+sc)};
const composer=(sc,id,ph)=>`<form data-form="post" data-sc="${sc}" class="stack" style="margin-bottom:18px"><textarea class="field" id="${id}" name="t" placeholder="${ph}" maxlength="400" aria-label="Nova publicação" style="min-height:92px"></textarea><button class="btn small" type="submit" style="align-self:flex-end">Publicar</button></form>`;
const isMember=g=>(g.group_members||[]).some(m=>m.user_id===S.auth.uid);
const groupCard=g=>{const on=isMember(g),n=(g.group_members||[]).length,mine=g.owner_id===S.auth.uid;return `<button class="menu" data-act="go" data-v="group" data-id="${g.id}"><span class="ic">${ic(P.users,22)}</span><span class="tx"><span class="t">${esc(g.name)}</span><span class="p">${esc(g.description||'')}</span><span style="display:block;margin-top:6px"><span class="tg">${TOPICS[g.topic]?TOPICS[g.topic].label:'Geral'}</span><span class="tg">${n} ${n===1?'membro':'membros'}</span>${mine?'<span class="tg rose">Criado por ti</span>':on?'<span class="tg rose">Estás no grupo</span>':''}</span></span><span class="ch">${ic(P.next,18)}</span></button>`};
const adminLink=()=>isStaff()?menu('shield','Painel de administração','Denúncias, livros e contas','data-act="go" data-v="admin"',1):'';

/* ---------- ecrãs (com sessão usam dados partilhados) ---------- */
function shared(name,html,after){
 const o=V[name];
 V[name]={tab:o.tab,html:p=>{checkOwner();return online()?html(p,o):o.html(p)},after:p=>{if(o.after)o.after(p);if(online()&&after)after(p)}};
}
shared('community',()=>`<div class="page">${head('COMMUNITY','Partilha, descobre e inspira-te.',{noBack:1})}
 ${menu('chat','Publicações','O que se está a partilhar','data-act="go" data-v="posts"')}
 ${menu('users','Grupos','Encontra ou cria o teu grupo','data-act="go" data-v="groups"')}
 ${menu('help','Perguntas & Respostas','Pergunta à comunidade','data-act="go" data-v="qa"')}
 ${menu('heart','Os meus interesses',S.interests.length?S.interests.map(k=>TOPICS[k]?TOPICS[k].label:k).join(', '):'Escolhe os teus temas','data-act="go" data-v="interests" data-edit="1"')}
 ${adminLink()}
 <div class="card cream" style="display:flex;gap:12px;align-items:flex-start"><span style="flex:none;color:var(--muted)">${ic(P.shield,24)}</span><p class="p14" style="margin:0">Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora.</p></div></div>`);
shared('posts',()=>`<div class="page">${head('Publicações','')}${composer('main','po-t','Partilha uma ideia, uma dica ou uma pergunta')}${feed('main',false,'Ainda não há publicações. Escreve a primeira.')}</div>`,()=>load('posts:main'));
shared('groups',()=>{const all=C.groups||[],mine=all.filter(isMember),others=all.filter(g=>!isMember(g)&&g.status==='active');return `<div class="page">${head('Grupos','Pessoas com os mesmos interesses que tu.')}<button class="btn" data-act="sheet" data-s="newgroup">${ic(P.plus,18)} Criar o meu grupo</button>${mine.length?`<h2 class="sec s">OS MEUS GRUPOS</h2>${mine.map(groupCard).join('')}`:''}<h2 class="sec s">${mine.length?'DESCOBRIR':'GRUPOS'}</h2>${C.groups?(others.map(groupCard).join('')||'<div class="empty">Não há outros grupos por agora.</div>'):waiting('groups')}</div>`},()=>load('groups'));
shared('group',p=>{
 if(!C.groups)return `<div class="page">${head('Grupo','')}${waiting('groups')}</div>`;
 const g=C.groups.find(x=>x.id===p.id);if(!g)return `<div class="page">${head('Grupo','')}<div class="empty">Este grupo já não existe.</div></div>`;
 const on=isMember(g),mine=g.owner_id===S.auth.uid,n=g.group_members.length;
 return `<div class="page">${head(esc(g.name),esc(g.description||''))}<div style="margin-bottom:14px"><span class="tg">${TOPICS[g.topic]?TOPICS[g.topic].label:'Geral'}</span><span class="tg">${n} ${n===1?'membro':'membros'}</span>${mine?'<span class="tg rose">Criado por ti</span>':''}</div>
 ${g.rules?`<div class="card cream"><span class="meta">Regras do grupo</span><p class="p14" style="margin:6px 0 0;white-space:pre-wrap">${esc(g.rules)}</p></div>`:''}
 ${mine?`<div style="margin-bottom:16px"><button class="btn small ghost" data-act="sheet" data-s="delgroup" data-id="${g.id}">Eliminar grupo</button></div>`:`<button class="btn ${on?'ghost':''}" data-act="group" data-id="${g.id}" style="margin-bottom:10px">${on?'Estás no grupo. Sair':'Entrar no grupo'}</button><div class="c" style="margin-bottom:12px">${mod('group',g.id)}</div>`}
 ${on?composer(g.id,'gp-t','Escreve para o grupo'):'<div class="empty" style="margin-bottom:16px">Entra no grupo para publicares.</div>'}
 ${feed(g.id,mine,'Ainda sem publicações. Sê a primeira.')}</div>`},p=>{load('groups');load('posts:'+p.id)});
shared('qa',()=>`<div class="page">${head('Perguntas & Respostas','')}<form data-form="ask" class="addrow"><input class="field" id="qa-q" name="q" placeholder="Faz uma pergunta" maxlength="140" aria-label="Nova pergunta" autocomplete="off"><button class="btn" type="submit" aria-label="Publicar pergunta">${ic(P.plus,22)}</button></form>${C.qa?(C.qa.map(q=>{const mine=q.author_id===S.auth.uid;return `<div class="card"><span class="meta">${esc(who(q))}</span><h3 style="font:500 21px/1.25 var(--serif);margin:4px 0 8px">${esc(q.body)}</h3><div class="acts" style="margin-bottom:8px">${mine||isStaff()?`<button class="mini" data-act="srvdel" data-t="questions" data-id="${q.id}">Apagar</button>`:mod('question',q.id,q.author_id,who(q))}</div>${(q.answers||[]).slice().sort(byDate).map(a=>`<div class="cm"><b>${esc(who(a))}</b> ${esc(a.body)} ${a.author_id===S.auth.uid||isStaff()?`<button class="mini" data-act="srvdel" data-t="answers" data-id="${a.id}">Apagar</button>`:mod('answer',a.id,a.author_id,who(a))}</div>`).join('')||'<p style="margin:0 0 8px;font-size:13px;color:var(--muted)">Ainda sem respostas.</p>'}<form class="cmform" data-form="answer" data-id="${q.id}"><input class="field" id="an-${q.id}" name="t" placeholder="Responder" maxlength="240" aria-label="Responder" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar resposta">${ic(P.send,18)}</button></form></div>`}).join('')||'<div class="empty">Ainda não há perguntas.</div>'):waiting('qa')}</div>`,()=>load('qa'));
shared('profile',(p,o)=>{const h=o.html(p);return p.edit&&isStaff()?h.replace('<h2 class="sec s">SEGURANÇA</h2>',()=>adminLink()+'<h2 class="sec s">SEGURANÇA</h2>'):h},p=>{if(p.edit)load('blocks')});
shared('bookclub',(p,o)=>o.html(p),()=>load('books'));

/* ---------- painel de administração ---------- */
const TYPES={post:'Publicação',comment:'Comentário',group:'Grupo',question:'Pergunta',answer:'Resposta',profile:'Perfil',message:'Mensagem',listing:'Anúncio'};
function reportCard(r,d){
 const t=d.targets[r.target_type+r.target_id],author=t&&(r.target_type==='profile'?t.id:(t.author_id||t.owner_id));
 const hide=r.target_type==='post'||r.target_type==='group';
 const table={post:'posts',comment:'comments',group:'groups',question:'questions',answer:'answers'}[r.target_type];
 return `<div class="card"><span class="meta">${TYPES[r.target_type]||r.target_type} · ${ago(r.created_at)} · por ${esc((r.reporter&&r.reporter.username)||'?')}</span><p style="margin:8px 0 4px"><b>${esc(r.reason)}</b></p><p class="p14" style="overflow-wrap:anywhere">${t?esc((t.author?t.author.username+': ':'')+(t.body||t.name||t.username||'')):'O conteúdo já não existe.'}</p><div class="acts" style="flex-wrap:wrap">${t&&table?`<button class="mini" data-act="${hide?'admhide':'admremove'}" data-t="${table}" data-id="${t.id}" data-r="${r.id}">${hide?'Ocultar':'Apagar conteúdo'}</button>`:''}${author&&S.role==='admin'&&author!==S.auth.uid?`<button class="mini" data-act="sheet" data-s="suspend" data-id="${author}" data-r="${r.id}">Suspender conta</button>`:''}<button class="mini" data-act="admclose" data-r="${r.id}">Arquivar</button></div></div>`;
}
V.admin={tab:'community',html:()=>{
 checkOwner();if(!isStaff())return `<div class="page">${head('Administração','')}<div class="empty">Esta área é só para a equipa.</div></div>`;
 const d=C.admin;if(!d)return `<div class="page">${head('Administração','')}${waiting('admin')}</div>`;
 const sec=(t,l,none)=>`<h2 class="sec s">${t}</h2>${l.join('')||`<div class="empty">${none}</div>`}`;
 return `<div class="page">${head('Administração','O controlo da MAELLE.')}<div class="summary"><div><b>${d.members}</b><span>Contas</span></div><div><b>${d.reports.length}</b><span>Denúncias</span></div><div><b>${d.books.length}</b><span>Livros</span></div></div>
 <button class="btn small ghost" data-act="retry" data-k="admin">Atualizar</button>
 ${sec('DENÚNCIAS POR TRATAR',d.reports.map(r=>reportCard(r,d)),'Sem denúncias por tratar.')}
 ${sec('LIVROS POR APROVAR',d.books.map(b=>`<div class="card"><h3 class="h3">${esc(b.title)}</h3><span class="meta">${esc(b.author)}</span><p class="p14">${esc(b.blurb||'')}</p><div class="acts"><button class="mini" data-act="admbook" data-id="${b.id}">Aprovar</button><button class="mini" data-act="admremove" data-t="books" data-id="${b.id}">Rejeitar</button></div></div>`),'Nenhum livro à espera.')}
 ${sec('CONTEÚDO OCULTO',d.posts.map(x=>`<div class="item"><span class="tx">${esc(x.body)}<small>${esc(who(x))}</small></span><button class="mini" data-act="admshow" data-t="posts" data-id="${x.id}">Repor</button></div>`).concat(d.groups.map(g=>`<div class="item"><span class="tx">${esc(g.name)}<small>Grupo</small></span><button class="mini" data-act="admshow" data-t="groups" data-id="${g.id}">Repor</button></div>`)),'Nada oculto.')}
 ${S.role==='admin'?sec('CONTAS SUSPENSAS',d.banned.map(u=>`<div class="item"><span class="tx">${esc(u.username)}</span><button class="mini" data-act="admunban" data-id="${u.id}">Reativar</button></div>`),'Nenhuma conta suspensa.'):''}</div>`},
 after:()=>{if(isStaff())load('admin')}};
const closeReport=(id,status)=>patch('reports?id=eq.'+id,{status:status});
const setBan=(id,v)=>rest('rpc/admin_set_banned',{method:'POST',body:{target:id,value:v}});

/* ---------- ações ---------- */
SHEETS.srvreport=d=>sheet(`<h2 class="h2">Denunciar</h2><p class="sub">Diz-nos o que aconteceu. A equipa MAELLE analisa cada denúncia.</p><form data-form="srvreport" data-type="${esc(d.type)}" data-id="${esc(d.id)}" class="stack" novalidate>${REPORT_REASONS.map((r,i)=>`<label class="agree" style="background:var(--white);border-radius:18px;padding:12px 14px;align-items:center"><input type="radio" name="r" value="${esc(r)}" ${i===0?'checked':''}><span style="color:var(--ink);font-size:14px">${r}</span></label>`).join('')}<button class="btn" type="submit">Enviar denúncia</button><button class="btn ghost" type="button" data-act="close">Cancelar</button></form>`);
SHEETS.srvblock=d=>sheet(`<h2 class="h2">Bloquear ${esc(d.who)}?</h2><p class="sub">Deixam de ver as publicações, comentários e perguntas uma da outra. Podes desbloquear no teu perfil.</p><div class="stack"><button class="btn" data-act="srvblock" data-id="${esc(d.id)}">Bloquear</button><button class="btn ghost" data-act="close">Cancelar</button></div>`);
SHEETS.suspend=d=>sheet(`<h2 class="h2">Suspender esta conta?</h2><p class="sub">A pessoa deixa de poder publicar e guardar novos dados. Podes reativar a conta no painel.</p><div class="stack"><button class="btn" data-act="admban" data-id="${esc(d.id)}" data-r="${esc(d.r)}">Suspender</button><button class="btn ghost" data-act="close">Cancelar</button></div>`);
/* usa a versão partilhada com sessão, a local sem sessão */
function both(obj,name,fn){const o=obj[name];obj[name]=function(){return online()?fn.apply(null,arguments):o.apply(null,arguments)}}
const pkey=sc=>'posts:'+sc;
/* limpa o campo só depois de o envio resultar */
const send=(f,fn,msg,keys)=>act(fn,msg,keys).then(ok=>{if(ok)f.reset()});
both(FORM,'post',(fd,f)=>{const t=fd.get('t').trim(),sc=f.dataset.sc;if(t)send(f,()=>add('posts',{author_id:S.auth.uid,group_id:sc==='main'?null:sc,body:t}),'Publicado',[pkey(sc)])});
both(FORM,'comment',(fd,f)=>{const t=fd.get('t').trim();if(t)send(f,()=>add('comments',{author_id:S.auth.uid,post_id:f.dataset.id,body:t}),'',[pkey(f.dataset.sc)])});
both(FORM,'ask',(fd,f)=>{const t=fd.get('q').trim();if(t)send(f,()=>add('questions',{author_id:S.auth.uid,body:t}),'Pergunta publicada',['qa'])});
both(FORM,'answer',(fd,f)=>{const t=fd.get('t').trim();if(t)send(f,()=>add('answers',{author_id:S.auth.uid,question_id:f.dataset.id,body:t}),'',['qa'])});
both(FORM,'newgroup',(fd,f)=>{const n=fd.get('n').trim();if(n.length<3)return ferr(f,'Dá ao grupo um nome com pelo menos 3 letras.');if(!fd.get('ok'))return ferr(f,'Confirma que vais garantir um espaço respeitoso.');
 const id=uid();act(()=>add('groups',{id:id,owner_id:S.auth.uid,name:n,description:fd.get('d').trim()||'Um novo grupo da comunidade.',topic:fd.get('k'),rules:fd.get('rules').trim()||null}),'Grupo criado',['groups']).then(ok=>{if(ok){C.groups=null;go('group',{id:id})}})});
both(FORM,'suggest',(fd,f)=>{const t=fd.get('t').trim();if(!t)return ferr(f,'Indica o título do livro.');BK='rec';BKF='all';act(()=>add('books',{title:t,author:fd.get('a').trim()||'Autor por indicar',tag:'Indicação',blurb:fd.get('d').trim()||null,suggested_by:S.auth.uid,approved:false}),'Obrigada! O livro aguarda aprovação.',['books'])});
FORM.srvreport=(fd,f)=>act(()=>add('reports',{reporter_id:S.auth.uid,target_type:f.dataset.type,target_id:f.dataset.id,reason:fd.get('r')}),'Denúncia enviada. Obrigada por ajudares a manter a MAELLE segura.');
both(ACT,'group',d=>{const g=C.groups.find(x=>x.id===d.id),on=isMember(g);act(()=>on?remove('group_members?group_id=eq.'+d.id+'&user_id=eq.'+S.auth.uid):add('group_members',{group_id:d.id,user_id:S.auth.uid}),on?'Saíste do grupo':'Bem-vinda ao grupo',['groups',pkey(d.id)])});
both(ACT,'delgroup',d=>act(()=>remove('groups?id=eq.'+d.id),'Grupo eliminado').then(ok=>{if(!ok)return;if(C.groups)C.groups=C.groups.filter(g=>g.id!==d.id);stack=stack.filter(s=>!(s.v==='group'&&s.p&&s.p.id===d.id));if(!stack.length)stack=[{v:'groups',p:{}}];render();load('groups',true)}));
both(ACT,'unblock',d=>{const b=C.blocks.find(x=>x.name===d.n);if(b)act(()=>remove('blocks?blocker_id=eq.'+S.auth.uid+'&blocked_id=eq.'+b.id),'Desbloqueada',['blocks'])});
ACT.srvblock=d=>act(()=>add('blocks',{blocker_id:S.auth.uid,blocked_id:d.id}),'Conta bloqueada',['blocks']).then(ok=>{if(ok){C.posts={};C.qa=null;render(true)}});
ACT.srvlike=d=>{const p=(C.posts[d.sc]||[]).find(x=>x.id===d.id);if(!p)return;const on=p.post_likes.some(l=>l.user_id===S.auth.uid);
 act(()=>on?remove('post_likes?post_id=eq.'+d.id+'&user_id=eq.'+S.auth.uid):add('post_likes',{post_id:d.id,user_id:S.auth.uid}),'',[pkey(d.sc)])};
ACT.srvdel=d=>act(()=>remove(d.t+'?id=eq.'+d.id),'Apagado',[d.sc?pkey(d.sc):'qa']);
ACT.retry=d=>load(d.k,true);
ACT.admhide=d=>act(async()=>{await patch(d.t+'?id=eq.'+d.id,{status:'hidden'});await closeReport(d.r,'actioned')},'Conteúdo ocultado',['admin']);
ACT.admshow=d=>act(()=>patch(d.t+'?id=eq.'+d.id,{status:d.t==='posts'?'visible':'active'}),'Conteúdo reposto',['admin']);
ACT.admremove=d=>act(async()=>{await remove(d.t+'?id=eq.'+d.id);if(d.r)await closeReport(d.r,'actioned')},d.t==='books'?'Livro rejeitado':'Conteúdo apagado',['admin']);
ACT.admclose=d=>act(()=>closeReport(d.r,'dismissed'),'Denúncia arquivada',['admin']);
ACT.admbook=d=>act(()=>patch('books?id=eq.'+d.id,{approved:true}),'Livro aprovado',['admin','books']);
ACT.admban=d=>act(async()=>{await setBan(d.id,true);await closeReport(d.r,'actioned')},'Conta suspensa',['admin']);
ACT.admunban=d=>act(()=>setBan(d.id,false),'Conta reativada',['admin']);
