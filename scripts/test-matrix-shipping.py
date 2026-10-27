"""Check the approved product availability and shipping-time rules."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class MatrixShippingTests(unittest.TestCase):
    def products(self):
        snapshot = json.loads((ROOT / "src/content/prerender-snapshot.json").read_text())
        for route in ("/matrix", "/airpods-case"):
            products = [json.loads(ld) for ld in snapshot[route]["jsonLd"]
                        if json.loads(ld).get("@type") == "Product"]
            self.assertEqual(len(products), 1, route)
            yield route, products[0]

    def test_products_are_in_stock(self):
        for route, product in self.products():
            with self.subTest(route=route):
                self.assertEqual(product["offers"]["availability"], "https://schema.org/InStock")

    def test_delivery_takes_one_to_two_days_after_dispatch(self):
        for route, product in self.products():
            with self.subTest(route=route):
                delivery = product["offers"]["shippingDetails"]["deliveryTime"]
                self.assertEqual(delivery["transitTime"]["minValue"], 2)
                self.assertEqual(delivery["transitTime"]["maxValue"], 3)
                self.assertEqual(delivery["transitTime"]["unitCode"], "d")
                self.assertEqual(delivery["handlingTime"]["minValue"], 0)
                self.assertEqual(delivery["handlingTime"]["maxValue"], 0)


    def test_matrix_page_has_no_fixed_shipping_start_date(self):
        snapshot = json.loads((ROOT / "src/content/prerender-snapshot.json").read_text())
        matrix = json.dumps(snapshot["/matrix"], ensure_ascii=False)
        self.assertNotIn("Versand ab", matrix)
        self.assertIn("Lieferung in 2–3 Werktagen", matrix)


if __name__ == "__main__":
    unittest.main()