"""Captures the rendered /airpods-case header + purchase section (mobile and desktop)
into scripts/airpods-shell-view.json for the static instant view. Re-run after layout changes:
    python3 scripts/capture-airpods-shell.py
"""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
JS = r"""() => {
  const roots = [document.querySelector('#root header'), document.querySelector('#root main > section')];
  const els = roots.flatMap(r => [r, ...r.querySelectorAll('*')]);
  const rules = new Set();
  const strip = s => s.replace(/::?(before|after|placeholder|selection|-webkit-[\w-]+|marker)\b/g, '').replace(/:(hover|focus|focus-visible|active|disabled|focus-within)/g,'');
  const scope = sel => sel.split(',').map(s => '#__airpods_shell ' + s.trim()).join(',');
  const walk = (list, wrap) => { for (const r of list) {
    if (r instanceof CSSMediaRule) { walk(r.cssRules, x => wrap('@media ' + r.conditionText + '{' + x + '}')); continue; }
    if (!(r instanceof CSSStyleRule)) continue;
    const parts = r.selectorText.split(',').filter(s => { const t = strip(s).trim() || '*'; try { return els.some(e => e.matches(t)); } catch { return false; } });
    if (parts.length) rules.add(wrap(scope(parts.join(',')) + '{' + r.style.cssText + '}'));
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, x => x); } catch {} }
  const html = roots.map(r => r.outerHTML).join('')
    .replace(/<h1\b/g, '<div').replace(/<\/h1>/g, '</div>')
    .replace(/ data-lov-[\w-]+="[^"]*"/g, '');
  return { html, css: [...rules].join('') };
}"""

async def main():
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        for key, w in (("mobile", 390), ("desktop", 1280)):
            ctx = await b.new_context(viewport={"width": w, "height": 1800})
            page = await ctx.new_page()
            await page.goto("http://localhost:8080/airpods-case", wait_until="networkidle")
            await page.wait_for_selector("#root img[data-airpods-hero]")
            await page.wait_for_timeout(800)
            out[key] = await page.evaluate(JS)
            await ctx.close()
    view = {"mobile": out["mobile"]["html"], "desktop": out["desktop"]["html"],
            "css": "".join(dict.fromkeys((out["mobile"]["css"] + "\n" + out["desktop"]["css"]).split("}\n")))}
    (ROOT / "scripts/airpods-shell-view.json").write_text(json.dumps(view))
    print({k: len(v) for k, v in view.items()})
asyncio.run(main())
