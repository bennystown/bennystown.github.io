/* ======================= MASTER ======================= */
const SCENES = [['A', 0], ['B', T.now - .1], ['C', T.started], ['D', T.someone - .25], ['E', T.how - .3], ['F', T.sofar - .2], ['G', T.longer - .2], ['H', T.look - .25], ['I', T.but - .3], ['J', T.cta - .3]];
const FLASHES = SCENES.slice(1).map(s => s[1]).concat([T.van - .2, T.heater - .2, T.kitten - .2, T.cabin - .2, T.pigeon - .2, T.tent - .25]);
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t), F = { A: sceneA, B: sceneB, C: sceneC, D: sceneD, E: sceneE, F: sceneF, G: sceneG, H: sceneH, I: sceneI, J: sceneJ };
  if ('BDHI'.includes(sc)) F[sc](t); else withCtx(OC, () => F[sc](t));
  withCtx(OC, () => {
    if (t < T.cta - .3) vCaption(t);
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
    P.N = HOUSES.length; P.first = HOUSES[0];
    const L = HOUSES[HOUSES.length - 1]; let mi = L.i, mj = L.j;
    P.newH = HOUSES.slice(-172).map(h => [h, Math.hypot(h.i - mi, h.j - mj)]).sort((x, y) => x[1] - y[1]).slice(0, 26).map(x => x[0]);
    mi = P.newH.reduce((a, h) => a + h.i, 0) / P.newH.length; mj = P.newH.reduce((a, h) => a + h.j, 0) / P.newH.length;
    P.newC = isoW(mi, mj);
    return JSON.stringify({ n: P.N, first: P.first.name, newN: P.newH.length, bank: TOWN.bankCents });
  },
  frame,
};
})();
