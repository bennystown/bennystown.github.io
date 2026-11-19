#!/usr/bin/env python3
"""Build Benny's Town with the new world: the normal map stays 2D (new layout), the Walk button opens the 3D streets.
   python3 mksite.py test   -> /tmp/world/site/  (test build for the private preview page)
   python3 mksite.py live   -> /tmp/world/live/  (same, for the GitHub Pages repo)"""
import sys, re, os, shutil
mode = sys.argv[1] if len(sys.argv) > 1 else 'test'
# base = the old (pre-world) page source; once the new world is live the repo page is a *built* page,
# so we only take the current town data (tenants, day, bank …) from the repo and build on the base again
src = open('/home/claude/benny3d/base_index.html').read()
repo = open('/home/claude/bennystown.github.io/index.html').read()
def town_block(t): i = t.index('const TOWN = {'); return t[i:t.index('\n};\n', i) + 4]
src = src.replace(town_block(src), town_block(repo))
W = '/tmp/world/'
world2d = open(W + 'world3.js').read()
world3d = '\n'.join(open(W + f).read() for f in ['w3d_core.js', 'w3d_models.js', 'w3d_world.js', 'w3d_globe.js'])

def rep(a, b, count=1):
    global src
    assert src.count(a) == count, (a[:90], src.count(a))
    src = src.replace(a, b)

# ---------- the new 2D draw: same as before, but with the new world (walls, districts, organic streets) ----------
d0 = src.index('function draw() {\n'); d1 = src.index('\n}\n', src.index('  envOverlay(1 / 60);', d0)) + 3
old = src[d0:d1]
benny_part = old[old.index('  const BN = bennyNow();'):old.index('  featureObjs(objs);')]
tail = old[old.index('  envOverlay(1 / 60);'):]
new_draw = ('''// the world: ground + all objects, depth sorted (movers = Benny and the cars)
function drawWorld(z, movers) {
  W3.ground();
  const objs = []; W3.worldObjs(objs, movers === 'only' ? false : movers);
  if (movers) {
''' + benny_part + '''  }
  objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f();
}
function drawMovers(z) {
  const objs = []; W3.carObjs(objs);
''' + benny_part + '''  objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f();
}
// zoomed out, the (still) town is painted once into a picture 1.6x the screen and only moved or scaled while you pan and zoom
const WC = { c: document.createElement('canvas'), ok: false };
function renderWorldCache(z) {
  const cw = Math.ceil(VW * 1.6), ch = Math.ceil(VH * 1.6);
  WC.c.width = Math.ceil(cw * DPR); WC.c.height = Math.ceil(ch * DPR);
  const s = { ctx, VW, VH, FX, FY };
  ctx = WC.c.getContext('2d'); VW = cw; VH = ch; FX = s.FX + (cw - s.VW) / 2; FY = s.FY + (ch - s.VH) / 2;
  try { ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; drawWorld(z, false); }
  finally { WC.fxc = FX; WC.fyc = FY; ctx = s.ctx; VW = s.VW; VH = s.VH; FX = s.FX; FY = s.FY; }
  Object.assign(WC, { ok: true, z, cx: cam.x, cy: cam.y, cw, ch, t: performance.now(), dpr: DPR });
}
function draw() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const z = cam.z;
  if (z < .22 && !VIDEO_LIKE) {
    const sig = [DPR, VW, VH, selected ? selected.idx : -1, HOUSES.length].join('|'), now = performance.now(), loose = now - (WC.t || 0) < 400;
    const k = WC.ok ? z / WC.z : 1, ox = WC.ok ? (cam.x - WC.cx) * z : 0, oy = WC.ok ? (cam.y - WC.cy) * z : 0;
    if (!WC.ok || WC.sig !== sig || Math.abs(Math.log(k)) > (loose ? .3 : .015) || Math.abs(ox) > VW * .28 || Math.abs(oy) > VH * .28) { renderWorldCache(z); WC.sig = sig; }
    const kk = z / WC.z; ctx.fillStyle = '#5d9e57'; ctx.fillRect(0, 0, VW, VH);
    ctx.drawImage(WC.c, FX - WC.fxc * kk + (WC.cx - cam.x) * z, FY - WC.fyc * kk + (WC.cy - cam.y) * z, WC.cw * kk, WC.ch * kk);
    drawMovers(z);
  } else drawWorld(z, true);
''' + tail)
src = src[:d0] + world2d + '\n' + world3d + '\n' + new_draw + '\nfunction drawOld() {}\n' + src[d1:]

