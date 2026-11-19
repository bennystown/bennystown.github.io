
/* ---- Daily treasure hunt (3D): every day (Berlin time) a chest is hidden in the streets. Walk there, follow the 🔥 meter;
   whoever finds it gets the day's code — the first to comment it under Benny's newest TikTok gets a house upgrade. ---- */
const TR = (() => {
  const fnv = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const day = (() => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); } })();
  const codeFor = d => { const W = ['GOLD', 'RUBY', 'STAR', 'MOON', 'COIN', 'LUCK', 'GEM', 'KEY', 'CROWN', 'PEARL'], A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', h = fnv('benny-code-' + d), g = fnv('x' + d + 'treasure'); let s = ''; for (let i = 0; i < 3; i++) s += A[(g >>> (i * 5)) % 32]; return W[h % W.length] + '-' + s; };
  // where it is hidden: a random spot at the side of a street or in a back alley (the same for everyone today)
  const spotFor = d => {
    const r = seeded(fnv('benny-spot-' + d) % 2147483646 + 1); for (let i = 0; i < 7; i++) r();
    const pools = { alley: [], street: [] };
    for (const [T, ti] of [[W3.T1, 1], [W3.T2, 2]]) { for (const P of T.alleys) pools.alley.push({ P, T, ti }); for (const s of T.streets) if (s.kind !== 'avenue') pools.street.push({ P: s.pts, T, ti }); }
    for (const k in pools) { let acc = 0; for (const e of pools[k]) { let L = 0; for (let i = 1; i < e.P.length; i++) L += Math.hypot(e.P[i][0] - e.P[i - 1][0], e.P[i][1] - e.P[i - 1][1]); e.L = L; acc += L; e.acc = acc; } pools[k].total = acc; }
    for (let tries = 0; tries < 200; tries++) {
      const kind = r() < .5 ? 'alley' : 'street', L = pools[kind], x = r() * L.total, e = L.find(q => q.acc >= x) || L[L.length - 1];
      let w = x - (e.acc - e.L), i = 1; for (; i < e.P.length; i++) { const sl = Math.hypot(e.P[i][0] - e.P[i - 1][0], e.P[i][1] - e.P[i - 1][1]); if (w <= sl || i === e.P.length - 1) break; w -= sl; }
      const a = e.P[i - 1], b = e.P[i], sl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, f = clamp(w / sl, 0, 1), tu = (b[0] - a[0]) / sl, tv = (b[1] - a[1]) / sl, side = r() < .5 ? -1 : 1, off = kind === 'alley' ? .27 : .5;
      const u = lerp(a[0], b[0], f) - tv * off * side, v = lerp(a[1], b[1], f) + tu * off * side;
      if (Math.hypot(u - 3.5, v - 3.65) < 24 || W3.lmSDF(u, v) < W3.M + .6) continue;
      const T = e.T, rr = Math.hypot(u - T.C[0], v - T.C[1]) / T.innerR(Math.atan2(v - T.C[1], u - T.C[0]));
      return { u, v, kind, ti: e.ti, rr, face: Math.atan2(tv * side, -tu * side) };   // the chest's front faces the middle of its path
    }
    return { u: 20, v: 8, kind: 'street', ti: 1, rr: .2, face: 0 };
  };
  const spot = spotFor(day), code = codeFor(day);
  const hint = 'Somewhere in ' + (spot.ti === 1 ? 'the Old Town' : 'District 2') + ', ' + (spot.rr < .35 ? 'near the middle' : spot.rr < .72 ? 'halfway to the town wall' : 'close to the town wall') + ', ' + (spot.kind === 'alley' ? 'in a narrow back alley.' : 'at the side of a street.');
  const found = () => { try { const o = JSON.parse(localStorage.getItem('bt_treasure') || '{}'); return o.day === day; } catch (e) { return false; } };
  return { day, code, spot, hint, found, fnv, codeFor, spotFor, d: 999 };
})();
function trDateLabel() { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()); } catch (e) { return TR.day; } }
function trPill() { const b = $('trBtn'); if (!b) return; b.textContent = TR.found() ? '✅ Treasure found · ' + TR.code : '💰 Daily treasure hunt'; b.classList.toggle('done', TR.found()); }
function trShowCard() { $('trCode').textContent = TR.code; $('trDate').textContent = trDateLabel(); $('trCard').classList.add('on'); }
function trToast(html, ms) { const t = $('trToast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(trToast.t); trToast.t = setTimeout(() => t.classList.remove('on'), ms || 6000); }
async function trHunt() {
  if (TR.found()) { trShowCard(); return; }
  const C = TR.spot.ti === 1 ? [4.6, 7.2] : W3.T2.C, [wx, wy] = isoW(C[0], C[1]); hideCard(); selected = null; cam.x = target.x = wx; cam.y = target.y = wy;
  await startWalk();
  if (W3D.on) trToast('<b>💰 Today\'s treasure</b><br>' + TR.hint + '<br><span>Follow the 🔥 – the hotter, the closer!</span>', 7000);
}
// the 3D part: the chest, its light, the hot/cold meter (called once when the 3D streets are built)
W3D.treasure3D = X => {
  const { T3, scene, anim, GB, groundH, view } = X, S0 = TR.spot, gy = groundH(S0.u, S0.v);
  const g = new T3.Group(); g.position.set(S0.u, gy, S0.v); g.rotation.y = S0.face; scene.add(g);
  { const B = GB(), WD = '#8a5a34', WL = '#a8743f', GD = '#f2c14e';
    B.box(-.17, 0, -.11, .17, .15, .11, WD, { hull: .012, top: '#6b4428' });
    for (const x of [-.1, .1]) B.box(x - .016, -.002, -.116, x + .016, .152, .116, GD, { hull: .006 });
    B.box(-.032, .065, .112, .032, .135, .128, GD, { hull: .005 }); B.box(-.008, .08, .128, .008, .11, .132, '#3b2a1a');
    g.add(B.mesh()); }
  const lid = new T3.Group(); lid.position.set(0, .15, -.11); g.add(lid);
  { const B = GB(), R = .11, N = 9, P = (x, a, rr) => [x, Math.sin(a) * (rr || R) * .85, .11 - Math.cos(a) * (rr || R)];
    for (let k = 0; k < N; k++) { const a0 = k / N * Math.PI, a1 = (k + 1) / N * Math.PI, m = (a0 + a1) / 2, out = [0, Math.sin(m), -Math.cos(m)];
      B.quad(P(-.17, a0), P(.17, a0), P(.17, a1), P(-.17, a1), '#a8743f', out); B.hquad(P(-.182, a0, R + .012), P(.182, a0, R + .012), P(.182, a1, R + .012), P(-.182, a1, R + .012), out);
      for (const x of [-.1, .1]) B.quad(P(x - .016, a0, R + .004), P(x + .016, a0, R + .004), P(x + .016, a1, R + .004), P(x - .016, a1, R + .004), '#f2c14e', out); }
    for (const x of [-.17, .17]) for (let k = 0; k < N; k++) { const a0 = k / N * Math.PI, a1 = (k + 1) / N * Math.PI; B.tri([x, 0, .11], P(x, a0), P(x, a1), '#8a5a34', [Math.sign(x), 0, 0]); }
    lid.add(B.mesh()); }
  const add = (geo, color, op) => { const m = new T3.Mesh(geo, new T3.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: T3.AdditiveBlending, depthWrite: false })); m.renderOrder = 5; return m; };
  const glow = add(new T3.PlaneGeometry(.3, .18).rotateX(-Math.PI / 2), '#ffd76a', 0); glow.position.y = .152; g.add(glow);
  const beam = add(new T3.CylinderGeometry(.05, .2, 9, 16, 1, true).translate(0, 4.5 + .42, 0), '#ffd76a', 0); g.add(beam);
  // sparkles that twinkle round the chest
  const starTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, 'rgba(255,248,210,1)'); gr.addColorStop(.25, 'rgba(255,215,110,.85)'); gr.addColorStop(1, 'rgba(255,200,80,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); x.fillStyle = '#fffbe6'; x.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832, r = k % 2 ? 4 : 30; x.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } x.fill(); return new T3.CanvasTexture(c); })();
  const sparks = []; for (let k = 0; k < 7; k++) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false, blending: T3.AdditiveBlending })); s.renderOrder = 6; g.add(s); sparks.push(s); }
  // coins that burst out when it opens
  const coinG = new T3.CylinderGeometry(.035, .035, .008, 14).rotateX(Math.PI / 2), coinM = new T3.MeshBasicMaterial({ color: '#ffcf3f' }), coins = [];
  for (let k = 0; k < 16; k++) { const c = new T3.Mesh(coinG, coinM); c.visible = false; g.add(c); coins.push({ m: c, a: k / 16 * 6.2832 + Math.random() * .3, sp: .9 + Math.random() * .7, up: 1.6 + Math.random() * 1.1 }); }
  let openK = TR.found() ? 1 : 0, opening = -1, lastUi = 0, lastD = null, trend = 0, trendT = 0;
  const hud = $('trHud'), bar = hud.querySelector('i'), txt = hud.querySelector('.trS');
  anim.push((t, dt) => {
    const wk = view.walk, d = Math.hypot(wk.x - S0.u, wk.z - S0.v); TR.d = d;
    if (opening >= 0) { opening += dt; openK = Math.min(1, opening / .55); const q = opening - .25; for (const c of coins) { c.m.visible = q > 0 && q < 2.6; if (!c.m.visible) continue; c.m.position.set(Math.sin(c.a) * c.sp * q * .35, .16 + c.up * q - 2.4 * q * q, Math.cos(c.a) * c.sp * q * .35); c.m.rotation.y = q * 9 + c.a; } }
    lid.rotation.x = -1.95 * (openK * openK * (3 - 2 * openK));
    glow.material.opacity = .9 * openK * (.75 + .25 * Math.sin(t * 6));
    beam.material.opacity = (TR.found() ? .1 : clamp((34 - d) / 18, 0, 1) * .42) * clamp((d - .8) / 3, .25, 1) * (.8 + .2 * Math.sin(t * 3));
    sparks.forEach((s, k) => { const a = t * (.6 + k * .07) + k * .9, ph = (t * .8 + k * .37) % 1; s.position.set(Math.cos(a) * .3, .12 + ph * .55, Math.sin(a) * .3); s.scale.setScalar(.08 * Math.sin(ph * Math.PI) + .015); s.material.opacity = Math.sin(ph * Math.PI); });
    if (d < 1.0 && !TR.found() && opening < 0) {   // found it!
      opening = 0; try { localStorage.setItem('bt_treasure', JSON.stringify({ day: TR.day, code: TR.code })); } catch (e) {}
      try { liveBeep('coin'); setTimeout(() => liveBeep('chime'), 350); } catch (e) {}
      trPill(); setTimeout(trShowCard, 900);
    }
    if (t - lastUi > .25) { lastUi = t;   // the hot/cold meter
      if (TR.found()) { hud.classList.add('done'); txt.textContent = '✅ Found! Code: ' + TR.code; bar.style.width = '100%'; }
      else { if (lastD == null) lastD = d; if (t - trendT > 1.1) { trend = d < lastD - .6 ? 1 : d > lastD + .6 ? -1 : 0; lastD = d; trendT = t; }
        const L = d > 120 ? '🧊 Freezing' : d > 70 ? '❄️ Cold' : d > 35 ? '🌤️ Warm' : d > 15 ? '🔥 Hot' : d > 5 ? '🔥🔥 Very hot!' : '😱 It\'s right here!';
        txt.textContent = L + (d > 5 && trend ? (trend > 0 ? '  ·  ▲ warmer' : '  ·  ▼ colder') : ''); bar.style.width = (clamp(1 - d / 160, .04, 1) * 100).toFixed(1) + '%'; } }
  });
  W3D.labelHook = (camera, toScreen) => { const d = TR.d; if (d > 7) return; const p = toScreen(S0.u, gy + .55, S0.v, camera); if (!p) return; ctx.globalAlpha = clamp((7 - d) / 2, 0, 1); tag(p[0], p[1], TR.found() ? '✅ TREASURE' : '💰 TREASURE', '#ffd23f', 1); ctx.globalAlpha = 1; };
};
{ trPill(); $('trBtn').addEventListener('click', trHunt); $('trOk').addEventListener('click', () => $('trCard').classList.remove('on')); $('trHud').addEventListener('click', () => { if (TR.found()) trShowCard(); else trToast('<b>💰 Today\'s treasure</b><br>' + TR.hint, 5000); }); window.TR = { day: TR.day, found: TR.found, hint: TR.hint }; }
