/* ======================= FOLGE 18 — her name is MITTENS + new poll (Tue 24.11. evening) ======================= */
const GROUND = 1250, FEET = 1440;
function bgDay(t, o) {   // snowy forest + sky (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#9cc9ee', '#3b4a7a', d), mixc('#e3f0fa', '#f6a27a', d), GROUND);
  if (d < .5) circle(ctx, 880, 300, 70, `rgba(255,240,180,${.9 * (1 - d * 2)})`);
  forest(GROUND - 20, mixc('#3f6e58', '#2a4a3c', d), true, o.seed || 3);
  snowGround(GROUND, mixc('#eef3fa', '#d9dfee', d));
}
function wavePaw(x, y, s, t) {   // a raised white paw on a sitting kitten (drawKitten coords)
  const a = Math.sin(t * 9) * .35; ctx.save(); ctx.translate(x + 40 * s, y - 60 * s); ctx.rotate(.7 + a); ctx.scale(s, s);
  rrect(ctx, -10, -60, 20, 64, 10); ctx.fillStyle = '#9aa0ad'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  ellipse(ctx, 0, -62, 15, 12, '#f6f4ee', O_, 3.5); ctx.restore();
}
function nameTag(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); circle(ctx, 0, 0, 30, '#ffd23f', O_, 4); txt('M', 0, 3, 32, O_, 'center', 'middle'); ctx.restore(); }
/* ---------- S1 hook: 1,605 votes + covered sign ---------- */
function sceneHook(t) {
  cabinRoom(t, false); heater(910, 1420, .85, 1, t); cardboardBox(200, 1600, .9, null);
  drawKitten(760, 1560, 1.4, { t, look: [-1, -.4] });
  const dark = vprog(t, T.her - .2, T.her + .4); benny(470, 1500, 1.5, { mood: 'happy', look: [0, 0], talk: talkAt(t), armsUp: false });
  if (dark > 0) { ctx.fillStyle = `rgba(5,6,18,${.7 * dark})`; ctx.fillRect(0, 0, 1080, 1920); const g = ctx.createRadialGradient(540, 900, 60, 540, 900, 520); g.addColorStop(0, `rgba(255,240,190,${.35 * dark})`); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
  // covered sign
  const k = eBack(vprog(t, .15, .5)), sh = t > T.her ? Math.sin(t * 40) * 4 * dark : 0; ctx.save(); ctx.translate(540 + sh, 860); ctx.scale(k, k);
  rrect(ctx, -300, -120, 600, 240, 30); ctx.fillStyle = '#c0392b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 7; ctx.stroke();
  for (let q = 0; q < 5; q++) line(ctx, -260 + q * 130, -110, -230 + q * 130, 110, 'rgba(0,0,0,.15)', 10); otxt('???', 0, 6, 120, '#fff', 12); ctx.restore();
  vstamp('🗳️ 1,605 VOTES', 540, 330, t, .3, T.her - .2, 92, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp("…NOT EVEN CLOSE 😳", 540, 470, t, 3.6, T.her - .2, 64, '#ffffff', .02, 'rgba(10,12,26,.9)');
  vstamp('🥁 HER NAME IS…', 540, 330, t, T.her, T.mit, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S2 reveal ---------- */
function sceneReveal(t) {
  sky('#ffd6e0', '#ffeef3', 1920);
  for (let q = 0; q < 14; q++) { ctx.save(); ctx.translate(540, 900); ctx.rotate(q / 14 * 6.283 + t * .3); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -110); ctx.lineTo(1400, 110); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#f7c1cf'; ctx.fillRect(0, 1480, 1080, 440);
  const kx = 540, ky = 1500, ks = 2.7; drawKitten(kx, ky, ks, { t, look: [0, .2] });
  if (t > T.wave - .3) wavePaw(kx, ky, ks, t);
  if (vin(t, T.paws - .2, T.wave)) for (const dx of [-16, 16]) { ctx.save(); ctx.globalAlpha = .6 + .4 * Math.sin(t * 8); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(kx + dx * ks, ky - 4 * ks, 20 * ks, 14 * ks, 0, 0, 6.29); ctx.stroke(); ctx.restore(); }
  // name card
  const k = eBack(vprog(t, T.mit - .05, T.mit + .3)); ctx.save(); ctx.translate(540, 520); ctx.scale(k, k); ctx.rotate(-.03);
  panel(-420, -120, 840, 240, 60, 'rgba(10,12,26,.95)', '#ffd23f', 7); otxt('🧤 MITTENS', 0, 10, 130, '#ffffff', 12); ctx.restore();
  // results bars
  if (t > T.six - .1) { const kk = vprog(t, T.six - .1, T.six + .8); ctx.save(); ctx.translate(540, 780);
    panel(-420, -56, 840, 250, 30, 'rgba(10,12,26,.88)', 'rgba(255,255,255,.25)', 3);
    [['🧤 Mittens', .66], ['🌙 Luna', .15], ['🫧 Fizzy', .08]].forEach(([s, f], i) => { const y = -2 + i * 72; rrect(ctx, -390, y - 28, 780, 56, 20); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
      rrect(ctx, -390, y - 28, Math.max(36, 780 * f * kk), 56, 20); ctx.fillStyle = i ? 'rgba(255,255,255,.22)' : '#46e08a'; ctx.fill(); txt(s, -370, y + 1, 40, '#fff', 'left', 'middle'); txt(Math.round(f * 100 * kk) + '%', 370, y + 1, 42, i ? '#c3c9e4' : '#fff', 'right', 'middle'); });
    ctx.restore(); }
  for (let s = 0; s < 40; s++) { const ph = ((t - T.mit) * .45 + rnd(s)) % 1; if (t < T.mit) break; ctx.save(); ctx.globalAlpha = 1 - ph * .5; ctx.translate(rnd(s + 2) * 1080, -40 + ph * 1900); ctx.rotate(t * 3 + s); ctx.fillStyle = ['#ffd23f', '#ff4d6d', '#46e08a', '#4da3ff', '#c38bff'][s % 5]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); }
  vstamp('👋 SHE SAYS HI', 540, 1070, t, T.wave - .1, T.tag - .2, 64, '#ffd23f', .03, 'rgba(10,12,26,.88)');
}
/* ---------- S3 name tag ---------- */
function sceneTag(t) {
  cabinRoom(t, false); heater(910, 1300, .85, 1, t); catBed(860, 1450, .8);
  const inBox = t > T.box - .2, shake = vin(t, T.shook - .3, T.box - .3);
  cardboardBox(240, 1460, 1.0, inBox ? { t, look: [1, -.3], bob: ss(1 - vprog(t, T.box - .2, T.box + .3)) * 40 } : null);
  benny(580, 1360, 1.45, { pose: 'sit', mood: t > T.shook ? 'sad' : 'happy', look: inBox ? [-1, .4] : [-.5, .3], talk: talkAt(t) });
  if (!inBox) { const kx = 330, ky = 1460; drawKitten(kx, ky, 1.25, { t, shiver: shake, look: [1, -.2] });
    if (t > 15.8 && t < T.shook) nameTag(kx, ky - 82 * 1.25, 1, Math.sin(t * 4) * .2);
    else if (t < 15.8) { const k = vprog(t, T.tag, 15.8); nameTag(lerp(660, kx, ss(k)), lerp(1180, ky - 103, ss(k)) - Math.sin(k * Math.PI) * 120, 1.2, 0); } }
  if (t >= T.shook) { const k = vprog(t, T.shook, T.shook + .9); ctx.save(); ctx.globalAlpha = 1 - Math.max(0, k - .7) * 3; nameTag(330 - k * 420, 1357 - Math.sin(k * Math.PI) * 320 + k * 200, 1.1, -k * 12); ctx.restore(); }
  vstamp('🏷️ A NAME TAG!', 540, 330, t, T.tag, T.shook - .3, 82, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  vstamp('…NOPE 🙄', 540, 330, t, T.shook - .2, T.box - .2, 96, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
  vstamp('BACK IN THE BOX 📦', 540, 330, t, T.box - .2, T.cabin - .3, 80, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S4 the cabin sign + pigeon ---------- */
function sceneSign(t) {
  bgDay(t, { dusk: .15, seed: 7 });
  ctx.fillStyle = '#b7b0a0'; ctx.fillRect(-10, GROUND + 10, 1100, 90); ctx.fillStyle = '#a49d8c'; ctx.fillRect(-10, GROUND + 100, 1100, 700);
  ellipse(ctx, 540, GROUND + 120, 460, 70, '#5aa868', '#3f8a4e', 4);
  cabinSide(540, GROUND + 120, .95, 1, t);
  // sign over the door
  const sk = eBack(vprog(t, T.sign - .3, T.sign + .1)), sx = 540, sy = GROUND + 120 - 330 * .95 - 34;
  if (sk > 0) { ctx.save(); ctx.translate(sx, sy); ctx.scale(sk, sk); ctx.rotate(-.02 + (t > T.pigeon - .2 && t < T.fine ? Math.sin(t * 7) * .03 : 0));
    rrect(ctx, -230, -46, 460, 92, 18); ctx.fillStyle = '#e8c98e'; ctx.fill(); ctx.strokeStyle = '#5b3a2a'; ctx.lineWidth = 8; ctx.stroke(); txt('BENNY & MITTENS', 0, 4, 46, '#5b3a2a', 'center', 'middle'); ctx.restore(); }
  // pigeon lands on the sign
  if (t > T.pigeon - 1.1) { const land = ss(vprog(t, T.pigeon - 1.1, T.pigeon - .2)); drawPigeon(lerp(1150, sx + 150, land), lerp(420, sy - 52, land) - Math.sin(land * Math.PI) * 60, .9, land < 1 ? t * 26 : 0, -1); }
  if (t > T.sign + .4) drawKitten(800, FEET + 70, .9, { t, look: [-1, -.8] });
  const annoyed = vin(t, T.pigeon, T.fine);
  benny(250, FEET + 40, 1.35, { mood: annoyed ? 'sad' : 'happy', armsUp: vin(t, T.sign, T.pigeon - .3), look: t > T.pigeon - .5 ? [1, -1] : [1, -.3], talk: talkAt(t) });
  if (t > T.fine) for (let s = 0; s < 3; s++) { const ph = (t * .7 + s / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '❤️', sx + 150 + Math.sin(s + t) * 30, sy - 120 - ph * 120, 38); ctx.restore(); }
  vstamp('🪧 A REAL SIGN!', 540, 330, t, T.cabin, T.pigeon - .3, 82, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  vstamp('PIGEON. GET OFF. 😤', 540, 330, t, T.pigeon - .2, T.fine - .1, 76, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
  vstamp('…FINE. YOU CAN STAY 🕊️', 540, 330, t, T.fine - .1, T.oh - .2, 66, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S5 map: the LIVE move-ins ---------- */
function sceneLive(t) {
  const a = T.oh - .2, k = ss(vprog(t, a, T.now - .3)), c = P.liveC;
  camXY(lerp(c[0] - 80, c[0] + 80, k), lerp(c[1] - 40, c[1] + 40, k), Math.exp(lerp(Math.log(.9), Math.log(.32), ss(vprog(t, a, T.hund + 1.5)))));
  setHash('hour=17.2&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t > T.hund - .1) { const n = Math.floor(172 * vprog(t, T.hund - .1, T.welcome)); ctx.save(); ctx.globalAlpha = .9;
      for (let q = 0; q < Math.min(n, P.liveH.length); q++) { const h = P.liveH[q], [x, y] = uvS(h.i, h.j); if (x < -50 || x > 1130 || y < -50 || y > 1970) continue; const p = 1 + .2 * Math.sin(t * 6 + q); circle(ctx, x, y - 20 * cam.z, 16 * p, '#ff2e63', '#fff', 3); }
      ctx.restore(); }
    const kk = eBack(vprog(t, T.live - .3, T.live)); if (t > T.live - .3 && t < T.now - .3) { ctx.save(); ctx.translate(540, 330); ctx.scale(kk, kk); rrect(ctx, -290, -70, 580, 140, 40); ctx.fillStyle = '#ff2e63'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke(); circle(ctx, -200, 0, 18 + 4 * Math.sin(t * 8), '#fff'); otxt('FIRST LIVE', 30, 4, 72, '#fff', 0); ctx.restore(); }
    vstamp('+172 NEIGHBORS 🏠', 540, 500, t, T.hund - .1, T.now - .3, 80, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp('🔴 FROM ONE LIVE', 540, 630, t, T.hund + 1.2, T.now - .3, 60, '#ffffff', .02, 'rgba(10,12,26,.9)');
    vstamp('WELCOME HOME 💛', 540, 1250, t, T.welcome - .1, T.now - .3, 72, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S6 what do we buy ---------- */
function xmasTree(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -18, -40, 36, 44, 6); ctx.fillStyle = '#6b4226'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  for (let q = 0; q < 3; q++) poly(ctx, [[-110 + q * 22, -40 - q * 70], [110 - q * 22, -40 - q * 70], [0, -150 - q * 70]], '#2f8a52', O_, 5);
  const cols = ['#ff4d6d', '#ffd23f', '#4da3ff', '#46e08a']; for (let q = 0; q < 14; q++) { const yy = -60 - rnd(q + 4) * 200, w = (yy + 330) / 330 * 90; const on = Math.sin(t * 5 + q) > 0; circle(ctx, (rnd(q + 9) - .5) * w * 1.6, yy, 9, on ? cols[q % 4] : 'rgba(255,255,255,.35)', O_, 2); }
  ctx.translate(0, -322); ctx.rotate(t); emoji(ctx, '⭐', 0, 0, 52); ctx.restore(); }
function cozyBed(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, -150, 26, 150, 8); ctx.fillStyle = '#8a5c34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke();
  rrect(ctx, -140, -70, 290, 60, 14); ctx.fillStyle = '#a06a3c'; ctx.fill(); ctx.stroke();
  rrect(ctx, -130, -110, 270, 48, 20); ctx.fillStyle = '#fff7ea'; ctx.fill(); ctx.stroke();
  rrect(ctx, -120, -136, 80, 40, 18); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.stroke();
  rrect(ctx, -40, -112, 190, 56, 22); ctx.fillStyle = '#4da3ff'; ctx.fill(); ctx.stroke(); for (let q = 0; q < 4; q++) line(ctx, -20 + q * 42, -106, -20 + q * 42, -60, 'rgba(255,255,255,.4)', 5);
  ctx.restore(); }
function catTower(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const post = (px, y0, y1) => { rrect(ctx, px - 14, y1, 28, y0 - y1, 6); ctx.fillStyle = '#d9b77d'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); for (let yy = y1 + 10; yy < y0; yy += 14) line(ctx, px - 13, yy, px + 13, yy + 4, 'rgba(120,80,40,.5)', 3); };
  post(-50, -10, -170); post(50, -10, -280); post(-30, -180, -360);
  const pad = (px, py, w) => { rrect(ctx, px - w / 2, py - 18, w, 24, 10); ctx.fillStyle = '#c95d8b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); };
  rrect(ctx, -110, -24, 220, 30, 10); ctx.fillStyle = '#c95d8b'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  pad(-50, -170, 120); pad(50, -280, 110); pad(-30, -360, 130);
  rrect(ctx, 10, -250, 80, 60, 30); ctx.fillStyle = '#a44a72'; ctx.fill(); ctx.stroke(); circle(ctx, 50, -222, 18, '#5a2240');
  ctx.restore(); }
const ITEMS = [['🎄', 'Christmas tree + lights', '€40', 'tree', 'Xmas tree'], ['🛏️', 'Big cozy bed', '€80', 'bed', 'Cozy bed'], ['🐱', 'Giant cat tower', '€60', 'tower', 'Cat tower']];
function sceneShop(t) {
  bgDay(t, { dusk: .55, seed: 11 }); snowfall(t, 60, 'rgba(255,255,255,.85)', .5);
  const tk = [T.tree, T.bed, T.tower], X = [185, 540, 895];
  for (let i = 0; i < 3; i++) { if (t < tk[i] - .2) continue; const k = eBack(vprog(t, tk[i] - .2, tk[i] + .15)), hot = t < T.top && (i === 2 ? t >= tk[2] : t >= tk[i] && t < tk[i + 1]);
    ctx.save(); ctx.translate(X[i], 1000); ctx.scale(k * (hot ? 1.06 : 1), k * (hot ? 1.06 : 1));
    panel(-165, -340, 330, 440, 34, hot ? 'rgba(10,12,26,.95)' : 'rgba(10,12,26,.8)', hot ? '#ffd23f' : 'rgba(255,255,255,.3)', hot ? 6 : 3);
    if (i === 0) xmasTree(0, 20, .72, t); else if (i === 1) cozyBed(0, 20, .95); else catTower(0, 30, .78);
    otxt(ITEMS[i][4], 0, -280, 44, '#ffffff', 6); ctx.restore();
    priceTag(ITEMS[i][2], X[i] + 70, 1090, .1, k, '#ffd23f'); }
  if (t > T.sbag - .1 && t < T.tower) { ctx.save(); ctx.globalAlpha = vprog(t, T.sbag - .1, T.sbag + .2); emoji(ctx, '😴', 540, 1180, 70); ctx.restore(); }
  benny(540, FEET + 60, 1.2, { mood: 'happy', look: [0, -.2], talk: talkAt(t), armsUp: t > T.vote });
  bankPanel(22460, t < T.tree - .2 ? vprog(t, T.now, T.now + .3) : 0, vin(t, T.money, T.money + .5) ? 1 : 0, '🎄 almost Christmas');
  vstamp('YOU DECIDE 🗳️', 540, 300, t, T.xmas + 1, T.tree - .2, 84, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('🏆 TOP 2 GET BOUGHT', 540, 300, t, T.top - .1, T.vote, 74, '#46e08a', -.02, 'rgba(10,12,26,.9)');
}
function endCards(t) {
  if (t < T.vote) return; const k = eBack(vprog(t, T.vote, T.vote + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.vote, T.vote + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 700); ctx.scale(k, k); panel(-460, -280, 920, 560, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT DO I BUY? 🛒', 0, -205, 62, '#ffd23f', 8);
  ITEMS.forEach(([e, n, p], i) => { const y = -85 + i * 112, kk = eBack(vprog(t, T.vote + .25 + i * .15, T.vote + .55 + i * .15)); ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk);
    panel(-410, -46, 820, 92, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 50); txt(n, -300, 2, 42, '#ffffff', 'left', 'middle'); txt(p, 380, 2, 42, '#46e08a', 'right', 'middle'); ctx.restore(); });
  txt('Vote 👇  ·  top 2 get bought', 0, 240, 34, '#c3c9e4', 'center', 'middle'); ctx.restore();
  const kk = eBack(vprog(t, T.vote + .6, T.vote + .9)); if (kk > 0) { ctx.save(); ctx.translate(540, 1240); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