rep("const ctx = cv.getContext('2d');", "let ctx = cv.getContext('2d');")
# ---------- map camera: zoom out far enough for the whole Old Town, stay over the two districts ----------
rep("function fitZoom() { const R = Math.max(3.2, R_CITY + 1.2); return clamp(Math.min((VW - 20) / (2 * R * TW / Math.SQRT2), (VH * .55) / (2 * R * TH / Math.SQRT2)), .08, 1.6); }",
    "function townsBox() { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const T of [W3.T1, W3.T2]) for (let k = 0; k < 32; k++) { const a = k / 32 * 6.2832, R = T.R + 3, [x, y] = isoW(T.C[0] + Math.cos(a) * R, T.C[1] + Math.sin(a) * R); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return [x0, y0, x1, y1]; }\nfunction fitZoom() { const [x0, y0, x1, y1] = townsBox(); return clamp(Math.min((VW - 44) / (x1 - x0), (VH * .55) / (y1 - y0)), .01, 1.6); }")
rep("function overview() { target.x = PX; target.y = PY + 10; target.z = fitZoom(); }", "function overview() { const [x0, y0, x1, y1] = townsBox(); target.x = (x0 + x1) / 2; target.y = (y0 + y1) / 2 + (FY - VH * .5) / fitZoom() * 0; target.z = fitZoom(); }")
rep("function clampCam() { const [cx, cy] = isoW(CEN, CEN), R = (A1 - A0) * TW * .36; cam.x = clamp(cam.x, cx - R, cx + R); cam.y = clamp(cam.y, cy - R * .5, cy + R * .5); }",
    "function clampCam() { const T1 = W3.T1, T2 = W3.T2, u0 = T1.C[0] - T1.R - 12, u1 = T2.C[0] + T2.R + 12, v0 = Math.min(T1.C[1] - T1.R, T2.C[1] - T2.R) - 12, v1 = Math.max(T1.C[1] + T1.R, T2.C[1] + T2.R) + 12, P = [isoW(u0, v0), isoW(u1, v0), isoW(u0, v1), isoW(u1, v1)]; cam.x = clamp(cam.x, Math.min(...P.map(p => p[0])), Math.max(...P.map(p => p[0]))); cam.y = clamp(cam.y, Math.min(...P.map(p => p[1])), Math.max(...P.map(p => p[1]))); }")
rep("cam.z = clamp(nz, .08, 3);", "{ const fz = fitZoom(); if (nz < fz * .8 && !VIDEO_LIKE) { GLOBE.enter(); nz = fz * .8; } } cam.z = clamp(nz, .02, 3);")
rep("    if (TOWN.milestones.lights) lampGlow(n);\n  }", "    if (TOWN.milestones.lights) lampGlow(n);\n    W3.carLights(n);\n  }")
rep("function updateEnvChip() {", "function envLabel() { const h = envHour(), n = nightAmount(), d = duskAmount(), w = weatherNow(), L = w === 'clear' ? (n > .5 ? ['✨', 'Clear'] : ['☀️', 'Sunny']) : (WX_LABEL[w] || WX_LABEL.clear), hh = Math.floor(h) % 24, mm = Math.floor((h - Math.floor(h)) * 60), ic = n > .6 ? '🌙' : d > .25 ? (h < 12 ? '🌅' : '🌇') : String.fromCodePoint(0x1F550 + ((hh + 11) % 12)); return ic + ' ' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + '  ·  ' + L[0] + ' ' + L[1]; }\nfunction updateEnvBar() { const el = document.getElementById('envBar'); if (el) el.textContent = envLabel(); }\nfunction updateEnvChip() {")
# street lamps: zoomed far out they become small dots (big glows would melt the town into one bright blob)
rep("const gx = x + 11 * z, gy = y - 61 * z, R = clamp(110 * z, 22, 170);",
    "if (z < .18) { const r = clamp(16 * z, .8, 2.6); ctx.fillStyle = `rgba(255,214,140,${.75 * on * alpha})`; ctx.fillRect(x - r, y - 30 * z - r, 2 * r, 2 * r); continue; }\n    const gx = x + 11 * z, gy = y - 61 * z, R = clamp(110 * z, 0, 170);")
