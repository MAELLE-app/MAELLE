'use strict';
/* ---------- utilitários ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>crypto.randomUUID?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>iso(new Date());
const MONTHS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const longDate=s=>{const a=s.split('-').map(Number);return a[2]+' de '+MONTHS[a[1]-1]};
const eur=n=>n.toFixed(2).replace('.',',')+' €';
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const ageOf=s=>{const b=new Date(s),n=new Date();let a=n.getFullYear()-b.getFullYear();const m=n.getMonth()-b.getMonth();if(m<0||(m===0&&n.getDate()<b.getDate()))a--;return a};
const ic=(p,s)=>`<svg width="${s||22}" height="${s||22}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const star=(s,c)=>`<svg width="${s}" height="${Math.round(s*1.5)}" viewBox="0 0 40 60" aria-hidden="true"><path fill="${c||'var(--sand)'}" d="M20 0C21.5 18 24 24 40 30C24 36 21.5 42 20 60C18.5 42 16 36 0 30C16 24 18.5 18 20 0Z"/></svg>`;
const P={
 video:'<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',
 gear:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 plan:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4"/>',
 club:'<path d="M12 3c.8 5 2.6 7.2 8 9-5.4 1.8-7.2 4-8 9-.8-5-2.6-7.2-8-9 5.4-1.8 7.2-4 8-9z"/>',
 chat:'<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
 bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 heart:'<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>', next:'<path d="M9 5l7 7-7 7"/>', plus:'<path d="M12 5v14M5 12h14"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', check:'<path d="M5 12l5 5 9-10"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 repeat:'<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
 gift:'<rect x="3" y="8" width="18" height="4"/><path d="M12 8v13M5 12v9h14v-9M12 8c-2-4-6-3-5 0 .5 1.5 3 1.5 5 0zM12 8c2-4 6-3 5 0-.5 1.5-3 1.5-5 0z"/>',
 grid:'<path d="M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
 reel:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
 lines:'<path d="M5 6h14M5 12h14M5 18h9"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 pen:'<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
 flower:'<circle cx="12" cy="12" r="3"/><path d="M12 9V3M12 15v6M9 12H3M15 12h6"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-4 3.2-5.5 6.5-5.5s5.7 1.5 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .6 3.2 2.2 3.5 5.2"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 send:'<path d="M4 12l16-8-6 16-3-7z"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7"/>',
 hanger:'<path d="M12 7a2 2 0 1 0-2-2M12 7v2l9 6a1 1 0 0 1-.6 1.8H3.6A1 1 0 0 1 3 15z"/>',
 store:'<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0M10 20v-6h4v6"/>',
 shield:'<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/>'
};

/* ---------- estado ---------- */
const KEY='maelle-v3';
const D=()=>({auth:null,owner:null,snap:null,role:'user',user:null,session:false,onboarded:false,age18:false,blocked18:false,profile:{username:'',bio:'',photo:''},interests:[],saved:[],events:[],tasks:[],goals:[],habits:[],wishes:[],boards:[],favs:[],brands:[],ch:{},journal:[],words:{},likes:{},looks:[],hair:'',skin:{d:'',am:[],pm:[]},bnotes:{},groups:{},mygroups:[],gposts:null,posts:null,qa:null,myprods:[],mysvc:[],covers:{},blocked:[],reports:[],shelf:{},mybooks:[],sales:null,rooms:null,myrooms:[]});
let S=D();
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(D(),JSON.parse(raw))}catch(e){}
function seed(){
 if(!S.posts)S.posts=[
  {id:'s1',a:'Inês',ago:'2 h',l:14,t:'Comecei a rotina de pele de três passos e já noto diferença. Quem mais está nesta?',c:[{a:'Marta',t:'Eu! Vou em duas semanas.'}]},
  {id:'s2',a:'Beatriz',ago:'5 h',l:9,t:'Guardei hoje o meu moodboard de verão: tons de areia, linho e muito azul.',c:[]},
  {id:'s3',a:'Carolina',ago:'ontem',l:21,t:'Dica de domingo: dez minutos a planear a semana mudam tudo.',c:[]}];
 if(!S.qa)S.qa=[
  {id:'q1',q:'Qual a melhor ordem para aplicar sérum e hidratante?',a:[{by:'Marta',t:'Primeiro o sérum, depois o hidratante e, de manhã, o protetor solar.'}]},
  {id:'q2',q:'Sugestões de destinos para um fim de semana de outono?',a:[]}];
 if(!S.gposts){S.gposts={};GROUPS.forEach(g=>{S.gposts[g.id]=g.seed.map((x,i)=>({id:g.id+'-'+i,a:x.a,ago:'ontem',l:3,t:x.t,c:[]}))})}
 if(!S.sales)S.sales=BOOK_SALES.map(x=>Object.assign({},x));
 if(!S.rooms){S.rooms={};Object.keys(ROOM_SEED).forEach(k=>{S.rooms[k]=ROOM_SEED[k].map((x,i)=>({id:k+'-'+i,a:x.a,t:x.t}))})}
}
seed();
function store(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}}
function save(){const ok=store();scheduleSync();return ok}
function commit(msg){if(!save())toast('Sem espaço para guardar neste dispositivo.');else if(msg)toast(msg);render(true)}
const uname=()=>S.profile.username||(S.user&&S.user.name)||'Tu';
function readImg(file,max,q){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}

