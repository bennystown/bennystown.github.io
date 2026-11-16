import json,subprocess,numpy as np
SR=44100
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','raw.mp3','-ac','1','-ar',str(SR),'-f','f32le','raw.f32'],check=True)
x=np.fromfile('raw.f32',np.float32)
# (raw start, raw end, target start)
SEG=[(0.18,10.72,0.30),(10.84,12.70,11.40),(13.62,18.0,13.70),(18.0,20.62,18.90),(20.62,25.22,23.10),(25.40,29.15,29.40),(29.18,33.95,35.20)]
DUR=44.6
y=np.zeros(int(DUR*SR),np.float32); F=int(.015*SR)
mp=[]
for a,b,t in SEG:
    p=x[int(a*SR):int(b*SR)].copy(); p[:F]*=np.linspace(0,1,F); p[-F:]*=np.linspace(1,0,F)
    i=int(t*SR); y[i:i+len(p)]+=p[:len(y)-i]; mp.append((a,b,t))
y.tofile('voice.f32')
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','voice.f32','voice.wav'],check=True)
W=json.load(open('words_raw.json'))
def m(tt):
    for a,b,t in mp:
        if a-.05<=tt<=b+.05: return t+(tt-a)
    return None
words=[[w,round(m(s),3),round(m(e),3)] for w,s,e in W if m(s) is not None]
json.dump(words,open('words.json','w'))
print(len(words),len(W)); print([(w[0],w[1]) for w in words][::6])
