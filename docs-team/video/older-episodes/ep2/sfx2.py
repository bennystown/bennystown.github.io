import numpy as np, wave
import sys; NEW=int(sys.argv[1]) if len(sys.argv)>1 else 54
SR = 44100; DUR = 40.5; N = int(SR * DUR)
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


# ambience: soft evening street hum
noise = rng.standard_normal(N)
amb = lp_fast(noise, 300) * .5 + bp_fast(rng.standard_normal(N), 1500, 5000) * .03
L += amb * .35; R += np.roll(amb, 700) * .35
# warm music bed (major)
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
# bouncy plucks except during bliss
notes=[C5,E5,G4*2,E5,A4,C5,E5,C5,F3*4,A4,C5,A4,G4,B3*4,D4*2,G4*2]
at=2.25;k=0
while at < 39.6:
    if not (13.4 < at < 18.0):
        add(tone(notes[k%len(notes)], .3, 'tri', .003, .11), at, .045, -.3 if k%2 else .3)
        if k%4==0: add(tone(notes[k%len(notes)]/4, .5, 'sine', .005, .25), at, .07)
    at+=.25;k+=1
# growl
n=int(1.1*SR); tt=np.arange(n)/SR
gr=np.sin(2*np.pi*np.cumsum(70+25*np.sin(2*np.pi*7*tt))/SR)*(1+.5*np.sin(2*np.pi*23*tt))*np.sin(np.pi*tt/1.1)
add(lp_fast(np.concatenate([gr,np.zeros(SR)]),400)[:n]*.9, .05, .7)
# poll bars + winner
for i in range(3): add(whoosh(.3), 2.45+i*.1, .25, -.4+i*.4)
add(np.concatenate([tone(1047,.1,'sine',.002,.08),tone(1568,.45,'sine',.002,.2)]), 3.25, .3)
# hearts
for k in range(4): add(popfx(), 4.85+k*.22, .25, -.3+k*.2)
# cart roll in/out
for a,b in [(6.3,7.15),(10.2,11.1)]:
    n=int((b-a)*SR); rr=bp_fast(rng.standard_normal(n),100,900)*(1+.6*np.sin(2*np.pi*9*np.arange(n)/SR)); rr*=np.sin(np.linspace(0,np.pi,n))
    add(rr*.6, a, .5, .6)
add(tone(1760,.6,'sine',.002,.3), 7.15, .12, .6)   # bell
# coin to cart + register
add(coin(), 7.95, .35, .3); add(coin(), 8.6, .35, .5)
add(tone(600,.4,'square',.003,.15,300)*.4, 8.7, .25)   # drain
add(popfx(), 9.35, .3, .4)
# crunch
for k in range(3):
    n=int(.09*SR); add(bp_fast(rng.standard_normal(n),800,6000)*np.exp(-np.arange(n)/900), T:=12.55+k*.11, .45)
# choir (bliss)
n=int(4.3*SR); tt=np.arange(n)/SR; ch=np.zeros(n)
for f in (523.25,659.25,783.99,1046.5):
    for det in (-1.5,0,1.5): ch+=np.sin(2*np.pi*(f+det)*tt*(1+.004*np.sin(2*np.pi*5*tt)))
ch*=np.minimum(1,tt/.6)*np.minimum(1,(4.3-tt)/.6)/12
add(ch, 13.6, .5)
# pigeon flaps + coo
n=int(.65*SR); fl=bp_fast(rng.standard_normal(n),300,2500)*(.5+.5*np.sign(np.sin(2*np.pi*13*np.arange(n)/SR))); add(fl*.5, 17.95, .5, .6)
for at in (19.0, 22.5, 22.8): add(tone(380,.35,'sine',.02,.2,300)*(1+.5*np.sin(2*np.pi*30*np.arange(int(.35*SR))/SR)), at, .25, .5)
add(whoosh(.35), 21.95, .25, .4)
for k in range(3): add(tone(2200,.04,'square',.001,.015)*.3, 22.4+k*.2, .3, .5)
add(popfx(), 22.7, .3)
# lotto: sad trombone-lite
for k,f in enumerate([392,370,349,330]): add(tone(f,.3,'saw',.01,.2)*.4, 26.85+k*.18, .15)
# dings + coin rain
add(tone(2093,.6,'sine',.002,.3), 27.65, .3, -.5); add(tone(2637,.6,'sine',.002,.3), 28.0, .3, .5)
import math
nc=min(40,max(8,NEW))
for k in range(6): add(np.concatenate([tone(1568,.08,'sine',.002,.05),tone(2093,.25,'sine',.002,.12)]), 28.8+(k/6)*2.0, .22, -.5 if k%2==0 else .5)
add(np.concatenate([tone(1047,.1,'sine',.002,.08),tone(1319,.1,'sine',.002,.08),tone(1568,.5,'sine',.002,.25)]), 30.4, .3)
# info pops
add(popfx(), 32.55, .3); add(popfx(), 33.9, .3); add(popfx(), 34.35, .3, -.5)
# end sting
for k,f in enumerate([523.25,659.25,783.99,1046.5]): add(tone(f,.45,'tri',.003,.25), 39.7+k*.07, .12)
mix=np.stack([L,R],1); mix/=max(1e-6,np.abs(mix).max())/.8
with wave.open('/tmp/ep2/sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('sfx ok')
