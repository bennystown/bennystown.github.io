/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['n0', T.n0], ['n1', T.n1 - .15], ['n2', T.n2 - .15], ['n3', T.n3 - .15], ['n4', T.n4 - .15], ['fence', T.more - .2], ['hod', T.hod - .2]];
const FLASHES = [T.n0, T.n1 - .15, T.n2 - .15, T.n3 - .15, T.n4 - .15, T.more - .2, T.hod - .2];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'fence') sceneFence(t); else if (sc === 'hod') sceneHod(t);
  else withCtx(OC, () => sc === 'hook' ? sceneHook(t) : sceneName(t, +sc[1]));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.vote + .1 || t < T.end) { if (t < T.vote) vCaption(t); }
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (t < .12) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .12})`; ctx.fillRect(0, 0, 1080, 1920); }
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
    P.hod = HOUSES.find(h => h.name === 'yopmonster');
    return JSON.stringify({ n: HOUSES.length, hod: P.hod && [P.hod.i, P.hod.j, tierOf(P.hod)] });
  },
  frame,
};
})();
