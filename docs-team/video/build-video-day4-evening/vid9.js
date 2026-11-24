/* ===================== FOLGE 9 – EVENING DAY 4 — "Tires + the marketplace opens" ===================== */
const VDUR = __DUR__;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376, H_ = 1920;
const BANK0 = 10800, TIRE = 2250;
const T = {
  tires: [5.98, 6.86, 7.74, 8.54], walk0: 9.7, walk1: 10.5, truth: 10.16, stut0: 12.85, vroom: 15.3,
  drive1: 18.6, drive2: 22.9, stop2: 26.7, wait: 27.5, count0: 28.3, five: 30.0, over: 31.6,
  rev0: 34.9, rev1: 37.4, open: 36.1, shops: 39.45, wide: 43.6, cars: 44.55, close: 48.9, left: 50.6, buy: 53.9, end0: 56.6,
};
const CUTS = [T.drive1, T.drive2, T.over, T.shops, T.wide, T.close];
const VAN0 = [4.55, 4.85], GROUND = [4.25, 5.55], DOOR = [4.95, 5.32];
const D1 = { v: -6.0, u0: 5.0, u1: 17.5 }, D2 = { v: -24.0, u0: -40.0, u1: -28.6 };
const LOTV = [-14.0, -20.0], BLOT = [-14.55, -19.05];
const MKC = [-19.4, -18.9];
const SHOP_U = k => -23.35 + 1.7 * k + .62;
const W_ = (u, v) => isoW(u, v);
let VCAPS = [], VMOUTH = [];

/* ---------- van + benny state ---------- */
function vanState(t) {
  const n = T.tires.filter(x => t >= x).length;
  if (t < T.drive1) {
    const lift = 1.5 + 3.5 * sstep(vprog(t, T.tires[0] - .1, T.tires[3] + .25)) + (n ? Math.abs(Math.sin((t - T.tires[Math.max(0, n - 1)]) * 18)) * 1.2 * Math.exp(-(t - T.tires[Math.max(0, n - 1)]) * 6) : 0);
    let jit = 0; if (vin(t, T.stut0, T.vroom)) jit = (Math.sin(t * 61) + Math.sin(t * 37)) * .8 * (Math.sin((t - T.stut0) * 4.2) > 0 ? 1 : .3);
    if (t >= T.vroom) jit = Math.sin(t * 40) * .5 * Math.exp(-(t - T.vroom) * 1.5) + Math.sin(t * 30) * .25;
    return { u: VAN0[0], v: VAN0[1], o: { k: 1, tires: n, lift: lift + jit, smoke: t > T.vroom ? (t * .9) % 1 : 0 } };
  }
  if (t < T.drive2) { const u = lerp(D1.u0, D1.u1, vprog(t, T.drive1, T.drive2)); return { u, v: D1.v, o: { k: 1, spin: -t * 14, lift: 5 + Math.sin(t * 22) * .5, smoke: (t * 1.4) % 1 } }; }
  if (t < T.close) { const p = vprog(t, T.drive2, T.stop2), u = lerp(D2.u0, D2.u1, 1 - Math.pow(1 - p, 2)); return { u, v: D2.v, o: { k: 1, spin: p < 1 ? -t * 14 : 0, lift: 5 + (p < 1 ? Math.sin(t * 22) * .5 : 0), smoke: p < 1 ? (t * 1.4) % 1 : 0 } }; }
  return { u: LOTV[0], v: LOTV[1], o: { k: 1 } };
}
function bennyState(t, m) {
  if (t < T.walk0) {
    let o = { pose: 'stand', mood: 'happy', look: [.6, -.2], talk: m };
    if (t < 1.6) o = { pose: 'stand', mood: 'surprised', look: [0, -.3], talk: m };
    if (vin(t, 3.4, 4.7)) o = { pose: 'stand', mood: 'happy', armsUp: true, look: [0, 0], talk: m };
    if (vin(t, 8.54, 9.6)) o = { pose: 'stand', mood: 'happy', armsUp: true, look: [0, 0], talk: m };
    return { pos: GROUND, o };
  }
  if (t < T.walk1 + .3) {
    const u = sstep(vprog(t, T.walk0, T.walk1)), s = 1 - sstep(vprog(t, T.walk1, T.walk1 + .3));
    return { pos: [lerp(GROUND[0], DOOR[0], u), lerp(GROUND[1], DOOR[1], u)], o: { pose: 'stand', mood: 'hope', walk: t * 9, look: [.5, -.3] }, s };
  }
  if (t < T.close) return null;
  let o = { pose: 'stand', mood: 'happy', look: [0, 0], talk: m };
  if (vin(t, T.left, T.left + 1.2)) o = { pose: 'stand', mood: 'sad', look: [0, .4], talk: m };
  if (vin(t, T.buy, T.buy + 1.3)) o = { pose: 'stand', mood: 'hope', look: [.4, -.8], talk: m };
  return { pos: BLOT, o };
}

