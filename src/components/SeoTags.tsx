import { Helmet } from "react-helmet-async";

interface SeoTagsProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  /** Optional JSON-LD object(s) to inject on the page. */
  jsonLd?: object | object[];
}

/**
 * Reusable SEO tag block: title, description, robots, canonical,
 * Open Graph and Twitter Card tags + optional JSON-LD.
 */
const SeoTags = ({
  title,
  description,
  canonical,
  ogImage = "https://raj.ch/og-image.webp",
  ogType = "product",
  jsonLd,
}: SeoTagsProps) => {
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="RAJ" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="de_CH" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@raj_swiss_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export default SeoTags;
