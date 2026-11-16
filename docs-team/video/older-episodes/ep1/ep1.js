/* ===================== EPISODE 1 — "I own a whole town" ===================== */
const DUR = 40.5;
const HUDX = 540, HUDY = 300;            // where coins fly to (bank amount)
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const within = (t, a, b) => t >= a && t < b;

/* ---------- static data ---------- */
const RAIN = []; { const r = seeded(11); for (let k = 0; k < 190; k++) RAIN.push([r() * (W + 400) - 100, 1700 + r() * 900, 34 + r() * 46, r() * (H + 200), .25 + r() * .35, r() < .5 ? 2 : 3]); }
const SPLASH = []; { const r = seeded(12); for (let k = 0; k < 26; k++) SPLASH.push([60 + r() * 960, 1480 + r() * 420, r() * 1.0, .45 + r() * .5]); }
const STARS2 = []; { const r = seeded(99); for (let k = 0; k < 90; k++) STARS2.push([r() * W, r() * 1000, .8 + r() * 1.8]); }
const TOWN_LOTS = LOTS.filter(L => L.i >= -2 && L.i <= 5 && L.j >= -2 && L.j <= 5);
const NAMES = ['you', 'lena_x', 'maxi09', 'jay.tv', 'mia.k', 'noah99'];
const HV = [7, 0, 13, 4, 9, 15];         // house variants for the 6 example tenants

/* ---------- timeline ---------- */
const SITE0 = { t0: 21.45, t1: 23.2 };
const BURST = [0, 1, 2, 3, 4].map(k => 25.0 + k * .13);           // houses 1..5 pop in
const COINS = [];
COINS.push({ lot: 0, t0: 23.42, t1: 24.86 });
BURST.forEach((t, k) => COINS.push({ lot: k + 1, t0: t + .05, t1: t + .62 }));
for (let k = 0; k < 6; k++) COINS.push({ lot: k, t0: 27.95 + k * .12, t1: 28.75 + k * .12, rent: true });
const DRAIN = { t0: 36.15, t1: 36.95 };

function bankCents(t) {
  let c = 0; for (const k of COINS) if (t >= k.t1) c += 10;
  if (t >= DRAIN.t0) c = Math.round(c * (1 - eInOut(prog(t, DRAIN.t0, DRAIN.t1))));
  return c;
}
function tenants(t) {
  let n = t >= SITE0.t1 ? 1 : 0; for (const b of BURST) if (t >= b) n++;
  if (t >= DRAIN.t0) n = Math.round(n * (1 - eInOut(prog(t, DRAIN.t0, DRAIN.t1))));
  return n;
}
function lastArrival(t) { let best = -9; for (const k of COINS) if (t >= k.t1 && k.t1 > best) best = k.t1; return best; }