/* dados derivados */
const allProds=()=>S.myprods.concat(PRODUCTS);
const allSvc=()=>S.mysvc.concat(SERVICES);
const allBooks=()=>S.mybooks.concat(BOOKS);
const allGroups=()=>S.mygroups.concat(GROUPS);
const findItem=id=>allProds().find(p=>p.id===id)||allSvc().find(p=>p.id===id);
const isBlocked=n=>S.blocked.indexOf(n)>=0;
const brandName=p=>{const b=BRANDS.find(x=>x.id===p.b);return b?b.n:(p.bn||'')};
/* ilustrações originais (tools/ilustracoes.py), usadas quando ainda não há foto */
const art=k=>`img/${TOPICS[k]?k:'moda'}.svg`;
const SVC_ART={'Beleza':'beleza','Cabelo':'beleza','Maquilhagem':'beleza','Imagem e estilo':'moda','Organização':'organizacao'};
const svcArt=c=>art(SVC_ART[c]||'criatividade');
const picture=src=>`<img src="${src}" alt="" loading="lazy">`;
const itemPic=x=>x.img?picture(x.img):PIMG[x.id]?photoImg(PIMG[x.id],'',500):photoImg(TOPICS[x.c]?x.c:SVC_ART[x.c]||'criatividade','',500)+'<i class="ilus">Imagem ilustrativa</i>';
/* fotografias CC0 do Wikimedia Commons (lista também em creditos.html); se não carregarem, aparece a ilustração */
const PHOTOS={
 bolo:"Blueberry Dessert (Unsplash).jpg",
 macacao:"Turquoise Jumpsuit (Unsplash).jpg",
 mala:"Checking Her Purse (Unsplash).jpg",
 compras:"Shopping freak (Unsplash).jpg",
 inverno:"Woman in winter (Unsplash).jpg",
 rua:"Young woman standing at San Francisco crossroads (Unsplash).jpg",
 gorro:"Hooded woman in snow (Unsplash).jpg",
 urbano:"Swag girl (Unsplash).jpg",
 cabelo:"Ombre Hair (Unsplash).jpg",
 cafe:"Red shirt woman in a cafe (Unsplash).jpg",
 olhar:"Woman looking into distance (Unsplash).jpg",
 quarto:"NY loft bedroom (Unsplash).jpg",
 canto:"Getting cozy with a book (Unsplash).jpg",
 plantas:"Cozy greenhouse (Unsplash).jpg",
 vela:"Candle in candle holder (Unsplash).jpg",
 luz:"My little Candlelight (Unsplash).jpg",
 casa:"Cozy white house (Unsplash).jpg",
 malas:"Pack A Bag (Unsplash).jpg",
 roteiro:"Plan a lifetime adventure (Unsplash).jpg",
 caminhada:"Hiker with a large backpack (Unsplash).jpg",
 saco:"Leather duffel bag on the ground (Unsplash).jpg",
 mochila:"Fjallraven Kanken backpack (Unsplash).jpg",
 cereais:"Bowl of Cereal (Unsplash).jpg",
 massa:"Pasta in Bed (Unsplash).jpg",
 salada:"Healthy Lentil Salad (Unsplash).jpg",
 panquecas:"Breakfast table with pancakes (Unsplash).jpg",
 legumes:"Vegetable Salad (Unsplash).jpg",
 brunch:"Brunching with Friends (Unsplash).jpg",
 lapis:"Taking notes with a pencil (Unsplash).jpg",
 camara:"The Photographers Backpack (Unsplash).jpg",
 aparas:"Pencil shavings on a notebook (Unsplash).jpg",
 caneta:"Pen on a notebook (Unsplash).jpg",
 mesa:"White work table with notes, smartphone and laptop (Unsplash).jpg",
 secretaria:"Ruler and laptop on a desk (Unsplash).jpg",
 arquivo:"Archive storage (Unsplash).jpg",
 caderno:"New text notebook (Unsplash).jpg",
 leitora:"Woman reading a book (Unsplash).jpg",
 colo:"Woman reading a book on lap (Unsplash).jpg",
 estante:"Bookshelf (Unsplash).jpg",
 moda:"Women's_clothes_store_(Unsplash).jpg",
 beleza:'Makeup-beauty-lipstick-make-up_(24030573540).jpg',
 decoracao:'Living_room_(Unsplash).jpg',
 viagens:'Woman_on_sandy_beach_(Unsplash).jpg',
 receitas:'Healthy_Trendy_Brunch_(Unsplash).jpg',
 criatividade:'Watercolor_Flowers_(Unsplash).jpg',
 organizacao:'Coffee,_notebooks_and_pen_(Unsplash).jpg',
 livros:'Open_book_(Unsplash).jpg',
 vestido:'Woman_in_a_dress_(Unsplash).jpg',
 loja:'Little_Black_Dress_(Unsplash).jpg',
 convivio:'Coffee,_flowers_and_books_(Unsplash).jpg'
};
const PHOTO_ART={bolo:'receitas',vestido:'moda',loja:'moda',convivio:'livros',macacao:'moda',mala:'moda',compras:'moda',inverno:'moda',rua:'moda',gorro:'moda',urbano:'moda',cabelo:'beleza',cafe:'beleza',olhar:'beleza',quarto:'decoracao',canto:'decoracao',plantas:'decoracao',vela:'decoracao',luz:'decoracao',casa:'decoracao',malas:'viagens',roteiro:'viagens',caminhada:'viagens',saco:'viagens',mochila:'viagens',cereais:'receitas',massa:'receitas',salada:'receitas',panquecas:'receitas',legumes:'receitas',brunch:'receitas',lapis:'criatividade',camara:'criatividade',aparas:'criatividade',caneta:'organizacao',mesa:'organizacao',secretaria:'organizacao',arquivo:'organizacao',caderno:'organizacao',leitora:'livros',colo:'livros',estante:'livros'};
/* larguras que o Wikimedia aceita; pedir outra dá erro */
const THUMBS=[120,250,330,500,960];
const thumbW=w=>THUMBS.find(t=>t>=w)||960;
const photo=(k,w)=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(PHOTOS[k]).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29')+'?width='+thumbW(w||960);
const photoImg=(k,cls,w)=>`<img ${cls?`class="${cls}"`:''} src="${photo(k,w)}" data-fb="${art(PHOTO_ART[k]||k)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
const RETRY=[700,2200];
document.addEventListener('error',e=>{const t=e.target;if(t.tagName!=='IMG'||!t.dataset.fb)return;
 const n=+t.dataset.n||0,src=t.getAttribute('src');
 if(n<RETRY.length&&src.indexOf('https:')===0){t.dataset.n=n+1;setTimeout(()=>{t.src=src.replace(/&retry=\d+$/,'')+'&retry='+(n+1)},RETRY[n]);return}
 t.src=t.dataset.fb;delete t.dataset.fb},true);
const banner=k=>photoImg(k,'banner');
/* que fotografia vai em cada ideia, exemplo, menu e ecrã */
const IMG={
 m1:'moda',m2:'macacao',m3:'mala',m4:'compras',b1:'beleza',b2:'cabelo',b3:'cafe',b4:'quarto',d1:'canto',d2:'decoracao',d3:'plantas',d4:'vela',
 v1:'malas',v2:'rua',v3:'roteiro',v4:'caminhada',r1:'cereais',r2:'massa',r3:'salada',r4:'bolo',c1:'lapis',c2:'criatividade',c3:'camara',c4:'aparas',
 o1:'caneta',o2:'mesa',o3:'secretaria',o4:'arquivo',l1:'leitora',l2:'livros',l3:'colo',l4:'estante'};
const PIMG={p1:'compras',p2:'rua',p3:'beleza',p4:'cabelo',p5:'vela',p6:'quarto',p7:'malas',p8:'saco',p9:'caderno',p10:'caneta',p11:'criatividade',p12:'legumes',
 s1:'beleza',s2:'camara',s3:'macacao',s4:'criatividade',s5:'secretaria',s6:'moda'};
const OIMG={o1:'rua',o2:'vestido',o3:'urbano',o4:'olhar',o5:'macacao',o6:'inverno',o7:'mochila',o8:'cafe',o9:'loja',o10:'compras',o11:'gorro',o12:'viagens',o13:'mala'};
const BRIMG={lumi:'moda',nua:'beleza',aurea:'vela',mare:'saco',folha:'caderno',olivia:'legumes'};
const CHIMG={agua:'brunch',ler:'colo',grat:'lapis',andar:'caminhada'};
const EVIMG={e1:'cabelo',e2:'criatividade',e3:'caneta'};
const BTIMG={skincare:'beleza',hair:'cabelo',makeup:'cafe',outfits:'moda',trends:'macacao'};
const MENUIMG={hanger:'vestido',book:'livros',spark:'beleza',plan:'caneta',list:'mesa',target:'roteiro',repeat:'brunch',gift:'compras',flower:'criatividade',
 cal:'panquecas',pen:'lapis',chat:'cafe',user:'olhar',send:'caderno',users:'convivio',help:'leitora',heart:'luz',bag:'loja',tag:'mala',store:'moda'};
const BANNERS={signup:'convivio',login:'casa',interests:'convivio',saved:'luz',boards:'criatividade',board:'aparas',agenda:'caneta',tasks:'mesa',goals:'roteiro',habits:'brunch',wishes:'compras',
 recs:'mala',shop:'loja',brands:'moda',sell:'secretaria',favs:'luz',challenges:'caminhada',creative:'lapis',digital:'plantas',cevents:'panquecas',
 posts:'convivio',people:'olhar',follows:'olhar',inbox:'caderno',groups:'brunch',qa:'leitora',room:'estante'};
const photoOf=(k,cls,w)=>PHOTOS[k]?photoImg(k,cls,w):'';
/* fotografia por trás da inicial de quem ainda não tem foto */
const AVBG=['criatividade','luz','plantas','livros','casa','vela'];
const avBg=n=>{let h=0;for(const ch of String(n))h=(h*31+ch.codePointAt(0))>>>0;return AVBG[h%AVBG.length]};
const initial=(n,sz)=>`<span class="av ini" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.45)}px">${photoImg(avBg(n),'',120)}<b>${esc(String(n).charAt(0).toUpperCase())}</b></span>`;
const tileBg=(k,a)=>`background:linear-gradient(to top,rgba(64,55,47,.74),rgba(64,55,47,.18)),url(${photo(k,500)}) center/cover,url(${art(a)}) center/cover,#8A7766`;
const grad=k=>TOPICS[k]?`linear-gradient(160deg,${TOPICS[k].tint[0]},${TOPICS[k].tint[1]})`:'linear-gradient(160deg,#EBE1D3,#D8C5AD)';

