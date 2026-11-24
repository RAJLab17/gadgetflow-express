"""
Captures the rendered SEO head + main text of every sitemap route from the
running dev server into src/content/prerender-snapshot.json.

The raj-prerender Vite plugin bakes this snapshot into per-route static HTML
so crawlers without JavaScript see each page's own title/H1/JSON-LD.

Re-run after changing page titles, descriptions, H1s or main copy:
    python3 scripts/capture-seo-snapshot.py
"""
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = "http://localhost:8080"
OUT = ROOT / "src/content/prerender-snapshot.json"

paths = re.findall(r"<loc>https://raj\.ch([^<]*)</loc>", (ROOT / "public/sitemap.xml").read_text())
paths = [p or "/" for p in dict.fromkeys(paths)]
# Non-sitemap routes that still need their own static head (duplicates / noindex pages).
paths += ["/dokumente", "/auto", "/launch", "/prelaunch", "/shop"]
import sys
if len(sys.argv) > 1:
    paths = sys.argv[1:]  # explicit paths (may include non-sitemap duplicates)

PRODUCT_ROUTES = {'/nexus', '/matrix', '/airpods-case'}
PRICE_COPY_ROUTES = PRODUCT_ROUTES | {'/', '/shop', '/launch', '/prelaunch', '/produkte'}

def price_free_snapshot(out):
    """Source captures are templates, never a cache of Shopify prices.

    The Vite publication hook fills Product offers from a fresh Shopify request.
    Keep monetary copy out of static metadata/FAQ/noscript to avoid contradictions.
    """
    money = re.compile(r'(?:ab\s+)?CHF\s*\d+(?:[.,]\d+)?(?:\.?)?[.–—-]*(?:\s*statt\s*(?:CHF\s*)?\d+(?:[.,]\d+)?[.–—-]*)?')
    def clean(value):
        if isinstance(value, str):
            return money.sub('aktuellem Preis im Shop', value)
        if isinstance(value, list):
            return [clean(v) for v in value]
        if isinstance(value, dict):
            return {k: clean(v) for k, v in value.items()}
        return value
    for route, snap in out.items():
        for key in ('description', 'ogDescription', 'twitterDescription'):
            if route in PRICE_COPY_ROUTES and snap.get(key):
                # Do not retain a price sentence in the static fallback metadata.
                snap[key] = re.sub(r'\s*(?:Jetzt\s+)?(?:ab\s+)?CHF\s*\d+(?:[.,]\d+)?[.–—-]*[,\s]*', ' ', snap[key]).strip()
        if route in PRICE_COPY_ROUTES:
            # Monetary paragraphs belong to live React, not the crawler template.
            snap['blocks'] = [b for b in snap['blocks'] if not money.search(b['text']) and not b['text'].upper().startswith('BLACK WEEK')]
        schemas = []
        for raw in snap['jsonLd']:
            schema = json.loads(raw)
            if schema.get('@type') == 'Product':
                offer = schema.get('offers', {})
                product_url = schema.get('url') or (offer.get('url', '') if isinstance(offer, dict) else '')
                if any(product_url.rstrip('/').endswith(p) for p in PRODUCT_ROUTES):
                    for key in ('price', 'priceSpecification', 'priceValidUntil'):
                        offer.pop(key, None)
            if route in PRICE_COPY_ROUTES:
                schema = clean(schema)
            schemas.append(json.dumps(schema, ensure_ascii=False, separators=(',', ':')))
        snap['jsonLd'] = schemas
    return out

