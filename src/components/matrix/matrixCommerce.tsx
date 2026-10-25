import payVisa from "@/assets/payments/visa.svg";
import payMastercard from "@/assets/payments/mastercard.svg";
import payAmex from "@/assets/payments/amex.svg";
import payApplePay from "@/assets/payments/apple-pay.svg";
import payGooglePay from "@/assets/payments/google-pay.svg";
import payTwint from "@/assets/payments/twint.png";
import payKlarna from "@/assets/payments/klarna.svg";

/** Shared between /matrix and /airpods-case so both product pages always match. */

/** Rabatt, wenn iPhone-Hülle und AirPods-Hülle zusammen gekauft werden. */
export const BUNDLE_DISCOUNT = 15;
/** Shopify Rabattcode, der den Bundle-Rabatt im Checkout anwendet. */
export const BUNDLE_DISCOUNT_CODE = "MATRIXBUNDLE";
/** Lieferhinweis unter dem Kaufbutton und in der FAQ. */
export const MATRIX_DELIVERY_TEXT = "Versand ab Dienstag, 20. Oktober · Lieferung in 1–2 Werktagen";
/** Lieferhinweis auf /matrix: nur die Lieferzeit, ohne Startdatum. */
export const MATRIX_DELIVERY_TEXT_NO_DATE = "Lieferung in 1–2 Werktagen";
/** Trust-Zeilen unter dem Kaufbutton (Mobile / Desktop). */
export const MATRIX_TRUST_MOBILE = "30 Tage Rückgabe · Schweizer Marke · Gratis Versand";
export const MATRIX_TRUST_DESKTOP = "Sichere Bezahlung · 30 Tage Rückgabe";

/* ── Shopify Variant ID mapping ─────────────────────────────────────── */
export const CASE_VARIANT_IDS: Record<string, Record<string, string>> = {
  // modelId → caseId → gid
  "17pro":    { cherry: "gid://shopify/ProductVariant/59116736545093", onyx: "gid://shopify/ProductVariant/59116736577861" },
  "17promax": { cherry: "gid://shopify/ProductVariant/59116736610629", onyx: "gid://shopify/ProductVariant/59116736643397" },
  "18pro":    { cherry: "gid://shopify/ProductVariant/59116736676165", onyx: "gid://shopify/ProductVariant/59116736708933" },
  "18promax": { cherry: "gid://shopify/ProductVariant/59116736741701", onyx: "gid://shopify/ProductVariant/59116736774469" },
};

export const AIRPODS_VARIANT_IDS: Record<string, string> = {
  cherry: "gid://shopify/ProductVariant/59116737364293",
  onyx:   "gid://shopify/ProductVariant/59116737397061",
};

const PAYMENTS = [
  [payVisa, "Visa"],
  [payMastercard, "Mastercard"],
  [payAmex, "American Express"],
  [payApplePay, "Apple Pay"],
  [payGooglePay, "Google Pay"],
  [payTwint, "TWINT"],
  [payKlarna, "Klarna"],
] as const;

/* ── Zahlungsmethoden-Leiste ── */
export const PaymentMethodsBar = () => (
  <div
    className="mt-5 rounded-xl flex items-center gap-3 md:gap-4 flex-wrap justify-center"
    style={{
      background: "#0a0908",
      border: "1px solid rgba(155,107,63,.20)",
      padding: "10px 14px",
    }}
  >
    <p className="text-[10px] uppercase tracking-[0.22em] w-full text-center md:w-auto md:text-left" style={{ color: "#9b6b3f" }}>
      Sichere Zahlungsmethoden
    </p>
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {PAYMENTS.map(([src, name]) => (
        <img
          key={name}
          src={src}
          alt={`Zahlung mit ${name}`}
          loading="lazy"
          decoding="async"
          style={{
            height: 22,
            width: "auto",
            objectFit: "contain",
            background: "white",
            borderRadius: 4,
            padding: "2px 5px",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        />
      ))}
    </div>
  </div>
);
