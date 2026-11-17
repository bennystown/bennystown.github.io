import numpy as np, wave
SR = 44100; DUR = 48.6; N = int(SR * DUR)
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
at=10.85;k=0
while at < 48.5:
    if not (19.6 < at < 22.0):
        add(tone(notes[k%len(notes)], .3, 'tri', .003, .11), at, .045, -.3 if k%2 else .3)
        if k%4==0: add(tone(notes[k%len(notes)]/4, .5, 'sine', .005, .25), at, .07)
    at+=.25;k+=1

# hook: sad trombone-ish drop on "NO tires"
for k,f in enumerate([392,370,349,311]): add(tone(f,.35 if k<3 else .9,'saw',.01,.25 if k<3 else .6)*.35, 2.7+k*.32, .25)
add(tone(110,.8,'sine',.01,.5,70), 4.7, .35)
# idea ding (plan B)
add(np.concatenate([tone(1319,.08,'sine',.002,.05),tone(1760,.4,'sine',.002,.2)]), 7.55, .25)
# climb: little footsteps + hop
for k in range(5): add(thump()*.6, 8.95+k*.28, .25, -.3+k*.15)
add(tone(300,.25,'tri',.002,.12,700), 10.2, .25)
# whoa: whoosh up and out
add(whoosh(1.2), 10.8, .4); add(whoosh(.6), 11.6, .25)
# houses popping in
at=13.35
while at<16.1:
    add(popfx(), at, .17, rng.uniform(-.6,.6)); at+=.06
# 16 to go: tension riser + hit
n=int(2.0*SR); t_=np.arange(n)/SR; add(np.sin(2*np.pi*(200+300*t_/2)*t_)*np.minimum(1,t_/1.5)*.25, 19.6, .3)
add(thump(), 19.7, .5)
# cuts
for c in [22.05,25.55,31.95,36.0]: add(whoosh(.35), c-.15, .25)
# mystery sting at the site
for k,f in enumerate([233.08,277.18,329.63,415.3]): add(tone(f,1.2,'sine',.01,.7), 22.2+k*.15, .1)
# bank: register + coin rain
add(np.concatenate([tone(880,.1,'square',.002,.05),tone(1320,.3,'square',.002,.15)])*.5, 27.6, .3)
for k in range(70): add(coin(), 27.8+k*.045+.7, .12, rng.uniform(-.7,.7))
add(np.concatenate([tone(1047,.1,'sine',.002,.08),tone(1319,.1,'sine',.002,.08),tone(1568,.6,'sine',.002,.3)]), 29.85, .35)
# flowers
for k in range(11): add(tone(900+k*80,.12,'sine',.002,.06,1500+k*80), 32.1+k*.09, .12, rng.uniform(-.5,.5))
# poll pops + option dings
add(popfx(), 36.05, .3)
for k in range(3): add(popfx(), 36.4+k*.18, .3, -.4+k*.4)
for t0 in [38.15,39.15,40.15]: add(tone(784,.2,'tri',.003,.1), t0, .15)
add(popfx(), 41.5, .3)
# end card
add(popfx(), 43.35, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 43.5+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/ep8/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
