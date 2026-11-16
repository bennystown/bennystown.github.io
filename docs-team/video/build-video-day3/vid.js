/* ===================== BUILD VIDEO DAY 3 — "2,505 in one night" ===================== */
const VDUR = 49;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const vin = (t, a, b) => t >= a && t < b;
const sstep = x => x * x * (3 - 2 * x);
const HUDY = 376;
const NEWEST = 4661, OLD = 2156, NEWN = NEWEST - OLD;
const HOD = 3748, OGH = 1;
const T = {
  wait: 3.5, build: 7.8, pop0: 9.9, pop1: 14.6, city: 14.8,
  thanks: 16.95, hod: 21.6, bank: 25.8, rent0: 26.2, rent1: 29.6,
  flowers: 30.05, tiers: 33.4, find: 35.6, poll: 37.7,
};
const HN = n => HOUSES[n - 1];
const hw = h => { const [x, y] = isoW(h.i, h.j); return [x, y - 26]; };
const [BX, BY] = isoW(3.5, 3.65);
const WIDE = [0, -620, .13];
const KEYS = [
  [0, BX, BY - 30, 5.2], [3.4, BX, BY - 30, 4.9], [7.7, BX, BY - 30, 4.2],
  [9.9, BX, BY - 30, 2.2],
  [14.6, ...WIDE], [16.9, WIDE[0], WIDE[1] + 40, .14],
  [16.95, BX, BY - 40, 2.6], [21.55, BX, BY - 40, 2.9],
  [21.6, ...hw(HN(HOD)), 2.3], [25.75, ...hw(HN(HOD)), 2.7],
  [25.8, BX, BY - 60, .62], [30.0, BX, BY - 60, .72],
  [30.05, ...hw(HN(OGH)), 2.5], [35.55, ...hw(HN(OGH)), 2.9],
  [35.6, BX, BY - 40, .55], [49, BX, BY - 40, .62],
];
const CUTS = [16.95, 21.6, 25.8, 30.05, 35.6];
function camAt(t) {
  let k = 0; while (k < KEYS.length - 2 && t > KEYS[k + 1][0]) k++;
  const a = KEYS[k], b = KEYS[k + 1], u = sstep(vprog(t, a[0], b[0]));
  const isCut = CUTS.includes(b[0]) && b[0] - a[0] < .5;
  const uu = isCut ? (u < .5 ? 0 : 1) : u;
  cam.x = lerp(a[1], b[1], uu); cam.y = lerp(a[2], b[2], uu); cam.z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), uu));
}
function visAt(t) { return t < T.pop0 ? OLD : lerp(OLD, NEWEST, Math.pow(sstep(vprog(t, T.pop0, T.pop1)), 1.15)); }
function bankAt(t) { return 37520 + Math.round(NEWN * 10 * sstep(vprog(t, T.rent0, T.rent1))); }
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
  const c = bankAt(t), n = Math.round(visAt(t));
  const busy = vin(t, T.pop0, T.pop1 + .2) || vin(t, T.rent0, T.rent1 + .2);
  if (busy) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, HUDY, 20, 540, HUDY, 380); g.addColorStop(0, 'rgba(70,224,138,.28)'); g.addColorStop(1, 'rgba(70,224,138,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800); ctx.restore(); }
  panel(200, 262, 680, 206, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt("BENNY'S BANK", 540, 302, 26, '#9aa3c7', 'center', 'middle');
  const bump = vin(t, T.rent0, T.rent1 + .2) ? 1 + .05 * Math.abs(Math.sin(t * 18)) : 1;
  ctx.save(); ctx.translate(540, HUDY); ctx.scale(bump, bump); otxt('€' + (c / 100).toFixed(2), 0, 0, 124, '#46e08a', 12, '#06070f'); ctx.restore();
  txt('DAY 3  ·  ' + n.toLocaleString('en-US') + ' tenants', 540, 440, 26, '#c3c9e4', 'center', 'middle');
  ctx.font = F(26); const s = 'Follow = you move in 🏠', w = ctx.measureText(s).width + 40;
  panel(540 - w / 2, 486, w, 46, 23, 'rgba(255,46,99,.92)', 'rgba(255,255,255,.35)', 2);
  txt(s, 540, 510, 26, '#fff', 'center', 'middle');
}
function vCaption(t) {
  const g = VCAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = t >= T.poll ? 1330 : (vin(t, T.tiers, T.find) ? 1560 : 1500), sz = 66, maxW = 940;
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
  ctx.save(); ctx.translate(sx, ty); ctx.scale(k * 2.4, k * 2.4); tag(0, 0, label, col, 1); ctx.restore();
}
function confetti(t, t0, x, y) { const p = t - t0; if (p < 0 || p > 1.6) return; for (let k = 0; k < 40; k++) { const a = k * 2.399, d = p * (260 + (k % 5) * 40); ctx.globalAlpha = Math.max(0, 1 - p / 1.6); ctx.fillStyle = CONF[k % CONF.length]; ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * .7 + p * p * 260, 16, 10); } ctx.globalAlpha = 1; }
// flower bed in front of a house (preview of the 3-day loyalty upgrade)
function flowerBed(t, n, t0) {
  if (t < t0) return;
  const h = HN(n), z = cam.z, cols = ['#ff5d8f', '#ffd23f', '#ff8a3d', '#c77dff', '#ffffff'];
  const spots = [[.3, .42], [.42, .3], [.38, .45], [.45, .38], [-.3, .45], [-.42, .32], [.46, -.25], [.47, -.05], [.47, .15], [.2, .48], [0, .48]];
  spots.forEach(([du, dv], k) => {
    const g = eBack(vprog(t, t0 + k * .09, t0 + k * .09 + .35)); if (g <= 0) return;
    const [x, y] = uvS(h.i + du, h.j + dv);
    line(ctx, x, y, x, y - 12 * z * g, '#2f7d3a', 2.2 * z);
    circle(ctx, x, y - 13 * z * g, 5.5 * z * g, cols[k % 5], OUT, 1 * z);
    circle(ctx, x, y - 13 * z * g, 2 * z * g, '#ffe9a8');
  });
}

