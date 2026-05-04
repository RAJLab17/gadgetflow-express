// Shared JSON-LD schema builders for use via react-helmet-async <Helmet>.
// Keep page-specific schemas page-local; reusable building blocks live here.

export const ORG = { "@type": "Organization", name: "RAJ" } as const;
export const PUBLISHER = {
  "@type": "Organization",
  name: "RAJ",
  url: "https://raj.ch",
} as const;

export const PRODUCT_NEXUS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "RAJ NEXUS 3-in-1 Wireless Charger",
  description:
    "Premium 3-in-1 wireless charging station for iPhone, Apple Watch, and AirPods. Qi2.2 certified with up to 25W fast charging. Foldable, adjustable design. Swiss Brand.",
  image: "https://raj.ch/raj-nexus-product.png",
  brand: { "@type": "Brand", name: "RAJ" },
  manufacturer: {
    "@type": "Organization",
    name: "RAJ GmbH (in Gründung)",
    url: "https://raj.ch",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Weinfelden",
      addressRegion: "Thurgau",
      postalCode: "8570",
      addressCountry: "CH",
    },
  },
  sku: "RAJ-NEXUS-001",
  category: "Electronics > Chargers > Wireless Chargers",
  material: "Premium aluminum and silicone",
  color: "Black / Gold",
  weight: { "@type": "QuantitativeValue", value: "200", unitCode: "GRM" },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Certification", value: "Qi2.2 Certified" },
    { "@type": "PropertyValue", name: "CE Certified", value: "Yes" },
    {
      "@type": "PropertyValue",
      name: "Charging Speed",
      value: "Up to 25W (iPhone currently 15W), 5W (Apple Watch), 5W (AirPods)",
    },
    {
      "@type": "PropertyValue",
      name: "Compatibility",
      value: "iPhone 12/13/14/15/16/17 Series, Apple Watch Series 1-10, AirPods Pro/3/4",
    },
    { "@type": "PropertyValue", name: "Design", value: "Foldable, adjustable angle" },
    { "@type": "PropertyValue", name: "Country of Brand", value: "Switzerland" },
  ],
  offers: {
    "@type": "Offer",
    url: "https://raj.ch",
    priceCurrency: "CHF",
    price: "99.00",
    priceValidUntil: "2026-12-31",
    availability: "https://schema.org/PreOrder",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "RAJ GmbH (in Gründung)" },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "CH",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "CHF" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "CH" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "d" },
        transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "d" },
      },
    },
  },
};

export const FAQ_NEXUS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist der RAJ NEXUS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der RAJ NEXUS ist ein 3-in-1 Wireless Charger der gleichzeitig ein iPhone, eine Apple Watch und AirPods kabellos lädt. Er ist Qi2.2-zertifiziert und stammt von einer Swiss Brand.",
      },
    },
    {
      "@type": "Question",
      name: "Was kostet der RAJ NEXUS in der Schweiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der RAJ NEXUS kostet CHF 99 im Early Access (Founder Edition) und CHF 129 nach dem Launch. Der Preis beinhaltet das Ladegerät und ein USB-C Netzteil.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Qi2 und Qi2.2?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qi2.2 ist die Weiterentwicklung von Qi2 mit verbesserter Energieeffizienz, besserem Wärmemanagement und strengeren Sicherheitsprüfungen. Beide laden iPhones mit bis zu 15W (Qi2.2 unterstützt bis 25W), aber Qi2.2 ist zukunftssicherer und ermöglicht perspektivisch höhere Ladeleistungen.",
      },
    },
    {
      "@type": "Question",
      name: "Ist der RAJ NEXUS mit meinem iPhone kompatibel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der RAJ NEXUS ist kompatibel mit allen iPhones ab dem iPhone 12, einschliesslich iPhone 13, 14, 15, 16 und 17 Serie. Auch Apple Watch Series 1-10 und AirPods Pro/3/4 mit kabellosem Ladecase werden unterstützt.",
      },
    },
    {
      "@type": "Question",
      name: "Wo kann ich den RAJ NEXUS kaufen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der RAJ NEXUS ist ausschliesslich über raj.ch erhältlich – direkt vom Hersteller, ohne Zwischenhändler. Versand innerhalb der Schweiz.",
      },
    },
    {
      "@type": "Question",
      name: "Wie schnell lädt der RAJ NEXUS mein iPhone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der RAJ NEXUS lädt ein iPhone mit bis zu 25W kabellos – das ist bis zu 3,3x schneller als ein herkömmliches Qi-Ladegerät mit 5W. Ein iPhone ist in ca. 1,5 Stunden vollständig geladen.",
      },
    },
  ],
};

/** Build a BreadcrumbList JSON-LD for any page. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Build an Article JSON-LD for blog/article pages. */
export function articleJsonLd(opts: {
  headline: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    datePublished: opts.datePublished ?? "2026-05-02",
    dateModified: opts.dateModified ?? "2026-05-02",
    author: ORG,
    publisher: PUBLISHER,
    url: opts.url,
  };
}
