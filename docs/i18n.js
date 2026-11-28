'use strict';
/* Línguas. O texto base é o português; para outra língua, o texto do ecrã é traduzido depois de desenhado.
   Elementos com data-nt (o que as pessoas escrevem) nunca são traduzidos.
   Para acrescentar uma língua: juntar a LANGS e criar o dicionário respetivo. */
const LANGS={pt:'Português',en:'English',fr:'Français',es:'Español',it:'Italiano'};
const LANG_KEY='maelle-lang';
let LANG='pt';try{if(LANGS[localStorage.getItem(LANG_KEY)])LANG=localStorage.getItem(LANG_KEY)}catch(e){}
function setLang(l){if(!LANGS[l]||l===LANG)return;try{localStorage.setItem(LANG_KEY,l)}catch(e){return}location.reload()}
const langPicker=()=>`<div class="langs" data-nt role="group" aria-label="Língua / Language">${Object.keys(LANGS).map(k=>`<button class="btn small ${k===LANG?'':'ghost'}" data-act="lang" data-l="${k}" lang="${k}" aria-pressed="${k===LANG}">${LANGS[k]}</button>`).join('')}</div>`;

/* português=inglês, uma entrada por linha */
const EN_TEXT=`
5 minutos · manhã e noite=5 minutes · morning and night
Gel ou creme de limpeza suave=Gentle cleansing gel or cream
Hidratante adequado ao teu tipo de pele=Moisturiser suited to your skin type
Protetor solar de rosto com FPS 30 ou mais=Face sunscreen SPF 30 or higher
De manhã, lava o rosto com o produto de limpeza e seca sem esfregar.=In the morning, cleanse your face and pat dry.
Aplica o hidratante.=Apply moisturiser.
Termina com o protetor solar e volta a aplicar se estiveres ao sol.=Finish with sunscreen and reapply if you are in the sun.
À noite, retira o protetor e a maquilhagem, limpa e hidrata.=At night, remove sunscreen and make-up, cleanse and moisturise.
20 minutos · uma vez por semana=20 minutes · once a week
Champô suave=Gentle shampoo
Máscara hidratante=Hydrating mask
Pente de dentes largos=Wide-tooth comb
Protetor de calor=Heat protectant
Lava com o champô, sobretudo no couro cabeludo.=Shampoo, focusing on the scalp.
Aplica a máscara nos comprimentos e pontas.=Apply the mask to lengths and ends.
Espera o tempo indicado na embalagem e enxagua bem.=Wait the time on the pack and rinse well.
Desembaraça das pontas para a raiz.=Detangle from ends to roots.
Antes de usar calor, aplica o protetor.=Apply protectant before using heat.
Base leve ou creme com cor=Light foundation or tinted cream
Corretor=Concealer
Rímel=Mascara
Batom ou bálsamo com cor=Lipstick or tinted balm
Começa com a pele limpa e hidratada.=Start with clean, moisturised skin.
Espalha pouca base do centro para fora.=Blend a little base from the centre outwards.
Usa o corretor só onde precisas.=Use concealer only where needed.
Aplica o rímel e a cor nos lábios.=Apply mascara and lip colour.
À noite, retira tudo antes de dormir.=Remove everything before bed.
Todas as noites=Every night
Fronha de cetim=Satin pillowcase
Elástico de tecido macio=Soft fabric hair tie
Creme de noite ou o teu hidratante=Night cream or your moisturiser
Máscara para os olhos (opcional)=Eye mask (optional)
Tenta deitar-te e levantar-te a horas parecidas.=Try to sleep and wake at similar times.
Limpa e hidrata a pele.=Cleanse and moisturise.
Prende o cabelo sem apertar ou deixa-o solto.=Tie hair loosely or leave it down.
Larga o telemóvel um pouco antes de dormir.=Put your phone away before sleeping.
Beleza da comunidade=Community beauty
BELEZA DA COMUNIDADE=COMMUNITY BEAUTY
Partilhar rotina=Share a routine
Produtos indicados=Suggested products
PRODUTOS INDICADOS=SUGGESTED PRODUCTS
Como usar=How to use
COMO USAR=HOW TO USE
PRODUTOS E COMO USAR=PRODUCTS AND HOW TO USE
Nome da rotina ou dica=Routine or tip name
Produtos, um por linha (opcional)=Products, one per line (optional)
Como usar, um passo por linha=How to use, one step per line
Ainda não há rotinas partilhadas. Sê a primeira.=No shared routines yet. Be the first.
Partilha a tua experiência. Se for publicidade ou oferta de uma marca, diz.=Share your experience. If it is an ad or a brand gift, say so.
Procurar produtos=Find products
São tipos de produto, não marcas. Lê os rótulos e experimenta primeiro numa pequena zona. Se tiveres um problema de pele ou alergias, fala com um dermatologista.=These are product types, not brands. Read labels and patch test first. If you have a skin condition or allergies, see a dermatologist.
30 minutos antes de partir=30 minutes before leaving
Uma mala de cabine=A cabin bag
Peças em cores que combinam entre si=Pieces in colours that go together
Um saco para os líquidos=A bag for liquids
Um par de sapatos confortáveis=A pair of comfortable shoes
Confirma as medidas e o peso aceites pela transportadora.=Check the size and weight your carrier allows.
Escolhe peças que dão vários conjuntos.=Choose pieces that make several outfits.
Enrola a roupa e põe os sapatos no fundo.=Roll your clothes and put shoes at the bottom.
Calça e veste as peças mais volumosas na viagem.=Wear your bulkiest items while travelling.
2 dias=2 days
Um mapa com os sítios guardados=A map with saved places
Sapatos para andar=Walking shoes
Uma garrafa de água reutilizável=A reusable water bottle
Bateria portátil=Power bank
Escolhe um bairro para cada dia.=Choose one neighbourhood per day.
Junta os sítios que ficam perto uns dos outros.=Group places that are close together.
Confirma horários e reservas.=Check opening times and bookings.
Deixa uma manhã livre para improvisar.=Leave one morning free to improvise.
Na véspera=The day before
Cartão de cidadão ou passaporte=ID card or passport
Bilhetes e reservas=Tickets and bookings
Carregador do telemóvel=Phone charger
Medicação habitual=Your usual medication
Cópias digitais dos documentos=Digital copies of documents
Confirma a validade dos documentos.=Check your documents are valid.
Carrega o telemóvel e a bateria portátil.=Charge your phone and power bank.
Guarda a medicação na mala de mão.=Keep medication in your hand luggage.
Verifica a hora e o local de partida.=Check departure time and place.
Antes de partir=Before you leave
Primeira noite reservada=First night booked
Contactos de emergência=Emergency contacts
Itinerário partilhado com alguém de confiança=Itinerary shared with someone you trust
Um seguro de viagem=Travel insurance
Escolhe um alojamento bem localizado.=Choose well-located accommodation.
Chega de preferência durante o dia.=Arrive in daylight if you can.
Combina quando vais dar notícias.=Agree when you will check in.
Não digas a desconhecidos onde estás alojada.=Don’t tell strangers where you are staying.
Confia no teu instinto e muda de planos se precisares.=Trust your instinct and change plans if you need to.
Viagens da comunidade=Community trips
VIAGENS DA COMUNIDADE=COMMUNITY TRIPS
Partilhar viagem=Share a trip
O que levar=What to pack
O QUE LEVAR=WHAT TO PACK
Roteiro e dicas=Itinerary and tips
ROTEIRO E DICAS=ITINERARY AND TIPS
Destino ou nome da viagem=Destination or trip name
O que levar, um por linha (opcional)=What to pack, one per line (optional)
Roteiro e dicas, um por linha=Itinerary and tips, one per line
Ainda não há viagens partilhadas. Sê a primeira.=No shared trips yet. Be the first.
Não partilhes moradas nem datas em que a tua casa fica vazia.=Don’t share addresses or dates when your home is empty.
O texto tem palavras que não são permitidas na MAELLE.=This text has words that are not allowed on MAELLE.
Ex.: camisa, jeans, blazer=E.g. shirt, jeans, blazer
Mulher=Women
Homem=Men
Moda masculina=Men’s fashion
Ideias de outfits para homem=Outfit ideas for men
Fato azul e camisa branca=Navy suit and white shirt
Blazer azul-escuro=Navy blazer
Calças a condizer=Matching trousers
Camisa branca=White shirt
Sapatos de pele=Leather shoes
Blazer e calças chino=Blazer and chinos
Blazer sem forro=Unlined blazer
Calças chino bege=Beige chinos
Camisa clara=Light shirt
Mocassins=Loafers
Casaco de ganga e jeans=Denim jacket and jeans
Casaco de ganga=Denim jacket
T-shirt lisa=Plain T-shirt
Jeans retos=Straight jeans
Ténis brancos=White trainers
Mala de lona=Canvas bag
Casaco com cor e jeans=Colourful jacket and jeans
Casaco quente vermelho=Warm red jacket
Jeans escuros=Dark jeans
Mala em pele=Leather bag
Botas=Boots
Hoodie e casaco de ganga=Hoodie and denim jacket
Camisola com capuz=Hooded sweatshirt
Calças escuras=Dark trousers
Ténis=Trainers
Boné e casaco leve=Cap and light jacket
Boné cinzento=Grey cap
Casaco leve=Light jacket
T-shirt branca=White T-shirt
Calças confortáveis=Comfortable trousers
Mochila e camadas para viajar=Backpack and travel layers
Mochila=Backpack
Boné=Cap
Calças práticas=Practical trousers
Sapatilhas confortáveis=Comfortable sneakers
Alfaiataria com cor=Colourful tailoring
Fato em cor viva=Bold-colour suit
Camisa lisa=Plain shirt
Lenço de bolso=Pocket square
5 minutos · 1 pessoa · uma noite no frio=5 minutes · 1 serving · overnight in the fridge
5 colheres de sopa de flocos de aveia=5 tablespoons rolled oats
100 ml de leite ou bebida vegetal=100 ml milk or plant drink
1 iogurte natural=1 pot natural yoghurt
1 colher de chá de mel (opcional)=1 teaspoon honey (optional)
Fruta fresca a gosto=Fresh fruit to taste
Junta a aveia, o leite e o iogurte num frasco.=Put the oats, milk and yoghurt in a jar.
Mexe bem e adoça, se quiseres.=Stir well and sweeten if you like.
Fecha e guarda no frigorífico durante a noite.=Close it and leave in the fridge overnight.
De manhã, junta a fruta e come frio.=In the morning, add the fruit and eat cold.
40 minutos · 2 pessoas=40 minutes · serves 2
200 g de massa=200 g pasta
400 g de tomate cereja=400 g cherry tomatoes
3 dentes de alho=3 garlic cloves
3 colheres de sopa de azeite=3 tablespoons olive oil
Manjericão fresco=Fresh basil
Sal e pimenta=Salt and pepper
Aquece o forno a 200 °C.=Heat the oven to 200 °C.
Põe o tomate e o alho num tabuleiro com o azeite, sal e pimenta.=Put the tomatoes and garlic on a tray with the oil, salt and pepper.
Assa cerca de 25 minutos, até o tomate rebentar.=Roast for about 25 minutes, until the tomatoes burst.
Coze a massa e guarda um pouco da água.=Cook the pasta and keep some of the water.
Esmaga o tomate, junta a massa e um pouco da água. Finaliza com manjericão.=Crush the tomatoes, add the pasta and a little water. Finish with basil.
15 minutos · 2 pessoas=15 minutes · serves 2
1 lata de grão-de-bico cozido=1 can cooked chickpeas
1 pepino=1 cucumber
2 tomates=2 tomatoes
Um punhado de azeitonas=A handful of olives
Sumo de meio limão=Juice of half a lemon
2 colheres de sopa de azeite=2 tablespoons olive oil
Escorre e passa o grão por água.=Drain and rinse the chickpeas.
Corta o pepino e o tomate em cubos.=Dice the cucumber and tomatoes.
Junta tudo numa taça, com as azeitonas.=Put everything in a bowl with the olives.
Mistura o limão, o azeite, sal e pimenta e rega a taça.=Mix the lemon, oil, salt and pepper and pour over the bowl.
50 minutos · 8 fatias=50 minutes · 8 slices
2 medidas de açúcar (usa o copo do iogurte)=2 measures sugar (use the yoghurt pot)
3 medidas de farinha=3 measures flour
1 medida de óleo=1 measure oil
3 ovos=3 eggs
1 saqueta de fermento=1 sachet baking powder
Aquece o forno a 180 °C e unta uma forma.=Heat the oven to 180 °C and grease a tin.
Bate os ovos com o açúcar.=Whisk the eggs with the sugar.
Junta o iogurte e o óleo.=Add the yoghurt and oil.
Envolve a farinha com o fermento.=Fold in the flour and baking powder.
Leva ao forno cerca de 35 minutos. Está pronto quando um palito sair seco.=Bake for about 35 minutes. It is ready when a skewer comes out dry.
Uma tarde=One afternoon
Uma cadeira ou poltrona confortável=A comfortable chair or armchair
Um candeeiro de luz quente=A warm-light lamp
Uma manta=A throw blanket
Uma mesa pequena para a bebida e o livro=A small table for your drink and book
Escolhe um canto sossegado, de preferência perto de uma janela.=Choose a quiet corner, ideally near a window.
Coloca a cadeira com a luz por cima do ombro.=Place the chair so the light comes over your shoulder.
Junta a manta e a mesa.=Add the blanket and the table.
Deixa por perto só os livros que estás a ler.=Keep only the books you are reading nearby.
Ao longo do ano=Through the year
Duas cores base, por exemplo creme e areia=Two base colours, for example cream and sand
Capas de almofada=Cushion covers
Quadros ou fotografias=Pictures or photographs
Escolhe as duas cores que já tens mais em casa.=Pick the two colours you already have most at home.
Usa-as nas peças grandes.=Use them on the large pieces.
Em cada estação, muda só as capas e os quadros.=Each season, change only the covers and pictures.
10 minutos por semana=10 minutes a week
Jiboia, zamioculca ou espada-de-são-jorge=Pothos, ZZ plant or snake plant
Vasos com furo no fundo=Pots with a drainage hole
Terra para plantas de interior=Indoor potting soil
Escolhe um sítio com luz indireta.=Choose a spot with indirect light.
Rega só quando a terra estiver seca.=Water only when the soil is dry.
Limpa o pó das folhas de vez em quando.=Dust the leaves now and then.
Se tens animais ou crianças, confirma antes se a planta é tóxica.=If you have pets or children, check first whether the plant is toxic.
Um fim de semana=One weekend
Uma manta ou almofadas de linho=A throw or linen cushions
Uma peça de cerâmica=A ceramic piece
Um objeto de madeira clara=A light-wood object
Uma vela=A candle
Tira o que não usas das superfícies.=Clear surfaces of things you don’t use.
Junta três texturas diferentes em cada zona.=Combine three different textures in each area.
Deixa espaço livre entre as peças.=Leave space between the pieces.
Nunca deixes velas acesas sem vigilância.=Never leave lit candles unattended.
Ideia=Idea
Ver receita=View recipe
Ver ideia=View idea
Ingredientes=Ingredients
INGREDIENTES=INGREDIENTS
PREPARAÇÃO=METHOD
O QUE PRECISAS=WHAT YOU NEED
COMO FAZER=HOW TO DO IT
Receitas da comunidade=Community recipes
RECEITAS DA COMUNIDADE=COMMUNITY RECIPES
Ideias da comunidade=Community ideas
IDEIAS DA COMUNIDADE=COMMUNITY IDEAS
Partilhar receita=Share a recipe
Partilhar ideia=Share an idea
Nome da receita=Recipe name
Nome da ideia=Idea name
Ingredientes, um por linha=Ingredients, one per line
Preparação, um passo por linha=Method, one step per line
O que precisas, um por linha (opcional)=What you need, one per line (optional)
Como fazer, um passo por linha=How to do it, one step per line
Ainda não há receitas partilhadas. Sê a primeira.=No shared recipes yet. Be the first.
Ainda não há ideias partilhadas. Sê a primeira.=No shared ideas yet. Be the first.
Entra na tua conta para veres e partilhares com a comunidade.=Sign in to see and share with the community.
Partilha só fotografias e textos teus.=Only share your own photos and text.
Adiciona uma fotografia.=Add a photo.
Escreve um nome com pelo menos 3 letras.=Enter a name with at least 3 letters.
Escreve os ingredientes.=Enter the ingredients.
Explica os passos.=Explain the steps.
Entra na tua conta para partilhares.=Sign in to share.
Ampliar imagem=Enlarge image
Imagem ilustrativa=Illustrative image
Publicações de exemplo, de pessoas fictícias.=Sample posts from fictional people.
Ideias em imagens. Toca numa fotografia para veres o tema e guarda no coração o que gostares.=Ideas in pictures. Tap a photo to see the topic and tap the heart to save what you like.
As imagens são ilustrativas. As ligações abrem sites externos. A MAELLE não é afiliada a estas marcas.=Images are for illustration. Links open external sites. MAELLE is not affiliated with these brands.
Início=Home
Comunidade=Community
Perfil=Profile
Navegação principal=Main navigation
Um universo criado para ti=A world created for you
Começar=Get started
Já tenho conta=I already have an account
Explorar sem conta=Explore without an account
Espaço só para maiores de 18 anos.=For adults aged 18 and over only.
Ainda não é a tua vez=It's not your turn yet
A MAELLE é só para maiores de 18 anos. Obrigada pelo interesse. Quando fizeres 18, vais ser muito bem-vinda.=MAELLE is for over-18s only. Thank you for your interest. Once you turn 18, you'll be very welcome.
Neste protótipo o bloqueio fica guardado só neste dispositivo.=In this prototype the block is saved on this device only.
Cria a tua conta=Create your account
Estamos felizes por teres chegado. Cria o teu espaço no universo MAELLE.=We're happy you're here. Create your space in the MAELLE world.
Data de nascimento=Date of birth
Tenho 18 anos ou mais, aceito os=I am 18 or over, I accept the
Termos=Terms
e li a=and I have read the
Política de Privacidade=Privacy Policy
Termos de Utilização=Terms of Use
Criar conta=Create account
Já tens conta? Inicia sessão=Have an account? Log in
A MAELLE é só para maiores de 18 anos. A tua conta e o My Place ficam guardados online, de forma privada.=MAELLE is for over-18s only. Your account and My Place are privately saved online.
Voltar=Back
O teu nome=Your name
O teu e-mail=Your email
Criar palavra-passe=Create password
Bem-vinda de volta=Welcome back
O teu espaço espera por ti.=Your space is waiting for you.
Entrar=Log in
Esqueceste-te da palavra-passe?=Forgot your password?
Ainda não tens conta? Cria uma aqui=No account yet? Create one here
Palavra-passe=Password
Personaliza o teu perfil=Personalise your profile
Este é o teu espaço. Mostra-nos um pouco de ti.=This is your space. Show us a bit of you.
Guardar perfil=Save profile
Nome de utilizador=Username
Conta-nos um pouco sobre ti...=Tell us a bit about you...
Sobre ti=About you
Editar perfil=Edit profile
AS MINHAS PUBLICAÇÕES=MY POSTS
PUBLICAÇÕES=POSTS
Publicar=Post
Foto=Photo
Ainda não publicaste nada.=You haven't posted anything yet.
Ainda sem publicações.=No posts yet.
Definições=Settings
Partilha algo no teu perfil=Share something on your profile
Nova publicação=New post
Nome, foto e biografia=Name, photo and bio
Os meus interesses=My interests
Escolhe os teus temas=Choose your topics
SEGURANÇA=SAFETY
Utilizadoras bloqueadas=Blocked users
Ainda não bloqueaste ninguém.=You haven't blocked anyone.
Desbloquear=Unblock
Terminar sessão=Log out
Apagar os dados deste dispositivo=Delete the data on this device
Espaço só para maiores de 18 anos, idade confirmada.=For over-18s only, age confirmed.
Entra na tua conta para veres perfis.=Log in to see profiles.
Este perfil não está disponível.=This profile isn't available.
Bloqueaste esta conta.=You blocked this account.
Escolhe os temas de que mais gostas para personalizarmos o teu universo MAELLE.=Pick your favourite topics so we can personalise your MAELLE world.
Guardar=Save
Continuar=Continue
Escolhe pelo menos um tema.=Choose at least one topic.
Bem-vinda ao teu universo=Welcome to your world
Descobre, inspira-te e faz parte da nossa comunidade.=Discover, get inspired and join our community.
Procura outfits e marcas, de todos os estilos=Find outfits and brands in every style
Clube de Livros=Book Club
Indicações, livros à venda e conversas=Recommendations, books for sale and chats
Para ti=For you
COLEÇÕES=COLLECTIONS
As tuas coleções guardadas=Your saved collections
Ainda não guardaste nada. Abre um tema e toca no coração das ideias de que gostas.=Nothing saved yet. Open a topic and tap the heart on ideas you like.
Adicionar capa=Add cover
Mudar capa=Change cover
Remover capa=Remove cover
Procura outfits e marcas=Find outfits and brands
Skincare, cabelo, maquilhagem e looks=Skincare, hair, makeup and looks
Guardar ideia=Save idea
Coleções=Collections
As ideias que guardaste, organizadas por tema.=Your saved ideas, organised by topic.
Ainda não tens ideias guardadas. Toca no coração em qualquer ideia para a guardar aqui.=No saved ideas yet. Tap the heart on any idea to keep it here.
Junta fotos, notas e cores num só sítio.=Gather photos, notes and colours in one place.
Novo moodboard=New moodboard
Ainda não tens moodboards. Cria o primeiro e escolhe a paleta.=No moodboards yet. Create your first and pick a palette.
Organiza a tua vida, ao teu ritmo.=Organise your life at your own pace.
Tarefas=Tasks
Hábitos hoje=Habits today
Eventos hoje=Events today
A minha agenda=My calendar
Sem eventos marcados=No events planned
Minha lista de tarefas=My to-do list
Ainda sem tarefas=No tasks yet
Tudo feito=All done
Os meus objetivos=My goals
Define o primeiro=Set your first
Os meus hábitos=My habits
Cria o primeiro hábito=Create your first habit
Minha lista de desejos=My wish list
Ainda vazia=Still empty
Pequenos passos, grandes conquistas.=Small steps, big wins.
Seg=Mon
Ter=Tue
Qua=Wed
Qui=Thu
Sex=Fri
Sáb=Sat
Dom=Sun
Hoje=Today
Evento=Event
Sem eventos neste dia.=No events on this day.
Mês anterior=Previous month
Mês seguinte=Next month
Uma coisa de cada vez.=One thing at a time.
Nada por fazer. Aproveita o dia.=Nothing to do. Enjoy your day.
Nova tarefa=New task
Adicionar tarefa=Add task
Limpar concluídas=Clear completed
Define para onde queres ir e acompanha o caminho.=Decide where you want to go and track the way.
Novo objetivo=New goal
Ainda não tens objetivos. Começa por um pequeno.=No goals yet. Start with a small one.
Marca cada dia em que o cumpres.=Tick each day you do it.
Novo hábito=New habit
Ainda não tens hábitos. Um bom começo: beber água, ler ou alongar.=No habits yet. A good start: drink water, read or stretch.
O que gostavas de ter, num só sítio.=Everything you'd love to have, in one place.
A tua lista está vazia. Também podes adicionar produtos da loja.=Your list is empty. You can also add products from the shop.
Desejo=Wish
Preço em euros=Price in euros
Adicionar desejo=Add wish
Cuida de ti. Expressa o teu estilo.=Take care of yourself. Express your style.
Rotina de hoje=Today's routine
Manhã=Morning
Noite=Evening
Limpar=Cleanse
Hidratar=Moisturise
Protetor solar=Sunscreen
Sérum ou tratamento=Serum or treatment
Procura todo o tipo de outfits e marcas.=Search all kinds of outfits and brands.
Todos=All
Tudo=All
IDEIAS DE OUTFITS=OUTFIT IDEAS
Guardar look=Save look
Ver fotos=See photos
MARCAS=BRANDS
Procurar=Search
PROCURAR NA WEB=SEARCH THE WEB
As ligações abrem sites externos. A MAELLE não é afiliada a estas marcas.=Links open external sites. MAELLE is not affiliated with these brands.
Ex.: vestido festa, jeans, blazer=E.g. party dress, jeans, blazer
Procurar outfits e marcas=Search outfits and brands
Desafia-te, cria e descobre novas experiências.=Challenge yourself, create and try new experiences.
Desafios Mensais=Monthly Challenges
Escolhe um para este mês=Pick one for this month
Atividade Criativa=Creative Activity
Uma proposta nova todos os dias=A new prompt every day
Uma proposta nova todos os dias.=A new prompt every day.
Experiências Digitais=Digital Experiences
Respira um minuto e escolhe as palavras do mês=Breathe for a minute and choose your words of the month
Eventos & Conteúdos Especiais=Events & Special Content
Entrar no desafio=Join the challenge
Proposta de hoje=Today's prompt
Guardar página=Save page
Escreve aqui=Write here
A tua resposta=Your answer
Pequenos rituais para o teu dia.=Little rituals for your day.
Ritual de respiração=Breathing ritual
Seis respirações, cerca de um minuto.=Six breaths, about a minute.
Inspira=Breathe in
Expira=Breathe out
Parar=Stop
Bom trabalho=Well done
Lembrar-me=Remind me
Descobre, troca e conversa sobre livros.=Discover, swap and talk about books.
Indicações=Recommendations
Indicação=Recommendation
A aguardar aprovação=Awaiting approval
À venda=For sale
Conversas=Chats
Quero ler=Want to read
A ler=Reading
Lido=Read
Indicar um livro=Suggest a book
Conversar=Chat
Conversa geral=General chat
Conversa aberta às leitoras. Respeito acima de tudo.=A chat open to all readers. Respect above all.
Denunciar=Report
Escreve uma mensagem=Write a message
Mensagem=Message
Enviar mensagem=Send message
Partilha, descobre e inspira-te.=Share, discover and get inspired.
Publicações=Posts
O que se está a partilhar=What people are sharing
Grupos=Groups
GRUPOS=GROUPS
Encontra ou cria o teu grupo=Find or create your group
Perguntas & Respostas=Questions & Answers
Pergunta à comunidade=Ask the community
Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora.=For over-18s only. You can report or block any user.
Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora, em qualquer publicação.=For over-18s only. You can report or block any user on any post.
As publicações de exemplo são fictícias. Neste protótipo, o que escreves fica só no teu dispositivo.=Sample posts are fictional. In guest mode, what you write stays on your device.
Bloquear=Block
Apagar=Delete
Oculta pela equipa=Hidden by the team
Partilha uma ideia, uma dica ou uma pergunta=Share an idea, a tip or a question
Comentar=Comment
Enviar comentário=Send comment
Ainda não há publicações. Escreve a primeira.=No posts yet. Write the first one.
Ainda sem publicações. Sê a primeira.=No posts yet. Be the first.
Pessoas com os mesmos interesses que tu.=People who share your interests.
Criar o meu grupo=Create my group
OS MEUS GRUPOS=MY GROUPS
DESCOBRIR=DISCOVER
Não há outros grupos por agora.=No other groups for now.
Entrar no grupo=Join group
Estás no grupo. Sair=You're in this group. Leave
Estás no grupo=You're a member
Criado por ti=Created by you
Eliminar grupo=Delete group
Regras do grupo=Group rules
Entra no grupo para publicares.=Join the group to post.
Escreve para o grupo=Write to the group
Geral=General
Faz uma pergunta=Ask a question
Nova pergunta=New question
Publicar pergunta=Post question
Responder=Reply
Enviar resposta=Send reply
Ainda sem respostas.=No replies yet.
Ainda não há perguntas.=No questions yet.
Uma seleção especial para ti.=A special selection for you.
Vender na MAELLE=Sell on MAELLE
Produtos, serviços e livros=Products, services and books
Escolhidas pelos teus interesses=Picked for your interests
Escolhidas pelos teus interesses.=Picked for your interests.
Peças e serviços de pessoas e marcas.=Items and services from people and brands.
Produtos=Products
PRODUTOS=PRODUCTS
Serviços=Services
SERVIÇOS=SERVICES
Vender um produto=Sell a product
Favorito=Favourite
Marcas que combinam contigo.=Brands that suit you.
Convidar uma marca=Invite a brand
Seguir=Follow
A seguir=Following
Ver peças=See items
Qualquer pessoa maior de 18 anos pode vender produtos, serviços e livros.=Anyone over 18 can sell products, services and books.
Oferecer um serviço=Offer a service
Vender um livro=Sell a book
Como vai funcionar=How it will work
Para já, os anúncios servem para mostrar o que vendes. Quando o pagamento estiver ligado, a MAELLE cobra uma pequena comissão sobre cada venda e os custos de conta de marcas e vendedores.=For now, listings showcase what you sell. Once payments are enabled, MAELLE will charge a small commission on each sale, plus account fees for brands and sellers.
OS MEUS ANÚNCIOS=MY LISTINGS
Ainda não tens anúncios.=You have no listings yet.
O que guardaste para mais tarde.=What you saved for later.
Toca no coração de um produto para o guardar aqui.=Tap the heart on a product to keep it here.
Ainda não guardaste nenhum serviço.=No saved services yet.
Ainda não segues nenhuma marca.=You don't follow any brands yet.
Para comprar ou reservar, contacta quem vende. O pagamento na app chega numa próxima fase.=To buy or book, contact the seller. In-app payment is coming later.
Para comprar, contacta quem vende.=To buy, contact the seller.
Produtos, serviços e marcas de exemplo. A compra online liga-se numa próxima fase.=Sample products, services and brands. Online buying is coming later.
Só para maiores de 18=Over-18s only
A MAELLE é um espaço para maiores de 18 anos. Confirma a tua idade para explorar.=MAELLE is a space for over-18s. Confirm your age to explore.
Tenho 18 anos ou mais.=I am 18 or over.
Cancelar=Cancel
Nova palavra-passe=New password
Enviamos-te um e-mail com uma ligação para escolheres uma nova.=We'll email you a link to choose a new one.
Enviar e-mail=Send email
Escolhe a nova palavra-passe=Choose your new password
Apagar a conta?=Delete account?
A tua conta, perfil, listas e fotos são apagados. Não é possível desfazer.=Your account, profile, lists and photos will be deleted. This can't be undone.
Apagar a minha conta=Delete my account
Apagar tudo?=Delete everything?
Vamos apagar a conta, o perfil, as listas, os moodboards e as publicações guardadas neste dispositivo. Não é possível desfazer.=We'll delete the account, profile, lists, moodboards and posts saved on this device. This can't be undone.
Apagar tudo=Delete everything
Novo evento=New event
Guardar evento=Save event
Título=Title
Data=Date
Hora (opcional)=Time (optional)
Nota (opcional)=Note (optional)
Nota=Note
Data (opcional)=Date (optional)
Guardar objetivo=Save goal
O que queres conquistar?=What do you want to achieve?
Objetivo=Goal
Guardar hábito=Save habit
Hábito=Habit
Ex.: Alongar de manhã=E.g. Morning stretch
Criar moodboard=Create moodboard
Nome (ex.: Verão em Lisboa)=Name (e.g. Summer in Lisbon)
Nome do moodboard=Moodboard name
Paleta=Palette
Nova nota=New note
Adicionar=Add
Uma ideia, uma frase, uma lista=An idea, a phrase, a list
Apagar moodboard?=Delete moodboard?
As fotos e notas deste moodboard serão apagadas.=This moodboard's photos and notes will be deleted.
Mostra o teu produto na loja da MAELLE.=Show your product in the MAELLE shop.
Adicionar foto=Add photo
Adicionar foto (opcional)=Add photo (optional)
Só podes vender produtos legais e teus para vender.=You may only sell legal products that are yours to sell.
Publicar produto=Publish product
Nome do produto=Product name
Marca (opcional)=Brand (optional)
Marca=Brand
Preço em €=Price in €
Categoria=Category
Descrição=Description
Link da loja (opcional)=Shop link (optional)
Link da loja=Shop link
Maquilhagem, fotografia, aulas, design e muito mais.=Makeup, photography, lessons, design and more.
Presencial e online=In person and online
Presencial=In person
Só podes oferecer serviços legais. O contacto fica visível para quem abrir o anúncio.=You may only offer legal services. Your contact is visible to anyone opening the listing.
Publicar serviço=Publish service
Nome do serviço=Service name
Modalidade=Format
Cidade (se for presencial)=City (if in person)
Cidade (opcional)=City (optional)
Cidade=City
Preço desde, em €=Price from, in €
Preço desde, em euros=Price from, in euros
O que inclui o serviço?=What does the service include?
Contacto: e-mail, telefone ou link=Contact: email, phone or link
Contacto=Contact
Publicar anúncio=Publish listing
Autora ou autor=Author
Estado=Condition
Como novo=Like new
Bom=Good
Usado=Used
Partilha um livro de que gostaste com o clube.=Share a book you loved with the club.
Indicar livro=Suggest book
Porque o recomendas?=Why do you recommend it?
Porque o recomendas=Why you recommend it
Começar uma conversa=Start a conversation
Escolhe um tema ou um livro e escreve a primeira mensagem.=Pick a topic or a book and write the first message.
Tema ou livro=Topic or book
A tua primeira mensagem=Your first message
Primeira mensagem=First message
Criar um grupo=Create a group
Reúne pessoas com os teus interesses. Serás a administradora.=Bring together people with your interests. You'll be the admin.
Vou garantir um espaço respeitoso, só para maiores de 18 anos.=I will keep this a respectful space for over-18s only.
Criar grupo=Create group
Nome do grupo=Group name
Do que se fala neste grupo?=What is this group about?
Descrição do grupo=Group description
Tema=Topic
Regras do grupo (opcional)=Group rules (optional)
Eliminar o grupo?=Delete the group?
O grupo e as suas publicações deixam de existir.=The group and its posts will be removed.
Eliminar=Delete
Copia esta mensagem e envia por e-mail ou mensagem.=Copy this message and send it by email or text.
Copiar mensagem=Copy message
Mensagem de convite=Invitation message
Guardar nos favoritos=Save to favourites
Remover dos favoritos=Remove from favourites
Adicionar à lista de desejos=Add to wish list
Já está na lista de desejos=Already on your wish list
Copiar contacto=Copy contact
Abrir contacto=Open contact
Ver na loja da marca=See in the brand's shop
Denunciar este anúncio=Report this listing
Enviar denúncia=Send report
Diz-nos o que aconteceu. A equipa MAELLE analisa cada denúncia.=Tell us what happened. The MAELLE team reviews every report.
Assédio ou ofensas=Harassment or abuse
Spam ou publicidade enganosa=Spam or misleading advertising
Conteúdo impróprio=Inappropriate content
Outro motivo=Other reason
Deixam de ver as publicações, comentários e perguntas uma da outra. Podes desbloquear no teu perfil.=You will no longer see each other's posts, comments and questions. You can unblock in Settings.
Moda=Fashion
Beleza=Beauty
Decoração=Decor
Viagens=Travel
Receitas=Recipes
Criatividade=Creativity
Organização=Organisation
Livros=Books
Cabelo=Hair
Maquilhagem=Makeup
Fotografia=Photography
Aulas=Lessons
Imagem e estilo=Image and style
Outros=Other
Painel de administração=Admin panel
Denúncias, livros e contas=Reports, books and accounts
Ainda não tens livros nesta estante. Toca em «Quero ler», «A ler» ou «Lido» num livro.=No books on this shelf yet. Tap "Want to read", "Reading" or "Read" on a book.
Sem produtos nesta seleção.=No products in this selection.
A carregar…=Loading…
Tentar de novo=Try again
Conta apagada=Account deleted
Conta bloqueada=Account blocked
Desbloqueada=Unblocked
Publicado=Posted
Apagado=Deleted
Publicação apagada=Post deleted
Perfil guardado=Profile saved
Interesses guardados=Interests saved
Palavra-passe atualizada=Password updated
E-mail confirmado=Email confirmed
Se a conta existir, vais receber um e-mail.=If the account exists, you'll receive an email.
Enviámos um e-mail. Confirma-o e depois entra.=We sent you an email. Confirm it, then log in.
Confirma o e-mail. Falta alguma coisa.=Check your email address. Something is missing.
Confirma o e-mail.=Check your email address.
A palavra-passe precisa de pelo menos 8 caracteres.=The password needs at least 8 characters.
Diz-nos o teu nome.=Tell us your name.
Indica a tua data de nascimento.=Enter your date of birth.
Confirma a data de nascimento.=Check your date of birth.
Confirma que aceitas os Termos e que leste a Política de Privacidade.=Confirm that you accept the Terms and have read the Privacy Policy.
Confirma que tens 18 anos ou mais para continuar.=Confirm you are 18 or over to continue.
Preenche o e-mail e a palavra-passe.=Fill in your email and password.
E-mail ou palavra-passe não coincidem.=Email or password don't match.
Falta confirmar o e-mail. Abre a mensagem que te enviámos.=Please confirm your email. Open the message we sent you.
Já existe uma conta com este e-mail.=An account with this email already exists.
Escolhe uma palavra-passe mais forte.=Choose a stronger password.
Demasiadas tentativas. Espera um pouco e volta a tentar.=Too many attempts. Wait a moment and try again.
Não foi possível concluir. Tenta novamente.=Something went wrong. Please try again.
Não foi possível concluir.=Something went wrong.
Não foi possível carregar.=Couldn't load.
Não foi possível abrir essa imagem.=Couldn't open that image.
Sem ligação à internet.=No internet connection.
Sem internet. Guardamos quando voltares.=You're offline. We'll save when you're back.
Não foi possível guardar online. Vamos tentar de novo.=Couldn't save online. We'll try again.
Há alterações por guardar. Toca outra vez para sair e perdê-las.=You have unsaved changes. Tap again to log out and lose them.
A sessão expirou. Entra de novo.=Your session expired. Log in again.
Essa ligação já não é válida. Pede uma nova.=That link is no longer valid. Request a new one.
Esse nome de utilizador já está em uso.=That username is taken.
O nome de utilizador precisa de pelo menos 2 caracteres.=The username needs at least 2 characters.
A foto é grande demais para guardar. Escolhe outra.=That photo is too large to save. Choose another.
Sem espaço para guardar neste dispositivo.=No space left to save on this device.
Já estava registado.=Already registered.
Grupo criado=Group created
Grupo eliminado=Group deleted
Bem-vinda ao grupo=Welcome to the group
Saíste do grupo=You left the group
Pergunta publicada=Question posted
Denúncia enviada. Obrigada por ajudares a manter a MAELLE segura.=Report sent. Thanks for helping keep MAELLE safe.
Evento guardado=Event saved
Objetivo guardado=Goal saved
Objetivo conquistado!=Goal achieved!
Hábito criado=Habit created
Produto publicado=Product published
Serviço publicado=Service published
Livro anunciado=Book listed
Livro indicado=Book suggested
Obrigada! O livro aguarda aprovação.=Thank you! The book is awaiting approval.
Guardado nos favoritos=Saved to favourites
Removido dos favoritos=Removed from favourites
Adicionado à lista de desejos=Added to wish list
Guardada em Coleções=Saved to Collections
Removida das coleções=Removed from collections
Dá um título ao evento.=Give the event a title.
Escolhe uma data.=Choose a date.
Escreve o teu objetivo.=Write your goal.
Dá um nome ao hábito.=Name the habit.
Dá um nome ao moodboard.=Name the moodboard.
Escreve a nota.=Write the note.
Dá um nome ao produto.=Name the product.
Dá um nome ao serviço.=Name the service.
Indica o preço em euros.=Enter the price in euros.
Indica o preço desde, em euros.=Enter the starting price in euros.
Explica o que inclui o serviço.=Explain what the service includes.
Indica um contacto para quem quiser falar contigo.=Add a contact for people who want to reach you.
Indica um contacto para quem quiser comprar.=Add a contact for buyers.
Indica um contacto ou o link da loja.=Add a contact or a shop link.
Indica o título do livro.=Enter the book title.
Dá um tema à conversa.=Give the chat a topic.
Escreve a primeira mensagem.=Write the first message.
Dá ao grupo um nome com pelo menos 3 letras.=Give the group a name with at least 3 letters.
Confirma que vais garantir um espaço respeitoso.=Confirm you'll keep it a respectful space.
Créditos das fotografias=Photo credits
Vídeo=Video
Retirar=Remove
A enviar o vídeo…=Uploading the video…
O vídeo é grande demais. O limite é 30 MB.=The video is too big. The limit is 30 MB.
Este formato de vídeo não é suportado.=This video format is not supported.
Seguidos=Following
Seguidoras=Followers
Remover=Remove
Encontrar pessoas=Find people
Descobre perfis e segue quem gostas.=Discover profiles and follow the ones you like.
Procurar por nome=Search by name
Ninguém encontrado.=No one found.
Ainda sem seguidoras.=No followers yet.
Ainda não segue ninguém.=Not following anyone yet.
Todas=All
Segue perfis para veres aqui as publicações.=Follow profiles to see their posts here.
Começaste a seguir=You are now following
Deixaste de seguir=You unfollowed
Seguidora removida=Follower removed
Mensagens=Messages
Quem sigo=People I follow
Ninguém=No one
As tuas conversas privadas.=Your private conversations.
Ainda não tens mensagens. Abre um perfil para começar uma conversa.=No messages yet. Open a profile to start a conversation.
Ainda não há mensagens nesta conversa.=No messages in this conversation yet.
Só tu e a outra pessoa veem esta conversa. Se denunciares uma mensagem, a equipa vê essa mensagem.=Only you and the other person see this conversation. If you report a message, the team sees that message.
Esta pessoa não aceita as tuas mensagens.=This person does not accept your messages.
Quem te pode enviar mensagens=Who can send you messages
Preferência guardada=Preference saved
Mensagem privada=Private message
Demasiadas tentativas. Espera um pouco e tenta de novo.=Too many attempts. Wait a moment and try again.
Código de convite=Invitation code
Escreve o teu código de convite.=Enter your invitation code.
Não foi possível criar a conta. Confirma o código de convite.=We couldn't create the account. Check the invitation code.
Todos os direitos reservados.=All rights reserved.
Fotos e vídeos=Photos and videos
Vídeos=Videos
Texto=Text
Abrir publicação=Open post
Publicação=Post
Ainda sem textos.=No text posts yet.
Ainda sem vídeos.=No videos yet.
Ainda sem fotos ou vídeos.=No photos or videos yet.
Esta publicação já não está disponível.=This post is no longer available.
`;

