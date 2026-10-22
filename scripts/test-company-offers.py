"""Verify approved company terms and FAQ consistency without testing presentation."""
import json
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTE = "/kabelloses-laden-firmen-schweiz"

class CompanyOfferTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = json.loads((ROOT / "src/content/prerender-snapshot.json").read_text())[ROUTE]
        cls.texts = [block["text"] for block in cls.page["blocks"]]

    def test_minimum_quantity(self):
        self.assertIn("Für Teams ab 10 Stück bieten wir Mengenpreise. Schreiben Sie uns, wir senden Ihnen gerne ein Angebot.", self.texts)

    def test_free_sample_on_request(self):
        self.assertIn("Kostenloses Muster auf Wunsch.", self.texts)

    def test_invoice_orders(self):
        self.assertIn("Bestellung auf Rechnung.", self.texts)

    def test_delivery(self):
        self.assertIn("In der Regel innert weniger Werktage ab Lager in Weinfelden TG.", self.texts)

    def test_compatibility(self):
        self.assertIn("iPhone 12 bis iPhone 18 Pro Max, Apple Watch sowie AirPods mit kabellosem Ladecase.", self.texts)

    def test_support(self):
        self.assertIn("RAJ direkt, persönlich und auf Deutsch.", self.texts)

    def test_faq_matches_visible_terms(self):
        faqs = [json.loads(ld) for ld in self.page["jsonLd"] if json.loads(ld).get("@type") == "FAQPage"]
        self.assertEqual(len(faqs), 1)
        self.assertEqual(len(faqs[0]["mainEntity"]), 4)
        for question in faqs[0]["mainEntity"]:
            self.assertIn(question["acceptedAnswer"]["text"], self.texts)

    def test_sitemap_date(self):
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        entries = ET.parse(ROOT / "public/sitemap.xml").getroot().findall("s:url", ns)
        found = [entry for entry in entries if entry.findtext("s:loc", namespaces=ns) == "https://raj.ch" + ROUTE]
        self.assertEqual(len(found), 1)
        self.assertEqual(found[0].findtext("s:lastmod", namespaces=ns), "2026-10-22")

if __name__ == "__main__":
    unittest.main()