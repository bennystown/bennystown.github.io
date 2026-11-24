/* ======================= MAP: the cabin in the middle of the square ======================= */
function sceneMap(t) {
  const a = T.realc - .25, k = ss(vprog(t, a, a + 2.6)), [bx, by] = isoW(3, 3);
  camXY(bx, by - 40 * k, Math.exp(lerp(Math.log(.16), Math.log(2.1), k)));
  window.__cabinK = .55 + .45 * ss(vprog(t, a + .2, a + 1.4)); window.__grassK = ss(vprog(t, a, a + .8));
  setHash('hour=14.5&weather=clear'); S.T = 500 + t; draw(); OC.drawImage(cv, 0, 0, 1080, 1920);
  withCtx(OC, () => {
    if (k > .6) { const [x, y] = uvS(3, 3), p = 1 + .06 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = vprog(t, a + 1.6, a + 2.2); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.ellipse(x, y - 20 * cam.z, 150 * cam.z * p, 80 * cam.z * p, 0, 0, 6.29); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    vstamp('📍 RIGHT IN THE MIDDLE', 540, 330, t, T.realc + .5, T.first, 80, '#ffd23f', -.02, 'rgba(10,12,26,.9)');
    vstamp("OF BENNY'S TOWN 🏡", 540, 450, t, T.middle2 - .2, T.first, 74, '#ffffff', .02, 'rgba(10,12,26,.9)');
  });
}
/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['shop', T.kpack - .25], ['unbox', T.bed - .25], ['build', T.okay - .2], ['map', T.realc - .25], ['night', T.first - .3]];
const FLASHES = [T.kpack - .25, T.bed - .25, T.okay - .2, T.realc - .25];
const FADES = [T.first - .3];
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'map') sceneMap(t);
  else withCtx(OC, () => ({ hook: sceneHook, shop: sceneShop, unbox: sceneUnbox, build: sceneBuild, night: sceneNight })[sc](t));
  withCtx(OC, () => {
    endCards(t);
    if (t < T.end + .2) vCaption(t);
    for (const c of FLASHES) if (vin(t, c, c + .14)) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - (t - c) / .14)})`; ctx.fillRect(0, 0, 1080, 1920); }
    for (const c of FADES) if (Math.abs(t - c) < .35) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.abs(t - c) / .35})`; ctx.fillRect(0, 0, 1080, 1920); }
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
    return JSON.stringify({ n: HOUSES.length, cabin: !!TOWN.milestones.cabin });
  },
  frame,
};
})();
