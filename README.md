# MAELLE — A World Made for Her

Aplicação para maiores de 18 anos. Código em `docs/` (HTML, CSS e JavaScript, sem compilação).

## O que já está ligado ao Supabase
- Contas: registo (18+), entrada, saída, recuperação de palavra-passe, apagar conta
- Perfil (nome, biografia, foto) e interesses
- My Place: agenda, tarefas, objetivos, hábitos, lista de desejos
- Diário
- Comunidade: publicações, comentários, gostos, grupos, perguntas, denúncias e bloqueios
- Painel de administração: denúncias, ocultar e repor conteúdo, aprovar livros, suspender contas
- Loja e serviços: anúncios com foto e contacto, favoritos, marcas seguidas
- Clube de livros: estante, livros à venda e conversas

- Perfil próprio e perfis de outras utilizadoras, com publicações (texto e foto), gostos e comentários

## Fotografias
Fotografias CC0 carregadas do Wikimedia Commons (`PHOTOS` em `docs/core.js`, créditos em `docs/creditos.html`). Se alguma não carregar, a app mostra a ilustração de `docs/img/`. Para as lojas de apps convém guardar cópias das fotografias no projeto. Os anúncios nunca usam fotografias de banco como se fossem do artigo.

## Perfis
Publicações com texto, fotografia ou vídeo (MP4, MOV ou WebM até 30 MB), gostos, comentários, seguir perfis, encontrar pessoas pelo nome e separador "Seguidos". Tabela `follows` com RLS; bloquear alguém apaga o "seguir" nos dois sentidos. Antes de abrir ao público: o plano gratuito do Supabase tem pouco espaço e tráfego para vídeo.

## Mensagens privadas
`docs/messages.js`, tabelas `messages` e `message_settings` com RLS. Cada pessoa escolhe quem lhe pode escrever (todas, quem segue ou ninguém); bloquear esconde a conversa; limite de 30 mensagens por minuto; a equipa só lê uma mensagem denunciada por quem a recebeu. Sem notificações no telemóvel nem tempo real (a conversa aberta atualiza a cada 5 segundos) e sem cifra de ponta a ponta.

## Acesso e proteção
Registo só com convite (`invites`, imposto na base de dados; a administração cria um por pessoa no painel, copia o link e pode anulá-lo). `app_config.invite_required` desliga a exigência quando a app abrir ao público. Páginas com `noindex`. Direitos reservados em `LICENSE`. Verificação de conteúdo malicioso em `tests/seguranca.py`.

## Línguas
Português, inglês, francês, espanhol e italiano (`docs/i18n.js`; francês, espanhol e italiano ainda sem revisão por falantes nativas). Ainda em português: ideias e conteúdos do The Club e Beauty & Style, painel de administração, Termos e Política de Privacidade.

## Ainda só no dispositivo
Moodboards, coleções, Beauty & Style e The Club. Não há pagamentos na app. Estes dados apagam-se ao terminar sessão.

## Publicar (GitHub Pages)
1. GitHub Pages publica o ramo `gh-pages`, que contém uma cópia da pasta `docs/`.
2. Supabase: Authentication → URL Configuration → *Site URL* e *Redirect URLs*:
   `https://maelle-app.github.io/MAELLE/`

## Segurança
- `docs/supa.js` contém só a chave *publishable* (pública). Nunca guardar a chave secreta no repositório.
- Os dados são protegidos por regras RLS na base de dados.

## Por fazer antes do lançamento
- Configurar um serviço de e-mail próprio no Supabase
- Política de Privacidade publicada em versão provisória (`docs/privacidade.html`): faltam as garantias de transferência de dados e a revisão jurídica; trocar o e-mail de contacto antes de publicar a app nas lojas
- Termos de Utilização publicados em versão provisória (`docs/termos.html`): falta revisão jurídica e confirmar o registo no Livro de Reclamações Eletrónico

## Testes
`python3 tests/e2e.py` `python3 tests/comunidade.py` e `python3 tests/loja.py` `python3 tests/perfil.py` `python3 tests/linguas.py` `python3 tests/seguranca.py` (precisa de Playwright; usa um servidor simulado).
