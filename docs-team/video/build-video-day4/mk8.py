s=open('/home/claude/bennystown.github.io/index.html').read()
font=open('/tmp/ep8/fontstyle.html').read()
def R(a,b,cnt=1):
    global s
    assert s.count(a)>=1, a[:70]; s=s.replace(a,b,cnt)
R('<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">', font)
R('<script data-goatcounter="https://bennystown.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>','')
R("const N = HOUSES.length;","const N = HOUSES.length;\nconst VIDEO = /video/.test(location.hash); let BPOS = [3.5, 3.65], BENNY_O = null, BENNY_CARD = true, EXTRA_OBJS = null, BDY = 0, BD = null, VIS = Infinity;")
R("""  objs.push({ d: 7.15, f: () => {
    const [x, y] = uvS(3.5, 3.65);
    poly(ctx, [[x - 36 * z, y], [x, y + 15 * z], [x + 36 * z, y], [x, y - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z);
    drawBenny(ctx, x, y + 4 * z, .25 * z, { pose: 'sit', mood: TOWN.bankCents > 0 ? 'hope' : 'sad', look: [0, .6], blink: (S.T % 3.7) < .12 });""",
"""  { const [cx0, cy0] = uvS(3.5, 3.65); if (!VIDEO || BENNY_CARD) objs.push({ d: 7.1, f: () => poly(ctx, [[cx0 - 36 * z, cy0], [cx0, cy0 + 15 * z], [cx0 + 36 * z, cy0], [cx0, cy0 - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z) }); }
  objs.push({ d: BD != null ? BD : BPOS[0] + BPOS[1] + .05, f: () => {
    const [x, y] = uvS(BPOS[0], BPOS[1]);
    drawBenny(ctx, x, y + 4 * z - BDY * z, .25 * z, Object.assign({ pose: 'sit', mood: TOWN.bankCents > 0 ? 'hope' : 'sad', look: [0, .6], blink: (S.T % 3.7) < .12 }, BENNY_O ? BENNY_O() : {}));""")
R("if (TOWN.milestones.townHall) [[0.95, 16.95,","if (TOWN.milestones.townHall && !VIDEO) [[0.95, 16.95,")
R("  featureObjs(objs);\n","  featureObjs(objs);\n  if (EXTRA_OBJS) EXTRA_OBJS(objs);\n")
R("  // labels\n","  if (VIDEO) return;\n  // labels\n")
# new houses pop in (VIS)
R("for (const h of HOUSES) { const [sx, sy] = uvS(h.i, h.j);","for (const h of HOUSES) { if (h.idx >= VIS) continue; const [sx, sy] = uvS(h.i, h.j);")
R("if (bk <= .01) return; const k = z / sp_.sc,","const pk_ = VIDEO ? eBack(clamp((VIS - h.idx) / 10, 0, 1)) : 1; if (bk * pk_ <= .01) return; const k = z / sp_.sc * pk_,")
R("for (let idx = HOUSES.length; idx < LOTA.length","for (let idx = Math.min(HOUSES.length, Math.ceil(VIS)); idx < LOTA.length")
R("if (idx < HOUSES.length + 40) objs.push(","if (idx < (VIDEO ? HOUSES.length : HOUSES.length + 40)) objs.push(")
R("window.SITE = {", open('/tmp/ep8/vid8.js').read()+"\nwindow.SITE = {")
R("const go = () => CONTROL ? startControl() : LIVE ? startLive() : start();","const go = () => { if (VIDEO) { EP.init(__CAPS__, __MOUTH__); window.READY = true; return; } CONTROL ? startControl() : LIVE ? startLive() : start(); };")
s=s.replace("__CAPS__",open('/tmp/ep8/caps.json').read()).replace("__MOUTH__",open('/tmp/ep8/mouth.json').read())
open('/tmp/ep8/ep8.html','w').write(s); print('ok')
