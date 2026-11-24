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
