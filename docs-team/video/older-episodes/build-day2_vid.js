/* ===================== BUILD VIDEO 2 — "2,156 of you" ===================== */
const VDUR = 52;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376;
const NEWEST = 2156, OLD = 34;
const T = {
  pop0: 6.45, pop1: 11.7,
  blue: 11.9, sana: 12.95, wide: 14.2,
  og100: 16.1, k1000: 20.35, total: 23.0,
  sunday: 25.9, rentCard: 27.0, rent0: 28.6, rent1: 33.2,
  park: 33.7, key: 37.25, tonight: 40.55,
  find: 41.2, poll: 44.3,
};
const HN = n => HOUSES[n - 1];
const hw = h => { const [x, y] = isoW(h.i, h.j); return [x, y - 26]; };
const [BX, BY] = isoW(3.5, 3.65);
const PARKC = isoW(15, 3), HALLC = isoW(3, 15);
// camera keyframes: [time, x, y, z]
const KEYS = [
  [0, BX, BY - 30, 5.2], [6.3, BX, BY - 30, 4.6],
  [11.6, 0, -1200, .19],
  [11.95, ...hw(HN(72)), 2.4], [12.85, ...hw(HN(72)), 2.6],
  [13.0, ...hw(HN(65)), 2.4], [14.0, ...hw(HN(65)), 2.6],
  [14.35, 0, -1200, .19], [15.9, 0, -1150, .21],
  [16.25, ...hw(HN(100)), 2.2], [20.1, ...hw(HN(100)), 2.5],
  [20.45, ...hw(HN(1000)), 2.2], [22.8, ...hw(HN(1000)), 2.5],
  [23.2, 0, -1200, .19], [27.5, 0, -1150, .21],
  [33.2, 0, -1100, .23],
  [33.9, PARKC[0], PARKC[1] - 40, 1.25], [37.1, PARKC[0], PARKC[1] - 40, 1.45],
  [37.45, HALLC[0], HALLC[1] - 60, 1.25], [41.0, HALLC[0], HALLC[1] - 60, 1.55],
  [41.4, BX, BY - 40, .55], [52, BX, BY - 40, .6],
];
const CUTS = [11.95, 13.0, 16.25, 20.45, 33.9, 37.45];
function camAt(t) {
  let k = 0; while (k < KEYS.length - 2 && t > KEYS[k + 1][0]) k++;
  const a = KEYS[k], b = KEYS[k + 1], u = sstep(vprog(t, a[0], b[0]));
  const isCut = CUTS.includes(b[0]) && b[0] - a[0] < .5;
  const uu = isCut ? (u < .5 ? 0 : 1) : u;          // hard cut for quick jumps
  cam.x = lerp(a[1], b[1], uu); cam.y = lerp(a[2], b[2], uu); cam.z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), uu));
}
function visAt(t) { return t < T.pop0 ? OLD : lerp(OLD, NEWEST, Math.pow(sstep(vprog(t, T.pop0, T.pop1)), 1.2)); }
function bankAt(t) {
  const follows = 240 + Math.round((visAt(t) - OLD)) * 10;
  return t < T.rent0 ? follows : 21460 + Math.round(21560 * sstep(vprog(t, T.rent0, T.rent1)));
}
let VCAPS = [], LASTPOP = -9;

/* ---------- overlay helpers ---------- */
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return;
  const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 960);
  if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6));
  ctx.restore();
}
function vcard(t, t0, t1, y, h, draw) {
  if (!vin(t, t0, t1)) return;
  const k = eBack(vprog(t, t0, t0 + .3)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, y); ctx.scale(k, k);
  panel(-430, -h / 2, 860, h, 34, 'rgba(14,16,34,.95)', 'rgba(255,255,255,.25)', 4);
  draw(); ctx.restore();
}
function coin(x, y, r) { circle(ctx, x, y, r, '#f5b82e', '#8a5a12', 3); circle(ctx, x, y, r * .68, '#ffd96b'); txt('¢', x, y + 1, Math.round(r * 1.1), '#8a5a12', 'center', 'middle'); }
function vHUD(t) {
  const c = bankAt(t), n = Math.round(visAt(t)), since = Math.min(t - LASTPOP, 9);
  const busy = vin(t, T.pop0, T.pop1 + .2) || vin(t, T.rent0, T.rent1 + .2);
  if (busy) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, HUDY, 20, 540, HUDY, 380); g.addColorStop(0, 'rgba(70,224,138,.28)'); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800); ctx.restore(); }
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const bump = busy ? 1 + .05 * Math.abs(Math.sin(t * 18)) : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  txt('DAY 2  ·  ' + n.toLocaleString('en-US') + ' tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
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
function houseTag(t, n, t0, t1, label, col) {
  if (!vin(t, t0, t1)) return;
  const h = HN(n), [sx, sy] = uvS(h.i, h.j), z = cam.z, k = eBack(vprog(t, t0 + .05, t0 + .35));
  const st = STY[0], ty = sy - (st.wall + st.roofH + st.f * 32 + 16) * z;
  ellipse(ctx, sx, sy, 78 * z * (1 + Math.sin(t * 6) * .04), 39 * z, null, '#ffd23f', 5);
  ctx.save(); ctx.translate(sx, ty); ctx.scale(k * 2.6, k * 2.6); tag(0, 0, label, col, 1); ctx.restore();
}
function confetti(t, t0, x, y) { const p = t - t0; if (p < 0 || p > 1.6) return; for (let k = 0; k < 40; k++) { const a = k * 2.399, d = p * (260 + (k % 5) * 40); ctx.globalAlpha = Math.max(0, 1 - p / 1.6); ctx.fillStyle = CONF[k % CONF.length]; ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * .7 + p * p * 260, 16, 10); } ctx.globalAlpha = 1; }

