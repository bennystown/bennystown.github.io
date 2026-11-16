import numpy as np, wave
SR = 44100; DUR = 52; N = int(SR * DUR)
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
at=6.4;k=0
while at < 51.5:
    if not (36.9 < at < 41.2):
        add(tone(notes[k%len(notes)], .3, 'tri', .003, .11), at, .045, -.3 if k%2 else .3)
        if k%4==0: add(tone(notes[k%len(notes)]/4, .5, 'sine', .005, .25), at, .07)
    at+=.25;k+=1
# snore + notification pings
for k in range(3): n=int(.7*SR); t_=np.arange(n)/SR; add(lp_fast(rng.standard_normal(n),250)*np.sin(np.pi*t_/.7)*.8, .3+k*.9, .4)
for k in range(14): add(np.concatenate([tone(1568,.06,'sine',.002,.04),tone(2093,.2,'sine',.002,.1)]), 2.9+k*.24, .2, rng.uniform(-.7,.7))
# build: rapid pops 6.45-11.7
at=6.5
while at<11.7:
    add(popfx(), at, .18, rng.uniform(-.6,.6)); at+= max(.05, .16*(1-(at-6.45)/5.3)+.04)
for k in range(0,40): add(coin(), 6.6+k*.13, .1, rng.uniform(-.5,.5))
# cuts whoosh / highlights sparkle
for c in [11.95,13.0,14.35,16.25,20.45,23.2,33.9,37.45,41.4]: add(whoosh(.35), c-.15, .25)
for t0 in [12.0,13.05,16.4,20.6]:
    for k,f in enumerate([1568,1976,2349,3136]): add(tone(f,.4,'sine',.002,.2), t0+k*.05, .1, .3)
# confetti pop #1000
add(popfx(), 20.75, .4); add(np.concatenate([tone(1047,.1,'sine',.002,.08),tone(1568,.5,'sine',.002,.25)]), 20.8, .3)
# rent day: register + coin rain
add(np.concatenate([tone(880,.1,'square',.002,.05),tone(1320,.3,'square',.002,.15)])*.5, 27.0, .3)
for k in range(90): add(coin(), 28.6+k*.045+.7, .12, rng.uniform(-.7,.7))
add(np.concatenate([tone(1047,.1,'sine',.002,.08),tone(1319,.1,'sine',.002,.08),tone(1568,.6,'sine',.002,.3)]), 33.1, .35)
# park chime, key shimmer
for k,f in enumerate([523.25,659.25,783.99,1046.5,1318.5]): add(tone(f,.6,'tri',.003,.3), 34.0+k*.09, .12)
n=int(3.6*SR); t_=np.arange(n)/SR; sh=np.zeros(n)
for f in (1760,2217,2637,3520): sh+=np.sin(2*np.pi*f*t_)*(.5+.5*np.sin(2*np.pi*(3+f/1000)*t_))
add(sh*np.minimum(1,t_/.5)*np.minimum(1,(3.6-t_)/.5)/8, 37.5, .25)
add(tone(110,.8,'sine',.01,.5,70), 40.55, .5)
# find card + poll pops
add(popfx(), 41.25, .3)
for k in range(3): add(popfx(), 44.55+k*.18, .3, -.4+k*.4)
add(popfx(), 47.9, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 49.6+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/build3/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
