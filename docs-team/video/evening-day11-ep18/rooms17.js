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
