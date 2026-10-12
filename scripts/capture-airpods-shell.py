"""Captures the rendered /airpods-case header + purchase section (mobile and desktop)
into scripts/airpods-shell-view.json for the static instant view. Re-run after layout changes:
    python3 scripts/capture-airpods-shell.py
"""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
JS = r"""() => {
  const main = document.querySelector('#root main');
  const roots = [document.querySelector('#root header'), main, main.querySelector(':scope > section')];
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
  // Only the first product photo may load in the instant view: keep header + first section,
  // force the hero visible, and turn every other <img> into an empty box with the same classes.
  const header = roots[0].cloneNode(true);
  const m = main.cloneNode(false); m.appendChild(roots[2].cloneNode(true));
  for (const root of [header, m]) for (const img of root.querySelectorAll('img')) {
    if (img.hasAttribute('data-airpods-hero')) {
      img.className = img.className.replace(/\bopacity-0\b/, 'opacity-100').replace(/\btransition-opacity\b/, '');
      img.removeAttribute('loading'); img.setAttribute('fetchpriority', 'high');
    } else if (img.closest('header') && img.matches('[draggable]')) {
      img.setAttribute('data-shell-logo', '');
    } else {
      const box = document.createElement('span');
      box.className = img.className; box.setAttribute('style', (img.getAttribute('style') || '') + ';display:block');
      img.replaceWith(box);
    }
  }
  const html = [header, m].map(r => r.outerHTML).join('')
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
    import base64, re
    logo = "data:image/webp;base64," + base64.b64encode((ROOT / "src/assets/logo-new-400w.webp").read_bytes()).decode()
    for k in out:
        out[k]["html"] = re.sub(r'(<img data-shell-logo="")([^>]*?)src="[^"]*"', lambda mm: '<img' + mm.group(2) + 'src="' + logo + '"', out[k]["html"])
        out[k]["html"] = re.sub(r'<img([^>]*?)data-shell-logo=""', r'<img\1', out[k]["html"])
        out[k]["html"] = re.sub(r'(<img[^>]*?)src="(/src/assets/logo[^"]*)"', lambda mm: mm.group(1) + 'src="' + logo + '"', out[k]["html"])
    view = {"mobile": out["mobile"]["html"], "desktop": out["desktop"]["html"],
            "css": "".join(dict.fromkeys((out["mobile"]["css"] + "\n" + out["desktop"]["css"]).split("}\n")))}
    (ROOT / "scripts/airpods-shell-view.json").write_text(json.dumps(view))
    print({k: len(v) for k, v in view.items()})
asyncio.run(main())
