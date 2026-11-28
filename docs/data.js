'use strict';
/* MAELLE v2 - conteúdos de exemplo. Tudo o que é marcado como exemplo será substituído por dados reais no backend. */
const TOPICS={
 moda:{label:'Moda',card:'Fashion & Care',tint:['#E3D3BE','#C9B08F'],intro:'Peças, combinações e cuidados para um guarda-roupa que é teu.',ideas:[
  {id:'m1',t:'Cápsula de 10 peças',d:'Escolhe dez peças em tons neutros que combinam entre si. Com elas montas dezenas de looks sem pensar.'},
  {id:'m2',t:'Regra dos três tons',d:'Usa no máximo três cores por look: uma base, um tom de apoio e um detalhe que se destaca.'},
  {id:'m3',t:'Acessórios que mudam tudo',d:'Um cinto, um lenço ou brincos grandes dão ao mesmo look uma versão nova.'},
  {id:'m4',t:'Cuidar da roupa',d:'Lava do avesso, a baixa temperatura, e guarda as malhas dobradas. As peças duram anos.'}]},
 beleza:{label:'Beleza',card:'Beauty & Care',tint:['#EBD9D2','#D9BFC0'],intro:'Rotinas simples para a pele, o cabelo e o dia a dia.',ideas:[
  {id:'b1',t:'Rotina simples de pele',d:'De manhã: limpar, hidratar e protetor solar. À noite: limpar e hidratar.'},
  {id:'b2',t:'Cabelo hidratado',d:'Máscara hidratante uma vez por semana e menos calor nas ferramentas de styling.'},
  {id:'b3',t:'Maquilhagem de cinco minutos',d:'Pele uniforme, rímel e um toque de cor nos lábios chegam para um dia inteiro.'},
  {id:'b4',t:'Dormir bem também é beleza',d:'Uma fronha de cetim e um horário regular ajudam a pele e o cabelo.'}]},
 decoracao:{label:'Decoração',card:'Home & Decor',tint:['#E4DCCB','#C2B497'],intro:'Ideias para uma casa calma, quente e com a tua cara.',ideas:[
  {id:'d1',t:'Cantinho de leitura',d:'Uma cadeira confortável, luz quente e uma manta já fazem um canto só teu.'},
  {id:'d2',t:'Paleta calma',d:'Mantém duas cores base na casa e muda só as almofadas e os quadros ao longo do ano.'},
  {id:'d3',t:'Plantas fáceis',d:'Jiboia, zamioculca e espada-de-são-jorge aguentam pouca luz e pouca rega.'},
  {id:'d4',t:'Texturas em vez de objetos',d:'Linho, cerâmica e madeira clara dão calor sem encher o espaço.'}]},
 viagens:{label:'Viagens',card:'Travel',tint:['#DCD3C4','#B5A58E'],intro:'Preparar, partir e voltar com boas memórias.',ideas:[
  {id:'v1',t:'Mala de mão inteligente',d:'Leva peças que combinam entre si e enrola a roupa para ganhar espaço.'},
  {id:'v2',t:'Roteiro de fim de semana',d:'Escolhe um bairro por dia e deixa uma manhã livre para improvisar.'},
  {id:'v3',t:'Lista antes de sair',d:'Documentos, carregador, medicação e cópias digitais. Confirma tudo na véspera.'},
  {id:'v4',t:'Viajar a solo',d:'Reserva a primeira noite antes de partir e partilha o itinerário com alguém de confiança.'}]},
 receitas:{label:'Receitas',card:'Food & Recipes',tint:['#EADCC4','#CDB38A'],intro:'Refeições simples para o dia a dia.',ideas:[
  {id:'r1',t:'Overnight oats',d:'Aveia, leite, iogurte e fruta na véspera. De manhã só abres o frasco.'},
  {id:'r2',t:'Massa de tomate assado',d:'Assa tomate e alho no forno, mistura com massa e finaliza com manjericão.'},
  {id:'r3',t:'Bowl de grão',d:'Grão-de-bico, pepino, tomate e azeitonas, com molho de limão e azeite.'},
  {id:'r4',t:'Bolo de iogurte',d:'1 iogurte, 2 medidas de açúcar, 3 de farinha, 1 de óleo, 3 ovos e 1 saqueta de fermento. Forno a 180 °C, cerca de 35 minutos.'}]},
 criatividade:{label:'Criatividade',card:'Creative',tint:['#E6D6D0','#C8A99D'],intro:'Pequenos gestos para fazer mais coisas com as tuas mãos.',ideas:[
  {id:'c1',t:'Diário de três linhas',d:'Escreve todos os dias três linhas: uma coisa que viste, uma que sentiste, uma que queres.'},
  {id:'c2',t:'Colagem rápida',d:'Corta imagens de revistas e cola numa página, só pela cor e sem planear.'},
  {id:'c3',t:'Fotografia de pormenores',d:'Dá um passeio de 20 minutos e tira cinco fotos de pormenores.'},
  {id:'c4',t:'Desenho às cegas',d:'Desenha um objeto sem olhar para o papel. O resultado é sempre original.'}]},
 organizacao:{label:'Organização',card:'Organize',tint:['#DDD7C9','#B8AE97'],intro:'Menos ruído, mais espaço para o que importa.',ideas:[
  {id:'o1',t:'Três prioridades',d:'Escolhe de manhã três tarefas para o dia. O resto é bónus.'},
  {id:'o2',t:'Revisão de domingo',d:'Dez minutos para olhar para a semana seguinte: agenda, tarefas e compras.'},
  {id:'o3',t:'Regra dos dois minutos',d:'Se demora menos de dois minutos, faz logo.'},
  {id:'o4',t:'Gavetas por zonas',d:'Um sítio para cada coisa. Arruma por categoria e usa caixas pequenas.'}]},
 livros:{label:'Livros',card:'Books & Reading',tint:['#E2D5C6','#B9A58F'],intro:'Ler mais, com calma e em boa companhia.',ideas:[
  {id:'l1',t:'Dez páginas por dia',d:'Dez páginas antes de dormir dão cerca de doze livros por ano, sem esforço.'},
  {id:'l2',t:'Um livro de cada vez',d:'Acaba um antes de começares outro. Se não gostares, podes pousar sem culpa.'},
  {id:'l3',t:'Lê em voz alta uma frase',d:'Sublinha a frase de que mais gostaste e guarda-a no teu diário.'},
  {id:'l4',t:'Troca livros',d:'Um livro parado numa estante pode ser a próxima leitura de outra pessoa.'}]}
};
const IDEAS={};Object.keys(TOPICS).forEach(k=>TOPICS[k].ideas.forEach(i=>{IDEAS[i.id]=Object.assign({k:k},i)}));
const PCATS=Object.keys(TOPICS).filter(k=>k!=='livros');
const BEAUTY=[
 {k:'skincare',t:'Skincare',tips:['Limpa a pele antes de aplicar qualquer produto.','Introduz um produto novo de cada vez, com uma semana de intervalo.','O protetor solar usa-se todos os dias, mesmo no inverno.']},
 {k:'hair',t:'Hair care',tips:['Lava o cabelo com água morna e acaba com água fria.','Desembaraça sempre das pontas para a raiz.','Dormir com o cabelo solto e protegido reduz a quebra.']},
 {k:'makeup',t:'Makeup',tips:['Começa pela pele: menos produto, mais uniformidade.','Uma cor de lábios que adoras vale mais do que dez que não usas.','Lava os pincéis uma vez por semana.']},
 {k:'outfits',t:'Outfits',tips:['Monta o look na véspera, com sapatos e acessórios.','Fotografa os looks de que gostas para repetir.','Troca uma peça de cada vez para renovar um look.']},
 {k:'trends',t:'Fashion & Trends',tips:['Escolhe uma tendência por estação, não todas.','Procura a tendência em peças que já tens.','Boa tendência é a que funciona com o teu dia a dia.']}
];
const BRANDS=[
 {id:'lumi',n:'Atelier Lumi',d:'Peças de linho e seda em tons de areia.'},
 {id:'nua',n:'Nua Skin',d:'Cuidados de pele simples, para todos os dias.'},
 {id:'aurea',n:'Casa Áurea',d:'Velas, mantas e pequenos objetos para a casa.'},
 {id:'mare',n:'Maré Viva',d:'Malas e acessórios para viajar leve.'},
 {id:'folha',n:'Folha & Linho',d:'Papelaria, cadernos e material criativo.'},
 {id:'olivia',n:'Olívia Studio',d:'Cerâmica e madeira para a mesa.'}
];
const PRODUCTS=[
 {id:'p1',n:'Lenço de seda estampado',b:'lumi',p:34,c:'moda',d:'Seda leve em estampado abstrato. Usa ao pescoço, no cabelo ou na mala.'},
 {id:'p2',n:'Blazer de linho',b:'lumi',p:89,c:'moda',d:'Corte direito, forro leve e bolsos fundos. Fica bem com tudo.'},
 {id:'p3',n:'Sérum de vitamina C',b:'nua',p:24,c:'beleza',d:'Textura fluida que absorve depressa. Aplicar de manhã, antes do hidratante.'},
 {id:'p4',n:'Creme hidratante leve',b:'nua',p:19,c:'beleza',d:'Hidratação diária sem peso, para pele normal a mista.'},
 {id:'p5',n:'Vela de figo e cedro',b:'aurea',p:22,c:'decoracao',d:'Cera vegetal com cerca de 40 horas de duração.'},
 {id:'p6',n:'Manta de algodão',b:'aurea',p:48,c:'decoracao',d:'Tecido de malha larga, macia e fácil de lavar.'},
 {id:'p7',n:'Mala de cabine cor areia',b:'mare',p:119,c:'viagens',d:'Casca rígida, rodas silenciosas e interior organizado.'},
 {id:'p8',n:'Necessaire de viagem',b:'mare',p:21,c:'viagens',d:'Impermeável, com compartimentos para produtos e escovas.'},
 {id:'p9',n:'Caderno de pontos A5',b:'folha',p:14,c:'organizacao',d:'Papel de 100 g, costura aberta e marcador de fita.'},
 {id:'p10',n:'Planner semanal',b:'folha',p:16,c:'organizacao',d:'Uma semana em duas páginas, com espaço para prioridades e hábitos.'},
 {id:'p11',n:'Kit de aguarelas',b:'folha',p:27,c:'criatividade',d:'Doze cores suaves, pincel de viagem e bloco de papel.'},
 {id:'p12',n:'Tábua de madeira para servir',b:'olivia',p:29,c:'receitas',d:'Madeira de oliveira, cada peça é única.'}
];
const SVC_CATS=['Beleza','Cabelo','Maquilhagem','Fotografia','Aulas','Design','Imagem e estilo','Organização','Outros'];
const SERVICES=[
 {id:'s1',n:'Maquilhagem para eventos',by:'Studio Sofia',p:45,c:'Maquilhagem',mode:'Presencial',city:'Lisboa',d:'Maquilhagem para festas, casamentos e sessões de fotos. Inclui prova prévia.',contact:'Exemplo, sem contacto real'},
 {id:'s2',n:'Retratos em estúdio',by:'Ana Luz',p:60,c:'Fotografia',mode:'Presencial',city:'Porto',d:'Sessão de 45 minutos com 15 fotos editadas, para perfil, marca pessoal ou recordação.',contact:'Exemplo, sem contacto real'},
 {id:'s3',n:'Consultoria de imagem',by:'Rita Mendes',p:35,c:'Imagem e estilo',mode:'Online',city:'',d:'Uma hora de conversa para descobrir as cores e as peças que mais te favorecem.',contact:'Exemplo, sem contacto real'},
 {id:'s4',n:'Aulas de aguarela',by:'Joana Flor',p:20,c:'Aulas',mode:'Online',city:'',d:'Aulas em pequeno grupo para iniciantes. Material indicado na inscrição.',contact:'Exemplo, sem contacto real'},
 {id:'s5',n:'Logótipo e identidade visual',by:'Marta Design',p:150,c:'Design',mode:'Online',city:'',d:'Logótipo, paleta e tipografia para o teu projeto, com duas rondas de ajustes.',contact:'Exemplo, sem contacto real'},
 {id:'s6',n:'Organização de guarda-roupa',by:'Casa Arrumada',p:50,c:'Organização',mode:'Presencial',city:'Braga',d:'Triagem, arrumação por categorias e uma cápsula de looks para a estação.',contact:'Exemplo, sem contacto real'}
];
const PALETTES=[
 {n:'Marfim',c:['#F5F0E9','#EBE1D3','#D8C5AD','#A99A8B','#40372F']},
 {n:'Terra',c:['#EADBCB','#D2A98B','#B07A5E','#7C5642','#3F2E24']},
 {n:'Sálvia',c:['#EEF0E6','#CBD5BF','#9DB394','#6E8767','#3C4A38']},
 {n:'Rosa',c:['#F7EEEE','#EBD7D7','#D9BFC0','#B58F91','#6E4443']},
 {n:'Noite',c:['#E8E6EE','#C4C0D4','#9690B0','#645F82','#34304A']}
];
const CHALLENGES=[
 {id:'agua',t:'Beber água todos os dias',d:'Regista cada dia em que cumpres a tua meta de água.'},
 {id:'ler',t:'10 páginas por dia',d:'Um livro de cada vez, sem pressa e sem falhar muitos dias.'},
 {id:'grat',t:'Diário de gratidão',d:'Escreve uma coisa boa do dia, por pequena que seja.'},
 {id:'andar',t:'20 minutos a andar',d:'Uma caminhada por dia, com ou sem música.'}
];
const PROMPTS=['Descreve um lugar onde te sentes bem.','Escreve uma carta curta à tua versão de há cinco anos.','Que cor representa o teu dia de hoje, e porquê?','Escreve sobre uma refeição de que nunca te esqueces.','Imagina a tua casa ideal. O que há na entrada?','Descreve três sons que ouves agora.','Escreve cinco coisas que queres fazer este mês.','Que conselho darias a uma amiga que começa um projeto novo?','Descreve um objeto pequeno que guardas há muito tempo.','Escreve o início de uma história que se passa numa estação de comboios.'];
const CLUB_EVENTS=[
 {id:'e1',t:'Encontro online: rotina de outono',off:3,time:'19:00',d:'Conversa em direto sobre pele e cabelo.'},
 {id:'e2',t:'Workshop de colagem',off:8,time:'16:00',d:'Cria uma página inspirada nas tuas cores.'},
 {id:'e3',t:'Live: organizar o mês de dezembro',off:12,time:'20:00',d:'Planear tarefas, compras e tempo para ti.'}
];
const GROUPS=[
 {id:'g1',n:'Skincare lovers',d:'Rotinas, produtos e dúvidas de pele.',m:128,k:'beleza',seed:[{a:'Inês',t:'Qual é a vossa rotina de noite mais simples?'}]},
 {id:'g2',n:'Viagens a solo',d:'Dicas e roteiros para viajar sozinha.',m:76,k:'viagens',seed:[{a:'Marta',t:'Alguém tem sugestões de cidades seguras para um primeiro voo a solo?'}]},
 {id:'g3',n:'Planners e organização',d:'Agendas, hábitos e produtividade calma.',m:93,k:'organizacao',seed:[{a:'Carolina',t:'Partilhem o vosso método de revisão semanal.'}]},
 {id:'g4',n:'Receitas rápidas',d:'Refeições simples para o dia a dia.',m:64,k:'receitas',seed:[{a:'Beatriz',t:'Jantares prontos em vinte minutos? Aceito ideias.'}]},
 {id:'g5',n:'Criativas',d:'Arte, escrita e projetos manuais.',m:57,k:'criatividade',seed:[{a:'Inês',t:'Esta semana estou a experimentar colagem. Alguém mais?'}]}
];
const BOOKS=[
 {id:'b1',t:'Orgulho e Preconceito',a:'Jane Austen',tag:'Clássico',d:'Uma história de ironia e de amor que se constrói contra as expectativas da época.'},
 {id:'b2',t:'Os Maias',a:'Eça de Queirós',tag:'Clássico português',d:'Retrato de uma família lisboeta e da sociedade do século XIX.'},
 {id:'b3',t:'Hábitos Atómicos',a:'James Clear',tag:'Desenvolvimento pessoal',d:'Como pequenas mudanças diárias se somam em grandes resultados.'},
 {id:'b4',t:'A Biblioteca da Meia-Noite',a:'Matt Haig',tag:'Ficção',d:'E se pudesses viver as vidas que não escolheste?'},
 {id:'b5',t:'Mulheres que Correm com os Lobos',a:'Clarissa Pinkola Estés',tag:'Ensaio',d:'Contos e mitos para reencontrar a força e a intuição.'},
 {id:'b6',t:'A Elegância do Ouriço',a:'Muriel Barbery',tag:'Romance',d:'Duas vozes num prédio de Paris e uma amizade improvável.'},
 {id:'b7',t:'Memorial do Convento',a:'José Saramago',tag:'Clássico português',d:'Amor, poder e a construção de Mafra, contados à maneira de Saramago.'},
 {id:'b8',t:'Gente Normal',a:'Sally Rooney',tag:'Romance contemporâneo',d:'Dois jovens, uma relação feita de silêncios e de aproximações.'}
];
const BOOK_SALES=[
 {id:'k1',t:'Orgulho e Preconceito',a:'Jane Austen',p:6,cond:'Bom',city:'Porto',by:'Inês',contact:'Exemplo, sem contacto real'},
 {id:'k2',t:'Hábitos Atómicos',a:'James Clear',p:11,cond:'Como novo',city:'Lisboa',by:'Marta',contact:'Exemplo, sem contacto real'},
 {id:'k3',t:'A Elegância do Ouriço',a:'Muriel Barbery',p:5,cond:'Usado',city:'Coimbra',by:'Beatriz',contact:'Exemplo, sem contacto real'}
];
const ROOM_SEED={
 geral:[{a:'Carolina',t:'Olá! O que estão a ler esta semana?'},{a:'Beatriz',t:'Estou a meio de A Biblioteca da Meia-Noite. Recomendo.'}],
 b1:[{a:'Inês',t:'Quem prefere o Sr. Darcy no início ou no fim do livro?'}],
 b3:[{a:'Marta',t:'O capítulo sobre o ambiente à nossa volta mudou-me a secretária.'}]
};
const BOOK_CONDS=['Como novo','Bom','Usado'];
/* Style Finder */
const OUTFIT_TAGS=['Dia a dia','Trabalho','Festa','Viagem','Fim de semana','Verão','Inverno'];
const OUTFITS=[
 {id:'o1',t:'Blazer de linho e calças fluidas',tags:['Trabalho','Verão'],pieces:['Blazer de linho','Calças fluidas','Sapatos rasos','Brincos pequenos'],pal:['#F5F0E9','#D8C5AD','#40372F']},
 {id:'o2',t:'Vestido midi e sandálias',tags:['Verão','Festa','Fim de semana'],pieces:['Vestido midi','Sandálias de tiras','Mala pequena','Lenço no cabelo'],pal:['#D9BFC0','#F5F0E9','#A99A8B']},
 {id:'o3',t:'Malha larga e jeans retos',tags:['Dia a dia','Inverno'],pieces:['Camisola de malha larga','Jeans retos','Ténis brancos','Gorro'],pal:['#D8C5AD','#A99A8B','#40372F']},
 {id:'o4',t:'Look total neutro',tags:['Dia a dia','Trabalho'],pieces:['Top de base','Calças bege','Casaco comprido','Mala em pele'],pal:['#F5F0E9','#D8C5AD','#A99A8B']},
 {id:'o5',t:'Conjunto de alfaiataria',tags:['Trabalho','Festa'],pieces:['Blazer a condizer','Calças de corte reto','Top de seda','Sapatos de salto baixo'],pal:['#40372F','#A99A8B','#F5F0E9']},
 {id:'o6',t:'Trench e botas',tags:['Dia a dia','Inverno'],pieces:['Trench cor areia','Camisola fina','Calças escuras','Botas'],pal:['#D8C5AD','#40372F','#A99A8B']},
 {id:'o7',t:'Look de viagem confortável',tags:['Viagem'],pieces:['Calças largas de algodão','T-shirt de base','Casaco leve','Ténis confortáveis','Lenço grande'],pal:['#F5F0E9','#A99A8B','#40372F']},
 {id:'o8',t:'Casual chique de sábado',tags:['Fim de semana','Dia a dia'],pieces:['Camisa branca','Jeans claros','Mocassins','Cinto fino'],pal:['#FFFFFF','#D8C5AD','#40372F']},
 {id:'o9',t:'Vestido preto e dourados',tags:['Festa'],pieces:['Vestido preto simples','Brincos dourados','Clutch','Sandálias de salto'],pal:['#40372F','#D8C5AD','#D9BFC0']},
 {id:'o10',t:'T-shirt branca e saia plissada',tags:['Dia a dia','Verão'],pieces:['T-shirt branca','Saia plissada','Ténis','Mala de ombro'],pal:['#FFFFFF','#D9BFC0','#A99A8B']},
 {id:'o11',t:'Casaco comprido e gola alta',tags:['Inverno','Trabalho'],pieces:['Gola alta fina','Casaco comprido','Calças de lã','Botins'],pal:['#A99A8B','#40372F','#F5F0E9']},
 {id:'o12',t:'Cidade e praia',tags:['Verão','Viagem','Fim de semana'],pieces:['Camisa de linho aberta','Top','Calções de algodão','Chapéu','Sandálias rasas'],pal:['#F5F0E9','#D8C5AD','#D9BFC0']},
 {id:'o13',t:'Entrevista de emprego',tags:['Trabalho'],pieces:['Camisa lisa','Calças de alfaiataria','Blazer','Sapatos fechados'],pal:['#F5F0E9','#A99A8B','#40372F']}
];
const FASHION_BRANDS=[
 {n:'Zara',d:'Tendências e básicos, de roupa a acessórios.',tags:'moda roupa tendencias basicos'},
 {n:'Mango',d:'Looks urbanos e casual chique.',tags:'moda roupa casual chique trabalho'},
 {n:'COS',d:'Minimalismo e linhas limpas.',tags:'moda roupa minimalista neutro'},
 {n:'Massimo Dutti',d:'Alfaiataria e peças de aspeto cuidado.',tags:'moda roupa alfaiataria trabalho festa'},
 {n:'Uniqlo',d:'Básicos e malhas para o dia a dia.',tags:'moda roupa basicos malhas inverno'},
 {n:'Arket',d:'Essenciais modernos em tons calmos.',tags:'moda roupa neutro essenciais'},
 {n:'& Other Stories',d:'Moda feminina com um toque de estilo próprio.',tags:'moda roupa festa acessorios'},
 {n:'Sézane',d:'Peças femininas de inspiração francesa.',tags:'moda roupa vestidos'},
 {n:'Lanidor',d:'Marca portuguesa de moda feminina.',tags:'moda roupa portuguesa'},
 {n:'Sacoor',d:'Marca portuguesa de roupa e acessórios.',tags:'moda roupa portuguesa trabalho'},
 {n:'Salsa Jeans',d:'Marca portuguesa conhecida pelas calças de ganga.',tags:'moda jeans ganga portuguesa'},
 {n:'Parfois',d:'Malas e acessórios.',tags:'acessorios malas bijuteria viagem'},
 {n:'Bimba y Lola',d:'Malas, sapatos e acessórios.',tags:'acessorios malas sapatos'},
 {n:'Vinted',d:'Mercado de roupa em segunda mão.',tags:'segunda mao usada vintage sustentavel'}
];
const REPORT_REASONS=['Assédio ou ofensas','Spam ou publicidade enganosa','Conteúdo impróprio','Pessoa que parece ter menos de 18 anos','Venda de algo proibido ou fraude','Outro motivo'];

