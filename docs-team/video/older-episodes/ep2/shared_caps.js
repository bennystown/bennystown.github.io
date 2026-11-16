let CAPS = [];
function drawCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const sz = 66, maxW = 940, y0 = 1000;
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
