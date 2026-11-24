/* ===================== FOLGE 15 — "Rent Day + the kitten" (Sun 22.11., day 9) ===================== */
(() => {
const VDUR = 115.92;
const N_NEW = 33;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = {"sunday": 0.62, "rent0": 4.86, "every0": 5.98, "biggest": 9.26, "first": 11.63, "lastn": 14.1, "voted": 15.26, "alarmw": 16.58, "sausw": 17.58, "eight": 19.34, "four": 20.78, "left": 23.1, "two": 23.9, "nomoney": 26.3, "flash": 27.1, "great": 28.63, "put": 29.58, "vanw": 30.46, "one": 31.38, "snoww": 32.54, "bed": 33.58, "couldnt": 35.18, "three": 36.97, "alarm": 38.34, "outthere": 39.45, "ran": 40.78, "pitch": 42.54, "noflash2": 43.82, "onlyred": 45.26, "sausage2": 47.5, "gone": 48.7, "andthen": 50.3, "eyes": 51.42, "front": 52.62, "kitten": 54.7, "tiny": 56.06, "mouth": 59.54, "hungry": 60.3, "likeme": 61.94, "took": 63.34, "ofcourse": 65.02, "pigeon": 65.9, "second": 66.7, "classic": 68.46, "morning": 69.78, "chest": 72.06, "remember": 73.9, "rent2": 75.1, "five": 76.42, "each": 80.06, "look": 81.18, "amount": 82.73, "euros": 84.3, "never": 85.66, "life": 87.74, "newn": 88.78, "welcome": 90.86, "houses": 92.3, "oh": 94.75, "treasure": 95.98, "nohints": 99.34, "so": 100.46, "real": 103.18, "fix": 104.86, "cabin": 106.06, "kneeds": 108.22, "vote": 109.9, "name": 111.26, "end": 113.02, "dur": 115.92};
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
/* ======================= SCENES ======================= */
const GROUND = 1250, FEET = 1440, BS = 1.55;            // horizon, Benny's feet, Benny's size (short legs, always)
const VX = 470, VY = 1330, VS = .95;                    // the van in all outside shots
const STEP = vanP(VX, VY, VS, [288, -32]), DOOR = vanP(VX, VY, VS, [286, -160]), ALARM = vanP(VX, VY, VS, VAN_ALARM);
const PLATE = [585, 1428];
function dayScene(t, o) {   // sunny snowy day at the van (hook + decision + emotional)
  o = o || {}; sky('#9cc9ee', '#e3f0fa', GROUND);
  circle(ctx, 880, 300, 70, 'rgba(255,240,180,.9)'); circle(ctx, 880, 300, 110, 'rgba(255,240,180,.25)');
  if (o.houses) for (let k = 0; k < 7; k++) { const x = 40 + k * 150, h = 120 + (k % 3) * 22, by = GROUND - 8;
    rrect(ctx, x, by - h, 112, h, 6); ctx.fillStyle = ['#f3e3c3', '#cfe3f2', '#f6c9cf', '#d7efd2', '#f2d6a2', '#d9c8f2', '#f7c8a8'][k]; ctx.fill(); ctx.strokeStyle = 'rgba(27,23,40,.5)'; ctx.lineWidth = 3; ctx.stroke();
    poly(ctx, [[x - 12, by - h], [x + 124, by - h], [x + 56, by - h - 64]], ['#d9534f', '#3c5a99', '#7b4b94', '#2f7d6b', '#8a4b2e', '#5b3f8f', '#b5523a'][k], 'rgba(27,23,40,.5)', 3);
    poly(ctx, [[x - 4, by - h - 4], [x + 116, by - h - 4], [x + 56, by - h - 56]], 'rgba(255,255,255,.0)');
    rrect(ctx, x + 40, by - 44, 30, 44, 4); ctx.fillStyle = '#6b4a33'; ctx.fill(); }
  else forest(GROUND - 20, '#3f6e58', true, 3);
  snowGround(GROUND);
  if (!o.noVan) vanSide(VX, VY, VS, { snowRoof: true });
}
/* ---------- S1 hook: Sunday = RENT DAY ---------- */
function sceneHook(t) {
  dayScene(t, { houses: true, noVan: true });
  // every house pays: coins pop from the roofs and rain down
  const pay = vprog(t, T.every0, T.every0 + 1.5);
  for (let k = 0; k < 7; k++) { const t0 = T.every0 + k * .22; if (t < t0) continue; const q = (t - t0) % 1.4, x = 96 + k * 150, y = GROUND - 200 - (k % 3) * 22 - q * 160;
    coin(x, y, 22, 1 - q / 1.4); if (t - t0 < 1.2) { ctx.save(); ctx.globalAlpha = 1 - (t - t0) / 1.2; otxt('+10¢', x, y - 46, 40, '#46e08a', 6, '#06070f'); ctx.restore(); } }
  const rain = vprog(t, T.rent0, T.rent0 + .6);
  for (let k = 0; k < 46 * rain; k++) { const x = rnd(k + 300) * 1080, y = ((rnd(k + 400) * 1920 + (t - T.rent0) * (520 + rnd(k) * 380)) % 2100) - 120; coin(x, y, 16 + rnd(k + 7) * 14, .95); }
  const dance = t > T.biggest - .2, jump = t > T.rent0 ? Math.abs(Math.sin((t - T.rent0) * 5.2)) * 40 : 0;
  benny(360, FEET - jump, BS, { mood: 'happy', armsUp: t > T.rent0 && (!dance || Math.sin(t * 6) > 0), look: [.2, 0], talk: talkAt(t) });
  // title
  if (t > .15) { const k = eBack(vprog(t, .15, .5)); ctx.save(); ctx.translate(540, 360); ctx.scale(k, k); ctx.rotate(-.03); panel(-250, -62, 500, 124, 40, 'rgba(10,12,26,.9)', 'rgba(255,255,255,.3)', 3); otxt('☀️ SUNDAY', 0, 0, 78, '#ffffff', 8); ctx.restore(); }
  if (t > T.rent0 - .1) { const k = eBack(vprog(t, T.rent0 - .1, T.rent0 + .3)), p = 1 + .05 * Math.sin(t * 7); ctx.save(); ctx.translate(540, 560); ctx.scale(k * p, k * p); ctx.rotate(.02);
    const g = ctx.createLinearGradient(-430, 0, 430, 0); g.addColorStop(0, '#ffb703'); g.addColorStop(1, '#ffd23f'); rrect(ctx, -440, -100, 880, 200, 50); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke();
    otxt('💰 RENT DAY 💰', 0, 4, 120, '#1b1728', 0); ctx.restore(); }
  if (t > T.every0) vstamp('EVERY NEIGHBOR = 10¢', 540, 760, t, T.every0, T.biggest - .1, 70, '#46e08a', -.02, 'rgba(10,12,26,.88)');
  if (t > T.biggest - .1) vstamp('THE BIGGEST DAY OF THE WEEK 🎉', 540, 760, t, T.biggest - .1, T.first, 62, '#ffffff', .02, 'rgba(10,12,26,.88)');
}
/* ---------- S2 rewind to last night ---------- */
function sceneRewind(t) {
  const k = vprog(t, T.first, T.voted - .2);
  ctx.save(); ctx.filter = `grayscale(${Math.min(1, k * 2)}) contrast(1.15) brightness(${1 - .35 * k})`; sceneHook(T.first - .05); ctx.restore(); ctx.filter = 'none';
  // VHS rewind: tracking bars + streaks moving upwards
  for (let q = 0; q < 7; q++) { const y = (1920 - ((t * 900 + q * 300) % 2200)); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(0, y, 1080, 26 + q * 4); }
  for (let q = 0; q < 40; q++) { ctx.fillStyle = `rgba(255,255,255,${.15 + rnd(q + Math.floor(t * 20)) * .25})`; ctx.fillRect(rnd(q * 3 + Math.floor(t * 30)) * 1080, rnd(q * 7 + Math.floor(t * 30)) * 1920, 80 + rnd(q) * 260, 3); }
  ctx.fillStyle = `rgba(12,16,40,${.45 * k})`; ctx.fillRect(0, 0, 1080, 1920);
  // clock spinning backwards
  ctx.save(); ctx.translate(540, 1000); const r = 150; circle(ctx, 0, 0, r, 'rgba(255,255,255,.92)', O_, 8);
  for (let h = 0; h < 12; h++) { const a = h / 12 * 6.283; line(ctx, Math.sin(a) * r * .8, -Math.cos(a) * r * .8, Math.sin(a) * r * .92, -Math.cos(a) * r * .92, O_, 6); }
  const a1 = -(t - T.first) * 9, a2 = -(t - T.first) * .9; line(ctx, 0, 0, Math.sin(a1) * r * .75, -Math.cos(a1) * r * .75, O_, 8); line(ctx, 0, 0, Math.sin(a2) * r * .5, -Math.cos(a2) * r * .5, '#c23a2d', 12); circle(ctx, 0, 0, 12, O_);
  ctx.restore();
  otxt('⏪', 540, 1250, 130, '#ffffff', 0);
  vstamp('⏪ LAST NIGHT…', 540, 560, t, T.lastn - .3, T.voted + .2, 96, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S3 the shop ---------- */
const SHOP_ITEMS = [{ k: 'alarm', x: 610, p: '€8', sold: () => T.eight }, { k: 'sausages', x: 785, p: '€4', sold: () => T.four }, { k: 'flash', x: 950, p: '€6', sold: () => 1e9 }];
function shopItem(kind, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'alarm') { rrect(ctx, -46, -56, 92, 56, 10); ctx.fillStyle = '#d8dbe3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); circle(ctx, -18, -28, 12, '#2a2f40'); ctx.beginPath(); ctx.arc(22, -56, 22, Math.PI, 0); ctx.closePath(); ctx.fillStyle = '#d63a3a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  else if (kind === 'sausages') { for (let q = 0; q < 3; q++) { ctx.save(); ctx.translate(-30 + q * 30, -20 - (q % 2) * 6); ctx.rotate(-.9 + q * .1); rrect(ctx, -12, -34, 24, 68, 12); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
  else { ctx.rotate(-.25); rrect(ctx, -54, -36, 82, 30, 10); ctx.fillStyle = '#2e3340'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); poly(ctx, [[28, -44], [56, -52], [56, 10], [28, 2]], '#ffd23f', O_, 4); ellipse(ctx, 56, -21, 7, 31, '#fff6c8', O_, 3); }
  ctx.restore();
}
function priceTag(s, x, y, rot, a, col) { ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.translate(x, y); ctx.rotate(rot || .08); rrect(ctx, -46, -26, 92, 52, 12); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); otxt(s, 0, 2, 38, col || '#e23d3d', 0); ctx.restore(); }
function sceneShop(t) {
  sky('#a9d3f2', '#dcecf8', GROUND); forest(GROUND - 30, '#4c7d66', true, 11); snowGround(GROUND);
  // the shop
  const X0 = 110, X1 = 1030, top = 560;
  rrect(ctx, X0 + 30, top + 120, X1 - X0 - 60, GROUND - top - 120, 6); ctx.fillStyle = '#f3e3c3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#7a5636'; ctx.fillRect(X0 + 60, top + 300, X1 - X0 - 120, 14);
  for (let k = 0; k < 9; k++) { rrect(ctx, X0 + 90 + k * 88, top + 236, 62, 64, 8); ctx.fillStyle = ['#4da3ff', '#ff8a3d', '#3ddc84', '#b07cff', '#ffd23f', '#ff4d6d'][k % 6]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  for (let k = 0; k < 8; k++) { rrect(ctx, X0 + 110 + k * 98, top + 360, 70, 54, 8); ctx.fillStyle = ['#f6c9cf', '#cfe3f2', '#d7efd2', '#f7e27a'][k % 4]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  // awning
  const aw = (X1 - X0) / 8; for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e23d3d'; ctx.fillRect(X0 + k * aw, top + 30, aw, 92); ctx.beginPath(); ctx.arc(X0 + k * aw + aw / 2, top + 122, aw / 2, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.strokeRect(X0, top + 30, X1 - X0, 92);
  rrect(ctx, 420, top - 50, 240, 90, 20); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); otxt('SHOP', 540, top - 4, 62, '#1b1728', 0);
  // counter
  const cy = 1080; rrect(ctx, X0 + 10, cy, X1 - X0 - 20, GROUND - cy + 30, 8); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#a8743f'; ctx.fillRect(X0 + 10, cy, X1 - X0 - 20, 26); ctx.strokeRect(X0 + 10, cy, X1 - X0 - 20, 26);
  // items on the counter
  for (const it of SHOP_ITEMS) {
    const sold = it.sold(), gone = vprog(t, sold + .5, sold + .8), hi = (it.k === 'alarm' && vin(t, T.alarmw, T.eight)) || (it.k === 'sausages' && vin(t, T.sausw, T.four)) || (it.k === 'flash' && vin(t, T.nomoney, T.put));
    if (hi) { const g = ctx.createRadialGradient(it.x, cy - 40, 5, it.x, cy - 40, 120); g.addColorStop(0, 'rgba(255,230,120,.75)'); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(it.x - 130, cy - 170, 260, 260); }
    if (gone < 1) { ctx.save(); ctx.globalAlpha = 1 - gone; shopItem(it.k, it.x, cy + 4 - gone * 60, 1.5); ctx.restore(); }
    if (t < sold + .4) priceTag(it.p, it.x + 26, cy - 140, .1, 1, '#e23d3d');
    if (t >= sold && t < sold + 1.2) { const k = eBack(vprog(t, sold, sold + .25)); ctx.save(); ctx.translate(it.x, cy - 190); ctx.scale(k, k); ctx.rotate(-.12); panel(-92, -34, 184, 68, 16, '#3ddc84', '#fff', 4); otxt('SOLD ✓', 0, 2, 40, '#fff', 0); ctx.restore(); }
    if (it.k === 'flash' && t > T.nomoney) { const k = eBack(vprog(t, T.nomoney, T.nomoney + .3)); ctx.save(); ctx.translate(it.x, cy - 50); ctx.scale(k, k); ctx.strokeStyle = '#e23d3d'; ctx.lineWidth = 16; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-70, -70); ctx.lineTo(70, 70); ctx.moveTo(70, -70); ctx.lineTo(-70, 70); ctx.stroke(); ctx.restore(); }
  }
  // Benny walks in, buys, gets sad
  const wk = vprog(t, T.voted - .1, T.voted + 1.7), bx = lerp(-170, 330, ss(wk)), walking = wk > 0 && wk < 1;
  const bag = t > T.eight + .6;
  const mood = t > T.left ? 'sad' : t > T.eight ? 'happy' : 'hope', look = t > T.nomoney ? [1, -.1] : t > T.left ? [0, -1] : [1, .2];
  benny(bx, FEET, BS, { mood, walk: walking ? t * 10 : 0, look, talk: talkAt(t) });
  if (bag) { const k = eBack(vprog(t, T.eight + .6, T.eight + .9)); ctx.save(); ctx.translate(bx + 150, FEET + 4); ctx.scale(k, k);
    poly(ctx, [[-56, 0], [56, 0], [48, -130], [-48, -130]], '#c9a06a', O_, 5); poly(ctx, [[-48, -130], [48, -130], [40, -150], [-40, -150]], '#b48a55', O_, 4);
    if (t > T.eight + .6) { ctx.save(); ctx.translate(-12, -150); ctx.scale(.55, .55); shopItem('alarm', 0, 0, 1); ctx.restore(); }
    if (t > T.four + .6) { ctx.save(); ctx.translate(26, -150); ctx.rotate(.4); rrect(ctx, -10, -50, 20, 60, 10); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  // the bank
  const cents = t < T.eight ? 1410 : t < T.four ? lerp(1410, 610, ss(vprog(t, T.eight, T.eight + .5))) : lerp(610, 210, ss(vprog(t, T.four, T.four + .5)));
  const pulse = vin(t, T.two, T.two + .6) ? Math.sin(vprog(t, T.two, T.two + .6) * Math.PI) : 0;
  bankPanel(Math.round(cents), vprog(t, T.voted + .2, T.voted + .5), pulse);
  floatTxt('−€8', 830, 300, t, T.eight, '#ff4d6d', 70); floatTxt('−€4', 830, 300, t, T.four, '#ff4d6d', 70);
  vstamp('🚨 MOTION ALARM', 540, 462, t, T.alarmw - .1, T.sausw - .1, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🍖 SAUSAGES AS BAIT', 540, 462, t, T.sausw - .1, T.eight, 70, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('🔦 FLASHLIGHT? NO MONEY 😬', 540, 462, t, T.nomoney, T.put, 62, '#ff4d6d', -.02, 'rgba(10,12,26,.88)');
}
/* ---------- the van at dusk / night: shared outside set ---------- */
function nightSet(t, o) {   // o.d = 0 dusk .. 1 night, plate, step, alarm (0..1 visible), on
  const d = o.d;
  sky(mixc('#41507f', '#05070f', d), mixc('#f6a27a', '#141a33', d), GROUND);
  if (d > .5) for (let k = 0; k < 40; k++) circle(ctx, rnd(k + 70) * 1080, rnd(k + 90) * 900, 1.5 + rnd(k) * 2, `rgba(255,255,255,${(d - .5) * 1.6 * (.4 + .6 * rnd(k + 5))})`);
  if (o.moon) { circle(ctx, 820, 330, 64, `rgba(240,244,255,${o.moon})`); circle(ctx, 800, 315, 64, `rgba(10,14,30,${o.moon * .0})`); }
  forest(GROUND - 20, mixc('#355e4c', '#0b1612', d), mixc('#f2f6fb', '#3a4560', d), 5);
  snowGround(GROUND, mixc('#e2e8f3', '#2c3348', d));
  vanSide(VX, VY, VS, { dim: d, win: o.win || 0, doorOpen: o.door || 0, doorLight: o.doorLight || 0, snowRoof: true });
  if (o.step) sausage(STEP[0], STEP[1] - 10, .75, .1);
  if (o.plate) plate(PLATE[0], PLATE[1], 1.3, o.plate === 'full');
  alarmBox(ALARM[0], ALARM[1], 1.5, o.on, t, o.alarm == null ? 1 : o.alarm);
}
/* ---------- S4 setting the trap at dusk ---------- */
function sceneTrap(t) {
  const d = vprog(t, T.put - .2, T.bed + 1.0) * .85;
  const plateOn = t > T.one + .35, ak = eBack(vprog(t, T.put + .2, T.put + .5));
  nightSet(t, { d, plate: plateOn ? 'full' : null, step: plateOn, alarm: ak, on: false, win: vprog(t, T.bed + .2, T.bed + .8), door: vin(t, T.bed - .1, T.bed + 1.1) ? Math.sin(vprog(t, T.bed - .1, T.bed + 1.1) * Math.PI) : 0, doorLight: .8 });
  if (t > T.put + .2 && t < T.put + 1.2) { const k = vprog(t, T.put + .2, T.put + 1.2); ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; for (let q = 0; q < 8; q++) { const a = q / 8 * 6.283; line(ctx, ALARM[0] + Math.cos(a) * (40 + 40 * k), ALARM[1] + Math.sin(a) * (40 + 40 * k), ALARM[0] + Math.cos(a) * (60 + 60 * k), ALARM[1] + Math.sin(a) * (60 + 60 * k), '#ffd23f', 6); } ctx.restore(); }
  if (plateOn && t < T.one + 1.2) { const k = vprog(t, T.one + .35, T.one + 1.2); ctx.save(); ctx.globalAlpha = 1 - k; for (let q = 0; q < 8; q++) { const a = q / 8 * 6.283; line(ctx, PLATE[0] + Math.cos(a) * (70 + 30 * k), PLATE[1] - 10 + Math.sin(a) * (40 + 20 * k), PLATE[0] + Math.cos(a) * (90 + 40 * k), PLATE[1] - 10 + Math.sin(a) * (50 + 30 * k), '#ffd23f', 5); } ctx.restore(); }
  // Benny: stands by the van, then walks to the door and goes in
  const go = vprog(t, T.bed - .3, T.bed + .7), bx = lerp(280, DOOR[0] - 10, ss(go)), fade = vprog(t, T.bed + .45, T.bed + .8);
  if (fade < 1) { ctx.save(); ctx.globalAlpha = 1 - fade; benny(bx, FEET - go * 70, BS * (1 - go * .18), { mood: 'hope', walk: go > 0 && go < 1 ? t * 10 : 0, look: t > T.one ? [.8, .8] : [1, -.6], talk: talkAt(t) }); ctx.restore(); }
  vstamp('🚨 ALARM: ON', 540, 330, t, T.put + .3, T.one, 82, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🍖 THE BAIT', 540, 330, t, T.one + .2, T.bed, 82, '#ffd23f', .02, 'rgba(10,12,26,.88)');
}
/* ---------- inside the van (night + morning) ---------- */
function vanRoom(t, o) {
  const m = o.morning ? 1 : 0;
  ctx.fillStyle = mixc('#252c45', '#6d7fa8', m); ctx.fillRect(0, 0, 1080, 1920);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; ctx.fillRect(k * 120, 0, 120, 1920); }
  // window
  rrect(ctx, 250, 330, 580, 420, 22); ctx.fillStyle = '#c9ccd6'; ctx.fill();
  ctx.save(); rrect(ctx, 270, 350, 540, 380, 14); ctx.clip();
  const g = ctx.createLinearGradient(0, 350, 0, 730); g.addColorStop(0, mixc('#0d1430', '#9fd0f5', m)); g.addColorStop(1, mixc('#1a2347', '#ffe2b8', m)); ctx.fillStyle = g; ctx.fillRect(270, 350, 540, 380);
  if (m) { circle(ctx, 700, 520, 60, 'rgba(255,236,170,.95)'); ctx.fillStyle = '#f2f6fb'; ctx.fillRect(270, 640, 540, 90); for (let k = 0; k < 6; k++) pine(300 + k * 100, 650, 120, '#3f6e58', true); }
  else { for (let k = 0; k < 6; k++) pine(300 + k * 100, 690, 130, '#0c1714', '#38425c'); }
  if (o.red) { ctx.fillStyle = `rgba(255,40,40,${.75 * o.red})`; ctx.fillRect(270, 350, 540, 380); }
  snowfall(t, 30, m ? 'rgba(255,255,255,.9)' : 'rgba(200,210,240,.6)', .6);
  ctx.restore(); line(ctx, 540, 350, 540, 730, '#c9ccd6', 16);
  if (m) { ctx.save(); ctx.globalAlpha = .18; poly(ctx, [[270, 350], [810, 350], [1080, 1400], [120, 1400]], '#fff2c8'); ctx.restore(); }
  ctx.fillStyle = mixc('#3d2c22', '#7a5a42', m); ctx.fillRect(0, 1380, 1080, 540);
  rrect(ctx, 90, 1180, 900, 220, 40); ctx.fillStyle = mixc('#6c7080', '#a5a9b5', m); ctx.fill();
  rrect(ctx, 130, 1130, 240, 110, 40); ctx.fillStyle = mixc('#a9abb5', '#eeeef3', m); ctx.fill();
}
function blanket(by, m, shake) {
  ctx.save(); ctx.translate(shake || 0, 0);
  ctx.beginPath(); ctx.moveTo(140, 1400); ctx.lineTo(160, by + 20); ctx.quadraticCurveTo(540, by - 70, 920, by + 20); ctx.lineTo(940, 1400); ctx.closePath();
  ctx.fillStyle = mixc('#8a3a36', '#c9524c', m); ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); ctx.clip(); for (let k = 0; k < 9; k++) for (let j = 0; j < 5; j++) if ((k + j) % 2) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(140 + k * 90, by - 60 + j * 90, 90, 90); } ctx.restore();
  ctx.restore();
}
function clock(t, s, red) { ctx.save(); rrect(ctx, 830, 860, 210, 96, 16); ctx.fillStyle = '#10131f'; ctx.fill(); ctx.strokeStyle = '#4a5068'; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = '700 66px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = red ? '#ff4040' : '#5dff8a'; ctx.fillText(s, 935, 910); ctx.restore(); }
/* ---------- S5 can't sleep, 03:12, the alarm ---------- */
function sceneBed(t) {
  const al = t > T.alarm - .1, flash = al ? Math.pow(.5 + .5 * Math.sin((t - T.alarm) * 14), 2) : 0;
  const shake = al && t < T.alarm + 1.4 ? Math.sin(t * 90) * 10 * (1 - vprog(t, T.alarm, T.alarm + 1.4)) : 0;
  ctx.save(); ctx.translate(shake, shake * .6);
  vanRoom(t, { red: flash });
  clock(t, t < T.three ? (Math.floor(t * 2) % 2 ? '03:11' : '03 11') : '03:12', t >= T.three);
  if (t > T.three - .1 && t < T.three + 1.4) { const k = eBack(vprog(t, T.three - .1, T.three + .2)); ctx.save(); ctx.translate(935, 910); ctx.scale(1 + .3 * k * (1 - vprog(t, T.three + .2, T.three + 1.4)), 1 + .3 * k * (1 - vprog(t, T.three + .2, T.three + 1.4))); ctx.restore(); }
  const up = eBack(vprog(t, T.alarm, T.alarm + .35)), run = vprog(t, T.ran - .45, T.ran + .1);
  if (!al) { benny(540, 1400, 1.5, { pose: 'sit', mood: 'sad', look: [Math.sin(t * .8) * .6, -.8], blink: (t % 2.7) < .1 && !vin(t, T.three - .5, T.alarm), talk: talkAt(t) }); blanket(1235, 0); }
  else { blanket(1235 + up * 80, 0); benny(540 + run * 700, 1400 - up * 150, 1.5, { mood: 'surprised', armsUp: t < T.outthere + .4, look: [1, -.3], walk: run > 0 ? t * 14 : 0, talk: talkAt(t) }); }
  ctx.restore();
  if (al) { ctx.fillStyle = `rgba(255,30,30,${.28 * flash})`; ctx.fillRect(0, 0, 1080, 1920); }
  vstamp("CAN'T SLEEP… 👀", 540, 330, t, T.couldnt, T.three - .1, 78, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🚨🚨 ALARM 🚨🚨', 540, 330, t, T.alarm, T.ran, 90, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 pitch black outside, red flashes ---------- */
function kittenPathAt(t) {   // where the kitten is in the dark (eyes only)
  if (t < T.eyes - .3) return null;
  if (t < T.front - .1) { const k = ss(vprog(t, T.eyes - .3, T.eyes + .4)); return [lerp(880, 770, k), lerp(1215, 1250, k), lerp(.55, .7, k)]; }
  const k = eBack(vprog(t, T.front - .1, T.front + .35)); return [lerp(770, 660, k), lerp(1250, 1452, k), lerp(.7, 1.1, k)];
}
function sceneDark(t) {
  const zoom = 1 + .12 * vprog(t, T.ran, T.kitten);
  ctx.save(); zoomAbout(560, 1250, zoom);
  nightSet(t, { d: 1, plate: 'empty', step: true, on: true, alarm: 1 });
  const kp = kittenPathAt(t);
  const scared = t > T.gone - .2;
  benny(300, FEET, BS, { mood: scared ? 'surprised' : 'sad', look: t > T.front ? [1, .5] : t > T.gone ? [1, .8] : [.4, 0], talk: talkAt(t) });
  // darkness: only the red beacon flashes light things up
  const beat = Math.pow(Math.max(0, Math.sin((t - T.ran) * 2 * Math.PI * 1.25)), 5);
  const big = Math.max(...[T.gone].map(a => t >= a - .05 && t < a + .6 ? Math.sin(vprog(t, a - .05, a + .6) * Math.PI) : 0));
  const light = Math.max(beat * .55, big * .8);
  ctx.restore();
  ctx.fillStyle = `rgba(2,3,8,${.94 - .6 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = `rgba(255,30,30,${.22 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); zoomAbout(560, 1250, zoom);
  alarmBox(ALARM[0], ALARM[1], 1.5, true, t, 1);   // the beacon itself is always visible
  if (kp) kittenEyes(kp[0], kp[1], kp[2], vprog(t, T.eyes - .3, T.eyes + .1));
  ctx.restore();
  vstamp('PITCH BLACK…', 540, 330, t, T.pitch, T.noflash2, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🔦❌ NO FLASHLIGHT', 540, 330, t, T.noflash2, T.onlyred, 78, '#ffffff', .02, 'rgba(10,12,26,.9)');
  vstamp('THE SAUSAGE WAS GONE 😨', 540, 330, t, T.gone - .1, T.andthen, 70, '#ff4d6d', -.02, 'rgba(10,12,26,.9)');
  vstamp('👀', 540, 330, t, T.eyes - .1, T.kitten, 120, '#ffffff');
}
/* ---------- S7 it was a kitten ---------- */
function sceneKitten(t) {
  const zk = 1 + .22 * ss(vprog(t, T.tiny - .4, T.tiny + 1.2)) - .1 * ss(vprog(t, T.hungry - .2, T.hungry + 1));
  ctx.save(); zoomAbout(560, 1340, zk);
  nightSet(t, { d: 1, plate: 'empty', step: true, on: t < T.kitten + .8, alarm: 1, moon: vprog(t, T.kitten - .2, T.kitten + .6) });
  drawKitten(700, 1458, 1.4, { t, shiver: t < T.hungry + 1.5, sausage: true, look: t > T.hungry ? [-.8, -.6] : [-.4, .2], eyes: 'open' });
  benny(330, FEET + 6, BS, { pose: 'sit', mood: t > T.hungry ? 'sad' : 'hope', look: [1, .6], talk: talkAt(t) });
  if (t > T.hungry + .5) tear(330 + 24 * BS, FEET + 6 + (-132 - 56 + 30) * BS, 1.7, vprog(t, T.hungry + .5, T.likeme + .6));
  ctx.restore();
  const light = vprog(t, T.kitten - .15, T.kitten + .7);   // moonlight: the clouds open
  ctx.fillStyle = `rgba(4,6,16,${.94 - .62 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = `rgba(80,110,200,${.10 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  snowfall(t, 40, 'rgba(220,230,255,.65)', .5);
  vstamp('IT WAS A KITTEN 🥺', 540, 330, t, T.kitten + .1, T.mouth, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('…WITH MY SAUSAGE 🌭', 540, 330, t, T.mouth - .9, T.hungry, 72, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S8 taking her inside + the pigeon ---------- */
function pigeonAt(t) {
  const a = T.pigeon - .8, b = T.second + .1, c = T.classic - .1;
  if (t < a || t > c + .3) return null;
  if (t < b) { const k = ss(vprog(t, a, b)); return { x: lerp(1180, STEP[0] + 30, k), y: lerp(560, STEP[1] - 8, k) - Math.sin(k * Math.PI) * 60, flap: t * 26, face: -1, sausage: false }; }
  const k = ss(vprog(t, b + .15, c)); return { x: lerp(STEP[0] + 30, 1250, k), y: lerp(STEP[1] - 8, 420, k), flap: k > .05 ? t * 26 : 0, face: 1, sausage: true };
}
function sceneInside(t) {
  nightSet(t, { d: 1, plate: 'empty', step: t < T.second + .25, on: false, alarm: 1, moon: 1, win: .9, door: ss(vprog(t, T.took, T.took + .8)), doorLight: 1 });
  const go = vprog(t, T.took - .1, T.ofcourse), bx = lerp(330, 600, ss(go)), turned = t > T.pigeon - .2;
  benny(bx, FEET, BS, { mood: t > T.classic - .1 ? 'happy' : turned ? 'sad' : 'hope', walk: go > 0 && go < 1 ? t * 9 : 0, look: turned ? [.9, -.4] : [.6, 0], talk: talkAt(t) });
  drawKitten(bx + 6, FEET - 58 * BS, .78, { pose: 'held', t, look: turned ? [1, -.4] : [0, .3] });
  for (const sd of [-1, 1]) circle(ctx, bx + sd * 50, FEET - 66 * BS, 15 * BS, '#e8b896', O_, 5);
  const pg = pigeonAt(t); if (pg) drawPigeon(pg.x, pg.y, 1.25, pg.flap, pg.face, { sausage: pg.sausage });
  ctx.fillStyle = 'rgba(4,6,16,.34)'; ctx.fillRect(0, 0, 1080, 1920); ctx.fillStyle = 'rgba(80,110,200,.10)'; ctx.fillRect(0, 0, 1080, 1920);
  snowfall(t, 40, 'rgba(220,230,255,.65)', .5);
  vstamp('THE PIGEON 😤', 540, 330, t, T.pigeon - .1, T.classic - .1, 92, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('CLASSIC. 🙄', 540, 330, t, T.classic - .1, T.morning, 92, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S9 the morning: kitten on his chest → RENT DAY ---------- */
function sceneMorning(t) {
  vanRoom(t, { morning: true });
  const wake = t > T.remember - .1, jump = eBack(vprog(t, T.rent2 - .1, T.rent2 + .3));
  if (!(t > T.rent2 - .1)) {
    benny(540, 1400, 1.5, { pose: 'sit', mood: wake ? 'surprised' : 'hope', blink: !wake, look: [0, 0], talk: talkAt(t) }); blanket(1235, 1);
    drawKitten(560, 1262, .8, { pose: 'curl', t });
    if (!wake) for (let q = 0; q < 3; q++) { const ph = (t * .6 + q / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); otxt('z', 640 + ph * 60 + q * 8, 1120 - ph * 120, 40 + q * 8, '#ffffff', 5); ctx.restore(); }
  } else {
    for (let k = 0; k < 22; k++) { const q = vprog(t, T.rent2, T.rent2 + 1.5), a = -Math.PI * (.1 + .8 * rnd(k)), d = 200 + q * (260 + rnd(k + 3) * 420); if (q > 0 && q < 1) coin(470 + Math.cos(a) * d, 1000 + Math.sin(a) * d * .8 + q * q * 260, 20, 1 - q); }
    blanket(1315, 1); drawKitten(760, 1300, .8, { t, look: [-1, -.6] });
    benny(470, 1400 - jump * 120 - Math.abs(Math.sin((t - T.rent2) * 6)) * 30, 1.5, { mood: 'happy', armsUp: true, talk: talkAt(t) });
  }
  vstamp('☀️ THE NEXT MORNING', 540, 330, t, T.morning + .1, T.remember - .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  if (t > T.rent2 - .1) { const k = eBack(vprog(t, T.rent2 - .1, T.rent2 + .25)), p = 1 + .05 * Math.sin(t * 7); ctx.save(); ctx.translate(540, 360); ctx.scale(k * p, k * p);
    const g = ctx.createLinearGradient(-430, 0, 430, 0); g.addColorStop(0, '#ffb703'); g.addColorStop(1, '#ffd23f'); rrect(ctx, -440, -100, 880, 200, 50); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke();
    otxt('💰 RENT DAY 💰', 0, 4, 120, '#1b1728', 0); ctx.restore(); }
}
/* ---------- S11 never had this much money ---------- */
function sceneRich(t) {
  dayScene(t, {});
  for (let k = 0; k < 26; k++) { const x = 520 + (k % 7) * 34 - Math.floor(k / 7) * 17 + Math.floor(k / 7) * 0, y = FEET + 6 - Math.floor(k / 7) * 20; coin(x - 40 + Math.floor(k / 7) * 17, y, 22); }
  drawKitten(720, FEET + 8, .9, { t, look: [-1, -.7] });
  benny(330, FEET, BS, { mood: 'happy', armsUp: Math.sin(t * 3) > .3, look: [0, 0], talk: talkAt(t) });
  tear(330 - 24 * BS, FEET + (-140 - 56 + 30) * BS, 1.2, vprog(t, T.never + .3, T.life + .4));
  tear(330 + 24 * BS, FEET + (-140 - 56 + 30) * BS, 1.2, vprog(t, T.never + .9, T.life + .6));
  bankPanel(58320, 1, 0, 'RENT DAY 💰');
  for (let k = 0; k < 18; k++) { const ph = (t * .7 + rnd(k)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', rnd(k + 9) * 1080, 600 + rnd(k + 5) * 900 - ph * 80, 40); ctx.restore(); }
}
/* ---------- S14 the decision + poll ---------- */
function sceneDecide(t) {
  dayScene(t, {});
  drawKitten(150, FEET + 8, .9, { t, look: t > T.kneeds ? [0, .2] : [1, -.6] });
  if (t > T.kneeds) { const k = eBack(vprog(t, T.kneeds, T.kneeds + .35)); ctx.save(); ctx.translate(120, FEET + 60); ctx.scale(k, k); ellipse(ctx, 0, -14, 70, 26, '#c95d8b', O_, 5); ellipse(ctx, 0, -20, 50, 14, '#f7c8d8'); ctx.restore();
    ctx.save(); ctx.translate(250, FEET + 64); ctx.scale(k, k); ellipse(ctx, 0, -10, 34, 14, '#4da3ff', O_, 4); ctx.restore(); }
  benny(400, FEET, BS, { mood: 'happy', armsUp: vin(t, T.real - .2, T.fix - .3), look: t > T.fix ? [1, -.4] : [-.2, 0], talk: talkAt(t) });
  bankPanel(58320, vprog(t, T.so, T.so + .3) * (1 - vprog(t, T.vote - .2, T.vote + .1)), 0);
  const bub = (s, x, y, t0) => { if (t < t0 || t > T.vote) return; const k = eBack(vprog(t, t0, t0 + .3)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = F(46); const w = ctx.measureText(s).width + 70; panel(-w / 2, -54, w, 108, 40, 'rgba(10,12,26,.92)', '#ffd23f', 4); otxt(s, 0, 2, 46, '#ffffff', 0); ctx.restore(); };
  bub('🔧 Van €250', 790, 850, T.fix - .1); bub('🏠 Cabin €320', 270, 700, T.cabin); bub('🐱 Kitten €60', 230, 1170, T.kneeds);
  vstamp('💸 REAL MONEY!', 540, 560, t, T.real - .2, T.fix - .2, 84, '#46e08a', -.02, 'rgba(10,12,26,.88)');
}
function pollCard(t) {
  if (t < T.vote) return; const k = eBack(vprog(t, T.vote, T.vote + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.vote, T.vote + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 720); ctx.scale(k, k);
  panel(-460, -330, 920, 660, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT DO I BUY', 0, -255, 60, '#ffd23f', 8); otxt('WITH THE RENT? 💰', 0, -188, 56, '#ffd23f', 8);
  [['🔧', 'Fix the van', '€250'], ['🏠', 'Wooden cabin', '€320'], ['🐱', 'Kitten starter pack', '€60']].forEach(([e, s, p], i) => { const y = -75 + i * 120, kk = eBack(vprog(t, T.vote + .3 + i * .18, T.vote + .6 + i * .18));
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk); panel(-410, -48, 820, 96, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 52); txt(s, -300, 2, 44, '#ffffff', 'left', 'middle'); txt(p, 380, 2, 44, '#46e08a', 'right', 'middle'); ctx.restore(); });
  txt('Vote in the poll 👇  ·  top 2 get bought', 0, 290, 34, '#c3c9e4', 'center', 'middle'); ctx.restore();
  if (t >= T.name - .1) { const kk = eBack(vprog(t, T.name - .1, T.name + .2)); ctx.save(); ctx.translate(540, 1160); ctx.scale(kk, kk); panel(-420, -58, 840, 116, 40, '#ffd23f', '#fff', 5); otxt('🐱 NAME HER IN THE COMMENTS 👇', 0, 2, 46, '#1b1728', 0); ctx.restore(); }
  if (t >= T.end + .3) { const kk = eBack(vprog(t, T.end + .3, T.end + .6)); ctx.save(); ctx.translate(540, 1420); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
/* ======================= MAP SCENES ======================= */
function mapBase(t, hash) { setHash(hash); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920); }
function mapRent(t) {
  for (const h of P.newest) h.bt = 0;
  const k = ss(vprog(t, T.five - .2, T.look + .8)), [bx, by] = isoW(BHOME[0], BHOME[1]);
  camXY(lerp(bx, P.oldB.c[0], k), lerp(by - 30, P.oldB.c[1], k), Math.exp(lerp(Math.log(.95), Math.log(P.oldZ * 1.6), k)));
  mapBase(t, 'hour=11.5&weather=clear');
  withCtx(OC, () => {
    const N = P.rentH.length, a = T.five - .3, span = (T.amount - .1) - a; let drawn = 0;
    for (let i = 0; i < N && drawn < 320; i++) {
      const t0 = a + (i / N) * span; if (t < t0 || t > t0 + 1.25) continue;
      const h = P.rentH[i], [sx, sy] = uvS(h.i, h.j); if (sx < -80 || sx > 1160 || sy < -80 || sy > 2000) continue;
      const q = (t - t0) / 1.25, y0 = sy - 40 * cam.z, rise = Math.min(1, q / .28);
      const fx = q < .28 ? sx : lerp(sx, 540, ss((q - .28) / .72)), fy = q < .28 ? y0 - 70 * rise : lerp(y0 - 70, 300, ss((q - .28) / .72));
      coin(fx, fy, Math.max(8, 17 * Math.min(1, cam.z * 1.5)), q > .9 ? (1 - q) * 10 : 1);
      if (i < 60 && q < .55) { ctx.save(); ctx.globalAlpha = 1 - q / .55; otxt('+10¢', sx, sy - 115 * cam.z - q * 70, 36, '#46e08a', 6, '#06070f'); ctx.restore(); }
      drawn++;
    }
    const v = Math.round(lerp(210, 58320, ss(vprog(t, T.five, T.amount + .35)))), pulse = vin(t, T.amount + .2, T.amount + 1.1) ? Math.sin(vprog(t, T.amount + .2, T.amount + 1.1) * Math.PI) : 0;
    if (t > T.amount + .2) for (let q = 0; q < 30; q++) { const f = vprog(t, T.amount + .2, T.amount + 1.8), a2 = rnd(q) * 6.283, d = f * (160 + rnd(q + 4) * 300); ctx.save(); ctx.globalAlpha = 1 - f; emoji(ctx, q % 2 ? '✨' : '💰', 540 + Math.cos(a2) * d, 300 + Math.sin(a2) * d * .6, 44); ctx.restore(); }
    bankPanel(v, vprog(t, T.five - .3, T.five), pulse, '5,778 × 10¢');
    vstamp('🏘️ 5,778 NEIGHBORS', 540, 560, t, T.five, T.each - .2, 76, '#ffffff', -.02, 'rgba(10,12,26,.88)');
    vstamp('× 10¢ EACH 🪙', 540, 560, t, T.each - .2, T.look, 80, '#46e08a', .02, 'rgba(10,12,26,.88)');
    vstamp('LOOK AT THE BANK 👆', 540, 560, t, T.look, T.amount + .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
    vstamp('🤯 €583.20!', 540, 560, t, T.amount + .2, T.never, 104, '#ffd23f', .02, 'rgba(10,12,26,.9)');
  });
}
function mapNew(t) {
  P.newest.forEach((h, k) => { h.bt = 500 + T.newn + .15 + k * .085; });
  const k = vprog(t, T.newn - .2, T.oh), [cx, cy] = P.newB.c;
  camXY(cx, cy - 20, P.newZ * (1 + .1 * ss(k)));
  mapBase(t, 'hour=12&weather=clear');
  withCtx(OC, () => {
    const z = cam.z; ctx.save();
    P.newest.forEach((h, q) => { const tp = T.newn + .15 + q * .085; if (t < tp) return; const [sx, sy] = uvS(h.i, h.j), ph = ((t - tp) * 1.3) % 1, a = (1 - ph) * .9;
      ctx.strokeStyle = `rgba(255,210,63,${a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 14 + 50 * ph, (14 + 50 * ph) * .55, 0, 0, 6.29); ctx.stroke(); });
    ctx.restore();
    let n = 0; for (let q = P.newest.length - 1; q >= 0 && n < 7; q--) { const h = P.newest[q], tp = T.newn + .6 + q * .085; if (t < tp) continue; const [sx, sy] = uvS(h.i, h.j); if (sx < 120 || sx > 960 || sy < 420 || sy > 1500) continue;
      const kk = eBack(vprog(t, tp, tp + .3)); ctx.save(); ctx.translate(sx, sy - 120 * z); ctx.scale(2.3 * kk, 2.3 * kk); tag(0, 0, '@' + (h.name.length > 15 ? h.name.slice(0, 14) + '…' : h.name), '#3ddc84', 1); ctx.restore(); n++; }
    vstamp('+33 NEW NEIGHBORS 🏠', 540, 330, t, T.newn + .1, T.welcome, 82, '#ffffff', -.02, '#ff2e63');
    vstamp('WELCOME TO THE TOWN! 👋', 540, 330, t, T.welcome, T.houses, 74, '#ffd23f', .02, 'rgba(10,12,26,.88)');
    vstamp('YOUR HOUSE IS WAITING 🏠', 540, 330, t, T.houses, T.oh, 72, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  });
}
function mapTreasure(t) {
  for (const h of P.newest) h.bt = 0;
  const k = vprog(t, T.oh - .1, T.so);
  camXY(P.townB.c[0] + 60 * k, P.townB.c[1] - 20 * k, P.townZ * (1.0 + .08 * k));
  mapBase(t, 'hour=13&weather=clear');
  withCtx(OC, () => {
    const p = 1 + .08 * Math.sin(t * 5), kk = eBack(vprog(t, T.oh, T.oh + .4)); ctx.save(); ctx.translate(540, 980); ctx.scale(kk * p, kk * p);
    circle(ctx, 0, 0, 120, 'rgba(10,12,26,.82)', '#ffd23f', 8); otxt('?', 0, 6, 160, '#ffd23f', 0); ctx.restore();
    vstamp("💰 TODAY'S TINY TREASURE", 540, 330, t, T.oh + .1, T.nohints, 70, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
    vstamp('🚶 ONLY IN 3D · NO HINTS 🤫', 540, 330, t, T.nohints, T.so, 68, '#ffffff', .02, 'rgba(10,12,26,.88)');
  });
}
/* ======================= MASTER ======================= */
const SCENES = [
  ['hook', 0], ['rewind', T.first], ['shop', T.voted], ['trap', T.put - .15], ['bed', T.couldnt - .35], ['dark', T.ran + .15], ['kitten', T.kitten - .15],
  ['inside', T.took - .1], ['morning', T.morning - .2], ['rent', T.five - .3], ['rich', T.never - .1], ['new', T.newn - .15], ['treasure', T.oh - .1], ['decide', T.so - .1]];
const FADES = [T.couldnt - .35, T.morning - .2];
const FLASHES = [T.voted, T.put - .15, T.ran + .15, T.five - .3, T.never - .1, T.newn - .15, T.oh - .1, T.so - .1];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'rent') mapRent(t); else if (sc === 'new') mapNew(t); else if (sc === 'treasure') mapTreasure(t);
  else withCtx(OC, () => ({ hook: sceneHook, rewind: sceneRewind, shop: sceneShop, trap: sceneTrap, bed: sceneBed, dark: sceneDark, kitten: sceneKitten, inside: sceneInside, morning: sceneMorning, rich: sceneRich, decide: sceneDecide })[sc](t));
  withCtx(OC, () => {
    pollCard(t);
    if (t < T.vote) vCaption(t);
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    for (const c of FADES) if (Math.abs(t - c) < .35) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.abs(t - c) / .35})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, 1080, 1920); }
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
    const box = townsBox(); P.boxC = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]; P.fitZ = fitZoom();
    P.newest = HOUSES.slice(-N_NEW); const c = P.newest.reduce((a, h) => [a[0] + h.i, a[1] + h.j], [0, 0]); P.newC = isoW(c[0] / P.newest.length, c[1] / P.newest.length);
    const bbox = L => { let mn = [1e9, 1e9], mx = [-1e9, -1e9]; for (const h of L) { const [x, y] = isoW(h.i, h.j); mn = [Math.min(mn[0], x), Math.min(mn[1], y)]; mx = [Math.max(mx[0], x), Math.max(mx[1], y)]; } return { c: [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2], w: mx[0] - mn[0], h: mx[1] - mn[1] }; };
    P.oldB = bbox(HOUSES.filter(h => h.town === 1)); P.oldZ = Math.min(1000 / P.oldB.w, 1350 / P.oldB.h);
    P.townB = bbox(HOUSES); P.townZ = Math.min(1000 / P.townB.w, 1300 / P.townB.h);
    { const pts = P.newest.map(h => isoW(h.i, h.j)); let best = -1, bc = pts[0];
      for (const p of pts) { const near = pts.filter(q => Math.abs(q[0] - p[0]) < 1500 && Math.abs(q[1] - p[1]) < 1900); if (near.length > best) { best = near.length; bc = [near.reduce((s, q) => s + q[0], 0) / near.length, near.reduce((s, q) => s + q[1], 0) / near.length]; } }
      P.newB = { c: bc, n: best }; P.newZ = .42; }
    P.rentH = HOUSES.map(h => [Math.hypot(h.i - BHOME[0], h.j - BHOME[1]), h]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    return JSON.stringify({ n: HOUSES.length, fitZ: P.fitZ, townB: P.townB, townZ: P.townZ, newB: P.newB, newZ: P.newZ, oldZ: P.oldZ, oldB: P.oldB, last: HOUSES[HOUSES.length - 1].name });
  },
  frame,
};
})();
