/* ================= WORLD v3 — walled Old Town around the original square/park/market + District 2 + walled bridge (concept) ================= */
const W3 = (() => {
const PRE = typeof window !== 'undefined' && window.W3PRE;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const M = .9;                       // ring road centre line distance from a landmark edge
const WALL_H = 44;

/* ---------- small geometry helpers ---------- */
function SegHash(cell) {
  const m = new Map(), key = (x, y) => (x + 4000) * 8000 + (y + 4000);
  return {
    add(a, b, tag) { const s = { a, b, tag }; const x0 = Math.floor(Math.min(a[0], b[0]) / cell), x1 = Math.floor(Math.max(a[0], b[0]) / cell), y0 = Math.floor(Math.min(a[1], b[1]) / cell), y1 = Math.floor(Math.max(a[1], b[1]) / cell);
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) { const k = key(x, y); let L = m.get(k); if (!L) m.set(k, L = []); L.push(s); } },
    addPoly(P, tag) { for (let k = 1; k < P.length; k++) this.add(P[k - 1], P[k], tag); },
    near(u, v, r, skip) { let best = r, bp = null, bt = null; const x0 = Math.floor((u - r) / cell), x1 = Math.floor((u + r) / cell), y0 = Math.floor((v - r) / cell), y1 = Math.floor((v + r) / cell);
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) { const L = m.get(key(x, y)); if (!L) continue;
        for (const s of L) { if (skip != null && s.tag === skip) continue; const du = s.b[0] - s.a[0], dv = s.b[1] - s.a[1], l2 = du * du + dv * dv || 1e-9, t = clamp(((u - s.a[0]) * du + (v - s.a[1]) * dv) / l2, 0, 1), px = s.a[0] + du * t, py = s.a[1] + dv * t, d = Math.hypot(px - u, py - v); if (d < best) { best = d; bp = [px, py]; bt = s.tag; } } }
      return { d: best, p: bp, tag: bt }; }
  };
}
const plen = P => { let L = 0; for (let k = 1; k < P.length; k++) L += dist(P[k - 1], P[k]); return L; };
function resample(P, step, closed) {
  const Q = closed ? P.concat([P[0]]) : P, out = [Q[0]]; let acc = 0;
  for (let k = 1; k < Q.length; k++) { let a = Q[k - 1]; const b = Q[k]; let L = dist(a, b);
    while (acc + L >= step) { const t = (step - acc) / L; a = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; out.push(a); L = dist(a, b); acc = 0; }
    acc += L; }
  if (!closed && dist(out[out.length - 1], Q[Q.length - 1]) > .05) out.push(Q[Q.length - 1]);
  if (closed && dist(out[out.length - 1], out[0]) < step * .5) out.pop();
  return out;
}
function chaikin(P, closed) { const out = []; const n = P.length; for (let k = 0; k < (closed ? n : n - 1); k++) { const a = P[k], b = P[(k + 1) % n]; out.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } if (!closed) { out.unshift(P[0]); out.push(P[n - 1]); } return out; }
// iso-contour of f = 0 (marching squares) → closed loops
function contour(f, u0, v0, u1, v1, s) {
  const nx = Math.ceil((u1 - u0) / s), ny = Math.ceil((v1 - v0) / s), W = ny + 1, F = new Float32Array((nx + 1) * W);
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) F[i * W + j] = f(u0 + i * s, v0 + j * s);
  const val = (i, j) => F[i * W + j], P = new Map(), adj = new Map();
  const ep = (id, i0, j0, i1, j1) => { if (!P.has(id)) { const a = val(i0, j0), b = val(i1, j1), t = a / (a - b); P.set(id, [u0 + (i0 + (i1 - i0) * t) * s, v0 + (j0 + (j1 - j0) * t) * s]); } return id; };
  const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const c0 = val(i, j) < 0, c1 = val(i + 1, j) < 0, c2 = val(i + 1, j + 1) < 0, c3 = val(i, j + 1) < 0, E = [];
    if (c0 !== c1) E.push(ep('h' + i + '_' + j, i, j, i + 1, j));
    if (c1 !== c2) E.push(ep('v' + (i + 1) + '_' + j, i + 1, j, i + 1, j + 1));
    if (c2 !== c3) E.push(ep('h' + i + '_' + (j + 1), i + 1, j + 1, i, j + 1));
    if (c3 !== c0) E.push(ep('v' + i + '_' + j, i, j + 1, i, j));
    if (E.length === 2) link(E[0], E[1]); else if (E.length === 4) { link(E[0], E[3]); link(E[1], E[2]); }
  }
  const seen = new Set(), loops = [];
  for (const start of adj.keys()) { if (seen.has(start)) continue; const L = []; let id = start, prev = null;
    while (id && !seen.has(id)) { seen.add(id); L.push(P.get(id)); const nb = adj.get(id).find(n => n !== prev && !seen.has(n)); prev = id; id = nb; }
    if (L.length > 8) { const Q = chaikin(resample(L, .45, true), true); Q.push(Q[0]); loops.push(Q); } }
  return loops;
}

/* ---------- the landmarks of the live site stay exactly where and how they are ---------- */
const rectSD = (Z, u, v) => { const dx = Math.max(Z.u0 - u, 0, u - Z.u1), dy = Math.max(Z.v0 - v, 0, v - Z.v1); return dx || dy ? Math.hypot(dx, dy) : -Math.min(u - Z.u0, Z.u1 - u, v - Z.v0, Z.v1 - v); };
const LM_RECTS = [SQUARE, HALL].concat(SITES.filter(Z => Z.key !== '-4,-4')).concat(BPARKS.map(p => p.Z)).concat(MK_RECTS.map(r => ({ u0: r[0], v0: r[1], u1: r[2], v1: r[3] })));
const lmSDF = (u, v) => { let d = parkDist(u, v) - .45; for (const Z of LM_RECTS) { const e = rectSD(Z, u, v); if (e < d) d = e; } return d; };
const LM_LOOPS = PRE ? PRE.loops : contour((u, v) => lmSDF(u, v) - M, -36, -36, 74, 74, .25);

/* ---------- a town: wall + street network that never dead-ends + lots + gardens ---------- */
function makeTown(o) {
  const C = o.C, cap = o.cap, wob = a => 1 + .07 * Math.sin(a * 3 + o.seed) + .045 * Math.sin(a * 5 + o.seed * 2);
  const sdf = o.sdf, loops = o.loops;
  let R = o.minR || 40;
  for (const L of loops) for (const q of L) { const a = Math.atan2(q[1] - C[1], q[0] - C[0]); R = Math.max(R, (dist(q, C) + 6) / wob(a)); }
  let sc = 1, T;
  for (let attempt = 0; attempt < 16; attempt++) {
    T = build(R, sc); const n = T.lots.length;
    if (n >= cap * 1.003 && n <= cap * 1.06) break;
    if (n > cap * 1.06) sc *= Math.pow(n / (cap * 1.03), .7);
    else if (sc > .9) sc = Math.max(.9, sc * Math.pow(n / (cap * 1.03), .7)); else R *= Math.sqrt(cap * 1.03 / n);
  }
  return T;

  function build(R, sc) {
    const rs = seeded(Math.round(o.seed * 1000) + 7), T = { C, R, wob, o, sc };
    const ph = [rs() * 9, rs() * 9, rs() * 9, rs() * 9], rot = o.rot || 0, cr = Math.cos(rot), sr = Math.sin(rot);
    const innerR = a => R * wob(a) - 2.2, outerR = a => R * wob(a) + 1.2;
    T.innerR = innerR; T.outerR = outerR;
    const toW = (x, y) => { const A = sstep(o.flat0, o.flat1, Math.hypot(x, y)) * 1.15; const wx = x + A * (3.4 * Math.sin(y * .052 + ph[0]) + 1.7 * Math.sin((x + y) * .085 + ph[1])), wy = y + A * (3.4 * Math.sin(x * .048 + ph[2]) + 1.7 * Math.sin((x - y) * .075 + ph[3])); return [C[0] + wx * cr - wy * sr, C[1] + wx * sr + wy * cr]; };
    const polar = (u, v) => { const du = u - C[0], dv = v - C[1]; return [Math.hypot(du, dv), Math.atan2(dv, du)]; };
    const grad = (u, v) => { const e = .05, gx = sdf(u + e, v) - sdf(u - e, v), gy = sdf(u, v + e) - sdf(u, v - e), l = Math.hypot(gx, gy) || 1; return [gx / l, gy / l]; };
    // > 0 where a grid street may run: inside the wall ring, outside the landmark rings, and never running alongside a ring closer than a row of houses
    const g = (u, v, du, dv) => {
      const [r, a] = polar(u, v), l = Math.hypot(du, dv) || 1, dx = du / l, dy = dv / l;
      const parW = 1 - Math.abs(dx * (u - C[0]) / (r || 1) + dy * (v - C[1]) / (r || 1));
      let gg = innerR(a) - r - 3.1 * parW;
      const s = sdf(u, v) - M; if (s < 3.2) { const [gx, gy] = grad(u, v), par = 1 - Math.abs(dx * gx + dy * gy); gg = Math.min(gg, s - 3.1 * par); }
      return gg;
    };
    // the wall ring road
    const ringW = []; for (let k = 0; k < 360; k++) { const a = k / 360 * 6.2832, r = innerR(a); ringW.push([C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r]); } ringW.push(ringW[0]);
    T.rings = [ringW].concat(loops);
    // irregular grid lines (straight near the centre, gently curving further out)
    const lines = [];
    for (const axis of [0, 1]) { let p = -R * 1.25 + rs() * 3; while (p < R * 1.25) { lines.push({ axis, p }); p += (6.4 + rs() * 3.6) * sc; } }
    const at = (L, q) => L.axis ? toW(q, L.p) : toW(L.p, q);
    const segs = [];
    for (const L of lines) {
      const step = .4, Q0 = -R * 1.3, Q1 = R * 1.3; let cur = null, prevOK = false, prevQ = Q0;
      const gq = q => { const a = at(L, q), b = at(L, q + .05); return g(a[0], a[1], b[0] - a[0], b[1] - a[1]); };
      const bis = (qa, qb) => { const fa = gq(qa) > 0; for (let it = 0; it < 18; it++) { const qm = (qa + qb) / 2; if ((gq(qm) > 0) === fa) qa = qm; else qb = qm; } return (qa + qb) / 2; };
      for (let q = Q0; q <= Q1 + 1e-6; q += step) {
        const ok = gq(q) > 0;
        if (ok && !prevOK) { const qs = q === Q0 ? q : bis(prevQ, q); cur = { L, q0: qs, pts: [at(L, qs)] }; if (qs < q - .02) cur.pts.push(at(L, q)); }
        else if (ok) cur.pts.push(at(L, q));
        else if (!ok && prevOK) { const qe = bis(prevQ, q); cur.pts.push(at(L, qe)); cur.q1 = qe; segs.push(cur); cur = null; }
        prevOK = ok; prevQ = q;
      }
      if (cur) { cur.q1 = Q1; segs.push(cur); }
    }
    let streets = segs.filter(s => plen(s.pts) > 1.6).map((s, k) => ({ pts: s.pts, kind: 'street', L: s.L, q0: s.q0, q1: s.q1, id: k }));
    // every street end must sit on another street: snap or add a short connector, otherwise drop the street
    for (let pass = 0; pass < 5; pass++) {
      const H = new SegHash(2.5); T.rings.forEach((P, k) => H.addPoly(P, 'r' + k)); streets.forEach(s => H.addPoly(s.pts, s.id));
      const keep = [], conns = [];
      for (const s of streets) {
        let ok = true; const cc = [];
        for (const end of [0, 1]) { const e = end ? s.pts[s.pts.length - 1] : s.pts[0], n = H.near(e[0], e[1], 4.5, s.id);
          if (!n.p) { ok = false; break; } if (n.d <= .12) continue;
          // first try: simply keep following the street's own line until it meets another street
          let hit = null, q = end ? s.q1 : s.q0; if (s.L) { const ext = [e]; for (let k = 0; k < 40; k++) { q += (end ? 1 : -1) * .2; const p = at(s.L, q); ext.push(p); const m = H.near(p[0], p[1], .25, s.id); if (m.p) { ext.push(m.p); hit = ext; break; } } }
          if (hit) { if (end) { s.pts = s.pts.concat(hit.slice(1)); s.q1 = q; } else { s.pts = hit.slice(1).reverse().concat(s.pts); s.q0 = q; } continue; }
          if (plen(s.pts) < 10) { ok = false; break; } cc.push({ pts: [e, n.p], kind: 'street', id: 'c' + conns.length + cc.length + '_' + pass }); }
        if (ok) { keep.push(s); conns.push(...cc); }
      }
      if (keep.length === streets.length) { streets = keep.concat(conns); break; }
      streets = keep;
    }
    T.streets = streets;
    // gates: the street that reaches the wall closest to each wanted direction becomes the avenue through the gate
    T.gates = [];
    for (const gd of o.gateDirs) {
      let best = null;
      for (const s of streets) { if (!s.L) continue;
        for (const end of [0, 1]) { const e = end ? s.pts[s.pts.length - 1] : s.pts[0], [r, a] = polar(e[0], e[1]); if (Math.abs(innerR(a) - r) > .35) continue;
          const ed = end ? 1 : -1, nb = at(s.L, (end ? s.q1 : s.q0) + ed * .3), dd = [nb[0] - e[0], nb[1] - e[1]], dl = Math.hypot(dd[0], dd[1]) || 1;
          const rad = [(e[0] - C[0]) / r, (e[1] - C[1]) / r]; if ((dd[0] * gd.d[0] + dd[1] * gd.d[1]) / dl < .8 || rad[0] * gd.d[0] + rad[1] * gd.d[1] < .9) continue;
          const perp = Math.abs((e[0] - C[0]) * gd.d[1] - (e[1] - C[1]) * gd.d[0]), sc2 = Math.min(plen(s.pts), 30) - 2.5 * perp;
          if (!best || sc2 > best.sc) best = { sc: sc2, s, end, e }; } }
      if (!best) continue;
      const { s, end } = best, ed = end ? 1 : -1, ext = [best.e]; let q = end ? s.q1 : s.q0, G = null;
      for (let k = 0; k < 60; k++) { q += ed * .3; const p = at(s.L, q), [r, a] = polar(p[0], p[1]); ext.push(p); if (!G && r >= outerR(a)) { G = p; if (!gd.open) break; } if (G && r > outerR(a) + 2.2) break; }
      s.kind = 'avenue';
      const [, ga] = polar(G[0], G[1]);
      T.gates.push({ a: ga, G, open: !!gd.open, ext, dir: gd.d });
      streets.push({ pts: ext, kind: 'avenue', id: 'g' + T.gates.length });
    }
    // street hash (rings count as streets)
    const SH = new SegHash(2.5); T.rings.forEach((P, k) => SH.addPoly(P, 'r' + k)); streets.forEach(s => SH.addPoly(s.pts, s.id)); T.SH = SH;
    const inTown = (u, v, m) => { const [r, a] = polar(u, v); return r < innerR(a) - m; };
    // back alleys through deep blocks: midway between two neighbouring grid lines, from street to street
    T.alleys = []; const AH = new SegHash(2.5);
    for (const axis of [0, 1]) { const Ls = lines.filter(L => L.axis === axis);
      for (let k = 0; k + 1 < Ls.length; k++) { if (Ls[k + 1].p - Ls[k].p < 7.4) continue; const ML = { axis, p: (Ls[k].p + Ls[k + 1].p) / 2 };
        const S = []; for (let q = -R * 1.3; q <= R * 1.3; q += .35) { const p = at(ML, q), n = SH.near(p[0], p[1], 3.0); S.push({ p, on: n.d < .45, deep: n.d >= 2.85 && inTown(p[0], p[1], 1.2) && sdf(p[0], p[1]) > M + 2.4 }); }
        let last = -1;
        for (let i = 0; i < S.length; i++) { if (!S[i].on) continue;
          if (last >= 0 && i - last > 4) { const piece = S.slice(last, i + 1), Lp = (i - last) * .35;
            if (Lp > 3 && Lp < 46 && piece.every((x, j) => { const dj = Math.min(j, piece.length - 1 - j) * .35; return dj < 1.9 || x.deep; })) { const P = piece.map(x => x.p); T.alleys.push(P); AH.addPoly(P, T.alleys.length); } }
          last = i; } } }
    // lots on both sides of every street, ordered from the centre outwards
    T.lots = []; const grid = new Map(), key = (u, v) => Math.floor(u / 1.6) * 100000 + Math.floor(v / 1.6);
    const tooNear = (u, v) => { const gx = Math.floor(u / 1.6), gy = Math.floor(v / 1.6); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const L = grid.get((gx + a) * 100000 + gy + b); if (L && L.some(p => (p[0] - u) ** 2 + (p[1] - v) ** 2 < 1.45 * 1.45)) return true; } return false; };
    const nearGate = (u, v) => T.gates.some(gt => dist(gt.G, [u, v]) < 3.4);
    const okLot = (u, v) => inTown(u, v, .95) && sdf(u, v) > M + 1.0 && SH.near(u, v, 1.1).d >= 1.1 && AH.near(u, v, .95).d >= .95 && !nearGate(u, v) && !(o.plazaR && dist([u, v], C) < o.plazaR + 2.2);
    const all = T.rings.map(P => ({ pts: P, closed: true })).concat(streets);
    for (const s of all) { const P = s.pts; let acc = rs() * 1.2;
      for (let k = 1; k < P.length; k++) { const a = P[k - 1], b = P[k], du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv); if (!L) continue; acc += L; if (acc < 1.62) continue; acc = rs() * .25;
        const tu = du / L, tv = dv / L; for (const sd of [-1, 1]) { const off = 1.38 + rs() * .22, nu = -tv * sd, nv = tu * sd, u = b[0] + nu * off + (rs() - .5) * .2, v = b[1] + nv * off + (rs() - .5) * .2;
          if (!okLot(u, v) || tooNear(u, v)) continue; const Lr = [u, v, dist([u, v], C) + rs() * 2.2, tu, tv, nu, nv]; T.lots.push(Lr); const kk = key(u, v); if (!grid.has(kk)) grid.set(kk, []); grid.get(kk).push(Lr); } } }
    T.lots.sort((p, q) => p[2] - q[2]);
    const LH = new SegHash(2); T.lots.forEach(L => LH.add([L[0], L[1]], [L[0], L[1]], 1)); T.LH = LH;
    // hedges behind the houses, trees + vegetable gardens in the block interiors, trees between ring road and wall
    T.hedges = []; T.trees = []; T.beds = [];
    T.lots.forEach((L, li) => { const [u, v, , tu, tv, nu, nv] = L, cu = u + nu * 1.05, cv = v + nv * 1.05; if (SH.near(cu, cv, 1.95).d < 1.95 || AH.near(cu, cv, .7).d < .7 || !inTown(cu, cv, 1.4) || sdf(cu, cv) < M + 1.8) return; const hh = [[cu - tu * .74, cv - tv * .74], [cu + tu * .74, cv + tv * .74]]; hh.li = li; T.hedges.push(hh); });
    const tr = seeded(Math.round(o.seed * 77) + 3), x0 = C[0] - R * 1.2, y0 = C[1] - R * 1.2;
    for (let x = x0; x < C[0] + R * 1.2; x += 1.45) for (let y = y0; y < C[1] + R * 1.2; y += 1.45) {
      const u = x + (tr() - .5) * 1.1, v = y + (tr() - .5) * 1.1, [r, a] = polar(u, v); if (r > outerR(a) - 1.4) continue;
      if (r > innerR(a) + 1.1) { if (tr() < .3) T.trees.push([u, v, tr() < .35 ? 1 : 0, .85]); continue; }
      if (!inTown(u, v, 1.3) || sdf(u, v) < M + 1.4 || (o.plazaR && dist([u, v], C) < o.plazaR + 2)) continue;
      if (SH.near(u, v, 2.05).d < 2.05 || LH.near(u, v, .95).d < .95 || AH.near(u, v, .75).d < .75) continue;
      const rr = tr(); if (rr < .07) T.beds.push([u, v, tr()]); else if (rr < .95) T.trees.push([u, v, tr() < .3 ? 1 : 0, .8 + tr() * .2]);
    }
    // street lamps along the streets
    T.lamps = []; for (const s of streets) { const P = s.pts; let acc = 3 + rs() * 3; for (let k = 1; k < P.length; k++) { const a = P[k - 1], b = P[k], L = dist(a, b); if (!L) continue; acc += L; if (acc < 7.5) continue; const tu = (b[0] - a[0]) / L, tv = (b[1] - a[1]) / L, u = b[0] - tv * .72, v = b[1] + tu * .72; if (LH.near(u, v, .85).d < .85 || !inTown(u, v, .4)) continue; acc = 0; T.lamps.push([u, v]); } }
    return T;
  }
}

