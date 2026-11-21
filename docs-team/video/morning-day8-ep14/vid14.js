/* ===================== FOLGE 14 — "The eyes came back" (morning, Sat 21.11.) =====================
   Night-vision hook → paw prints to the van → new neighbours → treasure winner → LIVE → rent day tomorrow → poll. */
(() => {
const VDUR = 59.0;
// ---- numbers of the day (fill in before rendering) ----
const N_OLD = 5681, N_NEW = 64, BANK_OLD = 770, WINNER = '027292dn827';
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = { cam: 0, eyes: 4.7, gate: 6.5, prints: 8.27, lead: 11.58, van: 13.3, here: 14.38, guess: 16.85, ton: 19.77, welcome: 21.74,
  tres: 23.1, house: 26.14, chest: 27.86, flag: 29.1, only: 30.22, hunt: 32.3, harder: 35.74, live: 37.74, follow: 40.7, built: 42.3,
  rent: 43.58, ten: 46.98, find: 49.86, poll: 51.74, comments: 54.46, card: 55.7 };
const CUTS = [T.prints, T.guess, T.tres, T.hunt, T.live, T.rent];
let CAPS = [], OUT, OC, P = {};
function withCtx(c, f) { const keep = ctx; ctx = c; try { f(); } finally { ctx = keep; } }
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return; const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 980); if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6)); ctx.restore();
}
function vCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1600, sz = 64, maxW = 940; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15)); ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => { const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; } });
  ctx.restore();
}
function setHash(h) { if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h); }
function camXY(x, y, z) { cam.x = x; cam.y = y; cam.z = z; target.x = x; target.y = y; target.z = z; }
const rnd = k => { const x = Math.sin(k * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };

/* ---------- 1) night-vision camera feed ---------- */
function nightCam(t) {
  const c = OC; c.save();
  const g = c.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#031a0c'); g.addColorStop(.55, '#0a3a1c'); g.addColorStop(1, '#0d4a22'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
  const zoom = 1 + .5 * ss(vprog(t, T.eyes - .4, T.prints)), ex = 540, ey = 900;   // slow push-in on the eyes
  c.translate(ex, ey); c.scale(zoom, zoom); c.translate(-ex, -ey);
  for (let row = 0; row < 3; row++) for (let k = 0; k < 14; k++) {   // pine trees, back to front
    const x = (k / 13) * 1300 - 110 + (rnd(k * 7 + row) - .5) * 80, base = 760 + row * 170, h = 380 + rnd(k + row * 31) * 260 + row * 80, w = h * .34;
    const col = ['#0b3018', '#0e3a1d', '#061f0f'][row];
    if (row === 2 && Math.abs(x - 540) < 230) continue;   // gap in front, where the eyes are
    c.fillStyle = col; for (let s = 0; s < 4; s++) { const yy = base - h * (s / 4), ww = w * (1 - s / 5); c.beginPath(); c.moveTo(x - ww, yy); c.lineTo(x + ww, yy); c.lineTo(x, yy - h * .42); c.closePath(); c.fill(); }
  }
  c.fillStyle = '#1d6233'; c.fillRect(-300, 1180, 1700, 900);   // snowy ground in green light
  for (let k = 0; k < 40; k++) { c.fillStyle = 'rgba(120,255,160,.08)'; c.fillRect(rnd(k) * 1080, 1190 + rnd(k + 9) * 700, 60 + rnd(k + 3) * 140, 6); }
  // the eyes: fade in, blink once, then stare
  const ea = vprog(t, T.eyes - .5, T.eyes + .3), blink = vin(t, 5.95, 6.12) ? .1 : 1, pul = .85 + .15 * Math.sin(t * 5);
  if (ea > 0) for (const dx of [-46, 46]) {
    const gl = c.createRadialGradient(ex + dx, ey, 2, ex + dx, ey, 70); gl.addColorStop(0, `rgba(210,255,190,${.9 * ea * pul})`); gl.addColorStop(1, 'rgba(120,255,140,0)');
    c.fillStyle = gl; c.fillRect(ex + dx - 80, ey - 80, 160, 160);
    c.fillStyle = `rgba(245,255,230,${ea})`; c.beginPath(); c.ellipse(ex + dx, ey, 22, 15 * blink, 0, 0, 6.29); c.fill();
    c.fillStyle = `rgba(10,30,10,${ea})`; c.beginPath(); c.ellipse(ex + dx, ey, 5, 12 * blink, 0, 0, 6.29); c.fill();
  }
  c.restore();
  // falling snow
  for (let k = 0; k < 120; k++) { const x = (rnd(k) * 1080 + Math.sin(t + k) * 20), y = ((rnd(k + 50) * 1920 + t * (120 + rnd(k + 7) * 160)) % 1980) - 30, r = 2 + rnd(k + 3) * 3; c.fillStyle = 'rgba(200,255,210,.55)'; c.beginPath(); c.arc(x, y, r, 0, 6.29); c.fill(); }
  // scanlines + noise + glitch at the start
  c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < 1920; y += 6) c.fillRect(0, y, 1080, 2);
  const gli = vin(t, 0, .5) || vin(t, 5.9, 6.1) ? 1 : 0; if (gli) for (let k = 0; k < 70; k++) { c.fillStyle = `rgba(190,255,200,${.25 + rnd(k + t * 30) * .5})`; c.fillRect(rnd(k * 3 + t * 11) * 1080, rnd(k * 5 + t * 17) * 1920, 40 + rnd(k) * 300, 3 + rnd(k + 1) * 5); }
  const v = c.createRadialGradient(540, 960, 400, 540, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); c.fillStyle = v; c.fillRect(0, 0, 1080, 1920);
  // overlay text (monospace like a security cam)
  c.fillStyle = '#c8ffd2'; c.font = '600 40px "Courier New", monospace'; c.textBaseline = 'middle';
  c.textAlign = 'left'; c.fillText('CAM 1 · THE WOODS', 60, 300);
  const sec = 4 + Math.floor(t); c.textAlign = 'right'; c.fillText('03:12:' + String(sec).padStart(2, '0'), 1020, 300);
  if (Math.floor(t * 2) % 2 === 0) { c.fillStyle = '#ff3b3b'; c.beginPath(); c.arc(84, 1500, 14, 0, 6.29); c.fill(); }
  c.fillStyle = '#c8ffd2'; c.textAlign = 'left'; c.fillText('REC', 110, 1500);
}

