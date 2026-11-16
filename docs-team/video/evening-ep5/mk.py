s=open('/home/claude/bennys-town/index.html').read()
font=open('/tmp/build3/fontstyle.html').read()
s=s.replace('<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">', font)
s=s.replace('<script data-goatcounter="https://bennystown.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>','')
s=s.replace("const N = HOUSES.length;","const N = HOUSES.length;\nconst VIDEO = /video/.test(location.hash); let BPOS = [3.5, 3.65], BENNY_O = null, BENNY_CARD = true, HALL_GROW = 1, MARKET_K = null, EXTRA_OBJS = null;",1)
old="""  objs.push({ d: 7.15, f: () => {
    const [x, y] = uvS(3.5, 3.65);
    poly(ctx, [[x - 36 * z, y], [x, y + 15 * z], [x + 36 * z, y], [x, y - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z);
    drawBenny(ctx, x, y + 4 * z, .25 * z, { pose: 'sit', mood: TOWN.bankCents > 0 ? 'hope' : 'sad', look: [0, .6], blink: (S.T % 3.7) < .12 });"""
assert old in s, 'benny'
s=s.replace(old,"""  { const [cx0, cy0] = uvS(3.5, 3.65); if (!VIDEO || BENNY_CARD) objs.push({ d: 7.1, f: () => poly(ctx, [[cx0 - 36 * z, cy0], [cx0, cy0 + 15 * z], [cx0 + 36 * z, cy0], [cx0, cy0 - 15 * z]], '#a77b4f', '#7a5636', 1.5 * z) }); }
  objs.push({ d: BPOS[0] + BPOS[1] + .05, f: () => {
    const [x, y] = uvS(BPOS[0], BPOS[1]);
    drawBenny(ctx, x, y + 4 * z, .25 * z, Object.assign({ pose: 'sit', mood: TOWN.bankCents > 0 ? 'hope' : 'sad', look: [0, .6], blink: (S.T % 3.7) < .12 }, BENNY_O ? BENNY_O() : {}));""")
old2="  const b = isoBox(1.2, 14.6, 4.8, 16.4, 62,"
assert old2 in s
s=s.replace(old2,"  { const [gx, gy] = uvS(3, 16.4); ctx.save(); ctx.translate(gx, gy); ctx.scale(1, Math.max(.01, HALL_GROW)); ctx.translate(-gx, -gy); }\n"+old2)
old3="  if (z > .45) tag(tx, top - 96 * z, '🏛️ TOWN HALL', '#3c5a99', 1);"
assert old3 in s
s=s.replace(old3,"  ctx.restore();\n  if (z > .45 && HALL_GROW > .95) tag(tx, top - 96 * z, '🏛️ TOWN HALL', '#3c5a99', 1);")
s=s.replace("if (TOWN.milestones.townHall) [[1.5, 13.3,","if (TOWN.milestones.townHall && !VIDEO) [[1.5, 13.3,")
old4="  objs.sort((a, b) => a.d - b.d); for (const o of objs) o.f();"
assert old4 in s
s=s.replace(old4,"  if (EXTRA_OBJS) EXTRA_OBJS(objs);\n"+old4,1)
s=s.replace("  // labels\n","  if (VIDEO) return;\n  // labels\n",1)
s=s.replace("window.SITE = { flyTo, search, HOUSES, open3D };", open('/tmp/ep5/vidall.js').read()+"\nwindow.SITE = { flyTo, search, HOUSES, open3D };")
s=s.replace("const go = () => start();","const go = () => { if (VIDEO) { EP.init(__CAPS__, __MOUTH__); window.READY = true; return; } start(); };")
s=s.replace("__CAPS__",open('/tmp/ep5/caps.json').read()).replace("__MOUTH__",open('/tmp/ep5/mouth.json').read())
open('/tmp/ep5/ep5.html','w').write(s)
print('ok')
