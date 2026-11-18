import numpy as np, wave
SR = 44100; DUR = 54.45; N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
t_all = np.arange(N) / SR

def lp(x, a):            # one-pole low-pass, a in (0,1): higher = brighter
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y
def lp_fast(x, cutoff):
    # FFT brick-ish low-pass (soft) for long signals
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x))
def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f / hi) ** 4)) * (1 / (1 + (lo / np.maximum(f, 1)) ** 4)); return np.fft.irfft(X, len(x))
def env_gate(intervals, fade=.12):
    g = np.zeros(N)
    for a, b in intervals:
        i0, i1 = int(a * SR), min(N, int(b * SR)); g[i0:i1] = 1
    k = int(fade * SR); ker = np.ones(k) / k
    return np.convolve(g, ker, 'same')
def add(sig, at, vol=1.0, pan=0.0):
    i0 = int(at * SR); n = min(len(sig), N - i0)
    if n <= 0: return
    l = vol * np.sqrt((1 - pan) / 2) * 1.414; r = vol * np.sqrt((1 + pan) / 2) * 1.414
    L[i0:i0 + n] += sig[:n] * l; R[i0:i0 + n] += sig[:n] * r
def adsr(n, a=.005, d=.1, s=.0, r=.0):
    e = np.ones(n); ia = max(1, int(a * SR)); e[:ia] = np.linspace(0, 1, ia)
    rest = n - ia; e[ia:] = np.exp(-np.arange(rest) / max(1, d * SR)) * (1 - s) + s
    return e
def tone(f, dur, kind='sine', a=.005, d=.15, f2=None):
    n = int(dur * SR); tt = np.arange(n) / SR
    fr = np.full(n, f) if f2 is None else f * (f2 / f) ** (tt / dur)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    if kind == 'sine': w = np.sin(ph)
    elif kind == 'tri': w = 2 / np.pi * np.arcsin(np.sin(ph))
    elif kind == 'square': w = np.sign(np.sin(ph)) * .6
    elif kind == 'saw': w = 2 * ((ph / (2 * np.pi)) % 1) - 1
    return w * adsr(n, a, d)

def whoosh(dur=.35):
    n = int(dur * SR); x = rng.standard_normal(n); x = bp_fast(x, 300, 3000)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2; return x * e * .5
def pad_chord(freqs, dur, vol):
    n = int(dur * SR); tt = np.arange(n) / SR; w = np.zeros(n)
    for f in freqs:
        for det in (-.12, .12): w += np.sin(2 * np.pi * (f + det) * tt) + .25 * np.sin(2 * np.pi * 2 * (f + det) * tt)
    e = np.minimum(1, tt / .9) * np.minimum(1, (dur - tt) / .9); return w * e * vol / len(freqs)
def whoosh(dur=.35):
    n = int(dur * SR); x = rng.standard_normal(n); x = bp_fast(x, 300, 3000)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2; return x * e * .5
def thump():
    a = tone(110, .25, 'sine', .002, .09, 55); n = int(.08 * SR)
    a[:n] += bp_fast(rng.standard_normal(n), 200, 2000) * np.exp(-np.arange(n) / 600) * .4
    return a
def coin(): return np.concatenate([tone(1319, .07, 'square', .002, .05), tone(1976, .22, 'square', .002, .09)]) * .5
def popfx(): return tone(320, .14, 'tri', .002, .06, 900)
def crunch():
    n=int(.09*SR); return bp_fast(rng.standard_normal(n),800,5000)*np.exp(-np.arange(n)/900)*.6
def coo(at, vol=.18):
    for k,(f,d) in enumerate([(420,.22),(360,.38)]):
        n=int(d*SR); tt=np.arange(n)/SR; w=np.sin(2*np.pi*(f+18*np.sin(2*np.pi*7*tt))*tt)*np.sin(np.pi*tt/d)**1.5
        w+= .3*np.sin(2*np.pi*2*f*tt)*np.sin(np.pi*tt/d)**2; add(lp_fast(w,1200), at+k*.26, vol, .3)
def flap(at, dur):
    t_=at
    while t_<at+dur: add(bp_fast(rng.standard_normal(int(.06*SR)),300,2500)*np.sin(np.linspace(0,np.pi,int(.06*SR))), t_, .22, .2); t_+=.09
