/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['shop', T.hund - .3], ['plow', T.beep - .2], ['salt', T.salt - .3], ['move', T.look - .3], ['hod', T.hod - .3], ['mittens', T.mittens - .3], ['end', T.left - .3]];
const FLASHES = SCENES.slice(1).map(s => s[1]);
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t), MAP = { move: sceneMove, hod: sceneHod };
  if (MAP[sc]) MAP[sc](t); else withCtx(OC, () => ({ hook: sceneHook, shop: sceneShop, plow: scenePlow, salt: sceneSalt, mittens: sceneMittens, end: sceneEnd })[sc](t));
  withCtx(OC, () => {
    if (t < T.night - .1) vCaption(t);
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
    P.newN = window.__NEWN;
    P.newH = HOUSES.slice(-P.newN);
    const avg = a => [a.reduce((s, h) => s + h.i, 0) / a.length, a.reduce((s, h) => s + h.j, 0) / a.length];
    const L = HOUSES[HOUSES.length - 1], near = P.newH.map(h => [h, Math.hypot(h.i - L.i, h.j - L.j)]).sort((x, y) => x[1] - y[1]).slice(0, 40).map(x => x[0]);
    P.newC = isoW(...avg(near.slice(0, 12))); P.edgeC = isoW(...avg(near)); P.townC = isoW(...avg(HOUSES));
    P.newH = near.concat(P.newH.filter(h => !near.includes(h)));
    P.hod = HOUSES.find(h => h.name === 'hardtaileris');
    P.bank = TOWN.bankCents;
    return JSON.stringify({ n: HOUSES.length, newN: P.newN, bank: P.bank, hod: !!P.hod });
  },
  frame, dbg() { camXY(P.newC[0], P.newC[1], 1.25); const nn = P.newH.slice(0,40).map(h => uvS(h.i,h.j).map(Math.round)); return JSON.stringify({nn, c: P.newC, cam, a: P.newH.slice(0,4).map(h => [h.name, h.i, h.j, h.town, uvS(h.i, h.j)]), last: [HOUSES.length, HOUSES[HOUSES.length-1].name]}); },
};
})();
