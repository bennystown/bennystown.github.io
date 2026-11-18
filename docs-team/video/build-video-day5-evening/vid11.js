/* ===================== FOLGE 11 – EVENING DAY 5 — "Benny's first warm night" ===================== */
const VDUR = __DUR__;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376, H_ = 1920;
const BANK0 = 8270, BANK1 = 2270, NT = HOUSES.length;
const T = {
  vote: 5.0, h87: 8.22, buy: 9.45, bankC0: 9.6, bankC1: 10.8, plug: 12.5, plugIn: 13.0, nothing: 14.89, nopower: 16.9,
  out: 18.75, run: 19.85, arrive: 24.4, hod: 25.3, day1: 28.82, lights: 30.95, thanks: 33.38, click: 34.45,
  melt: 37.4, sleep: 42.6, but: 44.42, open: 45.7, inside: 47.1, room: 48.13, end0: 50.3
};
const CUTS = [T.vote, T.out, T.hod, T.click];
const VAN = [4.55, 4.85];
const HOD = HOUSES.find(h => h.name === 'till6558');
const HDOOR = [HOD.i + .45, HOD.j + .05];
let VPATH_ = null;   // set in EP.init (can be tuned from outside)
let VCAPS = [], VMOUTH = [];
const W_ = (u, v) => isoW(u, v);
function setCam(x, y, z) { cam.x = x; cam.y = y; cam.z = z; }
function pathLen(P) { let L = 0; for (let k = 1; k < P.length; k++) L += Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); return L; }
function pathAt(P, f) {
  let goal = pathLen(P) * clamp(f, 0, 1);
  for (let k = 1; k < P.length; k++) { const d = Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); if (goal <= d) { const q = d ? goal / d : 0; return [lerp(P[k - 1][0], P[k][0], q), lerp(P[k - 1][1], P[k][1], q), k]; } goal -= d; }
  const l = P[P.length - 1]; return [l[0], l[1], P.length - 1];
}
function runF(t) { return sstep(vprog(t, T.run, T.arrive)) * .55 + vprog(t, T.run, T.arrive) * .45; }
function bennyOut(t) { // Benny's ground position outside
  if (t < T.run) return [VAN[0] - .1 + .35 * sstep(vprog(t, T.out + .3, T.run)), VAN[1] + .45];
  return pathAt(VPATH_, runF(t));
}
function camAt(t) {
  if (t < T.run) { const [x, y] = W_(VAN[0] + .2, VAN[1] + .3); return setCam(x, y - 20, lerp(4.6, 4.2, vprog(t, T.out, T.run))); }
  if (t < T.hod) { const b = bennyOut(t), [x, y] = W_(b[0], b[1]); return setCam(x, y - 30, lerp(4.2, 3.1, sstep(vprog(t, T.run, T.run + 1.2)))); }
  const [x, y] = W_(HOD.i, HOD.j); const k = sstep(vprog(t, T.hod, T.hod + 1.2)); return setCam(x, y - 60, lerp(2.6, 3.3, k) + .25 * vprog(t, T.hod + 1.2, T.click));
}
// falling snow in screen space
const VFL = []; { const r = seeded(77); for (let k = 0; k < 260; k++) VFL.push([r() * 1080, r() * 1920, 2 + r() * 5, .4 + r() * .8, r() * 6.28]); }
function snowfall(t, a, sp) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff';
  for (const [x, y, r, v, ph] of VFL) { const yy = (y + t * 160 * v * (sp || 1)) % 1980 - 30, xx = (x + Math.sin(t * .9 + ph) * 26 + t * 18) % 1100 - 10; ctx.beginPath(); ctx.arc(xx, yy, r, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
function frost(a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(540, 960, 380, 540, 960, 1150); g.addColorStop(0, 'rgba(210,235,255,0)'); g.addColorStop(.7, 'rgba(210,235,255,.5)'); g.addColorStop(1, 'rgba(240,250,255,.92)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  const r = seeded(5); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3;
  for (let k = 0; k < 26; k++) { const side = k % 4, x0 = side === 0 ? 0 : side === 1 ? 1080 : r() * 1080, y0 = side === 2 ? 0 : side === 3 ? 1920 : r() * 1920; let x = x0, y = y0, ang = Math.atan2(960 - y0, 540 - x0) + (r() - .5); ctx.beginPath(); ctx.moveTo(x, y); for (let q = 0; q < 6; q++) { x += Math.cos(ang) * 40; y += Math.sin(ang) * 40; ctx.lineTo(x, y); ang += (r() - .5) * 1.2; } ctx.stroke(); }
  ctx.restore();
}
function vanSnowCap(u, v) {
  const z = cam.z, k = 1, lift = 5, H = 44 * k + lift + 1, P = (uu, vv) => { const [x, y] = uvS(uu, vv); return [x, y - H * z]; };
  poly(ctx, [P(u - .58, v - .28), P(u + .3, v - .28), P(u + .3, v + .28), P(u - .58, v + .28)], '#f4f8fc', 'rgba(150,170,200,.7)', 1.2 * z);
  for (let q = 0; q < 5; q++) { const [x, y] = P(u - .5 + q * .19, v + .28); ellipse(ctx, x, y + 2 * z, 5 * z, 3.5 * z, '#f4f8fc'); }
}
/* ---------- pigeon ---------- */
function drawPigeon(x, y, s, flap, face, o) {
  o = o || {};
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.lineJoin = 'round';
  if (o.rot) ctx.rotate(o.rot);
  const wa = Math.sin(flap) * .9, sq = o.loaf ? .55 : 1;
  ctx.save(); ctx.translate(-4, -30); ctx.rotate(-.6 - wa * (o.loaf ? 0 : 1)); ellipse(ctx, -34, 0, 44, 16, '#7d8494', OUT, 4); ctx.restore();
  ellipse(ctx, 0, -26 + (1 - sq) * 8, 46 + (1 - sq) * 8, 30, '#9aa1b0', OUT, 4);
  ellipse(ctx, 14, -40, 20, 16, '#5fa58c');
  poly(ctx, [[-40, -26], [-78, -40], [-74, -12]], '#6c7282', OUT, 4);
  const hy = o.loaf ? -50 : -58;
  circle(ctx, 36, hy, 18, '#8c93a3', OUT, 4);
  if (o.sleep) line(ctx, 37, hy - 4, 47, hy - 4, '#1b1728', 3); else { circle(ctx, 42, hy - 4, 4.5, '#ff8a3d'); circle(ctx, 42, hy - 4, 2, '#1b1728'); }
  poly(ctx, [[52, hy], [70, hy + 4], [52, hy + 8]], '#e8a35a', OUT, 2);
  ctx.save(); ctx.translate(-2, -34); ctx.rotate(-.2 + wa * (o.loaf ? 0 : 1)); ellipse(ctx, -24, 0, 40, 14, '#868d9d', OUT, 4); ctx.restore();
  if (!o.loaf) { line(ctx, -6, 2, -8, 14, '#e07a7a', 4); line(ctx, 8, 2, 10, 14, '#e07a7a', 4); }
  ctx.restore();
}
/* ---------- inside the van ---------- */
const VWX = 250, VWY = 470, VWW = 580, VWH = 380, VHX = 845, VHY = 1490, VSOCK = [118, 1060];
function heatAt(t) { return sstep(vprog(t, T.click + .05, T.click + 1.1)); }
function heaterVis(t) { return eBack(vprog(t, T.buy + .5, T.buy + .85)); }
function drawHeater(t, heat) {
  const k = heaterVis(t); if (k <= 0) return;
  ctx.save(); ctx.translate(VHX, VHY); ctx.scale(k, k);
  if (heat > 0) { const g = ctx.createRadialGradient(0, -110, 20, 0, -110, 520); g.addColorStop(0, `rgba(255,150,60,${.55 * heat})`); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.fillRect(-540, -640, 1080, 1100); }
  ellipse(ctx, 0, 4, 110, 18, 'rgba(0,0,0,.35)');
  rrect(ctx, -95, -225, 190, 220, 30); ctx.fillStyle = '#d9dde6'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 6; ctx.stroke();
  rrect(ctx, -70, -195, 140, 150, 18); ctx.fillStyle = heat > 0 ? `rgb(${Math.round(60 + 195 * heat)},${Math.round(60 + 80 * heat)},${Math.round(70 - 30 * heat)})` : '#3c3f4c'; ctx.fill();
  for (let q = 0; q < 5; q++) { const yy = -180 + q * 30; line(ctx, -60, yy, 60, yy, heat > .1 ? `rgba(255,${200 + 40 * Math.sin(t * 6 + q)},120,${.4 + .6 * heat})` : '#2a2c36', 8); }
  circle(ctx, 0, -25, 13, heat > 0 ? '#46e08a' : '#7a7f8e', '#1b1728', 4);
  rrect(ctx, -80, -12, 40, 14, 6); ctx.fillStyle = '#1b1728'; ctx.fill(); rrect(ctx, 40, -12, 40, 14, 6); ctx.fill();
  ctx.restore();
  // cable to the wall socket
  if (k >= 1) {
    const pk = vprog(t, T.plug, T.plugIn), ex = lerp(VSOCK[0] + 170, VSOCK[0] + 22, sstep(pk)), ey = lerp(VSOCK[1] + 150, VSOCK[1], sstep(pk));
    ctx.save(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(VHX - 95, VHY - 40); ctx.bezierCurveTo(VHX - 300, VHY + 40, ex + 160, ey + 300, ex, ey); ctx.stroke(); ctx.restore();
    rrect(ctx, ex - 4, ey - 18, 40, 36, 8); ctx.fillStyle = '#efe9da'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 4; ctx.stroke();
  }
}
function insideVan(t, m) {
  const heat = heatAt(t), cold = 1 - heat, sleep = vprog(t, T.sleep, T.sleep + 1.2);
  const sh = (Math.sin(t * 47) * 3 + Math.sin(t * 29) * 2) * cold, push = 1 + .03 * Math.sin(t * .4);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(push, push); ctx.translate(-540, -1000);
  ctx.fillStyle = '#4a4f63'; ctx.fillRect(0, 0, 1080, 1920);
  for (let x = 0; x < 1080; x += 90) { ctx.fillStyle = x % 180 ? '#50566b' : '#474c60'; ctx.fillRect(x, 0, 88, 1300); }
  ctx.fillStyle = '#3a3e50'; ctx.fillRect(0, 0, 1080, 170);
  // window (night outside)
  const wx = VWX, wy = VWY, ww = VWW, wh = VWH, op = sstep(vprog(t, T.open, T.open + .6)) * (1 - sstep(vprog(t, T.inside + .4, T.inside + 1)));
  rrect(ctx, wx - 22, wy - 22, ww + 44, wh + 44, 34); ctx.fillStyle = '#d8d2c4'; ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, 22); ctx.clip();
  const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#1d2747'); g.addColorStop(1, '#4d5d84'); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = '#c9d6e8'; ctx.beginPath(); ctx.moveTo(wx, wy + wh * .78); for (let x = 0; x <= ww; x += 20) ctx.lineTo(wx + x, wy + wh * .72 + Math.sin(x * .03) * 14); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx, wy + wh); ctx.fill();
  for (const [hx, c] of [[.18, '#e2483a'], [.62, '#f7c8a8']]) { const x = wx + ww * hx, y = wy + wh * .7; ctx.fillStyle = c; ctx.fillRect(x, y - 70, 110, 70); ctx.fillStyle = '#e8eef6'; ctx.beginPath(); ctx.moveTo(x - 12, y - 64); ctx.lineTo(x + 55, y - 120); ctx.lineTo(x + 122, y - 64); ctx.fill(); ctx.fillStyle = '#ffd56b'; ctx.fillRect(x + 40, y - 50, 26, 22); }
  ctx.fillStyle = '#fff'; for (const [x, y, r, v, ph] of VFL.slice(0, 70)) { const xx = wx + (x * .55 + Math.sin(t + ph) * 12) % ww, yy = wy + (y * .25 + t * 70 * v) % wh; ctx.beginPath(); ctx.arc(xx, yy, r * .8, 0, 6.29); ctx.fill(); }
  // pigeon outside on the sill
  if (vin(t, T.but - .2, T.inside)) {
    const k = sstep(vprog(t, T.but - .2, T.but + .5)), shv = Math.sin(t * 50) * 2.5;
    if (t < T.open + .5) drawPigeon(wx + ww * .87 + shv, wy + wh - 6 + (1 - k) * 200, 1.6, 0, -1, {});
  }
  const fr = .65 * cold + .1; for (const [cx, cy] of [[wx, wy], [wx + ww, wy], [wx, wy + wh], [wx + ww, wy + wh]]) { const rg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 230); rg.addColorStop(0, `rgba(255,255,255,${fr})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(wx, wy, ww, wh); }
  ctx.restore();
  // window frame + right pane that slides open
  line(ctx, wx + ww / 2, wy - 10, wx + ww / 2, wy + wh + 10, '#d8d2c4', 16); line(ctx, wx - 10, wy + wh / 2, wx + ww / 2, wy + wh / 2, '#d8d2c4', 16);
  { const px = wx + ww / 2 - op * (ww / 2 - 40); ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = '#bcd3ee'; ctx.fillRect(px, wy, ww / 2, wh); ctx.restore(); line(ctx, px + ww / 2, wy - 10, px + ww / 2, wy + wh + 10, '#d8d2c4', 14); line(ctx, px, wy + wh / 2, px + ww / 2, wy + wh / 2, '#d8d2c4', 14); }
  // icicles (melting)
  const melt = sstep(vprog(t, T.click + 1, T.melt + 1.6));
  for (let k = 0; k < 9; k++) { const x = wx + 20 + k * 66, l = (24 + (k * 37 % 30)) * (1 - melt); if (l > 2) poly(ctx, [[x - 9 * (1 - melt * .6), wy + wh + 22], [x + 9 * (1 - melt * .6), wy + wh + 22], [x, wy + wh + 22 + l]], 'rgba(220,240,255,.9)');
    if (melt > 0 && melt < 1) { const ph = (t * 1.3 + k * .37) % 1; circle(ctx, x, wy + wh + 30 + l + ph * 140, 5, `rgba(170,215,255,${.8 * (1 - ph)})`); } }
  // thermometer
  const tx = 930, ty = 640, temp = lerp(-8, 18, sstep(vprog(t, T.click + .4, T.melt + .4)));
  rrect(ctx, tx - 24, ty - 160, 48, 300, 24); ctx.fillStyle = '#f2efe6'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 4; ctx.stroke();
  const lvl = lerp(70, 250, (temp + 8) / 26); ctx.fillStyle = '#e2483a'; ctx.fillRect(tx - 7, ty + 110 - lvl, 14, lvl); circle(ctx, tx, ty + 112, 22, '#e2483a', '#1b1728', 4);
  for (let k = 0; k < 7; k++) line(ctx, tx + 8, ty - 130 + k * 26, tx + 18, ty - 130 + k * 26, '#1b1728', 3);
  otxt((temp > 0 ? '+' : '') + Math.round(temp) + '°C', tx - 14, ty - 200, 54, temp > 5 ? '#ffb36b' : '#9fd3ff', 8);
  // wall socket
  rrect(ctx, VSOCK[0] - 30, VSOCK[1] - 40, 80, 80, 14); ctx.fillStyle = '#efe9da'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 4; ctx.stroke();
  circle(ctx, VSOCK[0] + 2, VSOCK[1] - 6, 5, '#1b1728'); circle(ctx, VSOCK[0] + 18, VSOCK[1] - 6, 5, '#1b1728');
  // bed
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(0, 1240, 1080, 680); ctx.fillStyle = '#5a3d2a'; ctx.fillRect(0, 1240, 1080, 26);
  rrect(ctx, 60, 1150, 960, 150, 40); ctx.fillStyle = '#d9d3c4'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 5; ctx.stroke();
  for (let x = 110; x < 1000; x += 70) line(ctx, x, 1160, x, 1290, 'rgba(150,140,120,.45)', 4);
  rrect(ctx, 90, 1080, 230, 110, 46); ctx.fillStyle = '#efe9da'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2b2f40'; ctx.fillRect(0, 1300, 1080, 620);
  // Benny
  const talkOn = vin(t, 34.9, 37.0);
  let mood = 'sad'; if (vin(t, T.vote, T.nothing)) mood = 'hope'; if (t >= T.click + .3) mood = 'happy'; if (t >= T.sleep + .4) mood = 'hope';
  const eyes = t >= T.sleep + .4 || (t % 3.1) < .12;
  ctx.save(); ctx.translate(560 + sh, 1290); ctx.rotate(-.13 * sleep); ctx.translate(-(560 + sh), -1290);
  drawBenny(ctx, 560 + sh, 1290, 2.3, { pose: 'sit', mood, look: vin(t, T.buy, T.nopower) ? [.7, .5] : t >= T.click ? [.6, .3] : [.2, .3], talk: talkOn ? m : 0, blink: eyes, armsUp: vin(t, T.h87 - .1, T.h87 + 1.1) });
  ctx.restore();
  drawHeater(t, heat);
  // pigeon flutters in and curls up by the heater
  if (t >= T.open + .5) {
    const f = sstep(vprog(t, T.open + .5, T.inside)), x0 = VWX + VWW * .87, y0 = VWY + VWH, x1 = 640, y1 = 1500;
    const x = lerp(x0, x1, f), y = lerp(y0, y1, f) - Math.sin(f * Math.PI) * 220, flying = f < 1;
    const loaf = t > T.inside + .5;
    drawPigeon(x, y, 1.9, flying ? t * 26 : 0, flying ? -1 + 2 * sstep(vprog(f, .5, .7)) : 1, { loaf, sleep: t > T.room + .8 });
    if (loaf) { const a = vprog(t, T.room - .3, T.room + .2); ctx.save(); ctx.globalAlpha = a; emoji(ctx, '❤️', x + 60, y - 190 - Math.sin(t * 3) * 8, 46); ctx.restore(); }
  }
  // breath clouds (only while cold)
  if (cold > .02) for (let k = 0; k < 4; k++) { const ph = (t * .55 + k / 4) % 1, a = (1 - ph) * .55 * cold; ctx.save(); ctx.globalAlpha = a; circle(ctx, 720 + ph * 170 + sh, 960 - ph * 260, 30 + ph * 60, '#ffffff'); ctx.restore(); }
  // Zzz
  if (t > T.sleep + .6) for (let k = 0; k < 3; k++) { const ph = ((t - T.sleep) * .45 + k / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * .9; otxt('z', 680 + ph * 90 + k * 10, 860 - ph * 240, 48 + ph * 40, '#ffffff', 7); ctx.restore(); }
  // light: cold blue → warm orange, dimmer when asleep
  ctx.fillStyle = `rgba(80,140,220,${.15 * cold})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = `rgba(255,140,50,${.13 * heat})`; ctx.fillRect(0, 0, 1080, 1920);
  if (sleep > 0) { ctx.fillStyle = `rgba(20,10,30,${.28 * sleep})`; ctx.fillRect(0, 0, 1080, 1920); }
  const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${Math.round(5 + 25 * heat)},10,${Math.round(30 - 20 * heat)},.55)`); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1080, 1920);
  ctx.restore();
}
/* ---------- outside: the cable run ---------- */
function outsideObjs(t) {
  return objs => {
    const z = cam.z;
    objs.push({ d: VAN[0] + VAN[1] + .3, f: () => { drawVan(VAN[0], VAN[1], { k: 1 }); vanSnowCap(VAN[0], VAN[1]); } });
    // cable on the ground
    objs.push({ d: -1e9, f: () => {
      const b = bennyOut(t), pts = [[VAN[0] - .1, VAN[1] + .3]];
      if (t >= T.run) { for (let k = 1; k < b[2]; k++) pts.push(VPATH_[k]); }
      pts.push([b[0], b[1]]);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      pts.forEach(([u, v], i) => { const [x, y] = uvS(u, v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.strokeStyle = '#141420'; ctx.lineWidth = 4.2 * z; ctx.stroke(); ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 2.4 * z; ctx.stroke(); ctx.restore();
    } });
    // Benny
    const b = bennyOut(t), walking = vin(t, T.out + .3, T.arrive);
    objs.push({ d: b[0] + b[1] + .06, f: () => {
      const [x, y] = uvS(b[0], b[1]), bob = walking ? Math.abs(Math.sin(t * 11)) * 4 * z : 0;
      drawBenny(ctx, x, y + 4 * z - bob, .25 * z, { walk: walking ? t * 11 : 0, mood: t >= T.lights ? 'happy' : 'hope', look: t >= T.hod ? [-.4, -.2] : [-.6, .1], blink: (t % 3.3) < .12, wave: vin(t, T.thanks, T.click), shortLegs: true });
    } });
  };
}
function hodGlow(t) {
  const a = sstep(vprog(t, T.lights, T.lights + .5)); if (a <= 0) return;
  const [sx, sy] = uvS(HOD.i, HOD.j), z = cam.z, fl = 1 + .04 * Math.sin(t * 9);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(sx, sy - 30 * z, 5 * z, sx, sy - 30 * z, 170 * z * fl); g.addColorStop(0, `rgba(255,200,110,${.55 * a})`); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 200 * z, sy - 230 * z, 400 * z, 400 * z);
  ctx.restore();
  // little spark where the cable plugs in
  if (vin(t, T.lights - .1, T.lights + .5)) { const [px, py] = uvS(HDOOR[0], HDOOR[1]); ctx.save(); ctx.globalAlpha = 1 - vprog(t, T.lights, T.lights + .5); emoji(ctx, '⚡', px, py - 30 * z, 40 * z); ctx.restore(); }
}
/* ---------- overlays ---------- */
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function bankAt(t) { return Math.round(lerp(BANK0, BANK1, sstep(vprog(t, T.bankC0, T.bankC1)))); }
function vHUD(t) {
  const a = clamp(vprog(t, T.buy - .2, T.buy) * (1 - vprog(t, T.plug - .2, T.plug + .1)), 0, 1); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const c = bankAt(t), dn = vin(t, T.bankC0, T.bankC1 + .3);
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(255,90,90,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const k = dn ? 1 + .06 * Math.abs(Math.sin(t * 18)) : 1; ctx.save(); ctx.translate(540, HUDY); ctx.scale(k, k); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, dn ? '#ff6b6b' : '#46e08a', 12, '#06070f'); ctx.restore();
  txt('DAY 5  ·  ' + NT.toLocaleString('en-US') + ' tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.restore();
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1690, sz = 66, maxW = 940;
  ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15));
  ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => {
    const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; }
  });
  ctx.restore();
}
function houseTag(t, h, label, col, t0, t1) {
  if (!vin(t, t0, t1)) return; const [sx, sy] = uvS(h.i, h.j), st = STY[styleOf(h.v)], z = cam.z, k = eBack(vprog(t, t0 + .2, t0 + .5));
  ctx.save(); ctx.translate(sx, sy - (st.wall + st.roofH + st.f * 32 + 20) * z); ctx.scale(k * 1.5, k * 1.5); tag(0, 0, label, col, 1); ctx.restore();
}
function resultCard(t) {
  if (!vin(t, T.vote + .1, T.buy + .3)) return;
  const a = clamp((T.buy + .3 - t) / .3, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 900);
  const k = eBack(vprog(t, T.vote + .1, T.vote + .45)); ctx.scale(k, k);
  panel(-450, -260, 900, 520, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('YOU VOTED 🗳️', 0, -190, 60, '#ffd23f', 8);
  const fill = sstep(vprog(t, T.vote + .6, T.h87));
  [['🔥 Heater', 87, '#ff8a3d'], ['🧣 Blankets', 11, '#4da3ff'], ['🪩 Disco ball', 2, '#c77dff']].forEach(([n, p, c], i) => {
    const y = -80 + i * 115, win = i === 0 && t >= T.h87, kk = win ? 1 + .05 * Math.abs(Math.sin((t - T.h87) * 8)) * (1 - vprog(t, T.h87, T.h87 + 1)) : 1;
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk);
    panel(-410, -44, 820, 88, 28, 'rgba(255,255,255,.08)', win ? '#ffd23f' : 'rgba(255,255,255,.3)', win ? 5 : 3);
    ctx.save(); rrect(ctx, -410, -44, 820, 88, 28); ctx.clip(); ctx.fillStyle = c; ctx.globalAlpha *= .9; ctx.fillRect(-410, -44, 820 * p / 100 * fill, 88); ctx.restore();
    txt(n, -380, 2, 44, '#fff', 'left', 'middle'); txt(Math.round(p * fill) + '%', 380, 2, 46, '#fff', 'right', 'middle');
    if (win) emoji(ctx, '👑', -420, -50, 52);
    ctx.restore();
  });
  ctx.restore();
}
function overlays(t) {
  vstamp('-8°C 🥶', 540, 300, t, .25, T.vote, 130, '#9fd3ff', -.03, 'rgba(10,12,26,.86)');
  vstamp("BENNY CAN'T SLEEP", 540, 440, t, 2.7, T.vote, 76, '#ffffff', .02, 'rgba(10,12,26,.86)');
  resultCard(t);
  vstamp('-€60 🔥', 540, 650, t, T.bankC0, T.plug - .1, 110, '#ff8a8a', -.03, 'rgba(10,12,26,.88)');
  vstamp('🔌 PLUG IT IN…', 540, 420, t, T.plug, T.nothing - .05, 84, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('…NOTHING 😐', 540, 420, t, T.nothing, T.nopower - .05, 96, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('NO POWER ❌', 540, 420, t, T.nopower, T.out, 110, '#ff6b6b', .03, 'rgba(10,12,26,.88)');
  vstamp('OPERATION: CABLE 🔌', 540, 420, t, T.run - .1, T.arrive + .5, 84, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  vstamp('🏆 HOUSE OF THE DAY', 540, 380, t, T.hod + .1, T.click, 84, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
  houseTag(t, HOD, '🏆 @' + HOD.name, '#ffd23f', T.hod + .4, T.click);
  vstamp('HERE SINCE DAY 1 ❤️', 540, 540, t, T.day1, T.lights, 74, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('💡 POWER ON', 540, 540, t, T.lights, T.thanks, 84, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('THANK YOU, NEIGHBOR 🫶', 540, 540, t, T.thanks, T.click, 76, '#ffffff', -.02, '#ff2e63');
  vstamp('🔥 IT WORKS!', 540, 300, t, T.click + .15, T.melt, 110, '#ffb36b', -.03, 'rgba(10,12,26,.86)');
  vstamp('+18°C ☀️', 540, 300, t, T.melt + .2, T.sleep, 120, '#ffb36b', .03, 'rgba(10,12,26,.86)');
  vstamp('FINALLY ASLEEP 😴', 540, 300, t, T.sleep + .4, T.but, 90, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('…WAIT 👀', 540, 300, t, T.but, T.inside, 100, '#ffffff', .03, 'rgba(10,12,26,.86)');
  vstamp('NEW ROOMMATE 🐦', 540, 300, t, T.room, T.end0, 96, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.save(); ctx.translate(540, 330); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt('and get your own house in Benny\'s town 🏠', 0, 46, 32, '#fff', 'center', 'middle');
    ctx.restore();
  }
}
/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  const outside = vin(t, T.out, T.click);
  if (!outside) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; insideVan(t, m);
  } else {
    camAt(t); VIS = Infinity;
    BPOS = [999, 999]; BENNY_O = null; BSCALE = 0; BENNY_CARD = true; TOWN.milestones.van = false; VFEATP = null; VGROUND = null;
    EXTRA_OBJS = outsideObjs(t);
    draw();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(8,12,40,.42)'; ctx.fillRect(0, 0, W, H_);
    hodGlow(t);
    snowfall(t, .55, 1);
  }
  overlays(t);
  vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H_); }
  for (const c of CUTS) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, H_); }
  if (vin(t, T.click - .02, T.click + .25)) { ctx.fillStyle = `rgba(255,200,120,${.5 * (1 - vprog(t, T.click, T.click + .25))})`; ctx.fillRect(0, 0, W, H_); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150;
    VPATH_ = window.VPATH || [[VAN[0] - .1, VAN[1] + .45], [HDOOR[0], VAN[1] + .45], HDOOR]; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
  setPath(p) { VPATH_ = p; },
};
