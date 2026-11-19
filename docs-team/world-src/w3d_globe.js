/* ================= GLOBE: zoom out past the whole town and the map turns into Benny's little planet ================= */
const GLOBE = { on: false, built: false, busy: false };
(function () {
  let r, sc, cam3, world, base, glowSpr, el, raf = 0, last = 0, t = 0, ambL, sunL;
  const st = { yaw: 0, pitch: 0, dist: 9.6, goal: 9.6, mode: 'idle', k: 0 };
  const TOWN_DIR = [.25, .45, .86];
  function build() {
    const T = THREE; el = document.getElementById('globe');
    r = new T.WebGLRenderer({ antialias: true }); r.setPixelRatio(Math.min(2, devicePixelRatio || 1)); el.insertBefore(r.domElement, el.firstChild);
    sc = new T.Scene(); cam3 = new T.PerspectiveCamera(38, 1, .1, 100);
    { const g = new T.BufferGeometry(), p = [], rs = seeded(11); for (let k = 0; k < 900; k++) { const v = new T.Vector3(rs() - .5, rs() - .5, rs() - .5).normalize().multiplyScalar(30 + rs() * 20); p.push(v.x, v.y, v.z); } g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); sc.add(new T.Points(g, new T.PointsMaterial({ color: 0xffffff, size: .08 }))); }
    const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }, sm = q => q * q * (3 - 2 * q);
    const noise = (x, y, z) => { const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi); let v = 0; for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) v += hash(xi + a, yi + b, zi + c) * (a ? xf : 1 - xf) * (b ? yf : 1 - yf) * (c ? zf : 1 - zf); return v; };
    const fbm = (x, y, z) => { let v = 0, a = .5, f = 1; for (let o = 0; o < 5; o++) { v += a * noise(x * f, y * f, z * f); a *= .5; f *= 2; } return v; };
    const TD = new T.Vector3(...TOWN_DIR).normalize(), VOL = new T.Vector3(-.7, -.2, .68).normalize(), C = h => new T.Color(h);
    const BI = { deep: C('#1d4f8f'), sea: C('#2f7dc9'), sand: C('#e2cf8d'), grass: C('#5fa55a'), forest: C('#2f6f3d'), dark: C('#2b2f3a'), rock: C('#8b8170'), snow: C('#eef3f8'), lava: C('#c4421f') };
    const geo = new T.IcosahedronGeometry(1.6, 40), pos = geo.attributes.position, col = [];
    for (let i = 0; i < pos.count; i++) {
      const v = new T.Vector3().fromBufferAttribute(pos, i).normalize(), dT = v.dot(TD);
      let e = fbm(v.x * 2.2 + 5, v.y * 2.2, v.z * 2.2); if (dT > .8) e = e + (.52 - e) * T.MathUtils.smoothstep(dT, .8, .93); const m = fbm(v.x * 4 + 9, v.y * 4, v.z * 4);
      let bc, h = 0;
      if (e < .44) bc = e < .38 ? BI.deep : BI.sea; else if (e < .47) { bc = BI.sand; h = .008; } else if (e < .6) { bc = m > .55 ? BI.forest : BI.grass; h = .015 + (e - .47) * .15; } else if (e < .68) { bc = BI.rock; h = .04 + (e - .6) * .6; } else { bc = BI.snow; h = .09 + (e - .68) * .4; }
      if (Math.abs(v.y) > .9) bc = BI.snow;
      const vol = v.distanceTo(VOL); if (vol < .22 && e > .44) { bc = vol < .07 ? BI.lava : BI.dark; h = .02 + (.22 - vol) * .4; }
      v.multiplyScalar(1.6 * (1 + h)); pos.setXYZ(i, v.x, v.y, v.z); col.push(bc.r, bc.g, bc.b);
    }
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
    world = new T.Group(); world.add(new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .9 }))); sc.add(world);
    // fog of war: the rest of the planet is still undiscovered
    const fg = new T.IcosahedronGeometry(1.6 * 1.14, 26), fp = fg.attributes.position, fc = [], fa = [];
    for (let i = 0; i < fp.count; i++) { const v = new T.Vector3().fromBufferAttribute(fp, i).normalize(), d = v.dot(TD), n = fbm(v.x * 3 + 2, v.y * 3, v.z * 3), clear = T.MathUtils.smoothstep(d, .78, .93) + (n - .5) * .25; fa.push(1 - T.MathUtils.clamp(clear * 1.4, 0, 1)); const s = .25 + n * .35; fc.push(s * .55, s * .55, s * .75); }
    fg.setAttribute('fc', new T.Float32BufferAttribute(fc, 3)); fg.setAttribute('a', new T.Float32BufferAttribute(fa, 1));
    world.add(new T.Mesh(fg, new T.ShaderMaterial({ transparent: true, depthWrite: false,
      vertexShader: 'attribute float a; attribute vec3 fc; varying float va; varying vec3 vc; void main(){ va=a; vc=fc; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying float va; varying vec3 vc; void main(){ gl_FragColor=vec4(vc, va*.94); }' })));
    sc.add(new T.Mesh(new T.SphereGeometry(1.6 * 1.26, 48, 48), new T.ShaderMaterial({ transparent: true, side: T.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 n; void main(){ n=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec3 n; void main(){ float i=pow(max(0.,.62-dot(n,vec3(0.,0.,1.))),2.); gl_FragColor=vec4(.35,.6,1.,1.)*i*.8; }' })));
    // the town: walled circle, one little block per ~50 tenants, District 2 next to it
    const tp = TD.clone().multiplyScalar(1.6 * 1.045), town = new T.Group(); town.position.copy(tp); town.lookAt(tp.clone().multiplyScalar(2)); world.add(town);
    town.add(new T.Mesh(new T.TorusGeometry(.2, .018, 6, 48), new T.MeshStandardMaterial({ color: '#d6ccb6', flatShading: true })));
    const rs = seeded(5), cols = ['#e2483a', '#4da3ff', '#ffd23f', '#c77dff', '#ff8a3d', '#3ddc84'], n1 = Math.min(140, Math.ceil(Math.min(HOUSES.length, 5000) / 40)), n2 = Math.min(90, Math.ceil(Math.max(0, HOUSES.length - 5000) / 12));
    const bx = new T.BoxGeometry(.022, .022, .03), mats = cols.map(c => new T.MeshStandardMaterial({ color: c }));
    for (let k = 0; k < n1; k++) { const a = rs() * 6.28, rr = Math.sqrt(rs()) * .18, h = new T.Mesh(bx, mats[k % mats.length]); h.position.set(Math.cos(a) * rr, Math.sin(a) * rr, .01); town.add(h); }
    for (let k = 0; k < n2; k++) { const a = .5 + rs() * .9, rr = .24 + rs() * .07, h = new T.Mesh(bx, mats[k % mats.length]); h.position.set(Math.cos(a) * rr, Math.sin(a) * rr, .01); town.add(h); }
    const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,220,140,1)'); gr.addColorStop(.4, 'rgba(255,190,90,.45)'); gr.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    glowSpr = new T.Sprite(new T.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); glowSpr.scale.set(.6, .6, 1); glowSpr.position.copy(TD.clone().multiplyScalar(1.6 * 1.12)); world.add(glowSpr);
    const red = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: '#ff3355', transparent: true, depthWrite: false, blending: T.AdditiveBlending })); red.scale.set(.35, .35, 1); red.position.copy(VOL.clone().multiplyScalar(1.6 * 1.2)); world.add(red);
    ambL = new T.AmbientLight(0xffffff, .55); sc.add(ambL); sunL = new T.DirectionalLight(0xfff2dd, 1.25); sunL.position.set(4, 3, 5); sc.add(sunL);
    base = new T.Quaternion().setFromUnitVectors(TD, new T.Vector3(0, .25, 1).normalize());
    input(); GLOBE.built = true;
  }
  function size() { const w = innerWidth, h = innerHeight; r.setSize(w, h); cam3.aspect = w / h; cam3.fov = w / h < .7 ? 44 : 34; cam3.updateProjectionMatrix(); }
  function input() {
    const cvg = r.domElement, P = new Map(); let pinch0 = 0, d0 = 0, moved = 0;
    cvg.style.touchAction = 'none';
    cvg.addEventListener('pointerdown', e => { cvg.setPointerCapture(e.pointerId); P.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; if (P.size === 2) { const [a, b] = [...P.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); d0 = st.goal; } });
    cvg.addEventListener('pointermove', e => { if (!P.has(e.pointerId)) return; const p = P.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; P.set(e.pointerId, [e.clientX, e.clientY]);
      if (P.size === 1) { st.yaw += dx * .006; st.pitch = clamp(st.pitch + dy * .006, -1.2, 1.2); moved += Math.abs(dx) + Math.abs(dy); }
      else if (P.size === 2) { const [a, b] = [...P.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); st.goal = clamp(d0 * pinch0 / Math.max(20, d), 5.2, 16); moved += 99; if (st.goal <= 5.6) dive(); } });
    const up = e => { const was = P.size; P.delete(e.pointerId); if (was === 1 && moved < 8) tap(e.clientX, e.clientY); };
    cvg.addEventListener('pointerup', up); cvg.addEventListener('pointercancel', e => P.delete(e.pointerId));
    cvg.addEventListener('wheel', e => { e.preventDefault(); st.goal = clamp(st.goal * Math.exp(e.deltaY * .0012), 5.2, 16); if (e.deltaY < 0 && st.goal <= 6.2) dive(); }, { passive: false });
    document.getElementById('globeBack').addEventListener('click', dive);
  }
  function tap(x, y) { // tap on (or near) the town light → fly back down
    const v = glowSpr.getWorldPosition(new THREE.Vector3()).project(cam3), sx = (v.x + 1) / 2 * innerWidth, sy = (1 - v.y) / 2 * innerHeight;
    if (Math.hypot(sx - x, sy - y) < Math.min(innerWidth, innerHeight) * .2) dive();
  }
  function dive() { if (st.mode !== 'on') return; st.mode = 'dive'; st.k = 0; }
  function frameG(now) {
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; t += dt;
    if (st.mode === 'in') { st.k = Math.min(1, st.k + dt / .9); st.dist = 4.4 + (st.goal - 4.4) * (1 - Math.pow(1 - st.k, 3)); if (!st.first) el.style.opacity = Math.min(1, st.k * 2.2); if (st.k >= 1) st.mode = 'on'; }
    else if (st.mode === 'on') { st.dist += (st.goal - st.dist) * (1 - Math.exp(-dt * 6)); if (!GLOBE.drag) st.yaw += dt * .05; }
    else if (st.mode === 'dive') { st.k = Math.min(1, st.k + dt / .75); const e = st.k * st.k; st.dist = st.dist + (2.05 - st.dist) * e * .35; st.yaw *= 1 - e * .3; st.pitch *= 1 - e * .3; el.style.opacity = 1 - Math.max(0, (st.k - .55) / .45); if (st.k >= 1) { leave(); return; } }
    if (r.domElement.clientWidth !== innerWidth || r.domElement.clientHeight !== innerHeight) size();
    world.quaternion.copy(base); world.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), st.pitch); world.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), st.yaw);
    cam3.position.set(0, .7 * st.dist / 9.6, st.dist); cam3.lookAt(0, 0, 0);
    if (t - (st.lt == null ? -9 : st.lt) > 2) { st.lt = t; let n = 0, h = 12; try { n = nightAmount(); h = envHour(); } catch (e) {}   // the planet has day and night too
      const a = (h - 12) / 24 * 6.2832; sunL.position.set(Math.sin(a) * 5 + 1.5, 3, Math.cos(a) * 5); sunL.intensity = 1.25 - .45 * n; sunL.color.set(n > .5 ? '#a9b8ff' : '#fff2dd'); ambL.intensity = .55 - .15 * n; st.n = n; }
    glowSpr.scale.setScalar((.6 + .25 * (st.n || 0)) * (1 + .08 * Math.sin(t * 2.4)));
    r.render(sc, cam3); raf = requestAnimationFrame(frameG);
  }
  async function enter(first) {
    if (GLOBE.on || GLOBE.busy) return; GLOBE.busy = true; el = document.getElementById('globe');
    if (first) { el.style.display = 'block'; el.style.opacity = 1; document.body.classList.add('globe'); window.__globe = true; }
    try { await loadThree(); if (!GLOBE.built) build(); } catch (e) { console.error(e); GLOBE.busy = false; el.style.display = 'none'; document.body.classList.remove('globe'); window.__globe = false; frame.force = true; return; }
    GLOBE.on = true; window.__globe = true; GLOBE.busy = false; hideCard(); selected = null; st.first = !!first;
    document.body.classList.add('globe'); el.style.display = 'block'; el.style.opacity = first ? 1 : 0; size();
    Object.assign(st, { yaw: 0, pitch: 0, goal: innerWidth / innerHeight < .7 ? 12 : 8.4, dist: 4.4, mode: 'in', k: 0 }); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frameG);
  }
  function leave() {
    cancelAnimationFrame(raf); st.mode = 'idle'; GLOBE.on = false; window.__globe = false;
    el.style.display = 'none'; document.body.classList.remove('globe');
    overview(); cam.x = target.x; cam.y = target.y; cam.z = target.z * .55; frame.force = true;   // land on the whole town, zooming in
  }
  GLOBE.enter = enter; GLOBE.leave = leave; GLOBE.st = st; window.GLOBE = GLOBE;
  addEventListener('resize', () => { if (GLOBE.on) size(); });
})();
