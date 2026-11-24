import asyncio, json, sys
from playwright.async_api import async_playwright
DU = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
JS = r'''(DU)=>{const W=__d.W3, r3=x=>Math.round(x*1000)/1000, P=a=>a.map(p=>[r3(p[0]),r3(p[1])]);
const G1n=W.T1.gates.find(g=>Math.abs(g.a+1.5708)<.4).G, P3R=5.8, GAP=34;
const ring=(C,r)=>{const P=[];for(let k=0;k<120;k++){const a=k/120*6.2832;P.push([C[0]+Math.cos(a)*r,C[1]+Math.sin(a)*r]);}return P;};
const mk=C=>W.makeTown({C,seed:7.3,cap:5000,sdf:(u,v)=>Math.hypot(u-C[0],v-C[1])-P3R,loops:[ring(C,P3R+W.M)],flat0:9,flat1:34,rot:-.32,plazaR:P3R,gateDirs:[{d:[0,1],open:true},{d:[1,0]},{d:[-1,0]},{d:[0,-1]}]});
const t0=performance.now(); let T=mk([G1n[0]+DU,G1n[1]-GAP-118]); const g=T.gates.find(x=>x.open).G; T=mk([T.C[0]+(G1n[0]+DU-g[0]),T.C[1]+(G1n[1]-GAP-g[1])]);
const pack=T=>({C:T.C,R:T.R,seed:T.o.seed,plazaR:T.o.plazaR||0,sc:T.sc,
 streets:T.streets.map(s=>({p:P(s.pts),k:s.kind,id:String(s.id)})), rings:T.rings.map(P), alleys:T.alleys.map(P),
 lots:T.lots.map(l=>l.map(r3)), trees:T.trees.map(t=>[r3(t[0]),r3(t[1]),t[2],r3(t[3])]), lamps:P(T.lamps), beds:T.beds.map(b=>b.map(r3)),
 gates:T.gates.map(g=>({a:g.a,G:g.G,open:g.open,ext:P(g.ext),dir:g.dir}))});
// river clearance: closest wall point to the river
let md=1e9; for(let k=0;k<720;k++){const a=k/720*6.2832,r=T.outerR(a),u=T.C[0]+Math.cos(a)*r,v=T.C[1]+Math.sin(a)*r; for(const p of W.RIVER_FAR){const d=Math.hypot(p[0]-u,p[1]-v); if(d<md)md=d;}}
return JSON.stringify({ms:performance.now()-t0, river:md, G1n, data:pack(T)});}'''
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.route('https://cdnjs.cloudflare.com/**', lambda r: r.fulfill(path='/tmp/world/three.min.js', content_type='application/javascript'))
    await pg.goto('file:///tmp/world/site/index.html#hour=12'); await pg.wait_for_timeout(3000)
    r=json.loads(await pg.evaluate(JS, DU))
    d=r['data']; print('ms',round(r['ms']),'river',round(r['river'],1),'C',d['C'],'R',round(d['R'],1),'lots',len(d['lots']),'gates',[(round(g['a'],2),[round(x,1) for x in g['G']],g['open']) for g in d['gates']])
    s=json.dumps(d,separators=(',',':')); open('/tmp/world/pub/world-d3.js','w').write('window.W3PRE_D3='+s+';'); print('bytes',len(s))
    await b.close()
asyncio.run(main())
