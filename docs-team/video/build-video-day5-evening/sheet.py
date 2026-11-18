import glob
from PIL import Image
fs=sorted(glob.glob('/tmp/ep11/st_*.jpg')); cols=7; rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*270,rows*480))
for i,f in enumerate(fs): S.paste(Image.open(f).resize((270,480)),((i%cols)*270,(i//cols)*480))
S.save('/tmp/ep11/sheet.jpg',quality=88)
