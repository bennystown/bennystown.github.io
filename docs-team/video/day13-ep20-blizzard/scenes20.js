/* ======================= FOLGE 20 — BLIZZARD: the new neighbours are stuck (Thu 26.11.) ======================= */
const GROUND = 1250, FEET = 1440;
function bgSnow(t, o) {   // snowy forest, deep snow (NO row of houses — Kieran)
  o = o || {}; sky('#b8c6d8', '#e9eef5', GROUND); forest(GROUND - 20, '#4d6f63', true, o.seed || 3);
  snowGround(GROUND - (o.deep || 0), '#f4f7fb'); snowfall(t, o.n || 160, 'rgba(255,255,255,.95)', o.sp || .9);
}
function shovel(x, y, s, ang) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); rrect(ctx, -6, -150, 12, 150, 5); ctx.fillStyle = '#8a5c34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); rrect(ctx, -26, -170, 52, 22, 8); ctx.fill(); ctx.stroke(); poly(ctx, [[-40, 0], [40, 0], [34, 60], [-34, 60]], '#c0392b', O_, 5); ctx.restore(); }
function snowWall(t, k) {   // a wall of snow filling the open door
  ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, 1080, 1920);
  for (let q = 0; q < 26; q++) { const y = q * 56; rrect(ctx, -20, y, 1120, 54, 27); ctx.fillStyle = q % 2 ? '#8a5c34' : '#7d5230'; ctx.fill(); }
  ctx.fillStyle = '#4a3020'; ctx.fillRect(0, 1500, 1080, 420);
  rrect(ctx, 200, 280, 680, 1240, 20); ctx.fillStyle = '#5b3a2a'; ctx.fill();
  ctx.save(); rrect(ctx, 230, 310, 620, 1200, 12); ctx.clip(); ctx.fillStyle = '#eef3fa'; ctx.fillRect(230, 310, 620, 1200);
  for (let q = 0; q < 90; q++) circle(ctx, 230 + rnd(q) * 620, 310 + rnd(q + 4) * 1200, 20 + rnd(q + 9) * 50, `rgba(${200 + rnd(q) * 40},${215 + rnd(q) * 30},235,.5)`);
  for (let q = 0; q < 6; q++) line(ctx, 230, 420 + q * 190 + Math.sin(q) * 20, 850, 400 + q * 190, 'rgba(160,180,210,.45)', 6);
  ctx.restore();
  // door swung open
  ctx.save(); ctx.translate(850, 310); poly(ctx, [[0, 0], [150, 60], [150, 1150], [0, 1200]], '#a06a3c', O_, 6); circle(ctx, 120, 640, 12, '#ffd23f', O_, 3); ctx.restore();
}
/* ---------- S1 hook: the door opens onto a wall of snow ---------- */
function sceneHook(t) {
  const sh = t < 1.4 ? Math.sin(t * 60) * 6 * (1 - t / 1.4) : 0; ctx.save(); ctx.translate(sh, 0); snowWall(t); ctx.restore();
  benny(540, 1560, 1.5, { mood: 'sad', armsUp: true, look: [0, -.4], talk: talkAt(t) });
  vstamp('❄️ BLIZZARD', 540, 260, t, .1, T.shovel - .1, 104, '#ffffff', -.02, 'rgba(20,40,80,.9)');
  vstamp('A WALL OF SNOW 😱', 540, 400, t, T.wall - .1, T.shovel - .1, 70, '#9fd3ff', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S2 outside: everything buried ---------- */
function sceneBuried(t) {
  bgSnow(t, { deep: 220, seed: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, GROUND - 200); ctx.clip(); cabinSide(540, GROUND + 140, .9, 1, t); ctx.restore();
  ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.moveTo(0, GROUND - 210); for (let x = 0; x <= 1080; x += 60) ctx.lineTo(x, GROUND - 220 + Math.sin(x * .02) * 18); ctx.lineTo(1080, 1920); ctx.lineTo(0, 1920); ctx.fill();
  benny(300, GROUND - 20, 1.25, { mood: 'hope', look: [1, 0], talk: talkAt(t) }); shovel(420, GROUND - 120, 1.0, .25);
  vstamp('🏡 MY CABIN… SOMEWHERE', 540, 330, t, T.shovel - .1, T.oh - .2, 66, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S3 map: new neighbours stuck, houses buried ---------- */
function sceneStuck(t) {
  const a = T.oh - .2, k = ss(vprog(t, a, T.dont)), c = P.newC;
  camXY(lerp(c[0] - 60, c[0] + 60, k), lerp(c[1] - 30, c[1] + 30, k), Math.exp(lerp(Math.log(1.7), Math.log(1.25), k)));
  setHash('hour=10&weather=snow'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    ctx.fillStyle = 'rgba(240,245,252,.55)'; ctx.fillRect(0, 0, 1080, 1920);
    for (const h of P.newH) { const [x, y] = uvS(h.i, h.j); if (x < -60 || x > 1140 || y < -60 || y > 1980) continue; ellipse(ctx, x, y - 20 * cam.z, 70 * cam.z, 46 * cam.z, 'rgba(250,252,255,.95)'); }
    P.newH.forEach((h, q) => { const tq = T.stuck - .3 + q * .08; if (t < tq) return; const [x, y] = uvS(h.i, h.j); if (x < 60 || x > 1020 || y < 220 || y > 1480) return;
      const kk = eBack(vprog(t, tq, tq + .25)); ctx.save(); ctx.translate(x, y - 75 * cam.z); ctx.scale(1.9 * kk, 1.9 * kk); tag(0, 0, '🧳 @' + trunc(h.name, 14), q % 3 ? '#ffffff' : '#9fd3ff', 1); ctx.restore(); });
    snowfall(t, 160, 'rgba(255,255,255,.95)', .9);
    vstamp('🆕 NEW NEIGHBORS…', 540, 300, t, a + .1, T.stuck, 80, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
    vstamp('…STUCK IN THE SNOW 🥶', 540, 300, t, T.stuck, T.buried, 72, '#9fd3ff', .02, 'rgba(10,12,26,.92)');
    vstamp('HOUSES = BURIED ❄️', 540, 300, t, T.buried, T.dont - .2, 80, '#ffffff', -.02, 'rgba(10,12,26,.92)');
    if (P.newN) vstamp('+' + P.newN + ' WAITING 🧳', 540, 440, t, T.stuck + .5, T.dont - .2, 60, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S4 Benny shovels… one meter ---------- */
function sceneShovel(t) {
  bgSnow(t, { deep: 160, seed: 8 });
  const tired = t > T.meter - .2, sw = !tired ? Math.sin((t - T.dont) * 7) : 0, k = vprog(t, T.dont, T.meter);
  ctx.fillStyle = '#dfe7f1'; ctx.fillRect(120, GROUND - 160, 120 * k + 20, 180);
  for (let q = 0; q < 10; q++) { if (tired) break; const ph = ((t - T.dont) * 1.4 + q / 10) % 1; circle(ctx, 360 + ph * 260, GROUND - 260 - Math.sin(ph * Math.PI) * 260, 16 + rnd(q) * 12, 'rgba(255,255,255,.95)', 'rgba(160,180,210,.6)', 2); }
  if (!tired) { benny(260, GROUND - 40, 1.3, { mood: 'hope', look: [1, 0], talk: talkAt(t) }); shovel(380, GROUND - 120, 1.0, .5 + sw * .5); }
  else { benny(260, GROUND - 20, 1.3, { pose: 'sit', mood: 'sad', look: [0, .5], talk: talkAt(t) }); shovel(420, GROUND - 40, 1.0, 1.4); for (let q = 0; q < 3; q++) { const ph = (t * .8 + q / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '💦', 200 + q * 60, 950 - ph * 60, 40); ctx.restore(); } }
  // progress bar 1 m of the whole town
  const kk = eBack(vprog(t, T.one - .2, T.one + .1)); if (t > T.one - .2) { ctx.save(); ctx.translate(540, 470); ctx.scale(kk, kk); panel(-440, -70, 880, 140, 36, 'rgba(10,12,26,.93)', '#9fd3ff', 4);
    rrect(ctx, -400, -20, 800, 40, 20); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); rrect(ctx, -400, -20, Math.max(30, 800 * .004 * k * 3), 40, 20); ctx.fillStyle = '#46e08a'; ctx.fill();
    txt(tired ? '1 m / 4,000 m 💀' : 'SHOVELING…', 0, -46, 30, '#ffffff', 'center', 'middle'); ctx.restore(); }
  vstamp("💪 I'VE GOT THIS!", 540, 300, t, T.dont - .1, T.meter - .2, 84, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('…ONE METER 😵', 540, 300, t, T.meter - .2, T.arms + 1, 92, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S5 Mittens: still in her tower ---------- */
function sceneMittens(t) {
  cabinRoom(t, false); heater(140, 1400, .8, 1, t);
  const door = bigTower(700, 1620, 1.05, t); eyesIn(door[0], door[1] - 4, 1.05, t);
  vstamp('MITTENS: 🙈 NOPE', 540, 300, t, T.mittens - .1, T.yuki - .3, 86, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 top supporter @yukimst ---------- */
function sceneYuki(t) {
  const h = P.yuki, a = T.yuki - .3, k = ss(vprog(t, a, a + 1.4)), [x, y] = isoW(h.i, h.j);
  camXY(x, y - 30, Math.exp(lerp(Math.log(.6), Math.log(2.4), k)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    ctx.fillStyle = 'rgba(240,245,252,.25)'; ctx.fillRect(0, 0, 1080, 1920);
    if (t > T.yuki + .4) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.yuki + .4, T.yuki + .7)); ctx.save(); ctx.translate(sx, sy - 125 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '⭐ @' + h.name, '#ffd23f', 1); ctx.restore();
      for (let s = 0; s < 18; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 600 + rnd(s + 9) * 800 - ph * 60, 44); ctx.restore(); } }
    vstamp('🏆 #1 SUPPORTER', 540, 300, t, T.yuki - .2, T.golden - .1, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp('THANK YOU 💛', 540, 300, t, T.golden - .1, T.hod - .3, 92, '#ffffff', .02, 'rgba(10,12,26,.9)');
    vstamp('✨ GOLDEN PATH = NO SHOVELING', 540, 440, t, T.golden, T.hod - .3, 54, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S7 house of the day ---------- */
function sceneHod(t) {
  const h = P.hod, a = T.hod - .3, k = ss(vprog(t, a, a + 1.4)), [x, y] = isoW(h.i, h.j);
  camXY(x, y - 30, Math.exp(lerp(Math.log(.6), Math.log(2.6), k)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t > T.hod + .2) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.hod + .2, T.hod + .5)); ctx.save(); ctx.translate(sx, sy - 125 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '🏆 @' + h.name, '#ffd23f', 1); ctx.restore();
      for (let s = 0; s < 18; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 600 + rnd(s + 9) * 800 - ph * 60, 44); ctx.restore(); } }
    vstamp('🏆 HOUSE OF THE DAY', 540, 300, t, T.hod - .2, T.help - .3, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S8 how do we save the town? ---------- */
const OPTS = [['🚜', 'Snow plow', '€70', 'plow'], ['🧂', 'Salt truck', '€40', 'salt'], ['🛷', 'Sleds for everyone', '€30', 'sled'], ['💪', 'Benny shovels alone', '€0', 'alone']];
function sceneVote(t) {
  bgSnow(t, { deep: 120, seed: 11, n: 90, sp: .5 });
  benny(540, FEET + 40, 1.2, { pose: 'sit', mood: t > T.alone - .1 && t < T.please + 1 ? 'sad' : 'hope', look: [0, -.3], talk: talkAt(t) });
  shovel(700, FEET + 20, .9, 1.3);
  bankPanel(P.bank, vprog(t, T.help, T.help + .3) * (t < T.plow - .2 ? 1 : 0), 0, '');
  vstamp('🆘 HOW DO WE SAVE THE TOWN?', 540, 500, t, T.save - .1, T.plow - .2, 60, '#ffffff', -.02, 'rgba(10,12,26,.92)');
  OPTS.forEach(([e, s, p, key], i) => { const t0 = T[key] - .2; if (t < t0) return; const k = eBack(vprog(t, t0, t0 + .3)), y = 330 + i * 150, hot = t < T.vote && t >= t0 && (i === 3 || t < T[OPTS[i + 1][3]] - .2);
    ctx.save(); ctx.translate(540, y); ctx.scale(k * (hot ? 1.04 : 1), k * (hot ? 1.04 : 1)); panel(-470, -62, 940, 124, 40, 'rgba(10,12,26,.93)', hot ? '#ffd23f' : 'rgba(255,255,255,.3)', hot ? 6 : 3);
    emoji(ctx, e, -400, 2, 62); txt(s, -330, 4, fitSize(s, 52, 600), '#ffffff', 'left', 'middle'); ctx.restore();
    ctx.save(); ctx.translate(540, y); ctx.scale(k, k); txt(p, 420, 4, 50, i === 3 ? '#ff8fa3' : '#46e08a', 'right', 'middle'); ctx.restore(); });
  if (t > T.please - .1 && t < T.vote) { const kk = eBack(vprog(t, T.please - .1, T.please + .2)); ctx.save(); ctx.translate(820, 780); ctx.rotate(.08); ctx.scale(kk, kk); panel(-160, -40, 320, 80, 24, '#ff4d6d', '#fff', 4); otxt('PLEASE NO 😭', 0, 3, 40, '#fff', 5); ctx.restore(); }
}
function endCards(t) {
  if (t < T.vote - .1) return; const k = eBack(vprog(t, T.vote - .1, T.vote + .2));
  ctx.save(); ctx.translate(540, 1000); ctx.scale(k, k); panel(-440, -64, 880, 128, 44, '#ffd23f', '#fff', 5); otxt('🗳️ VOTE IN THE POLL 👇', 0, 2, 56, '#1b1728', 0); ctx.restore();
  if (t >= T.vote + .5) { const kk = eBack(vprog(t, T.vote + .5, T.vote + .8)); ctx.save(); ctx.translate(540, 1720); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
