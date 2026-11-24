/* ===================== FOLGE 17 — name finalists + fences (Tue 24.11.) ===================== */
(() => {
const VDUR = 49.38;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = {"top": 4.62, "n0": 5.800000000000001, "n1": 8.94, "n2": 12.14, "n3": 15.74, "n4": 20.22, "more": 23.1, "look": 30.7, "hod": 36.75, "yop": 39.3, "vote": 40.83, "end": 44.78, "dur": 49.38};
let CAPS = [], OUT, OC, P = {};
function withCtx(c, f) { const keep = ctx; ctx = c; try { f(); } finally { ctx = keep; } }
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return; const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 980); if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6)); ctx.restore();
}
function vCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1600, sz = 64, maxW = 940; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15)); ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => { const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; } });
  ctx.restore();
}
function setHash(h) { if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h); }
function camXY(x, y, z) { cam.x = x; cam.y = y; cam.z = z; target.x = x; target.y = y; target.z = z; }
const rnd = k => { const x = Math.sin(k * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };

/* ---------- art kit for Folge 15 (flat side view, Folge-13 style) ---------- */
const O_ = '#1b1728';
function benny(x, y, s, o) { drawBenny(ctx, x, y, s, Object.assign({ pose: 'stand' }, o || {}, { shortLegs: true })); }   // Benny ALWAYS has short legs
function talkAt(t) { const i = Math.floor(t * 30); return P.mouth ? (P.mouth[i] || 0) : 0; }
function mixc(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k, 0, 1))).join(',') + ')'; }
function sky(c1, c2, h) { const g = ctx.createLinearGradient(0, 0, 0, h || 1300); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-400, 0, 1900, 1920); }
function pine(x, base, h, col, snow) {
  const w = h * .36; for (let s = 0; s < 4; s++) { const yy = base - h * (s / 4.2), ww = w * (1 - s / 5);
    poly(ctx, [[x - ww, yy], [x + ww, yy], [x, yy - h * .42]], col);
    if (snow) poly(ctx, [[x - ww * .35, yy - h * .27], [x + ww * .35, yy - h * .27], [x, yy - h * .42]], snow === true ? 'rgba(255,255,255,.85)' : snow); }
  ctx.fillStyle = '#4a3324'; ctx.fillRect(x - h * .03, base, h * .06, h * .06);
}
function forest(base, col, snow, seed) { for (let k = 0; k < 10; k++) pine(-80 + k * 140 + (rnd(k + (seed || 0)) - .5) * 50, base + (k % 3) * 18, 330 + (k % 3) * 70 + rnd(k + 9) * 40, col, snow); }
function snowGround(y, col) { ctx.fillStyle = col || '#eef3fa'; ctx.fillRect(-400, y, 1900, 1920 - y); ctx.fillStyle = 'rgba(150,170,200,.18)'; for (let k = 0; k < 14; k++) ctx.fillRect(rnd(k) * 1080, y + 30 + rnd(k + 4) * 600, 80 + rnd(k + 2) * 160, 6); }
function snowfall(t, n, col, sp) { for (let k = 0; k < (n || 90); k++) { const x = (rnd(k) * 1080 + Math.sin(t + k) * 20), y = ((rnd(k + 50) * 1920 + t * (90 + rnd(k + 7) * 120) * (sp || 1)) % 1980) - 30; circle(ctx, x, y, 2.5 + rnd(k + 3) * 3.5, col || 'rgba(255,255,255,.9)'); } }
function zoomAbout(cx, cy, z) { ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }

