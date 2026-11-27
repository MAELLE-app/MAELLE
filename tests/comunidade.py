"""Testes da Comunidade e do painel, com um servidor simulado."""
import json,re,uuid,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
ME=str(uuid.uuid4());OTHER=str(uuid.uuid4());NOW='2026-11-26T07:00:00+00:00'
db={k:[] for k in 'tasks events goals habits wishlist journal habit_logs posts comments post_likes groups group_members questions answers reports blocks books shelves listings favorites brands brand_follows book_rooms room_messages invites app_config follows messages message_settings'.split()}
db['posts'].append({'id':str(uuid.uuid4()),'author_id':OTHER,'group_id':None,'body':'<img src=x onerror=alert(1)> olá','status':'visible','created_at':NOW})
names={ME:'Admin',OTHER:'Bia'};calls=[]
def A(i):return {'username':names[i]}
def match(x,qs):
    for k,v in qs.items():
        if k in('select','order','limit','on_conflict','or'):continue
        s=str(x.get(k)).lower() if x.get(k) is not None else 'null'
        if v.startswith('eq.') and s!=v[3:].lower():return False
        if v=='is.null' and x.get(k) is not None:return False
        if v.startswith('in.') and s not in v[4:-1].lower().split(','):return False
    return True
def shape(t,x):
    x=dict(x)
    if 'author_id' in x:x['author']=A(x['author_id'])
    if t=='posts':
        x['comments']=[shape('comments',c) for c in db['comments'] if c['post_id']==x['id']];x['post_likes']=[l for l in db['post_likes'] if l['post_id']==x['id']]
    if t=='questions':x['answers']=[shape('answers',c) for c in db['answers'] if c['question_id']==x['id']]
    if t=='groups':x['group_members']=[m for m in db['group_members'] if m['group_id']==x['id']]
    if t=='listings':x['seller']=A(x['seller_id'])
    if t=='reports':x['reporter']=A(x['reporter_id'])
    if t=='messages':x['sender']=A(x['sender_id']);x['recipient']=A(x['recipient_id']);x['author']=x['sender'];x['author_id']=x['sender_id']
    if t=='follows':x['follower']=A(x['follower_id']);x['followed']=A(x['followed_id'])
    if t=='blocks':x['who']=A(x['blocked_id'])
    return x
def route(r):
    q=r.request;u=U.urlparse(q.url);p=u.path;m=q.method;qs=dict(U.parse_qsl(u.query));t=p.split('/')[-1];calls.append((m,p))
    def ok(b=None,s=200):r.fulfill(status=s,content_type='application/json',body='' if b is None else json.dumps(b),headers={'access-control-allow-origin':'*'})
    if p.startswith('/auth/'):return ok({'access_token':'a','refresh_token':'r','expires_in':3600,'user':{'id':ME,'email':'a@b.pt','user_metadata':{}}})
    if t=='profiles':
        if m=='GET' and 'id' in qs:return ok([{'username':'Admin','bio':None,'avatar_url':None,'interests':['moda'],'role':'admin'}])
        return ok([{'id':ME},{'id':OTHER}]) if m=='GET' else ok(None,204)
    if t=='admin_list_banned':return ok([])
    if t=='admin_set_banned':return ok(None,204)
    d=db[t]
    if m=='GET':return ok([shape(t,x) for x in d if match(x,qs)])
    if m=='POST':
        body=q.post_data_json
        for x in body if isinstance(body,list) else [body]:
            x.setdefault('id',str(uuid.uuid4()));x.setdefault('created_at',NOW)
            if t in('posts','groups'):x.setdefault('status','visible' if t=='posts' else 'active')
            if t=='reports':x['status']='open'
            d.append(x)
            if t=='groups':db['group_members'].append({'group_id':x['id'],'user_id':x['owner_id'],'role':'admin'})
        return ok(None,201)
    hit=[x for x in d if match(x,qs)]
    if m=='PATCH':
        for x in hit:x.update(q.post_data_json)
    if m=='DELETE':
        for x in hit:d.remove(x)
    return ok(hit)
with sync_playwright() as pw:
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':390,'height':800});errs=[];dialogs=[]
    pg.set_default_timeout(6000);pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('dialog',lambda d:(dialogs.append(1),d.dismiss()))
    pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort());pg.route(re.compile(r'https://commons\.wikimedia\.org/.*'),lambda r:r.abort());pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    W=lambda:pg.wait_for_timeout(700)
    tab=lambda:pg.click('#tabs >> text=Comunidade')
    pg.goto('http://127.0.0.1:8766/');pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    tab();pg.click('text=Publicações');pg.wait_for_selector('text=olá')
    pg.fill('#po-t','Primeira publicação');pg.click('button:has-text("Publicar")');pg.wait_for_selector('article >> text=Primeira publicação')
    mine=pg.locator('article',has_text='Primeira publicação')
    mine.locator('.like').click();W();assert len(db['post_likes'])==1
    mine.locator('.like').click();W();assert len(db['post_likes'])==0
    mine.locator('input').fill('Um comentário');mine.locator('input').press('Enter');pg.wait_for_selector('.cm >> text=Um comentário');W()
    other=pg.locator('article',has_text='olá');other.locator('text=Denunciar').click();pg.click('text=Enviar denúncia');W();assert len(db['reports'])==1
    tab();pg.click('text=Grupos');pg.click('text=Criar o meu grupo');pg.fill('#ng-n','Leituras');pg.check('#ng-ok');pg.click('button:has-text("Criar grupo")');pg.wait_for_selector('#gp-t')
    pg.fill('#gp-t','No grupo');pg.click('button:has-text("Publicar")');pg.wait_for_selector('article >> text=No grupo');assert db['posts'][-1]['group_id']==db['groups'][0]['id']
    tab();pg.click('text=Perguntas & Respostas');pg.fill('#qa-q','Que livro?');pg.press('#qa-q','Enter');pg.wait_for_selector('h3 >> text=Que livro?');W()
    pg.fill('.cmform input','Este');pg.press('.cmform input','Enter');pg.wait_for_selector('.cm >> text=Este');W()
    pg.click('#tabs >> text=Club');pg.click('text=Clube de Livros');pg.click('text=Indicar um livro');pg.fill('#sg-t','Novo Livro');pg.click('#sheet button[type=submit]');pg.wait_for_selector('text=A aguardar aprovação')
    tab();pg.click('text=Painel de administração');pg.wait_for_selector('text=Novo Livro');pg.screenshot(path='/tmp/t/admin.png',full_page=True)
    pg.click('[data-act=admbook]');W();assert db['books'][0]['approved']
    pg.click('[data-act=admhide]');W();assert db['posts'][0]['status']=='hidden' and db['reports'][0]['status']=='actioned'
    pg.click('[data-act=admshow]');W();assert db['posts'][0]['status']=='visible'
    tab();pg.click('text=Publicações');pg.locator('article',has_text='olá').locator('text=Bloquear').click();pg.click('#sheet >> text=Bloquear >> nth=-1');W();assert db['blocks'][0]['blocked_id']==OTHER
    pg.click('#tabs >> text=Perfil');pg.click('[aria-label="Definições"]');pg.click('text=Desbloquear');W();assert not db['blocks']
    pg.click('text=Terminar sessão');pg.click('text=Explorar sem conta');pg.check('#age-ok');pg.click('#sheet button[type=submit]');tab();pg.click('text=Publicações');pg.wait_for_selector('text=moodboard de verão')
    assert not errs,errs;assert not dialogs;print('COMUNIDADE OK',len(calls));b.close()
