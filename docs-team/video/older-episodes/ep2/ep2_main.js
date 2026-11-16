/* ===================== EPISODE 2 — "Bread day" ===================== */
const DUR = 40.5;
const NEW = +((location.hash.match(/new=(\d+)/) || [0, 54])[1]);
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const within = (t, a, b) => t >= a && t < b;
const STARS2 = []; { const r = seeded(99); for (let k = 0; k < 90; k++) STARS2.push([r() * W, r() * 1000, .8 + r() * 1.8]); }
const BX = 520, BY = 1690, BS = 1.72;
const BREAD = [BX + 66 * BS + 12, BY + (-132 + 4) * BS - 36];   // approx held-bread position (holdLift 1)
const BANKY = 376;

/* ---------- timeline ---------- */
const T = {
  poll0: 2.25, poll1: 4.75,
  cartIn0: 6.3, cartIn1: 7.15, coin0: 7.95, coin1: 8.6, drain0: 8.7, drain1: 9.25, hop0: 9.35, hop1: 9.8, cartOut0: 10.2, cartOut1: 11.1,
  zoom0: 11.3, zoom1: 11.9, bite: 12.55, bliss0: 13.6, bliss1: 17.9, zoomOut0: 17.75, zoomOut1: 18.2,
  pig0: 17.95, pig1: 18.6, crumb0: 21.95, crumb1: 22.35, peck: 22.4,
  lotto0: 23.55, lotto1: 27.6,
  ding: 27.65, rain0: 28.8, rain1: 31.3,
  info0: 31.75, info1: 35.95, mail: 34.35,
  end0: 39.7,
};
const RAINC = []; { const r = seeded(5); const n = 6; for (let k = 0; k < n; k++) { const side = r(); RAINC.push({ t0: T.rain0 + (k / n) * (T.rain1 - T.rain0 - .5), x: side * W, y: H + 40 + r() * 200, wob: r() * 6 }); } }

function bankCents(t) {
  let c = 340;
  if (t >= T.drain0) c = 340 - Math.round(100 * eInOut(prog(t, T.drain0, T.drain1)));
  return c;
}
function lastHit(t) {
  let best = -9;
  if (t >= T.coin1) best = T.coin1;
  return best;
}

/* ---------- pieces ---------- */
function drawCart(x, y) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  ellipse(ctx, 0, 6, 190, 18, 'rgba(0,0,0,.3)');
  // poles + awning
  line(ctx, -150, -150, -150, -330, '#6b4a2e', 10); line(ctx, 150, -150, 150, -330, '#6b4a2e', 10);
  for (let k = 0; k < 6; k++) { poly(ctx, [[-180 + k * 60, -330], [-120 + k * 60, -330], [-120 + k * 60, -290], [-180 + k * 60, -290]], k % 2 ? '#fff4e0' : '#e2483a', OUT, 4); }
  for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(-150 + k * 60, -290, 30, 0, Math.PI); ctx.fillStyle = k % 2 ? '#fff4e0' : '#e2483a'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); }
  // body
  panel(-175, -160, 350, 120, 12, '#b07a46', OUT, 5);
  for (let k = 0; k < 3; k++) line(ctx, -170, -130 + k * 32, 170, -130 + k * 32, '#94622f', 3);
  // breads on top
  for (let k = 0; k < 4; k++) emoji(ctx, k % 2 ? '🥖' : '🍞', -110 + k * 72, -186, 64);
  // sign
  panel(-90, -102, 180, 52, 10, '#fbf3df', OUT, 4); txt('BREAD €1', 0, -75, 30, '#b8402f', 'center', 'middle');
  // wheels
  for (const sx of [-110, 110]) { circle(ctx, sx, -22, 34, '#5b4630', OUT, 5); circle(ctx, sx, -22, 10, '#c9a46b', OUT, 3); }
  ctx.restore();
}
function drawMailbox(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -150, '#6b4a2e', 14);
  rrect(ctx, -70, -250, 140, 104, 40); ctx.fillStyle = '#e2483a'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
  line(ctx, 62, -240, 62, -300, '#555', 6); poly(ctx, [[62, -300], [104, -288], [62, -276]], '#ffd23f', OUT, 3);
  panel(-62, -222, 124, 46, 8, '#fbf3df', OUT, 3); txt('@YOU', 0, -198, 28, '#1b1728', 'center', 'middle');
  ctx.restore();
}
function heart(x, y, s, a) { ctx.save(); ctx.globalAlpha = a; emoji(ctx, '❤️', x, y, 56 * s); ctx.restore(); }

