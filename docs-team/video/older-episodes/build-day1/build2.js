/* ===================== BUILD VIDEO — Day 1 ===================== */
const NAMES = ['carli67_67', 'einf_random5', 'mb.24051', '.jellyousiroha', 'lisahh1616', 'lila8974', 'miljanhupsumain', 'xhafaavf3z3', 'footballdom9', 'lin894512', 'jori.14.9.2015', 'prvt_.anne', 'daliy.life27', 'm0ny752', 'anni_03267', 'audibmw109', 'benjamin1238356', 'rebeca_lovrscookies', 'sekisongarukunyakso', 'bootydestroyer61', 'fall1ng88', 'alicefedeli4', 'userscojosciuto', 'who_is457this', 'filip_reborn', 'theonlyeverglaze', 'till6558', 'william.jar1', 'bunycuvx', 'silversurfer650', 'justsoraya_lol', 'toca.soda.lol', 'jirka.m223', 'francescobucciarati'];
const NH = NAMES.length;
const T_HOOK = 3.0, STEP = .62, BUILD = .5;
const T_DONE = T_HOOK + (NH - 1) * STEP + BUILD;
const T_OV = T_DONE + .15, T_BOARD = 29.9, T_VOTE = 33.2, DUR = 37.5;
const HUDX = 540, HUDY = 410;
let CAPS = [], MOUTH2 = [];
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const within = (t, a, b) => t >= a && t < b;
const HS = NAMES.map((n, k) => { const L = LOTS[k]; return { name: n, k, i: L.i, j: L.j, v: variantForLot(n, k), t0: T_HOOK + k * STEP }; });
const R_CITY = LOTS[NH - 1].d + .6;
const A0 = 3 * Math.floor((CEN - R_CITY - 1.5) / 3) - .5, A1 = 3 * Math.ceil((CEN + R_CITY + 1.5) / 3) + .5;
const STARS2 = []; { const r = seeded(99); for (let k = 0; k < 90; k++) STARS2.push([r() * W, r() * 900, .8 + r() * 1.8]); }
const coinArr = k => HS[k].t0 + BUILD + .55;
function bankCents(t) { let c = 0; for (let k = 0; k < NH; k++) if (t >= coinArr(k)) c += 10; return c; }
function tenants(t) { let n = 0; for (const h of HS) if (t >= h.t0 + BUILD) n++; return n; }
function lastArrival(t) { let b = -9; for (let k = 0; k < NH; k++) { const a = coinArr(k); if (t >= a && a > b) b = a; } return b; }

