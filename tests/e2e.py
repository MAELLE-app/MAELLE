import json,re,time,uuid,sys,urllib.parse as U,threading,functools,http.server
from playwright.sync_api import sync_playwright
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=__import__('pathlib').Path(__file__).resolve().parent.parent.joinpath('docs').as_posix())
H.func.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8765),H);threading.Thread(target=srv.serve_forever,daemon=True).start()
UID=str(uuid.uuid4());db={k:{} for k in ['tasks','events','goals','habits','wishlist','journal','habit_logs']};prof={'username':'Ana_x','bio':None,'avatar_url':None,'interests':[],'role':'user'};calls=[];down=[False]
def route(r):
    q=r.request;u=U.urlparse(q.url);p=u.path;m=q.method;calls.append((m,p));qs=dict(U.parse_qsl(u.query))
    def ok(b=None,s=200):r.fulfill(status=s,content_type='application/json',body='' if b is None else json.dumps(b),headers={'access-control-allow-origin':'*'})
    if down[0]:return r.abort()
    if p.startswith('/auth/v1/token') or p=='/auth/v1/signup':
        return ok({'access_token':'a','refresh_token':'r','expires_in':3600,'user':{'id':UID,'email':'a@b.pt','user_metadata':{'name':'Ana'}}})
    if p.startswith('/auth/'):return ok({})
    if p.startswith('/storage/'):return ok({})
    t=p.split('/')[-1]
    if t=='profiles':
        if m=='PATCH':prof.update(q.post_data_json);return ok(None,204)
        return ok([prof])
    if t=='delete_my_account':return ok(None,204)
    d=db[t]
    if m=='GET':return ok(list(d.values()))
    if m=='POST':
        for x in q.post_data_json:d[(x['habit_id'],x['day']) if t=='habit_logs' else x['id']]=x
        return ok(None,201)
    if m=='DELETE':
        if t=='habit_logs':d.pop((qs['habit_id'][3:],qs['day'][3:]),None)
        else:
            for i in qs['id'][4:-1].split(','):d.pop(i,None)
        return ok(None,204)
with sync_playwright() as pw:
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':390,'height':800});errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
    pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    pg.goto('http://127.0.0.1:8765/');pg.wait_for_selector('text=Começar',timeout=8000)
    pg.click('text=Começar');pg.fill('#su-name','Ana');pg.fill('#su-email','a@b.pt');pg.fill('#su-pw','segredo123');pg.fill('#su-dob','1998-05-02');pg.check('#su-agree');pg.click('text=Criar conta >> nth=-1')
    pg.wait_for_selector('#pf-user');pg.fill('#pf-bio','Olá');pg.click('text=Guardar perfil')
    pg.click('button.pill >> nth=0');pg.click('text=Continuar');pg.wait_for_timeout(1000)
    assert prof['bio']=='Olá' and len(prof['interests'])==1,(prof,calls,errs,pg.evaluate('[S.interests,S.snap.interests,S.onboarded,cur().v,pending()]'))
    pg.click('#tabs >> text=My Place');pg.click('text=Minha lista de tarefas');pg.fill('#tk-t','Comprar flores');pg.keyboard.press('Enter');pg.wait_for_timeout(1000)
    assert [x['title'] for x in db['tasks'].values()]==['Comprar flores']
    pg.click('.chk');pg.wait_for_timeout(1000);assert list(db['tasks'].values())[0]['done']
    pg.click('#tabs >> text=My Place');pg.click('text=Os meus hábitos');pg.click('text=Novo hábito');pg.fill('#hb-t','Alongar');pg.click('text=Guardar hábito');pg.click('.wk button >> nth=-1');pg.wait_for_timeout(1000)
    assert len(db['habits'])==1 and len(db['habit_logs'])==1
    pg.click('.wk button >> nth=-1');pg.wait_for_timeout(1000);assert len(db['habit_logs'])==0
    pg.click('.wk button >> nth=-1')
    pg.click('#tabs >> text=My Place');pg.click('text=Minha lista de desejos');pg.fill('#ws-t','Mala');pg.fill('#ws-p','19,90');pg.keyboard.press('Enter');pg.wait_for_timeout(1000)
    assert list(db['wishlist'].values())[0]['price_cents']==1990
    pg.click('#tabs >> text=My Place');pg.click('text=A minha agenda');pg.click('text=Evento');pg.fill('#ev-t','Café');pg.click('text=Guardar evento')
    pg.click('#tabs >> text=My Place');pg.click('text=Os meus objetivos');pg.click('text=Novo objetivo');pg.fill('#go-t','Ler');pg.click('text=Guardar objetivo');pg.wait_for_timeout(1000)
    assert len(db['events'])==1 and len(db['goals'])==1
    # offline e recuperação
    down[0]=True;pg.click('#tabs >> text=My Place');pg.click('text=Minha lista de tarefas');pg.click('text=Por fazer');pg.fill('#tk-t','Sem rede');pg.keyboard.press('Enter');pg.wait_for_timeout(1000);assert len(db['tasks'])==1
    down[0]=False;pg.reload();pg.wait_for_timeout(3000);;assert len(db['tasks'])==2,db['tasks']
    # sair e voltar a entrar: dados vêm do servidor
    pg.click('#tabs >> text=Início');pg.click('[aria-label="O meu perfil"]');pg.click('text=Terminar sessão');pg.wait_for_selector('text=Já tenho conta')
    assert 'Comprar flores' not in pg.evaluate('localStorage.getItem("maelle-v3")')
    pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    pg.click('#tabs >> text=My Place');pg.click('text=Minha lista de tarefas');pg.wait_for_selector('text=Sem rede')
    pg.click('.item .del');pg.wait_for_timeout(1000);assert len(db['tasks'])==1
    pg.screenshot(path='tasks.png')
    pg.click('#tabs >> text=Início');pg.click('[aria-label="O meu perfil"]');pg.click('text=Apagar a minha conta');pg.click('#sheet button[type=submit]');pg.wait_for_selector('text=Já tenho conta')
    assert ('POST','/rest/v1/rpc/delete_my_account') in calls
    assert not errs,errs;print('TUDO OK',len(calls))
    b.close()