/* ---------- small drawing pieces ---------- */
let STREET_BG = null;
function buildStreet() {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  g.fillStyle = '#2e1c20'; g.fillRect(0, 0, W, 1470);
  const r = seeded(31), bh = 62, bw = 150;
  for (let row = 0, y = 0; y < 1470; row++, y += bh) {
    const off = row % 2 ? bw / 2 : 0;
    for (let x = -bw; x < W + bw; x += bw) { const v = Math.floor(r() * 20 - 10); g.fillStyle = `rgb(${96 + v},${56 + (v >> 1)},${52 + (v >> 1)})`; rrect(g, x + off + 5, y + 4, bw - 10, bh - 8, 4); g.fill(); }
  }
  // an old poster on the wall
  g.save(); g.translate(170, 980); g.rotate(-.05); g.fillStyle = '#d8cfb4'; g.fillRect(-80, -100, 160, 200); g.fillStyle = '#b8402f'; g.fillRect(-80, -100, 160, 46);
  g.fillStyle = '#5b4a3a'; g.font = F(26); g.textAlign = 'center'; g.fillText('ROOM', 0, -12); g.fillText('FOR RENT', 0, 22); g.font = F(16); g.fillText('€900 / month', 0, 60); g.restore();
  const gr = g.createLinearGradient(0, 0, 0, 1470); gr.addColorStop(0, 'rgba(6,8,24,.94)'); gr.addColorStop(.5, 'rgba(6,8,24,.55)'); gr.addColorStop(1, 'rgba(6,8,24,.2)'); g.fillStyle = gr; g.fillRect(0, 0, W, 1470);
  g.fillStyle = '#454957'; g.fillRect(0, 1470, W, 300);
  g.fillStyle = '#25252e'; g.fillRect(0, 1470, W, 14);
  g.strokeStyle = '#3a3e4c'; g.lineWidth = 3;
  for (const y of [1570, 1670]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  for (let x = -200; x < W + 300; x += 220) { g.beginPath(); g.moveTo(x, 1484); g.lineTo(x - 70, 1770); g.stroke(); }
  g.fillStyle = '#6c7080'; g.fillRect(0, 1770, W, 26);
  g.fillStyle = '#1f222c'; g.fillRect(0, 1796, W, H - 1796);
  g.fillStyle = '#857d58'; for (let x = 40; x < W; x += 300) g.fillRect(x, 1872, 150, 12);
  g.fillStyle = '#232736'; g.fillRect(872, 560, 22, 1215); g.fillRect(860, 1728, 46, 48);
  g.strokeStyle = '#363c52'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(883, 575); g.lineTo(792, 580); g.lineTo(764, 592); g.stroke();
  poly(g, [[700, 614], [820, 614], [800, 586], [720, 586]], '#363c52');
  STREET_BG = c;
}
function drawSignBoard(x, y) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.1);
  poly(ctx, [[-90, -210], [88, -216], [96, 0], [-84, 6]], '#b48858', OUT, 5);
  line(ctx, -70, -170, 70, -174, '#9c7346', 3);
  txt('HELP', 4, -138, 46, '#3b2a1c', 'center', 'middle');
  txt('HUNGRY', 4, -76, 34, '#3b2a1c', 'center', 'middle');
  ctx.restore();
}
function drawCup(x, y) {
  poly(ctx, [[x - 34, y - 86], [x + 34, y - 86], [x + 27, y], [x - 27, y]], '#ece6da', OUT, 4);
  ctx.fillStyle = '#b47a50'; ctx.fillRect(x - 31, y - 62, 61, 22);
  ellipse(ctx, x, y - 86, 34, 8, '#3b3232', OUT, 3);
}
function drawRain(t, k) {
  ctx.save(); ctx.lineCap = 'round';
  for (let n = 0; n < RAIN.length * k; n++) {
    const [x0, sp, ln, ph, a, w] = RAIN[n]; const y = (ph + t * sp) % (H + 200) - 100, x = x0 - y * .2;
    ctx.strokeStyle = `rgba(190,210,245,${a})`; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ln * .2, y - ln); ctx.stroke();
  }
  for (const [x, y, ph, sz] of SPLASH) { const p = (t * 1.6 + ph) % 1; ctx.globalAlpha = (1 - p) * .55; ellipse(ctx, x, y, 6 + p * 26 * sz, 2 + p * 7 * sz, null, '#c8d8f0', 2); }
  ctx.restore();
}
function lampLight(flick) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let g = ctx.createRadialGradient(760, 610, 8, 760, 610, 170); g.addColorStop(0, `rgba(255,215,140,${.6 * flick})`); g.addColorStop(1, 'rgba(255,215,140,0)'); ctx.fillStyle = g; ctx.fillRect(560, 430, 400, 380);
  const cg = ctx.createLinearGradient(0, 614, 0, 1720); cg.addColorStop(0, `rgba(255,210,130,${.18 * flick})`); cg.addColorStop(1, `rgba(255,210,130,${.05 * flick})`);
  ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(722, 614); ctx.lineTo(798, 614); ctx.lineTo(1100, 1720); ctx.lineTo(200, 1720); ctx.closePath(); ctx.fill();
  g = ctx.createRadialGradient(600, 1650, 10, 600, 1650, 440); g.addColorStop(0, `rgba(255,210,130,${.2 * flick})`); g.addColorStop(1, 'rgba(255,210,130,0)'); ctx.fillStyle = g; ctx.fillRect(120, 1380, 960, 540);
  ctx.restore();
  circle(ctx, 760, 602, 15, flick > .5 ? '#fff4c8' : '#8c8470');
}
function drawPigeon(x, y, s, flap, face, crumb) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.lineJoin = 'round';
  const wa = Math.sin(flap) * .9;
  ctx.save(); ctx.translate(-4, -30); ctx.rotate(-.6 - wa); ellipse(ctx, -34, 0, 44, 16, '#7d8494', OUT, 4); ctx.restore();
  ellipse(ctx, 0, -26, 46, 30, '#9aa1b0', OUT, 4);
  ellipse(ctx, 14, -40, 20, 16, '#5fa58c');
  poly(ctx, [[-40, -26], [-78, -40], [-74, -12]], '#6c7282', OUT, 4);
  circle(ctx, 36, -58, 18, '#8c93a3', OUT, 4);
  circle(ctx, 42, -62, 4.5, '#ff8a3d'); circle(ctx, 42, -62, 2, '#1b1728');
  poly(ctx, [[52, -58], [70, -54], [52, -50]], '#e8a35a', OUT, 2);
  if (crumb) emoji(ctx, '🍞', 74, -48, 34);
  ctx.save(); ctx.translate(-2, -34); ctx.rotate(-.2 + wa); ellipse(ctx, -24, 0, 40, 14, '#868d9d', OUT, 4); ctx.restore();
  line(ctx, -6, 2, -8, 14, '#e07a7a', 4); line(ctx, 8, 2, 10, 14, '#e07a7a', 4);
  ctx.restore();
}
function sparkle(x, y, r, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.beginPath(); for (let k = 0; k < 8; k++) { const ang = k * Math.PI / 4, rr = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } ctx.closePath(); ctx.fillStyle = '#fff6c2'; ctx.fill();
  ctx.restore();
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

/* ---------- HUD + captions ---------- */
function drawHUD(t) {
  const c = bankCents(t), n = tenants(t), since = t - lastArrival(t);
  const draining = within(t, DRAIN.t0, DRAIN.t1 + .3), col = draining ? '#ff6b6b' : (c > 0 ? '#46e08a' : '#ff6b6b');
  const glow = clamp(1 - since / .45, 0, 1);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 300, 20, 540, 300, 380); g.addColorStop(0, `rgba(70,224,138,${.35 * glow})`); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 720); ctx.restore(); }
  panel(200, 186, 680, 206, 44, 'rgba(10,12,26,.9)', c > 0 && !draining ? 'rgba(70,224,138,.7)' : 'rgba(255,107,107,.55)', 4);
  txt("BENNY'S BANK", 540, 226, 26, '#9aa3c7', 'center', 'middle');
  const bump = 1 + .16 * clamp(1 - since / .25, 0, 1);
  ctx.save(); ctx.translate(540, 300); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, col, 12, '#06070f'); ctx.restore();
  txt('DAY 1  ·  ' + n + (n === 1 ? ' tenant' : ' tenants'), 540, 364, 26, '#c3c9e4', 'center', 'middle');
  if (within(t, DRAIN.t0, 38.6)) { ctx.globalAlpha = clamp((38.6 - t) / .3, 0, 1) * clamp((t - DRAIN.t0) / .2, 0, 1); otxt('(that was just an example 😅)', 540, 422, 30, '#ffd23f', 7); ctx.globalAlpha = 1; }
}
let CAPS = [];
function drawCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const sz = 66, maxW = 940, y0 = 772;
  ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(prog(t, g.s - .05, g.s + .15));
  ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => {
    const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) {
      const on = t >= w[1] - .03 && t < w[2] + .12, said = t >= w[1] - .03;
      otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : (said ? '#ffffff' : 'rgba(255,255,255,.92)'), 13, '#0b0a14');
      x += ww + sp;
    }
  });
  ctx.restore();
}