/* ---------- precomputed layout (world-data): rebuild a town from stored data instead of generating it ---------- */
function fromPre(d) {
  const wob = a => 1 + .07 * Math.sin(a * 3 + d.seed) + .045 * Math.sin(a * 5 + d.seed * 2), R = d.R, C = d.C;
  const T = { C, R, wob, o: { seed: d.seed, plazaR: d.plazaR }, sc: d.sc, innerR: a => R * wob(a) - 2.2, outerR: a => R * wob(a) + 1.2 };
  T.streets = d.streets.map(s => ({ pts: s.p, kind: s.k, id: s.id })); T.rings = d.rings; T.alleys = d.alleys; T.lots = d.lots; T.trees = d.trees; T.lamps = d.lamps; T.beds = d.beds || [];
  T.gates = d.gates.map(g => ({ a: g.a, G: g.G, open: g.open, ext: g.ext, dir: g.dir }));
  const SH = new SegHash(2.5); T.rings.forEach((P, k) => SH.addPoly(P, 'r' + k)); T.streets.forEach(s => SH.addPoly(s.pts, s.id)); T.SH = SH;
  return T;
}
/* ---------- Old Town: centred on Benny's square, around the square, town hall, park and marketplace ---------- */
const C1 = [3, 3];
const T1 = PRE ? fromPre(PRE.T1) : makeTown({ C: C1, seed: 1.3, cap: 5000, sdf: lmSDF, loops: LM_LOOPS, flat0: 34, flat1: 70, rot: 0,
  gateDirs: [{ d: [1, 0], open: true }, { d: [0, 1] }, { d: [-1, 0] }, { d: [0, -1] }] });
const GA1 = T1.gates.find(g => g.open), G1 = GA1.G;
/* ---------- District 2: its own centre (a little island square in a canal), grows outwards from there ---------- */
const GAP = 34, P2R = 5.2;
function mkT2(C) { return makeTown({ C, seed: 4.1, cap: 5000, sdf: (u, v) => dist([u, v], C) - P2R, loops: [(() => { const P = []; for (let k = 0; k < 120; k++) { const a = k / 120 * 6.2832; P.push([C[0] + Math.cos(a) * (P2R + M), C[1] + Math.sin(a) * (P2R + M)]); } return P; })()],
  flat0: 6, flat1: 26, rot: .12, plazaR: P2R, gateDirs: [{ d: [-1, 0], open: true }, { d: [0, 1] }, { d: [1, 0] }, { d: [0, -1] }] }); }
let T2 = PRE ? fromPre(PRE.T2) : mkT2([G1[0] + GAP + 75, G1[1]]);
if (!PRE) { const g = T2.gates.find(x => x.open).G, du = G1[0] + GAP - g[0], dv = G1[1] - g[1]; T2 = mkT2([T2.C[0] + du, T2.C[1] + dv]); }
const C2 = T2.C, GA2 = T2.gates.find(g => g.open), G2 = GA2.G;
const MID = [(G1[0] + G2[0]) / 2, (G1[1] + G2[1]) / 2], NRM = [0, 1];
const RIVER = []; for (let s = -170; s <= 170; s += 1.5) { const off = Math.sin(s * .045) * 7 + Math.sin(s * .11) * 2.5; RIVER.push([MID[0] + off, MID[1] + s]); }
// the same river, but on and on to the horizon (only drawn on the map; the boats and the 3D streets use the part above)
const RIVER_FAR = []; for (let s = -900; s <= 900; s += 3) { const off = Math.sin(s * .045) * 7 + Math.sin(s * .11) * 2.5 + Math.sin(s * .013) * Math.max(0, Math.abs(s) - 170) * .12; RIVER_FAR.push([MID[0] + off, MID[1] + s]); }
// houses: #1–5,000 in the Old Town (centre outwards), from #5,001 in District 2 (its own centre outwards)
HOUSES.forEach((h, i) => { const L = i < 5000 ? T1.lots[i] : i < 10000 ? T2.lots[i - 5000] : null; if (L) { h.i = L[0]; h.j = L[1]; h.L3 = L; h.flip = ((i * 2654435761) >>> 0) % 3 === 0; h.town = i < 5000 ? 1 : 2; } else h.town = 0; });
const NEXT2 = T2.lots.slice(Math.min(5000, HOUSES.length - 5000), Math.min(5000, HOUSES.length - 5000 + 40));

/* ---------- styles: Old Town = grey stone, red roofs, dark roads; District 2 = red brick, blue slate roofs, cobbles, blossom trees ---------- */
const STYLE = new Map([[T1, { face: '#a89a80', faceIn: '#beb29a', line: 'rgba(70,55,40,.28)', walk: '#d3c8b0', cren: '#c6baa1', crenTop: '#ddd3bc', stone: '#b8ac93', roof: '#7d2f2a', flag: '#ff2e63', banner: '#ff2e63', ground: '#4f985c',
  curb: '#353a50', road: '#464b63', dash: 'rgba(255,210,90,.6)', hedge: ['#2f6b37', '#3f8a4e', '#5aa868'] }],
  [T2, { face: '#b5735c', faceIn: '#c98b72', line: 'rgba(90,35,20,.3)', walk: '#e0b49a', cren: '#c98b72', crenTop: '#e8c3ac', stone: '#c3826a', roof: '#2f4f8f', flag: '#ffd23f', banner: '#3a7bd5', ground: '#62a35a',
  curb: '#7a6450', road: '#b19a7d', dash: null, hedge: ['#2f6b37', '#468f4a', '#62ad60'] }]]);

/* ---------- walls: vertices run exactly up to each gatehouse ---------- */
function wallize(T) {
  const C = T.C, wp = a => { const r = T.outerR(a); return [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r]; };
  const G = T.gates.slice().sort((p, q) => p.a - q.a); G.forEach(g => { g.dl = 1.65 / T.outerR(g.a); });
  T.segs = []; T.towers = [];
  for (let k = 0; k < G.length; k++) { const g0 = G[k], g1 = G[(k + 1) % G.length]; let a0 = g0.a + g0.dl, a1 = g1.a - g1.dl; if (a1 <= a0) a1 += 6.2832;
    const len = (a1 - a0) * T.R, n = Math.max(2, Math.ceil(len / 1.1));
    for (let q = 0; q < n; q++) { const b0 = a0 + (a1 - a0) * q / n, b1 = a0 + (a1 - a0) * (q + 1) / n; T.segs.push({ p0: wp(b0), p1: wp(b1), am: (b0 + b1) / 2, s: T.segs.length }); }
    const nt = Math.max(1, Math.round((len - 9) / 15)); for (let q = 1; q < nt; q++) { const b = a0 + (a1 - a0) * q / nt; T.towers.push({ p: wp(b), k: 1 }); } }
  for (const g of G) { const P0 = wp(g.a - g.dl), P1 = wp(g.a + g.dl), t = [P1[0] - P0[0], P1[1] - P0[1]], tl = Math.hypot(t[0], t[1]); g.t = [t[0] / tl, t[1] / tl]; g.c = [(P0[0] + P1[0]) / 2, (P0[1] + P1[1]) / 2]; g.wd = tl / 2;
    let n = [g.t[1], -g.t[0]]; if (n[0] * (g.c[0] - C[0]) + n[1] * (g.c[1] - C[1]) < 0) n = [-n[0], -n[1]]; g.n = n;
    for (const sd of [-1, 1]) T.towers.push({ p: wp(g.a + sd * (g.dl + .95 / T.outerR(g.a))), k: 1.25 }); }
}
wallize(T1); wallize(T2);

