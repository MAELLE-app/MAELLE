"""Gera as ilustrações originais da MAELLE (docs/img/*.svg). Correr: python3 tools/ilustracoes.py"""
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','docs','img')
IV,CH,TA,ES,RO,WH='#F5F0E9','#D8C5AD','#A99A8B','#40372F','#D9BFC0','#FFFFFF'
def R(x,y,w,h,f,r=0,e=''): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" {e}/>'
def C(x,y,r,f,e=''): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{f}" {e}/>'
def E(x,y,a,b,f,e=''): return f'<ellipse cx="{x}" cy="{y}" rx="{a}" ry="{b}" fill="{f}" {e}/>'
def P(d,f='none',e=''): return f'<path d="{d}" fill="{f}" {e}/>'
def L(d,c,w=3): return f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def G(s,t): return f'<g transform="{t}">{s}</g>'
def shadow(x,y,a): return E(x,y,a,a*.11,ES,'opacity=".16"')
def leaf(x,y,ang,s,f): return G(P('M0 0C12 -14 14 -34 0 -52C-14 -34 -12 -14 0 0Z',f),f'translate({x} {y}) rotate({ang}) scale({s})')
def branch(x,y,f,n=5,s=.8):
    o=L(f'M{x} {y}q-8 -70 14 -130',f,2.5)
    for i in range(n):
        yy=y-28-i*22; xx=x-4+i*i*.6
        o+=leaf(xx,yy,-55,s-i*.06,f)+leaf(xx+1,yy-10,52,s-i*.06,f)
    return o+leaf(x+14,y-128,15,s*.7,f)
def scene(a,b,body,floor=CH):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" preserveAspectRatio="xMidYMid slice">'
      f'<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>'
      +R(0,0,400,500,'url(#g)')+P('M70 360V200a130 130 0 0 1 260 0v160Z',IV,'opacity=".55"')+R(0,355,400,145,floor)+R(0,355,400,3,WH,0,'opacity=".5"')+body+'</svg>')
S={}
# moda: charriot com vestido e blazer, mala
S['moda']=scene('#EBE1D3',CH,
  L('M95 150H305M105 150V372M295 150V372M88 372h34M278 372h34',ES,4)
 +L('M165 150v-12q0-10 10-6',ES,2.5)+L('M135 178l30-22 30 22',ES,2.5)
 +P('M143 176q22 14 44 0l-8 44 34 122q-48 16-96 0l34-122Z',RO)+L('M151 220q14 7 28 0',ES,2)
 +L('M238 150v-12q0-10 10-6',ES,2.5)+L('M206 180l32-24 32 24',ES,2.5)
 +P('M214 176l18-8 6 20 6-20 18 8 16 108-20 4-6-50v66h-48v-66l-6 50-20-4Z',IV)+L('M232 170l6 66 6-66M238 244v50',TA,2)+C(246,252,3,ES)+C(246,274,3,ES)
 +shadow(305,402,52)+L('M282 352q23-48 46 0',ES,4)+R(265,348,80,54,ES,14)+C(305,366,5,CH))
# beleza: frascos, sérum, flor
S['beleza']=scene('#F3E8E4',RO,
  shadow(200,382,150)+branch(104,376,TA)
 +R(150,225,66,155,WH,22)+R(166,198,34,32,CH,6)+R(172,178,22,24,ES,8)+R(162,270,42,62,IV,6)+L('M170 290h26M174 302h18',TA,2)
 +R(226,290,78,90,ES,20)+R(232,272,66,24,CH,8)+C(265,335,15,CH)
 +R(98,330,60,50,IV,18)+R(102,316,52,18,TA,7)
 +''.join(G(E(0,-17,10,18,WH),f'translate(322 388) rotate({i*60})') for i in range(6))+C(322,388,8,CH),'#E7D3CF')
# decoracao: jarra, candeeiro, livros
S['decoracao']=scene('#EDE7DB','#CDBFA6',
  L('M278 0v128',ES,2)+P('M232 178a46 52 0 0 1 92 0Z',ES)+E(278,180,34,6,'#F6E3C0')
 +shadow(150,386,70)+branch(143,230,TA,5,1)+P('M130 222h30v28q42 18 42 72q0 40-28 60h-58q-28-20-28-60q0-54 42-72Z',IV)+L('M100 330q45 18 90 0',CH,4)
 +shadow(265,386,70)+R(212,362,112,20,ES,5)+R(222,342,100,20,RO,5)+R(216,322,94,20,WH,5)+C(262,300,22,TA)+E(255,293,7,5,WH,'opacity=".5"'),'#BFAD93')
