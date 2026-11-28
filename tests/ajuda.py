"""Testes do assistente de ajuda da loja."""
import re,threading,functools,http.server,pathlib
from playwright.sync_api import sync_playwright
D=pathlib.Path(__file__).resolve().parent.parent/'docs'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8774),functools.partial(Q,directory=str(D)));threading.Thread(target=srv.serve_forever,daemon=True).start()
CASOS={'burla':['acho que fui enganada','I think this is a scam'],'envio':['a minha encomenda ainda não chegou','where is my order?','ma commande','mi pedido no llega','dov’è il mio pacco'],
 'devolver':['quero devolver e ter reembolso','can I get a refund'],'pagar':['é seguro pagar por mbway?'],'comprar':['como posso comprar isto?'],'servico':['quero marcar um serviço'],
 'vender':['como faço para vender as minhas velas'],'proibido':['é proibido anunciar medicamentos?'],None:['qual é o tempo amanhã','olá']}
with sync_playwright() as pw:
    b=pw.chromium.launch();pg=b.new_page(viewport={'width':390,'height':800});errs=[];net=[];pg.set_default_timeout(6000);pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route(re.compile(r'https://.*'),lambda r:(net.append(r.request.url),r.abort()))
    pg.goto('http://127.0.0.1:8774/');pg.click('text=Explorar sem conta');pg.check('#age-ok');pg.click('#sheet button[type=submit]')
    pg.click('#tabs >> text=The Edit');pg.click('text=Ajuda da loja');pg.wait_for_selector('text=Em que posso ajudar')
    for k,l in CASOS.items():
        for t in l:
            r=pg.evaluate('t=>{const f=helpAnswer(t);return f?f.id:null}',t);assert r==k,(t,r,k)
    del net[:]
    pg.fill('#hp-t','Onde está a minha encomenda?');pg.press('#hp-t','Enter');pg.wait_for_selector('text=ainda não faz envios')
    pg.click('.chip >> text=Posso devolver uma compra?');pg.wait_for_selector('text=14 dias')
    pg.fill('#hp-t','<img src=x onerror=alert(1)>');pg.press('#hp-t','Enter');pg.wait_for_selector('text=Ainda não sei responder');assert pg.locator('#hlist img').count()==0
    assert pg.locator('#hlist .me').count()==3 and not [u for u in net if 'supabase' in u],net
    assert pg.evaluate('document.getElementById("view").scrollWidth<=390');pg.screenshot(path='/tmp/t/ajuda.png')
    pg.click('#tabs >> text=The Edit');pg.click('.menu >> text=Shop');pg.click('text=Precisas de ajuda?');pg.wait_for_selector('#hlist')
    assert not errs,errs;print('AJUDA OK');b.close()
