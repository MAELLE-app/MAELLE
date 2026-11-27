'use strict';
/* Capas de livros pela Open Library. Enquanto não chega (ou se não existir), mostra-se uma capa da MAELLE com fotografia e título. */
const ORIGINAL={'Orgulho e Preconceito':'Pride and Prejudice','Hábitos Atómicos':'Atomic Habits','A Biblioteca da Meia-Noite':'The Midnight Library',
 'Mulheres que Correm com os Lobos':'Women Who Run With the Wolves','A Elegância do Ouriço':'The Elegance of the Hedgehog','Gente Normal':'Normal People'};
const COVER_KEY='maelle-capas';
let coverIds={};
try{coverIds=JSON.parse(localStorage.getItem(COVER_KEY))||{}}catch(e){}
const coverAsked={};
const bookCover=(t,a)=>{const au=a==='Autor por indicar'?'':a||'';return `<span class="cv" data-t="${esc(t)}" data-a="${esc(au)}" aria-hidden="true">${photoImg(avBg(t),'',160)}<b data-nt>${esc(String(t).slice(0,40))}</b></span>`};
function showCover(el,id){
 if(!Number.isInteger(id)||id<=0||el.querySelector('.real'))return;
 const im=new Image();im.className='real';im.alt='';im.referrerPolicy='no-referrer';
 im.onload=()=>el.classList.add('has');im.onerror=()=>im.remove();
 im.src='https://covers.openlibrary.org/b/id/'+id+'-M.jpg?default=false';el.appendChild(im);
}
async function findCover(t,a){
 const q=new URLSearchParams({title:ORIGINAL[t]||t,limit:'5',fields:'cover_i'});if(a)q.set('author',a);
 const r=await fetch('https://openlibrary.org/search.json?'+q,{referrerPolicy:'no-referrer'});
 if(!r.ok)throw new Error('openlibrary '+r.status);
 const hit=((await r.json()).docs||[]).find(d=>d.cover_i);
 return hit?hit.cover_i:0;
}
function paintCovers(){
 document.querySelectorAll('.cv[data-t]:not([data-done])').forEach(el=>{
  el.dataset.done='1';const t=el.dataset.t,a=el.dataset.a,k=t+'|'+a;
  if(k in coverIds)return showCover(el,coverIds[k]);
  (coverAsked[k]||(coverAsked[k]=findCover(t,a).then(id=>{coverIds[k]=id;try{localStorage.setItem(COVER_KEY,JSON.stringify(coverIds))}catch(e){}return id}).catch(()=>0))).then(id=>showCover(el,id));
 });
}
new MutationObserver(paintCovers).observe(document.getElementById('app'),{childList:true,subtree:true});