/* ---------- camera ---------- */
function setCam(x, y, z) { cam.x = x; cam.y = y; cam.z = z; }
function camAt(t) {
  const [vx, vy] = W_(VAN0[0], VAN0[1]);
  if (t < T.drive1) {
    let z = lerp(2.8, 3.1, sstep(vprog(t, 0, 5))), y = vy - 30;
    if (t > 9.4) z = lerp(3.1, 3.7, sstep(vprog(t, 9.4, 12.6)));
    if (t > T.vroom) z = lerp(3.7, 2.9, sstep(vprog(t, T.vroom, T.vroom + .5)));
    let jx = 0, jy = 0; if (vin(t, T.stut0, T.vroom + .8)) { jx = Math.sin(t * 53) * 3; jy = Math.sin(t * 41) * 2; }
    return setCam(vx + jx, y + jy, z);
  }
  if (t < T.drive2) { const s = vanState(t), [x, y] = W_(s.u + .3, s.v); return setCam(x, y - 40, lerp(2.5, 2.2, vprog(t, T.drive1, T.drive2))); }
  if (t < T.over) {
    const s = vanState(t), [x, y] = W_(s.u + .3, s.v), [sx, sy] = W_(-24, -20);
    const k = sstep(vprog(t, T.stop2 - .4, T.wait + .6));
    return setCam(lerp(x, lerp(x, sx, .55), k), lerp(y - 40, lerp(y, sy, .55) - 60, k), lerp(2.2, 1.15, k));
  }
  if (t < T.shops) { const [x, y] = W_(MKC[0], MKC[1]); return setCam(x, y - 30, lerp(1.0, 1.25, sstep(vprog(t, T.over, T.shops)))); }
  if (t < T.wide) {
    const keys = [[T.shops, 0], [39.8, 0], [40.78, 1], [41.82, 2], [42.94, 3], [43.6, 3.6]];
    let k = 0; while (k < keys.length - 2 && t > keys[k + 1][0]) k++;
    const a = keys[k], b = keys[k + 1], f = lerp(a[1], b[1], sstep(vprog(t, a[0], b[0])));
    const [x, y] = W_(-23.35 + 1.7 * f + .62, -22.4); return setCam(x, y - 70, 2.1);
  }
  if (t < T.close) { const [x, y] = W_(MKC[0], MKC[1]); return setCam(x, y - 40, lerp(1.2, .95, sstep(vprog(t, T.wide, T.close)))); }
  const [x, y] = W_(LOTV[0] - .2, LOTV[1] + .4); return setCam(x, y - 60, lerp(3.0, 3.3, vprog(t, T.close, T.end0)));
}

