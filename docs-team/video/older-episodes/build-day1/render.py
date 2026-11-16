import asyncio, base64, subprocess, time, sys
from playwright.async_api import async_playwright
FPS=30; DUR=37.5; OUT=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        page = await b.new_page(viewport={'width':540,'height':960})
        errs=[]; page.on('pageerror', lambda e: errs.append(str(e)))
        await page.goto('file:///tmp/build2/build2.html'); await page.wait_for_function('window.READY===true', timeout=15000)
        ff = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-',
              '-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',str(FPS),OUT], stdin=subprocess.PIPE)
        n=int(round(DUR*FPS)); t0=time.time()
        for i in range(n):
            d = await page.evaluate(f'EP.jpeg({i/FPS:.5f}, .93)')
            ff.stdin.write(base64.b64decode(d.split(',',1)[1]))
            if i%300==0: print(i, round(time.time()-t0,1), flush=True)
        ff.stdin.close(); rc=ff.wait(); print('done', rc, round(time.time()-t0,1), 'errors', errs[:3]); await b.close()
        sys.exit(rc)
asyncio.run(main())