# viagens: mala, chapéu, sol
S['viagens']=scene('#E9E2D5','#C9BBA3',
  C(200,175,56,'#F1DDC4')+P('M70 285q70-45 135-8t125-20v100H70Z',TA,'opacity=".55"')
 +shadow(180,402,95)+L('M152 245v-30q0-10 10-10h36q10 0 10 10v30',ES,6)+R(110,242,140,152,IV,24)+''.join(R(x,258,8,120,CH,4) for x in (138,176,214))+C(135,398,7,ES)+C(225,398,7,ES)
 +shadow(292,412,66)+E(292,398,70,20,'#C7A98A')+P('M255 398q0-54 37-54t37 54q-37 16-74 0Z','#D9BE9F')+P('M257 381q35 13 70 0l2 12q-37 16-74 0Z',ES),'#BCA88C')
# receitas: taça, citrinos, jarro
def lemon(x,y,r): return C(x,y,r,'#E3C275')+C(x,y,r*.78,'#F7E8BE')+''.join(L(f'M{x} {y}l{r*.7*a:.1f} {r*.7*b:.1f}','#E3C275',2) for a,b in ((1,0),(.5,.87),(-.5,.87),(-1,0),(-.5,-.87),(.5,-.87)))
S['receitas']=scene('#F2E8D6','#D7BF98',
  shadow(268,360,55)+P('M238 195h55l-6 30q30 30 30 75q0 60-50 60t-52-60q0-45 30-75Z',IV)+L('M312 270q40 5 6 55',IV,10)
 +shadow(170,412,105)+E(170,330,100,22,WH)+C(135,318,26,'#C9785A')+C(178,308,30,'#B96449')+C(215,320,24,'#C9785A')+leaf(178,284,40,.55,'#7F8B62')+leaf(176,284,-45,.45,'#7F8B62')
 +P('M70 330q8 80 100 80t100-80q-100 40-200 0Z',ES)+lemon(305,398,30)+leaf(70,420,60,.9,'#7F8B62'),'#C9AE85')
# criatividade: aguarelas e pincéis
S['criatividade']=scene('#F1E6E2','#D3B5AB',
  G(R(0,0,170,200,WH,6)+C(65,75,40,RO,'opacity=".85"')+C(105,100,36,CH,'opacity=".8"')+C(75,125,30,TA,'opacity=".65"')+L('M28 170q50-25 112-6',ES,2),'translate(92 150) rotate(-7)')
 +shadow(300,370,45)+L('M285 260l-18-100M300 258l8-112M315 262l36-92',ES,5)+P('M267 160q-12-20-6-34q16 12 6 34Z',ES)+P('M308 146q-9-22 3-34q11 16-3 34Z','#B58F91')+P('M351 170q0-24 17-31q3 21-17 31Z',TA)+R(268,250,66,112,IV,16)
 +shadow(190,428,125)+R(80,382,222,44,ES,14)+''.join(C(104+i*35,404,13,c) for i,c in enumerate((RO,'#C9785A','#E3C275','#8E9C7A','#8F93AE',IV))),'#C2A498')
# organizacao: agenda, caneta, chávena
S['organizacao']=scene('#EDE9DF','#C6BCA6',
  shadow(175,414,115)+G(R(0,0,170,220,IV,12)+R(0,0,24,220,ES,8)+R(46,28,90,8,TA,4)+''.join(R(46,62+i*30,14,14,WH,4,f'stroke="{TA}" stroke-width="2"')+R(70,66+i*30,70-i%2*18,6,CH,3) for i in range(5))+L('M49 68l4 4 7-9M49 98l4 4 7-9',ES,2.5),'translate(88 180) rotate(-5)')
 +G(R(0,0,10,160,ES,5)+R(0,28,10,6,CH)+P('M0 156h10l-5 18Z',CH),'translate(284 215) rotate(22)')
 +shadow(305,420,52)+L('M338 372q32 6 0 32',RO,9)+P('M264 358h78v28q0 34-39 34t-39-34Z',RO)+E(303,358,39,9,WH)+E(303,359,31,6,'#7C5642')+L('M292 338q-12-16 2-30M314 338q-12-16 2-30',WH,3),'#B5A890')
# livros: pilha e livro aberto
S['livros']=scene('#EFE5D9','#C8B39C',
  shadow(200,400,130)+''.join(R(x,y,w,30,f,5)+R(x+14,y+8,w-14,14,IV,2) for x,y,w,f in ((110,366,190,ES),(124,336,160,RO),(104,306,176,TA),(130,276,150,CH)))
 +P('M200 262q-42-30-92-10v-58q50-22 92 12Z',WH)+P('M200 262q42-30 92-10v-58q-50-22-92 12Z',IV)+L('M200 206v56',TA,2)+''.join(L(f'M125 {214+i*13}q30-10 58 4M217 {218+i*13}q28-14 58-4',CH,2) for i in range(3))
 +branch(325,305,TA,4,.7)+shadow(327,400,32)+P('M308 304h40l-6 92h-28Z',WH),'#B89F86')
for k,v in S.items():
    open(os.path.join(OUT,k+'.svg'),'w').write(v)
