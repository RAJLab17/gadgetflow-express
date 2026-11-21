"""Live public-page regression: measured header clearance, including font/viewport changes.

Run: python3 scripts/test-header-spacing.py
Original hosted assets are forwarded in the test only because local Vite has no media proxy.
Screenshots and cached originals stay outside the checkout.
"""
import asyncio
import hashlib
from pathlib import Path

import requests
from playwright.async_api import async_playwright

OUT = Path('/tmp/browser/header-spacing')
PHONES = [('iphone14', 390, 844), ('iphoneSE', 320, 568),
          ('pixel7', 412, 915), ('galaxyS9plus', 360, 740)]
PRODUCTS = [('nexus', 'nx'), ('matrix', 'mx'), ('airpods-case', 'ap')]


def original_asset(url):
    path = OUT / 'assets' / hashlib.sha256(url.encode()).hexdigest()
    if not path.exists():
        response = requests.get(url.replace('http://localhost:8080', 'https://raj.ch'), timeout=30)
        response.raise_for_status()
        path.write_bytes(response.content)
    return path.read_bytes()


async def main():
    (OUT / 'assets').mkdir(parents=True, exist_ok=True)
    checks = 0
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)

        async def check_device(name, width, height):
            nonlocal checks
            context = await browser.new_context(viewport={'width': width, 'height': height},
                                                is_mobile=width < 768)

            async def forward_asset(route):
                body = await asyncio.to_thread(original_asset, route.request.url)
                await route.fulfill(status=200, body=body)

            await context.route('**/__l5e/assets-v1/**', forward_asset)
            page = await context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            for mode in ['vorschau', 'aus']:
                for product, prefix in PRODUCTS:
                    await page.goto(f'http://localhost:8080/{product}?bw={mode}', wait_until='domcontentloaded')
                    await page.locator(f'.{prefix}-gallery-frame').wait_for()
                    await page.wait_for_function('(p) => document.querySelector("."+p+"-gallery-frame img")?.naturalWidth > 0', arg=prefix)
                    await page.evaluate('document.fonts.ready')
                    for percent in [100, 120, 130]:
                        await page.evaluate('(p) => document.documentElement.style.fontSize = p+"%"', percent)
                        await page.wait_for_timeout(180)
                        result = await page.evaluate('''(p) => {
                            const h = document.querySelector('header[data-site-header]').getBoundingClientRect();
                            const g = document.querySelector('.'+p+'-gallery-frame').getBoundingClientRect();
                            const i = document.querySelector('.'+p+'-gallery-frame img');
                            const r = i.getBoundingClientRect(), s = getComputedStyle(i);
                            const fittedHeight = s.objectFit === 'contain' ? Math.min(r.height, r.width*i.naturalHeight/i.naturalWidth) : r.height;
                            const insideTop = s.objectPosition.endsWith('0%') ? 0 : (r.height-fittedHeight)/2;
                            return {header:h.bottom, gap:g.top-h.bottom, imageGap:r.top+insideTop-h.bottom,
                                measured:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-h'))};
                        }''', prefix)
                        label = f'{name}-{mode}-{product}-{percent}'
                        assert abs(result['measured'] - result['header']) < 1, (label, result)
                        assert result['gap'] >= -0.5, (label, result)
                        assert result['imageGap'] >= -0.5, (label, result)
                        if width < 768:
                            assert result['gap'] <= 8, (label, result)
                            assert result['imageGap'] <= 8, (label, result)
                        await page.screenshot(path=str(OUT / f'{label}.png'))
                        checks += 1
                        print(label, result)

            # Verify resize/orientation changes on an already mounted page.
            await page.set_viewport_size({'width': height, 'height': width})
            await page.evaluate('window.dispatchEvent(new Event("orientationchange"))')
            await page.wait_for_timeout(250)
            assert await page.evaluate('''() => Math.abs(document.querySelector('header[data-site-header]').getBoundingClientRect().height - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-h'))) < 1''')
            checks += 1
            assert not errors, errors
            await context.close()

        for device in PHONES + [('desktop', 1440, 900)]:
            await check_device(*device)

        # Shared homepage/editorial/catalogue layouts must also start below the header.
        for width, height in [(390, 844), (1440, 900)]:
            context = await browser.new_context(viewport={'width': width, 'height': height})
            page = await context.new_page()
            for mode in ['vorschau', 'aus']:
                for route in ['', 'faq', 'about', 'apex', 'produkte', 'manuals', 'reviews', 'versand', 'kontakt']:
                    await page.goto(f'http://localhost:8080/{route}?bw={mode}')
                    await page.locator('header[data-site-header]').wait_for()
                    await page.evaluate('document.documentElement.style.fontSize="130%"')
                    await page.wait_for_timeout(250)
                    result = await page.evaluate('''() => {
                        const h=document.querySelector('header[data-site-header]');
                        const content=document.querySelector('main') || h.nextElementSibling;
                        const title=document.querySelector('h1');
                        return {padding:parseFloat(getComputedStyle(content).paddingTop), height:h.getBoundingClientRect().height,
                            titleTop:title?.getBoundingClientRect().top};
                    }''')
                    assert abs(result['padding'] - result['height']) < 1, (route, width, mode, result)
                    assert result['titleTop'] >= result['height'] - 1, (route, width, mode, result)
                    checks += 1
            await context.close()
        await browser.close()
    print(f'{checks} header spacing checks passed; screenshots: {OUT}')


asyncio.run(main())