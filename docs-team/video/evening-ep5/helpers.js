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

