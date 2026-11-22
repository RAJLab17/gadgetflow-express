"""Live display regression: python3 scripts/test-discount-badges.py; screenshots stay in /tmp/browser."""
import asyncio,json
from pathlib import Path
import hashlib,requests
from playwright.async_api import async_playwright
OUT=Path('/tmp/browser/discount-badges')
CACHE=Path('/tmp/browser/mobile-layout/assets');CACHE.mkdir(parents=True,exist_ok=True)
def asset(url):
 path=CACHE/hashlib.sha256(url.encode()).hexdigest()
 if not path.exists():
  r=requests.get(url.replace('http://localhost:8080','https://raj.ch'),timeout=40);r.raise_for_status();path.write_bytes(r.content)
 return path.read_bytes()
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  results=[]
  for width,height in [(320,568),(390,844),(1440,1800)]:
   context=await browser.new_context(viewport={'width':width,'height':height})
   async def forward(route):
    await route.fulfill(status=200,body=await asyncio.to_thread(asset,route.request.url))
   await context.route('**/__l5e/assets-v1/**',forward)
   page=await context.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   for mode in ['vorschau','aus']:
    for route,prefix in [('',None),('nexus','nx'),('matrix','mx'),('airpods-case','ap')]:
     await page.goto(f'http://localhost:8080/{route}?bw={mode}')
     await page.locator('[data-site-header]').wait_for()
     await page.add_style_tag(content='div.fixed:has(> button):has(> span) { display: none !important; }')
     await page.wait_for_function('()=>document.querySelector(".discount-badge")!==null')
     await page.evaluate('document.fonts.ready');await page.wait_for_timeout(500)
     for font in ([100,120] if width==320 else [100]):
      await page.evaluate('(f)=>{document.documentElement.style.fontSize=f+"%";window.scrollTo({top:0,behavior:"instant"})}',font)
      await page.wait_for_timeout(200)
      label=f'{route or "home"}-{width}-{font}-{mode}'
      assert await page.evaluate('document.documentElement.scrollWidth===innerWidth'),label
      if prefix:
       head=page.locator(f'.{prefix}-heading');await head.scroll_into_view_if_needed()
       expected= '−10 %' if prefix=='nx' else '−16 %' if prefix=='mx' else None
       assert await head.locator('.discount-badge').all_text_contents()==([expected] if expected else []),label
       await head.screenshot(path=str(OUT/f'{label}-price.png'))
       if width<768:
        await page.evaluate('''p=>{const b=document.querySelector('.'+p+'-buy'),h=document.querySelector('[data-site-header]').getBoundingClientRect().bottom;window.scrollTo({top:scrollY+b.getBoundingClientRect().bottom-h+5,behavior:'instant'})}''',prefix)
        await page.wait_for_timeout(300)
        bar=page.locator('.mobile-product-buybar')
        assert await bar.locator('.discount-badge').all_text_contents()==([expected] if expected else []),label
        await bar.screenshot(path=str(OUT/f'{label}-sticky.png'))
       if mode=='vorschau' and prefix=='nx':
        await page.get_by_role('button',name='2 NEXUS',exact=False).click()
        await page.wait_for_timeout(200)
        assert await head.locator('.discount-badge').count()==0,label
        assert await page.locator('.mobile-product-buybar .discount-badge').count()==0,label
        assert await page.get_by_role('button',name='1 NEXUS',exact=False).locator('.discount-badge').inner_text()=='−10 %'
        await page.get_by_role('button',name='1 NEXUS',exact=False).click()
       if prefix=='mx':
        if mode=='vorschau': await page.get_by_role('button',name='2 Hüllen',exact=True).click()
        else: await page.get_by_role('checkbox',name='Passendes AirPods Case dazu',exact=True).click()
        assert await head.locator('.discount-badge').count()==0,label
        assert await page.locator('.mobile-product-buybar .discount-badge').count()==0,label
        if mode=='vorschau': await page.get_by_role('button',name='1 Hülle',exact=True).click()
        else: await page.get_by_role('checkbox',name='Passendes AirPods Case dazu',exact=True).click()
      else:
       btns=page.locator('.hh-buttons');await btns.scroll_into_view_if_needed()
       assert await btns.locator('.discount-badge').all_text_contents()==['−10 %','−16 %'],label
       await btns.screenshot(path=str(OUT/f'{label}-hero.png'))
       if mode=='vorschau':
        await page.locator('.bw-home-grid').scroll_into_view_if_needed()
        assert await page.locator('.bw-offer-price .discount-badge').all_text_contents()==['−16 %','−10 %'],label
        assert await page.locator('.bw-set .discount-badge,.bw-offer-detail .discount-badge,.bw-offer-badge .discount-badge').count()==0,label
        await page.locator('.bw-home-grid').screenshot(path=str(OUT/f'{label}-offers.png'))
      assert await page.evaluate('document.documentElement.scrollWidth===innerWidth'),label
      results.append(label);print('PASS',label)
   assert not errors,errors
   await context.close()
  await browser.close()
  (OUT/'results.json').write_text(json.dumps(results))
  print(len(results),'live layouts passed')
asyncio.run(main())
