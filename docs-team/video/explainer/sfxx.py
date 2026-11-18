import numpy as np, wave
SR = 44100; DUR = 58.15; N = int(SR * DUR)
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

C4,E4,G4,A3,F3,G3,B3,D4 = 261.63,329.63,392,220,174.61,196,246.94,293.66
prog=[(C4,E4,G4),(A3,C4,E4),(F3,A3,C4),(G3,B3,D4)]
t0=0.0;k=0
while t0 < DUR: add(pad_chord([f/2 for f in prog[k%4]]+list(prog[k%4]), 3.6, .05 if 11.5<t0<46 else .035), t0); t0+=3.0;k+=1
notes=[523.25,659.25,783.99,659.25,880,783.99,659.25,523.25]
at=11.6;k=0
while at < 46.0: add(tone(notes[k%8], .22, 'tri', .003, .1), at, .03, -.3 if k%2 else .3); at+=.375; k+=1
# rain at start
n=int(3.9*SR); rn=bp_fast(rng.standard_normal(n),800,6000)*np.minimum(1,np.arange(n)/SR/.3)*np.minimum(1,(3.9-np.arange(n)/SR)/.4); add(rn, 0, .18, -.2); add(rn[::-1], 0, .18, .2)
for c in [3.7,9.9,11.5,19.3,25.3,30.45,32.1,34.85,38.3,40.4,41.45,42.6,43.3,44.0,46.1,52.25]: add(whoosh(.3), c-.12, .22)
# letter, key
add(np.concatenate([tone(1046,.08,'sine',.002,.05),tone(1318,.4,'sine',.002,.3)])*.6, 4.05, .15)
for k,f in enumerate([1568,2093,2637]): add(tone(f,.4,'sine',.002,.3), 6.9+k*.06, .1)
# pigeon: flaps + squawk + "hey"
for k in range(18): add(bp_fast(rng.standard_normal(int(.04*SR)),500,2500)*np.hanning(int(.04*SR)), 9.95+k*.09, .15, .3)
add(tone(900,.18,'saw',.005,.1,600), 10.5, .1, .4)
add(thump(), 10.55, .4)
# follow click + house pop + coin
add(tone(1500,.03,'square',.001,.02), 13.3, .25); add(popfx(), 13.35, .3)
add(thump(), 14.27, .45); add(popfx(), 14.3, .35)
for k,f in enumerate([1318.5,1975.5]): add(tone(f,.18 if k else .07,'square',.002,.09), 18.4+k*.07, .14)
# morning chime + pops
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.5,'sine',.005,.3), 19.35+k*.08, .1)
at=19.5
while at < 20.9: add(popfx(), at, .1, rng.uniform(-.7,.7)); at+=.05
for k in range(4): add(tone(1200,.03,'square',.001,.02), 21.95+k*.18, .1)
for k in range(35): add(coin(), 23.5+k*.05, .09, rng.uniform(-.7,.7))
for t_ in [27.68,28.6,29.68]: add(popfx(), t_, .3); add(tone(1046,.2,'tri',.003,.1), t_+.03, .1)
add(popfx(), 30.5, .3); add(popfx(), 32.15, .3)
at=35.1
while at < 38.0: add(popfx(), at, .08, rng.uniform(-.7,.7)); at+=.04
add(np.concatenate([tone(1046,.08,'sine',.002,.05),tone(1318,.4,'sine',.002,.3)])*.6, 38.75, .15)
for t_ in [40.4,41.45,42.6,43.3,44.0]: add(popfx(), t_, .3); add(thump(), t_, .25)
n2=int(4.1*SR); t2=np.arange(n2)/SR; add(np.sin(2*np.pi*55*t2)*np.minimum(1,t2/1.0)*np.minimum(1,(4.1-t2)/.5)*.5, 46.1, .3)
for s0 in [46.4,48.2,49.6]:
    for k in range(10): add(tone(2200,.012,'square',.0005,.006), s0+k*.055, .06, .2)
add(popfx(), 50.25, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 52.3+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/epx/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
