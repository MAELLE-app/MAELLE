"""Testes do perfil, das definições e das línguas, com um servidor simulado."""
import json,re,uuid,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8768),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
ME=str(uuid.uuid4());OTHER=str(uuid.uuid4());NOW='2026-11-26T07:00:00+00:00'
db={k:[] for k in 'tasks events goals habits wishlist journal habit_logs posts comments post_likes groups group_members questions answers reports blocks books shelves listings favorites brands brand_follows book_rooms room_messages'.split()}
db['posts'].append({'id':str(uuid.uuid4()),'author_id':OTHER,'group_id':None,'body':'<img src=x onerror=alert(1)> olá','status':'visible','created_at':NOW})
names={ME:'Admin',OTHER:'Bia'};calls=[];files=[]
def A(i):return {'username':names[i]}
def match(x,qs):
    for k,v in qs.items():
        if k in('select','order','limit','on_conflict'):continue
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
    if t=='blocks':x['who']=A(x['blocked_id'])
    return x
def route(r):
    q=r.request;u=U.urlparse(q.url);p=u.path;m=q.method;qs=dict(U.parse_qsl(u.query));t=p.split('/')[-1];calls.append((m,p))
    def ok(b=None,s=200):r.fulfill(status=s,content_type='application/json',body='' if b is None else json.dumps(b),headers={'access-control-allow-origin':'*'})
    if p.startswith('/auth/'):return ok({'access_token':'a','refresh_token':'r','expires_in':3600,'user':{'id':ME,'email':'a@b.pt','user_metadata':{}}})
    if p.startswith('/storage/'):
        files.append((m,p));return ok([{}])
    if t=='profiles' and qs.get('id')=='eq.'+OTHER:return ok([{'id':OTHER,'username':'Bia','bio':'Gosto de ler','avatar_url':None,'interests':['livros']}])
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
    pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort());pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    W=lambda:pg.wait_for_timeout(700)
    tab=lambda:pg.click('#tabs >> text=Comunidade')
    pg.goto('http://127.0.0.1:8768/');pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    import base64
    png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    assert pg.locator('.top button').count()==0
    me=lambda:pg.click('#tabs >> text=Perfil')
    me();pg.wait_for_selector('text=Ainda não publicaste nada.')
    pg.set_input_files('#me-t-img',files=[{'name':'a.png','mimeType':'image/png','buffer':png}]);pg.wait_for_selector('.postprev img')
    pg.fill('#me-t','Do meu perfil');pg.click('button:has-text("Publicar")');pg.wait_for_selector('article >> text=Do meu perfil')
    p=db['posts'][-1];assert p['group_id'] is None and '/media/'+ME+'/post-' in p['image_url'];assert pg.locator('article .postimg').count()==1
    art=pg.locator('article',has_text='Do meu perfil');art.locator('.like').click();W();assert len(db['post_likes'])==1
    art.locator('input').fill('Comentar aqui');art.locator('input').press('Enter');pg.wait_for_selector('.cm >> text=Comentar aqui');W()
    pg.screenshot(path='/tmp/t/me.png')
    art.locator('text=Apagar >> nth=0').click();W();assert len(db['posts'])==1 and ('DELETE','/storage/v1/object/media') in files
    tab();pg.click('text=Publicações');pg.click('.person >> text=Bia');pg.wait_for_selector('text=Gosto de ler');pg.wait_for_selector('article >> text=olá')
    pg.locator('article input').fill('Olá Bia');pg.locator('article input').press('Enter');pg.wait_for_selector('.cm >> text=Olá Bia');W();pg.screenshot(path='/tmp/t/user.png')
    me();pg.click('[aria-label="Definições"]');pg.wait_for_selector('text=Painel de administração');pg.screenshot(path='/tmp/t/set.png',full_page=True)
    assert pg.locator('a[href="termos.html"]').count()==1 and pg.locator('a[href="privacidade.html"]').count()==1
    pg.click('.langs >> text=English');pg.wait_for_selector('text=Welcome to your world',timeout=8000)
    pg.click('#tabs >> text=Profile');pg.click('[aria-label="Settings"]');pg.wait_for_selector('text=Delete my account');pg.screenshot(path='/tmp/t/en.png')
    left=set()
    for v in ['home','myplace','agenda','tasks','goals','habits','wishes','me','settings','profile','interests','community','posts','groups','qa','club','edit','shop','brands','sell','favs','recs','bookclub']:
        pg.evaluate("v=>{stack=[{v:'home',p:{}},{v:v,p:{edit:1}}];render()}",v);W()
        left|=set((v+': '+x) for x in pg.inner_text('#view').split('\n') if re.search(r'[ãõçáéíóúâê]|\b(de|para|os|uma|teu|tua)\b',x))
    print('\n'.join(sorted(left)))
    # um valor de uma lista continua em português na base de dados
    pg.evaluate("SHEETS.addsvc()");assert pg.eval_on_selector('#as-m','e=>[e.value,e.options[0].text]')==['Presencial','In person']
    pg.reload();pg.wait_for_selector('text=Welcome to your world',timeout=8000)
    assert not errs,errs;assert not dialogs;print('PERFIL OK',len(calls));b.close()
