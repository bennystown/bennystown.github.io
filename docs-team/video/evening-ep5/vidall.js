const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function vcard(t, t0, t1, y, h, draw) {
  if (!vin(t, t0, t1)) return;
  const k = eBack(vprog(t, t0, t0 + .3)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, y); ctx.scale(k, k);
  panel(-430, -h / 2, 860, h, 34, 'rgba(14,16,34,.95)', 'rgba(255,255,255,.25)', 4);
  draw(); ctx.restore();
}
function coin(x, y, r) { circle(ctx, x, y, r, '#f5b82e', '#8a5a12', 3); circle(ctx, x, y, r * .68, '#ffd96b'); txt('¢', x, y + 1, Math.round(r * 1.1), '#8a5a12', 'center', 'middle'); }
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = t >= T.poll ? 1330 : 1500, sz = 66, maxW = 940;
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
function confetti(t, t0, x, y) { const p = t - t0; if (p < 0 || p > 1.6) return; for (let k = 0; k < 40; k++) { const a = k * 2.399, d = p * (260 + (k % 5) * 40); ctx.globalAlpha = Math.max(0, 1 - p / 1.6); ctx.fillStyle = CONF[k % CONF.length]; ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * .7 + p * p * 260, 16, 10); } ctx.globalAlpha = 1; }

