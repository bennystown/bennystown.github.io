/* ===================== FOLGE 10 – MORNING DAY 5 — "First snow" ===================== */
const VDUR = __DUR__;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376, H_ = 1920;
const N0 = 4984, N1 = HOUSES.length, BANK0 = 1800, BANK1 = TOWN.bankCents;
const T = { pop0: 6.3, pop1: 12.4, pink: 12.6, black: 17.2, bank: 21.0, bankC0: 21.36, bankC1: 22.9, cold: 24.4, inside: 29.6, noBl: 33.4, noHe: 34.6, breath: 36.4, poll: 38.3, opt: [40.06, 41.02, 42.62], vote: 44.2, end0: 45.2 };
const CUTS = [T.pink, T.black, T.bank, T.cold, T.inside, T.poll];
const LOTV = [-14.0, -20.0];
const HP = HOUSES.find(h => h.name === 'cutie_bubblegum'), HB = HOUSES.find(h => h.name === 'lethimgoplease0');
let VCAPS = [], VMOUTH = [];
const FOC = (() => { const nw = HOUSES.slice(N0, N0 + 260).filter(h => h.i > 0 && h.j > 0); let u = 0, v = 0; nw.forEach(h => { u += h.i; v += h.j; }); return nw.length ? [u / nw.length, v / nw.length] : [30, 30]; })();
const W_ = (u, v) => isoW(u, v);
function setCam(x, y, z) { cam.x = x; cam.y = y; cam.z = z; }
function visAt(t) { return N0 + (N1 - N0) * vprog(t, T.pop0, T.pop1); }
function nightAt(t) { return lerp(.55, .12, sstep(vprog(t, 10, 22))); }
function camAt(t) {
  if (t < T.pink) {
    const [mx, my] = W_(-15, -19), [cx, cy] = W_(FOC[0], FOC[1]), [cx2, cy2] = W_(FOC[0] + 6, FOC[1] - 6);
    const k = sstep(vprog(t, 3.6, 6.0)), pan = sstep(vprog(t, 6, T.pink));
    return setCam(lerp(mx, lerp(cx, cx2, pan), k), lerp(my - 60, lerp(cy, cy2, pan) - 40, k), lerp(lerp(1.3, 1.1, vprog(t, 0, 3.6)), lerp(1.05, 1.15, pan), k));
  }
  if (t < T.black) { const [x, y] = W_(HP.i, HP.j); return setCam(x, y - 60, lerp(2.4, 2.7, vprog(t, T.pink, T.black))); }
  if (t < T.bank) { const [x, y] = W_(HB.i, HB.j); return setCam(x, y - 60, lerp(2.4, 2.7, vprog(t, T.black, T.bank))); }
  if (t < T.cold) { const [x, y] = W_(-17, -19); return setCam(x, y - 30, lerp(.9, 1.1, vprog(t, T.bank, T.cold))); }
  const [x, y] = W_(LOTV[0], LOTV[1]); return setCam(x, y - 70, lerp(2.2, 3.4, sstep(vprog(t, T.cold, T.inside))));
}
// falling snow in screen space
const FL = []; { const r = seeded(77); for (let k = 0; k < 260; k++) FL.push([r() * 1080, r() * 1920, 2 + r() * 5, .4 + r() * .8, r() * 6.28]); }
function snowfall(t, a, sp) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff';
  for (const [x, y, r, v, ph] of FL) { const yy = (y + t * 160 * v * (sp || 1)) % 1980 - 30, xx = (x + Math.sin(t * .9 + ph) * 26 + t * 18) % 1100 - 10; ctx.beginPath(); ctx.arc(xx, yy, r, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
function frost(a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(540, 960, 380, 540, 960, 1150); g.addColorStop(0, 'rgba(210,235,255,0)'); g.addColorStop(.7, 'rgba(210,235,255,.55)'); g.addColorStop(1, 'rgba(240,250,255,.95)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  const r = seeded(5); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3;
  for (let k = 0; k < 26; k++) { const side = k % 4, x0 = side === 0 ? 0 : side === 1 ? 1080 : r() * 1080, y0 = side === 2 ? 0 : side === 3 ? 1920 : r() * 1920; let x = x0, y = y0, ang = Math.atan2(960 - y0, 540 - x0) + (r() - .5); ctx.beginPath(); ctx.moveTo(x, y); for (let q = 0; q < 6; q++) { x += Math.cos(ang) * 40; y += Math.sin(ang) * 40; ctx.lineTo(x, y); ang += (r() - .5) * 1.2; } ctx.stroke(); }
  ctx.restore();
}
function vanSnowCap(u, v) {
  const z = cam.z, k = 1, lift = 5, H = 44 * k + lift + 1, P = (uu, vv) => { const [x, y] = uvS(uu, vv); return [x, y - H * z]; };
  poly(ctx, [P(u - .58, v - .28), P(u + .3, v - .28), P(u + .3, v + .28), P(u - .58, v + .28)], '#f4f8fc', 'rgba(150,170,200,.7)', 1.2 * z);
  for (let q = 0; q < 5; q++) { const [x, y] = P(u - .5 + q * .19, v + .28); ellipse(ctx, x, y + 2 * z, 5 * z, 3.5 * z, '#f4f8fc'); }
}
/* ---------- inside the van ---------- */
function insideVan(t, m) {
  const sh = Math.sin(t * 47) * 3 + Math.sin(t * 29) * 2, push = 1 + .04 * vprog(t, T.inside, T.poll);
  ctx.save(); ctx.translate(540, 1000); ctx.scale(push, push); ctx.translate(-540, -1000);
  // walls (wood panels, cold blue light)
  ctx.fillStyle = '#4a4f63'; ctx.fillRect(0, 0, 1080, 1920);
  for (let x = 0; x < 1080; x += 90) { ctx.fillStyle = x % 180 ? '#50566b' : '#474c60'; ctx.fillRect(x, 0, 88, 1300); }
  ctx.fillStyle = '#3a3e50'; ctx.fillRect(0, 0, 1080, 170);
  // window with snow outside
  const wx = 250, wy = 470, ww = 580, wh = 380;
  rrect(ctx, wx - 22, wy - 22, ww + 44, wh + 44, 34); ctx.fillStyle = '#d8d2c4'; ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, 22); ctx.clip();
  const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#9fb3cf'); g.addColorStop(1, '#e3ecf5'); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = '#f4f8fc'; ctx.beginPath(); ctx.moveTo(wx, wy + wh * .78); for (let x = 0; x <= ww; x += 20) ctx.lineTo(wx + x, wy + wh * .72 + Math.sin(x * .03) * 14); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx, wy + wh); ctx.fill();
  for (const [hx, c] of [[.18, '#e2483a'], [.62, '#4da3ff']]) { const x = wx + ww * hx, y = wy + wh * .7; ctx.fillStyle = c; ctx.fillRect(x, y - 70, 110, 70); ctx.fillStyle = '#f4f8fc'; ctx.beginPath(); ctx.moveTo(x - 12, y - 64); ctx.lineTo(x + 55, y - 120); ctx.lineTo(x + 122, y - 64); ctx.fill(); ctx.fillStyle = '#ffd56b'; ctx.fillRect(x + 40, y - 50, 26, 22); }
  ctx.fillStyle = '#fff'; for (const [x, y, r, v, ph] of FL.slice(0, 70)) { const xx = wx + (x * .55 + Math.sin(t + ph) * 12) % ww, yy = wy + (y * .25 + t * 70 * v) % wh; ctx.beginPath(); ctx.arc(xx, yy, r * .8, 0, 6.29); ctx.fill(); }
  const fr = .55 + .3 * vprog(t, T.inside, T.poll); for (const [cx, cy] of [[wx, wy], [wx + ww, wy], [wx, wy + wh], [wx + ww, wy + wh]]) { const rg = ctx.createRadialGradient(cx, cy, 10, cx, cy, 230); rg.addColorStop(0, `rgba(255,255,255,${fr})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(wx, wy, ww, wh); }
  ctx.restore();
  line(ctx, wx + ww / 2, wy - 10, wx + ww / 2, wy + wh + 10, '#d8d2c4', 16); line(ctx, wx - 10, wy + wh / 2, wx + ww + 10, wy + wh / 2, '#d8d2c4', 16);
  // icicles under the window
  for (let k = 0; k < 9; k++) { const x = wx + 20 + k * 66, l = 24 + (k * 37 % 30); poly(ctx, [[x - 9, wy + wh + 22], [x + 9, wy + wh + 22], [x, wy + wh + 22 + l]], 'rgba(220,240,255,.9)'); }
  // thermometer
  const tx = 930, ty = 640; rrect(ctx, tx - 24, ty - 160, 48, 300, 24); ctx.fillStyle = '#f2efe6'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#e2483a'; ctx.fillRect(tx - 7, ty + 40, 14, 70); circle(ctx, tx, ty + 112, 22, '#e2483a', '#1b1728', 4);
  for (let k = 0; k < 7; k++) line(ctx, tx + 8, ty - 130 + k * 26, tx + 18, ty - 130 + k * 26, '#1b1728', 3);
  otxt('-8°C', tx - 10, ty - 200, 54, '#9fd3ff', 8);
  // bed (no blanket!)
  ctx.fillStyle = '#6b4a33'; ctx.fillRect(0, 1240, 1080, 680); ctx.fillStyle = '#5a3d2a'; ctx.fillRect(0, 1240, 1080, 26);
  rrect(ctx, 60, 1150, 960, 150, 40); ctx.fillStyle = '#d9d3c4'; ctx.fill(); ctx.strokeStyle = '#1b1728'; ctx.lineWidth = 5; ctx.stroke();
  for (let x = 110; x < 1000; x += 70) line(ctx, x, 1160, x, 1290, 'rgba(150,140,120,.45)', 4);
  rrect(ctx, 90, 1080, 230, 110, 46); ctx.fillStyle = '#efe9da'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2b2f40'; ctx.fillRect(0, 1300, 1080, 620);
  // Benny, shivering
  drawBenny(ctx, 560 + sh, 1290, 2.3, { pose: 'sit', mood: vin(t, T.poll, VDUR) ? 'hope' : 'sad', look: vin(t, T.poll, VDUR) ? [0, -.4] : [.2, .3], talk: m, blink: (t % 3.1) < .12 });
  // breath clouds
  for (let k = 0; k < 4; k++) { const ph = ((t - T.inside) * .55 + k / 4) % 1; if (t < T.inside) break; const a = (1 - ph) * .55; ctx.save(); ctx.globalAlpha = a; circle(ctx, 720 + ph * 170 + sh, 960 - ph * 260, 30 + ph * 60, '#ffffff'); ctx.restore(); }
  // cold blue light + vignette
  ctx.fillStyle = 'rgba(80,140,220,.13)'; ctx.fillRect(0, 0, 1080, 1920);
  const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,10,30,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1080, 1920);
  ctx.restore();
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
function tenantsAt(t) { return Math.round(visAt(t)); }
function vHUD(t) {
  const c = bankAt(t), n = tenantsAt(t), up = vin(t, T.bankC0, T.bankC1 + .4), pop = vin(t, T.pop0, T.pop1 + .3);
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const k = up ? 1 + .06 * Math.abs(Math.sin(t * 18)) : 1; ctx.save(); ctx.translate(540, HUDY); ctx.scale(k, k); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  const s = 'DAY 5  ·  ' + n.toLocaleString('en-US') + ' tenants';
  if (pop) { const kk = 1 + .1 * Math.abs(Math.sin(t * 14)); ctx.save(); ctx.translate(540, 440); ctx.scale(kk, kk); txt(s, 0, 0, 30, '#ffd23f', 'center', 'middle'); ctx.restore(); } else txt(s, 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const f = 'Follow = you move in 🏠', w = ctx.measureText(f).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2); txt(f, 540, 510, 26, '#fff', 'center', 'middle');
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1560, sz = 66, maxW = 940;
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
function pollCard(t) {
  if (t < T.poll + .3) return;
  const a = clamp((VDUR - t) / .3, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 1000);
  const k = eBack(vprog(t, T.poll + .3, T.poll + .6)); ctx.scale(k, k);
  panel(-450, -250, 900, 500, 40, 'rgba(10,12,26,.93)', 'rgba(255,255,255,.25)', 3);
  otxt('WHAT SHOULD I BUY?', 0, -180, 56, '#ffd23f', 8);
  [['🔥 Heater', '€60', '#ff8a3d'], ['🧣 Blankets', '€15', '#4da3ff'], ['🪩 Disco ball', '€30', '#c77dff']].forEach(([n, p, c], i) => {
    const t0 = T.opt[i]; if (t < t0 - .1) return; const kk = eBack(vprog(t, t0 - .1, t0 + .2)), y = -70 + i * 110;
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk);
    panel(-410, -42, 820, 84, 28, c, 'rgba(255,255,255,.4)', 3);
    txt(n, -380, 2, 44, '#fff', 'left', 'middle'); txt(p, 380, 2, 44, '#fff', 'right', 'middle');
    if (i === 2) { const sp = t * 4; for (let q = 0; q < 6; q++) { const aa = sp + q; circle(ctx, 250 + Math.cos(aa) * 14, Math.sin(aa) * 6, 3, '#fff'); } }
    ctx.restore();
  });
  ctx.restore();
}
function overlays(t) {
  vstamp('LAST NIGHT… ❄️', 540, 660, t, .4, 5.0, 100, '#ffffff', -.02, 'rgba(10,12,26,.85)');
  vstamp('+' + (N1 - N0) + ' NEW NEIGHBORS 🏠', 540, 660, t, T.pop0, 9.1, 84, '#ffd23f', .02, 'rgba(10,12,26,.88)');
  vstamp('WELCOME HOME 🥹', 540, 660, t, 9.1, T.pink, 92, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('🩷 PINK, AS YOU WISHED', 540, 660, t, T.pink + .2, T.black, 76, '#ff8fc8', -.02, 'rgba(10,12,26,.88)');
  houseTag(t, HP, '🩷 @' + HP.name, '#ff5d8f', T.pink, T.black);
  vstamp('🖤 BLACK, JUST FOR YOU', 540, 660, t, T.black + .2, T.bank, 76, '#ffffff', .02, 'rgba(10,12,26,.88)');
  houseTag(t, HB, '🖤 @' + HB.name, '#1b1728', T.black, T.bank);
  vstamp('+€' + ((BANK1 - BANK0) / 100).toFixed(2) + ' 🏦', 540, 660, t, T.bankC0, T.cold, 104, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  vstamp('BUT THEN… 🥶', 540, 660, t, T.cold + .1, 27.2, 100, '#9fd3ff', -.02, 'rgba(10,12,26,.88)');
  vstamp('-8°C ❄️', 540, 660, t, 27.2, T.inside, 130, '#9fd3ff', .03, 'rgba(10,12,26,.88)');
  vstamp('NO BLANKET ❌', 540, 300, t, T.noBl, T.poll, 80, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  vstamp('NO HEATER ❌', 540, 410, t, T.noHe, T.poll, 80, '#ffffff', .03, 'rgba(10,12,26,.88)');
  pollCard(t);
  vstamp('VOTE NOW 👇', 540, 1350, t, T.vote, VDUR, 90, '#ffffff', -.02, '#ff2e63');
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.save(); ctx.translate(540, 360); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt('and get a house before it gets colder 🏠', 0, 46, 34, '#fff', 'center', 'middle');
    ctx.restore();
  }
}
/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  if (t >= T.inside) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; insideVan(t, m);
  } else {
    camAt(t); VIS = visAt(t);
    BPOS = [999, 999]; BENNY_O = null; BSCALE = 0; BENNY_CARD = true; TOWN.milestones.van = false; VFEATP = 1; VGROUND = null;
    EXTRA_OBJS = objs => { objs.push({ d: LOTV[0] + LOTV[1] + .3, f: () => { drawVan(LOTV[0], LOTV[1], { k: 1 }); vanSnowCap(LOTV[0], LOTV[1]); } }); };
    draw();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(8,12,40,${nightAt(t)})`; ctx.fillRect(0, 0, W, H_);
    snowfall(t, t < T.bank ? .9 : .6, 1);
    frost(sstep(vprog(t, T.cold + .5, T.inside)) * .9);
  }
  overlays(t);
  if (t < T.inside) vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H_); }
  for (const c of CUTS) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, H_); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
};
