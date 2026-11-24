import asyncio,json,time
from pathlib import Path
from playwright.async_api import async_playwright
UA='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
OUT=Path('/tmp/browser/product-seo')
OUT.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  ctx=await browser.new_context(user_agent=UA)
  results=[]
  for route,expected in [('/nexus','79.00'),('/matrix','49.00'),('/airpods-case','35.00')]:
   page=await ctx.new_page()
   console=[]
   page.on('pageerror',lambda err:console.append(str(err)))
   response=await page.goto('http://localhost:8080'+route,wait_until='domcontentloaded')
   html=await response.text()
   (OUT/(route[1:]+'-raw.html')).write_text(html)
   start=time.monotonic()
   for second in [1,6]:
    await asyncio.sleep(max(0,second-(time.monotonic()-start)))
    schemas=await page.evaluate("""() => [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent))""")
    products=[s for s in schemas if s.get('@type')=='Product']
    assert len(products)==1,(route,second,'Product count',len(products))
    assert products[0]['offers']['price']==expected,(route,second,products[0]['offers'])
    assert products[0]['offers']['priceCurrency']=='CHF'
    if route!='/airpods-case':
     assert products[0]['offers']['priceValidUntil']=='2026-11-30'
     assert products[0]['offers']['priceSpecification']['priceType']=='https://schema.org/StrikethroughPrice'
    else: assert 'priceSpecification' not in products[0]['offers']
    (OUT/(route[1:]+f'-{second}s.json')).write_text(json.dumps(schemas,ensure_ascii=False,indent=2))
    print(route,second,'seconds',products[0]['offers']['price'])
    results.append({'route':route,'seconds':second,'price':products[0]['offers']['price']})
   await page.screenshot(path=str(OUT/(route[1:]+'-6s.png')))
   assert not console,console
   await page.close()
  # Artificially delay browser Shopify responses: Product is absent, never price-less.
  slow=await browser.new_context(user_agent=UA)
  async def delay(route):
   await asyncio.sleep(4)
   await route.continue_()
  await slow.route('**/api/2026-10/graphql.json',delay)
  page=await slow.new_page()
  await page.goto('http://localhost:8080/nexus',wait_until='domcontentloaded')
  await page.wait_for_selector('.nx-heading h1')
  await page.wait_for_timeout(1000)
  products=await page.evaluate("""() => [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent)).filter(s=>s['@type']==='Product')""")
  assert not products,'Product must wait for delayed live Shopify price'
  await page.wait_for_function("""() => [...document.querySelectorAll('script[type="application/ld+json"]')].some(s=>{const p=JSON.parse(s.textContent);return p['@type']==='Product'&&p.offers.price==='79.00'})""",timeout=15000)
  print('Delayed Shopify: absent before live response, then 79.00; no missing-price offer')
  (OUT/'results.json').write_text(json.dumps(results,indent=2))
  await browser.close()
asyncio.run(main())