EXTRACT = r"""(path) => {
  const m = (sel, attr='content') => document.head.querySelector(sel)?.getAttribute(attr) || null;
  const ld = [...document.head.querySelectorAll('script[type="application/ld+json"][data-rh]')]
    .map(s => s.textContent).filter(Boolean);
  const root = document.querySelector('main') || document.getElementById('root');
  const comparison = path === '/vergleich';
  const faqAnswers = new Map(comparison ? ld.flatMap(raw => {
    const schema = JSON.parse(raw);
    return schema['@type'] === 'FAQPage' ? schema.mainEntity.map(q => [q.name, q.acceptedAnswer.text]) : [];
  }) : []);
  const skip = el => el.closest('header, footer, nav, [aria-hidden="true"], #matrix-shell, script, style, noscript');
  const blocks = []; let len = 0;
  for (const el of root.querySelectorAll('h1, h2, h3, p, li, details > summary' + (comparison ? ', table' : ''))) {
    if (skip(el)) continue;
    if (comparison && el.tagName === 'TABLE') {
      const headers = [...el.querySelectorAll('thead th')].map(cell => cell.textContent.replace(/\s+/g, ' ').trim());
      blocks.push({ tag: 'p', text: headers.join(' | ') });
      for (const row of el.querySelectorAll('tbody tr')) {
        const cells = [...row.querySelectorAll('td')].map(cell => cell.textContent.replace(/\s+/g, ' ').trim());
        blocks.push({ tag: 'p', text: cells[0] + ': ' + cells.slice(1).map((value, i) => headers[i + 1] + ': ' + value).join(' | ') });
      }
      continue;
    }
    const t = (el.closest('details') ? el.textContent : el.innerText || '').replace(/\s+/g, ' ').trim();
    if (!t || t.length < 2) continue;
    if (blocks.length && blocks[blocks.length-1].text === t) continue;
    blocks.push({ tag: el.tagName === 'SUMMARY' ? 'h3' : el.tagName.toLowerCase(), text: t });
    const answer = faqAnswers.get(t);
    if (answer) blocks.push({ tag: 'p', text: answer });
    len += t.length; if (len > 12000) break;
  }
  const h1 = [...document.querySelectorAll('h1')].map(h => (h.innerText||'').replace(/\s+/g,' ').trim()).find(Boolean) || null;
  return {
    title: document.title,
    description: m('meta[name="description"]'),
    robots: m('meta[name="robots"]'),
    canonical: m('link[rel="canonical"]', 'href'),
    ogTitle: m('meta[property="og:title"]'),
    ogDescription: m('meta[property="og:description"]'),
    ogUrl: m('meta[property="og:url"]'),
    ogImage: m('meta[property="og:image"]'),
    ogImageWidth: m('meta[property="og:image:width"]'),
    ogImageHeight: m('meta[property="og:image:height"]'),
    ogImageType: m('meta[property="og:image:type"]'),
    ogImageAlt: m('meta[property="og:image:alt"]'),
    ogType: m('meta[property="og:type"]'),
    twitterTitle: m('meta[name="twitter:title"]'),
    twitterDescription: m('meta[name="twitter:description"]'),
    twitterImage: m('meta[name="twitter:image"]'),
    h1, jsonLd: ld, blocks,
  };
}"""

async def main():
    out = json.loads(OUT.read_text()) if OUT.exists() else {}
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(viewport={"width": 1280, "height": 1800})
        for path in paths:
            page = await ctx.new_page()
            await page.goto(BASE + path, wait_until="networkidle", timeout=60000)
            try:
                await page.wait_for_function("document.querySelector('link[rel=canonical]') && document.querySelector('h1')", timeout=15000)
            except Exception:
                pass
            await page.wait_for_timeout(800)
            if path in PRODUCT_ROUTES:
                # Never capture a half-loaded Product; fail instead of saving bad SEO.
                await page.wait_for_function("""() => [...document.head.querySelectorAll('script[type="application/ld+json"][data-rh]')].some(s => {
                  const schema = JSON.parse(s.textContent);
                  return schema['@type'] === 'Product' && /^\\d+\\.\\d{2}$/.test(schema.offers?.price);
                })""", timeout=30000)
            data = await page.evaluate(EXTRACT, path)
            out[path] = data
            print(path, "|", data["title"], "|", data["canonical"], "|", data["h1"])
            await page.close()
        await b.close()
    OUT.write_text(json.dumps(price_free_snapshot(out), ensure_ascii=False, indent=1) + "\n")
    print("wrote", len(out), "routes")

asyncio.run(main())
