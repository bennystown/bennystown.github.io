import json,numpy as np,subprocess
w=json.load(open('words.json'))
# caption groups: break on sentence punctuation, gap>0.3, or 4 words
groups=[];cur=[]
for i,(t,s,e) in enumerate(w):
    cur.append([t.replace('...',''),s,e] if not t.startswith('...') else [t.lstrip('.'),s,e])
    end = t.endswith(('.','!','?','?!')) and not (t in ('Okay.',) ) or (t.endswith(',') and len(cur)>=3) or len(cur)>=4 or (i+1<len(w) and w[i+1][1]-e>0.3)
    if end: groups.append(cur);cur=[]
if cur: groups.append(cur)
caps=[]
for k,g in enumerate(groups):
    nxt=groups[k+1][0][1] if k+1<len(groups) else g[-1][2]+.6
    caps.append({'s':g[0][1],'e':g[-1][2],'w':g,'hide':min(nxt-.02,g[-1][2]+.7)})
for c in caps:
    for x in c['w']: x[0]=x[0].rstrip(',') if False else x[0]
json.dump(caps,open('caps.json','w'))
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','voice.wav','-ac','1','-ar','44100','-f','f32le','voice.f32'],check=True)
x=np.fromfile('voice.f32',np.float32); hop=44100//30; n=int(50.66*30)
r=np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) if i*hop<len(x) else 0 for i in range(n)])
r=r/np.percentile(r[r>0],95); r=np.clip((r-.08)/.92,0,1)
json.dump([round(float(v),3) for v in r],open('mouth.json','w'))
print(len(caps),[ ' '.join(z[0] for z in c['w']) for c in caps][:40])
