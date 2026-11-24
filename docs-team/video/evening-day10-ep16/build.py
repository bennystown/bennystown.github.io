import json
T=json.load(open('/tmp/ep16/T.json'))
head='''/* ===================== FOLGE 16 — "Kitten pack + the cabin" (Mon 23.11.) ===================== */
(() => {
const VDUR = %s;
const vprog = (t, a, b) => clamp((t - a) / (b - a), 0, 1), vin = (t, a, b) => t >= a && t < b, ss = x => x * x * (3 - 2 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const T = %s;
let CAPS = [], OUT, OC, P = {};
''' % (T['dur'], json.dumps(T))
src=head+open('/tmp/ep16/helpers15.js').read()+open('/tmp/ep16/art15.js').read()+open('/tmp/ep16/art16.js').read()+open('/tmp/ep16/scenes16.js').read()+open('/tmp/ep16/main16.js').read()
open('/tmp/ep16/vid16.js','w').write(src)
s2=open('/home/claude/bennystown.github.io/index.html').read()
x="drawBenny(ctx, x, y + 4 * z, .25 * z, { pose: 'sit'"; s2=s2.replace(x,"window.__noBenny || "+x)
y="if (z > .45) tag(bx, by - (BNl"; s2=s2.replace(y,"if (z > .45 && !window.__noBenny) tag(bx, by - (BNl")
a="for (const sd of [-1, 1]) { armLine(c, sd * 48, ty + 22, sd * 40, ty - 100, HOOD); circle(c, sd * 40, ty - 108, 16, SKIN, OUT, lw); }"
assert s2.count(a)==1
s2=s2.replace(a,"for (const sd of [-1, 1]) { armLine(c, sd * 50, ty + 22, sd * 116, ty - 62, HOOD); circle(c, sd * 122, ty - 72, 16, SKIN, OUT, lw); }")
g="const go = () => CONTROL ? startControl() : LIVE ? startLive() : start();"
open('/tmp/ep16/page/index.html','w').write(s2.replace(g,src+"\n"+g).replace("https://bennystown.goatcounter.com","about:blank"))
print('built', len(src))
