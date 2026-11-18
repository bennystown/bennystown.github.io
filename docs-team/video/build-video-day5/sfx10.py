import numpy as np, wave
SR = 44100; DUR = 31.15; N = int(SR * DUR)
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
# wind: slow-modulated filtered noise
n = N; tt = np.arange(n) / SR; wnd = bp_fast(rng.standard_normal(n), 200, 900) * (.5 + .5 * np.sin(tt * .7) * np.sin(tt * .23 + 1))
k0 = int(17.05 * SR); wnd[k0:] = lp_fast(wnd[k0:], 250) * .7
L += wnd * .22; R += np.roll(wnd, 900) * .22
# music: warm part, then cold minor part
C4,E4,G4,A3,F3,G3,B3,D4 = 261.63,329.63,392,220,174.61,196,246.94,293.66
warm=[(C4,E4,G4),(A3,C4,E4),(F3,A3,C4),(G3,B3,D4)]
t0=3.6;k=0
while t0 < 13.0: add(pad_chord([f/2 for f in warm[k%4]]+list(warm[k%4]), min(3.4, 13.4-t0), .045), t0); t0+=3.0;k+=1
cold=[(220,261.63,329.63),(174.61,220,261.63),(196,246.94,293.66),(164.81,196,246.94)]
t0=13.0;k=0
while t0 < DUR: add(pad_chord([f/2 for f in cold[k%4]]+list(cold[k%4]), 3.6, .04), t0); t0+=3.0;k+=1
for k,f in enumerate([1318.5,1046.5,880,659.25]): add(tone(f,1.0,'sine',.005,.7), .3+k*.3, .08, -.4+k*.25)
add(popfx(), .3, .25)
at=3.9
while at < 7.9: add(popfx(), at, .13, rng.uniform(-.7,.7)); at += .035
add(thump(), 3.9, .4)
for c in [3.75,8.05,10.8,12.97,17.05]: add(whoosh(.35), c-.15, .25)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.4,'tri',.003,.2), 10.38+k*.06, .14)
add(np.concatenate([tone(880,.1,'square',.002,.05),tone(1320,.3,'square',.002,.15)])*.5, 11.19, .3)
for k in range(30): add(coin(), 11.2+k*.035, .1, rng.uniform(-.7,.7))
n2=int(4.1*SR); t2=np.arange(n2)/SR; add(np.sin(2*np.pi*55*t2)*np.minimum(1,t2/1.2)*np.minimum(1,(4.1-t2)/.5)*.5, 12.97, .3)
for k in range(30): add(bp_fast(rng.standard_normal(int(.03*SR)),3000,9000)*np.exp(-np.arange(int(.03*SR))/200), 15.1+k*.035+rng.uniform(0,.02), .18, rng.uniform(-.6,.6))
add(thump(), 15.1, .4)
for s0 in [17.3,19.2,21.2]:
    for k in range(10): add(tone(2200,.012,'square',.0005,.006), s0+k*.055, .06, .2)
for t_ in [18.96,19.93]: add(tone(140,.3,'square',.005,.2)*.5, t_, .2)
add(popfx(), 22.2, .3)
for t_ in [23.25,23.9,24.74]: add(popfx(), t_, .3); add(tone(988,.15,'tri',.003,.08), t_+.03, .1)
for k,f in enumerate([392,494,587,740,880]): add(tone(f,.12,'square',.003,.08)*.5, 24.8+k*.07, .12, .3*(k%2*2-1))
add(popfx(), 25.63, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 26.5+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/ep10b/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
