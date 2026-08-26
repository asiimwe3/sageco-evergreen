import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useAppMode } from "../hooks/useAppMode"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "SAGECO EVERGREEN",
  "description": "Premier real estate company in Uganda offering land for sale, residential homes, commercial properties, and eco-friendly developments. Based in Kyenjojo, serving all of Uganda.",
  "url": SITE_URL,
  "logo": SITE_URL + "/og-image.png",
  "image": SITE_URL + "/og-image.png",
  "telephone": "+256750414366",
  "email": "sagecoevergreen@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kyenjojo",
    "addressRegion": "Western Region",
    "addressCountry": "UG"
  },
  "areaServed": { "@type": "Country", "name": "Uganda" },
  "priceRange": "UGX 500,000 - UGX 500,000,000",
  "openingHours": "Mo-Sa 08:00-18:00",
  "sameAs": ["https://sageco-evergreen-co.vercel.app"],
  "publisher": {
    "@type": "Organization",
    "name": "DeryCode Technologies",
    "url": "https://derycode.publicvm.com",
    "description": "Built by DeryCode Technologies — Software development company in Uganda"
  },
  "knowsAbout": [
    "Real Estate Uganda","Land for Sale Uganda","Property for Sale in Uganda",
    "Commercial Property Uganda","Residential Property Uganda","Real Estate Brokers Uganda",
    "Property Investment Uganda","Land in Kyenjojo","Eco-friendly Developments Uganda"
  ],
  "makesOffer": [
    { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Residential Properties" } },
    { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Commercial Properties" } },
    { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Land for Sale" } },
    { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Green/Eco-Friendly Projects" } }
  ]
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How do I buy land in Uganda through SAGECO EVERGREEN?", "acceptedAnswer": { "@type": "Answer", "text": "Browse our properties page, select a listing, pay UGX 30,000 to book a viewing, and our verified broker will contact you within 24 hours to arrange a site visit." } },
    { "@type": "Question", "name": "What types of properties does SAGECO EVERGREEN sell?", "acceptedAnswer": { "@type": "Answer", "text": "We offer residential homes, commercial spaces, and eco-friendly land developments across Uganda." } },
    { "@type": "Question", "name": "Where is SAGECO EVERGREEN located?", "acceptedAnswer": { "@type": "Answer", "text": "We are based in Kyenjojo, Uganda, and serve clients across the entire country. Contact us at 0750 414 366." } },
    { "@type": "Question", "name": "How much does it cost to book a property viewing?", "acceptedAnswer": { "@type": "Answer", "text": "Booking a viewing or site visit costs UGX 30,000, payable via MTN MoMo, Airtel Money, or card through PesaPal." } }
  ]
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SAGECO EVERGREEN",
  "url": SITE_URL,
  "publisher": {
    "@type": "Organization",
    "name": "SAGECO EVERGREEN Company Ltd",
    "url": SITE_URL,
    "logo": SITE_URL + "/logo.jpg"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": SITE_URL + "/properties?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "SAGECO EVERGREEN Services",
  "itemListElement": [
    {
      "@type": "Service",
      "name": "Property Sales",
      "description": "Buy verified land, residential homes, and commercial properties across Uganda.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/properties"
    },
    {
      "@type": "Service",
      "name": "GPS Land Measuring",
      "description": "Free GPS-based land measurement tool for accurate acreage, perimeter, and boundary mapping.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/gps-measure"
    },
    {
      "@type": "Service",
      "name": "Land Title Search",
      "description": "Verify land ownership and title status through the Uganda land registry.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/title-search"
    },
    {
      "@type": "Service",
      "name": "AI Property Valuation",
      "description": "AI-powered property valuations with predictive pricing, comparable analysis, and crop/soil data.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/valuation"
    },
    {
      "@type": "Service",
      "name": "Programmable Escrow",
      "description": "Milestone-based fund release with GPS-verified site visits for secure property transactions.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/escrow"
    },
    {
      "@type": "Service",
      "name": "Drone Property Verification",
      "description": "LiDAR scans, 3D twins, and GPS-verified boundaries for properties in Uganda.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/verification"
    },
    {
      "@type": "Service",
      "name": "Digital Land Passports",
      "description": "Verifiable property records with GPS boundaries, ownership history, and survey data.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/passports"
    },
    {
      "@type": "Service",
      "name": "Broker Registration",
      "description": "Register as a verified broker with SAGECO EVERGREEN. UGX 32,000 registration fee.",
      "provider": { "@type": "RealEstateAgent", "name": "SAGECO EVERGREEN" },
      "areaServed": { "@type": "Country", "name": "Uganda" },
      "url": SITE_URL + "/broker-register"
    }
  ]
}

const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Asiimwe Derick",
  "alternateName": ["Derick Asiimwe", "TraderDerick"],
  "givenName": "Derick",
  "familyName": "Asiimwe",
  "jobTitle": "Founder & CEO — SAGECO EVERGREEN Company Limited | CEO — DeryCode Technologies",
  "description": "Asiimwe Derick is the Founder & CEO of SAGECO EVERGREEN Company Limited, a real estate and property technology company in Uganda.",
  "url": SITE_URL + "#founder",
  "image": { "@type": "ImageObject", "url": SITE_URL + "/asiimwe-derick.webp", "contentUrl": SITE_URL + "/asiimwe-derick.webp", "width": 800, "height": 800, "caption": "Asiimwe Derick, Founder & CEO of SAGECO EVERGREEN" },
  "worksFor": { "@type": "Organization", "name": "SAGECO EVERGREEN" },
  "affiliation": [
    { "@type": "Organization", "name": "SAGECO EVERGREEN Company Limited", "url": SITE_URL },
    { "@type": "Organization", "name": "DeryCode Technologies", "url": "https://derycode.publicvm.com" }
  ],
  "address": { "@type": "PostalAddress", "addressLocality": "Kyenjojo", "addressRegion": "Western Region", "addressCountry": "UG" },
  "sameAs": [
    "https://github.com/asiimwe3",
    "https://ug.linkedin.com/in/asiimwe-derick-501755313",
    "https://www.facebook.com/p/Dery-Code-61590735268937/",
    "https://derycode.publicvm.com/authors/asiimwe-derick.html"
  ]
}

const v3Features = [
  { icon: "🛸", title: "Drone Verification", desc: "LiDAR scans, 3D twins & GPS-verified boundaries", slug: "/verification" },
  { icon: "🛡️", title: "AI Fraud Detection", desc: "Duplicate listings, boundary conflicts & pricing checks", slug: "/admin/fraud" },
  { icon: "🌿", title: "Eco-Land Intelligence", desc: "Carbon scoring, reforestation & renewable energy analysis", slug: "/eco" },
  { icon: "🔒", title: "Programmable Escrow", desc: "Milestone-based fund release with GPS-verified visits", slug: "/escrow" },
  { icon: "📜", title: "Digital Land Passports", desc: "Verifiable passport per property with GPS & ownership history", slug: "/passports" },
  { icon: "📊", title: "Fractional Investment", desc: "Buy tokenized shares of land with ROI projections", slug: "/invest" },
  { icon: "🛰️", title: "Remote Site-Visits", desc: "Physical, virtual & drone visits with GPS check-in", slug: "/site-visits" },
  { icon: "🎯", title: "Smart Property Matching", desc: "AI scores properties against your budget & goals", slug: "/matching" },
  { icon: "📈", title: "Predictive Valuation", desc: "AI + comparable analysis with crop & soil data", slug: "/valuation" },
  { icon: "🤖", title: "AI Broker", desc: "24/7 natural-language property search on WhatsApp & Web", slug: "/ai-broker" },
]

export default function Home({ featuredProperties, stats }) {
  const appMode = useAppMode()
  const featured = featuredProperties || []
  const loadingFeatured = false

  const statItems = [
    [stats && stats.properties != null ? String(stats.properties) : "—", "Verified Listings"],
    [stats && stats.brokers != null ? String(stats.brokers) : "—", "Verified Brokers"],
    [stats && stats.bookings != null ? String(stats.bookings) : "—", "Bookings Made"],
    ["2026", "Established"],
  ]

  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN | Premium Real Estate Uganda</title>
        <meta name="description" content="Buy land and property in Uganda with SAGECO EVERGREEN. Land for sale, residential homes, commercial spaces, and eco-friendly developments in Kyenjojo, Kampala, and across Uganda. Free GPS land measuring, title search, and verified brokers. Book a viewing today — 0750 414 366." />
        <meta name="keywords" content="land for sale Uganda, buy land Uganda, real estate Uganda, property for sale Uganda, land in Kyenjojo, plots for sale Uganda, commercial property Uganda, residential homes Uganda, houses for sale Uganda, SAGECO EVERGREEN, real estate company Uganda, property brokers Uganda, property investment Uganda, land title search Uganda, GPS land measuring" />
        <meta name="author" content="SAGECO EVERGREEN Company Ltd" />
        <meta name="publisher" content="DeryCode Technologies" />
        <meta name="creator" content="DeryCode Technologies" />
        <meta name="generator" content="Built by DeryCode Technologies — https://derycode.publicvm.com" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Kyenjojo, Uganda" />
        <meta name="geo.position" content="0.6426;30.6286" />
        <meta name="ICBM" content="0.6426, 30.6286" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta property="og:description" content="Buy land and property in Uganda. Land for sale, homes, commercial spaces, and eco-friendly developments. Free GPS measuring, title search, and verified brokers." />
        <meta property="og:image" content={SITE_URL + "/og-image.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SAGECO EVERGREEN — Premium Real Estate Uganda" />
        <meta property="og:image:secure_url" content={SITE_URL + "/og-image.png"} />
        <meta property="og:locale" content="en_UG" />
        <meta property="og:site_name" content="SAGECO EVERGREEN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SagecoEvergreen" />
        <meta name="twitter:creator" content="@DeryCode" />
        <meta name="twitter:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta name="twitter:description" content="Buy land and property in Uganda. Land for sale, homes, commercial spaces, and eco-friendly developments across Uganda." />
        <meta name="twitter:image" content={SITE_URL + "/og-image.png"} />
        <meta name="twitter:image:alt" content="SAGECO EVERGREEN — Premium Real Estate Uganda" />
        <meta name="x-built-by" content="DeryCode Technologies" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      </Head>

      {/* Hero — BIGGER, local people focused */}
      <section className={"bg-gradient-to-br from-primary via-green-700 to-green-900 text-white " + (appMode ? "py-12" : "py-32") + " px-4 text-center relative overflow-hidden"}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>

        <div className="relative max-w-4xl mx-auto">
          <p className="text-green-200 text-base uppercase tracking-widest mb-4 font-bold">🇺🇬 Uganda&apos;s Trusted Property Platform</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Find Your Dream Property in Uganda</h1>
          <p className="text-2xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Premium land, homes, and commercial spaces — verified, secure, and built for Ugandans by Ugandans.
          </p>
          <div className="flex gap-5 justify-center flex-wrap">
            <Link href="/properties" className="bg-secondary text-dark font-bold px-10 py-4 rounded-full hover:opacity-90 text-xl shadow-lg transition">Browse Properties</Link>
            <Link href="/ai-broker" className="border-2 border-white text-white font-bold px-10 py-4 rounded-full hover:bg-white hover:text-primary text-xl transition">Chat with AI Broker</Link>
          </div>

          {/* Quick contact bar — BIGGER, more prominent */}
          <div className="mt-10 flex flex-wrap gap-6 justify-center items-center text-lg">
            <a href="tel:+256750414366" className="flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full hover:bg-white/20 transition">
              📞 <span className="font-bold">0750 414 366</span>
            </a>
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="flex items-center gap-2 bg-green-500 px-6 py-3 rounded-full hover:bg-green-400 transition pulse-whatsapp">
              💬 <span className="font-bold">WhatsApp Us</span>
            </a>
          </div>

          {/* Payment methods badge */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <span className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold">MTN MoMo</span>
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Airtel Money</span>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Visa Card</span>
            <span className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold">PesaPal Secure</span>
          </div>
        </div>
      </section>

      {/* Trust bar — local community signals */}
      <section className="bg-green-50 py-6 border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-base text-gray-700 font-semibold items-center">
          <span className="flex items-center gap-2">✅ Verified Listings</span>
          <span className="flex items-center gap-2">🔒 Secure Escrow</span>
          <span className="flex items-center gap-2">📍 GPS Boundaries</span>
          <span className="flex items-center gap-2">🌿 Eco-Friendly</span>
          <span className="flex items-center gap-2">🤝 Trusted by Ugandans</span>
        </div>
      </section>

      {/* Stats — BIGGER cards, more visual */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center items-stretch">
          {statItems.map(function(s) { return (
            <div key={s[1]} className="bg-white rounded-2xl p-8 shadow-md flex flex-col justify-center min-h-[160px] card-hover border border-gray-100">
              <div className="text-5xl font-bold text-primary mb-2">{s[0]}</div>
              <div className="text-gray-600 text-base font-medium">{s[1]}</div>
            </div>
          ) })}
        </div>
      </section>

      {/* How It Works — local people focused */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">How SAGECO Works</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">Simple, secure, and built for every Ugandan — whether you're buying, selling, or investing.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-green-50 border border-green-100">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Browse &amp; Verify</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Explore verified properties across Uganda with GPS boundaries, drone imagery, and ownership history.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-yellow-50 border border-yellow-100">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Book &amp; Pay</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Book a viewing for UGX 30,000 via MTN MoMo, Airtel Money, or card. Our broker contacts you within 24 hours.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Own &amp; Invest</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Secure your property with escrow protection, digital land passports, and eco-smart development support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* v3.0 Smart Real Estate Features — BIGGER cards */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Smart Real Estate Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Technology built for Uganda's property market — from drone verification to AI-powered matching.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {v3Features.map(f => (
              <Link key={f.slug} href={f.slug} className="block bg-white rounded-2xl p-8 shadow-md hover:shadow-xl card-hover border border-gray-100 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{f.desc}</p>
                <span className="text-primary font-semibold text-base mt-4 inline-block">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties — BIGGER cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-lg text-gray-600 mt-2">Hand-picked listings from across Uganda</p>
            </div>
            <Link href="/properties" className="text-primary font-bold text-lg hover:underline hidden sm:block">View All →</Link>
          </div>
          {loadingFeatured ? (
            <div className="text-center py-12 text-gray-400 text-lg">Loading properties…</div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-xl text-gray-600 mb-4">No featured properties yet.</p>
              <Link href="/properties" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90">Browse All Properties</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.slice(0, 6).map(p => {
                const price = Number(p.price || 0)
                const formatted = price >= 1_000_000 ? `${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M` : price >= 1_000 ? `${(price / 1_000).toFixed(0)}K` : String(price)
                return (
                  <Link key={p.id} href={`/property/${p.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl card-hover border border-gray-100">
                    <div className="relative h-56 bg-gray-200">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.title || "Property"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🏠</div>
                      )}
                      {p.featured && <span className="absolute top-3 left-3 bg-secondary text-dark px-3 py-1.5 rounded-full text-sm font-bold">Featured</span>}
                      {p.category && <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-bold">{p.category}</span>}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{p.title || "Untitled Property"}</h3>
                      <p className="text-base text-gray-600 mb-3 line-clamp-2">{p.description || "No description available."}</p>
                      <div className="flex items-center gap-3 text-base text-gray-500 mb-4">
                        <span>📍 {p.location || "Uganda"}</span>
                        {p.size_acres && <span>· {p.size_acres} acres</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">UGX {formatted}</span>
                        <span className="text-base font-semibold text-primary">View Details →</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/properties" className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 shadow-md transition">Browse All Properties</Link>
          </div>
        </div>
      </section>

      {/* Founder section — local Ugandan entrepreneur */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block rounded-full overflow-hidden mb-6 border-4 border-primary shadow-lg">
            <img src="/asiimwe-derick.webp" alt="Asiimwe Derick — Founder & CEO" className="w-40 h-40 object-cover" onError={(e) => { e.target.style.display = 'none' }} />
          </div>
          <h2 id="founder" className="text-3xl font-bold text-gray-900 mb-3">Asiimwe Derick</h2>
          <p className="text-xl text-primary font-semibold mb-4">Founder &amp; CEO — SAGECO EVERGREEN Company Limited</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            &quot;We built SAGECO EVERGREEN to make property ownership in Uganda simple, transparent, and secure.
            From Kyenjojo to Kampala, every Ugandan deserves access to verified land and quality housing.&quot;
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:opacity-90 transition">Get in Touch</Link>
            <Link href="/book" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition">Book a Viewing</Link>
          </div>
        </div>
      </section>

      {/* CTA — BIGGER, local focus */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-green-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Land?</h2>
          <p className="text-2xl text-green-100 mb-10 leading-relaxed">Join fellow Ugandans building their future with verified, secure property investments.</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <Link href="/properties" className="bg-secondary text-dark font-bold px-10 py-4 rounded-full text-xl hover:opacity-90 shadow-lg transition">Browse Properties</Link>
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="bg-green-500 text-white font-bold px-10 py-4 rounded-full text-xl hover:bg-green-400 shadow-lg transition pulse-whatsapp">💬 WhatsApp Us</a>
          </div>
          <p className="mt-8 text-green-200 text-lg">Or call us directly: <a href="tel:+256750414366" className="font-bold underline">0750 414 366</a></p>
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  let stats = null
  let featuredProperties = []
  try {
    const baseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (baseUrl && anonKey) {
      const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
      const statsRes = await fetch(`${baseUrl}/rest/v1/rpc/get_site_stats`, { headers: { ...headers, "Content-Type": "application/json" }, method: "POST", body: "{}" }).catch(() => null)
      if (statsRes && statsRes.ok) {
        stats = await statsRes.json().catch(() => null)
      }
      const propsRes = await fetch(`${baseUrl}/rest/v1/properties?select=id,title,price,location,category,description,images,featured,size_acres&featured=eq.true&limit=6&order=created_date.desc`, { headers }).catch(() => null)
      if (propsRes && propsRes.ok) {
        featuredProperties = await propsRes.json().catch(() => [])
      }
    }
  } catch (e) {
    // silently fail — page still renders
  }
  return { props: { featuredProperties, stats } }
}