function drawSignPost(x, y, z) {
  line(ctx, x, y, x, y - 34 * z, '#5b4630', Math.max(1, 4 * z));
  panel(x - 30 * z, y - 56 * z, 60 * z, 26 * z, 4 * z, '#f4efe4', '#c23a2d', Math.max(1, 2.5 * z));
  if (z > .55) txt('FOR RENT', x, y - 42.5 * z, Math.max(6, Math.round(10 * z)), '#c23a2d', 'center', 'middle');
}
function drawCoinAt(x, y, r) { circle(ctx, x, y, r, '#f5b82e', '#8a5a12', 3); circle(ctx, x, y, r * .68, '#ffd96b'); txt('¢', x, y + 1, Math.round(r * 1.1), '#8a5a12', 'center', 'middle'); }
function stamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(prog(t, t0, t0 + .28)), a = clamp((t1 - t) / .15, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function zEndF() { return Math.min((W - 30) / (2 * (R_CITY + .6) * TW / Math.SQRT2), 700 / (2 * (R_CITY + .6) * TH / Math.SQRT2)) * 1.22; }
function camAt(t) {
  const [bx, by] = isoW(2.0, 2.15);
  if (t < T_HOOK) { const z = lerp(3.6, 4.3, eInOut(t / T_HOOK)); return [bx, by - 170 / z, z]; }
  if (t < T_OV) {
    const k = Math.min(NH - 1, Math.floor((t - T_HOOK) / STEP)), h = HS[k], [hx, hy] = isoW(h.i, h.j), tgt = [hx, hy - 30, 2.1];
    const prev = k === 0 ? (() => { const z = 4.3; return [bx, by - 170 / z, z]; })() : (() => { const p = HS[k - 1], [px, py] = isoW(p.i, p.j); return [px, py - 30, 2.1]; })();
    const u = eInOut(prog(t, h.t0, h.t0 + (k === 0 ? .4 : .22)));
    return [lerp(prev[0], tgt[0], u), lerp(prev[1], tgt[1], u), Math.exp(lerp(Math.log(prev[2]), Math.log(tgt[2]), u))];
  }
  const [px, py] = isoW(1.5, 1.5), L = HS[NH - 1], [lx, ly] = isoW(L.i, L.j), zE = zEndF();
  if (t < T_VOTE) { const u = eInOut(prog(t, T_OV, T_OV + .8)); return [lerp(lx, px, u), lerp(ly - 30, py + 10, u), Math.exp(lerp(Math.log(2.1), Math.log(zE), u))]; }
  const z = 3.1, u = eInOut(prog(t, T_VOTE, T_VOTE + .5)), tv = [bx, by - 420 / z, z];
  return [lerp(px, tv[0], u), lerp(py + 10, tv[1], u), Math.exp(lerp(Math.log(zE), Math.log(z), u))];
}
function townCam(t) { const c = camAt(t); cam.x = c[0]; cam.y = c[1]; cam.z = c[2]; }
function drawMailbox(x, y, z, name, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -26 * z, '#5b4630', Math.max(1, 3.5 * z));
  rrect(ctx, -15 * z, -44 * z, 30 * z, 20 * z, 6 * z); ctx.fillStyle = '#3c6fd1'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(1, 1.5 * z); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillRect(-11 * z, -38 * z, 22 * z, 8 * z);
  line(ctx, 15 * z, -42 * z, 15 * z, -54 * z, '#5b4630', Math.max(1, 1.5 * z)); ctx.fillStyle = '#e23b3b'; ctx.fillRect(15 * z, -54 * z, 8 * z, 6 * z);
  if (z > 1.4) { const fs = Math.max(6, Math.round(5 * z)); ctx.font = F(fs); ctx.fillStyle = '#1b1728'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(trunc(name, 9), 0, -34 * z); }
  ctx.restore();
}
function town(t) {
  const z = cam.z;
  let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060919'); g.addColorStop(1, '#1b2049'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const [x, y, r] of STARS2) { ctx.globalAlpha = .3 + .35 * Math.sin(t * 2 + x); circle(ctx, x, y, r, '#fff'); } ctx.globalAlpha = 1;
  const Tp = uvS(A0, A0), Rp = uvS(A1, A0), Bp = uvS(A1, A1), Lp = uvS(A0, A1), th = 40 * z;
  poly(ctx, [Lp, Bp, [Bp[0], Bp[1] + th], [Lp[0], Lp[1] + th]], '#3a2a20');
  poly(ctx, [Bp, Rp, [Rp[0], Rp[1] + th], [Bp[0], Bp[1] + th]], '#2b1f18');
  poly(ctx, [Tp, Rp, Bp, Lp], '#2f6b45');
  for (let k = A0 + .5; k <= A1 - .5 + 1e-6; k += 3) {
    poly(ctx, [uvS(k - .5, A0), uvS(k + .5, A0), uvS(k + .5, A1), uvS(k - .5, A1)], '#464b63');
    poly(ctx, [uvS(A0, k - .5), uvS(A1, k - .5), uvS(A1, k + .5), uvS(A0, k + .5)], '#464b63');
  }
  ctx.save(); ctx.setLineDash([12 * z, 12 * z]); ctx.strokeStyle = 'rgba(255,210,90,.6)'; ctx.lineWidth = Math.max(1, 2.4 * z); ctx.beginPath();
  for (let k = A0 + .5; k <= A1 - .5 + 1e-6; k += 3) { let p = uvS(k, A0), q = uvS(k, A1); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); p = uvS(A0, k); q = uvS(A1, k); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
  ctx.stroke(); ctx.restore();
  drawPlazaGround();
  const objs = [], maxD = (A1 - CEN) * 1.45;
  for (const h of HS) {
    const [sx, sy] = uvS(h.i, h.j);
    if (t < h.t0) objs.push({ d: h.i + h.j, f: () => drawSignPost(sx, sy, z) });
    else if (t < h.t0 + BUILD) { const p = prog(t, h.t0, h.t0 + BUILD); objs.push({ d: h.i + h.j, f: () => drawSite({ p, v: h.v }, sx, sy) }); }
    else { objs.push({ d: h.i + h.j, f: () => { const k = eBack(prog(t, h.t0 + BUILD, h.t0 + BUILD + .25)); drawHouse(ctx, sx, sy, z * (.85 + .15 * k), h.v, { yard: true, seed: hashStr('s' + h.v) }); } });
      const [mx, my] = uvS(h.i + .12, h.j + .4); objs.push({ d: h.i + h.j + .55, f: () => drawMailbox(mx, my, z, h.name, eBack(prog(t, h.t0 + BUILD + .05, h.t0 + BUILD + .3))) }); }
  }
  for (let idx = NH; idx < LOTS.length && LOTS[idx].d <= maxD; idx++) {
    const L = LOTS[idx]; if (L.i < A0 + .5 || L.i > A1 - .5 || L.j < A0 + .5 || L.j > A1 - .5) continue;
    const [sx, sy] = uvS(L.i, L.j); if (idx < NH + 12) objs.push({ d: L.i + L.j, f: () => drawSignPost(sx, sy, z) });
    if (L.h % 4 === 0) { const [tx, ty] = uvS(L.i + .36, L.j - .36); objs.push({ d: L.i + L.j - .1, f: () => drawTree(ctx, tx, ty, z * .85, (L.h >> 5) & 1) }); }
  }
  objs.push({ d: 3.0, f: () => drawLamp(2.3, .7) });
  objs.push({ d: 3.0, f: () => drawBench(.8, 2.2) });
  objs.push({ d: 4.15, f: () => {
    const [x, y] = uvS(2.0, 2.15);
    poly(ctx, [[x - 36 * z, y], [x, y + 15 * z], [x + 36 * z, y], [x, y - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z);
    const m = MOUTH2[Math.min(MOUTH2.length - 1, Math.round(t * 30))] || 0; drawBenny(ctx, x, y + 4 * z, .25 * z, { pose: 'sit', mood: t < 2.6 ? 'surprised' : (t >= T_VOTE ? 'mischief' : 'happy'), look: [0, t < T_HOOK || t >= T_VOTE ? 0 : .4], blink: (t % 3.7) < .12, talk: m });
  } });
  objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f();
  ctx.fillStyle = 'rgba(8,10,34,.18)'; ctx.fillRect(0, 0, W, H);
  // crowns on finished houses
  for (const h of HS) { if (t < h.t0 + BUILD) continue; const [sx, sy] = uvS(h.i, h.j), st = STY[styleOf(h.v)], s = eBack(prog(t, h.t0 + BUILD, h.t0 + BUILD + .3)); ctx.fillStyle = '#fff'; ctx.font = EF(Math.max(10, Math.round(22 * z * s))); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👑', sx, sy - (st.wall + st.roofH + st.f * 32 + 10) * z); }
  // current builds: big tag + confetti
  for (const h of HS) {
    const [sx, sy] = uvS(h.i, h.j), st = STY[styleOf(h.v)];
    if (within(t, h.t0, h.t0 + BUILD + .5)) tag(sx, sy - (st.wall + st.roofH + st.f * 32 + 34) * z, '@' + trunc(h.name, 18), '#ffd23f', clamp((h.t0 + BUILD + .5 - t) / .2, 0, 1));
    if (within(t, h.t0 + BUILD, h.t0 + BUILD + .7)) { const p = prog(t, h.t0 + BUILD, h.t0 + BUILD + .7); for (let q = 0; q < 12; q++) { const a = q * 2.4 + h.k, d = p * 120 * z; ctx.globalAlpha = 1 - p; ctx.fillStyle = CONF[q % CONF.length]; ctx.fillRect(sx + Math.cos(a) * d, sy - 70 * z + Math.sin(a) * d * .7 + p * p * 80, 9, 5); } ctx.globalAlpha = 1; }
  }
  // coins
  for (let k = 0; k < NH; k++) {
    const t0 = HS[k].t0 + BUILD, t1 = coinArr(k); if (t < t0 || t >= t1) continue;
    const [sx, sy] = uvS(HS[k].i, HS[k].j), u = eInOut(prog(t, t0, t1)), x0 = sx, y0 = sy - 70 * z, mx = (x0 + HUDX) / 2, my = Math.min(y0, HUDY) - 160;
    drawCoinAt((1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * HUDX, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * HUDY, 18 + Math.sin(u * Math.PI) * 9);
  }
}
function hud(t) {
  const c = bankCents(t), n = tenants(t), since = t - lastArrival(t), col = c > 0 ? '#46e08a' : '#ff6b6b';
  const glow = clamp(1 - since / .45, 0, 1);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 410, 20, 540, 410, 360); g.addColorStop(0, `rgba(70,224,138,${.3 * glow})`); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 100, W, 640); ctx.restore(); }
  panel(200, 300, 680, 206, 44, 'rgba(10,12,26,.9)', c > 0 ? 'rgba(70,224,138,.7)' : 'rgba(255,107,107,.55)', 4);
  txt("BENNY'S BANK", 540, 340, 26, '#9aa3c7', 'center', 'middle');
  const bump = 1 + .14 * clamp(1 - since / .25, 0, 1);
  ctx.save(); ctx.translate(540, 414); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, col, 12, '#06070f'); ctx.restore();
  txt('DAY 1  ·  ' + n + (n === 1 ? ' tenant' : ' tenants'), 540, 478, 26, '#c3c9e4', 'center', 'middle');
}
function banner(t) {
  if (t < T_HOOK || t >= T_OV) return;
  const k = Math.min(NH - 1, Math.floor((t - T_HOOK) / STEP)), h = HS[k], lt = t - h.t0;
  const s = .85 + .15 * eBack(prog(lt, 0, .15));
  ctx.save(); ctx.translate(540, 640); ctx.scale(s, s);
  panel(-400, -78, 800, 156, 34, 'rgba(12,14,30,.95)', '#ffd23f', 5);
  ctx.font = F(24); const lab = 'NEW TENANT #' + (k + 1) + '  ·  👑 OG', lw = ctx.measureText(lab).width + 44;
  panel(-lw / 2, -102, lw, 46, 23, '#ffd23f'); txt(lab, 0, -78, 24, '#1b1728', 'center', 'middle');
  txt('@' + h.name, 0, 14, fitSize('@' + h.name, 64, 740), '#ffffff', 'center', 'middle');
  ctx.restore();
}
function board(t) {
  const a = prog(t, T_BOARD, T_BOARD + .35) * (1 - prog(t, T_VOTE - .1, T_VOTE + .25));
  ctx.fillStyle = `rgba(6,8,20,${.86 * a})`; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a;
  otxt('WELCOME HOME 🏠', 540, 570, 78, '#ffd23f', 12);
  txt('Pause to find your name 👀', 540, 650, 34, '#ffffff', 'center', 'middle');
  const cols = 2, rows = Math.ceil(NH / cols), x0 = [80, 560], y0 = 720, rh = 50;
  HS.forEach((h, k) => {
    const c = Math.floor(k / rows), r = k % rows, x = x0[c], y = y0 + r * rh, d = T_BOARD + .2 + k * .03;
    if (t < d) return; ctx.globalAlpha = a * prog(t, d, d + .2);
    txt('#' + (k + 1), x, y, 22, '#9aa3c7', 'left', 'middle');
    txt('👑 @' + trunc(h.name, 22), x + 58, y, fitSize('👑 @' + trunc(h.name, 22), 30, 380), '#ffffff', 'left', 'middle');
  });
  ctx.globalAlpha = a;
  const yb = y0 + rows * rh + 40;
  panel(110, yb - 40, 860, 80, 40, '#ff2e63'); txt('Tonight: Benny goes shopping 👀', 540, yb + 1, 32, '#ffffff', 'center', 'middle');
  ctx.restore();
}
function drawCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const sz = 60, y0 = t >= T_VOTE ? 1340 : 800; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const ws = g.w.map(w => [w, ctx.measureText(w[0]).width]); const tot = ws.reduce((a, b) => a + b[1], 0) + sp * (ws.length - 1); let x = 540 - tot / 2;
  const pop = .85 + .15 * eBack(prog(t, g.s - .05, g.s + .15)); ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop); ctx.translate(-540, -y0);
  for (const [w, ww] of ws) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y0, sz, on ? '#ffd23f' : '#ffffff', 12, '#0b0a14'); x += ww + sp; }
  ctx.restore();
}
function vote(t) {
  const a = prog(t, T_VOTE + .2, T_VOTE + .5);
  ctx.fillStyle = `rgba(6,8,20,${.62 * a})`; ctx.fillRect(0, 560, W, 760);
  stamp('YOU DECIDE 👇', 540, 640, t, T_VOTE + .25, 99, 92, '#ffd23f', -.03);
  const opts = [['🍞', 'Bread', '€1.00', '#ff4d6d'], ['🎟️', 'Lottery ticket', '€2.00', '#3ddc84'], ['🕶️', 'Sunglasses', '€3.00', '#4da3ff']];
  opts.forEach(([e, n, p, col], k) => {
    const t0 = T_VOTE + .45 + k * .14; if (t < t0) return; const s2 = eBack(prog(t, t0, t0 + .3));
    const x = 40 + k * 340, y = 740, w = 320, h = 320;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s2, s2); ctx.translate(-w / 2, -h / 2);
    panel(0, 0, w, h, 28, 'rgba(20,24,48,.97)', col, 4);
    circle(ctx, 46, 46, 32, col); txt(String(k + 1), 46, 48, 42, '#fff', 'center', 'middle');
    txt(p, w - 22, 48, 32, '#46e08a', 'right', 'middle');
    emoji(ctx, e, w / 2, 145, 100); wrapText(n, w / 2, 255, 32, w - 34, '#fff');
    ctx.restore();
  });
  stamp('COMMENT 1, 2 OR 3 👇', 540, 1150, t, T_VOTE + 1.0, 99, 58, '#ffffff', 0, '#ff2e63');
}
function renderAt(t) {
  S.T = t; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  townCam(t); town(t); hud(t); banner(t);
  stamp('34 OF YOU MOVED IN 😳', 540, 640, t, .15, T_HOOK, 74, '#ffd23f', -.03, 'rgba(10,12,26,.85)');
  if (within(t, T_OV, T_BOARD + .3)) stamp('34 TENANTS · €3.40 💰', 540, 640, t, T_OV + .1, T_BOARD + .3, 70, '#46e08a', .02, 'rgba(10,12,26,.85)');
  if (within(t, T_BOARD, T_VOTE + .3)) board(t);
  if (t >= T_VOTE) vote(t);
  drawCaption(t);
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H); }
}
window.EP = { DUR, init(c, m) { CAPS = c; MOUTH2 = m; }, jpeg(t, q) { renderAt(t); return cv.toDataURL('image/jpeg', q || .92); } };
