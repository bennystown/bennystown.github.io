/* ======================= SCENES ======================= */
const GROUND = 1250, FEET = 1440, BS = 1.55;            // horizon, Benny's feet, Benny's size (short legs, always)
const VX = 470, VY = 1330, VS = .95;                    // the van in all outside shots
const STEP = vanP(VX, VY, VS, [288, -32]), DOOR = vanP(VX, VY, VS, [286, -160]), ALARM = vanP(VX, VY, VS, VAN_ALARM);
const PLATE = [585, 1428];
function dayScene(t, o) {   // sunny snowy day at the van (hook + decision + emotional)
  o = o || {}; sky('#9cc9ee', '#e3f0fa', GROUND);
  circle(ctx, 880, 300, 70, 'rgba(255,240,180,.9)'); circle(ctx, 880, 300, 110, 'rgba(255,240,180,.25)');
  if (o.houses) for (let k = 0; k < 7; k++) { const x = 40 + k * 150, h = 120 + (k % 3) * 22, by = GROUND - 8;
    rrect(ctx, x, by - h, 112, h, 6); ctx.fillStyle = ['#f3e3c3', '#cfe3f2', '#f6c9cf', '#d7efd2', '#f2d6a2', '#d9c8f2', '#f7c8a8'][k]; ctx.fill(); ctx.strokeStyle = 'rgba(27,23,40,.5)'; ctx.lineWidth = 3; ctx.stroke();
    poly(ctx, [[x - 12, by - h], [x + 124, by - h], [x + 56, by - h - 64]], ['#d9534f', '#3c5a99', '#7b4b94', '#2f7d6b', '#8a4b2e', '#5b3f8f', '#b5523a'][k], 'rgba(27,23,40,.5)', 3);
    poly(ctx, [[x - 4, by - h - 4], [x + 116, by - h - 4], [x + 56, by - h - 56]], 'rgba(255,255,255,.0)');
    rrect(ctx, x + 40, by - 44, 30, 44, 4); ctx.fillStyle = '#6b4a33'; ctx.fill(); }
  else forest(GROUND - 20, '#3f6e58', true, 3);
  snowGround(GROUND);
  if (!o.noVan) vanSide(VX, VY, VS, { snowRoof: true });
}
/* ---------- S1 hook: Sunday = RENT DAY ---------- */
function sceneHook(t) {
  dayScene(t, { houses: true, noVan: true });
  // every house pays: coins pop from the roofs and rain down
  const pay = vprog(t, T.every0, T.every0 + 1.5);
  for (let k = 0; k < 7; k++) { const t0 = T.every0 + k * .22; if (t < t0) continue; const q = (t - t0) % 1.4, x = 96 + k * 150, y = GROUND - 200 - (k % 3) * 22 - q * 160;
    coin(x, y, 22, 1 - q / 1.4); if (t - t0 < 1.2) { ctx.save(); ctx.globalAlpha = 1 - (t - t0) / 1.2; otxt('+10¢', x, y - 46, 40, '#46e08a', 6, '#06070f'); ctx.restore(); } }
  const rain = vprog(t, T.rent0, T.rent0 + .6);
  for (let k = 0; k < 46 * rain; k++) { const x = rnd(k + 300) * 1080, y = ((rnd(k + 400) * 1920 + (t - T.rent0) * (520 + rnd(k) * 380)) % 2100) - 120; coin(x, y, 16 + rnd(k + 7) * 14, .95); }
  const dance = t > T.biggest - .2, jump = t > T.rent0 ? Math.abs(Math.sin((t - T.rent0) * 5.2)) * 40 : 0;
  benny(360, FEET - jump, BS, { mood: 'happy', armsUp: t > T.rent0 && (!dance || Math.sin(t * 6) > 0), look: [.2, 0], talk: talkAt(t) });
  // title
  if (t > .15) { const k = eBack(vprog(t, .15, .5)); ctx.save(); ctx.translate(540, 360); ctx.scale(k, k); ctx.rotate(-.03); panel(-250, -62, 500, 124, 40, 'rgba(10,12,26,.9)', 'rgba(255,255,255,.3)', 3); otxt('☀️ SUNDAY', 0, 0, 78, '#ffffff', 8); ctx.restore(); }
  if (t > T.rent0 - .1) { const k = eBack(vprog(t, T.rent0 - .1, T.rent0 + .3)), p = 1 + .05 * Math.sin(t * 7); ctx.save(); ctx.translate(540, 560); ctx.scale(k * p, k * p); ctx.rotate(.02);
    const g = ctx.createLinearGradient(-430, 0, 430, 0); g.addColorStop(0, '#ffb703'); g.addColorStop(1, '#ffd23f'); rrect(ctx, -440, -100, 880, 200, 50); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke();
    otxt('💰 RENT DAY 💰', 0, 4, 120, '#1b1728', 0); ctx.restore(); }
  if (t > T.every0) vstamp('EVERY NEIGHBOR = 10¢', 540, 760, t, T.every0, T.biggest - .1, 70, '#46e08a', -.02, 'rgba(10,12,26,.88)');
  if (t > T.biggest - .1) vstamp('THE BIGGEST DAY OF THE WEEK 🎉', 540, 760, t, T.biggest - .1, T.first, 62, '#ffffff', .02, 'rgba(10,12,26,.88)');
}
/* ---------- S2 rewind to last night ---------- */
function sceneRewind(t) {
  const k = vprog(t, T.first, T.voted - .2);
  ctx.save(); ctx.filter = `grayscale(${Math.min(1, k * 2)}) contrast(1.15) brightness(${1 - .35 * k})`; sceneHook(T.first - .05); ctx.restore(); ctx.filter = 'none';
  // VHS rewind: tracking bars + streaks moving upwards
  for (let q = 0; q < 7; q++) { const y = (1920 - ((t * 900 + q * 300) % 2200)); ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(0, y, 1080, 26 + q * 4); }
  for (let q = 0; q < 40; q++) { ctx.fillStyle = `rgba(255,255,255,${.15 + rnd(q + Math.floor(t * 20)) * .25})`; ctx.fillRect(rnd(q * 3 + Math.floor(t * 30)) * 1080, rnd(q * 7 + Math.floor(t * 30)) * 1920, 80 + rnd(q) * 260, 3); }
  ctx.fillStyle = `rgba(12,16,40,${.45 * k})`; ctx.fillRect(0, 0, 1080, 1920);
  // clock spinning backwards
  ctx.save(); ctx.translate(540, 1000); const r = 150; circle(ctx, 0, 0, r, 'rgba(255,255,255,.92)', O_, 8);
  for (let h = 0; h < 12; h++) { const a = h / 12 * 6.283; line(ctx, Math.sin(a) * r * .8, -Math.cos(a) * r * .8, Math.sin(a) * r * .92, -Math.cos(a) * r * .92, O_, 6); }
  const a1 = -(t - T.first) * 9, a2 = -(t - T.first) * .9; line(ctx, 0, 0, Math.sin(a1) * r * .75, -Math.cos(a1) * r * .75, O_, 8); line(ctx, 0, 0, Math.sin(a2) * r * .5, -Math.cos(a2) * r * .5, '#c23a2d', 12); circle(ctx, 0, 0, 12, O_);
  ctx.restore();
  otxt('⏪', 540, 1250, 130, '#ffffff', 0);
  vstamp('⏪ LAST NIGHT…', 540, 560, t, T.lastn - .3, T.voted + .2, 96, '#ffffff', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S3 the shop ---------- */
const SHOP_ITEMS = [{ k: 'alarm', x: 610, p: '€8', sold: () => T.eight }, { k: 'sausages', x: 785, p: '€4', sold: () => T.four }, { k: 'flash', x: 950, p: '€6', sold: () => 1e9 }];
function shopItem(kind, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'alarm') { rrect(ctx, -46, -56, 92, 56, 10); ctx.fillStyle = '#d8dbe3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); circle(ctx, -18, -28, 12, '#2a2f40'); ctx.beginPath(); ctx.arc(22, -56, 22, Math.PI, 0); ctx.closePath(); ctx.fillStyle = '#d63a3a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  else if (kind === 'sausages') { for (let q = 0; q < 3; q++) { ctx.save(); ctx.translate(-30 + q * 30, -20 - (q % 2) * 6); ctx.rotate(-.9 + q * .1); rrect(ctx, -12, -34, 24, 68, 12); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
  else { ctx.rotate(-.25); rrect(ctx, -54, -36, 82, 30, 10); ctx.fillStyle = '#2e3340'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); poly(ctx, [[28, -44], [56, -52], [56, 10], [28, 2]], '#ffd23f', O_, 4); ellipse(ctx, 56, -21, 7, 31, '#fff6c8', O_, 3); }
  ctx.restore();
}
function priceTag(s, x, y, rot, a, col) { ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.translate(x, y); ctx.rotate(rot || .08); rrect(ctx, -46, -26, 92, 52, 12); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); otxt(s, 0, 2, 38, col || '#e23d3d', 0); ctx.restore(); }
function sceneShop(t) {
  sky('#a9d3f2', '#dcecf8', GROUND); forest(GROUND - 30, '#4c7d66', true, 11); snowGround(GROUND);
  // the shop
  const X0 = 110, X1 = 1030, top = 560;
  rrect(ctx, X0 + 30, top + 120, X1 - X0 - 60, GROUND - top - 120, 6); ctx.fillStyle = '#f3e3c3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#7a5636'; ctx.fillRect(X0 + 60, top + 300, X1 - X0 - 120, 14);
  for (let k = 0; k < 9; k++) { rrect(ctx, X0 + 90 + k * 88, top + 236, 62, 64, 8); ctx.fillStyle = ['#4da3ff', '#ff8a3d', '#3ddc84', '#b07cff', '#ffd23f', '#ff4d6d'][k % 6]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  for (let k = 0; k < 8; k++) { rrect(ctx, X0 + 110 + k * 98, top + 360, 70, 54, 8); ctx.fillStyle = ['#f6c9cf', '#cfe3f2', '#d7efd2', '#f7e27a'][k % 4]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  // awning
  const aw = (X1 - X0) / 8; for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e23d3d'; ctx.fillRect(X0 + k * aw, top + 30, aw, 92); ctx.beginPath(); ctx.arc(X0 + k * aw + aw / 2, top + 122, aw / 2, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.strokeRect(X0, top + 30, X1 - X0, 92);
  rrect(ctx, 420, top - 50, 240, 90, 20); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); otxt('SHOP', 540, top - 4, 62, '#1b1728', 0);
  // counter
  const cy = 1080; rrect(ctx, X0 + 10, cy, X1 - X0 - 20, GROUND - cy + 30, 8); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#a8743f'; ctx.fillRect(X0 + 10, cy, X1 - X0 - 20, 26); ctx.strokeRect(X0 + 10, cy, X1 - X0 - 20, 26);
  // items on the counter
  for (const it of SHOP_ITEMS) {
    const sold = it.sold(), gone = vprog(t, sold + .5, sold + .8), hi = (it.k === 'alarm' && vin(t, T.alarmw, T.eight)) || (it.k === 'sausages' && vin(t, T.sausw, T.four)) || (it.k === 'flash' && vin(t, T.nomoney, T.put));
    if (hi) { const g = ctx.createRadialGradient(it.x, cy - 40, 5, it.x, cy - 40, 120); g.addColorStop(0, 'rgba(255,230,120,.75)'); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(it.x - 130, cy - 170, 260, 260); }
    if (gone < 1) { ctx.save(); ctx.globalAlpha = 1 - gone; shopItem(it.k, it.x, cy + 4 - gone * 60, 1.5); ctx.restore(); }
    if (t < sold + .4) priceTag(it.p, it.x + 26, cy - 140, .1, 1, '#e23d3d');
    if (t >= sold && t < sold + 1.2) { const k = eBack(vprog(t, sold, sold + .25)); ctx.save(); ctx.translate(it.x, cy - 190); ctx.scale(k, k); ctx.rotate(-.12); panel(-92, -34, 184, 68, 16, '#3ddc84', '#fff', 4); otxt('SOLD ✓', 0, 2, 40, '#fff', 0); ctx.restore(); }
    if (it.k === 'flash' && t > T.nomoney) { const k = eBack(vprog(t, T.nomoney, T.nomoney + .3)); ctx.save(); ctx.translate(it.x, cy - 50); ctx.scale(k, k); ctx.strokeStyle = '#e23d3d'; ctx.lineWidth = 16; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-70, -70); ctx.lineTo(70, 70); ctx.moveTo(70, -70); ctx.lineTo(-70, 70); ctx.stroke(); ctx.restore(); }
  }
  // Benny walks in, buys, gets sad
  const wk = vprog(t, T.voted - .1, T.voted + 1.7), bx = lerp(-170, 330, ss(wk)), walking = wk > 0 && wk < 1;
  const bag = t > T.eight + .6;
  const mood = t > T.left ? 'sad' : t > T.eight ? 'happy' : 'hope', look = t > T.nomoney ? [1, -.1] : t > T.left ? [0, -1] : [1, .2];
  benny(bx, FEET, BS, { mood, walk: walking ? t * 10 : 0, look, talk: talkAt(t) });
  if (bag) { const k = eBack(vprog(t, T.eight + .6, T.eight + .9)); ctx.save(); ctx.translate(bx + 150, FEET + 4); ctx.scale(k, k);
    poly(ctx, [[-56, 0], [56, 0], [48, -130], [-48, -130]], '#c9a06a', O_, 5); poly(ctx, [[-48, -130], [48, -130], [40, -150], [-40, -150]], '#b48a55', O_, 4);
    if (t > T.eight + .6) { ctx.save(); ctx.translate(-12, -150); ctx.scale(.55, .55); shopItem('alarm', 0, 0, 1); ctx.restore(); }
    if (t > T.four + .6) { ctx.save(); ctx.translate(26, -150); ctx.rotate(.4); rrect(ctx, -10, -50, 20, 60, 10); ctx.fillStyle = '#b5523a'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  // the bank
  const cents = t < T.eight ? 1410 : t < T.four ? lerp(1410, 610, ss(vprog(t, T.eight, T.eight + .5))) : lerp(610, 210, ss(vprog(t, T.four, T.four + .5)));
  const pulse = vin(t, T.two, T.two + .6) ? Math.sin(vprog(t, T.two, T.two + .6) * Math.PI) : 0;
  bankPanel(Math.round(cents), vprog(t, T.voted + .2, T.voted + .5), pulse);
  floatTxt('−€8', 830, 300, t, T.eight, '#ff4d6d', 70); floatTxt('−€4', 830, 300, t, T.four, '#ff4d6d', 70);
  vstamp('🚨 MOTION ALARM', 540, 462, t, T.alarmw - .1, T.sausw - .1, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🍖 SAUSAGES AS BAIT', 540, 462, t, T.sausw - .1, T.eight, 70, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('🔦 FLASHLIGHT? NO MONEY 😬', 540, 462, t, T.nomoney, T.put, 62, '#ff4d6d', -.02, 'rgba(10,12,26,.88)');
}
/* ---------- the van at dusk / night: shared outside set ---------- */
function nightSet(t, o) {   // o.d = 0 dusk .. 1 night, plate, step, alarm (0..1 visible), on
  const d = o.d;
  sky(mixc('#41507f', '#05070f', d), mixc('#f6a27a', '#141a33', d), GROUND);
  if (d > .5) for (let k = 0; k < 40; k++) circle(ctx, rnd(k + 70) * 1080, rnd(k + 90) * 900, 1.5 + rnd(k) * 2, `rgba(255,255,255,${(d - .5) * 1.6 * (.4 + .6 * rnd(k + 5))})`);
  if (o.moon) { circle(ctx, 820, 330, 64, `rgba(240,244,255,${o.moon})`); circle(ctx, 800, 315, 64, `rgba(10,14,30,${o.moon * .0})`); }
  forest(GROUND - 20, mixc('#355e4c', '#0b1612', d), mixc('#f2f6fb', '#3a4560', d), 5);
  snowGround(GROUND, mixc('#e2e8f3', '#2c3348', d));
  vanSide(VX, VY, VS, { dim: d, win: o.win || 0, doorOpen: o.door || 0, doorLight: o.doorLight || 0, snowRoof: true });
  if (o.step) sausage(STEP[0], STEP[1] - 10, .75, .1);
  if (o.plate) plate(PLATE[0], PLATE[1], 1.3, o.plate === 'full');
  alarmBox(ALARM[0], ALARM[1], 1.5, o.on, t, o.alarm == null ? 1 : o.alarm);
}
/* ---------- S4 setting the trap at dusk ---------- */
function sceneTrap(t) {
  const d = vprog(t, T.put - .2, T.bed + 1.0) * .85;
  const plateOn = t > T.one + .35, ak = eBack(vprog(t, T.put + .2, T.put + .5));
  nightSet(t, { d, plate: plateOn ? 'full' : null, step: plateOn, alarm: ak, on: false, win: vprog(t, T.bed + .2, T.bed + .8), door: vin(t, T.bed - .1, T.bed + 1.1) ? Math.sin(vprog(t, T.bed - .1, T.bed + 1.1) * Math.PI) : 0, doorLight: .8 });
  if (t > T.put + .2 && t < T.put + 1.2) { const k = vprog(t, T.put + .2, T.put + 1.2); ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; for (let q = 0; q < 8; q++) { const a = q / 8 * 6.283; line(ctx, ALARM[0] + Math.cos(a) * (40 + 40 * k), ALARM[1] + Math.sin(a) * (40 + 40 * k), ALARM[0] + Math.cos(a) * (60 + 60 * k), ALARM[1] + Math.sin(a) * (60 + 60 * k), '#ffd23f', 6); } ctx.restore(); }
  if (plateOn && t < T.one + 1.2) { const k = vprog(t, T.one + .35, T.one + 1.2); ctx.save(); ctx.globalAlpha = 1 - k; for (let q = 0; q < 8; q++) { const a = q / 8 * 6.283; line(ctx, PLATE[0] + Math.cos(a) * (70 + 30 * k), PLATE[1] - 10 + Math.sin(a) * (40 + 20 * k), PLATE[0] + Math.cos(a) * (90 + 40 * k), PLATE[1] - 10 + Math.sin(a) * (50 + 30 * k), '#ffd23f', 5); } ctx.restore(); }
  // Benny: stands by the van, then walks to the door and goes in
  const go = vprog(t, T.bed - .3, T.bed + .7), bx = lerp(280, DOOR[0] - 10, ss(go)), fade = vprog(t, T.bed + .45, T.bed + .8);
  if (fade < 1) { ctx.save(); ctx.globalAlpha = 1 - fade; benny(bx, FEET - go * 70, BS * (1 - go * .18), { mood: 'hope', walk: go > 0 && go < 1 ? t * 10 : 0, look: t > T.one ? [.8, .8] : [1, -.6], talk: talkAt(t) }); ctx.restore(); }
  vstamp('🚨 ALARM: ON', 540, 330, t, T.put + .3, T.one, 82, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🍖 THE BAIT', 540, 330, t, T.one + .2, T.bed, 82, '#ffd23f', .02, 'rgba(10,12,26,.88)');
}
/* ---------- inside the van (night + morning) ---------- */
function vanRoom(t, o) {
  const m = o.morning ? 1 : 0;
  ctx.fillStyle = mixc('#252c45', '#6d7fa8', m); ctx.fillRect(0, 0, 1080, 1920);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; ctx.fillRect(k * 120, 0, 120, 1920); }
  // window
  rrect(ctx, 250, 330, 580, 420, 22); ctx.fillStyle = '#c9ccd6'; ctx.fill();
  ctx.save(); rrect(ctx, 270, 350, 540, 380, 14); ctx.clip();
  const g = ctx.createLinearGradient(0, 350, 0, 730); g.addColorStop(0, mixc('#0d1430', '#9fd0f5', m)); g.addColorStop(1, mixc('#1a2347', '#ffe2b8', m)); ctx.fillStyle = g; ctx.fillRect(270, 350, 540, 380);
  if (m) { circle(ctx, 700, 520, 60, 'rgba(255,236,170,.95)'); ctx.fillStyle = '#f2f6fb'; ctx.fillRect(270, 640, 540, 90); for (let k = 0; k < 6; k++) pine(300 + k * 100, 650, 120, '#3f6e58', true); }
  else { for (let k = 0; k < 6; k++) pine(300 + k * 100, 690, 130, '#0c1714', '#38425c'); }
  if (o.red) { ctx.fillStyle = `rgba(255,40,40,${.75 * o.red})`; ctx.fillRect(270, 350, 540, 380); }
  snowfall(t, 30, m ? 'rgba(255,255,255,.9)' : 'rgba(200,210,240,.6)', .6);
  ctx.restore(); line(ctx, 540, 350, 540, 730, '#c9ccd6', 16);
  if (m) { ctx.save(); ctx.globalAlpha = .18; poly(ctx, [[270, 350], [810, 350], [1080, 1400], [120, 1400]], '#fff2c8'); ctx.restore(); }
  ctx.fillStyle = mixc('#3d2c22', '#7a5a42', m); ctx.fillRect(0, 1380, 1080, 540);
  rrect(ctx, 90, 1180, 900, 220, 40); ctx.fillStyle = mixc('#6c7080', '#a5a9b5', m); ctx.fill();
  rrect(ctx, 130, 1130, 240, 110, 40); ctx.fillStyle = mixc('#a9abb5', '#eeeef3', m); ctx.fill();
}
function blanket(by, m, shake) {
  ctx.save(); ctx.translate(shake || 0, 0);
  ctx.beginPath(); ctx.moveTo(140, 1400); ctx.lineTo(160, by + 20); ctx.quadraticCurveTo(540, by - 70, 920, by + 20); ctx.lineTo(940, 1400); ctx.closePath();
  ctx.fillStyle = mixc('#8a3a36', '#c9524c', m); ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); ctx.clip(); for (let k = 0; k < 9; k++) for (let j = 0; j < 5; j++) if ((k + j) % 2) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(140 + k * 90, by - 60 + j * 90, 90, 90); } ctx.restore();
  ctx.restore();
}
function clock(t, s, red) { ctx.save(); rrect(ctx, 830, 860, 210, 96, 16); ctx.fillStyle = '#10131f'; ctx.fill(); ctx.strokeStyle = '#4a5068'; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = '700 66px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = red ? '#ff4040' : '#5dff8a'; ctx.fillText(s, 935, 910); ctx.restore(); }
/* ---------- S5 can't sleep, 03:12, the alarm ---------- */
function sceneBed(t) {
  const al = t > T.alarm - .1, flash = al ? Math.pow(.5 + .5 * Math.sin((t - T.alarm) * 14), 2) : 0;
  const shake = al && t < T.alarm + 1.4 ? Math.sin(t * 90) * 10 * (1 - vprog(t, T.alarm, T.alarm + 1.4)) : 0;
  ctx.save(); ctx.translate(shake, shake * .6);
  vanRoom(t, { red: flash });
  clock(t, t < T.three ? (Math.floor(t * 2) % 2 ? '03:11' : '03 11') : '03:12', t >= T.three);
  if (t > T.three - .1 && t < T.three + 1.4) { const k = eBack(vprog(t, T.three - .1, T.three + .2)); ctx.save(); ctx.translate(935, 910); ctx.scale(1 + .3 * k * (1 - vprog(t, T.three + .2, T.three + 1.4)), 1 + .3 * k * (1 - vprog(t, T.three + .2, T.three + 1.4))); ctx.restore(); }
  const up = eBack(vprog(t, T.alarm, T.alarm + .35)), run = vprog(t, T.ran - .45, T.ran + .1);
  if (!al) { benny(540, 1400, 1.5, { pose: 'sit', mood: 'sad', look: [Math.sin(t * .8) * .6, -.8], blink: (t % 2.7) < .1 && !vin(t, T.three - .5, T.alarm), talk: talkAt(t) }); blanket(1235, 0); }
  else { blanket(1235 + up * 80, 0); benny(540 + run * 700, 1400 - up * 150, 1.5, { mood: 'surprised', armsUp: t < T.outthere + .4, look: [1, -.3], walk: run > 0 ? t * 14 : 0, talk: talkAt(t) }); }
  ctx.restore();
  if (al) { ctx.fillStyle = `rgba(255,30,30,${.28 * flash})`; ctx.fillRect(0, 0, 1080, 1920); }
  vstamp("CAN'T SLEEP… 👀", 540, 330, t, T.couldnt, T.three - .1, 78, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🚨🚨 ALARM 🚨🚨', 540, 330, t, T.alarm, T.ran, 90, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 pitch black outside, red flashes ---------- */
function kittenPathAt(t) {   // where the kitten is in the dark (eyes only)
  if (t < T.eyes - .3) return null;
  if (t < T.front - .1) { const k = ss(vprog(t, T.eyes - .3, T.eyes + .4)); return [lerp(880, 770, k), lerp(1215, 1250, k), lerp(.55, .7, k)]; }
  const k = eBack(vprog(t, T.front - .1, T.front + .35)); return [lerp(770, 660, k), lerp(1250, 1452, k), lerp(.7, 1.1, k)];
}
function sceneDark(t) {
  const zoom = 1 + .12 * vprog(t, T.ran, T.kitten);
  ctx.save(); zoomAbout(560, 1250, zoom);
  nightSet(t, { d: 1, plate: 'empty', step: true, on: true, alarm: 1 });
  const kp = kittenPathAt(t);
  const scared = t > T.gone - .2;
  benny(300, FEET, BS, { mood: scared ? 'surprised' : 'sad', look: t > T.front ? [1, .5] : t > T.gone ? [1, .8] : [.4, 0], talk: talkAt(t) });
  // darkness: only the red beacon flashes light things up
  const beat = Math.pow(Math.max(0, Math.sin((t - T.ran) * 2 * Math.PI * 1.25)), 5);
  const big = Math.max(...[T.gone].map(a => t >= a - .05 && t < a + .6 ? Math.sin(vprog(t, a - .05, a + .6) * Math.PI) : 0));
  const light = Math.max(beat * .55, big * .8);
  ctx.restore();
  ctx.fillStyle = `rgba(2,3,8,${.94 - .6 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = `rgba(255,30,30,${.22 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); zoomAbout(560, 1250, zoom);
  alarmBox(ALARM[0], ALARM[1], 1.5, true, t, 1);   // the beacon itself is always visible
  if (kp) kittenEyes(kp[0], kp[1], kp[2], vprog(t, T.eyes - .3, T.eyes + .1));
  ctx.restore();
  vstamp('PITCH BLACK…', 540, 330, t, T.pitch, T.noflash2, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🔦❌ NO FLASHLIGHT', 540, 330, t, T.noflash2, T.onlyred, 78, '#ffffff', .02, 'rgba(10,12,26,.9)');
  vstamp('THE SAUSAGE WAS GONE 😨', 540, 330, t, T.gone - .1, T.andthen, 70, '#ff4d6d', -.02, 'rgba(10,12,26,.9)');
  vstamp('👀', 540, 330, t, T.eyes - .1, T.kitten, 120, '#ffffff');
}
/* ---------- S7 it was a kitten ---------- */
function sceneKitten(t) {
  const zk = 1 + .22 * ss(vprog(t, T.tiny - .4, T.tiny + 1.2)) - .1 * ss(vprog(t, T.hungry - .2, T.hungry + 1));
  ctx.save(); zoomAbout(560, 1340, zk);
  nightSet(t, { d: 1, plate: 'empty', step: true, on: t < T.kitten + .8, alarm: 1, moon: vprog(t, T.kitten - .2, T.kitten + .6) });
  drawKitten(700, 1458, 1.4, { t, shiver: t < T.hungry + 1.5, sausage: true, look: t > T.hungry ? [-.8, -.6] : [-.4, .2], eyes: 'open' });
  benny(330, FEET + 6, BS, { pose: 'sit', mood: t > T.hungry ? 'sad' : 'hope', look: [1, .6], talk: talkAt(t) });
  if (t > T.hungry + .5) tear(330 + 24 * BS, FEET + 6 + (-132 - 56 + 30) * BS, 1.7, vprog(t, T.hungry + .5, T.likeme + .6));
  ctx.restore();
  const light = vprog(t, T.kitten - .15, T.kitten + .7);   // moonlight: the clouds open
  ctx.fillStyle = `rgba(4,6,16,${.94 - .62 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = `rgba(80,110,200,${.10 * light})`; ctx.fillRect(0, 0, 1080, 1920);
  snowfall(t, 40, 'rgba(220,230,255,.65)', .5);
  vstamp('IT WAS A KITTEN 🥺', 540, 330, t, T.kitten + .1, T.mouth, 84, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('…WITH MY SAUSAGE 🌭', 540, 330, t, T.mouth - .9, T.hungry, 72, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S8 taking her inside + the pigeon ---------- */
function pigeonAt(t) {
  const a = T.pigeon - .8, b = T.second + .1, c = T.classic - .1;
  if (t < a || t > c + .3) return null;
  if (t < b) { const k = ss(vprog(t, a, b)); return { x: lerp(1180, STEP[0] + 30, k), y: lerp(560, STEP[1] - 8, k) - Math.sin(k * Math.PI) * 60, flap: t * 26, face: -1, sausage: false }; }
  const k = ss(vprog(t, b + .15, c)); return { x: lerp(STEP[0] + 30, 1250, k), y: lerp(STEP[1] - 8, 420, k), flap: k > .05 ? t * 26 : 0, face: 1, sausage: true };
}
function sceneInside(t) {
  nightSet(t, { d: 1, plate: 'empty', step: t < T.second + .25, on: false, alarm: 1, moon: 1, win: .9, door: ss(vprog(t, T.took, T.took + .8)), doorLight: 1 });
  const go = vprog(t, T.took - .1, T.ofcourse), bx = lerp(330, 600, ss(go)), turned = t > T.pigeon - .2;
  benny(bx, FEET, BS, { mood: t > T.classic - .1 ? 'happy' : turned ? 'sad' : 'hope', walk: go > 0 && go < 1 ? t * 9 : 0, look: turned ? [.9, -.4] : [.6, 0], talk: talkAt(t) });
  drawKitten(bx + 6, FEET - 58 * BS, .78, { pose: 'held', t, look: turned ? [1, -.4] : [0, .3] });
  for (const sd of [-1, 1]) circle(ctx, bx + sd * 50, FEET - 66 * BS, 15 * BS, '#e8b896', O_, 5);
  const pg = pigeonAt(t); if (pg) drawPigeon(pg.x, pg.y, 1.25, pg.flap, pg.face, { sausage: pg.sausage });
  ctx.fillStyle = 'rgba(4,6,16,.34)'; ctx.fillRect(0, 0, 1080, 1920); ctx.fillStyle = 'rgba(80,110,200,.10)'; ctx.fillRect(0, 0, 1080, 1920);
  snowfall(t, 40, 'rgba(220,230,255,.65)', .5);
  vstamp('THE PIGEON 😤', 540, 330, t, T.pigeon - .1, T.classic - .1, 92, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('CLASSIC. 🙄', 540, 330, t, T.classic - .1, T.morning, 92, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S9 the morning: kitten on his chest → RENT DAY ---------- */
function sceneMorning(t) {
  vanRoom(t, { morning: true });
  const wake = t > T.remember - .1, jump = eBack(vprog(t, T.rent2 - .1, T.rent2 + .3));
  if (!(t > T.rent2 - .1)) {
    benny(540, 1400, 1.5, { pose: 'sit', mood: wake ? 'surprised' : 'hope', blink: !wake, look: [0, 0], talk: talkAt(t) }); blanket(1235, 1);
    drawKitten(560, 1262, .8, { pose: 'curl', t });
    if (!wake) for (let q = 0; q < 3; q++) { const ph = (t * .6 + q / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); otxt('z', 640 + ph * 60 + q * 8, 1120 - ph * 120, 40 + q * 8, '#ffffff', 5); ctx.restore(); }
  } else {
    for (let k = 0; k < 22; k++) { const q = vprog(t, T.rent2, T.rent2 + 1.5), a = -Math.PI * (.1 + .8 * rnd(k)), d = 200 + q * (260 + rnd(k + 3) * 420); if (q > 0 && q < 1) coin(470 + Math.cos(a) * d, 1000 + Math.sin(a) * d * .8 + q * q * 260, 20, 1 - q); }
    blanket(1315, 1); drawKitten(760, 1300, .8, { t, look: [-1, -.6] });
    benny(470, 1400 - jump * 120 - Math.abs(Math.sin((t - T.rent2) * 6)) * 30, 1.5, { mood: 'happy', armsUp: true, talk: talkAt(t) });
  }
  vstamp('☀️ THE NEXT MORNING', 540, 330, t, T.morning + .1, T.remember - .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  if (t > T.rent2 - .1) { const k = eBack(vprog(t, T.rent2 - .1, T.rent2 + .25)), p = 1 + .05 * Math.sin(t * 7); ctx.save(); ctx.translate(540, 360); ctx.scale(k * p, k * p);
    const g = ctx.createLinearGradient(-430, 0, 430, 0); g.addColorStop(0, '#ffb703'); g.addColorStop(1, '#ffd23f'); rrect(ctx, -440, -100, 880, 200, 50); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke();
    otxt('💰 RENT DAY 💰', 0, 4, 120, '#1b1728', 0); ctx.restore(); }
}
/* ---------- S11 never had this much money ---------- */
function sceneRich(t) {
  dayScene(t, {});
  for (let k = 0; k < 26; k++) { const x = 520 + (k % 7) * 34 - Math.floor(k / 7) * 17 + Math.floor(k / 7) * 0, y = FEET + 6 - Math.floor(k / 7) * 20; coin(x - 40 + Math.floor(k / 7) * 17, y, 22); }
  drawKitten(720, FEET + 8, .9, { t, look: [-1, -.7] });
  benny(330, FEET, BS, { mood: 'happy', armsUp: Math.sin(t * 3) > .3, look: [0, 0], talk: talkAt(t) });
  tear(330 - 24 * BS, FEET + (-140 - 56 + 30) * BS, 1.2, vprog(t, T.never + .3, T.life + .4));
  tear(330 + 24 * BS, FEET + (-140 - 56 + 30) * BS, 1.2, vprog(t, T.never + .9, T.life + .6));
  bankPanel(58320, 1, 0, 'RENT DAY 💰');
  for (let k = 0; k < 18; k++) { const ph = (t * .7 + rnd(k)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', rnd(k + 9) * 1080, 600 + rnd(k + 5) * 900 - ph * 80, 40); ctx.restore(); }
}
/* ---------- S14 the decision + poll ---------- */
function sceneDecide(t) {
  dayScene(t, {});
  drawKitten(150, FEET + 8, .9, { t, look: t > T.kneeds ? [0, .2] : [1, -.6] });
  if (t > T.kneeds) { const k = eBack(vprog(t, T.kneeds, T.kneeds + .35)); ctx.save(); ctx.translate(120, FEET + 60); ctx.scale(k, k); ellipse(ctx, 0, -14, 70, 26, '#c95d8b', O_, 5); ellipse(ctx, 0, -20, 50, 14, '#f7c8d8'); ctx.restore();
    ctx.save(); ctx.translate(250, FEET + 64); ctx.scale(k, k); ellipse(ctx, 0, -10, 34, 14, '#4da3ff', O_, 4); ctx.restore(); }
  benny(400, FEET, BS, { mood: 'happy', armsUp: vin(t, T.real - .2, T.fix - .3), look: t > T.fix ? [1, -.4] : [-.2, 0], talk: talkAt(t) });
  bankPanel(58320, vprog(t, T.so, T.so + .3) * (1 - vprog(t, T.vote - .2, T.vote + .1)), 0);
  const bub = (s, x, y, t0) => { if (t < t0 || t > T.vote) return; const k = eBack(vprog(t, t0, t0 + .3)); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = F(46); const w = ctx.measureText(s).width + 70; panel(-w / 2, -54, w, 108, 40, 'rgba(10,12,26,.92)', '#ffd23f', 4); otxt(s, 0, 2, 46, '#ffffff', 0); ctx.restore(); };
  bub('🔧 Van €250', 790, 850, T.fix - .1); bub('🏠 Cabin €320', 270, 700, T.cabin); bub('🐱 Kitten €60', 230, 1170, T.kneeds);
  vstamp('💸 REAL MONEY!', 540, 560, t, T.real - .2, T.fix - .2, 84, '#46e08a', -.02, 'rgba(10,12,26,.88)');
}
function pollCard(t) {
  if (t < T.vote) return; const k = eBack(vprog(t, T.vote, T.vote + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.vote, T.vote + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 720); ctx.scale(k, k);
  panel(-460, -330, 920, 660, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT DO I BUY', 0, -255, 60, '#ffd23f', 8); otxt('WITH THE RENT? 💰', 0, -188, 56, '#ffd23f', 8);
  [['🔧', 'Fix the van', '€250'], ['🏠', 'Wooden cabin', '€320'], ['🐱', 'Kitten starter pack', '€60']].forEach(([e, s, p], i) => { const y = -75 + i * 120, kk = eBack(vprog(t, T.vote + .3 + i * .18, T.vote + .6 + i * .18));
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk); panel(-410, -48, 820, 96, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 52); txt(s, -300, 2, 44, '#ffffff', 'left', 'middle'); txt(p, 380, 2, 44, '#46e08a', 'right', 'middle'); ctx.restore(); });
  txt('Vote in the poll 👇  ·  top 2 get bought', 0, 290, 34, '#c3c9e4', 'center', 'middle'); ctx.restore();
  if (t >= T.name - .1) { const kk = eBack(vprog(t, T.name - .1, T.name + .2)); ctx.save(); ctx.translate(540, 1160); ctx.scale(kk, kk); panel(-420, -58, 840, 116, 40, '#ffd23f', '#fff', 5); otxt('🐱 NAME HER IN THE COMMENTS 👇', 0, 2, 46, '#1b1728', 0); ctx.restore(); }
  if (t >= T.end + .3) { const kk = eBack(vprog(t, T.end + .3, T.end + .6)); ctx.save(); ctx.translate(540, 1420); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
