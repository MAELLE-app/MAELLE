# MAELLE — A World Made for Her

Aplicação para maiores de 18 anos. Código em `docs/` (HTML, CSS e JavaScript, sem compilação).

## O que já está ligado ao Supabase
- Contas: registo (18+), entrada, saída, recuperação de palavra-passe, apagar conta
- Perfil (nome, biografia, foto) e interesses
- My Place: agenda, tarefas, objetivos, hábitos, lista de desejos
- Diário

## Ainda só no dispositivo
Moodboards, coleções, Beauty & Style, Club, Comunidade, grupos, clube de livros, loja,
serviços, denúncias e bloqueios. Estes dados apagam-se ao terminar sessão.

## Publicar (GitHub Pages)
1. GitHub: Settings → Pages → Deploy from a branch → `main`, pasta `/docs`.
2. Supabase: Authentication → URL Configuration → *Site URL* e *Redirect URLs*:
   `https://maelle-app.github.io/MAELLE/`

## Segurança
- `docs/supa.js` contém só a chave *publishable* (pública). Nunca guardar a chave secreta no repositório.
- Os dados são protegidos por regras RLS na base de dados.

## Por fazer antes do lançamento
- Apagar também as fotos guardadas quando se apaga uma conta (RGPD)
- Configurar um serviço de e-mail próprio no Supabase
- Publicar Termos e Política de Privacidade

## Testes
`python3 tests/e2e.py` (precisa de Playwright; usa um servidor simulado).
