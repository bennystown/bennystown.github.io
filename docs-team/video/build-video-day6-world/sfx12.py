import numpy as np, wave
SR = 44100; DUR = 58.0; N = int(SR * DUR)
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
# music: wonder pads (bright, then mysterious minor at the red light)
prog = [(261.63, 329.63, 392), (220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)]
t0 = .2; k = 0
while t0 < 42.4: add(pad_chord([f / 2 for f in prog[k % 4]] + list(prog[k % 4]), min(3.6, 42.8 - t0), .05), t0); t0 += 3.0; k += 1
dark = [(220, 261.63, 329.63), (207.65, 246.94, 311.13), (174.61, 220, 261.63), (164.81, 207.65, 246.94)]
t0 = 42.6; k = 0
while t0 < DUR: add(pad_chord([f / 2 for f in dark[k % 4]] + list(dark[k % 4]), min(3.6, DUR - t0), .055), t0); t0 += 3.0; k += 1
# soft arpeggio while we fly over the towns
for i in range(48):
    f = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25][i % 6]; add(tone(f, .35, 'sine', .004, .25), 13.5 + i * .36, .035, ((i % 2) - .5) * .5)
# whooshes on every cut, pops on stamps
for c in [3.2, 13.3, 18.7, 25.1, 31.0, 37.8, 38.5, 39.2, 39.8, 40.5, 42.5]: add(whoosh(.4), c, .22)
for c in [.3, 2.9, 6.0, 13.5, 16.2, 18.9, 20.3, 23.0, 25.3, 29.4, 32.6, 34.3, 35.6, 36.6, 41.0, 45.5, 48.8, 50.0, 53.5]: add(popfx(), c, .2)
chime(2.86, [523.25, 659.25, 783.99, 1046.5, 1318.5], .14)                  # WORLD
chime(12.4, [783.99, 987.77, 1174.66], .12)                                 # that's us
for k in range(14): add(coin(), 23.0 + k * .08, .06, rng.uniform(-.7, .7))  # move-ins: money comes in
chime(23.0, [523.25, 659.25, 783.99, 1046.5], .1)
chime(27.6, [659.25, 830.61, 987.77, 1318.5], .12)                          # house of the day
# 3D: footsteps on the street
at = 31.4
while at < 37.6: n = int(.07 * SR); add(bp_fast(rng.standard_normal(n), 300, 2500) * np.exp(-np.arange(n) / 600) * .5, at, .25, rng.uniform(-.2, .2)); at += .42
# weather: night crickets, rain, snow wind
n = int(.7 * SR); tt = np.arange(n) / SR
add(np.sin(2 * np.pi * 4200 * tt) * (np.sin(2 * np.pi * 18 * tt) > .6) * .2, 38.6, .25)
n = int(.6 * SR); add(bp_fast(rng.standard_normal(n), 800, 6000) * np.minimum(1, np.arange(n) / 2000), 39.3, .3)
n = int(.7 * SR); add(bp_fast(rng.standard_normal(n), 200, 900) * np.sin(np.linspace(0, np.pi, n)), 39.9, .35)
# red light: low drone + heartbeat
n = int((49.9 - 44.9) * SR); tt = np.arange(n) / SR; drone = (np.sin(2 * np.pi * 55 * tt) + .5 * np.sin(2 * np.pi * 82.5 * tt)) * np.minimum(1, tt / 1.5) * .3
add(drone, 44.9, .5)
for b0 in np.arange(45.5, 49.8, .9): add(thump(), b0, .45); add(thump(), b0 + .22, .3)
add(tone(880, 1.2, 'sine', .01, .9, 830) * .5, 45.5, .2)
# poll + end
chime(50.0, [523.25, 659.25, 783.99], .12); chime(53.5, [523.25, 659.25, 783.99, 1046.5], .14)
mix = np.stack([L, R], 1); mix /= max(1e-6, np.abs(mix).max()) / .8
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open('/tmp/ep12/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('sfx ok')