/* páginas completas das receitas e das ideias de casa */
const DETAIL={
 r1:{meta:'5 minutos · 1 pessoa · uma noite no frio',items:['5 colheres de sopa de flocos de aveia','100 ml de leite ou bebida vegetal','1 iogurte natural','1 colher de chá de mel (opcional)','Fruta fresca a gosto'],
  steps:['Junta a aveia, o leite e o iogurte num frasco.','Mexe bem e adoça, se quiseres.','Fecha e guarda no frigorífico durante a noite.','De manhã, junta a fruta e come frio.']},
 r2:{meta:'40 minutos · 2 pessoas',items:['200 g de massa','400 g de tomate cereja','3 dentes de alho','3 colheres de sopa de azeite','Manjericão fresco','Sal e pimenta'],
  steps:['Aquece o forno a 200 °C.','Põe o tomate e o alho num tabuleiro com o azeite, sal e pimenta.','Assa cerca de 25 minutos, até o tomate rebentar.','Coze a massa e guarda um pouco da água.','Esmaga o tomate, junta a massa e um pouco da água. Finaliza com manjericão.']},
 r3:{meta:'15 minutos · 2 pessoas',items:['1 lata de grão-de-bico cozido','1 pepino','2 tomates','Um punhado de azeitonas','Sumo de meio limão','2 colheres de sopa de azeite','Sal e pimenta'],
  steps:['Escorre e passa o grão por água.','Corta o pepino e o tomate em cubos.','Junta tudo numa taça, com as azeitonas.','Mistura o limão, o azeite, sal e pimenta e rega a taça.']},
 r4:{meta:'50 minutos · 8 fatias',items:['1 iogurte natural','2 medidas de açúcar (usa o copo do iogurte)','3 medidas de farinha','1 medida de óleo','3 ovos','1 saqueta de fermento'],
  steps:['Aquece o forno a 180 °C e unta uma forma.','Bate os ovos com o açúcar.','Junta o iogurte e o óleo.','Envolve a farinha com o fermento.','Leva ao forno cerca de 35 minutos. Está pronto quando um palito sair seco.']},
 d1:{meta:'Uma tarde',photos:['luz','estante','colo'],items:['Uma cadeira ou poltrona confortável','Um candeeiro de luz quente','Uma manta','Uma mesa pequena para a bebida e o livro'],
  steps:['Escolhe um canto sossegado, de preferência perto de uma janela.','Coloca a cadeira com a luz por cima do ombro.','Junta a manta e a mesa.','Deixa por perto só os livros que estás a ler.']},
 d2:{meta:'Ao longo do ano',photos:['quarto','casa','vela'],items:['Duas cores base, por exemplo creme e areia','Capas de almofada','Quadros ou fotografias'],
  steps:['Escolhe as duas cores que já tens mais em casa.','Usa-as nas peças grandes.','Em cada estação, muda só as capas e os quadros.']},
 d3:{meta:'10 minutos por semana',photos:['canto','casa','luz'],items:['Jiboia, zamioculca ou espada-de-são-jorge','Vasos com furo no fundo','Terra para plantas de interior'],
  steps:['Escolhe um sítio com luz indireta.','Rega só quando a terra estiver seca.','Limpa o pó das folhas de vez em quando.','Se tens animais ou crianças, confirma antes se a planta é tóxica.']},
 d4:{meta:'Um fim de semana',photos:['quarto','luz','decoracao'],items:['Uma manta ou almofadas de linho','Uma peça de cerâmica','Um objeto de madeira clara','Uma vela'],
  steps:['Tira o que não usas das superfícies.','Junta três texturas diferentes em cada zona.','Deixa espaço livre entre as peças.','Nunca deixes velas acesas sem vigilância.']}
};
