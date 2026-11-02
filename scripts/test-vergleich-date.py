"""Validate the requested modification date of /vergleich."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class VergleichDateTests(unittest.TestCase):
    def test_modified_on_2_november_2026(self):
        snapshot = json.loads((ROOT / "src/content/prerender-snapshot.json").read_text())
        articles = [json.loads(raw) for raw in snapshot["/vergleich"]["jsonLd"]
                    if json.loads(raw).get("@type") == "Article"]
        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]["dateModified"], "2026-11-02")


if __name__ == "__main__":
    unittest.main()