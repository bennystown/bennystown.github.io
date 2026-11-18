/* ===================== PINNED EXPLAINER — "Who is Benny?" ===================== */
const VDUR = __DUR__;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const H_ = 1920, N1 = HOUSES.length;
const T = {
  pull: 2.3, grand: 3.7, key: 6.9, pigeon: 9.9, deal: 11.5, follow: 13.3, house: 14.27, coin: 18.4,
  morning: 19.3, bio: 21.6, rent: 23.45, stay: 25.3, flow: 27.68, fence: 28.6, pool: 29.68,
  story: 30.45, bread: 32.1, grow: 34.85, hall: 38.3, tent: 40.4, van: 41.45, lamps: 42.6, tires: 43.3, market: 44.0,
  snow: 46.1, vote: 50.2, end0: 52.25,
};
const CUTS = [T.grand, T.pigeon, T.deal, T.morning, T.stay, T.story, T.bread, T.grow, T.hall, T.tent, T.van, T.lamps, T.tires, T.market, T.snow, T.end0];
const MS0 = Object.assign({}, TOWN.milestones);
const BSPOT = [3.5, 3.65];
const DAY1 = HOUSES.find(h => h.day === 1 && h.i > 0 && h.j > 0) || HOUSES[5];
const YOU = HOUSES[N1 - 1];
let VCAPS = [], VMOUTH = [];
const W_ = (u, v) => isoW(u, v);
function setCam(x, y, z) { cam.x = x; cam.y = y; cam.z = z; }
function at(u, v, z, dy) { const [x, y] = W_(u, v); setCam(x, y - (dy || 0), z); }

/* ---------- world state per scene ---------- */
function worldState(t) {
  let vis = N1, ms = MS0, feat = 1, night = 0, rain = 0;
  if (t < T.grand) { night = .45; rain = 1; ms = { park: true, townHall: true }; }
  else if (t < T.deal) { vis = 0; ms = {}; feat = 0; night = t < T.pigeon ? .25 : .45; rain = t >= T.pigeon ? .6 : 0; }
  else if (t < T.morning) { vis = N1 - 1 + 10 * vprog(t, T.house, T.house + .45); }
  else if (t < T.rent) { vis = N1 - 60 + 70 * sstep(vprog(t, T.morning + .2, T.morning + 1.6)); night = .4 * (1 - sstep(vprog(t, T.morning, T.morning + 1.2))); }
  else if (t >= T.bread && t < T.grow) { ms = { park: true, townHall: true }; }
  else if (t >= T.grow && t < T.hall) { vis = 34 + (N1 + 10 - 34) * Math.pow(sstep(vprog(t, T.grow + .3, T.hall - .3)), 1.6); }
  else if (t >= T.lamps && t < T.tires) night = .55;
  return { vis, ms, feat, night, rain };
}
function camAt(t) {
  if (t < T.grand) {
    if (t < T.pull) return at(BSPOT[0], BSPOT[1], 3.2, 40);
    const k = sstep(vprog(t, T.pull, T.grand - .2)); const [x0, y0] = W_(BSPOT[0], BSPOT[1]), [x1, y1] = W_(CEN, CEN);
    return setCam(lerp(x0, x1, k), lerp(y0 - 40, y1, k), Math.exp(lerp(Math.log(3.2), Math.log(.28), k)));
  }
  if (t < T.pigeon) return at(CEN, CEN, lerp(.9, 1.05, vprog(t, T.grand, T.pigeon)), 0);
  if (t < T.deal) return at(BSPOT[0], BSPOT[1], 3.4, 40);
  if (t < T.morning) return at(YOU.i, YOU.j, lerp(3.0, 3.3, vprog(t, T.deal, T.morning)), 70);
  if (t < T.rent) return at(YOU.i - 4, YOU.j - 4, lerp(1.0, .8, vprog(t, T.morning, T.rent)), 0);
  if (t < T.stay) return at(4, 4, .9, 0);
  if (t < T.story) return at(DAY1.i, DAY1.j, lerp(2.6, 3.0, vprog(t, T.stay, T.story)), 60);
  if (t < T.bread) return at(CEN, CEN, .55, 0);
  if (t < T.grow) return at(BSPOT[0], BSPOT[1], 3.4, 40);
  if (t < T.hall) return at(CEN, CEN, Math.exp(lerp(Math.log(1.6), Math.log(.27), sstep(vprog(t, T.grow, T.hall - .4)))), 0);
  if (t < T.tent) return at(3, 14.6, lerp(1.7, 1.9, vprog(t, T.hall, T.tent)), 40);
  if (t < T.van) return at(4.75, 2.4, 3.0, 50);
  if (t < T.lamps) return at(4.55, 4.85, 3.0, 50);
  if (t < T.tires) return at(4, 4, 1.4, 0);
  if (t < T.market) return at(4.55, 4.85, 3.6, 30);
  if (t < T.snow) return at(-19, -18.8, lerp(1.0, 1.15, vprog(t, T.market, T.snow)), 30);
  return at(CEN, CEN, lerp(.42, .36, vprog(t, T.end0, VDUR)), 0);
}
function bennyState(t, m) {
  if (t < T.grand) return { pos: BSPOT, o: { pose: 'sit', mood: 'sad', look: [0, .5], talk: m } };
  if (vin(t, T.pigeon, T.deal)) return { pos: BSPOT, o: { pose: 'sit', mood: t > 10.6 ? 'angry' : 'happy', look: t > 10.6 ? [.9, -.6] : [0, .5], talk: m } };
  if (vin(t, T.bread, T.grow)) return { pos: BSPOT, o: { pose: 'sit', mood: 'happy', look: [0, 0], talk: m, armsUp: t > 33.5 } };
  return null;
}