/* português¦francês¦espanhol¦italiano, uma entrada por linha */
const MORE_TEXT=`
5 minutos · manhã e noite¦5 minutes · matin et soir¦5 minutos · mañana y noche¦5 minuti · mattina e sera
Gel ou creme de limpeza suave¦Gel ou crème nettoyante douce¦Gel o crema limpiadora suave¦Gel o crema detergente delicata
Hidratante adequado ao teu tipo de pele¦Hydratant adapté à ton type de peau¦Hidratante adecuado a tu tipo de piel¦Idratante adatto al tuo tipo di pelle
Protetor solar de rosto com FPS 30 ou mais¦Protection solaire visage SPF 30 ou plus¦Protector solar facial FPS 30 o más¦Solare viso SPF 30 o superiore
De manhã, lava o rosto com o produto de limpeza e seca sem esfregar.¦Le matin, nettoie ton visage et sèche sans frotter.¦Por la mañana, limpia el rostro y seca sin frotar.¦Al mattino deterghi il viso e asciuga senza strofinare.
Aplica o hidratante.¦Applique l’hydratant.¦Aplica el hidratante.¦Applica l’idratante.
Termina com o protetor solar e volta a aplicar se estiveres ao sol.¦Termine par la protection solaire et renouvelle au soleil.¦Termina con protector solar y vuelve a aplicar si estás al sol.¦Completa con il solare e riapplica se sei al sole.
À noite, retira o protetor e a maquilhagem, limpa e hidrata.¦Le soir, retire la protection et le maquillage, nettoie et hydrate.¦Por la noche, retira protector y maquillaje, limpia e hidrata.¦La sera rimuovi solare e trucco, detergi e idrata.
20 minutos · uma vez por semana¦20 minutes · une fois par semaine¦20 minutos · una vez a la semana¦20 minuti · una volta a settimana
Champô suave¦Shampoing doux¦Champú suave¦Shampoo delicato
Máscara hidratante¦Masque hydratant¦Mascarilla hidratante¦Maschera idratante
Pente de dentes largos¦Peigne à dents larges¦Peine de púas anchas¦Pettine a denti larghi
Protetor de calor¦Protecteur thermique¦Protector térmico¦Termoprotettore
Lava com o champô, sobretudo no couro cabeludo.¦Lave surtout le cuir chevelu.¦Lava sobre todo el cuero cabelludo.¦Lava soprattutto il cuoio capelluto.
Aplica a máscara nos comprimentos e pontas.¦Applique le masque sur les longueurs et pointes.¦Aplica la mascarilla en medios y puntas.¦Applica la maschera su lunghezze e punte.
Espera o tempo indicado na embalagem e enxagua bem.¦Attends le temps indiqué et rince bien.¦Espera el tiempo indicado y aclara bien.¦Attendi il tempo indicato e risciacqua bene.
Desembaraça das pontas para a raiz.¦Démêle des pointes vers les racines.¦Desenreda de puntas a raíz.¦Districa dalle punte alle radici.
Antes de usar calor, aplica o protetor.¦Applique le protecteur avant la chaleur.¦Antes de usar calor, aplica el protector.¦Prima del calore applica il termoprotettore.
Base leve ou creme com cor¦Fond de teint léger ou crème teintée¦Base ligera o crema con color¦Fondotinta leggero o crema colorata
Corretor¦Anticernes¦Corrector¦Correttore
Rímel¦Mascara¦Máscara de pestañas¦Mascara
Batom ou bálsamo com cor¦Rouge ou baume teinté¦Labial o bálsamo con color¦Rossetto o balsamo colorato
Começa com a pele limpa e hidratada.¦Commence sur une peau propre et hydratée.¦Empieza con la piel limpia e hidratada.¦Inizia con la pelle pulita e idratata.
Espalha pouca base do centro para fora.¦Étale peu de teint du centre vers l’extérieur.¦Extiende poca base del centro hacia fuera.¦Stendi poca base dal centro verso l’esterno.
Usa o corretor só onde precisas.¦N’utilise l’anticernes que là où il faut.¦Usa corrector solo donde lo necesites.¦Usa il correttore solo dove serve.
Aplica o rímel e a cor nos lábios.¦Applique le mascara et la couleur sur les lèvres.¦Aplica la máscara y color en los labios.¦Applica mascara e colore sulle labbra.
À noite, retira tudo antes de dormir.¦Le soir, retire tout avant de dormir.¦Por la noche, retira todo antes de dormir.¦La sera rimuovi tutto prima di dormire.
Todas as noites¦Tous les soirs¦Todas las noches¦Ogni sera
Fronha de cetim¦Taie en satin¦Funda de satén¦Federa di raso
Elástico de tecido macio¦Élastique en tissu doux¦Goma de tela suave¦Elastico di tessuto morbido
Creme de noite ou o teu hidratante¦Crème de nuit ou ton hydratant¦Crema de noche o tu hidratante¦Crema notte o il tuo idratante
Máscara para os olhos (opcional)¦Masque pour les yeux (facultatif)¦Antifaz (opcional)¦Mascherina per gli occhi (facoltativa)
Tenta deitar-te e levantar-te a horas parecidas.¦Essaie de te coucher et te lever à heures régulières.¦Intenta acostarte y levantarte a horas parecidas.¦Cerca di coricarti e alzarti a orari simili.
Limpa e hidrata a pele.¦Nettoie et hydrate la peau.¦Limpia e hidrata la piel.¦Detergi e idrata la pelle.
Prende o cabelo sem apertar ou deixa-o solto.¦Attache tes cheveux sans serrer ou laisse-les libres.¦Recoge el pelo sin apretar o déjalo suelto.¦Lega i capelli senza stringere o lasciali sciolti.
Larga o telemóvel um pouco antes de dormir.¦Pose le téléphone un moment avant de dormir.¦Deja el móvil un rato antes de dormir.¦Metti via il telefono un po’ prima di dormire.
Beleza da comunidade¦Beauté de la communauté¦Belleza de la comunidad¦Bellezza della community
BELEZA DA COMUNIDADE¦BEAUTÉ DE LA COMMUNAUTÉ¦BELLEZA DE LA COMUNIDAD¦BELLEZZA DELLA COMMUNITY
Partilhar rotina¦Partager une routine¦Compartir rutina¦Condividi routine
Produtos indicados¦Produits conseillés¦Productos recomendados¦Prodotti consigliati
PRODUTOS INDICADOS¦PRODUITS CONSEILLÉS¦PRODUCTOS RECOMENDADOS¦PRODOTTI CONSIGLIATI
Como usar¦Comment utiliser¦Cómo usar¦Come usare
COMO USAR¦COMMENT UTILISER¦CÓMO USAR¦COME USARE
PRODUTOS E COMO USAR¦PRODUITS ET UTILISATION¦PRODUCTOS Y CÓMO USARLOS¦PRODOTTI E COME USARLI
Nome da rotina ou dica¦Nom de la routine ou astuce¦Nombre de la rutina o truco¦Nome della routine o consiglio
Produtos, um por linha (opcional)¦Produits, un par ligne (facultatif)¦Productos, uno por línea (opcional)¦Prodotti, uno per riga (facoltativo)
Como usar, um passo por linha¦Utilisation, une étape par ligne¦Cómo usar, un paso por línea¦Come usare, un passaggio per riga
Ainda não há rotinas partilhadas. Sê a primeira.¦Pas encore de routines partagées. Sois la première.¦Aún no hay rutinas compartidas. Sé la primera.¦Ancora nessuna routine condivisa. Sii la prima.
Partilha a tua experiência. Se for publicidade ou oferta de uma marca, diz.¦Partage ton expérience. Si c’est une publicité ou un cadeau de marque, dis-le.¦Comparte tu experiencia. Si es publicidad o regalo de una marca, dilo.¦Condividi la tua esperienza. Se è pubblicità o un omaggio di un marchio, dillo.
Procurar produtos¦Chercher des produits¦Buscar productos¦Cerca prodotti
São tipos de produto, não marcas. Lê os rótulos e experimenta primeiro numa pequena zona. Se tiveres um problema de pele ou alergias, fala com um dermatologista.¦Ce sont des types de produits, pas des marques. Lis les étiquettes et teste d’abord sur une petite zone. En cas de problème de peau ou d’allergie, consulte un dermatologue.¦Son tipos de producto, no marcas. Lee las etiquetas y prueba antes en una zona pequeña. Si tienes un problema de piel o alergias, consulta a un dermatólogo.¦Sono tipi di prodotto, non marchi. Leggi le etichette e prova prima su una piccola zona. Se hai problemi di pelle o allergie, rivolgiti a un dermatologo.
30 minutos antes de partir¦30 minutes avant de partir¦30 minutos antes de salir¦30 minuti prima di partire
Uma mala de cabine¦Une valise cabine¦Una maleta de cabina¦Un bagaglio a mano
Peças em cores que combinam entre si¦Des pièces aux couleurs assorties¦Prendas en colores que combinan¦Capi in colori abbinabili
Um saco para os líquidos¦Un sachet pour les liquides¦Una bolsa para líquidos¦Una bustina per i liquidi
Um par de sapatos confortáveis¦Une paire de chaussures confortables¦Un par de zapatos cómodos¦Un paio di scarpe comode
Confirma as medidas e o peso aceites pela transportadora.¦Vérifie les dimensions et le poids acceptés par le transporteur.¦Comprueba las medidas y el peso que admite la compañía.¦Controlla misure e peso ammessi dal vettore.
Escolhe peças que dão vários conjuntos.¦Choisis des pièces qui composent plusieurs tenues.¦Elige prendas que den varios conjuntos.¦Scegli capi che creano più outfit.
Enrola a roupa e põe os sapatos no fundo.¦Roule les vêtements et mets les chaussures au fond.¦Enrolla la ropa y pon los zapatos al fondo.¦Arrotola i vestiti e metti le scarpe sul fondo.
Calça e veste as peças mais volumosas na viagem.¦Porte les pièces les plus volumineuses pendant le trajet.¦Lleva puestas las prendas más voluminosas.¦Indossa in viaggio i capi più ingombranti.
2 dias¦2 jours¦2 días¦2 giorni
Um mapa com os sítios guardados¦Une carte avec les lieux enregistrés¦Un mapa con los sitios guardados¦Una mappa con i posti salvati
Sapatos para andar¦Des chaussures de marche¦Zapatos para caminar¦Scarpe per camminare
Uma garrafa de água reutilizável¦Une gourde réutilisable¦Una botella de agua reutilizable¦Una borraccia riutilizzabile
Bateria portátil¦Batterie externe¦Batería portátil¦Batteria portatile
Escolhe um bairro para cada dia.¦Choisis un quartier par jour.¦Elige un barrio para cada día.¦Scegli un quartiere per ogni giorno.
Junta os sítios que ficam perto uns dos outros.¦Regroupe les lieux proches les uns des autres.¦Agrupa los sitios cercanos entre sí.¦Raggruppa i posti vicini tra loro.
Confirma horários e reservas.¦Vérifie les horaires et les réservations.¦Confirma horarios y reservas.¦Controlla orari e prenotazioni.
Deixa uma manhã livre para improvisar.¦Garde une matinée libre pour improviser.¦Deja una mañana libre para improvisar.¦Lascia una mattina libera per improvvisare.
Na véspera¦La veille¦La víspera¦Il giorno prima
Cartão de cidadão ou passaporte¦Carte d’identité ou passeport¦Documento de identidad o pasaporte¦Carta d’identità o passaporto
Bilhetes e reservas¦Billets et réservations¦Billetes y reservas¦Biglietti e prenotazioni
Carregador do telemóvel¦Chargeur du téléphone¦Cargador del móvil¦Caricabatterie del telefono
Medicação habitual¦Médicaments habituels¦Medicación habitual¦Farmaci abituali
Cópias digitais dos documentos¦Copies numériques des documents¦Copias digitales de los documentos¦Copie digitali dei documenti
Confirma a validade dos documentos.¦Vérifie la validité des documents.¦Comprueba la validez de los documentos.¦Controlla la validità dei documenti.
Carrega o telemóvel e a bateria portátil.¦Charge le téléphone et la batterie externe.¦Carga el móvil y la batería portátil.¦Carica il telefono e la batteria portatile.
Guarda a medicação na mala de mão.¦Garde les médicaments dans le bagage à main.¦Guarda la medicación en el equipaje de mano.¦Tieni i farmaci nel bagaglio a mano.
Verifica a hora e o local de partida.¦Vérifie l’heure et le lieu de départ.¦Verifica la hora y el lugar de salida.¦Controlla ora e luogo di partenza.
Antes de partir¦Avant de partir¦Antes de salir¦Prima di partire
Primeira noite reservada¦Première nuit réservée¦Primera noche reservada¦Prima notte prenotata
Contactos de emergência¦Contacts d’urgence¦Contactos de emergencia¦Contatti di emergenza
Itinerário partilhado com alguém de confiança¦Itinéraire partagé avec une personne de confiance¦Itinerario compartido con alguien de confianza¦Itinerario condiviso con una persona fidata
Um seguro de viagem¦Une assurance voyage¦Un seguro de viaje¦Un’assicurazione di viaggio
Escolhe um alojamento bem localizado.¦Choisis un hébergement bien situé.¦Elige un alojamiento bien situado.¦Scegli un alloggio in buona posizione.
Chega de preferência durante o dia.¦Arrive de préférence de jour.¦Llega preferiblemente de día.¦Arriva preferibilmente di giorno.
Combina quando vais dar notícias.¦Convenez des moments où tu donneras des nouvelles.¦Acuerda cuándo vas a dar noticias.¦Concorda quando darai notizie.
Não digas a desconhecidos onde estás alojada.¦Ne dis pas à des inconnus où tu loges.¦No digas a desconocidos dónde te alojas.¦Non dire a sconosciuti dove alloggi.
Confia no teu instinto e muda de planos se precisares.¦Fais confiance à ton instinct et change tes plans si besoin.¦Confía en tu instinto y cambia de planes si lo necesitas.¦Fidati del tuo istinto e cambia programma se serve.
Viagens da comunidade¦Voyages de la communauté¦Viajes de la comunidad¦Viaggi della community
VIAGENS DA COMUNIDADE¦VOYAGES DE LA COMMUNAUTÉ¦VIAJES DE LA COMUNIDAD¦VIAGGI DELLA COMMUNITY
Partilhar viagem¦Partager un voyage¦Compartir viaje¦Condividi viaggio
O que levar¦Quoi emporter¦Qué llevar¦Cosa portare
O QUE LEVAR¦QUOI EMPORTER¦QUÉ LLEVAR¦COSA PORTARE
Roteiro e dicas¦Itinéraire et conseils¦Itinerario y consejos¦Itinerario e consigli
ROTEIRO E DICAS¦ITINÉRAIRE ET CONSEILS¦ITINERARIO Y CONSEJOS¦ITINERARIO E CONSIGLI
Destino ou nome da viagem¦Destination ou nom du voyage¦Destino o nombre del viaje¦Destinazione o nome del viaggio
O que levar, um por linha (opcional)¦Quoi emporter, un par ligne (facultatif)¦Qué llevar, uno por línea (opcional)¦Cosa portare, uno per riga (facoltativo)
Roteiro e dicas, um por linha¦Itinéraire et conseils, un par ligne¦Itinerario y consejos, uno por línea¦Itinerario e consigli, uno per riga
Ainda não há viagens partilhadas. Sê a primeira.¦Pas encore de voyages partagés. Sois la première.¦Aún no hay viajes compartidos. Sé la primera.¦Ancora nessun viaggio condiviso. Sii la prima.
Não partilhes moradas nem datas em que a tua casa fica vazia.¦Ne partage ni adresses ni dates où ton logement est vide.¦No compartas direcciones ni fechas en que tu casa esté vacía.¦Non condividere indirizzi né date in cui casa tua è vuota.
O texto tem palavras que não são permitidas na MAELLE.¦Ce texte contient des mots interdits sur MAELLE.¦El texto tiene palabras que no están permitidas en MAELLE.¦Il testo contiene parole non consentite su MAELLE.
Ex.: camisa, jeans, blazer¦Ex. : chemise, jean, blazer¦Ej.: camisa, vaqueros, blazer¦Es.: camicia, jeans, blazer
Mulher¦Femme¦Mujer¦Donna
Homem¦Homme¦Hombre¦Uomo
Moda masculina¦Mode homme¦Moda masculina¦Moda uomo
Ideias de outfits para homem¦Idées de tenues pour homme¦Ideas de looks para hombre¦Idee di outfit per uomo
Fato azul e camisa branca¦Costume bleu et chemise blanche¦Traje azul y camisa blanca¦Completo blu e camicia bianca
Blazer azul-escuro¦Blazer bleu marine¦Blazer azul marino¦Blazer blu scuro
Calças a condizer¦Pantalon assorti¦Pantalón a juego¦Pantaloni coordinati
Camisa branca¦Chemise blanche¦Camisa blanca¦Camicia bianca
Sapatos de pele¦Chaussures en cuir¦Zapatos de piel¦Scarpe in pelle
Blazer e calças chino¦Blazer et pantalon chino¦Blazer y pantalón chino¦Blazer e pantaloni chino
Blazer sem forro¦Blazer non doublé¦Blazer sin forro¦Blazer sfoderato
Calças chino bege¦Chino beige¦Chinos beige¦Chino beige
Camisa clara¦Chemise claire¦Camisa clara¦Camicia chiara
Mocassins¦Mocassins¦Mocasines¦Mocassini
Casaco de ganga e jeans¦Veste en jean et jean¦Cazadora vaquera y vaqueros¦Giubbotto di jeans e jeans
Casaco de ganga¦Veste en jean¦Cazadora vaquera¦Giubbotto di jeans
T-shirt lisa¦T-shirt uni¦Camiseta lisa¦T-shirt tinta unita
Jeans retos¦Jean droit¦Vaqueros rectos¦Jeans dritti
Ténis brancos¦Baskets blanches¦Zapatillas blancas¦Sneakers bianche
Mala de lona¦Sac en toile¦Bolsa de lona¦Borsa di tela
Casaco com cor e jeans¦Veste colorée et jean¦Abrigo de color y vaqueros¦Giacca colorata e jeans
Casaco quente vermelho¦Veste chaude rouge¦Abrigo rojo cálido¦Giacca calda rossa
Jeans escuros¦Jean foncé¦Vaqueros oscuros¦Jeans scuri
Mala em pele¦Sac en cuir¦Bolso de piel¦Borsa in pelle
Botas¦Bottes¦Botas¦Stivali
Hoodie e casaco de ganga¦Sweat à capuche et veste en jean¦Sudadera y cazadora vaquera¦Felpa e giubbotto di jeans
Camisola com capuz¦Sweat à capuche¦Sudadera con capucha¦Felpa con cappuccio
Calças escuras¦Pantalon foncé¦Pantalón oscuro¦Pantaloni scuri
Ténis¦Baskets¦Zapatillas¦Sneakers
Boné e casaco leve¦Casquette et veste légère¦Gorra y chaqueta ligera¦Cappellino e giacca leggera
Boné cinzento¦Casquette grise¦Gorra gris¦Cappellino grigio
Casaco leve¦Veste légère¦Chaqueta ligera¦Giacca leggera
T-shirt branca¦T-shirt blanc¦Camiseta blanca¦T-shirt bianca
Calças confortáveis¦Pantalon confortable¦Pantalón cómodo¦Pantaloni comodi
Mochila e camadas para viajar¦Sac à dos et couches pour voyager¦Mochila y capas para viajar¦Zaino e strati per viaggiare
Mochila¦Sac à dos¦Mochila¦Zaino
Boné¦Casquette¦Gorra¦Cappellino
Calças práticas¦Pantalon pratique¦Pantalón práctico¦Pantaloni pratici
Sapatilhas confortáveis¦Baskets confortables¦Zapatillas cómodas¦Scarpe da ginnastica comode
Alfaiataria com cor¦Costume en couleur¦Sastrería con color¦Sartoria a colori
Fato em cor viva¦Costume de couleur vive¦Traje de color vivo¦Completo dal colore acceso
Camisa lisa¦Chemise unie¦Camisa lisa¦Camicia tinta unita
Lenço de bolso¦Pochette de costume¦Pañuelo de bolsillo¦Fazzoletto da taschino
5 minutos · 1 pessoa · uma noite no frio¦5 minutes · 1 personne · une nuit au frais¦5 minutos · 1 persona · una noche en la nevera¦5 minuti · 1 persona · una notte in frigo
5 colheres de sopa de flocos de aveia¦5 cuillères à soupe de flocons d’avoine¦5 cucharadas de copos de avena¦5 cucchiai di fiocchi d’avena
100 ml de leite ou bebida vegetal¦100 ml de lait ou de boisson végétale¦100 ml de leche o bebida vegetal¦100 ml di latte o bevanda vegetale
1 iogurte natural¦1 yaourt nature¦1 yogur natural¦1 yogurt bianco
1 colher de chá de mel (opcional)¦1 cuillère à café de miel (facultatif)¦1 cucharadita de miel (opcional)¦1 cucchiaino di miele (facoltativo)
Fruta fresca a gosto¦Fruits frais selon ton goût¦Fruta fresca al gusto¦Frutta fresca a piacere
Junta a aveia, o leite e o iogurte num frasco.¦Mets l’avoine, le lait et le yaourt dans un bocal.¦Pon la avena, la leche y el yogur en un frasco.¦Metti avena, latte e yogurt in un barattolo.
Mexe bem e adoça, se quiseres.¦Mélange bien et sucre si tu veux.¦Remueve bien y endulza si quieres.¦Mescola bene e dolcifica se vuoi.
Fecha e guarda no frigorífico durante a noite.¦Ferme et garde au réfrigérateur toute la nuit.¦Cierra y guarda en la nevera toda la noche.¦Chiudi e lascia in frigo per la notte.
De manhã, junta a fruta e come frio.¦Le matin, ajoute les fruits et mange froid.¦Por la mañana, añade la fruta y come frío.¦Al mattino aggiungi la frutta e mangia freddo.
40 minutos · 2 pessoas¦40 minutes · 2 personnes¦40 minutos · 2 personas¦40 minuti · 2 persone
200 g de massa¦200 g de pâtes¦200 g de pasta¦200 g di pasta
400 g de tomate cereja¦400 g de tomates cerises¦400 g de tomates cherry¦400 g di pomodorini
3 dentes de alho¦3 gousses d’ail¦3 dientes de ajo¦3 spicchi d’aglio
3 colheres de sopa de azeite¦3 cuillères à soupe d’huile d’olive¦3 cucharadas de aceite de oliva¦3 cucchiai di olio d’oliva
Manjericão fresco¦Basilic frais¦Albahaca fresca¦Basilico fresco
Sal e pimenta¦Sel et poivre¦Sal y pimienta¦Sale e pepe
Aquece o forno a 200 °C.¦Préchauffe le four à 200 °C.¦Calienta el horno a 200 °C.¦Scalda il forno a 200 °C.
Põe o tomate e o alho num tabuleiro com o azeite, sal e pimenta.¦Mets les tomates et l’ail sur une plaque avec l’huile, le sel et le poivre.¦Pon los tomates y el ajo en una bandeja con el aceite, sal y pimienta.¦Metti pomodorini e aglio in una teglia con olio, sale e pepe.
Assa cerca de 25 minutos, até o tomate rebentar.¦Fais rôtir environ 25 minutes, jusqu’à ce que les tomates éclatent.¦Asa unos 25 minutos, hasta que los tomates revienten.¦Cuoci in forno circa 25 minuti, finché i pomodorini si aprono.
Coze a massa e guarda um pouco da água.¦Cuis les pâtes et garde un peu d’eau.¦Cuece la pasta y reserva un poco de agua.¦Cuoci la pasta e tieni un po’ d’acqua.
Esmaga o tomate, junta a massa e um pouco da água. Finaliza com manjericão.¦Écrase les tomates, ajoute les pâtes et un peu d’eau. Termine avec du basilic.¦Aplasta los tomates, añade la pasta y un poco de agua. Termina con albahaca.¦Schiaccia i pomodorini, unisci la pasta e un po’ d’acqua. Completa con il basilico.
15 minutos · 2 pessoas¦15 minutes · 2 personnes¦15 minutos · 2 personas¦15 minuti · 2 persone
1 lata de grão-de-bico cozido¦1 boîte de pois chiches cuits¦1 lata de garbanzos cocidos¦1 barattolo di ceci cotti
1 pepino¦1 concombre¦1 pepino¦1 cetriolo
2 tomates¦2 tomates¦2 tomates¦2 pomodori
Um punhado de azeitonas¦Une poignée d’olives¦Un puñado de aceitunas¦Una manciata di olive
Sumo de meio limão¦Le jus d’un demi-citron¦Zumo de medio limón¦Succo di mezzo limone
2 colheres de sopa de azeite¦2 cuillères à soupe d’huile d’olive¦2 cucharadas de aceite de oliva¦2 cucchiai di olio d’oliva
Escorre e passa o grão por água.¦Égoutte et rince les pois chiches.¦Escurre y enjuaga los garbanzos.¦Scola e sciacqua i ceci.
Corta o pepino e o tomate em cubos.¦Coupe le concombre et les tomates en dés.¦Corta el pepino y los tomates en dados.¦Taglia cetriolo e pomodori a cubetti.
Junta tudo numa taça, com as azeitonas.¦Réunis tout dans un bol avec les olives.¦Junta todo en un bol con las aceitunas.¦Unisci tutto in una ciotola con le olive.
Mistura o limão, o azeite, sal e pimenta e rega a taça.¦Mélange le citron, l’huile, le sel et le poivre et arrose le bol.¦Mezcla el limón, el aceite, sal y pimienta y aliña el bol.¦Mescola limone, olio, sale e pepe e condisci la ciotola.
50 minutos · 8 fatias¦50 minutes · 8 parts¦50 minutos · 8 porciones¦50 minuti · 8 fette
2 medidas de açúcar (usa o copo do iogurte)¦2 mesures de sucre (avec le pot de yaourt)¦2 medidas de azúcar (usa el vaso del yogur)¦2 misure di zucchero (usa il vasetto dello yogurt)
3 medidas de farinha¦3 mesures de farine¦3 medidas de harina¦3 misure di farina
1 medida de óleo¦1 mesure d’huile¦1 medida de aceite¦1 misura di olio di semi
3 ovos¦3 œufs¦3 huevos¦3 uova
1 saqueta de fermento¦1 sachet de levure chimique¦1 sobre de levadura¦1 bustina di lievito
Aquece o forno a 180 °C e unta uma forma.¦Préchauffe le four à 180 °C et beurre un moule.¦Calienta el horno a 180 °C y engrasa un molde.¦Scalda il forno a 180 °C e ungi uno stampo.
Bate os ovos com o açúcar.¦Bats les œufs avec le sucre.¦Bate los huevos con el azúcar.¦Sbatti le uova con lo zucchero.
Junta o iogurte e o óleo.¦Ajoute le yaourt et l’huile.¦Añade el yogur y el aceite.¦Aggiungi yogurt e olio.
Envolve a farinha com o fermento.¦Incorpore la farine et la levure.¦Incorpora la harina con la levadura.¦Incorpora farina e lievito.
Leva ao forno cerca de 35 minutos. Está pronto quando um palito sair seco.¦Enfourne environ 35 minutes. C’est prêt quand un cure-dent ressort sec.¦Hornea unos 35 minutos. Está listo cuando un palillo salga seco.¦Cuoci circa 35 minuti. È pronta quando uno stecchino esce asciutto.
Uma tarde¦Un après-midi¦Una tarde¦Un pomeriggio
Uma cadeira ou poltrona confortável¦Une chaise ou un fauteuil confortable¦Una silla o butaca cómoda¦Una sedia o poltrona comoda
Um candeeiro de luz quente¦Une lampe à lumière chaude¦Una lámpara de luz cálida¦Una lampada a luce calda
Uma manta¦Un plaid¦Una manta¦Un plaid
Uma mesa pequena para a bebida e o livro¦Une petite table pour la boisson et le livre¦Una mesita para la bebida y el libro¦Un tavolino per la bevanda e il libro
Escolhe um canto sossegado, de preferência perto de uma janela.¦Choisis un coin calme, de préférence près d’une fenêtre.¦Elige un rincón tranquilo, mejor cerca de una ventana.¦Scegli un angolo tranquillo, meglio vicino a una finestra.
Coloca a cadeira com a luz por cima do ombro.¦Place le fauteuil avec la lumière par-dessus l’épaule.¦Coloca la silla con la luz por encima del hombro.¦Sistema la sedia con la luce sopra la spalla.
Junta a manta e a mesa.¦Ajoute le plaid et la table.¦Añade la manta y la mesa.¦Aggiungi il plaid e il tavolino.
Deixa por perto só os livros que estás a ler.¦Garde près de toi seulement les livres en cours.¦Deja cerca solo los libros que estás leyendo.¦Tieni vicino solo i libri che stai leggendo.
Ao longo do ano¦Au fil de l’année¦A lo largo del año¦Durante l’anno
Duas cores base, por exemplo creme e areia¦Deux couleurs de base, par exemple crème et sable¦Dos colores base, por ejemplo crema y arena¦Due colori base, per esempio crema e sabbia
Capas de almofada¦Des housses de coussin¦Fundas de cojín¦Fodere per cuscini
Quadros ou fotografias¦Des cadres ou des photos¦Cuadros o fotografías¦Quadri o fotografie
Escolhe as duas cores que já tens mais em casa.¦Choisis les deux couleurs les plus présentes chez toi.¦Elige los dos colores que más tienes en casa.¦Scegli i due colori che hai già di più in casa.
Usa-as nas peças grandes.¦Utilise-les sur les grandes pièces.¦Úsalos en las piezas grandes.¦Usali sui pezzi grandi.
Em cada estação, muda só as capas e os quadros.¦À chaque saison, change seulement les housses et les cadres.¦En cada estación, cambia solo las fundas y los cuadros.¦A ogni stagione cambia solo fodere e quadri.
10 minutos por semana¦10 minutes par semaine¦10 minutos a la semana¦10 minuti a settimana
Jiboia, zamioculca ou espada-de-são-jorge¦Pothos, zamioculcas ou sansevière¦Poto, zamioculca o sansevieria¦Pothos, zamioculca o sansevieria
Vasos com furo no fundo¦Des pots percés au fond¦Macetas con agujero en el fondo¦Vasi con il foro sul fondo
Terra para plantas de interior¦Du terreau pour plantes d’intérieur¦Sustrato para plantas de interior¦Terriccio per piante da interno
Escolhe um sítio com luz indireta.¦Choisis un endroit à lumière indirecte.¦Elige un sitio con luz indirecta.¦Scegli un posto con luce indiretta.
Rega só quando a terra estiver seca.¦Arrose seulement quand la terre est sèche.¦Riega solo cuando la tierra esté seca.¦Annaffia solo quando il terriccio è asciutto.
Limpa o pó das folhas de vez em quando.¦Dépoussière les feuilles de temps en temps.¦Limpia el polvo de las hojas de vez en cuando.¦Ogni tanto spolvera le foglie.
Se tens animais ou crianças, confirma antes se a planta é tóxica.¦Si tu as des animaux ou des enfants, vérifie d’abord si la plante est toxique.¦Si tienes animales o niños, comprueba antes si la planta es tóxica.¦Se hai animali o bambini, controlla prima se la pianta è tossica.
Um fim de semana¦Un week-end¦Un fin de semana¦Un fine settimana
Uma manta ou almofadas de linho¦Un plaid ou des coussins en lin¦Una manta o cojines de lino¦Un plaid o cuscini di lino
Uma peça de cerâmica¦Une pièce en céramique¦Una pieza de cerámica¦Un oggetto in ceramica
Um objeto de madeira clara¦Un objet en bois clair¦Un objeto de madera clara¦Un oggetto in legno chiaro
Uma vela¦Une bougie¦Una vela¦Una candela
Tira o que não usas das superfícies.¦Retire des surfaces ce que tu n’utilises pas.¦Quita de las superficies lo que no usas.¦Togli dalle superfici ciò che non usi.
Junta três texturas diferentes em cada zona.¦Associe trois textures différentes dans chaque zone.¦Combina tres texturas distintas en cada zona.¦Unisci tre texture diverse in ogni zona.
Deixa espaço livre entre as peças.¦Laisse de l’espace entre les objets.¦Deja espacio libre entre las piezas.¦Lascia spazio tra gli oggetti.
Nunca deixes velas acesas sem vigilância.¦Ne laisse jamais de bougies allumées sans surveillance.¦Nunca dejes velas encendidas sin vigilancia.¦Non lasciare mai candele accese incustodite.
Ideia¦Idée¦Idea¦Idea
Ver receita¦Voir la recette¦Ver receta¦Vedi ricetta
Ver ideia¦Voir l’idée¦Ver idea¦Vedi idea
Ingredientes¦Ingrédients¦Ingredientes¦Ingredienti
INGREDIENTES¦INGRÉDIENTS¦INGREDIENTES¦INGREDIENTI
PREPARAÇÃO¦PRÉPARATION¦PREPARACIÓN¦PREPARAZIONE
O QUE PRECISAS¦CE QU’IL TE FAUT¦LO QUE NECESITAS¦COSA TI SERVE
COMO FAZER¦COMMENT FAIRE¦CÓMO HACERLO¦COME FARE
Receitas da comunidade¦Recettes de la communauté¦Recetas de la comunidad¦Ricette della community
RECEITAS DA COMUNIDADE¦RECETTES DE LA COMMUNAUTÉ¦RECETAS DE LA COMUNIDAD¦RICETTE DELLA COMMUNITY
Ideias da comunidade¦Idées de la communauté¦Ideas de la comunidad¦Idee della community
IDEIAS DA COMUNIDADE¦IDÉES DE LA COMMUNAUTÉ¦IDEAS DE LA COMUNIDAD¦IDEE DELLA COMMUNITY
Partilhar receita¦Partager une recette¦Compartir receta¦Condividi ricetta
Partilhar ideia¦Partager une idée¦Compartir idea¦Condividi idea
Nome da receita¦Nom de la recette¦Nombre de la receta¦Nome della ricetta
Nome da ideia¦Nom de l’idée¦Nombre de la idea¦Nome dell’idea
Ingredientes, um por linha¦Ingrédients, un par ligne¦Ingredientes, uno por línea¦Ingredienti, uno per riga
Preparação, um passo por linha¦Préparation, une étape par ligne¦Preparación, un paso por línea¦Preparazione, un passaggio per riga
O que precisas, um por linha (opcional)¦Ce qu’il te faut, un par ligne (facultatif)¦Lo que necesitas, uno por línea (opcional)¦Cosa ti serve, uno per riga (facoltativo)
Como fazer, um passo por linha¦Comment faire, une étape par ligne¦Cómo hacerlo, un paso por línea¦Come fare, un passaggio per riga
Ainda não há receitas partilhadas. Sê a primeira.¦Pas encore de recettes partagées. Sois la première.¦Aún no hay recetas compartidas. Sé la primera.¦Ancora nessuna ricetta condivisa. Sii la prima.
Ainda não há ideias partilhadas. Sê a primeira.¦Pas encore d’idées partagées. Sois la première.¦Aún no hay ideas compartidas. Sé la primera.¦Ancora nessuna idea condivisa. Sii la prima.
Entra na tua conta para veres e partilhares com a comunidade.¦Connecte-toi pour voir et partager avec la communauté.¦Entra en tu cuenta para ver y compartir con la comunidad.¦Accedi per vedere e condividere con la community.
Partilha só fotografias e textos teus.¦Partage uniquement tes propres photos et textes.¦Comparte solo fotos y textos tuyos.¦Condividi solo foto e testi tuoi.
Adiciona uma fotografia.¦Ajoute une photo.¦Añade una foto.¦Aggiungi una foto.
Escreve um nome com pelo menos 3 letras.¦Écris un nom d’au moins 3 lettres.¦Escribe un nombre de al menos 3 letras.¦Scrivi un nome di almeno 3 lettere.
Escreve os ingredientes.¦Écris les ingrédients.¦Escribe los ingredientes.¦Scrivi gli ingredienti.
Explica os passos.¦Explique les étapes.¦Explica los pasos.¦Spiega i passaggi.
Entra na tua conta para partilhares.¦Connecte-toi pour partager.¦Entra en tu cuenta para compartir.¦Accedi per condividere.
Ampliar imagem¦Agrandir l’image¦Ampliar imagen¦Ingrandisci immagine
Imagem ilustrativa¦Image d’illustration¦Imagen ilustrativa¦Immagine illustrativa
Publicações de exemplo, de pessoas fictícias.¦Publications d’exemple, de personnes fictives.¦Publicaciones de ejemplo, de personas ficticias.¦Post di esempio, di persone fittizie.
Ideias em imagens. Toca numa fotografia para veres o tema e guarda no coração o que gostares.¦Des idées en images. Touche une photo pour voir le thème et garde avec le cœur ce que tu aimes.¦Ideas en imágenes. Toca una foto para ver el tema y guarda con el corazón lo que te guste.¦Idee in immagini. Tocca una foto per vedere il tema e salva con il cuore ciò che ti piace.
As imagens são ilustrativas. As ligações abrem sites externos. A MAELLE não é afiliada a estas marcas.¦Les images sont illustratives. Les liens ouvrent des sites externes. MAELLE n’est pas affiliée à ces marques.¦Las imágenes son ilustrativas. Los enlaces abren sitios externos. MAELLE no está afiliada a estas marcas.¦Le immagini sono illustrative. I link aprono siti esterni. MAELLE non è affiliata a questi marchi.
Início¦Accueil¦Inicio¦Home
Comunidade¦Communauté¦Comunidad¦Community
Perfil¦Profil¦Perfil¦Profilo
Navegação principal¦Navigation principale¦Navegación principal¦Navigazione principale
Um universo criado para ti¦Un univers créé pour toi¦Un universo creado para ti¦Un universo creato per te
Começar¦Commencer¦Empezar¦Inizia
Já tenho conta¦J'ai déjà un compte¦Ya tengo cuenta¦Ho già un account
Explorar sem conta¦Explorer sans compte¦Explorar sin cuenta¦Esplora senza account
Espaço só para maiores de 18 anos.¦Réservé aux plus de 18 ans.¦Solo para mayores de 18 años.¦Solo per maggiorenni.
Ainda não é a tua vez¦Ce n'est pas encore ton tour¦Todavía no te toca¦Non è ancora il tuo turno
A MAELLE é só para maiores de 18 anos. Obrigada pelo interesse. Quando fizeres 18, vais ser muito bem-vinda.¦MAELLE est réservée aux plus de 18 ans. Merci de ton intérêt. À tes 18 ans, tu seras la bienvenue.¦MAELLE es solo para mayores de 18 años. Gracias por tu interés. Cuando cumplas 18, serás muy bienvenida.¦MAELLE è solo per maggiorenni. Grazie per l'interesse. Quando compirai 18 anni, sarai la benvenuta.
Neste protótipo o bloqueio fica guardado só neste dispositivo.¦Dans ce prototype, le blocage est enregistré uniquement sur cet appareil.¦En este prototipo, el bloqueo se guarda solo en este dispositivo.¦In questo prototipo il blocco è salvato solo su questo dispositivo.
Cria a tua conta¦Crée ton compte¦Crea tu cuenta¦Crea il tuo account
Estamos felizes por teres chegado. Cria o teu espaço no universo MAELLE.¦Nous sommes ravies de te voir. Crée ton espace dans l'univers MAELLE.¦Nos alegra que estés aquí. Crea tu espacio en el universo MAELLE.¦Siamo felici che tu sia qui. Crea il tuo spazio nell'universo MAELLE.
Data de nascimento¦Date de naissance¦Fecha de nacimiento¦Data di nascita
Tenho 18 anos ou mais, aceito os¦J'ai 18 ans ou plus, j'accepte les¦Tengo 18 años o más, acepto los¦Ho almeno 18 anni, accetto i
Termos¦Conditions¦Términos¦Termini
e li a¦et j'ai lu la¦y he leído la¦e ho letto l'
Política de Privacidade¦Politique de confidentialité¦Política de privacidad¦Informativa sulla privacy
Termos de Utilização¦Conditions d'utilisation¦Términos de uso¦Termini di utilizzo
Criar conta¦Créer un compte¦Crear cuenta¦Crea account
Já tens conta? Inicia sessão¦Déjà un compte ? Connecte-toi¦¿Ya tienes cuenta? Inicia sesión¦Hai già un account? Accedi
A MAELLE é só para maiores de 18 anos. A tua conta e o My Place ficam guardados online, de forma privada.¦MAELLE est réservée aux plus de 18 ans. Ton compte et My Place sont enregistrés en ligne, de façon privée.¦MAELLE es solo para mayores de 18 años. Tu cuenta y My Place se guardan en línea, de forma privada.¦MAELLE è solo per maggiorenni. Il tuo account e My Place sono salvati online in modo privato.
Voltar¦Retour¦Volver¦Indietro
O teu nome¦Ton nom¦Tu nombre¦Il tuo nome
O teu e-mail¦Ton e-mail¦Tu correo¦La tua e-mail
Criar palavra-passe¦Créer un mot de passe¦Crear contraseña¦Crea una password
Bem-vinda de volta¦Bon retour¦Bienvenida de nuevo¦Bentornata
O teu espaço espera por ti.¦Ton espace t'attend.¦Tu espacio te espera.¦Il tuo spazio ti aspetta.
Entrar¦Se connecter¦Entrar¦Accedi
Esqueceste-te da palavra-passe?¦Mot de passe oublié ?¦¿Olvidaste tu contraseña?¦Password dimenticata?
Ainda não tens conta? Cria uma aqui¦Pas encore de compte ? Crées-en un ici¦¿Aún no tienes cuenta? Créala aquí¦Non hai un account? Creane uno qui
Palavra-passe¦Mot de passe¦Contraseña¦Password
Personaliza o teu perfil¦Personnalise ton profil¦Personaliza tu perfil¦Personalizza il tuo profilo
Este é o teu espaço. Mostra-nos um pouco de ti.¦C'est ton espace. Montre-nous un peu qui tu es.¦Este es tu espacio. Muéstranos un poco de ti.¦Questo è il tuo spazio. Raccontaci un po' di te.
Guardar perfil¦Enregistrer le profil¦Guardar perfil¦Salva profilo
Nome de utilizador¦Nom d'utilisatrice¦Nombre de usuaria¦Nome utente
Conta-nos um pouco sobre ti...¦Parle-nous un peu de toi...¦Cuéntanos un poco sobre ti...¦Raccontaci qualcosa di te...
Sobre ti¦À propos de toi¦Sobre ti¦Su di te
Editar perfil¦Modifier le profil¦Editar perfil¦Modifica profilo
AS MINHAS PUBLICAÇÕES¦MES PUBLICATIONS¦MIS PUBLICACIONES¦I MIEI POST
PUBLICAÇÕES¦PUBLICATIONS¦PUBLICACIONES¦POST
Publicar¦Publier¦Publicar¦Pubblica
Foto¦Photo¦Foto¦Foto
Ainda não publicaste nada.¦Tu n'as encore rien publié.¦Aún no has publicado nada.¦Non hai ancora pubblicato nulla.
Ainda sem publicações.¦Pas encore de publications.¦Aún no hay publicaciones.¦Ancora nessun post.
Definições¦Réglages¦Ajustes¦Impostazioni
Partilha algo no teu perfil¦Partage quelque chose sur ton profil¦Comparte algo en tu perfil¦Condividi qualcosa sul tuo profilo
Nova publicação¦Nouvelle publication¦Nueva publicación¦Nuovo post
Nome, foto e biografia¦Nom, photo et bio¦Nombre, foto y biografía¦Nome, foto e biografia
Os meus interesses¦Mes centres d'intérêt¦Mis intereses¦I miei interessi
Escolhe os teus temas¦Choisis tes thèmes¦Elige tus temas¦Scegli i tuoi temi
SEGURANÇA¦SÉCURITÉ¦SEGURIDAD¦SICUREZZA
Utilizadoras bloqueadas¦Utilisatrices bloquées¦Usuarias bloqueadas¦Utenti bloccate
Ainda não bloqueaste ninguém.¦Tu n'as bloqué personne.¦Aún no has bloqueado a nadie.¦Non hai ancora bloccato nessuno.
Desbloquear¦Débloquer¦Desbloquear¦Sblocca
Terminar sessão¦Se déconnecter¦Cerrar sesión¦Esci
Apagar os dados deste dispositivo¦Supprimer les données de cet appareil¦Borrar los datos de este dispositivo¦Cancella i dati di questo dispositivo
Espaço só para maiores de 18 anos, idade confirmada.¦Réservé aux plus de 18 ans, âge confirmé.¦Solo para mayores de 18 años, edad confirmada.¦Solo per maggiorenni, età confermata.
Entra na tua conta para veres perfis.¦Connecte-toi pour voir les profils.¦Inicia sesión para ver perfiles.¦Accedi per vedere i profili.
Este perfil não está disponível.¦Ce profil n'est pas disponible.¦Este perfil no está disponible.¦Questo profilo non è disponibile.
Bloqueaste esta conta.¦Tu as bloqué ce compte.¦Has bloqueado esta cuenta.¦Hai bloccato questo account.
Escolhe os temas de que mais gostas para personalizarmos o teu universo MAELLE.¦Choisis tes thèmes préférés pour personnaliser ton univers MAELLE.¦Elige tus temas favoritos para personalizar tu universo MAELLE.¦Scegli i temi che ami per personalizzare il tuo universo MAELLE.
Guardar¦Enregistrer¦Guardar¦Salva
Continuar¦Continuer¦Continuar¦Continua
Escolhe pelo menos um tema.¦Choisis au moins un thème.¦Elige al menos un tema.¦Scegli almeno un tema.
Bem-vinda ao teu universo¦Bienvenue dans ton univers¦Bienvenida a tu universo¦Benvenuta nel tuo universo
Descobre, inspira-te e faz parte da nossa comunidade.¦Découvre, inspire-toi et rejoins notre communauté.¦Descubre, inspírate y forma parte de nuestra comunidad.¦Scopri, lasciati ispirare ed entra nella nostra community.
Procura outfits e marcas, de todos os estilos¦Trouve des tenues et des marques de tous les styles¦Busca looks y marcas de todos los estilos¦Cerca outfit e marchi di ogni stile
Clube de Livros¦Club de lecture¦Club de lectura¦Club del libro
Indicações, livros à venda e conversas¦Recommandations, livres à vendre et discussions¦Recomendaciones, libros en venta y charlas¦Consigli, libri in vendita e chiacchiere
Para ti¦Pour toi¦Para ti¦Per te
COLEÇÕES¦COLLECTIONS¦COLECCIONES¦RACCOLTE
As tuas coleções guardadas¦Tes collections enregistrées¦Tus colecciones guardadas¦Le tue raccolte salvate
Ainda não guardaste nada. Abre um tema e toca no coração das ideias de que gostas.¦Rien d'enregistré. Ouvre un thème et touche le cœur des idées qui te plaisent.¦Aún no has guardado nada. Abre un tema y toca el corazón de las ideas que te gusten.¦Non hai ancora salvato nulla. Apri un tema e tocca il cuore delle idee che ti piacciono.
Adicionar capa¦Ajouter une couverture¦Añadir portada¦Aggiungi copertina
Mudar capa¦Changer la couverture¦Cambiar portada¦Cambia copertina
Remover capa¦Retirer la couverture¦Quitar portada¦Rimuovi copertina
Procura outfits e marcas¦Trouve des tenues et des marques¦Busca looks y marcas¦Cerca outfit e marchi
Skincare, cabelo, maquilhagem e looks¦Soins, cheveux, maquillage et looks¦Cuidado de la piel, cabello, maquillaje y looks¦Skincare, capelli, trucco e look
Guardar ideia¦Enregistrer l'idée¦Guardar idea¦Salva idea
Coleções¦Collections¦Colecciones¦Raccolte
As ideias que guardaste, organizadas por tema.¦Tes idées enregistrées, classées par thème.¦Tus ideas guardadas, organizadas por tema.¦Le idee salvate, divise per tema.
Ainda não tens ideias guardadas. Toca no coração em qualquer ideia para a guardar aqui.¦Pas encore d'idées enregistrées. Touche le cœur d'une idée pour la garder ici.¦Aún no tienes ideas guardadas. Toca el corazón de una idea para guardarla aquí.¦Nessuna idea salvata. Tocca il cuore di un'idea per conservarla qui.
Junta fotos, notas e cores num só sítio.¦Rassemble photos, notes et couleurs au même endroit.¦Reúne fotos, notas y colores en un solo lugar.¦Raccogli foto, note e colori in un unico posto.
Novo moodboard¦Nouveau moodboard¦Nuevo moodboard¦Nuovo moodboard
Ainda não tens moodboards. Cria o primeiro e escolhe a paleta.¦Pas encore de moodboards. Crée le premier et choisis la palette.¦Aún no tienes moodboards. Crea el primero y elige la paleta.¦Non hai ancora moodboard. Crea il primo e scegli la palette.
Organiza a tua vida, ao teu ritmo.¦Organise ta vie, à ton rythme.¦Organiza tu vida a tu ritmo.¦Organizza la tua vita, con i tuoi ritmi.
Tarefas¦Tâches¦Tareas¦Attività
Hábitos hoje¦Habitudes du jour¦Hábitos hoy¦Abitudini di oggi
Eventos hoje¦Événements du jour¦Eventos hoy¦Eventi di oggi
A minha agenda¦Mon agenda¦Mi agenda¦La mia agenda
Sem eventos marcados¦Aucun événement prévu¦Sin eventos programados¦Nessun evento in programma
Minha lista de tarefas¦Ma liste de tâches¦Mi lista de tareas¦La mia lista di cose da fare
Ainda sem tarefas¦Pas encore de tâches¦Aún no hay tareas¦Ancora nessuna attività
Tudo feito¦Tout est fait¦Todo hecho¦Tutto fatto
Os meus objetivos¦Mes objectifs¦Mis objetivos¦I miei obiettivi
Define o primeiro¦Fixe le premier¦Define el primero¦Fissa il primo
Os meus hábitos¦Mes habitudes¦Mis hábitos¦Le mie abitudini
Cria o primeiro hábito¦Crée ta première habitude¦Crea tu primer hábito¦Crea la prima abitudine
Minha lista de desejos¦Ma liste d'envies¦Mi lista de deseos¦La mia lista dei desideri
Ainda vazia¦Encore vide¦Aún vacía¦Ancora vuota
Pequenos passos, grandes conquistas.¦Petits pas, grandes victoires.¦Pequeños pasos, grandes logros.¦Piccoli passi, grandi traguardi.
Seg¦Lun¦Lun¦Lun
Ter¦Mar¦Mar¦Mar
Qua¦Mer¦Mié¦Mer
Qui¦Jeu¦Jue¦Gio
Sex¦Ven¦Vie¦Ven
Sáb¦Sam¦Sáb¦Sab
Dom¦Dim¦Dom¦Dom
Hoje¦Aujourd'hui¦Hoy¦Oggi
Evento¦Événement¦Evento¦Evento
Sem eventos neste dia.¦Aucun événement ce jour.¦Sin eventos este día.¦Nessun evento in questo giorno.
Mês anterior¦Mois précédent¦Mes anterior¦Mese precedente
Mês seguinte¦Mois suivant¦Mes siguiente¦Mese successivo
Uma coisa de cada vez.¦Une chose à la fois.¦Una cosa cada vez.¦Una cosa alla volta.
Nada por fazer. Aproveita o dia.¦Rien à faire. Profite de ta journée.¦Nada pendiente. Disfruta del día.¦Niente da fare. Goditi la giornata.
Nova tarefa¦Nouvelle tâche¦Nueva tarea¦Nuova attività
Adicionar tarefa¦Ajouter une tâche¦Añadir tarea¦Aggiungi attività
Limpar concluídas¦Effacer les terminées¦Borrar completadas¦Cancella completate
Define para onde queres ir e acompanha o caminho.¦Décide où aller et suis ton parcours.¦Decide adónde quieres ir y sigue el camino.¦Decidi dove vuoi arrivare e segui il percorso.
Novo objetivo¦Nouvel objectif¦Nuevo objetivo¦Nuovo obiettivo
Ainda não tens objetivos. Começa por um pequeno.¦Pas encore d'objectifs. Commence par un petit.¦Aún no tienes objetivos. Empieza por uno pequeño.¦Nessun obiettivo. Inizia con uno piccolo.
Marca cada dia em que o cumpres.¦Coche chaque jour où tu la respectes.¦Marca cada día que lo cumplas.¦Segna ogni giorno in cui la rispetti.
Novo hábito¦Nouvelle habitude¦Nuevo hábito¦Nuova abitudine
Ainda não tens hábitos. Um bom começo: beber água, ler ou alongar.¦Pas encore d'habitudes. Pour commencer : boire de l'eau, lire ou s'étirer.¦Aún no tienes hábitos. Para empezar: beber agua, leer o estirar.¦Nessuna abitudine. Per iniziare: bere acqua, leggere o fare stretching.
O que gostavas de ter, num só sítio.¦Tout ce que tu aimerais avoir, au même endroit.¦Lo que te gustaría tener, en un solo lugar.¦Quello che vorresti avere, in un unico posto.
A tua lista está vazia. Também podes adicionar produtos da loja.¦Ta liste est vide. Tu peux aussi ajouter des produits de la boutique.¦Tu lista está vacía. También puedes añadir productos de la tienda.¦La lista è vuota. Puoi aggiungere anche prodotti del negozio.
Desejo¦Envie¦Deseo¦Desiderio
Preço em euros¦Prix en euros¦Precio en euros¦Prezzo in euro
Adicionar desejo¦Ajouter une envie¦Añadir deseo¦Aggiungi desiderio
Cuida de ti. Expressa o teu estilo.¦Prends soin de toi. Exprime ton style.¦Cuídate. Expresa tu estilo.¦Prenditi cura di te. Esprimi il tuo stile.
Rotina de hoje¦Routine du jour¦Rutina de hoy¦Routine di oggi
Manhã¦Matin¦Mañana¦Mattina
Noite¦Soir¦Noche¦Sera
Limpar¦Nettoyer¦Limpiar¦Detergere
Hidratar¦Hydrater¦Hidratar¦Idratare
Protetor solar¦Crème solaire¦Protector solar¦Protezione solare
Sérum ou tratamento¦Sérum ou soin¦Sérum o tratamiento¦Siero o trattamento
Procura todo o tipo de outfits e marcas.¦Cherche toutes sortes de tenues et de marques.¦Busca todo tipo de looks y marcas.¦Cerca ogni tipo di outfit e marchio.
Todos¦Tous¦Todos¦Tutti
Tudo¦Tout¦Todo¦Tutto
IDEIAS DE OUTFITS¦IDÉES DE TENUES¦IDEAS DE LOOKS¦IDEE OUTFIT
Guardar look¦Enregistrer le look¦Guardar look¦Salva look
Ver fotos¦Voir les photos¦Ver fotos¦Vedi foto
MARCAS¦MARQUES¦MARCAS¦MARCHI
Procurar¦Chercher¦Buscar¦Cerca
PROCURAR NA WEB¦CHERCHER SUR LE WEB¦BUSCAR EN LA WEB¦CERCA SUL WEB
As ligações abrem sites externos. A MAELLE não é afiliada a estas marcas.¦Les liens ouvrent des sites externes. MAELLE n'est pas affiliée à ces marques.¦Los enlaces abren sitios externos. MAELLE no está afiliada a estas marcas.¦I link aprono siti esterni. MAELLE non è affiliata a questi marchi.
Ex.: vestido festa, jeans, blazer¦Ex. : robe de fête, jean, blazer¦Ej.: vestido de fiesta, vaqueros, blazer¦Es.: abito da festa, jeans, blazer
Procurar outfits e marcas¦Chercher tenues et marques¦Buscar looks y marcas¦Cerca outfit e marchi
Desafia-te, cria e descobre novas experiências.¦Défie-toi, crée et découvre de nouvelles expériences.¦Rétate, crea y descubre nuevas experiencias.¦Mettiti alla prova, crea e scopri nuove esperienze.
Desafios Mensais¦Défis du mois¦Retos mensuales¦Sfide del mese
Escolhe um para este mês¦Choisis-en un ce mois-ci¦Elige uno para este mes¦Scegline una per questo mese
Atividade Criativa¦Activité créative¦Actividad creativa¦Attività creativa
Uma proposta nova todos os dias¦Une nouvelle idée chaque jour¦Una propuesta nueva cada día¦Una nuova proposta ogni giorno
Uma proposta nova todos os dias.¦Une nouvelle idée chaque jour.¦Una propuesta nueva cada día.¦Una nuova proposta ogni giorno.
Experiências Digitais¦Expériences numériques¦Experiencias digitales¦Esperienze digitali
Respira um minuto e escolhe as palavras do mês¦Respire une minute et choisis les mots du mois¦Respira un minuto y elige las palabras del mes¦Respira un minuto e scegli le parole del mese
Eventos & Conteúdos Especiais¦Événements et contenus spéciaux¦Eventos y contenidos especiales¦Eventi e contenuti speciali
Entrar no desafio¦Rejoindre le défi¦Unirme al reto¦Partecipa alla sfida
Proposta de hoje¦Proposition du jour¦Propuesta de hoy¦Proposta di oggi
Guardar página¦Enregistrer la page¦Guardar página¦Salva pagina
Escreve aqui¦Écris ici¦Escribe aquí¦Scrivi qui
A tua resposta¦Ta réponse¦Tu respuesta¦La tua risposta
Pequenos rituais para o teu dia.¦Petits rituels du quotidien.¦Pequeños rituales para tu día.¦Piccoli rituali per la tua giornata.
Ritual de respiração¦Rituel de respiration¦Ritual de respiración¦Rituale di respirazione
Seis respirações, cerca de um minuto.¦Six respirations, environ une minute.¦Seis respiraciones, cerca de un minuto.¦Sei respiri, circa un minuto.
Inspira¦Inspire¦Inspira¦Inspira
Expira¦Expire¦Espira¦Espira
Parar¦Arrêter¦Parar¦Ferma
Bom trabalho¦Bravo¦Buen trabajo¦Ottimo lavoro
Lembrar-me¦Me le rappeler¦Recordármelo¦Ricordamelo
Descobre, troca e conversa sobre livros.¦Découvre, échange et parle de livres.¦Descubre, intercambia y habla de libros.¦Scopri, scambia e parla di libri.
Indicações¦Recommandations¦Recomendaciones¦Consigli
Indicação¦Recommandation¦Recomendación¦Consiglio
A aguardar aprovação¦En attente de validation¦Pendiente de aprobación¦In attesa di approvazione
À venda¦À vendre¦En venta¦In vendita
Conversas¦Discussions¦Conversaciones¦Conversazioni
Quero ler¦À lire¦Quiero leer¦Da leggere
A ler¦En cours¦Leyendo¦In lettura
Lido¦Lu¦Leído¦Letto
Indicar um livro¦Recommander un livre¦Recomendar un libro¦Consiglia un libro
Conversar¦Discuter¦Conversar¦Chiacchiera
Conversa geral¦Discussion générale¦Charla general¦Chiacchiere generali
Conversa aberta às leitoras. Respeito acima de tudo.¦Discussion ouverte aux lectrices. Le respect avant tout.¦Charla abierta a las lectoras. El respeto ante todo.¦Conversazione aperta alle lettrici. Rispetto prima di tutto.
Denunciar¦Signaler¦Denunciar¦Segnala
Escreve uma mensagem¦Écris un message¦Escribe un mensaje¦Scrivi un messaggio
Mensagem¦Message¦Mensaje¦Messaggio
Enviar mensagem¦Envoyer le message¦Enviar mensaje¦Invia messaggio
Partilha, descobre e inspira-te.¦Partage, découvre et inspire-toi.¦Comparte, descubre e inspírate.¦Condividi, scopri e ispirati.
Publicações¦Publications¦Publicaciones¦Post
O que se está a partilhar¦Ce qui se partage¦Lo que se está compartiendo¦Cosa si sta condividendo
Grupos¦Groupes¦Grupos¦Gruppi
GRUPOS¦GROUPES¦GRUPOS¦GRUPPI
Encontra ou cria o teu grupo¦Trouve ou crée ton groupe¦Encuentra o crea tu grupo¦Trova o crea il tuo gruppo
Perguntas & Respostas¦Questions et réponses¦Preguntas y respuestas¦Domande e risposte
Pergunta à comunidade¦Demande à la communauté¦Pregunta a la comunidad¦Chiedi alla community
Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora.¦Réservé aux plus de 18 ans. Tu peux signaler ou bloquer toute utilisatrice.¦Solo para mayores de 18 años. Puedes denunciar o bloquear a cualquier usuaria.¦Solo per maggiorenni. Puoi segnalare o bloccare qualsiasi utente.
Espaço só para maiores de 18 anos. Podes denunciar ou bloquear qualquer utilizadora, em qualquer publicação.¦Réservé aux plus de 18 ans. Tu peux signaler ou bloquer toute utilisatrice, sur toute publication.¦Solo para mayores de 18 años. Puedes denunciar o bloquear a cualquier usuaria en cualquier publicación.¦Solo per maggiorenni. Puoi segnalare o bloccare qualsiasi utente su qualsiasi post.
As publicações de exemplo são fictícias. Neste protótipo, o que escreves fica só no teu dispositivo.¦Les publications d'exemple sont fictives. Sans compte, ce que tu écris reste sur ton appareil.¦Las publicaciones de ejemplo son ficticias. Sin cuenta, lo que escribes se queda en tu dispositivo.¦I post di esempio sono fittizi. Senza account, ciò che scrivi resta sul tuo dispositivo.
Bloquear¦Bloquer¦Bloquear¦Blocca
Apagar¦Supprimer¦Eliminar¦Elimina
Oculta pela equipa¦Masquée par l'équipe¦Ocultada por el equipo¦Nascosto dal team
Partilha uma ideia, uma dica ou uma pergunta¦Partage une idée, une astuce ou une question¦Comparte una idea, un consejo o una pregunta¦Condividi un'idea, un consiglio o una domanda
Comentar¦Commenter¦Comentar¦Commenta
Enviar comentário¦Envoyer le commentaire¦Enviar comentario¦Invia commento
Ainda não há publicações. Escreve a primeira.¦Pas encore de publications. Écris la première.¦Aún no hay publicaciones. Escribe la primera.¦Ancora nessun post. Scrivi il primo.
Ainda sem publicações. Sê a primeira.¦Pas encore de publications. Sois la première.¦Aún no hay publicaciones. Sé la primera.¦Ancora nessun post. Sii la prima.
Pessoas com os mesmos interesses que tu.¦Des personnes qui partagent tes intérêts.¦Personas con tus mismos intereses.¦Persone con i tuoi stessi interessi.
Criar o meu grupo¦Créer mon groupe¦Crear mi grupo¦Crea il mio gruppo
OS MEUS GRUPOS¦MES GROUPES¦MIS GRUPOS¦I MIEI GRUPPI
DESCOBRIR¦DÉCOUVRIR¦DESCUBRIR¦SCOPRI
Não há outros grupos por agora.¦Pas d'autres groupes pour l'instant.¦No hay otros grupos por ahora.¦Per ora non ci sono altri gruppi.
Entrar no grupo¦Rejoindre le groupe¦Unirme al grupo¦Entra nel gruppo
Estás no grupo. Sair¦Tu es dans le groupe. Quitter¦Estás en el grupo. Salir¦Sei nel gruppo. Esci
Estás no grupo¦Tu es membre¦Estás en el grupo¦Sei nel gruppo
Criado por ti¦Créé par toi¦Creado por ti¦Creato da te
Eliminar grupo¦Supprimer le groupe¦Eliminar grupo¦Elimina gruppo
Regras do grupo¦Règles du groupe¦Normas del grupo¦Regole del gruppo
Entra no grupo para publicares.¦Rejoins le groupe pour publier.¦Únete al grupo para publicar.¦Entra nel gruppo per pubblicare.
Escreve para o grupo¦Écris au groupe¦Escribe al grupo¦Scrivi al gruppo
Geral¦Général¦General¦Generale
Faz uma pergunta¦Pose une question¦Haz una pregunta¦Fai una domanda
Nova pergunta¦Nouvelle question¦Nueva pregunta¦Nuova domanda
Publicar pergunta¦Publier la question¦Publicar pregunta¦Pubblica domanda
Responder¦Répondre¦Responder¦Rispondi
Enviar resposta¦Envoyer la réponse¦Enviar respuesta¦Invia risposta
Ainda sem respostas.¦Pas encore de réponses.¦Aún no hay respuestas.¦Ancora nessuna risposta.
Ainda não há perguntas.¦Pas encore de questions.¦Aún no hay preguntas.¦Ancora nessuna domanda.
Uma seleção especial para ti.¦Une sélection spéciale pour toi.¦Una selección especial para ti.¦Una selezione speciale per te.
Vender na MAELLE¦Vendre sur MAELLE¦Vender en MAELLE¦Vendi su MAELLE
Produtos, serviços e livros¦Produits, services et livres¦Productos, servicios y libros¦Prodotti, servizi e libri
Escolhidas pelos teus interesses¦Choisies selon tes intérêts¦Elegidas según tus intereses¦Scelte in base ai tuoi interessi
Escolhidas pelos teus interesses.¦Choisies selon tes intérêts.¦Elegidas según tus intereses.¦Scelte in base ai tuoi interessi.
Peças e serviços de pessoas e marcas.¦Articles et services de particuliers et de marques.¦Artículos y servicios de personas y marcas.¦Articoli e servizi di persone e marchi.
Produtos¦Produits¦Productos¦Prodotti
PRODUTOS¦PRODUITS¦PRODUCTOS¦PRODOTTI
Serviços¦Services¦Servicios¦Servizi
SERVIÇOS¦SERVICES¦SERVICIOS¦SERVIZI
Vender um produto¦Vendre un produit¦Vender un producto¦Vendi un prodotto
Favorito¦Favori¦Favorito¦Preferito
Marcas que combinam contigo.¦Des marques qui te correspondent.¦Marcas que van contigo.¦Marchi adatti a te.
Convidar uma marca¦Inviter une marque¦Invitar a una marca¦Invita un marchio
Seguir¦Suivre¦Seguir¦Segui
A seguir¦Suivie¦Siguiendo¦Segui già
Ver peças¦Voir les articles¦Ver artículos¦Vedi articoli
Qualquer pessoa maior de 18 anos pode vender produtos, serviços e livros.¦Toute personne majeure peut vendre des produits, des services et des livres.¦Cualquier persona mayor de 18 años puede vender productos, servicios y libros.¦Chiunque sia maggiorenne può vendere prodotti, servizi e libri.
Oferecer um serviço¦Proposer un service¦Ofrecer un servicio¦Offri un servizio
Vender um livro¦Vendre un livre¦Vender un libro¦Vendi un libro
Como vai funcionar¦Comment ça va marcher¦Cómo va a funcionar¦Come funzionerà
Para já, os anúncios servem para mostrar o que vendes. Quando o pagamento estiver ligado, a MAELLE cobra uma pequena comissão sobre cada venda e os custos de conta de marcas e vendedores.¦Pour l'instant, les annonces servent à présenter ce que tu vends. Quand le paiement sera activé, MAELLE prélèvera une petite commission sur chaque vente, ainsi que des frais de compte pour les marques et les vendeurs.¦Por ahora, los anuncios sirven para mostrar lo que vendes. Cuando se active el pago, MAELLE cobrará una pequeña comisión por venta y cuotas de cuenta a marcas y vendedores.¦Per ora gli annunci servono a mostrare ciò che vendi. Quando il pagamento sarà attivo, MAELLE tratterrà una piccola commissione su ogni vendita e un costo account per marchi e venditori.
OS MEUS ANÚNCIOS¦MES ANNONCES¦MIS ANUNCIOS¦I MIEI ANNUNCI
Ainda não tens anúncios.¦Tu n'as pas encore d'annonces.¦Aún no tienes anuncios.¦Non hai ancora annunci.
O que guardaste para mais tarde.¦Ce que tu as gardé pour plus tard.¦Lo que guardaste para más tarde.¦Quello che hai salvato per dopo.
Toca no coração de um produto para o guardar aqui.¦Touche le cœur d'un produit pour le garder ici.¦Toca el corazón de un producto para guardarlo aquí.¦Tocca il cuore di un prodotto per salvarlo qui.
Ainda não guardaste nenhum serviço.¦Aucun service enregistré.¦Aún no has guardado ningún servicio.¦Nessun servizio salvato.
Ainda não segues nenhuma marca.¦Tu ne suis encore aucune marque.¦Aún no sigues ninguna marca.¦Non segui ancora nessun marchio.
Para comprar ou reservar, contacta quem vende. O pagamento na app chega numa próxima fase.¦Pour acheter ou réserver, contacte la personne qui vend. Le paiement dans l'app arrivera plus tard.¦Para comprar o reservar, contacta con quien vende. El pago en la app llegará más adelante.¦Per acquistare o prenotare, contatta chi vende. Il pagamento nell'app arriverà più avanti.
Para comprar, contacta quem vende.¦Pour acheter, contacte la personne qui vend.¦Para comprar, contacta con quien vende.¦Per acquistare, contatta chi vende.
Produtos, serviços e marcas de exemplo. A compra online liga-se numa próxima fase.¦Produits, services et marques d'exemple. L'achat en ligne arrivera plus tard.¦Productos, servicios y marcas de ejemplo. La compra en línea llegará más adelante.¦Prodotti, servizi e marchi di esempio. L'acquisto online arriverà più avanti.
Só para maiores de 18¦Réservé aux majeures¦Solo para mayores de 18¦Solo per maggiorenni
A MAELLE é um espaço para maiores de 18 anos. Confirma a tua idade para explorar.¦MAELLE est un espace réservé aux plus de 18 ans. Confirme ton âge pour explorer.¦MAELLE es un espacio para mayores de 18 años. Confirma tu edad para explorar.¦MAELLE è uno spazio per maggiorenni. Conferma la tua età per esplorare.
Tenho 18 anos ou mais.¦J'ai 18 ans ou plus.¦Tengo 18 años o más.¦Ho almeno 18 anni.
Cancelar¦Annuler¦Cancelar¦Annulla
Nova palavra-passe¦Nouveau mot de passe¦Nueva contraseña¦Nuova password
Enviamos-te um e-mail com uma ligação para escolheres uma nova.¦Nous t'envoyons un e-mail avec un lien pour en choisir un nouveau.¦Te enviamos un correo con un enlace para elegir una nueva.¦Ti inviamo un'e-mail con un link per sceglierne una nuova.
Enviar e-mail¦Envoyer l'e-mail¦Enviar correo¦Invia e-mail
Escolhe a nova palavra-passe¦Choisis ton nouveau mot de passe¦Elige la nueva contraseña¦Scegli la nuova password
Apagar a conta?¦Supprimer le compte ?¦¿Eliminar la cuenta?¦Eliminare l'account?
A tua conta, perfil, listas e fotos são apagados. Não é possível desfazer.¦Ton compte, ton profil, tes listes et tes photos seront supprimés. C'est irréversible.¦Se eliminarán tu cuenta, perfil, listas y fotos. No se puede deshacer.¦Account, profilo, liste e foto verranno eliminati. Non si può annullare.
Apagar a minha conta¦Supprimer mon compte¦Eliminar mi cuenta¦Elimina il mio account
Apagar tudo?¦Tout supprimer ?¦¿Borrar todo?¦Cancellare tutto?
Vamos apagar a conta, o perfil, as listas, os moodboards e as publicações guardadas neste dispositivo. Não é possível desfazer.¦Nous allons supprimer le compte, le profil, les listes, les moodboards et les publications enregistrés sur cet appareil. C'est irréversible.¦Vamos a borrar la cuenta, el perfil, las listas, los moodboards y las publicaciones guardados en este dispositivo. No se puede deshacer.¦Cancelleremo account, profilo, liste, moodboard e post salvati su questo dispositivo. Non si può annullare.
Apagar tudo¦Tout supprimer¦Borrar todo¦Cancella tutto
Novo evento¦Nouvel événement¦Nuevo evento¦Nuovo evento
Guardar evento¦Enregistrer l'événement¦Guardar evento¦Salva evento
Título¦Titre¦Título¦Titolo
Data¦Date¦Fecha¦Data
Hora (opcional)¦Heure (facultatif)¦Hora (opcional)¦Ora (facoltativa)
Nota (opcional)¦Note (facultatif)¦Nota (opcional)¦Nota (facoltativa)
Nota¦Note¦Nota¦Nota
Data (opcional)¦Date (facultatif)¦Fecha (opcional)¦Data (facoltativa)
Guardar objetivo¦Enregistrer l'objectif¦Guardar objetivo¦Salva obiettivo
O que queres conquistar?¦Que veux-tu accomplir ?¦¿Qué quieres conseguir?¦Cosa vuoi raggiungere?
Objetivo¦Objectif¦Objetivo¦Obiettivo
Guardar hábito¦Enregistrer l'habitude¦Guardar hábito¦Salva abitudine
Hábito¦Habitude¦Hábito¦Abitudine
Ex.: Alongar de manhã¦Ex. : s'étirer le matin¦Ej.: estirarme por la mañana¦Es.: stretching al mattino
Criar moodboard¦Créer le moodboard¦Crear moodboard¦Crea moodboard
Nome (ex.: Verão em Lisboa)¦Nom (ex. : Été à Lisbonne)¦Nombre (ej.: Verano en Lisboa)¦Nome (es.: Estate a Lisbona)
Nome do moodboard¦Nom du moodboard¦Nombre del moodboard¦Nome del moodboard
Paleta¦Palette¦Paleta¦Palette
Nova nota¦Nouvelle note¦Nueva nota¦Nuova nota
Adicionar¦Ajouter¦Añadir¦Aggiungi
Uma ideia, uma frase, uma lista¦Une idée, une phrase, une liste¦Una idea, una frase, una lista¦Un'idea, una frase, una lista
Apagar moodboard?¦Supprimer le moodboard ?¦¿Eliminar el moodboard?¦Eliminare il moodboard?
As fotos e notas deste moodboard serão apagadas.¦Les photos et notes de ce moodboard seront supprimées.¦Se eliminarán las fotos y notas de este moodboard.¦Foto e note di questo moodboard verranno eliminate.
Mostra o teu produto na loja da MAELLE.¦Présente ton produit dans la boutique MAELLE.¦Muestra tu producto en la tienda MAELLE.¦Mostra il tuo prodotto nel negozio MAELLE.
Adicionar foto¦Ajouter une photo¦Añadir foto¦Aggiungi foto
Adicionar foto (opcional)¦Ajouter une photo (facultatif)¦Añadir foto (opcional)¦Aggiungi foto (facoltativa)
Só podes vender produtos legais e teus para vender.¦Tu ne peux vendre que des produits légaux qui t'appartiennent.¦Solo puedes vender productos legales y tuyos.¦Puoi vendere solo prodotti legali e di tua proprietà.
Publicar produto¦Publier le produit¦Publicar producto¦Pubblica prodotto
Nome do produto¦Nom du produit¦Nombre del producto¦Nome del prodotto
Marca (opcional)¦Marque (facultatif)¦Marca (opcional)¦Marchio (facoltativo)
Marca¦Marque¦Marca¦Marchio
Preço em €¦Prix en €¦Precio en €¦Prezzo in €
Categoria¦Catégorie¦Categoría¦Categoria
Descrição¦Description¦Descripción¦Descrizione
Link da loja (opcional)¦Lien de la boutique (facultatif)¦Enlace de la tienda (opcional)¦Link del negozio (facoltativo)
Link da loja¦Lien de la boutique¦Enlace de la tienda¦Link del negozio
Maquilhagem, fotografia, aulas, design e muito mais.¦Maquillage, photo, cours, design et bien plus.¦Maquillaje, fotografía, clases, diseño y mucho más.¦Trucco, fotografia, lezioni, design e molto altro.
Presencial e online¦En personne et en ligne¦Presencial y en línea¦In presenza e online
Presencial¦En personne¦Presencial¦In presenza
Só podes oferecer serviços legais. O contacto fica visível para quem abrir o anúncio.¦Tu ne peux proposer que des services légaux. Le contact est visible par toute personne qui ouvre l'annonce.¦Solo puedes ofrecer servicios legales. El contacto es visible para quien abra el anuncio.¦Puoi offrire solo servizi legali. Il contatto è visibile a chi apre l'annuncio.
Publicar serviço¦Publier le service¦Publicar servicio¦Pubblica servizio
Nome do serviço¦Nom du service¦Nombre del servicio¦Nome del servizio
Modalidade¦Format¦Modalidad¦Modalità
Cidade (se for presencial)¦Ville (si en personne)¦Ciudad (si es presencial)¦Città (se in presenza)
Cidade (opcional)¦Ville (facultatif)¦Ciudad (opcional)¦Città (facoltativa)
Cidade¦Ville¦Ciudad¦Città
Preço desde, em €¦À partir de, en €¦Precio desde, en €¦Prezzo a partire da, in €
Preço desde, em euros¦À partir de, en euros¦Precio desde, en euros¦Prezzo a partire da, in euro
O que inclui o serviço?¦Que comprend le service ?¦¿Qué incluye el servicio?¦Cosa include il servizio?
Contacto: e-mail, telefone ou link¦Contact : e-mail, téléphone ou lien¦Contacto: correo, teléfono o enlace¦Contatto: e-mail, telefono o link
Contacto¦Contact¦Contacto¦Contatto
Publicar anúncio¦Publier l'annonce¦Publicar anuncio¦Pubblica annuncio
Autora ou autor¦Auteure ou auteur¦Autora o autor¦Autrice o autore
Estado¦État¦Estado¦Condizioni
Como novo¦Comme neuf¦Como nuevo¦Come nuovo
Bom¦Bon¦Bueno¦Buono
Usado¦Usagé¦Usado¦Usato
Partilha um livro de que gostaste com o clube.¦Partage avec le club un livre que tu as aimé.¦Comparte con el club un libro que te haya gustado.¦Condividi con il club un libro che ti è piaciuto.
Indicar livro¦Recommander le livre¦Recomendar libro¦Consiglia libro
Porque o recomendas?¦Pourquoi le recommandes-tu ?¦¿Por qué lo recomiendas?¦Perché lo consigli?
Porque o recomendas¦Pourquoi tu le recommandes¦Por qué lo recomiendas¦Perché lo consigli
Começar uma conversa¦Lancer une discussion¦Empezar una conversación¦Avvia una conversazione
Escolhe um tema ou um livro e escreve a primeira mensagem.¦Choisis un thème ou un livre et écris le premier message.¦Elige un tema o un libro y escribe el primer mensaje.¦Scegli un tema o un libro e scrivi il primo messaggio.
Tema ou livro¦Thème ou livre¦Tema o libro¦Tema o libro
A tua primeira mensagem¦Ton premier message¦Tu primer mensaje¦Il tuo primo messaggio
Primeira mensagem¦Premier message¦Primer mensaje¦Primo messaggio
Criar um grupo¦Créer un groupe¦Crear un grupo¦Crea un gruppo
Reúne pessoas com os teus interesses. Serás a administradora.¦Réunis des personnes qui partagent tes intérêts. Tu seras l'administratrice.¦Reúne a personas con tus intereses. Serás la administradora.¦Riunisci persone con i tuoi interessi. Sarai l'amministratrice.
Vou garantir um espaço respeitoso, só para maiores de 18 anos.¦Je veillerai à un espace respectueux, réservé aux plus de 18 ans.¦Garantizaré un espacio respetuoso, solo para mayores de 18 años.¦Garantirò uno spazio rispettoso, solo per maggiorenni.
Criar grupo¦Créer le groupe¦Crear grupo¦Crea gruppo
Nome do grupo¦Nom du groupe¦Nombre del grupo¦Nome del gruppo
Do que se fala neste grupo?¦De quoi parle-t-on dans ce groupe ?¦¿De qué se habla en este grupo?¦Di cosa si parla in questo gruppo?
Descrição do grupo¦Description du groupe¦Descripción del grupo¦Descrizione del gruppo
Tema¦Thème¦Tema¦Tema
Regras do grupo (opcional)¦Règles du groupe (facultatif)¦Normas del grupo (opcional)¦Regole del gruppo (facoltative)
Eliminar o grupo?¦Supprimer le groupe ?¦¿Eliminar el grupo?¦Eliminare il gruppo?
O grupo e as suas publicações deixam de existir.¦Le groupe et ses publications seront supprimés.¦El grupo y sus publicaciones dejarán de existir.¦Il gruppo e i suoi post verranno rimossi.
Eliminar¦Supprimer¦Eliminar¦Elimina
Copia esta mensagem e envia por e-mail ou mensagem.¦Copie ce message et envoie-le par e-mail ou SMS.¦Copia este mensaje y envíalo por correo o mensaje.¦Copia questo messaggio e invialo per e-mail o SMS.
Copiar mensagem¦Copier le message¦Copiar mensaje¦Copia messaggio
Mensagem de convite¦Message d'invitation¦Mensaje de invitación¦Messaggio di invito
Guardar nos favoritos¦Ajouter aux favoris¦Guardar en favoritos¦Salva nei preferiti
Remover dos favoritos¦Retirer des favoris¦Quitar de favoritos¦Rimuovi dai preferiti
Adicionar à lista de desejos¦Ajouter à la liste d'envies¦Añadir a la lista de deseos¦Aggiungi alla lista dei desideri
Já está na lista de desejos¦Déjà dans la liste d'envies¦Ya está en la lista de deseos¦Già nella lista dei desideri
Copiar contacto¦Copier le contact¦Copiar contacto¦Copia contatto
Abrir contacto¦Ouvrir le contact¦Abrir contacto¦Apri contatto
Ver na loja da marca¦Voir sur la boutique de la marque¦Ver en la tienda de la marca¦Vedi nel negozio del marchio
Denunciar este anúncio¦Signaler cette annonce¦Denunciar este anuncio¦Segnala questo annuncio
Enviar denúncia¦Envoyer le signalement¦Enviar denuncia¦Invia segnalazione
Diz-nos o que aconteceu. A equipa MAELLE analisa cada denúncia.¦Dis-nous ce qui s'est passé. L'équipe MAELLE examine chaque signalement.¦Cuéntanos qué ha pasado. El equipo MAELLE revisa cada denuncia.¦Raccontaci cosa è successo. Il team MAELLE esamina ogni segnalazione.
Assédio ou ofensas¦Harcèlement ou insultes¦Acoso u ofensas¦Molestie o offese
Spam ou publicidade enganosa¦Spam ou publicité trompeuse¦Spam o publicidad engañosa¦Spam o pubblicità ingannevole
Conteúdo impróprio¦Contenu inapproprié¦Contenido inapropiado¦Contenuto inappropriato
Outro motivo¦Autre motif¦Otro motivo¦Altro motivo
Deixam de ver as publicações, comentários e perguntas uma da outra. Podes desbloquear no teu perfil.¦Vous ne verrez plus les publications, commentaires et questions l'une de l'autre. Tu peux débloquer dans les Réglages.¦Dejaréis de ver las publicaciones, comentarios y preguntas la una de la otra. Puedes desbloquear en Ajustes.¦Non vedrete più post, commenti e domande l'una dell'altra. Puoi sbloccare nelle Impostazioni.
Moda¦Mode¦Moda¦Moda
Beleza¦Beauté¦Belleza¦Bellezza
Decoração¦Déco¦Decoración¦Arredamento
Viagens¦Voyages¦Viajes¦Viaggi
Receitas¦Recettes¦Recetas¦Ricette
Criatividade¦Créativité¦Creatividad¦Creatività
Organização¦Organisation¦Organización¦Organizzazione
Livros¦Livres¦Libros¦Libri
Cabelo¦Cheveux¦Cabello¦Capelli
Maquilhagem¦Maquillage¦Maquillaje¦Trucco
Fotografia¦Photographie¦Fotografía¦Fotografia
Aulas¦Cours¦Clases¦Lezioni
Imagem e estilo¦Image et style¦Imagen y estilo¦Immagine e stile
Outros¦Autres¦Otros¦Altro
Painel de administração¦Panneau d'administration¦Panel de administración¦Pannello di amministrazione
Denúncias, livros e contas¦Signalements, livres et comptes¦Denuncias, libros y cuentas¦Segnalazioni, libri e account
Ainda não tens livros nesta estante. Toca em «Quero ler», «A ler» ou «Lido» num livro.¦Aucun livre dans cette étagère. Touche « À lire », « En cours » ou « Lu » sur un livre.¦Aún no tienes libros en esta estantería. Toca «Quiero leer», «Leyendo» o «Leído» en un libro.¦Nessun libro in questo scaffale. Tocca «Da leggere», «In lettura» o «Letto» su un libro.
Sem produtos nesta seleção.¦Aucun produit dans cette sélection.¦No hay productos en esta selección.¦Nessun prodotto in questa selezione.
A carregar…¦Chargement…¦Cargando…¦Caricamento…
Tentar de novo¦Réessayer¦Reintentar¦Riprova
Conta apagada¦Compte supprimé¦Cuenta eliminada¦Account eliminato
Conta bloqueada¦Compte bloqué¦Cuenta bloqueada¦Account bloccato
Desbloqueada¦Débloquée¦Desbloqueada¦Sbloccata
Publicado¦Publié¦Publicado¦Pubblicato
Apagado¦Supprimé¦Eliminado¦Eliminato
Publicação apagada¦Publication supprimée¦Publicación eliminada¦Post eliminato
Perfil guardado¦Profil enregistré¦Perfil guardado¦Profilo salvato
Interesses guardados¦Centres d'intérêt enregistrés¦Intereses guardados¦Interessi salvati
Palavra-passe atualizada¦Mot de passe mis à jour¦Contraseña actualizada¦Password aggiornata
E-mail confirmado¦E-mail confirmé¦Correo confirmado¦E-mail confermata
Se a conta existir, vais receber um e-mail.¦Si le compte existe, tu recevras un e-mail.¦Si la cuenta existe, recibirás un correo.¦Se l'account esiste, riceverai un'e-mail.
Enviámos um e-mail. Confirma-o e depois entra.¦Nous t'avons envoyé un e-mail. Confirme-le puis connecte-toi.¦Te hemos enviado un correo. Confírmalo y luego entra.¦Ti abbiamo inviato un'e-mail. Confermala e poi accedi.
Confirma o e-mail. Falta alguma coisa.¦Vérifie l'e-mail. Il manque quelque chose.¦Revisa el correo. Falta algo.¦Controlla l'e-mail. Manca qualcosa.
Confirma o e-mail.¦Vérifie l'e-mail.¦Revisa el correo.¦Controlla l'e-mail.
A palavra-passe precisa de pelo menos 8 caracteres.¦Le mot de passe doit contenir au moins 8 caractères.¦La contraseña necesita al menos 8 caracteres.¦La password richiede almeno 8 caratteri.
Diz-nos o teu nome.¦Dis-nous ton nom.¦Dinos tu nombre.¦Dicci il tuo nome.
Indica a tua data de nascimento.¦Indique ta date de naissance.¦Indica tu fecha de nacimiento.¦Indica la tua data di nascita.
Confirma a data de nascimento.¦Vérifie la date de naissance.¦Revisa la fecha de nacimiento.¦Controlla la data di nascita.
Confirma que aceitas os Termos e que leste a Política de Privacidade.¦Confirme que tu acceptes les Conditions et que tu as lu la Politique de confidentialité.¦Confirma que aceptas los Términos y que has leído la Política de privacidad.¦Conferma di accettare i Termini e di aver letto l'Informativa sulla privacy.
Confirma que tens 18 anos ou mais para continuar.¦Confirme que tu as 18 ans ou plus pour continuer.¦Confirma que tienes 18 años o más para continuar.¦Conferma di avere almeno 18 anni per continuare.
Preenche o e-mail e a palavra-passe.¦Saisis l'e-mail et le mot de passe.¦Escribe el correo y la contraseña.¦Inserisci e-mail e password.
E-mail ou palavra-passe não coincidem.¦E-mail ou mot de passe incorrect.¦El correo o la contraseña no coinciden.¦E-mail o password non corrispondono.
Falta confirmar o e-mail. Abre a mensagem que te enviámos.¦Il faut confirmer l'e-mail. Ouvre le message que nous t'avons envoyé.¦Falta confirmar el correo. Abre el mensaje que te enviamos.¦Devi confermare l'e-mail. Apri il messaggio che ti abbiamo inviato.
Já existe uma conta com este e-mail.¦Un compte existe déjà avec cet e-mail.¦Ya existe una cuenta con este correo.¦Esiste già un account con questa e-mail.
Escolhe uma palavra-passe mais forte.¦Choisis un mot de passe plus robuste.¦Elige una contraseña más segura.¦Scegli una password più sicura.
Demasiadas tentativas. Espera um pouco e volta a tentar.¦Trop de tentatives. Attends un peu et réessaie.¦Demasiados intentos. Espera un poco y vuelve a intentarlo.¦Troppi tentativi. Attendi un po' e riprova.
Não foi possível concluir. Tenta novamente.¦Impossible de terminer. Réessaie.¦No se pudo completar. Inténtalo de nuevo.¦Operazione non riuscita. Riprova.
Não foi possível concluir.¦Impossible de terminer.¦No se pudo completar.¦Operazione non riuscita.
Não foi possível carregar.¦Chargement impossible.¦No se pudo cargar.¦Impossibile caricare.
Não foi possível abrir essa imagem.¦Impossible d'ouvrir cette image.¦No se pudo abrir esa imagen.¦Impossibile aprire l'immagine.
Sem ligação à internet.¦Pas de connexion internet.¦Sin conexión a internet.¦Nessuna connessione internet.
Sem internet. Guardamos quando voltares.¦Hors ligne. Nous enregistrerons à ton retour.¦Sin internet. Guardaremos cuando vuelvas.¦Sei offline. Salveremo quando torni online.
Não foi possível guardar online. Vamos tentar de novo.¦Enregistrement en ligne impossible. Nous allons réessayer.¦No se pudo guardar en línea. Lo intentaremos de nuevo.¦Salvataggio online non riuscito. Riproveremo.
Há alterações por guardar. Toca outra vez para sair e perdê-las.¦Des changements ne sont pas enregistrés. Touche encore pour sortir et les perdre.¦Hay cambios sin guardar. Toca otra vez para salir y perderlos.¦Ci sono modifiche non salvate. Tocca di nuovo per uscire e perderle.
A sessão expirou. Entra de novo.¦Session expirée. Reconnecte-toi.¦La sesión ha caducado. Entra de nuevo.¦Sessione scaduta. Accedi di nuovo.
Essa ligação já não é válida. Pede uma nova.¦Ce lien n'est plus valable. Demandes-en un nouveau.¦Ese enlace ya no es válido. Pide uno nuevo.¦Il link non è più valido. Richiedine uno nuovo.
Esse nome de utilizador já está em uso.¦Ce nom d'utilisatrice est déjà pris.¦Ese nombre de usuaria ya está en uso.¦Questo nome utente è già in uso.
O nome de utilizador precisa de pelo menos 2 caracteres.¦Le nom d'utilisatrice doit contenir au moins 2 caractères.¦El nombre de usuaria necesita al menos 2 caracteres.¦Il nome utente richiede almeno 2 caratteri.
A foto é grande demais para guardar. Escolhe outra.¦La photo est trop lourde. Choisis-en une autre.¦La foto es demasiado grande. Elige otra.¦La foto è troppo grande. Scegline un'altra.
Sem espaço para guardar neste dispositivo.¦Plus de place sur cet appareil.¦No queda espacio en este dispositivo.¦Spazio esaurito su questo dispositivo.
Já estava registado.¦Déjà enregistré.¦Ya estaba registrado.¦Già registrato.
Grupo criado¦Groupe créé¦Grupo creado¦Gruppo creato
Grupo eliminado¦Groupe supprimé¦Grupo eliminado¦Gruppo eliminato
Bem-vinda ao grupo¦Bienvenue dans le groupe¦Bienvenida al grupo¦Benvenuta nel gruppo
Saíste do grupo¦Tu as quitté le groupe¦Has salido del grupo¦Hai lasciato il gruppo
Pergunta publicada¦Question publiée¦Pregunta publicada¦Domanda pubblicata
Denúncia enviada. Obrigada por ajudares a manter a MAELLE segura.¦Signalement envoyé. Merci d'aider à protéger MAELLE.¦Denuncia enviada. Gracias por ayudar a cuidar MAELLE.¦Segnalazione inviata. Grazie per aiutarci a proteggere MAELLE.
Evento guardado¦Événement enregistré¦Evento guardado¦Evento salvato
Objetivo guardado¦Objectif enregistré¦Objetivo guardado¦Obiettivo salvato
Objetivo conquistado!¦Objectif atteint !¦¡Objetivo conseguido!¦Obiettivo raggiunto!
Hábito criado¦Habitude créée¦Hábito creado¦Abitudine creata
Produto publicado¦Produit publié¦Producto publicado¦Prodotto pubblicato
Serviço publicado¦Service publié¦Servicio publicado¦Servizio pubblicato
Livro anunciado¦Livre mis en vente¦Libro anunciado¦Libro in vendita
Livro indicado¦Livre recommandé¦Libro recomendado¦Libro consigliato
Obrigada! O livro aguarda aprovação.¦Merci ! Le livre attend validation.¦¡Gracias! El libro está pendiente de aprobación.¦Grazie! Il libro è in attesa di approvazione.
Guardado nos favoritos¦Ajouté aux favoris¦Guardado en favoritos¦Salvato nei preferiti
Removido dos favoritos¦Retiré des favoris¦Quitado de favoritos¦Rimosso dai preferiti
Adicionado à lista de desejos¦Ajouté à la liste d'envies¦Añadido a la lista de deseos¦Aggiunto alla lista dei desideri
Guardada em Coleções¦Enregistrée dans les collections¦Guardada en colecciones¦Salvata nelle raccolte
Removida das coleções¦Retirée des collections¦Quitada de colecciones¦Rimossa dalle raccolte
Dá um título ao evento.¦Donne un titre à l'événement.¦Pon un título al evento.¦Dai un titolo all'evento.
Escolhe uma data.¦Choisis une date.¦Elige una fecha.¦Scegli una data.
Escreve o teu objetivo.¦Écris ton objectif.¦Escribe tu objetivo.¦Scrivi il tuo obiettivo.
Dá um nome ao hábito.¦Nomme l'habitude.¦Pon nombre al hábito.¦Dai un nome all'abitudine.
Dá um nome ao moodboard.¦Nomme le moodboard.¦Pon nombre al moodboard.¦Dai un nome al moodboard.
Escreve a nota.¦Écris la note.¦Escribe la nota.¦Scrivi la nota.
Dá um nome ao produto.¦Nomme le produit.¦Pon nombre al producto.¦Dai un nome al prodotto.
Dá um nome ao serviço.¦Nomme le service.¦Pon nombre al servicio.¦Dai un nome al servizio.
Indica o preço em euros.¦Indique le prix en euros.¦Indica el precio en euros.¦Indica il prezzo in euro.
Indica o preço desde, em euros.¦Indique le prix de départ en euros.¦Indica el precio desde, en euros.¦Indica il prezzo di partenza in euro.
Explica o que inclui o serviço.¦Explique ce que comprend le service.¦Explica qué incluye el servicio.¦Spiega cosa include il servizio.
Indica um contacto para quem quiser falar contigo.¦Indique un contact pour qu'on puisse te joindre.¦Indica un contacto para quien quiera hablar contigo.¦Indica un contatto per chi vuole scriverti.
Indica um contacto para quem quiser comprar.¦Indique un contact pour les acheteurs.¦Indica un contacto para quien quiera comprar.¦Indica un contatto per chi vuole acquistare.
Indica um contacto ou o link da loja.¦Indique un contact ou le lien de la boutique.¦Indica un contacto o el enlace de la tienda.¦Indica un contatto o il link del negozio.
Indica o título do livro.¦Indique le titre du livre.¦Indica el título del libro.¦Indica il titolo del libro.
Dá um tema à conversa.¦Donne un thème à la discussion.¦Pon un tema a la conversación.¦Dai un tema alla conversazione.
Escreve a primeira mensagem.¦Écris le premier message.¦Escribe el primer mensaje.¦Scrivi il primo messaggio.
Dá ao grupo um nome com pelo menos 3 letras.¦Donne au groupe un nom d'au moins 3 lettres.¦Pon al grupo un nombre de al menos 3 letras.¦Dai al gruppo un nome di almeno 3 lettere.
Confirma que vais garantir um espaço respeitoso.¦Confirme que tu garantiras un espace respectueux.¦Confirma que garantizarás un espacio respetuoso.¦Conferma che garantirai uno spazio rispettoso.
Créditos das fotografias¦Crédits photos¦Créditos de las fotos¦Crediti fotografici
Vídeo¦Vidéo¦Vídeo¦Video
Retirar¦Retirer¦Quitar¦Rimuovi
A enviar o vídeo…¦Envoi de la vidéo…¦Subiendo el vídeo…¦Caricamento del video…
O vídeo é grande demais. O limite é 30 MB.¦La vidéo est trop lourde. La limite est de 30 Mo.¦El vídeo es demasiado grande. El límite es de 30 MB.¦Il video è troppo grande. Il limite è di 30 MB.
Este formato de vídeo não é suportado.¦Ce format vidéo n'est pas pris en charge.¦Este formato de vídeo no es compatible.¦Questo formato video non è supportato.
Seguidos¦Abonnements¦Seguidos¦Seguiti
Seguidoras¦Abonnées¦Seguidoras¦Follower
Remover¦Retirer¦Quitar¦Rimuovi
Encontrar pessoas¦Trouver des personnes¦Buscar personas¦Trova persone
Descobre perfis e segue quem gostas.¦Découvre des profils et suis ceux que tu aimes.¦Descubre perfiles y sigue los que te gusten.¦Scopri profili e segui quelli che ti piacciono.
Procurar por nome¦Chercher par nom¦Buscar por nombre¦Cerca per nome
Ninguém encontrado.¦Personne trouvée.¦No se ha encontrado a nadie.¦Nessuno trovato.
Ainda sem seguidoras.¦Pas encore d'abonnées.¦Aún sin seguidoras.¦Ancora nessun follower.
Ainda não segue ninguém.¦Ne suit encore personne.¦Aún no sigue a nadie.¦Non segue ancora nessuno.
Todas¦Toutes¦Todas¦Tutti
Segue perfis para veres aqui as publicações.¦Suis des profils pour voir leurs publications ici.¦Sigue perfiles para ver aquí sus publicaciones.¦Segui dei profili per vedere qui i loro post.
Começaste a seguir¦Tu suis ce profil¦Ahora sigues este perfil¦Ora segui questo profilo
Deixaste de seguir¦Tu ne suis plus ce profil¦Has dejado de seguir¦Non segui più questo profilo
Seguidora removida¦Abonnée retirée¦Seguidora eliminada¦Follower rimosso
Mensagens¦Messages¦Mensajes¦Messaggi
Quem sigo¦Les personnes suivies¦A quienes sigo¦Chi seguo
Ninguém¦Personne¦Nadie¦Nessuno
As tuas conversas privadas.¦Tes conversations privées.¦Tus conversaciones privadas.¦Le tue conversazioni private.
Ainda não tens mensagens. Abre um perfil para começar uma conversa.¦Pas encore de messages. Ouvre un profil pour lancer une conversation.¦Aún no tienes mensajes. Abre un perfil para empezar una conversación.¦Ancora nessun messaggio. Apri un profilo per iniziare una conversazione.
Ainda não há mensagens nesta conversa.¦Pas encore de messages dans cette conversation.¦Aún no hay mensajes en esta conversación.¦Ancora nessun messaggio in questa conversazione.
Só tu e a outra pessoa veem esta conversa. Se denunciares uma mensagem, a equipa vê essa mensagem.¦Seules toi et l'autre personne voyez cette conversation. Si tu signales un message, l'équipe voit ce message.¦Solo tú y la otra persona veis esta conversación. Si denuncias un mensaje, el equipo ve ese mensaje.¦Solo tu e l'altra persona vedete questa conversazione. Se segnali un messaggio, il team vede quel messaggio.
Esta pessoa não aceita as tuas mensagens.¦Cette personne n'accepte pas tes messages.¦Esta persona no acepta tus mensajes.¦Questa persona non accetta i tuoi messaggi.
Quem te pode enviar mensagens¦Qui peut t'envoyer des messages¦Quién puede enviarte mensajes¦Chi può inviarti messaggi
Preferência guardada¦Préférence enregistrée¦Preferencia guardada¦Preferenza salvata
Mensagem privada¦Message privé¦Mensaje privado¦Messaggio privato
Demasiadas tentativas. Espera um pouco e tenta de novo.¦Trop de tentatives. Attends un peu et réessaie.¦Demasiados intentos. Espera un poco.¦Troppi tentativi. Attendi un po'.
Código de convite¦Code d'invitation¦Código de invitación¦Codice di invito
Escreve o teu código de convite.¦Saisis ton code d'invitation.¦Escribe tu código de invitación.¦Inserisci il tuo codice di invito.
Não foi possível criar a conta. Confirma o código de convite.¦Impossible de créer le compte. Vérifie le code d'invitation.¦No se pudo crear la cuenta. Revisa el código de invitación.¦Impossibile creare l'account. Controlla il codice di invito.
Todos os direitos reservados.¦Tous droits réservés.¦Todos los derechos reservados.¦Tutti i diritti riservati.
Fotos e vídeos¦Photos et vidéos¦Fotos y vídeos¦Foto e video
Vídeos¦Vidéos¦Vídeos¦Video
Texto¦Texte¦Texto¦Testo
Abrir publicação¦Ouvrir la publication¦Abrir publicación¦Apri post
Publicação¦Publication¦Publicación¦Post
Ainda sem textos.¦Pas encore de textes.¦Aún sin textos.¦Ancora nessun testo.
Ainda sem vídeos.¦Pas encore de vidéos.¦Aún sin vídeos.¦Ancora nessun video.
Ainda sem fotos ou vídeos.¦Pas encore de photos ni de vidéos.¦Aún sin fotos ni vídeos.¦Ancora nessuna foto o video.
Esta publicação já não está disponível.¦Cette publication n'est plus disponible.¦Esta publicación ya no está disponible.¦Questo post non è più disponibile.
`;

