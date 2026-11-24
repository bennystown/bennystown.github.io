import numpy as np, wave
SR = 44100; DUR = 59.0; N = int(SR * DUR)
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


T={"eyes": 4.86, "gate": 6.62, "prints": 8.3, "van": 13.62, "here": 14.54, "guess": 16.97, "ton": 20.08, "tres": 23.6, "chest": 28.62, "flag": 29.94, "only": 31.18, "hunt": 33.13, "nohint": 37.1, "live": 38.89, "follow": 42.14, "rent": 45.37, "only14": 48.94, "dark": 51.1, "poll": 52.17, "card": 55.76}
n = int(T['prints'] * SR); tt = np.arange(n) / SR
add(bp_fast(rng.standard_normal(n), 150, 700) * (.6 + .4 * np.sin(tt * .9)) * .5, 0, .35)
add((np.sin(2 * np.pi * 55 * tt) + .5 * np.sin(2 * np.pi * 58 * tt)) * np.minimum(1, tt / 1.5) * .3, 0, .45)
for b0 in np.arange(T['eyes'] - .2, T['prints'] - .1, .85): add(thump(), b0, .5); add(thump(), b0 + .22, .32)
add(tone(1200, 1.4, 'sine', .01, 1.0, 1150) * .4, T['eyes'], .14)
for c in [.0, 6.1]: n2 = int(.2 * SR); add(rng.standard_normal(n2) * .4, c, .18)
dark = [(220, 261.63, 329.63), (207.65, 246.94, 311.13)]
for k, t0 in enumerate(np.arange(T['prints'], T['ton'], 3.0)): add(pad_chord([f / 2 for f in dark[k % 2]] + list(dark[k % 2]), min(3.6, T['ton'] + .1 - t0), .05), t0)
for k in range(12): n2 = int(.09 * SR); add(bp_fast(rng.standard_normal(n2), 400, 3500) * np.exp(-np.arange(n2) / 900) * .5, T['prints'] + .35 + k * .3, .22, .3)
add(tone(880, .9, 'sine', .01, .7, 820) * .5, T['van'], .15)
n2 = int((T['ton'] - T['guess']) * SR); add(np.sin(2 * np.pi * 4200 * np.arange(n2) / SR) * (np.sin(2 * np.pi * 18 * np.arange(n2) / SR) > .6) * .1, T['guess'], .15)
prog = [(261.63, 329.63, 392), (220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)]
t0 = T['ton']; k = 0
while t0 < T['rent']: add(pad_chord([f / 2 for f in prog[k % 4]] + list(prog[k % 4]), min(3.6, T['rent'] + .3 - t0), .05), t0); t0 += 3.0; k += 1
i = 0
while T['ton'] + i * .36 < T['rent'] - .3:
    f = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25][i % 6]; add(tone(f, .35, 'sine', .004, .25), T['ton'] + i * .36, .03, ((i % 2) - .5) * .5); i += 1
for k in range(18): add(popfx(), T['ton'] + .2 + k * .09, .12, rng.uniform(-.6, .6))
for k in range(10): add(coin(), T['ton'] + .3 + k * .12, .05, rng.uniform(-.7, .7))
chime(T['tres'] + .1, [523.25, 659.25, 783.99, 1046.5, 1318.5], .15)
chime(T['chest'], [783.99, 987.77, 1174.66], .12); chime(T['flag'], [659.25, 830.61, 987.77, 1318.5], .12)
for i in range(16): add(tone([392, 466.16, 523.25, 466.16][i % 4], .18, 'tri', .002, .1), T['hunt'] + .1 + i * .33, .07)
chime(T['live'] + .1, [659.25, 783.99, 987.77, 1318.5], .14)
for k in range(6): add(popfx(), T['live'] + .8 + k * .85, .15)
n2 = int((59 - T['rent']) * SR); tt = np.arange(n2) / SR
add((np.sin(2 * np.pi * 55 * tt) + .5 * np.sin(2 * np.pi * 82.5 * tt)) * np.minimum(1, tt / 2) * .3, T['rent'], .4)
for t0 in np.arange(T['rent'], 59, 3.0): add(pad_chord([110, 130.81, 164.81, 220], min(3.6, 59 - t0), .04), t0)
add(coin(), T['only14'], .1)
for b0 in [T['dark'] + .2, T['dark'] + 1.1, T['poll'] + .5, T['poll'] + 1.4]: add(thump(), b0, .4); add(thump(), b0 + .22, .28)
for c in [T['prints'], T['guess'], T['ton'], T['tres'], T['hunt'], T['live'], T['rent'], T['poll']]: add(whoosh(.4), c - .15, .22)
for c in [.3, T['gate'], T['prints'] + .3, T['van'], T['ton'] + .1, T['chest'], T['flag'], T['only'], T['nohint'], T['rent'] + .1, T['only14'], T['dark'], T['poll'] + .3, T['poll'] + .5, T['poll'] + .7, T['card']]: add(popfx(), c, .18)
mix = np.stack([L, R], 1); mix /= max(1e-6, np.abs(mix).max()) / .8
fo = int(1.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open('/tmp/ep14/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('sfx ok')
