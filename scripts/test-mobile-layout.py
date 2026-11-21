"""Browser regression for narrow mobile layouts and purchase bar visibility.
Run: python3 scripts/test-mobile-layout.py
"""
import asyncio
import hashlib
import json
from pathlib import Path
import requests
from playwright.async_api import async_playwright

OUT = Path('/tmp/browser/mobile-layout')
SIZES = [(320,568),(360,740),(390,844),(412,915)]
ROUTES = [('start','',None),('nexus','nexus','nx'),('matrix','matrix','mx'),('airpods','airpods-case','ap')]

def asset(url):
    path = OUT / 'assets' / hashlib.sha256(url.encode()).hexdigest()
    if not path.exists():
        r=requests.get(url.replace('http://localhost:8080','https://raj.ch'),timeout=40)
        r.raise_for_status()
        path.write_bytes(r.content)
    return path.read_bytes()

async def main():
    (OUT/'assets').mkdir(parents=True,exist_ok=True)
    results=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        for width,height in SIZES:
            context=await browser.new_context(viewport={'width':width,'height':height},is_mobile=True)
            async def forward(route):
                await route.fulfill(status=200,body=await asyncio.to_thread(asset,route.request.url))
            await context.route('**/__l5e/assets-v1/**',forward)
            page=await context.new_page()
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            for mode in ['vorschau','aus']:
                for name,route,prefix in ROUTES:
                    await page.goto(f'http://localhost:8080/{route}?bw={mode}')
                    await page.locator('header[data-site-header]').wait_for()
                    # Local-only preview mode switch is not part of the published shop.
                    await page.add_style_tag(content='div.fixed:has(> button):has(> span) { display: none !important; }')
                    await page.evaluate('document.fonts.ready')
                    if prefix:
                        await page.wait_for_function('(p)=>document.querySelector("."+p+"-gallery-frame img")?.naturalWidth>0',arg=prefix)
                    else:
                        await page.wait_for_function('()=>document.querySelector(".hh-case img")?.naturalWidth>0')
                    for font in [100,120]:
                        await page.evaluate('(f)=>{document.documentElement.style.fontSize=f+"%";window.scrollTo({top:0,behavior:"instant"})}',font)
                        await page.wait_for_timeout(350)
                        label=f'{name}-{width}-{font}-{mode}'
                        data=await page.evaluate('''p=>{
                            const h=document.querySelector('[data-site-header]').getBoundingClientRect();
                            const frame=p?document.querySelector('.'+p+'-gallery-frame'):null;
                            const buy=p?document.querySelector('.'+p+'-buy'):document.querySelector('.hh-buttons');
                            const rating=document.querySelector('.mx-rating'),photos=document.querySelector('.mx-photos');
                            const a=rating?.getBoundingClientRect(),b=photos?.getBoundingClientRect();
                            return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,header:h.bottom,
                                gap:frame?frame.getBoundingClientRect().top-h.bottom:null,
                                buttonTop:buy?.getBoundingClientRect().top,buttonBottom:buy?.getBoundingClientRect().bottom,
                                ratingOverlap:a&&b?Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)):0,
                                sticky:document.querySelector('.mobile-product-buybar')?.classList.contains('is-visible')??false};
                        }''',prefix)
                        assert data['scrollWidth']==width,(label,data)
                        if mode=='vorschau': assert data['header']<=110,(label,data)
                        if prefix: assert 0<=data['gap']<=8,(label,data)
                        assert not data['sticky'],(label,data)
                        assert data['ratingOverlap']==0,(label,data)
                        data.update(label=label,firstScreenBuy=data['buttonBottom']<=height)
                        results.append(data)
                        await page.screenshot(path=str(OUT/f'{label}.png'))
                        if prefix:
                            await page.evaluate('window.scrollTo({top:20,behavior:"instant"})')
                            await page.wait_for_timeout(100)
                            assert not await page.locator('.mobile-product-buybar').evaluate('(e)=>e.classList.contains("is-visible")'),label
                            await page.locator('.'+prefix+'-buy').scroll_into_view_if_needed()
                            await page.wait_for_timeout(200)
                            assert not await page.locator('.mobile-product-buybar').evaluate('(e)=>e.classList.contains("is-visible")'),label
                            await page.evaluate('''p=>{const b=document.querySelector('.'+p+'-buy'),h=document.querySelector('[data-site-header]').getBoundingClientRect().bottom;window.scrollTo({top:scrollY+b.getBoundingClientRect().bottom-h+5,behavior:'instant'})}''',prefix)
                            await page.wait_for_timeout(300)
                            assert await page.locator('.mobile-product-buybar').evaluate('(e)=>e.classList.contains("is-visible")'),label
                            # The same original purchase control still handles validation/cart actions.
                            if prefix=='mx' and font==120 and mode=='vorschau':
                                await page.get_by_role('complementary',name='Produkt kaufen').get_by_role('button',name='Jetzt kaufen').click()
                                await page.get_by_role('alert').filter(has_text='Bitte wähle zuerst dein iPhone-Modell').wait_for()
                        print(label,data)
            assert not errors,errors
            await context.close()
        await browser.close()
    (OUT/'results.json').write_text(json.dumps(results,indent=2))
    print(f'{len(results)} layouts passed; original buy-button positions recorded, not forced by redesign.')

asyncio.run(main())