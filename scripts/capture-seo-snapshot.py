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

EXTRACT = r"""() => {
  const m = (sel, attr='content') => document.head.querySelector(sel)?.getAttribute(attr) || null;
  const ld = [...document.head.querySelectorAll('script[type="application/ld+json"][data-rh]')]
    .map(s => s.textContent).filter(Boolean);
  const root = document.querySelector('main') || document.getElementById('root');
  const skip = el => el.closest('header, footer, nav, [aria-hidden="true"], #matrix-shell, script, style, noscript');
  const blocks = []; let len = 0;
  for (const el of root.querySelectorAll('h1, h2, h3, p, li')) {
    if (skip(el)) continue;
    const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
    if (!t || t.length < 2) continue;
    if (blocks.length && blocks[blocks.length-1].text === t) continue;
    blocks.push({ tag: el.tagName.toLowerCase(), text: t });
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
            data = await page.evaluate(EXTRACT)
            out[path] = data
            print(path, "|", data["title"], "|", data["canonical"], "|", data["h1"])
            await page.close()
        await b.close()
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print("wrote", len(out), "routes")

asyncio.run(main())
