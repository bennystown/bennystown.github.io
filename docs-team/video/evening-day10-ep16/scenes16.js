/* ======================= FOLGE 16 SCENES ======================= */
const GROUND = 1250, FEET = 1440, BS = 1.55;
const VX = 560, VY = 1330, VS = .9;
function bgDay(t, o) {   // snowy forest + sky (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#9cc9ee', '#3b4a7a', d), mixc('#e3f0fa', '#f6a27a', d), GROUND);
  if (d < .5) { circle(ctx, 880, 300, 70, `rgba(255,240,180,${.9 * (1 - d * 2)})`); }
  forest(GROUND - 20, mixc('#3f6e58', '#2a4a3c', d), true, o.seed || 3);
  snowGround(GROUND, mixc('#eef3fa', '#d9dfee', d));
}
/* ---------- S1 hook: the vote ---------- */
function sceneHook(t) {
  bgDay(t);
  vanSide(VX, VY, VS, { snowRoof: true });
  drawKitten(250, FEET + 6, .95, { t, look: [1, -.6] });
  benny(420, FEET, BS, { mood: 'happy', armsUp: vin(t, T.everything - .1, T.building - .2) || t > T.middle, look: [-.3, 0], talk: talkAt(t) });
  // poll result card
  const k = eBack(vprog(t, .15, .5)); ctx.save(); ctx.translate(540, 470); ctx.scale(k, k);
  panel(-430, -170, 860, 340, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('YOU VOTED 🗳️', 0, -112, 52, '#ffd23f', 7);
  [['🐱', 'Kitten pack', '61%', '#46e08a', .61], ['🏠', 'Wooden cabin', '22%', '#46e08a', .22], ['🔧', 'Fix the van', '17%', '#9aa3c7', .17]].forEach(([e, s, p, c, f], i) => {
    const y = -36 + i * 78, kk = vprog(t, .5 + i * .2, 1.2 + i * .2); rrect(ctx, -390, y - 30, 780, 60, 22); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
    rrect(ctx, -390, y - 30, 780 * f * kk, 60, 22); ctx.fillStyle = i < 2 ? 'rgba(70,224,138,.35)' : 'rgba(255,255,255,.12)'; ctx.fill();
    emoji(ctx, e, -350, y + 1, 40); txt(s, -310, y + 1, 36, '#fff', 'left', 'middle'); txt(p, 300, y + 1, 36, c, 'right', 'middle');
    if (i < 2 && t > T.everything + i * .9) { const kk2 = eBack(vprog(t, T.everything + i * .9, T.everything + i * .9 + .3)); ctx.save(); ctx.translate(352, y); ctx.scale(kk2, kk2); circle(ctx, 0, 0, 24, '#46e08a', '#fff', 4); otxt('✓', 0, 2, 32, '#fff', 0); ctx.restore(); } });
  ctx.restore();
  vstamp('🐱 + 🏠 = BOTH!', 540, 830, t, T.building - .1, T.middle, 84, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('📍 MIDDLE OF MY SQUARE', 540, 830, t, T.middle, T.kpack, 70, '#ffffff', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S2 shop: kitten pack + wood ---------- */
function packBox(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -70, -110, 140, 110, 10); ctx.fillStyle = '#ff8fb1'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke(); emoji(ctx, '🐱', 0, -60, 58); ctx.restore(); }
function sceneShop(t) {
  sky('#a9d3f2', '#dcecf8', GROUND); forest(GROUND - 30, '#4c7d66', true, 11); snowGround(GROUND);
  const X0 = 110, X1 = 1030, top = 560, cy = 1080;
  rrect(ctx, X0 + 30, top + 120, X1 - X0 - 60, GROUND - top - 120, 6); ctx.fillStyle = '#f3e3c3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#7a5636'; ctx.fillRect(X0 + 60, top + 300, X1 - X0 - 120, 14);
  for (let k = 0; k < 9; k++) { rrect(ctx, X0 + 90 + k * 88, top + 236, 62, 64, 8); ctx.fillStyle = ['#4da3ff', '#ff8a3d', '#3ddc84', '#b07cff', '#ffd23f', '#ff4d6d'][k % 6]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  const aw = (X1 - X0) / 8; for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e23d3d'; ctx.fillRect(X0 + k * aw, top + 30, aw, 92); ctx.beginPath(); ctx.arc(X0 + k * aw + aw / 2, top + 122, aw / 2, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.strokeRect(X0, top + 30, X1 - X0, 92);
  rrect(ctx, 420, top - 50, 240, 90, 20); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); otxt('SHOP', 540, top - 4, 62, '#1b1728', 0);
  rrect(ctx, X0 + 10, cy, X1 - X0 - 20, GROUND - cy + 30, 8); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = '#a8743f'; ctx.fillRect(X0 + 10, cy, X1 - X0 - 20, 26); ctx.strokeRect(X0 + 10, cy, X1 - X0 - 20, 26);
  const g1 = vprog(t, T.sixty + .5, T.sixty + .8), g2 = vprog(t, T.three + .9, T.three + 1.2);
  if (g1 < 1) { ctx.save(); ctx.globalAlpha = 1 - g1; packBox(640, cy + 4 - g1 * 60, 1.1); ctx.restore(); if (t < T.sixty + .4) priceTag('€60', 700, cy - 150, .1); }
  if (g2 < 1) { ctx.save(); ctx.globalAlpha = 1 - g2; woodStack(880, cy + 2 - g2 * 60, .7, 8); ctx.restore(); if (t < T.three + .8) priceTag('€320', 900, cy - 170, -.08); }
  for (const [s0, x] of [[T.sixty, 640], [T.three + .4, 880]]) if (t >= s0 && t < s0 + 1.2) { const k = eBack(vprog(t, s0, s0 + .25)); ctx.save(); ctx.translate(x, cy - 210); ctx.scale(k, k); ctx.rotate(-.12); panel(-92, -34, 184, 68, 16, '#3ddc84', '#fff', 4); otxt('SOLD ✓', 0, 2, 40, '#fff', 0); ctx.restore(); }
  const wk = vprog(t, T.kpack - .3, T.kpack + 1.2), bx = lerp(-170, 330, ss(wk));
  benny(bx, FEET, BS, { mood: 'happy', walk: wk > 0 && wk < 1 ? t * 10 : 0, look: [1, .1], talk: talkAt(t) });
  if (t > T.sixty + .6) packBox(bx + 150, FEET + 6, .75);
  if (t > T.three + 1.0) woodStack(bx + 40, FEET + 40, .45, 8);
  const cents = t < T.sixty ? 58320 : t < T.three + .4 ? lerp(58320, 52320, ss(vprog(t, T.sixty, T.sixty + .5))) : lerp(52320, 20320, ss(vprog(t, T.three + .4, T.three + 1.0)));
  bankPanel(Math.round(cents), vprog(t, T.kpack - .2, T.kpack + .1), 0);
  floatTxt('−€60', 830, 300, t, T.sixty, '#ff4d6d', 70); floatTxt('−€320', 830, 300, t, T.three + .4, '#ff4d6d', 70);
  vstamp('🐱 KITTEN PACK', 540, 462, t, T.kpack, T.wood - .1, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🪵 WOOD FOR A CABIN', 540, 462, t, T.wood - .1, T.bed - .2, 70, '#ffd23f', .02, 'rgba(10,12,26,.88)');
}
/* ---------- S3 unboxing in the warm van (heater on!) ---------- */
function vanInside(t, o) {
  o = o || {};
  ctx.fillStyle = '#4b4f6e'; ctx.fillRect(0, 0, 1080, 1920);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; ctx.fillRect(k * 120, 0, 120, 1920); }
  rrect(ctx, 250, 330, 580, 420, 22); ctx.fillStyle = '#c9ccd6'; ctx.fill();
  ctx.save(); rrect(ctx, 270, 350, 540, 380, 14); ctx.clip(); const g = ctx.createLinearGradient(0, 350, 0, 730); g.addColorStop(0, '#5b6fa8'); g.addColorStop(1, '#f3b48a'); ctx.fillStyle = g; ctx.fillRect(270, 350, 540, 380);
  ctx.fillStyle = '#eef3fa'; ctx.fillRect(270, 650, 540, 80); for (let k = 0; k < 6; k++) pine(300 + k * 100, 660, 120, '#2e5544', true); snowfall(t, 25, 'rgba(255,255,255,.85)', .5); ctx.restore(); line(ctx, 540, 350, 540, 730, '#c9ccd6', 16);
  ctx.fillStyle = '#5a4030'; ctx.fillRect(0, 1380, 1080, 540);
  heater(900, 1400, .9, 1, t);
}
function sceneUnbox(t) {
  vanInside(t);
  const ib = eBack(vprog(t, T.bed - .05, T.bed + .25)), iw = eBack(vprog(t, T.bowl - .05, T.bowl + .25)), im = eBack(vprog(t, T.mouse - .05, T.mouse + .25));
  if (ib > 0) { ctx.save(); ctx.translate(430, 1600); ctx.scale(ib, ib); catBed(0, 0, 1.5); ctx.restore(); }
  if (iw > 0) { ctx.save(); ctx.translate(700, 1640); ctx.scale(iw, iw); catBowl(0, 0, 1.6); ctx.restore(); }
  if (im > 0) { ctx.save(); ctx.translate(860, 1660); ctx.scale(im, im); toyMouse(0, 0, 1.6, t); ctx.restore(); }
  // the box: at "BOX" the kitten jumps in
  const inBox = t > T.box - .2, jump = vprog(t, T.box - .5, T.box - .1);
  cardboardBox(180, 1560, 1.0, inBox ? { t, look: [1, -.3], eyes: 'open' } : null);
  if (!inBox) { const kx = lerp(560, 190, ss(jump)), ky = 1580 - Math.sin(jump * Math.PI) * 260; drawKitten(kx, ky, .95, { t, look: t > T.loves ? [-1, 0] : [1, .2] }); }
  const fp = t > T.ofcourse - .1;   // facepalm
  benny(560, 1450, 1.45, { pose: 'sit', mood: fp ? 'happy' : 'hope', look: inBox ? [-1, .4] : [-.4, .4], blink: fp && t < T.ofcourse + .5, talk: talkAt(t) });
  vstamp('🛏️ A BED', 540, 330, t, T.bed, T.bowl, 84, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🥣 A BOWL', 540, 330, t, T.bowl, T.mouse, 84, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('🐭 A TOY MOUSE', 540, 330, t, T.mouse, T.loves, 80, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('SHE LOVES IT… 🥹', 540, 330, t, T.loves, T.box - .1, 80, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('…SHE LOVES THE BOX 📦😂', 540, 330, t, T.box - .1, T.okay - .2, 68, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S4 the build, in the middle of the square ---------- */
function buildK(t) {
  if (t < T.one) return 0;
  if (t < T.ow) return .26 * ss(vprog(t, T.one, T.two + .5));
  if (t < T.who - .4) return .26;
  if (t < T.roof + .2) return lerp(.26, .74, ss(vprog(t, T.who - .4, T.roof + .2)));
  if (t < T.walls - .2) return .74;
  return lerp(.74, 1, ss(vprog(t, T.walls - .2, T.chimney + .6)));
}
function sceneBuild(t) {
  const dusk = vprog(t, T.walls, T.done + .3) * .45;
  bgDay(t, { dusk, seed: 7 });
  // the square: stone plaza with a lawn in the middle
  ctx.fillStyle = mixc('#b7b0a0', '#8f8a82', dusk); ctx.fillRect(-10, GROUND + 10, 1100, 90); ctx.fillStyle = mixc('#a49d8c', '#7f7a72', dusk); ctx.fillRect(-10, GROUND + 100, 1100, 700);
  ellipse(ctx, 540, GROUND + 120, 460, 70, mixc('#5aa868', '#3f7a4c', dusk), '#3f8a4e', 4);
  const k = buildK(t);
  cabinSide(540, GROUND + 120, .95, k, t);
  // pigeon on the roof (from "who's sitting on my roof")
  if (t > T.who - .6) { const land = ss(vprog(t, T.who - .6, T.who + .2)), py = GROUND + 120 - (14 + 330 + 210) * .95 + 6, px = 540; drawPigeon(lerp(1150, px, land), lerp(500, py, land) - Math.sin(land * Math.PI) * 60, 1.0, land < 1 ? t * 26 : 0, -1); }
  woodStack(150, FEET + 60, .5, Math.max(0, Math.round(8 * (1 - k))));
  // Benny with the hammer, hurt thumb, then happy
  const hurt = vin(t, T.ow - .1, T.who - .3), hop = hurt ? Math.abs(Math.sin((t - T.ow) * 9)) * 50 : 0, bx = 250, done = t > T.done - .1;
  benny(bx, FEET + 40 - hop, 1.35, { mood: hurt ? 'sad' : done || t > T.fine ? 'happy' : 'hope', armsUp: done && t < T.middle2, look: t > T.who && t < T.fine + .4 ? [1, -1] : [1, -.2], talk: talkAt(t) });
  if (!hurt && !done) { const sw = t < T.ow || (t > T.walls - .2 && t < T.done) ? Math.sin(t * 14) * .6 : 0; hammer(bx + 100, FEET + 40 - 70, .8, .5 + sw); }
  if (hurt) { const q = vprog(t, T.ow - .1, T.ow + .5); ctx.save(); ctx.globalAlpha = 1 - q * .6; for (let s = 0; s < 8; s++) { const a = s / 8 * 6.283; line(ctx, bx + 110 + Math.cos(a) * (20 + q * 40), FEET - 60 + Math.sin(a) * (20 + q * 40), bx + 110 + Math.cos(a) * (40 + q * 70), FEET - 60 + Math.sin(a) * (40 + q * 70), '#ffd23f', 7); } ctx.restore(); }
  if (vin(t, T.one - .1, T.ow)) for (let q = 0; q < 2; q++) { const tt = [T.one, T.two][q]; floatTxt('+1 🪵', 760, 1000 - q * 60, t, tt, '#ffd23f', 56); }
  if (done) for (let s = 0; s < 22; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 500 + rnd(s + 9) * 700 - ph * 60, 44); ctx.restore(); }
  vstamp('🔨 TIME TO BUILD', 540, 330, t, T.time - .1, T.ow - .1, 80, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('OW!! 👍💥', 540, 330, t, T.ow - .1, T.who - .1, 100, '#ff4d6d', .02, 'rgba(10,12,26,.9)');
  vstamp('THE PIGEON. AGAIN. 🙄', 540, 330, t, T.pigeon - .3, T.walls - .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🧱 WALLS · ROOF · CHIMNEY', 540, 330, t, T.walls - .2, T.done - .1, 64, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp("🏡 IT'S DONE!", 540, 330, t, T.done - .1, T.realc + 1.2, 100, '#46e08a', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S6 first night inside the cabin ---------- */
function sceneNight(t) {
  ctx.fillStyle = '#7a5232'; ctx.fillRect(0, 0, 1080, 1920);
  for (let q = 0; q < 26; q++) { const y = q * 56; rrect(ctx, -20, y, 1120, 54, 27); ctx.fillStyle = q % 2 ? '#8a5c34' : '#7d5230'; ctx.fill(); line(ctx, 0, y + 53, 1080, y + 53, 'rgba(40,25,15,.35)', 3); }
  rrect(ctx, 290, 330, 500, 400, 20); ctx.fillStyle = '#5b3a2a'; ctx.fill();
  ctx.save(); rrect(ctx, 310, 350, 460, 360, 12); ctx.clip(); const g = ctx.createLinearGradient(0, 350, 0, 710); g.addColorStop(0, '#0d1430'); g.addColorStop(1, '#1f2a55'); ctx.fillStyle = g; ctx.fillRect(310, 350, 460, 360);
  circle(ctx, 680, 430, 40, 'rgba(240,244,255,.95)'); for (let k = 0; k < 30; k++) circle(ctx, 310 + rnd(k + 5) * 460, 350 + rnd(k + 8) * 200, 2, 'rgba(255,255,255,.7)');
  ctx.fillStyle = '#e2e8f3'; ctx.fillRect(310, 640, 460, 80); for (let k = 0; k < 5; k++) pine(340 + k * 100, 650, 110, '#0f1d18', '#9aa6c0'); snowfall(t, 25, 'rgba(255,255,255,.8)', .4); ctx.restore();
  line(ctx, 540, 350, 540, 710, '#5b3a2a', 14); line(ctx, 310, 530, 770, 530, '#5b3a2a', 14);
  ctx.fillStyle = '#4a3020'; ctx.fillRect(0, 1380, 1080, 540); for (let q = 0; q < 6; q++) line(ctx, 0, 1420 + q * 80, 1080, 1420 + q * 80, 'rgba(0,0,0,.18)', 4);
  heater(910, 1420, .85, 1, t);
  const gw = ctx.createRadialGradient(540, 1100, 100, 540, 1100, 1100); gw.addColorStop(0, 'rgba(255,190,110,.18)'); gw.addColorStop(1, 'rgba(255,160,80,0)'); ctx.fillStyle = gw; ctx.fillRect(0, 0, 1080, 1920);
  catBed(620, 1600, 1.0); catBowl(780, 1640, 1.0);
  const peek = t > T.still - .2;
  cardboardBox(220, 1600, .95, { t, look: t > T.but ? [0, 0] : [1, -.3], eyes: t < T.warm + 1.2 && t > T.warm - .5 ? 'closed' : 'open', bob: peek ? 0 : 30 });
  benny(450, 1470, 1.4, { pose: 'sit', mood: 'happy', look: t > T.still ? [-1, .3] : [0, 0], talk: talkAt(t) });
  vstamp('🏡 FIRST NIGHT AT HOME', 540, 260, t, T.first, T.warm, 70, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('…STILL IN THE BOX 📦', 540, 260, t, T.still - .3, T.but, 72, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('🐱 SHE NEEDS A NAME', 540, 260, t, T.but, T.tomorrow, 76, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('TOMORROW YOU DECIDE 🗳️', 540, 260, t, T.tomorrow, T.drop, 70, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
function endCards(t) {
  if (t >= T.drop - .1) { const kk = eBack(vprog(t, T.drop - .1, T.drop + .2)); ctx.save(); ctx.translate(540, 300); ctx.scale(kk, kk); panel(-440, -64, 880, 128, 44, '#ffd23f', '#fff', 5); otxt('💬 DROP A NAME 👇', 0, 2, 60, '#1b1728', 0); ctx.restore(); }
  if (t >= T.end + .2) { const kk = eBack(vprog(t, T.end + .2, T.end + .5)); ctx.save(); ctx.translate(540, 1120); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
