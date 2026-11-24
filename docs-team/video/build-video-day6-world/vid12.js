/* ===================== FOLGE 12 — "Benny's town just became a WORLD" (new world reveal) =====================
   Runs inside the real website (test build). Every frame is rendered on purpose: 2D map, planet or 3D street. */
(() => {
const VDUR = 58.0;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = { world: 2.86, globe: 3.3, planet: 4.06, fog: 5.98, nobody: 8.54, light: 10.54, us: 12.38, old: 13.4, first: 16.14, bridge: 18.8, d2: 20.26, newp: 21.26,
  fifty: 22.8, hod: 25.2, brick: 27.58, very: 29.34, walk3d: 31.1, walk: 32.54, street: 34.3, house: 35.54, yours: 36.54, env: 37.9, night: 38.6, rain: 39.3, snow: 39.9, dusk: 40.6,
  red0: 42.6, red: 45.5, nob2: 46.62, notb: 48.78, poll: 49.9, decide: 52.3, follow: 53.5 };
const CUTS = [T.globe, T.old, T.walk3d, T.env, T.night, T.rain, T.snow, T.dusk, T.red0];
let CAPS = [], OUT, OC, CV2D, ctx2d, P = {};
const W3 = window.W3 || __d.W3;
/* ---------- helpers ---------- */
function withCtx(c, f) { const keep = ctx; ctx = c; try { f(); } finally { ctx = keep; } }
function vstamp(s, x, y, t, t0, t1, sz, col, rot, bg) {
  if (t < t0 || t > t1) return; const k = eBack(vprog(t, t0, t0 + .28)), a = clamp((t1 - t) / .2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(.4 + .6 * k, .4 + .6 * k);
  const fs = fitSize(s, sz, 980); if (bg) { ctx.font = F(fs); const w = ctx.measureText(s).width + fs * 1.1; panel(-w / 2, -fs * .82, w, fs * 1.64, fs * .5, bg, 'rgba(255,255,255,.25)', 3); }
  otxt(s, 0, 0, fs, col, Math.max(8, fs / 6)); ctx.restore();
}
function vCaption(t) {
  const g = CAPS.find(c => t >= c.s - .05 && t < c.hide); if (!g) return;
  const y0 = 1640, sz = 64, maxW = 940; ctx.font = F(sz); const sp = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const w of g.w) { const ww = ctx.measureText(w[0]).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, ww]); lw += ww + sp; }
  const pop = .85 + .15 * eBack(vprog(t, g.s - .05, g.s + .15)); ctx.save(); ctx.translate(540, y0); ctx.scale(pop, pop);
  lines.forEach((ln, li) => { const tot = ln.reduce((a, b) => a + b[1], 0) + sp * (ln.length - 1); let x = -tot / 2; const y = (li - (lines.length - 1) / 2) * sz * 1.18;
    for (const [w, ww] of ln) { const on = t >= w[1] - .03 && t < w[2] + .12; otxt(w[0], x + ww / 2, y, sz, on ? '#ffd23f' : '#ffffff', 13, '#0b0a14'); x += ww + sp; } });
  ctx.restore();
}
function setHash(h) { if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h); }
/* ---------- 2D map ---------- */
function camTo(u, v, z) { const [x, y] = isoW(u, v); cam.x = x; cam.y = y; cam.z = z; target.x = x; target.y = y; target.z = z; }
function camXY(x, y, z) { cam.x = x; cam.y = y; cam.z = z; target.x = x; target.y = y; target.z = z; }
function fitR(R) { return Math.min((VW - 60) / (2 * R * TW / Math.SQRT2), (VH * .6) / (2 * R * TH / Math.SQRT2)); }
function map2d(t) {
  setHash('hour=12.5&weather=clear'); S.T = 500 + t;
  if (t < T.globe) {                                   // zoom out from Benny's square to both towns
    const k = Math.pow(vprog(t, .5, T.globe), 2.2), [bx, by] = isoW(BHOME[0], BHOME[1]);
    const z = Math.exp(lerp(Math.log(1.6), Math.log(P.fit * .8), k)); camXY(lerp(bx, P.boxC[0], ss(k)), lerp(by, P.boxC[1], ss(k)), z);
  } else if (t < T.bridge) {                           // the Old Town
    const k = vprog(t, T.old, T.bridge), [x, y] = isoW(W3.T1.C[0], W3.T1.C[1]); camXY(x, y, .24 * (1 + .25 * ss(k)));
  } else if (t < T.fifty) {                            // over the bridge to District 2
    const k = eio(vprog(t, T.bridge, T.newp + .3)), a = isoW(W3.GA1.c[0] - 3, W3.GA1.c[1]), b = isoW(W3.T2.C[0], W3.T2.C[1]);
    const z = k < .75 ? lerp(.62, .5, k / .75) : lerp(.5, .24, ss((k - .75) / .25)); camXY(lerp(a[0], b[0], k), lerp(a[1], b[1], k), z);
  } else if (t < T.hod) {                              // District 2 with today's 50 new neighbours
    const [x, y] = isoW(W3.T2.C[0], W3.T2.C[1]); camXY(x, y, .2 * (1 + .06 * vprog(t, T.fifty, T.hod)));
  } else {                                             // house of the day
    const k = eio(vprog(t, T.hod, T.hod + 1.6)), a = isoW(W3.T2.C[0], W3.T2.C[1]), b = isoW(P.hod.i, P.hod.j);
    camXY(lerp(a[0], b[0], k), lerp(a[1], b[1], k) - 40 * k, Math.exp(lerp(Math.log(.2), Math.log(1.5), k)) * (1 + .06 * vprog(t, T.hod + 1.6, T.walk3d)));
  }
  draw();
  OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (vin(t, T.fifty, T.hod + .2)) {                 // rings on the 50 new houses
      const z = cam.z; ctx.save(); for (const [k, h] of P.newest.entries()) { const [sx, sy] = uvS(h.i, h.j), ph = (t * 1.6 + k * .13) % 1, a = (1 - ph) * vprog(t, T.fifty, T.fifty + .4);
        ctx.strokeStyle = `rgba(255,210,63,${a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 10 + 46 * ph, (10 + 46 * ph) * .55, 0, 0, 6.29); ctx.stroke(); ctx.fillStyle = `rgba(255,210,63,${.9 * vprog(t, T.fifty, T.fifty + .4)})`; ctx.beginPath(); ctx.arc(sx, sy - 8 * z, 6, 0, 6.29); ctx.fill(); } ctx.restore();
    }
    if (t >= T.brick - .1 && t < T.walk3d) {           // name tag of the house of the day
      const [sx, sy] = uvS(P.hod.i, P.hod.j), z = cam.z, k = eBack(vprog(t, T.brick - .1, T.brick + .25));
      ctx.save(); ctx.translate(sx, sy - 120 * z); ctx.scale(2.6 * k, 2.6 * k); tag(0, 0, '🏆 @' + P.hod.name, '#ffd23f', 1); ctx.restore();
    }
  });
}
/* ---------- the planet ---------- */
async function planet(t) {
  setHash('hour=12.5&weather=clear'); let o;
  if (t < T.old) { const k = ss(vprog(t, T.globe, T.planet + 1.2)), z = vprog(t, T.light, T.us + .6);
    o = { dist: lerp(4.2, 12, k) - 4.6 * ss(z), yaw: lerp(.55, -.05, vprog(t, T.globe, T.old)), pitch: .08 };
  } else { const k = vprog(t, T.red0, T.poll + 2); o = { dist: lerp(12.5, 7.2, ss(k)), yaw: P.redYaw + .25 * (1 - ss(vprog(t, T.red0, T.red))), pitch: P.redPitch }; }
  const c = await GLOBE.shot({ w: 1080, h: 1920, t, ...o });
  const g = OC.createRadialGradient(540, 860, 80, 540, 860, 1300); g.addColorStop(0, '#0d1636'); g.addColorStop(1, '#050816'); OC.fillStyle = g; OC.fillRect(0, 0, 1080, 1920);
  OC.drawImage(c, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (vin(t, T.us - .2, T.old)) { const [px, py] = GLOBE.project('town'), x = px * 1080, y = py * 1920, k = eBack(vprog(t, T.us - .2, T.us + .15)), bob = Math.sin(t * 6) * 8;
      ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, y, 60 + 8 * Math.sin(t * 5), 0, 6.29); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(x, y - 150 + bob); ctx.scale(k, k); panel(-170, -52, 340, 104, 34, '#ffd23f', null); otxt("THAT'S US 📍", 0, 0, 50, '#1b1728', 0); ctx.restore(); }
    if (t >= T.red - .1) { const [px, py, pz] = GLOBE.project('red'), x = px * 1080, y = py * 1920, k = vprog(t, T.red - .1, T.red + .3), pul = 1 + .15 * Math.sin(t * 7);
      if (pz < 1) { const g2 = ctx.createRadialGradient(x, y, 5, x, y, 170 * pul); g2.addColorStop(0, `rgba(255,60,80,${.75 * k})`); g2.addColorStop(1, 'rgba(255,60,80,0)'); ctx.fillStyle = g2; ctx.fillRect(x - 200, y - 200, 400, 400);
        ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.arc(x, y, 95 * pul, 0, 6.29); ctx.stroke(); ctx.restore(); }
    }
  });
}
/* ---------- the 3D streets ---------- */
function street3d(t) {
  let o;
  if (t < T.env) {
    setHash('hour=12.5&weather=clear');
    const k = vprog(t, T.walk3d, T.yours), d = 1.6 + (P.run * .82 - 1.6) * k, x = P.s0[0] + Math.sin(P.yaw0) * d, z = P.s0[1] + Math.cos(P.yaw0) * d;
    const turn = ss(vprog(t, T.yours - .25, T.yours + .45)), look = P.yourYaw;
    o = { x, z, yaw: lerp(P.yaw0 + .05 * Math.sin(t * .8), look, turn), pitch: lerp(.02, .06, turn), bob: d * 6.5, force: true };
  } else {
    const h = t < T.night ? 'hour=12.5&weather=clear' : t < T.rain ? 'hour=22&weather=clear' : t < T.snow ? 'hour=14&weather=rain' : t < T.dusk ? 'hour=11&weather=snow' : 'hour=16.55&weather=clear';
    setHash(h); const k = vprog(t, T.env, T.red0);
    o = { x: P.e0[0] + Math.sin(P.eyaw) * k * 1.2, z: P.e0[1] + Math.cos(P.eyaw) * k * 1.2, yaw: P.eyaw - .25 + .5 * k, pitch: .05, bob: 0, force: true };
  }
  const c = W3D.shot({ w: 720, h: 1280, t: 100 + t, st: 500 + t, dt: 1 / 30, ...o });
  OC.drawImage(c, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (t >= T.yours - .1 && t < T.env) { const [px, py, pz] = W3D.project(P.your.i, 1.05, P.your.j); if (pz < 1) { const k = eBack(vprog(t, T.yours - .1, T.yours + .25)); ctx.save(); ctx.translate(px * 1080, py * 1920); ctx.scale(3.2 * k, 3.2 * k); tag(0, 0, 'YOUR HOUSE 🫵', '#3ddc84', 1); ctx.restore(); } }
    if (t >= T.env && t < T.red0) { const L = t < T.night ? '☀️ DAY' : t < T.rain ? '🌙 NIGHT' : t < T.snow ? '🌧️ RAIN' : t < T.dusk ? '❄️ SNOW' : '🌇 SUNSET'; vstamp(L, 540, 330, t, t < T.night ? T.env : t < T.rain ? T.night : t < T.snow ? T.rain : t < T.dusk ? T.snow : T.dusk, T.red0, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)'); }
  });
}
/* ---------- overlays on top of everything ---------- */
function hud(t) {
  const a = vprog(t, T.fifty, T.fifty + .3) * (1 - vprog(t, T.hod + .3, T.hod + .6)); if (a <= 0) return;
  const k = ss(vprog(t, T.fifty + .2, T.fifty + 1.4)), n = Math.round(lerp(5631, 5681, k)), b = lerp(2270, 2770, k);
  ctx.save(); ctx.globalAlpha = a; panel(170, 250, 740, 200, 44, 'rgba(10,12,26,.9)', 'rgba(70,224,138,.7)', 4);
  txt('TENANTS', 360, 296, 26, '#9aa3c7', 'center', 'middle'); otxt(n.toLocaleString('en-US'), 360, 366, 78, '#ffffff', 10, '#06070f');
  txt("BENNY'S BANK", 720, 296, 26, '#9aa3c7', 'center', 'middle'); otxt('€' + (b / 100).toFixed(2), 720, 366, 78, '#46e08a', 10, '#06070f');
  txt('DAY 6', 540, 424, 24, '#c3c9e4', 'center', 'middle'); ctx.restore();
}
function pollCard(t) {
  if (t < T.poll) return; const k = eBack(vprog(t, T.poll, T.poll + .35));
  ctx.fillStyle = `rgba(5,8,22,${.55 * vprog(t, T.poll, T.poll + .4)})`; ctx.fillRect(0, 0, 1080, 1920);
  ctx.save(); ctx.translate(540, 860); ctx.scale(k, k);
  panel(-460, -330, 920, 660, 44, 'rgba(10,12,26,.95)', 'rgba(255,255,255,.25)', 3);
  otxt('WHERE SHOULD', 0, -255, 56, '#ffd23f', 8); otxt('BENNY GO FIRST?', 0, -190, 56, '#ffd23f', 8);
  [['🔴', 'The red light'], ['🌲', 'The dark forest'], ['🌊', 'Down the river']].forEach(([e, s], i) => { const y = -80 + i * 120, kk = eBack(vprog(t, T.poll + .3 + i * .18, T.poll + .6 + i * .18));
    ctx.save(); ctx.translate(0, y); ctx.scale(kk, kk); panel(-410, -48, 820, 96, 30, 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)', 3); emoji(ctx, e, -350, 2, 52); txt(s, -300, 2, 46, '#ffffff', 'left', 'middle'); ctx.restore(); });
  txt('Vote in the comments 👇', 0, 290, 38, '#c3c9e4', 'center', 'middle');
  ctx.restore();
  if (t >= T.follow) { const kk = eBack(vprog(t, T.follow, T.follow + .3)); ctx.save(); ctx.translate(540, 1330); ctx.scale(kk, kk);
    const g = ctx.createLinearGradient(-470, 0, 470, 0); g.addColorStop(0, '#ff2e63'); g.addColorStop(1, '#ff8a3d'); rrect(ctx, -470, -95, 940, 190, 40); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
    otxt('FOLLOW = YOUR OWN HOUSE 🏠', 0, -26, 52, '#fff', 9, 'rgba(90,0,30,.6)'); txt('find it: bennystown.github.io 🌍', 0, 48, 34, '#fff', 'center', 'middle'); ctx.restore(); }
}
function overlays(t) {
  vstamp("BENNY'S TOWN…", 540, 330, t, .2, T.world, 96, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('…IS NOW A WORLD 🌍', 540, 330, t, T.world, T.planet + .6, 104, '#ffd23f', .02, 'rgba(10,12,26,.86)');
  vstamp('🌫️ UNEXPLORED', 540, 330, t, T.fog, T.light, 92, '#c9d3ff', -.02, 'rgba(10,12,26,.86)');
  vstamp('🏰 OLD TOWN', 540, 330, t, T.old + .1, T.bridge, 100, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('HOUSES #1 – #5,000', 540, 470, t, T.first, T.bridge, 70, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('🌉 THE BRIDGE', 540, 330, t, T.bridge + .1, T.d2, 96, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('✨ DISTRICT 2', 540, 330, t, T.d2, T.fifty, 100, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('+50 NEW NEIGHBORS 🏠', 540, 560, t, T.fifty + .1, T.hod, 80, '#ffffff', .02, '#ff2e63');
  vstamp('🏆 HOUSE OF THE DAY', 540, 330, t, T.hod + .1, T.walk3d, 88, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('A VERY COOL BRICK 🧱', 540, 470, t, T.very, T.walk3d, 70, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('🚶 WALK THROUGH IT IN 3D', 540, 330, t, T.walk, T.street, 78, '#ffd23f', -.02, 'rgba(10,12,26,.86)');
  vstamp('EVERY STREET', 540, 330, t, T.street, T.house, 92, '#ffffff', .02, 'rgba(10,12,26,.86)');
  vstamp('EVERY HOUSE', 540, 330, t, T.house, T.yours, 92, '#ffffff', -.02, 'rgba(10,12,26,.86)');
  vstamp('EVEN YOURS 🫵', 540, 330, t, T.yours, T.env, 96, '#3ddc84', .02, 'rgba(10,12,26,.86)');
  vstamp('⏰ REAL TIME', 540, 470, t, T.dusk + .4, T.red0, 74, '#ffd23f', .02, 'rgba(10,12,26,.86)');
  vstamp('🔴 ???', 540, 330, t, T.red, T.poll, 110, '#ff4d6d', -.03, 'rgba(10,12,26,.86)');
  vstamp('NOT EVEN BENNY 😳', 540, 470, t, T.notb, T.poll, 74, '#ffffff', .02, 'rgba(10,12,26,.86)');
  hud(t); pollCard(t);
}
/* ---------- master ---------- */
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1;
  if (t < T.globe || vin(t, T.old, T.walk3d)) map2d(t);
  else if (vin(t, T.walk3d, T.red0)) street3d(t);
  else await planet(t);
  // zoom-out → planet: blend the last map frame into the planet
  if (vin(t, T.world, T.globe)) { /* map frame already drawn */ }
  withCtx(OC, () => {
    overlays(t);
    if (t < T.poll) vCaption(t);
    if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, 1080, 1920); }
    for (const c of CUTS) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
  });
  return OUT.toDataURL('image/jpeg', .92);
}
window.EP = {
  DUR: VDUR, T,
  async init(caps) {
    CAPS = caps; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    // 3D world: build it once (as if you pressed Walk), then render frames by hand
    await startWalk(); for (let k = 0; k < 400 && !(window.W3D && W3D.on); k++) await new Promise(r => setTimeout(r, 250));
    window.__globe = true;   // keeps the map's own animation loop paused
    W3D.shot({ w: 1080, h: 1920, t: 0, x: 2.7, z: 4.75, yaw: 0, pitch: 0 });   // stops the 3D loop (frames are rendered by hand)
    const box = townsBox(); P.boxC = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]; P.fit = fitZoom(); P.fit1 = fitR(W3.T1.R + 2); P.fit2 = fitR(W3.T2.R + 6);
    P.hod = HOUSES.find(h => h.name === 'cool_brick0'); P.newest = HOUSES.slice(-50);
    // the walk: the longest straight street near Benny's square (houses on both sides)
    const wk = (x, z) => __3d.walkable(x, z); let best = -1;
    for (const st of W3.T1.streets) { const id = String(st.id); if (id[0] === 'g') continue; for (let q = 0; q < st.pts.length; q += 3) { const p = st.pts[q]; if (Math.hypot(p[0] - 3, p[1] - 3) > 28 || !wk(p[0], p[1])) continue;
      for (let k = 0; k < 32; k++) { const a = k / 32 * 6.2832, ux = Math.sin(a), uz = Math.cos(a); let d = 0; while (d < 24 && wk(p[0] + ux * (d + .25), p[1] + uz * (d + .25))) d += .25; if (d > best) { best = d; P.s0 = [p[0], p[1]]; P.yaw0 = a; } } } }
    P.run = best; const end = [P.s0[0] + Math.sin(P.yaw0) * best * .82, P.s0[1] + Math.cos(P.yaw0) * best * .82];
    let hb = null, hd = 1e9; for (const h of HOUSES) { if (h.town !== 1) continue; const d = Math.hypot(h.i - end[0], h.j - end[1]); if (d < hd && d > 1.2) { hd = d; hb = h; } }
    P.your = hb; P.yourYaw = Math.atan2(hb.i - end[0], hb.j - end[1]);
    P.e0 = [P.s0[0] + Math.sin(P.yaw0) * best * .3, P.s0[1] + Math.cos(P.yaw0) * best * .3]; P.eyaw = P.yaw0;
    // the planet: turn it so the red light faces us
    await GLOBE.shot({ w: 1080, h: 1920, dist: 12, yaw: 0, pitch: 0, t: 0 });
    let bs = 1e9; for (let yaw = -3.1; yaw <= 3.1; yaw += .05) for (let pitch = -1.1; pitch <= 1.1; pitch += .05) {
      const q = new THREE.Quaternion(), e = new THREE.Object3D(); e.quaternion.copy(GLOBE.baseQ()); e.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), pitch); e.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), yaw);
      const v = GLOBE.redLocal().clone().applyQuaternion(e.quaternion).normalize(), sc = Math.hypot(v.x + .12, v.y - .25) + (v.z < 0 ? 9 : 0); if (sc < bs) { bs = sc; P.redYaw = yaw; P.redPitch = pitch; } }
    return JSON.stringify({ fit: P.fit, run: P.run, your: hb.name, red: [P.redYaw, P.redPitch], hod: P.hod && [P.hod.i, P.hod.j] });
  },
  frame,
};
})();
