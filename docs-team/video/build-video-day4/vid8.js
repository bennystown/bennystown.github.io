/* ===================== FOLGE 8 – BUILD VIDEO DAY 4 — "No tires… but 16 to go" ===================== */
const VDUR = 48.6;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376, H_ = 1920;
const OLD = 4661, NEWEST = 4984, NEWN = NEWEST - OLD;
const BANK0 = 7570, BANK1 = 10800;
const T = {
  great: 4.75, think: 5.8, climb0: 8.85, climb1: 10.45, whoa: 10.85, wide: 13.0, pop0: 13.3, pop1: 16.1, total: 16.25, sixteen: 19.65,
  site: 22.05, back: 25.55, bank0: 27.8, bank1: 31.2, flowers: 31.95, poll: 36.0, end0: 43.35,
};
const VAN = [4.55, 4.85];
const GROUND = [4.25, 5.55], ROOF = [4.38, 4.86], ROOFH = 46;
const HN = n => HOUSES[n - 1];
const hw = h => { const [x, y] = isoW(h.i, h.j); return [x, y - 26]; };
const SITE_Z = blk(-4, -4), SITE_C = [(SITE_Z.u0 + SITE_Z.u1) / 2, (SITE_Z.v0 + SITE_Z.v1) / 2];
const [VX, VY] = isoW(4.45, 5.05);
const NEWC = (() => { let a = 0, b = 0, n = 0; for (let k = OLD; k < NEWEST; k++) { a += HOUSES[k].i; b += HOUSES[k].j; n++; } return [a / n, b / n]; })();
const [NX, NY] = isoW(NEWC[0], NEWC[1]);
const [TX, TY] = isoW(CEN, CEN);
const [SX, SY] = isoW(SITE_C[0], SITE_C[1]);
const KEYS = [
  [0, VX, VY - 20, 3.1], [4.7, VX, VY - 20, 3.35],
  [5.8, VX, VY - 20, 3.35], [8.8, VX, VY - 30, 2.8], [10.8, VX, VY - 60, 2.3],
  [12.9, NX, NY, .55], [16.2, NX, NY, .48], [22.0, TX, TY, .32],
  [22.05, SX, SY - 40, .85], [25.5, SX, SY - 40, 1.0],
  [25.55, VX, VY - 70, 1.45], [31.9, VX, VY - 70, 1.25],
  [31.95, ...hw(HN(1)), 2.4], [35.95, ...hw(HN(1)), 2.75],
  [36.0, VX, VY - 70, 1.3], [48.6, VX, VY - 70, 1.12],
];
const CUTS = [T.site, T.back, T.flowers, T.poll];
function camAt(t) {
  let k = 0; while (k < KEYS.length - 2 && t > KEYS[k + 1][0]) k++;
  const a = KEYS[k], b = KEYS[k + 1], u = sstep(vprog(t, a[0], b[0]));
  const isCut = CUTS.includes(b[0]) && b[0] - a[0] < .5;
  const uu = isCut ? (u < .5 ? 0 : 1) : u;
  cam.x = lerp(a[1], b[1], uu); cam.y = lerp(a[2], b[2], uu); cam.z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), uu));
}
function visAt(t) { return t < T.pop0 ? OLD : lerp(OLD, NEWEST, Math.pow(sstep(vprog(t, T.pop0, T.pop1)), 1.1)); }
function bankAt(t) { return BANK0 + Math.round((BANK1 - BANK0) * sstep(vprog(t, T.bank0, T.bank1))); }
let VCAPS = [], VMOUTH = [];

/* ---------- Benny ---------- */
function bennyState(t, m) {
  const c = vprog(t, T.climb0, T.climb1);
  if (t < T.climb0) {
    let o = { pose: 'stand', mood: 'sad', look: [.7, -.2], talk: m };
    if (vin(t, T.think, T.climb0)) o = { pose: 'stand', mood: 'hope', look: [.3, -.8], talk: m };
    return { pos: GROUND, dy: 0, d: null, o };
  }
  if (t < T.climb1) {
    const u = sstep(c);
    return { pos: [lerp(GROUND[0], ROOF[0], u), lerp(GROUND[1], ROOF[1], u)], dy: ROOFH * sstep(clamp(c * 1.3, 0, 1)) + 22 * Math.sin(Math.PI * c), d: c > .25 ? 10.5 : null, o: { pose: 'stand', mood: 'hope', walk: t * 9, look: [0, -.3] } };
  }
  let o = { pose: 'stand', mood: 'happy', look: [0, 0], talk: m };
  if (vin(t, T.whoa, T.pop0)) o = { pose: 'stand', mood: 'surprised', armsUp: t > 11.4, look: [0, -.4], talk: m };
  else if (vin(t, T.pop0, T.total)) o = { pose: 'stand', mood: 'happy', armsUp: true, look: [0, 0], talk: m };
  else if (vin(t, T.sixteen, T.site)) o = { pose: 'stand', mood: 'surprised', look: [0, 0], talk: m };
  else if (vin(t, 29.6, 31.6)) o = { pose: 'stand', mood: 'happy', armsUp: true, look: [0, 0], talk: m };
  return { pos: ROOF, dy: ROOFH, d: 10.5, o };
}

