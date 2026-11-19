/* ================= BENNY'S TOWN 3D — the whole world, assembled + cameras, walking, site UI ================= */
function build3D() {
  const keep = { x: cam.x, y: cam.y, z: cam.z }; initCore3D();
  const { T3, renderer, scene, PPU, HU, PX, GB, TQ, texCanvas, FLAT, SHADE, HULL, FLAT_PO, SHADE_PO, LINES, white, col, YAX } = W3D;
  const MD = W3DModels(), W = W3, T1 = W.T1, T2 = W.T2, hy = n => n * HU, px = n => n * PX, v3 = (x, y, z) => new T3.Vector3(x, y, z);
  const O = .011, OUTC = '#1b1728';
  renderer.domElement.style.zIndex = 1;
  scene.background = col('#5d9e57');
  const sst = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const anim = [];                                         // per-frame updaters
  const colliders = [];                                    // for walking: circles [x, z, r] and boxes [x0, z0, x1, z1]
  const circ = (x, z, r) => colliders.push({ c: [x, z, r] }), rect = (x0, z0, x1, z1) => colliders.push({ b: [Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)] });

  /* ======================= 1. ground: meadow, river, towns, alleys, streets ======================= */
  function ribbon(B, pts, w, y, cl) {
    for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], b = pts[k + 1], du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv); if (l < 1e-6) continue; const nu = -dv / l * w / 2, nv = du / l * w / 2;
      B.quad([a[0] + nu, y, a[1] + nv], [b[0] + nu, y, b[1] + nv], [b[0] - nu, y, b[1] - nv], [a[0] - nu, y, a[1] - nv], cl);
      if (k > 0) { const p0 = pts[k - 1], d0 = Math.atan2(a[1] - p0[1], a[0] - p0[0]), d1 = Math.atan2(dv, du); let tu = Math.abs(d1 - d0); if (tu > Math.PI) tu = 2 * Math.PI - tu; if (tu > .1) B.disc(a[0], y, a[1], w / 2, 10, cl); } }
    B.disc(pts[0][0], y, pts[0][1], w / 2, 12, cl); B.disc(pts[pts.length - 1][0], y, pts[pts.length - 1][1], w / 2, 12, cl);
  }
  const fan = (B, c, P, y, cl) => { for (let k = 0; k < P.length; k++) { const a = P[k], b = P[(k + 1) % P.length]; B.tri([c[0], y, c[1]], [a[0], y, a[1]], [b[0], y, b[1]], cl); } };
  const townPoly = (T, m) => { const P = []; for (let s = 0; s < 240; s++) { const a = s / 240 * 6.2832, r = T.outerR(a) + m; P.push([T.C[0] + Math.cos(a) * r, T.C[1] + Math.sin(a) * r]); } return P; };
  { const B = GB(), MID = W.MID;
    B.quad([MID[0] - 900, 0, MID[1] - 900], [MID[0] + 900, 0, MID[1] - 900], [MID[0] + 900, 0, MID[1] + 900], [MID[0] - 900, 0, MID[1] + 900], '#5d9e57');
    const r = seeded(7); for (let k = 0; k < 260; k++) { const u = MID[0] - 190 + r() * 380, v = MID[1] - 190 + r() * 380, R = (30 + r() * 90) * 6 / 128; const cl = r() < .5 ? '#58965a' : '#61a35c'; const P = []; for (let q = 0; q < 18; q++) { const a = q / 18 * 6.2832; P.push([u + Math.cos(a) * R, v + Math.sin(a) * R * .9]); } fan(B, [u, v], P, .002, cl); }
    ribbon(B, W.RIVER, 16.4, .004, '#cdbd90'); ribbon(B, W.RIVER, 13.6, .008, '#2f7dbf'); ribbon(B, W.RIVER, 9.2, .012, '#3a8fd0');
    for (const T of [T1, T2]) { const st = W.STYLE.get(T); fan(B, T.C, townPoly(T, 3.6), .014, '#4b8848'); fan(B, T.C, townPoly(T, 0), .018, st.ground);
      for (const P of T.alleys) { ribbon(B, P, .46, .021, '#b9a87d'); ribbon(B, P, .34, .023, '#dccc9f'); }
      const S2 = T.streets.filter(s => s.kind !== 'avenue').map(s => s.pts).concat(T.rings), A = T.streets.filter(s => s.kind === 'avenue').map(s => s.pts);
      for (const P of A) ribbon(B, P, 1.2, .025, st.curb); for (const P of S2) ribbon(B, P, .96, .025, st.curb);
      for (const P of A) ribbon(B, P, 1.05, .029, st.road); for (const P of S2) ribbon(B, P, .82, .029, st.road);
      if (st.dash) { for (const P of S2.concat(A)) { let acc = 0, on = true; for (let k = 0; k < P.length - 1; k++) { const a = P[k], b = P[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]); let t = 0; while (t < L - 1e-9) { const step = Math.min(.38 - acc, L - t); if (on) { const p0 = [a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L], p1 = [a[0] + (b[0] - a[0]) * (t + step) / L, a[1] + (b[1] - a[1]) * (t + step) / L], nu = -(b[1] - a[1]) / L * .033, nv = (b[0] - a[0]) / L * .033; B.quad([p0[0] + nu, .033, p0[1] + nv], [p1[0] + nu, .033, p1[1] + nv], [p1[0] - nu, .033, p1[1] - nv], [p0[0] - nu, .033, p0[1] - nv], '#d9b25a'); } acc += step; t += step; if (acc >= .38 - 1e-6) { acc = 0; on = !on; } } } } }
      else { for (const P of S2.concat(A)) for (let k = 0; k < P.length; k += 2) { const p = P[k]; B.disc(p[0] + .18, .032, p[1] - .12, .07, 5, '#c4ad90'); B.disc(p[0] - .2, .032, p[1] + .1, .06, 5, '#c4ad90'); } }
    }
    const g = B.mesh(FLAT, 0); scene.add(g);
  }

  /* ======================= 2. landmark grounds: painted with the site's own 2D code, seen from straight above ======================= */
  function capGround(u0, v0, u1, v1, P, draw) {
    cv.width = Math.round((u1 - u0) * P); cv.height = Math.round((v1 - v0) * P); cam.x = 0; cam.y = 0; cam.z = 1;
    ctx.setTransform(P / 128, -P / 128, P / 64, P / 64, -P / 128 * FX - P / 64 * FY - P * u0, P / 128 * FX - P / 64 * FY - P * v0); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    draw();
    const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; c.getContext('2d').drawImage(cv, 0, 0);
    const tex = new T3.CanvasTexture(c); tex.anisotropy = 8;
    const g = new T3.BufferGeometry(), y = .037;
    g.setAttribute('position', new T3.Float32BufferAttribute([u0, y, v0, u1, y, v0, u1, y, v1, u0, y, v0, u1, y, v1, u0, y, v1], 3));
    g.setAttribute('uv', new T3.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0], 2));
    const m = new T3.Mesh(g, new T3.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: T3.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })); m.renderOrder = 1; scene.add(m);
  }
  capGround(-.6, -.6, 6.6, 6.6, 80, () => {             // Benny's square without the (now 3D) fountain
    const c = SQUARE.u0, d = SQUARE.u1, z = 1;
    roundRectUV(SQUARE, 1.3, '#7f796b'); roundRectUV({ u0: c + .1, u1: d - .1, v0: c + .1, v1: d - .1 }, 1.2, '#a49d8c');
    { const [x, y] = uvS(3, 3); ellipse(ctx, x, y, 150, 75, null, 'rgba(255,255,255,.18)', 3); ellipse(ctx, x, y, 105, 52, null, 'rgba(255,255,255,.12)', 2); }
    ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = 1.2; ctx.save(); roundRectUV({ u0: c + .1, u1: d - .1, v0: c + .1, v1: d - .1 }, 1.2); ctx.clip(); ctx.beginPath();
    for (let t = 1; t < 5.6; t += .5) { let p = uvS(t, c), q = uvS(t, d); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); p = uvS(c, t); q = uvS(d, t); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); } ctx.stroke(); ctx.restore();
    for (const [u, v] of [[1.4, 1.4], [4.6, 1.4], [1.4, 4.6], [4.6, 4.6]]) { const [x, y] = uvS(u, v); ellipse(ctx, x, y, 34, 17, '#5aa868', '#3f8a4e', 1.5); }
  });
  capGround(PARK_C[0] - 7, PARK_C[1] - 7, PARK_C[0] + 7, PARK_C[1] + 7, 64, drawParkGround);
  for (const p of BPARKS) capGround(p.Z.u0 - .3, p.Z.v0 - .3, p.Z.u1 + .3, p.Z.v1 + .3, 64, drawBlockParks);
  capGround(HALL.u0 - .3, HALL.v0 - .3, HALL.u1 + .3, HALL.v1 + .3, 64, drawHallGround);
  capGround(-28.6, -24.6, -11.4, -11.4, 64, () => drawMarketGround(1));
  for (const Z of SITES) if (featP(Z.key) <= 0) capGround(Z.u0 - .3, Z.v0 - .3, Z.u1 + .3, Z.v1 + .3, 64, () => { roundRectUV(Z, 1.3, '#8a7f6a'); const r = seeded(Math.round(Z.u0 * 31 + Z.v0 * 7)); for (let k = 0; k < 7; k++) { const [x, y] = uvS(Z.u0 + 1 + r() * (Z.u1 - Z.u0 - 2), Z.v0 + 1 + r() * (Z.v1 - Z.v0 - 2)); ellipse(ctx, x, y, 16, 7, '#7a6f5b'); } });
  capGround(W.C2[0] - 7, W.C2[1] - 7, W.C2[0] + 7, W.C2[1] + 7, 64, () => W.drawTown2Square(true));

  /* ======================= 3. text boards (shop signs, town hall, FOR RENT, building sites, gate banners, clocks) ======================= */
  const TQS = {};
  { const shopsTex = texCanvas(512, 9 * 72, (g, w, h) => { MK_SHOPS.forEach((sh, k) => { const y = k * 72; g.fillStyle = '#fbf3df'; g.fillRect(0, y, w, 72); g.strokeStyle = sh[3]; g.lineWidth = 8; g.strokeRect(4, y + 4, w - 8, 64); g.font = '44px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText(sh[0], 18, y + 38); g.fillStyle = sh[3]; g.font = '800 40px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(sh[1], w / 2 + 30, y + 38); }); });
    shopsTex.flipY = false; TQS.shops = TQ(shopsTex);
    TQS.hall = TQ(texCanvas(512, 40, (g, w, h) => { g.fillStyle = '#e9e2d0'; g.fillRect(0, 0, w, h); g.fillStyle = '#3c5a99'; g.font = '800 30px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TOWN HALL', w / 2, h / 2 + 1); }));
    TQS.rent = TQ(texCanvas(256, 96, (g, w, h) => { g.fillStyle = '#f4efe4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c23a2d'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = '#c23a2d'; g.font = '800 42px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FOR RENT', w / 2, h / 2 + 2); }));
    TQS.site = TQ(texCanvas(512, 176, (g, w, h) => { g.fillStyle = '#f4efe4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c23a2d'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#c23a2d'; g.font = '800 58px Poppins, system-ui, sans-serif, "Noto Color Emoji"'; g.fillText('🚧 BUILDING', w / 2, 66); g.fillStyle = '#5b4630'; g.font = '800 40px Poppins, system-ui, sans-serif'; g.fillText('COMING SOON', w / 2, 128); }));
    const ban = c => texCanvas(128, 160, (g, w, h) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h); g.lineTo(w / 2, h * .78); g.lineTo(0, h); g.closePath(); g.fill(); g.strokeStyle = OUTC; g.lineWidth = 6; g.stroke(); g.fillStyle = '#ffd23f'; g.font = '900 78px Poppins, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('B', w / 2, h * .42); });
    TQS.banR = TQ(ban('#ff2e63')); TQS.banB = TQ(ban('#3a7bd5'));
    TQS.clock = TQ(texCanvas(128, 128, (g, w, h) => { g.fillStyle = '#fbf7ee'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = OUTC; g.lineWidth = 7; g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.2832; g.lineWidth = k % 3 ? 3 : 6; g.beginPath(); g.moveTo(64 + Math.cos(a) * 46, 64 + Math.sin(a) * 46); g.lineTo(64 + Math.cos(a) * 54, 64 + Math.sin(a) * 54); g.stroke(); } }));
  }
  const clocks = [];
  function addClocks(list, r) { for (const [x, y, z, ry] of list) { TQS.clock.board(x + Math.sin(ry) * .002, y, z + Math.cos(ry) * .002, r * 2, r * 2, [0, 0, 1, 1], ry); const g = new T3.Group(); g.position.set(x + Math.sin(ry) * .006, y, z + Math.cos(ry) * .006); g.rotation.y = ry; const hb = GB(); hb.quad([-r * .07, -r * .1, 0], [r * .07, -r * .1, 0], [r * .05, r * .55, 0], [-r * .05, r * .55, 0], OUTC); const mb = GB(); mb.quad([-r * .05, -r * .1, 0], [r * .05, -r * .1, 0], [r * .035, r * .8, 0], [-r * .035, r * .8, 0], OUTC); const hh = hb.mesh(FLAT), mm = mb.mesh(FLAT); g.add(hh, mm); scene.add(g); clocks.push({ hh, mm }); } }
  anim.push(() => { const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = (d.getHours() % 12) + m / 60; for (const c of clocks) { c.mm.rotation.z = -m / 60 * 6.2832; c.hh.rotation.z = -h / 12 * 6.2832; } });

  /* ======================= 4. houses: one cottage for everybody, colours from the follower's palette ======================= */
  const HS = HOUSES.filter(h => h.town), NH = HS.length;
  const HW = .25, WH = hy(28), RH = hy(22), EAV = .035, GOV = .03;
  const PALC = PAL.map(p => [col(p[0]), col(p[1])]);
  { // body (walls + gables)
    const b = GB(); const pent = [[-HW, 0], [HW, 0], [HW, WH], [0, WH + RH], [-HW, WH]];
    b.quad([-HW, 0, HW], [HW, 0, HW], [HW, WH, HW], [-HW, WH, HW], '#fff', [0, 0, 1]); b.quad([-HW, 0, -HW], [HW, 0, -HW], [HW, WH, -HW], [-HW, WH, -HW], '#fff', [0, 0, -1]);
    for (const sx of [-1, 1]) for (let k = 1; k + 1 < 5; k++) b.tri([sx * HW, pent[0][1], pent[0][0]], [sx * HW, pent[k][1], pent[k][0]], [sx * HW, pent[k + 1][1], pent[k + 1][0]], '#fff', [sx, 0, 0]);
    var bodyG = b.mesh(SHADE).children[0].geometry;
    // roof: two slabs with eaves, underside, ridge highlight
    const r = GB(), s = RH / HW;
    for (const sz of [-1, 1]) { const eave = [sz * (HW + EAV), WH - EAV * s], A = [-HW - GOV, eave[1], eave[0]], Bp = [HW + GOV, eave[1], eave[0]], Cp = [HW + GOV, WH + RH, 0], Dp = [-HW - GOV, WH + RH, 0];
      r.quad(A, Bp, Cp, Dp, '#fff', [0, 1, sz * .8]);
      const dn = .014; r.quad([A[0], A[1] - dn, A[2]], [Bp[0], Bp[1] - dn, Bp[2]], [Cp[0], Cp[1] - dn, Cp[2]], [Dp[0], Dp[1] - dn, Dp[2]], [.7, .7, .7].reduce ? new T3.Color(.62, .62, .62) : '#999', [0, -1, -sz * .8]);
      r.quad(A, Bp, [Bp[0], Bp[1] - dn, Bp[2]], [A[0], A[1] - dn, A[2]], new T3.Color(.8, .8, .8), [0, 0, sz]);
      for (const sx of [-1, 1]) r.quad([sx * (HW + GOV), eave[1], eave[0]], [sx * (HW + GOV), WH + RH, 0], [sx * (HW + GOV), WH + RH - dn, 0], [sx * (HW + GOV), eave[1] - dn, eave[0]], new T3.Color(.8, .8, .8), [sx, 0, 0]);
      const k = .14; r.quad([-HW - GOV, WH + RH - (RH + EAV * s) * k, sz * (HW + EAV) * k], [HW + GOV, WH + RH - (RH + EAV * s) * k, sz * (HW + EAV) * k], [HW + GOV, WH + RH + .001, 0], [-HW - GOV, WH + RH + .001, 0], new T3.Color(1.28, 1.28, 1.28), [0, 1, sz * .8]); }
    var roofG = r.mesh(SHADE).children[0].geometry;
    // hull (outline) of the whole house incl. eaves
    const h = GB(), t = O * 1.2, hp = [[-HW - t, -t], [HW + t, -t], [HW + t, WH - .01], [HW + EAV + t, WH - EAV * s - t], [0, WH + RH + t * 1.7], [-HW - EAV - t, WH - EAV * s - t], [-HW - t, WH - .01]], X0 = -HW - GOV - t, X1 = HW + GOV + t;
    for (let k = 0; k < hp.length; k++) { const a = hp[k], c = hp[(k + 1) % hp.length]; h.hquad([X0, a[1], a[0]], [X1, a[1], a[0]], [X1, c[1], c[0]], [X0, c[1], c[0]], [0, (a[1] + c[1]) / 2 - .2, (a[0] + c[0]) / 2]); }
    for (const sx of [X0, X1]) for (let k = 1; k + 1 < hp.length; k++) h.htri([sx, hp[0][1], hp[0][0]], [sx, hp[k][1], hp[k][0]], [sx, hp[k + 1][1], hp[k + 1][0]], [Math.sign(sx), 0, 0]);
    var hullG = h.mesh().children[0].geometry;
  }
  // houses are split into chunks, so only the visible part of the town is drawn; tiny details only when zoomed in
  const CH = 36, LOD = { near: [], mid: [], near2: [], far: [] }, PICK = [], FL = [];
  const Mx = new T3.Matrix4(), Qx = new T3.Quaternion(), one = v3(1, 1, 1);
  const yardG = white(new T3.PlaneGeometry(.94, .94).rotateX(-Math.PI / 2).translate(0, .041, 0)), shG = white(new T3.PlaneGeometry(.16, .5).rotateX(-Math.PI / 2).translate(HW + .08, .043, .02)), bushG = white(new T3.IcosahedronGeometry(1, 1));
  const shMat = new T3.MeshBasicMaterial({ color: 0, transparent: true, opacity: .16, depthWrite: false });
  const houseRot = h => h.flip ? -Math.PI / 2 : 0;
  const chunks = new Map(); HS.forEach((h, k) => { const key = Math.floor(h.i / CH) + ',' + Math.floor(h.j / CH); if (!chunks.has(key)) chunks.set(key, []); chunks.get(key).push(k); });
  for (const [key, ids] of chunks) {
    const [cx, cz] = key.split(',').map(n => (+n + .5) * CH), sph = new T3.Sphere(v3(cx, .5, cz), CH * .75 + 2), G = g => { const c = g.clone(); c.boundingSphere = sph.clone(); return c; }, n = ids.length;
    const body = new T3.InstancedMesh(G(bodyG), SHADE, n), roof = new T3.InstancedMesh(G(roofG), SHADE, n), hull = new T3.InstancedMesh(G(hullG), HULL, n), yard = new T3.InstancedMesh(G(yardG), FLAT_PO, n), shadowM = new T3.InstancedMesh(G(shG), shMat, n), bush = new T3.InstancedMesh(G(bushG), FLAT, n * 2);
    const deco = GB(), beds = GB(), rb = px(5.5);
    ids.forEach((k, q) => { const h = HS[k];
      const rot = houseRot(h), c = Math.cos(rot), s2 = Math.sin(rot); Qx.setFromAxisAngle(YAX, rot); Mx.compose(v3(h.i, 0, h.j), Qx, one);
      body.setMatrixAt(q, Mx); roof.setMatrixAt(q, Mx); hull.setMatrixAt(q, Mx); yard.setMatrixAt(q, Mx); shadowM.setMatrixAt(q, Mx);
      const pal = PALC[h.v % PALC.length]; body.setColorAt(q, pal[0]); roof.setColorAt(q, pal[1]); yard.setColorAt(q, col('#4f985c'));
      [[-.37, .37], [.36, -.36]].forEach(([du, dv], j) => { Mx.compose(v3(h.i + du * c + dv * s2, .041 + rb * .55, h.j - du * s2 + dv * c), Qx.identity(), v3(rb, rb * .9, rb)); bush.setMatrixAt(q * 2 + j, Mx); bush.setColorAt(q * 2 + j, col('#2e7a3f')); });
      const seed = hashStr('s' + h.v) >>> 0;
      deco.push(h.i, 0, h.j, rot);
      // face helper: f = 0 front(+z) 1 right(+x) 2 back(-z) 3 left(-x); s along the face from its left end, y in wall heights
      const F = (f, s0, s1, y0, y1, cl, d) => { const qq = (s, y) => { const yy = y * WH, o = HW + (d || .003); return f === 0 ? [-HW + s * 2 * HW, yy, o] : f === 1 ? [o, yy, HW - s * 2 * HW] : f === 2 ? [HW - s * 2 * HW, yy, -o] : [-o, yy, -HW + s * 2 * HW]; }; const out = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]][f]; deco.quad(qq(s0, y0), qq(s1, y0), qq(s1, y1), qq(s0, y1), cl, out); };
      const win = (f, s0, s1, y0, y1, lit) => { F(f, s0 - .03, s1 + .03, y0 - .05, y1 + .05, '#7a5a3e'); F(f, s0, s1, y0, y1, lit ? '#ffd56b' : '#3d4566', .004); const sm = (s0 + s1) / 2, ym = (y0 + y1) / 2; F(f, sm - .012, sm + .012, y0, y1, '#8a6545', .005); F(f, s0, s1, ym - .02, ym + .02, '#8a6545', .005); };
      F(0, .18, .38, 0, .68, '#6b4a33'); F(0, .33, .355, .3, .35, '#e8c25a', .005);
      win(0, .55, .81, .32, .68, seed & 3); win(1, .36, .64, .32, .68, (seed >>> 3) & 3); win(2, .2, .42, .32, .68, (seed >>> 5) & 3); win(2, .58, .8, .32, .68, (seed >>> 7) & 3); win(3, .36, .64, .32, .68, (seed >>> 9) & 3);
      deco.pop();
      if (tierOf(h) >= 1) {   // tier 1: flower beds along the front and the right side
        beds.push(h.i, 0, h.j, rot);
        beds.box(-.36, .041, .29, .29, .041 + hy(2.5), .41, '#6e4a2e', { top: '#5a3a22' }); beds.box(.29, .041, -.36, .41, .041 + hy(2.5), .29, '#6e4a2e', { top: '#5a3a22' });
        const rnd = qn => { const x = Math.sin(h.idx * 7919 + qn * 12.9898) * 43758.5453; return x - Math.floor(x); };
        for (let qn = 0; qn < 16; qn++) { const lx = qn < 8 ? -.32 + (qn % 8) * .085 + (rnd(qn) - .5) * .02 : .35 + (rnd(qn + 90) - .5) * .05, lz = qn < 8 ? .35 + (rnd(qn + 50) - .5) * .05 : -.32 + (qn % 8) * .085, wx = h.i + lx * c + lz * s2, wz = h.j - lx * s2 + lz * c;
          FL.push([wx, wz, hy(7 + rnd(qn + 7) * 6), FLOWER_COLS[Math.floor(rnd(qn + 3) * FLOWER_COLS.length)]]); }
        beds.pop();
      }
    });
    for (const m of [body, roof, hull, yard, shadowM, bush]) { m.frustumCulled = true; scene.add(m); }
    shadowM.renderOrder = 2; const dm = deco.mesh(FLAT_PO, 2), bm = beds.mesh(SHADE); scene.add(dm, bm);
    LOD.near.push(dm, bm, bush); LOD.mid.push(hull, shadowM); PICK.push({ m: body, ids }, { m: roof, ids });
  }

  /* ======================= 5. trees (the 2D ball trees / two-cone firs / District 2 blossom trees) + flowers ======================= */
  const TREES = []; const tree = (u, v, kind, s, c, y0) => TREES.push([u, v, kind, s, c, y0 || 0]);
  for (const [u, v, kind, s] of T1.trees.concat(W.FOREST)) tree(u, v, kind, s);
  T1.lots.slice(5000).forEach(L => tree(L[0], L[1], 0, .9));
  const BL = ['#f6a9c8', '#ffc3d9', '#ff9a4d', '#f4d35e'];
  T2.trees.forEach(([u, v, kind, s], k) => tree(u, v, k % 5 < 3 ? 2 : kind, s, BL[(k >> 2) % 4]));
  for (const p of BPARKS) for (const [u, v, kind] of p.trees) tree(u, v, kind, .9);
  for (const [u, v, kind] of PARK_TREES) tree(u, v, kind, .9);
  for (const [u, v] of [[1.4, 4.6], [4.6, 1.4], [1.4, 1.4]]) tree(u, v, 0, .85);
  { const C2 = W.C2; for (let q = 0; q < 4; q++) { const a = .12 + Math.PI / 4 + q * Math.PI / 2; tree(C2[0] + Math.cos(a) * 2.5, C2[1] + Math.sin(a) * 2.5, 2, .85, BL[q % 2]); } }
  [[-22.6, -19.0], [-19.2, -21.8], [-16.4, -16.4], [-15.0, -17.6], [-22.4, -13.1], [-26.9, -18.9]].forEach(([u, v], k) => tree(u, v, k % 3 === 2 ? 1 : 0, .8, null, hy(9)));
  function buildTrees() {
    const R = v3(1, 0, -1).normalize(), balls = [], cones = [], trunks = [], shadows = [];
    for (const [u, v, kind, s, c, y0] of TREES) {
      const P = (dx, h) => [u + R.x * dx * PX * s, y0 + h * HU * s, v + R.z * dx * PX * s];
      trunks.push([u, y0, v, s, kind === 2 ? 20 : 14, kind === 2 ? '#7a5236' : '#6b4a33']); if (!y0) shadows.push([u + .03 * s, v + .03 * s, s]);
      if (kind === 0) balls.push([...P(0, 27), 15 * PX * s, '#2c743c'], [...P(-6, 22), 10 * PX * s, '#38894a'], [...P(5, 33), 8 * PX * s, '#46a258']);
      else if (kind === 1) cones.push([u, y0 + 11 * HU * s, v, 15 * PX * s, 31 * HU * s, '#2a6b43'], [u, y0 + 27 * HU * s, v, 11 * PX * s, 27 * HU * s, '#358455']);
      else { const c2 = shade(c, .85); balls.push([...P(-8, 26), 11 * PX * s, c2], [...P(8, 27), 11 * PX * s, c2], [...P(0, 36), 13 * PX * s, c]); }
    }
    const inst = (geo, list, setM, m) => { const byC = new Map(); for (const x of list) { const key = Math.floor(x[0] / CH) + ',' + Math.floor(x[2] / CH); if (!byC.has(key)) byC.set(key, []); byC.get(key).push(x); } const out = [];
      for (const [key, L] of byC) { const [cx, cz] = key.split(',').map(n => (+n + .5) * CH), g = white(geo.clone()); g.boundingSphere = new T3.Sphere(v3(cx, .5, cz), CH * .75 + 2); const me = new T3.InstancedMesh(g, m || FLAT, L.length); L.forEach((x, k) => { setM(x); me.setMatrixAt(k, Mx); me.setColorAt(k, col(x[x.length - 1])); }); scene.add(me); out.push(me); } return out; };
    inst(new T3.IcosahedronGeometry(1, 1), balls, x => Mx.compose(v3(x[0], x[1], x[2]), Qx.identity(), v3(x[3], x[3], x[3]))).forEach(m => LOD.near2.push(m));
    inst(new T3.IcosahedronGeometry(1, 0), balls, x => Mx.compose(v3(x[0], x[1], x[2]), Qx.identity(), v3(x[3] * 1.08, x[3] * 1.08, x[3] * 1.08))).forEach(m => LOD.far.push(m));
    inst(new T3.ConeGeometry(1, 1, 10).translate(0, .5, 0), cones, x => Mx.compose(v3(x[0], x[1], x[2]), Qx.identity(), v3(x[3], x[4], x[3])));
    inst(new T3.BoxGeometry(1, 1, 1).translate(0, .5, 0), trunks, x => Mx.compose(v3(x[0], x[1], x[2]), Qx.identity(), v3(5 * PX * x[3], x[4] * HU * x[3], 5 * PX * x[3])), SHADE);
    const shm = new T3.MeshBasicMaterial({ color: 0, transparent: true, opacity: .18, depthWrite: false });
    inst(new T3.CircleGeometry(1, 16).rotateX(-Math.PI / 2), shadows.map(x => [x[0], 0, x[1], x[2], '#000']), x => Mx.compose(v3(x[0], .045, x[2]), Qx.identity(), v3(.19 * x[3], 1, .16 * x[3])), shm).forEach(m => { m.renderOrder = 3; LOD.mid.push(m); });
  }
  // flowers: park beds + block park beds (same random spots as the 2D drawing) + house beds
  { let r = seeded(5); for (let k = 0; k < 9; k++) { const u = 12.5 + r() * 7, v = 2.5 + r() * 7; if (parkDist(u, v) > -.8 || Math.hypot(u - 16.6, v - 4.6) < 1.7 || Math.abs((v - PARK_C[1]) - .55 * Math.sin((u - PARK_C[0]) * .7)) < .6) continue; for (let j = 0; j < 7; j++) FL.push([u + Math.cos(j * 2.4) * .14, v + Math.sin(j * 2.4) * .11, hy(6 + (j % 3) * 2), ['#ff5d8f', '#ffd23f', '#ff8a3d', '#c77dff'][(k + j) % 4], 1]); }
    for (const p of BPARKS) { r = seeded(9 + p.ph); for (let k = 0; k < 5; k++) { const u = p.c[0] - 1.6 + r() * 2.4, v = p.c[1] + .2 + r() * 1.4; if (bparkDist(p, u, v) > -.5) continue; for (let j = 0; j < 6; j++) FL.push([u + Math.cos(j * 2.4) * .1, v + Math.sin(j * 2.4) * .08, hy(6 + (j % 3) * 2), ['#ff5d8f', '#ffd23f', '#ff8a3d', '#c77dff'][(k + j) % 4], 1]); } } }
  { const byC = new Map(); for (const f of FL) { const key = Math.floor(f[0] / CH) + ',' + Math.floor(f[1] / CH); if (!byC.has(key)) byC.set(key, []); byC.get(key).push(f); }
    const hg = white(new T3.IcosahedronGeometry(1, 0)), sg = white(new T3.BoxGeometry(1, 1, 1).translate(0, .5, 0));
    for (const [key, L] of byC) { const [cx, cz] = key.split(',').map(n => (+n + .5) * CH), sp = new T3.Sphere(v3(cx, .5, cz), CH * .75 + 2), g1 = hg.clone(), g2 = sg.clone(); g1.boundingSphere = sp; g2.boundingSphere = sp.clone();
      const heads = new T3.InstancedMesh(g1, FLAT, L.length), stems = new T3.InstancedMesh(g2, FLAT, L.length);
      L.forEach(([x, z, hgt, c, big], k) => { const r = big ? .028 : .022; Mx.compose(v3(x, .05 + hgt, z), Qx.identity(), v3(r, r * .8, r)); heads.setMatrixAt(k, Mx); heads.setColorAt(k, col(c)); Mx.compose(v3(x, .045, z), Qx.identity(), v3(.006, hgt, .006)); stems.setMatrixAt(k, Mx); stems.setColorAt(k, col('#2f7d3a')); });
      scene.add(heads, stems); LOD.near.push(heads, stems); } }

  /* ======================= 6. street lamps (whole town), lanterns in District 2 ======================= */
  { const B = GB(); const nearDir = (T, u, v) => { const n = T.SH.near(u, v, 2.5); return n.p ? [(n.p[0] - u) / (n.d || 1), (n.p[1] - v) / (n.d || 1)] : [1, 0]; };
    for (const [u, v] of T1.lamps) { const d = nearDir(T1, u, v); MD.lampStreet(B, u, v, d[0], d[1]); }
    for (const [u, v] of T2.lamps) MD.lampPlaza(B, u, v);
    const lm = B.mesh(); scene.add(lm); LOD.near.push(lm); }

  /* ======================= 7. Benny's square, town hall, park, building sites ======================= */
  const S1 = GB();
  MD.fountain(S1, 3, 3); circ(3, 3, .6);
  for (const [u, v] of [[3, .9], [.9, 3], [1.6, 1.6], [4.6, 1.6], [1.6, 4.6]]) MD.lampPlaza(S1, u, v);
  const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
  for (const [u, v] of [[1.9, 4.2], [4.2, 1.9]]) { MD.bench(S1, u, v, faceTo(u, v, 3, 3)); circ(u, v, .2); }
  MD.tent(S1, 4.75, 2.4, 0); circ(4.75, 2.4, .42);
  const TH = MD.townHall(S1, TQS); addClocks(TH.clocks, TH.clockR); rect(1.15, 14.55, 4.85, 16.85);
  [[0.95, 16.95, '#ff8a3d'], [2.0, 16.95, '#4da3ff'], [4.1, 16.95, '#3ddc84'], [5.15, 16.95, '#e2483a']].forEach(([u, v, c]) => { MD.hallStall(S1, u, v, c); rect(u - .17, v - .12, u + .17, v + .16); });
  MD.swing(S1, 14.0, 7.2, Math.PI / 4); rect(13.75, 7.0, 14.25, 7.4);
  MD.bench(S1, 15.4, 6.6, faceTo(15.4, 6.6, 16.6, 4.6)); MD.bench(S1, 17.3, 3.0, faceTo(17.3, 3.0, 16.6, 4.6)); circ(15.4, 6.6, .2); circ(17.3, 3.0, .2);
  for (const [u, v, kind] of PARK_TREES) circ(u, v, .12);
  colliders.push({ e: [16.6, 4.6, 1.2 * 1.15 * 1.2, 1.2 * 1.15 * .8] });                    // pond
  for (const p of BPARKS) colliders.push({ e: [p.c[0] + .6, p.c[1] - .4, .8, .55] });
  // building sites: fence all round, sign, dirt piles
  for (const Z of SITES) { if (featP(Z.key) > 0) continue; rect(Z.u0, Z.v0, Z.u1, Z.v1);
    const posts = []; for (let k = 0; k <= 12; k++) { const t = k / 12; posts.push([lerp(Z.u0 + .1, Z.u1 - .1, t), Z.v1 - .12], [lerp(Z.u0 + .1, Z.u1 - .1, t), Z.v0 + .12], [Z.u1 - .12, lerp(Z.v0 + .1, Z.v1 - .1, t)], [Z.u0 + .12, lerp(Z.v0 + .1, Z.v1 - .1, t)]); }
    posts.forEach(([u, v], k) => S1.box(u - .025, 0, v - .025, u + .025, hy(16), v + .025, k % 2 ? '#ff8a3d' : '#f4efe4', { edges: true }));
    for (const [a, b] of [[[Z.u0 + .1, Z.v1 - .12], [Z.u1 - .1, Z.v1 - .12]], [[Z.u0 + .1, Z.v0 + .12], [Z.u1 - .1, Z.v0 + .12]], [[Z.u1 - .12, Z.v0 + .1], [Z.u1 - .12, Z.v1 - .1]], [[Z.u0 + .12, Z.v0 + .1], [Z.u0 + .12, Z.v1 - .1]]]) {
      const n = 16; for (let k = 0; k < n; k++) { const p0 = [lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)], p1 = [lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n)]; S1.quad([p0[0], hy(10), p0[1]], [p1[0], hy(10), p1[1]], [p1[0], hy(13), p1[1]], [p0[0], hy(13), p0[1]], k % 2 ? '#e2483a' : '#f4efe4', [p1[1] - p0[1], 0, p0[0] - p1[0]]); } }
    const cu = (Z.u0 + Z.u1) / 2, cvv = (Z.v0 + Z.v1) / 2; S1.tube([cu, 0, cvv], [cu, hy(44), cvv], .02, '#5b4630', { n: 6, caps: false }); S1.push(cu, 0, cvv, Math.PI / 4).box(-.66, hy(34), -.02, .66, hy(76), .02, '#f4efe4', { edges: true, hull: O * .8 }).pop();
    TQS.site.board(cu + Math.sin(Math.PI / 4) * .022, hy(55), cvv + Math.cos(Math.PI / 4) * .022, 1.26, hy(40), [0, 0, 1, 1], Math.PI / 4); TQS.site.board(cu - Math.sin(Math.PI / 4) * .022, hy(55), cvv - Math.cos(Math.PI / 4) * .022, 1.26, hy(40), [0, 0, 1, 1], Math.PI / 4 + Math.PI);
    const r = seeded(Math.round(Z.u0 * 31 + Z.v0 * 7)); for (let k = 0; k < 3; k++) S1.sphere(Z.u0 + 1 + r() * (Z.u1 - Z.u0 - 2), 0, Z.v0 + 1 + r() * (Z.v1 - Z.v0 - 2), .4, '#8a6a48', { s: [1, .45, .8], detail: 1 });
  }
  scene.add(S1.mesh());
  // Benny + his campervan (separate, they move/blink)
  const benny = MD.benny(); W3D.benny = benny; benny.position.set(3.5, 0, 3.65); benny.rotation.y = -.35; scene.add(benny); circ(3.5, 3.65, .3);
  const van = MD.van(); van.position.set(4.55, 0, 4.85); scene.add(van); rect(3.93, 4.56, 5.17, 5.14);
  { const sh = new T3.Mesh(new T3.CircleGeometry(1, 24).rotateX(-Math.PI / 2), new T3.MeshBasicMaterial({ color: 0, transparent: true, opacity: .2, depthWrite: false })); sh.scale.set(.66, 1, .36); sh.position.set(4.6, .046, 4.9); sh.renderOrder = 3; scene.add(sh);
    const s2 = sh.clone(); s2.scale.set(.2, 1, .2); s2.position.set(3.5, .046, 3.68); scene.add(s2); }
  // fountain water: animated jets
  { const n = 16, drops = new T3.InstancedMesh(white(new T3.IcosahedronGeometry(1, 1)), FLAT, n); drops.setColorAt(0, col('#cdeeff')); for (let k = 0; k < n; k++) drops.setColorAt(k, col('#cdeeff')); drops.frustumCulled = false; scene.add(drops);
    anim.push(t => { for (let k = 0; k < n; k++) { const ph = (t * 1.1 + k / n) % 1, a = k / n * 6.2832 * 2, r = ph * .34, y = hy(34) + Math.sin(ph * Math.PI) * hy(16) - ph * hy(24); Mx.compose(v3(3 + Math.cos(a) * r, Math.max(hy(5), y), 3 + Math.sin(a) * r), Qx.identity(), v3(.022, .022, .022)); drops.setMatrixAt(k, Mx); } drops.instanceMatrix.needsUpdate = true; }); }

  /* ======================= 8. the marketplace ======================= */
  const MK = GB();
  { const backU = [-23.35, -21.65, -19.95, -18.25, -16.55, -14.85];
    backU.forEach((u, k) => { MD.shop(MK, u, -23.4, MK_SHOPS[k], 'v', TQS, k); rect(u, -23.4, u + 1.25, -23.4 + 1.1); });
    [-17.75, -16.05, -14.35].forEach((v, k) => { MD.shop(MK, -23.4, v, MK_SHOPS[6 + k], 'u', TQS, 6 + k); rect(-23.4, v, -23.4 + 1.1, v + 1.25); });
    [[-26.5, -20.7, '#ff8a3d'], [-25.0, -20.7, '#4da3ff'], [-26.5, -19.3, '#3ddc84'], [-25.0, -19.3, '#e2483a'], [-20.6, -16.6, '#ffd23f'], [-19.4, -15.2, '#c77dff'], [-20.6, -13.8, '#ff5d8f'], [-18.2, -20.9, '#4da3ff'], [-17.0, -19.6, '#ff8a3d']].forEach(([u, v, c], k) => { MD.umbrellaStall(MK, u, v, c, k); circ(u, v, .2); });
    const TW2 = MD.marketTower(MK, MK_TOWER[0], MK_TOWER[1]); addClocks(TW2.clocks, TW2.clockR); rect(MK_TOWER[0] - .55, MK_TOWER[1] - .55, MK_TOWER[0] + .55, MK_TOWER[1] + .55);
    [[-22.6, -19.0], [-19.2, -21.8], [-16.4, -16.4], [-15.0, -17.6], [-22.4, -13.1], [-26.9, -18.9]].forEach(([u, v]) => { MD.planter(MK, u, v); circ(u, v, .15); });
    [[-21.9, -18.3], [-19.6, -21.0], [-15.7, -15.4], [-17.4, -15.0]].forEach(([u, v]) => { MD.bench(MK, u, v, faceTo(u, v, MK_TOWER[0], MK_TOWER[1])); circ(u, v, .2); });
    [[-15.3, '#e2483a'], [-14.3, '#4da3ff'], [-13.3, '#ffd23f']].forEach(([u, c]) => { MK.push(u, 0, -19.8, 0); MD.car(MK, c); MK.pop(); rect(u - .12, -20.02, u + .12, -19.58); });
    MK_LAMPS.forEach(([u, v]) => MD.lampMarket(MK, u, v));
    // bunting between the lamps: sagging strings with little flags
    const cols = ['#e2483a', '#ffd23f', '#4da3ff', '#3ddc84', '#ff8a3d', '#c77dff'];
    for (const [a, b] of MK_BUNTING) { const A = MK_LAMPS[a], Bp = MK_LAMPS[b], L = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), n = Math.max(4, Math.round(L * 3.4)), top = hy(62), sag = .28;
      const P = t => [lerp(A[0], Bp[0], t), top - Math.sin(t * Math.PI) * sag, lerp(A[1], Bp[1], t)];
      for (let q = 0; q < 24; q++) MK.edge(P(q / 24), P((q + 1) / 24));
      const dx = (Bp[0] - A[0]) / L, dz = (Bp[1] - A[1]) / L;
      for (let q = 1; q < n; q++) { const p = P(q / n), w = .05; MK.tri([p[0] - dx * w, p[1], p[2] - dz * w], [p[0] + dx * w, p[1], p[2] + dz * w], [p[0], p[1] - .11, p[2]], cols[q % 6], [-dz, 0, dx]); } }
  }
  scene.add(MK.mesh());

  /* ======================= 8b. cars: the very same cars as on the map (same streets, same moment) ======================= */
  const BEAM_M = new T3.MeshBasicMaterial({ color: '#fff0b8', transparent: true, opacity: 0, blending: T3.AdditiveBlending, depthWrite: false, fog: false });
  { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 6, 1, 32, 22, 40); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); BEAM_M.map = new T3.CanvasTexture(c); }
  const BEAM_G = new T3.PlaneGeometry(.46, 1).rotateX(-Math.PI / 2).translate(0, .052, .7);
  for (const c of W.CARS) { const B = GB(); MD.car(B, c.col); const g = B.mesh(); const bm = new T3.Mesh(BEAM_G, BEAM_M); bm.renderOrder = 4; g.add(bm); scene.add(g); anim.push(() => { const [u, v, hx, hz] = W.carAt(c, S.T); g.position.set(u, 0, v); g.rotation.y = Math.atan2(hx, hz); }); }

  /* ======================= 9. "FOR RENT" signs on the next free lots of District 2 ======================= */
  { const B = GB(); for (const L of W.NEXT2.slice(0, 40)) MD.signPost(B, L[0], L[1], Math.atan2(-L[5], -L[6]), TQS); scene.add(B.mesh()); }

  /* ======================= 10. walls, towers, gatehouses you can walk through, District 2 centre ======================= */
  const WALL_H = hy(44);
  function towerB(B, u, v, k, sty, outDir) {
    const s = .78 * k, Hh = hy(74) * k * (sty.hs || 1), N = 8, ring = rr => B.ngon(u, v, rr, N, .39);
    B.prism(ring(s), 0, Hh, sty.stone, { top: shade(sty.stone, 1.05), edges: true, hull: O });
    B.prism(ring(s * 1.13), Hh, Hh + hy(4), shade(sty.stone, 1.08), { edges: true });
    const R2 = ring(s * 1.12); for (let q = 0; q < N; q++) { const a = R2[q], b = R2[(q + 1) % N], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; B.box(m[0] - .07, Hh + hy(4), m[1] - .07, m[0] + .07, Hh + hy(11), m[1] + .07, sty.cren, { top: sty.crenTop, edges: true }); }
    const ap = [u, Hh + hy(4) + hy(48) * k, v], R3 = ring(s * .95);
    for (let q = 0; q < N; q++) { const a = R3[q], b = R3[(q + 1) % N]; B.tri([a[0], Hh + hy(10), a[1]], [b[0], Hh + hy(10), b[1]], ap, sty.roof, [(a[0] + b[0]) / 2 - u, .5, (a[1] + b[1]) / 2 - v]); B.edge([a[0], Hh + hy(10), a[1]], ap); B.edge([a[0], Hh + hy(10), a[1]], [b[0], Hh + hy(10), b[1]]); }
    B.cone(u, v, s * .95 / Math.cos(Math.PI / N), 0, Hh + hy(10) - O, ap[1] + O * 1.6, N, '#000', { a0: .39, hull: O, hullOnly: true });
    B.tube(ap, [u, ap[1] + hy(22), v], .009, '#4a4a4a', { n: 5, caps: false }); B.tri([u, ap[1] + hy(22), v], [u + .13, ap[1] + hy(17), v - .13], [u, ap[1] + hy(12), v], sty.flag);
    for (let q = 0; q < 4; q++) { const a = q / 4 * 6.2832 + .78, x = u + Math.cos(a) * (s + .004), z = v + Math.sin(a) * (s + .004); B.push(x, 0, z, Math.atan2(Math.cos(a), Math.sin(a))); B.quad([-.025, Hh * .55, 0], [.025, Hh * .55, 0], [.025, Hh * .55 + hy(13), 0], [-.025, Hh * .55 + hy(13), 0], '#2a2230', [0, 0, 1]); B.quad([-.012, Hh * .55 + hy(2), .002], [.012, Hh * .55 + hy(2), .002], [.012, Hh * .55 + hy(11), .002], [-.012, Hh * .55 + hy(11), .002], '#ffcf6b', [0, 0, 1]); B.pop(); }
    if (outDir) { const x = u + outDir[0] * (s + .05), z = v + outDir[1] * (s + .05); B.box(x - .02, Hh * .4, z - .02, x + .02, Hh * .4 + hy(10), z + .02, '#5b4630'); B.cone(x, z, .03, 0, Hh * .4 + hy(10), Hh * .4 + hy(18), 6, '#ffb03a'); B.sphere(x, Hh * .4 + hy(13), z, .02, '#fff1a8', { detail: 0 }); }
    if (sty.clock) addClocks([[u, Hh * .84, v + s * .93 + .004, 0], [u + s * .93 + .004, Hh * .84, v, Math.PI / 2], [u, Hh * .84, v - s * .93 - .004, Math.PI], [u - s * .93 - .004, Hh * .84, v, -Math.PI / 2]], px(12));
  }
  for (const T of [T1, T2]) {
    const st = W.STYLE.get(T), B = GB(), Hc = WALL_H + hy(9);
    for (const sg of T.segs) {
      const nu = Math.cos(sg.am), nv = Math.sin(sg.am), t = .45, [u0, v0] = sg.p0, [u1, v1] = sg.p1;
      const o0 = [u0 + nu * t, v0 + nv * t], o1 = [u1 + nu * t, v1 + nv * t], i0 = [u0 - nu * t, v0 - nv * t], i1 = [u1 - nu * t, v1 - nv * t];
      B.quad([o0[0], 0, o0[1]], [o1[0], 0, o1[1]], [o1[0], WALL_H, o1[1]], [o0[0], WALL_H, o0[1]], st.face, [nu, 0, nv]);
      B.quad([i0[0], 0, i0[1]], [i1[0], 0, i1[1]], [i1[0], WALL_H, i1[1]], [i0[0], WALL_H, i0[1]], st.faceIn, [-nu, 0, -nv]);
      B.quad([o0[0], WALL_H, o0[1]], [o1[0], WALL_H, o1[1]], [i1[0], WALL_H, i1[1]], [i0[0], WALL_H, i0[1]], st.walk, [0, 1, 0]);
      for (const [a, b] of [[o0, o1], [i0, i1]]) B.edge([a[0], WALL_H, a[1]], [b[0], WALL_H, b[1]]); B.edge([o0[0], 0, o0[1]], [o1[0], 0, o1[1]]);
      for (let q = 1; q < 5; q++) { const yy = WALL_H * q / 5; for (const [a, b, d] of [[o0, o1, 1], [i0, i1, -1]]) B.quad([a[0] + nu * .002 * d, yy - .004, a[1] + nv * .002 * d], [b[0] + nu * .002 * d, yy - .004, b[1] + nv * .002 * d], [b[0] + nu * .002 * d, yy + .004, b[1] + nv * .002 * d], [a[0] + nu * .002 * d, yy + .004, a[1] + nv * .002 * d], shade(d > 0 ? st.face : st.faceIn, .86), [nu * d, 0, nv * d]); }
      for (const [E0, E1, d] of [[o0, o1, -1], [i0, i1, 1]]) for (let q = 0; q < 3; q++) { const t0 = q / 3 + .06, t1 = t0 + .17, P0 = [lerp(E0[0], E1[0], t0), lerp(E0[1], E1[1], t0)], P1 = [lerp(E0[0], E1[0], t1), lerp(E0[1], E1[1], t1)], dd = d * .16;
        B.prism([P0, P1, [P1[0] + nu * dd, P1[1] + nv * dd], [P0[0] + nu * dd, P0[1] + nv * dd]], WALL_H, Hc - (d > 0 ? hy(3) : 0), st.cren, { top: st.crenTop, edges: 'top' }); }
      if (sg.s % 7 === 3) B.sphere(lerp(o0[0], o1[0], .4) + nu * .004, hy(6), lerp(o0[1], o1[1], .4) + nv * .004, .07, '#5f8a4f', { s: [1, .55, .15], detail: 1 });
    }
    for (const tw of T.towers) { const a = Math.atan2(tw.p[1] - T.C[1], tw.p[0] - T.C[0]); towerB(B, tw.p[0], tw.p[1], tw.k, st, [Math.cos(a), Math.sin(a)]); }
    if (T === T2) { towerB(B, W.C2[0], W.C2[1], 1.1, Object.assign({}, st, { hs: 1.8, clock: true })); circ(W.C2[0], W.C2[1], .95); }
    for (const g of T.gates) gatehouse(B, T, g, st);
    scene.add(B.mesh());
  }
  function gatehouse(B, T, g, st) {
    const dp = .52, H = hy(66), a = .62, hs = hy(24), hr = hy(14), top = hs + hr, wd = g.wd, [tu, tv] = g.t, [nu, nv] = g.n, [cu, cvv] = g.c;
    const P = (s, d, y) => [cu + tu * s + nu * d, y, cvv + tv * s + nv * d], arch = s => hs + hr * Math.sqrt(Math.max(0, 1 - (s / a) ** 2));
    const box = (s0, s1, d0, d1, y0, y1, c, o) => { const pts = [[s0, d0], [s1, d0], [s1, d1], [s0, d1]].map(([s, d]) => [cu + tu * s + nu * d, cvv + tv * s + nv * d]); B.prism(pts, y0, y1, c, o); };
    const face = shade(st.face, 1.04), inner = shade(st.face, .72);
    box(-wd, -a, -dp, dp, 0, H, face, { top: st.walk, edges: true, hull: O }); box(a, wd, -dp, dp, 0, H, face, { top: st.walk, edges: true, hull: O });
    box(-a, a, -dp, dp, top, H, face, { top: st.walk, edges: 'top', bottom: inner, hull: O });
    const n = 14;
    for (let k = 0; k < n; k++) { const s0 = -a + 2 * a * k / n, s1 = -a + 2 * a * (k + 1) / n, y0 = arch(s0), y1 = arch(s1);
      for (const d of [-dp, dp]) B.quad(P(s0, d, y0), P(s1, d, y1), P(s1, d, top), P(s0, d, top), face, [nu * Math.sign(d), 0, nv * Math.sign(d)]);
      B.quad(P(s0, -dp, y0), P(s1, -dp, y1), P(s1, dp, y1), P(s0, dp, y0), inner, [0, -1, 0]);
      for (const d of [-dp - .004, dp + .004]) { const off = (s, y) => { const dx = s / a, dy = (y - hs) / hr, l = Math.hypot(dx, dy) || 1; return P(s + dx / l * .075, d, y + dy / l * .075); }; B.quad(P(s0, d, y0), P(s1, d, y1), off(s1, y1), off(s0, y0), shade(st.cren, .92), [nu * Math.sign(d), 0, nv * Math.sign(d)]); } }
    for (const d of [-dp - .004, dp + .004]) for (const sd of [-1, 1]) B.quad(P(sd * a, d, 0), P(sd * (a + .07), d, 0), P(sd * (a + .07), d, hs), P(sd * a, d, hs), shade(st.cren, .92), [nu * Math.sign(d), 0, nv * Math.sign(d)]);
    for (const e of [-1, 1]) for (let q = 0; q < 6; q++) { const s0 = -wd + (q + .15) / 6 * 2 * wd, s1 = s0 + .55 / 6 * 2 * wd; box(s0, s1, e * dp, e * (dp - .16), H, H + hy(9), st.cren, { top: st.crenTop, edges: 'top' }); }
    // doors (closed gates, recessed towards the wild) or a raised portcullis (open gate)
    const dOut = dp - .1;
    if (!g.open) { const D = (s, y) => P(s, dOut, y);
      for (let k = 0; k < 16; k++) { const s0 = -a + 2 * a * k / 16, s1 = -a + 2 * a * (k + 1) / 16; B.quad(D(s0, 0), D(s1, 0), D(s1, arch(s1)), D(s0, arch(s0)), k % 2 ? '#7a5532' : '#714e2e', [nu, 0, nv]); }
      for (const yy of [hy(7), hy(19)]) B.quad(P(-a, dOut + .006, yy), P(a, dOut + .006, yy), P(a, dOut + .006, yy + hy(2.4)), P(-a, dOut + .006, yy + hy(2.4)), '#3d3d44', [nu, 0, nv]);
      B.quad(P(-.008, dOut + .006, 0), P(.008, dOut + .006, 0), P(.008, dOut + .006, top), P(-.008, dOut + .006, top), '#3d2a18', [nu, 0, nv]);
      for (const s of [-.06, .06]) B.sphere(...P(s, dOut + .015, hy(13)), .016, '#c9a24a', { detail: 0 });
      // closed: the passage can't be walked through
      rect(...[P(-a, dOut - .02, 0), P(a, dOut + .02, 0)].flatMap(p => [p[0], p[2]]));
    } else {
      for (let k = 0; k <= 8; k++) { const s = -a + .06 + (2 * a - .12) * k / 8; B.quad(P(s - .008, dp - .08, arch(s) - .075), P(s + .008, dp - .08, arch(s) - .075), P(s + .008, dp - .08, arch(s)), P(s - .008, dp - .08, arch(s)), '#4a4250', [nu, 0, nv]); }
      for (const yy of [-.025, -.055]) { for (let k = 0; k < 10; k++) { const s0 = -a + .06 + (2 * a - .12) * k / 10, s1 = s0 + (2 * a - .12) / 10; B.quad(P(s0, dp - .08, arch(s0) + yy - .006), P(s1, dp - .08, arch(s1) + yy - .006), P(s1, dp - .08, arch(s1) + yy + .006), P(s0, dp - .08, arch(s0) + yy + .006), '#4a4250', [nu, 0, nv]); } }
      for (const sd of [-1, 1]) for (const d of [dp + .06, -dp - .06]) { const p = P(sd * (a + .2), d, hy(30)); B.box(p[0] - .022, p[1], p[2] - .022, p[0] + .022, p[1] + hy(9), p[2] + .022, '#3a3242', { edges: true }); B.sphere(p[0], p[1] + hy(4.5), p[2], .02, '#ffd98a', { detail: 0 }); }
    }
    // banners above the arch on both faces
    for (const e of [-1, 1]) { const p = P(0, e * (dp + .006), H - hy(16)), ry = Math.atan2(nu * e, nv * e); (T === T1 ? TQS.banR : TQS.banB).board(p[0], p[1], p[2], .26, hy(26), [0, 0, 1, 1], ry); }
    // the piers are solid for walkers
    for (const [s0, s1] of [[-wd, -a], [a, wd]]) { const ps = [P(s0, -dp, 0), P(s1, dp, 0)]; colliders.push({ ob: { c: g.c, t: g.t, n: g.n, s0, s1, d0: -dp, d1: dp } }); }
  }

  /* ======================= 11. the great walled bridge: real arches over the river, ramps at both gates ======================= */
  const BR = { x0: W.BG1[0], x1: W.BG2[0], z: W.BG1[1], w: W.BR_W, mid: W.MID[0] };
  const deckH = x => { const t = clamp((x - BR.x0) / (BR.x1 - BR.x0), 0, 1); return hy(34) * sst(0, .2, t) * sst(1, .8, t); };
  const ARCH = [[BR.mid - 3.6, 2.6], [BR.mid + 3.6, 2.6]];
  const archY = x => { for (const [c, h] of ARCH) if (Math.abs(x - c) < h) return (deckH(x) - .1) * Math.sqrt(1 - ((x - c) / h) ** 2); return 0; };
  { const B = GB(), z0 = BR.z - BR.w, z1 = BR.z + BR.w, side = '#b3a58a', vault = '#8f8470', step = .2;
    for (let x = BR.x0; x < BR.x1 - 1e-6; x += step) { const xa = x, xb = Math.min(BR.x1, x + step), ha = deckH(xa), hb = deckH(xb), ya = archY(xa), yb = archY(xb);
      B.quad([xa, ha, z0], [xb, hb, z0], [xb, hb, z1], [xa, ha, z1], '#b6ab95', [0, 1, 0]);
      for (const [z, s] of [[z0, -1], [z1, 1]]) { B.quad([xa, ya, z], [xb, yb, z], [xb, hb, z], [xa, ha, z], side, [0, 0, s]); B.edge([xa, ha, z], [xb, hb, z]);
        if (ya > 0 || yb > 0) B.edge([xa, ya, z], [xb, yb, z]); }
      if (ya > 0 || yb > 0) B.quad([xa, ya, z0], [xb, yb, z0], [xb, yb, z1], [xa, ya, z1], vault, [0, -1, 0]);
      // parapets with crenels on both sides
      for (const [zo, zi, s] of [[z0, z0 + .17, -1], [z1, z1 - .17, 1]]) { const pa = ha + hy(16), pb = hb + hy(16);
        B.quad([xa, ha, zi], [xb, hb, zi], [xb, pb, zi], [xa, pa, zi], '#c4b8a0', [0, 0, -s]); B.quad([xa, ha, zo], [xb, hb, zo], [xb, pb, zo], [xa, pa, zo], '#c4b8a0', [0, 0, s]); B.quad([xa, pa, zo], [xb, pb, zo], [xb, pb, zi], [xa, pa, zi], '#cfc4ad', [0, 1, 0]); B.edge([xa, pa, zo], [xb, pb, zo]); B.edge([xa, pa, zi], [xb, pb, zi]);
        if (Math.round((x - BR.x0) / step) % 3 === 0) B.box(xa, pa, Math.min(zo, zi), xb, pa + hy(7), Math.max(zo, zi), '#d2c7af', { top: '#e0d7c2', edges: true }); }
      // deck stones
      if (Math.round((x - BR.x0) / step) % 2 === 0) B.quad([xa, ha + .002, z0 + .17], [xa + .012, ha + .002, z0 + .17], [xa + .012, ha + .002, z1 - .17], [xa, ha + .002, z1 - .17], '#a99e88', [0, 1, 0]);
    }
    // stone courses on the side walls, cutwaters at the central pier and the abutments
    for (const [c, w] of [[BR.mid, 1.0], [BR.mid - 6.4, .2], [BR.mid + 6.4, .2]]) for (const s of [-1, 1]) { const zz = BR.z + s * BR.w; B.prism([[c - w, zz], [c + w, zz], [c, zz + s * .45]], 0, hy(18), '#a99b80', { top: '#b9ad94', edges: true }); }
    // lanterns + banners
    for (let x = BR.x0 + 2; x < BR.x1 - 1; x += 3.2) for (const s of [-1, 1]) { const z = BR.z + s * (BR.w - .085), h = deckH(x) + hy(16); B.box(x - .02, h, z - .02, x + .02, h + hy(20), z + .02, '#3a3242'); B.sphere(x, h + hy(23), z, .035, '#ffd98a', { detail: 1, hull: O * .6 }); B.cone(x, z, .045, 0, h + hy(25), h + hy(30), 6, '#3a3242'); }
    for (let x = BR.x0 + 4; x < BR.x1 - 3; x += 2.4) { const h = deckH(x); if (h < hy(26)) continue; for (const s of [-1, 1]) { const z = BR.z + s * (BR.w + .004), c = Math.round(x) % 2 ? '#ff2e63' : '#3a7bd5'; B.quad([x - .08, h - hy(4), z], [x + .08, h - hy(4), z], [x + .08, h - hy(22), z], [x - .08, h - hy(22), z], c, [0, 0, s]); } }
    const stB = Object.assign({}, W.STYLE.get(T1), { roof: '#2f4f8f', flag: '#ffd23f', hs: 1.45 });
    for (const s of [-1, 1]) { const z = BR.z + s * (BR.w + .55), za = BR.z + s * BR.w, zb = BR.z + s * (BR.w + 1.25); B.box(BR.mid - .8, 0, Math.min(za, zb), BR.mid + .8, hy(10), Math.max(za, zb), '#a99b80', { top: '#b9ad94', edges: true }); towerB(B, BR.mid, z, .8, stB, [0, s]); }
    scene.add(B.mesh());
  }

  /* ======================= 12. District 2: little wooden bridges over the canal, lanterns, benches ======================= */
  { const B = GB(), C2 = W.C2, P2R = W.P2R;
    for (let q = 0; q < 4; q++) { const a = .12 + q * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), r0 = P2R - 1.75, r1 = P2R + .25, n = 12, w = .36;
      const at = (r, y, side) => [C2[0] + c * r - s * side, y, C2[1] + s * r + c * side], arc = t => hy(3) + Math.sin(t * Math.PI) * hy(9);
      for (let k = 0; k < n; k++) { const t0 = k / n, t1 = (k + 1) / n, ra = lerp(r0, r1, t0), rb = lerp(r0, r1, t1);
        B.quad(at(ra, arc(t0), -w), at(rb, arc(t1), -w), at(rb, arc(t1), w), at(ra, arc(t0), w), k % 2 ? '#b07a46' : '#a56f3f', [0, 1, 0]);
        for (const sd of [-1, 1]) { B.quad(at(ra, arc(t0) - hy(3), sd * w), at(rb, arc(t1) - hy(3), sd * w), at(rb, arc(t1), sd * w), at(ra, arc(t0), sd * w), '#6b4a2e', [-s * sd, 0, c * sd]); B.tube(at(ra, arc(t0) + hy(13), sd * (w - .02)), at(rb, arc(t1) + hy(13), sd * (w - .02)), .008, '#6b4a2e', { n: 5, caps: false });
          if (k % 3 === 0) B.box(...(p => [p[0] - .014, p[1], p[2] - .014, p[0] + .014, p[1] + hy(13), p[2] + .014])(at(ra, arc(t0), sd * (w - .02))), '#6b4a2e'); } }
      for (const sd of [-1, 1]) { const p = at(r1, arc(1), sd * (w - .02)); B.box(p[0] - .014, p[1], p[2] - .014, p[0] + .014, p[1] + hy(13), p[2] + .014, '#6b4a2e'); } }
    for (let q = 0; q < 4; q++) { const b = .12 + q * Math.PI / 2, lu = C2[0] + Math.cos(b + .32) * 3, lv = C2[1] + Math.sin(b + .32) * 3, bu = C2[0] + Math.cos(b - .4) * 2.4, bv = C2[1] + Math.sin(b - .4) * 2.4; MD.lampPlaza(B, lu, lv); MD.bench(B, bu, bv, faceTo(bu, bv, C2[0], C2[1])); circ(bu, bv, .2); }
    scene.add(B.mesh()); }

  /* ======================= 13. boats on the river ======================= */
  for (const [s, c] of [[-30, '#e2483a'], [22, '#ffd23f'], [55, '#4da3ff']]) { const k = Math.round((s + 170) / 1.5), p = W.RIVER[k], q = W.RIVER[k + 1]; if (!p || !q) continue; const bt = MD.boat(c); bt.position.set(p[0] + 1.6, 0, p[1]); bt.rotation.y = -Math.atan2(q[1] - p[1], q[0] - p[0]); scene.add(bt); anim.push(t => { bt.position.y = .012 + Math.sin(t * 1.3 + s) * .012; bt.rotation.z = Math.sin(t * .9 + s) * .03; }); }

  buildTrees();
  for (const k in TQS) scene.add(TQS[k].mesh());

  /* ======================= 14. labels while walking: Benny + the names of the houses right next to you (site tag style) ======================= */
  const proj = new T3.Vector3();
  function toScreen(x, y, z, camera) { proj.set(x, y, z).project(camera); if (proj.z > 1 || proj.z < -1) return null; return [(proj.x + 1) / 2 * innerWidth, (1 - proj.y) / 2 * innerHeight]; }
  const near = [];
  function drawLabels(camera, bn) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1;
    const e = camera.position, f = new T3.Vector3(); camera.getWorldDirection(f);
    if (bn.dist < 8) { const p = toScreen(3.5, .02 + .62, 3.62, camera); if (p) tag(p[0], p[1], bn.waving ? '👋 hi!' : 'BENNY · €' + (TOWN.bankCents / 100).toFixed(2), '#ff6b8b', 1); }
    near.length = 0;
    for (const h of HS) { const dx = h.i - e.x, dz = h.j - e.z; if (Math.abs(dx) > 3.2 || Math.abs(dz) > 3.2) continue; const d = Math.hypot(dx, dz); if (d > 3.2 || dx * f.x + dz * f.z < .2) continue; near.push([d, h]); }
    near.sort((a, b) => a[0] - b[0]);
    for (const [d, h] of near.slice(0, 6)) { const p = toScreen(h.i, WH + RH + .1, h.j, camera); if (!p || p[1] < 30) continue; ctx.globalAlpha = clamp((3.2 - d) / .8, 0, 1); tag(p[0], p[1], '@' + trunc(h.name, 16), h.og ? '#ffd23f' : '#3ddc84', .9); }
    ctx.globalAlpha = 1;
  }

  /* ======================= 15. camera: walking through the streets (an iso camera is kept for videos) ======================= */
  const ortho = new T3.OrthographicCamera(-1, 1, 1, -1, 1, 3000), persp = new T3.PerspectiveCamera(62, 1, .02, 60);
  const view = { mode: 'walk', u: 3.6, v: 3.6, z: .55, az: Math.PI / 4, el: Math.PI / 6, walk: { x: 2.7, z: 4.75, yaw: 2.51, pitch: .02, h: .3 } };
  W3D.view = view;
  function groundH(x, z) {
    if (Math.abs(z - BR.z) < BR.w && x > BR.x0 && x < BR.x1) return deckH(x);
    const dx = x - W.C2[0], dz = z - W.C2[1]; if (Math.abs(dx) < W.P2R + 1 && Math.abs(dz) < W.P2R + 1) for (let q = 0; q < 4; q++) { const a = .12 + q * Math.PI / 2, ux = Math.cos(a), uz = Math.sin(a), along = dx * ux + dz * uz, perp = Math.abs(-dx * uz + dz * ux), r0 = W.P2R - 1.75, r1 = W.P2R + .25;
      if (along > r0 && along < r1 && perp < .4) { const t = (along - r0) / (r1 - r0); return hy(3) + Math.sin(t * Math.PI) * hy(9); } }
    return 0;
  }
  function apply() {
    const w = innerWidth, h = innerHeight;
    if (view.mode === 'iso') { const dir = v3(Math.cos(view.el) * Math.cos(view.az), Math.sin(view.el), Math.cos(view.el) * Math.sin(view.az)); ortho.left = -w / 2 / PPU; ortho.right = w / 2 / PPU; ortho.top = h / 2 / PPU; ortho.bottom = -h / 2 / PPU; ortho.zoom = view.z; const tgt = v3(view.u, view.ty || 0, view.v); ortho.position.copy(tgt).addScaledVector(dir, 900); ortho.lookAt(tgt); ortho.updateProjectionMatrix(); }
    const wk = view.walk, eye = v3(wk.x, groundH(wk.x, wk.z) + wk.h + Math.sin(wk.bob || 0) * .006, wk.z); persp.aspect = w / h; persp.position.copy(eye); persp.lookAt(eye.x + Math.sin(wk.yaw) * Math.cos(wk.pitch), eye.y + Math.sin(wk.pitch), eye.z + Math.cos(wk.yaw) * Math.cos(wk.pitch)); persp.updateProjectionMatrix();
  }
  // walking: only on streets, squares, the bridge and through open gates; not through houses, walls, water or objects
  const inT2Square = (x, z) => { const d = Math.hypot(x - W.C2[0], z - W.C2[1]); if (d < W.P2R - 1.65) return true; if (d > W.P2R - .45 && d < W.P2R + W.M + .5) return true; for (let q = 0; q < 4; q++) { const a = .12 + q * Math.PI / 2, ux = Math.cos(a), uz = Math.sin(a), dx = x - W.C2[0], dz = z - W.C2[1], along = dx * ux + dz * uz, perp = Math.abs(-dx * uz + dz * ux); if (along > W.P2R - 1.9 && along < W.P2R + .5 && perp < .3) return true; } return false; };
  function walkable(x, z) {
    let ok = false;
    for (const T of [T1, T2]) if (T.SH.near(x, z, .5).d < .5) { ok = true; break; }
    if (!ok && W.lmSDF(x, z) < W.M - .3) ok = true;
    if (!ok && inT2Square(x, z)) ok = true;
    if (!ok && Math.abs(z - BR.z) < BR.w - .25 && x > BR.x0 - .5 && x < BR.x1 + .5) ok = true;
    if (!ok) return false;
    for (const c of colliders) {
      if (c.c && Math.hypot(x - c.c[0], z - c.c[1]) < c.c[2]) return false;
      if (c.b && x > c.b[0] - .05 && x < c.b[2] + .05 && z > c.b[1] - .05 && z < c.b[3] + .05) return false;
      if (c.e && ((x - c.e[0]) / c.e[2]) ** 2 + ((z - c.e[1]) / c.e[3]) ** 2 < 1) return false;
      if (c.ob) { const o = c.ob, dx = x - o.c[0], dz = z - o.c[1], s = dx * o.t[0] + dz * o.t[1], d = dx * o.n[0] + dz * o.n[1]; if (s > o.s0 - .06 && s < o.s1 + .06 && d > o.d0 - .06 && d < o.d1 + .06) return false; }
    }
    return true;
  }
  W3D.walkable = walkable;

  /* ======================= 16. input: joystick to walk, drag anywhere to look around (keys on a computer) ======================= */
  const el = renderer.domElement, ptrs = new Map();
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); });
  const up = e => ptrs.delete(e.pointerId); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('pointermove', e => { if (!ptrs.has(e.pointerId)) return; const p = ptrs.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]); view.walk.yaw -= dx * .006; view.walk.pitch = clamp(view.walk.pitch - dy * .004, -.9, .7); });
  el.addEventListener('contextmenu', e => e.preventDefault());
  const keys = new Set(); addEventListener('keydown', e => { if (!W3D.on || (document.activeElement && document.activeElement.tagName === 'INPUT')) return; keys.add(e.key.toLowerCase()); if (e.key === 'Escape') exitWalk(); }); addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
  const joyEl = $('joy'), joy = { on: false, id: null, x: 0, y: 0 };
  joyEl.addEventListener('pointerdown', e => { joyEl.setPointerCapture(e.pointerId); joy.on = true; joy.id = e.pointerId; joyMove(e); e.stopPropagation(); });
  const joyMove = e => { if (!joy.on) return; const r = joyEl.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.min(1, Math.hypot(dx, dy) / 46), a = Math.atan2(dy, dx); joy.x = Math.cos(a) * d; joy.y = Math.sin(a) * d; joyEl.firstChild.style.transform = `translate(${joy.x * 36}px,${joy.y * 36}px)`; };
  joyEl.addEventListener('pointermove', joyMove);
  const joyEnd = () => { joy.on = false; joy.x = joy.y = 0; joyEl.firstChild.style.transform = ''; }; joyEl.addEventListener('pointerup', joyEnd); joyEl.addEventListener('pointercancel', joyEnd);

  /* ======================= 17. sky, time of day and weather — the very same as on the map (real time, weather changes every 3 hours) ======================= */
  const TINT_N = new T3.Color(.36, .4, .68), basics = [];
  scene.traverse(o => { if (o.material && o.material.isMeshBasicMaterial && o.material.map && o.material.blending !== T3.AdditiveBlending) basics.push(o.material); });
  scene.fog = new T3.Fog(col('#a9dcf5').clone(), 18, 46);
  const ENV = (() => {
    const C3 = h => new T3.Color(h);
    const SK = { dT: C3('#5aa9e6'), dH: C3('#c4e6f6'), kT: C3('#3e4c8c'), kH: C3('#ff9a62'), nT: C3('#040820'), nH: C3('#16214a'), gD: C3('#a3acb8'), gN: C3('#1d222e') };
    const GREY = { clear: 0, cloudy: .55, fog: .85, rain: .72, storm: .9, snow: .6 }, FOGD = { clear: [18, 46], cloudy: [15, 42], fog: [3, 15], rain: [9, 30], storm: [7, 25], snow: [6, 24] };
    const texC = (w, f) => { const c = document.createElement('canvas'); c.width = c.height = w; f(c.getContext('2d'), w); const t = new T3.CanvasTexture(c); return t; };
    // the sky: a dome around the camera (horizon colour = fog colour, so the town fades into it)
    const skyU = { uTop: { value: new T3.Color() }, uHor: { value: new T3.Color() } };
    const sky = new T3.Mesh(new T3.SphereGeometry(52, 32, 16), new T3.ShaderMaterial({ uniforms: skyU, side: T3.BackSide, depthWrite: false, depthTest: false,
      vertexShader: 'varying float vy; void main(){ vy = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
      fragmentShader: 'uniform vec3 uTop; uniform vec3 uHor; varying float vy; void main(){ gl_FragColor = vec4(mix(uHor, uTop, smoothstep(-.02, .5, vy)), 1.); }' }));
    sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);
    // sun, moon, stars
    const sun = new T3.Sprite(new T3.SpriteMaterial({ map: texC(128, (g, w) => { const r = g.createRadialGradient(64, 64, 2, 64, 64, 64); r.addColorStop(0, 'rgba(255,253,235,1)'); r.addColorStop(.16, 'rgba(255,246,200,1)'); r.addColorStop(.22, 'rgba(255,220,140,.55)'); r.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); }), transparent: true, depthWrite: false, fog: false }));
    sun.scale.set(13, 13, 1); scene.add(sun);
    const moon = new T3.Sprite(new T3.SpriteMaterial({ map: texC(128, (g, w) => { const r = g.createRadialGradient(64, 64, 10, 64, 64, 64); r.addColorStop(0, 'rgba(200,215,255,.35)'); r.addColorStop(1, 'rgba(200,215,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w);
      g.beginPath(); g.arc(64, 64, 18, 0, 6.29); g.fillStyle = '#f3f1e4'; g.fill(); g.fillStyle = 'rgba(180,176,160,.55)'; for (const [x, y, rr] of [[58, 58, 4], [70, 66, 3], [61, 72, 2.4], [71, 55, 2]]) { g.beginPath(); g.arc(x, y, rr, 0, 6.29); g.fill(); } }), transparent: true, depthWrite: false, fog: false }));
    moon.scale.set(6, 6, 1); scene.add(moon);
    const stars = (() => { const g = new T3.BufferGeometry(), p = [], r = seeded(17); for (let k = 0; k < 700; k++) { const a = r() * 6.2832, y = .08 + r() * .92, h = Math.sqrt(1 - y * y); p.push(Math.cos(a) * h * 46, y * 46, Math.sin(a) * h * 46); }
      g.setAttribute('position', new T3.Float32BufferAttribute(p, 3)); const m = new T3.PointsMaterial({ color: 0xffffff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false }); const o = new T3.Points(g, m); o.frustumCulled = false; scene.add(o); return o; })();
    // clouds drifting high up (white by day, grey in bad weather, dark at night)
    const cloudTex = texC(256, (g, w) => { const r = seeded(3); for (let k = 0; k < 14; k++) { const x = 50 + r() * 156, y = 110 + (r() - .5) * 50, rr = 26 + r() * 34, gr = g.createRadialGradient(x, y, 2, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.65, 'rgba(255,255,255,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); } });
    const clouds = []; { const r = seeded(23); for (let k = 0; k < 28; k++) { const m = new T3.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, opacity: 0 }), o = new T3.Sprite(m); const s = 10 + r() * 9; o.scale.set(s * 1.7, s, 1); scene.add(o); clouds.push({ o, a: r() * 6.2832, d: 28 + r() * 15, h: k < 6 ? 10 + r() * 8 : 6.5 + r() * 7, sp: .006 + r() * .006, k }); } }
    // rain + snow: particles in a box that wraps around you (they stay put in the world while you walk)
    function precip(n, snow) {
      const seed = [], corner = [], r = seeded(snow ? 71 : 73);
      for (let k = 0; k < n; k++) { const sd = [r(), r(), r()]; for (const c of [[-1, 0], [1, 0], [1, 1], [-1, 0], [1, 1], [-1, 1]]) { seed.push(...sd); corner.push(...c); } }
      const g = new T3.BufferGeometry(); g.setAttribute('position', new T3.Float32BufferAttribute(new Float32Array(n * 18), 3)); g.setAttribute('aSeed', new T3.Float32BufferAttribute(seed, 3)); g.setAttribute('aCorner', new T3.Float32BufferAttribute(corner, 2));
      const U = { uCam: { value: new T3.Vector3() }, uTime: { value: 0 }, uWind: { value: new T3.Vector2(.5, .25) }, uCol: { value: new T3.Color(1, 1, 1) }, uA: { value: 0 } };
      const m = new T3.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, side: T3.DoubleSide,
        vertexShader: `attribute vec3 aSeed; attribute vec2 aCorner; uniform vec3 uCam; uniform float uTime; uniform vec2 uWind; varying vec2 vUv;
          void main(){ vec3 B = vec3(${snow ? '11., 5.5, 11.' : '13., 6., 13.'}); float sp = ${snow ? '.55 + aSeed.x * .4' : '7.5 + aSeed.z * 3.'};
            vec3 w = vec3(uWind.x, 0., uWind.y) * uTime${snow ? ' * .5 + vec3(sin(uTime * 1.3 + aSeed.y * 40.), 0., cos(uTime * 1.1 + aSeed.x * 30.)) * .22' : ''};
            vec3 p = vec3(uCam.x + (fract(aSeed.x - (uCam.x - w.x) / B.x) - .5) * B.x, uCam.y - 1.2 + fract(aSeed.y - uTime * sp / B.y) * B.y, uCam.z + (fract(aSeed.z - (uCam.z - w.z) / B.z) - .5) * B.z);
            vec3 toC = p - cameraPosition; float hd = length(toC.xz); if (hd < .9) { p.xz += toC.xz / max(hd, .001) * (.9 - hd); toC = p - cameraPosition; } vec3 rt = normalize(vec3(-toC.z, 0., toC.x) + 1e-5);
            ${snow ? 'float s = .016 + aSeed.y * .016; vec3 up = normalize(cross(rt, toC)); p += rt * aCorner.x * s + up * (aCorner.y * 2. - 1.) * s;'
                   : 'p += rt * aCorner.x * .0055 + normalize(vec3(uWind.x, -sp, uWind.y)) * .34 * aCorner.y;'}
            vUv = vec2(aCorner.x * .5 + .5, aCorner.y); gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); }`,
        fragmentShader: `uniform vec3 uCol; uniform float uA; varying vec2 vUv; void main(){ ${snow ? 'float a = smoothstep(1., .45, length(vUv - .5) * 2.);' : 'float a = (1. - abs(vUv.x - .5) * 2.) * (.35 + .65 * vUv.y);'} gl_FragColor = vec4(uCol, a * uA); }` });
      const o = new T3.Mesh(g, m); o.frustumCulled = false; o.renderOrder = 5; scene.add(o); return { o, U, g, n };
    }
    const rain = precip(2600, false), snow = precip(1900, true);
    // warm light pools under the street lamps at night
    const pools = (() => { const L = T1.lamps.concat(T2.lamps, MK_LAMPS, [[3, .9], [.9, 3], [1.6, 1.6], [4.6, 1.6], [1.6, 4.6]]), m = new T3.MeshBasicMaterial({ color: '#ffc86e', transparent: true, opacity: 0, blending: T3.AdditiveBlending, depthWrite: false, fog: false });
      const tex = texC(64, (g, w) => { const r = g.createRadialGradient(32, 32, 1, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); }); m.map = tex;
      const o = new T3.InstancedMesh(new T3.PlaneGeometry(1.5, 1.5).rotateX(-Math.PI / 2), m, L.length); L.forEach(([u, v], k) => { Mx.compose(v3(u, .05, v), Qx.identity(), v3(1, 1, 1)); o.setMatrixAt(k, Mx); }); o.renderOrder = 4; o.frustumCulled = false; scene.add(o); return o; })();
    const st = { kind: 'clear', n: 0, dusk: 0, flash: 0, nextFlash: 3, at: -1, label: '' };
    const sunDir = (h, a, b) => { const t = clamp((h - a) / (b - a), 0, 1), el = .62 * Math.sin(t * Math.PI) - .08; return v3(Math.cos(t * Math.PI) * Math.cos(el), Math.sin(el), -Math.sin(t * Math.PI) * Math.cos(el)); };
    const tmp = new T3.Color(), top = new T3.Color(), hor = new T3.Color(), CN = C3('#2a3150'), CD = C3('#ffc7a0'), cc = new T3.Color();
    function update(t, dt, camera, force) {
      const rt = performance.now() / 1000;
      if (force || rt - st.at > 2) { st.at = rt; try { st.n = nightAmount(); st.dusk = duskAmount(); st.kind = weatherNow(); st.h = envHour(); st.sun = sunTimes(); } catch (e) {} if (!GREY.hasOwnProperty(st.kind)) st.kind = 'clear'; }
      const n = st.n, dk = st.dusk, gr = GREY[st.kind], wet = st.kind === 'rain' || st.kind === 'storm';
      // lightning
      if (st.kind === 'storm') { if (t > st.nextFlash) { st.flash = 1; st.nextFlash = t + 5 + Math.random() * 9; } } st.flash = Math.max(0, st.flash - dt * 3.2); const fl = st.flash > 0 ? st.flash * (st.flash > .55 && st.flash < .7 ? .3 : 1) : 0;
      top.copy(SK.dT).lerp(SK.nT, n).lerp(SK.kT, dk * .7); hor.copy(SK.dH).lerp(SK.nH, n).lerp(SK.kH, dk * .75);
      tmp.copy(SK.gD).lerp(SK.gN, n); top.lerp(tmp, gr); hor.lerp(tmp, gr * .92);
      if (st.kind === 'snow') hor.lerp(tmp.set(1, 1, 1), .12 * (1 - n));
      if (fl) { top.lerp(tmp.setRGB(.85, .88, 1), fl * .8); hor.lerp(tmp.setRGB(.85, .88, 1), fl * .8); }
      skyU.uTop.value.copy(top); skyU.uHor.value.copy(hor); scene.background = hor;
      const [f0, f1] = FOGD[st.kind]; scene.fog.color.copy(hor); scene.fog.near = f0; scene.fog.far = f1; W3D.SU.uFogColor.value.copy(hor); W3D.SU.uFogNear.value = f0; W3D.SU.uFogFar.value = f1;
      const tint = W3D.SU.uTint.value.setRGB(1, 1, 1).lerp(TINT_N, n); if (dk) tint.multiply(tmp.setRGB(1, 1 - .14 * dk, 1 - .26 * dk)); tint.multiplyScalar(1 - .18 * gr * (1 - n)); if (fl) tint.lerp(tmp.setRGB(1.5, 1.5, 1.7), fl * .6);
      for (const m of basics) m.color.copy(tint);
      // sky objects follow the camera
      const cp = camera.position; sky.position.copy(cp); stars.position.copy(cp);
      const [rise, set] = st.sun || [7, 17], h = st.h || 12, sd = sunDir(h, rise - .4, set + .4);
      sun.position.copy(cp).addScaledVector(sd, 44); sun.material.opacity = clamp(sd.y * 6 + .3, 0, 1) * (1 - gr * .9); sun.visible = sun.material.opacity > .01;
      const md = sunDir(clamp(((h - set + 24) % 24) / (((rise - set + 48) % 24) || 12), 0, 1), 0, 1);
      moon.position.copy(cp).addScaledVector(md, 42); moon.material.opacity = n * (st.kind === 'clear' ? 1 : st.kind === 'cloudy' ? .35 : 0); moon.visible = moon.material.opacity > .01;
      stars.material.opacity = n * (st.kind === 'clear' ? .9 : st.kind === 'cloudy' ? .12 : 0); stars.visible = stars.material.opacity > .01; stars.rotation.y = t * .004;
      const nc = { clear: 6, cloudy: 28, rain: 28, storm: 28, snow: 22, fog: 0 }[st.kind]; cc.setRGB(1, 1, 1).lerp(SK.gD, gr * .9).lerp(CN, n * .85).lerp(CD, dk * .5 * (1 - n));
      for (const c of clouds) { const vis = c.k < nc; c.o.visible = vis; if (!vis) continue; const a = c.a + t * c.sp; c.o.position.set(cp.x + Math.cos(a) * c.d, cp.y + c.h, cp.z + Math.sin(a) * c.d); c.o.material.color.copy(cc); c.o.material.opacity = (st.kind === 'clear' ? .8 : .95) * (1 - n * .35); }
      // rain + snow
      for (const [P, on] of [[rain, wet], [snow, st.kind === 'snow']]) { P.o.visible = on; if (!on) continue; P.U.uTime.value = t; P.U.uCam.value.copy(cp); P.g.setDrawRange(0, (P === rain && st.kind !== 'storm' ? 1600 : P.n) * 6); }
      rain.U.uCol.value.setRGB(.75, .82, 1).lerp(tmp.setRGB(.5, .56, .8), n); rain.U.uA.value = .55 - .15 * n; snow.U.uCol.value.setRGB(1, 1, 1).lerp(tmp.setRGB(.7, .76, .95), n * .6); snow.U.uA.value = .95;
      if (st.kind === 'storm') rain.U.uWind.value.set(1.6, .7); else rain.U.uWind.value.set(.5, .25);
      // night lights
      pools.material.opacity = .42 * n; pools.visible = n > .02; BEAM_M.opacity = .5 * n;
      // the chip with time + weather
      if (force || window.ENV_FORCE || rt - (st.chipAt || -99) > 10) { st.chipAt = rt; window.ENV_FORCE = 0; const el = $('walkEnv'); if (el) el.textContent = envLabel(); }
    }
    return { update, st, rain, snow, clouds };
  })();
  W3D.ENV = ENV;

  /* ======================= 18. the loop (runs only while walking) ======================= */
  let last = 0, tAcc = 0, raf = 0, bnState = { dist: 99, waving: false };
  function frame3D(now) {
    const dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; tAcc += dt; S.T += dt;
    const wk = view.walk; let fx = -joy.y, sx = joy.x; if (keys.has('w') || keys.has('arrowup')) fx += 1; if (keys.has('s') || keys.has('arrowdown')) fx -= 1; if (keys.has('a')) sx -= 1; if (keys.has('d')) sx += 1; if (keys.has('arrowleft')) wk.yaw += dt * 1.8; if (keys.has('arrowright')) wk.yaw -= dt * 1.8;
    const run = Math.hypot(joy.x, joy.y) > .92 || keys.has('shift'), sp = (run ? 2.6 : 1.25) * dt, mx = (Math.sin(wk.yaw) * fx - Math.cos(wk.yaw) * sx) * sp, mz = (Math.cos(wk.yaw) * fx + Math.sin(wk.yaw) * sx) * sp;
    if (mx || mz) { if (walkable(wk.x + mx, wk.z + mz)) { wk.x += mx; wk.z += mz; } else if (walkable(wk.x + mx, wk.z)) wk.x += mx; else if (walkable(wk.x, wk.z + mz)) wk.z += mz; wk.bob = (wk.bob || 0) + Math.hypot(mx, mz) * 22; }
    for (const f of anim) f(tAcc, dt);
    apply();
    const camera = view.mode === 'iso' ? ortho : persp;
    bnState = MD.bennyTick(benny, tAcc, dt, camera.position);
    ENV.update(tAcc, dt, camera);
    if (renderer.domElement.width !== Math.round(innerWidth * renderer.getPixelRatio()) || renderer.domElement.height !== Math.round(innerHeight * renderer.getPixelRatio())) renderer.setSize(innerWidth, innerHeight, false);
    renderer.domElement.style.width = innerWidth + 'px'; renderer.domElement.style.height = innerHeight + 'px';
    renderer.render(scene, camera); drawLabels(camera, bnState);
    if (W3D.on) raf = requestAnimationFrame(frame3D);
  }
  // nearest free spot on a street, searching outwards in rings from (u, v)
  function spawnNear(u, v, maxR) {
    if (walkable(u, v)) return [u, v];
    for (let r = .25; r <= maxR; r += .25) { const n = Math.ceil(2 * Math.PI * r / .25);
      for (let k = 0; k < n; k++) { const a = k / n * 2 * Math.PI, x = u + Math.cos(a) * r, z = v + Math.sin(a) * r; if (walkable(x, z)) return [x, z]; } }
    return null;
  }
  function enterWalk(at) {
    const wk = view.walk; Object.assign(wk, { x: 2.7, z: 4.75, yaw: 2.51, pitch: .02, bob: 0 }); view.mode = 'walk';
    if (at) { let sp = null;
      if (at.house) for (let r = 2; r <= 4.5 && !sp; r += .25) for (let k = 0; k < 48; k++) { const a = k / 48 * 6.2832, x = at.u + Math.cos(a) * r, z = at.v + Math.sin(a) * r; if (walkable(x, z)) { sp = [x, z]; break; } }   // a few steps away, so the whole house is in view
      if (!sp) sp = spawnNear(at.u, at.v, at.house ? 6 : 30);
      if (sp) { const dx = at.u - sp[0], dz = at.v - sp[1], far = Math.hypot(dx, dz) > .35;
        let yaw = Math.atan2(dx, dz);
        if (!at.house) { let best = -1e9; for (let k = 0; k < 32; k++) { const a = k / 32 * 6.2832, ux = Math.sin(a), uz = Math.cos(a); let d = 0; while (d < 7 && walkable(sp[0] + ux * (d + .25), sp[1] + uz * (d + .25))) d += .25;
            const sc = d + 1.4 * (ux * -.7071 + uz * -.7071) + (far ? 2 * (ux * dx + uz * dz) / Math.hypot(dx, dz) : 0); if (sc > best) { best = sc; yaw = a; } } }
        Object.assign(wk, { x: sp[0], z: sp[1], yaw, pitch: at.house ? .12 : .02 }); } }
    W3D.on = true; window.__walking = true; document.body.classList.add('walking');
    el.style.display = 'block'; Object.assign(cv.style, { zIndex: 2, pointerEvents: 'none' });
    const hint = $('walkHint'); hint.classList.remove('off'); clearTimeout(enterWalk.t); enterWalk.t = setTimeout(() => hint.classList.add('off'), 4000);
    apply(); ENV.update(tAcc, 0, persp, true); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame3D);
  }
  function exitWalk() {
    if (!W3D.on) return; W3D.on = false; window.__walking = false; cancelAnimationFrame(raf); joyEnd(); keys.clear();
    el.style.display = 'none'; Object.assign(cv.style, { zIndex: '', pointerEvents: '' }); document.body.classList.remove('walking');
    resize(); frame.force = true;
  }
  W3D.enter = enterWalk; W3D.exit = exitWalk; W3D.apply = apply; W3D.ortho = ortho; W3D.persp = persp; W3D.HS = HS; W3D.LOD = LOD; W3D.frame = frame3D;
  // the 2D map keeps its camera and canvas
  cam.x = keep.x; cam.y = keep.y; cam.z = keep.z; resize(); frame.force = true;
  for (const o of LOD.near.concat(LOD.mid, LOD.near2)) o.visible = true; for (const o of LOD.far) o.visible = false;
  window.__3d = { view, set(o) { const wk = o.walk; delete o.walk; Object.assign(view, o); if (wk) Object.assign(view.walk, wk); }, walkable, ready: true };
  W3D.built = true;
}
/* the Walk button: build the 3D streets the first time (a few seconds), then stand next to Benny */
async function startWalk() {
  if (startWalk.busy) return; startWalk.busy = true; const ld = $('walkLoad');
  try {
    if (!W3D.built) { ld.classList.add('on'); await loadThree(); await new Promise(r => setTimeout(r, 60)); build3D(); }
    // spawn where the map is looking — or in front of the house that is open
    const at = selected ? { u: selected.i, v: selected.j, house: true } : { u: cam.x / TW + cam.y / TH, v: cam.y / TH - cam.x / TW };
    hideCard(); selected = null; W3D.enter(at);
  } catch (e) { console.error(e); ld.textContent = 'Could not open the street view 😢'; setTimeout(() => ld.classList.remove('on'), 2500); startWalk.busy = false; return; }
  ld.classList.remove('on'); startWalk.busy = false;
}