# opening the page: start over Benny's square (houses visible), 'Whole town' still zooms out to everything
rep("overview(); cam.x = target.x; cam.y = target.y; cam.z = target.z * .7;",
    "{ const [bx, by] = isoW(BHOME[0], BHOME[1]), R = 11; target.x = bx; target.y = by + 10; target.z = clamp(Math.min((VW - 20) / (2 * R * TW / Math.SQRT2), (VH * .55) / (2 * R * TH / Math.SQRT2)), .12, 1.2); } cam.x = target.x; cam.y = target.y; cam.z = target.z * .7; if (!location.hash || location.hash === '#') GLOBE.enter(true);")
# Benny walks along the real streets of the new town
b0 = src.index('function bennyRoute(h) {'); b1 = src.index('\n}\n', b0) + 3
src = src[:b0] + 'function bennyRoute(h) { return W3.bennyRoute(h, BHOME); }\n' + src[b1:]
# the map pauses while you walk through the streets
rep("function frame(now) {\n", "function frame(now) {\n  if (window.__walking || window.__globe) { last = 0; requestAnimationFrame(frame); return; }\n")
rep("function placeBenny() { const b = document.querySelector('.bottom'); if (b) $('bennyBtn').style.bottom = (b.offsetHeight + 10) + 'px'; }",
    "function placeBenny() { const b = document.querySelector('.bottom'); if (b) { $('bennyBtn').style.bottom = (b.offsetHeight + 10) + 'px'; $('walkBtn').style.bottom = (b.offsetHeight + 78) + 'px'; } }")
# street lamps of the new streets glow at night
rep("const go = () => CONTROL", "STREET_LAMPS.length = 0; for (const p of W3.T1.lamps.concat(W3.T2.lamps)) STREET_LAMPS.push(p);\nupdateEnvBar(); setInterval(updateEnvBar, 15000);\n$('walkBtn').addEventListener('click', startWalk); $('walkExit').addEventListener('click', () => W3D.exit());\nwindow.__d = { cam, target, isoW, HOUSES, W3, S, bennyNow, TOWN }; window.W3D = W3D;\nconst go = () => CONTROL")

# ---------- HTML: Walk button, joystick, back-to-map button, loading screen ----------
rep('<button id="bennyBtn" aria-label="Go to Benny"><i>🧢</i>Benny</button>',
    '<button id="bennyBtn" aria-label="Go to Benny"><i>🧢</i>Benny</button>\n<button id="walkBtn" aria-label="Walk through the streets"><i>🚶</i>Walk</button>\n'
    '<div id="joy"><i></i></div><button id="walkExit">← Map</button><div id="walkEnv"></div><div id="walkHint">Joystick to walk · drag to look around</div>\n'
    '<div id="globe"><div id="globeTitle">BENNY\'S WORLD 🌍</div><div id="globeHint">Tap the light to visit the town</div><button id="globeBack">🏘️ Visit the town</button></div>\n'
    '<div id="walkLoad"><div style="font-size:46px">🚶</div>Getting the streets ready…</div>')