/* ---------- District 3 (#10,001+): until the town reaches 10,000 neighbours a fog bank lies over the land north of the Old Town.
   At 10,000 the fog lifts and the district gets built (wall stone by stone, streets, the Benny Coaster in the middle).
   Its layout is precomputed in world-d3.js and only loaded when it is needed. ---------- */
const D3AT = 10000, D3C = [-18.83, -256.06], D3R = 114.5, D3SEED = 7.3, D3G = [3.4, -147.0], G1N = T1.gates.find(g => Math.abs(g.a + 1.5708) < .4);
const d3wob = a => 1 + .07 * Math.sin(a * 3 + D3SEED) + .045 * Math.sin(a * 5 + D3SEED * 2);
const inD3 = (u, v, m) => { const du = u - D3C[0], dv = v - D3C[1]; return Math.hypot(du, dv) < D3R * d3wob(Math.atan2(dv, du)) + 1.2 + (m || 0); };
const nearD3Road = (u, v, m) => Math.abs(u - (G1N.G[0] + D3G[0]) / 2) < m && v > D3G[1] - 2 && v < G1N.G[1] + 2;
const D3 = { st: HOUSES.length >= D3AT ? 'open' : 'fog', T: null, k: 99, anim: null, AT: D3AT, C: D3C, R: D3R, G: D3G, G1N };

/* ---------- trees outside: forests, never on the bridge, the river or the moat ---------- */
const BR_W = 1.9, BG1 = [G1[0] + 1.3, G1[1]], BG2 = [G2[0] - 1.3, G2[1]];
const FOREST = [];
{ const r = seeded(31); for (let n = 0; n < 26000; n++) { const u = MID[0] + (r() - .5) * 360, v = MID[1] + (r() - .5) * 360;
  if ([T1, T2].some(T => dist([u, v], T.C) < T.outerR(Math.atan2(v - T.C[1], u - T.C[0])) + 4)) continue;
  if (Math.abs(v - G1[1]) < BR_W + 3.5 && u > G1[0] - 2 && u < G2[0] + 2) continue;
  const nz = Math.sin(u * .09) + Math.cos(v * .08) + Math.sin((u - v) * .05), lone = r() < .07; if (nz < .35 && !lone) continue;
  if (RIVER.some(p => (p[0] - u) ** 2 + (p[1] - v) ** 2 < 64)) continue; FOREST.push([u, v, r() < .5 ? 1 : 0, 1.05]); } }
const dropD3 = A => { let n = 0; for (const t of A) if (!inD3(t[0], t[1], 5) && !nearD3Road(t[0], t[1], 4.5)) A[n++] = t; A.length = n; };
dropD3(FOREST);
// further out (only seen zoomed far out on the map): more forests and meadows all the way to the horizon
const FOREST_FAR = [];
{ const r = seeded(37); for (let n = 0; n < 70000; n++) { const u = MID[0] + (r() - .5) * 1300, v = MID[1] + (r() - .5) * 1300; if (Math.abs(u - MID[0]) < 180 && Math.abs(v - MID[1]) < 180) continue;
  const nz = Math.sin(u * .03) + Math.cos(v * .027) + Math.sin((u - v) * .017) + Math.sin(u * .09) * .5; if (nz < .2 && r() > .06) continue;
  const k = Math.round((v - MID[1] + 900) / 3), p = RIVER_FAR[k]; if (p && Math.abs(p[0] - u) < 9) continue; FOREST_FAR.push([u, v, r() < .5 ? 1 : 0, 1.05]); } }
dropD3(FOREST_FAR);

/* ---------- cars: a few cars on long random drives through the street network (no turning on the spot),
   their position is a pure function of time, so the map and the 3D streets always show the same cars ---------- */
const CARS = [];
{ const rr = seeded(99), CC = ['#ff5a5f', '#ffd23f', '#4da3ff', '#f2f2f2', '#3ddc84', '#ff8a3d', '#b07cff'];
  const carGraph = T => {   // street + ring network; points closer than .42 are the same junction
    const lines = T.streets.filter(s => { const id = String(s.id); return id[0] !== 'g' && id[0] !== 'c'; }).map(s => s.pts).concat(T.rings);
    const V = [], N = [], grid = new Map();
    const idOf = p => { const gx = Math.floor(p[0] / .5), gy = Math.floor(p[1] / .5);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const L = grid.get((gx + i) * 100003 + gy + j); if (L) for (const id of L) if (Math.hypot(V[id][0] - p[0], V[id][1] - p[1]) < .42) return id; }
      const id = V.length; V.push([p[0], p[1]]); N.push([]); const k = gx * 100003 + gy; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(id); return id; };
    for (const P of lines) { let prev = -1; for (const p of P) { const id = idOf(p); if (prev >= 0 && prev !== id && !N[prev].includes(id)) { N[prev].push(id); N[id].push(prev); } prev = id; } }
    return { V, N };
  };
  const drive = (G, start, len, C, keep) => {   // random drive, prefers going straight on, never turns back unless the road ends; 'keep' cars stay near the centre
    const P = [G.V[start]]; let prev = -1, cur = start, L = 0, din = null;
    while (L < len) {
      const c = [];
      for (const n of G.N[cur]) { if (n === prev) continue; const dx = G.V[n][0] - G.V[cur][0], dz = G.V[n][1] - G.V[cur][1], l = Math.hypot(dx, dz) || 1, cs = din ? (dx * din[0] + dz * din[1]) / l : 0; if (cs > -.25) { let w = cs + 1.3; if (keep) { const p = G.V[cur], dc = Math.hypot(p[0] - C[0], p[1] - C[1]); if (dc > keep * .7) { const tw = -(dx * (p[0] - C[0]) + dz * (p[1] - C[1])) / (l * dc); w *= tw > 0 ? 1 + 4 * tw : Math.max(.02, 1 + 1.4 * tw); } } c.push([n, w]); } }
      if (!c.length) break;
      let x = rr() * c.reduce((a, q) => a + q[1], 0), pick = c[0][0]; for (const q of c) { x -= q[1]; if (x <= 0) { pick = q[0]; break; } }
      const a = G.V[cur], b = G.V[pick], d = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d > .25) din = [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
      L += d; P.push(b); prev = cur; cur = pick;
    }
    return P;
  };
  for (const [T, n, near] of [[T1, 24, 34], [T2, 12, 30]]) {
    const G = carGraph(T); if (!G.V.length) continue;
    for (let k = 0, tries = 0; k < n && tries < 400; tries++) {
      const keep = k % 2 === 0 ? near : 0, s = Math.floor(rr() * G.V.length), p = G.V[s]; if (keep && Math.hypot(p[0] - T.C[0], p[1] - T.C[1]) > near) continue;   // half the cars stay around the centre, where people look
      const pts = drive(G, s, 700, T.C, keep); let L = 0; const cum = [0]; for (let q = 1; q < pts.length; q++) { L += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]); cum.push(L); }
      if (L < 60) continue;
      CARS.push({ st: { pts, L, cum, T }, d0: rr() * L * .5, sp: 1.25 + rr() * .7, col: CC[CARS.length % CC.length] }); k++;
    }
  }
}
function carAt(c, t) {   // → [u, v, headingU, headingV] on the right-hand side of the street
  const st = c.st, L = st.L, m = ((c.d0 + c.sp * t) % (2 * L) + 2 * L) % (2 * L), fwd = m < L, d = fwd ? m : 2 * L - m, P = st.pts, cum = st.cum;
  let lo = 1, hi = cum.length - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < d) lo = mid + 1; else hi = mid; }
  const a = P[lo - 1], b = P[lo], f = (d - cum[lo - 1]) / ((cum[lo] - cum[lo - 1]) || 1); let hx = b[0] - a[0], hz = b[1] - a[1]; const l = Math.hypot(hx, hz) || 1; hx /= l; hz /= l; if (!fwd) { hx = -hx; hz = -hz; }
  return [lerp(a[0], b[0], f) - hz * .21, lerp(a[1], b[1], f) + hx * .21, hx, hz];
}
/* ---------- street graph of the Old Town: Benny walks along the real streets to visit a neighbour ---------- */
let GRAPH = null;
function buildGraph() {
  const V = [], N = [], grid = new Map(), key = (u, v) => Math.floor(u / .6) * 100000 + Math.floor(v / .6);
  const add = (p, line) => { const id = V.length; V.push(p); N.push([]); const k = key(p[0], p[1]); if (!grid.has(k)) grid.set(k, []); grid.get(k).push([id, line]); return id; };
  const link = (a, b) => { const d = Math.hypot(V[a][0] - V[b][0], V[a][1] - V[b][1]); N[a].push([b, d]); N[b].push([a, d]); };
  const lines = T1.streets.map(s => s.pts).concat(T1.rings);
  lines.forEach((P, li) => { let prev = -1; for (const p of P) { if (Math.hypot(p[0] - C1[0], p[1] - C1[1]) > 60) { prev = -1; continue; } const id = add(p, li); if (prev >= 0) link(prev, id); prev = id; } });
  for (let a = 0; a < V.length; a++) { const [u, v] = V[a], gx = Math.floor(u / .6), gy = Math.floor(v / .6); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const L = grid.get((gx + i) * 100000 + gy + j); if (!L) continue; for (const [b] of L) if (b > a && Math.hypot(V[b][0] - u, V[b][1] - v) < .5) link(a, b); } }
  return { V, N, near(u, v) { let best = -1, bd = 1e9; const gx = Math.floor(u / .6), gy = Math.floor(v / .6); for (let r = 1; r <= 4 && best < 0; r++) for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) { const L = grid.get((gx + i) * 100000 + gy + j); if (!L) continue; for (const [b] of L) { const d = Math.hypot(V[b][0] - u, V[b][1] - v); if (d < bd) { bd = d; best = b; } } } return best; } };
}
function bennyRoute(h, home) {
  if (!h.L3 || h.town !== 1) return null;
  if (!GRAPH) GRAPH = buildGraph();
  const G = GRAPH, L = h.L3, tgt = [L[0] - L[5] * 1.42, L[1] - L[6] * 1.42];
  const s = G.near(home[0], home[1] + 2.9), t = G.near(tgt[0], tgt[1]); if (s < 0 || t < 0) return null;
  // A*
  const gS = new Map([[s, 0]]), from = new Map(), open = [[Math.hypot(G.V[s][0] - G.V[t][0], G.V[s][1] - G.V[t][1]), s]], done = new Set();
  while (open.length) { let bi = 0; for (let k = 1; k < open.length; k++) if (open[k][0] < open[bi][0]) bi = k; const [, c] = open.splice(bi, 1)[0]; if (c === t) break; if (done.has(c)) continue; done.add(c); if (done.size > 6000) return null;
    for (const [n, d] of G.N[c]) { const g = gS.get(c) + d; if (g < (gS.has(n) ? gS.get(n) : 1e9)) { gS.set(n, g); from.set(n, c); open.push([g + Math.hypot(G.V[n][0] - G.V[t][0], G.V[n][1] - G.V[t][1]), n]); } } }
  if (!from.has(t) && s !== t) return null;
  const path = []; for (let c = t; c != null; c = from.get(c)) { path.push(G.V[c]); if (c === s) break; }
  path.reverse(); const P = [home, [home[0], home[1] + 1.6]].concat(path, [tgt]);
  let len = 0; for (let k = 1; k < P.length; k++) len += Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]);
  return len < 30 ? P : null;
}
/* ================= drawing ================= */
const onScreen = (u, v, m) => { const [x, y] = uvS(u, v); return x > -m && x < VW + m && y > -m && y < VH + m * 2; };
function uvSpace(fn) { const z = cam.z, o = uvS(0, 0); ctx.save(); ctx.transform(TW / 2 * z, TH / 2 * z, -TW / 2 * z, TH / 2 * z, o[0], o[1]); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; fn(); ctx.restore(); }
const visBox = () => { const a = [[0, 0], [VW, 0], [0, VH], [VW, VH]].map(([x, y]) => { const wx = (x - FX) / cam.z + cam.x, wy = (y - FY) / cam.z + cam.y; return [wx / TW + wy / TH, wy / TH - wx / TW]; }); const us = a.map(p => p[0]), vs = a.map(p => p[1]); return [Math.min(...us) - 4, Math.min(...vs) - 4, Math.max(...us) + 4, Math.max(...vs) + 4]; };
function pathPolys(list, closed, box, dx, dy) { ctx.beginPath(); dx = dx || 0; dy = dy || 0;
  for (const P of list) { if (box && !P.some(p => p[0] > box[0] && p[0] < box[2] && p[1] > box[1] && p[1] < box[3])) continue; ctx.moveTo(P[0][0] + dx, P[0][1] + dy); for (let k = 1; k < P.length; k++) ctx.lineTo(P[k][0] + dx, P[k][1] + dy); if (closed) ctx.closePath(); } }