/* ---------- overlay helpers (same style as earlier episodes) ---------- */
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function coin(x, y, r) { circle(ctx, x, y, r, '#f5b82e', '#8a5a12', 3); circle(ctx, x, y, r * .68, '#ffd96b'); txt('¢', x, y + 1, Math.round(r * 1.1), '#8a5a12', 'center', 'middle'); }
function vHUD(t) {
  const c = bankAt(t), n = Math.round(visAt(t));
  const busy = vin(t, T.pop0, T.pop1 + .2) || vin(t, T.bank0, T.bank1 + .2);
  if (busy) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, HUDY, 20, 540, HUDY, 380); g.addColorStop(0, 'rgba(70,224,138,.28)'); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800); ctx.restore(); }
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const bump = vin(t, T.bank0, T.bank1 + .2) ? 1 + .05 * Math.abs(Math.sin(t * 18)) : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  txt('DAY 4  ·  ' + n.toLocaleString('en-US') + ' tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const s = 'Follow = you move in 🏠', w = ctx.measureText(s).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2);
  txt(s, 540, 510, 26, '#fff', 'center', 'middle');
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = t >= T.poll ? 1330 : 1500, sz = 66, maxW = 940;
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
function houseTag(t, n, t0, t1, label, col, ringCol) {
  if (!vin(t, t0, t1)) return;
  const h = HN(n), [sx, sy] = uvS(h.i, h.j), z = cam.z, k = eBack(vprog(t, t0 + .05, t0 + .35));
  const st = STY[0], ty = sy - (st.wall + st.roofH + st.f * 32 + 16) * z;
  ellipse(ctx, sx, sy, 78 * z * (1 + Math.sin(t * 6) * .04), 39 * z, null, ringCol || '#ffd23f', 5);
  ctx.save(); ctx.translate(sx, ty); ctx.scale(k * 2.2, k * 2.2); tag(0, 0, label, col, 1); ctx.restore();
}

/* ---------- per-scene overlays ---------- */
const RCOIN = []; { const r = seeded(21); for (let k = 0; k < 70; k++) RCOIN.push([T.bank0 + k * .045, r() * W, 1150 + r() * 700]); }
function overlays(t) {
  // hook: no tires — red marks where the wheels should be
  if (vin(t, 2.6, T.think)) {
    const z = cam.z, a = clamp((T.think - t) / .25, 0, 1);
    for (const uu of [VAN[0] - .6 + .16, VAN[0] + .6 - .12]) {
      const [x, y] = uvS(uu, VAN[1] + .27), k = eBack(vprog(t, 2.6, 2.9));
      ctx.save(); ctx.globalAlpha = a; ellipse(ctx, x, y - 4 * z, 15 * z * k, 11 * z * k, null, '#ff2e63', 5); otxt('❌', x, y - 34 * z, Math.round(22 * z * k), '#ff2e63', 3); ctx.restore();
    }
  }
  vstamp('NO TIRES 😩', 540, 640, t, 2.6, T.think - .05, 104, '#ff4d6d', -.04, 'rgba(10,12,26,.88)');
  vstamp('PLAN B 💡', 540, 640, t, 7.5, T.whoa - .1, 96, '#ffd23f', .03, 'rgba(10,12,26,.88)');
  vstamp('WHOA… 😳', 540, 640, t, T.whoa + .1, T.pop0, 100, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  vstamp('+323 NEW NEIGHBORS 🏠', 540, 640, t, T.pop0 + .1, T.total, 70, '#46e08a', .02, 'rgba(10,12,26,.88)');
  vstamp('4,984 PEOPLE 🏙️', 540, 640, t, T.total + .1, T.sixteen, 84, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  if (vin(t, T.sixteen, T.site)) {
    vstamp('ONLY 16 TO GO 😱', 540, 640, t, T.sixteen, T.site, 96, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
    // progress bar 4,984 / 5,000
    const k = eBack(vprog(t, T.sixteen + .3, T.sixteen + .6)), f = .9968 * sstep(vprog(t, T.sixteen + .4, T.sixteen + 1.4));
    ctx.save(); ctx.translate(540, 790); ctx.scale(k, k);
    panel(-420, -48, 840, 96, 48, 'rgba(10,12,26,.9)', 'rgba(255,255,255,.3)', 3);
    panel(-400, -30, 800 * f, 60, 30, '#46e08a', null, 0);
    txt('4,984 / 5,000', 0, 2, 40, '#ffffff', 'center', 'middle');
    ctx.restore();
  }
  // construction site: something opens at 5,000
  if (vin(t, T.site, T.back)) {
    const [x, y] = uvS(SITE_C[0], SITE_C[1]), z = cam.z;
    ctx.save(); ctx.globalAlpha = .5 + .3 * Math.sin(t * 5); ellipse(ctx, x, y, 330 * z, 165 * z, null, '#ffd23f', 6); ctx.restore();
    vstamp('🚧 OPENS AT 5,000', 540, 640, t, T.site + .1, T.back, 80, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
    vstamp('WHAT IS IT? 👀', 540, 770, t, 23.6, T.back, 60, '#ffffff', .02, 'rgba(10,12,26,.88)');
  }
  // bank
  for (const [t0, x, y] of RCOIN) { if (t < t0 || t > t0 + .7) continue; const u = sstep(vprog(t, t0, t0 + .7)); coin(lerp(x, 540, u), lerp(y, HUDY, u) - Math.sin(u * Math.PI) * 120, 40); }
  vstamp('10¢ × 323 NEW FOLLOWS', 540, 640, t, T.bank0 - .3, 29.7, 62, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('+€32.30 💸', 540, 640, t, 29.8, T.flowers, 104, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  // flowers for the first neighbors
  if (vin(t, T.flowers, T.poll)) {
    houseTag(t, 1, T.flowers, T.poll, '👑 #1 @' + HN(1).name, '#ffd23f', '#ff5d8f');
    vstamp('3 DAYS = FLOWERS 🌷', 540, 640, t, T.flowers + .1, T.poll, 84, '#ff8ab3', .03, 'rgba(10,12,26,.88)');
    vstamp('stay longer = better house', 540, 760, t, 33.6, T.poll, 48, '#ffffff', 0, 'rgba(10,12,26,.88)');
  }
  // poll
  if (vin(t, T.poll, T.end0)) {
    ctx.fillStyle = `rgba(6,8,20,${.6 * vprog(t, T.poll, T.poll + .3)})`; ctx.fillRect(0, 560, W, H_);
    vstamp('TONIGHT I BUY… 👇', 540, 640, t, T.poll + .05, 99, 84, '#ffd23f', -.03);
    const opts = [['🛞', 'New tires', 'drive through town', '€90', '#ff8a3d', 38.25], ['🐱', 'Adopt a cat', 'a friend for Benny', '€60', '#c77dff', 39.25], ['🍕', 'Pizza party', 'for the whole street', '€40', '#4da3ff', 40.25]];
    opts.forEach(([e, n, sub, p, col, ts], k) => {
      const t0 = Math.min(T.poll + .4 + k * .18, ts - .1); if (t < t0) return; const s = eBack(vprog(t, t0, t0 + .3));
      const hi = vin(t, ts - .1, ts + 1.0) ? 1 + .07 * Math.sin((t - ts) * 9) : 1;
      const x = 40 + k * 340, y = 760, w = 320, h = 380;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s * hi, s * hi); ctx.translate(-w / 2, -h / 2);
      panel(0, 0, w, h, 28, 'rgba(20,24,48,.97)', col, 4);
      circle(ctx, 46, 46, 32, col); txt(String(k + 1), 46, 48, 42, '#fff', 'center', 'middle');
      txt(p, w - 22, 48, 36, '#46e08a', 'right', 'middle');
      emoji(ctx, e, w / 2, 160, 110);
      txt(n, w / 2, 280, fitSize(n, 38, w - 30), '#fff', 'center', 'middle');
      txt(sub, w / 2, 330, fitSize(sub, 26, w - 30), '#9aa3c7', 'center', 'middle');
      ctx.restore();
    });
    vstamp('VOTE IN THE POLL 👇', 540, 1210, t, 41.5, 99, 56, '#ffffff', 0, '#ff2e63');
  }
  // end card
  if (t >= T.end0) {
    const k = eBack(vprog(t, T.end0, T.end0 + .3));
    ctx.fillStyle = `rgba(6,8,20,${.45 * vprog(t, T.end0, T.end0 + .3)})`; ctx.fillRect(0, 0, W, H_);
    ctx.save(); ctx.translate(540, 760); ctx.scale(k, k);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d');
    rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = +10¢', 0, -28, 70, '#fff', 10, 'rgba(90,0,30,.6)'); txt("and move into Benny's town 🏠", 0, 46, 36, '#fff', 'center', 'middle');
    ctx.restore();
    ctx.globalAlpha = vprog(t, T.end0 + .3, T.end0 + .6); txt('Find your house: link in bio 🔗', 540, 910, 34, '#fff', 'center', 'middle'); ctx.globalAlpha = 1;
  }
}

/* ---------- master ---------- */
function vrender(t) {
  S.T = t;
  camAt(t); VIS = visAt(t);
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  const b = bennyState(t, m);
  BPOS = b.pos; BDY = b.dy; BD = b.d; BENNY_O = () => b.o; BENNY_CARD = true;
  TOWN.milestones.van = false;
  EXTRA_OBJS = objs => { objs.push({ d: VAN[0] + VAN[1] + .3, f: () => drawVan(VAN[0], VAN[1], { k: 1, noTires: true }) }); };
  draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  overlays(t);
  vHUD(t);
  if (t < T.end0) vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H_); }
  for (const c of CUTS) if (vin(t, c, c + .12)) { ctx.fillStyle = `rgba(255,255,255,${.3 * (1 - (t - c) / .12)})`; ctx.fillRect(0, 0, W, H_); }
}
window.EP = {
  init(caps, mouth) { VCAPS = caps; VMOUTH = mouth; DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150; },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); }, DUR: VDUR,
};
