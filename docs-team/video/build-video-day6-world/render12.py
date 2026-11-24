import asyncio, sys, json, base64, subprocess
from playwright.async_api import async_playwright
out, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); FPS = 30
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await br.new_page(viewport={'width':1080,'height':1920}, device_scale_factor=1)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///tmp/ep12/page/index.html#hour=12.5&weather=clear'); await pg.wait_for_timeout(3000)
        info = await pg.evaluate('(c) => EP.init(c)', json.load(open('/tmp/ep12/caps.json'))); print(info, errs, flush=True)
        ff = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',out], stdin=subprocess.PIPE)
        f0, f1 = round(a * FPS), round(b * FPS)
        for f in range(f0, f1):
            d = await pg.evaluate('(t) => EP.frame(t)', f / FPS)
            ff.stdin.write(base64.b64decode(d.split(',', 1)[1]))
            if f % 60 == 0: print(out, f, errs[:2], flush=True)
        ff.stdin.close(); ff.wait(); await br.close()
asyncio.run(main())
