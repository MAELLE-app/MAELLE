'use strict';
/* Ligação ao Supabase: contas, perfil e My Place.
   A chave "publishable" é pública por natureza; a proteção dos dados é feita pelas regras RLS.
   NUNCA colocar aqui a chave "secret" / "service_role". */
const SB_URL='https://bgfnsnxaugvsscdctwse.supabase.co';
const SB_KEY='sb_publishable_P_ivPyCIXrjxQVJUycNWCg_MrkqpTeZ';
const isUUID=s=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s||'');
const online=()=>!!(S.auth&&S.auth.uid);

/* ---------- pedidos ---------- */
async function sbFetch(path,o){
 o=o||{};const h=Object.assign({apikey:SB_KEY},o.headers||{});
 if(o.token)h.Authorization='Bearer '+o.token;
 let body=o.body;
 if(body!==undefined&&!(body instanceof Blob)){h['Content-Type']='application/json';body=JSON.stringify(body)}
 let r;try{r=await fetch(SB_URL+path,{method:o.method||'GET',headers:h,body:body})}catch(e){const x=new Error('Sem ligação à internet.');x.offline=true;throw x}
 const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
 if(!r.ok){const x=new Error((j&&(j.msg||j.message||j.error_description||j.error))||('Erro '+r.status));x.status=r.status;x.code=j&&(j.error_code||j.code);throw x}
 return j;
}
let refreshing=null;
async function token(){
 if(!online())throw new Error('Sem sessão');
 if(Date.now()<S.auth.exp-60000)return S.auth.at;
 if(!refreshing)refreshing=(async()=>{
  const uidNow=S.auth.uid;
  try{const j=await sbFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:S.auth.rt}});
   if(online()&&S.auth.uid===uidNow){setTokens(j);save()}}
  catch(e){if(e.status===400||e.status===401){S.auth=null;S.session=false;save();stack=[{v:'login',p:{}}];render();toast('A sessão expirou. Entra de novo.')}throw e}
 })().finally(()=>{refreshing=null});
 await refreshing;return S.auth.at;
}
const api=async(path,o)=>sbFetch(path,Object.assign({},o,{token:await token()}));
function setTokens(j){S.auth={uid:j.user.id,email:j.user.email,at:j.access_token,rt:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000}}
function authMsg(e){
 const m=String(e.message||'').toLowerCase(),c=String(e.code||'');
 if(e.offline)return e.message;
 if(c==='email_not_confirmed'||m.includes('not confirmed'))return 'Falta confirmar o e-mail. Abre a mensagem que te enviámos.';
 if(c==='invalid_credentials'||m.includes('invalid login'))return 'E-mail ou palavra-passe não coincidem.';
 if(c==='user_already_exists'||m.includes('already registered'))return 'Já existe uma conta com este e-mail.';
 if(c==='weak_password'||m.includes('password should'))return 'Escolhe uma palavra-passe mais forte.';
 if(e.status===429)return 'Demasiadas tentativas. Espera um pouco e volta a tentar.';
 return 'Não foi possível concluir. Tenta novamente.';
}

/* ---------- correspondência entre a app e a base de dados ---------- */
const TABLES=[
 {k:'tasks',t:'tasks',order:'created_at.desc',
  to:x=>({id:x.id,title:x.t,done:!!x.done}),from:r=>({id:r.id,t:r.title,done:r.done})},
 {k:'events',t:'events',order:'day.asc',
  to:x=>({id:x.id,title:x.t,day:x.date,at_time:x.time||null,note:x.note||null}),from:r=>({id:r.id,t:r.title,date:r.day,time:(r.at_time||'').slice(0,5),note:r.note||''})},
 {k:'goals',t:'goals',order:'created_at.desc',
  to:x=>({id:x.id,title:x.t,due:x.date||null,progress:x.p||0}),from:r=>({id:r.id,t:r.title,date:r.due||'',p:r.progress})},
 {k:'habits',t:'habits',order:'created_at.asc',
  to:x=>({id:x.id,title:x.t}),from:r=>({id:r.id,t:r.title,days:[]})},
 {k:'wishes',t:'wishlist',order:'created_at.desc',
  to:x=>({id:x.id,title:x.t,price_cents:Math.min(2000000000,Math.max(0,Math.round((x.price||0)*100))),bought:!!x.bought,src:x.src||null}),
  from:r=>{const w={id:r.id,t:r.title,price:(r.price_cents||0)/100,bought:r.bought};if(r.src)w.src=r.src;return w}},
 {k:'journal',t:'journal',order:'created_at.asc',
  to:x=>({id:x.id,day:x.date,prompt:x.p||null,body:x.t}),from:r=>({id:r.id,date:r.day,p:r.prompt||'',t:r.body})}
];
const emptySnap=()=>({tasks:{},events:{},goals:{},habits:{},wishes:{},journal:{},logs:{},interests:'[]'});
function snapshot(){
 const s=emptySnap();
 TABLES.forEach(c=>S[c.k].forEach(x=>{if(isUUID(x.id))s[c.k][x.id]=JSON.stringify(c.to(x))}));
 S.habits.forEach(h=>{if(isUUID(h.id))h.days.forEach(d=>{s.logs[h.id+'|'+d]=1})});
 s.interests=JSON.stringify(S.interests);return s;
}
/* comparação independente da ordem das chaves */
const canon=s=>JSON.stringify(s,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((o,i)=>(o[i]=v[i],o),{}):v);
const pending=()=>online()&&canon(snapshot())!==canon(S.snap);

