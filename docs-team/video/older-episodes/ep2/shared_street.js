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

