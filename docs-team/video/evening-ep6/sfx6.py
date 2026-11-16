import numpy as np, wave
SR = 44100; DUR = 44.6; N = int(SR * DUR)
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

# ---------------- ambiences ----------------
def whoosh(dur=.35):
    n = int(dur * SR); x = rng.standard_normal(n); x = bp_fast(x, 300, 3000)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2; return x * e * .5
def thump():
    a = tone(110, .25, 'sine', .002, .09, 55); n = int(.08 * SR)
    a[:n] += bp_fast(rng.standard_normal(n), 200, 2000) * np.exp(-np.arange(n) / 600) * .4
    return a
def coin():
    return np.concatenate([tone(1319, .07, 'square', .002, .05), tone(1976, .22, 'square', .002, .09)]) * .5
def popfx():
    return tone(320, .14, 'tri', .002, .06, 900)
def hammer():
    a = tone(180, .05, 'square', .001, .015) * .7; n = len(a)
    return a + bp_fast(rng.standard_normal(n), 1000, 6000) * np.exp(-np.arange(n) / 300) * .5


noise = rng.standard_normal(N)
amb = lp_fast(noise, 300) * .5
L += amb * .3; R += np.roll(amb, 700) * .3
def pad_chord(freqs, dur, vol):
    n = int(dur * SR); tt = np.arange(n) / SR; w = np.zeros(n)
    for f in freqs:
        for det in (-.12, .12): w += np.sin(2 * np.pi * (f + det) * tt) + .25 * np.sin(2 * np.pi * 2 * (f + det) * tt)
    e = np.minimum(1, tt / .9) * np.minimum(1, (dur - tt) / .9); return w * e * vol / len(freqs)
C4,E4,G4,A3,F3,G3,B3,D4,C5,E5,A4 = 261.63,329.63,392,220,174.61,196,246.94,293.66,523.25,659.25,440
progm = [(C4,E4,G4),(A3,C4,E4),(F3,A3,C4),(G3,B3,D4)]
tt0=0.0;k=0
while tt0 < DUR:
    add(pad_chord([f/2 for f in progm[k%4]]+list(progm[k%4]), 4.6, .04), tt0); tt0+=4.0; k+=1
notes=[C5,E5,G4*2,E5,A4,C5,E5,C5,F3*4,A4,C5,A4,G4,B3*4,D4*2,G4*2]
at=0.6;k=0
while at < 21.0:
    if True:
        add(tone(notes[k%len(notes)], .3, 'tri', .003, .11), at, .045, -.3 if k%2 else .3)
        if k%4==0: add(tone(notes[k%len(notes)]/4, .5, 'sine', .005, .25), at, .07)
    at+=.25;k+=1
# card pop + votes
add(popfx(), 0.65, .3)
for k in range(3): add(tone(784+k*120,.15,'tri',.003,.08), 0.95+k*.15, .12)
# footsteps
for tt in np.arange(4.7, 8.0, .27): add(bp_fast(rng.standard_normal(int(.05*SR)),200,1200)*np.exp(-np.arange(int(.05*SR))/300)*.6, tt, .25, rng.uniform(-.2,.2))
for tt in np.arange(8.0, 9.6, .27): add(bp_fast(rng.standard_normal(int(.05*SR)),200,1200)*np.exp(-np.arange(int(.05*SR))/300)*.6, tt, .25)
for tt in np.arange(18.3, 19.1, .27): add(bp_fast(rng.standard_normal(int(.05*SR)),200,1200)*np.exp(-np.arange(int(.05*SR))/300)*.6, tt, .25)
for c in [8.0, 26.6, 34.8]: add(whoosh(.35), c-.15, .25)
add(whoosh(.5), 10.0, .2)
# buys
for t0 in [12.0, 19.9]:
    add(np.concatenate([tone(880,.1,'square',.002,.05),tone(1320,.3,'square',.002,.15)])*.5, t0, .3)
    for k in range(4): add(coin(), t0+.1+k*.12, .14)
# engine cough
for k in range(4):
    n=int(.22*SR); e=np.exp(-np.arange(n)/(.06*SR)); add(lp_fast(rng.standard_normal(n),400)*e*1.5 + tone(70,.22,'square',.002,.08)*.5, 13.85+k*.38, .5)
add(tone(300,.5,'sine',.005,.3,120), 15.3, .25)
# night: crickets
n=int((44.6-21.2)*SR); tt=np.arange(n)/SR; cr=np.sin(2*np.pi*4300*tt)*(np.sin(2*np.pi*28*tt)>0.3)*(np.sin(2*np.pi*.7*tt)>-.2)
add(cr*np.minimum(1,tt/1.5)*.05, 21.2, 1, .4)
add(np.roll(cr,7000)*np.minimum(1,tt/1.5)*.04, 21.2, 1, -.4)
for f0,at in [(220,21.2),(196,25.2),(262,29.2),(220,33.2),(174.6,37.2),(196,41.2)]:
    add(pad_chord([f0/2,f0,f0*1.25,f0*1.5],4.4,.05), at)
# pushing: heavy scrape rumble
n=int(6.0*SR); tt=np.arange(n)/SR; rb=lp_fast(rng.standard_normal(n),180)*(.6+.4*np.sin(2*np.pi*1.4*tt))
add(rb*1.4, 22.6, .5); 
n=int(2.4*SR); tt=np.arange(n)/SR; add(lp_fast(rng.standard_normal(n),180)*(.6+.4*np.sin(2*np.pi*1.4*tt))*1.4*np.minimum(1,(2.4-tt)/.4), 26.6, .5)
# lights switching on: clicks cascading + magical rise
for k in range(26): add(tone(2400+rng.uniform(-300,300),.03,'square',.001,.01)*.6, 28.9+k*.12+rng.uniform(0,.05), .12, rng.uniform(-.8,.8))
for k,f in enumerate([523.25,659.25,783.99,1046.5,1318.5,1568]): add(tone(f,1.2,'tri',.01,.6), 29.4+k*.16, .1, -.4+k*.16)
add(tone(110,1.4,'sine',.02,.8,220)*.6, 29.0, .3)
# end: soft music box
for k,f in enumerate([783.99,659.25,523.25,659.25,783.99,1046.5]): add(tone(f,.9,'sine',.004,.5), 35.4+k*.55, .09)
add(popfx(), 39.85, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 40.1+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/ep6/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
