/* ===================== FOLGE 14 v2 — "The eyes" (morning Sat 21.11.), Folge-13 style scenes ===================== */
(() => {
const VDUR = 59.0;
const N_OLD = 5681, N_NEW = 64, BANK_OLD = 770, WINNER = '027292dn827';
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = {"eyes": 4.86, "gate": 6.62, "prints": 8.3, "van": 13.62, "here": 14.54, "guess": 16.97, "ton": 20.08, "tres": 23.6, "chest": 28.62, "flag": 29.94, "only": 31.18, "hunt": 33.13, "nohint": 37.1, "live": 38.89, "follow": 42.14, "rent": 45.37, "only14": 48.94, "dark": 51.1, "poll": 52.17, "card": 55.76};
const CUTS = [T.prints, T.guess, T.ton, T.hunt, T.live, T.rent];
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
  const ea = vprog(t, T.eyes - .5, T.eyes + .3), blink = vin(t, 6.1, 6.27) ? .1 : 1, pul = .85 + .15 * Math.sin(t * 5);
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

/* ---------- flat side-view kit (Folge-13 style) ---------- */
const BEN = { shortLegs: true };
function benny(x, y, s, o) { drawBenny(ctx, x, y, s, Object.assign({ shortLegs: true, pose: 'stand' }, o || {})); }
function talkAt(t) { const i = Math.floor(t * 30); return P.mouth ? (P.mouth[i] || 0) : 0; }
function sky(c1, c2, h) { const g = ctx.createLinearGradient(0, 0, 0, h || 1300); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-400, 0, 1900, 1920); }
function pine(x, base, h, col, snow) {
  const w = h * .36; for (let s = 0; s < 4; s++) { const yy = base - h * (s / 4.2), ww = w * (1 - s / 5);
    poly(ctx, [[x - ww, yy], [x + ww, yy], [x, yy - h * .42]], col);
    if (snow) poly(ctx, [[x - ww * .35, yy - h * .27], [x + ww * .35, yy - h * .27], [x, yy - h * .42]], 'rgba(255,255,255,.85)'); }
  ctx.fillStyle = '#4a3324'; ctx.fillRect(x - h * .03, base, h * .06, h * .06);
}
function snowGround(y, col) { ctx.fillStyle = col || '#eef3fa'; ctx.fillRect(-400, y, 1900, 1920 - y); ctx.fillStyle = 'rgba(180,195,220,.35)'; for (let k = 0; k < 14; k++) ctx.fillRect(rnd(k) * 1080, y + 30 + rnd(k + 4) * 500, 80 + rnd(k + 2) * 160, 6); }
function snowfall(t, n, col) { for (let k = 0; k < (n || 90); k++) { const x = (rnd(k) * 1080 + Math.sin(t + k) * 20), y = ((rnd(k + 50) * 1920 + t * (90 + rnd(k + 7) * 120)) % 1980) - 30; circle(ctx, x, y, 2.5 + rnd(k + 3) * 3.5, col || 'rgba(255,255,255,.9)'); } }
function vanSide(x, y, s, dim) {   // white alcove motorhome, side view; (x,y) = ground under the back wheel area, faces right
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const O = '#1b1728', lw = 6;
  ellipse(ctx, 200, 6, 330, 22, 'rgba(0,0,0,.18)');
  rrect(ctx, -60, -330, 420, 290, 26); ctx.fillStyle = '#f6f6f2'; ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = lw; ctx.stroke();   // living box
  rrect(ctx, 300, -330, 170, 90, 30); ctx.fillStyle = '#f6f6f2'; ctx.fill(); ctx.stroke();                                              // alcove over the cab
  poly(ctx, [[340, -240], [470, -240], [540, -150], [540, -40], [340, -40]], '#f6f6f2', O, lw);                                          // cab
  poly(ctx, [[400, -228], [462, -228], [522, -152], [400, -152]], dim ? '#2a3350' : '#9fc6e8', O, 4);                                    // cab window
  rrect(ctx, 352, -228, 40, 60, 8); ctx.fillStyle = dim ? '#2a3350' : '#9fc6e8'; ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 4; ctx.stroke();
  for (const [wx, ww] of [[-20, 120], [150, 90]]) { rrect(ctx, wx, -270, ww, 70, 12); ctx.fillStyle = dim ? '#ffd56b' : '#33405f'; ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#c7524c'; ctx.fillRect(wx + 6, -264, ww * .22, 58); ctx.fillRect(wx + ww * .78 - 6, -264, ww * .22, 58); }
  rrect(ctx, 255, -260, 62, 200, 10); ctx.fillStyle = '#ececE6'; ctx.fill(); ctx.strokeStyle = O; ctx.lineWidth = 4; ctx.stroke(); circle(ctx, 305, -160, 5, O);   // door
  ctx.lineWidth = 12; ctx.strokeStyle = '#2f8f6b'; ctx.beginPath(); ctx.moveTo(-50, -120); ctx.bezierCurveTo(80, -170, 200, -90, 340, -140); ctx.stroke();
  ctx.lineWidth = 8; ctx.strokeStyle = '#2b4f8f'; ctx.beginPath(); ctx.moveTo(-50, -100); ctx.bezierCurveTo(80, -150, 200, -70, 340, -118); ctx.stroke();
  rrect(ctx, -60, -62, 600, 26, 8); ctx.fillStyle = '#9aa0ad'; ctx.fill();
  for (const wx of [40, 430]) { circle(ctx, wx, -30, 50, '#24242c', O, lw); circle(ctx, wx, -30, 22, '#b9bcc6', O, 4); }
  if (!dim) { rrect(ctx, 520, -80, 26, 18, 5); ctx.fillStyle = '#ffe08a'; ctx.fill(); }
  ctx.restore();
}
function paw(x, y, s, a, rot) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(1, .55); ctx.fillStyle = '#7b8aa6';
  ctx.beginPath(); ctx.ellipse(0, 0, 18 * s, 15 * s, 0, 0, 6.29); ctx.fill();
  for (const [dx, dy] of [[-17, -19], [-6, -27], [7, -27], [18, -19]]) { ctx.beginPath(); ctx.ellipse(dx * s, dy * s, 6 * s, 8 * s, 0, 0, 6.29); ctx.fill(); }
  ctx.restore(); }

/* B) the morning outside: paw prints to the van */
function sceneMorning(t) {
  const pan = ss(vprog(t, T.prints, T.van + .8));       // camera slides along the prints to the van
  ctx.save(); ctx.translate(-260 * pan, 0);
  sky('#bcd3ea', '#e9f1fa', 1250);
  for (let k = 0; k < 10; k++) pine(-80 + k * 160 + (k % 2) * 40, 1060 + (k % 3) * 18, 360 + (k % 3) * 70, ['#3f6e58', '#36604d', '#2e5544'][k % 3], true);
  snowGround(1080);
  vanSide(720, 1330, 1.05);
  // the prints come out of the forest and stop at the van door
  for (let k = 0; k < 12; k++) { const f = k / 11, x = lerp(80, 960, f), y = lerp(1200, 1395, f) + (k % 2 ? 26 : -26), a = vprog(t, T.prints + .35 + k * .3, T.prints + .55 + k * .3); if (a > 0) paw(x, y, 1.7, a * .95, .3); }
  ctx.restore();
  const scared = t > T.van, shiver = t > T.here ? Math.sin(t * 60) * 4 : 0;
  benny(290 + shiver, 1640, 1.7, { mood: scared ? 'surprised' : 'sad', look: [1, .3], talk: talkAt(t) });
  snowfall(t, 70);
}
/* C) under the blanket in the van */
function sceneBlanket(t) {
  ctx.fillStyle = '#2d3550'; ctx.fillRect(0, 0, 1080, 1920);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; ctx.fillRect(k * 120, 0, 120, 1920); }
  rrect(ctx, 250, 330, 580, 420, 22); ctx.fillStyle = '#c9ccd6'; ctx.fill(); rrect(ctx, 270, 350, 540, 380, 14); ctx.fillStyle = '#121a33'; ctx.fill();   // window
  ctx.save(); ctx.beginPath(); ctx.rect(270, 350, 540, 380); ctx.clip(); snowfall(t, 40); ctx.restore(); line(ctx, 540, 350, 540, 730, '#c9ccd6', 16);
  ctx.fillStyle = '#5a4030'; ctx.fillRect(0, 1380, 1080, 540);
  rrect(ctx, 90, 1180, 900, 220, 40); ctx.fillStyle = '#9a9eaa'; ctx.fill();   // bed
  rrect(ctx, 130, 1130, 240, 110, 40); ctx.fillStyle = '#e8e8ee'; ctx.fill();   // pillow
  const shake = Math.sin(t * 40) * 5;
  benny(540 + shake, 1400, 1.5, { pose: 'sit', mood: 'surprised', look: [.6, 0], talk: talkAt(t) });
  ctx.save(); ctx.translate(shake, 0);   // the blanket pulled up to his nose
  const by = 1235; ctx.beginPath(); ctx.moveTo(140, 1400); ctx.lineTo(160, by + 20); ctx.quadraticCurveTo(540, by - 70, 920, by + 20); ctx.lineTo(940, 1400); ctx.closePath();
  ctx.fillStyle = '#c0504a'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); ctx.clip(); for (let k = 0; k < 9; k++) for (let j = 0; j < 5; j++) if ((k + j) % 2) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(140 + k * 90, by - 60 + j * 90, 90, 90); } ctx.restore();
  ctx.restore();
}
/* G) LIVE: Benny waves into a phone on a tripod */
function sceneLive(t) {
  sky('#ffd6a8', '#ffb59a', 1300);
  for (let k = 0; k < 6; k++) { const x = 60 + k * 190, h = 200 + (k % 3) * 40; rrect(ctx, x, 1150 - h, 150, h, 8); ctx.fillStyle = ['#f3e3c3', '#cfe3f2', '#f6c9cf'][k % 3]; ctx.fill(); poly(ctx, [[x - 15, 1150 - h], [x + 165, 1150 - h], [x + 75, 1150 - h - 80]], ['#d9534f', '#3c5a99', '#7b4b94'][k % 3]); }
  snowGround(1150);
  // tripod + phone with LIVE screen
  const px = 820, py = 1000; line(ctx, px, py + 160, px - 80, 1560, '#2a2a33', 10); line(ctx, px, py + 160, px + 80, 1560, '#2a2a33', 10); line(ctx, px, py + 160, px, 1560, '#2a2a33', 10);
  rrect(ctx, px - 80, py - 150, 160, 300, 24); ctx.fillStyle = '#1b1728'; ctx.fill(); rrect(ctx, px - 68, py - 138, 136, 276, 16); ctx.fillStyle = '#ff6b8b'; ctx.fill();
  if (Math.floor(t * 2.5) % 2 === 0) circle(ctx, px - 34, py - 110, 9, '#fff'); txt('LIVE', px + 10, py - 110, 26, '#fff', 'center', 'middle');
  benny(380, 1660, 1.7, { mood: 'happy', wave: true, look: [.5, 0], talk: talkAt(t) });
  // chat bubbles: people following during the LIVE
  const names = P.chat; for (let k = 0; k < names.length; k++) { const t0 = T.live + .8 + k * .85; if (t < t0) continue; const a = clamp((t0 + 2.6 - t) / .4, 0, 1), y = 760 - (t - t0) * 60;
    if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.translate(40 + (k % 2) * 30, y); ctx.scale(eBack(vprog(t, t0, t0 + .25)), eBack(vprog(t, t0, t0 + .25)));
    ctx.font = F(32); const s = '@' + names[k] + ' moved in 🏠', w = ctx.measureText(s).width + 50; panel(0, -32, w, 64, 32, 'rgba(10,12,26,.88)', 'rgba(61,220,132,.8)', 3); txt(s, 25, 1, 32, '#fff', 'left', 'middle'); ctx.restore(); }
}
/* H) dusk at the van: €14 and the eyes come back */
function sceneDusk(t) {
  const d = vprog(t, T.rent, T.dark + 1.2);
  sky(mixc('#7d8fb8', '#141a33', d), mixc('#f4b08a', '#2a2347', d), 1250);
  for (let k = 0; k < 9; k++) pine(-60 + k * 150 + (k % 2) * 30, 1080 + (k % 3) * 16, 380 + (k % 3) * 80, mixc('#2e5544', '#0d1a16', d), true);
  if (t > T.dark) { const a = vprog(t, T.dark, T.dark + .6) * (vin(t, T.poll - 1.1, T.poll - .95) ? .1 : 1);   // eyes in the trees
    for (const [ex, ey] of [[180, 930], [860, 980]]) for (const dx of [-16, 16]) { circle(ctx, ex + dx, ey, 9, `rgba(210,255,170,${a})`); circle(ctx, ex + dx, ey, 22, `rgba(160,255,120,${a * .25})`); } }
  snowGround(1100, mixc('#e6ecf6', '#5e6788', d));
  vanSide(520, 1350, .95, d > .6);
  benny(270, 1660, 1.65, { mood: t > T.dark ? 'surprised' : 'sad', look: t > T.dark ? [-.6, -.4] : [.4, .2], talk: talkAt(t) });
  // wallet / bank: €14.10
  if (t > T.only14 - .2 && t < T.poll) { const k = eBack(vprog(t, T.only14 - .2, T.only14 + .1)); ctx.save(); ctx.translate(540, 470); ctx.scale(k, k);
    panel(-230, -80, 460, 160, 40, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4); txt("BENNY'S BANK", 0, -40, 26, '#9aa3c7', 'center', 'middle'); otxt('€' + (P.bank / 100).toFixed(2), 0, 22, 78, '#46e08a', 10, '#06070f'); ctx.restore(); }
  snowfall(t, 50, d > .5 ? 'rgba(220,230,255,.6)' : 'rgba(255,255,255,.85)');
}
function mixc(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')'; }
/* ---------- map scenes (neighbours + treasure winner) ---------- */
function mapScene(t) {
  if (t < T.tres) { const k = eio(vprog(t, T.ton - .2, T.ton + 1.4)), [c2, d2] = P.newC; camXY(c2, d2, Math.exp(lerp(Math.log(.45), Math.log(.2), k))); setHash('hour=10&weather=clear'); }
  else { const k = eio(vprog(t, T.tres, T.tres + 2.2)), [c2, d2] = P.newC, [x, y] = isoW(P.win.i, P.win.j);
    camXY(lerp(c2, x, k), lerp(d2, y - 40, k), Math.exp(lerp(Math.log(.2), Math.log(2.3), k)) * (1 + .06 * vprog(t, T.tres + 2.2, T.hunt))); setHash('hour=11&weather=clear'); }
  S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t < T.tres) { const z = cam.z, a0 = vprog(t, T.ton - .2, T.ton + .3); ctx.save();
      for (const [k, h] of P.newest.entries()) { const [sx, sy] = uvS(h.i, h.j), ph = (t * 1.6 + k * .13) % 1, a = (1 - ph) * a0;
        ctx.strokeStyle = `rgba(255,210,63,${a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 10 + 46 * ph, (10 + 46 * ph) * .55, 0, 0, 6.29); ctx.stroke(); } ctx.restore(); }
    if (t >= T.tres + 1.8) { const [sx, sy] = uvS(P.win.i, P.win.j), z = cam.z, k = eBack(vprog(t, T.tres + 1.8, T.tres + 2.1));
      ctx.save(); ctx.translate(sx, sy - 125 * z); ctx.scale(2.2 * k, 2.2 * k); tag(0, 0, '🏆 @' + WINNER, '#ffd23f', 1); ctx.restore();
      if (t >= T.chest - .1 && t < T.flag) arrow(t, P.win.i + .44, P.win.j + .44, T.chest - .1, T.flag - .2);
      if (t >= T.flag - .1) arrow(t, P.win.i - .48, P.win.j + .46, T.flag - .1, T.only, 74);
      // Benny pops in, cheering
      const bk = eBack(vprog(t, T.tres + .3, T.tres + .7)); ctx.save(); ctx.translate(170, 1520 + (1 - bk) * 600); benny(0, 0, .9, { mood: 'happy', armsUp: Math.sin(t * 6) > 0, talk: talkAt(t) }); ctx.restore(); }
  });
}
function arrow(t, u, v, t0, t1, up) {
  if (t < t0 || t > t1 + .3) return; const [x, y] = uvS(u, v), z = cam.z, k = eBack(vprog(t, t0, t0 + .3)), a = clamp((t1 + .3 - t) / .3, 0, 1), bob = Math.sin(t * 9) * 8;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - (up || 30) * z - 70 + bob); ctx.scale(k, k);
  poly(ctx, [[-26, -60], [26, -60], [26, -10], [46, -10], [0, 30], [-46, -10], [-26, -10]], '#ff2e63', '#fff', 5); ctx.restore();
}
/* ---------- F) the 3D back alley with today's tiny chest ---------- */
function scene3d(t) {
  setHash('hour=12&weather=clear');
  const k = ss(vprog(t, T.hunt, T.live)), d = lerp(3.4, 1.25, k), x = P.cx - Math.sin(P.cyaw) * d, z = P.cz - Math.cos(P.cyaw) * d;
  const c = W3D.shot({ w: 720, h: 1280, t: 100 + t, st: 500 + t, dt: 1 / 30, x, z, yaw: P.cyaw + .25 * (1 - k), pitch: P.cpitch, bob: d * 6, force: true });
  OC.drawImage(c, 0, 0, 1080, 1920);
}
function hud(t) {
  const a = vprog(t, T.ton, T.ton + .3) * (1 - vprog(t, T.tres - .1, T.tres + .2)); if (a <= 0) return;
  const k = ss(vprog(t, T.ton + .2, T.ton + 1.6)), n = Math.round(lerp(N_OLD, N_OLD + N_NEW, k)), b = lerp(BANK_OLD, BANK_OLD + N_NEW * 10, k);
  ctx.save(); ctx.globalAlpha = a; panel(170, 250, 740, 200, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt('NEIGHBORS', 360, 296, 26, '#9aa3c7', 'center', 'middle'); otxt(n.toLocaleString('en-US'), 360, 366, 78, '#ffffff', 10, '#06070f');
  txt("BENNY'S BANK", 720, 296, 26, '#9aa3c7', 'center', 'middle'); otxt('€' + (b / 100).toFixed(2), 720, 366, 78, '#46e08a', 10, '#06070f');
  txt('DAY 8', 540, 424, 24, '#c3c9e4', 'center', 'middle'); ctx.restore();
}
function pollCard(t) {
  if (t < T.poll) return; const k = eBack(vprog(t, T.poll, T.poll + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.poll, T.poll + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
  panel(-460, -330, 920, 660, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT DO I BUY', 0, -255, 58, '#ffd23f', 8); otxt('BEFORE IT GETS DARK?', 0, -188, 54, '#ffd23f', 8);
  [['🔦', 'Flashlight', '€6'], ['🍖', 'Sausages to lure it', '€4'], ['🚨', 'Motion alarm', '€8']].forEach(([e, s, p], i) => { const y = -75 + i * 120, kk = eBack(vprog(t, T.poll + .3 + i * .18, T.poll + .6 + i * .18));
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk); panel(-410, -48, 820, 96, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 52); txt(s, -300, 2, 44, '#ffffff', 'left', 'middle'); txt(p, 380, 2, 44, '#46e08a', 'right', 'middle'); ctx.restore(); });
  txt('Vote in the poll 👇  ·  top 2 get bought', 0, 290, 34, '#c3c9e4', 'center', 'middle'); ctx.restore();
  if (t >= T.card) { const kk = eBack(vprog(t, T.card, T.card + .3)); ctx.save(); ctx.translate(540, 1270); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: link in bio 🔗', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
function overlays(t) {
  vstamp('👀 03:12 AM', 540, 470, t, .3, T.eyes, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('WHAT IS THAT?!', 540, 470, t, T.gate, T.prints, 86, '#ff4d6d', .02, 'rgba(10,12,26,.86)');
  vstamp('🐾 PAW PRINTS…', 540, 330, t, T.prints + .3, T.van, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('…TO MY VAN 😨', 540, 330, t, T.van, T.guess, 92, '#ff4d6d', .02, 'rgba(10,12,26,.86)');
  vstamp('+' + N_NEW + ' NEIGHBORS 🏠', 540, 560, t, T.ton + .1, T.tres, 80, '#ffffff', .02, '#ff2e63');
  vstamp('💰 TREASURE FOUND!', 540, 330, t, T.tres + .1, T.chest - .1, 92, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('🎁 OWN TREASURE CHEST', 540, 330, t, T.chest - .1, T.flag - .1, 80, '#ffd23f', .02, 'rgba(10,12,26,.86)');
  vstamp('🚩 GOLDEN FLAG', 540, 330, t, T.flag - .1, T.only, 88, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('ONLY FOR TREASURE HUNTERS', 540, 330, t, T.only, T.hunt, 70, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('💰 NEW TINY TREASURE EVERY DAY', 540, 330, t, T.hunt + .1, T.nohint, 64, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('🚶 ONLY IN 3D · NO HINTS 🤫', 540, 330, t, T.nohint, T.live, 68, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('🔴 LIVE · A FEW TIMES A WEEK', 540, 330, t, T.live + .1, T.rent, 66, '#ffffff', -.02, '#ff2e63');
  vstamp('TOMORROW: RENT DAY 💰', 540, 330, t, T.rent + .1, T.only14, 80, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp("IT'S GETTING DARK… 🌙", 540, 330, t, T.dark, T.poll, 80, '#ffffff', .02, 'rgba(10,12,26,.86)');
  hud(t); pollCard(t);
}
/* ---------- master ---------- */
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1;
  if (t < T.prints) nightCam(t);
  else if (t < T.guess) withCtx(OC, () => sceneMorning(t));
  else if (t < T.ton) withCtx(OC, () => sceneBlanket(t));
  else if (t < T.hunt) mapScene(t);
  else if (t < T.live) scene3d(t);
  else if (t < T.rent) withCtx(OC, () => sceneLive(t));
  else withCtx(OC, () => sceneDusk(t));
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
  async init(caps, mouth) {
    CAPS = caps; P.mouth = mouth; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    await startWalk(); for (let k = 0; k < 400 && !(window.W3D && W3D.on); k++) await new Promise(r => setTimeout(r, 250));
    window.__globe = true; window.__noBenny = true;
    W3D.shot({ w: 720, h: 1280, t: 0, x: 2.7, z: 4.75, yaw: 0, pitch: 0 });
    P.win = HOUSES.find(h => h.name === WINNER); P.bank = BANK_OLD + N_NEW * 10;
    P.newest = HOUSES.slice(-N_NEW); const c = P.newest.reduce((a, h) => [a[0] + h.i, a[1] + h.j], [0, 0]); P.newC = isoW(c[0] / P.newest.length, c[1] / P.newest.length);
    P.chat = HOUSES.slice(-6).map(h => h.name.length > 16 ? h.name.slice(0, 15) + '…' : h.name);
    // today's chest: stand in the alley, look at it
    P.cx = TR.spot.u; P.cz = TR.spot.v; let best = -1; const wk = (x, z) => __3d.walkable(x, z);
    for (let q = 0; q < 48; q++) { const a = q / 48 * 6.2832; let ok = 0; for (let dd = .8; dd <= 3.6; dd += .2) { if (wk(P.cx - Math.sin(a) * dd, P.cz - Math.cos(a) * dd)) ok++; else break; } if (ok > best) { best = ok; P.cyaw = a; } }
    P.cpitch = window.EP_PITCH != null ? window.EP_PITCH : -.18;
    return JSON.stringify({ win: P.win.idx, spot: [P.cx, P.cz, TR.spot.kind], best, yaw: P.cyaw, n: HOUSES.length });
  },
  frame,
};
})();
