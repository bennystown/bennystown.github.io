import numpy as np, wave
SR = 44100; DUR = 115.92; N = int(SR * DUR)
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

T = {"sunday": 0.62, "rent0": 4.86, "every0": 5.98, "biggest": 9.26, "first": 11.63, "lastn": 14.1, "voted": 15.26, "alarmw": 16.58, "sausw": 17.58, "eight": 19.34, "four": 20.78, "left": 23.1, "two": 23.9, "nomoney": 26.3, "flash": 27.1, "great": 28.63, "put": 29.58, "vanw": 30.46, "one": 31.38, "snoww": 32.54, "bed": 33.58, "couldnt": 35.18, "three": 36.97, "alarm": 38.34, "outthere": 39.45, "ran": 40.78, "pitch": 42.54, "noflash2": 43.82, "onlyred": 45.26, "sausage2": 47.5, "gone": 48.7, "andthen": 50.3, "eyes": 51.42, "front": 52.62, "kitten": 54.7, "tiny": 56.06, "mouth": 59.54, "hungry": 60.3, "likeme": 61.94, "took": 63.34, "ofcourse": 65.02, "pigeon": 65.9, "second": 66.7, "classic": 68.46, "morning": 69.78, "chest": 72.06, "remember": 73.9, "rent2": 75.1, "five": 76.42, "each": 80.06, "look": 81.18, "amount": 82.73, "euros": 84.3, "never": 85.66, "life": 87.74, "newn": 88.78, "welcome": 90.86, "houses": 92.3, "oh": 94.75, "treasure": 95.98, "nohints": 99.34, "so": 100.46, "real": 103.18, "fix": 104.86, "cabin": 106.06, "kneeds": 108.22, "vote": 109.9, "name": 111.26, "end": 113.02, "dur": 115.92}
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
# --- S1 hook: bright music, coins, RENT DAY chime
music(0, T['first'], happy, .055)
for k in range(7): add(coin(), T['every0'] + k * .22, .07, (k - 3) / 4)
for k in range(30): add(coin(), T['rent0'] + .1 + k * .17 + rng.uniform(0, .08), .035, rng.uniform(-.8, .8))
chime(T['rent0'] - .05, [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98], .16, .06); add(register(), T['rent0'], .25)
chime(T['biggest'], [783.99, 987.77, 1174.66, 1567.98], .1)
# --- S2 rewind
add(rewind(T['voted'] - T['first'] - .1), T['first'] + .05, .35)
# --- S3 shop: light music, register on each buy, sad notes
music(T['voted'], T['put'] - .2, [(293.66, 369.99, 440), (246.94, 293.66, 369.99), (196, 246.94, 293.66), (220, 277.18, 329.63)], .04, True, 3.0, .025)
steps(T['voted'], T['voted'] + 1.6, .32, .18)
add(register(), T['eight'], .3); add(register(), T['four'], .3)
add(tone(392, .35, 'tri', .01, .3, 370) * .5, T['great'] - .1, .14); add(tone(349, .6, 'tri', .01, .5, 300) * .5, T['great'] + .25, .14)
add(tone(220, .5, 'square', .01, .4, 160) * .3, T['nomoney'] + .1, .12)
# --- S4 trap at dusk
music(T['put'] - .2, T['couldnt'] - .3, [(220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66), (164.81, 207.65, 246.94)], .045, False)
n0 = int(.06 * SR); add(bp_fast(rng.standard_normal(n0), 1500, 6000) * np.exp(-np.arange(n0) / 300), T['put'] + .3, .3); add(tone(1760, .12, 'square', .001, .06), T['put'] + .35, .06)
add(tone(1320, .4, 'sine', .002, .3) * .6, T['one'] + .38, .18); add(tone(1980, .3, 'sine', .002, .2) * .4, T['one'] + .4, .12)
steps(T['bed'] - .3, T['bed'] + .7, .3, .16)
# --- S5 bed: quiet night, tick, then the ALARM
n1 = int((T['alarm'] - T['couldnt'] + .4) * SR); tt = np.arange(n1) / SR
add(bp_fast(rng.standard_normal(n1), 150, 600) * .35 * (.6 + .4 * np.sin(tt * .7)), T['couldnt'] - .35, .3)
for q in np.arange(T['couldnt'], T['alarm'], 1.0): add(tone(2400, .03, 'square', .001, .015) * .4, q, .06)
add(tone(1500, .25, 'square', .001, .2) * .4, T['three'], .12)
for b0 in np.arange(T['three'] + .2, T['alarm'] - .1, .7): add(thump(), b0, .35)
add(siren(T['kitten'] + .8 - T['alarm']), T['alarm'], .22)
add(whoosh(.5), T['alarm'] - .05, .3)
# --- S6 dark: heartbeat + stings
for b0 in np.arange(T['ran'], T['kitten'] - .2, .82): add(thump(), b0, .48); add(thump(), b0 + .22, .3)
steps(T['ran'] - .4, T['ran'] + .5, .18, .2)
n2 = int((T['kitten'] - T['pitch']) * SR); tt = np.arange(n2) / SR
add((np.sin(2 * np.pi * 55 * tt) + .5 * np.sin(2 * np.pi * 58.3 * tt)) * np.minimum(1, tt / 1.2) * .35, T['pitch'], .5)
add(tone(880, 1.4, 'sine', .01, 1.0, 820) * .5, T['gone'], .2); add(whoosh(.4), T['gone'] - .1, .25)
add(tone(1568, 1.8, 'sine', .3, 1.4, 1500) * .4, T['eyes'] - .2, .15)
add(thump(), T['front'], .7); add(tone(110, .8, 'saw', .005, .5, 55) * .4, T['front'], .3)
# --- S7 kitten: warm reveal + meows
music(T['kitten'], T['took'], [(261.63, 329.63, 392), (220, 277.18, 329.63), (246.94, 293.66, 369.99), (196, 246.94, 293.66)], .05, True, 2.6, .022)
chime(T['kitten'] - .05, [523.25, 659.25, 783.99], .1, .12)
add(meow(.5, 700), T['kitten'] + .55, .22); add(meow(.65, 640), T['mouth'] + .3, .18); add(meow(.45, 760), T['likeme'] + .6, .16)
# --- S8 inside + pigeon
add(tone(180, .7, 'saw', .05, .5, 140) * .15, T['took'], .2)
add(flap(10), T['pigeon'] - .8, .3); add(flap(12), T['second'] + .2, .3)
for q in range(2): add(tone(420, .25, 'sine', .02, .2, 380) * .6 + tone(840, .25, 'sine', .02, .2, 760) * .2, T['ofcourse'] + .2 + q * .45, .12)
add(tone(300, .35, 'tri', .002, .25, 650), T['classic'] - .1, .14)
# --- S9 morning: birds, soft, then RENT DAY fanfare
music(T['morning'] - .2, T['rent2'] - .1, [(261.63, 329.63, 392), (293.66, 349.23, 440), (220, 261.63, 329.63), (196, 246.94, 293.66)], .045, False)
for q in range(6): add(tone(2600 + rng.uniform(-200, 300), .12, 'sine', .005, .08, 3200) * .4, T['morning'] + .4 + q * .55 + rng.uniform(0, .2), .08, rng.uniform(-.6, .6))
chime(T['rent2'] - .05, [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093], .17, .05); add(register(), T['rent2'] + .05, .3)
for k in range(20): add(coin(), T['rent2'] + .1 + k * .07, .05, rng.uniform(-.8, .8))
# --- S10 rent map: coin storm + rising synth + big hit at the amount
music(T['five'] - .3, T['never'], happy, .055, True, 2.4, .03)
at = T['five'] - .2; gap = .22
while at < T['amount'] + .3: add(coin(), at, .05, rng.uniform(-.8, .8)); gap = max(.035, gap * .93); at += gap
n3 = int((T['amount'] + .3 - T['five']) * SR); tt = np.arange(n3) / SR; f = 200 * (4 ** (tt / tt[-1])); add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, tt / 1) * .25, T['five'], .25)
add(register(), T['amount'] + .2, .4); chime(T['amount'] + .2, [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093], .2, .04)
n4 = int(1.6 * SR); add(bp_fast(rng.standard_normal(n4), 500, 4000) * np.sin(np.linspace(0, np.pi, n4)) ** 2 * .5, T['amount'] + .25, .3)
# --- S11 rich: emotional
music(T['never'] - .1, T['newn'], [(261.63, 329.63, 392), (220, 261.63, 329.63), (174.61, 220, 261.63), (196, 246.94, 293.66)], .055, False)
# --- S12 new neighbours: pops
music(T['newn'] - .15, T['oh'], happy, .05, True, 2.4, .028)
for q in range(33): add(popfx(), T['newn'] + .15 + q * .085, .09, rng.uniform(-.6, .6))
chime(T['welcome'], [659.25, 783.99, 987.77, 1318.5], .12)
# --- S13 treasure: sneaky plucks
for i in range(int((T['so'] - T['oh']) / .3)): add(tone([392, 466.16, 523.25, 466.16][i % 4], .18, 'tri', .002, .1), T['oh'] + i * .3, .07)
# --- S14 decision + poll
music(T['so'] - .1, T['dur'], [(261.63, 329.63, 392), (246.94, 293.66, 392), (220, 261.63, 329.63), (196, 246.94, 293.66)], .05, True, 3.0, .025)
for c in [T['fix'] - .1, T['cabin'], T['kneeds']]: add(popfx(), c, .2)
chime(T['vote'], [523.25, 659.25, 783.99, 1046.5], .14); add(meow(.5, 720), T['name'] + .9, .18); chime(T['end'] + .3, [659.25, 783.99, 1046.5, 1318.5], .12)
# --- whooshes on cuts
for c in [T['voted'], T['put'] - .15, T['ran'] + .15, T['five'] - .3, T['never'] - .1, T['newn'] - .15, T['oh'] - .1, T['so'] - .1]: add(whoosh(.4), c - .15, .22)
mix = np.stack([L, R], 1); mix /= max(1e-6, np.abs(mix).max()) / .8
fo = int(1.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open('/tmp/ep15/sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('sfx ok')
