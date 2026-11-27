import numpy as np, wave
SR = 44100; DUR = 59.26; N = int(SR * DUR)
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
def chime(at, notes, vol=.12, step=.07):
    for k, f in enumerate(notes): add(tone(f, .5, 'tri', .003, .3), at + k * step, vol, (k % 3 - 1) * .3)

import json; T = json.load(open('/tmp/ep21/T.json'))
def siren(dur, vol=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = np.where((tt * 1.6) % 1 < .5, 960, 770)
    ph = 2 * np.pi * np.cumsum(f) / SR; w = np.sign(np.sin(ph)) * .5 + .3 * np.sin(2 * ph)
    return bp_fast(w, 300, 3500) * vol
def meow(dur=.55, f0=620):
    n = int(dur * SR); tt = np.arange(n) / SR; k = tt / dur
    f = f0 * (1 + .55 * np.sin(np.pi * np.minimum(1, k * 1.2)) - .25 * k)
    ph = 2 * np.pi * np.cumsum(f) / SR; w = 2 * ((ph / (2 * np.pi)) % 1) - 1
    form = bp_fast(w, 600, 2600) * .7 + bp_fast(w, 2400, 4200) * .25
    env = np.sin(np.pi * np.minimum(1, k)) ** .7; return form * env * .6
def register():
    a = np.concatenate([tone(2093, .06, 'square', .001, .04), tone(2637, .5, 'tri', .002, .25)]) * .5
    n = int(.12 * SR); a[:n] += bp_fast(rng.standard_normal(n), 2000, 7000) * np.exp(-np.arange(n) / 800) * .4
    return a
def flap(n_=6):
    out = np.zeros(int(.09 * SR * n_))
    for q in range(n_): m = int(.05 * SR); i0 = int(q * .09 * SR); out[i0:i0 + m] += bp_fast(rng.standard_normal(m), 300, 1800) * np.exp(-np.arange(m) / 500)
    return out
def rewind(dur):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 2400 - 1400 * (tt / dur); ph = 2 * np.pi * np.cumsum(f * (1 + .3 * np.sin(tt * 40))) / SR
    return (np.sin(ph) * .25 + bp_fast(rng.standard_normal(n), 1500, 6000) * .35) * np.minimum(1, tt / .2) * np.minimum(1, (dur - tt) / .3)
def steps(a, b, gap, vol=.2):
    at = a
    while at < b: m = int(.08 * SR); add(bp_fast(rng.standard_normal(m), 250, 2200) * np.exp(-np.arange(m) / 700) * .5, at, vol, rng.uniform(-.2, .2)); at += gap
happy = [(261.63, 329.63, 392), (220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)]
def music(a, b, prog, vol=.05, arp=True, step=3.0, arpvol=.03):
    t0 = a; k = 0
    while t0 < b: add(pad_chord([f / 2 for f in prog[k % 4]] + list(prog[k % 4]), min(3.6, b + .3 - t0), vol), t0); t0 += step; k += 1
    if arp:
        i = 0
        while a + i * .3 < b - .2:
            ch = prog[int((i * .3) // step) % 4]; f = [ch[0] * 2, ch[1] * 2, ch[2] * 2, ch[1] * 2][i % 4]; add(tone(f, .3, 'sine', .004, .2), a + i * .3, arpvol, ((i % 2) - .5) * .5); i += 1







happy=[(261.63, 329.63, 392), (349.23, 440, 523.25), (392, 493.88, 587.33), (261.63, 329.63, 392)]
calm=[(261.63, 329.63, 392), (220, 277.18, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)]
def engine(a, b, f0=55, vol=.08):
    n = int((b - a) * SR); tt = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f0 * (1 + .04 * np.sin(tt * 9))) / SR
    w = (2 * ((ph / (2 * np.pi)) % 1) - 1) * .5 + bp_fast(rng.standard_normal(n), 60, 400) * .6
    w = lp_fast(w, 380) * np.minimum(1, tt / .3) * np.minimum(1, (b - a - tt) / .3); add(w, a, vol)
def horn(at):
    for k in range(2): add(tone(392, .22, 'square', .005, .5) * .6 + tone(494, .22, 'square', .005, .5) * .4, at + k * .3, .14)
add(thump(), .05, .3); add(whoosh(.6), .1, .25)
music(.1, T['hund'] - .3, happy, .05, True, 2.2, .03)
chime(T['plow'] - .1, [523.25, 659.25, 783.99], .13); chime(T['both'] - .3, [659.25, 783.99, 1046.5, 1318.5], .13)
steps(T['hund'] - .4, T['hund'] + .6, .28, .14)
add(register(), T['hund'] + .2, .2); add(coin(), T['hund'] + .3, .12); add(register(), T['hund'] + 1.2, .2); add(coin(), T['hund'] + 1.3, .12)
add(tone(300, .5, 'tri', .01, .4, 160), T['hund'] + 1.7, .12)
music(T['worth'] - .2, T['look'] - .3, happy, .045, True, 2.0, .028)
engine(T['beep'] - .2, T['salt'] - .3, 55, .09); engine(T['salt'] - .3, T['look'] - .3, 62, .08)
horn(T['beep'])
snow = bp_fast(rng.standard_normal(int((T['salt'] - T['beep']) * SR)), 800, 5000) * .06; add(snow, T['beep'], 1.0)
add(flap(8), T['pigeon'] - .9, .25); add(flap(5), T['wait'] - .1, .25); add(thump() * .4, T['wait'] + .4, .12)
salt = bp_fast(rng.standard_normal(int((T['look'] - T['salt']) * SR)), 3000, 9000) * .05 * (1 + .5 * np.sin(np.arange(int((T['look'] - T['salt']) * SR)) / SR * 30)); add(salt, T['salt'] - .1, 1.0)
for k in ['beep', 'salt', 'look', 'hod', 'mittens', 'left']: add(whoosh(.35), T[k] - .45, .2)
chime(T['look'] - .2, [523.25, 659.25, 783.99, 1046.5, 1318.5], .14, .08)
music(T['look'] - .3, T['mittens'] - .3, happy, .055, True, 2.0, .032)
for q in range(40): add(popfx(), T['everyone'] - .2 + q * .11, .06, rng.uniform(-.5, .5))
chime(T['welcome'], [783.99, 987.77, 1174.66], .1)
chime(T['hod'] + 1.1, [523.25, 659.25, 783.99, 1046.5], .13); add(register(), T['hod'] + 1.3, .15)
music(T['mittens'] - .3, T['left'] - .3, calm, .04, True, 2.6, .022)
add(meow(.45, 760), T['nope'] + .05, .13)
music(T['left'] - .3, T['dur'], calm, .045, True, 2.6, .025)
chime(T['saved'] - .2, [523.25, 659.25, 783.99, 1046.5], .14, .07)
chime(T['night'] + .2, [1046.5, 1318.5, 1567.98], .08, .12)
mix = np.stack([L, R], 1); mix /= max(1e-6, np.abs(mix).max()) / .8
fo = int(1.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open('/tmp/ep21/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('sfx ok')
