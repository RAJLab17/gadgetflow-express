"""Check the authoritative modification date of the revised comparison article."""
import json
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTE = "/blog/bester-3in1-wireless-charger-schweiz-2026"


class ComparisonDateTests(unittest.TestCase):
    def test_article_modified_on_19_october_2026(self):
        snapshot = json.loads((ROOT / "src/content/prerender-snapshot.json").read_text())
        articles = [json.loads(ld) for ld in snapshot[ROUTE]["jsonLd"]
                    if json.loads(ld).get("@type") == "Article"]
        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]["dateModified"], "2026-10-19")

    def test_sitemap_modified_on_19_october_2026(self):
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = ET.parse(ROOT / "public/sitemap.xml").getroot().findall("s:url", ns)
        entries = [entry for entry in urls if entry.findtext("s:loc", namespaces=ns) == "https://raj.ch" + ROUTE]
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0].findtext("s:lastmod", namespaces=ns), "2026-10-19")


if __name__ == "__main__":
    unittest.main()