/* ---------- navegação ---------- */
const V={};
let stack=[{v:'splash'}];
const cur=()=>stack[stack.length-1];
function go(v,p){stack.push({v:v,p:p||{}});render()}
function back(){if(stack.length>1)stack.pop();render()}
function tab(v){stack=[{v:v,p:{}}];render()}
const TABS=[['home','Início','home'],['myplace','My Place','plan'],['club','Club','club'],['community','Comunidade','chat'],['edit','The Edit','bag'],['me','Perfil','user']];
function render(keep){
 const c=cur(),el=$('#view'),sc=el.scrollTop;
 let def=V[c.v];
 if(S.blocked18&&!S.session&&['welcome','signup','login'].indexOf(c.v)>=0)def=V.underage;
 breathStop();
 el.innerHTML=def.html(c.p||{});
 $('#app').classList.toggle('has-tabs',!!def.tab);
 $('#tabs').innerHTML=TABS.map(t=>`<button data-act="tab" data-v="${t[0]}" class="${def.tab===t[0]?'on':''}" ${def.tab===t[0]?'aria-current="page"':''}>${ic(P[t[2]],22)}<span>${t[1]}</span></button>`).join('');
 const bk=BANNERS[c.v],h1=bk&&!el.querySelector('.banner')&&el.querySelector('h1');
 if(h1){const next=h1.nextElementSibling;(next&&next.classList.contains('sub')?next:h1).insertAdjacentHTML('afterend',banner(bk))}
 el.scrollTop=keep?sc:0;
 if(typeof paintBadge==='function')paintBadge();
 if(def.after)def.after(c.p||{});
}
let tt=null;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400)}
function sheet(html){const r=$('#sheet');r.innerHTML=`<div class="sheet-bg" data-act="bg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;const f=r.querySelector('input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]),textarea');if(f&&window.matchMedia('(pointer:fine)').matches)f.focus()}
function closeSheet(){$('#sheet').innerHTML=''}
const ferr=(f,m)=>{const e=f.querySelector('.err');if(e)e.textContent=m};
let bt=null,tmpImg=null,photoTmp=null;
function breathStop(){clearTimeout(bt);bt=null}

/* ---------- peças partilhadas ---------- */
const head=(title,sub,o)=>{o=o||{};return `<div class="bar">${o.noBack?'<span></span>':`<button class="icon-btn" data-act="back" aria-label="Voltar">${ic(P.back)}</button>`}<span class="bar-r">${o.right||''}</span></div><h1 class="h1">${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}`};
const avatar=sz=>S.profile.photo?`<span class="av" style="width:${sz}px;height:${sz}px"><img src="${S.profile.photo}" alt=""></span>`:initial(uname(),sz);
const menu=(icon,t,p,act,feat)=>`<button class="menu ${feat?'feat':''}" ${act}><span class="ic ${MENUIMG[icon]?'foto':''}">${MENUIMG[icon]?photoImg(MENUIMG[icon],'',250):ic(P[icon],22)}</span><span class="tx"><span class="t">${t}</span><span class="p">${p}</span></span><span class="ch">${ic(P.next,18)}</span></button>`;
const delBtn=(l,id)=>`<button class="del" data-act="del" data-l="${l}" data-id="${id}" aria-label="Apagar">${ic(P.trash,18)}</button>`;
const chk=(on,l,id,f)=>`<button class="chk ${on?'on':''}" data-act="toggle" data-l="${l}" data-id="${id}" data-f="${f}" aria-pressed="${!!on}" aria-label="Marcar como feito">${ic(P.check,16)}</button>`;
const openBtn=(i,inner)=>DETAIL[i.id]?`<button class="open" data-act="go" data-v="idea" data-id="${i.id}" aria-label="${i.t}">${inner}</button>`:inner;
const ideaCard=i=>{const on=S.saved.includes(i.id),d=DETAIL[i.id];return `<article class="idea big">${openBtn(i,photoImg(IMG[i.id]||i.k,'cover',500))}<div><h3>${i.t}</h3><p>${i.d}</p>${d?`<button class="link" data-act="go" data-v="idea" data-id="${i.id}">${i.id[0]==='r'?'Ver receita':'Ver ideia'}</button>`:''}</div><button class="heart ${on?'on':''}" data-act="saveidea" data-id="${i.id}" aria-pressed="${on}" aria-label="Guardar ideia">${ic(P.heart)}</button></article>`};
const monthKey=()=>today().slice(0,7);
function streak(h){let n=0;const d=new Date();if(h.days.indexOf(iso(d))<0)d.setDate(d.getDate()-1);while(h.days.indexOf(iso(d))>=0){n++;d.setDate(d.getDate()-1)}return n}
function nextEvent(){const t=today();return S.events.filter(e=>e.date>=t).sort((a,b)=>(a.date+(a.time||'99')).localeCompare(b.date+(b.time||'99')))[0]}
function skinToday(){if(S.skin.d!==today())S.skin={d:today(),am:[],pm:[]};return S.skin}
const webLink=(href,label)=>`<a class="btn ghost" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
const contactHTML=c=>{if(!c)return '';const u=/^https?:\/\//i.test(c)?c:null;return u?`<a class="btn ghost" href="${esc(u)}" target="_blank" rel="noopener">Abrir contacto</a>`:`<div class="card cream" style="margin:0"><span class="meta">Contacto</span><p style="margin:6px 0 0;font-size:15px;overflow-wrap:anywhere" id="ctxt">${esc(c)}</p></div><button class="btn ghost" data-act="copyc">Copiar contacto</button>`};
