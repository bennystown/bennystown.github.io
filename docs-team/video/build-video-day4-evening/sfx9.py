import numpy as np, wave
SR = 44100; DUR = 61.38; N = int(SR * DUR)
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
at=15.3;k=0
while at < 56.4:
    if not (27.4 < at < 30.0):
        add(tone(notes[k%len(notes)], .3, 'tri', .003, .11), at, .04, -.3 if k%2 else .3)
        if k%4==0: add(tone(notes[k%len(notes)]/4, .5, 'sine', .005, .25), at, .07)
    at+=.25;k+=1
def ding(fs, vol, at):
    add(np.concatenate([tone(f,.09 if i<len(fs)-1 else .5,'sine',.002,.06 if i<len(fs)-1 else .25) for i,f in enumerate(fs)]), at, vol)
def engine(dur, f0, f1, vol, at, rough=.3):
    n=int(dur*SR); tt=np.arange(n)/SR; fr=f0+(f1-f0)*np.minimum(1,tt/max(.01,dur*.6)); ph=2*np.pi*np.cumsum(fr)/SR
    w=(2*((ph/(2*np.pi))%1)-1)*(1+.4*np.sin(ph*.5)); w=lp_fast(w,900)+bp_fast(rng.standard_normal(n),80,600)*rough
    e=np.minimum(1,tt/.08)*np.minimum(1,(dur-tt)/.15); add(w*e, at, vol)
def honk(at, vol=.25, f=420):
    for k in range(2): add((tone(f,.16,'square',.005,.5)+tone(f*1.26,.16,'square',.005,.5))*.5, at+k*.22, vol)
# hook
add(popfx(), .5, .3); add(whoosh(1.3), 1.8, .2)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.4,'tri',.003,.2), 3.5+k*.08, .2)
add(thump(), 3.55, .4)
# tires roll in + klonk + money out
for tl in [5.98,6.86,7.74,8.54]:
    n=int(.6*SR); add(lp_fast(rng.standard_normal(n),400)*np.linspace(.2,1,n)*.8, tl-.6, .35, .4)
    add(thump(), tl, .6); add(hammer(), tl+.02, .35)
    add(np.concatenate([tone(988,.07,'square',.002,.05),tone(659,.2,'square',.002,.1)])*.5, tl+.08, .1)
add(popfx(), 8.9, .3)
# walking to the cab + door
for k in range(3): add(thump()*.5, 9.75+k*.26, .2, .2)
add(thump(), 10.6, .45); add(hammer(), 10.6, .3)
# stutter: three cranks, then VROOM
for k,a in enumerate([12.9,13.75,14.55]): engine(.55, 22, 30, .45, a, .5)
engine(1.4, 40, 110, .6, 15.3, .4); add(whoosh(.8), 15.35, .3)
engine(3.2, 55, 55, .25, 16.7, .25)
# driving hum + honk
engine(4.3, 70, 75, .3, 18.6, .2); honk(21.55)
engine(3.9, 70, 70, .3, 22.9, .2)
add(tone(1800,.3,'sine',.01,.2,1500), 26.5, .06)
for c in [18.6,22.9,31.6,39.45,43.6,48.9]: add(whoosh(.35), c-.15, .25)
# counter ticks + 5,000 hit
for k in range(16): add(tone(1400+k*40,.04,'square',.001,.02), 28.3+ (1-(1-(k/16))**1.25)*1.7, .1)
add(thump(), 30.0, .7)
for k,f in enumerate([523.25,659.25,783.99,1046.5,1318.5]): add(tone(f,.6,'tri',.003,.3), 30.0+k*.06, .18)
for k in range(30): add(popfx(), 30.05+k*.05, .07, rng.uniform(-.8,.8))
# riser into the opening, paving whoosh, tower rumble, fanfare
n=int(2.4*SR); t_=np.arange(n)/SR; add(np.sin(2*np.pi*(150+250*t_/2.4)*t_)*np.minimum(1,t_/2)*.2, 32.5, .3)
add(whoosh(2.5), 34.9, .35)
add(lp_fast(rng.standard_normal(int(1.5*SR)),150)*1.5, 35.0, .35)
for k,f in enumerate([392,523.25,659.25,783.99,1046.5]): add(tone(f,.8,'tri',.003,.4), 36.1+k*.07, .18)
for k in range(30): add(popfx(), 36.15+k*.05, .06, rng.uniform(-.8,.8))
# shops pop on each name, then stalls
for t0 in [39.8,40.78,41.82,42.94,43.4,43.8,44.0,44.2,44.4]: add(popfx(), t0, .3, rng.uniform(-.4,.4)); add(tone(880,.15,'sine',.003,.08,1320), t0+.05, .08)
for k in range(12): add(popfx(), 42.9+k*.11, .1, rng.uniform(-.6,.6))
# cars
honk(44.6, .18, 520); honk(45.3, .14, 380); engine(2.5, 90, 90, .12, 44.6, .3)
# outro
ding([659.25,523.25], .15, 50.6)
ding([784,988], .15, 53.95); add(popfx(), 55.2, .3)
add(popfx(), 56.6, .3)
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 56.75+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/ep9/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
