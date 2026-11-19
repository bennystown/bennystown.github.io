s=open('/tmp/world/site/index.html').read()
s=s.replace("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js","three.min.js")
a="const go = () => CONTROL ? startControl() : LIVE ? startLive() : start();"
assert s.count(a)==1
s=s.replace(a, open('/tmp/ep12/vid12.js').read()+"\n"+a)
open('/tmp/ep12/page/index.html','w').write(s)
