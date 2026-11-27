'use strict';
/* Comunidade partilhada e painel de administração (apenas com sessão iniciada).
   Sem sessão, a app continua a mostrar os exemplos locais.
   Quem pode ver ou fazer o quê é decidido na base de dados (RLS). */
const isStaff=()=>online()&&(S.role==='admin'||S.role==='moderator');
const emptyC=owner=>({owner:owner,posts:{},msgs:{},member:{},social:{},people:{},shop:null,rooms:null,groups:null,qa:null,blocks:[],admin:null,at:{},seq:{},err:{}});
let C=emptyC(null);
const SAMPLES=[BOOKS,PRODUCTS,SERVICES,BRANDS].map(a=>[a,a.slice()]);
const fill=(a,l)=>a.splice(0,a.length,...l);
/* só aceitamos imagens do nosso armazenamento e ligações http(s) */
const safeImg=u=>String(u||'').startsWith(SB_URL+'/storage/v1/object/public/media/')&&!/["'<>\s]/.test(u)?u:'';
const safeLink=u=>/^https?:\/\//i.test(u||'')?u:'';
const SELLER='seller:profiles!listings_seller_id_fkey(username)';
const rest=(path,o)=>api('/rest/v1/'+path,o);
const add=(t,body,prefer)=>rest(t,{method:'POST',headers:{Prefer:prefer||'return=minimal'},body:body});
const patch=(path,body)=>rest(path,{method:'PATCH',headers:{Prefer:'return=representation'},body:body}).then(r=>{if(!r||!r.length)throw new Error('Sem permissão')});
const remove=path=>rest(path,{method:'DELETE',headers:{Prefer:'return=representation'}}).then(r=>{if(!r||!r.length)throw new Error('Sem permissão')});
const AUTHOR=t=>'author:profiles!'+t+'_author_id_fkey(username,avatar_url)';
const who=r=>(r.author&&r.author.username)||'Utilizadora';
const byDate=(a,b)=>String(a.created_at).localeCompare(String(b.created_at));
function ago(s){const m=Math.floor((Date.now()-new Date(s))/60000);if(m<1)return 'agora';if(m<60)return m+' min';if(m<1440)return Math.floor(m/60)+' h';const d=Math.floor(m/1440);return d===1?'ontem':'há '+d+' dias'}

/* ---------- carregar ---------- */
const LOAD={
 async posts(sc){
  let ids=null;
  if(sc==='following'){ids=(await rest('follows?select=followed_id&follower_id=eq.'+S.auth.uid+'&limit=500')).map(x=>x.followed_id);if(!ids.length)return []}
  const f=ids?'group_id=is.null&author_id=in.('+ids.join(',')+')':sc==='main'?'group_id=is.null':sc.startsWith('u-')?'group_id=is.null&author_id=eq.'+encodeURIComponent(sc.slice(2)):'group_id=eq.'+encodeURIComponent(sc);
  return rest('posts?select=id,body,image_url,video_url,status,created_at,author_id,group_id,'+AUTHOR('posts')+',comments(id,body,created_at,author_id,'+AUTHOR('comments')+'),post_likes(user_id)&'+f+'&order=created_at.desc&limit=60');
 },
 groups:()=>rest('groups?select=id,name,description,topic,rules,status,owner_id,group_members(user_id)&order=created_at.desc&limit=200'),
 qa:()=>rest('questions?select=id,body,created_at,author_id,'+AUTHOR('questions')+',answers(id,body,created_at,author_id,'+AUTHOR('answers')+')&order=created_at.desc&limit=60'),
 member:id=>rest('profiles?select=id,username,bio,avatar_url,interests&id=eq.'+encodeURIComponent(id)),
 social:id=>{const u=encodeURIComponent(id),p=k=>k+':profiles!follows_'+k+'_id_fkey(username,avatar_url)';return rest('follows?select=follower_id,followed_id,'+p('follower')+','+p('followed')+'&or=(follower_id.eq.'+u+',followed_id.eq.'+u+')&order=created_at.desc&limit=1000')},
 people:k=>{const q=k.slice(1);return rest('profiles?select=id,username,avatar_url,bio&id=neq.'+S.auth.uid+(q?'&username=ilike.'+encodeURIComponent('*'+q+'*'):'')+'&order=created_at.desc&limit=40')},
 blocks:()=>rest('blocks?select=blocked_id,who:profiles!blocks_blocked_id_fkey(username)&blocker_id=eq.'+S.auth.uid),
 async books(){const [books,shelves]=await Promise.all([rest('books?select=id,title,author,tag,blurb,approved&order=created_at.asc&limit=300'),rest('shelves?select=book_id,status&user_id=eq.'+S.auth.uid)]);return {books:books,shelves:shelves}},
 async shop(){const me=S.auth.uid;const [listings,brands,favs,follows]=await Promise.all([
   rest('listings?select=id,seller_id,brand_id,kind,title,description,price_cents,category,mode,city,author,condition,contact,link,image_url,status,'+SELLER+'&order=created_at.desc&limit=300'),
   rest('brands?select=id,name,description&or=(verified.is.true,owner_id.is.null)&order=name.asc'),
   rest('favorites?select=listing_id&user_id=eq.'+me),rest('brand_follows?select=brand_id&user_id=eq.'+me)]);
  return {listings:listings,brands:brands,favs:favs,follows:follows}},
 async rooms(){const [rooms,last]=await Promise.all([rest('book_rooms?select=id,title,book_id&order=created_at.asc&limit=200'),rest('room_messages?select=room_id,body,'+AUTHOR('room_messages')+'&status=eq.visible&order=created_at.desc&limit=200')]);return {rooms:rooms,last:last}},
 msgs:id=>rest('room_messages?select=id,body,status,created_at,author_id,'+AUTHOR('room_messages')+'&room_id=eq.'+encodeURIComponent(id)+'&order=created_at.desc&limit=100'),
 async admin(){
  const reports=await rest('reports?select=id,target_type,target_id,reason,created_at,reporter:profiles!reports_reporter_id_fkey(username)&status=eq.open&order=created_at.asc&limit=100');
  const info={post:['posts','id,body,image_url,video_url,author_id,status,'+AUTHOR('posts')],comment:['comments','id,body,author_id,'+AUTHOR('comments')],group:['groups','id,name,owner_id,status'],question:['questions','id,body,author_id,'+AUTHOR('questions')],answer:['answers','id,body,author_id,'+AUTHOR('answers')],profile:['profiles','id,username'],listing:['listings','id,title,seller_id,status,'+SELLER],message:['room_messages','id,body,author_id,'+AUTHOR('room_messages')]};
  const targets={};
  await Promise.all(Object.keys(info).map(async k=>{const ids=reports.filter(r=>r.target_type===k).map(r=>r.target_id);if(!ids.length)return;(await rest(info[k][0]+'?select='+info[k][1]+'&id=in.('+ids.join(',')+')')).forEach(x=>{targets[k+x.id]=x})}));
  const [books,posts,groups,banned,members,listings]=await Promise.all([
   rest('books?select=id,title,author,blurb&approved=eq.false&order=created_at.asc'),
   rest('posts?select=id,body,image_url,video_url,'+AUTHOR('posts')+'&status=eq.hidden&order=created_at.desc&limit=50'),
   rest('groups?select=id,name&status=eq.hidden'),
   S.role==='admin'?rest('rpc/admin_list_banned',{method:'POST',body:{}}):[],
   rest('profiles?select=id&limit=1000'),
   rest('listings?select=id,title,'+SELLER+'&status=eq.hidden&limit=50')]);
  return {reports:reports,targets:targets,books:books,posts:posts,groups:groups,banned:banned,members:members.length,listings:listings};
 }
};
function applyShop(d){
 const me=S.auth.uid,live=d.listings.filter(x=>x.status!=='hidden'),seller=x=>(x.seller&&x.seller.username)||'Utilizadora';
 const base=x=>({id:x.id,sid:x.seller_id,mine:x.seller_id===me,seller:seller(x),p:x.price_cents/100,d:x.description||'',contact:x.contact||'',img:safeImg(x.image_url)});
 const prod=live.filter(x=>x.kind==='product').map(x=>Object.assign(base(x),{n:x.title,b:x.brand_id,bn:x.author||seller(x),c:x.category,link:safeLink(x.link)}));
 const svc=live.filter(x=>x.kind==='service').map(x=>Object.assign(base(x),{n:x.title,by:seller(x),c:x.category||'Outros',mode:x.mode||'Online',city:x.city||''}));
 S.myprods=prod.filter(x=>x.mine);fill(PRODUCTS,prod.filter(x=>!x.mine));
 S.mysvc=svc.filter(x=>x.mine);fill(SERVICES,svc.filter(x=>!x.mine));
 S.sales=live.filter(x=>x.kind==='book').map(x=>Object.assign(base(x),{t:x.title,a:x.author||'',cond:x.condition||'',city:x.city||'',by:seller(x)}));
 fill(BRANDS,d.brands.map(x=>({id:x.id,n:x.name,d:x.description||''})));
 S.favs=d.favs.map(x=>x.listing_id);S.brands=d.follows.map(x=>x.brand_id);store();
}
function applyData(key,data){
 const [kind,id]=key.split(':');
 if(id){C[kind][id]=data;return}
 if(key==='blocks'){C.blocks=data.map(b=>({id:b.blocked_id,name:(b.who&&b.who.username)||'Utilizadora'}));S.blocked=C.blocks.map(b=>b.name);store()}
 else if(key==='books'){fill(BOOKS,data.books.map(b=>({id:b.id,t:b.title,a:b.author,tag:b.approved?(b.tag||'Indicação'):'A aguardar aprovação',d:b.blurb||''})));S.mybooks=[];S.shelf={};data.shelves.forEach(x=>{S.shelf[x.book_id]=x.status});C.books=data;store()}
 else{C[key]=data;if(key==='shop')applyShop(data)}
}
function checkOwner(){
 const o=online()?S.auth.uid:null;if(C.owner===o)return;
 C=emptyC(o);SF={t:'prod',c:'all',b:null,sc:'all'};
 SAMPLES.forEach(p=>fill(p[0],o?[]:p[1]));
 /* com sessão não se mostram anúncios de exemplo */
 if(o){S.myprods=[];S.mysvc=[];S.sales=[];S.mybooks=[];S.favs=[];S.brands=[];S.shelf={}}
}
async function load(key,force){
 checkOwner();if(!online())return;
 if(!force&&Date.now()-(C.at[key]||0)<15000)return;
 C.at[key]=Date.now();const mine=C,seq=C.seq[key]=(C.seq[key]||0)+1,[kind,id]=key.split(':');
 const read=()=>JSON.stringify([id?C[kind][id]:C[kind],C.err[key]]);
 const was=read();
 try{const data=await(id?LOAD[kind](id):LOAD[kind]());if(mine!==C||C.seq[key]!==seq)return;delete C.err[key];applyData(key,data)}
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
const face=(a,sz)=>{const img=safeImg(a&&a.avatar_url),n=(a&&a.username)||'Utilizadora';return `<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.45)}px">${img?`<img src="${img}" alt="">`:esc(n.charAt(0).toUpperCase())}</span>`};
/* nome que abre o perfil da pessoa */
const person=(id,inner)=>`<button class="person" data-act="go" ${id===S.auth.uid?'data-v="me"':`data-v="user" data-id="${esc(id)}"`}>${inner}</button>`;
const mediaHTML=p=>{const img=safeImg(p.image_url),vid=safeImg(p.video_url);return (img?`<img class="postimg" src="${img}" alt="">`:'')+(vid?`<video class="postimg postvid" src="${vid}#t=0.1" controls playsinline preload="metadata"></video>`:'')};
function srvPost(p,sc,manage){
 const me=S.auth.uid,mine=p.author_id===me,likes=p.post_likes||[],on=likes.some(l=>l.user_id===me),name=who(p);
 return `<article class="post"><div class="who">${person(p.author_id,(mine?avatar(36):face(p.author,36))+`<b data-nt>${esc(name)}</b>`)}<span>${ago(p.created_at)}</span></div>${p.status==='hidden'?'<span class="tg rose">Oculta pela equipa</span>':''}${p.body?`<p data-nt>${esc(p.body)}</p>`:''}${mediaHTML(p)}<div class="acts"><button class="like ${on?'on':''}" data-act="srvlike" data-sc="${sc}" data-id="${p.id}" aria-pressed="${on}">${ic(P.heart,16)} ${likes.length}</button>${mine||manage||isStaff()?`<button class="mini" data-act="srvdel" data-t="posts" data-sc="${sc}" data-id="${p.id}">Apagar</button>`:''}${mine?'':mod('post',p.id,p.author_id,name)}</div>${(p.comments||[]).slice().sort(byDate).map(c=>`<div class="cm">${person(c.author_id,`<b data-nt>${esc(who(c))}</b>`)} <span data-nt>${esc(c.body)}</span> ${c.author_id===me||isStaff()?`<button class="mini" data-act="srvdel" data-t="comments" data-sc="${sc}" data-id="${c.id}">Apagar</button>`:mod('comment',c.id,c.author_id,who(c))}</div>`).join('')}<form class="cmform" data-form="comment" data-sc="${sc}" data-id="${p.id}"><input class="field" id="cm-${p.id}" name="t" placeholder="Comentar" maxlength="200" aria-label="Comentar" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar comentário">${ic(P.send,18)}</button></form></article>`;
}
const feed=(sc,manage,none)=>{const l=C.posts[sc];return l?(l.map(p=>srvPost(p,sc,manage)).join('')||`<div class="empty">${none}</div>`):waiting('posts:'+sc)};
const isMember=g=>(g.group_members||[]).some(m=>m.user_id===S.auth.uid);
const groupCard=g=>{const on=isMember(g),n=(g.group_members||[]).length,mine=g.owner_id===S.auth.uid;return `<button class="menu" data-act="go" data-v="group" data-id="${g.id}"><span class="ic">${ic(P.users,22)}</span><span class="tx"><span class="t">${esc(g.name)}</span><span class="p">${esc(g.description||'')}</span><span style="display:block;margin-top:6px"><span class="tg">${TOPICS[g.topic]?TOPICS[g.topic].label:'Geral'}</span><span class="tg">${n} ${n===1?'membro':'membros'}</span>${mine?'<span class="tg rose">Criado por ti</span>':on?'<span class="tg rose">Estás no grupo</span>':''}</span></span><span class="ch">${ic(P.next,18)}</span></button>`};
const adminLink=()=>isStaff()?menu('shield','Painel de administração','Denúncias, livros e contas','data-act="go" data-v="admin"',1):'';

/* ---------- ecrãs (com sessão usam dados partilhados) ---------- */
function shared(name,html,after){
 const o=V[name];
 V[name]={tab:o.tab,html:p=>{checkOwner();return online()?html(p,o):o.html(p)},after:p=>{if(o.after)o.after(p);if(online()&&after)after(p)}};
}
shared('community',()=>`<div class="page">${head('COMMUNITY','Partilha, descobre e inspira-te.',{noBack:1})}${banner('convivio')}
 ${menu('chat','Publicações','O que se está a partilhar','data-act="go" data-v="posts"')}
 ${menu('user','Encontrar pessoas','Descobre perfis e segue quem gostas.','data-act="go" data-v="people"')}
 ${menu('users','Grupos','Encontra ou cria o teu grupo','data-act="go" data-v="groups"')}
 ${menu('help','Perguntas & Respostas','Pergunta à comunidade','data-act="go" data-v="qa"')}
 ${menu('heart','Os meus interesses',S.interests.length?S.interests.map(k=>TOPICS[k]?TOPICS[k].label:k).join(', '):'Escolhe os teus temas','data-act="go" data-v="interests" data-edit="1"')}
 ${adminLink()}
 <div class="card cream" style="display:flex;gap:12px;align-items:flex-start"><span style="flex:none;color:var(--muted)">${ic(P.shield,24)}</span><p class="p14" style="margin:0">Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora.</p></div></div>`);
let FEED='main';
const feedSeg=()=>`<div class="seg">${[['main','Todas'],['following','Seguidos']].map(x=>`<button class="${FEED===x[0]?'on':''}" data-act="feedtab" data-t="${x[0]}">${x[1]}</button>`).join('')}</div>`;
shared('posts',()=>`<div class="page">${head('Publicações','')}${feedSeg()}${FEED==='main'?composer('main','po-t','Partilha uma ideia, uma dica ou uma pergunta')+feed('main',false,'Ainda não há publicações. Escreve a primeira.'):feed('following',false,'Segue perfis para veres aqui as publicações.<br><button class="link" data-act="go" data-v="people">Encontrar pessoas</button>')}</div>`,()=>load('posts:'+FEED));

/* ---------- seguir e encontrar pessoas ---------- */
const followers=id=>(C.social[id]||[]).filter(f=>f.followed_id===id);
const following=id=>(C.social[id]||[]).filter(f=>f.follower_id===id);
const iFollow=id=>following(S.auth.uid).some(f=>f.followed_id===id);
const followBtn=id=>C.social[S.auth.uid]?`<button class="btn small ${iFollow(id)?'ghost':''}" data-act="follow" data-id="${esc(id)}" aria-pressed="${iFollow(id)}">${iFollow(id)?'A seguir':'Seguir'}</button>`:'';
const stats=id=>{const n=(ok,l)=>ok?l.length:'…',s=C.social[id],p=C.posts['u-'+id],b=t=>`data-act="go" data-v="follows" data-id="${esc(id)}" data-t="${t}"`;return `<div class="stats"><div><b>${n(p,p||[])}</b><span>Publicações</span></div><button ${b('followers')}><b>${n(s,followers(id))}</b><span>Seguidoras</span></button><button ${b('following')}><b>${n(s,following(id))}</b><span>Seguidos</span></button></div>`};
const blockedId=id=>C.blocks.some(b=>b.id===id);
const personRow=(id,a,bio,extra)=>`<div class="prsn">${person(id,face(a,44)+`<span class="tx" data-nt><b>${esc((a&&a.username)||'Utilizadora')}</b>${bio?`<small>${esc(bio)}</small>`:''}</span>`)}${id===S.auth.uid?'':extra||followBtn(id)}</div>`;
const needsLogin=t=>`<div class="page">${head(t,'')}<div class="empty">Entra na tua conta para veres perfis.</div></div>`;
let PQ='',pqTimer=null;
const peopleKey=()=>'people:*'+PQ;
const peopleList=()=>{const l=C.people['*'+PQ];if(!l)return waiting(peopleKey());return l.filter(u=>!blockedId(u.id)).map(u=>personRow(u.id,u,u.bio)).join('')||'<div class="empty">Ninguém encontrado.</div>'};
const paintPeople=()=>{const r=$('#plist');if(r&&online())r.innerHTML=peopleList()};
V.people={tab:'community',html:()=>{checkOwner();if(!online())return needsLogin('Encontrar pessoas');return `<div class="page">${head('Encontrar pessoas','Descobre perfis e segue quem gostas.')}<div class="addrow" style="margin-bottom:12px"><input class="field" id="pq" type="search" value="${esc(PQ)}" placeholder="Procurar por nome" aria-label="Procurar por nome" maxlength="40" data-input="people" autocomplete="off"></div><div id="plist">${peopleList()}</div></div>`},
 after:()=>{if(online()){load('social:'+S.auth.uid);load('blocks');load(peopleKey()).then(paintPeople)}}};
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.input==='people'){PQ=t.value.replace(/[*%_,():"\\]/g,'').trim();clearTimeout(pqTimer);pqTimer=setTimeout(()=>{paintPeople();load(peopleKey()).then(paintPeople)},300)}});
V.follows={tab:'community',html:p=>{checkOwner();const own=online()&&p.id===S.auth.uid,fw=p.t==='followers',title=fw?'Seguidoras':'Seguidos';if(!online())return needsLogin(title);
 const l=C.social[p.id]&&(fw?followers(p.id):following(p.id)).filter(f=>!blockedId(fw?f.follower_id:f.followed_id));
 return `<div class="page">${head(title,'')}${l?(l.map(f=>{const id=fw?f.follower_id:f.followed_id;return personRow(id,fw?f.follower:f.followed,'',own&&fw?followBtn(id)+`<button class="mini" data-act="unfollower" data-id="${esc(id)}">Remover</button>`:'')}).join('')||`<div class="empty">${fw?'Ainda sem seguidoras.':'Ainda não segue ninguém.'}</div>`):waiting('social:'+p.id)}</div>`},
 after:p=>{if(online()){load('social:'+p.id);load('social:'+S.auth.uid);load('blocks')}}};
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
shared('settings',(p,o)=>o.html(p).replace('<h2 class="sec s">SEGURANÇA</h2>',m=>adminLink()+m),()=>load('blocks'));
const myKey=()=>'u-'+S.auth.uid;
shared('me',(p,o)=>{const sc=myKey();return o.html(p).replace('Editar perfil</button>',m=>m+'<button class="btn small" data-act="go" data-v="people">Encontrar pessoas</button>').replace('<div class="prow">',m=>stats(S.auth.uid)+m).replace(/(<h2 class="sec s">AS MINHAS PUBLICAÇÕES<\/h2>)[\s\S]*<\/div>$/,(m,h)=>h+composer(sc,'me-t','Partilha algo no teu perfil')+feed(sc,false,'Ainda não publicaste nada.')+'</div>')},()=>{load('posts:'+myKey());load('social:'+S.auth.uid)});
V.user={tab:'community',html:p=>{checkOwner();if(!online())return `<div class="page">${head('Perfil','')}<div class="empty">Entra na tua conta para veres perfis.</div></div>`;
 const l=C.member[p.id],u=l&&l[0];
 if(!u)return `<div class="page">${head('Perfil','')}${l?'<div class="empty">Este perfil não está disponível.</div>':waiting('member:'+p.id)}</div>`;
 if(C.blocks.some(b=>b.id===p.id))return `<div class="page">${head('Perfil','')}<div class="empty">Bloqueaste esta conta.</div></div>`;
 return `<div class="page">${head('Perfil','')}${profileHead(u.username,face(u,96),u.bio,u.interests)}${stats(u.id)}<div class="prow">${u.id===S.auth.uid?'':followBtn(u.id)}</div><div class="c" style="margin:0 0 18px">${u.id===S.auth.uid?'':mod('profile',u.id,u.id,u.username)}</div><h2 class="sec s">PUBLICAÇÕES</h2>${feed('u-'+p.id,false,'Ainda sem publicações.')}</div>`},
 after:p=>{if(online()){load('member:'+p.id);load('posts:u-'+p.id);load('social:'+p.id);load('social:'+S.auth.uid);load('blocks')}}};


/* ---------- painel de administração ---------- */
const TYPES={post:'Publicação',comment:'Comentário',group:'Grupo',question:'Pergunta',answer:'Resposta',profile:'Perfil',message:'Mensagem',listing:'Anúncio'};
function reportCard(r,d){
 const t=d.targets[r.target_type+r.target_id],author=t&&(r.target_type==='profile'?t.id:(t.author_id||t.owner_id||t.seller_id));
 const hide=['post','group','listing'].indexOf(r.target_type)>=0;
 const table={post:'posts',comment:'comments',group:'groups',question:'questions',answer:'answers',listing:'listings',message:'room_messages'}[r.target_type];
 return `<div class="card"><span class="meta">${TYPES[r.target_type]||r.target_type} · ${ago(r.created_at)} · por ${esc((r.reporter&&r.reporter.username)||'?')}</span><p style="margin:8px 0 4px"><b>${esc(r.reason)}</b></p><p class="p14" style="overflow-wrap:anywhere">${t?esc((t.author?t.author.username+': ':'')+(t.body||t.name||t.title||t.username||'')):'O conteúdo já não existe.'}</p>${t?mediaHTML(t):''}<div class="acts" style="flex-wrap:wrap">${t&&table?`<button class="mini" data-act="${hide?'admhide':'admremove'}" data-t="${table}" data-id="${t.id}" data-r="${r.id}">${hide?'Ocultar':'Apagar conteúdo'}</button>`:''}${author&&S.role==='admin'&&author!==S.auth.uid?`<button class="mini" data-act="sheet" data-s="suspend" data-id="${author}" data-r="${r.id}">Suspender conta</button>`:''}<button class="mini" data-act="admclose" data-r="${r.id}">Arquivar</button></div></div>`;
}
V.admin={tab:'community',html:()=>{
 checkOwner();if(!isStaff())return `<div class="page">${head('Administração','')}<div class="empty">Esta área é só para a equipa.</div></div>`;
 const d=C.admin;if(!d)return `<div class="page">${head('Administração','')}${waiting('admin')}</div>`;
 const sec=(t,l,none)=>`<h2 class="sec s">${t}</h2>${l.join('')||`<div class="empty">${none}</div>`}`;
 return `<div class="page">${head('Administração','O controlo da MAELLE.')}<div class="summary"><div><b>${d.members}</b><span>Contas</span></div><div><b>${d.reports.length}</b><span>Denúncias</span></div><div><b>${d.books.length}</b><span>Livros</span></div></div>
 <button class="btn small ghost" data-act="retry" data-k="admin">Atualizar</button>
 ${sec('DENÚNCIAS POR TRATAR',d.reports.map(r=>reportCard(r,d)),'Sem denúncias por tratar.')}
 ${sec('LIVROS POR APROVAR',d.books.map(b=>`<div class="card"><h3 class="h3">${esc(b.title)}</h3><span class="meta">${esc(b.author)}</span><p class="p14">${esc(b.blurb||'')}</p><div class="acts"><button class="mini" data-act="admbook" data-id="${b.id}">Aprovar</button><button class="mini" data-act="admremove" data-t="books" data-id="${b.id}">Rejeitar</button></div></div>`),'Nenhum livro à espera.')}
 ${sec('CONTEÚDO OCULTO',d.posts.map(x=>`<div class="item"><span class="tx">${esc(x.body)}<small>${esc(who(x))}</small>${mediaHTML(x)}</span><button class="mini" data-act="admshow" data-t="posts" data-id="${x.id}">Repor</button></div>`).concat(d.groups.map(g=>`<div class="item"><span class="tx">${esc(g.name)}<small>Grupo</small></span><button class="mini" data-act="admshow" data-t="groups" data-id="${g.id}">Repor</button></div>`),(d.listings||[]).map(x=>`<div class="item"><span class="tx">${esc(x.title)}<small>Anúncio</small></span><button class="mini" data-act="admshow" data-t="listings" data-id="${x.id}">Repor</button></div>`)),'Nada oculto.')}
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
both(FORM,'post',(fd,f)=>{const t=fd.get('t').trim(),sc=f.dataset.sc,mine=draft.sc===sc,img=mine?draft.img:'',vid=mine?draft.vid:null;if(!t&&!img&&!vid)return;
 if(vid&&!working)toast('A enviar o vídeo…');
 send(f,async()=>{const body={author_id:S.auth.uid,group_id:sc==='main'||sc.startsWith('u-')?null:sc,body:t};if(img)body.image_url=await uploadImage(img,'post');if(vid)body.video_url=await uploadVideo(vid);
  try{await add('posts',body)}catch(e){await dropMedia([body.image_url,body.video_url]);throw e}clearDraft()},'Publicado',[pkey(sc)])});
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
ACT.srvblock=d=>act(()=>add('blocks',{blocker_id:S.auth.uid,blocked_id:d.id}),'Conta bloqueada',['blocks']).then(ok=>{if(ok){C.posts={};C.qa=null;C.social={};C.people={};render(true)}});
ACT.srvlike=d=>{const p=(C.posts[d.sc]||[]).find(x=>x.id===d.id);if(!p)return;const on=p.post_likes.some(l=>l.user_id===S.auth.uid);
 act(()=>on?remove('post_likes?post_id=eq.'+d.id+'&user_id=eq.'+S.auth.uid):add('post_likes',{post_id:d.id,user_id:S.auth.uid}),'',[pkey(d.sc)])};
/* ficheiros de uma publicação saem também do armazenamento */
async function dropMedia(urls){const l=urls.map(safeImg).filter(Boolean).map(u=>u.split('/public/media/')[1]);if(l.length)await api('/storage/v1/object/media',{method:'DELETE',body:{prefixes:l}}).catch(e=>console.warn(e.message))}
ACT.srvdel=d=>act(async()=>{const p=d.t==='posts'&&(C.posts[d.sc]||[]).find(x=>x.id===d.id);await remove(d.t+'?id=eq.'+d.id);
 if(p&&p.author_id===S.auth.uid)await dropMedia([p.image_url,p.video_url])},'Apagado',[d.sc?pkey(d.sc):'qa']);
ACT.feedtab=d=>{FEED=d.t;render();load('posts:'+FEED)};
const socialKeys=id=>['social:'+S.auth.uid,'social:'+id].concat(cur().v==='posts'?['posts:following']:[]);
ACT.follow=d=>{const me=S.auth.uid,on=iFollow(d.id);act(()=>on?remove('follows?follower_id=eq.'+me+'&followed_id=eq.'+d.id):add('follows',{follower_id:me,followed_id:d.id}),on?'Deixaste de seguir':'Começaste a seguir',socialKeys(d.id)).then(paintPeople)};
ACT.unfollower=d=>act(()=>remove('follows?follower_id=eq.'+d.id+'&followed_id=eq.'+S.auth.uid),'Seguidora removida',socialKeys(d.id));
ACT.retry=d=>load(d.k,true);
ACT.admhide=d=>act(async()=>{await patch(d.t+'?id=eq.'+d.id,{status:'hidden'});await closeReport(d.r,'actioned')},'Conteúdo ocultado',['admin']);
ACT.admshow=d=>act(()=>patch(d.t+'?id=eq.'+d.id,{status:d.t==='posts'?'visible':'active'}),'Conteúdo reposto',['admin']);
ACT.admremove=d=>act(async()=>{await remove(d.t+'?id=eq.'+d.id);if(d.r)await closeReport(d.r,'actioned')},d.t==='books'?'Livro rejeitado':'Conteúdo apagado',['admin']);
ACT.admclose=d=>act(()=>closeReport(d.r,'dismissed'),'Denúncia arquivada',['admin']);
ACT.admbook=d=>act(()=>patch('books?id=eq.'+d.id,{approved:true}),'Livro aprovado',['admin','books']);
ACT.admban=d=>act(async()=>{await setBan(d.id,true);await closeReport(d.r,'actioned')},'Conta suspensa',['admin']);
ACT.admunban=d=>act(()=>setBan(d.id,false),'Conta reativada',['admin']);

/* ---------- loja ---------- */
const loadShop=()=>load('shop');
const noSamples=h=>h.replace('Produtos, serviços e marcas de exemplo. A compra online liga-se numa próxima fase.','Para comprar ou reservar, contacta quem vende. O pagamento na app chega numa próxima fase.').replace('Os anúncios de exemplo são fictícios. A venda com pagamento liga-se numa próxima fase.','Para comprar, contacta quem vende.');
const shopStatus=()=>C.shop?'':waiting('shop');
['edit','shop','brands','sell','favs','recs'].forEach(n=>shared(n,(p,o)=>noSamples(o.html(p)).replace(/<\/div>$/,()=>shopStatus()+'</div>'),loadShop));
const listing=body=>add('listings',Object.assign({seller_id:S.auth.uid},body));
const cents=v=>{const n=num(v);return isNaN(n)||n<0||n>1000000?null:Math.round(n*100)};
/* envia a foto (se houver) e cria o anúncio */
async function publish(body){const img=tmpImg;if(img)body.image_url=await uploadImage(img,'anuncio');await listing(body)}
function posted(f,body,msg,then){act(()=>publish(body),msg,['shop']).then(ok=>{if(ok){tmpImg=null;if(then)then()}})}
both(FORM,'addprod',(fd,f)=>{const n=fd.get('n').trim(),c=cents(fd.get('price')),ct=(fd.get('contact')||'').trim();let link=fd.get('link').trim();if(link&&!/^https?:\/\//i.test(link))link='https://'+link;
 if(!n)return ferr(f,'Dá um nome ao produto.');if(c===null)return ferr(f,'Indica o preço em euros.');if(!ct&&!link)return ferr(f,'Indica um contacto ou o link da loja.');
 posted(f,{kind:'product',title:n,author:fd.get('bn').trim()||null,price_cents:c,category:fd.get('c'),description:fd.get('d').trim()||null,link:link||null,contact:ct||null},'Produto publicado',()=>{SF={t:'prod',c:'all',b:null,sc:'all'};render(true)})});
both(FORM,'addsvc',(fd,f)=>{const n=fd.get('n').trim(),c=cents(fd.get('price')),d=fd.get('d').trim(),ct=fd.get('contact').trim();
 if(!n)return ferr(f,'Dá um nome ao serviço.');if(c===null)return ferr(f,'Indica o preço desde, em euros.');if(!d)return ferr(f,'Explica o que inclui o serviço.');if(!ct)return ferr(f,'Indica um contacto para quem quiser falar contigo.');
 posted(f,{kind:'service',title:n,price_cents:c,category:fd.get('c'),mode:fd.get('mode'),city:fd.get('city').trim()||null,description:d,contact:ct},'Serviço publicado',()=>{SF={t:'svc',c:'all',b:null,sc:'all'};if(cur().v!=='shop'&&cur().v!=='sell')go('shop');else render(true)})});
both(FORM,'addsale',(fd,f)=>{const t=fd.get('t').trim(),c=cents(fd.get('price')),ct=fd.get('contact').trim();
 if(!t)return ferr(f,'Indica o título do livro.');if(c===null)return ferr(f,'Indica o preço em euros.');if(!ct)return ferr(f,'Indica um contacto para quem quiser comprar.');
 tmpImg=null;posted(f,{kind:'book',title:t,author:fd.get('a').trim()||null,price_cents:c,condition:fd.get('cond'),city:fd.get('city').trim()||null,contact:ct},'Livro anunciado',()=>{BK='sale';if(['sell','bookclub'].indexOf(cur().v)<0)go('bookclub');else render(true)})});
const localAddprod=SHEETS.addprod;
SHEETS.addprod=function(){localAddprod();if(online()){const l=$('#ap-l');if(l)l.insertAdjacentHTML('afterend','<input class="field" id="ap-ct" name="contact" placeholder="Contacto: e-mail, telefone ou link" maxlength="120" aria-label="Contacto">')}};
/* janela de um anúncio: contacto, denúncia e bloqueio */
['product','service','sale'].forEach(kind=>{const o=SHEETS[kind];SHEETS[kind]=d=>{o(d);if(!online())return;
 const x=kind==='sale'?S.sales.find(y=>y.id===d.id):findItem(d.id),box=$('#sheet .sheet');if(!x||!box)return;
 box.querySelectorAll('[data-s="report"]').forEach(e=>e.parentElement.remove());
 const note=box.querySelector('.note');if(note)note.textContent=x.mine?'Anúncio teu.':'Para comprar ou reservar, contacta quem vende. Nunca pagues sem confirmares com quem falas.';
 if(kind==='product'&&x.contact){const s=box.querySelector('.stack');s.insertAdjacentHTML('afterbegin',contactHTML(x.contact))}
 if(!x.mine)box.insertAdjacentHTML('beforeend',`<p class="meta c" style="margin-top:12px">Vendido por ${esc(x.seller)}</p><div class="c">${mod('listing',x.id,x.sid,x.seller)}</div>`)}});
both(ACT,'delmine',d=>act(()=>remove('listings?id=eq.'+d.id),'Anúncio apagado',['shop']));
function toggleRow(on,table,filter,body,msg,d){return act(()=>on?remove(table+'?'+filter):add(table,body),msg,['shop']).then(async ok=>{if(ok){await load('shop',true);if(d&&d.sheet){const it=findItem(d.id);if(it)(it.by?SHEETS.service:SHEETS.product)({id:d.id})}}})}
both(ACT,'fav',d=>{const on=S.favs.includes(d.id),me=S.auth.uid;toggleRow(on,'favorites','user_id=eq.'+me+'&listing_id=eq.'+d.id,{user_id:me,listing_id:d.id},on?'Removido dos favoritos':'Guardado nos favoritos',d)});
both(ACT,'brand',d=>{const on=S.brands.includes(d.id),me=S.auth.uid;toggleRow(on,'brand_follows','user_id=eq.'+me+'&brand_id=eq.'+d.id,{user_id:me,brand_id:d.id},on?'':'A seguir')});

/* ---------- clube de livros ---------- */
const findRoom=id=>C.rooms&&C.rooms.rooms.find(r=>r.id===id||r.book_id===id);
shared('bookclub',(p,o)=>{
 if(BK!=='chat'){const key=BK==='sale'?'shop':'books',h=noSamples(o.html(p));return C[key]?h:h.replace(/<\/div>$/,()=>waiting(key)+'</div>')}
 const seg=`<div class="seg">${[['rec','Indicações'],['sale','À venda'],['chat','Conversas']].map(x=>`<button class="${BK===x[0]?'on':''}" data-act="bk" data-t="${x[0]}">${x[1]}</button>`).join('')}</div>`;
 const body=C.rooms?C.rooms.rooms.map(r=>{const last=C.rooms.last.find(m=>m.room_id===r.id);return `<button class="menu" data-act="go" data-v="room" data-id="${r.id}"><span class="ic">${ic(P.chat,22)}</span><span class="tx"><span class="t">${esc(r.title)}</span><span class="p">${last?esc(who(last)+': '+last.body.slice(0,56)):'Sê a primeira a escrever'}</span></span></button>`}).join(''):waiting('rooms');
 return `<div class="page">${head('Clube de Livros','Descobre, troca e conversa sobre livros.')}${banner('livros')}${seg}<button class="btn" data-act="sheet" data-s="newroom" style="margin-bottom:16px">${ic(P.plus,18)} Começar uma conversa</button>${body}</div>`},
 ()=>load({rec:'books',sale:'shop',chat:'rooms'}[BK]));
shared('room',p=>{
 const r=findRoom(p.id);if(!r)return `<div class="page">${head('Conversa','')}${C.rooms?'<div class="empty">Esta conversa ainda não está disponível. Os livros só têm sala depois de aprovados.</div>':waiting('rooms')}</div>`;
 const ms=C.msgs[r.id];
 return `<div class="page">${head(esc(r.title),'Conversa aberta às leitoras. Respeito acima de tudo.')}<div class="msgs">${ms?(ms.slice().sort(byDate).map(m=>{const mine=m.author_id===S.auth.uid;return `<div class="m ${mine?'me':''}"><b>${esc(who(m))}</b>${esc(m.body)}<div>${mine||isStaff()?`<button class="mini" data-act="srvmsgdel" data-r="${r.id}" data-id="${m.id}">Apagar</button>`:''}${mine?'':mod('message',m.id,m.author_id,who(m))}</div></div>`}).join('')||'<div class="empty">Ainda ninguém escreveu aqui. Começa tu.</div>'):waiting('msgs:'+r.id)}</div>
 <form class="cmform" data-form="msg" data-r="${r.id}"><input class="field" id="rm-t" name="t" placeholder="Escreve uma mensagem" maxlength="300" aria-label="Mensagem" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar mensagem">${ic(P.send,18)}</button></form></div>`},
 p=>{load('rooms').then(()=>{const r=findRoom(p.id);if(r&&cur().v==='room')load('msgs:'+r.id)})});
both(FORM,'msg',(fd,f)=>{const t=fd.get('t').trim(),r=f.dataset.r;if(t)send(f,()=>add('room_messages',{room_id:r,author_id:S.auth.uid,body:t}),'',['msgs:'+r,'rooms'])});
both(FORM,'newroom',(fd,f)=>{const n=fd.get('n').trim(),t=fd.get('t').trim();if(!n)return ferr(f,'Dá um tema à conversa.');if(!t)return ferr(f,'Escreve a primeira mensagem.');
 const id=uid();act(async()=>{await add('book_rooms',{id:id,title:n,created_by:S.auth.uid});await add('room_messages',{room_id:id,author_id:S.auth.uid,body:t})},'Conversa criada').then(async ok=>{if(ok){await load('rooms',true);go('room',{id:id})}})});
ACT.srvmsgdel=d=>act(()=>remove('room_messages?id=eq.'+d.id),'Apagado',['msgs:'+d.r,'rooms']);
both(ACT,'shelf',d=>{const me=S.auth.uid,on=S.shelf[d.id]===d.s;act(()=>on?remove('shelves?user_id=eq.'+me+'&book_id=eq.'+d.id):add('shelves?on_conflict=user_id,book_id',{user_id:me,book_id:d.id,status:d.s},'resolution=merge-duplicates,return=minimal'),'',['books'])});
/* mudar de separador no clube carrega os dados certos */
const bkTab=ACT.bk;ACT.bk=d=>{bkTab(d);if(online())load({rec:'books',sale:'shop',chat:'rooms'}[BK])};
