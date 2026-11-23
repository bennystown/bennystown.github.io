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
