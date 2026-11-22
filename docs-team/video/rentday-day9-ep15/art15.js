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
