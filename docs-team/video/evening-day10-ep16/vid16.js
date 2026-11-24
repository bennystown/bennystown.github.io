/* ===================== FOLGE 16 — "Kitten pack + the cabin" (Mon 23.11.) ===================== */
(() => {
const VDUR = 60.86;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = {"voted": 0.78, "everything": 2.78, "building": 4.86, "middle": 7.14, "kpack": 8.76, "sixty": 9.82, "wood": 11.58, "three": 13.34, "bed": 15.18, "bowl": 16.06, "mouse": 16.98, "loves": 18.54, "box": 20.62, "ofcourse": 21.42, "okay": 22.62, "time": 23.42, "one": 24.94, "two": 26.06, "ow": 27.58, "thumb": 28.46, "who": 29.74, "roof": 30.62, "yep": 31.58, "pigeon": 32.38, "fine": 33.82, "stay": 34.86, "walls": 35.9, "roofw": 36.9, "chimney": 37.46, "done": 38.7, "realc": 40.06, "middle2": 42.58, "first": 44.41, "warm": 47.1, "still": 49.86, "but": 51.63, "tomorrow": 53.98, "drop": 56.14, "end": 58.06, "dur": 60.86};
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
/* ======================= FOLGE 16 SCENES ======================= */
const GROUND = 1250, FEET = 1440, BS = 1.55;
const VX = 560, VY = 1330, VS = .9;
function bgDay(t, o) {   // snowy forest + sky (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#9cc9ee', '#3b4a7a', d), mixc('#e3f0fa', '#f6a27a', d), GROUND);
  if (d < .5) { circle(ctx, 880, 300, 70, `rgba(255,240,180,${.9 * (1 - d * 2)})`); }
  forest(GROUND - 20, mixc('#3f6e58', '#2a4a3c', d), true, o.seed || 3);
  snowGround(GROUND, mixc('#eef3fa', '#d9dfee', d));
}
/* ---------- S1 hook: the vote ---------- */
function sceneHook(t) {
  bgDay(t);
  vanSide(VX, VY, VS, { snowRoof: true });
  drawKitten(250, FEET + 6, .95, { t, look: [1, -.6] });
  benny(420, FEET, BS, { mood: 'happy', armsUp: vin(t, T.everything - .1, T.building - .2) || t > T.middle, look: [-.3, 0], talk: talkAt(t) });
  // poll result card
  const k = eBack(vprog(t, .15, .5)); ctx.save(); ctx.translate(540, 470); ctx.scale(k, k);
  panel(-430, -170, 860, 340, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('YOU VOTED 🗳️', 0, -112, 52, '#ffd23f', 7);
  [['🐱', 'Kitten pack', '61%', '#46e08a', .61], ['🏠', 'Wooden cabin', '22%', '#46e08a', .22], ['🔧', 'Fix the van', '17%', '#9aa3c7', .17]].forEach(([e, s, p, c, f], i) => {
    const y = -36 + i * 78, kk = vprog(t, .5 + i * .2, 1.2 + i * .2); rrect(ctx, -390, y - 30, 780, 60, 22); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
    rrect(ctx, -390, y - 30, 780 * f * kk, 60, 22); ctx.fillStyle = i < 2 ? 'rgba(70,224,138,.35)' : 'rgba(255,255,255,.12)'; ctx.fill();
    emoji(ctx, e, -350, y + 1, 40); txt(s, -310, y + 1, 36, '#fff', 'left', 'middle'); txt(p, 300, y + 1, 36, c, 'right', 'middle');
    if (i < 2 && t > T.everything + i * .9) { const kk2 = eBack(vprog(t, T.everything + i * .9, T.everything + i * .9 + .3)); ctx.save(); ctx.translate(352, y); ctx.scale(kk2, kk2); circle(ctx, 0, 0, 24, '#46e08a', '#fff', 4); otxt('✓', 0, 2, 32, '#fff', 0); ctx.restore(); } });
  ctx.restore();
  vstamp('🐱 + 🏠 = BOTH!', 540, 830, t, T.building - .1, T.middle, 84, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('📍 MIDDLE OF MY SQUARE', 540, 830, t, T.middle, T.kpack, 70, '#ffffff', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S2 shop: kitten pack + wood ---------- */
function packBox(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -70, -110, 140, 110, 10); ctx.fillStyle = '#ff8fb1'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); emoji(ctx, '🐱', 0, -60, 58); ctx.restore(); }
function sceneShop(t) {
  sky('#a9d3f2', '#dcecf8', GROUND); forest(GROUND - 30, '#4c7d66', true, 11); snowGround(GROUND);
  const X0 = 110, X1 = 1030, top = 560, cy = 1080;
  rrect(ctx, X0 + 30, top + 120, X1 - X0 - 60, GROUND - top - 120, 6); ctx.fillStyle = '#f3e3c3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#7a5636'; ctx.fillRect(X0 + 60, top + 300, X1 - X0 - 120, 14);
  for (let k = 0; k < 9; k++) { rrect(ctx, X0 + 90 + k * 88, top + 236, 62, 64, 8); ctx.fillStyle = ['#4da3ff', '#ff8a3d', '#3ddc84', '#b07cff', '#ffd23f', '#ff4d6d'][k % 6]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  const aw = (X1 - X0) / 8; for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e23d3d'; ctx.fillRect(X0 + k * aw, top + 30, aw, 92); ctx.beginPath(); ctx.arc(X0 + k * aw + aw / 2, top + 122, aw / 2, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.strokeRect(X0, top + 30, X1 - X0, 92);
  rrect(ctx, 420, top - 50, 240, 90, 20); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); otxt('SHOP', 540, top - 4, 62, '#1b1728', 0);
  rrect(ctx, X0 + 10, cy, X1 - X0 - 20, GROUND - cy + 30, 8); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = '#a8743f'; ctx.fillRect(X0 + 10, cy, X1 - X0 - 20, 26); ctx.strokeRect(X0 + 10, cy, X1 - X0 - 20, 26);
  const g1 = vprog(t, T.sixty + .5, T.sixty + .8), g2 = vprog(t, T.three + .9, T.three + 1.2);
  if (g1 < 1) { ctx.save(); ctx.globalAlpha = 1 - g1; packBox(640, cy + 4 - g1 * 60, 1.1); ctx.restore(); if (t < T.sixty + .4) priceTag('€60', 700, cy - 150, .1); }
  if (g2 < 1) { ctx.save(); ctx.globalAlpha = 1 - g2; woodStack(880, cy + 2 - g2 * 60, .7, 8); ctx.restore(); if (t < T.three + .8) priceTag('€320', 900, cy - 170, -.08); }
  for (const [s0, x] of [[T.sixty, 640], [T.three + .4, 880]]) if (t >= s0 && t < s0 + 1.2) { const k = eBack(vprog(t, s0, s0 + .25)); ctx.save(); ctx.translate(x, cy - 210); ctx.scale(k, k); ctx.rotate(-.12); panel(-92, -34, 184, 68, 16, '#3ddc84', '#fff', 4); otxt('SOLD ✓', 0, 2, 40, '#fff', 0); ctx.restore(); }
  const wk = vprog(t, T.kpack - .3, T.kpack + 1.2), bx = lerp(-170, 330, ss(wk));
  benny(bx, FEET, BS, { mood: 'happy', walk: wk > 0 && wk < 1 ? t * 10 : 0, look: [1, .1], talk: talkAt(t) });
  if (t > T.sixty + .6) packBox(bx + 150, FEET + 6, .75);
  if (t > T.three + 1.0) woodStack(bx + 40, FEET + 40, .45, 8);
  const cents = t < T.sixty ? 58320 : t < T.three + .4 ? lerp(58320, 52320, ss(vprog(t, T.sixty, T.sixty + .5))) : lerp(52320, 20320, ss(vprog(t, T.three + .4, T.three + 1.0)));
  bankPanel(Math.round(cents), vprog(t, T.kpack - .2, T.kpack + .1), 0);
  floatTxt('−€60', 830, 300, t, T.sixty, '#ff4d6d', 70); floatTxt('−€320', 830, 300, t, T.three + .4, '#ff4d6d', 70);
  vstamp('🐱 KITTEN PACK', 540, 462, t, T.kpack, T.wood - .1, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🪵 WOOD FOR A CABIN', 540, 462, t, T.wood - .1, T.bed - .2, 70, '#ffd23f', .02, 'rgba(10,12,26,.88)');
}
/* ---------- S3 unboxing in the warm van (heater on!) ---------- */
function vanInside(t, o) {
  o = o || {};
  ctx.fillStyle = '#4b4f6e'; ctx.fillRect(0, 0, 1080, 1920);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; ctx.fillRect(k * 120, 0, 120, 1920); }
  rrect(ctx, 250, 330, 580, 420, 22); ctx.fillStyle = '#c9ccd6'; ctx.fill();
  ctx.save(); rrect(ctx, 270, 350, 540, 380, 14); ctx.clip(); const g = ctx.createLinearGradient(0, 350, 0, 730); g.addColorStop(0, '#5b6fa8'); g.addColorStop(1, '#f3b48a'); ctx.fillStyle = g; ctx.fillRect(270, 350, 540, 380);
  ctx.fillStyle = '#eef3fa'; ctx.fillRect(270, 650, 540, 80); for (let k = 0; k < 6; k++) pine(300 + k * 100, 660, 120, '#2e5544', true); snowfall(t, 25, 'rgba(255,255,255,.85)', .5); ctx.restore(); line(ctx, 540, 350, 540, 730, '#c9ccd6', 16);
  ctx.fillStyle = '#5a4030'; ctx.fillRect(0, 1380, 1080, 540);
  heater(900, 1400, .9, 1, t);
}
function sceneUnbox(t) {
  vanInside(t);
  const ib = eBack(vprog(t, T.bed - .05, T.bed + .25)), iw = eBack(vprog(t, T.bowl - .05, T.bowl + .25)), im = eBack(vprog(t, T.mouse - .05, T.mouse + .25));
  if (ib > 0) { ctx.save(); ctx.translate(430, 1600); ctx.scale(ib, ib); catBed(0, 0, 1.5); ctx.restore(); }
  if (iw > 0) { ctx.save(); ctx.translate(700, 1640); ctx.scale(iw, iw); catBowl(0, 0, 1.6); ctx.restore(); }
  if (im > 0) { ctx.save(); ctx.translate(860, 1660); ctx.scale(im, im); toyMouse(0, 0, 1.6, t); ctx.restore(); }
  // the box: at "BOX" the kitten jumps in
  const inBox = t > T.box - .2, jump = vprog(t, T.box - .5, T.box - .1);
  cardboardBox(180, 1560, 1.0, inBox ? { t, look: [1, -.3], eyes: 'open' } : null);
  if (!inBox) { const kx = lerp(560, 190, ss(jump)), ky = 1580 - Math.sin(jump * Math.PI) * 260; drawKitten(kx, ky, .95, { t, look: t > T.loves ? [-1, 0] : [1, .2] }); }
  const fp = t > T.ofcourse - .1;   // facepalm
  benny(560, 1450, 1.45, { pose: 'sit', mood: fp ? 'happy' : 'hope', look: inBox ? [-1, .4] : [-.4, .4], blink: fp && t < T.ofcourse + .5, talk: talkAt(t) });
  vstamp('🛏️ A BED', 540, 330, t, T.bed, T.bowl, 84, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🥣 A BOWL', 540, 330, t, T.bowl, T.mouse, 84, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('🐭 A TOY MOUSE', 540, 330, t, T.mouse, T.loves, 80, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('SHE LOVES IT… 🥹', 540, 330, t, T.loves, T.box - .1, 80, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('…SHE LOVES THE BOX 📦😂', 540, 330, t, T.box - .1, T.okay - .2, 68, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S4 the build, in the middle of the square ---------- */
function buildK(t) {
  if (t < T.one) return 0;
  if (t < T.ow) return .26 * ss(vprog(t, T.one, T.two + .5));
  if (t < T.who - .4) return .26;
  if (t < T.roof + .2) return lerp(.26, .74, ss(vprog(t, T.who - .4, T.roof + .2)));
  if (t < T.walls - .2) return .74;
  return lerp(.74, 1, ss(vprog(t, T.walls - .2, T.chimney + .6)));
}
function sceneBuild(t) {
  const dusk = vprog(t, T.walls, T.done + .3) * .45;
  bgDay(t, { dusk, seed: 7 });
  // the square: stone plaza with a lawn in the middle
  ctx.fillStyle = mixc('#b7b0a0', '#8f8a82', dusk); ctx.fillRect(-10, GROUND + 10, 1100, 90); ctx.fillStyle = mixc('#a49d8c', '#7f7a72', dusk); ctx.fillRect(-10, GROUND + 100, 1100, 700);
  ellipse(ctx, 540, GROUND + 120, 460, 70, mixc('#5aa868', '#3f7a4c', dusk), '#3f8a4e', 4);
  const k = buildK(t);
  cabinSide(540, GROUND + 120, .95, k, t);
  // pigeon on the roof (from "who's sitting on my roof")
  if (t > T.who - .6) { const land = ss(vprog(t, T.who - .6, T.who + .2)), py = GROUND + 120 - (14 + 330 + 210) * .95 + 6, px = 540; drawPigeon(lerp(1150, px, land), lerp(500, py, land) - Math.sin(land * Math.PI) * 60, 1.0, land < 1 ? t * 26 : 0, -1); }
  woodStack(150, FEET + 60, .5, Math.max(0, Math.round(8 * (1 - k))));
  // Benny with the hammer, hurt thumb, then happy
  const hurt = vin(t, T.ow - .1, T.who - .3), hop = hurt ? Math.abs(Math.sin((t - T.ow) * 9)) * 50 : 0, bx = 250, done = t > T.done - .1;
  benny(bx, FEET + 40 - hop, 1.35, { mood: hurt ? 'sad' : done || t > T.fine ? 'happy' : 'hope', armsUp: done && t < T.middle2, look: t > T.who && t < T.fine + .4 ? [1, -1] : [1, -.2], talk: talkAt(t) });
  if (!hurt && !done) { const sw = t < T.ow || (t > T.walls - .2 && t < T.done) ? Math.sin(t * 14) * .6 : 0; hammer(bx + 100, FEET + 40 - 70, .8, .5 + sw); }
  if (hurt) { const q = vprog(t, T.ow - .1, T.ow + .5); ctx.save(); ctx.globalAlpha = 1 - q * .6; for (let s = 0; s < 8; s++) { const a = s / 8 * 6.283; line(ctx, bx + 110 + Math.cos(a) * (20 + q * 40), FEET - 60 + Math.sin(a) * (20 + q * 40), bx + 110 + Math.cos(a) * (40 + q * 70), FEET - 60 + Math.sin(a) * (40 + q * 70), '#ffd23f', 7); } ctx.restore(); }
  if (vin(t, T.one - .1, T.ow)) for (let q = 0; q < 2; q++) { const tt = [T.one, T.two][q]; floatTxt('+1 🪵', 760, 1000 - q * 60, t, tt, '#ffd23f', 56); }
  if (done) for (let s = 0; s < 22; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 500 + rnd(s + 9) * 700 - ph * 60, 44); ctx.restore(); }
  vstamp('🔨 TIME TO BUILD', 540, 330, t, T.time - .1, T.ow - .1, 80, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('OW!! 👍💥', 540, 330, t, T.ow - .1, T.who - .1, 100, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
  vstamp('THE PIGEON. AGAIN. 🙄', 540, 330, t, T.pigeon - .3, T.walls - .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🧱 WALLS · ROOF · CHIMNEY', 540, 330, t, T.walls - .2, T.done - .1, 64, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp("🏡 IT'S DONE!", 540, 330, t, T.done - .1, T.realc + 1.2, 100, '#46e08a', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 first night inside the cabin ---------- */
function sceneNight(t) {
  ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, 1080, 1920);
  for (let q = 0; q < 26; q++) { const y = q * 56; rrect(ctx, -20, y, 1120, 54, 27); ctx.fillStyle = q % 2 ? '#8a5c34' : '#7d5230'; ctx.fill(); line(ctx, 0, y + 53, 1080, y + 53, 'rgba(40,25,15,.35)', 3); }
  rrect(ctx, 290, 330, 500, 400, 20); ctx.fillStyle = '#5b3a2a'; ctx.fill();
  ctx.save(); rrect(ctx, 310, 350, 460, 360, 12); ctx.clip(); const g = ctx.createLinearGradient(0, 350, 0, 710); g.addColorStop(0, '#0d1430'); g.addColorStop(1, '#1f2a55'); ctx.fillStyle = g; ctx.fillRect(310, 350, 460, 360);
  circle(ctx, 680, 430, 40, 'rgba(240,244,255,.95)'); for (let k = 0; k < 30; k++) circle(ctx, 310 + rnd(k + 5) * 460, 350 + rnd(k + 8) * 200, 2, 'rgba(255,255,255,.7)');
  ctx.fillStyle = '#e2e8f3'; ctx.fillRect(310, 640, 460, 80); for (let k = 0; k < 5; k++) pine(340 + k * 100, 650, 110, '#0f1d18', '#9aa6c0'); snowfall(t, 25, 'rgba(255,255,255,.8)', .4); ctx.restore();
  line(ctx, 540, 350, 540, 710, '#5b3a2a', 14); line(ctx, 310, 530, 770, 530, '#5b3a2a', 14);
  ctx.fillStyle = '#4a3020'; ctx.fillRect(0, 1380, 1080, 540); for (let q = 0; q < 6; q++) line(ctx, 0, 1420 + q * 80, 1080, 1420 + q * 80, 'rgba(0,0,0,.18)', 4);
  heater(910, 1420, .85, 1, t);
  const gw = ctx.createRadialGradient(540, 1100, 100, 540, 1100, 1100); gw.addColorStop(0, 'rgba(255,190,110,.18)'); gw.addColorStop(1, 'rgba(255,160,80,0)'); ctx.fillStyle = gw; ctx.fillRect(0, 0, 1080, 1920);
  catBed(620, 1600, 1.0); catBowl(780, 1640, 1.0);
  const peek = t > T.still - .2;
  cardboardBox(220, 1600, .95, { t, look: t > T.but ? [0, 0] : [1, -.3], eyes: t < T.warm + 1.2 && t > T.warm - .5 ? 'closed' : 'open', bob: peek ? 0 : 30 });
  benny(450, 1470, 1.4, { pose: 'sit', mood: 'happy', look: t > T.still ? [-1, .3] : [0, 0], talk: talkAt(t) });
  vstamp('🏡 FIRST NIGHT AT HOME', 540, 260, t, T.first, T.warm, 70, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('…STILL IN THE BOX 📦', 540, 260, t, T.still - .3, T.but, 72, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('🐱 SHE NEEDS A NAME', 540, 260, t, T.but, T.tomorrow, 76, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('TOMORROW YOU DECIDE 🗳️', 540, 260, t, T.tomorrow, T.drop, 70, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
function endCards(t) {
  if (t >= T.drop - .1) { const kk = eBack(vprog(t, T.drop - .1, T.drop + .2)); ctx.save(); ctx.translate(540, 300); ctx.scale(kk, kk); panel(-440, -64, 880, 128, 44, '#ffd23f', '#fff', 5); otxt('💬 DROP A NAME 👇', 0, 2, 60, '#1b1728', 0); ctx.restore(); }
  if (t >= T.end + .2) { const kk = eBack(vprog(t, T.end + .2, T.end + .5)); ctx.save(); ctx.translate(540, 1120); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
/* ======================= MAP: the cabin in the middle of the square ======================= */
function sceneMap(t) {
  const a = T.realc - .25, k = ss(vprog(t, a, a + 2.6)), [bx, by] = isoW(3, 3);
  camXY(bx, by - 40 * k, Math.exp(lerp(Math.log(.16), Math.log(2.1), k)));
  window.__cabinK = .55 + .45 * ss(vprog(t, a + .2, a + 1.4)); window.__grassK = ss(vprog(t, a, a + .8));
  setHash('hour=14.5&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (k > .6) { const [x, y] = uvS(3, 3), p = 1 + .06 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = vprog(t, a + 1.6, a + 2.2); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.ellipse(x, y - 20 * cam.z, 150 * cam.z * p, 80 * cam.z * p, 0, 0, 6.29); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    vstamp('📍 RIGHT IN THE MIDDLE', 540, 330, t, T.realc + .5, T.first, 80, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp("OF BENNY'S TOWN 🏡", 540, 450, t, T.middle2 - .2, T.first, 74, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['shop', T.kpack - .25], ['unbox', T.bed - .25], ['build', T.okay - .2], ['map', T.realc - .25], ['night', T.first - .3]];
const FLASHES = [T.kpack - .25, T.bed - .25, T.okay - .2, T.realc - .25];
const FADES = [T.first - .3];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'map') sceneMap(t);
  else withCtx(OC, () => ({ hook: sceneHook, shop: sceneShop, unbox: sceneUnbox, build: sceneBuild, night: sceneNight })[sc](t));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.end + .2) vCaption(t);
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    for (const c of FADES) if (Math.abs(t - c) < .35) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.abs(t - c) / .35})`; ctx.fillRect(0, 0, 1080, 1920); }
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
    return JSON.stringify({ n: HOUSES.length, cabin: !!TOWN.milestones.cabin });
  },
  frame,
};
})();