/* ---------- market build state ---------- */
const PTAB = [[0, 0], [35.0, 0], [36.4, .09], [39.7, .17], [39.8, .18], [40.78, .25], [41.82, .32], [42.94, .39], [43.4, .46], [43.8, .53], [44.55, .8], [45.2, 1]];
function mkP(t) { if (t < PTAB[1][0]) return 0; for (let k = 1; k < PTAB.length; k++) if (t < PTAB[k][0]) { const a = PTAB[k - 1], b = PTAB[k]; return lerp(a[1], b[1], vprog(t, a[0], b[0])); } return 1; }
function revealR(t) { return 18 * sstep(vprog(t, T.rev0, T.rev1)); }
function vGround(t) {
  const R = revealR(t), z = cam.z; if (R >= 18) { VMK_DRAW = true; drawMarketGround(1); VMK_DRAW = false; return; }
  ctx.save(); mkPath(.14); ctx.fillStyle = '#7a6f5b'; ctx.fill(); mkPath(0); ctx.fillStyle = '#8a7f6a'; ctx.fill();
  ctx.clip(); const r = seeded(9); for (let k = 0; k < 60; k++) { const [x, y] = uvS(-28 + r() * 16, -24 + r() * 12); ellipse(ctx, x, y, 16 * z, 7 * z, '#7a6f5b'); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = clamp((18 - R) / 4, 0, 1); ctx.setLineDash([9 * z, 7 * z]); ctx.strokeStyle = '#ff8c2a'; ctx.lineWidth = 4 * z; mkPath(.05); ctx.stroke(); ctx.restore();
  if (R > 0) { ctx.save(); const [cx, cy] = uvS(MK_TOWER[0], MK_TOWER[1]); ctx.beginPath(); ctx.ellipse(cx, cy, R * TW / 2 * z * 1.42, R * TH / 2 * z * 1.42, 0, 0, Math.PI * 2); ctx.clip(); VMK_DRAW = true; drawMarketGround(1); VMK_DRAW = false; ctx.restore(); }
}

/* ---------- overlays ---------- */
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function tenantsAt(t) { return Math.round(lerp(4984, 5000, Math.pow(vprog(t, T.count0, T.five), .8))); }
function bankAt(t) { return BANK0 - TIRE * T.tires.filter(x => t >= x).length; }
function vHUD(t) {
  const c = bankAt(t), n = tenantsAt(t);
  const counting = vin(t, T.count0, T.five + 1.5), fiveHit = t >= T.five;
  if (counting) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 440, 20, 540, 440, 420); g.addColorStop(0, 'rgba(255,210,63,.3)'); g.addColorStop(1, 'rgba(255,210,63,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 900); ctx.restore(); }
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const lastT = T.tires.filter(x => t >= x).pop(), bump = lastT != null && t - lastT < .35 ? 1 + .08 * Math.sin((t - lastT) * 30) : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, c < BANK0 && t < T.drive1 + 2 && lastT != null && t - lastT < .4 ? '#ff6b6b' : '#46e08a', 12, '#06070f'); ctx.restore();
  const s = 'DAY 4  ·  ' + n.toLocaleString('en-US') + ' tenants';
  if (counting) { const k = 1 + .12 * Math.abs(Math.sin(t * 14)) * (fiveHit ? Math.exp(-(t - T.five) * 2) * 3 : 1); ctx.save(); ctx.translate(540, 440); ctx.scale(k, k); txt(s, 0, 0, 30, fiveHit ? '#ffd23f' : '#ffffff', 'center', 'middle'); ctx.restore(); }
  else txt(s, 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const f = 'Follow = you move in 🏠', w = ctx.measureText(f).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2);
  txt(f, 540, 510, 26, '#fff', 'center', 'middle');
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1500, sz = 66, maxW = 940;
  ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15));
  ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => {
    const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; }
  });
  ctx.restore();
}
const VCONF = []; { const r = seeded(31); for (let k = 0; k < 160; k++) VCONF.push([r() * 1080, -50 - r() * 500, (r() - .5) * 300, 500 + r() * 700, r() * 6.28, ['#ff2e63', '#ffd23f', '#46e08a', '#4da3ff', '#c77dff', '#ff8a3d'][k % 6]]); }
function confetti(t, t0) {
  if (t < t0 || t > t0 + 3) return; const d = t - t0;
  for (const [x, y, vx, vy, a, c] of VCONF) { const px = x + vx * d, py = y + vy * d + 200 * d * d; if (py > 1950) continue; ctx.save(); ctx.translate(px, py); ctx.rotate(a + d * 6); ctx.fillStyle = c; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
}
// houses along the first ride (for "Hi neighbors!")
const RIDE = HOUSES.filter(h => (h.j === -5 || h.j === -7) && h.i > D1.u0 + 2 && h.i < D1.u1 - 1).sort((a, b) => a.i - b.i);
function rideTags(t) {
  if (!vin(t, T.drive1 + .3, T.drive2)) return;
  const s = vanState(t), z = cam.z;
  for (const h of RIDE) {
    const dt = s.u - h.i; if (dt < -1.2 || dt > 2.6) continue;
    const a = clamp((dt + 1.2) / .5, 0, 1) * clamp((2.6 - dt) / .5, 0, 1), [sx, sy] = uvS(h.i, h.j), st = STY[0];
    ctx.save(); ctx.globalAlpha = a; tag(sx, sy - (st.wall + st.roofH + st.f * 32 + 16) * z, '👋 @' + h.name, '#ffd23f', 1); ctx.restore();
  }
}
function overlays(t) {
  // hook: poll result
  vstamp('YOU VOTED 🗳️', 540, 640, t, .5, 4.6, 92, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  if (vin(t, 1.5, 5.4)) {
    const k = eBack(vprog(t, 1.5, 1.8)), a = clamp((5.4 - t) / .25, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 900); ctx.scale(k, k);
    panel(-440, -150, 880, 300, 36, 'rgba(10,12,26,.92)', 'rgba(255,255,255,.25)', 3);
    [['🛞 New tires', .74, '#ff8a3d'], ['🐱 Adopt a cat', .20, '#c77dff'], ['🍕 Pizza party', .06, '#4da3ff']].forEach(([n, f, c], i) => {
      const y = -95 + i * 95, ff = f * sstep(vprog(t, 1.8 + i * .1, 3.2)), win = i === 0 && t > 3.5;
      panel(-410, y - 34, 820, 68, 22, 'rgba(255,255,255,.07)', win ? '#ffd23f' : null, win ? 4 : 0);
      panel(-410, y - 34, Math.max(44, 820 * ff), 68, 22, c);
      txt(n, -385, y + 1, 36, '#fff', 'left', 'middle'); txt(Math.round(ff * 100) + '%', 390, y + 1, 38, '#fff', 'right', 'middle');
    });
    ctx.restore();
  }
  vstamp('TIRES WIN! 🛞', 540, 640, t, 3.5, 5.6, 104, '#ffd23f', .03, 'rgba(10,12,26,.88)');
  // tires
  T.tires.forEach((t0, i) => {
    vstamp(String(i + 1), 540, 660, t, t0, t0 + .8, 150, '#ffd23f', (i % 2 ? .06 : -.06), null);
    if (vin(t, t0, t0 + 1.1)) { const u = vprog(t, t0, t0 + 1.1); ctx.save(); ctx.globalAlpha = 1 - u; otxt('−€22.50', 790, 560 - u * 60, 46, '#ff6b6b', 8); ctx.restore(); }
  });
  vstamp('🛞🛞🛞🛞 = €90', 540, 640, t, 8.9, 9.9, 80, '#ffffff', 0, 'rgba(10,12,26,.88)');
  vstamp('MOMENT OF TRUTH 😬', 540, 640, t, 10.3, T.stut0, 80, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🔑 rrr… rrr…', 540, 640, t, T.stut0, T.vroom - .05, 84, '#c3c9e4', .03, 'rgba(10,12,26,.88)');
  vstamp('IT WORKS!! 😭', 540, 640, t, T.vroom, T.drive1, 110, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  vstamp('VROOOM 💨', 540, 790, t, T.vroom + .5, T.drive1, 70, '#ffffff', .03, null);
  vstamp('FIRST RIDE 🚐💨', 540, 640, t, T.drive1 + .1, T.drive2, 90, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  vstamp('BEEP BEEP 📯', 540, 780, t, 21.55, 22.85, 64, '#ffffff', .04, null);
  rideTags(t);
  vstamp('WAIT… 👀', 540, 640, t, T.wait, T.five, 100, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  if (vin(t, T.wait + .3, T.five + .05)) { const a = .5 + .5 * Math.sin(t * 10); ctx.save(); ctx.globalAlpha = a; otxt('👆', 840, 520, 90, '#fff', 0); ctx.restore(); }
  vstamp('5,000 🎉', 540, 680, t, T.five, T.over, 170, '#ffd23f', -.04, null);
  vstamp('TENANTS!', 540, 820, t, T.five + .2, T.over, 80, '#ffffff', .03, null);
  confetti(t, T.five);
  vstamp('YOU DID IT 🥹', 540, 640, t, 31.8, 34.9, 96, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🛍️ MARKETPLACE OPEN!', 540, 640, t, T.open, T.shops, 84, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  if (vin(t, T.open, T.open + 3)) confetti(t, T.open);
  vstamp('🥐 ☕ 🍦 🍕 🧸 🍔', 540, 640, t, 43.6, T.cars, 84, '#ffffff', 0, 'rgba(10,12,26,.88)');
  vstamp('+ CARS IN TOWN 🚗🚕', 540, 640, t, T.cars, T.close, 80, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  vstamp('€18 LEFT 💸', 540, 640, t, T.left, T.buy, 104, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  vstamp('WHAT SHOULD I BUY? 🛍️', 540, 640, t, T.buy, T.end0, 76, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('COMMENT 👇', 540, 780, t, 55.2, T.end0, 70, '#ffffff', 0, '#ff2e63');
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.fillStyle = `rgba(6,8,20,${.45 * vprog(t, T.end0, T.end0 + .3)})`; ctx.fillRect(0, 0, W, H_);
    ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt("and move into Benny's town 🏠", 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = vprog(t, T.end0 + .3, T.end0 + .6); txt('Find your house: link in bio 🔗', 540, 910, 34, '#fff', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}
// incoming tires roll in from the right and bounce into place
function tireObjs(t, objs) {
  const z = cam.z, u0 = VAN0[0] - .6, u1 = VAN0[0] + .6, v1 = VAN0[1] + .27;
  const slots = [[u0 + .16, v1], [u1 - .12, v1 - .025], [u1 - .12, VAN0[1] - .27], [u0 + .16, VAN0[1] - .27]];
  T.tires.forEach((tl, i) => {
    const ta = tl - .6; if (t < ta || t >= tl) return; const p = vprog(t, ta, tl), [su, sv] = slots[i];
    const u = su + 2.6 * (1 - p), hop = Math.abs(Math.sin(p * Math.PI * 2)) * 30 * (1 - p);
    objs.push({ d: su + sv + .4, f: () => { const [x, y] = uvS(u, sv + .35); ellipse(ctx, x, y + 2 * z, 9 * z, 3 * z, 'rgba(0,0,0,.25)'); ctx.save(); ctx.translate(x, y - 7 * z - hop * z); ctx.rotate(-p * 12); ellipse(ctx, 0, 0, 7.5 * z, 7.5 * z, '#1f2233', OUT, 1 * z); circle(ctx, 0, 0, 3 * z, '#b9bdcc'); line(ctx, 0, 0, 3 * z, 0, '#555a6e', 1.2 * z); ctx.restore(); } });
  });
}

/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  camAt(t);
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  const b = bennyState(t, m), vs = vanState(t);
  if (b) { BPOS = b.pos; BDY = 0; BD = null; BENNY_O = () => b.o; BSCALE = b.s == null ? 1 : b.s; } else { BPOS = [999, 999]; BENNY_O = null; BSCALE = 0; }
  BENNY_CARD = true;
  TOWN.milestones.van = false;
  VFEATP = mkP(t);
  VGROUND = () => vGround(t);
  EXTRA_OBJS = objs => { objs.push({ d: vs.u + vs.v + .3, f: () => drawVan(vs.u, vs.v, vs.o) }); tireObjs(t, objs); };
  draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  overlays(t);
  vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H_); }
  for (const c of CUTS) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, H_); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
};
