"""Testes das cinco línguas e das fotografias (sem rede: os pedidos externos são simulados)."""
import re,base64,pathlib,threading,functools,http.server,urllib.parse as U
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8769),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
VIEWS='home saved boards myplace agenda tasks goals habits wishes beauty finder club challenges creative digital bookclub community posts groups qa edit shop brands sell favs me settings profile interests people follows inbox'.split()
SHEETS='age event goal habit board addprod addsvc newgroup invite'.split()
HELLO={'pt':'Um universo criado para ti','en':'A world','fr':'Un univers créé pour toi','es':'Un universo creado para ti','it':'Un universo creato per te'}
with sync_playwright() as pw:
    b=pw.chromium.launch()
    # com as fotografias a carregar e com elas em falha
    for ok in (True,False):
        pg=b.new_page(viewport={'width':390,'height':800});errs=[];photos=set();pg.set_default_timeout(6000);pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.route(re.compile(r'https://fonts\..*'),lambda r:r.abort())
        def foto(r):
            photos.add(r.request.url)
            if ok:r.fulfill(status=200,content_type='image/png',body=png)
            else:r.abort()
        pg.route(re.compile(r'https://commons\.wikimedia\.org/.*'),foto)
        pg.route(re.compile(r'https://(covers\.)?openlibrary\.org/.*'),lambda r:r.abort())
        pg.goto('http://127.0.0.1:8769/');pg.wait_for_selector('.arches img')
        pg.wait_for_function('ok=>[...document.querySelectorAll(".arches img")].every(e=>e.complete&&e.naturalWidth>0&&e.getAttribute("src").startsWith(ok?"https://commons":"img/"))',arg=ok)
        src=pg.eval_on_selector_all('.arches img','l=>l.map(e=>e.getAttribute("src"))')
        assert all(('commons.wikimedia.org' in s) if ok else s.startswith('img/') for s in src),(ok,src)
        assert pg.locator('.langs button').count()==5
        if ok:
            for l,t in HELLO.items():
                pg.click(f'.langs [data-l="{l}"]');pg.wait_for_function('l=>document.documentElement.lang.startsWith(l)&&document.querySelector(".langs")',arg=l);pg.wait_for_timeout(300)
                if l!='en':assert t.lower() in pg.inner_text('#view').lower(),(l,pg.inner_text('#view'))
                assert pg.evaluate('document.documentElement.scrollWidth<=390')
                if l=='pt':continue
                keys=pg.evaluate('l=>{const c={fr:1,es:2,it:3}[l];const r=MORE_TEXT.trim().split("\\n").map(x=>x.split("¦"));return {n:r.every(x=>x.length===4&&x.every(Boolean)),en:EN_TEXT.trim().split("\\n").map(x=>x.split("=")[0]),more:r.map(x=>x[0]),pairs:r.map(x=>[x[0],x[c||0]])}}',l)
                assert keys['n'] and keys['en']==keys['more']
                # texto que tem tradução diferente não pode ficar em português
                same={k for k,v in keys['pairs'] if l!='en' and k==v};vals={v for k,v in keys['pairs']} if l!='en' else set()
                ptonly={k for k,v in keys['pairs'] if k!=v}-vals
                def check(where):
                    got=pg.evaluate('()=>{const o=[],w=document.createTreeWalker(document.getElementById("app"),NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.parentElement.closest("[data-nt],textarea,script,style,svg"))o.push(n.nodeValue.trim())}return o}')
                    left=ptonly&set(got);assert not left,(l,where,left)
                check('welcome')
                for v in VIEWS:
                    assert pg.evaluate('v=>!!V[v]',v),v
                    pg.evaluate("v=>{stack=[{v:'home',p:{}},{v:v,p:{edit:1}}];render()}",v);pg.wait_for_timeout(60);check(v)
                    assert pg.evaluate('document.documentElement.scrollWidth<=390'),(l,v)
                for k in ('receitas','decoracao','viagens'):
                    pg.evaluate("k=>{stack=[{v:'home',p:{}},{v:'topic',p:{k:k}}];render()}",k);pg.wait_for_timeout(60);check(k)
                    pg.evaluate("k=>{SHEETS.share({k:k})}",k);pg.wait_for_timeout(60);check('share '+k);pg.evaluate('closeSheet()')
                for i in 'r1 r2 r3 r4 d1 d2 d3 d4 v1 v2 v3 v4'.split():
                    pg.evaluate("i=>{stack=[{v:'home',p:{}},{v:'idea',p:{id:i}}];render()}",i);pg.wait_for_timeout(60);check(i)
                    assert pg.evaluate('document.documentElement.scrollWidth<=390'),(l,i)
                pg.evaluate("()=>{FG='m';stack=[{v:'home',p:{}},{v:'finder',p:{}}];render()}");pg.wait_for_timeout(60);check('finder homem');pg.evaluate("FG='w'")
                pg.evaluate("()=>{stack=[{v:'home',p:{}},{v:'topic',p:{k:'moda'}}];render()}");pg.wait_for_timeout(60);check('moda')
                for s in SHEETS:
                    pg.evaluate("s=>{if(SHEETS[s])SHEETS[s]({})}",s);pg.wait_for_timeout(60);check(s);pg.evaluate('closeSheet()')
                got=pg.evaluate("()=>{stack=[{v:'myplace',p:{}}];render();return new Promise(r=>setTimeout(()=>r(document.getElementById('view').innerText),100))}")
                assert 'MY PLACE' in got
                pg.evaluate("()=>{stack=[{v:'home',p:{}}];render()}");pg.wait_for_timeout(200);pg.screenshot(path=f'/tmp/t/home-{l}.png')
                pg.evaluate("()=>{stack=[{v:'welcome',p:{}}];render()}");pg.wait_for_selector('.langs');pg.screenshot(path=f'/tmp/t/welcome-{l}.png')
            assert pg.evaluate('Object.keys(PHOTOS).every(k=>photo(k).startsWith("https://commons.wikimedia.org/wiki/Special:FilePath/")&&!/[\'()]/.test(photo(k)))')
            pg_n=pg.evaluate('Object.keys(PHOTOS).length');r=pg.goto('http://127.0.0.1:8769/creditos.html');assert r.ok and pg.locator('main li a').count()==pg_n
        else:
            for v in ['beauty','finder','myplace','club','community','edit']:
                pg.evaluate("v=>{stack=[{v:v,p:{}}];render()}",v);pg.wait_for_function('document.querySelector(".banner")&&document.querySelector(".banner").getAttribute("src").startsWith("img/")&&document.querySelector(".banner").naturalWidth>0')
        assert not errs,errs;pg.close()
    print('LÍNGUAS E FOTOGRAFIAS OK');b.close()