/* ---------- 2D map scenes ---------- */
function map2d(t) {
  let hour = 9.5, wx = 'snow';
  if (t < T.guess) {                                    // the morning: paw prints to the van
    hour = 8.2; const k = vprog(t, T.prints, T.here + 1), [x, y] = isoW(P.van[0], P.van[1]);
    camXY(x - 70 + 70 * ss(k), y - 160 + 120 * ss(k), 1.25 + .35 * ss(k));
  } else if (t < T.tres) {                              // new neighbours: zoom out over the town
    hour = 10; wx = 'clear'; const k = eio(vprog(t, T.guess, T.ton + .6)), [a, b] = isoW(P.van[0], P.van[1]), [c2, d2] = P.newC;
    camXY(lerp(a, c2, k), lerp(b, d2, k), Math.exp(lerp(Math.log(1.4), Math.log(.2), k)));
  } else if (t < T.hunt) {                              // the treasure winner's house
    hour = 11; wx = 'clear'; const k = eio(vprog(t, T.tres, T.tres + 2.2)), [c2, d2] = P.newC, [x, y] = isoW(P.win.i, P.win.j);
    camXY(lerp(c2, x, k), lerp(d2, y - 40, k), Math.exp(lerp(Math.log(.2), Math.log(2.1), k)) * (1 + .06 * vprog(t, T.tres + 2.2, T.hunt)));
  } else if (t < T.live) {                              // the daily treasure hunt: drift over back alleys
    hour = 12; wx = 'clear'; const k = vprog(t, T.hunt, T.live), [x, y] = isoW(P.alley[0], P.alley[1]);
    camXY(x - 160 + 320 * k, y + 40 - 80 * k, .75);
  } else if (t < T.rent) {                              // LIVE: a house gets built
    hour = 13; wx = 'clear'; const [x, y] = isoW(P.liveH.i, P.liveH.j); camXY(x, y - 30, 1.5 * (1 + .08 * vprog(t, T.live, T.rent)));
  } else {                                              // rent day tomorrow → towards the fog
    hour = 15.5; wx = 'clear'; const k = eio(vprog(t, T.rent, T.find + .8)), [x, y] = isoW(BHOME[0], BHOME[1]), [fx, fy] = P.fog;
    const z = Math.exp(lerp(Math.log(1.0), Math.log(.13), ss(Math.min(1, k / .7))));
    camXY(lerp(x, fx, ss(k)), lerp(y, fy, ss(k)), z);
  }
  setHash('hour=' + hour + '&weather=' + wx); S.T = 500 + t;
  draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t < T.guess) { ctx.save(); ctx.fillStyle = 'rgba(235,243,255,.28)'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); prints(t);
      for (let k = 0; k < 110; k++) { const x = (rnd(k) * 1080 + Math.sin(t + k) * 20), y = ((rnd(k + 50) * 1920 + t * (110 + rnd(k + 7) * 140)) % 1980) - 30; circle(ctx, x, y, 2.5 + rnd(k + 3) * 3.5, 'rgba(255,255,255,.85)'); } }
    if (vin(t, T.ton - .3, T.tres)) rings(t);
    if (t >= T.tres + 1.6 && t < T.hunt) { const [sx, sy] = uvS(P.win.i, P.win.j), z = cam.z, k = eBack(vprog(t, T.tres + 1.6, T.tres + 1.9));
      ctx.save(); ctx.translate(sx, sy - 125 * z); ctx.scale(2.4 * k, 2.4 * k); tag(0, 0, '🏆 @' + WINNER, '#ffd23f', 1); ctx.restore();
      if (t >= T.chest - .1) arrow(t, P.win.i + .44, P.win.j + .44, T.chest - .1, T.flag - .1);
      if (t >= T.flag - .1) arrow(t, P.win.i - .48, P.win.j + .46, T.flag - .1, T.only, 70);
    }
    if (vin(t, T.hunt, T.live)) hotCold(t);
    if (vin(t, T.live, T.rent)) liveBadge(t);
    if (vin(t, T.rent + .8, T.find - .2)) coins(t);
  });
}
function prints(t) {   // paw prints in the snow, appearing step by step towards the van, + scared Benny at the van
  const [vx, vy] = uvS(P.van[0], P.van[1]), z = cam.z, n = 11;
  for (let k = 0; k < n; k++) {
    const f = k / (n - 1), u = lerp(P.van[0] - 2.2, P.van[0] - .45, f) + Math.sin(k * 1.3) * .15, v = lerp(P.van[1] - 6.5, P.van[1] - .4, f);
    const appear = vprog(t, T.prints + .3 + k * .3, T.prints + .5 + k * .3); if (appear <= 0) continue;
    const [x, y] = uvS(u + (k % 2 ? .1 : -.1), v); ctx.save(); ctx.globalAlpha = appear; ctx.translate(x, y); ctx.rotate(-.5); const s = z * 1.0;
    ctx.fillStyle = '#3a2a22'; ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 6 * s; ctx.beginPath(); ctx.ellipse(0, 0, 9 * s, 7 * s, 0, 0, 6.29); ctx.fill();
    for (const [dx, dy] of [[-9, -10], [-3, -14], [4, -14], [10, -10]]) { ctx.beginPath(); ctx.ellipse(dx * s, dy * s, 3.2 * s, 4 * s, 0, 0, 6.29); ctx.fill(); }
    ctx.restore();
  }
  // Benny next to the van, scared, looking at the prints
  const scared = t > T.van; drawBenny(ctx, vx - 95 * z, vy + 40 * z, z * .55, { pose: 'stand', mood: scared ? 'surprised' : 'sad', look: [-1, -.4], blink: false });
}
function rings(t) {
  const z = cam.z, a0 = vprog(t, T.ton - .3, T.ton + .2); ctx.save();
  for (const [k, h] of P.newest.entries()) { const [sx, sy] = uvS(h.i, h.j), ph = (t * 1.6 + k * .13) % 1, a = (1 - ph) * a0;
    ctx.strokeStyle = `rgba(255,210,63,${a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 10 + 46 * ph, (10 + 46 * ph) * .55, 0, 0, 6.29); ctx.stroke();
    ctx.fillStyle = `rgba(255,210,63,${.9 * a0})`; ctx.beginPath(); ctx.arc(sx, sy - 8 * z, 6, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
function arrow(t, u, v, t0, t1, up) {
  if (t < t0 || t > t1 + .3) return; const [x, y] = uvS(u, v), z = cam.z, k = eBack(vprog(t, t0, t0 + .3)), a = clamp((t1 + .3 - t) / .3, 0, 1), bob = Math.sin(t * 9) * 8;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - (up || 30) * z - 70 + bob); ctx.scale(k, k);
  poly(ctx, [[-26, -60], [26, -60], [26, -10], [46, -10], [0, 30], [-46, -10], [-26, -10]], '#ff2e63', '#fff', 5); ctx.restore();
}
function hotCold(t) {   // a mock of the website's treasure meter
  const k = eBack(vprog(t, T.hunt + .2, T.hunt + .5)); ctx.save(); ctx.translate(540, 1240); ctx.scale(k, k);
  panel(-400, -70, 800, 140, 36, 'rgba(10,12,26,.9)', 'rgba(255,210,63,.7)', 4);
  txt('💰 TREASURE HUNT', -360, -30, 32, '#ffd23f', 'left', 'middle');
  const lv = t < T.hunt + 2 ? 0 : t < T.harder ? 1 : 2, L = ['❄️ Cold', '🌤️ Warm', '🔥 Hot… look closely'][lv];
  rrect(ctx, -360, 4, 720, 26, 13); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill();
  rrect(ctx, -360, 4, 720 * [.15, .5, .85][lv], 26, 13); ctx.fillStyle = ['#7fb2ec', '#ffd23f', '#ff6b3d'][lv]; ctx.fill();
  txt(L, 360, -30, 32, '#ffffff', 'right', 'middle'); ctx.restore();
}
function liveBadge(t) {
  const k = eBack(vprog(t, T.live, T.live + .3)); ctx.save(); ctx.translate(540, 330); ctx.scale(k, k);
  rrect(ctx, -170, -60, 340, 120, 30); ctx.fillStyle = '#ff2e63'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke();
  if (Math.floor(t * 2.5) % 2 === 0) circle(ctx, -110, 0, 16, '#fff'); otxt('LIVE', 30, 2, 72, '#fff', 0); ctx.restore();
  // the house popping up on the LIVE
  if (t >= P.popT - .2) { const [sx, sy] = uvS(P.liveH.i, P.liveH.j), z = cam.z, kk = eBack(vprog(t, P.popT + .4, P.popT + .7));
    ctx.save(); ctx.translate(sx, sy - 125 * z); ctx.scale(2.4 * kk, 2.4 * kk); tag(0, 0, '@you 🫵', '#3ddc84', 1); ctx.restore();
    for (let q = 0; q < 26; q++) { const a = q / 26 * 6.29, d = (t - P.popT) * 520; if (t - P.popT > 1.2 || t < P.popT) continue; circle(ctx, sx + Math.cos(a) * d, sy - 60 * z + Math.sin(a) * d * .6 - 200 * (t - P.popT), 8, ['#ffd23f', '#ff2e63', '#3ddc84', '#7fb2ec'][q % 4]); } }
}
function coins(t) {   // coins rising from houses = rent
  const z = cam.z; for (let k = 0; k < 90; k++) { const h = P.rentH[k % P.rentH.length], ph = ((t - T.rent) * .9 + rnd(k) * 1.5) % 1.5; if (ph > 1) continue;
    const [sx, sy] = uvS(h.i, h.j); const y = sy - 30 * z - ph * 180, a = Math.sin(ph * Math.PI); ctx.save(); ctx.globalAlpha = a; circle(ctx, sx, y, 13, '#ffcf3f', '#a87a12', 3); txt('¢', sx, y + 1, 16, '#a87a12', 'center', 'middle'); ctx.restore(); }
}

/* ---------- overlays on top of everything ---------- */
function hud(t) {
  const a = vprog(t, T.ton, T.ton + .3) * (1 - vprog(t, T.tres - .1, T.tres + .2)); if (a <= 0) return;
  const k = ss(vprog(t, T.ton + .2, T.ton + 1.8)), n = Math.round(lerp(N_OLD, N_OLD + N_NEW, k)), b = lerp(BANK_OLD, BANK_OLD + N_NEW * 10, k);
  ctx.save(); ctx.globalAlpha = a; panel(170, 250, 740, 200, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt('NEIGHBORS', 360, 296, 26, '#9aa3c7', 'center', 'middle'); otxt(n.toLocaleString('en-US'), 360, 366, 78, '#ffffff', 10, '#06070f');
  txt("BENNY'S BANK", 720, 296, 26, '#9aa3c7', 'center', 'middle'); otxt('€' + (b / 100).toFixed(2), 720, 366, 78, '#46e08a', 10, '#06070f');
  txt('DAY 8', 540, 424, 24, '#c3c9e4', 'center', 'middle'); ctx.restore();
}
function pollCard(t) {
  if (t < T.poll) return; const k = eBack(vprog(t, T.poll, T.poll + .35));
  ctx.fillStyle = `rgba(5,8,22,${.6 * vprog(t, T.poll, T.poll + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 820); ctx.scale(k, k);
  panel(-460, -330, 920, 660, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT DO I DO', 0, -255, 58, '#ffd23f', 8); otxt('ABOUT THE EYES? 👀', 0, -188, 58, '#ffd23f', 8);
  [['🔦', 'Go look tonight'], ['🍖', 'Leave food out'], ['🐕', 'Get a guard dog']].forEach(([e, s], i) => { const y = -75 + i * 120, kk = eBack(vprog(t, T.poll + .3 + i * .18, T.poll + .6 + i * .18));
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk); panel(-410, -48, 820, 96, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 52); txt(s, -300, 2, 46, '#ffffff', 'left', 'middle'); ctx.restore(); });
  txt('Vote in the comments 👇', 0, 290, 38, '#c3c9e4', 'center', 'middle'); ctx.restore();
  if (t >= T.card) { const kk = eBack(vprog(t, T.card, T.card + .3)); ctx.save(); ctx.translate(540, 1330); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
function overlays(t) {
  vstamp('👀 03:12 AM', 540, 470, t, .3, T.eyes, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('WHAT IS THAT?!', 540, 470, t, T.gate, T.prints, 86, '#ff4d6d', .02, 'rgba(10,12,26,.86)');
  vstamp('🐾 PAW PRINTS…', 540, 330, t, T.prints + .3, T.van, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('…TO MY VAN 😨', 540, 330, t, T.van, T.guess, 92, '#ff4d6d', .02, 'rgba(10,12,26,.86)');
  vstamp('+' + (N_NEW ? N_NEW.toLocaleString('en-US') : 'NEW') + ' NEIGHBORS 🏠', 540, 560, t, T.ton + .1, T.tres, 80, '#ffffff', .02, '#ff2e63');
  vstamp('💰 TREASURE FOUND!', 540, 330, t, T.tres + .1, T.house, 92, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('🎁 OWN TREASURE CHEST', 540, 330, t, T.chest - .1, T.flag - .1, 80, '#ffd23f', .02, 'rgba(10,12,26,.86)');
  vstamp('🏆 TROPHY FLAG', 540, 330, t, T.flag - .1, T.only, 88, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('ONLY FOR TREASURE HUNTERS', 540, 330, t, T.only, T.hunt, 70, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('💰 NEW TREASURE EVERY DAY', 540, 330, t, T.hunt + .1, T.harder, 74, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('NOW WAY HARDER 😏', 540, 330, t, T.harder, T.live, 88, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('A FEW TIMES A WEEK', 540, 470, t, T.live + 1.3, T.follow, 70, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('WATCH YOUR HOUSE GET BUILT', 540, 470, t, T.follow, T.rent, 66, '#3ddc84', -.02, 'rgba(10,12,26,.86)');
  vstamp('TOMORROW: RENT DAY 💰', 540, 330, t, T.rent + .1, T.ten, 82, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('EVERY NEIGHBOR = 10¢', 540, 330, t, T.ten - .3, T.find, 84, '#46e08a', .02, 'rgba(10,12,26,.86)');
  vstamp("WHAT'S OUT THERE? 🌫️", 540, 330, t, T.find, T.poll, 84, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  hud(t); pollCard(t);
}
/* ---------- master ---------- */
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1;
  if (t < T.prints) nightCam(t); else map2d(t);
  withCtx(OC, () => {
    overlays(t);
    if (t < T.poll) vCaption(t);
    for (const c of CUTS) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t > VDUR - .4) { ctx.fillStyle = `rgba(0,0,0,${(t - (VDUR - .4)) / .4})`; ctx.fillRect(0, 0, 1080, 1920); }
  });
  return OUT.toDataURL('image/jpeg', .92);
}
window.EP = {
  DUR: VDUR, T,
  async init(caps) {
    CAPS = caps; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    window.__globe = true; window.__noBenny = true;   // keep the site's own loop paused, frames are drawn by hand
    P.van = [4.55, 4.85]; P.win = HOUSES.find(h => h.name === WINNER);
    P.newest = HOUSES.slice(-(N_NEW || 60)); const c = P.newest.reduce((a, h) => [a[0] + h.i, a[1] + h.j], [0, 0]); P.newC = isoW(c[0] / P.newest.length, c[1] / P.newest.length);
    // a back alley spot (for the treasure-hunt shot) and a house for the LIVE pop
    P.alley = [P.win.i + 6, P.win.j - 5];
    P.liveH = HOUSES[HOUSES.length - 1]; P.popT = T.live + 2.6; P.liveH.bt = 500 + P.popT;
    P.rentH = HOUSES.map(h => [Math.hypot(h.i - BHOME[0], h.j - BHOME[1]), h]).sort((a, b) => a[0] - b[0]).slice(0, 70).map(x => x[1]);
    // the fog bank north of the old town (district 3)
    const W3x = window.W3 || (window.__d && __d.W3); { const fc = [-18.8, -256.1], m = [lerp(BHOME[0], fc[0], .62), lerp(BHOME[1], fc[1], .62)]; P.fog = isoW(m[0], m[1]); }
    return JSON.stringify({ win: [P.win.i, P.win.j, P.win.idx], live: P.liveH.name, n: HOUSES.length, fog: P.fog });
  },
  frame,
};
})();