/* ---------- screen helpers ---------- */
const RN = []; { const r = seeded(3); for (let k = 0; k < 220; k++) RN.push([r() * 1200, 900 + r() * 700, 30 + r() * 40, r() * 2000, .25 + r() * .35, 1.5 + r() * 2]); }
function rainFx(t, a) { if (a <= 0) return; ctx.save(); ctx.lineCap = 'round'; for (const [x0, sp, ln, ph, al, w] of RN) { const y = (ph + t * sp) % 2100 - 100, x = x0 - y * .2; ctx.strokeStyle = `rgba(190,210,245,${al * a})`; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ln * .2, y - ln); ctx.stroke(); } ctx.restore(); }
const FL = []; { const r = seeded(77); for (let k = 0; k < 220; k++) FL.push([r() * 1080, r() * 1920, 2 + r() * 5, .4 + r() * .8, r() * 6.28]); }
function snowfall(t, a) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; for (const [x, y, r, v, ph] of FL) { const yy = (y + t * 160 * v) % 1980 - 30, xx = (x + Math.sin(t * .9 + ph) * 26 + t * 18) % 1100 - 10; ctx.beginPath(); ctx.arc(xx, yy, r, 0, 6.29); ctx.fill(); } ctx.restore(); }
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
const BG = 'rgba(10,12,26,.88)';
function pigeonFx(t) {
  if (!vin(t, T.pigeon, T.deal)) return;
  const [bx, by] = uvS(BSPOT[0], BSPOT[1]), z = cam.z, p = vprog(t, T.pigeon, T.deal);
  // bread on the cardboard, pigeon swoops in from the right and flies off with it
  const grab = 10.5, has = t >= grab;
  if (!has) emoji(ctx, '🍞', bx + 70 * z, by - 4 * z, 34 * z);
  let x, y; if (t < grab) { const k = vprog(t, T.pigeon, grab); x = lerp(1250, bx + 90 * z, sstep(k)); y = lerp(500, by - 10 * z, sstep(k)); } else { const k = vprog(t, grab, T.deal); x = lerp(bx + 90 * z, -250, k * k); y = lerp(by - 10 * z, 300, k); }
  drawPigeon(x, y, 1.0, t * 26, t < grab ? -1 : -1, has);
}
function drawPigeon(x, y, s, flap, face, crumb) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.lineJoin = 'round';
  const wa = Math.sin(flap) * .9;
  ctx.save(); ctx.translate(-4, -30); ctx.rotate(-.6 - wa); ellipse(ctx, -34, 0, 44, 16, '#7d8494', OUT, 4); ctx.restore();
  ellipse(ctx, 0, -26, 46, 30, '#9aa1b0', OUT, 4); ellipse(ctx, 14, -40, 20, 16, '#5fa58c');
  poly(ctx, [[-40, -26], [-78, -40], [-74, -12]], '#6c7282', OUT, 4);
  circle(ctx, 36, -58, 18, '#8c93a3', OUT, 4); circle(ctx, 42, -62, 4.5, '#ff8a3d'); circle(ctx, 42, -62, 2, '#1b1728');
  poly(ctx, [[52, -58], [70, -54], [52, -50]], '#e8a35a', OUT, 2);
  if (crumb) emoji(ctx, '🍞', 78, -48, 40);
  ctx.save(); ctx.translate(-2, -34); ctx.rotate(-.2 + wa); ellipse(ctx, -24, 0, 40, 14, '#868d9d', OUT, 4); ctx.restore();
  line(ctx, -6, 2, -8, 14, '#e07a7a', 4); line(ctx, 8, 2, 10, 14, '#e07a7a', 4);
  ctx.restore();
}
function letterCard(t, t0, t1, lines, sign) {
  if (!vin(t, t0, t1)) return; const k = eBack(vprog(t, t0, t0 + .35)), a = clamp((t1 - t) / .25, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 1040); ctx.rotate(-.03); ctx.scale(k, k);
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 30; rrect(ctx, -380, -230, 760, 460, 18); ctx.fillStyle = '#f6eedb'; ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 4; ctx.stroke();
  for (let k2 = 0; k2 < 6; k2++) line(ctx, -330, -120 + k2 * 60, 330, -120 + k2 * 60, 'rgba(120,150,200,.25)', 2);
  ctx.font = 'italic 600 46px Poppins, sans-serif'; ctx.fillStyle = '#3a2a1a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, -140 + i * 64));
  ctx.textAlign = 'right'; ctx.fillText(sign, 330, 175);
  ctx.restore();
}
function followBtn(t) {
  if (!vin(t, T.deal + .2, T.house + .6)) return;
  const pressed = t >= T.follow && t < T.follow + .25, done = t >= T.follow + .25, k = eBack(vprog(t, T.deal + .2, T.deal + .5));
  ctx.save(); ctx.translate(540, 1300); ctx.scale(k * (pressed ? .92 : 1), k * (pressed ? .92 : 1));
  panel(-230, -60, 460, 120, 60, done ? '#3a3f55' : '#ff2e63', 'rgba(255,255,255,.4)', 3);
  txt(done ? 'Following ✓' : 'Follow', 0, 3, 54, '#fff', 'center', 'middle'); ctx.restore();
  if (vin(t, T.follow - .5, T.follow + .3)) { const p = vprog(t, T.follow - .5, T.follow); emoji(ctx, '👆', lerp(700, 560, p), lerp(1500, 1350, p), 90); }
}
function youTag(t) {
  if (!vin(t, T.house, T.morning)) return; const [sx, sy] = uvS(YOU.i, YOU.j), st = STY[styleOf(YOU.v)], z = cam.z, k = eBack(vprog(t, T.house + .1, T.house + .4));
  ctx.save(); ctx.translate(sx, sy - (st.wall + st.roofH + st.f * 32 + 20) * z); ctx.scale(k * 2.6, k * 2.6); tag(0, 0, '📬 @you', '#ff2e63', 1); ctx.restore();
}
function coinFx(t) {
  if (!vin(t, T.coin - .2, T.morning)) return; const p = vprog(t, T.coin - .2, T.coin + .6);
  panel(330, 250, 420, 130, 34, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4); txt("BENNY'S BANK", 540, 280, 22, '#9aa3c7', 'center', 'middle');
  otxt(t > T.coin + .5 ? '+10¢ 🪙' : '…', 540, 335, 64, '#46e08a', 8);
  if (p < 1) { const x = lerp(540, 540, p), y = lerp(1000, 330, sstep(p)); circle(ctx, x, y, 34, '#f5b82e', '#8a5a12', 4); txt('¢', x, y + 2, 38, '#8a5a12', 'center', 'middle'); }
}
function searchBar(t) {
  if (!vin(t, T.bio, T.rent)) return; const k = eBack(vprog(t, T.bio, T.bio + .3)), s = '@you'.slice(0, Math.floor(vprog(t, T.bio + .3, T.bio + 1.1) * 5));
  ctx.save(); ctx.translate(540, 1150); ctx.scale(k, k); panel(-400, -60, 800, 120, 60, '#ffffff', 'rgba(0,0,0,.2)', 3); txt('🔍  ' + s + (t % .6 < .3 ? '|' : ''), -350, 4, 52, '#1b1728', 'left', 'middle'); ctx.restore();
}
function coinRain(t) {
  if (!vin(t, T.rent, T.stay)) return; const r = seeded(11);
  for (let k = 0; k < 40; k++) { const x = r() * 1080, sp = 700 + r() * 600, y = ((t - T.rent) * sp + r() * 600) - 300; circle(ctx, x, y, 22, '#f5b82e', '#8a5a12', 3); txt('¢', x, y + 1, 24, '#8a5a12', 'center', 'middle'); }
}
function tierCards(t) {
  [['🌸', '3 DAYS', 'FLOWERS', T.flow], ['🪵', '1 WEEK', 'FENCE', T.fence], ['🏊', '3 MONTHS', 'POOL', T.pool]].forEach(([e, d, n, t0], i) => {
    if (!vin(t, t0 - .05, T.story)) return; const k = eBack(vprog(t, t0 - .05, t0 + .25)), x = 200 + i * 340;
    ctx.save(); ctx.translate(x, 1330); ctx.scale(k, k); panel(-150, -130, 300, 260, 34, BG, 'rgba(255,255,255,.3)', 3);
    emoji(ctx, e, 0, -45, 90); txt(d, 0, 45, 34, '#ffd23f', 'center', 'middle'); txt(n, 0, 92, 36, '#fff', 'center', 'middle'); ctx.restore();
  });
}
function pollCard(t) {
  if (!vin(t, T.vote, T.end0)) return; const k = eBack(vprog(t, T.vote, T.vote + .3));
  ctx.save(); ctx.translate(540, 1000); ctx.scale(k, k); panel(-450, -250, 900, 500, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('YOU DECIDE 🗳️', 0, -180, 60, '#ffd23f', 8);
  [['🔥 Heater', '€60', '#ff8a3d'], ['🧣 Blankets', '€15', '#4da3ff'], ['🪩 Disco ball', '€30', '#c77dff']].forEach(([n, p, c], i) => { const y = -70 + i * 110; panel(-410, y - 42, 820, 84, 28, c, 'rgba(255,255,255,.4)', 3); txt(n, -380, y + 2, 44, '#fff', 'left', 'middle'); txt(p, 380, y + 2, 44, '#fff', 'right', 'middle'); });
  ctx.restore();
}
/* inside the van (from Folge 10) */
function insideVan(t, m) {
  const sh = Math.sin(t * 47) * 3 + Math.sin(t * 29) * 2;
  ctx.fillStyle = '#4a4f63'; ctx.fillRect(0, 0, 1080, 1920);
  for (let x = 0; x < 1080; x += 90) { ctx.fillStyle = x % 180 ? '#50566b' : '#474c60'; ctx.fillRect(x, 0, 88, 1300); }
  ctx.fillStyle = '#3a3e50'; ctx.fillRect(0, 0, 1080, 170);
  const wx = 250, wy = 470, ww = 580, wh = 380;
  rrect(ctx, wx - 22, wy - 22, ww + 44, wh + 44, 34); ctx.fillStyle = '#d8d2c4'; ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, 22); ctx.clip();
  const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#9fb3cf'); g.addColorStop(1, '#e3ecf5'); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = '#f4f8fc'; ctx.beginPath(); ctx.moveTo(wx, wy + wh * .78); for (let x = 0; x <= ww; x += 20) ctx.lineTo(wx + x, wy + wh * .72 + Math.sin(x * .03) * 14); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx, wy + wh); ctx.fill();
  for (const [hx, c] of [[.18, '#e2483a'], [.62, '#4da3ff']]) { const x = wx + ww * hx, y = wy + wh * .7; ctx.fillStyle = c; ctx.fillRect(x, y - 70, 110, 70); ctx.fillStyle = '#f4f8fc'; ctx.beginPath(); ctx.moveTo(x - 12, y - 64); ctx.lineTo(x + 55, y - 120); ctx.lineTo(x + 122, y - 64); ctx.fill(); ctx.fillStyle = '#ffd56b'; ctx.fillRect(x + 40, y - 50, 26, 22); }
  ctx.fillStyle = '#fff'; for (const [x, y, r, v, ph] of FL.slice(0, 70)) { const xx = wx + (x * .55 + Math.sin(t + ph) * 12) % ww, yy = wy + (y * .25 + t * 70 * v) % wh; ctx.beginPath(); ctx.arc(xx, yy, r * .8, 0, 6.29); ctx.fill(); }
  for (const [cx, cy] of [[wx, wy], [wx + ww, wy], [wx, wy + wh], [wx + ww, wy + wh]]) { const rg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 230); rg.addColorStop(0, 'rgba(255,255,255,.7)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(wx, wy, ww, wh); }
  ctx.restore();
  line(ctx, wx + ww / 2, wy - 10, wx + ww / 2, wy + wh + 10, '#d8d2c4', 16); line(ctx, wx - 10, wy + wh / 2, wx + ww + 10, wy + wh / 2, '#d8d2c4', 16);
  for (let k = 0; k < 9; k++) { const x = wx + 20 + k * 66, l = 24 + (k * 37 % 30); poly(ctx, [[x - 9, wy + wh + 22], [x + 9, wy + wh + 22], [x, wy + wh + 22 + l]], 'rgba(220,240,255,.9)'); }
  const tx = 930, ty = 640; rrect(ctx, tx - 24, ty - 160, 48, 300, 24); ctx.fillStyle = '#f2efe6'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#e2483a'; ctx.fillRect(tx - 7, ty + 40, 14, 70); circle(ctx, tx, ty + 112, 22, '#e2483a', '#1b1728', 4); otxt('-8°C', tx - 10, ty - 200, 54, '#9fd3ff', 8);
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(0, 1240, 1080, 680); rrect(ctx, 60, 1150, 960, 150, 40); ctx.fillStyle = '#d9d3c4'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 5; ctx.stroke();
  rrect(ctx, 90, 1080, 230, 110, 46); ctx.fillStyle = '#efe9da'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#2b2f40'; ctx.fillRect(0, 1300, 1080, 620);
  drawBenny(ctx, 560 + sh, 1290, 2.3, { pose: 'sit', mood: 'sad', look: [.2, .3], talk: m, blink: (t % 3.1) < .12 });
  for (let k = 0; k < 4; k++) { const ph = ((t - T.snow) * .55 + k / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * .55; circle(ctx, 720 + ph * 170 + sh, 960 - ph * 260, 30 + ph * 60, '#fff'); ctx.restore(); }
  ctx.fillStyle = 'rgba(80,140,220,.13)'; ctx.fillRect(0, 0, 1080, 1920);
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1600, sz = 64, maxW = 940; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15)); ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => { const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; } });
  ctx.restore();
}
function overlays(t) {
  vstamp("I'M HOMELESS…", 540, 600, t, .3, T.pull, 96, '#ffffff', -.02, BG);
  vstamp('…BUT I OWN A WHOLE TOWN 🏙️', 540, 600, t, T.pull, T.grand, 76, '#ffd23f', .02, BG);
  letterCard(t, 4.0, T.key + .2, ['Benny,', 'this town is yours now.', ''], '– Grandpa');
  vstamp('🔑', 540, 1350, t, T.key, T.pigeon, 160, '#fff', 0, null);
  vstamp('…AND NOTHING ELSE', 540, 600, t, 7.7, T.pigeon, 84, '#ffffff', -.02, BG);
  vstamp('HEY!! 😤', 540, 600, t, 10.55, T.deal, 110, '#ff6b6b', .04, BG);
  pigeonFx(t);
  vstamp('THE DEAL 🤝', 540, 600, t, T.deal, T.house, 96, '#ffd23f', -.02, BG);
  followBtn(t);
  vstamp('YOUR OWN HOUSE 🏠', 540, 600, t, T.house, T.coin - .2, 88, '#ffffff', .02, BG);
  youTag(t); coinFx(t);
  vstamp('NEXT MORNING ☀️', 540, 600, t, T.morning, T.bio, 92, '#ffd23f', -.02, BG);
  vstamp('LINK IN BIO 🔗', 540, 600, t, T.bio, T.rent, 92, '#ffffff', .02, BG); searchBar(t);
  vstamp('SUNDAY = RENT DAY 💰', 540, 600, t, T.rent, T.stay, 84, '#46e08a', -.02, BG); coinRain(t);
  vstamp('STAY = YOUR HOUSE GROWS 🌱', 540, 600, t, T.stay, T.story, 70, '#ffffff', .02, BG); tierCards(t);
  vstamp('THE STORY SO FAR 📖', 540, 900, t, T.story, T.bread, 92, '#ffd23f', -.02, BG);
  vstamp('🍞 YOU FED ME', 540, 600, t, T.bread, T.grow, 96, '#ffffff', .02, BG);
  if (t >= T.bread + .2 && t < T.grow) { const [bx, by] = uvS(BSPOT[0], BSPOT[1]); emoji(ctx, '🍞', bx + 40 * cam.z, by - 60 * cam.z - Math.abs(Math.sin(t * 6)) * 8, 46 * cam.z); }
  if (vin(t, T.grow, T.hall)) { const n = Math.min(N1, Math.round(worldState(t).vis)); vstamp('NEIGHBORS', 540, 720, t, T.grow, T.hall, 60, '#ffffff', 0, null); ctx.save(); ctx.translate(540, 600); otxt(n.toLocaleString('en-US'), 0, 0, 150, '#ffd23f', 14); ctx.restore(); }
  vstamp("🏛️ GRANDPA'S LETTER", 540, 600, t, T.hall, T.tent, 80, '#ffffff', -.02, BG);
  letterCard(t, 38.7, T.tent, ['If you’re reading this…', 'the town isn’t empty anymore.', 'Build it together.'], '– Grandpa');
  vstamp('⛺ TENT', 540, 600, t, T.tent, T.van, 110, '#ffffff', .03, BG);
  vstamp('🚐 CAMPERVAN', 540, 600, t, T.van, T.lamps, 100, '#ffffff', -.03, BG);
  vstamp('💡 STREET LAMPS', 540, 600, t, T.lamps, T.tires, 96, '#ffd23f', .03, BG);
  vstamp('🛞 TIRES', 540, 600, t, T.tires, T.market, 110, '#ffffff', -.03, BG);
  vstamp('🛍️ A WHOLE MARKETPLACE', 540, 600, t, T.market, T.snow, 80, '#ffd23f', .02, BG);
  vstamp("NOW: IT'S SNOWING ❄️", 540, 300, t, T.snow, T.vote, 80, '#9fd3ff', -.02, BG);
  vstamp("…AND I'M FREEZING 🥶", 540, 420, t, 48.4, T.vote, 76, '#ffffff', .02, BG);
  pollCard(t);
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -110, 940, 220, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = MOVE IN 🏠', 0, -32, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt('your house is waiting', 0, 50, 40, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = vprog(t, T.end0 + .4, T.end0 + .7); txt('Find your house: link in bio 🔗', 540, 940, 36, '#fff', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}
/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  if (vin(t, T.snow, T.end0)) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; insideVan(t, m); }
  else {
    const w = worldState(t); camAt(t); VIS = w.vis; TOWN.milestones = w.ms; VFEATP = w.feat;
    VGROUND = w.feat ? () => { VMK_DRAW = true; drawMarketGround(1); VMK_DRAW = false; } : null;
    const b = bennyState(t, m);
    if (b) { BPOS = b.pos; BENNY_O = () => b.o; BSCALE = 1; } else { BPOS = [999, 999]; BENNY_O = null; BSCALE = 0; }
    BENNY_CARD = true; BDY = 0; BD = null;
    const showVan = w.ms.van; TOWN.milestones = Object.assign({}, w.ms, { van: false });
    EXTRA_OBJS = objs => { if (showVan) objs.push({ d: 4.55 + 4.85 + .3, f: () => drawVan(4.55, 4.85, { k: 1 }) }); };
    draw();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    if (w.night) { ctx.fillStyle = `rgba(8,12,40,${w.night})`; ctx.fillRect(0, 0, W, H_); }
    if (w.night && t >= T.lamps && t < T.tires) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [u, v] of STREET_LAMPS.slice(0, 400)) { const [x, y] = uvS(u, v); if (x < -50 || x > 1130 || y < -50 || y > 1970) continue; const gg = ctx.createRadialGradient(x, y - 30 * cam.z, 2, x, y - 30 * cam.z, 60 * cam.z); gg.addColorStop(0, 'rgba(255,214,140,.55)'); gg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = gg; ctx.fillRect(x - 60 * cam.z, y - 90 * cam.z, 120 * cam.z, 120 * cam.z); } ctx.restore(); }
    rainFx(t, w.rain);
  }
  overlays(t);
  if (t < T.end0) vCaption(t);
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H_); }
  for (const c of CUTS) if (vin(t, c, c + .1)) { ctx.fillStyle = `rgba(255,255,255,${.25 * (1 - (t - c) / .1)})`; ctx.fillRect(0, 0, W, H_); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
};
