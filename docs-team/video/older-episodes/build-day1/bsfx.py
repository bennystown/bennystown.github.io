import numpy as np, wave
SR=44100; DUR=37.5; N=int(SR*DUR); rng=np.random.default_rng(3)
L=np.zeros(N); R=np.zeros(N); T=np.arange(N)/SR
def bp(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=(1/(1+(f/hi)**4))*(1/(1+(lo/np.maximum(f,1))**4)); return np.fft.irfft(X,len(x))
def env(n,a,d): e=np.ones(n); ia=max(1,int(a*SR)); e[:ia]=np.linspace(0,1,ia); e[ia:]=np.exp(-np.arange(n-ia)/max(1,d*SR)); return e
def tone(f,dur,kind='sine',a=.005,d=.15,f2=None):
    n=int(dur*SR); tt=np.arange(n)/SR; fr=np.full(n,f) if f2 is None else f*(f2/f)**(tt/dur); ph=2*np.pi*np.cumsum(fr)/SR
    w={'sine':np.sin(ph),'tri':2/np.pi*np.arcsin(np.sin(ph)),'square':np.sign(np.sin(ph))*.6}[kind]; return w*env(n,a,d)
def add(s,at,v=1,pan=0):
    i=int(at*SR); n=min(len(s),N-i)
    if n>0: L[i:i+n]+=s[:n]*v*np.sqrt((1-pan)/2)*1.414; R[i:i+n]+=s[:n]*v*np.sqrt((1+pan)/2)*1.414
T_HOOK,STEP,BUILD,T_DONE,T_BOARD=3.0,.62,.5,23.96,29.9; NH=34; T_VOTE=33.2
# music: chords + plucks
C=[(261.63,329.63,392),(220,261.63,329.63),(174.61,220,261.63),(196,246.94,293.66)]
t0=0;k=0
while t0<DUR:
    n=int(2.2*SR); tt=np.arange(n)/SR; w=sum(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*f/2*tt) for f in C[k%4])
    add(w*np.minimum(1,tt/.3)*np.minimum(1,(2.2-tt)/.3)*.03,t0); t0+=2.0;k+=1
arp=[523.25,659.25,783.99,659.25,587.33,783.99,987.77,783.99]; at=.2;k=0
while at<DUR-.3:
    add(tone(arp[k%8],.25,'tri',.003,.1),at,.05,-.3 if k%2 else .3)
    if k%4==0: add(tone(arp[k%8]/4,.4,'sine',.005,.2),at,.12)
    at+=.2;k+=1
# kick on beats
at=0
while at<DUR: add(tone(120,.18,'sine',.002,.06,45),at,.25); at+=.4
def thump(): a=tone(110,.25,'sine',.002,.09,55); m=int(.08*SR); a[:m]+=bp(rng.standard_normal(m),200,2000)*np.exp(-np.arange(m)/600)*.4; return a
add(thump(),.15,.6); add(thump(),T_DONE+.25,.6); add(thump(),T_VOTE+.25,.6); add(thump(),T_VOTE+1.0,.5)
for k in range(3): add(tone(320,.14,'tri',.002,.06,900),T_VOTE+.45+k*.14,.3)
for k in range(NH):
    s=T_HOOK+k*STEP
    h=tone(170,.05,'square',.001,.015)*.7; add(h+bp(rng.standard_normal(len(h)),1000,6000)*np.exp(-np.arange(len(h))/300)*.4,s+.12,.25,-.3)
    add(tone(330,.12,'tri',.002,.05,880),s+BUILD,.3,.1)
    f=880*2**(min(k,24)/24); add(np.concatenate([tone(f,.06,'square',.002,.04),tone(f*1.5,.16,'square',.002,.07)])*.5,s+BUILD+.55,.18,.4)
n=int(.4*SR); w=bp(rng.standard_normal(n),300,3000)*np.sin(np.linspace(0,np.pi,n))**2*.5; add(w,T_BOARD-.2,.35)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.5,'tri',.003,.25),T_BOARD+k*.08,.12)
m=np.stack([L,R],1); m/=np.abs(m).max()/.85
with wave.open('/tmp/build2/sfx.wav','wb') as wv: wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((m*32767).astype('<i2').tobytes())
print('ok')
