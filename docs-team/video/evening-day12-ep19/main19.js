/* ======================= MASTER ======================= */
const SCENES = [['hook', 0], ['money', T.money - .2], ['build', T.build - .2], ['tower', T.look - .2], ['night', T.tonight - .3], ['hod', T.oh - .2], ['end', T.tomorrow - .3]];
const FLASHES = SCENES.slice(1).map(s => s[1]);
function sceneAt(t) { let s = SCENES[0][0]; for (const [n, a] of SCENES) if (t >= a) s = n; return s; }
async function frame(t) {
  OC.setTransform(1, 0, 0, 1, 0, 0); OC.globalAlpha = 1; OC.filter = 'none';
  const sc = sceneAt(t);
  if (sc === 'hod') sceneHod(t);
  else withCtx(OC, () => ({ hook: sceneHook, money: sceneMoney, build: sceneBuild, tower: sceneTower, night: sceneNight, end: sceneEnd })[sc](t));
  withCtx(OC, () => {
    if (t < T.tomorrow - .3) vCaption(t);
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
    P.newH = []; P.newN = 0;
    // house of the day: random (seeded by date), a loyal one with a fence, never a past winner
    const past = ['yopmonster'], pool = HOUSES.filter(h => tierOf(h) >= 2 && !past.includes(h.name) && h.name.length < 18);
    let r = 20261125; r = (r * 1103515245 + 12345) % 2147483648; P.hod = HOUSES.find(h => h.name === 'gordeybilokur') || pool[r % pool.length];   // Kieran: HockeyGordey (asked many times)
    return JSON.stringify({ n: HOUSES.length, hod: P.hod.name, tier: tierOf(P.hod), ij: [P.hod.i, P.hod.j], iso: isoW(P.hod.i, P.hod.j), T: [T.oh, T.hod, T.welcome] });
  },
  frame,
};
})();
