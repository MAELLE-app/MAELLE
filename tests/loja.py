"""Testes da loja e do clube de livros, com um servidor simulado."""
import json,re,uuid,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8767),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
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
    if p.startswith('/storage/'):return ok({})
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
    pg.route(re.compile(r'https://(fonts\.|commons\.wikimedia\.org|(covers\.)?openlibrary\.org).*'),lambda r:r.abort());pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    W=lambda:pg.wait_for_timeout(700)
    tab=lambda:pg.click('#tabs >> text=Comunidade')
    pg.goto('http://127.0.0.1:8767/');pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    db['listings'].append({'id':str(uuid.uuid4()),'seller_id':OTHER,'brand_id':None,'kind':'product','title':'Mala <b>x</b>','description':'d','price_cents':2500,'category':'moda','mode':None,'city':None,'author':None,'condition':None,'contact':'bia@x.pt','link':'javascript:alert(1)','image_url':'https://mau.example/p.png','status':'active','created_at':NOW})
    db['brands'].append({'id':str(uuid.uuid4()),'name':'Casa Bruma','description':'velas'})
    db['books'].append({'id':str(uuid.uuid4()),'title':'Livro A','author':'X','tag':'Romance','blurb':'b','approved':True,'created_at':NOW})
    db['book_rooms'].append({'id':str(uuid.uuid4()),'title':'Livro A','book_id':db['books'][0]['id'],'created_at':NOW})
    edit=lambda:pg.click('#tabs >> text=The Edit')
    edit();pg.click('text=Shop');pg.wait_for_selector('.prod >> text=Mala');assert pg.locator('.prod').count()==1
    pg.click('[data-act=fav]');W();assert len(db['favorites'])==1
    pg.click('.prod');assert pg.locator('#sheet a[href^=javascript]').count()==0;pg.wait_for_selector('#sheet >> text=bia@x.pt')
    pg.click('#sheet >> text=Denunciar');pg.click('text=Enviar denúncia');W();assert db['reports'][0]['target_type']=='listing'
    pg.click('text=Vender um produto');pg.fill('#ap-n','Brincos');pg.fill('#ap-p','12,50');pg.click('#sheet button[type=submit]');pg.wait_for_selector('text=Indica um contacto')
    pg.fill('#ap-ct','eu@x.pt')
    pg.set_input_files('#pimgin',{'name':'a.png','mimeType':'image/png','buffer':__import__('base64').b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')});W()
    pg.click('#sheet button[type=submit]');pg.wait_for_selector('.prod >> text=Brincos');m=db['listings'][-1];assert m['price_cents']==1250 and '/media/' in m['image_url'],m
    pg.click('.seg >> text=Serviços');pg.click('text=Oferecer um serviço');pg.fill('#as-n','Aulas');pg.fill('#as-p','20');pg.fill('#as-d','uma hora');pg.fill('#as-ct','eu@x.pt');pg.click('#sheet button[type=submit]');pg.wait_for_selector('.svc >> text=Aulas')
    edit();pg.click('text=Brands');pg.click('text=Seguir');W();assert len(db['brand_follows'])==1
    edit();pg.click('text=Vender na MAELLE');pg.wait_for_selector('.item >> text=Brincos');pg.click('.item:has-text("Brincos") .del');W();assert [x['title'] for x in db['listings']]==['Mala <b>x</b>','Aulas']
    club=lambda:(pg.click('#tabs >> text=Club'),pg.click('text=Clube de Livros'))
    club();pg.click('.seg >> text=Indicações');pg.wait_for_selector('h3 >> text=Livro A');pg.click('text=Quero ler >> nth=-1');W();assert db['shelves'][0]['status']=='want'
    pg.click('text=Conversar');pg.wait_for_selector('#rm-t');W();pg.fill('#rm-t','Adorei');pg.press('#rm-t','Enter');pg.wait_for_selector('.m >> text=Adorei')
    club();pg.click('.seg >> text=À venda');pg.click('text=Vender um livro');pg.fill('#bs-t','Usado');pg.fill('#bs-p','5');pg.fill('#bs-ct','eu@x.pt');pg.click('#sheet button[type=submit]');pg.wait_for_selector('.menu >> text=Usado')
    pg.click('.seg >> text=Conversas');pg.click('text=Começar uma conversa');pg.fill('#nr-n','Poesia');pg.fill('#nr-t','Olá a todas');pg.click('#sheet button[type=submit]');pg.wait_for_selector('.m >> text=Olá a todas')
    pg.click('#tabs >> text=Comunidade');pg.click('text=Painel de administração');pg.wait_for_selector('[data-act=admhide]');pg.click('[data-act=admhide]');W();assert db['listings'][0]['status']=='hidden'
    pg.click('[data-act=admshow]');W();assert db['listings'][0]['status']=='active'
    edit();pg.click('text=Shop');pg.click('.seg >> text=Produtos');pg.screenshot(path='/tmp/t/shop.png')
    pg.click('#tabs >> text=Perfil');pg.click('[aria-label="Definições"]');pg.click('text=Terminar sessão');pg.click('text=Explorar sem conta');pg.check('#age-ok');pg.click('#sheet button[type=submit]');edit();pg.click('text=Shop');assert pg.locator('.prod').count()>5
    assert not errs,errs;assert not dialogs;print('LOJA E CLUBE OK',len(calls));b.close()