/* ---------- HUD ---------- */
function drawHUD(t) {
  const c = bankCents(t), since = t - lastHit(t);
  const draining = within(t, T.drain0, T.drain1 + .35), col = draining ? '#ff6b6b' : '#46e08a';
  const glow = clamp(1 - since / .45, 0, 1);
  if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, BANKY, 20, 540, BANKY, 380); g.addColorStop(0, `rgba(70,224,138,${.35 * glow})`); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800); ctx.restore(); }
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', draining ? 'rgba(255,107,107,.7)' : 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const bump = 1 + .16 * clamp(1 - since / .25, 0, 1);
  ctx.save(); ctx.translate(540, BANKY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, col, 12, '#06070f'); ctx.restore();
  const extra = '';
  txt('DAY 1  ·  34 tenants' + extra, 540, 440, 26, '#c3c9e4', 'center', 'middle');
  // permanent follow tag
  ctx.font = F(26); const s = 'Follow = you move in 🏠', w = ctx.measureText(s).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2);
  txt(s, 540, 510, 26, '#fff', 'center', 'middle');
  // -€1.00 float
  if (within(t, T.drain0, T.drain0 + 1.1)) { const u = prog(t, T.drain0, T.drain0 + 1.1); ctx.globalAlpha = 1 - u; otxt('-€1.00', 820, 330 - u * 60, 54, '#ff6b6b', 8); ctx.globalAlpha = 1; }
}

