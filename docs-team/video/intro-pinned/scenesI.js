/* ======================= INTRO (pinned) — how Benny's Town works ======================= */
const GROUND = 1250, FEET = 1440;
function bgDay(t, o) {   // snowy forest + sky (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#9cc9ee', '#3b4a7a', d), mixc('#e3f0fa', '#f6a27a', d), GROUND);
  if (d < .5) circle(ctx, 880, 300, 70, `rgba(255,240,180,${.9 * (1 - d * 2)})`);
  forest(GROUND - 20, mixc('#3f6e58', '#2a4a3c', d), true, o.seed || 3);
  snowGround(GROUND, mixc('#eef3fa', '#d9dfee', d));
}
function mapAt(t, x, y, z, hash) { camXY(x, y, z); setHash(hash || 'hour=13&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920); }
function cup(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly(ctx, [[-30, -70], [30, -70], [22, 0], [-22, 0]], '#e9e2d0', O_, 4); line(ctx, -26, -52, 26, -52, '#c0392b', 6); ctx.restore(); }
/* ---------- A / C: alone in the snow ---------- */
function sceneAlone(t, o) {
  bgDay(t, { dusk: o.dusk, seed: 5 }); snowfall(t, 120, 'rgba(255,255,255,.9)', .6);
  ctx.fillStyle = 'rgba(30,40,70,.18)'; ctx.fillRect(0, 0, 1080, 1920);
  benny(520, FEET, 1.45, { pose: 'sit', mood: 'sad', look: [0, .4], talk: talkAt(t) }); cup(700, FEET - 6, 1.1);
  if (o.cold) for (let q = 0; q < 3; q++) { const ph = (t * .6 + q / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * .6; circle(ctx, 560 + ph * 40, 1060 - ph * 90, 14 + ph * 20, 'rgba(255,255,255,.8)'); ctx.restore(); }
}
function sceneA(t) {
  sceneAlone(t, { dusk: .35, cold: true });
  vstamp('NOT LONG AGO…', 540, 330, t, .1, T.now, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('€0.00 🥶', 540, 470, t, 1.6, T.now, 80, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
}
function sceneC(t) {
  sceneAlone(t, { dusk: .5, cold: true });
  vstamp('🥶 ALONE IN THE SNOW', 540, 330, t, T.started + .5, T.someone - .25, 72, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('NO HOME · NO MONEY', 540, 470, t, T.nomoney - 1.6, T.someone - .25, 66, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
}
/* ---------- B: today, the whole town ---------- */
function sceneB(t) {
  const k = ss(vprog(t, T.now - .1, T.started)), [bx, by] = isoW(3, 3);
  mapAt(t, bx, by, Math.exp(lerp(Math.log(2.2), Math.log(.2), k)));
  withCtx(OC, () => {
    vstamp('NOW 👇', 540, 330, t, T.now - .1, T.started, 90, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    if (t > 5.9) { const kk = eBack(vprog(t, 5.9, 6.3)); ctx.save(); ctx.translate(540, 520); ctx.scale(kk, kk); panel(-420, -90, 840, 180, 50, 'rgba(10,12,26,.93)', '#ffd23f', 6); otxt(Math.round(lerp(0, P.N, ss(vprog(t, 5.9, 7.2)))).toLocaleString('en-US') + ' 🏠', 0, 6, 104, '#46e08a', 10); ctx.restore(); }
  });
}
/* ---------- D: first house → 10 → hundreds ---------- */
function sceneD(t) {
  const h = P.first, [hx, hy] = isoW(h.i, h.j), a = T.someone - .25;
  const k = ss(vprog(t, T.ten - .2, T.how - .3));
  mapAt(t, lerp(hx, hx, k), lerp(hy - 20, hy, k), Math.exp(lerp(Math.log(2.6), Math.log(.32), k)));
  withCtx(OC, () => {
    if (t > T.name - .2 && t < T.ten) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.name - .2, T.name + .1)); ctx.save(); ctx.translate(sx, sy - 120 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '@' + h.name, '#ffd23f', 1); ctx.restore(); }
    const n = t < T.ten - .1 ? 1 : t < T.hundreds - .1 ? 10 : Math.round(lerp(100, 900, vprog(t, T.hundreds, T.how - .3)));
    const kk = eBack(vprog(t, a + .1, a + .4)); ctx.save(); ctx.translate(540, 330); ctx.scale(kk, kk); panel(-300, -80, 600, 160, 44, 'rgba(10,12,26,.93)', '#ffd23f', 6);
    otxt((n >= 900 ? '900+' : n) + ' 🏠', 0, 4, 96, '#ffffff', 10); ctx.restore();
    vstamp('FOLLOW = A HOUSE 🏠', 540, 500, t, T.someone + .3, T.name - .2, 64, '#ffd23f', .02, 'rgba(10,12,26,.9)');
    vstamp('…WITH YOUR NAME ON IT', 540, 500, t, T.name - .2, T.ten - .1, 60, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- E: how it works ---------- */
const RULES = [['🏠', 'FOLLOW = A HOUSE', 'follow'], ['🪙', '10¢ · SUNDAY RENT DAY', 'cents'], ['🗳️', 'YOU VOTE WHAT I BUY', 'vote']];
function sceneE(t) {
  bgDay(t, { seed: 2 });
  benny(540, FEET + 40, 1.3, { mood: 'happy', look: [0, -.4], talk: talkAt(t), wave: vin(t, T.how, T.follow) });
  if (t > T.cents + .4) for (let q = 0; q < 10; q++) { const ph = ((t - T.cents) * .7 + rnd(q)) % 1; coin(120 + rnd(q + 4) * 840, 160 + ph * 1100, 22, Math.sin(ph * Math.PI)); }
  vstamp('📋 HOW IT WORKS', 540, 260, t, T.how - .1, T.sofar - .3, 84, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
  RULES.forEach(([e, s, key], i) => { const t0 = T[key] - .15; if (t < t0) return; const k = eBack(vprog(t, t0, t0 + .3)), y = 460 + i * 170;
    ctx.save(); ctx.translate(540, y); ctx.scale(k, k); panel(-480, -72, 960, 144, 40, 'rgba(10,12,26,.93)', i === 2 ? '#46e08a' : 'rgba(255,255,255,.3)', 4);
    circle(ctx, -390, 0, 46, '#ffd23f', O_, 4); txt(String(i + 1), -390, 3, 50, O_, 'center', 'middle'); emoji(ctx, e, -300, 2, 60);
    otxt(s, 70, 4, fitSize(s, 64, 660), '#ffffff', 8); ctx.restore(); });
}
/* ---------- F: what we bought so far (quick cuts) ---------- */
function tentSide(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 6, 260, 20, 'rgba(0,0,0,.2)');
  poly(ctx, [[-240, 0], [0, -260], [240, 0]], '#e8743b', O_, 7); poly(ctx, [[-60, 0], [0, -150], [60, 0]], '#7a3517', O_, 5); line(ctx, 0, -260, 0, -300, O_, 6); poly(ctx, [[0, -300], [50, -285], [0, -270]], '#ffd23f', O_, 3); ctx.restore(); }
function polaroid(t, t0, label, f) {
  const k = eBack(vprog(t, t0 - .1, t0 + .2)); ctx.fillStyle = '#2a2140'; ctx.fillRect(0, 0, 1080, 1920);
  for (let q = 0; q < 30; q++) circle(ctx, rnd(q) * 1080, rnd(q + 3) * 1920, 3, 'rgba(255,255,255,.18)');
  ctx.save(); ctx.translate(540, 900); ctx.rotate((rnd(t0) - .5) * .12); ctx.scale(.6 + .4 * k, .6 + .4 * k);
  rrect(ctx, -440, -520, 880, 1040, 18); ctx.fillStyle = '#fbf8f0'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 4; ctx.stroke();
  ctx.save(); rrect(ctx, -400, -480, 800, 780, 8); ctx.clip(); ctx.translate(0, -90); ctx.scale(800 / 1080, 800 / 1080); ctx.translate(-540, -1150); f(); ctx.restore();
  txt(label, 0, 400, 72, '#1b1728', 'center', 'middle'); ctx.restore();
}
function sceneF(t) {
  const cut = [['tent', T.tent - .25], ['van', T.van - .2], ['heater', T.heater - .2], ['kitten', T.kitten - .2], ['cabin', T.cabin - .2], ['pigeon', T.pigeon - .2]];
  let c = cut[0]; for (const q of cut) if (t >= q[1]) c = q;
  if (t < T.tent - .25) { bgDay(t, { seed: 9 }); benny(540, FEET, 1.4, { mood: 'happy', armsUp: true, talk: talkAt(t) }); vstamp('🛒 SO FAR YOU BOUGHT…', 540, 330, t, T.sofar - .1, T.tent, 70, '#ffd23f', -.02, 'rgba(10,12,26,.92)'); return; }
  const [n, t0] = c;
  if (n === 'tent') polaroid(t, t0, '⛺ a tent', () => { bgDay(t, { seed: 4 }); tentSide(540, 1300, 1.2); });
  else if (n === 'van') polaroid(t, t0, '🚐 a van (no tires)', () => { bgDay(t, { seed: 6 }); vanSide(380, 1300, .9, { snowRoof: true }); for (const wx of [90, 470]) { ctx.save(); ctx.translate(380 + wx * .9, 1300); emoji(ctx, '❌', 0, -30, 60); ctx.restore(); } });
  else if (n === 'heater') polaroid(t, t0, '🔥 a heater', () => { cabinRoomNoWin(t); heater(540, 1300, 1.6, 1, t); });
  else if (n === 'kitten') polaroid(t, t0, t < T.mittens - .1 ? '🐱 a kitten…' : '🧤 …MITTENS!', () => { bgDay(t, { dusk: .3, seed: 8 }); snowfall(t, 80, 'rgba(255,255,255,.9)', .5); drawKitten(540, 1320, 2.2, { t, look: [0, -.3] }); });
  else if (n === 'cabin') polaroid(t, t0, '🏡 a real cabin', () => { bgDay(t, { seed: 7 }); ellipse(ctx, 540, GROUND + 100, 460, 60, '#5aa868', '#3f8a4e', 4); cabinSide(540, GROUND + 100, .95, 1, t); });
  else polaroid(t, t0, '🕊️ + 1 free pigeon', () => { bgDay(t, { seed: 7 }); ellipse(ctx, 540, GROUND + 100, 460, 60, '#5aa868', '#3f8a4e', 4); cabinSide(540, GROUND + 100, .95, 1, t); drawPigeon(540, GROUND + 100 - 545 * .95, 1.6, 0, -1); });
}
function cabinRoomNoWin(t) { ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, 1080, 1920); for (let q = 0; q < 26; q++) { const y = q * 56; rrect(ctx, -20, y, 1120, 54, 27); ctx.fillStyle = q % 2 ? '#8a5c34' : '#7d5230'; ctx.fill(); } ctx.fillStyle = '#4a3020'; ctx.fillRect(0, 1320, 1080, 600); const g = ctx.createRadialGradient(540, 1150, 60, 540, 1150, 700); g.addColorStop(0, 'rgba(255,170,90,.35)'); g.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
/* ---------- G: loyalty — one house grows ---------- */
const TIERS = [['t1', '3 DAYS', '🌷 Flowers'], ['t2', '1 WEEK', '🏡 Fence + tree'], ['t3', '2 WEEKS', '💡 Lantern + bench'], ['t4', '1 MONTH', '⭐ 2nd floor'], ['t5', '3 MONTHS', '🏊 Pool'], ['t6', '6 MONTHS', '✨ Golden roof'], ['t7', '1 YEAR', '🗿 Your statue']];
function grownHouse(x, y, s, n, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  const fl = n >= 4 ? 1 : 0, H = 220 + fl * 180, roofY = -H;
  if (n >= 5) { rrect(ctx, 250, -10, 300, 40, 18); ctx.fillStyle = '#4dc3ff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); line(ctx, 280, 4, 330, 4, 'rgba(255,255,255,.7)', 5); line(ctx, 400, 12, 470, 12, 'rgba(255,255,255,.7)', 5); }
  if (n >= 2) { ellipse(ctx, -380, -6, 70, 14, 'rgba(0,0,0,.15)'); rrect(ctx, -392, -150, 24, 150, 6); ctx.fillStyle = '#7a4f2e'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); circle(ctx, -380, -200, 90, '#4f9a5a', O_, 5); circle(ctx, -420, -160, 50, '#5aa868'); }
  rrect(ctx, -200, roofY, 400, H, 10); ctx.fillStyle = '#f4d7a8'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 7; ctx.stroke();
  if (fl) { line(ctx, -200, -220, 200, -220, O_, 5); for (const wx of [-110, 110]) { rrect(ctx, wx - 44, -350, 88, 80, 8); ctx.fillStyle = '#ffe58a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); } }
  rrect(ctx, -40, -140, 80, 140, 8); ctx.fillStyle = '#c0392b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke();
  for (const wx of [-130, 130]) { rrect(ctx, wx - 44, -170, 88, 80, 8); ctx.fillStyle = '#ffe58a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); }
  poly(ctx, [[-240, roofY + 6], [0, roofY - 170], [240, roofY + 6]], '#5b6fd6', O_, 7);
  if (n >= 6) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-240, roofY + 6); ctx.lineTo(0, roofY - 170); ctx.lineTo(240, roofY + 6); ctx.stroke(); for (let q = 0; q < 6; q++) { const ph = (t * .9 + q / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', -200 + q * 80, roofY - 60 - ph * 80, 36); ctx.restore(); } }
  if (n >= 1) for (let q = 0; q < 7; q++) { const fx = -190 + q * 26 + (q > 3 ? 120 : 0); line(ctx, fx, 0, fx, -26, '#3f8a4e', 4); circle(ctx, fx, -30, 11, ['#ff6b8b', '#ffd23f', '#c38bff'][q % 3], O_, 2.5); }
  if (n >= 2) { for (let q = 0; q < 13; q++) { const px = -560 + q * 40; if (px > -60 && px < 60) continue; rrect(ctx, px - 8, -80, 16, 80, 4); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 3; ctx.stroke(); } line(ctx, -560, -56, -70, -56, '#fff', 8); }
  if (n >= 3) { rrect(ctx, 228, -230, 14, 230, 5); ctx.fillStyle = '#2d2d3a'; ctx.fill(); rrect(ctx, 210, -270, 50, 50, 10); ctx.fillStyle = '#ffe58a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
    const gl = ctx.createRadialGradient(235, -245, 10, 235, -245, 150); gl.addColorStop(0, 'rgba(255,230,140,.5)'); gl.addColorStop(1, 'rgba(255,230,140,0)'); ctx.fillStyle = gl; ctx.fillRect(85, -395, 300, 300);
    rrect(ctx, 270, -60, 140, 18, 6); ctx.fillStyle = '#8a5c34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); line(ctx, 290, -42, 290, 0, O_, 5); line(ctx, 390, -42, 390, 0, O_, 5); }
  if (n >= 7) { rrect(ctx, -620, -60, 120, 60, 6); ctx.fillStyle = '#b9b3a6'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); ctx.save(); ctx.translate(-560, -60); ctx.filter = 'grayscale(1) brightness(1.1)'; drawBenny(ctx, 0, 0, .55, { mood: 'happy', shortLegs: true, armsUp: true }); ctx.restore(); }
  ctx.restore();
}
function sceneG(t) {
  bgDay(t, { seed: 12, dusk: t > T.t3 - .1 && t < T.t4 - .1 ? .5 : 0 });
  let n = 0; TIERS.forEach(([k], i) => { if (t >= T[k] - .15) n = i + 1; });
  const pop = n ? eBack(vprog(t, T[TIERS[n - 1][0]] - .15, T[TIERS[n - 1][0]] + .15)) : 1;
  ctx.save(); zoomAbout(540, 1300, .95 - .1 * vprog(t, T.longer, T.t7)); grownHouse(560, 1300, 1.0 * (.96 + .04 * pop), n, t); ctx.restore();
  vstamp('⏳ STAY LONGER = BETTER HOUSE', 540, 300, t, T.longer - .1, T.t1 - .15, 62, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
  if (n) { const [, d, s] = TIERS[n - 1], k = eBack(vprog(t, T[TIERS[n - 1][0]] - .15, T[TIERS[n - 1][0]] + .15)); ctx.save(); ctx.translate(540, 330); ctx.scale(k, k);
    panel(-400, -90, 800, 180, 44, 'rgba(10,12,26,.93)', '#ffd23f', 5); txt(d, 0, -40, 40, '#ffd23f', 'center', 'middle'); otxt(s, 0, 28, 70, '#ffffff', 8); ctx.restore(); }
  // tier progress dots
  for (let i = 0; i < 7; i++) circle(ctx, 360 + i * 60, 490, 14, i < n ? '#ffd23f' : 'rgba(255,255,255,.4)', O_, 3);
}
/* ---------- H: newest neighbours move in ---------- */
function sceneH(t) {
  const a = T.look - .25, k = ss(vprog(t, a, T.but - .3)), c = P.newC;
  mapAt(t, lerp(c[0] - 40, c[0] + 40, k), lerp(c[1] - 20, c[1] + 20, k), Math.exp(lerp(Math.log(1.25), Math.log(.95), k)));
  withCtx(OC, () => {
    P.newH.forEach((h, q) => { const tq = a + .4 + q * .14; if (t < tq) return; const [x, y] = uvS(h.i, h.j); if (x < 60 || x > 1020 || y < 200 || y > 1500) return;
      const kk = eBack(vprog(t, tq, tq + .25)); ctx.save(); ctx.translate(x, y - 70 * cam.z); ctx.scale(1.6 * kk, 1.6 * kk); tag(0, 0, '@' + trunc(h.name, 16), q % 3 ? '#ffffff' : '#ffd23f', 1); ctx.restore(); });
    vstamp('🆕 NEW NEIGHBORS', 540, 300, t, a + .1, T.hi - .1, 80, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
    vstamp('HI!! 👋 WELCOME HOME', 540, 300, t, T.hi - .1, T.but - .3, 74, '#ffffff', .02, 'rgba(10,12,26,.92)');
  });
}
/* ---------- I: the fog in the north ---------- */
function sceneI(t) {
  const a = T.but - .3, k = ss(vprog(t, a, T.cta - .3));
  const [fx, fy] = isoW(-18.83, -256.06);
  mapAt(t, fx, fy + 60 * (1 - k), Math.exp(lerp(Math.log(.34), Math.log(.24), k)), 'hour=19.5&weather=clear');
  withCtx(OC, () => {
    ctx.fillStyle = `rgba(8,6,25,${.25 + .2 * k})`; ctx.fillRect(0, 0, 1080, 1920);
    vstamp('🌫️ AT 10,000 NEIGHBORS…', 540, 300, t, a + .1, T.something - .1, 70, '#c7b8ff', -.02, 'rgba(10,12,26,.92)');
    vstamp('…THE FOG LIFTS', 540, 440, t, T.fog - .1, T.something - .1, 70, '#ffffff', .02, 'rgba(10,12,26,.92)');
    vstamp('SOMETHING IS OUT THERE 👀', 540, 300, t, T.something - .1, T.cta - .3, 66, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
    const p = .5 + .5 * Math.sin(t * 3); ctx.save(); ctx.globalAlpha = .3 + .4 * p; emoji(ctx, '❓', 540, 960, 140); ctx.restore();
  });
}
/* ---------- J: CTA ---------- */
function sceneJ(t) {
  bgDay(t, { seed: 7, dusk: .2 }); ellipse(ctx, 540, GROUND + 100, 460, 60, '#5aa868', '#3f8a4e', 4); cabinSide(540, GROUND + 100, .8, 1, t);
  const sx = 540, sy = GROUND + 100 - 330 * .8 - 30; ctx.save(); ctx.translate(sx, sy); rrect(ctx, -200, -40, 400, 80, 16); ctx.fillStyle = '#e8c98e'; ctx.fill(); ctx.strokeStyle = '#5b6fd6'; ctx.strokeStyle = '#5b3a2a'; ctx.lineWidth = 7; ctx.stroke(); txt('BENNY & MITTENS', 0, 4, 40, '#5b3a2a', 'center', 'middle'); ctx.restore();
  drawPigeon(sx + 130, sy - 44, .8, 0, -1);
  benny(260, FEET + 40, 1.3, { mood: 'happy', wave: true, talk: talkAt(t) }); drawKitten(820, FEET + 60, 1.0, { t, look: [-1, -.4] });
  const k = eBack(vprog(t, T.cta - .1, T.cta + .25)); ctx.save(); ctx.translate(540, 470); ctx.scale(k, k);
  const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -120, 940, 240, 44); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke();
  otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -34, 56, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 52, 40, '#fff', 'center', 'middle'); ctx.restore();
  vstamp("WELCOME TO BENNY'S TOWN 🏠", 540, 760, t, T.welcome - .1, 99, 62, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
}
