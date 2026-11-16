import sys, os, json, subprocess
import numpy as np
from PIL import Image, ImageOps
import pytesseract

def rows(im):
    a = np.asarray(im).astype(int)
    b = a[:, 580:820]
    rm = (b[:, :, 0] > 180) & (b[:, :, 1] < 110)
    red = rm.mean(axis=1) > 0.3
    out = []; y = 0; H = len(red)
    while y < H:
        if red[y]:
            y0 = y
            while y < H and red[y]: y += 1
            if y - y0 > 60 and y0 > 2 and y < H - 2:
                out.append((y0 + y) // 2)
        y += 1
    return out

def prep(crop):
    g = ImageOps.grayscale(crop)
    g = ImageOps.invert(g)
    g = g.point(lambda v: 0 if v < 140 else 255)
    w, h = g.size
    g = g.resize((w // 2, h // 2), Image.LANCZOS)
    return ImageOps.expand(g, 20, fill=255)

SEEN=set()
def ocr_frame(path):
    im = Image.open(path).convert('RGB')
    res = []
    for cy in rows(im):
        if cy - 70 < 0 or cy + 80 > im.size[1]: continue
        nick = im.crop((10, cy - 64, 565, cy + 6))
        user = im.crop((10, cy + 8, 565, cy + 74))
        u = pytesseract.image_to_string(prep(user), config='--psm 7 -c tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._').strip()
        n = '' if u in SEEN else pytesseract.image_to_string(prep(nick), config='--psm 7').strip()
        SEEN.add(u)
        res.append([cy, u, n])
    return res

if __name__ == '__main__':
    d = sys.argv[1]; part = int(sys.argv[2]); nparts = int(sys.argv[3])
    files = sorted(os.listdir(d))[part::nparts]
    out = {}
    for f in files:
        out[f] = ocr_frame(os.path.join(d, f))
    json.dump(out, open(f'{d}_ocr_{part}.json', 'w'))
