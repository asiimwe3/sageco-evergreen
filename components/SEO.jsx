import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
const DEFAULT_OG = SITE_URL + "/og-image.png"

/**
 * Reusable SEO component for all pages.
 * Includes "Built by DeryCode Technologies" credit.
 */
export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  type = "website",
  noindex = false,
  path = ""
}) {
  const fullTitle = title 
    ? `${title} | SAGECO EVERGREEN` 
    : "SAGECO EVERGREEN | Premium Real Estate Uganda"
  const desc = description || "Buy land and property in Uganda with SAGECO EVERGREEN. Land for sale, residential homes, commercial spaces, and eco-friendly developments in Kyenjojo, Kampala, and across Uganda."
  const kw = keywords || "land for sale Uganda, buy land Uganda, real estate Uganda, property for sale Uganda, land in Kyenjojo, plots for sale Uganda, SAGECO EVERGREEN"
  const img = image || DEFAULT_OG
  const url = SITE_URL + path

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta name="author" content="SAGECO EVERGREEN Company Ltd" />
      <meta name="publisher" content="DeryCode Technologies" />
      <meta name="creator" content="DeryCode Technologies" />
      <meta name="generator" content="Built by DeryCode Technologies — https://derycode.publicvm.com" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="geo.region" content="UG" />
      <meta name="geo.placename" content="Kyenjojo, Uganda" />
      <meta name="geo.position" content="0.6426;30.6286" />
      <meta name="ICBM" content="0.6426, 30.6286" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="en_UG" />
      <meta property="og:site_name" content="SAGECO EVERGREEN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Built by credit */}
      <meta name="x-built-by" content="DeryCode Technologies" />
    </Head>
  )
}