/* meses e frases com números ou nomes, por língua */
const PT_MONTHS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const n1=(n,one,many)=>n+' '+(n==='1'?one:many);
const PHRASES={
 en:{months:'January February March April May June July August September October November December',
  hi:n=>'Hi, '+n,next:(t,d)=>'Next: '+t+', '+d,daysAgo:n=>n+' days ago',yesterday:'yesterday',now:'now',members:n=>n1(n,'member','members'),ideas:n=>n+' ideas',todo:n=>n+' to do',todoH:'To do',doneH:'Done',goals:n=>n1(n,'goal','goals'),doneToday:(x,y)=>x+' of '+y+' done today',toBuy:n=>n+' to buy',posts:n=>n1(n,'post','posts'),questions:n=>n1(n,'question','questions'),catalog:(x,y)=>x+' products and '+y+' services',brands:n=>n+' brands',saved:(x,y)=>x+' saved · '+y+' brands',upcoming:n=>n+' upcoming events',from:p=>'From '+p,blockQ:n=>'Block '+n+'?',blocked:n=>n+' was blocked',streak:n=>n1(n,'day in a row','days in a row'),until:d=>'By '+d,items:n=>n1(n,'item','items'),reading:n=>n1(n,'book being read','books being read'),active:(n,m)=>n+' active in '+m},
 fr:{months:'janvier février mars avril mai juin juillet août septembre octobre novembre décembre',
  hi:n=>'Salut, '+n,next:(t,d)=>'À venir : '+t+', '+d,daysAgo:n=>'il y a '+n+' jours',yesterday:'hier',now:'à l’instant',members:n=>n1(n,'membre','membres'),ideas:n=>n+' idées',todo:n=>n+' à faire',todoH:'À faire',doneH:'Faites',goals:n=>n1(n,'objectif','objectifs'),doneToday:(x,y)=>x+' sur '+y+' faites aujourd’hui',toBuy:n=>n+' à acheter',posts:n=>n1(n,'publication','publications'),questions:n=>n1(n,'question','questions'),catalog:(x,y)=>x+' produits et '+y+' services',brands:n=>n+' marques',saved:(x,y)=>x+' enregistrés · '+y+' marques',upcoming:n=>n+' événements à venir',from:p=>'À partir de '+p,blockQ:n=>'Bloquer '+n+' ?',blocked:n=>n+' a été bloquée',streak:n=>n1(n,'jour d’affilée','jours d’affilée'),until:d=>'Avant le '+d,items:n=>n1(n,'élément','éléments'),reading:n=>n1(n,'livre en cours','livres en cours'),active:(n,m)=>n1(n,'défi actif','défis actifs')+' en '+m},
 es:{months:'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre',
  hi:n=>'Hola, '+n,next:(t,d)=>'Próximo: '+t+', '+d,daysAgo:n=>'hace '+n+' días',yesterday:'ayer',now:'ahora',members:n=>n1(n,'miembro','miembros'),ideas:n=>n+' ideas',todo:n=>n+' pendientes',todoH:'Pendientes',doneH:'Hechas',goals:n=>n1(n,'objetivo','objetivos'),doneToday:(x,y)=>x+' de '+y+' hechos hoy',toBuy:n=>n+' por comprar',posts:n=>n1(n,'publicación','publicaciones'),questions:n=>n1(n,'pregunta','preguntas'),catalog:(x,y)=>x+' productos y '+y+' servicios',brands:n=>n+' marcas',saved:(x,y)=>x+' guardados · '+y+' marcas',upcoming:n=>n+' próximos eventos',from:p=>'Desde '+p,blockQ:n=>'¿Bloquear a '+n+'?',blocked:n=>n+' ha sido bloqueada',streak:n=>n1(n,'día seguido','días seguidos'),until:d=>'Hasta el '+d,items:n=>n1(n,'elemento','elementos'),reading:n=>n1(n,'libro en lectura','libros en lectura'),active:(n,m)=>n1(n,'reto activo','retos activos')+' en '+m},
 it:{months:'gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre',
  hi:n=>'Ciao, '+n,next:(t,d)=>'Prossimo: '+t+', '+d,daysAgo:n=>n+' giorni fa',yesterday:'ieri',now:'adesso',members:n=>n1(n,'membro','membri'),ideas:n=>n+' idee',todo:n=>n+' da fare',todoH:'Da fare',doneH:'Fatte',goals:n=>n1(n,'obiettivo','obiettivi'),doneToday:(x,y)=>x+' di '+y+' fatte oggi',toBuy:n=>n+' da comprare',posts:n=>n+' post',questions:n=>n1(n,'domanda','domande'),catalog:(x,y)=>x+' prodotti e '+y+' servizi',brands:n=>n+' marchi',saved:(x,y)=>x+' salvati · '+y+' marchi',upcoming:n=>n+' prossimi eventi',from:p=>'Da '+p,blockQ:n=>'Bloccare '+n+'?',blocked:n=>n+' è stata bloccata',streak:n=>n1(n,'giorno di fila','giorni di fila'),until:d=>'Entro il '+d,items:n=>n1(n,'elemento','elementi'),reading:n=>n1(n,'libro in lettura','libri in lettura'),active:(n,m)=>n1(n,'sfida attiva','sfide attive')+' a '+m}
};
if(LANG!=='pt'){
 const col={fr:1,es:2,it:3}[LANG];
 const lines=t=>t.trim().split('\n');
 const dict=new Map(col?lines(MORE_TEXT).map(l=>{const c=l.split('¦');return [c[0],c[col]]}):lines(EN_TEXT).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)]}));
 const T=PHRASES[LANG],names=T.months.split(' ');
 const m=PT_MONTHS.join('|'),mon=x=>names[PT_MONTHS.indexOf(x.toLowerCase())];
 const date=(d,mm)=>d+(LANG==='es'?' de ':' ')+mon(mm);
 const year=r=>LANG==='es'?r:r.replace(/^ de (?=\d{4})/,' ');
 const re=(p,f)=>[new RegExp(p,'i'),(a,...x)=>f(...x)];
 const rules=[
  re('^Olá, (.*)$',n=>T.hi(n)),
  re('^Próximo: (.*), (\\d+) de ('+m+')(.*)$',(t,d,mm,r)=>T.next(t,date(d,mm)+year(r))),
  re('^Até (\\d+) de ('+m+')(.*)$',(d,mm,r)=>T.until(date(d,mm)+year(r))),
  re('^(\\d+) de ('+m+')(.*)$',(d,mm,r)=>date(d,mm)+year(r)),
  re('^('+m+') (\\d{4})$',(mm,y)=>{const n=mon(mm);return n.charAt(0).toUpperCase()+n.slice(1)+' '+y}),
  re('^(\\d+) ativos? em ('+m+')$',(n,mm)=>T.active(n,mon(mm))),
  re('^há (\\d+) dias$',T.daysAgo),re('^ontem$',()=>T.yesterday),re('^agora$',()=>T.now),
  re('^(\\d+) membros?$',T.members),re('^(\\d+) ideias$',T.ideas),re('^(\\d+) por fazer$',T.todo),re('^Por fazer(.*)$',r=>T.todoH+r),re('^Feitas(.*)$',r=>T.doneH+r),
  re('^(\\d+) objetivos?$',T.goals),re('^(\\d+) de (\\d+) feitos hoje$',T.doneToday),re('^(\\d+) por comprar$',T.toBuy),
  re('^(\\d+) publicações$',T.posts),re('^(\\d+) perguntas?$',T.questions),
  re('^(\\d+) produtos e (\\d+) serviços$',T.catalog),re('^(\\d+) marcas$',T.brands),re('^(\\d+) guardados · (\\d+) marcas$',T.saved),
  re('^(\\d+) próximos encontros$',T.upcoming),re('^(\\d+) dias? seguidos?$',T.streak),re('^(\\d+) (?:item|itens)$',T.items),re('^(\\d+) livros? em leitura$',T.reading),
  re('^Desde (.*)$',T.from),re('^Bloquear (.*)\\?$',T.blockQ),re('^(.*) foi bloqueada$',T.blocked)
 ];
 const tr=s=>{const k=s.trim().replace(/\s+/g,' ');if(!k)return s;let v=dict.get(k);if(v===undefined){const r=rules.find(r=>r[0].test(k));if(r)v=k.replace(r[0],r[1])}return v===undefined?s:s.replace(s.trim(),()=>v)};
 const skip=el=>!el||el.closest('[data-nt],textarea,script,style,svg');
 const attrs=el=>{['placeholder','aria-label'].forEach(a=>{const v=el.getAttribute(a);if(v){const n=tr(v);if(n!==v)el.setAttribute(a,n)}})};
 const text=n=>{const p=n.parentElement;if(skip(p))return;const v=tr(n.nodeValue);if(v===n.nodeValue)return;
  /* uma opção sem value envia o texto: guardar o original antes de traduzir */
  if(p.tagName==='OPTION'&&!p.hasAttribute('value'))p.setAttribute('value',p.textContent);n.nodeValue=v};
 const walk=n=>{if(n.nodeType===3)return text(n);if(n.nodeType!==1||n.closest('[data-nt],svg'))return;if(n.matches('[placeholder],[aria-label]'))attrs(n);if(n.tagName!=='TEXTAREA')n.childNodes.forEach(walk)};
 document.documentElement.lang=LANG;
 const app=document.getElementById('app');
 new MutationObserver(l=>l.forEach(x=>x.addedNodes.forEach(walk))).observe(app,{childList:true,subtree:true});
 walk(app);
}
