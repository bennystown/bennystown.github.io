/* ================= BENNY'S TOWN 3D — models (all real 3D, built from the 2D drawings' sizes and colours) ================= */
// every function draws into a geometry builder B, in local coordinates; push(x, y, z, rotY) places it
function W3DModels() {
  const { T3, HU, PX, GB, col } = W3D;
  const px = n => n * PX, hy = n => n * HU;                   // 2D pixels → world (width / height)
  const O = .011;                                              // outline (hull) thickness
  const M = {};

  /* --- bench: local x = length, sits facing +z --- */
  M.bench = (B, x, z, ry) => { B.push(x, 0, z, ry);
    for (const sx of [-.17, .17]) { B.box(sx - .018, 0, -.055, sx + .018, hy(9), -.03, '#5b4028'); B.box(sx - .018, 0, .03, sx + .018, hy(9), .055, '#5b4028'); }
    B.box(-.22, hy(9), -.075, .22, hy(11.5), .075, '#b07a50', { hull: O * .7, edges: true });
    B.box(-.22, hy(13), -.085, .22, hy(26), -.06, '#9c6a44', { hull: O * .7, edges: true });
    B.box(-.2, hy(11), -.08, -.17, hy(14), -.06, '#5b4028'); B.box(.17, hy(11), -.08, .2, hy(14), -.06, '#5b4028');
    B.pop(); };

  /* --- street furniture lamps (pole + head) --- */
  M.lampPlaza = (B, x, z) => { B.cyl(x, z, px(2.4), 0, hy(66), 8, '#2a2e45', { hull: O * .6 }); B.cyl(x, z, px(4.5), 0, hy(5), 8, '#2a2e45'); B.sphere(x, hy(71), z, px(7), '#fff2c4', { hull: O * .6 }); B.cone(x, z, px(5), 0, hy(76), hy(80), 8, '#2a2e45'); };
  M.lampMarket = (B, x, z) => { B.cyl(x, z, px(2), 0, hy(62), 8, '#2a2e45', { hull: O * .6 }); B.sphere(x, hy(65), z, px(6), '#fff2c4', { hull: O * .6 }); };
  M.lampStreet = (B, x, z, ax, az) => { const L = .13, hx = x + ax * L, hz = z + az * L;
    B.cyl(x, z, px(1.9), 0, hy(58), 6, '#2a2e45'); B.tube([x, hy(57), z], [hx, hy(61), hz], px(1.4), '#2a2e45', { n: 5 });
    B.sphere(hx, hy(59), hz, px(5), '#fff2c4'); B.sphere(hx, hy(62), hz, px(5.5), '#2a2e45', { s: [1, .45, 1] }); };

  /* --- fountain on Benny's square --- */
  M.fountain = (B, x, z) => { B.push(x, 0, z);
    const R = px(48), Ri = px(39), N = 32;
    for (let k = 0; k < N; k++) { const a = k / N * 6.2832, b = (k + 1) / N * 6.2832, P = (r, an, y) => [Math.cos(an) * r, y, Math.sin(an) * r], out = [Math.cos((a + b) / 2), 0, Math.sin((a + b) / 2)];
      B.quad(P(R, a, 0), P(R, b, 0), P(R, b, hy(8)), P(R, a, hy(8)), '#8f897a', out);
      B.quad(P(Ri, a, hy(8)), P(R, a, hy(8)), P(R, b, hy(8)), P(Ri, b, hy(8)), '#a7a091', [0, 1, 0]);
      B.quad(P(Ri, a, hy(3)), P(Ri, b, hy(3)), P(Ri, b, hy(8)), P(Ri, a, hy(8)), '#7d7769', [-out[0], 0, -out[2]]);
      B.hquad(P(R + O, a, -O), P(R + O, b, -O), P(R + O, b, hy(8) + O), P(R + O, a, hy(8) + O), out); }
    B.disc(0, hy(5), 0, Ri, N, '#4fa3d9');
    B.cyl(0, 0, px(9), 0, hy(10), 12, '#8c8577'); B.cyl(0, 0, px(4.5), hy(10), hy(30), 10, '#8c8577', { hull: O * .6 });
    B.cone(0, 0, px(5), px(15), hy(28), hy(33), 14, '#9a9383', { under: '#7d7769' }); B.disc(0, hy(32.6), 0, px(13), 14, '#4fa3d9');
    B.sphere(0, hy(35), 0, px(4), '#9a9383');
    B.pop(); };
  /* --- Benny's wooden cabin (replaces the fountain once bought) --- */
  M.cabin = (B, x, z) => { B.push(x, 0, z);
    const h = .5, W = hy(64), R = hy(44), e = .09, wood = '#9a6a3e', dark = '#5b3a2a';
    B.disc(0, .025, 0, .95, 32, '#5aa868');
    B.box(-h, 0, -h, h, W, h, wood, { hull: O, top: '#7d5230' });
    for (let k = 1; k < 6; k++) { const y = W * k / 6; B.box(-h - .006, y - .007, -h - .006, h + .006, y + .007, h + .006, '#6e4626'); }
    B.quad([-h - e, W - .01, h + e], [h + e, W - .01, h + e], [h + e, W + R, 0], [-h - e, W + R, 0], dark, [0, .75, .66]);
    B.quad([h + e, W - .01, -h - e], [-h - e, W - .01, -h - e], [-h - e, W + R, 0], [h + e, W + R, 0], '#4a2f22', [0, .75, -.66]);
    B.tri([h, W, h], [h, W, -h], [h, W + R, 0], wood, [1, 0, 0]); B.tri([-h, W, -h], [-h, W, h], [-h, W + R, 0], wood, [-1, 0, 0]);
    B.box(-.13, 0, h, .13, hy(40), h + .012, '#4a2f22');
    B.box(h, hy(24), -.17, h + .012, hy(46), .17, '#ffd56b');
    B.box(-.32, W + R * .3, -.3, -.16, W + R + hy(12), -.14, '#7d7769', { hull: O * .6 });
    B.pop(); };


  /* --- Benny: built from the 2D drawing (same shapes, colours and face), true proportions, ~2/3 of the 2D size so he fits the houses.
         Head (turns to look at you), right arm (waves) and eyes (blink) are separate parts. Local +z = where he looks. --- */
  M.benny = () => {
    const K = .00185, P = v => v * K, TOON = W3D.TOON;
    const PANTS = '#3e3e52', HOOD = '#4b6fa5', HOOD_D = '#3f5f8f', SKIN = '#e8b896', SHOE = '#24242c', h = O * .9;
    const root = new T3.Group(), RUG = hy(2.3);
    // rug (stays in world scale, like the 2D rug)
    const R = GB(); R.box(-.27, 0, -.2, .27, hy(2), .26, '#a77b4f', { edges: true }); R.box(-.24, hy(2), -.17, .24, RUG, .23, '#b98b5c'); for (const zz of [-.1, .02, .14]) R.box(-.24, RUG, zz, .24, RUG + .002, zz + .025, '#7a5636');
    root.add(R.mesh());
    const body = new T3.Group(); body.position.set(0, RUG, -.03); root.add(body);
    const B = GB();
    // legs: knees up, shins straight down, feet in front (exactly like the sitting pose in 2D)
    for (const sd of [-1, 1]) { const L = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t), hip = [sd * P(24), P(24), P(0)], knee = [sd * P(30), P(62), P(58)], ank = [sd * P(33), P(16), P(68)];
      // a round knee: the leg follows a curve around the knee point (no sharp corner, so nothing folds over)
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), d = P(30), p0 = L(knee, hip, d / dist(knee, hip)), p2 = L(knee, ank, d / dist(knee, ank)), Q = t => [0, 1, 2].map(i => (1 - t) * (1 - t) * p0[i] + 2 * (1 - t) * t * knee[i] + t * t * p2[i]);
      const path = [hip, L(hip, p0, .5), p0, Q(.2), Q(.4), Q(.6), Q(.8), p2, ank], bend = Q(.5);
      const hk = h * .75; B.tubePath(path, [P(16), P(16.5), P(17), P(17), P(17), P(17), P(16.5), P(16), P(15.5)], PANTS, { hull: [0, 0, hk * .6, hk, hk, hk, hk, hk, hk], n: 16 });
      B.sphere(bend[0], bend[1] + P(1), bend[2] + P(1), P(17.6), shade(PANTS, 1.18), { detail: 2, s: [1, .78, 1] });
      B.sphere(sd * P(36), P(10), P(82), P(24), SHOE, { detail: 2, s: [1, .5, 1.25], hull: h }); }
    // hoodie: a rounded box like the 2D rrect, pocket, patch, strings, collar
    B.sphere(0, P(68), P(-4), 1, HOOD, { s: [P(58), P(64), P(40)], detail: 3, e: .5, hull: h });
    B.sphere(0, P(41), P(33), 1, HOOD_D, { s: [P(34), P(17), P(4)], detail: 2, e: .35 });
    B.push(P(30), P(96), P(33)).box(-P(10), -P(10), 0, P(10), P(10), P(3), '#9a7b56', { edges: true }).pop();
    for (const sd of [-1, 1]) B.tube([sd * P(13), P(124), P(26)], [sd * P(15), P(84), P(36)], P(2.1), '#e6e6ee', { n: 5 });
    B.sphere(0, P(125), P(-10), 1, HOOD_D, { s: [P(56), P(11), P(36)], detail: 2, hull: h * .7 });
    // left arm resting on the knee
    { const sh = [-P(50), P(106), P(0)], ha = [-P(32), P(78), P(60)], mid = sh.map((x, i) => x + (ha[i] - x) * .5); B.tubePath([sh, mid, ha], P(11.5), HOOD, { hull: [0, h * .7, h * .7], n: 14 }); B.sphere(ha[0], ha[1], ha[2], P(15), SKIN, { detail: 2, hull: h }); }
    body.add(B.mesh(TOON));
    // right arm: its own part, turned around the shoulder to wave
    const SH = [P(50), P(106), P(0)], HA = [P(32), P(78), P(60)], rest = [HA[0] - SH[0], HA[1] - SH[1], HA[2] - SH[2]];
    const A = GB(); A.tubePath([[0, 0, 0], rest.map(x => x * .5), rest], P(11.5), HOOD, { hull: [0, h * .7, h * .7], n: 14 }); A.sphere(rest[0], rest[1], rest[2], P(15), SKIN, { detail: 2, hull: h });
    const arm = A.mesh(TOON); arm.position.set(...SH); body.add(arm);
    const restDir = new T3.Vector3(...rest).normalize(), waveDir = new T3.Vector3(74, 70, 26).normalize();
    // head: pivot at the neck, head centre 60 above it
    const head = new T3.Group(); head.position.set(0, P(128), P(-4)); body.add(head);
    const H = GB(), F = GB(), E = GB(), HC = P(68), HR = P(68);
    H.sphere(0, HC, 0, HR, SKIN, { detail: 3, hull: h });
    for (const sd of [-1, 1]) H.sphere(sd * P(64), HC - P(10), P(-4), P(15), shade(SKIN, .93), { detail: 2, s: [.55, 1, 1], hull: h * .8 });
    H.sphere(0, HC - P(37), HR * .93, P(8), shade(SKIN, .97), { detail: 2, s: [1, .8, .7] });                                  // nose
    // beanie: ribbed dome, folded band, pompom
    H.dome(0, HC + P(8), 0, P(72), 1, '#c23a2d', '#b0322a', { nl: 18, nt: 7, hull: h });
    H.cyl(0, 0, P(76), HC + P(2), HC + P(30), 28, '#a3302a', { hull: h, top: 'none', bottom: false });
    { const rIn = Math.sqrt(P(72) ** 2 - P(22) ** 2); for (let k = 0; k < 28; k++) { const a0 = k / 28 * 6.2832, a1 = (k + 1) / 28 * 6.2832; H.quad([Math.cos(a0) * rIn, HC + P(30), Math.sin(a0) * rIn], [Math.cos(a1) * rIn, HC + P(30), Math.sin(a1) * rIn], [Math.cos(a1) * P(76), HC + P(30), Math.sin(a1) * P(76)], [Math.cos(a0) * P(76), HC + P(30), Math.sin(a0) * P(76)], '#962a24', [0, 1, 0]); } }
    H.sphere(P(6), HC + P(86), 0, P(18), '#efece4', { detail: 2, hull: h });
    // face: painted onto the head like the 2D face (decals that follow the round head)
    const T = new T3.Vector3(), onFace = (dx, dy, lift) => { const zz = Math.sqrt(Math.max(1e-6, HR * HR - dx * dx - dy * dy)); T.set(dx, dy, zz).normalize(); return [dx + T.x * lift, HC + dy + T.y * lift, zz + T.z * lift]; };
    const frame = (dx, dy) => { const n = new T3.Vector3(dx, dy, Math.sqrt(Math.max(1e-6, HR * HR - dx * dx - dy * dy))).normalize(), U = new T3.Vector3(n.z, 0, -n.x).normalize(), V = new T3.Vector3().crossVectors(n, U).normalize(); return { n, U, V }; };
    const ell = (G, dx, dy, rx, ry, lift, c) => { const { n, U, V } = frame(dx, dy), o = onFace(dx, dy, lift), Pt = a => [o[0] + U.x * Math.cos(a) * rx + V.x * Math.sin(a) * ry, o[1] + U.y * Math.cos(a) * rx + V.y * Math.sin(a) * ry, o[2] + U.z * Math.cos(a) * rx + V.z * Math.sin(a) * ry];
      for (let k = 0; k < 24; k++) G.tri(o, Pt(k / 24 * 6.2832), Pt((k + 1) / 24 * 6.2832), c, [n.x, n.y, n.z]); };
    const stroke = (G, pts, w, lift, c) => { for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], b = pts[k + 1], A3 = onFace(a[0], a[1], lift), B3 = onFace(b[0], b[1], lift), { n } = frame((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), d = new T3.Vector3(B3[0] - A3[0], B3[1] - A3[1], B3[2] - A3[2]).normalize(), q = new T3.Vector3().crossVectors(n, d).multiplyScalar(w / 2);
      G.quad([A3[0] - q.x, A3[1] - q.y, A3[2] - q.z], [B3[0] - q.x, B3[1] - q.y, B3[2] - q.z], [B3[0] + q.x, B3[1] + q.y, B3[2] + q.z], [A3[0] + q.x, A3[1] + q.y, A3[2] + q.z], c, [n.x, n.y, n.z]); }
      for (const p of [pts[0], pts[pts.length - 1]]) ell(G, p[0], p[1], w / 2, w / 2, lift, c); };
    const arc = (cx, cy, r, a0, a1, n) => { const out = []; for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; out.push([cx + Math.cos(a) * r, cy - Math.sin(a) * r]); } return out; };
    const sr = seeded(77); for (let k = 0; k < 24; k++) ell(F, P(-32 + sr() * 64), -P(44 + sr() * 20), P(2.4), P(2.4), .003, '#bf9173');   // stubble
    ell(F, P(38), -P(36), P(11), P(6), .003, '#cc9b7b');                                                                                   // cheek
    stroke(F, arc(0, -P(34), P(7), 0, Math.PI, 8), P(3.5), .004, '#c98d6b');                                                               // nose line
    for (const sd of [-1, 1]) { stroke(F, arc(sd * P(24), -P(33), P(10), .15 * Math.PI, .85 * Math.PI, 8), P(2.6), .0035, '#b98a6c');      // tired eye bags
      stroke(F, [[sd * P(40), -P(6)], [sd * P(26), -P(3.5)], [sd * P(13), -P(2)]], P(6), .004, '#5a3a2c'); }                               // brows
    const MH = GB(); stroke(MH, arc(0, -P(42), P(12), .15 * Math.PI, .85 * Math.PI, 10), P(4.5), .004, '#7a3b35');
    // eyes: outline, white, pupil, highlight
    for (const sd of [-1, 1]) { const ex = sd * P(24), ey = -P(18); ell(E, ex, ey, P(12.5) + P(2.2), P(15) + P(2.2), .0045, '#1b1728'); ell(E, ex, ey, P(12.5), P(15), .0055, '#fbfbf8'); ell(E, ex, ey - P(3), P(6.8), P(6.8), .0065, '#2b2222'); ell(E, ex - P(2.2), ey - P(3) + P(2.4), P(2.3), P(2.3), .0072, '#ffffff'); }
    const headMesh = H.mesh(TOON), faceMesh = F.mesh(W3D.FLAT), eyes = E.mesh(W3D.FLAT); head.add(headMesh, faceMesh, eyes);
    eyes.position.y = HC - P(18); eyes.children.forEach(m => m.position.y = -(HC - P(18)));
    // waving mouth: a wide open smile, shown while he waves
    const W = GB(); { const sm = []; for (let k = 0; k <= 12; k++) { const a = Math.PI * k / 12; sm.push([-P(20) + P(40) * k / 12, -P(46) - Math.sin(a) * P(16)]); } for (let k = 0; k < sm.length - 1; k++) { const a = onFace(sm[k][0], sm[k][1], .0045), b = onFace(sm[k + 1][0], sm[k + 1][1], .0045), c0 = onFace(sm[k][0], -P(46), .0045), c1 = onFace(sm[k + 1][0], -P(46), .0045); W.quad(c0, c1, b, a, '#7a2b2b', [0, 0, 1]); } ell(W, 0, -P(56), P(8), P(4), .005, '#e46b6b'); }
    const happy = W.mesh(W3D.FLAT); happy.visible = false; head.add(happy);
    const hope = MH.mesh(W3D.FLAT); head.add(hope);
    root.userData = { head, eyes, arm, restDir, waveDir, happy, hope, body, look: 0, wave: 0, HC, base: P(128) };
    return root; };
  // animate Benny: blink, breathe, turn the head to the walker, wave when the walker comes close
  M.bennyTick = (bn, t, dt, camPos) => {
    const u = bn.userData, wp = new T3.Vector3(); bn.getWorldPosition(wp);
    const dx = camPos.x - wp.x, dz = camPos.z - wp.z, dist = Math.hypot(dx, dz);
    const want = dist < 7 ? clamp(Math.atan2(dx, dz) - bn.rotation.y, -1.15, 1.15) : 0;
    let dA = ((want - u.look + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; u.look += dA * Math.min(1, dt * 4); u.head.rotation.y = u.look;
    u.head.rotation.x = dist < 7 ? clamp(-Math.atan2(camPos.y - (wp.y + u.base + u.HC), Math.max(.4, dist)) * .6, -.35, .3) : 0;
    u.eyes.scale.y = (t % 3.7) < .13 ? .1 : 1;
    u.body.scale.y = 1 + Math.sin(t * 2.1) * .008;
    const wv = dist < 1.7 ? 1 : 0; u.wave += (wv - u.wave) * Math.min(1, dt * 5); u.happy.visible = u.wave > .5; u.hope.visible = !u.happy.visible;
    const q = new T3.Quaternion().setFromUnitVectors(u.restDir, u.waveDir), wig = new T3.Quaternion().setFromAxisAngle(new T3.Vector3(0, 0, 1), Math.sin(t * 11) * .3 * u.wave);
    u.arm.quaternion.copy(new T3.Quaternion().slerp(q, u.wave)).premultiply(wig);
    return { dist, waving: u.wave > .5 };
  };

  /* --- the campervan (class-C motorhome), local +x = front --- */
  M.van = () => {
    const B = GB(), L = .6, Wd = .27, H = hy(44), lift = hy(5), uc = L * .44, ua = L * .84, cv = Wd - .025;
    const TOPC = '#fbf9f3', WALL = '#ece7dc', GL = '#2b3550', GH = '#6b7aa6', SK = '#a3a1aa', NAVY = '#2c3a78', GRN = '#3d8a55';
    B.box(-L, lift, -Wd, uc, H, Wd, WALL, { top: TOPC, bottom: '#8d8a84', edges: true, hull: O });
    B.box(uc, lift, -cv, L, H * .52, cv, '#f4f1e8', { top: '#f4f1e8', bottom: '#8d8a84', edges: true, hull: O });
    B.box(uc, H * .58, -Wd, ua, H, Wd, WALL, { top: TOPC, bottom: '#d9d3c6', edges: true, hull: O });
    B.box(uc - .001, H * .52, -Wd + .02, uc + .06, H * .58, Wd - .02, '#d9d3c6');
    for (const sd of [-1, 1]) {
      const zf = sd * (Wd + .002), zc = sd * (cv + .002), side = (z, a0, a1, y0, y1, c) => B.quad([a0, y0, z], [a1, y0, z], [a1, y1, z], [a0, y1, z], c, [0, 0, sd]);
      side(zf, -L, uc, lift, lift + hy(5), SK); side(zc, uc, L, lift, lift + hy(5), SK);
      const sw = (y0, amp, c, w, a0, a1) => { for (let k = 0; k < 16; k++) { const t0 = k / 16, t1 = (k + 1) / 16, u0 = lerp(a0, a1, t0), u1 = lerp(a0, a1, t1), y = t => y0 + amp * Math.sin(Math.PI * t), z = (u) => sd * ((u > uc ? cv : Wd) + .003); B.quad([u0, y(t0) - w / 2, z(u0)], [u1, y(t1) - w / 2, z(u1)], [u1, y(t1) + w / 2, z(u1)], [u0, y(t0) + w / 2, z(u0)], c, [0, 0, sd]); } };
      sw(H * .3, H * .1, NAVY, hy(4.6), -L + .05, uc + .06); sw(H * .42, H * .09, GRN, hy(3.2), -L + .12, uc + .1); sw(H * .8, H * .05, GRN, hy(2.4), uc + .03, ua - .03);
      for (const [f0, f1] of [[.07, .3], [.52, .7]]) { const a0 = lerp(-L, uc, f0), a1 = lerp(-L, uc, f1), z = sd * (Wd + .004);
        side(z, a0, a1, H * .52, H * .8, '#f2efe8'); side(sd * (Wd + .005), a0 + .02, a1 - .02, H * .56, H * .76, GL); side(sd * (Wd + .006), a1 - .1, a1 - .02, H * .54, H * .76, '#b9785c'); side(sd * (Wd + .006), a0 + .04, a0 + .08, H * .55, H * .75, GH); }
      if (sd > 0) { const a0 = lerp(-L, uc, .78), a1 = lerp(-L, uc, .93); side(Wd + .004, a0, a1, lift + .01, H * .86, '#e2dccf'); side(Wd + .005, a0 + .02, a1 - .02, H * .58, H * .78, GL); B.sphere(a1 - .025, H * .42, Wd + .008, .008, '#555a6e', { detail: 0 }); }
      side(sd * (Wd + .004), uc + .04, uc + .15, H * .68, H * .9, GL);
      side(sd * (cv + .004), uc + .05, L - .1, H * .3, H * .5, GL); side(sd * (cv + .005), uc + .07, uc + .11, H * .32, H * .48, GH);
      // rust
      B.sphere(lerp(-L, uc, .22), hy(8), sd * (Wd + .001), .02, '#a0522d', { detail: 0, s: [1, .6, .2] });
      // wheels with dark arches
      for (const uu of [-L + .16, L - .12]) { const zz = sd * ((uu > uc ? cv : Wd) - .03);
        B.sphere(uu, lift + .01, sd * ((uu > uc ? cv : Wd) + .002), .095, '#3d3a46', { s: [1, .75, .1], detail: 1 });
        B.push(uu, .083, zz, 0); for (let k = 0; k < 14; k++) { const a = k / 14 * 6.2832, b = (k + 1) / 14 * 6.2832, P = (r, an, z) => [Math.cos(an) * r, Math.sin(an) * r, z]; B.quad(P(.083, a, -.035), P(.083, b, -.035), P(.083, b, .035), P(.083, a, .035), '#1f2233', [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0]); B.tri([0, 0, sd * .036], P(.083, a, sd * .036), P(.083, b, sd * .036), '#1f2233', [0, 0, sd]); B.tri([0, 0, sd * .038], P(.035, a, sd * .038), P(.035, b, sd * .038), '#b9bdcc', [0, 0, sd]); } B.pop(); }
    }
    // front: windscreen, bumper, grille, lights, plate
    const fr = (z0, z1, y0, y1, c, d) => B.quad([L + (d || .002), y0, z0], [L + (d || .002), y0, z1], [L + (d || .002), y1, z1], [L + (d || .002), y1, z0], c, [1, 0, 0]);
    fr(-cv + .04, cv - .02, H * .29, H * .5, GL); fr(-cv + .025, cv, lift, lift + hy(5), '#34303d', .006); fr(-.08, .08, H * .15, H * .25, '#2e2c36', .004);
    for (const zz of [cv - .06, -cv + .06]) fr(zz - .035, zz + .035, H * .16, H * .25, '#fff2c4', .005); fr(-.05, .05, lift + .01, lift + hy(4), '#f4f4ee', .008);
    // back: window, lights, ladder, spare wheel
    const bk = (z0, z1, y0, y1, c, d) => B.quad([-L - (d || .002), y0, z0], [-L - (d || .002), y0, z1], [-L - (d || .002), y1, z1], [-L - (d || .002), y1, z0], c, [-1, 0, 0]);
    bk(-.12, .12, H * .55, H * .78, GL); for (const zz of [-Wd + .03, Wd - .07]) bk(zz, zz + .04, H * .2, H * .32, '#e2483a', .004);
    for (const zz of [Wd - .16, Wd - .1]) B.box(-L - .02, H * .15, zz - .006, -L - .008, H * 1.04, zz + .006, '#8d8a84');
    for (let k = 0; k < 5; k++) B.box(-L - .02, H * (.25 + k * .17), Wd - .16, -L - .008, H * (.25 + k * .17) + .008, Wd - .1, '#8d8a84');
    // roof: skylight, vent
    B.box(-L + .2, H, -.1, -L + .38, H + hy(3), .1, '#b6bccc', { edges: true }); B.cyl(-L + .62, 0, .045, H, H + hy(3), 10, '#d6d2c8', { edges: 'top' });
    return B.mesh(); };

  /* --- Benny's tent (ridge tent, front door towards +z) --- */
  M.tent = (B, x, z, ry) => { B.push(x, 0, z, ry);
    const w = .34, l = .36, h = .72, hb = .6;
    const A = [-w, 0, l], Bf = [w, 0, l], Cf = [0, h, l + .03], Ab = [-w, 0, -l], Bb = [w, 0, -l], Cb = [0, hb, -l - .02];
    B.quad(A, Cf, Cb, Ab, '#ff8a3d', [-1, .6, 0]); B.quad(Bf, Cf, Cb, Bb, '#d9692a', [1, .6, 0]);
    B.tri(A, Bf, Cf, '#ff9a52', [0, 0, 1]); B.tri(Ab, Bb, Cb, '#c75f1d', [0, 0, -1]);
    B.tri([-.12, 0, l + .004], [.1, 0, l + .004], [-.01, h * .62, l + .015], '#3a2416', [0, 0, 1]);
    B.hquad([-w - O, -O, l + O], [-O * 0, h + O, l + .03 + O], [0, hb + O, -l - .02 - O], [-w - O, -O, -l - O], [-1, .6, 0]); B.hquad([w + O, -O, l + O], [0, h + O, l + .03 + O], [0, hb + O, -l - .02 - O], [w + O, -O, -l - O], [1, .6, 0]);
    B.htri([-w - O, -O, l + O], [w + O, -O, l + O], [0, h + O, l + .03 + O], [0, 0, 1]); B.htri([-w - O, -O, -l - O], [w + O, -O, -l - O], [0, hb + O, -l - .02 - O], [0, 0, -1]);
    for (const p of [[-w - .1, l + .12], [w + .1, l + .12], [-w - .1, -l - .1], [w + .1, -l - .1]]) { B.tube([Math.sign(p[0]) * w * .45, h * .42, p[1] * .7], [p[0], .01, p[1]], .004, '#d8d0bf', { n: 4, caps: false }); B.box(p[0] - .012, 0, p[1] - .012, p[0] + .012, .035, p[1] + .012, '#6b4a2e'); }
    B.edge(Cf, Cb);
    B.pop(); };

  /* --- town hall (same blocks as the 2D drawing) --- */
  M.townHall = (B, TQS) => {
    const H = hy(62), Ht = hy(98), u0 = 1.2, u1 = 4.8, v0 = 14.6, v1 = 16.4;
    B.box(u0, 0, v0, u1, H, v1, '#d8cfb8', { top: '#e9e2d0', edges: true, hull: O });
    B.box(u0 - .03, H, v0 - .03, u1 + .03, H + hy(4), v1 + .03, '#cfc4ad', { top: '#e9e2d0', edges: true });                       // cornice
    B.box(u0 + .1, H + hy(4), v0 + .1, u1 - .1, H + hy(9), v0 + .14, '#d8cfb8'); B.box(u0 + .1, H + hy(4), v1 - .14, u1 - .1, H + hy(9), v1 - .1, '#d8cfb8');
    B.box(u0 + .1, H + hy(4), v0 + .1, u0 + .14, H + hy(9), v1 - .1, '#d8cfb8'); B.box(u1 - .14, H + hy(4), v0 + .1, u1 - .1, H + hy(9), v1 - .1, '#d8cfb8');
    // portico: columns, entablature with name, steps, door
    for (let k = 0; k < 6; k++) { const u = lerp(u0 + .3, u1 - .3, k / 5); B.cyl(u, v1 + .09, .055, hy(3), hy(50), 10, '#f4efe4', { hull: O * .7 }); B.box(u - .07, hy(48), v1 + .02, u + .07, hy(52), v1 + .16, '#e9e2d0'); }
    B.box(u0 + .15, hy(52), v1, u1 - .15, hy(60), v1 + .17, '#e9e2d0', { edges: true, hull: O * .8 });
    for (let k = 0; k < 3; k++) B.box(u0 + .1 - k * .04, 0, v1 + .17 + k * .06, u1 - .1 + k * .04, hy(3 - k), v1 + .23 + k * .06, '#b9b0a0', { edges: true });
    B.box(u0 + .1, 0, v1, u1 - .1, hy(3), v1 + .17, '#c4bba9');
    B.quad([2.82, hy(3), v1 + .002], [3.18, hy(3), v1 + .002], [3.18, hy(30), v1 + .002], [2.82, hy(30), v1 + .002], '#6b4a33', [0, 0, 1]);
    B.box(3.08, hy(14), v1, 3.12, hy(17), v1 + .015, '#e8c25a');
    TQS.hall.board(3, hy(56), v1 + .172, 2.2, hy(7.5), [0, 0, 1, 1], 0);
    // windows on every side
    const win = (a, b, c, d, out) => B.quad(a, b, c, d, '#ffd56b', out);
    for (const u of [1.55, 2.2, 3.8, 4.45]) { win([u - .14, hy(22), v1 + .002], [u + .14, hy(22), v1 + .002], [u + .14, hy(42), v1 + .002], [u - .14, hy(22) + hy(20), v1 + .002], [0, 0, 1]); win([u - .14, hy(22), v0 - .002], [u + .14, hy(22), v0 - .002], [u + .14, hy(42), v0 - .002], [u - .14, hy(42), v0 - .002], [0, 0, -1]); }
    for (const v of [15.0, 15.5, 16.0]) { win([u1 + .002, hy(22), v - .14], [u1 + .002, hy(22), v + .14], [u1 + .002, hy(42), v + .14], [u1 + .002, hy(42), v - .14], [1, 0, 0]); win([u0 - .002, hy(22), v - .14], [u0 - .002, hy(22), v + .14], [u0 - .002, hy(42), v + .14], [u0 - .002, hy(42), v - .14], [-1, 0, 0]); }
    // clock tower, blue roof, flag
    B.box(2.6, H, 15.1, 3.4, Ht, 15.9, '#d8cfb8', { top: '#e9e2d0', edges: true, hull: O });
    B.box(2.56, Ht, 15.06, 3.44, Ht + hy(3), 15.94, '#cfc4ad', { edges: true });
    const ap = [3, Ht + hy(3) + hy(24), 15.5], c4 = [[2.56, 15.06], [3.44, 15.06], [3.44, 15.94], [2.56, 15.94]];
    for (let k = 0; k < 4; k++) { const a = c4[k], b = c4[(k + 1) % 4]; B.tri([a[0], Ht + hy(3), a[1]], [b[0], Ht + hy(3), b[1]], ap, '#3c5a99', [(a[0] + b[0]) / 2 - 3, .4, (a[1] + b[1]) / 2 - 15.5]); B.edge([a[0], Ht + hy(3), a[1]], ap); }
    B.cone(3, 15.5, .47 * Math.SQRT2, 0, Ht + hy(3) - O, ap[1] + O * 1.6, 4, '#000', { a0: Math.PI / 4, hull: O, hullOnly: true });
    B.tube([3, ap[1], 15.5], [3, ap[1] + hy(24), 15.5], .008, '#555', { n: 5 }); B.tri([3, ap[1] + hy(24), 15.5], [3.15, ap[1] + hy(19), 15.4], [3, ap[1] + hy(14), 15.5], '#ff2e63');
    return { clocks: [[3, hy(80), 15.9 + .004, 0], [3.4 + .004, hy(80), 15.5, Math.PI / 2], [3, hy(80), 15.1 - .004, Math.PI], [2.6 - .004, hy(80), 15.5, -Math.PI / 2]], clockR: px(7.5) }; };

  /* --- market stall in front of the town hall (table + striped awning) --- */
  M.hallStall = (B, x, z, c) => { B.push(x, 0, z, 0);
    B.box(-.15, 0, -.1, .15, hy(12), .1, '#b07a46', { top: '#c48f5a', edges: true, hull: O * .7 });
    for (const sx of [-.135, .135]) B.box(sx - .01, hy(12), -.1, sx + .01, hy(32), -.08, '#6b4a2e');
    for (let k = 0; k < 4; k++) { const x0 = -.18 + k * .09; B.quad([x0, hy(36), -.11], [x0 + .09, hy(36), -.11], [x0 + .09, hy(28), .15], [x0, hy(28), .15], k % 2 ? '#fff4e0' : c, [0, 1, .3]); }
    B.hbox(-.18, hy(28), -.11, .18, hy(36), .15, O * .5);
    const gs = ['#e2483a', '#ffd23f', '#3ddc84', '#ff8a3d']; for (let k = 0; k < 4; k++) B.sphere(-.09 + k * .06, hy(12) + .022, .02, .022, gs[k], { detail: 0 });
    B.pop(); };

  /* --- playground swing (park) --- */
  M.swing = (B, x, z, ry) => { B.push(x, 0, z, ry);
    const W = px(15), Ht = hy(32);
    for (const sx of [-W, W]) { B.tube([sx, 0, -.09], [sx, Ht, 0], .011, '#e2483a', { n: 6, hull: O * .5 }); B.tube([sx, 0, .09], [sx, Ht, 0], .011, '#e2483a', { n: 6, hull: O * .5 }); }
    B.tube([-W - .02, Ht, 0], [W + .02, Ht, 0], .012, '#e2483a', { n: 6, hull: O * .5 });
    for (const sx of [-.05, .06]) { B.tube([sx - .02, Ht, 0], [sx - .02, hy(11), 0], .003, '#555', { n: 4, caps: false }); B.tube([sx + .02, Ht, 0], [sx + .02, hy(11), 0], .003, '#555', { n: 4, caps: false }); B.box(sx - .035, hy(10), -.02, sx + .035, hy(12), .02, '#ffd23f', { edges: true }); }
    B.pop(); };

  /* --- wheel with its axle along local x (side = +1 / -1 for the outer face) --- */
  M.wheel = (B, x, y, z, r, w, side) => { const n = 12; for (let k = 0; k < n; k++) { const a = k / n * 6.2832, b = (k + 1) / n * 6.2832, P = (rr, an, xx) => [x + xx, y + Math.sin(an) * rr, z + Math.cos(an) * rr], out = [0, Math.sin((a + b) / 2), Math.cos((a + b) / 2)];
    B.quad(P(r, a, -w / 2), P(r, b, -w / 2), P(r, b, w / 2), P(r, a, w / 2), '#1f2233', out); B.tri(P(0, 0, side * w / 2), P(r, a, side * w / 2), P(r, b, side * w / 2), '#1f2233', [side, 0, 0]); B.tri(P(0, 0, side * (w / 2 + .002)), P(r * .45, a, side * (w / 2 + .002)), P(r * .45, b, side * (w / 2 + .002)), '#b9bdcc', [side, 0, 0]); } };

  /* --- a parked / driving car (local +z = forward) --- */
  M.car = (B, c) => { const lu = .11, lv = .21, hb = hy(8);
    B.box(-lu, hy(2.5), -lv, lu, hy(2.5) + hb, lv, c, { top: c, edges: true, hull: O * .7 });
    B.box(-lu * .8, hy(2.5) + hb, -lv * .62, lu * .8, hy(2.5) + hb + hy(5.5), lv * .45, '#2b3350', { top: shade(c, 1.05), edges: true, hull: O * .7 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) M.wheel(B, sx * (lu - .012), .038, sz * (lv - .065), .038, .024, sx);
    for (const sx of [-1, 1]) { B.box(sx * .07 - .022, hy(5), lv, sx * .07 + .022, hy(8), lv + .006, '#fff2c4'); B.box(sx * .07 - .022, hy(5), -lv - .006, sx * .07 + .022, hy(8), -lv, '#e2483a'); }
    return B; };

  /* --- the marketplace (5k milestone): shops, umbrella stalls, clock tower, planters, benches, lamps, bunting, parked cars --- */
  M.shop = (B, u, v, sh, face, TQS, si) => {
    const W = 1.25, D = 1.1, H = hy(40);
    const PL = face === 'v' ? [u, 0, v, 0] : [u, 0, v + W, Math.PI / 2]; B.push(...PL); TQS.shops.push(...PL);
    B.box(0, 0, 0, W, H, D, sh[2], { top: shade(sh[3], .9), edges: true, hull: O });
    B.box(-.02, H, -.02, W + .02, H + hy(3), D + .02, shade(sh[3], .8), { top: shade(sh[3], .95), edges: true });
    // striped awning over the front
    for (let k = 0; k < 6; k++) { const x0 = k / 6 * W, x1 = (k + 1) / 6 * W, c = k % 2 ? '#fff4e0' : sh[3];
      B.quad([x0, hy(27), D], [x1, hy(27), D], [x1, hy(19), D + .24], [x0, hy(19), D + .24], c, [0, 1, .6]);
      B.quad([x0, hy(19), D + .24], [x1, hy(19), D + .24], [x1, hy(16), D + .24], [x0, hy(16), D + .24], c, [0, 0, 1]); }
    B.hquad([-O, hy(27) + O, D], [W + O, hy(27) + O, D], [W + O, hy(19) + O, D + .24 + O], [-O, hy(19) + O, D + .24 + O], [0, 1, .6]);
    B.edge([0, hy(19), D + .24], [W, hy(19), D + .24]); B.edge([0, hy(16), D + .24], [W, hy(16), D + .24]);
    // door + shop window with goods
    B.quad([W * .3 - .05, 0, D + .003], [W * .3 + .05, 0, D + .003], [W * .3 + .05, hy(17), D + .003], [W * .3 - .05, hy(17), D + .003], '#6b4a33', [0, 0, 1]);
    B.quad([W * .72 - .16, hy(5), D + .002], [W * .72 + .16, hy(5), D + .002], [W * .72 + .16, hy(15), D + .002], [W * .72 - .16, hy(15), D + .002], '#7a5a3a', [0, 0, 1]);
    B.quad([W * .72 - .14, hy(6), D + .004], [W * .72 + .14, hy(6), D + .004], [W * .72 + .14, hy(14), D + .004], [W * .72 - .14, hy(14), D + .004], '#ffd56b', [0, 0, 1]);
    B.quad([.15, hy(18), -.002], [.45, hy(18), -.002], [.45, hy(30), -.002], [.15, hy(30), -.002], '#3d4566', [0, 0, -1]);
    // sign board on the roof: emoji + shop name, both sides
    B.box(.18, H + hy(3), D - .1, .22, H + hy(10), D - .07, '#6b4a2e'); B.box(W - .22, H + hy(3), D - .1, W - .18, H + hy(10), D - .07, '#6b4a2e');
    B.box(.08, H + hy(9), D - .1, W - .08, H + hy(27), D - .085, '#fbf3df', { edges: true, hull: O * .7 });
    const uv = [0, (si + 1) / 9, 1, si / 9];
    TQS.shops.board(W / 2, H + hy(18), D - .083, W - .2, hy(16), uv, 0);
    TQS.shops.board(W / 2, H + hy(18), D - .102, W - .2, hy(16), uv, Math.PI);
    TQS.shops.pop(); B.pop(); };
  M.umbrellaStall = (B, x, z, c, k) => { B.push(x, 0, z, 0);
    const goods = ['#e2483a', '#ffd23f', '#3ddc84', '#ff8a3d', '#c77dff'];
    B.box(-.125, hy(4), -.125, .125, hy(10), .125, '#a06b3e', { top: '#c9925c', edges: true, hull: O * .7 });
    for (const sx of [-.11, .11]) for (const sz of [-.11, .11]) B.box(sx - .012, 0, sz - .012, sx + .012, hy(4), sz + .012, '#6b4a2e');
    for (let q = 0; q < 6; q++) B.sphere(-.07 + (q % 3) * .07, hy(10) + .026, -.05 + Math.floor(q / 3) * .1, .026, goods[(q + k) % 5], { detail: 1 });
    B.tube([0, hy(10), 0], [0, hy(50), 0], .011, '#5b4630', { n: 6, caps: false });
    B.cone(0, 0, px(26), 0, hy(36), hy(50), 8, [c, '#fff4e0'], { under: shade(c, .7), underY: hy(10), hull: O * .7 });
    B.pop(); };
  M.planter = (B, x, z) => { B.push(x, 0, z, 0); B.box(-.11, 0, -.11, .11, hy(8), .11, '#857b66', { top: '#5b4630', edges: true, hull: O * .6 }); B.box(-.12, hy(7), -.12, .12, hy(9), .12, '#9a8f78', { top: '#5b4630' }); B.pop(); };
  M.marketTower = (B, u, v) => { const s = .45, H = hy(150);
    B.box(u - s - .08, 0, v - s - .08, u + s + .08, hy(14), v + s + .08, '#b7ab92', { top: '#cfc4ad', edges: true, hull: O });
    B.box(u - s, hy(14), v - s, u + s, H, v + s, '#d8cfb8', { top: '#e9e2d0', edges: true, hull: O });
    B.box(u - s - .03, H - hy(6), v - s - .03, u + s + .03, H, v + s + .03, '#cfc4ad', { edges: true });
    const R = s + .1, ap = [u, H + hy(50), v], cs = [[u - R, v - R], [u + R, v - R], [u + R, v + R], [u - R, v + R]];
    for (let k = 0; k < 4; k++) { const a = cs[k], b = cs[(k + 1) % 4]; B.tri([a[0], H, a[1]], [b[0], H, b[1]], ap, '#c23a2d', [(a[0] + b[0]) / 2 - u, .4, (a[1] + b[1]) / 2 - v]); B.tri([a[0], H, a[1]], [b[0], H, b[1]], [u, H, v], '#7a2018', [0, -1, 0]); B.edge([a[0], H, a[1]], ap); B.edge([a[0], H, a[1]], [b[0], H, b[1]]); }
    B.cone(u, v, R * Math.SQRT2, 0, H - O, ap[1] + O * 1.5, 4, '#000', { a0: Math.PI / 4, hull: O, hullOnly: true });
    B.tube([u, ap[1], v], [u, ap[1] + hy(22), v], .009, '#555', { n: 5 }); B.tri([u, ap[1] + hy(22), v], [u + .14, ap[1] + hy(17), v + .14], [u, ap[1] + hy(12), v], '#ffd23f');
    // arched doors on all four sides
    for (const [nx, nz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { B.push(u + nx * (s + .003), hy(14), v + nz * (s + .003), Math.atan2(nx, nz)); const P = [[-.06, 0], [.06, 0], [.06, hy(18)]]; for (let k = 0; k <= 6; k++) { const a = k / 6 * Math.PI; P.push([Math.cos(a) * .06, hy(18) + Math.sin(a) * .05]); } P.push([-.06, hy(18)]);
      for (let k = 1; k + 1 < P.length; k++) B.tri([P[0][0], P[0][1], 0], [P[k][0], P[k][1], 0], [P[k + 1][0], P[k + 1][1], 0], '#6b4a33', [0, 0, 1]); B.pop(); }
    return { clocks: [[u, H - hy(26), v + s + .004, 0], [u + s + .004, H - hy(26), v, Math.PI / 2], [u, H - hy(26), v - s - .004, Math.PI], [u - s - .004, H - hy(26), v, -Math.PI / 2]], clockR: px(11) }; };

  /* --- "FOR RENT" sign post on the next free lots --- */
  M.signPost = (B, x, z, ry, TQS) => { B.push(x, 0, z, ry); B.tube([0, 0, 0], [0, hy(34), 0], .014, '#5b4630', { n: 6, caps: false }); B.box(-.33, hy(30), -.012, .33, hy(56), .012, '#f4efe4', { edges: true, hull: O * .7 }); B.pop();
    const c = Math.cos(ry), s = Math.sin(ry); TQS.rent.board(x + s * .013, hy(43), z + c * .013, .62, hy(23), [0, 0, 1, 1], ry); TQS.rent.board(x - s * .013, hy(43), z - c * .013, .62, hy(23), [0, 0, 1, 1], ry + Math.PI); };

  /* --- boat on the river --- */
  M.boat = (c) => { const B = GB();
    const hull = [[-.3, .07], [.3, .07], [.38, 0], [.3, -.07], [-.3, -.07]], hb = [[-.26, .05], [.26, .05], [.32, 0], [.26, -.05], [-.26, -.05]];
    for (let k = 0; k < 5; k++) { const a = hull[k], b = hull[(k + 1) % 5], a2 = hb[k], b2 = hb[(k + 1) % 5]; B.quad([a2[0], -.02, a2[1]], [b2[0], -.02, b2[1]], [b[0], hy(9), b[1]], [a[0], hy(9), a[1]], '#8a5a34', [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]); }
    for (let k = 1; k < 4; k++) B.tri([hull[0][0], hy(7), hull[0][1]], [hull[k][0], hy(7), hull[k][1]], [hull[k + 1][0], hy(7), hull[k + 1][1]], '#b07a46', [0, 1, 0]);
    B.prism(hull.map(p => [p[0], p[1]]), hy(7), hy(9), '#6b4a2e', { top: 'none', hull: O * .6 });
    B.tube([0, hy(7), 0], [0, hy(48), 0], .01, '#5b4630', { n: 5 });
    B.tri([.012, hy(46), 0], [.24, hy(12), 0], [.012, hy(12), 0], '#f4efe4', [0, 0, 1]); B.tri([-.012, hy(42), 0], [-.17, hy(12), 0], [-.012, hy(12), 0], c, [0, 0, 1]);
    B.edge([.012, hy(46), 0], [.24, hy(12), 0]); B.edge([-.012, hy(42), 0], [-.17, hy(12), 0]);
    return B.mesh(); };

  return M;
}
