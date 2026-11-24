import asyncio, sys, json, base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await br.new_page(viewport={'width':1080,'height':1920}, device_scale_factor=1)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///tmp/ep14/page/index.html#hour=12.5&weather=clear'); await pg.wait_for_timeout(3000)
        print(await pg.evaluate('(c) => EP.init(c[0], c[1])', [json.load(open('/tmp/ep14/caps.json')), json.load(open('/tmp/ep14/mouth.json'))]), errs, flush=True)
        for t in sys.argv[1:]:
            d = await pg.evaluate('(t) => EP.frame(t)', float(t))
            open(f'/tmp/ep14/st_{float(t):05.1f}.jpg','wb').write(base64.b64decode(d.split(',',1)[1]))
        print('errs', errs[:3]); await br.close()
asyncio.run(main())
