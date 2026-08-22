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
        <meta name="description" content="Buy land and property in Uganda with SAGECO EVERGREEN. Land for sale, residential homes, commercial spaces, and eco-friendly developments in Kyenjojo, Kampala, and across Uganda. Book a viewing today — 0750 414 366." />
        <meta name="keywords" content="land for sale Uganda, buy land Uganda, real estate Uganda, property for sale Uganda, land in Kyenjojo, plots for sale Uganda, commercial property Uganda, residential homes Uganda, houses for sale Uganda, SAGECO EVERGREEN, real estate company Uganda, property brokers Uganda" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta property="og:description" content="Buy land and property in Uganda. Land for sale, homes, commercial spaces, and eco-friendly developments. Book a viewing today!" />
        <meta property="og:image" content={SITE_URL + "/og-image.png"} />
        <meta property="og:locale" content="en_UG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta name="twitter:image" content={SITE_URL + "/og-image.png"} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </Head>

      {/* Hero */}
      <section className={"bg-gradient-to-br from-primary to-green-800 text-white " + (appMode ? "py-10" : "py-24") + " px-4 text-center"}>
        <p className="text-green-200 text-sm uppercase tracking-widest mb-3 font-medium">Uganda&apos;s Trusted Property Platform</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">Premium real estate in Uganda — homes, commercial spaces, and land with a green future in mind.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-8 py-3 rounded-full hover:opacity-90 text-lg">Browse Properties</Link>
          <Link href="/book" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg transition">Book a Viewing</Link>
        </div>
        <div className="mt-6 text-green-200 text-sm">
          {"📞 "} <a href="tel:+256750414366" className="hover:text-white">0750 414 366</a>
          {"  ·  "}
          {"💬 "} <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="hover:text-white">WhatsApp Us</a>
        </div>
      </section>

      {/* Stats — Dynamic from Supabase */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-stretch">
          {statItems.map(function(s) { return (
            <div key={s[1]} className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center min-h-[120px]">
              <div className="text-3xl font-bold text-primary">{s[0]}</div>
              <div className="text-gray-500 text-sm mt-1">{s[1]}</div>
            </div>
          ) })}
        </div>
      </section>

      {/* v3.0 Smart Real Estate Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-2">v3.0 Platform</p>
            <h2 className="text-3xl font-bold text-primary">Smart Real Estate Technology</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">AI-powered tools for property verification, investment, and management — built for Uganda&apos;s real estate market.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {v3Features.map(function(f) { return (
              <Link key={f.slug} href={f.slug} className="block bg-gray-50 rounded-xl p-5 hover:bg-green-50 hover:shadow-md transition group">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-primary">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </Link>
            ) })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h2 className="text-3xl font-bold text-primary">Featured Properties</h2>
            <p className="text-gray-500">Handpicked top listings for you</p>
          </div>
          <Link href="/properties" className="text-primary font-bold hover:underline">View all →</Link>
        </div>
        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(function(i) { return <div key={i} className="bg-gray-100 rounded-xl h-56 animate-pulse" /> })}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(function(p) { return (
              <Link key={p.id} href={"/property/" + p.id} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 duration-200">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">🏡</div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{p.category}</span>
                    {p.verification_status === "verified" && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">✓ Verified</span>}
                    {p.is_tokenized && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">📊 Tokenized</span>}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 truncate">{p.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{"📍 " + p.location}</p>
                  <p className="text-lg font-bold text-primary">{"UGX " + Number(p.price).toLocaleString()}</p>
                  {(p.bedrooms || p.bathrooms || p.area_sqft || p.land_acres) && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      {p.bedrooms && <span>{"🛏 " + p.bedrooms + " bed"}</span>}
                      {p.bathrooms && <span>{"🚿 " + p.bathrooms + " bath"}</span>}
                      {p.area_sqft && <span>{"📐 " + p.area_sqft + " sqft"}</span>}
                      {p.land_acres && <span>{"🗺 " + p.land_acres + " acres"}</span>}
                    </div>
                  )}
                </div>
              </Link>
            ) })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No featured properties yet.</p>
            <Link href="/properties" className="text-primary font-bold hover:underline mt-2 inline-block">Browse all properties →</Link>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">Why Choose SAGECO EVERGREEN?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "✅", title: "Verified Properties", desc: "Every listing is reviewed by our team and verified with drone technology before going live." },
              { icon: "💳", title: "Secure Payments", desc: "Pay via MTN MoMo, Airtel Money, or card through PesaPal. Bookings from UGX 30,000." },
              { icon: "🌿", title: "Green Future", desc: "We specialize in eco-friendly developments with carbon scoring and sustainability analysis." }
            ].map(function(item, i) { return (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ) })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-green-800 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Property?</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">Browse our verified listings or let our AI Broker find the perfect match for you.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-8 py-3 rounded-full hover:opacity-90 text-lg">Browse Properties</Link>
          <Link href="/matching" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg transition">Get AI Matched</Link>
          <Link href="/ai-broker" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg transition">Chat with AI Broker</Link>
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  const { supabaseAdmin } = await import("../lib/supabaseAdmin.js")

  var featuredRes, propsCount, brokersCount, bookingsCount
  try {
    var results = await Promise.all([
      supabaseAdmin.from("properties").select("*").eq("status", "available").eq("featured", true).limit(6),
      supabaseAdmin.from("properties").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("brokers").select("id", { count: "exact", head: true }).in("registration_status", ["registered", "active"]),
      supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }),
    ])
    featuredRes = results[0]
    propsCount = results[1]
    brokersCount = results[2]
    bookingsCount = results[3]
  } catch(e) {
    return { props: { featuredProperties: [], stats: {} } }
  }

  return {
    props: {
      featuredProperties: (featuredRes && featuredRes.data) || [],
      stats: {
        properties: (propsCount && propsCount.count) || 0,
        brokers: (brokersCount && brokersCount.count) || 0,
        bookings: (bookingsCount && bookingsCount.count) || 0,
      },
    },
  }
}