function strip(pts, w) { const L = [], R = []; for (let k = 0; k < pts.length; k++) { const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)], du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv) || 1, nu = -dv / l * w, nv = du / l * w; L.push(uvS(pts[k][0] + nu, pts[k][1] + nv)); R.push(uvS(pts[k][0] - nu, pts[k][1] - nv)); } return L.concat(R.reverse()); }
function townPath(T, m) { ctx.beginPath(); for (let s = 0; s <= 200; s++) { const a = s / 200 * Math.PI * 2, r = T.outerR(a) + (m || 0), p = uvS(T.C[0] + Math.cos(a) * r, T.C[1] + Math.sin(a) * r); s ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.closePath(); }

function drawTown2Square(noBridges) {
  const z = cam.z, C = C2, circ = (r, fill, stroke, lw) => { ctx.beginPath(); for (let k = 0; k <= 72; k++) { const a = k / 72 * 6.2832, p = uvS(C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
  circ(P2R + .35, '#9a8a74'); circ(P2R, '#a99a84', '#7e705d', 1.5 * z);              // quay
  circ(P2R - .4, '#2f7dbf'); circ(P2R - .55, '#3a8fd0');                               // canal
  if (z > .3) { ctx.save(); ctx.globalAlpha = .35; circ(P2R - .95, null, '#bfe3ff', 1.4 * z); ctx.restore(); }
  circ(P2R - 1.45, '#8f8170'); circ(P2R - 1.55, '#d2c0a2');                            // island square
  if (z > .3) { for (const [r, c] of [[2.6, 'rgba(160,110,70,.35)'], [2.0, 'rgba(255,255,255,.28)'], [1.4, 'rgba(160,110,70,.4)']]) circ(r, null, c, 4 * z); }
  // four little wooden bridges over the canal
  if (!noBridges) uvSpace(() => { for (let q = 0; q < 4; q++) { const a = .12 + q * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), A = [C[0] + c * (P2R - 1.8), C[1] + s * (P2R - 1.8)], B = [C[0] + c * (P2R + M), C[1] + s * (P2R + M)];
    ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = 1.05; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.strokeStyle = '#b07a46'; ctx.lineWidth = .9; ctx.stroke();
    if (z > .35) { ctx.strokeStyle = 'rgba(60,35,15,.45)'; ctx.lineWidth = .05; ctx.beginPath(); for (let t = .05; t < 1; t += .09) { const m = [lerp(A[0], B[0], t), lerp(A[1], B[1], t)]; ctx.moveTo(m[0] - s * .45, m[1] + c * .45); ctx.lineTo(m[0] + s * .45, m[1] - c * .45); } ctx.stroke(); } } });
}
function townGround(T, box, noBand) {
  const z = cam.z;
    const st = STYLE.get(T);
    if (!noBand) { townPath(T, 3.6); ctx.fillStyle = '#4b8848'; ctx.fill(); }
    townPath(T, 0); ctx.fillStyle = st.ground; ctx.fill();
    if (T === T2) drawTown2Square();
    // gardens: back alleys, hedges, vegetable beds
    uvSpace(() => {
      pathPolys(T.alleys, false, box); ctx.strokeStyle = '#b9a87d'; ctx.lineWidth = .46; ctx.stroke(); ctx.strokeStyle = '#dccc9f'; ctx.lineWidth = .34; ctx.stroke();
      if (false) { const nb = T === T1 ? 5000 : HOUSES.length - 5000, H = T.hedges.filter(h => h.li < nb && h[0][0] > box[0] && h[0][0] < box[2] && h[0][1] > box[1] && h[0][1] < box[3]);
        pathPolys(H, false, null, .04, .04); ctx.strokeStyle = st.hedge[0]; ctx.lineWidth = .5; ctx.stroke();
        pathPolys(H, false, null, -.09, -.09); ctx.strokeStyle = st.hedge[1]; ctx.lineWidth = .44; ctx.stroke();
        pathPolys(H, false, null, -.14, -.14); ctx.strokeStyle = st.hedge[2]; ctx.lineWidth = .2; ctx.stroke(); }
    });
    if (z > .25) for (const [u, v, k] of T.beds) { if (u < box[0] || u > box[2] || v < box[1] || v > box[3]) continue; const [x, y] = uvS(u, v); poly(ctx, [[x - 22 * z, y], [x, y - 11 * z], [x + 22 * z, y], [x, y + 11 * z]], '#8a6542', '#6d4f33', 1 * z); for (let q = -2; q <= 2; q++) for (let w = -1; w <= 1; w++) circle(ctx, x + q * 7 * z + w * 5 * z, y + w * 4 * z - q * 1.5 * z, 2.3 * z, k < .5 ? '#5fbf4f' : (q + w) % 2 ? '#e2483a' : '#5fbf4f'); }
    // streets: one curb pass, one surface pass (round joins, so crossings are always clean)
    uvSpace(() => {
      const S = T.streets.filter(s => s.kind !== 'avenue').map(s => s.pts).concat(T.rings), A = T.streets.filter(s => s.kind === 'avenue').map(s => s.pts);
      pathPolys(A, false, box); ctx.strokeStyle = st.curb; ctx.lineWidth = 1.2; ctx.stroke();
      pathPolys(S, false, box); ctx.lineWidth = .96; ctx.stroke();
      pathPolys(A, false, box); ctx.strokeStyle = st.road; ctx.lineWidth = 1.05; ctx.stroke();
      pathPolys(S, false, box); ctx.lineWidth = .82; ctx.stroke();
      if (z > .3) {
        if (st.dash) { ctx.setLineDash([.38, .38]); ctx.strokeStyle = st.dash; ctx.lineWidth = .065; pathPolys(S.concat(A), false, box); ctx.stroke(); ctx.setLineDash([]); }
        else { ctx.setLineDash([.07, .16]); ctx.strokeStyle = 'rgba(255,240,220,.22)'; ctx.lineWidth = .64; pathPolys(S.concat(A), false, box); ctx.stroke(); ctx.setLineDash([.05, .2]); ctx.strokeStyle = 'rgba(70,45,25,.18)'; ctx.lineWidth = .42; ctx.stroke(); ctx.setLineDash([]); }
      }
    });
}
function ground() {
  const z = cam.z, box = visBox();
  ctx.fillStyle = '#5d9e57'; ctx.fillRect(0, 0, VW, VH);
  ctx.save(); ctx.globalAlpha = .16; const r = seeded(7); for (let k = 0; k < 900; k++) { const far = k >= 260, [x, y] = uvS(MID[0] + (far ? 650 : 190) * (2 * r() - 1), MID[1] + (far ? 650 : 190) * (2 * r() - 1)); ellipse(ctx, x, y, (30 + r() * 90) * z * 6, (15 + r() * 45) * z * 6, r() < .5 ? '#4a8a48' : '#6db064'); } ctx.restore();
  // river with sandy banks, ripples and two little boats
  poly(ctx, strip(RIVER_FAR, 8.2), '#cdbd90'); poly(ctx, strip(RIVER_FAR, 6.8), '#2f7dbf'); poly(ctx, strip(RIVER_FAR, 4.6), '#3a8fd0');
  if (z > .2) { ctx.save(); ctx.globalAlpha = .4; ctx.strokeStyle = '#bfe3ff'; ctx.lineWidth = 1.5 * z; ctx.beginPath(); for (let k = 2; k < RIVER.length - 3; k += 3) { const p = RIVER[k], o = Math.sin(k * 1.7) * 3, a = uvS(p[0] + o, p[1]); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + 16 * z, a[1] + 2 * z); } ctx.stroke(); ctx.restore(); }
  for (const T of [T1, T2]) townGround(T, box);
  d3Ground(box);
  // the square, town hall, park, block parks, building sites and the marketplace — exactly as on the live site
  drawPlazaGround(); drawParkGround(); drawBlockParks(); drawHallGround(); drawSiteGround(); drawMarketGround(1);
}
/* --- wall pieces --- */
function drawWallSeg(T, sg, hk) {
  const z = cam.z, st = STYLE.get(T), [u0, v0] = sg.p0, [u1, v1] = sg.p1, nu = Math.cos(sg.am), nv = Math.sin(sg.am), t = .45, full = hk == null || hk >= 1, HW = WALL_H * (hk == null ? 1 : Math.min(1, hk));
  const out = (nu + nv) > 0, fu = out ? t : -t, f0 = uvS(u0 + nu * fu, v0 + nv * fu), f1 = uvS(u1 + nu * fu, v1 + nv * fu), b0 = uvS(u0 - nu * fu, v0 - nv * fu), b1 = uvS(u1 - nu * fu, v1 - nv * fu);
  const H = HW * z, up = (p, h) => [p[0], p[1] - (h == null ? H : h * z)];
  if (HW < .5) return;
  poly(ctx, [f0, f1, up(f1), up(f0)], out ? st.face : st.faceIn, OUT, 1.1 * z);
  if (z > .35) { ctx.save(); ctx.strokeStyle = st.line; ctx.lineWidth = .9 * z; ctx.beginPath();
    for (let q = 1; q < 5; q++) { const h = WALL_H * q / 5; if (h > HW - 1) break; const a = up(f0, h), b = up(f1, h); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); for (let j = (q % 2) * .5; j < 3; j++) { const tt = (j + .5) / 3, x = lerp(f0[0], f1[0], tt), y = lerp(f0[1], f1[1], tt); ctx.moveTo(x, y - h * z); ctx.lineTo(x, y - (h - WALL_H / 5) * z); } }
    ctx.stroke(); ctx.restore();
    if (full && sg.s % 7 === 3) { const x = lerp(f0[0], f1[0], .4), y = lerp(f0[1], f1[1], .4); ellipse(ctx, x, y - 6 * z, 7 * z, 4 * z, 'rgba(70,110,60,.45)'); }
    if (full && sg.s % 11 === 5) { const x = lerp(f0[0], f1[0], .6), y = lerp(f0[1], f1[1], .6); line(ctx, x, y - 40 * z, x - 2 * z, y - 18 * z, 'rgba(60,120,60,.7)', 2.4 * z); circle(ctx, x - 2 * z, y - 30 * z, 2.2 * z, 'rgba(80,150,70,.8)'); }   // ivy
  }
  poly(ctx, [up(f0), up(f1), up(b1), up(b0)], st.walk, OUT, .9 * z);
  if (z > .22 && full) { const E0 = out ? f0 : b0, E1 = out ? f1 : b1; for (let q = 0; q < 3; q++) { const t0 = q / 3 + .06, t1 = t0 + .17, P0 = [lerp(E0[0], E1[0], t0), lerp(E0[1], E1[1], t0)], P1 = [lerp(E0[0], E1[0], t1), lerp(E0[1], E1[1], t1)];
    poly(ctx, [up(P0), up(P1), up(P1, WALL_H + 9), up(P0, WALL_H + 9)], st.cren, OUT, .8 * z); const dx = (b1[0] - f1[0]) * .25, dy = (b1[1] - f1[1]) * .25; poly(ctx, [up(P0, WALL_H + 9), up(P1, WALL_H + 9), [up(P1, WALL_H + 9)[0] + dx, up(P1, WALL_H + 9)[1] + dy], [up(P0, WALL_H + 9)[0] + dx, up(P0, WALL_H + 9)[1] + dy]], st.crenTop); } }
}
function drawTower(u, v, k, st, g) {
  const z = cam.z, s = .78 * k, G = g == null ? 1 : g, gr = clamp((G - .8) / .2, 0, 1), Hh = (WALL_H + 30) * k * (st.hs || 1) * Math.min(1, G / .8), N = 8, pts = [];
  if (Hh < .5) return; for (let q = 0; q < N; q++) { const a = q / N * 6.283 + .39; pts.push([u + Math.cos(a) * s, v + Math.sin(a) * s]); }
  const P = pts.map(p => uvS(p[0], p[1])), up = (p, h) => [p[0], p[1] - h * z];
  for (let q = 0; q < N; q++) { const a = pts[q], b = pts[(q + 1) % N], mu = (a[0] + b[0]) / 2 - u, mv = (a[1] + b[1]) / 2 - v; if (mu + mv < -.05) continue; const A = P[q], B = P[(q + 1) % N], light = .82 + .18 * Math.cos(Math.atan2(mv, mu) - .3); poly(ctx, [A, B, up(B, Hh), up(A, Hh)], shade(st.stone, light), OUT, 1 * z);
    if (z > .35) { ctx.save(); ctx.strokeStyle = st.line; ctx.lineWidth = .8 * z; ctx.beginPath(); for (let h = 12; h < Hh; h += 12) { const a2 = up(A, h), b2 = up(B, h); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); } ctx.stroke(); ctx.restore(); } }
  if (G >= 1 && z > .3) { const [x, y] = uvS(u + s * .7, v + s * .7); ctx.fillStyle = '#2a2230'; ctx.fillRect(x - 2 * z, y - Hh * .62 * z, 4 * z, 12 * z); ctx.fillStyle = 'rgba(255,200,110,.9)'; ctx.fillRect(x - 1.2 * z, y - Hh * .62 * z + 1.5 * z, 2.4 * z, 9 * z); }
  if (G >= 1 && st.clock && z > .2) { const [x, y] = uvS(u + s * .78, v + s * .78), cy = y - Hh * .84 * z; circle(ctx, x, cy, 11 * z, '#fbf7ee', OUT, 1.4 * z); line(ctx, x, cy, x, cy - 7 * z, OUT, 1.4 * z); line(ctx, x, cy, x + 5 * z, cy + 1 * z, OUT, 1.4 * z); }
  const top2 = pts.map(p => uvS(u + (p[0] - u) * 1.12, v + (p[1] - v) * 1.12)).map(p => up(p, Hh + 4));
  poly(ctx, top2, shade(st.stone, 1.08), OUT, 1 * z);
  if (gr <= 0) return;
  const apex = up(uvS(u, v), Hh + 4 + 48 * k * gr);
  for (let q = 0; q < N; q++) { const a = pts[q], b = pts[(q + 1) % N], mu = (a[0] + b[0]) / 2 - u, mv = (a[1] + b[1]) / 2 - v; if (mu + mv < -.3) continue; const light = .8 + .2 * Math.cos(Math.atan2(mv, mu) - .3); poly(ctx, [top2[q], top2[(q + 1) % N], apex], shade(st.roof, light), OUT, .9 * z); }
  if (G >= 1 && z > .2) { line(ctx, apex[0], apex[1], apex[0], apex[1] - 22 * z, '#4a4a4a', 1.4 * z); const wv = Math.sin(S.T * 4 + u) * 2 * z; poly(ctx, [[apex[0], apex[1] - 22 * z], [apex[0] + 16 * z, apex[1] - 19 * z + wv], [apex[0], apex[1] - 13 * z]], st.flag, OUT, .7 * z); }
  if (G >= 1 && z > .4) { const [x, y] = uvS(u + s, v + s); const fl = .7 + .3 * Math.sin(S.T * 13 + u * 3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y - 30 * z, 1, x, y - 30 * z, 26 * z); g.addColorStop(0, `rgba(255,190,90,${.55 * fl})`); g.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - 26 * z, y - 56 * z, 52 * z, 52 * z); ctx.restore(); circle(ctx, x, y - 30 * z, 3 * z * fl, '#ffcf6b'); }
}
/* --- gatehouse: built on the wall's own line (same angle, same thickness), arch drawn in the face's own perspective --- */
function drawGatehouse(T, g, gk) {
  const z = cam.z, st = STYLE.get(T), dp = .52, GK = gk == null ? 1 : gk, H = (WALL_H + 22) * Math.min(1, GK), [cu, cv] = g.c, [tu, tv] = g.t, [nu, nv] = g.n, wd = g.wd;
  const W = (a, b) => uvS(cu + tu * a + nu * b, cv + tv * a + nv * b), up = (p, h) => [p[0], p[1] - h * z];
  const fs = (nu + nv) > 0 ? 1 : -1, F0 = W(-wd, dp * fs), F1 = W(wd, dp * fs), side = (tu + tv) > 0 ? 1 : -1, S0 = W(wd * side, dp), S1 = W(wd * side, -dp);
  poly(ctx, [S0, S1, up(S1, H), up(S0, H)], shade(st.face, .9), OUT, 1 * z);
  poly(ctx, [F0, F1, up(F1, H), up(F0, H)], fs > 0 ? shade(st.face, 1.06) : st.faceIn, OUT, 1.1 * z);
  if (GK < 1) { poly(ctx, [up(W(-wd, -dp), H), up(W(wd, -dp), H), up(W(wd, dp), H), up(W(-wd, dp), H)], st.walk, OUT, 1 * z); return; }
  const L = (s, h) => [lerp(F0[0], F1[0], s), lerp(F0[1], F1[1], s) - h * z];
  if (z > .3) { ctx.save(); ctx.strokeStyle = st.line; ctx.lineWidth = .9 * z; ctx.beginPath(); for (let h = 11; h < H; h += 11) { const a = L(0, h), b = L(1, h); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke(); ctx.restore(); }
  const arch = (w, h0, hr) => { ctx.beginPath(); let p = L(.5 - w, 0); ctx.moveTo(p[0], p[1]); p = L(.5 - w, h0); ctx.lineTo(p[0], p[1]); for (let k = 0; k <= 16; k++) { const th = Math.PI - k / 16 * Math.PI; p = L(.5 + w * Math.cos(th), h0 + hr * Math.sin(th)); ctx.lineTo(p[0], p[1]); } p = L(.5 + w, 0); ctx.lineTo(p[0], p[1]); ctx.closePath(); };
  arch(.25, 25, 15); ctx.fillStyle = shade(st.cren, .92); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.1 * z; ctx.stroke();            // arch stones
  arch(.2, 24, 13);
  if (g.open) { ctx.fillStyle = '#2e2836'; ctx.fill(); ctx.save(); ctx.clip(); ctx.globalAlpha = .4; ctx.fillStyle = '#ffd68c'; const a = L(.3, 0), b = L(.7, 0); ellipse(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.abs(b[0] - a[0]) * .6, 18 * z, '#ffd68c'); ctx.globalAlpha = 1;
    ctx.strokeStyle = '#4a4250'; ctx.lineWidth = 1.6 * z; ctx.beginPath(); for (let s = .32; s < .7; s += .06) { const p = L(s, 26), q = L(s, 40); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } for (const h of [30, 35]) { const p = L(.3, h), q = L(.7, h); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke(); ctx.restore(); }   // raised portcullis
  else { ctx.fillStyle = '#7a5532'; ctx.fill(); ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(40,25,10,.55)'; ctx.lineWidth = 1 * z; ctx.beginPath(); for (let s = .34; s < .68; s += .055) { const p = L(s, 0), q = L(s, 40); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke();
    ctx.strokeStyle = '#3d3d44'; ctx.lineWidth = 2.2 * z; ctx.beginPath(); for (const h of [7, 19]) { const p = L(.3, h), q = L(.7, h); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } const m0 = L(.5, 0), m1 = L(.5, 37); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(m1[0], m1[1]); ctx.stroke(); ctx.restore(); const kn = L(.46, 13), kn2 = L(.54, 13); circle(ctx, kn[0], kn[1], 1.8 * z, '#c9a24a'); circle(ctx, kn2[0], kn2[1], 1.8 * z, '#c9a24a'); }
  const k0 = L(.47, 37), k1 = L(.53, 37), k2 = L(.535, 44), k3 = L(.465, 44); poly(ctx, [k0, k1, k2, k3], st.crenTop, OUT, .8 * z);                 // keystone
  if (z > .3) { const b0 = L(.4, H - 6), b1 = L(.6, H - 6), b2 = L(.6, H - 26), bm = L(.5, H - 21), b3 = L(.4, H - 26); poly(ctx, [b0, b1, b2, bm, b3], st.banner, OUT, .9 * z); const bc = L(.5, H - 15); txt('B', bc[0], bc[1], Math.max(6, 11 * z), '#ffd23f', 'center', 'middle'); }
  poly(ctx, [up(W(-wd, -dp), H), up(W(wd, -dp), H), up(W(wd, dp), H), up(W(-wd, dp), H)], st.walk, OUT, 1 * z);
  for (const e of [-1, 1]) { const E0 = W(-wd, dp * e), E1 = W(wd, dp * e); for (let q = 0; q < 5; q++) { const t0 = q / 5 + .04, t1 = t0 + .12, P0 = [lerp(E0[0], E1[0], t0), lerp(E0[1], E1[1], t0)], P1 = [lerp(E0[0], E1[0], t1), lerp(E0[1], E1[1], t1)]; poly(ctx, [up(P0, H), up(P1, H), up(P1, H + 9), up(P0, H + 9)], st.cren, OUT, .8 * z); } }
  // two lanterns beside an open gate
  if (g.open && z > .3) for (const s of [.12, .88]) { const p = L(s, 30); line(ctx, p[0], p[1], p[0], p[1] + 6 * z, '#3a3242', 1.4 * z); circle(ctx, p[0], p[1] + 9 * z, 3.4 * z, '#ffd98a', OUT, .8 * z); }
}
/* --- the great walled bridge: ramps up from both gates, stone arches over the river, crenellated parapets --- */
function bridgeObjs(objs) {
  const z = cam.z, L = dist(BG1, BG2), n = Math.ceil(L / 1.6), P = t => [lerp(BG1[0], BG2[0], t), lerp(BG1[1], BG2[1], t)], HMAX = 34;
  const Hf = t => HMAX * sstep(0, .2, t) * sstep(1, .8, t), sL = [0, BR_W];
  const st = STYLE.get(T1);
  for (let q = 0; q < n; q++) {
    const t0 = q / n, t1 = (q + 1) / n, a = P(t0), b = P(t1), mid = P((t0 + t1) / 2); if (!onScreen(mid[0], mid[1], 160)) continue;
    objs.push({ d: mid[0] + mid[1] + BR_W + .3, f: () => {
      const h0 = Hf(t0), h1 = Hf(t1), up = (p, h) => [p[0], p[1] - h * z];
      const A0 = uvS(a[0] - sL[0], a[1] - sL[1]), A1 = uvS(b[0] - sL[0], b[1] - sL[1]), B0 = uvS(a[0] + sL[0], a[1] + sL[1]), B1 = uvS(b[0] + sL[0], b[1] + sL[1]);
      const overWater = Math.abs(mid[0] - MID[0]) < 7.2;
      poly(ctx, [B0, B1, up(B1, h1), up(B0, h0)], '#a99b80', OUT, 1 * z);
      if (overWater && q % 2 === 0) { const c0 = B0, c1 = up(B1, 0), w = .5; ctx.save(); ctx.beginPath(); const LL = (s, h) => [lerp(B0[0], B1[0], s), lerp(B0[1], B1[1], s) - h * z]; let p = LL(.5 - w * .8, -2); ctx.moveTo(p[0], p[1]); for (let k = 0; k <= 12; k++) { const th = Math.PI - k / 12 * Math.PI; p = LL(.5 + w * .8 * Math.cos(th), 22 * Math.sin(th)); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fillStyle = '#2b6aa3'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1 * z; ctx.stroke(); ctx.restore(); }
      if (z > .35) { ctx.save(); ctx.strokeStyle = 'rgba(70,55,40,.25)'; ctx.lineWidth = .8 * z; ctx.beginPath(); for (let h = 10; h < Math.max(h0, h1); h += 10) { const p1 = up(B0, Math.min(h, h0)), p2 = up(B1, Math.min(h, h1)); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); } ctx.stroke(); ctx.restore(); }
      poly(ctx, [up(A0, h0), up(A1, h1), up(B1, h1), up(B0, h0)], '#b6ab95');
      if (z > .45) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = .8 * z; ctx.beginPath(); for (let k = 1; k < 4; k++) { const f = k / 4, p1 = up([lerp(A0[0], B0[0], f), lerp(A0[1], B0[1], f)], h0), p2 = up([lerp(A1[0], B1[0], f), lerp(A1[1], B1[1], f)], h1); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); } ctx.stroke(); ctx.restore(); }
      for (const E of [[A0, A1], [B0, B1]]) { poly(ctx, [up(E[0], h0), up(E[1], h1), up(E[1], h1 + 16), up(E[0], h0 + 16)], '#c4b8a0', OUT, .9 * z);
        if (z > .25) { const Q0 = [lerp(E[0][0], E[1][0], .2), lerp(E[0][1], E[1][1], .2)], Q1 = [lerp(E[0][0], E[1][0], .6), lerp(E[0][1], E[1][1], .6)], hq0 = lerp(h0, h1, .2), hq1 = lerp(h0, h1, .6); poly(ctx, [up(Q0, hq0 + 16), up(Q1, hq1 + 16), up(Q1, hq1 + 23), up(Q0, hq0 + 23)], '#d2c7af', OUT, .7 * z); } }
      if (q % 4 === 1 && z > .3) for (const E of [A0, B0]) { const p = up(E, h0 + 16); line(ctx, p[0], p[1], p[0], p[1] - 22 * z, '#3a3242', 1.6 * z); circle(ctx, p[0], p[1] - 24 * z, 3.5 * z, '#ffd98a', OUT, .7 * z); }
      if (q % 4 === 3 && z > .3 && h0 > 20) { const p = up(B0, h0 - 4); poly(ctx, [[p[0] + 4 * z, p[1]], [p[0] + 14 * z, p[1] + 5 * z], [p[0] + 14 * z, p[1] + 23 * z], [p[0] + 9 * z, p[1] + 17 * z], [p[0] + 4 * z, p[1] + 18 * z]], q % 8 === 3 ? '#ff2e63' : '#3a7bd5', OUT, .7 * z); }
    } });
  }
  for (const sd of [-1, 1]) { const p = P(.5), u = p[0], v = p[1] + (BR_W + .55) * sd; objs.push({ d: u + v + .5, f: () => drawTower(u, v, .8, Object.assign({}, st, { roof: '#2f4f8f', flag: '#ffd23f', hs: 1.45 })) }); }
  // boats
  for (const [s, c] of [[-30, '#e2483a'], [22, '#ffd23f'], [55, '#4da3ff']]) { const k = Math.round((s + 170) / 1.5), p = RIVER[k]; if (!p || !onScreen(p[0], p[1], 80)) continue; const u = p[0] + 1.5, v = p[1]; objs.push({ d: u + v, f: () => { const [x, y] = uvS(u, v + Math.sin(S.T + s) * .2); ellipse(ctx, x, y + 3 * z, 26 * z, 8 * z, 'rgba(0,0,0,.18)'); poly(ctx, [[x - 24 * z, y - 6 * z], [x + 24 * z, y - 6 * z], [x + 16 * z, y + 4 * z], [x - 16 * z, y + 4 * z]], '#8a5a34', OUT, 1.1 * z); line(ctx, x, y - 6 * z, x, y - 46 * z, '#5b4630', 2 * z); poly(ctx, [[x + 1 * z, y - 44 * z], [x + 20 * z, y - 12 * z], [x + 1 * z, y - 12 * z]], '#f4efe4', OUT, 1 * z); poly(ctx, [[x - 1 * z, y - 40 * z], [x - 14 * z, y - 12 * z], [x - 1 * z, y - 12 * z]], c, OUT, 1 * z); } }); }
}
const TREE_SPR = {}, TREE_STEPS = [.05, .1, .2, .4, .8, 1.6, 3.2];
function treeSprite(kind, col, sc) {
  const key = kind + '|' + (col || '') + '|' + sc; let sp = TREE_SPR[key]; if (sp) return sp;
  const w = Math.ceil(46 * sc) + 6, hh = Math.ceil(62 * sc) + 6, ax = Math.ceil(20 * sc) + 3, ay = Math.ceil(54 * sc) + 3, c = document.createElement('canvas'); c.width = w; c.height = hh;
  const g = c.getContext('2d'); g.lineJoin = 'round'; g.lineCap = 'round';
  if (kind === 2) drawBlossomTo(g, ax, ay, sc, col); else drawTree(g, ax, ay, sc, kind);
  return (TREE_SPR[key] = { c, ax, ay, sc });
}
function drawTreeFast(x, y, s, kind, col) {
  const z = s, st = TREE_STEPS.find(q => q >= z * DPR * .95) || 3.2, sp = treeSprite(kind, col, st), k = z / st;
  ctx.drawImage(sp.c, x - sp.ax * k, y - sp.ay * k, sp.c.width * k, sp.c.height * k);
}
function drawBlossomTo(c, x, y, s, col) { ellipse(c, x, y + 2 * s, 16 * s, 6 * s, 'rgba(0,0,0,.18)'); line(c, x, y, x, y - 20 * s, '#7a5236', 4 * s); const c2 = shade(col, .85); circle(c, x - 8 * s, y - 26 * s, 11 * s, c2, OUT, 1.2 * s); circle(c, x + 8 * s, y - 27 * s, 11 * s, c2, OUT, 1.2 * s); circle(c, x, y - 36 * s, 13 * s, col, OUT, 1.2 * s); circle(c, x - 4 * s, y - 40 * s, 4 * s, 'rgba(255,255,255,.5)'); }
/* car on a street of any direction: two boxes (body + cabin), only the faces turned to the viewer */
function drawCarDir(u, v, hx, hz, col) {
  const z = cam.z, box = (L, Wd, h0, h1, top, side) => {
    const C = [[L, Wd], [L, -Wd], [-L, -Wd], [-L, Wd]].map(([a, b]) => [u + hx * a - hz * b, v + hz * a + hx * b]);
    for (let k = 0; k < 4; k++) { const A = C[k], B = C[(k + 1) % 4]; let nx = B[1] - A[1], nz = A[0] - B[0]; const mx = (A[0] + B[0]) / 2 - u, mz = (A[1] + B[1]) / 2 - v; if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz; } const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; if (nx + nz <= 0) continue;
      const a = uvS(A[0], A[1]), b = uvS(B[0], B[1]); poly(ctx, [[a[0], a[1] - h0 * z], [b[0], b[1] - h0 * z], [b[0], b[1] - h1 * z], [a[0], a[1] - h1 * z]], shade(side, .71 + .09 * (nz - nx))); }
    poly(ctx, C.map(p => { const q = uvS(p[0], p[1]); return [q[0], q[1] - h1 * z]; }), top);
  };
  const [sx, sy] = uvS(u, v); ellipse(ctx, sx + 2 * z, sy + 2 * z, 20 * z, 8 * z, 'rgba(0,0,0,.25)');
  box(.21, .11, 0, 8, col, col); box(.115, .088, 8, 13, '#2b3350', '#3b4670');
}
function drawBlossom(x, y, s, col) { ellipse(ctx, x, y + 2 * s, 16 * s, 6 * s, 'rgba(0,0,0,.18)'); line(ctx, x, y, x, y - 20 * s, '#7a5236', 4 * s); const c2 = shade(col, .85); circle(ctx, x - 8 * s, y - 26 * s, 11 * s, c2, OUT, 1.2 * s); circle(ctx, x + 8 * s, y - 27 * s, 11 * s, c2, OUT, 1.2 * s); circle(ctx, x, y - 36 * s, 13 * s, col, OUT, 1.2 * s); circle(ctx, x - 4 * s, y - 40 * s, 4 * s, 'rgba(255,255,255,.5)'); }
function carLights(n) {   // headlight beams + red tail lights, on top of the night overlay
  const z = cam.z, box = visBox(); if (z <= .14 || n < .05) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const c of CARS) { const [u, v, hx, hz] = carAt(c, S.T); if (u < box[0] || u > box[2] || v < box[1] || v > box[3]) continue;
    const [fx, fy] = uvS(u + hx * .55, v + hz * .55), R = 46 * z, g = ctx.createRadialGradient(fx, fy, 1, fx, fy, R); g.addColorStop(0, `rgba(255,236,170,${.5 * n})`); g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g; ctx.save(); ctx.translate(fx, fy); ctx.scale(1, .55); ctx.translate(-fx, -fy); ctx.fillRect(fx - R, fy - R, 2 * R, 2 * R); ctx.restore();
    for (const sd of [-1, 1]) { const [x, y] = uvS(u + hx * .22 - hz * .07 * sd, v + hz * .22 + hx * .07 * sd); ctx.fillStyle = `rgba(255,246,210,${.95 * n})`; ctx.fillRect(x - 1.6 * z - .6, y - 6 * z - .6, 3.2 * z + 1.2, 3.2 * z + 1.2);
      const [bx, by] = uvS(u - hx * .22 - hz * .07 * sd, v - hz * .22 + hx * .07 * sd); ctx.fillStyle = `rgba(255,60,50,${.8 * n})`; ctx.fillRect(bx - 1.4 * z - .5, by - 6 * z - .5, 2.8 * z + 1, 2.8 * z + 1); } }
  ctx.restore();
}
function carObjs(objs) { const z = cam.z, box = visBox(); if (z <= .14) return; for (const c of CARS) { const [u, v, hx, hz] = carAt(c, S.T); if (u < box[0] || u > box[2] || v < box[1] || v > box[3]) continue; objs.push({ d: u + v + .05, f: () => drawCarDir(u, v, hx, hz, c.col) }); } }
function worldObjs(objs, movers) {
  const z = cam.z, lo = z < .6, box = visBox(), inB = (u, v) => u > box[0] && u < box[2] && v > box[1] && v < box[3];
  const sel = typeof selected !== 'undefined' ? selected : null;
  for (const h of HOUSES) { if (!h.town) continue; if (!inB(h.i, h.j)) continue; const [sx, sy] = uvS(h.i, h.j);
    const fade = sel && h !== sel && Math.hypot(h.i - sel.i, h.j - sel.j) < 1.9 && h.i + h.j > sel.i + sel.j;
    objs.push({ d: h.i + h.j, f: () => { const sp_ = sprite(h.v, lo), bk = h.bt ? eBack(clamp((S.T - h.bt) / .9, 0, 1)) : 1; if (bk <= .01) return; if (z > .14 && tierOf(h) >= 2 && !fade) drawFence('back', h, z); const k = z / sp_.sc * bk; ctx.save(); if (fade) ctx.globalAlpha = .35; ctx.translate(sx, sy); if (h.flip) ctx.scale(-1, 1); ctx.drawImage(sp_.c, -sp_.ax * k, -sp_.ay * k, sp_.c.width * k, sp_.c.height * k); ctx.restore(); if (z > .1 && tierOf(h) >= 1 && !fade) drawFlowers(h, z); if (z > .14 && tierOf(h) >= 2 && !fade) drawFence('front', h, z); if (h.trophy && !fade) drawTrophy(h, z); if (h.catbed && !fade) drawHouseCatBed(h, z); } }); }
  if (movers !== false) carObjs(objs);
  d3Objs(objs, inB);
  for (const L of NEXT2) { if (!inB(L[0], L[1])) continue; const [sx, sy] = uvS(L[0], L[1]); objs.push({ d: L[0] + L[1], f: () => drawSignPost(sx, sy, z) }); }
  const BL = ['#f6a9c8', '#ffc3d9', '#ff9a4d', '#f4d35e'];
  if (z > .045) {
    for (const L of T1.lots.slice(5000)) { if (!inB(L[0], L[1])) continue; const [sx, sy] = uvS(L[0], L[1]); objs.push({ d: L[0] + L[1], f: () => drawTreeFast(sx, sy, z * .9, 0) }); }
    for (const [u, v, kind, s] of T1.trees.concat(FOREST)) { if (!inB(u, v)) continue; const [x, y] = uvS(u, v); objs.push({ d: u + v, f: () => drawTreeFast(x, y, z * s, kind) }); }
    T2.trees.forEach(([u, v, kind, s], k) => { if (!inB(u, v)) return; const [x, y] = uvS(u, v); const r = k % 5; objs.push({ d: u + v, f: () => r < 3 ? drawTreeFast(x, y, z * s * .95, 2, BL[(k >> 2) % 4]) : drawTreeFast(x, y, z * s, kind) }); });
    for (const [u, v, kind, s] of FOREST_FAR) { if (!inB(u, v)) continue; const [x, y] = uvS(u, v); objs.push({ d: u + v, f: () => drawTreeFast(x, y, z * s, kind) }); }
  } else {   // very far out: every tree becomes a little dark-green dot (one path per colour, fast)
    objs.push({ d: -1e8, f: () => {
      const rr = Math.max(1.05, 20 * z), lift = 16 * z, P = [new Path2D(), new Path2D()];
      for (const L of [T1.trees, FOREST, FOREST_FAR, T2.trees]) for (const t of L) { const u = t[0], v = t[1]; if (!inB(u, v)) continue; const [x, y] = uvS(u, v), p = P[t[2] === 1 ? 1 : 0]; p.moveTo(x + rr, y - lift); p.arc(x, y - lift, rr, 0, 6.2832); }
      ctx.fillStyle = '#2f6b37'; ctx.fill(P[0]); ctx.fillStyle = '#3f8a4e'; ctx.fill(P[1]);
    } });
  }
  if (z > .15) { for (const [u, v] of T1.lamps) if (inB(u, v)) objs.push({ d: u + v + .02, f: () => drawStreetLamp(u, v, 1) }); for (const [u, v] of T2.lamps) if (inB(u, v)) objs.push({ d: u + v + .02, f: () => drawLamp(u, v) }); }
  for (const T of [T1, T2]) { const st = STYLE.get(T);
    for (const sg of T.segs) { const m = [(sg.p0[0] + sg.p1[0]) / 2, (sg.p0[1] + sg.p1[1]) / 2]; if (!inB(m[0], m[1])) continue; objs.push({ d: m[0] + m[1] + ((Math.cos(sg.am) + Math.sin(sg.am)) > 0 ? .6 : -.6), f: () => drawWallSeg(T, sg) }); }
    for (const tw of T.towers) { const [u, v] = tw.p; if (!inB(u, v)) continue; objs.push({ d: u + v + .9, f: () => drawTower(u, v, tw.k, st) }); }
    for (const g of T.gates) { const [u, v] = g.c; if (!inB(u, v)) continue; objs.push({ d: u + v + .7, f: () => drawGatehouse(T, g) }); }
  }
  // District 2 island square: clock tower, blossom trees, lanterns, benches
  { const [cu, cv] = C2, st = STYLE.get(T2); objs.push({ d: cu + cv + .5, f: () => drawTower(cu, cv, 1.1, Object.assign({}, st, { hs: 1.8, clock: true })) });
    for (let q = 0; q < 4; q++) { const a = .12 + Math.PI / 4 + q * Math.PI / 2, u = cu + Math.cos(a) * 2.5, v = cv + Math.sin(a) * 2.5, [x, y] = uvS(u, v); objs.push({ d: u + v, f: () => drawBlossom(x, y, z * .85, BL[q % 2]) });
      const b = .12 + q * Math.PI / 2, lu = cu + Math.cos(b + .32) * 3.0, lv = cv + Math.sin(b + .32) * 3.0, bu = cu + Math.cos(b - .4) * 2.4, bv = cv + Math.sin(b - .4) * 2.4; objs.push({ d: lu + lv, f: () => drawLamp(lu, lv) }); objs.push({ d: bu + bv, f: () => drawBench(bu, bv) }); } }
  bridgeObjs(objs);
  // the Old Town centre — the same objects as the live site
  objs.push({ d: 21, f: () => drawPlayground(14.0, 7.2) }); objs.push({ d: 21.6, f: () => drawBench(15.4, 6.6) }); objs.push({ d: 20.2, f: () => drawBench(17.3, 3.0) });
  objs.push({ d: 18.5, f: drawTownHall }); objs.push({ d: 7.15, f: () => drawSiteTent(4.75, 2.4) });
  [[0.95, 16.95, '#ff8a3d'], [2.0, 16.95, '#4da3ff'], [4.1, 16.95, '#3ddc84'], [5.15, 16.95, '#e2483a']].forEach(([u, v, c]) => objs.push({ d: u + v, f: () => drawMarketStall(u, v, c) }));
  objs.push({ d: 6, f: () => drawBench(1.9, 4.2) }); objs.push({ d: 6, f: () => drawBench(4.2, 1.9) });
  for (const [u, v] of [[1.4, 4.6], [4.6, 1.4], [1.4, 1.4]]) { const [tx, ty] = uvS(u, v); objs.push({ d: u + v + .1, f: () => drawTree(ctx, tx, ty, z * .85, 0) }); }
  for (const [u, v] of [[3, .9], [.9, 3], [1.6, 1.6], [4.6, 1.6], [1.6, 4.6]]) objs.push({ d: u + v, f: () => drawLamp(u, v) });
  for (const p of BPARKS) for (const [u, v, kind] of p.trees) { const [tx, ty] = uvS(u, v); objs.push({ d: u + v, f: () => drawTree(ctx, tx, ty, z * .9, kind) }); }
  for (const [u, v, kind] of PARK_TREES) { const [tx, ty] = uvS(u, v); objs.push({ d: u + v, f: () => drawTree(ctx, tx, ty, z * .9, kind) }); }
  objs.push({ d: 9.45, f: () => drawVan(4.55, 4.85, { k: 1 }) });
  if (cabinOn()) objs.push({ d: 6.02, f: () => drawCabin(3, 3, { k: window.__cabinK == null ? 1 : window.__cabinK, label: true }) });
  if (TOWN.milestones.kitten) objs.push({ d: 6.9, f: () => drawMapKitten(3.75, 3.05) });
  marketObjs(objs, 1);
}
/* ================= District 3 — fog bank, build animation, drawing ================= */
const D3STYLE = { face: '#d9b98a', faceIn: '#e7cea6', line: 'rgba(110,75,35,.28)', walk: '#f1e1c0', cren: '#e7cea6', crenTop: '#f8ecd3', stone: '#d8b585', roof: '#25998b', flag: '#ff2e63', banner: '#8e5bd6', ground: '#66a95b',
  curb: '#4f4566', road: '#7d7398', dash: 'rgba(255,255,255,.5)', hedge: ['#2f6b37', '#3f8a4e', '#5aa868'] };
