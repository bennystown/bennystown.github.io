import json, re, difflib
from collections import Counter

def norm(u):
    u = u.strip().replace(' ', '')
    return u

def sim(a, b):
    a = a.lower(); b = b.lower()
    if a == b: return 1.0
    return difflib.SequenceMatcher(None, a, b).ratio()

class Slot:
    def __init__(self, u, n):
        self.u = Counter([u]); self.n = Counter([n] if n else [])
    def best(self): return self.u.most_common(1)[0][0]
    def add(self, u, n):
        self.u[u] += 1
        if n: self.n[n] += 1

def merge(frames, slots, search_all=False):
    gaps = 0
    for fr in frames:
        L = [(norm(u), n) for _, u, n in fr if len(norm(u)) >= 2]
        if not L: continue
        if not slots:
            slots += [Slot(u, n) for u, n in L]; continue
        best = None
        lo = 0 if search_all else max(0, len(slots) - 25)
        for p in range(lo, len(slots)):
            ov = min(len(L), len(slots) - p)
            m = sum(1 for i in range(ov) if sim(L[i][0], slots[p + i].best()) >= 0.8)
            if ov and m >= max(1, int(0.6 * ov)) and (m >= 2 or ov == 1):
                score = (m, -p)
                if best is None or score > best[0]: best = (score, p, ov)
        search_all = False
        if best is None:
            gaps += 1
            slots.append(Slot('<<GAP>>', ''))
            slots += [Slot(u, n) for u, n in L]
            continue
        _, p, ov = best
        for i in range(ov):
            slots[p + i].add(*L[i])
        slots += [Slot(u, n) for u, n in L[ov:]]
    return gaps

def clean_user(u):
    u = re.sub(r'[^A-Za-z0-9._]', '', u)
    out = []
    for i, ch in enumerate(u):
        if ch == 'O':
            nb = u[max(0, i-1):i] + u[i+1:i+2]
            out.append('0' if re.search(r'\d', nb) else 'o')
        elif ch == 'I': out.append('l')
        else: out.append(ch.lower())
    return ''.join(out)

def clean_nick(n):
    n = re.sub(r'\.\.\.$|…$', '', n).strip()
    n = re.sub(r'[^\w .\-\'!?&()]+$', '', n).strip()
    n = re.sub(r'^[^\w]+', '', n).strip()
    return n

if __name__ == '__main__':
    f1 = json.load(open('/tmp/ocr/f1_ocr_0.json'))
    f2 = json.load(open('/tmp/ocr/f2_ocr_0.json'))
    slots = []
    g1 = merge([f1[k] for k in sorted(f1)], slots)
    n1 = len(slots)
    g2 = merge([f2[k] for k in sorted(f2)], slots, search_all=True)
    print('gaps', g1, g2, 'slots after v1', n1, 'total', len(slots))
    res = []
    for s in slots:
        b = s.best()
        if b == '<<GAP>>': res.append({'gap': True}); continue
        nk = s.n.most_common(1)[0][0] if s.n else ''
        res.append({'name': clean_user(b), 'raw': dict(s.u), 'nick': clean_nick(nk)})
    json.dump(res, open('/tmp/ocr/merged.json', 'w'), ensure_ascii=False, indent=0)
