import re,subprocess,json,numpy as np
SR=44100; TEMPO=1.04; LEAD=0.3
out=subprocess.run(['ffmpeg','-i','raw.mp3','-af','silencedetect=noise=-38dB:d=0.22','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
KEEP={3.40:.35,12.94:.3,14.12:.35,15.34:.25,23.84:.25}
PAD={}
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','raw.mp3','-ac','1','-ar',str(SR),'-f','f32le','raw.f32'],check=True)
x=np.fromfile('raw.f32',np.float32)
segs=[];cur=0.0;pads=[]
for s,e in zip(st,en):
    keep=next((v for k,v in KEEP.items() if abs(s-k)<.1),.16)
    pad=next((v for k,v in PAD.items() if abs(s-k)<.1),0)
    a=s+0.04; b=e-(keep-0.04)
    if b>a: segs.append((cur,a,pad)); cur=b
    elif pad: segs.append((cur,s+.04,pad)); cur=s+.04
segs.append((cur,len(x)/SR,0))
parts=[];F=int(.012*SR);mp=[];acc=0.0
for a,b,pad in segs:
    p=x[int(a*SR):int(b*SR)].copy()
    if len(p)>2*F: p[:F]*=np.linspace(0,1,F); p[-F:]*=np.linspace(1,0,F)
    parts.append(p); mp.append((a,b,acc)); acc+=b-a
    if pad: parts.append(np.zeros(int(pad*SR),np.float32)); acc+=pad
y=np.concatenate(parts); y.tofile('cut.f32')
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','1','-i','cut.f32','-af',f'atempo={TEMPO},adelay={int(LEAD*1000)}','-ar',str(SR),'voice.wav'],check=True)
def m(t):
    for a,b,o in mp:
        if t<a: return o
        if t<=b: return o+(t-a)
    return mp[-1][2]+(mp[-1][1]-mp[-1][0])
W=json.load(open('words_raw.json'))
words=[[w,round(LEAD+m(s)/TEMPO,3),round(LEAD+m(e)/TEMPO,3)] for w,s,e in W]
json.dump(words,open('words.json','w'),ensure_ascii=False)
print('dur',round(len(y)/SR/TEMPO+LEAD,2))
for i,w in enumerate(words):
    if i==0 or W[i][1]-W[i-1][2]>0.3: print(round(w[1],2), ' '.join(z[0] for z in words[i:i+5]))