/* ---------- enviar alterações ---------- */
let flushing=null,timer=null,syncWarned=false;
function scheduleSync(){if(!online())return;clearTimeout(timer);timer=setTimeout(()=>flush().catch(syncError),400)}
function syncError(e){if(!syncWarned&&online()){syncWarned=true;toast(e.offline?'Sem internet. Guardamos quando voltares.':'Não foi possível guardar online. Vamos tentar de novo.')}console.warn('sync',e.status||'',e.message)}
function flush(){
 if(flushing)return flushing.then(flush);
 if(!pending())return Promise.resolve();
 flushing=(async()=>{
  const owner=S.auth.uid,now=snapshot(),old=S.snap;
  const same=()=>online()&&S.auth.uid===owner;
  const done=fn=>{if(!same())throw new Error('Sessão alterada');fn();store()};
  for(const c of TABLES){
   const up=Object.keys(now[c.k]).filter(id=>now[c.k][id]!==old[c.k][id]);
   if(up.length){await api('/rest/v1/'+c.t+'?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:up.map(id=>Object.assign({owner_id:owner},JSON.parse(now[c.k][id])))});
    done(()=>up.forEach(id=>{old[c.k][id]=now[c.k][id]}))}
   const del=Object.keys(old[c.k]).filter(id=>!(id in now[c.k]));
   if(del.length){await api('/rest/v1/'+c.t+'?id=in.('+del.join(',')+')',{method:'DELETE'});
    done(()=>del.forEach(id=>{delete old[c.k][id];if(c.k==='habits')Object.keys(old.logs).forEach(l=>{if(l.startsWith(id+'|'))delete old.logs[l]})}))}
  }
  const add=Object.keys(now.logs).filter(l=>!old.logs[l]);
  if(add.length){await api('/rest/v1/habit_logs?on_conflict=habit_id,day',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:add.map(l=>{const a=l.split('|');return {habit_id:a[0],day:a[1]}})});
   done(()=>add.forEach(l=>{old.logs[l]=1}))}
  for(const l of Object.keys(old.logs).filter(l=>!now.logs[l])){const a=l.split('|');await api('/rest/v1/habit_logs?habit_id=eq.'+a[0]+'&day=eq.'+a[1],{method:'DELETE'});done(()=>{delete old.logs[l]})}
  if(now.interests!==old.interests){await api('/rest/v1/profiles?id=eq.'+owner,{method:'PATCH',headers:{Prefer:'return=minimal'},body:{interests:JSON.parse(now.interests)}});done(()=>{old.interests=now.interests})}
  syncWarned=false;
 })().finally(()=>{flushing=null});
 return flushing.then(()=>{if(pending())return flush()});
}

