"""Conteúdo malicioso vindo do servidor em todos os campos de texto: nada pode ser executado nem virar HTML."""
import re,json,uuid,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8771),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
ME=str(uuid.uuid4());OTHER=str(uuid.uuid4());NOW='2026-11-26T07:00:00+00:00';ID=str(uuid.uuid4())
X='\'"><img src=x onerror=window.__xss=1><b class=xss>';BAD='javascript:window.__xss=1';SB='https://bgfnsnxaugvsscdctwse.supabase.co/storage/v1/object/public/media/'
who={'username':X,'avatar_url':SB+X};base={'id':ID,'created_at':NOW,'status':'visible','author_id':OTHER,'author':who}
post=dict(base,kind='recipe',title=X,items=X+'\n'+X,details=X,body=X,image_url=BAD,video_url=SB+X,group_id=None,comments=[dict(base,body=X)],post_likes=[])
rows={
 'posts':[post],'comments':[post],'groups':[{'id':ID,'name':X,'description':X,'topic':X,'rules':X,'status':'active','owner_id':OTHER,'group_members':[{'user_id':ME}]}],
 'questions':[dict(base,body=X,answers=[dict(base,body=X)])],
 'books':[{'id':ID,'title':X,'author':X,'tag':X,'blurb':X,'approved':True}],'shelves':[],
 'listings':[{'id':k+'-1','seller_id':OTHER,'brand_id':None,'kind':k,'title':X,'description':X,'price_cents':100,'category':X,'mode':X,'city':X,'author':X,'condition':X,'contact':X,'link':BAD,'image_url':BAD,'status':'active','seller':who} for k in ('product','service','book')],
 'brands':[{'id':ID,'name':X,'description':X}],'favorites':[{'listing_id':'product-1'},{'listing_id':'service-1'}],'brand_follows':[{'brand_id':ID}],
 'book_rooms':[{'id':ID,'title':X,'book_id':None}],'room_messages':[dict(base,body=X,room_id=ID)],
 'follows':[{'follower_id':OTHER,'followed_id':ME,'follower':who,'followed':who},{'follower_id':ME,'followed_id':OTHER,'follower':who,'followed':who}],
 'messages':[{'id':ID,'sender_id':OTHER,'recipient_id':ME,'body':X,'created_at':NOW,'read_at':None,'sender':who,'recipient':who,'author':who}],'message_settings':[],
 'reports':[{'id':ID,'target_type':t,'target_id':ID,'reason':X,'created_at':NOW,'reporter':who} for t in ('post','comment','group','question','answer','profile','message','listing','dm')],
 'answers':[post],'blocks':[],'invites':[{'code':X,'label':X,'used_at':None,'revoked':False}],'app_config':[{'invite_required':True}]}
def route(r):
    u=U.urlparse(r.request.url);t=u.path.split('/')[-1];q=dict(U.parse_qsl(u.query))
    ok=lambda b:r.fulfill(status=200,content_type='application/json',body=json.dumps(b),headers={'access-control-allow-origin':'*'})
    if u.path.startswith('/storage/'):return r.abort()
    if u.path.startswith('/auth/'):return ok({'access_token':'a','refresh_token':'r','expires_in':3600,'user':{'id':ME,'email':'a@b.pt','user_metadata':{}}})
    if t=='profiles':
        if q.get('id')=='eq.'+ME:return ok([{'username':'Admin','bio':None,'avatar_url':None,'interests':['moda'],'role':'admin'}])
        return ok([{'id':OTHER,'username':X,'bio':X,'avatar_url':BAD,'interests':[X]}])
    if t=='admin_list_banned':return ok([{'id':OTHER,'username':X}])
    return ok(rows.get(t,[]) if r.request.method=='GET' else [])
with sync_playwright() as pw:
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':390,'height':800});errs=[];dialogs=[];pg.set_default_timeout(8000)
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('dialog',lambda d:(dialogs.append(1),d.dismiss()))
    pg.route(re.compile(r'https://(fonts\.|commons\.|openlibrary\.|covers\.openlibrary\.).*'),lambda r:r.abort());pg.route(re.compile(r'https://bgfnsnxaugvsscdctwse\.supabase\.co/.*'),route)
    pg.goto('http://127.0.0.1:8771/?convite=%22%3E%3Cimg%3E');pg.click('text=Começar');assert pg.input_value('#su-invite')=='IMG'
    pg.click('[aria-label="Voltar"]');pg.click('text=Já tenho conta');pg.fill('#li-email','a@b.pt');pg.fill('#li-pw','segredo123');pg.click('button:has-text("Entrar")');pg.wait_for_selector('text=Bem-vinda ao teu universo')
    views=[(v,{}) for v in 'home myplace club bookclub community posts groups qa edit shop brands sell favs recs me settings people inbox admin'.split()]
    views+=[('group',{'id':ID}),('room',{'id':ID}),('user',{'id':OTHER}),('chat',{'id':OTHER}),('post',{'id':ID,'sc':'u-'+OTHER}),('follows',{'id':ME,'t':'followers'}),('follows',{'id':ME,'t':'following'}),('topic',{'k':'receitas'}),('topic',{'k':'decoracao'}),('topic',{'k':'viagens'}),('topic',{'k':'beleza'}),('beauty',{}),('topic',{'k':'moda'}),('topic',{'k':'criatividade'}),('topic',{'k':'organizacao'}),('topic',{'k':'livros'})]
    seen=0
    def check(where):
        global seen
        bad=pg.evaluate('()=>({x:window.__xss||0,n:document.querySelectorAll(".xss,img[onerror],[href^=\'javascript:\'],[src^=\'javascript:\']").length,t:document.getElementById("app").textContent.includes("<b class=xss>")})')
        assert not bad['x'] and not bad['n'],(where,bad);seen+=bad['t']
    for v,p in views:
        pg.evaluate('([v,p])=>{C.at={};stack=[{v:"home",p:{}},{v:v,p:p}];render()}',[v,p]);pg.wait_for_timeout(500);pg.evaluate('render(true)');pg.wait_for_timeout(150);check((v,p))
    # folhas com detalhes de anúncios e variações da loja e do clube
    for t in ('sale','chat'):
        pg.evaluate("t=>{BK=t;stack=[{v:'bookclub',p:{}}];render()}",t);pg.wait_for_timeout(300);check(t)
    pg.evaluate("()=>{SF.t='svc';stack=[{v:'shop',p:{}}];render()}");pg.wait_for_timeout(300);check('svc')
    for s,i in (('product','product-1'),('service','service-1'),('sale','book-1')):
        pg.evaluate("([s,i])=>{if(SHEETS[s])SHEETS[s]({id:i})}",[s,i]);pg.wait_for_timeout(200);check('folha '+s);pg.evaluate('closeSheet()')
    assert seen>=10,seen;assert not dialogs;assert not errs,errs;print('SEGURANÇA OK',len(views),'ecrãs');b.close()
