'use strict';
/* Ajuda da loja: respostas escritas por nós. Nada é enviado nem guardado. */
const TEAM='latoyamateus8@gmail.com';
/* p: palavras que identificam a pergunta (início de palavra, sem acentos), nas cinco línguas */
const FAQ=[
 {id:'burla',q:'Suspeito de uma burla',p:'burla fraude golpe enganad roubad scam fraud arnaque estafa truffa denunci report signal',
  a:['Guarda as mensagens, o anúncio e os comprovativos.','Abre o anúncio e toca em «Denunciar». Se foi uma pessoa, também podes bloqueá-la.','Se já pagaste, contacta logo o teu banco ou o serviço de pagamento e apresenta queixa às autoridades.']},
 {id:'envio',q:'Onde está a minha encomenda?',p:'encomenda envio enviad entreg chegou chega rastre seguimento portes order shipping shipped deliver track parcel colis livraison commande expedi pedido llega seguimiento ordine spediz consegna pacco',
  a:['A MAELLE ainda não faz envios nem acompanha encomendas.','Contacta quem te vendeu, pelo contacto do anúncio, e pede a data de envio e o número de seguimento.','Guarda o comprovativo de pagamento e o que combinaram.']},
 {id:'devolver',q:'Posso devolver uma compra?',p:'devolv devoluc reembols troca trocar desist cancel garantia defeito estragad return refund exchange warranty rembours retour retract devolu cambio reso rimbors recesso garanzia',
  a:['Se compraste à distância a um vendedor profissional, em regra tens 14 dias para desistir. Há exceções, como produtos feitos à tua medida.','Entre particulares aplicam-se regras diferentes.','Pede por escrito a quem vendeu. Para mais informação: www.consumidor.gov.pt.']},
 {id:'pagar',q:'Como pago em segurança?',p:'pagar pago pagament dinheiro mbway transfer cartao segur confian pay payment money safe secure payer paiement argent securite dinero pago seguro pagare pagamento soldi sicur',
  a:['A MAELLE ainda não recebe pagamentos: combinas com quem vende.','Prefere um método com proteção ao comprador.','Nunca partilhes palavras-passe nem códigos recebidos por mensagem.','Desconfia de preços bons demais e de quem te apressa.']},
 {id:'comprar',q:'Como compro um produto?',p:'compr buy purchase achet compra acquist encomendar',
  a:['Abre o produto na Shop.','Usa o contacto ou o link da loja que aparece no anúncio.','Confirma o preço total, os portes e o prazo antes de pagar.']},
 {id:'servico',q:'Como reservo um serviço?',p:'servic reserv marcac marcar agendar book appointment service rendez cita prenot appuntamento servizio',
  a:['Abre o serviço e usa o contacto de quem o oferece.','Combina por escrito o dia, o local, o preço e o que está incluído.','No primeiro encontro, escolhe um local seguro e avisa alguém.']},
 {id:'vender',q:'Como vendo na MAELLE?',p:'vender vendo venda anunci publicar marca sell selling listing vendre vente vender venta vendere vendita annuncio',
  a:['Em The Edit, toca em «Vender na MAELLE».','Junta uma foto, o preço, a descrição e um contacto ou o link da tua loja.','Hoje não cobramos comissão. Antes de haver pagamentos ou planos pagos, avisamos.']},
 {id:'proibido',q:'O que não posso vender?',p:'proibid permitid contrafac falsific medicament forbidden prohibit allowed counterfeit interdit contrefa prohibid falsific vietat contraffat',
  a:['Contrafações, produtos ilegais ou perigosos, produtos para adultos, medicamentos e produtos de venda restrita.','Os anúncios que não cumpram podem ser removidos.']}
];
let HELP=[];
function helpAnswer(text){
 const w=norm(text).split(/[^a-z0-9]+/).filter(Boolean);let best=null,top=0;
 FAQ.forEach(f=>{const keys=f.p.split(' ');const n=w.filter(x=>keys.some(k=>x.startsWith(k))).length;if(n>top){top=n;best=f}});
 return best;
}
const teamLink=()=>`<a class="btn small ghost" href="mailto:${TEAM}?subject=${encodeURIComponent('MAELLE: ajuda')}">Escrever à equipa</a>`;
const botMsg=f=>f?`<div class="b bot">${f.a.map(x=>`<p>${x}</p>`).join('')}</div>`:`<div class="b bot"><p>Ainda não sei responder a isso.</p><p>Escolhe uma pergunta em baixo ou escreve à equipa.</p>${teamLink()}</div>`;
V.help={tab:'edit',
 after:()=>{const l=document.querySelectorAll('#hlist .me');if(l.length)l[l.length-1].scrollIntoView({block:'start'})},
 html:()=>`<div class="page">${head('Ajuda da loja','Dúvidas sobre compras, envios e vendas.')}<p class="note" style="margin-top:0">Assistente automático com respostas já escritas. A conversa não é enviada nem guardada.</p>
 <div class="botlist" id="hlist" aria-live="polite"><div class="b bot"><p>Olá! Em que posso ajudar?</p></div>${HELP.map(m=>{const f=FAQ.find(x=>x.id===m.f);return `<div class="b me">${m.t===null?`<p>${f.q}</p>`:`<p data-nt>${esc(m.t)}</p>`}</div>${botMsg(f)}`}).join('')}</div>
 <form class="cmform" data-form="help"><input class="field" id="hp-t" name="t" placeholder="Escreve a tua dúvida" maxlength="200" aria-label="Escreve a tua dúvida" autocomplete="off"><button class="btn" type="submit" aria-label="Enviar">${ic(P.send,18)}</button></form>
 <div class="chips" style="margin-top:14px">${FAQ.map(f=>`<button class="chip" data-act="faq" data-id="${f.id}">${f.q}</button>`).join('')}</div>
 <div style="display:flex;gap:10px;flex-wrap:wrap">${teamLink()}<a class="btn small ghost" href="termos.html">Termos de Utilização</a></div></div>`};
const helpAdd=m=>{HELP=HELP.concat(m).slice(-20);render(true)};
ACT.faq=d=>{if(FAQ.some(f=>f.id===d.id))helpAdd({f:d.id,t:null})};
FORM.help=(fd)=>{const t=fd.get('t').trim();if(!t)return;const f=helpAnswer(t);if(document.activeElement)document.activeElement.blur();helpAdd({f:f?f.id:null,t:t})};
