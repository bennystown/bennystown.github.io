import json,subprocess,numpy as np
SR=44100; LEAD=.3
PADS=[(4.30,1.2),(7.95,.5),(15.05,1.6),(19.05,4.5),(22.82,.8),(28.02,2.6),(34.6,2.4),(42.55,.2)]
TAIL=2.8
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','raw.mp3','-ac','1','-ar',str(SR),'-f','f32le','raw.f32'],check=True)
x=np.fromfile('raw.f32',np.float32)
parts=[np.zeros(int(LEAD*SR),np.float32)];prev=0
for c,p in PADS:
    parts.append(x[int(prev*SR):int(c*SR)]); parts.append(np.zeros(int(p*SR),np.float32)); prev=c
parts.append(x[int(prev*SR):]); parts.append(np.zeros(int(TAIL*SR),np.float32))
y=np.concatenate(parts); y.tofile('voice.f32')
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','voice.f32','voice.wav'],check=True)
m=lambda t: LEAD+t+sum(p for c,p in PADS if c<t)
W=json.load(open('words_raw.json')); words=[[w,round(m(s),3),round(m(e),3)] for w,s,e in W]
json.dump(words,open('words.json','w'),ensure_ascii=False)
DUR=round(len(y)/SR,2); print('dur',DUR); open('dur.txt','w').write(str(DUR))
for w in words: print(w)