/* ---------- per-scene overlays ---------- */
const NOTE = []; { const r = seeded(9); for (let k = 0; k < 22; k++) NOTE.push([.5 + k * .3, 150 + r() * 780, 640 + r() * 760]); }
const RCOIN = []; { const r = seeded(21); for (let k = 0; k < 80; k++) RCOIN.push([T.rent0 + k * .042, r() * W, 1150 + r() * 750]); }
const TIERS = [['3 days', '🌷', 'Flowers'], ['1 week', '🏡', 'Fence + garden'], ['2 weeks', '💡', 'Lantern + bench'], ['1 month', '⭐', 'Second floor'], ['3 months', '🏊', 'Pool']];
function overlays(t) {
  // hook: phone buzzing, notifications flood
  if (t < 9.2) {
    for (const [t0, x, y] of NOTE) { if (t < t0) continue; const k = eBack(vprog(t, t0, t0 + .25)), a = clamp((9.2 - t) / .3, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(k, k); panel(-170, -34, 340, 68, 34, 'rgba(255,255,255,.96)', '#ff2e63', 4); txt('🔔 new follower!', 0, 2, 30, '#1b1728', 'center', 'middle'); ctx.restore(); }
    if (t < 3.4) { ctx.globalAlpha = .6 + .4 * Math.sin(t * 3); otxt('z', 640, 880 - (t * 40) % 80, 48, '#c3c9e4', 6); otxt('Z', 690, 820 - (t * 40) % 80, 64, '#c3c9e4', 7); ctx.globalAlpha = 1; }
    vstamp('+2,505 IN ONE NIGHT 😳', 540, 640, t, 4.0, 7.75, 76, '#ffd23f', -.04, 'rgba(10,12,26,.88)');
  }
  vstamp("LET'S BUILD! 🔨", 540, 640, t, T.build + .9, T.pop0 + 1.2, 84, '#46e08a', .03, 'rgba(10,12,26,.88)');
  vstamp('4,661 HOUSES 🏠', 540, 640, t, 12.0, T.city + .1, 86, '#46e08a', .03, 'rgba(10,12,26,.88)');
  vstamp('A REAL CITY NOW 🏙️', 540, 640, t, T.city + .1, T.thanks, 80, '#ffffff', -.03, 'rgba(10,12,26,.88)');
  // thank you
  vcard(t, T.thanks + .3, T.hod, 820, 340, () => {
    otxt('THANK YOU 🫶', 0, -90, 92, '#ff6b8b', 10);
    txt('for all the sweet messages', 0, 10, 44, '#ffffff', 'center', 'middle');
    if (t > 19.9) { const k = eBack(vprog(t, 19.9, 20.2)); ctx.save(); ctx.translate(0, 95); ctx.scale(k, k); txt('I see every single one 💌', 0, 0, 44, '#ffd23f', 'center', 'middle'); ctx.restore(); }
  });
  // house of the day
  if (vin(t, T.hod, T.bank)) {
    const lab = t < 23.3 ? '⭐ #' + HOD.toLocaleString('en-US') + ' ???' : '⭐ @' + HN(HOD).name + ' · 60V_R1der';
    houseTag(t, HOD, T.hod, T.bank, lab, '#ffb703');
    const h = HN(HOD), [sx, sy] = uvS(h.i, h.j); confetti(t, 23.4, sx, sy - 140);
    vstamp('HOUSE OF THE DAY ⭐', 540, 640, t, T.hod + .1, T.bank, 82, '#ffd23f', -.03, 'rgba(10,12,26,.88)');
  }
  // bank
  for (const [t0, x, y] of RCOIN) { if (t < t0 || t > t0 + .7) continue; const u = sstep(vprog(t, t0, t0 + .7)); coin(lerp(x, 540, u), lerp(y, HUDY, u) - Math.sin(u * Math.PI) * 120, 40); }
  vstamp('10¢ × 2,505 NEW FOLLOWS', 540, 640, t, T.bank + .15, 27.9, 60, '#ffffff', .02, 'rgba(10,12,26,.88)');
  vstamp('+€250.50 💸', 540, 640, t, 28.0, T.flowers, 100, '#46e08a', -.03, 'rgba(10,12,26,.88)');
  // flowers tomorrow + loyalty tiers
  if (vin(t, T.flowers, T.find)) {
    flowerBed(t, OGH, 31.3);
    houseTag(t, OGH, T.flowers, T.tiers, '👑 #1 @' + HN(OGH).name, '#ffd23f', '#ff5d8f');
    vstamp('TOMORROW 🌷', 540, 640, t, T.flowers + .1, T.tiers, 96, '#ff8ab3', .03, 'rgba(10,12,26,.88)');
    vstamp('Day-1 neighbors get flowers', 540, 760, t, 31.2, T.tiers, 52, '#ffffff', 0, 'rgba(10,12,26,.88)');
  }
  vcard(t, T.tiers, T.find, 860, 600, () => {
    otxt('STAY LONGER = BETTER HOUSE', 0, -240, 52, '#ffd23f', 7);
    TIERS.forEach(([d, e, n], k) => {
      const t0 = T.tiers + .15 + k * .22; if (t < t0) return; const s = eBack(vprog(t, t0, t0 + .25)), y = -150 + k * 86;
      ctx.save(); ctx.translate(0, y); ctx.scale(s, s);
      panel(-380, -36, 760, 72, 22, k === 0 ? 'rgba(255,93,143,.25)' : 'rgba(255,255,255,.07)', k === 0 ? '#ff5d8f' : null, 2);
      txt(d, -350, 2, 34, '#9aa3c7', 'left', 'middle'); emoji(ctx, e, -105, 0, 44); txt(n, -60, 2, 38, '#ffffff', 'left', 'middle');
      if (k === 0) txt('TOMORROW', 360, 2, 26, '#ff8ab3', 'right', 'middle');
      ctx.restore();
    });
  });
  // find your house
  vcard(t, T.find, T.poll, 790, 470, () => {
    otxt('4,661 HOUSES 😅', 0, -170, 58, '#fff', 7);
    txt('Find YOUR house here:', 0, -95, 40, '#c3c9e4', 'center', 'middle');
    panel(-370, -45, 740, 110, 26, '#ffd23f', null, 0); txt('🔍 bennystown.github.io', 0, 11, 50, '#1b1728', 'center', 'middle');
    otxt('🔗 LINK IN BIO', 0, 145, 66, '#ff2e63', 8, '#fff');
  });
  // poll
  if (t >= T.poll) {
    ctx.fillStyle = `rgba(6,8,20,${.6 * vprog(t, T.poll, T.poll + .3)})`; ctx.fillRect(0, 560, W, H_);
    vstamp('YOU DECIDE 👇', 540, 640, t, T.poll + .05, 99, 92, '#ffd23f', -.03);
    const opts = [['🚐', 'Campervan', 'to sleep in', '€350', '#ff4d6d', 39.0], ['🏍️', 'Motorbike', 'ride through town', '€400', '#3ddc84', 40.3], ['💡', 'Street lights', 'for everyone', '€200', '#4da3ff', 42.2]];
    opts.forEach(([e, n, sub, p, col, ts], k) => {
      const t0 = Math.min(T.poll + .25 + k * .18, ts - .1); if (t < t0) return; const s = eBack(vprog(t, t0, t0 + .3));
      const hi = vin(t, ts - .1, ts + 1.1) ? 1 + .06 * Math.sin((t - ts) * 9) : 1;
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
    vstamp('TOP 2 GET BOUGHT TONIGHT 🛒', 540, 1210, t, 44.0, 99, 54, '#ffffff', 0, '#ff2e63');
  }
}

/* ---------- master ---------- */
const H_ = 1920;
function vrender(t) {
  S.T = t;
  camAt(t); VIS = visAt(t);
  if (vin(t, T.pop0, T.pop1)) LASTPOP = t;
  const m = VMOUTH[Math.min(VMOUTH.length - 1, Math.max(0, Math.round(t * 30)))] || 0;
  BENNY_O = () => {
    if (t < 3.4) return { mood: 'sad', blink: true, look: [0, .7], talk: m * .5 };
    if (t < 7.7) return { mood: 'surprised', look: [0, -.4], talk: m };
    if (vin(t, 8.6, 10.2)) return { mood: 'happy', armsUp: true, look: [0, 0], talk: m };
    if (vin(t, T.thanks, T.hod)) return { mood: 'happy', look: [0, .2], talk: m };
    if (vin(t, 28.0, 30.0)) return { mood: 'happy', armsUp: true, look: [0, 0], talk: m };
    return { mood: 'hope', look: [0, 0], talk: m };
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
