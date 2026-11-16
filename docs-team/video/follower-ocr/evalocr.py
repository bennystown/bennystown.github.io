import json, sys, difflib
sys.path.insert(0,'/tmp/ocr')
from ocr import rows
from PIL import Image, ImageOps
import pytesseract
t=json.load(open('/home/claude/bennys-town/followers/tenants_2026-11-15_mittag.json'))['tenants']
old=[(x if isinstance(x,str) else x['name']).lower() for x in t]
WL='-c tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyz0123456789._'
def prepA(c, scale, thr):
    g=ImageOps.invert(ImageOps.grayscale(c))
    if thr: g=g.point(lambda v: 0 if v<thr else 255)
    w,h=g.size; g=g.resize((int(w*scale),int(h*scale)),Image.LANCZOS)
    return ImageOps.expand(g,20,fill=255)
variants={'base':(0.5,140,''),'full':(1.0,140,''),'full_nothr':(1.0,0,''),'half_nothr':(0.5,0,''),'full_lstm':(1.0,0,'--oem 1')}
frames=['f2/%05d.jpg'%n for n in range(760,812,3)]
score={k:[0,0] for k in variants}
for f in frames:
    im=Image.open(f).convert('RGB')
    for cy in rows(im):
        if cy-70<0 or cy+80>im.size[1]: continue
        user=im.crop((10,cy+8,565,cy+74))
        for k,(s,thr,extra) in variants.items():
            u=pytesseract.image_to_string(prepA(user,s,thr),config=f'--psm 7 {extra} {WL}').strip().lower()
            m=difflib.get_close_matches(u,old,1,0.75)
            if m:
                score[k][1]+=1; score[k][0]+= (m[0]==u)
print(score)