/* ---------- main street scene ---------- */
function benny(t, o) {
  const m = MOUTH[Math.min(MOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  drawBenny(ctx, BX, BY, BS, Object.assign({ pose: 'sit', blink: (t % 3.7) < .12, talk: o.mute ? 0 : m }, o));
}
function pigeonPos(t) {
  if (t < T.pig0) return null;
  if (t < T.pig1) { const u = eInOut(prog(t, T.pig0, T.pig1)); return [lerp(1200, 820, u), lerp(900, 1738, u) - Math.sin(u * Math.PI) * 120, t * 26, true]; }
  return [820, 1738, 0, false];
}
function scene(t) {
  ctx.drawImage(STREET_BG, 0, 0);
  for (const [x, y, r] of STARS2) { if (y > 520) continue; ctx.globalAlpha = .12 + .2 * Math.sin(t * 2 + x); circle(ctx, x, y, r, '#fff'); } ctx.globalAlpha = 1;
  lampLight(1);
  poly(ctx, [[240, 1650], [840, 1650], [872, 1724], [210, 1724]], '#94693f', OUT, 4); line(ctx, 222, 1716, 866, 1716, '#78532f', 4);

  // cart
  if (within(t, T.cartIn0, T.cartOut1)) {
    const x = t < T.cartOut0 ? lerp(1320, 880, eOut(prog(t, T.cartIn0, T.cartIn1))) : lerp(880, 1340, eInOut(prog(t, T.cartOut0, T.cartOut1)));
    drawCart(x, 1790);
  }
  // mailbox
  if (t >= T.mail && t < T.end0 + .1) { const k = eBack(prog(t, T.mail, T.mail + .35)); if (k > 0) drawMailbox(150, 1800, 1.1 * k); }

  // golden bliss glow behind benny
  const bl = within(t, T.bliss0, T.bliss1) ? Math.min(prog(t, T.bliss0, T.bliss0 + .5), 1 - prog(t, T.bliss1 - .4, T.bliss1)) : 0;
  if (bl > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.translate(BX, 1330);
    for (let k = 0; k < 12; k++) { ctx.rotate(Math.PI / 6); ctx.fillStyle = `rgba(255,214,120,${.10 * bl})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -900); ctx.lineTo(60, -900); ctx.closePath(); ctx.fill(); }
    const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 520); g.addColorStop(0, `rgba(255,220,140,${.5 * bl})`); g.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = g; ctx.fillRect(-540, -540, 1080, 1080);
    ctx.restore();
  }

  // ---- benny state
  let o = { mood: 'hope', look: [0, 0] };
  const holding = t >= T.hop1;
  if (holding) { o.hold = '🍞'; o.holdLift = 1; o.holdSize = t < T.bite ? 62 : (t < 22.0 ? 54 : 44); }
  if (t < 1.4) { o.mood = 'sad'; o.look = [0, .6]; }
  else if (t < 2.25) { o.mood = 'surprised'; o.look = [0, 0]; }
  else if (t < 4.8) { o.mood = 'happy'; o.look = [0, -.2]; o.armsUp = t < 3.4; }
  else if (t < 6.4) { o.mood = 'happy'; o.look = [0, 0]; }
  else if (t < 7.9) { o.mood = 'happy'; o.look = [.9, .1]; o.wave = eOut(prog(t, 6.45, 6.7)) * (1 - eOut(prog(t, 7.4, 7.7))); }
  else if (t < 9.35) { o.mood = 'surprised'; o.look = [0, -.9]; }
  else if (t < 11.3) { o.mood = 'happy'; o.look = [0, 0]; o.holdLift = eBack(prog(t, T.hop1, T.hop1 + .3)); }
  else if (t < T.bite) { o.mood = 'hope'; o.look = [.7, -.3]; }
  else if (t < 17.95) { o.mood = 'happy'; o.blink = t < 16.3 || (t % 2.2) < .12; o.look = [0, 0]; }
  else if (t < 20.8) { o.mood = 'surprised'; o.look = [.9, .5]; }
  else if (t < 21.9) { o.mood = 'sad'; o.look = [.6, .5]; }
  else if (t < 23.55) { o.mood = 'hope'; o.look = [.8, .6]; }
  else if (t < 27.65) { o.mood = 'mischief'; o.look = [0, 0]; o.blink = within(t, 26.5, 26.75); }
  else if (t < 28.8) { o.mood = 'surprised'; o.look = [0, -1]; }
  else if (t < 31.75) { o.mood = 'surprised'; o.look = [0, -.9]; o.armsUp = t > 30.4; if (o.armsUp) o.hold = null; }
  else if (t < 36.0) { o.mood = 'happy'; o.look = [0, 0]; o.wave = t > 34.3 ? eOut(prog(t, 34.3, 34.55)) : 0; }
  else { o.mood = 'happy'; o.look = [0, 0]; o.blink = (t % 2.6) < .12 || within(t, 37.9, 38.5); }
  benny(t, o);

  // bread hop from cart to hand
  if (within(t, T.hop0, T.hop1)) { const u = prog(t, T.hop0, T.hop1); emoji(ctx, '🍞', lerp(880, BREAD[0], u), lerp(1590, BREAD[1], u) - Math.sin(u * Math.PI) * 220, 66); }
  // bite crumbs
  if (within(t, T.bite, T.bite + .7)) { const u = prog(t, T.bite, T.bite + .7); for (let k = 0; k < 7; k++) { const a = -1.2 + k * .5; ctx.globalAlpha = 1 - u; ellipse(ctx, BREAD[0] - 30 + Math.cos(a) * u * 120, BREAD[1] + 10 + Math.sin(a) * u * 60 + u * u * 160, 8, 6, '#d9a25b', OUT, 2); } ctx.globalAlpha = 1;
    otxt('*CRUNCH*', BREAD[0] + 130, BREAD[1] - 90, 54, '#ffd23f', 8); }
  // bliss sparkles
  if (bl > 0) for (let k = 0; k < 6; k++) { const a = (t * .9 + k / 6) % 1; sparkle(BX + Math.cos(k * 2.1) * 260, 1330 + Math.sin(k * 1.7) * 260 - a * 80, 16 + 12 * Math.sin(a * Math.PI), Math.sin(a * Math.PI) * bl); }
  // hearts after "care about me"
  if (within(t, 4.85, 6.6)) for (let k = 0; k < 4; k++) { const t0 = 4.85 + k * .22; if (t < t0) continue; const u = prog(t, t0, t0 + 1.2); heart(BX - 200 + k * 130, 1250 - u * 230, .8 + .3 * eBack(prog(t, t0, t0 + .25)), 1 - u); }

  // pigeon
  const pp = pigeonPos(t);
  if (pp) {
    let [px, py, fl, flying] = pp;
    const peck = within(t, T.peck, T.peck + .7) ? Math.abs(Math.sin((t - T.peck) * 14)) * 14 : 0;
    const hop = !flying ? Math.abs(Math.sin(t * 3)) * 3 : 0;
    drawPigeon(px, py + peck - hop, 1.45, flying ? fl : 0, -1, false);
    if (within(t, 18.3, 20.6)) { const k = eBack(prog(t, 18.3, 18.55)); ctx.save(); ctx.translate(px + 30, py - 170); ctx.scale(k, k); emoji(ctx, '😤', 0, 0, 70); ctx.restore(); }
    if (within(t, T.peck + .2, T.peck + 1.8)) { const u = prog(t, T.peck + .2, T.peck + 1.8); heart(px, py - 150 - u * 120, 1 + .3 * eBack(prog(t, T.peck + .2, T.peck + .45)), 1 - u); }
  }
  // crumb throw
  if (within(t, T.crumb0, T.crumb1)) { const u = prog(t, T.crumb0, T.crumb1); ellipse(ctx, lerp(BREAD[0], 770, u), lerp(BREAD[1], 1730, u) - Math.sin(u * Math.PI) * 140, 12, 9, '#d9a25b', OUT, 3); }
  if (within(t, T.crumb1, T.peck + .7)) ellipse(ctx, 770, 1730, 12, 9, '#d9a25b', OUT, 3);

  // "growl" hook
  if (t < 1.5) { const sh = Math.sin(t * 60) * 6 * (1 - t / 1.5); ctx.save(); ctx.globalAlpha = clamp((1.5 - t) / .2, 0, 1); otxt('*GRRRUMBLE*', 520 + sh, 1180, 64, '#ffd23f', 9); ctx.restore(); }
  // follower notifications popping up (money comes tomorrow)
  RAINC.forEach((k, i) => {
    if (t < k.t0 || t > T.info0) return; const kk = eBack(prog(t, k.t0, k.t0 + .25));
    const P = [[180, 1150], [900, 1230], [170, 1330], [905, 1410], [190, 1510], [895, 1590]], x = P[i][0], y = P[i][1];
    ctx.save(); ctx.translate(x, y); ctx.scale(kk, kk); panel(-135, -28, 270, 56, 28, 'rgba(255,255,255,.95)', '#ff2e63', 3);
    txt('🔔 new follower!', 0, 1, 25, '#1b1728', 'center', 'middle'); ctx.restore();
  });
  // cart coin
  if (within(t, T.coin0, T.coin1)) { const u = eInOut(prog(t, T.coin0, T.coin1)); drawCoinAt(lerp(540, 880, u), lerp(BANKY, 1640, u) - Math.sin(u * Math.PI) * 200, 34); }
}

/* ---------- overlays ---------- */
function card(t, t0, t1, y, h, draw) {
  if (!within(t, t0, t1)) return;
  const k = eBack(prog(t, t0, t0 + .3)), a = clamp((t1 - t) / .18, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, y); ctx.scale(k, k);
  panel(-420, -h / 2, 840, h, 34, 'rgba(14,16,34,.95)', 'rgba(255,255,255,.25)', 4);
  draw(); ctx.restore();
}
function overlays(t) {
  // poll result
  card(t, T.poll0, T.poll1, 700, 330, () => {
    txt('YOU VOTED 🗳️', 0, -120, 40, '#ffd23f', 'center', 'middle');
    const rows = [['🍞', 'Bread', 64, '#46e08a'], ['🎟️', 'Lotto', 34, '#4da3ff'], ['🕶️', 'Sunglasses', 2, '#9aa3c7']];
    rows.forEach(([e, n, p, col], i) => {
      const y = -50 + i * 78, u = eOut(prog(t, T.poll0 + .25 + i * .1, T.poll0 + 1.0 + i * .1));
      emoji(ctx, e, -350, y, 48);
      rrect(ctx, -300, y - 26, 520, 52, 26); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
      if (p * u > 0) { rrect(ctx, -300, y - 26, Math.max(52, 520 * p / 100 * u), 52, 26); ctx.fillStyle = col; ctx.fill(); }
      txt(n, -280, y + 1, 28, '#fff', 'left', 'middle');
      txt(Math.round(p * u) + '%', 340, y + 1, 36, i === 0 ? '#46e08a' : '#fff', 'right', 'middle');
    });
    if (t > T.poll0 + 1.0) { const k = eBack(prog(t, T.poll0 + 1.0, T.poll0 + 1.3)); ctx.save(); ctx.translate(300, -120); ctx.rotate(.12); ctx.scale(k, k); panel(-90, -26, 180, 52, 14, '#ff2e63', '#fff', 3); txt('WINNER', 0, 1, 28, '#fff', 'center', 'middle'); ctx.restore(); }
  });
  stamp('BEST BREAD IN HISTORY 🏆', 540, 700, t, 15.6, 17.75, 66, '#ffd23f', -.04, 'rgba(10,12,26,.85)');
  stamp('HIM AGAIN?! 😤', 540, 700, t, 18.3, 20.85, 84, '#ff6b6b', .04, 'rgba(10,12,26,.85)');
  stamp('NEIGHBORS NOW 🤝', 540, 700, t, 22.7, 23.55, 76, '#46e08a', -.03, 'rgba(10,12,26,.85)');
  // lotto shout-out
  card(t, T.lotto0, T.lotto1, 700, 250, () => {
    emoji(ctx, '🎟️', -300, -10, 110);
    txt('LOTTO TEAM', 60, -60, 46, '#4da3ff', 'center', 'middle');
    otxt('34%', 60, 10, 84, '#fff', 8);
    txt('maybe next time 😏', 60, 80, 32, '#c3c9e4', 'center', 'middle');
  });
  stamp('DING!', 300, 640, t, T.ding, 28.7, 70, '#ffd23f', -.15);
  stamp('DING!', 790, 700, t, T.ding + .35, 28.7, 70, '#ffd23f', .15);
  stamp('NEW NEIGHBORS?! 😳', 540, 700, t, 30.4, 31.75, 66, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  // follow info
  card(t, T.info0, T.info1, 700, 280, () => {
    txt('1 FOLLOW =', 0, -84, 42, '#fff', 'center', 'middle');
    if (t > 32.55) { const k = eBack(prog(t, 32.55, 32.85)); ctx.save(); ctx.translate(0, -8); ctx.scale(k, k); otxt('+10¢ 💰', 0, 0, 76, '#46e08a', 8); ctx.restore(); }
    if (t > 33.9) { const k = eBack(prog(t, 33.9, 34.2)); ctx.save(); ctx.translate(0, 82); ctx.scale(k, k); otxt('+ YOUR OWN HOUSE 🏠', 0, 0, 52, '#ffd23f', 7); ctx.restore(); }
  });
  // end card
  if (t >= T.end0) {
    const k = eBack(prog(t, T.end0, T.end0 + .3));
    ctx.fillStyle = `rgba(6,8,20,${.4 * prog(t, T.end0, T.end0 + .3)})`; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(540, 720); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)');
    txt("and move into Benny's town 🏠", 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = prog(t, T.end0 + .2, T.end0 + .45); txt('virtual rent · following is free', 540, 860, 26, 'rgba(255,255,255,.8)', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}

/* ---------- master render ---------- */
const CUTS = [2.29, 6.47, 11.49, 18.09, 23.6, 27.72, 31.79, 36.02];
function zoomAt(t) {
  const zin = eInOut(prog(t, T.zoom0, T.zoom1)) * (1 - eInOut(prog(t, T.zoomOut0, T.zoomOut1)));
  const end = eInOut(prog(t, 36.0, 39.6));
  return 1 + .32 * zin + .1 * end;
}
function renderAt(t) {
  S.T = t;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
  let lastCut = 0; for (const c of CUTS) if (t >= c) lastCut = c;
  const punch = t > .1 && lastCut > 0 ? 1 + .04 * (1 - eOut(prog(t, lastCut, lastCut + .32))) : 1;
  const z = zoomAt(t) * punch * (1 + .02 * Math.sin(t * .35));
  ctx.save(); ctx.translate(BX, 1520); ctx.scale(z, z); ctx.translate(-BX, -1520); scene(t); ctx.restore();
  overlays(t);
  drawHUD(t);
  if (t < T.end0) drawCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H); }
}
window.EP = {
  init(caps, mouth) { CAPS = caps; MOUTH = mouth; buildStreet(); },
  frame(t) { renderAt(t); return true; },
  jpeg(t, q) { renderAt(t); return cv.toDataURL('image/jpeg', q || .92); },
  DUR,
};
