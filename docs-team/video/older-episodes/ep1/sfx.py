import numpy as np, wave
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
street = [(3.16, 12.1), (17.6, 19.95), (30.0, 40.5)]
town = [(0, 3.16), (12.1, 17.6), (19.95, 30.0)]
noise = rng.standard_normal(N)
rain = bp_fast(noise, 400, 5000) * .18 + bp_fast(rng.standard_normal(N), 80, 600) * .10
drops = np.zeros(N); idx = rng.integers(0, N - 400, 2600)
for i in idx: drops[i:i + 220] += np.exp(-np.arange(220) / 30) * rng.uniform(.05, .22) * rng.choice([-1, 1])
rain = (rain + bp_fast(drops, 1500, 8000)) * env_gate(street, .08)
L += rain * .55; R += np.roll(rain, 337) * .55
wind = lp_fast(rng.standard_normal(N), 420) * (0.6 + 0.4 * np.sin(2 * np.pi * t_all / 5.3))
wind *= env_gate(town, .1) * .9
L += wind * .55; R += np.roll(wind, 900) * .55
# crickets in the empty town
for k in range(int((17.6 - 12.15) / .42)):
    at = 12.15 + k * .42 + rng.uniform(0, .08)
    ch = np.concatenate([tone(4600, .03, 'sine', .002, .015) for _ in range(3)])
    add(ch, at, .05, rng.uniform(-.6, .6))

# ---------------- music bed ----------------
def pad_chord(freqs, dur, vol):
    n = int(dur * SR); tt = np.arange(n) / SR; w = np.zeros(n)
    for f in freqs:
        for det in (-.12, .12):
            w += np.sin(2 * np.pi * (f + det) * tt) + .25 * np.sin(2 * np.pi * 2 * (f + det) * tt)
    e = np.minimum(1, tt / .9) * np.minimum(1, (dur - tt) / .9)
    return w * e * vol / len(freqs)
A3, C4, E4, F3, A4, G3, B3, D4, G4, C5, E5 = 220, 261.63, 329.63, 174.61, 440, 196, 246.94, 293.66, 392, 523.25, 659.25
prog_sad = [(A3, C4, E4), (F3, A3, C4), (C4, E4, G4), (G3, B3, D4)]
tt0 = 0.0; k = 0
while tt0 < DUR:
    seg = pad_chord([f / 2 for f in prog_sad[k % 4]] + list(prog_sad[k % 4]), 4.6, .045)
    add(seg, tt0, 1.0); tt0 += 4.0; k += 1
# upbeat plucks during the deal
notes = [C5, E5, G4 * 2, E5, D4 * 2, G4 * 2, B3 * 4, G4 * 2, A4, C5, E5, C5, F3 * 4, A4, C5, A4]
at = 20.13; k = 0
while at < 29.9:
    add(tone(notes[k % len(notes)], .32, 'tri', .003, .12), at, .06, -.3 if k % 2 else .3)
    if k % 4 == 0: add(tone(notes[k % len(notes)] / 4, .5, 'sine', .005, .25), at, .09)
    at += .2; k += 1

# ---------------- events ----------------
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

for c in [3.16, 5.24, 12.1, 17.6, 19.95, 30.0, 30.75, 33.7, 36.05]:
    add(whoosh(), c - .18, .22)
for s in [14.0, 15.28, 16.48, 20.13, 24.96, 26.3, 30.85, 32.3, 33.76, 34.5, 38.7, 39.0]:
    add(thump(), s, .55)
# coins (arrivals) — same schedule as the animation
coins = [24.86] + [25.0 + k * .13 + .62 for k in range(5)] + [28.75 + k * .12 for k in range(6)]
for c in coins: add(coin(), c, .35, .4)
for b in [23.2] + [25.0 + k * .13 for k in range(5)]: add(popfx(), b, .4, -.2)
for k in range(12): add(hammer(), 21.55 + k * .14, .35, -.3)
# lamp flicker buzz
add(np.sign(np.sin(2 * np.pi * 120 * np.arange(int(.2 * SR)) / SR)) * .15 * np.exp(-np.arange(int(.2 * SR)) / 3000), 4.4, .4)
# key sparkle + question boings
for k, f in enumerate([1568, 1976, 2349, 3136]): add(tone(f, .5, 'sine', .002, .25), 9.12 + k * .06, .12, .3)
for k, at in enumerate([10.25, 10.45, 10.65]): add(tone(300 + k * 80, .25, 'sine', .005, .12, 700 + k * 80), at, .22)
# pigeon wings
n = int(1.5 * SR); fl = bp_fast(rng.standard_normal(n), 300, 2500) * (np.abs(np.sin(2 * np.pi * 9 * np.arange(n) / SR)) ** 3)
fl *= np.minimum(1, np.arange(n) / (.2 * SR)) * np.minimum(1, (n - np.arange(n)) / (.3 * SR))
add(fl, 18.25, .45, .4)
add(tone(500, .12, 'tri', .002, .05, 300) * .5, 18.86, .3)
# dream bubble + bread ding
add(popfx(), 30.9, .3); add(np.concatenate([tone(1047, .1, 'sine', .002, .08), tone(1568, .4, 'sine', .002, .2)]), 32.95, .3)
# vote card pops
for k in range(3): add(popfx(), 34.0 + k * .16, .3, -.4 + k * .4)
# sad trombone while the bank drains
for k, (f, d) in enumerate([(392, .28), (370, .28), (349, .28), (330, .9)]):
    n = int(d * SR); tt = np.arange(n) / SR; vib = 1 + (.012 * np.sin(2 * np.pi * 6 * tt) if k == 3 else 0)
    w = lp(np.sign(np.sin(2 * np.pi * np.cumsum(f * vib) / SR)) * .5, .08) * np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .08)
    add(w, 36.15 + k * .28, .5)
# final sting
for k, f in enumerate([523.25, 659.25, 783.99, 1046.5]): add(tone(f, .45, 'tri', .003, .25), 38.7 + k * .07, .12)

mix = np.stack([L, R], 1); mix /= max(1e-6, np.abs(mix).max()) / .8
with wave.open('/tmp/ep1/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('sfx ok')
