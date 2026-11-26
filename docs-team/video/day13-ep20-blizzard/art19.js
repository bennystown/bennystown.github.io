/* the BIG bed (side view): headboard left */
function realBed(x, y, s, k) { k = k == null ? 1 : k; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ellipse(ctx, 0, 6, 300, 22, 'rgba(0,0,0,.2)');
  const a = (q) => clamp((k - q) / .25, 0, 1);
  if (a(0) > 0) { ctx.globalAlpha = a(0); rrect(ctx, -280, -90, 560, 70, 14); ctx.fillStyle = '#9a6538'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); for (const lx of [-260, 250]) { rrect(ctx, lx, -30, 24, 34, 6); ctx.fill(); ctx.stroke(); } }
  if (a(.25) > 0) { ctx.globalAlpha = a(.25); rrect(ctx, -300, -300, 50, 300, 14); ctx.fillStyle = '#8a5530'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); rrect(ctx, 250, -180, 40, 180, 12); ctx.fill(); ctx.stroke(); }
  if (a(.5) > 0) { ctx.globalAlpha = a(.5); rrect(ctx, -260, -150, 520, 70, 26); ctx.fillStyle = '#fff7ea'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); }
  if (a(.75) > 0) { ctx.globalAlpha = a(.75); rrect(ctx, -250, -200, 130, 64, 28); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); }
  ctx.restore(); }
function blanket(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-120, -150); ctx.quadraticCurveTo(60, -200, 270, -150); ctx.lineTo(270, -70); ctx.lineTo(-120, -70); ctx.closePath(); ctx.fillStyle = '#4d7fe0'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); for (let q = 0; q < 5; q++) line(ctx, -80 + q * 75, -170 + Math.abs(q - 2) * 4, -80 + q * 75, -76, 'rgba(255,255,255,.35)', 6); ctx.restore(); }
/* a HUGE cat tower: 3 floors, hammock, little house on top. Returns the house-door position. */
function bigTower(x, y, s, t, o) { o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  const post = (px, y0, y1) => { rrect(ctx, px - 34, y1, 68, y0 - y1, 10); ctx.fillStyle = '#d9b77d'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); for (let yy = y1 + 12; yy < y0 - 4; yy += 16) line(ctx, px - 32, yy, px + 32, yy + 6, 'rgba(120,80,40,.5)', 4); };
  const pad = (px, py, w) => { rrect(ctx, px - w / 2, py - 30, w, 44, 16); ctx.fillStyle = '#c95d8b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); };
  ellipse(ctx, 0, 6, 300, 26, 'rgba(0,0,0,.22)');
  rrect(ctx, -280, -50, 560, 56, 18); ctx.fillStyle = '#c95d8b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke();
  post(-150, -40, -290); post(150, -40, -470); post(-70, -300, -640); post(100, -480, -760);
  pad(-150, -290, 290); pad(150, -470, 280); pad(-20, -640, 320);
  // hammock between floors 1 and 2
  ctx.beginPath(); ctx.moveTo(-40, -380); ctx.quadraticCurveTo(40, -300, 110, -370); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.fillStyle = '#f2a3b3'; ctx.lineTo(110, -380); ctx.quadraticCurveTo(40, -330, -40, -390); ctx.closePath(); ctx.fill(); ctx.stroke();
  line(ctx, -40, -385, -60, -300, O_, 3); line(ctx, 110, -375, 110, -470, O_, 3);
  // dangling toy
  const sw = Math.sin(t * 3) * .3; ctx.save(); ctx.translate(-120, -290 + 8); ctx.rotate(sw); line(ctx, 0, 0, 0, 80, O_, 3); circle(ctx, 0, 92, 16, '#ffd23f', O_, 3.5); ctx.restore();
  // little house on top
  rrect(ctx, -60, -900, 300, 170, 16); ctx.fillStyle = '#a44a72'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 7; ctx.stroke();
  poly(ctx, [[-85, -896], [90, -1000], [265, -896]], '#7a2f55', O_, 7);
  ellipse(ctx, 90, -808, 56, 56, '#2a1020', O_, 5);
  ctx.restore(); return [x + 90 * s, y - 808 * s];
}
function eyesIn(x, y, s, t) { const bl = (t % 3.3) < .14; for (const sd of [-1, 1]) { if (bl) line(ctx, x + sd * 16 * s - 8 * s, y, x + sd * 16 * s + 8 * s, y, '#c9e86a', 4 * s); else { ellipse(ctx, x + sd * 16 * s, y, 9 * s, 11 * s, '#c9e86a'); ellipse(ctx, x + sd * 16 * s, y, 3.5 * s, 8 * s, '#111'); } } }
