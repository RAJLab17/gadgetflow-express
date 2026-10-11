import matrix from "@/assets/social/raj-matrix-share.jpg.asset.json";
import airpods from "@/assets/social/raj-airpods-share.jpg.asset.json";
import nexus from "@/assets/social/raj-nexus-share.jpg.asset.json";

export const shareImages = {
  matrix: { url: `https://raj.ch${matrix.url}`, alt: "RAJ MATRIX Cherry Carbon Hülle mit MagSafe für iPhone" },
  airpods: { url: `https://raj.ch${airpods.url}`, alt: "RAJ MATRIX Cherry Carbon Hülle für AirPods 4 & 5 mit goldenem Blitz" },
  nexus: { url: `https://raj.ch${nexus.url}`, alt: "RAJ NEXUS 3-in-1 Wireless Charger für iPhone, Apple Watch und AirPods" },
};

/** Shared metadata, used inside Helmet so it replaces prerendered tags. */
export const shareImageTags = (image = shareImages.nexus) => [
  <meta key="og-image" property="og:image" content={image.url} />,
  <meta key="og-image-width" property="og:image:width" content="1200" />,
  <meta key="og-image-height" property="og:image:height" content="630" />,
  <meta key="og-image-type" property="og:image:type" content="image/jpeg" />,
  <meta key="og-image-alt" property="og:image:alt" content={image.alt} />,
  <meta key="twitter-image" name="twitter:image" content={image.url} />,
];