# wind (outside & cold), fades once warm
tt=t_all; wnd=bp_fast(rng.standard_normal(N),200,900)*(.5+.5*np.sin(tt*.7)*np.sin(tt*.23+1))
g=np.ones(N); g[int(18.75*SR):int(34.45*SR)]=1.6; k0=int(34.45*SR); g[k0:]=np.maximum(.25,1-np.arange(N-k0)/SR/2.0)
wnd=wnd*g; L+=wnd*.2; R+=np.roll(wnd,900)*.2
# music: cold minor pads until the click, warm major after
cold=[(220,261.63,329.63),(174.61,220,261.63),(196,246.94,293.66),(164.81,196,246.94)]
t0=.2;k=0
while t0<34.4: add(pad_chord([f/2 for f in cold[k%4]]+list(cold[k%4]),min(3.6,34.8-t0),.04),t0); t0+=3.0;k+=1
warm=[(261.63,329.63,392),(220,261.63,329.63),(174.61,220,261.63),(196,246.94,293.66)]
t0=34.5;k=0
while t0<DUR: add(pad_chord([f/2 for f in warm[k%4]]+list(warm[k%4]),min(3.6,DUR-t0),.05),t0); t0+=3.0;k+=1
# music box lullaby while he falls asleep
mel=[659.25,587.33,523.25,587.33,659.25,659.25,659.25,0,587.33,587.33,587.33,0,659.25,783.99,783.99]
for i,f in enumerate(mel):
    if f: add(tone(f,.7,'sine',.004,.45)+.3*tone(2*f,.7,'sine',.004,.2), 40.3+i*.42, .06, .3)
# shiver chatter in the opening
for s0 in [.4,2.2,3.9]:
    for k in range(10): add(tone(2200,.012,'square',.0005,.006), s0+k*.055, .05, .2)
add(popfx(),.3,.2)
# vote card
add(whoosh(.35),4.85,.25); add(popfx(),5.15,.25)
for k in range(14): add(tone(500+k*45,.05,'tri',.002,.03), 5.7+k*.17, .06)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.4,'tri',.003,.2), 8.22+k*.06, .16)
# money out
add(np.concatenate([tone(1320,.1,'square',.002,.05),tone(880,.3,'square',.002,.15)])*.5, 9.6, .25)
for k in range(18): add(coin(), 9.65+k*.06, .07, rng.uniform(-.7,.7))
add(thump(),9.95,.35); add(popfx(),9.98,.25)
# plug in ... nothing
add(whoosh(.3),12.4,.15)
n=int(.05*SR); add(bp_fast(rng.standard_normal(n),1500,6000)*np.exp(-np.arange(n)/250),13.0,.5)
add(tone(140,.25,'square',.005,.2)*.5,14.89,.25); add(tone(110,.45,'square',.005,.35)*.5,15.15,.25)
add(thump(),16.9,.35)
# outside: whoosh, footsteps in snow
for c in [18.75,25.3]: add(whoosh(.4),c-.15,.25)
at=19.0
while at<24.4: add(crunch(),at,.35,rng.uniform(-.3,.3)); at+=.27
# lights on at the HOD
n=int(.6*SR); tt2=np.arange(n)/SR; add(np.sin(2*np.pi*120*tt2)*np.minimum(1,tt2/.05)*np.exp(-tt2/.4)*.4, 30.95, .25)
for k,f in enumerate([523.25,659.25,783.99,1046.5,1318.5]): add(tone(f,.5,'tri',.003,.3), 30.95+k*.07, .1)
for k,f in enumerate([783.99,987.77,1174.66]): add(tone(f,.6,'sine',.004,.4), 33.4+k*.1, .08)
# CLICK -> heater hums up
n=int(.025*SR); add(bp_fast(rng.standard_normal(n),2000,9000)*np.exp(-np.arange(n)/120),34.45,.7)
add(whoosh(.5),34.4,.25)
n=int((DUR-34.5)*SR); tt3=np.arange(n)/SR; hum=(np.sin(2*np.pi*60*tt3)+.4*np.sin(2*np.pi*120*tt3))*np.minimum(1,tt3/1.2)*.15+lp_fast(rng.standard_normal(n),900)*np.minimum(1,tt3/1.5)*.08
add(hum,34.5,.5)
# drips while melting
for k in range(12): add(tone(1400+rng.uniform(-200,300),.12,'sine',.001,.05,700), 36.0+k*.45+rng.uniform(0,.2), .1, rng.uniform(-.5,.5))
# pigeon
coo(44.6,.2); coo(45.5,.16)
add(np.concatenate([tone(300,.4,'tri',.01,.3,520)])*.4,45.7,.15)  # window slides
flap(46.2,.9); add(thump(),47.1,.15)
coo(48.2,.18)
for k,f in enumerate([783.99,1046.5,1318.5]): add(tone(f,.5,'tri',.003,.3), 48.13+k*.08, .1)
# end card
add(popfx(),50.3,.3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 50.4+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
fo=int(1.2*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
with wave.open('/tmp/ep11/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
