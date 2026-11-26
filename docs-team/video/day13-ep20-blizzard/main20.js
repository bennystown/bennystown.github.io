/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['buried', T.shovel - .2], ['stuck', T.oh - .2], ['shovel', T.dont - .2], ['mittens', T.mittens - .3], ['yuki', T.yuki - .3], ['hod', T.hod - .3], ['vote', T.help - .2]];
const FLASHES = SCENES.slice(1).map(s => s[1]);
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t), MAP = { stuck: sceneStuck, yuki: sceneYuki, hod: sceneHod };
  if (MAP[sc]) MAP[sc](t); else withCtx(OC, () => ({ hook: sceneHook, buried: sceneBuried, shovel: sceneShovel, mittens: sceneMittens, vote: sceneVote })[sc](t));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.vote - .1) vCaption(t);
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
    window.__globe = true; window.__noBenny = true; window.__NEWN = 157;
    const NEWN = window.__NEWN || 30;   // set by build: how many of the last tenants are today's new neighbours
    const L = HOUSES[HOUSES.length - 1]; let mi = L.i, mj = L.j;
    P.newN = window.__NEWN || 0;
    P.newH = HOUSES.slice(-Math.max(NEWN, 30)).map(h => [h, Math.hypot(h.i - mi, h.j - mj)]).sort((x, y) => x[1] - y[1]).slice(0, 26).map(x => x[0]);
    mi = P.newH.reduce((a, h) => a + h.i, 0) / P.newH.length; mj = P.newH.reduce((a, h) => a + h.j, 0) / P.newH.length; P.newC = isoW(mi, mj);
    P.yuki = HOUSES.find(h => h.name === 'yukimst'); P.hod = HOUSES.find(h => h.name === 'reubenclark16');
    P.bank = TOWN.bankCents;
    return JSON.stringify({ n: HOUSES.length, newN: P.newN, bank: P.bank, yuki: !!P.yuki, hod: !!P.hod });
  },
  frame,
};
})();
