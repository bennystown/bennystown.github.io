import json,subprocess,numpy as np
SR=44100; TEMPO=1.06; LEAD=0.3
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','raw.mp3','-ac','1','-ar',str(SR),'-f','f32le','raw.f32'],check=True)
x=np.fromfile('raw.f32',np.float32); segs=json.load(open('segs.json'))
parts=[];F=int(.012*SR)
for a,b in segs:
    p=x[int(a*SR):int(b*SR)].copy()
    if len(p)>2*F: p[:F]*=np.linspace(0,1,F); p[-F:]*=np.linspace(1,0,F)
    parts.append(p)
y=np.concatenate(parts); y.astype(np.float32).tofile('cut.f32')
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','cut.f32','-af',f'atempo={TEMPO},adelay={int(LEAD*1000)}','-ar',str(SR),'voice.wav'],check=True)
def mp(t):
    acc=0
    for a,b in segs:
        if t<a: return acc
        if t<=b: return acc+(t-a)
        acc+=b-a
    return acc
W=json.load(open('words_raw.json'))
words=[[w,round(LEAD+mp(s)/TEMPO,3),round(LEAD+mp(e)/TEMPO,3)] for w,s,e in W]
json.dump(words,open('words.json','w'))
print(len(y)/SR/TEMPO+LEAD, words[-1])
# print line starts
for i,w in enumerate(words):
    if i==0 or W[i][1]-W[i-1][2]>0.35: print(round(w[1],2), w[0])
