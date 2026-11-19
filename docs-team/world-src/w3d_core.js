/* ================= BENNY'S TOWN 3D — core: renderer, materials, geometry builder, primitives ================= */
const W3D = {}; window.W3D = W3D;
function initCore3D() {
  const T3 = THREE, PPU = 64 * Math.SQRT2, VS = PPU * Math.cos(Math.PI / 6);
  const HU = 1 / VS, PX = 1 / PPU;                // 2D pixels → world height / world width (1 world unit = 1 tile)
  const OUTC = '#1b1728', YAX = new T3.Vector3(0, 1, 0);
  const renderer = new T3.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.setSize(innerWidth, innerHeight);
  Object.assign(renderer.domElement.style, { position: 'fixed', left: 0, top: 0, zIndex: 1, touchAction: 'none', display: 'none' });
  document.body.appendChild(renderer.domElement);
  const scene = new T3.Scene();
  const CC = new Map(); const col = c => { if (c && c.isColor) return c; let x = CC.get(c); if (!x) CC.set(c, x = new T3.Color(c)); return x; };
  // flat colours like the 2D drawing; SHADE gives every side the fixed 2D shade (front-left 100 %, front-right 78 %, top 100 %), from any camera angle;
  // TOON is a soft two-tone cartoon light for characters. All share fog + the night tint (lit windows and lamps keep glowing).
  const SU = { uTint: { value: new T3.Color(1, 1, 1) }, uFogColor: { value: new T3.Color('#a9dcf5') }, uFogNear: { value: 1e4 }, uFogFar: { value: 2e4 } };
  function mat(kind, extra) {
    return new T3.ShaderMaterial(Object.assign({
      uniforms: Object.assign({ uCol: { value: new T3.Color(1, 1, 1) } }, SU), vertexColors: true, side: T3.DoubleSide,
      vertexShader: `uniform vec3 uCol; uniform vec3 uTint; varying vec3 vC; varying float vFog;
        void main(){ vec3 c = uCol;
          #ifdef USE_COLOR
            c *= color;
          #endif
          #ifdef USE_INSTANCING_COLOR
            c *= instanceColor;
          #endif
          mat4 m = modelMatrix;
          #ifdef USE_INSTANCING
            m = m * instanceMatrix;
          #endif
          float glow = step(.99, c.r) * step(.78, c.g) * step(.35, c.b) * step(c.b, .8); vec3 base = c;
          vec3 n = normalize(mat3(m) * normal);
          ${kind === true ? `float f = .811 + dot(n, vec3(-.031, .073, .189)); f = mix(f, 1., step(.9, n.y)); f = mix(f, .62, step(.9, -n.y)); c *= f;` : ''}
          ${kind === 'toon' ? `float d = dot(n, normalize(vec3(-.35, .8, .5))); c *= mix(.84, 1., smoothstep(.02, .14, d));` : ''}
          c = mix(c * uTint, base, glow);
          vC = c; vec4 mv = viewMatrix * m * vec4(position, 1.); vFog = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uFogColor; uniform float uFogNear; uniform float uFogFar; varying vec3 vC; varying float vFog;
        void main(){ gl_FragColor = vec4(mix(vC, uFogColor, smoothstep(uFogNear, uFogFar, vFog)), 1.); }`
    }, extra || {}));
  }
  const FLAT = mat(false), SHADE = mat(true), TOON = mat('toon'), HULL = mat(false, { side: T3.BackSide });
  const FLAT_PO = mat(false, { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const SHADE_PO = mat(true, { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const LINES = new T3.LineBasicMaterial({ color: OUTC, transparent: true, opacity: .5 });
  const white = g => { if (!g.attributes.color) g.setAttribute('color', new T3.Float32BufferAttribute(new Array(g.attributes.position.count * 3).fill(1), 3)); return g; };
  const ICO = {}; const icoTris = d => ICO[d] || (ICO[d] = Array.from(new T3.IcosahedronGeometry(1, d).toNonIndexed().attributes.position.array));

  /* ---------- geometry builder: models are written in local coordinates and placed with push(x, y, z, rotY, scale) ---------- */
  function GB() {
    const P = [], Cl = [], L = [], HP = [], st = []; let M = new T3.Matrix4(); const t = new T3.Vector3(), t2 = new T3.Vector3(), t3 = new T3.Vector3();
    const tp = p => { t.set(p[0], p[1], p[2]).applyMatrix4(M); return [t.x, t.y, t.z]; };
    const put = (arr, A, Bv, Cv) => arr.push(A[0], A[1], A[2], Bv[0], Bv[1], Bv[2], Cv[0], Cv[1], Cv[2]);
    const orient = (A, Bv, Cv, out) => { if (!out) return [A, Bv, Cv]; t2.set(Bv[0] - A[0], Bv[1] - A[1], Bv[2] - A[2]); t3.set(Cv[0] - A[0], Cv[1] - A[1], Cv[2] - A[2]); t2.cross(t3); const o = new T3.Vector3(out[0], out[1], out[2]).transformDirection(M); return t2.dot(o) < 0 ? [A, Cv, Bv] : [A, Bv, Cv]; };
    const B = {
      push(x, y, z, ry, s) { st.push(M.clone()); const sc = Array.isArray(s) ? new T3.Vector3(...s) : new T3.Vector3(s || 1, s || 1, s || 1); M = M.clone().multiply(new T3.Matrix4().compose(new T3.Vector3(x || 0, y || 0, z || 0), new T3.Quaternion().setFromAxisAngle(YAX, ry || 0), sc)); return B; },
      pop() { M = st.pop(); return B; },
      tri(a, b, c, cl, out) { const k = orient(tp(a), tp(b), tp(c), out); put(P, ...k); const C = col(cl); for (let i = 0; i < 3; i++) Cl.push(C.r, C.g, C.b); },
      quad(a, b, c, d, cl, out) { B.tri(a, b, c, cl, out); B.tri(a, c, d, cl, out); },
      htri(a, b, c, out) { const k = orient(tp(a), tp(b), tp(c), out); put(HP, ...k); },
      hquad(a, b, c, d, out) { B.htri(a, b, c, out); B.htri(a, c, d, out); },
      edge(a, b) { const A = tp(a), Bv = tp(b); L.push(...A, ...Bv); },
      // axis-aligned box (local); o: { top, bottom, edges, hull, sides:[+x,-x,+z,-z] }
      box(x0, y0, z0, x1, y1, z1, c, o) { o = o || {}; const sd = o.sides || [c, c, c, c], top = o.top || c;
        B.quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], sd[0], [1, 0, 0]); B.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], sd[1], [-1, 0, 0]);
        B.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], sd[2], [0, 0, 1]); B.quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], sd[3], [0, 0, -1]);
        if (top !== 'none') B.quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], top, [0, 1, 0]);
        if (o.bottom) B.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], o.bottom === true ? c : o.bottom, [0, -1, 0]);
        if (o.edges) { const E = [[x0, y1, z0, x1, y1, z0], [x1, y1, z0, x1, y1, z1], [x1, y1, z1, x0, y1, z1], [x0, y1, z1, x0, y1, z0], [x0, y0, z0, x0, y1, z0], [x1, y0, z0, x1, y1, z0], [x1, y0, z1, x1, y1, z1], [x0, y0, z1, x0, y1, z1], [x0, y0, z1, x1, y0, z1], [x1, y0, z0, x1, y0, z1], [x0, y0, z0, x1, y0, z0], [x0, y0, z0, x0, y0, z1]]; for (const e of E) B.edge([e[0], e[1], e[2]], [e[3], e[4], e[5]]); }
        if (o.hull) B.hbox(x0, y0, z0, x1, y1, z1, o.hull);
        return B; },
      hbox(x0, y0, z0, x1, y1, z1, h) { x0 -= h; y0 -= h; z0 -= h; x1 += h; y1 += h; z1 += h;
        B.hquad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [1, 0, 0]); B.hquad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
        B.hquad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]); B.hquad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1]);
        B.hquad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0]); B.hquad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0]); },
      // vertical prism from a polygon given in local XZ
      prism(pts, y0, y1, c, o) { o = o || {}; const n = pts.length, cx = pts.reduce((s, p) => s + p[0], 0) / n, cz = pts.reduce((s, p) => s + p[1], 0) / n;
        for (let k = 0; k < n; k++) { const a = pts[k], b = pts[(k + 1) % n], out = [(a[0] + b[0]) / 2 - cx, 0, (a[1] + b[1]) / 2 - cz];
          B.quad([a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], typeof c === 'function' ? c(k) : c, out);
          if (o.edges) { B.edge([a[0], y1, a[1]], [b[0], y1, b[1]]); if (o.edges !== 'top') B.edge([a[0], y0, a[1]], [a[0], y1, a[1]]); } }
        if (o.top !== 'none') for (let k = 1; k + 1 < n; k++) B.tri([pts[0][0], y1, pts[0][1]], [pts[k][0], y1, pts[k][1]], [pts[k + 1][0], y1, pts[k + 1][1]], o.top || (typeof c === 'function' ? c(0) : c), [0, 1, 0]);
        if (o.bottom) for (let k = 1; k + 1 < n; k++) B.tri([pts[0][0], y0, pts[0][1]], [pts[k][0], y0, pts[k][1]], [pts[k + 1][0], y0, pts[k + 1][1]], o.bottom, [0, -1, 0]);
        if (o.hull) { const h = o.hull, Q = pts.map(p => { const dx = p[0] - cx, dz = p[1] - cz, l = Math.hypot(dx, dz) || 1, k = (l + h / Math.cos(Math.PI / n)) / l; return [cx + dx * k, cz + dz * k]; });
          for (let k = 0; k < n; k++) { const a = Q[k], b = Q[(k + 1) % n]; B.hquad([a[0], y0 - h, a[1]], [b[0], y0 - h, b[1]], [b[0], y1 + h, b[1]], [a[0], y1 + h, a[1]], [(a[0] + b[0]) / 2 - cx, 0, (a[1] + b[1]) / 2 - cz]); }
          for (let k = 1; k + 1 < n; k++) { B.htri([Q[0][0], y1 + h, Q[0][1]], [Q[k][0], y1 + h, Q[k][1]], [Q[k + 1][0], y1 + h, Q[k + 1][1]], [0, 1, 0]); B.htri([Q[0][0], y0 - h, Q[0][1]], [Q[k][0], y0 - h, Q[k][1]], [Q[k + 1][0], y0 - h, Q[k + 1][1]], [0, -1, 0]); } }
        return B; },
      ngon(cx, cz, r, n, a0) { const P2 = []; for (let k = 0; k < n; k++) { const a = (a0 || 0) + k / n * 6.2832; P2.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); } return P2; },
      cyl(cx, cz, r, y0, y1, n, c, o) { return B.prism(B.ngon(cx, cz, r, n, (o && o.a0) || 0), y0, y1, c, o); },
      // frustum / cone (r1 = 0) with optional alternating colours per segment
      cone(cx, cz, r0, r1, y0, y1, n, c, o) { o = o || {}; for (let k = 0; k < n; k++) { const a = k / n * 6.2832 + (o.a0 || 0), b = (k + 1) / n * 6.2832 + (o.a0 || 0), cc = Array.isArray(c) ? c[k % c.length] : c, out = [Math.cos((a + b) / 2), (r0 - r1) / Math.max(.001, y1 - y0) * .5, Math.sin((a + b) / 2)];
          if (o.hullOnly) {} else if (r1 > 0) B.quad([cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0], [cx + Math.cos(b) * r0, y0, cz + Math.sin(b) * r0], [cx + Math.cos(b) * r1, y1, cz + Math.sin(b) * r1], [cx + Math.cos(a) * r1, y1, cz + Math.sin(a) * r1], cc, out);
          else B.tri([cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0], [cx + Math.cos(b) * r0, y0, cz + Math.sin(b) * r0], [cx, y1, cz], cc, out);
          if (o.hullOnly) {}
          if (o.under) B.tri([cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0], [cx + Math.cos(b) * r0, y0, cz + Math.sin(b) * r0], [cx, y0 + (o.underY || 0), cz], o.under, [0, -1, 0]);
          if (o.hull) { const h = o.hull, R0 = r0 + h, R1 = r1 > 0 ? r1 + h : 0, Y1 = y1 + (r1 > 0 ? h : h * 1.6); if (R1 > 0) B.hquad([cx + Math.cos(a) * R0, y0 - h, cz + Math.sin(a) * R0], [cx + Math.cos(b) * R0, y0 - h, cz + Math.sin(b) * R0], [cx + Math.cos(b) * R1, Y1, cz + Math.sin(b) * R1], [cx + Math.cos(a) * R1, Y1, cz + Math.sin(a) * R1], out); else B.htri([cx + Math.cos(a) * R0, y0 - h, cz + Math.sin(a) * R0], [cx + Math.cos(b) * R0, y0 - h, cz + Math.sin(b) * R0], [cx, Y1, cz], out); B.htri([cx + Math.cos(a) * R0, y0 - h, cz + Math.sin(a) * R0], [cx + Math.cos(b) * R0, y0 - h, cz + Math.sin(b) * R0], [cx, y0 - h, cz], [0, -1, 0]); }
          if (o.edges && r1 === 0) B.edge([cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0], [cx + Math.cos(b) * r0, y0, cz + Math.sin(b) * r0]); }
        return B; },
      sphere(cx, cy, cz, r, c, o) { o = o || {}; let T = icoTris(o.detail == null ? 1 : o.detail); const s = o.s || [1, 1, 1], C = col(c); if (o.e) { const e = o.e; T = T.map(x => Math.sign(x) * Math.pow(Math.abs(x), e)); }
        for (let i = 0; i < T.length; i += 9) { const A = tp([cx + T[i] * r * s[0], cy + T[i + 1] * r * s[1], cz + T[i + 2] * r * s[2]]), Bv = tp([cx + T[i + 3] * r * s[0], cy + T[i + 4] * r * s[1], cz + T[i + 5] * r * s[2]]), Cv = tp([cx + T[i + 6] * r * s[0], cy + T[i + 7] * r * s[1], cz + T[i + 8] * r * s[2]]); put(P, A, Bv, Cv); for (let k = 0; k < 3; k++) Cl.push(C.r, C.g, C.b);
          if (o.hull) { const h = o.hull, R = [r * s[0] + h, r * s[1] + h, r * s[2] + h]; put(HP, tp([cx + T[i] * R[0], cy + T[i + 1] * R[1], cz + T[i + 2] * R[2]]), tp([cx + T[i + 3] * R[0], cy + T[i + 4] * R[1], cz + T[i + 5] * R[2]]), tp([cx + T[i + 6] * R[0], cy + T[i + 7] * R[1], cz + T[i + 8] * R[2]])); } }
        return B; },
      // tube between two local points (limbs, poles, ropes)
      tube(a, b, r, c, o) { o = o || {}; const n = o.n || 8, ax = new T3.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = ax.length(); ax.normalize(); const u = new T3.Vector3(0, 1, 0); if (Math.abs(ax.y) > .9) u.set(1, 0, 0); const w = new T3.Vector3().crossVectors(ax, u).normalize(); u.crossVectors(w, ax).normalize();
        const ring = (p, R, k) => { const an = k / n * 6.2832; return [p[0] + (u.x * Math.cos(an) + w.x * Math.sin(an)) * R, p[1] + (u.y * Math.cos(an) + w.y * Math.sin(an)) * R, p[2] + (u.z * Math.cos(an) + w.z * Math.sin(an)) * R]; };
        const r1 = o.r1 == null ? r : o.r1;
        for (let k = 0; k < n; k++) { const an = (k + .5) / n * 6.2832, out = [u.x * Math.cos(an) + w.x * Math.sin(an), u.y * Math.cos(an) + w.y * Math.sin(an), u.z * Math.cos(an) + w.z * Math.sin(an)];
          B.quad(ring(a, r, k), ring(a, r, k + 1), ring(b, r1, k + 1), ring(b, r1, k), c, out);
          if (o.hull) B.hquad(ring(a, r + o.hull, k), ring(a, r + o.hull, k + 1), ring(b, r1 + o.hull, k + 1), ring(b, r1 + o.hull, k), out); }
        if (o.caps !== false) { B.sphere(a[0], a[1], a[2], r, c, { detail: 1, hull: o.hull }); B.sphere(b[0], b[1], b[2], r1, c, { detail: 1, hull: o.hull }); }
        return B; },
      // one continuous bent tube through several points (legs): no overlapping ends, so the outline stays clean at the knee
      tubePath(pts, r, c, o) { o = o || {}; const n = o.n || 10, V = pts.map(p => new T3.Vector3(...p)), rings = [], rings2 = [];
        let u = null;
        for (let k = 0; k < V.length; k++) { const a = V[Math.max(0, k - 1)], b = V[Math.min(V.length - 1, k + 1)], t = b.clone().sub(a).normalize();
          if (!u) { u = Math.abs(t.y) > .9 ? new T3.Vector3(1, 0, 0) : new T3.Vector3(0, 1, 0); }
          u = u.clone().sub(t.clone().multiplyScalar(u.dot(t))).normalize(); const w = new T3.Vector3().crossVectors(t, u).normalize();
          const rr = Array.isArray(r) ? r[k] : r, ring = (R) => { const out = []; for (let q = 0; q <= n; q++) { const an = q / n * 6.2832, d = u.clone().multiplyScalar(Math.cos(an)).add(w.clone().multiplyScalar(Math.sin(an))); out.push([V[k].x + d.x * R, V[k].y + d.y * R, V[k].z + d.z * R, d]); } return out; };
          rings.push(ring(rr)); if (o.hull) rings2.push(ring(rr + (Array.isArray(o.hull) ? o.hull[k] : o.hull))); }
        for (let k = 0; k < V.length - 1; k++) for (let q = 0; q < n; q++) { const A = rings[k][q], Bq = rings[k][q + 1], Cq = rings[k + 1][q + 1], D = rings[k + 1][q], m = A[3].clone().add(Cq[3]).normalize();
          B.quad(A.slice(0, 3), Bq.slice(0, 3), Cq.slice(0, 3), D.slice(0, 3), c, [m.x, m.y, m.z]);
          if (o.hull) { const A2 = rings2[k][q], B2 = rings2[k][q + 1], C2 = rings2[k + 1][q + 1], D2 = rings2[k + 1][q]; B.hquad(A2.slice(0, 3), B2.slice(0, 3), C2.slice(0, 3), D2.slice(0, 3), [m.x, m.y, m.z]); } }
        const r0 = Array.isArray(r) ? r[0] : r, r1 = Array.isArray(r) ? r[r.length - 1] : r, hl = Array.isArray(o.hull) ? o.hull : [o.hull, o.hull]; B.sphere(...pts[0], r0, c, { detail: 2, hull: hl[0] || 0 }); B.sphere(...pts[pts.length - 1], r1, c, { detail: 2, hull: hl[hl.length - 1] || 0 });
        return B; },
      // hemisphere (beanie, domes) with alternating rib colours
      dome(cx, cy, cz, r, sy, c1, c2, o) { o = o || {}; const nl = o.nl || 18, nt = o.nt || 6;
        for (let i = 0; i < nl; i++) for (let j = 0; j < nt; j++) { const a0 = i / nl * 6.2832, a1 = (i + 1) / nl * 6.2832, b0 = j / nt * Math.PI / 2, b1 = (j + 1) / nt * Math.PI / 2, P3 = (a, bb, R) => [cx + Math.cos(a) * Math.cos(bb) * R, cy + Math.sin(bb) * R * sy, cz + Math.sin(a) * Math.cos(bb) * R], out = [Math.cos((a0 + a1) / 2), Math.sin((b0 + b1) / 2), Math.sin((a0 + a1) / 2)];
          B.quad(P3(a0, b0, r), P3(a1, b0, r), P3(a1, b1, r), P3(a0, b1, r), i % 2 ? c2 : c1, out); if (o.hull) B.hquad(P3(a0, b0, r + o.hull), P3(a1, b0, r + o.hull), P3(a1, b1, r + o.hull), P3(a0, b1, r + o.hull), out); }
        return B; },
      // flat disc facing +y (or along a given normal)
      disc(cx, cy, cz, r, n, c, nrm) { const N = new T3.Vector3(...(nrm || [0, 1, 0])).normalize(), U = new T3.Vector3(0, 1, 0); if (Math.abs(N.y) > .9) U.set(1, 0, 0); const Wv = new T3.Vector3().crossVectors(N, U).normalize(); U.crossVectors(Wv, N).normalize();
        for (let k = 0; k < n; k++) { const a = k / n * 6.2832, b = (k + 1) / n * 6.2832, p = an => [cx + (U.x * Math.cos(an) + Wv.x * Math.sin(an)) * r, cy + (U.y * Math.cos(an) + Wv.y * Math.sin(an)) * r, cz + (U.z * Math.cos(an) + Wv.z * Math.sin(an)) * r]; B.tri([cx, cy, cz], p(a), p(b), c, [N.x, N.y, N.z]); }
        return B; },
      count: () => P.length / 9,
      mesh(m, ro) { const g = new T3.Group(); if (P.length) { const geo = new T3.BufferGeometry(); geo.setAttribute('position', new T3.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new T3.Float32BufferAttribute(Cl, 3)); geo.computeVertexNormals(); const me = new T3.Mesh(geo, m || SHADE); if (ro != null) me.renderOrder = ro; g.add(me); }
        if (HP.length) { const hg = new T3.BufferGeometry(); hg.setAttribute('position', new T3.Float32BufferAttribute(HP, 3)); hg.setAttribute('color', new T3.Float32BufferAttribute(new Array(HP.length).fill(0).map((_, i) => col(OUTC).toArray()[i % 3]), 3)); hg.computeVertexNormals(); g.add(new T3.Mesh(hg, HULL)); }
        if (L.length) { const lg = new T3.BufferGeometry(); lg.setAttribute('position', new T3.Float32BufferAttribute(L, 3)); g.add(new T3.LineSegments(lg, LINES)); }
        return g; }
    };
    return B;
  }
  // textured quads (signs, banners, clock faces, labels painted on real 3D boards)
  function texCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.lineJoin = 'round'; g.lineCap = 'round'; draw(g, w, h); const t = new T3.CanvasTexture(c); t.anisotropy = 8; return t; }
  function TQ(tex) { const P = [], UV = []; let M = new T3.Matrix4(); const st = [], t = new T3.Vector3();
    const tp = p => { t.set(p[0], p[1], p[2]).applyMatrix4(M); return [t.x, t.y, t.z]; };
    const Q = {
      push(x, y, z, ry) { st.push(M.clone()); M = M.clone().multiply(new T3.Matrix4().compose(new T3.Vector3(x || 0, y || 0, z || 0), new T3.Quaternion().setFromAxisAngle(YAX, ry || 0), new T3.Vector3(1, 1, 1))); return Q; },
      pop() { M = st.pop(); return Q; },
      // quad in the local XY plane at z, uv rect [u0,v0,u1,v1]
      quad(a, b, c, d, uv) { const [u0, v0, u1, v1] = uv || [0, 0, 1, 1]; const A = tp(a), Bv = tp(b), Cv = tp(c), D = tp(d); P.push(...A, ...Bv, ...Cv, ...A, ...Cv, ...D); UV.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1); return Q; },
      board(cx, cy, cz, w, h, uv, ry) { Q.push(cx, cy, cz, ry || 0); Q.quad([-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0], [-w / 2, h / 2, 0], uv); Q.pop(); return Q; },
      mesh(o) { const g = new T3.BufferGeometry(); g.setAttribute('position', new T3.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new T3.Float32BufferAttribute(UV, 2)); return new T3.Mesh(g, new T3.MeshBasicMaterial(Object.assign({ map: tex, side: T3.DoubleSide, transparent: true, alphaTest: .05 }, o || {}))); }
    };
    return Q;
  }
  Object.assign(W3D, { T3, renderer, scene, PPU, VS, HU, PX, OUTC, col, mat, FLAT, SHADE, TOON, HULL, FLAT_PO, SHADE_PO, LINES, white, GB, TQ, texCanvas, YAX, SU });
}