const AUT = ['#ff8a3d', '#e2483a', '#f4b942', '#ffb703'];
// the build, in seconds (the camera moves with it, see the page part)
const D3TL = { fog0: .3, fog1: 3.8, plan0: 2.4, gate0: 4.6, gate1: 6.0, wall0: 5.8, wallA: 9.0, wall1: 15.0, grow0: 14.8, grow1: 19.0, road0: 17.4, road1: 19.6, coaster0: 21.2, coaster1: 25.6, open: 26.0, end: 32.0 };
const D3A0 = .1, RISE = .55;
D3.TL = D3TL;
function d3Head(k) {   // angle from the gate the wall has reached on each side: slow near the gate, then racing round the ring
  const T = D3TL; if (k <= T.wall0) return 0;
  if (k < T.wallA) return D3A0 * (k - T.wall0) / (T.wallA - T.wall0);
  const q = Math.min(1, (k - T.wallA) / (T.wall1 - T.wallA)), D = T.wall1 - T.wallA, rest = Math.PI - D3A0, m0 = D3A0 / (T.wallA - T.wall0) * D / rest, m1 = .5;
  return D3A0 + rest * ((q * q * q - 2 * q * q + q) * m0 + (-2 * q * q * q + 3 * q * q) + (q * q * q - q * q) * m1);
}
function attachD3(d) {
  if (D3.T) return D3.T;
  const T = fromPre(d); wallize(T); STYLE.set(T, D3STYLE); D3.T = T;
  T.gate = T.gates.find(g => g.open); const gA = T.gate.a;
  const off = a => { a = (a - gA) % 6.2832; if (a > Math.PI) a -= 6.2832; if (a < -Math.PI) a += 6.2832; return a; };
  const tAt = da => { da = Math.abs(da); let lo = D3TL.wall0, hi = D3TL.wall1 + .01; for (let i = 0; i < 32; i++) { const m = (lo + hi) / 2; if (d3Head(m) < da) lo = m; else hi = m; } return hi; };
  for (const sg of T.segs) { sg.da = off(sg.am); sg.tA = tAt(sg.da); }
  for (const tw of T.towers) tw.tA = tAt(off(Math.atan2(tw.p[1] - T.C[1], tw.p[0] - T.C[0]))) + .15;
  for (const g of T.gates) g.tA = g.open ? D3TL.gate0 : tAt(off(g.a)) - .3;
  const RG = T.R + 4, tg = (u, v) => D3TL.grow0 + (D3TL.grow1 - D3TL.grow0) * Math.min(1, Math.hypot(u - T.C[0], v - T.C[1]) / RG);
  T.treeT = T.trees.map(t => tg(t[0], t[1])); T.lampT = T.lamps.map(p => tg(p[0], p[1]));
  T.roadLamps = []; { const L = dist(G1N.G, D3G); for (let q = 3; q < L - 2; q += 5.5) { const f = q / L, u = lerp(D3G[0], G1N.G[0], f), v = lerp(D3G[1], G1N.G[1], f); T.roadLamps.push([u - 1.3, v, f], [u + 1.3, v, f]); } }
  HOUSES.forEach((h, i) => { if (i < 10000) return; const L = T.lots[i - 10000]; if (!L) return; h.i = L[0]; h.j = L[1]; h.L3 = L; h.flip = ((i * 2654435761) >>> 0) % 3 === 0; h.town = 3; });
  return T;
}
D3.load = () => {
  if (D3.T) return Promise.resolve(D3.T);
  if (!D3.pr) D3.pr = new Promise((res, rej) => {
    if (window.W3PRE_D3) return res(attachD3(window.W3PRE_D3));
    const sc = document.createElement('script'); sc.src = 'world-d3.js'; sc.onload = () => window.W3PRE_D3 ? res(attachD3(window.W3PRE_D3)) : rej(new Error('no district 3 data')); sc.onerror = () => { D3.pr = null; rej(new Error('district 3 data did not load')); }; document.head.appendChild(sc);
  });
  return D3.pr;
};
const d3k = () => D3.anim ? D3.k : 99;
const d3on = () => !!D3.T && (D3.st === 'open' || !!D3.anim);
function circPath(C, r) { ctx.beginPath(); for (let k = 0; k <= 96; k++) { const a = k / 96 * 6.2832, p = uvS(C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.closePath(); }
function d3Ground(box) {
  if (D3.excl) return;
  const z = cam.z, k = d3k(), T = D3.T, on = d3on(), A = G1N.G, B = D3G;
  G1N.open = on && k >= D3TL.road1;                          // the Old Town's north gate opens once the avenue is paved
  const rp = !on ? 0 : clamp((k - D3TL.road0) / (D3TL.road1 - D3TL.road0), 0, 1);
  uvSpace(() => {
    if (rp < 1) { ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1] - (on ? 0 : 10)); ctx.strokeStyle = '#b39b6e'; ctx.lineWidth = .8; ctx.stroke(); ctx.strokeStyle = '#d8c69c'; ctx.lineWidth = .52; ctx.stroke(); }   // a dirt track into the fog
    if (rp > 0) { const E = [lerp(B[0], A[0], rp), lerp(B[1], A[1], rp)], S0 = [B[0], B[1] - 1.5];
      ctx.beginPath(); ctx.moveTo(S0[0], S0[1]); ctx.lineTo(E[0], E[1]); ctx.strokeStyle = D3STYLE.curb; ctx.lineWidth = 1.2; ctx.stroke(); ctx.strokeStyle = D3STYLE.road; ctx.lineWidth = 1.05; ctx.stroke();
      if (z > .3) { ctx.setLineDash([.38, .38]); ctx.strokeStyle = D3STYLE.dash; ctx.lineWidth = .065; ctx.stroke(); ctx.setLineDash([]); } }
  });
  if (!on) return;
  const st = D3STYLE, band = D3.anim ? sstep(D3TL.wall1 - .8, D3TL.wall1, k) : 1, RG = (T.R + 4) * (D3.anim ? sstep(D3TL.grow0, D3TL.grow1, k) : 1);
  if (band > 0) { ctx.save(); ctx.globalAlpha = band; townPath(T, 3.6); ctx.fillStyle = '#4b8848'; ctx.fill(); townPath(T, 0); ctx.fillStyle = '#5d9e57'; ctx.fill(); ctx.restore(); }
  // the building plan: a dashed line where the wall will stand
  const planA = D3.anim ? sstep(D3TL.plan0, D3TL.plan0 + .8, k) * (1 - sstep(D3TL.wall1, D3TL.wall1 + 1.2, k)) : 0;
  if (planA > 0) { ctx.save(); ctx.globalAlpha = planA * .9; townPath(T, -.2); ctx.setLineDash([Math.max(5, 60 * z), Math.max(4, 40 * z)]); ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1.8, 12 * z); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  // far away, the finished part of the wall is drawn as a bold line so you can watch it close
  const ringA = D3.anim ? (1 - sstep(D3TL.grow1, D3TL.coaster0, k)) * (k > D3TL.wall0 ? 1 : 0) : 0;
  if (ringA > 0 && z < .12) { const hd = Math.min(Math.PI, d3Head(k - RISE)), gA = T.gate.a; if (hd > 0) { ctx.save(); ctx.globalAlpha = ringA * clamp((.12 - z) / .05, 0, 1); ctx.beginPath(); for (let q = 0; q <= 160; q++) { const a = gA - hd + 2 * hd * q / 160, r = T.outerR(a), p = uvS(T.C[0] + Math.cos(a) * r, T.C[1] + Math.sin(a) * r); q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.strokeStyle = '#6e5534'; ctx.lineWidth = 5; ctx.stroke(); ctx.strokeStyle = '#ecd3a2'; ctx.lineWidth = 2.6; ctx.stroke(); ctx.restore(); } }
  if (RG <= 0) return;
  ctx.save(); if (RG < T.R + 3.9) { circPath(T.C, RG); ctx.clip(); }
  townGround(T, box, true); d3Plaza();
  ctx.restore();
}
function d3Plaza() {
  const T = D3.T, z = cam.z, C = T.C, R = T.o.plazaR || 5.8, circ = (r, fill, stroke, lw) => { circPath(C, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
  circ(R + .35, '#8f8170'); circ(R, '#eadcc0', '#b9a888', 1.4 * z); circ(R - .8, '#5aa868', '#4a8d55', 1.2 * z);
  if (z > .3) { ctx.save(); ctx.globalAlpha = .35; circ(R - .4, null, '#ffffff', 3 * z); ctx.restore(); }
}
/* --- the fog bank: soft puffy clouds that drift slowly (until the town reaches 10,000) --- */
const FOGP = (() => { const r = seeded(77), P = []; for (let n = 0; n < 130; n++) { const a = r() * 6.2832, rr = Math.pow(r(), .6) * (D3R + 8), u = D3C[0] + Math.cos(a) * rr, v = D3C[1] + Math.sin(a) * rr; P.push([u, v, 24 + r() * 22, (r() * 4) | 0, r() * 6.28, a, rr]); } return P; })();
const PUFF = [];
function puffSprite(k) {
  if (PUFF[k]) return PUFF[k];
  const W = 320, H = 200, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = seeded(300 + k * 17), B = [], n = 5 + (k % 3);
  for (let i = 0; i < n; i++) { const f = i / (n - 1), rad = 30 + Math.sin(f * Math.PI) * 40 + r() * 12; B.push([42 + f * (W - 84) + (r() - .5) * 16, H - 34 - rad * (.5 + r() * .25), rad]); }
  B.push([W / 2, H - 62, 66]);
  g.lineWidth = 8; g.strokeStyle = 'rgba(78,80,124,.32)'; for (const [x, y, rr] of B) { g.beginPath(); g.arc(x, y, rr, 0, 6.2832); g.stroke(); }
  const gr = g.createLinearGradient(0, 8, 0, H - 24); gr.addColorStop(0, '#fdfdff'); gr.addColorStop(.5, '#e2e4f1'); gr.addColorStop(1, '#b3b7d2');
  g.fillStyle = gr; for (const [x, y, rr] of B) { g.beginPath(); g.arc(x, y, rr, 0, 6.2832); g.fill(); }
  for (const [x, y, rr] of B.slice(0, n)) { const hx = x - rr * .25, hy = y - rr * .32, hg = g.createRadialGradient(hx, hy, 0, hx, hy, rr * .62); hg.addColorStop(0, 'rgba(255,255,255,.6)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hg; g.fillRect(hx - rr, hy - rr, rr * 2, rr * 2); }
  g.globalCompositeOperation = 'destination-out'; const fade = g.createLinearGradient(0, H - 40, 0, H); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = fade; g.fillRect(0, H - 40, W, 40);
  return (PUFF[k] = c);
}
function fogObjs(objs, inB, A) {
  const z = cam.z, lift = 1 - A, T = S.T;
  // a soft fog layer underneath, so the ground never shows between the puffs
  objs.push({ d: D3C[0] + D3C[1] - D3R - 20, f: () => { ctx.save(); for (const [m, a] of [[16, .35], [9, .6], [2, .9]]) { ctx.globalAlpha = a * A; circPath(D3C, D3R + m); ctx.fillStyle = '#d9dcec'; ctx.fill(); } ctx.restore(); } });
  for (const [u0, v0, sz, kind, ph, ang, rr] of FOGP) {
    const out = lift * lift * (30 + rr * .35), u = u0 + Math.cos(ang) * out + Math.sin(T * .06 + ph) * 3, v = v0 + Math.sin(ang) * out + Math.cos(T * .045 + ph) * 2;
    if (!inB(u, v)) continue;
    objs.push({ d: u + v + 2, f: () => { const [x, y] = uvS(u, v), w = sz * 92 * z * (1 + lift * .3), h = w * .625; ctx.globalAlpha = A * (1 - lift * lift * .5); ctx.drawImage(puffSprite(kind), x - w / 2, y - h * .78 - lift * 70 * z * sz / 30, w, h); ctx.globalAlpha = 1; } });
  }
}
/* --- a piece of wall being laid: finished rows + the stone that is just falling into place --- */
function drawWallSegB(T, sg, hk) {
  if (hk >= 1) return drawWallSeg(T, sg);
  const z = cam.z, st = STYLE.get(T), rows = 5, r = Math.min(rows - 1, Math.floor(hk * rows)), f = hk * rows - r;
  if (r > 0) drawWallSeg(T, sg, r / rows);
  if (z < .07) return;
  const nu = Math.cos(sg.am), nv = Math.sin(sg.am), fu = (nu + nv) > 0 ? .45 : -.45, m = [(sg.p0[0] + sg.p1[0]) / 2, (sg.p0[1] + sg.p1[1]) / 2], du = (sg.p1[0] - sg.p0[0]) / 2, dv = (sg.p1[1] - sg.p0[1]) / 2;
  const P = (a, b) => uvS(m[0] + du * a + nu * fu * b, m[1] + dv * a + nv * fu * b), U = (p, h) => [p[0], p[1] - h * z];
  const hh = WALL_H / rows, h0 = hh * r, y0 = h0 + (1 - f) * (1 - f) * 90, y1 = y0 + hh, F0 = P(-1, 1), F1 = P(1, 1), B0 = P(-1, -1), B1 = P(1, -1);
  poly(ctx, [U(F0, y0), U(F1, y0), U(F1, y1), U(F0, y1)], shade(st.face, 1.04), OUT, 1 * z);
  poly(ctx, [U(F0, y1), U(F1, y1), U(B1, y1), U(B0, y1)], st.walk, OUT, .8 * z);
  if (r > 0 && f < .3) { const q = f / .3, [x, y] = uvS(m[0] + nu * fu, m[1] + nv * fu); ctx.globalAlpha = .7 * (1 - q); for (let i = 0; i < 4; i++) ellipse(ctx, x + (i - 1.5) * 10 * z * (1 + q), y - h0 * z - 3 * z * q, (8 + q * 10) * z, (4 + q * 4) * z, '#efe4cc'); ctx.globalAlpha = 1; }
}
/* --- the Benny Coaster in the middle of District 3 (the track is laid piece by piece while p goes 0 → 1) --- */
function drawCoaster3(C, p) {
  const z = cam.z, sc = 1.9, cu = C[0], cv = C[1], HS = 1.5;
  const P = t => { const a = t * Math.PI * 2, lp = Math.exp(-Math.pow((t - .62) / .05, 2)); return [cu + Math.cos(a) * 2.4 * sc + lp * Math.sin((t - .62) * 60) * .6 * sc, cv + Math.sin(a) * 2.2 * sc, (30 + 85 * Math.pow(Math.max(0, Math.sin(a * 2 + .6)), 1.5) + 110 * lp * (1 + Math.cos((t - .62) * 60)) / 2) * HS]; };
  const n = 220, lim = Math.floor(n * p);
  for (let k = 0; k <= lim; k += 4) { const [u, v, h] = P(k / n), [x, y] = uvS(u, v); line(ctx, x, y, x, y - h * z, '#7a6a55', 2.4 * z); }
  for (const off of [-.08, .08]) { ctx.beginPath(); for (let k = 0; k <= lim; k++) { const [u, v, h] = P(k / n), [x, y] = uvS(u + off, v - off); k ? ctx.lineTo(x, y - h * z) : ctx.moveTo(x, y - h * z); } ctx.strokeStyle = '#ff2e63'; ctx.lineWidth = 3.6 * z; ctx.stroke(); }
  if (p > 0 && p < 1) { const [u, v, h] = P(lim / n), [x, y] = uvS(u, v); circle(ctx, x, y - h * z, 7 * z * (1 + .3 * Math.sin(S.T * 20)), 'rgba(255,230,140,.9)'); }   // welding spark at the end of the track
  if (p >= 1) for (let c = 0; c < 5; c++) { const t = ((S.T * .09) + c * .011) % 1, [u, v, h] = P(t), [x, y] = uvS(u, v); rrect(ctx, x - 10 * z, y - h * z - 13 * z, 20 * z, 11 * z, 3 * z); ctx.fillStyle = CONF[c % CONF.length]; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.2 * z; ctx.stroke(); circle(ctx, x, y - h * z - 16 * z, 3.2 * z, '#e8b896'); }
  const [ex, ey] = uvS(cu + 4.1, cv + 4.1); if (p >= 1 && z > .3) tag(ex, ey - 70 * z, '🎢 BENNY COASTER', '#ff2e63', 1);
}
function d3Objs(objs, inB) {
  if (D3.excl) return;
  const z = cam.z, anim = !!D3.anim, k = d3k(), fogA = !d3on() ? 1 : anim ? 1 - sstep(D3TL.fog0, D3TL.fog1, k) : 0;
  if (fogA > 0) fogObjs(objs, inB, fogA);
  if (!d3on()) return;
  const T = D3.T, st = D3STYLE;
  for (const sg of T.segs) { const m = [(sg.p0[0] + sg.p1[0]) / 2, (sg.p0[1] + sg.p1[1]) / 2]; if (!inB(m[0], m[1])) continue; const hk = anim ? clamp((k - sg.tA) / RISE, 0, 1) : 1; if (hk <= 0) continue; objs.push({ d: m[0] + m[1] + ((Math.cos(sg.am) + Math.sin(sg.am)) > 0 ? .6 : -.6), f: () => drawWallSegB(T, sg, hk) }); }
  for (const tw of T.towers) { const [u, v] = tw.p; if (!inB(u, v)) continue; const g = anim ? clamp((k - tw.tA) / .7, 0, 1) : 1; if (g <= 0) continue; objs.push({ d: u + v + .9, f: () => drawTower(u, v, tw.k, st, g < 1 ? eOut(g) : 1) }); }
  for (const g of T.gates) { const [u, v] = g.c; if (!inB(u, v)) continue; const gk = anim ? clamp((k - g.tA) / (g.open ? D3TL.gate1 - D3TL.gate0 : .8), 0, 1) : 1; if (gk <= 0) continue; objs.push({ d: u + v + .7, f: () => drawGatehouse(T, g, gk < 1 ? eOut(gk) : 1) }); }
  if (z > .045) T.trees.forEach(([u, v, kind, s], i) => { if (!inB(u, v)) return; const p = anim ? eBack(clamp((k - T.treeT[i]) / .45, 0, 1)) : 1; if (p <= .01) return; const [x, y] = uvS(u, v); objs.push({ d: u + v, f: () => i % 5 < 3 ? drawTreeFast(x, y, z * s * .95 * p, 2, AUT[(i >> 2) % 4]) : drawTreeFast(x, y, z * s * p, kind) }); });
  else objs.push({ d: -1e8 + 1, f: () => { const rr = Math.max(1.05, 20 * z), lift = 16 * z, P = [new Path2D(), new Path2D()]; T.trees.forEach((t, i) => { if (anim && k < T.treeT[i]) return; if (!inB(t[0], t[1])) return; const [x, y] = uvS(t[0], t[1]), p = P[i % 5 < 3 ? 1 : 0]; p.moveTo(x + rr, y - lift); p.arc(x, y - lift, rr, 0, 6.2832); }); ctx.fillStyle = '#2f6b37'; ctx.fill(P[0]); ctx.fillStyle = '#e07a35'; ctx.fill(P[1]); } });
  if (z > .15) { T.lamps.forEach(([u, v], i) => { if (anim && k < T.lampT[i]) return; if (inB(u, v)) objs.push({ d: u + v + .02, f: () => drawStreetLamp(u, v, 1) }); });
    const rp = anim ? clamp((k - D3TL.road0) / (D3TL.road1 - D3TL.road0), 0, 1) : 1; for (const [u, v, f] of T.roadLamps) if (f <= rp && inB(u, v)) objs.push({ d: u + v + .02, f: () => drawStreetLamp(u, v, 1) }); }
  const cp = anim ? clamp((k - D3TL.coaster0) / (D3TL.coaster1 - D3TL.coaster0), 0, 1) : 1, [cu, cv] = T.C;
  if (cp > 0 && inB(cu, cv)) objs.push({ d: cu + cv + 2.5, f: () => drawCoaster3(T.C, cp) });
  // builders: hammering at the two ends of the growing wall, then round the coaster
  if (anim && z > .1) {
    const B = [];
    if (k > D3TL.gate0 && k < D3TL.wall1 + .4) { const hd = d3Head(k), gA = T.gate.a; if (k < D3TL.wall0 + .3) B.push([T.gate.c[0] - T.gate.n[0] * 2.4 - T.gate.t[0] * 1.6, T.gate.c[1] - T.gate.n[1] * 2.4 - T.gate.t[1] * 1.6], [T.gate.c[0] - T.gate.n[0] * 2.4 + T.gate.t[0] * 1.6, T.gate.c[1] - T.gate.n[1] * 2.4 + T.gate.t[1] * 1.6]);
      for (const sd of [-1, 1]) { const a = gA + sd * hd, r = T.outerR(a) - 2.3; B.push([T.C[0] + Math.cos(a) * r, T.C[1] + Math.sin(a) * r], [T.C[0] + Math.cos(a - sd * .012) * (r - 1), T.C[1] + Math.sin(a - sd * .012) * (r - 1)]); } }
    if (k > D3TL.coaster0 - .5 && k < D3TL.coaster1 + .3) for (let q = 0; q < 5; q++) { const a = q / 5 * 6.2832 + .4, r = (T.o.plazaR || 5.8) - .5; B.push([cu + Math.cos(a) * r, cv + Math.sin(a) * r]); }
    for (const [u, v] of B) if (inB(u, v)) objs.push({ d: u + v + .05, f: () => { const [x, y] = uvS(u, v); drawBuilder(x, y, z * 1.7); } });
  }
  // far away: a glowing cloud of dust where the wall is being built, so you can follow it round
  if (anim && k > D3TL.wall0 && k < D3TL.wall1 + .3 && z < .14) { const hd = d3Head(k), gA = T.gate.a; for (const sd of [-1, 1]) { const a = gA + sd * hd, r = T.outerR(a), u = T.C[0] + Math.cos(a) * r, v = T.C[1] + Math.sin(a) * r; objs.push({ d: 1e8, f: () => { const [x, y] = uvS(u, v), R = 16 + 3 * Math.sin(S.T * 12 + sd); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y - 4, 1, x, y - 4, R); g.addColorStop(0, 'rgba(255,236,170,.95)'); g.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - R, y - 4 - R, 2 * R, 2 * R); ctx.restore(); ctx.save(); ctx.translate(x + 9, y - 16 - Math.abs(Math.sin(S.T * 9 + sd)) * 6); ctx.rotate(-.5 + Math.abs(Math.sin(S.T * 9 + sd)) * .8); emoji(ctx, '🔨', 0, 0, 15); ctx.restore(); } }); } }
  // signposts on the first lots: the next neighbours move in here
  const n = HOUSES.length, from = n >= D3AT ? n - D3AT : 0, sp = anim ? clamp((k - D3TL.open - 1.2) / .8, 0, 1) : 1;
  if (sp > 0 && (n >= D3AT || anim || D3.preview)) T.lots.slice(from, from + 40).forEach((L, i) => { if (!inB(L[0], L[1])) return; const p = anim ? eBack(clamp(sp * 2.2 - i * .03, 0, 1)) : 1; if (p <= .01) return; const [sx, sy] = uvS(L[0], L[1]); objs.push({ d: L[0] + L[1], f: () => drawSignPost(sx, sy, z * p) }); });
}
function d3Live() { const z = cam.z, box = visBox(), inB = (u, v) => u > box[0] && u < box[2] && v > box[1] && v < box[3]; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; d3Ground(box); const objs = []; d3Objs(objs, inB); objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f(); }
/* --- labels: the fog's sign, and the big moments of the build --- */
function d3Labels() {
  if (d3on() && !D3.anim) return;
  if (D3.anim && D3.k > D3TL.fog0 + .5) return;
  const z = cam.z; if (z > .35) return;
  const a = Math.atan2(-1, -1), r = D3R * .55, [x, y] = uvS(D3C[0] + Math.cos(a) * r, D3C[1] + Math.sin(a) * r);
  if (x < -100 || x > VW + 100 || y < -40 || y > VH + 40) return;
  tag(x, y - 8, '☁️ The fog lifts at ' + D3AT.toLocaleString('en-US') + ' neighbors', '#c7b8ff', 1, clamp(HOUSES.length / D3AT, 0, 1));
}
function d3Overlay() {
  if (!D3.anim) return;
  const k = D3.k, L = D3TL, cx = VW / 2, ty = Math.max(96, VH * .13);
  const cap = (t0, t1, big, small, col) => { if (D3.noCaps || k < t0 || k > t1) return; const a = Math.min(1, (k - t0) / .35, (t1 - k) / .35), pop = eBack(clamp((k - t0) / .45, 0, 1)); ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, ty); ctx.scale(pop, pop);
    const bs = fitSize(big, Math.min(40, VW * .095), VW - 36); otxt(big, 0, 0, bs, col || '#ffd23f', Math.max(5, bs * .2), '#1b1728');
    if (small) { const ss = fitSize(small, Math.min(20, VW * .05), VW - 50); otxt(small, 0, bs * .95, ss, '#ffffff', Math.max(4, ss * .3), '#1b1728'); }
    ctx.restore(); };
  cap(.2, 4.6, '🎉 ' + D3AT.toLocaleString('en-US') + ' NEIGHBORS!', 'The fog is lifting…');
  cap(5.0, 14.6, '🧱 Building District 3', 'stone by stone', '#ffd23f');
  cap(15.0, 20.4, '🏘️ Streets for 5,000 houses', null, '#7ee3a0');
  cap(21.0, 25.6, '🎢 …and a ROLLERCOASTER!', null, '#ff8fb0');
  cap(26.0, L.end, '🏰 DISTRICT 3 IS OPEN!', 'Houses #10,001 – #15,000 move in here', '#ffd23f');
  // fireworks over the new district
  if (k > L.open - .2) { const R = seeded(5); for (let b = 0; b < 12; b++) { const tb = L.open + b * .42 + R() * .2, bx = VW * (.18 + .64 * R()), by = VH * (.2 + .26 * R()), col = CONF[b % CONF.length], tt = k - tb; if (tt < -.45 || tt > 1.7) { for (let q = 0; q < 38; q++) R(); continue; }
    if (tt < 0) { const q = (tt + .45) / .45; circle(ctx, bx, by + (1 - q) * VH * .3, 3, '#fff3c4'); for (let q2 = 0; q2 < 38; q2++) R(); continue; }
    ctx.save(); ctx.globalAlpha = clamp(1 - tt / 1.7, 0, 1); for (let q = 0; q < 38; q++) { const an = q / 38 * 6.2832 + R() * .2, sp = (110 + R() * 80) * Math.min(1, VW / 420), d = sp * (1 - Math.exp(-tt * 2.6)) / 2.6 * 2.2; ctx.fillStyle = q % 3 ? col : '#ffffff'; ctx.beginPath(); ctx.arc(bx + Math.cos(an) * d, by + Math.sin(an) * d + 40 * tt * tt, 2.8 * Math.min(1.6, VW / 420), 0, 6.2832); ctx.fill(); } ctx.restore(); } }
}
function labels() { const z = cam.z; if (z > .45) { const [bx, by] = uvS(3.5, 3.65); tag(bx, by - 104 * z - 6, 'BENNY · €' + (TOWN.bankCents / 100).toFixed(2), '#ff6b8b', 1); } }
return { D3, d3Labels, d3Overlay, d3Live, makeTown, ground, worldObjs, labels, T1, T2, C1, C2, G1, G2, GA1, GA2, MID, LM_LOOPS, STYLE, FOREST, FOREST_FAR, RIVER, RIVER_FAR, carLights, BG1, BG2, BR_W, NEXT2, drawTown2Square, P2R, lmSDF, M, CARS, carAt, bennyRoute, carObjs };
})();
function w3draw() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  W3.ground(); const objs = []; W3.worldObjs(objs); objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f(); W3.labels();
}
