/* ======================= MAP SCENES ======================= */
function mapBase(t, hash) { setHash(hash); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920); }
function mapRent(t) {
  for (const h of P.newest) h.bt = 0;
  const k = ss(vprog(t, T.five - .2, T.look + .8)), [bx, by] = isoW(BHOME[0], BHOME[1]);
  camXY(lerp(bx, P.oldB.c[0], k), lerp(by - 30, P.oldB.c[1], k), Math.exp(lerp(Math.log(.95), Math.log(P.oldZ * 1.6), k)));
  mapBase(t, 'hour=11.5&weather=clear');
  withCtx(OC, () => {
    const N = P.rentH.length, a = T.five - .3, span = (T.amount - .1) - a; let drawn = 0;
    for (let i = 0; i < N && drawn < 320; i++) {
      const t0 = a + (i / N) * span; if (t < t0 || t > t0 + 1.25) continue;
      const h = P.rentH[i], [sx, sy] = uvS(h.i, h.j); if (sx < -80 || sx > 1160 || sy < -80 || sy > 2000) continue;
      const q = (t - t0) / 1.25, y0 = sy - 40 * cam.z, rise = Math.min(1, q / .28);
      const fx = q < .28 ? sx : lerp(sx, 540, ss((q - .28) / .72)), fy = q < .28 ? y0 - 70 * rise : lerp(y0 - 70, 300, ss((q - .28) / .72));
      coin(fx, fy, Math.max(8, 17 * Math.min(1, cam.z * 1.5)), q > .9 ? (1 - q) * 10 : 1);
      if (i < 60 && q < .55) { ctx.save(); ctx.globalAlpha = 1 - q / .55; otxt('+10¢', sx, sy - 115 * cam.z - q * 70, 36, '#46e08a', 6, '#06070f'); ctx.restore(); }
      drawn++;
    }
    const v = Math.round(lerp(210, 58320, ss(vprog(t, T.five, T.amount + .35)))), pulse = vin(t, T.amount + .2, T.amount + 1.1) ? Math.sin(vprog(t, T.amount + .2, T.amount + 1.1) * Math.PI) : 0;
    if (t > T.amount + .2) for (let q = 0; q < 30; q++) { const f = vprog(t, T.amount + .2, T.amount + 1.8), a2 = rnd(q) * 6.283, d = f * (160 + rnd(q + 4) * 300); ctx.save(); ctx.globalAlpha = 1 - f; emoji(ctx, q % 2 ? '✨' : '💰', 540 + Math.cos(a2) * d, 300 + Math.sin(a2) * d * .6, 44); ctx.restore(); }
    bankPanel(v, vprog(t, T.five - .3, T.five), pulse, '5,778 × 10¢');
    vstamp('🏘️ 5,778 NEIGHBORS', 540, 560, t, T.five, T.each - .2, 76, '#ffffff', -.02, 'rgba(10,12,26,.88)');
    vstamp('× 10¢ EACH 🪙', 540, 560, t, T.each - .2, T.look, 80, '#46e08a', .02, 'rgba(10,12,26,.88)');
    vstamp('LOOK AT THE BANK 👆', 540, 560, t, T.look, T.amount + .2, 74, '#ffffff', -.02, 'rgba(10,12,26,.88)');
    vstamp('🤯 €583.20!', 540, 560, t, T.amount + .2, T.never, 104, '#ffd23f', .02, 'rgba(10,12,26,.9)');
  });
}
function mapNew(t) {
  P.newest.forEach((h, k) => { h.bt = 500 + T.newn + .15 + k * .085; });
  const k = vprog(t, T.newn - .2, T.oh), [cx, cy] = P.newB.c;
  camXY(cx, cy - 20, P.newZ * (1 + .1 * ss(k)));
  mapBase(t, 'hour=12&weather=clear');
  withCtx(OC, () => {
    const z = cam.z; ctx.save();
    P.newest.forEach((h, q) => { const tp = T.newn + .15 + q * .085; if (t < tp) return; const [sx, sy] = uvS(h.i, h.j), ph = ((t - tp) * 1.3) % 1, a = (1 - ph) * .9;
      ctx.strokeStyle = `rgba(255,210,63,${a})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, sy - 6 * z, 14 + 50 * ph, (14 + 50 * ph) * .55, 0, 0, 6.29); ctx.stroke(); });
    ctx.restore();
    let n = 0; for (let q = P.newest.length - 1; q >= 0 && n < 7; q--) { const h = P.newest[q], tp = T.newn + .6 + q * .085; if (t < tp) continue; const [sx, sy] = uvS(h.i, h.j); if (sx < 120 || sx > 960 || sy < 420 || sy > 1500) continue;
      const kk = eBack(vprog(t, tp, tp + .3)); ctx.save(); ctx.translate(sx, sy - 120 * z); ctx.scale(2.3 * kk, 2.3 * kk); tag(0, 0, '@' + (h.name.length > 15 ? h.name.slice(0, 14) + '…' : h.name), '#3ddc84', 1); ctx.restore(); n++; }
    vstamp('+33 NEW NEIGHBORS 🏠', 540, 330, t, T.newn + .1, T.welcome, 82, '#ffffff', -.02, '#ff2e63');
    vstamp('WELCOME TO THE TOWN! 👋', 540, 330, t, T.welcome, T.houses, 74, '#ffd23f', .02, 'rgba(10,12,26,.88)');
    vstamp('YOUR HOUSE IS WAITING 🏠', 540, 330, t, T.houses, T.oh, 72, '#ffffff', -.02, 'rgba(10,12,26,.88)');
  });
}
function mapTreasure(t) {
  for (const h of P.newest) h.bt = 0;
  const k = vprog(t, T.oh - .1, T.so);
  camXY(P.townB.c[0] + 60 * k, P.townB.c[1] - 20 * k, P.townZ * (1.0 + .08 * k));
  mapBase(t, 'hour=13&weather=clear');
  withCtx(OC, () => {
    const p = 1 + .08 * Math.sin(t * 5), kk = eBack(vprog(t, T.oh, T.oh + .4)); ctx.save(); ctx.translate(540, 980); ctx.scale(kk * p, kk * p);
    circle(ctx, 0, 0, 120, 'rgba(10,12,26,.82)', '#ffd23f', 8); otxt('?', 0, 6, 160, '#ffd23f', 0); ctx.restore();
    vstamp("💰 TODAY'S TINY TREASURE", 540, 330, t, T.oh + .1, T.nohints, 70, '#ffd23f', -.02, 'rgba(10,12,26,.88)');
    vstamp('🚶 ONLY IN 3D · NO HINTS 🤫', 540, 330, t, T.nohints, T.so, 68, '#ffffff', .02, 'rgba(10,12,26,.88)');
  });
}
/* ======================= MASTER ======================= */
const SCENES = [
  ['hook', 0], ['rewind', T.first], ['shop', T.voted], ['trap', T.put - .15], ['bed', T.couldnt - .35], ['dark', T.ran + .15], ['kitten', T.kitten - .15],
  ['inside', T.took - .1], ['morning', T.morning - .2], ['rent', T.five - .3], ['rich', T.never - .1], ['new', T.newn - .15], ['treasure', T.oh - .1], ['decide', T.so - .1]];
const FADES = [T.couldnt - .35, T.morning - .2];
const FLASHES = [T.voted, T.put - .15, T.ran + .15, T.five - .3, T.never - .1, T.newn - .15, T.oh - .1, T.so - .1];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'rent') mapRent(t); else if (sc === 'new') mapNew(t); else if (sc === 'treasure') mapTreasure(t);
  else withCtx(OC, () => ({ hook: sceneHook, rewind: sceneRewind, shop: sceneShop, trap: sceneTrap, bed: sceneBed, dark: sceneDark, kitten: sceneKitten, inside: sceneInside, morning: sceneMorning, rich: sceneRich, decide: sceneDecide })[sc](t));
  withCtx(OC, () => {
    pollCard(t);
    if (t < T.vote) vCaption(t);
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    for (const c of FADES) if (Math.abs(t - c) < .35) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.abs(t - c) / .35})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t > VDUR - .5) { ctx.fillStyle = `rgba(0,0,0,${(t - (VDUR - .5)) / .5})`; ctx.fillRect(0, 0, 1080, 1920); }
  });
  return OUT.toDataURL('image/jpeg', .92);
}
window.EP = {
  DUR: VDUR, T,
  async init(caps, mouth) {
    CAPS = caps; P.mouth = mouth; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    window.__globe = true; window.__noBenny = true;
    const box = townsBox(); P.boxC = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2]; P.fitZ = fitZoom();
    P.newest = HOUSES.slice(-N_NEW); const c = P.newest.reduce((a, h) => [a[0] + h.i, a[1] + h.j], [0, 0]); P.newC = isoW(c[0] / P.newest.length, c[1] / P.newest.length);
    const bbox = L => { let mn = [1e9, 1e9], mx = [-1e9, -1e9]; for (const h of L) { const [x, y] = isoW(h.i, h.j); mn = [Math.min(mn[0], x), Math.min(mn[1], y)]; mx = [Math.max(mx[0], x), Math.max(mx[1], y)]; } return { c: [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2], w: mx[0] - mn[0], h: mx[1] - mn[1] }; };
    P.oldB = bbox(HOUSES.filter(h => h.town === 1)); P.oldZ = Math.min(1000 / P.oldB.w, 1350 / P.oldB.h);
    P.townB = bbox(HOUSES); P.townZ = Math.min(1000 / P.townB.w, 1300 / P.townB.h);
    { const pts = P.newest.map(h => isoW(h.i, h.j)); let best = -1, bc = pts[0];
      for (const p of pts) { const near = pts.filter(q => Math.abs(q[0] - p[0]) < 1500 && Math.abs(q[1] - p[1]) < 1900); if (near.length > best) { best = near.length; bc = [near.reduce((s, q) => s + q[0], 0) / near.length, near.reduce((s, q) => s + q[1], 0) / near.length]; } }
      P.newB = { c: bc, n: best }; P.newZ = .42; }
    P.rentH = HOUSES.map(h => [Math.hypot(h.i - BHOME[0], h.j - BHOME[1]), h]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    return JSON.stringify({ n: HOUSES.length, fitZ: P.fitZ, townB: P.townB, townZ: P.townZ, newB: P.newB, newZ: P.newZ, oldZ: P.oldZ, oldB: P.oldB, last: HOUSES[HOUSES.length - 1].name });
  },
  frame,
};
})();
