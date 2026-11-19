
/* ---- District 3: at 10,000 neighbours the fog lifts and the district gets built.
   Plays once for everyone when the town reaches 10,000 (then remembered), #milestone plays it any time (preview, videos, LIVE). ---- */
{ const D3 = W3.D3, TL = D3.TL;
  D3.noCaps = LIVE;   // in the LIVE the big alerts tell the story
  const fitR = R => clamp(Math.min((VW - 30) / (181 * R), (VH * .6) / (90.5 * R)), .003, 2);
  const keys = () => { const C = D3.T.C, G = D3.T.gate.c, L = Math.hypot(C[0] - G[0], C[1] - G[1]), Gi = [G[0] + (C[0] - G[0]) / L * 6, G[1] + (C[1] - G[1]) / L * 6], P = q => isoW(q[0], q[1]);
    const [x0, y0, x1, y1] = townsBox(), all = [(x0 + x1) / 2, (y0 + y1) / 2], R = D3.T.R;
    return [[0, P(C), fitR(R + 34)], [TL.fog1, P(C), fitR(R + 22)], [TL.gate0 + .7, P(Gi), .34], [TL.wallA, P(Gi), .25], [TL.wall1, P(C), fitR(R + 14)], [TL.grow1 + .6, P(C), fitR(R + 14)], [TL.coaster0 + .3, P(C), .3], [TL.coaster1, P(C), .25], [TL.open + 1.8, P(C), .21], [TL.end - .5, all, fitZoom()]]; };
  const camAt = k => { const K = D3.keys; let i = 0; while (i < K.length - 2 && k > K[i + 1][0]) i++;
    const a = K[i], b = K[i + 1], q = clamp((k - a[0]) / (b[0] - a[0]), 0, 1), e = q * q * (3 - 2 * q), z = Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), e));
    const w = Math.abs(Math.log(b[2] / a[2])) > .05 ? (1 / z - 1 / a[2]) / (1 / b[2] - 1 / a[2]) : e;   // pan evenly on screen while zooming
    target.x = cam.x = lerp(a[1][0], b[1][0], w); target.y = cam.y = lerp(a[1][1], b[1][1], w); target.z = cam.z = z; };
  D3.start2d = real => { D3.pre = null; hideCard(); selected = null; document.body.classList.add('d3anim'); D3.keys = keys(); D3.anim = { real: !!real }; D3.k = 0; camAt(0); frame.force = true; };
  D3.play = async real => {
    if (D3.anim || D3.busy) return; D3.busy = true;
    try { await D3.load(); } catch (e) { console.error(e); D3.busy = false; return; }
    D3.busy = false;
    if (VIDEO_LIKE || LIVE || window.__walking) { D3.start2d(real); return; }
    D3.pre = { real }; hideCard(); selected = null; document.body.classList.add('d3anim'); GLOBE.milestone(() => D3.start2d(real));
  };
  D3.tick = dt => { if (!D3.anim || D3.hold) return; D3.k += dt; camAt(D3.k); if (D3.k >= TL.end) D3.finish(); };
  D3.finish = () => { if (!D3.anim) return; const real = D3.anim.real; D3.anim = null; D3.hold = false; D3.k = 99; D3.st = 'open'; D3.preview = !real; document.body.classList.remove('d3anim');
    try { if (real) localStorage.setItem('bt_d3_seen', '1'); } catch (e) {} try { GLOBE.d3Done(); } catch (e) {} WC.ok = false; overview(); cam.x = target.x; cam.y = target.y; cam.z = target.z; frame.force = true; };
  D3.seek = (k, sT) => { if (!D3.anim) D3.start2d(false); D3.hold = true; if (sT != null) S.T = sT; D3.k = k; camAt(k); frame.force = true; draw(); };   // one exact frame (videos)
  D3.globeFrame = async o => {   // videos: one frame of the planet part, with its title
    const g = await GLOBE.shot(o), W = g.width, H = g.height, c = D3.vc || (D3.vc = document.createElement('canvas')); c.width = W; c.height = H; const c2 = c.getContext('2d');
    c2.fillStyle = '#050816'; c2.fillRect(0, 0, W, H); c2.globalAlpha = o.alpha == null ? 1 : o.alpha; c2.drawImage(g, 0, 0); c2.globalAlpha = 1;
    const sv = { ctx, VW, VH }; ctx = c2; VW = W; VH = H;
    try { if (o.title) { const a = clamp(o.title, 0, 1), bs = fitSize('🎉 10,000 NEIGHBORS!', 76, W - 80); c2.globalAlpha = a; otxt('🎉 10,000 NEIGHBORS!', W / 2, H * .13, bs, '#ffd23f', 12, '#1b1728'); otxt('The fog is lifting…', W / 2, H * .13 + bs * .95, Math.round(bs * .5), '#ffffff', 8, '#1b1728'); c2.globalAlpha = 1; } }
    finally { ctx = sv.ctx; VW = sv.VW; VH = sv.VH; }
    return c.toDataURL('image/jpeg', .9);
  };
  $('d3skip').addEventListener('click', () => { if (D3.anim) return D3.finish(); if (D3.pre) { const real = D3.pre.real; GLOBE.afterMs = () => { D3.start2d(real); D3.finish(); }; GLOBE.skipMs(); } });
  const seen = () => { try { return localStorage.getItem('bt_d3_seen') === '1'; } catch (e) { return true; } };
  if (/milestone/.test(location.hash)) setTimeout(() => D3.play(false), 900);
  else if (D3.st === 'open') D3.load().then(() => { WC.ok = false; frame.force = true; if (!seen() && !VIDEO_LIKE) setTimeout(() => D3.play(true), 1200); }).catch(e => console.error(e));
}
