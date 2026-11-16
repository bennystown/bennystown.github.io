import re,subprocess,json,numpy as np
out=subprocess.run(['ffmpeg','-i','raw.mp3','-af','silencedetect=noise=-38dB:d=0.22','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
sil=list(zip(st,en))
KEEP={}   # bite pause, pigeon reveal pause
segs=[];cur=0.0
for s,e in sil:
    keep=0.16
    for k,v in KEEP.items():
        if abs(s-k)<.1: keep=v
    a=s+0.04; b=e-(keep-0.04)
    if b>a: segs.append((cur,a)); cur=b
segs.append((cur,52.77))
tot=sum(b-a for a,b in segs); print('kept',round(tot,2))
json.dump(segs,open('segs.json','w'))