css = ('#walkBtn{position:fixed;right:12px;bottom:218px;z-index:3;width:58px;height:58px;border-radius:29px;font:700 10px Poppins,system-ui,sans-serif;color:#fff;background:rgba(10,12,26,.9);border:2px solid #ffd23f;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:0}\n'
       '#walkBtn i{font-style:normal;font-size:22px;line-height:1}\n#card.on~#walkBtn{display:none}\n'
       '#joy{position:fixed;left:22px;bottom:34px;width:112px;height:112px;border-radius:50%;background:rgba(10,12,26,.45);border:2px solid rgba(255,255,255,.45);z-index:4;display:none;touch-action:none}\n'
       '#joy i{position:absolute;left:34px;top:34px;width:44px;height:44px;border-radius:50%;background:#ffd23f;box-shadow:0 2px 0 rgba(0,0,0,.3)}\n'
       '#walkExit{position:fixed;left:12px;top:12px;z-index:4;display:none;font:800 15px Poppins,system-ui,sans-serif;color:#1b1728;background:#ffd23f;border:0;border-radius:14px;padding:11px 16px;cursor:pointer;box-shadow:0 2px 0 rgba(0,0,0,.25)}\n'
       '#walkHint{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:4;display:none;font:600 13px Poppins,system-ui,sans-serif;color:#fff;background:rgba(10,12,26,.82);border-radius:12px;padding:8px 13px;white-space:nowrap;transition:opacity .6s;pointer-events:none}\n'
       '#walkHint.off{opacity:0}\n'
       '#walkLoad{position:fixed;inset:0;z-index:6;display:none;align-items:center;justify-content:center;flex-direction:column;gap:12px;background:rgba(10,12,26,.84);color:#fff;font:800 17px Poppins,system-ui,sans-serif}\n'
       '#walkLoad.on{display:flex}\n'
       '#globe{position:fixed;inset:0;z-index:2;display:none;background:radial-gradient(circle at 50% 45%,#0d1636,#050816 70%)}\n#globe canvas{display:block;position:absolute;inset:0}\n'
       '#globeTitle{position:absolute;left:0;right:0;top:172px;text-align:center;font:800 24px Poppins,system-ui,sans-serif;color:#fff;text-shadow:0 3px 0 #000;pointer-events:none}\n'
       '#globeHint{position:absolute;left:0;right:0;top:208px;text-align:center;font:600 15px Poppins,system-ui,sans-serif;color:#c3c9e4;pointer-events:none}\n'
       '#globeBack{position:absolute;left:50%;bottom:205px;transform:translateX(-50%);font:800 15px Poppins,system-ui,sans-serif;color:#1b1728;background:#ffd23f;border:0;border-radius:14px;padding:11px 18px;cursor:pointer;box-shadow:0 2px 0 rgba(0,0,0,.25);white-space:nowrap}\n'
       'body.globe .top,body.globe .bottom{z-index:4}\nbody.globe #bennyBtn,body.globe #walkBtn,body.globe #card,body.globe #hint,body.globe #sugg,body.globe #rw{display:none!important}\n'
       'body.walking .top,body.walking .bottom,body.walking #bennyBtn,body.walking #walkBtn,body.walking #card,body.walking #hint,body.walking #sugg,body.walking #rw{display:none!important}\n'
       'body.walking #joy,body.walking #walkExit,body.walking #walkHint,body.walking #walkEnv{display:block}\n'
       '#walkEnv{position:fixed;right:12px;top:14px;z-index:4;display:none;font:700 13px Poppins,system-ui,sans-serif;color:#fff;background:rgba(10,12,26,.82);border-radius:12px;padding:9px 12px;white-space:nowrap;pointer-events:none}\n'
       '.envbar{align-self:flex-end;pointer-events:none;font:700 12.5px Poppins,system-ui,sans-serif;color:#fff;background:rgba(10,12,26,.86);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:5px 10px;white-space:nowrap;margin-top:-3px}\n')
rep('</style>', css + '</style>')
rep('return k >= 20261118 && k <= 20261119; })();', 'return k >= 20261118 && k <= 20261118; })();')
# the layout of the new world is calculated once and shipped with the page
rep('<body>', '<body>\n<script src="world-data.js"></script>')
rep('<div class="hint" id="hint">', '<div class="envbar" id="envBar"></div>\n  <div class="hint" id="hint">')

out = W + ('site/' if mode == 'test' else 'live/')
os.makedirs(out, exist_ok=True)
if mode == 'test':
    rep("sc.src = 'three.min.js';", "sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';")
    src = re.sub(r'<script data-goatcounter[^>]*></script>\s*', '', src)
    rep("<title>Benny's Town – Find your house</title>", "<title>Benny's Town – Test</title>")
    rep('const SNOWY = (() => {', 'const SNOWY = false && (() => {')
open(out + 'index.html', 'w').write(src)
shutil.copy(W + 'pub/world-data.js', out + 'world-data.js')
print('built', out, len(src))
