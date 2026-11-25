/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['reveal', T.mit - .05], ['tag', T.tag - .25], ['sign', T.cabin - .3], ['live', T.oh - .2], ['shop', T.now - .3]];
const FLASHES = [T.mit - .05, T.tag - .25, T.cabin - .3, T.oh - .2, T.now - .3];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'live') sceneLive(t);
  else withCtx(OC, () => ({ hook: sceneHook, reveal: sceneReveal, tag: sceneTag, sign: sceneSign, shop: sceneShop })[sc](t));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.vote) vCaption(t);
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t < .12) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .12})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t > VDUR - .5) { ctx.fillStyle = `rgba(0,0,0,${(t - (VDUR - .5)) / .5})`; ctx.fillRect(0, 0, 1080, 1920); }
  });
  return OUT.toDataURL('image/jpeg', .92);
}
window.EP = {
  DUR: VDUR, T,
  async init(caps, mouth, names) {
    CAPS = caps; P.mouth = mouth; bennyNow = () => null;
    OUT = document.createElement('canvas'); OUT.width = 1080; OUT.height = 1920; OC = OUT.getContext('2d');
    DPR = 1; VW = 1080; VH = 1920; cv.width = 1080; cv.height = 1920; cv.style.width = '1080px'; cv.style.height = '1920px'; FX = 540; FY = 960;
    window.__globe = true; window.__noBenny = true;
    for (const nm of names || []) liveAddHouse(nm, true);
    P.liveH = (names || []).map(n => BY_NAME.get(norm(n))).filter(Boolean);
    const mi = P.liveH.reduce((a, h) => a + h.i, 0) / P.liveH.length, mj = P.liveH.reduce((a, h) => a + h.j, 0) / P.liveH.length;
    P.liveC = isoW(mi, mj);
    const is = P.liveH.map(h => h.i), js = P.liveH.map(h => h.j); return JSON.stringify({ rng: [Math.min(...is), Math.max(...is), Math.min(...js), Math.max(...js)], smp: P.liveH.slice(0, 6).map(h => [h.i, h.j]), n: HOUSES.length, live: P.liveH.length, c: [mi, mj], bank: TOWN.bankCents });
  },
  frame,
};
})();
