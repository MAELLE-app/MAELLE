'use strict';
/* Receitas e ideias de casa: página completa de cada uma e partilha entre utilizadoras */
const KINDS={receitas:{kind:'recipe',title:'Receitas da comunidade',btn:'Partilhar receita',items:'Ingredientes',steps:'Preparação',name:'Nome da receita',itemsPh:'Ingredientes, um por linha',stepsPh:'Preparação, um passo por linha',none:'Ainda não há receitas partilhadas. Sê a primeira.'},
 decoracao:{kind:'home',title:'Ideias da comunidade',btn:'Partilhar ideia',items:'O que precisas',steps:'Como fazer',name:'Nome da ideia',itemsPh:'O que precisas, um por linha (opcional)',stepsPh:'Como fazer, um passo por linha',none:'Ainda não há ideias partilhadas. Sê a primeira.'}};
const topicOfKind=k=>k==='recipe'?'receitas':'decoracao';
const lines=t=>String(t||'').split('\n').map(x=>x.trim()).filter(Boolean);
const lists=(c,items,steps,own)=>{const nt=own?' data-nt':'';return `${items.length?`<h2 class="sec s">${c.items.toUpperCase()}</h2><ul class="ings">${items.map(x=>`<li${nt}>${own?esc(x):x}</li>`).join('')}</ul>`:''}<h2 class="sec s">${c.steps.toUpperCase()}</h2><ol class="steps">${steps.map(x=>`<li${nt}>${own?esc(x):x}</li>`).join('')}</ol>`};
/* dentro de uma publicação partilhada */
function sharedBody(p){
 if(p.kind!=='recipe'&&p.kind!=='home')return '';
 const c=KINDS[topicOfKind(p.kind)];
 return `<details class="shared" ${cur().v==='post'?'open':''}><summary>${p.kind==='recipe'?'Ver receita':'Ver ideia'}</summary>${lists(c,lines(p.items),lines(p.details),true)}</details>`;
}
const sharedCard=(p,sc)=>{const img=safeImg(p.image_url),likes=(p.post_likes||[]).length;return `<button class="scard" data-act="go" data-v="post" data-id="${esc(p.id)}" data-sc="${sc}">${img?`<img src="${img}" alt="" loading="lazy">`:''}<span class="t" data-nt>${esc(p.title||'')}</span><small><span data-nt>${esc(who(p))}</span> · ${ic(P.heart,12)} ${likes} · ${ic(P.chat,12)} ${(p.comments||[]).length}</small></button>`};
function sharedSection(k){
 const c=KINDS[k];if(!c)return '';
 const head2=`<h2 class="sec s">${c.title.toUpperCase()}</h2>`;
 if(!online())return head2+`<div class="empty">Entra na tua conta para veres e partilhares com a comunidade.<br><button class="link" data-act="go" data-v="login">Entrar</button></div>`;
 const sc='kind-'+c.kind,l=C.posts[sc];
 return head2+`<button class="btn" data-act="sheet" data-s="share" data-k="${k}" style="margin-bottom:14px">${ic(P.plus,18)} ${c.btn}</button>`+(l?(l.length?`<div class="sgrid">${l.map(p=>sharedCard(p,sc)).join('')}</div>`:`<div class="empty">${c.none}</div>`):waiting('posts:'+sc));
}
function loadShared(k){if(KINDS[k]&&online()){load('posts:kind-'+KINDS[k].kind);load('blocks')}}

V.idea={tab:'home',html:p=>{
 const i=IDEAS[p.id],d=DETAIL[p.id];if(!i||!d)return `<div class="page">${head('Ideia','')}</div>`;
 const c=KINDS[i.k],on=S.saved.includes(i.id);
 return `<div class="page">${head(i.t,i.d,{right:`<button class="heart ${on?'on':''}" data-act="saveidea" data-id="${i.id}" aria-pressed="${on}" aria-label="Guardar ideia">${ic(P.heart)}</button>`})}
 <div class="hero">${photoImg(IMG[i.id],'',960)}<i class="ilus">Imagem ilustrativa</i></div><p class="note">${d.meta}</p>
 ${d.photos?`<div class="inspo">${d.photos.map(k=>`<button data-act="zoom" data-k="${k}" aria-label="Ampliar imagem">${photoImg(k,'',330)}</button>`).join('')}</div>`:''}
 ${lists(c,d.items,d.steps)}<button class="btn ghost mt" data-act="go" data-v="topic" data-k="${i.k}">${c.title}</button></div>`}};
ACT.zoom=d=>sheet(`<div class="hero">${photoImg(d.k,'',960)}</div><button class="btn ghost" data-act="close">Fechar</button>`);

SHEETS.share=d=>{const c=KINDS[d.k];tmpImg=null;sheet(`<h2 class="h2">${c.btn}</h2><form data-form="share" data-k="${d.k}" class="stack" novalidate><label class="pimg pick" for="pimgin" id="pimgprev">${ic(P.cam,22)}<span>Adicionar foto</span></label><input type="file" id="pimgin" accept="image/*" hidden data-change="tmpimg"><input class="field" id="sh-t" name="t" placeholder="${c.name}" maxlength="80" aria-label="${c.name}"><textarea class="field" id="sh-i" name="i" placeholder="${c.itemsPh}" maxlength="1500" aria-label="${c.items}"></textarea><textarea class="field" id="sh-s" name="s" placeholder="${c.stepsPh}" maxlength="3000" aria-label="${c.steps}"></textarea><p class="note" style="margin:0">Partilha só fotografias e textos teus.</p><p class="err" role="alert"></p><button class="btn" type="submit">Publicar</button></form>`)};
FORM.share=(fd,f)=>{
 const c=KINDS[f.dataset.k],t=fd.get('t').trim(),i=fd.get('i').trim(),s=fd.get('s').trim(),img=tmpImg,sc='kind-'+c.kind;
 if(!online())return ferr(f,'Entra na tua conta para partilhares.');
 if(!img)return ferr(f,'Adiciona uma fotografia.');
 if(t.length<3)return ferr(f,'Escreve um nome com pelo menos 3 letras.');
 if(c.kind==='recipe'&&i.length<3)return ferr(f,'Escreve os ingredientes.');
 if(s.length<3)return ferr(f,'Explica os passos.');
 act(async()=>{const body={author_id:S.auth.uid,kind:c.kind,title:t,items:i||null,details:s,body:'',image_url:await uploadImage(img,'post')};
  try{await add('posts',body)}catch(e){await dropMedia([body.image_url]);throw e}tmpImg=null},'Publicado',['posts:'+sc]);
};
