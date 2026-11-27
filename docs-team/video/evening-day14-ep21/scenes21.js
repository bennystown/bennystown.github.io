/* ======================= FOLGE 21 — snow plow + salt truck, everyone moves in (Fri 27.11.) ======================= */
const GROUND = 1250, FEET = 1440, BS = 1.55;
function bgSnow(t, o) {   // snowy forest (NO row of houses — Kieran)
  o = o || {}; const d = o.dusk || 0;
  sky(mixc('#b8c6d8', '#3b4a7a', d), mixc('#e9eef5', '#f6a27a', d), GROUND); forest(GROUND - 20, mixc('#4d6f63', '#2a4a3c', d), true, o.seed || 3);
  snowGround(GROUND - (o.deep || 0), mixc('#f4f7fb', '#d9dfee', d)); if (o.n !== 0) snowfall(t, o.n || 120, 'rgba(255,255,255,.95)', o.sp || .7);
}
/* ---------- vehicles (side view, facing right, (x,y) = ground under the middle) ---------- */
function wheel(x, y, r, t) { circle(ctx, x, y, r, '#24242c', O_, 6); circle(ctx, x, y, r * .45, '#b9bcc6', O_, 4); ctx.save(); ctx.translate(x, y); ctx.rotate(t * 8); line(ctx, -r * .4, 0, r * .4, 0, '#6b6f7c', 4); ctx.restore(); }
function cabWindow(x, y, w, h, t, o) {   // window with Benny (and his hat) inside
  rrect(ctx, x, y, w, h, 14); ctx.fillStyle = '#bfe0f7'; ctx.fill();
  ctx.save(); rrect(ctx, x, y, w, h, 14); ctx.clip(); benny(x + w * .5, y + h + 150, .95, { mood: o.mood || 'happy', look: [1, 0], talk: talkAt(t), armsUp: false }); ctx.restore();
  ctx.save(); rrect(ctx, x, y, w, h, 14); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
  line(ctx, x + 10, y + 12, x + w * .35, y + 12, 'rgba(255,255,255,.7)', 6);
}
function plowTruck(x, y, s, t, o) {
  o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; const bob = Math.sin(t * 14) * 3;
  ellipse(ctx, 0, 8, 330, 24, 'rgba(0,0,0,.18)');
  ctx.translate(0, bob);
  rrect(ctx, -300, -150, 400, 110, 18); ctx.fillStyle = '#ff8a1f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();   // body
  for (let q = 0; q < 5; q++) { ctx.fillStyle = q % 2 ? '#1b1728' : '#ffd23f'; poly(ctx, [[-290 + q * 70, -60], [-250 + q * 70, -60], [-220 + q * 70, -40], [-260 + q * 70, -40]], ctx.fillStyle); }
  rrect(ctx, 40, -330, 210, 290, 24); ctx.fillStyle = '#ff8a1f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();   // cab
  cabWindow(70, -300, 150, 120, t, o);
  rrect(ctx, 110, -362, 60, 30, 10); ctx.fillStyle = (Math.sin(t * 10) > 0) ? '#ffd23f' : '#ff6a00'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();   // beacon
  if (Math.sin(t * 10) > 0) circle(ctx, 140, -350, 60, 'rgba(255,200,60,.25)');
  rrect(ctx, 236, -110, 60, 40, 8); ctx.fillStyle = '#ffe9a8'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();   // headlight
  // the blade
  line(ctx, 250, -80, 330, -80, '#4b4f5e', 14);
  ctx.save(); ctx.translate(360, -10); ctx.rotate(-.08); poly(ctx, [[-30, -150], [40, -170], [70, 0], [-30, 0]], '#ffd23f', O_, 6);
  for (let q = 0; q < 3; q++) line(ctx, -20, -120 + q * 40, 50, -130 + q * 40, 'rgba(0,0,0,.15)', 5); ctx.restore();
  wheel(-210, -30, 56, t); wheel(-50, -30, 56, t); wheel(160, -30, 56, t);
  ctx.restore();
}
function saltTruck(x, y, s, t, o) {
  o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; const bob = Math.sin(t * 12) * 3;
  ellipse(ctx, 0, 8, 330, 24, 'rgba(0,0,0,.18)'); ctx.translate(0, bob);
  poly(ctx, [[-320, -330], [80, -330], [40, -150], [-280, -150]], '#3f7fd9', O_, 6);   // hopper
  rrect(ctx, -330, -350, 420, 32, 12); ctx.fillStyle = '#2f62ad'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 5; ctx.stroke();
  for (let q = 0; q < 9; q++) circle(ctx, -300 + q * 44, -352 - (q % 2) * 10, 22, '#f7fbff', 'rgba(150,170,200,.8)', 2);   // salt heap
  rrect(ctx, -170, -290, 120, 70, 14); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); otxt('SALT', -110, -253, 34, '#2f62ad', 0);
  rrect(ctx, -320, -150, 420, 110, 16); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  rrect(ctx, 60, -330, 200, 290, 24); ctx.fillStyle = '#3f7fd9'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  cabWindow(88, -300, 140, 120, t, o);
  rrect(ctx, 246, -110, 50, 40, 8); ctx.fillStyle = '#ffe9a8'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke();
  // spinner at the back
  ctx.save(); ctx.translate(-350, -60); ctx.rotate(t * 12); poly(ctx, [[-30, -6], [30, -6], [30, 6], [-30, 6]], '#4b4f5e', O_, 3); poly(ctx, [[-6, -30], [6, -30], [6, 30], [-6, 30]], '#4b4f5e', O_, 3); ctx.restore();
  wheel(-220, -30, 56, t); wheel(-60, -30, 56, t); wheel(170, -30, 56, t);
  ctx.restore();
}
function scrollPines(t, sp, base, seed, col) { for (let k = -1; k < 9; k++) { const w = 1500, x = ((k * 190 - t * sp) % w + w) % w - 200; pine(x, base + (k % 3) * 14, 300 + rnd(k + seed) * 120, col || '#4d6f63', true); } }
/* ---------- S1 hook: poll result ---------- */
const POLL = [['🚜', 'Snow plow', '72%', .72], ['🧂', 'Salt truck', '19%', .19], ['💪', 'Benny shovels alone', '6%', .06], ['🛷', 'Sleds for everyone', '3%', .03]];
function sceneHook(t) {
  bgSnow(t, { deep: 100, seed: 5 });
  benny(540, FEET + 40, BS, { mood: 'happy', armsUp: t > T.plow - .2, look: [0, -.2], talk: talkAt(t) });
  const k = eBack(vprog(t, .1, .45)); ctx.save(); ctx.translate(540, 560); ctx.scale(k, k);
  panel(-450, -230, 900, 460, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('YOU VOTED 🗳️', 0, -168, 56, '#ffd23f', 7);
  POLL.forEach(([e, s, p, f], i) => { const y = -78 + i * 84, kk = vprog(t, .45 + i * .15, 1.3 + i * .15), top = i < 2;
    rrect(ctx, -410, y - 32, 820, 64, 22); ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fill();
    rrect(ctx, -410, y - 32, Math.max(1, 820 * f * kk), 64, 22); ctx.fillStyle = top ? 'rgba(70,224,138,.38)' : 'rgba(255,255,255,.12)'; ctx.fill();
    emoji(ctx, e, -370, y + 1, 42); txt(s, -325, y + 2, 38, '#fff', 'left', 'middle'); txt(p, 300, y + 2, 38, top ? '#46e08a' : '#9aa3c7', 'right', 'middle');
    const tc = i === 0 ? T.plow - .1 : T.both - .3; if (top && t > tc) { const k2 = eBack(vprog(t, tc, tc + .3)); ctx.save(); ctx.translate(366, y); ctx.scale(k2, k2); circle(ctx, 0, 0, 26, '#46e08a', '#fff', 4); otxt('✓', 0, 2, 34, '#fff', 0); ctx.restore(); } });
  ctx.restore();
  vstamp('🚜 + 🧂 = BOTH!', 540, 980, t, T.both - .2, T.hund - .3, 92, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S2 shop ---------- */
function toyPlow(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); emoji(ctx, '🚜', 0, -60, 120); ctx.restore(); }
function sceneShop(t) {
  sky('#b8c6d8', '#e9eef5', GROUND); forest(GROUND - 30, '#4d6f63', true, 11); snowGround(GROUND);
  const X0 = 110, X1 = 1030, top = 560, cy = 1080;
  rrect(ctx, X0 + 30, top + 120, X1 - X0 - 60, GROUND - top - 120, 6); ctx.fillStyle = '#f3e3c3'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#7a5636'; ctx.fillRect(X0 + 60, top + 300, X1 - X0 - 120, 14);
  for (let k = 0; k < 9; k++) { rrect(ctx, X0 + 90 + k * 88, top + 236, 62, 64, 8); ctx.fillStyle = ['#4da3ff', '#ff8a3d', '#3ddc84', '#b07cff', '#ffd23f', '#ff4d6d'][k % 6]; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 4; ctx.stroke(); }
  const aw = (X1 - X0) / 8; for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : '#e23d3d'; ctx.fillRect(X0 + k * aw, top + 30, aw, 92); ctx.beginPath(); ctx.arc(X0 + k * aw + aw / 2, top + 122, aw / 2, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.strokeRect(X0, top + 30, X1 - X0, 92);
  rrect(ctx, 420, top - 50, 240, 90, 20); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); otxt('SHOP', 540, top - 4, 62, '#1b1728', 0);
  rrect(ctx, X0 + 10, cy, X1 - X0 - 20, GROUND - cy + 30, 8); ctx.fillStyle = '#8a5a34'; ctx.fill(); ctx.strokeStyle = O_; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = '#a8743f'; ctx.fillRect(X0 + 10, cy, X1 - X0 - 20, 26); ctx.strokeRect(X0 + 10, cy, X1 - X0 - 20, 26);
  const s1 = T.hund + .2, s2 = T.hund + 1.2;
  emoji(ctx, '🚜', 640, cy - 70, 130); emoji(ctx, '🧂', 880, cy - 64, 120);
  if (t < s1 + .3) priceTag('€70', 700, cy - 190, .1); if (t < s2 + .3) priceTag('€40', 920, cy - 190, -.08);
  for (const [s0, x] of [[s1, 640], [s2, 880]]) if (t >= s0) { const k = eBack(vprog(t, s0, s0 + .25)); ctx.save(); ctx.translate(x, cy - 200); ctx.scale(k, k); ctx.rotate(-.12); panel(-92, -34, 184, 68, 16, '#3ddc84', '#fff', 4); otxt('SOLD ✓', 0, 2, 40, '#fff', 0); ctx.restore(); }
  const wk = vprog(t, T.hund - .4, T.hund + .6), bx = lerp(-170, 330, ss(wk)), gulp = t > T.hund + 1.6 && t < T.worth - .1;
  benny(bx, FEET, BS, { mood: gulp ? 'surprised' : 'happy', walk: wk > 0 && wk < 1 ? t * 10 : 0, look: [1, .1], talk: talkAt(t) });
  if (gulp) for (let q = 0; q < 2; q++) { const ph = (t * 1.2 + q / 2) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '💦', bx - 120 + q * 240, 820 - ph * 50, 46); ctx.restore(); }
  const cents = t < s1 ? P.bank : t < s2 ? lerp(P.bank, P.bank - 7000, ss(vprog(t, s1, s1 + .5))) : lerp(P.bank - 7000, P.bank - 11000, ss(vprog(t, s2, s2 + .5)));
  bankPanel(Math.round(cents), vprog(t, T.hund - .3, T.hund), gulp ? .3 * Math.abs(Math.sin(t * 6)) : 0);
  floatTxt('−€70', 830, 300, t, s1, '#ff4d6d', 70); floatTxt('−€40', 830, 300, t, s2, '#ff4d6d', 70);
  vstamp('😬 ALMOST EVERYTHING…', 540, 1690, t, T.hund + 1.6, T.worth - .1, 62, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('💪 WORTH IT!', 540, 1690, t, T.worth - .1, T.beep - .2, 90, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S3 the plow + the pigeon ---------- */
function scenePlow(t) {
  const d = t - T.beep, sp = 420;
  sky('#b8c6d8', '#e9eef5', GROUND); scrollPines(t, sp * .5, GROUND - 40, 3, '#5c7f72');
  ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, GROUND, 1080, 700);
  // deep snow ahead (right), cleared road behind (left)
  const PX = 470, bladeX = PX + 330 * .95;
  ctx.fillStyle = '#c9d1dc'; ctx.fillRect(0, FEET - 40, bladeX, 120);   // cleared road
  for (let q = 0; q < 8; q++) { const x = ((q * 160 - t * sp) % 1280 + 1280) % 1280 - 100; if (x < bladeX - 40) ctx.fillRect(x, FEET + 10, 70, 8); }
  ctx.fillStyle = '#f7fafd'; ctx.beginPath(); ctx.moveTo(bladeX - 20, FEET + 80); for (let x = bladeX - 20; x <= 1100; x += 40) ctx.lineTo(x, FEET - 170 + Math.sin((x + t * sp) * .02) * 22); ctx.lineTo(1100, FEET + 80); ctx.fill();
  // snow spray
  for (let q = 0; q < 26; q++) { const ph = (t * 1.6 + q / 26) % 1; circle(ctx, bladeX + 20 + ph * 220 * (rnd(q) + .3), FEET - 120 - Math.sin(ph * Math.PI) * (220 + rnd(q + 2) * 160) + ph * 120, 14 + rnd(q + 5) * 16, 'rgba(255,255,255,.96)', 'rgba(150,170,200,.6)', 2); }
  plowTruck(PX, FEET + 40, .95, t, { mood: d > T.wait - T.beep - .2 && t < T.fine - .2 ? 'surprised' : 'happy' });
  // the pigeon: flies in front, then hops on the roof
  const pa = T.pigeon - .9, pr = T.wait - .1;
  if (t > pa) { let x, y, fl = t * 26, face = -1, rot = 0;
    if (t < pr) { const k = vprog(t, pa, pr); x = lerp(1180, 760, ss(k)); y = FEET - 420 - Math.sin(k * Math.PI) * 80; face = -1; }
    else { const k = ss(vprog(t, pr, pr + .5)); x = lerp(760, PX + 140 * .95, k); y = lerp(FEET - 420, FEET + 40 - 365 * .95 - Math.sin(k * Math.PI) * 60, k); fl = k < 1 ? t * 26 : 0; face = 1; rot = 0; }
    drawPigeon(x, y, 1.0, fl, face, { rot }); }
  snowfall(t, 70, 'rgba(255,255,255,.9)', .6);
  vstamp('🚜 BEEP BEEP!', 540, 330, t, T.beep - .1, T.pigeon - .2, 96, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  vstamp('🐦 OUT OF THE WAY!', 540, 330, t, T.pigeon - .2, T.wait - .1, 80, '#ffffff', .02, 'rgba(10,12,26,.9)');
  vstamp('…HE JUMPED ON THE ROOF 😑', 540, 330, t, T.wait - .1, T.fine - .1, 60, '#9fd3ff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🐦 FREE RIDE', 540, 330, t, T.fine - .1, T.salt - .3, 92, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S4 salt ---------- */
function sceneSalt(t) {
  const sp = 360, PX = 560;
  sky('#b4d3f0', '#e6f1fa', GROUND); scrollPines(t, sp * .5, GROUND - 40, 7, '#4d7a66');
  ctx.fillStyle = '#f4f7fb'; ctx.fillRect(0, GROUND, 1080, 700);
  // road: icy ahead (right), clean grey behind (left of the truck)
  const back = PX - 330;
  ctx.fillStyle = '#bfe3f7'; ctx.fillRect(0, FEET - 40, 1080, 120);
  for (let q = 0; q < 10; q++) { const x = ((q * 140 - t * sp) % 1400 + 1400) % 1400 - 100; ellipse(ctx, x, FEET + 20, 60, 10, 'rgba(255,255,255,.75)'); }
  ctx.fillStyle = '#9aa3b2'; ctx.fillRect(0, FEET - 40, back, 120);
  for (let q = 0; q < 8; q++) { const x = ((q * 160 - t * sp) % 1280 + 1280) % 1280 - 100; if (x < back) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x, FEET + 14, 70, 8); } }
  // salt spray from the spinner
  for (let q = 0; q < 60; q++) { const ph = (t * 2.2 + q / 60) % 1, ang = Math.PI + (rnd(q) - .5) * 1.6; circle(ctx, back - 20 + Math.cos(ang) * ph * 260, FEET - 20 + Math.sin(ang) * ph * 120 + ph * ph * 160, 5 + rnd(q + 3) * 4, 'rgba(255,255,255,.98)', 'rgba(120,150,190,.8)', 1.5); }
  saltTruck(PX, FEET + 40, .95, t, { mood: 'happy' });
  drawPigeon(PX + 160 * .95, FEET + 40 - 365 * .95, 1.0, 0, 1);
  for (let q = 0; q < 10; q++) { const ph = (t * .9 + rnd(q)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', rnd(q + 4) * back, FEET - 60 - ph * 80, 38); ctx.restore(); }
  vstamp('🧂 SALT TIME!', 540, 330, t, T.salt - .2, T.road - .1, 96, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('🛣️ EVERY ROAD', 540, 330, t, T.road - .1, T.ice - .2, 90, '#9fd3ff', .02, 'rgba(10,12,26,.9)');
  vstamp('🧊❌ NO MORE ICE!', 540, 330, t, T.ice - .2, T.look - .3, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
}
/* ---------- S5 the gate opens, everyone moves in ---------- */
function sceneMove(t) {
  const a = T.look - .3, c = P.newC, k = ss(vprog(t, T.everyone, T.welcome + .4));
  camXY(lerp(c[0], P.edgeC[0], k), lerp(c[1], P.edgeC[1], k), Math.exp(lerp(Math.log(1.25), Math.log(.42), k)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    const melt = 1 - vprog(t, a, a + 1.6); if (melt > 0) { ctx.fillStyle = `rgba(245,248,252,${.6 * melt})`; ctx.fillRect(0, 0, 1080, 1920); }
    const n = Math.floor(P.newH.length * vprog(t, T.everyone - .2, T.n144 + .4));
    if (t < T.everyone + 1.2) P.newH.slice(0, 26).forEach((h, q) => { const tq = T.everyone - .2 + q * .05; if (t < tq) return; const [x, y] = uvS(h.i, h.j); if (x < 60 || x > 1020 || y < 220 || y > 1480) return;
      const kk = eBack(vprog(t, tq, tq + .25)); ctx.save(); ctx.translate(x, y - 75 * cam.z); ctx.scale(1.6 * kk, 1.6 * kk); tag(0, 0, '🏠 @' + trunc(h.name, 14), q % 3 ? '#ffffff' : '#ffd23f', 1); ctx.restore(); });
    for (let q = 0; q < n; q++) { const h = P.newH[q], [x, y] = uvS(h.i, h.j); if (x < -50 || x > 1130 || y < -50 || y > 1970) continue; const p = 1 + .25 * Math.sin(t * 6 + q); circle(ctx, x, y - 20 * cam.z, Math.max(12, 22 * cam.z) * p, '#ff2e63', '#fff', 3); }
    vstamp('🚪 THE GATE IS OPEN!', 540, 330, t, a + .1, T.everyone, 80, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
    vstamp('🧳 EVERYONE MOVES IN!', 540, 330, t, T.everyone, T.n144 - .2, 76, '#ffffff', .02, 'rgba(10,12,26,.92)');
    vstamp('+' + P.newN + ' NEW NEIGHBORS 🏠', 540, 330, t, T.n144 - .2, T.hod - .3, 80, '#ffd23f', -.02, 'rgba(10,12,26,.92)');
    vstamp('WELCOME HOME 💛', 540, 470, t, T.welcome - .1, T.hod - .3, 70, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S6 house of the day ---------- */
function sceneHod(t) {
  const h = P.hod, a = T.hod - .3, k = ss(vprog(t, a, a + 1.4)), [x, y] = isoW(h.i, h.j);
  camXY(x, y - 30, Math.exp(lerp(Math.log(.6), Math.log(2.6), k)));
  setHash('hour=12&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t > T.hod + 1.1) { const [sx, sy] = uvS(h.i, h.j), kk = eBack(vprog(t, T.hod + 1.1, T.hod + 1.4)); ctx.save(); ctx.translate(sx, sy - 125 * cam.z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '🏆 @' + h.name, '#ffd23f', 1); ctx.restore();
      for (let s = 0; s < 18; s++) { const ph = (t * .8 + rnd(s)) % 1; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); emoji(ctx, '✨', 200 + rnd(s + 3) * 680, 600 + rnd(s + 9) * 800 - ph * 60, 44); ctx.restore(); } }
    vstamp('🏆 HOUSE OF THE DAY', 540, 300, t, T.hod - .2, T.mittens - .3, 86, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp('⏳ WAITED SINCE WEDNESDAY', 540, 440, t, T.waited - .1, T.mittens - .3, 54, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
/* ---------- S7 Mittens: still in her tower ---------- */
function sceneMittens(t) {
  cabinRoom(t, false); heater(140, 1400, .8, 1, t);
  const door = bigTower(700, 1620, 1.05, t); eyesIn(door[0], door[1] - 4, 1.05, t);
  benny(300, 1640, 1.25, { pose: 'sit', mood: t > T.nope - .1 ? 'sad' : 'hope', look: [1, -.4], talk: talkAt(t) });
  vstamp('☀️ THE SNOW IS GONE…', 540, 300, t, T.mittens - .1, T.nope - .1, 66, '#ffffff', -.02, 'rgba(10,12,26,.9)');
  vstamp('MITTENS: 🙈 NOPE', 540, 300, t, T.nope - .1, T.left - .3, 86, '#ffd23f', .02, 'rgba(10,12,26,.9)');
}
/* ---------- S8 town saved, goodnight ---------- */
function sceneEnd(t) {
  const dk = vprog(t, T.saved - .2, T.night + 1.5);
  bgSnow(t, { dusk: .25 + dk * .6, seed: 9, n: 0 });
  ctx.fillStyle = mixc('#9aa3b2', '#4a5068', dk); ctx.fillRect(0, FEET - 30, 1080, 80);
  cabinSide(250, FEET - 40, .62, 1, t, { lit: dk });
  plowTruck(820, FEET + 30, .55, 0, {}); drawPigeon(820 + 140 * .55, FEET + 30 - 365 * .55, .7, 0, 1);
  benny(560, FEET + 60, 1.35, { mood: 'happy', armsUp: t > T.saved - .2 && t < T.night, look: [0, -.2], talk: talkAt(t), blink: t > T.night + 1.4 });
  if (dk > .3) for (let q = 0; q < 30; q++) circle(ctx, rnd(q) * 1080, rnd(q + 7) * 700, 2 + rnd(q + 3) * 2, `rgba(255,255,255,${(dk - .3) * (.5 + .5 * Math.sin(t * 3 + q))})`);
  bankPanel(P.bank - 11000, vprog(t, T.left - .3, T.left), 0, 'TOWN SAVED ✅');
  vstamp('🏘️ THE TOWN IS SAVED!', 540, 560, t, T.saved - .2, T.night + 1.2, 74, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
  if (t >= T.night) { const kk = eBack(vprog(t, T.night, T.night + .3)); ctx.save(); ctx.translate(540, 1720); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
  vstamp('GOODNIGHT 🌙', 540, 720, t, T.night + .1, VDUR, 80, '#ffffff', .02, 'rgba(10,12,26,.9)');
}