/* ---------- street scenes ---------- */
const BX = 520, BY = 1690, BS = 1.72;
function benny(t, o) {
  const m = MOUTH[Math.min(MOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  drawBenny(ctx, BX, BY, BS, Object.assign({ pose: 'sit', blink: (t % 3.7) < .12, talk: o.mute ? 0 : m }, o));
}
function streetScene(t) {
  const flick = (within(t, 4.4, 4.47) || within(t, 4.53, 4.58) || within(t, 37.1, 37.16)) ? .2 : 1;
  ctx.drawImage(STREET_BG, 0, 0);
  lampLight(flick);
  poly(ctx, [[240, 1650], [840, 1650], [872, 1724], [210, 1724]], '#94693f', OUT, 4); line(ctx, 222, 1716, 866, 1716, '#78532f', 4);
  drawSignBoard(240, 1672);
  drawCup(800, 1712);

  let o = { mood: 'sad', look: [0, .5] };
  if (t < 5.24) { o.look = t < 4.1 ? [0, .7] : [0, .1]; }
  else if (t < 7.0) { o.mood = 'hope'; o.look = [0, 0]; o.wave = eOut(prog(t, 5.3, 5.55)) * (1 - eOut(prog(t, 6.55, 6.85))); }
  else if (t < 9.05) { o.mood = 'hope'; o.look = [.75, -.55]; }
  else if (t < 12.2) { o.mood = t < 10.15 ? 'happy' : 'surprised'; o.look = [.7, .3]; o.hold = '🗝️'; o.holdLift = eBack(prog(t, 9.1, 9.45)); }
  else if (t < 20) {
    o.hold = t < 18.86 ? '🍞' : null; o.holdSize = 54;
    if (t < 18.6) { o.mood = 'hope'; o.look = [.6, .4]; }
    else if (t < 18.86) { o.mood = 'surprised'; o.look = [1, -.6]; }
    else if (t < 19.3) { o.mood = 'surprised'; o.look = [-.9, -.7]; }
    else { o.mood = 'sad'; o.look = [0, 0]; }
  }
  else if (t < 30.75) { o.mood = 'mischief'; o.look = [.2, 0]; }
  else if (t < 33.7) { o.mood = 'hope'; o.look = [0, -.95]; }
  else if (t < 36.05) { o.mood = 'hope'; o.look = [0, -.3]; }
  else { o.mood = t < 38.7 ? 'sad' : 'hope'; o.look = t < 36.9 ? [.8, -.9] : [0, 0]; }
  benny(t, o);

  // key moment extras
  if (within(t, 9.1, 12.2)) {
    const kx = BX + 66 * BS + 12, ky = BY + (-132 + 4) * BS - 30;
    for (let k = 0; k < 4; k++) { const a = (t * 1.3 + k * .25) % 1; sparkle(kx + Math.cos(k * 1.7) * 70, ky + Math.sin(k * 2.3) * 60, 14 + 10 * Math.sin(a * Math.PI), Math.sin(a * Math.PI)); }
  }
  if (within(t, 10.2, 12.2)) {
    const qs = [[300, 1100, 10.25], [760, 1060, 10.45], [880, 1240, 10.65]];
    for (const [x, y, t0] of qs) if (t >= t0) { const k = eBack(prog(t, t0, t0 + .25)); ctx.save(); ctx.translate(x, y + Math.sin(t * 4 + x) * 8); ctx.scale(k, k); otxt('?', 0, 0, 110, '#ffd23f', 14); ctx.restore(); }
  }
  // grandpa photo + deed
  if (within(t, 7.1, 9.1)) {
    const k = eBack(prog(t, 7.15, 7.45)), a = clamp((9.1 - t) / .15, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(790, 1010); ctx.rotate(.07); ctx.scale(k, k);
    panel(-150, -170, 300, 340, 10, '#f3ead6', OUT, 5); panel(-128, -148, 256, 240, 4, '#c9a46b');
    const sg = ctx.createRadialGradient(0, -30, 10, 0, -30, 160); sg.addColorStop(0, 'rgba(255,240,200,.5)'); sg.addColorStop(1, 'rgba(110,70,30,.4)'); ctx.fillStyle = sg; ctx.fillRect(-128, -148, 256, 240);
    emoji(ctx, '👴', 0, -28, 150);
    txt('GRANDPA', 0, 132, 32, '#5b4630', 'center', 'middle');
    ctx.restore();
    if (t > 8.3) {
      const k2 = eBack(prog(t, 8.32, 8.6));
      ctx.save(); ctx.globalAlpha = a; ctx.translate(300, 1030); ctx.rotate(-.08); ctx.scale(k2, k2);
      panel(-150, -95, 300, 190, 14, '#efe2bf', OUT, 5);
      txt('📜 TOWN DEED', 0, -46, 30, '#5b4630', 'center', 'middle');
      txt('Owner:', 0, 4, 24, '#7a6648', 'center', 'middle');
      txt('BENNY', 0, 46, 44, '#b8402f', 'center', 'middle');
      ctx.restore();
    }
  }
  // pigeon heist
  if (within(t, 18.25, 20)) {
    const hx = BX + 66 * BS, hy = BY + (-132 + 4) * BS;           // bread position
    let px, py, face = -1, fl = t * 26, crumb = false;
    if (t < 18.86) { const u = eInOut(prog(t, 18.25, 18.86)); px = lerp(1180, hx + 60, u); py = lerp(760, hy - 10, u) - Math.sin(u * Math.PI) * 120; }
    else { const u = eInOut(prog(t, 18.86, 19.75)); px = lerp(hx + 60, -160, u); py = lerp(hy - 10, 820, u) - Math.sin(u * Math.PI) * 140; face = -1; crumb = true; }
    drawPigeon(px, py, 1.45, fl, face, crumb);
    if (within(t, 18.86, 19.4)) { for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, d = 40 + prog(t, 18.86, 19.3) * 90; ctx.globalAlpha = 1 - prog(t, 18.86, 19.4); ellipse(ctx, hx + Math.cos(a) * d, hy + Math.sin(a) * d * .6, 14, 6, '#cfd3de'); } ctx.globalAlpha = 1; }
  }
  // "Again." wink sparkle
  if (within(t, 30.0, 30.75)) sparkle(BX + 100, BY - 400, 34, Math.sin(prog(t, 30.0, 30.75) * Math.PI));
  // dream bubble with bread
  if (within(t, 30.85, 33.75)) {
    const k = eBack(prog(t, 30.9, 31.25)), a = clamp((33.75 - t) / .2, 0, 1);
    ctx.save(); ctx.globalAlpha = a;
    circle(ctx, 600, 1150, 14 * k, '#f4f4fa'); circle(ctx, 640, 1080, 22 * k, '#f4f4fa');
    ctx.translate(700, 950); ctx.scale(k, k);
    for (const [dx, dy, r] of [[-120, 10, 90], [-40, -50, 100], [70, -40, 95], [130, 30, 80], [10, 60, 95], [-90, 70, 70]]) circle(ctx, dx, dy, r, '#f4f4fa');
    const bk = t > 32.95 ? eBack(prog(t, 32.95, 33.25)) : 0;
    emoji(ctx, '🍞', 0, 4, 120 + 30 * bk);
    if (bk > 0) txt('€1.00', 0, 92, 40, '#2f8f5b', 'center', 'middle');
    ctx.restore();
  }
  drawRain(t, 1);
}

/* ---------- town scenes ---------- */
function drawSignPost(x, y, z, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  line(ctx, x, y, x, y - 34 * z, '#5b4630', Math.max(1, 4 * z));
  panel(x - 30 * z, y - 56 * z, 60 * z, 26 * z, 4 * z, '#f4efe4', '#c23a2d', Math.max(1, 2.5 * z));
  if (z > .55) txt('FOR RENT', x, y - 42.5 * z, Math.max(6, Math.round(10 * z)), '#c23a2d', 'center', 'middle');
  ctx.restore();
}
function drawTumbleweed(x, y, z, rot) {
  ctx.save(); ctx.translate(x, y - 16 * z); ctx.rotate(rot);
  circle(ctx, 0, 0, 16 * z, 'rgba(160,120,70,.25)', '#a37a48', 2.5 * z);
  ctx.strokeStyle = '#8c6438'; ctx.lineWidth = 2 * z;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(0, 0, (5 + k * 2.4) * z, k, k + 3.6); ctx.stroke(); }
  ctx.restore();
}
function townState(t) {
  // which houses exist, which site is building, rent coins
  const houses = [], sites = [];
  if (t >= SITE0.t0 && t < SITE0.t1) sites.push({ lot: 0, p: prog(t, SITE0.t0, SITE0.t1), v: HV[0], name: NAMES[0] });
  if (t >= SITE0.t1) houses.push({ lot: 0, v: HV[0], name: NAMES[0], t0: SITE0.t1 });
  BURST.forEach((b, k) => { if (t >= b) houses.push({ lot: k + 1, v: HV[k + 1], name: NAMES[k + 1], t0: b }); });
  return { houses, sites };
}
function townScene(t) {
  const z = cam.z;
  let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060919'); g.addColorStop(1, '#1b2049'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const [x, y, r] of STARS2) { ctx.globalAlpha = .3 + .35 * Math.sin(t * 2 + x); circle(ctx, x, y, r, '#fff'); } ctx.globalAlpha = 1;
  g = ctx.createRadialGradient(880, 470, 10, 880, 470, 160); g.addColorStop(0, 'rgba(240,235,200,.35)'); g.addColorStop(1, 'rgba(240,235,200,0)'); ctx.fillStyle = g; ctx.fillRect(700, 300, 360, 340);
  circle(ctx, 880, 470, 44, '#f1edd6');
  const a0 = -3.5, a1 = 6.5, Tp = uvS(a0, a0), Rp = uvS(a1, a0), Bp = uvS(a1, a1), Lp = uvS(a0, a1), th = 40 * z;
  poly(ctx, [Lp, Bp, [Bp[0], Bp[1] + th], [Lp[0], Lp[1] + th]], '#3a2a20');
  poly(ctx, [Bp, Rp, [Rp[0], Rp[1] + th], [Bp[0], Bp[1] + th]], '#2b1f18');
  poly(ctx, [Tp, Rp, Bp, Lp], '#2f6b45');
  for (let k = -3; k <= 6; k += 3) {
    poly(ctx, [uvS(k - .5, a0), uvS(k + .5, a0), uvS(k + .5, a1), uvS(k - .5, a1)], '#464b63');
    poly(ctx, [uvS(a0, k - .5), uvS(a1, k - .5), uvS(a1, k + .5), uvS(a0, k + .5)], '#464b63');
  }
  ctx.save(); ctx.setLineDash([12 * z, 12 * z]); ctx.strokeStyle = 'rgba(255,210,90,.6)'; ctx.lineWidth = Math.max(1, 2.4 * z); ctx.beginPath();
  for (let k = -3; k <= 6; k += 3) { let p = uvS(k, a0), q = uvS(k, a1); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); p = uvS(a0, k); q = uvS(a1, k); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
  ctx.stroke(); ctx.restore();
  drawPlazaGround();

  const st = townState(t), byLot = {}; st.houses.forEach(h => byLot[h.lot] = h); st.sites.forEach(s => byLot[s.lot] = s);
  const objs2 = [];
  TOWN_LOTS.forEach((L, idx) => {
    const [sx, sy] = uvS(L.i, L.j), h = byLot[idx];
    if (h && h.p != null) objs2.push({ d: L.i + L.j, f: () => drawSite(h, sx, sy) });
    else if (h) objs2.push({ d: L.i + L.j, f: () => { const k = eBack(prog(t, h.t0, h.t0 + .3)); drawHouse(ctx, sx, sy + (1 - k) * 10 * z, z * (.3 + .7 * k), h.v, { yard: true, seed: hashStr('h' + idx) }); } });
    else {
      const a = idx === 0 && t > 21.2 ? 1 - prog(t, 21.2, 21.45) : 1;
      objs2.push({ d: L.i + L.j, f: () => { poly(ctx, [uvS(L.i - .42, L.j - .42), uvS(L.i + .42, L.j - .42), uvS(L.i + .42, L.j + .42), uvS(L.i - .42, L.j + .42)], 'rgba(255,255,255,.04)', 'rgba(255,255,255,.12)', 1); drawSignPost(sx, sy, z, a); } });
    }
    if (L.h % 4 === 0) { const [tx, ty] = uvS(L.i + .36, L.j - .36); objs2.push({ d: L.i + L.j - .1, f: () => drawTree(ctx, tx, ty, z * .85, (L.h >> 5) & 1) }); }
  });
  objs2.push({ d: 3.0, f: () => drawLamp(2.3, .7) });
  objs2.push({ d: 3.0, f: () => drawBench(.8, 2.2) });
  objs2.push({ d: 4.15, f: () => {
    const [x, y] = uvS(2.0, 2.15);
    poly(ctx, [[x - 36 * z, y], [x, y + 15 * z], [x + 36 * z, y], [x, y - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z);
    const m = MOUTH[Math.min(MOUTH.length - 1, Math.round(t * 30))] || 0;
    drawBenny(ctx, x, y + 4 * z, .25 * z, { pose: 'sit', mood: t > 20 && t < 30 ? 'happy' : 'sad', look: [0, .6], blink: (t % 3.7) < .12, talk: m });
  } });
  if (within(t, 12.2, 17.7)) { const u = lerp(-3.4, 6.4, prog(t, 12.25, 17.6)); objs2.push({ d: u + 3 + .5, f: () => { const [x, y] = uvS(u, 3); drawTumbleweed(x, y - Math.abs(Math.sin(t * 5)) * 18 * z, z, t * 6); } }); }
  objs2.sort((a, b) => a.d - b.d); for (const o of objs2) o.f();

  // night tint + lamp glow
  ctx.fillStyle = 'rgba(8,10,34,.22)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const [lx, ly] = uvS(2.3, .7); g = ctx.createRadialGradient(lx, ly - 40 * z, 4, lx, ly - 40 * z, 150 * z); g.addColorStop(0, 'rgba(255,214,140,.35)'); g.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 160 * z, ly - 200 * z, 320 * z, 320 * z);
  ctx.restore();

  // tags
  const [bx, by] = uvS(2.0, 2.15);
  if (t < 3.2 || within(t, 12.1, 17.7)) tag(bx, by - 104 * z - 6, 'BENNY · €0.00', '#ff6b8b', 1);
  for (const s of st.sites) { const L = TOWN_LOTS[s.lot], [sx, sy] = uvS(L.i, L.j); tag(sx, sy - 120 * z, '@' + s.name + '  ' + Math.floor(s.p * 100) + '%', '#ffd23f', 1, s.p); }
  for (const h of st.houses) { const L = TOWN_LOTS[h.lot], [sx, sy] = uvS(L.i, L.j), hs = STY[styleOf(h.v)]; tag(sx, sy - (hs.wall + hs.roofH + hs.f * 32 + 12) * z, '@' + h.name, h.lot === 0 ? '#ffd23f' : '#3ddc84', clamp(prog(t, h.t0, h.t0 + .2), 0, 1)); }

  // flying coins
  for (const c of COINS) {
    if (t < c.t0 || t >= c.t1) continue;
    const L = TOWN_LOTS[c.lot], [sx, sy] = uvS(L.i, L.j), u = eInOut(prog(t, c.t0, c.t1));
    const x0 = sx, y0 = sy - 80 * z, mx = (x0 + HUDX) / 2, my = Math.min(y0, HUDY) - 180;
    const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * HUDX, y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * HUDY;
    drawCoinAt(x, y, 20 + Math.sin(u * Math.PI) * 10);
    if (u < .5) { ctx.globalAlpha = 1 - u * 2; otxt('+10¢', x0, y0 - 40 - u * 60, 34, '#46e08a', 7); ctx.globalAlpha = 1; }
  }
  // +1 follower pill at the site
  if (within(t, 21.36, 23.4)) {
    const L = TOWN_LOTS[0], [sx, sy] = uvS(L.i, L.j), k = eBack(prog(t, 21.36, 21.6));
    ctx.save(); ctx.globalAlpha = clamp((23.4 - t) / .2, 0, 1); ctx.translate(sx, Math.max(940, sy - 250 * z)); ctx.scale(k, k);
    panel(-170, -40, 340, 80, 40, '#ff2e63', '#fff', 3); txt('+1 FOLLOWER', 0, 2, 36, '#fff', 'center', 'middle'); ctx.restore();
  }
  if (t >= SITE0.t1 && t < SITE0.t1 + .8) { const L = TOWN_LOTS[0], [sx, sy] = uvS(L.i, L.j), p = prog(t, SITE0.t1, SITE0.t1 + .8); for (let k = 0; k < 18; k++) { const a = k * 2.4, d = p * 160 * z; ctx.globalAlpha = 1 - p; ctx.fillStyle = CONF[k % CONF.length]; ctx.fillRect(sx + Math.cos(a) * d, sy - 90 * z + Math.sin(a) * d * .7 + p * p * 120, 10, 6); } ctx.globalAlpha = 1; }
}

/* ---------- camera per scene ---------- */
function townCam(t) {
  const [px, py] = isoW(1.5, 1.5);
  if (t < 3.2) { const u = eInOut(prog(t, 0, 3.2)); cam.x = lerp(-40, 30, u); cam.y = lerp(py - 30, py + 20, u); cam.z = lerp(1.25, 1.7, u); return; }
  if (t < 17.7) { const u = eInOut(prog(t, 12.1, 17.6)); cam.x = lerp(-170, 170, u); cam.y = py + 10; cam.z = lerp(1.3, 1.22, u); return; }
  const [lx, ly] = isoW(TOWN_LOTS[0].i, TOWN_LOTS[0].j);
  if (t < 24.9) { const u = eInOut(prog(t, 20.0, 21.4)); cam.x = lerp(px, lx, u); cam.y = lerp(py + 20, ly - 10, u); cam.z = lerp(1.2, 1.85, u); return; }
  const [cx, cy] = isoW(1.6, 1.4);
  const u = eInOut(prog(t, 24.9, 25.6)); cam.x = lerp(lx, cx, u); cam.y = lerp(ly - 10, cy + 10, u); cam.z = lerp(1.85, 1.38, u);
}
const CUTS = [3.16, 5.24, 12.1, 17.6, 19.95, 30.0, 30.75, 33.7, 36.05];
function sceneOf(t) {
  if (t < 3.16) return 'town';
  if (t < 12.1) return 'street';
  if (t < 17.6) return 'town';
  if (t < 19.95) return 'street';
  if (t < 30.0) return 'town';
  return 'street';
}

/* ---------- overlays per moment ---------- */
function overlays(t) {
  // empty town counters
  stamp('0 PEOPLE', 540, 470, t, 14.0, 17.62, 86, '#ff6b6b', -.05, 'rgba(10,12,26,.82)');
  stamp('€0 RENT', 540, 580, t, 15.28, 17.62, 86, '#ff6b6b', .04, 'rgba(10,12,26,.82)');
  stamp('€0.00 INCOME', 540, 690, t, 16.48, 17.62, 72, '#ff6b6b', -.03, 'rgba(10,12,26,.82)');
  // the deal
  stamp('THE DEAL 🤝', 540, 520, t, 20.13, 24.9, 96, '#ffd23f', -.04, 'rgba(10,12,26,.82)');
  stamp('INSTANTLY ⚡', 540, 520, t, 24.96, 25.86, 96, '#46e08a', .04, 'rgba(10,12,26,.82)');
  // rent day calendar
  if (within(t, 26.25, 30.0)) {
    const k = eBack(prog(t, 26.3, 26.6)), a = clamp((30.0 - t) / .15, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 520); ctx.rotate(-.04); ctx.scale(k, k);
    panel(-230, -120, 460, 240, 26, '#fbf7ee', OUT, 6); rrect(ctx, -230, -120, 460, 82, 26); ctx.fillStyle = '#e23b3b'; ctx.fill();
    ctx.fillStyle = '#e23b3b'; ctx.fillRect(-230, -60, 460, 22);
    txt('EVERY SUNDAY', 0, -80, 40, '#fff', 'center', 'middle');
    txt('RENT DAY 💰', 0, 40, 60, '#1b1728', 'center', 'middle');
    ctx.restore();
  }
  if (within(t, 27.95, 30.0)) stamp('+10¢ FROM EVERYONE', 540, 1560, t, 28.0, 30.0, 60, '#46e08a', 0, 'rgba(10,12,26,.85)');
  // bread math
  if (within(t, 30.8, 33.75)) {
    stamp('10 FOLLOWERS', 540, 470, t, 30.85, 33.75, 80, '#ffffff', -.03, 'rgba(10,12,26,.85)');
    stamp('= €1.00 = 🍞', 540, 580, t, 32.3, 33.75, 80, '#46e08a', .03, 'rgba(10,12,26,.85)');
    // ten little people
  }
  // you decide: vote cards
  if (within(t, 33.7, 36.05)) {
    ctx.fillStyle = `rgba(6,8,20,${.72 * prog(t, 33.7, 33.95)})`; ctx.fillRect(0, 0, W, H);
    stamp('YOU DECIDE 👇', 540, 500, t, 33.76, 36.05, 100, '#ffd23f', -.03);
    const opts = [['🍞', 'Bread', '€1.00', '#ff4d6d'], ['🎟️', 'Lottery ticket', '€2.00', '#3ddc84'], ['🕶️', 'Sunglasses', '€3.00', '#4da3ff']];
    opts.forEach(([e, n, p, col], k) => {
      const t0 = 34.0 + k * .16; if (t < t0) return; const s = eBack(prog(t, t0, t0 + .3));
      const x = 40 + k * 340, y = 930, w = 320, h = 340;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2);
      panel(0, 0, w, h, 28, 'rgba(20,24,48,.97)', col, 4);
      circle(ctx, 46, 46, 32, col); txt(String(k + 1), 46, 48, 42, '#fff', 'center', 'middle');
      txt(p, w - 22, 48, 32, '#46e08a', 'right', 'middle');
      emoji(ctx, e, w / 2, 150, 104);
      wrapText(n, w / 2, 262, 32, w - 34, '#fff');
      ctx.restore();
    });
    stamp('COMMENT 1, 2 OR 3', 540, 1360, t, 34.5, 36.05, 64, '#ffffff', 0, '#ff2e63');
  }
  // end card
  if (t >= 38.7) {
    const k = eBack(prog(t, 38.7, 39.0));
    ctx.fillStyle = `rgba(6,8,20,${.45 * prog(t, 38.7, 39.0)})`; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(540, 500); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)');
    txt('and move into Benny\'s town 🏠', 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    stamp('COMMENT 1, 2 OR 3 👇', 540, 652, t, 39.0, 99, 54, '#ffd23f', 0, 'rgba(10,12,26,.88)');
    if (t > 39.2) { ctx.globalAlpha = prog(t, 39.2, 39.5); txt('virtual rent · following is free', 540, 1460, 26, 'rgba(255,255,255,.75)', 'center', 'middle'); ctx.globalAlpha = 1; }
  }
}

/* ---------- master render ---------- */
function renderAt(t) {
  S.T = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
  let lastCut = 0; for (const c of CUTS) if (t >= c) lastCut = c;
  const punch = t > .1 ? 1 + .045 * (1 - eOut(prog(t, lastCut, lastCut + .32))) : 1;
  const sc = sceneOf(t);
  ctx.save(); ctx.translate(540, 1100); ctx.scale(punch, punch); ctx.translate(-540, -1100);
  if (sc === 'town') { townCam(t); townScene(t); }
  else {
    // slow push on the street
    const drift = 1 + .025 * Math.sin(t * .35);
    ctx.save(); ctx.translate(540, 1500); ctx.scale(drift, drift); ctx.translate(-540, -1500); streetScene(t); ctx.restore();
  }
  ctx.restore();
  overlays(t);
  drawHUD(t);
  drawCaption(t);
  if (t < .35) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .35})`; ctx.fillRect(0, 0, W, H); }
}
window.EP = {
  init(caps, mouth) { CAPS = caps; CAPS[0].s = .08; MOUTH = mouth; buildStreet(); },
  frame(t) { renderAt(t); return true; },
  jpeg(t, q) { renderAt(t); return cv.toDataURL('image/jpeg', q || .92); },
  DUR,
};
