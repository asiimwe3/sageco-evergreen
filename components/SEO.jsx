import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
const DEFAULT_OG = SITE_URL + "/og-image.png"

/**
 * Reusable SEO component for all pages.
 * Enhanced with DeryCode-level SEO: image dimensions, Twitter handles,
 * rich robots directives, breadcrumbs, and "Built by DeryCode Technologies" credit.
 */
export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  type = "website",
  noindex = false,
  path = "",
  breadcrumbs = null,
  article = false,
  publishedTime = null,
  modifiedTime = null,
}) {
  const fullTitle = title 
    ? `${title} | SAGECO EVERGREEN` 
    : "SAGECO EVERGREEN | Premium Real Estate Uganda"
  const desc = description || "Buy land and property in Uganda with SAGECO EVERGREEN. Land for sale, residential homes, commercial spaces, and eco-friendly developments in Kyenjojo, Kampala, and across Uganda. Free GPS land measuring, title search, and verified brokers."
  const kw = keywords || "land for sale Uganda, buy land Uganda, real estate Uganda, property for sale Uganda, land in Kyenjojo, plots for sale Uganda, SAGECO EVERGREEN, property investment Uganda"
  const img = image || DEFAULT_OG
  const url = SITE_URL + path

  // Build breadcrumbs JSON-LD if provided
  const breadcrumbJsonLd = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": SITE_URL + b.path
    }))
  } : null

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta name="author" content="SAGECO EVERGREEN Company Ltd" />
      <meta name="publisher" content="DeryCode Technologies" />
      <meta name="creator" content="DeryCode Technologies" />
      <meta name="generator" content="Built by DeryCode Technologies — https://derycode.publicvm.com" />
      
      {/* Enhanced robots directives */}
      <meta name="robots" content={noindex 
        ? "noindex, nofollow" 
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex 
        ? "noindex, nofollow" 
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      {/* Geo tags */}
      <meta name="geo.region" content="UG" />
      <meta name="geo.placename" content="Kyenjojo, Uganda" />
      <meta name="geo.position" content="0.6426;30.6286" />
      <meta name="ICBM" content="0.6426, 30.6286" />
      
      {/* Open Graph — enhanced */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || "SAGECO EVERGREEN — Real Estate Uganda"} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:locale" content="en_UG" />
      <meta property="og:site_name" content="SAGECO EVERGREEN" />
      
      {/* Article-specific tags */}
      {article && (
        <>
          <meta property="article:author" content="SAGECO EVERGREEN" />
          <meta property="article:section" content="Real Estate" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Twitter Card — enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SagecoEvergreen" />
      <meta name="twitter:creator" content="@DeryCode" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={title || "SAGECO EVERGREEN — Real Estate Uganda"} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Breadcrumbs structured data */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}
      
      {/* Built by credit */}
      <meta name="x-built-by" content="DeryCode Technologies" />
    </Head>
  )
}