/* ===================== EPISODE 5 — "The key fits" ===================== */
const VDUR = 51.5;
const HUDY = 376;
let VCAPS = [], VMOUTH = [];
// timeline (seconds)
const T = {
  walk0: 4.3, walk1: 7.5, fits: 9.5, rise1: 10.9, letter0: 11.4, letter1: 18.3,
  market: 18.45, buyTent: 22.9, buyLotto: 25.6, scratch0: 27.5, scratch1: 36.2, win50: 33.0, total: 34.9,
  lottoWin: 36.2, clothes: 38.6, night: 41.4, end0: 47.6,
};
// Benny path in tile coords (u, v)
const PATH = [[3.5, 3.65], [5.95, 3.65], [5.95, 17.05], [3.1, 17.05]];
const PLEN = PATH.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]), 0);
function pathAt(f) {
  let d = f * PLEN;
  for (let i = 1; i < PATH.length; i++) { const a = PATH[i - 1], b = PATH[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= l) return [lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]; d -= l; }
  return PATH[PATH.length - 1];
}
const STALLS = [
  { u: 0.95, v: 16.95, e: '⛺', col: '#ff8a3d', name: 'TENTS' },
  { u: 2.0, v: 16.95, e: '🎟️', col: '#4da3ff', name: 'LOTTO' },
  { u: 4.1, v: 16.95, e: '🧥', col: '#3ddc84', name: 'CLOTHES' },
  { u: 5.15, v: 16.95, e: '🍞', col: '#e2483a', name: 'BREAD' },
];
const TENT = [4.75, 2.4];
function bankAt(t) {
  let c = 43020;
  if (t >= T.buyTent + .5) c -= 8000;
  if (t >= T.buyLotto + .5) c -= 4000;
  if (t >= T.total) c += Math.round(6500 * sstep(vprog(t, T.total, T.total + 1.2)));
  return c;
}
function bennyState(t) {
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  if (t < T.walk0) return { pos: [3.5, 3.65], o: { pose: 'sit', mood: 'happy', look: [0, 0], talk: m, hold: '🗝️', holdLift: eBack(vprog(t, 3.0, 3.4)) }, card: true };
  if (t < T.walk1) { const f = sstep(vprog(t, T.walk0, T.walk1)); return { pos: pathAt(f), o: { mood: 'hope', look: [.5, .2], talk: m, walk: t * 14, hold: '🗝️' } }; }
  if (t < T.market) {
    const o = { mood: t < T.fits ? 'surprised' : 'happy', look: [-.3, -.6], talk: m, hold: t < T.fits + .2 ? '🗝️' : (t > T.letter0 ? '📜' : null), holdLift: 1 };
    if (vin(t, T.fits, T.rise1)) o.armsUp = true;
    if (t > T.letter0 && t < 17.3) { o.mood = 'hope'; o.look = [0, .3]; }
    return { pos: [3.1, 17.05], o };
  }
  if (t < T.night) {
    let pos = [3.05, 17.35], o = { mood: 'happy', look: [0, -.7], talk: m };
    if (t < T.buyTent - .3) pos = [3.05, 17.35];
    else if (t < T.buyLotto - .2) { pos = [1.0, 17.4]; o.look = [-.3, -.8]; if (t > T.buyTent + .5) o.hold = '⛺'; }
    else if (t < T.clothes) { pos = [2.05, 17.4]; o.hold = t > T.buyLotto + .5 ? '🎟️' : '⛺'; o.look = [0, -.7]; if (vin(t, T.win50, T.lottoWin + 1.5)) { o.armsUp = true; o.hold = null; o.mood = 'surprised'; } }
    else { pos = [4.15, 17.4]; o.mood = 'sad'; o.look = [0, -.7]; }
    return { pos, o };
  }
  return { pos: [TENT[0] + .25, TENT[1] + .75], o: { pose: 'sit', mood: 'hope', look: [0, .3], talk: m, blink: t > 45.8 || (t % 3) < .12 }, tent: true };
}
function camAt(t, bs) {
  let tx, ty, tz;
  const [bx, by] = isoW(bs.pos[0], bs.pos[1]);
  if (t < T.walk0) { tx = bx; ty = by - 40; tz = lerp(3.2, 2.8, vprog(t, 0, T.walk0)); }
  else if (t < T.walk1) { tx = bx; ty = by - 40; tz = lerp(2.8, 2.2, sstep(vprog(t, T.walk0, T.walk0 + 1))); }
  else if (t < T.market) { const [hx, hy] = isoW(3, 16.2); tx = hx; ty = hy - 70; tz = t < T.letter0 ? lerp(1.9, 2.2, vprog(t, T.walk1, T.letter0)) : 2.3; }
  else if (t < T.night) { const [mx, my] = isoW(3, 16.9); tx = mx; ty = my - 60; tz = 2.9; if (t >= T.scratch0 && t < T.scratch1) tz = 2.4; const [bx2, by2] = isoW(bs.pos[0], bs.pos[1]); tx = lerp(mx, bx2, .55); ty = lerp(my, by2, .55) - 40; }
  else { const [px, py] = isoW(TENT[0] + .1, TENT[1] + .4); tx = px; ty = py - 60; tz = lerp(3.2, 3.8, vprog(t, T.night, T.end0)); }
  cam.x = tx; cam.y = ty; cam.z = tz;
}
/* ---------- props drawn into the town ---------- */
function drawStall(s, t, k) {
  const z = cam.z, [x, y] = uvS(s.u, s.v), sc = z * .42 * k;
  if (sc < .02) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ellipse(ctx, 0, 6, 70, 16, 'rgba(0,0,0,.25)');
  line(ctx, -52, -40, -52, -120, '#6b4a2e', 7); line(ctx, 52, -40, 52, -120, '#6b4a2e', 7);
  for (let j = 0; j < 4; j++) poly(ctx, [[-64 + j * 32, -136], [-32 + j * 32, -136], [-32 + j * 32, -112], [-64 + j * 32, -112]], j % 2 ? '#fff4e0' : s.col, OUT, 3);
  panel(-62, -54, 124, 54, 8, '#b07a46', OUT, 4);
  emoji(ctx, s.e, 0, -84, 46);
  ctx.restore();
  if (z > 1.2 && k > .9) { ctx.save(); ctx.translate(x, y - 150 * z * .42); tag(0, 0, s.name, s.col, 1); ctx.restore(); }
}
function drawTent(k) {
  const z = cam.z, [x, y] = uvS(TENT[0], TENT[1]), s = z * .55 * k;
  if (s < .02) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ellipse(ctx, 10, 10, 120, 30, 'rgba(0,0,0,.28)');
  poly(ctx, [[-10, -150], [110, -110], [130, 10], [0, 40]], '#c75f1d', OUT, 5);     // side roof
  poly(ctx, [[-110, 10], [0, 40], [-10, -150]], '#ff8a3d', OUT, 5);                 // front face
  poly(ctx, [[-62, 22], [-12, 36], [-18, -62]], '#3a2416', OUT, 4);                 // opening
  line(ctx, -10, -150, 110, -110, '#ffb36b', 4);
  ctx.restore();
}
function tentFront() {}
/* ---------- overlays ---------- */
const TICKETS = (() => { const v = Array(20).fill(0); v[2] = 2; v[4] = 5; v[9] = 3; v[14] = 5; v[19] = 50; return v; })();
const TTIME = (() => { const a = [28.5, 29.0, 29.8, 31.08, 31.7]; for (let k = 5; k < 19; k++) a.push(31.95 + (k - 5) * .075); a.push(T.win50); return a; })();
const LETTER = '"Benny. If you\'re reading this... the town isn\'t empty anymore. Build it together. — Grandpa"';
function overlays(t, bs) {
  // hook
  vstamp('1,000 FOLLOWERS 🔑', 540, 640, t, .2, 3.9, 84, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
  vstamp("LET'S GO! 🏃", 540, 640, t, 4.1, 6.4, 84, '#46e08a', .03, 'rgba(10,12,26,.88)');
  vstamp('THE KEY FITS! 🔑✨', 540, 640, t, T.fits, 11.3, 84, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
  // key flash
  if (vin(t, T.fits, T.fits + .6)) { ctx.fillStyle = `rgba(255,240,190,${.75 * (1 - vprog(t, T.fits, T.fits + .6))})`; ctx.fillRect(0, 0, W, 1920); }
  // grandpa letter
  vcard(t, T.letter0, T.letter1, 820, 560, () => {
    panel(-400, -260, 800, 520, 20, '#f3ead6', OUT, 5);
    txt('📜 A letter from Grandpa', 0, -205, 40, '#5b4630', 'center', 'middle');
    line(ctx, -340, -165, 340, -165, '#c9a46b', 3);
    const shown = Math.floor(LETTER.length * vprog(t, T.letter0 + .3, 17.0));
    const words = LETTER.slice(0, shown).split(' '); const lines = [[]]; ctx.font = F(42);
    for (const w of words) { const cur = lines[lines.length - 1]; if (ctx.measureText(cur.concat(w).join(' ')).width > 680 && cur.length) lines.push([w]); else cur.push(w); }
    lines.forEach((l, i) => txt(l.join(' '), 0, -100 + i * 62, 42, '#3b2a1c', 'center', 'middle'));
  });
  vstamp('THE MARKET IS OPEN 🛒', 540, 640, t, T.market + .3, 21.6, 72, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  vstamp('⛺ TENT  −€80', 540, 640, t, T.buyTent, 25.4, 80, '#ff8a3d', .03, 'rgba(10,12,26,.88)');
  vstamp('🎟️ 20 TICKETS  −€40', 540, 640, t, T.buyLotto, T.scratch0, 72, '#4da3ff', -.03, 'rgba(10,12,26,.88)');
  // coins to stalls
  for (const [t0, s] of [[T.buyTent, STALLS[0]], [T.buyLotto, STALLS[1]]]) if (vin(t, t0, t0 + .7)) { const u = sstep(vprog(t, t0, t0 + .7)), [sx, sy] = uvS(s.u, s.v); for (let j = 0; j < 4; j++) coin(lerp(540, sx, u) + j * 18, lerp(HUDY, sy - 60, u) - Math.sin(u * Math.PI) * 160, 30); }
  // scratch tickets
  if (vin(t, T.scratch0, T.scratch1)) {
    const a = clamp((T.scratch1 - t) / .25, 0, 1) * clamp((t - T.scratch0) / .25, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(6,8,20,.8)'; ctx.fillRect(0, 560, W, 1360);
    txt('SCRATCH! 🎟️', 540, 640, 64, '#ffd23f', 'center', 'middle');
    let total = 0;
    TICKETS.forEach((v, k) => {
      const col = k % 4, row = Math.floor(k / 4), x = 150 + col * 260, y = 730 + row * 138, rv = t >= TTIME[k];
      const big = k === 19 && rv, s = big ? 1 + .25 * Math.max(0, 1 - (t - T.win50) / .5) : 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      panel(-110, -58, 220, 116, 16, rv ? (v ? (v >= 50 ? '#ffd23f' : '#46e08a') : '#2a2e48') : '#c0c4d4', rv && v >= 50 ? '#fff' : OUT, 4);
      if (!rv) { for (let j = 0; j < 6; j++) line(ctx, -90 + j * 34, -40, -70 + j * 34, 40, 'rgba(255,255,255,.5)', 6); txt('?', 0, 4, 54, '#7a7f95', 'center', 'middle'); }
      else txt(v ? '€' + v : '✗', 0, 4, v ? 58 : 50, v ? '#1b1728' : '#6b7090', 'center', 'middle');
      ctx.restore();
      if (rv) total += v;
    });
    if (t > T.win50) confetti(t, T.win50, 540 + 260 * 1.5 - 390, 1360);
    if (t > T.total - .3) { const k = eBack(vprog(t, T.total - .3, T.total)); ctx.save(); ctx.translate(540, 1420); ctx.scale(k, k); panel(-330, -62, 660, 124, 30, '#46e08a', '#fff', 4); txt('TOTAL WIN: €' + total, 0, 4, 60, '#0b2a18', 'center', 'middle'); ctx.restore(); }
    ctx.restore();
  }
  vstamp('LOTTO TEAM WAS RIGHT 🎟️ +€25', 540, 640, t, T.lottoWin, 38.5, 60, '#4da3ff', .02, 'rgba(10,12,26,.88)');
  vstamp('🧥 16%… maybe next time', 540, 640, t, T.clothes, 41.3, 64, '#c3c9e4', -.02, 'rgba(10,12,26,.88)');
  vstamp('FIRST NIGHT NOT ON CARDBOARD ⛺', 540, 640, t, 43.6, T.end0, 54, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  // end card
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.fillStyle = `rgba(6,8,20,${.45 * vprog(t, T.end0, T.end0 + .3)})`; ctx.fillRect(0, 0, W, 1920);
    ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)');
    txt("and move into Benny's town 🏠", 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = vprog(t, T.end0 + .3, T.end0 + .6); txt('Find your house: link in bio 🔗', 540, 910, 34, '#fff', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}
function vHUD(t) {
  const c = bankAt(t);
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const chg = [T.buyTent + .5, T.buyLotto + .5, T.total].some(x => vin(t, x, x + .35)), bump = chg ? 1.12 : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  for (const [x0, s, col] of [[T.buyTent + .5, '−€80', '#ff6b6b'], [T.buyLotto + .5, '−€40', '#ff6b6b'], [T.total, '+€65', '#46e08a']]) if (vin(t, x0, x0 + 1.2)) { const u = vprog(t, x0, x0 + 1.2); ctx.globalAlpha = 1 - u; otxt(s, 860, 330 - u * 50, 56, col, 8); ctx.globalAlpha = 1; }
  txt('DAY 2  ·  2,156 tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const s = 'Follow = you move in 🏠', w = ctx.measureText(s).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2);
  txt(s, 540, 510, 26, '#fff', 'center', 'middle');
}
/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  const bs = bennyState(t);
  camAt(t, bs);
  BPOS = bs.pos; BENNY_O = () => bs.o; BENNY_CARD = !!bs.card;
  TOWN.milestones.townHall = t >= T.fits;
  HALL_GROW = t < T.fits ? 1 : eBack(vprog(t, T.fits + .1, T.rise1));
  MARKET_K = k => STALLS_K(t, k);
  EXTRA_OBJS = objs => {
    STALLS.forEach((s, k) => objs.push({ d: s.u + s.v + .2, f: () => drawStall(s, t, STALLS_K(t, k)) }));
    if (t >= T.night) { objs.push({ d: TENT[0] + TENT[1], f: () => drawTent(eBack(vprog(t, T.night, T.night + .6))) });  }
  };
  draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t >= T.night) { ctx.fillStyle = `rgba(10,14,50,${.35 * vprog(t, T.night, T.night + 1)})`; ctx.fillRect(0, 0, W, 1920); }
  overlays(t, bs);
  vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, 1920); }
  for (const c of [T.walk1, T.market, T.night]) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.35 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, 1920); }
}
function STALLS_K(t, k) { return t < T.market ? 0 : eBack(vprog(t, T.market + .3 + k * .2, T.market + .6 + k * .2)); }
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; TOWN.milestones.townHall = false; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); },
  DUR: VDUR,
};
