/* ===================== EPISODE 6 — "Campervan + street lights" ===================== */
const VDUR = 44.6, HUDY = 376;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
let VCAPS = [], VMOUTH = [];
const T = { card0: .6, walk0: 4.7, mkt: 8.0, buyVan: 12.0, smoke: 13.8, toLights: 18.3, buyLights: 19.9, night0: 21.2, push0: 22.6, cut2: 26.6, lights0: 28.9, wide: 30.2, home: 34.8, end0: 39.8 };
const VAN_MKT = [2.7, 18.05], VAN_HOME = [4.55, 4.85];
const STALLS = [
  { u: 0.95, v: 16.95, e: '⛺', col: '#ff8a3d', name: 'TENTS' },
  { u: 2.0, v: 16.95, e: '🎟️', col: '#4da3ff', name: 'LOTTO' },
  { u: 4.1, v: 16.95, e: '💡', col: '#ffd23f', name: 'LIGHTS' },
  { u: 5.15, v: 16.95, e: '🍞', col: '#e2483a', name: 'BREAD' },
];
function pathPt(P, f) {
  const L = P.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0); let d = clamp(f, 0, 1) * L;
  for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= l) return [lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l), b[0] - a[0], b[1] - a[1]]; d -= l; }
  const a = P[P.length - 2], b = P[P.length - 1]; return [b[0], b[1], b[0] - a[0], b[1] - a[1]];
}
const WALK1 = [[3.5, 3.65], [5.95, 3.65], [5.95, 9]];
const WALK2 = [[0.3, 17.55], [3.35, 17.55]];
const PUSH1 = [[2.7, 18.05], [5.95, 18.05], [5.95, 11]];
const PUSH2 = [[5.95, 9.2], [5.95, 5.6], [4.55, 5.6], [4.55, 4.85]];
function bankAt(t) { let c = 62570; if (t >= T.buyVan + .5) c -= 35000; if (t >= T.buyLights + .5) c -= 20000; return c; }
function scene(t) {
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  const s = { van: null, vanO: {}, o: { talk: m, look: [0, 0], mood: 'happy' } };
  if (t < T.walk0) { s.pos = [3.5, 3.65]; s.o.pose = 'sit'; s.card = true; s.o.armsUp = vin(t, 1.9, 3.2); return s; }
  if (t < T.mkt) { const p = pathPt(WALK1, sstep(vprog(t, T.walk0, T.mkt))); s.pos = [p[0], p[1]]; s.o.walk = t * 14; s.o.look = [.5, .2]; return s; }
  s.van = VAN_MKT.slice();
  if (t < T.toLights) {
    const p = pathPt(WALK2, sstep(vprog(t, T.mkt, T.mkt + 1.6))); s.pos = [p[0], p[1]]; if (t < T.mkt + 1.6) s.o.walk = t * 14;
    s.o.look = [-.2, .4]; if (vin(t, T.smoke, T.smoke + 1.8)) { s.o.mood = 'surprised'; s.vanO.smoke = (t - T.smoke) * 1.4; }
    if (vin(t, 15.2, 17.0)) s.o.mood = 'sad'; if (vin(t, 17.2, 18.3)) s.o.armsUp = true; return s;
  }
  if (t < T.night0) { const f = sstep(vprog(t, T.toLights, T.toLights + .8)); s.pos = [lerp(3.35, 4.15, f), lerp(17.55, 17.4, f)]; if (t < T.toLights + .8) s.o.walk = t * 14; s.o.look = [0, -.7]; return s; }
  if (t < T.cut2) {
    const f = vprog(t, T.push0, T.cut2), p = pathPt(PUSH1, f), dl = Math.hypot(p[2], p[3]) || 1;
    s.van = [p[0], p[1]]; s.pos = [p[0] - p[2] / dl * .95, p[1] - p[3] / dl * .95 + .05]; if (t < T.push0) { s.van = VAN_MKT.slice(); s.pos = [VAN_MKT[0] - .95, VAN_MKT[1] + .05]; }
    s.o.walk = t >= T.push0 ? t * 9 : 0; s.o.mood = 'sad'; s.o.look = [.4, .3]; s.sweat = t >= T.push0; return s;
  }
  if (t < T.home) {
    const f = sstep(vprog(t, T.cut2, T.lights0 - .3)), p = pathPt(PUSH2, f), dl = Math.hypot(p[2], p[3]) || 1;
    s.van = [p[0], p[1]]; s.pos = [p[0] - p[2] / dl * .95, p[1] - p[3] / dl * .95 + .05]; s.o.walk = f < 1 ? t * 9 : 0;
    s.o.mood = t > T.lights0 ? 'surprised' : 'sad'; if (t > T.lights0 + 1.6) s.o.mood = 'happy'; s.sweat = f < 1; if (f >= 1) { s.pos = [5.05, 5.05]; s.o.look = [0, -.5]; }
    return s;
  }
  s.van = VAN_HOME.slice(); s.pos = [5.15, 5.1]; s.o.pose = 'sit'; s.o.mood = 'hope'; s.o.look = [0, .3]; s.o.blink = t > 38.6 || (t % 3) < .12; return s;
}
function camAt(t, s) {
  const [bx, by] = isoW(s.pos[0], s.pos[1]); let tx = bx, ty = by - 40, tz = 2.6;
  if (t < T.walk0) tz = lerp(3.0, 2.7, vprog(t, 0, T.walk0));
  else if (t < T.mkt) tz = 2.4;
  else if (t < T.night0) { const [mx, my] = isoW(2.9, 17.5); tx = mx; ty = my - 50; tz = t < T.toLights ? 2.9 : 2.7; }
  else if (t < T.cut2) { const [vx, vy] = isoW(s.van[0], s.van[1]); tx = lerp(bx, vx, .5); ty = lerp(by, vy, .5) - 40; tz = 2.5; }
  else if (t < T.lights0 + .8) { const [vx, vy] = isoW(s.van[0], s.van[1]); tx = lerp(bx, vx, .5); ty = lerp(by, vy, .5) - 40; tz = 2.5; }
  else if (t < T.home) { const [hx, hy] = isoW(4.6, 4.6), f = sstep(vprog(t, T.lights0 + .8, T.wide + 2.2)); tx = lerp(hx, 0, f); ty = lerp(hy - 40, -560, f); tz = Math.exp(lerp(Math.log(2.3), Math.log(.15), f)); }
  else { const [vx, vy] = isoW(4.85, 4.95); tx = vx; ty = vy - 40; tz = lerp(3.0, 3.5, vprog(t, T.home, VDUR)); }
  cam.x = tx; cam.y = ty; cam.z = tz;
}
function nightA(t) { return t < T.night0 ? 0 : t < T.home ? vprog(t, T.night0, T.night0 + 1.3) : 1; }
function drawStall(s, k) {
  const z = cam.z, [x, y] = uvS(s.u, s.v), sc = z * .42 * k; if (sc < .02) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ellipse(ctx, 0, 6, 70, 16, 'rgba(0,0,0,.25)'); line(ctx, -52, -40, -52, -120, '#6b4a2e', 7); line(ctx, 52, -40, 52, -120, '#6b4a2e', 7);
  for (let j = 0; j < 4; j++) poly(ctx, [[-64 + j * 32, -136], [-32 + j * 32, -136], [-32 + j * 32, -112], [-64 + j * 32, -112]], j % 2 ? '#fff4e0' : s.col, OUT, 3);
  panel(-62, -54, 124, 54, 8, '#b07a46', OUT, 4); emoji(ctx, s.e, 0, -84, 46); ctx.restore();
  if (z > 1.2) { ctx.save(); ctx.translate(x, y - 150 * z * .42); tag(0, 0, s.name, s.col, 1); ctx.restore(); }
}
/* ---------- overlays ---------- */
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960); if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6)); ctx.restore();
}
function coin(x, y, r) { circle(ctx, x, y, r, '#f5b82e', '#8a5a12', 3); circle(ctx, x, y, r * .68, '#ffd96b'); txt('¢', x, y + 1, Math.round(r * 1.1), '#8a5a12', 'center', 'middle'); }
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1500, sz = 66, maxW = 940; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15));
  ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => { const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18; for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; } });
  ctx.restore();
}
function vHUD(t) {
  const c = bankAt(t);
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const bump = [T.buyVan + .5, T.buyLights + .5].some(x => vin(t, x, x + .35)) ? 1.12 : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  for (const [x0, s] of [[T.buyVan + .5, '−€350'], [T.buyLights + .5, '−€200']]) if (vin(t, x0, x0 + 1.3)) { const u = vprog(t, x0, x0 + 1.3); ctx.globalAlpha = 1 - u; otxt(s, 880, 330 - u * 50, 52, '#ff6b6b', 8); ctx.globalAlpha = 1; }
  txt('DAY 3  ·  4,661 tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const s = 'Follow = you move in 🏠', w = ctx.measureText(s).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2); txt(s, 540, 510, 26, '#fff', 'center', 'middle');
}
function overlays(t, s) {
  // poll result card
  if (vin(t, T.card0, T.walk0)) {
    const k = eBack(vprog(t, T.card0, T.card0 + .3)), a = clamp((T.walk0 - t) / .25, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 790); ctx.scale(k, k);
    panel(-430, -170, 860, 340, 34, 'rgba(14,16,34,.95)', 'rgba(255,255,255,.25)', 4);
    txt('YOU VOTED 🗳️', 0, -122, 44, '#ffd23f', 'center', 'middle');
    [['🚐 Campervan', 72, '#ff4d6d'], ['💡 Street lights', 24, '#4da3ff'], ['🏍️ Motorbike', 4, '#3ddc84']].forEach(([n, p, col], i) => {
      const y = -50 + i * 78, f = sstep(vprog(t, T.card0 + .3 + i * .15, T.card0 + 1.2 + i * .15)) * p / 100;
      panel(-380, y - 28, 760, 56, 28, 'rgba(255,255,255,.08)'); if (f > .01) panel(-380, y - 28, Math.max(56, 760 * f), 56, 28, col);
      txt(n, -350, y + 2, 32, '#fff', 'left', 'middle'); txt(Math.round(p * vprog(t, T.card0 + .3 + i * .15, T.card0 + 1.2 + i * .15)) + '%', 350, y + 2, 32, '#fff', 'right', 'middle');
    });
    ctx.restore();
  }
  vstamp('BOTH! 🚐 + 💡', 540, 640, t, 10.0, 11.9, 90, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
  vstamp('🚐 CAMPERVAN  −€350', 540, 640, t, T.buyVan, 13.7, 70, '#ff8a3d', .03, 'rgba(10,12,26,.88)');
  vstamp('*cough* *cough* 💨', 540, 640, t, T.smoke, 15.2, 66, '#c3c9e4', -.03, 'rgba(10,12,26,.88)');
  vstamp("DOESN'T DRIVE 😅", 540, 640, t, 15.25, 17.1, 76, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('BUT IT HAS A BED 🛏️', 540, 640, t, 17.2, T.toLights + .3, 70, '#46e08a', -.02, 'rgba(10,12,26,.88)');
  vstamp('💡 STREET LIGHTS  −€200', 540, 640, t, T.buyLights, T.night0 + .6, 64, '#ffd23f', .03, 'rgba(10,12,26,.88)');
  for (const [t0, st] of [[T.buyVan, null], [T.buyLights, STALLS[2]]]) if (vin(t, t0, t0 + .7)) { const u = sstep(vprog(t, t0, t0 + .7)), tgt = st ? uvS(st.u, st.v) : uvS(s.van[0], s.van[1]); for (let j = 0; j < 4; j++) coin(lerp(540, tgt[0], u) + j * 18, lerp(HUDY, tgt[1] - 60, u) - Math.sin(u * Math.PI) * 160, 30); }
  vstamp('*PUSH* 😤', 540, 640, t, T.push0 + .3, T.cut2, 96, '#ff8a3d', -.04, 'rgba(10,12,26,.88)');
  vstamp('💡 THE WHOLE TOWN IS LIT', 540, 640, t, T.wide + .4, T.home - .2, 62, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('FIRST NIGHT WITH A DOOR 🚐🔒', 540, 640, t, 36.6, T.end0, 56, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  // sweat drops
  if (s.sweat) { const [bx, by] = uvS(s.pos[0], s.pos[1]), z = cam.z; for (let k = 0; k < 3; k++) { const q = (t * 1.6 + k * .33) % 1; ctx.globalAlpha = 1 - q; emoji(ctx, '💦', bx + (k - 1) * 18 * z + q * 20 * z, by - 120 * z - q * 30 * z, 22 * z); } ctx.globalAlpha = 1; }
  // zzz at the end
  if (t > 38.6 && t < T.end0) { const [bx, by] = uvS(s.pos[0], s.pos[1]), z = cam.z; ctx.globalAlpha = .6 + .4 * Math.sin(t * 3); otxt('z', bx + 30 * z, by - 120 * z - (t * 20) % 30, 18 * z, '#c3c9e4', 3); otxt('Z', bx + 48 * z, by - 145 * z - (t * 20) % 30, 24 * z, '#c3c9e4', 4); ctx.globalAlpha = 1; }
  // end card
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.fillStyle = `rgba(6,8,20,${.45 * vprog(t, T.end0, T.end0 + .3)})`; ctx.fillRect(0, 0, W, 1920);
    ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt("and move into Benny's town 🏠", 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = vprog(t, T.end0 + .3, T.end0 + .6); txt('Find your house: link in bio 🔗', 540, 910, 34, '#fff', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}
const CUTS6 = [T.mkt, T.cut2, T.home];
function vrender(t) {
  S.T = t;
  const s = scene(t); camAt(t, s);
  BPOS = s.pos; BENNY_O = () => s.o; BENNY_CARD = !!s.card;
  TOWN.milestones.lights = t >= T.buyLights + .3; TOWN.milestones.van = false;
  const lt = T.lights0;
  LAMP_ON = (u, v) => t < lt ? 0 : clamp((t - lt - Math.hypot(u - 4.5, v - 4.5) / 70 * 3.2) / .25, 0, 1);
  EXTRA_OBJS = objs => {
    STALLS.forEach(st => objs.push({ d: st.u + st.v + .2, f: () => drawStall(st, 1) }));
    if (s.van) { const v = s.van; objs.push({ d: v[0] + v[1] + .3, f: () => drawVan(v[0], v[1], Object.assign({ k: 1, flat: true }, s.vanO)) }); }
    if (t < T.mkt + 2) { const [px, py] = uvS(VAN_MKT[0] + .2, VAN_MKT[1] - .55); }
  };
  draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  // price sign on the van at the market
  if (t >= T.mkt && t < T.buyVan + .5) { const [px, py] = uvS(VAN_MKT[0], VAN_MKT[1]), z = cam.z; panel(px - 60 * z, py - 92 * z, 120 * z, 40 * z, 8 * z, '#fff4e0', '#c23a2d', 3 * z); txt('€350', px, py - 71 * z, Math.round(24 * z), '#c23a2d', 'center', 'middle'); }
  const na = nightA(t); if (na > 0) { ctx.fillStyle = `rgba(6,8,34,${.52 * na})`; ctx.fillRect(0, 0, W, 1920); lampGlow(na); }
  overlays(t, s);
  vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, 1920); }
  for (const c of CUTS6) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, 1920); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
};
