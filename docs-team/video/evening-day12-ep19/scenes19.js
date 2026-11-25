/* ======================= FOLGE 19 — a real bed + a HUGE cat tower (Wed 25.11. evening) ======================= */
const GROUND = 1250, FEET = 1440;
function bgDay(t, o) {   // snowy forest + sky (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#9cc9ee', '#1b2550', d), mixc('#e3f0fa', '#f6a27a', d * .6), GROUND);
  if (d < .5) circle(ctx, 880, 300, 70, `rgba(255,240,180,${.9 * (1 - d * 2)})`); else { circle(ctx, 860, 300, 56, 'rgba(240,244,255,.95)'); for (let k = 0; k < 40; k++) circle(ctx, rnd(k + 2) * 1080, rnd(k + 7) * 900, 2.5, 'rgba(255,255,255,.7)'); }
  forest(GROUND - 20, mixc('#3f6e58', '#1c3328', d), true, o.seed || 3);
  snowGround(GROUND, mixc('#eef3fa', '#b9c3dc', d));
}
function sleepingBag(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -170, -50, 340, 60, 30); ctx.fillStyle = '#3f7d5a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); line(ctx, -150, -22, 150, -22, 'rgba(255,255,255,.25)', 4); ellipse(ctx, -130, -44, 50, 20, '#e9e2d0', O_, 4); ctx.restore(); }
function bigBox(x, y, s, label, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 6, 150, 18, 'rgba(0,0,0,.2)');
  poly(ctx, [[-130, -260], [130, -260], [130, 0], [-130, 0]], '#c9a06a', O_, 6); line(ctx, -130, -150, 130, -150, 'rgba(120,80,40,.4)', 5); line(ctx, 0, -260, 0, 0, '#d8b37a', 22);
  rrect(ctx, -100, -230, 200, 70, 14); ctx.fillStyle = col || '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); txt(label, 0, -194, 34, O_, 'center', 'middle'); ctx.restore(); }
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
/* ---------- S1 hook ---------- */
function sceneHook(t) {
  cabinRoom(t, false); heater(930, 1400, .8, 1, t); sleepingBag(520, 1560, 1.3);
  benny(520, 1520, 1.35, { pose: 'sit', mood: 'happy', look: [0, -.3], talk: talkAt(t), armsUp: t > T.bed0 && t < T.tower0 + .5 });
  drawKitten(800, 1570, 1.0, { t, look: [-1, -.4] });
  const k = eBack(vprog(t, .1, .45)); ctx.save(); ctx.translate(540, 500); ctx.scale(k, k);
  panel(-430, -170, 860, 340, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3); otxt('YOU VOTED 🗳️', 0, -112, 52, '#ffd23f', 7);
  [['🛏️', 'Cozy bed', .73, T.bed0], ['🐱', 'Cat tower', .19, T.tower0], ['🎄', 'Xmas tree', .08, 99]].forEach(([e, s, f, tc], i) => {
    const y = -36 + i * 78, kk = vprog(t, .4 + i * .15, 1.1 + i * .15); rrect(ctx, -390, y - 30, 780, 60, 22); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
    rrect(ctx, -390, y - 30, Math.max(40, 780 * f * kk), 60, 22); ctx.fillStyle = i < 2 ? 'rgba(70,224,138,.4)' : 'rgba(255,255,255,.12)'; ctx.fill();
    emoji(ctx, e, -350, y + 1, 40); txt(s, -310, y + 1, 36, '#fff', 'left', 'middle'); txt(Math.round(f * 100) + '%', 300, y + 1, 36, i < 2 ? '#46e08a' : '#9aa3c7', 'right', 'middle');
    if (t > tc - .1) { const k2 = eBack(vprog(t, tc - .1, tc + .2)); ctx.save(); ctx.translate(352, y); ctx.scale(k2, k2); circle(ctx, 0, 0, 24, '#46e08a', '#fff', 4); otxt('✓', 0, 2, 32, '#fff', 0); ctx.restore(); } });
  ctx.restore();
}
/* ---------- S2 delivery + money ---------- */
function sceneMoney(t) {
  bgDay(t, { seed: 4, dusk: .2 });
  const kb = ss(vprog(t, T.money - .2, T.money + .6)); bigBox(lerp(-200, 260, kb), FEET + 20, 1.0, 'BED 🛏️', '#fff');
  const kt = ss(vprog(t, T.m80 + .2, T.m60 + .2)); bigBox(lerp(1280, 820, kt), FEET + 20, 1.15, 'CAT TOWER', '#ffd6e0');
  benny(540, FEET, 1.25, { mood: 'happy', look: [0, -.3], talk: talkAt(t), armsUp: t > T.still });
  const cents = t < T.m80 ? 24030 : t < T.m60 ? 16030 : 10030;
  bankPanel(cents, 1, vin(t, T.m80, T.m80 + .4) || vin(t, T.m60, T.m60 + .4) ? 1 : 0, t > T.still - .1 ? '€100 left 😎' : '');
  floatTxt('−€80 🛏️', 540, 560, t, T.m80, '#ff4d6d', 64); floatTxt('−€60 🐱', 540, 560, t, T.m60, '#ff4d6d', 64);
}
/* ---------- S3 building the bed ---------- */
function sceneBuild(t) {
  cabinRoom(t, false); heater(930, 1400, .8, 1, t);
  const k = vprog(t, T.build, T.screw - .3); realBed(560, 1600, 1.1, k);
  const bx = 220; benny(bx, 1560, 1.25, { mood: t > T.screw - .2 && t < T.matter ? 'sad' : 'happy', look: t > T.screw - .2 && t < T.matter ? [0, .5] : [1, -.2], talk: talkAt(t) });
  if (t < T.screw - .2) hammer(bx + 100, 1490, .8, .5 + Math.sin(t * 14) * .6);
  if (t > T.screw - .2) { const kk = eBack(vprog(t, T.screw - .2, T.screw + .1)), fy = 1260 - Math.sin(t * 3) * 10; ctx.save(); ctx.translate(bx + 170, fy + 40); ctx.scale(kk, kk);
    rrect(ctx, -10, -40, 20, 70, 4); ctx.fillStyle = '#b8bcc8'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); rrect(ctx, -26, -50, 52, 16, 6); ctx.fill(); ctx.stroke(); for (let q = 0; q < 4; q++) line(ctx, -10, -24 + q * 14, 10, -18 + q * 14, O_, 3); ctx.restore();
    if (t < T.matter) emoji(ctx, '❓', bx + 250, 1230, 70); }
  vstamp('🔨 BUILDING TIME', 540, 330, t, T.build, T.screw - .3, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('1 SCREW LEFT OVER 🔩', 540, 330, t, T.screw - .2, T.matter - .1, 74, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
  vstamp("…DOESN'T MATTER 🤷", 540, 330, t, T.matter - .1, T.look - .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S4 the HUGE cat tower ---------- */
function sceneTower(t) {
  cabinRoom(t, false); heater(140, 1400, .8, 1, t); realBed(280, 1640, .7, 1);
  const zk = ss(vprog(t, T.look, T.huge)), z = lerp(1.35, 1, zk);
  ctx.save(); zoomAbout(700, lerp(1400, 1250, zk), z);
  const door = bigTower(700, 1620, 1.05, t);
  // Mittens climbs: floor → pad1 → pad2 → pad3 → into the house
  const path = [[620, 1620], [542, 1312], [858, 1123], [679, 950], [door[0], door[1] + 40]], ts = [T.mit - .2, T.mit + .2, T.mit + .6, T.mit + 1.0, T.straight - .2];
  if (t < T.straight) { let p = path[0]; for (let i = 1; i < ts.length; i++) if (t >= ts[i - 1]) { const q = ss(vprog(t, ts[i - 1], ts[i])); p = [lerp(path[i - 1][0], path[i][0], q), lerp(path[i - 1][1], path[i][1], q) - Math.sin(q * Math.PI) * 70]; }
    drawKitten(p[0], p[1], .9, { t, look: [.4, -1] }); }
  else eyesIn(door[0], door[1] - 4, 1.05, t);
  ctx.restore();
  if (t > T.floors - .1 && t < T.mit) { const lbl = [['🪜 3 FLOORS', T.floors], ['🛋️ HAMMOCK', T.hammock], ['🏠 LITTLE HOUSE', T.house]]; lbl.forEach(([s, tt], i) => { if (t < tt - .1) return; const kk = eBack(vprog(t, tt - .1, tt + .2)); ctx.save(); ctx.translate(250, 560 + i * 110); ctx.scale(kk, kk); panel(-190, -40, 380, 80, 30, 'rgba(10,12,26,.9)', '#ffd23f', 4); otxt(s, 0, 3, 40, '#fff', 6); ctx.restore(); }); }
  benny(200, 1560, 1.15, { mood: 'happy', look: [1, -1], talk: talkAt(t), armsUp: vin(t, T.huge, T.floors) || vin(t, T.straight, T.notout) });
  vstamp("IT'S HUGE 😳", 540, 300, t, T.huge - .1, T.mit - .2, 96, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('STRAIGHT IN 🐱💨', 540, 300, t, T.straight - .2, T.notout - .1, 80, '#ffffff', .02, 'rgba(10,12,26,.9)');
  vstamp("SHE'S NOT COMING OUT 👀", 540, 300, t, T.notout - .1, T.lives - .1, 66, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('SHE LIVES THERE NOW 🏠', 540, 300, t, T.lives - .1, T.tonight - .3, 70, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S5 first night in a real bed ---------- */
function sceneNight(t) {
  cabinRoom(t, true);
  const door = bigTower(880, 1620, .8, t); eyesIn(door[0], door[1] - 4, .8, t);
  realBed(420, 1640, 1.0, 1);
  const asleep = t > T.finally - .1;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, 1640 - 150); ctx.clip(); benny(300, 1560, 1.05, { pose: 'sit', mood: 'happy', look: [.5, 0], talk: asleep ? 0 : talkAt(t), blink: asleep }); ctx.restore();
  blanket(420, 1640, 1.0);
  if (asleep) for (let q = 0; q < 3; q++) { const ph = (t * .5 + q / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); otxt('z', 400 + ph * 120 + q * 10, 1180 - ph * 200, 50 + q * 14, '#ffffff', 6); ctx.restore(); }
  vstamp('🛏️ FIRST NIGHT IN A REAL BED', 540, 300, t, T.tonight, T.finally - .1, 60, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('FINALLY… 😌', 540, 300, t, T.finally - .1, T.gn - .1, 86, '#ffd23f', .02, 'rgba(10,12,26,.9)');
  vstamp('GOOD NIGHT, MITTENS 🌙', 540, 300, t, T.gn - .1, T.oh - .2, 66, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 house of the day + new neighbours (map) ---------- */
function sceneHod(t) {
  const h = P.hod, a = T.oh - .2, k = ss(vprog(t, a, a + 1.4)), [x, y] = isoW(h.i, h.j);
  const zo = P.newN ? ss(vprog(t, T.welcome - .2, T.tomorrow - .3)) : 0;
  camXY(x, y - 30, Math.exp(lerp(Math.log(lerp(.6, 2.6, k)), Math.log(.7), zo)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t > T.hod && zo < .5) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.hod, T.hod + .3)); ctx.save(); ctx.translate(sx, sy - 125 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '🏆 @' + h.name, '#ffd23f', 1); ctx.restore();
      for (let s = 0; s < 18; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 600 + rnd(s + 9) * 800 - ph * 60, 44); ctx.restore(); } }
    if (t > T.welcome - .1) P.newH.forEach((nh, q) => { const tq = T.welcome + q * .06; if (t < tq) return; const [nx, ny] = uvS(nh.i, nh.j); if (nx < 0 || nx > 1080 || ny < 0 || ny > 1700) return; const p = eBack(vprog(t, tq, tq + .2)); circle(ctx, nx, ny - 20 * cam.z, 12 * p, '#46e08a', '#fff', 3); });
    vstamp('🏆 HOUSE OF THE DAY', 540, 300, t, T.hod - .1, T.welcome - .2, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    if (P.newN) vstamp('+' + P.newN + ' NEW NEIGHBORS 🏠', 540, 300, t, T.welcome - .1, T.tomorrow - .3, 74, '#46e08a', .02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S7 good night ---------- */
function sceneEnd(t) {
  bgDay(t, { seed: 7, dusk: 1 }); ellipse(ctx, 540, GROUND + 100, 460, 60, '#3f7a4c', '#2f6a3e', 4); cabinSide(540, GROUND + 100, .8, 1, t);
  const sx = 540, sy = GROUND + 100 - 330 * .8 - 30; ctx.save(); ctx.translate(sx, sy); rrect(ctx, -200, -40, 400, 80, 16); ctx.fillStyle = '#e8c98e'; ctx.fill(); ctx.strokeStyle = '#5b3a2a'; ctx.lineWidth = 7; ctx.stroke(); txt('BENNY & MITTENS', 0, 4, 40, '#5b3a2a', 'center', 'middle'); ctx.restore();
  drawPigeon(sx + 130, sy - 44, .8, 0, -1, { }); snowfall(t, 60, 'rgba(255,255,255,.8)', .4);
  const gl = ctx.createRadialGradient(540, GROUND, 40, 540, GROUND, 500); gl.addColorStop(0, 'rgba(255,200,120,.25)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 600, 1080, 1100);
  const k = eBack(vprog(t, T.tomorrow - .2, T.tomorrow + .15)); ctx.save(); ctx.translate(540, 420); ctx.scale(k, k); panel(-450, -100, 900, 200, 50, 'rgba(10,12,26,.94)', '#ffd23f', 6);
  otxt('🗳️ TOMORROW MORNING', 0, -30, 64, '#ffd23f', 8); txt('you decide what’s next', 0, 50, 44, '#ffffff', 'center', 'middle'); ctx.restore();
  vstamp("GOOD NIGHT, BENNY'S TOWN 🌙", 540, 680, t, T.gn2 - .1, 99, 58, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  if (t > T.gn2 + .6) { const kk = eBack(vprog(t, T.gn2 + .6, T.gn2 + .9)); ctx.save(); ctx.translate(540, 1720); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