/* the motorhome (side view, faces right). (x,y) = ground line under the living box */
const VAN_DOOR = [286, -160], VAN_STEP = [286, -30], VAN_ALARM = [210, -300];
function vanP(x, y, s, p) { return [x + p[0] * s, y + p[1] * s]; }
function vanSide(x, y, s, o) {
  o = o || {}; const dim = o.dim || 0, win = o.win || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const lw = 6;
  ellipse(ctx, 200, 6, 330, 22, 'rgba(0,0,0,.18)');
  const body = mixc('#f6f6f2', '#5a6282', dim), cab = mixc('#9fc6e8', '#26304d', dim);
  rrect(ctx, -60, -330, 420, 290, 26); ctx.fillStyle = body; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = lw; ctx.stroke();
  rrect(ctx, 300, -330, 170, 90, 30); ctx.fillStyle = body; ctx.fill(); ctx.stroke();
  poly(ctx, [[340, -240], [470, -240], [540, -150], [540, -40], [340, -40]], body, O_, lw);
  poly(ctx, [[400, -228], [462, -228], [522, -152], [400, -152]], cab, O_, 4);
  rrect(ctx, 352, -228, 40, 60, 8); ctx.fillStyle = cab; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  for (const [wx, ww] of [[-20, 120], [150, 90]]) { rrect(ctx, wx, -270, ww, 70, 12); ctx.fillStyle = win ? mixc('#33405f', '#ffd56b', win) : mixc('#33405f', '#1a2036', dim); ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = mixc('#c7524c', '#5a2a2a', dim); ctx.fillRect(wx + 6, -264, ww * .22, 58); ctx.fillRect(wx + ww * .78 - 6, -264, ww * .22, 58); }
  const door = o.doorOpen || 0;
  if (door > 0) { rrect(ctx, 255, -260, 62, 200, 10); ctx.fillStyle = mixc('#2a2030', '#ffcf7a', o.doorLight || 0); ctx.fill(); }
  ctx.save(); ctx.translate(255, 0); ctx.scale(1 - door * .85, 1); rrect(ctx, 0, -260, 62, 200, 10); ctx.fillStyle = mixc('#ececE6', '#4f5674', dim); ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); circle(ctx, 50, -160, 5, O_); ctx.restore();
  ctx.lineWidth = 12; ctx.strokeStyle = mixc('#2f8f6b', '#1c3a32', dim); ctx.beginPath(); ctx.moveTo(-50, -120); ctx.bezierCurveTo(80, -170, 200, -90, 250, -110); ctx.stroke();
  ctx.lineWidth = 8; ctx.strokeStyle = mixc('#2b4f8f', '#1b2846', dim); ctx.beginPath(); ctx.moveTo(-50, -100); ctx.bezierCurveTo(80, -150, 200, -70, 250, -90); ctx.stroke();
  rrect(ctx, -60, -62, 600, 26, 8); ctx.fillStyle = mixc('#9aa0ad', '#3a3f52', dim); ctx.fill();
  rrect(ctx, 250, -40, 76, 16, 5); ctx.fillStyle = mixc('#7b8190', '#30344a', dim); ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3; ctx.stroke();   // step
  for (const wx of [40, 430]) { circle(ctx, wx, -30, 50, '#24242c', O_, lw); circle(ctx, wx, -30, 22, mixc('#b9bcc6', '#4a4e5e', dim), O_, 4); }
  if (o.snowRoof) { rrect(ctx, -66, -346, 432, 24, 12); ctx.fillStyle = '#f7fafd'; ctx.fill(); rrect(ctx, 296, -346, 178, 22, 11); ctx.fill(); }
  ctx.restore();
}
/* the motion alarm on the van wall */
function alarmBox(x, y, s, on, t, k) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k);
  rrect(ctx, -28, -16, 56, 34, 8); ctx.fillStyle = '#d8dbe3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  circle(ctx, -10, 1, 7, '#2a2f40'); circle(ctx, -12, -1, 2, '#fff');
  const fl = on ? .5 + .5 * Math.sin(t * 18) : 0;
  ctx.beginPath(); ctx.arc(14, -16, 14, Math.PI, 0); ctx.closePath(); ctx.fillStyle = on ? mixc('#a01818', '#ff3b3b', fl) : '#b52a2a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.restore();
  if (on) { const fl2 = Math.pow(.5 + .5 * Math.sin(t * 18), 2), g = ctx.createRadialGradient(x + 14 * s, y - 20 * s, 4, x + 14 * s, y - 20 * s, 260 * s); g.addColorStop(0, `rgba(255,60,60,${.85 * fl2})`); g.addColorStop(1, 'rgba(255,40,40,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300 * s, y - 300 * s, 600 * s, 600 * s); }
}
function sausage(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); rrect(ctx, -34, -9, 68, 18, 9); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3.5; ctx.stroke(); line(ctx, -20, -4, 14, -4, 'rgba(255,220,200,.55)', 3); ctx.restore(); }
function plate(x, y, s, withSausage) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 0, 62, 20, '#ffffff', O_, 4); ellipse(ctx, 0, -2, 44, 12, '#eef0f4'); ctx.restore(); if (withSausage) sausage(x, y - 8 * s, s, -.08); }
function coin(x, y, r, a) { ctx.save(); ctx.globalAlpha = a == null ? 1 : a; circle(ctx, x, y, r, '#ffcf3f', '#a87a12', Math.max(2, r * .16)); circle(ctx, x, y, r * .62, null, 'rgba(168,122,18,.6)', Math.max(1.5, r * .1)); ctx.restore(); }
function tear(x, y, s, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, k * 2); ctx.translate(x, y + k * 40 * s); ctx.beginPath(); ctx.moveTo(0, -12 * s); ctx.quadraticCurveTo(9 * s, 2 * s, 0, 8 * s); ctx.quadraticCurveTo(-9 * s, 2 * s, 0, -12 * s); ctx.fillStyle = '#8fd0ff'; ctx.fill(); ctx.strokeStyle = 'rgba(30,60,110,.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }

/* the kitten: (x,y) = ground under it. pose: sit | curl | held. o: eyes ('open'|'closed'), look [x,y], shiver, sausage, t */
function drawKitten(x, y, s, o) {
  o = o || {}; const FUR = '#9aa0ad', FUR_D = '#6c7280', WH = '#f6f4ee', PINK = '#f2a3b3';
  const sh = o.shiver ? Math.sin((o.t || 0) * 70) * 2.2 : 0;
  ctx.save(); ctx.translate(x + sh, y); ctx.scale(s * (o.face || 1), s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (o.pose === 'curl') {   // sleeping ball
    ellipse(ctx, 0, 4, 78, 12, 'rgba(0,0,0,.2)');
    ctx.lineWidth = 18; ctx.strokeStyle = O_; ctx.beginPath(); ctx.ellipse(6, -26, 62, 30, 0, .15 * Math.PI, .95 * Math.PI); ctx.stroke();
    ellipse(ctx, 6, -30, 64, 34, FUR, O_, 4.5);
    for (const sx of [-10, 12, 34]) { ctx.beginPath(); ctx.arc(sx, -62, 16, .2 * Math.PI, .8 * Math.PI); ctx.strokeStyle = FUR_D; ctx.lineWidth = 5; ctx.stroke(); }
    ctx.lineWidth = 11; ctx.strokeStyle = FUR; ctx.beginPath(); ctx.ellipse(6, -26, 62, 30, 0, .15 * Math.PI, .95 * Math.PI); ctx.stroke();
    const hx = -44, hy = -38;
    poly(ctx, [[hx - 26, hy - 8], [hx - 22, hy - 44], [hx - 4, hy - 24]], FUR, O_, 4); poly(ctx, [[hx + 26, hy - 8], [hx + 22, hy - 44], [hx + 4, hy - 24]], FUR, O_, 4);
    circle(ctx, hx, hy, 30, FUR, O_, 4.5); ellipse(ctx, hx, hy + 12, 15, 9, WH);
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + sd * 11, hy - 2, 6, .1 * Math.PI, .9 * Math.PI); ctx.strokeStyle = O_; ctx.lineWidth = 3; ctx.stroke(); }
    poly(ctx, [[hx - 4, hy + 6], [hx + 4, hy + 6], [hx, hy + 11]], PINK);
    ctx.restore(); return;
  }
  const held = o.pose === 'held';
  if (!held) ellipse(ctx, 0, 2, 56, 10, 'rgba(0,0,0,.22)');
  // tail
  ctx.lineWidth = 17; ctx.strokeStyle = O_; ctx.beginPath(); ctx.moveTo(28, -14); ctx.quadraticCurveTo(78, -18, 66, -74 + Math.sin((o.t || 0) * 3) * 6); ctx.stroke();
  ctx.lineWidth = 10; ctx.strokeStyle = FUR; ctx.stroke();
  // body
  ellipse(ctx, 0, -46, 44, 48, FUR, O_, 4.5);
  for (const sx of [-1, 1]) for (let q = 0; q < 3; q++) { ctx.beginPath(); ctx.arc(sx * 30, -66 + q * 16, 10, sx > 0 ? .6 * Math.PI : -.4 * Math.PI, sx > 0 ? 1.1 * Math.PI : .1 * Math.PI); ctx.strokeStyle = FUR_D; ctx.lineWidth = 5; ctx.stroke(); }
  ellipse(ctx, 0, -38, 24, 34, WH);
  ellipse(ctx, -16, -4, 13, 9, WH, O_, 3.5); ellipse(ctx, 16, -4, 13, 9, WH, O_, 3.5);
  // head
  const hy = -108 + (o.bob || 0);
  for (const sd of [-1, 1]) { poly(ctx, [[sd * 38, hy - 12], [sd * 30, hy - 62], [sd * 6, hy - 36]], FUR, O_, 4.5); poly(ctx, [[sd * 31, hy - 20], [sd * 27, hy - 50], [sd * 12, hy - 34]], PINK); }
  circle(ctx, 0, hy, 42, FUR, O_, 4.5);
  for (const dx of [-12, 0, 12]) line(ctx, dx, hy - 40, dx * .8, hy - 24, FUR_D, 5);
  ellipse(ctx, 0, hy + 17, 21, 14, WH);
  const lk = o.look || [0, 0];
  for (const sd of [-1, 1]) {
    const ex = sd * 17, ey = hy - 1;
    if (o.eyes === 'closed') { ctx.beginPath(); ctx.arc(ex, ey, 8, .1 * Math.PI, .9 * Math.PI); ctx.strokeStyle = O_; ctx.lineWidth = 3.5; ctx.stroke(); }
    else { ellipse(ctx, ex, ey, 11, 13, '#c9e86a', O_, 3); ellipse(ctx, ex + lk[0] * 3, ey + lk[1] * 3, 4.5, 9.5, '#1b1728'); circle(ctx, ex + lk[0] * 3 - 3, ey + lk[1] * 3 - 4, 2.8, '#fff'); }
  }
  poly(ctx, [[-5, hy + 10], [5, hy + 10], [0, hy + 16]], PINK, O_, 1.5);
  if (o.sausage) { rrect(ctx, -34, hy + 18, 68, 16, 8); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3.5; ctx.stroke(); line(ctx, -22, hy + 22, 12, hy + 22, 'rgba(255,220,200,.55)', 3); }
  else { ctx.beginPath(); ctx.moveTo(-7, hy + 20); ctx.quadraticCurveTo(-3, hy + 25, 0, hy + 20); ctx.quadraticCurveTo(3, hy + 25, 7, hy + 20); ctx.strokeStyle = O_; ctx.lineWidth = 2.5; ctx.stroke(); }
  ctx.strokeStyle = 'rgba(40,40,55,.65)'; ctx.lineWidth = 2;
  for (const sd of [-1, 1]) for (const dy of [-4, 5]) { ctx.beginPath(); ctx.moveTo(sd * 20, hy + 16); ctx.lineTo(sd * 52, hy + 14 + dy); ctx.stroke(); }
  ctx.restore();
}
/* kitten eyes only (for the dark): returns the two eye positions for a sitting kitten at (x,y,s) */
function kittenEyes(x, y, s, a) { for (const sd of [-1, 1]) { const ex = x + sd * 17 * s, ey = y + (-108 - 1) * s; const g = ctx.createRadialGradient(ex, ey, 1, ex, ey, 34 * s); g.addColorStop(0, `rgba(220,255,160,${.9 * a})`); g.addColorStop(1, 'rgba(160,255,120,0)'); ctx.fillStyle = g; ctx.fillRect(ex - 40 * s, ey - 40 * s, 80 * s, 80 * s); ellipse(ctx, ex, ey, 8 * s, 10 * s, `rgba(235,255,190,${a})`); ellipse(ctx, ex, ey, 3 * s, 8 * s, `rgba(20,30,10,${a})`); } }
/* drawPigeon (same as the earlier episodes) */
function drawPigeon(x, y, s, flap, face, o) {
  o = o || {};
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.lineJoin = 'round';
  if (o.rot) ctx.rotate(o.rot);
  const wa = Math.sin(flap) * .9;
  ctx.save(); ctx.translate(-4, -30); ctx.rotate(-.6 - wa); ellipse(ctx, -34, 0, 44, 16, '#7d8494', O_, 4); ctx.restore();
  ellipse(ctx, 0, -26, 46, 30, '#9aa1b0', O_, 4);
  ellipse(ctx, 14, -40, 20, 16, '#5fa58c');
  poly(ctx, [[-40, -26], [-78, -40], [-74, -12]], '#6c7282', O_, 4);
  const hy = -58;
  circle(ctx, 36, hy, 18, '#8c93a3', O_, 4);
  circle(ctx, 42, hy - 4, 4.5, '#ff8a3d'); circle(ctx, 42, hy - 4, 2, '#1b1728');
  poly(ctx, [[52, hy], [70, hy + 4], [52, hy + 8]], '#e8a35a', O_, 2);
  if (o.sausage) { ctx.save(); ctx.translate(66, hy + 10); ctx.rotate(.35); rrect(ctx, -10, -7, 56, 14, 7); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  ctx.save(); ctx.translate(-2, -34); ctx.rotate(-.2 + wa); ellipse(ctx, -24, 0, 40, 14, '#868d9d', O_, 4); ctx.restore();
  line(ctx, -6, 2, -8, 14, '#e07a7a', 4); line(ctx, 8, 2, 10, 14, '#e07a7a', 4);
  ctx.restore();
}
/* bank panel (Folge-13 style, top centre) */
function bankPanel(cents, a, pulse, sub) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 300); const k = 1 + (pulse || 0) * .12; ctx.scale(k, k);
  panel(-250, -78, 500, sub ? 178 : 156, 40, 'rgba(14,14,26,.93)', '#ffd23f', 5);
  emoji(ctx, '🏦', -180, -8, 56); otxt('€' + (cents / 100).toFixed(2), 40, -10, 84, '#46e08a', 9, '#06070f');
  txt('BANK', 40, 52, 26, '#c3c9e4', 'center', 'middle'); if (sub) txt(sub, 0, 82, 28, '#ffd23f', 'center', 'middle');
  ctx.restore();
}
function floatTxt(s, x, y, t, t0, col, sz) { if (t < t0 || t > t0 + 1.6) return; const k = vprog(t, t0, t0 + 1.6); ctx.save(); ctx.globalAlpha = 1 - k; otxt(s, x, y - k * 120, sz || 64, col || '#ff4d6d', 8, '#06070f'); ctx.restore(); }
/* ---------- extra art for Folge 16: heater, cabin (side view, buildable), kitten stuff, hammer ---------- */
function heater(x, y, s, heat, t) {   // same look as Folge 11
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (heat > 0) { const g = ctx.createRadialGradient(0, -110, 20, 0, -110, 520); g.addColorStop(0, `rgba(255,150,60,${.45 * heat})`); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.fillRect(-540, -640, 1080, 1100); }
  ellipse(ctx, 0, 4, 110, 18, 'rgba(0,0,0,.35)');
  rrect(ctx, -95, -225, 190, 220, 30); ctx.fillStyle = '#d9dde6'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  rrect(ctx, -70, -195, 140, 150, 18); ctx.fillStyle = heat > 0 ? `rgb(${Math.round(60 + 195 * heat)},${Math.round(60 + 80 * heat)},${Math.round(70 - 30 * heat)})` : '#3c3f4c'; ctx.fill();
  for (let q = 0; q < 5; q++) { const yy = -180 + q * 30; line(ctx, -60, yy, 60, yy, heat > .1 ? `rgba(255,${200 + 40 * Math.sin(t * 6 + q)},120,${.4 + .6 * heat})` : '#2a2c36', 8); }
  circle(ctx, 0, -25, 13, heat > 0 ? '#46e08a' : '#7a7f8e', O_, 4);
  rrect(ctx, -80, -12, 40, 14, 6); ctx.fillStyle = O_; ctx.fill(); rrect(ctx, 40, -12, 40, 14, 6); ctx.fill();
  ctx.restore();
}
/* log cabin, front view. (x,y) = ground centre, s = scale (1 → 560 px wide). k = build progress 0..1 */
function cabinSide(x, y, s, k, t, o) {
  o = o || {}; const W = 560, H = 330, RH = 210, logs = 9, lh = H / logs, O2 = O_;
  const wk = clamp((k - .03) / .55, 0, 1), rk = clamp((k - .6) / .22, 0, 1), dk = clamp((k - .84) / .16, 0, 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ellipse(ctx, 0, 6, W * .62, 26, 'rgba(0,0,0,.2)');
  rrect(ctx, -W / 2 - 20, -14, W + 40, 22, 8); ctx.fillStyle = '#7d7769'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 5; ctx.stroke();   // stone foundation
  const nLogs = wk * logs;
  for (let q = 0; q < Math.ceil(nLogs); q++) {
    const part = Math.min(1, nLogs - q), yy = -14 - (q + 1) * lh, drop = (1 - part) * 120;
    ctx.save(); ctx.globalAlpha = Math.min(1, part * 1.6);
    rrect(ctx, -W / 2 - 14, yy - drop, W + 28, lh + 2, lh / 2); ctx.fillStyle = q % 2 ? '#9a6a3e' : '#a8743f'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 4; ctx.stroke();
    for (const ex of [-W / 2 - 14, W / 2 + 14]) { ctx.beginPath(); ctx.ellipse(ex, yy - drop + lh / 2 + 1, lh * .38, lh * .48, 0, 0, 6.29); ctx.fillStyle = '#d9a86a'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore();
  }
  if (wk >= .999) {   // door + window
    rrect(ctx, -60, -14 - 200, 120, 200, 12); ctx.fillStyle = '#4a2f22'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 5; ctx.stroke(); circle(ctx, 38, -14 - 100, 7, '#e8c25a', O2, 3);
    const lit = dk; rrect(ctx, 120, -14 - 230, 120, 110, 10); ctx.fillStyle = lit > 0 ? mixc('#33405f', '#ffd56b', lit) : '#33405f'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 5; ctx.stroke(); line(ctx, 180, -244, 180, -134, O2, 5); line(ctx, 120, -189, 240, -189, O2, 5);
    rrect(ctx, -240, -14 - 230, 120, 110, 10); ctx.fillStyle = lit > 0 ? mixc('#33405f', '#ffd56b', lit) : '#33405f'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 5; ctx.stroke(); line(ctx, -180, -244, -180, -134, O2, 5); line(ctx, -240, -189, -120, -189, O2, 5);
  }
  if (rk > 0) {
    const top = -14 - H, drop = (1 - rk) * 140;
    ctx.save(); ctx.globalAlpha = Math.min(1, rk * 2); ctx.translate(0, -drop);
    if (dk > 0) { rrect(ctx, 120, top - RH * .9 - 40 * dk, 56, RH * .6 + 40 * dk, 6); ctx.fillStyle = '#7d7769'; ctx.fill(); ctx.strokeStyle = O2; ctx.lineWidth = 5; ctx.stroke();
      for (let q = 0; q < 5; q++) { const ph = ((t || 0) * .45 + q / 5) % 1; circle(ctx, 148 + Math.sin(ph * 5 + q) * 14, top - RH * .9 - 50 - ph * 220, 16 + ph * 26, `rgba(235,238,245,${.6 * (1 - ph) * dk})`); } }
    poly(ctx, [[-W / 2 - 60, top + 6], [0, top - RH], [W / 2 + 60, top + 6]], '#5b3a2a', O2, 6);
    poly(ctx, [[-W / 2 - 60, top + 6], [0, top - RH], [W / 2 + 60, top + 6], [W / 2 + 34, top + 6], [0, top - RH + 34], [-W / 2 - 34, top + 6]], '#4a2f22');
    poly(ctx, [[-W / 2 + 10, top + 2], [0, top - RH + 46], [W / 2 - 10, top + 2]], '#9a6a3e', O2, 4);
    for (let q = 1; q < 4; q++) line(ctx, -W / 2 + 10 + q * 60, top + 2 - q * 10, W / 2 - 10 - q * 60, top + 2 - q * 10, 'rgba(60,35,20,.35)', 3);
    poly(ctx, [[-W / 2 - 60, top + 6], [0, top - RH], [-W / 2 + 40, top - 40]], 'rgba(244,248,252,.95)');   // snow
    poly(ctx, [[W / 2 + 60, top + 6], [0, top - RH], [W / 2 - 40, top - 40]], 'rgba(232,238,246,.95)');
    ctx.restore();
  }
  ctx.restore();
}
function cardboardBox(x, y, s, kit) {   // open box, optional kitten head peeking out
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 110, 16, 'rgba(0,0,0,.22)');
  poly(ctx, [[-95, -120], [95, -120], [95, 0], [-95, 0]], '#c9a06a', O_, 5);
  poly(ctx, [[-95, -120], [-140, -160], [-50, -150], [-30, -120]], '#b48a55', O_, 4); poly(ctx, [[95, -120], [140, -160], [50, -150], [30, -120]], '#b48a55', O_, 4);
  line(ctx, -95, -60, 95, -60, 'rgba(120,80,40,.4)', 4);
  ctx.restore();
  if (kit) { ctx.save(); ctx.beginPath(); ctx.rect(x - 200 * s, y - 600 * s, 400 * s, 600 * s - 118 * s); ctx.clip(); drawKitten(x, y - 46 * s + (kit.bob || 0) * s, .95 * s, Object.assign({}, kit, { bob: 0 })); ctx.restore(); }
}
function catBed(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, -18, 110, 38, '#c95d8b', O_, 5); ellipse(ctx, 0, -26, 80, 22, '#f7c8d8'); ellipse(ctx, 0, -50, 110, 14, null); ctx.restore(); }
function catBowl(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, -10, 46, 18, '#4da3ff', O_, 4); ellipse(ctx, 0, -16, 34, 9, '#a5603a'); ctx.restore(); }
function toyMouse(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, -14, 30, 18, '#b9bcc6', O_, 3.5); circle(ctx, 22, -24, 9, '#f2a3b3', O_, 3); circle(ctx, 28, -14, 3, O_); ctx.strokeStyle = O_; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -12); ctx.quadraticCurveTo(-50, -30 + Math.sin((t || 0) * 4) * 6, -64, -8); ctx.stroke(); ctx.restore(); }
function hammer(x, y, s, ang) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); rrect(ctx, -6, -110, 12, 120, 5); ctx.fillStyle = '#a8743f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); rrect(ctx, -34, -130, 68, 30, 6); ctx.fillStyle = '#6b7080'; ctx.fill(); ctx.stroke(); ctx.restore(); }
function woodStack(x, y, s, n) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let q = 0; q < n; q++) { const r = Math.floor(q / 4), c = q % 4; rrect(ctx, -150 + c * 6 * (r % 2), -30 - r * 30, 300, 28, 14); ctx.fillStyle = q % 2 ? '#a8743f' : '#9a6a3e'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3.5; ctx.stroke(); } ctx.restore(); }
function priceTag(s, x, y, rot, a, col) { ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.translate(x, y); ctx.rotate(rot || .08); ctx.font = F(38); const w = Math.max(92, ctx.measureText(s).width + 36); rrect(ctx, -w / 2, -26, w, 52, 12); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); otxt(s, 0, 2, 38, col || '#e23d3d', 0); ctx.restore(); }
/* ======================= FOLGE 17 — name finalists + fences + house of the day ======================= */
const NAMES = [['🧤', 'MITTENS', 'mittens'], ['🌙', 'LUNA', 'luna'], ['🍫', 'NUTELLA', 'nutella'], ['🌭', 'SAUSAGE', 'sausage'], ['🫧', 'FIZZY', 'fizzy']];
function cabinRoom(t, night) {
  ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, 1080, 1920);
  for (let q = 0; q < 26; q++) { const y = q * 56; rrect(ctx, -20, y, 1120, 54, 27); ctx.fillStyle = q % 2 ? '#8a5c34' : '#7d5230'; ctx.fill(); line(ctx, 0, y + 53, 1080, y + 53, 'rgba(40,25,15,.35)', 3); }
  rrect(ctx, 290, 330, 500, 400, 20); ctx.fillStyle = '#5b3a2a'; ctx.fill();
  ctx.save(); rrect(ctx, 310, 350, 460, 360, 12); ctx.clip(); const g = ctx.createLinearGradient(0, 350, 0, 710);
  g.addColorStop(0, night ? '#0d1430' : '#9fd0f5'); g.addColorStop(1, night ? '#1f2a55' : '#ffe2b8'); ctx.fillStyle = g; ctx.fillRect(310, 350, 460, 360);
  if (night) { circle(ctx, 660, 440, 52, 'rgba(240,244,255,.97)'); circle(ctx, 640, 430, 10, 'rgba(200,205,225,.6)'); for (let k = 0; k < 30; k++) circle(ctx, 310 + rnd(k + 5) * 460, 350 + rnd(k + 8) * 200, 2, 'rgba(255,255,255,.7)'); }
  else circle(ctx, 680, 450, 50, 'rgba(255,236,170,.95)');
  ctx.fillStyle = night ? '#e2e8f3' : '#f2f6fb'; ctx.fillRect(310, 640, 460, 80); for (let k = 0; k < 5; k++) pine(340 + k * 100, 650, 110, night ? '#0f1d18' : '#3f6e58', true); snowfall(t, 20, 'rgba(255,255,255,.8)', .4); ctx.restore();
  line(ctx, 540, 350, 540, 710, '#5b3a2a', 14); line(ctx, 310, 530, 770, 530, '#5b3a2a', 14);
  ctx.fillStyle = '#4a3020'; ctx.fillRect(0, 1380, 1080, 540); for (let q = 0; q < 6; q++) line(ctx, 0, 1420 + q * 80, 1080, 1420 + q * 80, 'rgba(0,0,0,.18)', 4);
  if (night) { ctx.fillStyle = 'rgba(10,15,40,.35)'; ctx.fillRect(0, 0, 1080, 1920); const mg = ctx.createRadialGradient(540, 1500, 50, 540, 1500, 600); mg.addColorStop(0, 'rgba(200,215,255,.35)'); mg.addColorStop(1, 'rgba(200,215,255,0)'); ctx.fillStyle = mg; ctx.fillRect(0, 900, 1080, 1020); }
}
function sceneHook(t) {
  cabinRoom(t, false); heater(910, 1420, .85, 1, t);
  cardboardBox(240, 1600, .95, null); catBed(820, 1640, .9);
  drawKitten(560, 1520, 2.0, { t, look: [0, -.2] });
  const k = eBack(vprog(t, .2, .55)); ctx.save(); ctx.translate(560, 1010 + Math.sin(t * 3) * 8); ctx.scale(k, k); ctx.rotate(-.04);
  rrect(ctx, -190, -60, 380, 120, 26); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); line(ctx, 0, -60, 0, -110, O_, 5); otxt('NAME: ???', 0, 4, 60, '#1b1728', 0); ctx.restore();
  vstamp('🐱 TOP 5 NAMES', 540, 330, t, T.top - .1, T.n0, 90, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
}
function nameCard(t, i, t0) {
  const [e, n] = NAMES[i], k = eBack(vprog(t, t0, t0 + .3)); ctx.save(); ctx.translate(540, 820); ctx.scale(k, k); ctx.rotate(i % 2 ? .03 : -.03);
  panel(-400, -110, 800, 220, 56, 'rgba(10,12,26,.93)', '#ffd23f', 6); txt('#' + (i + 1), -330, -50, 40, '#ffd23f', 'left', 'middle'); otxt(e + ' ' + n, 0, 12, 104, '#ffffff', 10); ctx.restore();
}
function sceneName(t, i) {
  const t0 = T['n' + i];
  if (i === 0) {   // Mittens: close-up of her white paws
    sky('#ffd6e0', '#ffeef3', 1920); ctx.save(); zoomAbout(540, 1400, 1 + .08 * vprog(t, t0, t0 + 2.5)); drawKitten(540, 1520, 3.0, { t, look: [0, .3] }); ctx.restore();
    for (const dx of [-51, 51]) { const pul = .5 + .5 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = .6 + .4 * pul; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(540 + dx * .98, 1508, 66, 42, 0, 0, 6.29); ctx.stroke(); ctx.restore(); }
  } else if (i === 1) {   // Luna: in the moonlight at the window
    cabinRoom(t, true); drawKitten(540, 1460, 2.3, { t, look: [.4, -1] });
  } else if (i === 2) {   // Nutella: next to a big chocolate-spread jar (no brand)
    sky('#f3dcc0', '#fbeedd', 1920); ctx.fillStyle = '#c9a06a'; ctx.fillRect(0, 1440, 1080, 480);
    ctx.save(); ctx.translate(780, 1480); rrect(ctx, -120, -330, 240, 330, 40); ctx.fillStyle = '#5a3420'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 7; ctx.stroke();
    rrect(ctx, -130, -380, 260, 70, 18); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); rrect(ctx, -100, -230, 200, 120, 20); ctx.fillStyle = '#fff4e6'; ctx.fill(); ctx.stroke(); emoji(ctx, '🍫', 0, -170, 70); ctx.restore();
    drawKitten(360, 1480, 2.3, { t, look: [1, -.3] });
  } else if (i === 3) {   // Sausage: caught with the sausage
    sky('#1a2347', '#2c3a6e', 1920); ctx.fillStyle = '#d9dfee'; ctx.fillRect(0, 1400, 1080, 520); drawKitten(540, 1470, 2.5, { t, sausage: true, look: [-.2, 0] });
    for (let q = 0; q < 6; q++) { const a = q / 6 * 6.283 + t; emoji(ctx, '❗', 540 + Math.cos(a) * 360, 1180 + Math.sin(a) * 120, 54); }
  } else {   // Fizzy: bouncing with bubbles
    sky('#bfe9ff', '#e9f8ff', 1920); ctx.fillStyle = '#9fd6a6'; ctx.fillRect(0, 1440, 1080, 480);
    const b = Math.abs(Math.sin((t - t0) * 6)) * 140; drawKitten(540, 1490 - b, 2.3, { t, look: [0, -.4] });
    for (let q = 0; q < 24; q++) { const ph = ((t - t0) * .5 + rnd(q)) % 1, x = 150 + rnd(q + 3) * 780, y = 1600 - ph * 1100; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * .9; circle(ctx, x, y, 14 + rnd(q + 7) * 26, 'rgba(255,255,255,.25)', 'rgba(255,255,255,.9)', 4); ctx.restore(); }
  }
  nameCard(t, i, t0);
}
function endCards(t) {
  if (t < T.vote) return; const k = eBack(vprog(t, T.vote, T.vote + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.vote, T.vote + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 760); ctx.scale(k, k); panel(-460, -400, 920, 800, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt("WHAT'S HER NAME? 🐱", 0, -325, 62, '#ffd23f', 8);
  NAMES.forEach(([e, n], i) => { const y = -205 + i * 112, kk = eBack(vprog(t, T.vote + .3 + i * .15, T.vote + .6 + i * .15)); ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk);
    panel(-410, -46, 820, 92, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 50); txt(n.charAt(0) + n.slice(1).toLowerCase(), -300, 2, 46, '#ffffff', 'left', 'middle'); ctx.restore(); });
  txt('Vote 👇  ·  winner tonight 🌙', 0, 355, 36, '#c3c9e4', 'center', 'middle'); ctx.restore();
  if (t >= T.end + .2) { const kk = eBack(vprog(t, T.end + .2, T.end + .5)); ctx.save(); ctx.translate(540, 1370); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
/* ---------- map: fences + house of the day ---------- */
function sceneFence(t) {
  const a = T.more - .2, k = vprog(t, a, T.hod - .2), [bx, by] = isoW(BHOME[0] + 6, BHOME[1] + 6);
  camXY(bx + 260 * k, by + 140 * k, Math.exp(lerp(Math.log(1.9), Math.log(1.1), ss(k))));
  setHash('hour=11&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    vstamp('🏡 1 WEEK = FENCE + GARDEN', 540, 330, t, T.more + .3, T.look, 66, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp('⭐ 4,984 LOYAL NEIGHBORS', 540, 330, t, T.look, T.hod - .2, 70, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
function sceneHod(t) {
  const h = P.hod, a = T.hod - .2, k = ss(vprog(t, a, a + 1.4)), [x, y] = isoW(h.i, h.j);
  camXY(x, y - 30, Math.exp(lerp(Math.log(.6), Math.log(2.6), k)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t > T.yop - .1) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.yop - .1, T.yop + .2)); ctx.save(); ctx.translate(sx, sy - 125 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '🏆 @' + h.name, '#ffd23f', 1); ctx.restore();
      for (let s = 0; s < 18; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 600 + rnd(s + 9) * 800 - ph * 60, 44); ctx.restore(); } }
    vstamp('🏆 HOUSE OF THE DAY', 540, 330, t, T.hod, T.vote, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  });
}
/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['n0', T.n0], ['n1', T.n1 - .15], ['n2', T.n2 - .15], ['n3', T.n3 - .15], ['n4', T.n4 - .15], ['fence', T.more - .2], ['hod', T.hod - .2]];
const FLASHES = [T.n0, T.n1 - .15, T.n2 - .15, T.n3 - .15, T.n4 - .15, T.more - .2, T.hod - .2];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'fence') sceneFence(t); else if (sc === 'hod') sceneHod(t);
  else withCtx(OC, () => sc === 'hook' ? sceneHook(t) : sceneName(t, +sc[1]));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.vote + .1 || t < T.end) { if (t < T.vote) vCaption(t); }
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t < .12) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .12})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t > VDUR - .5) { ctx.fillStyle = `rgba(0,0,0,${(t - (VDUR - .5)) / .5})`; ctx.fillRect(0, 0, 1080, 1920); }
  });
  return OUT.toDataURL('image/jpeg', .92);
}
window.EP = {
  DUR: VDUR, T,
  async init(caps, mouth) {
    CAPS = caps; P.mouth = mouth; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    window.__globe = true; window.__noBenny = true;
    P.hod = HOUSES.find(h => h.name === 'yopmonster');
    return JSON.stringify({ n: HOUSES.length, hod: P.hod && [P.hod.i, P.hod.j, tierOf(P.hod)] });
  },
  frame,
};
})();
