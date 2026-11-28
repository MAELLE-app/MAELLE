"""Testes das receitas e ideias de casa (página completa e partilha), com um servidor simulado."""
import json,re,uuid,base64,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8772),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
ME=str(uuid.uuid4());OTHER=str(uuid.uuid4());NOW='2026-11-26T07:00:00+00:00'
db={k:[] for k in 'tasks events goals habits wishlist journal habit_logs posts comments post_likes groups group_members questions answers reports blocks books shelves listings favorites brands brand_follows book_rooms room_messages invites app_config follows messages message_settings'.split()}
db['posts'].append({'id':str(uuid.uuid4()),'author_id':OTHER,'group_id':None,'body':'<img src=x onerror=alert(1)> olá','status':'visible','created_at':NOW})
names={ME:'Admin',OTHER:'Bia'};calls=[];uploads=[]
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
    if p.startswith('/storage/'):
        if m=='GET':return r.fulfill(status=200,content_type='image/svg+xml',body=(D/'img'/'receitas.svg').read_bytes())
        uploads.append((m,p));return ok({})
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
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':390,'height':800});errs=[];pg.set_default_timeout(6000);pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort());pg.route(re.compile(r'https://(commons\.wikimedia|openlibrary|covers\.openlibrary)\.org/.*'),lambda r:r.abort());pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    W=lambda:pg.wait_for_timeout(700);n=0
    def ok(c,m=''):
        global n;assert c,m;n+=1
    def go(k):pg.evaluate("k=>{stack=[{v:'home',p:{}},{v:'topic',p:{k:k}}];render()}",k)
    def noscroll():ok(pg.evaluate('document.documentElement.scrollWidth<=390 && document.getElementById("view").scrollWidth<=390'),'largura')
    pg.goto('http://127.0.0.1:8772/');pg.click('text=Explorar sem conta');pg.check('#age-ok');pg.click('#sheet button[type=submit]')
    # sem conta: vê as páginas completas, mas partilhar pede sessão
    go('receitas');pg.wait_for_selector('text=Entra na tua conta para veres e partilhares');ok(pg.locator('[data-s=share]').count()==0)
    for i in ('r1','r2','r3','r4','d1','d2','d3','d4'):
        go('receitas' if i[0]=='r' else 'decoracao');pg.click(f'article button.link[data-id="{i}"]');pg.wait_for_selector('.hero img')
        ok(pg.locator('.steps li').count()>=3 and pg.locator('.ings li').count()>=3,i);ok(pg.locator('.inspo button').count()==(3 if i[0]=='d' else 0),i);noscroll()
        if i in('r2','d1'):pg.screenshot(path=f'/tmp/t/pag-{i}.png',full_page=True)
    pg.click('.inspo button >> nth=0');pg.wait_for_selector('#sheet .hero img');pg.click('#sheet >> text=Fechar')
    pg.click('[aria-label="Guardar ideia"]');ok(pg.evaluate("S.saved.includes('d4')"))
    go('decoracao');pg.click('article .open >> nth=0');pg.wait_for_selector('.steps')
    pg.goto('http://127.0.0.1:8772/');pg.evaluate("()=>{localStorage.clear()}");pg.reload()
    pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    go('receitas');pg.wait_for_selector('text=Ainda não há receitas partilhadas')
    pg.click('[data-s=share]');send=lambda:pg.click('#sheet button[type=submit]')
    send();pg.wait_for_selector('text=Adiciona uma fotografia.')
    jpg=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    pg.set_input_files('#pimgin',files=[{'name':'a.png','mimeType':'image/png','buffer':jpg}]);pg.wait_for_selector('#pimgprev img')
    send();pg.wait_for_selector('text=Escreve um nome');pg.fill('#sh-t','Tarte da Bia')
    send();pg.wait_for_selector('text=Escreve os ingredientes.');pg.fill('#sh-i','3 ovos\n\n200 g de açúcar')
    send();pg.wait_for_selector('text=Explica os passos.');pg.fill('#sh-s','Bater tudo\nLevar ao forno');ok(len(db['posts'])==1)
    pg.screenshot(path='/tmp/t/partilhar.png');send();pg.wait_for_selector('.scard >> text=Tarte da Bia')
    x=db['posts'][-1];ok(x['kind']=='recipe' and x.get('group_id') is None and x['author_id']==ME and '/media/'+ME+'/' in x['image_url'],x);ok(uploads)
    ok(pg.locator('#sheet .sheet').count()==0);noscroll()
    pg.locator('.sgrid').scroll_into_view_if_needed();pg.screenshot(path='/tmp/t/comunidade-receitas.png')
    pg.click('.scard');pg.wait_for_selector('article .ings');ok(pg.locator('article .ings li').count()==2 and pg.locator('article .steps li').count()==2)
    pg.locator('article .like').click();W();ok(len(db['post_likes'])==1)
    pg.fill('article .cmform input','Vou fazer');pg.press('article .cmform input','Enter');pg.wait_for_selector('.cm >> text=Vou fazer');ok(pg.locator('article .steps li').first.is_visible())
    pg.screenshot(path='/tmp/t/receita-partilhada.png',full_page=True);noscroll()
    go('decoracao');pg.wait_for_selector('text=Ainda não há ideias partilhadas');pg.click('[data-s=share]')
    pg.set_input_files('#pimgin',files=[{'name':'a.png','mimeType':'image/png','buffer':jpg}]);pg.wait_for_selector('#pimgprev img')
    pg.fill('#sh-t','Parede de quadros');pg.fill('#sh-s','Medir e pendurar');send();pg.wait_for_selector('.scard >> text=Parede de quadros')
    ok(db['posts'][-1]['kind']=='home' and db['posts'][-1].get('items') is None);ok(pg.locator('.scard').count()==1)
    go('viagens');pg.wait_for_selector('text=Ainda não há viagens partilhadas');pg.click('[data-s=share]');pg.wait_for_selector('#sheet >> text=casa fica vazia')
    pg.set_input_files('#pimgin',files=[{'name':'a.png','mimeType':'image/png','buffer':jpg}]);pg.wait_for_selector('#pimgprev img')
    pg.fill('#sh-t','Fim de semana no Porto');pg.fill('#sh-s','Ribeira\nSerralves');send();pg.wait_for_selector('.scard >> text=Fim de semana no Porto')
    ok(db['posts'][-1]['kind']=='travel');pg.click('.scard');pg.wait_for_selector('article .steps');ok(pg.locator('article .steps li').count()==2);noscroll()
    for i in ('v1','v2','v3','v4'):
        go('viagens');pg.click(f'article button.link[data-id="{i}"]');pg.wait_for_selector('.hero img');ok(pg.locator('.steps li').count()>=4 and pg.locator('.ings li').count()>=4,i);noscroll()
    go('beleza');pg.wait_for_selector('text=Ainda não há rotinas partilhadas');pg.click('[data-s=share]')
    pg.set_input_files('#pimgin',files=[{'name':'a.png','mimeType':'image/png','buffer':jpg}]);pg.wait_for_selector('#pimgprev img')
    pg.fill('#sh-t','Rotina da Bia');pg.fill('#sh-s','Limpar\nHidratar');send();pg.wait_for_selector('.scard >> text=Rotina da Bia');ok(db['posts'][-1]['kind']=='beauty')
    pg.evaluate("()=>{stack=[{v:'home',p:{}},{v:'beauty',p:{}}];render()}");pg.wait_for_selector('.scard >> text=Rotina da Bia');noscroll()
    pg.click('article button.link[data-id="b3"]');pg.wait_for_selector('.web a');ok(pg.locator('.steps li').count()==5 and pg.locator('.ings li').count()==4);noscroll();pg.screenshot(path='/tmp/t/pag-b3.png',full_page=True)
    for i in ('b1','b2','b4'):
        go('beleza');pg.click(f'article button.link[data-id="{i}"]');pg.wait_for_selector('.hero img');ok(pg.locator('.steps li').count()>=4 and pg.locator('.ings li').count()>=3,i);noscroll()
    for k,kind,prefix in (('moda','fashion','m'),('criatividade','creative','c'),('organizacao','organize','o'),('livros','reading','l')):
        go(k);pg.wait_for_selector('.sec >> text=COMUNIDADE');pg.click('[data-s=share]')
        pg.set_input_files('#pimgin',files=[{'name':'a.png','mimeType':'image/png','buffer':jpg}]);pg.wait_for_selector('#pimgprev img')
        pg.fill('#sh-t','Teste '+k);pg.fill('#sh-s','Um\nDois');send();pg.wait_for_selector(f'.scard >> text=Teste {k}');ok(db['posts'][-1]['kind']==kind,k);noscroll()
        for i in (prefix+n for n in '1234'):
            go(k);pg.click(f'article button.link[data-id="{i}"]');pg.wait_for_selector('.hero img');ok(pg.locator('.steps li').count()>=3 and pg.locator('.ings li').count()>=1,i);noscroll()
    ok(pg.evaluate('Object.keys(IDEAS).every(i=>DETAIL[i])'))
    # no feed aparece com o nome e os passos recolhidos
    pg.click('#tabs >> text=Comunidade');pg.click('text=Publicações');pg.wait_for_selector('article >> text=Parede de quadros');ok(not pg.locator('article .steps').first.is_visible())
    pg.locator('article summary').first.click();ok(pg.locator('article .steps li').first.is_visible());noscroll()
    ok(not errs,errs);print('RECEITAS E CASA OK',n);b.close()
