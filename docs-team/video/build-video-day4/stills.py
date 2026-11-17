import asyncio, base64, sys
from playwright.async_api import async_playwright
async def main(ts):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        page = await b.new_page(); errs=[]; page.on('pageerror', lambda e: errs.append(str(e)))
        await page.goto('file:///tmp/ep8/ep8.html#video'); await page.wait_for_function('window.READY===true', timeout=15000)
        
        for t in ts:
            d = await page.evaluate(f'EP.jpeg({t}, .9)'); open(f'/tmp/ep8/st_{t:05.2f}.jpg','wb').write(base64.b64decode(d.split(',')[1]))
        print('errors', errs); await b.close()
asyncio.run(main([float(x) for x in sys.argv[1:]]))