/* ---------- receber dados ---------- */
async function pull(){
 await flush();
 const owner=S.auth.uid,before=canon(snapshot());
 const rows=await Promise.all(TABLES.map(c=>api('/rest/v1/'+c.t+'?select=*&owner_id=eq.'+owner+'&order='+c.order)));
 const prof=await api('/rest/v1/profiles?id=eq.'+owner+'&select=username,bio,avatar_url,interests,role');
 const habitIds=rows[3].map(r=>r.id);
 const logs=habitIds.length?await api('/rest/v1/habit_logs?select=habit_id,day&habit_id=in.('+habitIds.join(',')+')&order=day.desc&limit=1000'):[];
 if(!online()||S.auth.uid!==owner)return false;
 if(canon(snapshot())!==before)return pull();
 if(!prof.length)throw new Error('Perfil não encontrado');
 const view=()=>canon([snapshot(),S.profile]),was=view();
 TABLES.forEach((c,i)=>{const local=S[c.k].filter(x=>!isUUID(x.id));S[c.k]=rows[i].map(c.from).concat(local)});
 logs.forEach(l=>{const h=S.habits.find(x=>x.id===l.habit_id);if(h)h.days.push(l.day)});
 const p=prof[0],photo=String(p.avatar_url||'');
 S.profile={username:p.username,bio:p.bio||'',photo:photo.startsWith(SB_URL+'/storage/v1/object/public/media/')&&!/["'<>\s]/.test(photo)?photo:''};
 S.interests=p.interests||[];S.role=p.role;if(S.interests.length)S.onboarded=true;
 S.snap=snapshot();store();return view()!==was;
}

/* ---------- conta ---------- */
function resetLocal(){const b=S.blocked18;S=D();S.blocked18=b;seed()}
async function startSession(j){
 const prev=S.owner,keep=prev===j.user.id;
 if(!keep)resetLocal();
 setTokens(j);S.owner=j.user.id;S.session=true;S.age18=true;
 S.user={name:(j.user.user_metadata||{}).name||'',email:j.user.email};
 if(!S.snap)S.snap=emptySnap();
 try{await pull()}catch(e){S.auth=null;S.session=false;save();throw e}
 save();closeSheet();stack=[{v:S.onboarded?'home':'profile',p:{}}];render();
}
const makeUsername=name=>{const b=name.replace(/\s+/g,' ').trim().slice(0,23)||'maelle';return b+'_'+Math.random().toString(36).slice(2,7)};
const appURL=()=>location.origin+location.pathname;
async function signUp(name,email,pw,dob){
 const j=await sbFetch('/auth/v1/signup?redirect_to='+encodeURIComponent(appURL()),{method:'POST',body:{email:email,password:pw,data:{name:name,username:makeUsername(name),birth_date:dob}}});
 if(j&&j.access_token){await startSession(j);return true}
 return false;
}
const signIn=async(email,pw)=>startSession(await sbFetch('/auth/v1/token?grant_type=password',{method:'POST',body:{email:email,password:pw}}));
const recover=email=>sbFetch('/auth/v1/recover?redirect_to='+encodeURIComponent(appURL()),{method:'POST',body:{email:email}});
async function uploadImage(dataURL){
 const bin=atob(dataURL.split(',')[1]),buf=Uint8Array.from(bin,c=>c.charCodeAt(0));
 const path=S.auth.uid+'/avatar-'+Date.now()+'.jpg';
 await api('/storage/v1/object/media/'+path,{method:'POST',headers:{'Content-Type':'image/jpeg'},body:new Blob([buf],{type:'image/jpeg'})});
 return SB_URL+'/storage/v1/object/public/media/'+path;
}
async function saveProfile(username,bio,newPhoto){
 const body={username:username,bio:bio};
 if(newPhoto)body.avatar_url=await uploadImage(newPhoto);
 await api('/rest/v1/profiles?id=eq.'+S.auth.uid,{method:'PATCH',headers:{Prefer:'return=minimal'},body:body});
 S.profile={username:username,bio:bio,photo:body.avatar_url||S.profile.photo};
}
let forceOut=false;
async function signOut(){
 try{await flush()}catch(e){if(!forceOut){forceOut=true;toast('Há alterações por guardar. Toca outra vez para sair e perdê-las.');return}}
 forceOut=false;
 try{await api('/auth/v1/logout?scope=local',{method:'POST'})}catch(e){}
 resetLocal();save();stack=[{v:'welcome',p:{}}];render();
}
async function deleteAccount(){
 await api('/rest/v1/rpc/delete_my_account',{method:'POST',body:{}});
 resetLocal();save();
}

/* ---------- ligações recebidas por e-mail e arranque ---------- */
async function fromEmailLink(){
 const h=new URLSearchParams(location.hash.slice(1));
 if(!h.get('access_token')&&!h.get('error'))return;
 history.replaceState(null,'',location.pathname+location.search);
 if(h.get('error')){toast('Essa ligação já não é válida. Pede uma nova.');return}
 const at=h.get('access_token'),user=await sbFetch('/auth/v1/user',{token:at});
 await startSession({access_token:at,refresh_token:h.get('refresh_token'),expires_in:Number(h.get('expires_in'))||3600,user:user});
 if(h.get('type')==='recovery')SHEETS.newpw();else toast('E-mail confirmado');
}
async function refreshData(){
 if(!online())return;
 try{const changed=await pull();
  /* não redesenhar enquanto a pessoa escreve */
  const a=document.activeElement;
  if(changed&&!(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))&&['splash','profile'].indexOf(cur().v)<0)render(true)}
 catch(e){syncError(e)}
}
function startSupabase(){
 fromEmailLink().catch(e=>toast(authMsg(e))).then(refreshData);
 window.addEventListener('online',refreshData);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshData()});
}