/* ---------- per-scene overlays ---------- */
const NOTE = []; { const r = seeded(9); for (let k = 0; k < 14; k++) NOTE.push([2.9 + k * .24, 150 + r() * 780, 760 + r() * 520]); }
const RCOIN = []; { const r = seeded(21); for (let k = 0; k < 90; k++) RCOIN.push([T.rent0 + k * .045, r() * W, 1150 + r() * 750]); }
function overlays(t) {
  // hook: notifications flood
  if (t < 6.6) {
    for (const [t0, x, y] of NOTE) { if (t < t0) continue; const k = eBack(vprog(t, t0, t0 + .25)), a = clamp((6.6 - t) / .3, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(k, k); panel(-170, -34, 340, 68, 34, 'rgba(255,255,255,.96)', '#ff2e63', 4); txt('🔔 new follower!', 0, 2, 30, '#1b1728', 'center', 'middle'); ctx.restore(); }
    if (t < 2.7) { ctx.globalAlpha = .6 + .4 * Math.sin(t * 3); otxt('z', 640, 880 - (t * 40) % 80, 48, '#c3c9e4', 6); otxt('Z', 690, 820 - (t * 40) % 80, 64, '#c3c9e4', 7); ctx.globalAlpha = 1; }
    vstamp('2,156 NOTIFICATIONS 😳', 540, 640, t, 4.3, 6.5, 70, '#ffd23f', -.04, 'rgba(10,12,26,.88)');
  }
  vstamp("LET'S BUILD! 🔨", 540, 640, t, 7.6, 9.6, 84, '#46e08a', .03, 'rgba(10,12,26,.88)');
  houseTag(t, 72, T.blue, T.sana, '💙 @' + HN(72).name, '#4da3ff');
  houseTag(t, 65, T.sana, T.wide, '💜💛 @' + HN(65).name, '#b07cff');
  vstamp('YOUR WISHES = YOUR HOUSES 🎨', 540, 640, t, 12.0, 14.2, 60, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('2,156 HOUSES 🏠', 540, 640, t, 14.5, 16.1, 86, '#46e08a', .03, 'rgba(10,12,26,.88)');
  // #100
  if (vin(t, T.og100, T.k1000)) {
    houseTag(t, 100, T.og100, T.k1000, '👑 #100 @' + HN(100).name, '#ffd23f');
    vstamp('THE LAST OG 👑', 540, 640, t, 16.9, 20.3, 90, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
  }
  // #1000
  if (vin(t, T.k1000, T.total)) {
    houseTag(t, 1000, T.k1000, T.total, '🎉 #1,000 @' + HN(1000).name, '#ff8a3d');
    const h = HN(1000), [sx, sy] = uvS(h.i, h.j); confetti(t, T.k1000 + .3, sx, sy - 120);
    vstamp('TENANT #1,000 🎉', 540, 640, t, 20.6, 23.0, 90, '#ff8a3d', .03, 'rgba(10,12,26,.88)');
  }
  vstamp('2,156 OF YOU 🤯', 540, 640, t, 23.1, 25.9, 96, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  // rent day
  vstamp('WAIT… WHAT DAY IS IT?', 540, 640, t, 25.95, 27.0, 66, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vcard(t, T.rentCard, T.park, 720, 300, () => {
    rrect(ctx, -430, -150, 860, 100, 34); ctx.fillStyle = '#e23b3b'; ctx.fill(); ctx.fillRect(-430, -80, 860, 30);
    txt('SUNDAY', 0, -100, 54, '#fff', 'center', 'middle');
    otxt('RENT DAY 💰', 0, 0, 96, '#ffd23f', 10);
    if (t > T.rent0) { const k = eBack(vprog(t, T.rent0, T.rent0 + .3)); ctx.save(); ctx.translate(0, 95); ctx.scale(k, k); txt('10¢ × 2,156 tenants', 0, 0, 46, '#46e08a', 'center', 'middle'); ctx.restore(); }
  });
  for (const [t0, x, y] of RCOIN) { if (t < t0 || t > t0 + .7) continue; const u = sstep(vprog(t, t0, t0 + .7)); coin(lerp(x, 540, u), lerp(y, HUDY, u) - Math.sin(u * Math.PI) * 120, 40); }
  if (vin(t, 33.0, 34.4)) { const u = vprog(t, 33.0, 34.4); ctx.globalAlpha = 1 - u; otxt('×2 💸', 860, 300 - u * 50, 70, '#ffd23f', 9); ctx.globalAlpha = 1; }
  // park + key
  vstamp('500 FOLLOWERS UNLOCKED', 540, 600, t, 34.0, 37.2, 64, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  vstamp('A PARK 🌳', 540, 710, t, 34.4, 37.2, 100, '#46e08a', .03);
  if (vin(t, T.key, T.find)) {
    const [kx, ky] = uvS(3, 13.4), k = eBack(vprog(t, T.key + .2, T.key + .6));
    ctx.save(); ctx.translate(kx, ky - 130 * cam.z + Math.sin(t * 3) * 12); ctx.scale(k, k); ctx.rotate(Math.sin(t * 2) * .15);
    for (let j = 0; j < 6; j++) { const a = t * 1.5 + j; ctx.globalAlpha = .6; circle(ctx, Math.cos(a) * 90, Math.sin(a) * 90, 6, '#fff6c2'); } ctx.globalAlpha = 1;
    emoji(ctx, '🗝️', 0, 0, 150); ctx.restore();
    vstamp('1,000 🔑', 540, 640, t, 38.2, 41.2, 100, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
    vstamp('TONIGHT.', 540, 780, t, T.tonight, 41.2, 90, '#ff6b8b', .04);
  }
  // find your house
  vcard(t, T.find, T.poll, 790, 470, () => {
    otxt('TOO MANY NAMES 😅', 0, -170, 58, '#fff', 7);
    txt('Find YOUR house here:', 0, -95, 40, '#c3c9e4', 'center', 'middle');
    panel(-370, -45, 740, 110, 26, '#ffd23f', null, 0); txt('🔍 bennystown.github.io', 0, 11, 50, '#1b1728', 'center', 'middle');
    otxt('🔗 LINK IN BIO', 0, 145, 66, '#ff2e63', 8, '#fff');
  });
  // poll
  if (t >= T.poll) {
    ctx.fillStyle = `rgba(6,8,20,${.6 * vprog(t, T.poll, T.poll + .3)})`; ctx.fillRect(0, 560, W, H_);
    vstamp('YOU DECIDE 👇', 540, 640, t, T.poll + .05, 99, 92, '#ffd23f', -.03);
    const opts = [['⛺', 'Tent', '€80', '#ff4d6d'], ['🧥', 'Winter clothes', '€50', '#3ddc84'], ['🎟️', '20 lotto tickets', '€40', '#4da3ff']];
    opts.forEach(([e, n, p, col], k) => {
      const t0 = T.poll + .25 + k * .18; if (t < t0) return; const s = eBack(vprog(t, t0, t0 + .3));
      const x = 40 + k * 340, y = 760, w = 320, h = 360;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2);
      panel(0, 0, w, h, 28, 'rgba(20,24,48,.97)', col, 4);
      circle(ctx, 46, 46, 32, col); txt(String(k + 1), 46, 48, 42, '#fff', 'center', 'middle');
      txt(p, w - 22, 48, 36, '#46e08a', 'right', 'middle');
      emoji(ctx, e, w / 2, 160, 110);
      wrapText(n, w / 2, 285, 34, w - 34, '#fff');
      ctx.restore();
    });
    vstamp('TOP 2 GET BOUGHT TONIGHT 🛒', 540, 1190, t, T.poll + 3.6, 99, 54, '#ffffff', 0, '#ff2e63');
  }
}

/* ---------- master ---------- */
const H_ = 1920;
function vrender(t) {
  S.T = t;
  camAt(t); VIS = visAt(t);
  if (vin(t, T.pop0, T.pop1)) LASTPOP = t;
  // Benny: sleeping -> surprised -> talking (mouth from voice)
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  BENNY_O = () => {
    if (t < 2.75) return { mood: 'sad', blink: true, look: [0, .7], talk: 0 };
    if (t < 6.4) return { mood: 'surprised', look: [0, -.4], talk: m };
    if (vin(t, 7.6, 9.5)) return { mood: 'happy', armsUp: true, look: [0, 0], talk: m };
    return { mood: t > T.rent0 && t < 34 ? 'happy' : 'hope', look: [0, 0], talk: m };
  };
  draw();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  overlays(t);
  vHUD(t);
  vCaption(t);
  if (t < .3) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .3})`; ctx.fillRect(0, 0, W, H_); }
  const lc = [...CUTS].reverse().find(c => t >= c);
  if (lc !== undefined && t - lc < .12) { ctx.fillStyle = `rgba(255,255,255,${.35 * (1 - (t - lc) / .12)})`; ctx.fillRect(0, 0, W, H_); }
}
let VMOUTH = [];
window.EP = {
  init(caps, mouth) {
    VCAPS = caps; VMOUTH = mouth;
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; FX = 540; FY = 1150;
  },
  jpeg(t, q) { vrender(t); return cv.toDataURL('image/jpeg', q || .92); },
  DUR: VDUR,
};
