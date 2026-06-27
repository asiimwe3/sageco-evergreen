import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAppMode } from "../hooks/useAppMode"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "SAGECO EVERGREEN",
  "description": "Premier real estate platform in Uganda — premium homes, commercial spaces, land, and eco-friendly developments.",
  "url": SITE_URL,
  "logo": `${SITE_URL}/og-image.png`,
  "telephone": "+256750414366",
  "address": { "@type": "PostalAddress", "addressLocality": "Kyenjojo", "addressCountry": "UG" },
  "areaServed": { "@type": "Country", "name": "Uganda" }
}

export default function Home() {
  const appMode = useAppMode()
  const [featured, setFeatured] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    fetch('/api/get-properties?featured=true')
      .then(r => r.json())
      .then(d => { setFeatured((Array.isArray(d) ? d : []).filter(p => p.featured).slice(0, 6)); setLoadingFeatured(false) })
      .catch(() => setLoadingFeatured(false))
  }, [])

  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN | Premium Real Estate Uganda</title>
        <meta name="description" content="Find your dream property in Uganda. SAGECO EVERGREEN connects you with premium homes, commercial spaces, and land across Kampala and beyond." />
        <meta name="keywords" content="real estate Uganda, properties Kampala, buy house Uganda, commercial property Uganda, land for sale Uganda, SAGECO EVERGREEN" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta property="og:description" content="Find your dream property in Uganda. Premium homes, commercial spaces, and eco-friendly land developments." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="en_UG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* Hero */}
      <section className={`bg-gradient-to-br from-primary to-green-800 text-white ${appMode ? "py-10" : "py-24"} px-4 text-center`}>
        <p className="text-green-200 text-sm uppercase tracking-widest mb-3 font-medium">Uganda&apos;s Trusted Property Platform</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">Premium real estate in Uganda — homes, commercial spaces, and land with a green future in mind.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-8 py-3 rounded-full hover:opacity-90 text-lg">Browse Properties</Link>
          <Link href="/book" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg transition">Book a Viewing</Link>
        </div>
        <div className="mt-6 text-green-200 text-sm">
          📞 <a href="tel:+256750414366" className="hover:text-white">0750 414 366</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          💬 <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="hover:text-white">WhatsApp Us</a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["500+","Properties Listed"],["200+","Happy Clients"],["15+","Expert Brokers"],["10+","Years Experience"]].map(([n,l]) => (
            <div key={l} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">{n}</div>
              <div className="text-gray-500 text-sm mt-1">{l}</div>
            </div>
          ))}
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
            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-56 animate-pulse" />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => (
              <Link key={p.id} href={`/property/${p.id}`}
                className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 duration-200">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">🏡</div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs bg-green-100 text-primary px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mt-2 text-sm line-clamp-2">{p.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">📍 {p.location}</p>
                  <p className="text-primary font-bold mt-2">UGX {Number(p.price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-xl">
            <p className="text-gray-500 mb-3">No featured listings yet.</p>
            <Link href="/properties" className="text-primary font-bold hover:underline">Browse all properties</Link>
          </div>
        )}
      </section>

      {/* Services */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-2">What We Offer</h2>
        <p className="text-gray-500 text-center mb-10">Everything you need in one place</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🏡", title: "Residential", desc: "Villas, apartments, and family homes across Uganda's finest neighborhoods.", href: "/properties" },
            { icon: "🏢", title: "Commercial", desc: "Office spaces, retail units, and warehouses for your business needs.", href: "/properties" },
            { icon: "🌿", title: "Green Projects", desc: "Eco-friendly developments that protect Uganda's natural environment.", href: "/projects" },
          ].map(s => (
            <Link key={s.title} href={s.href} className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition hover:-translate-y-1 duration-200 block">
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{s.title}</h3>
              <p className="text-gray-500">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Simple steps to your new property</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", icon: "🔍", title: "Browse", desc: "Search properties by category, location, and price" },
              { step: "2", icon: "📅", title: "Book", desc: "Pay UGX 30,000 to book a viewing or site visit" },
              { step: "3", icon: "🤝", title: "Meet", desc: "Our broker contacts you within 24 hours to confirm" },
              { step: "4", icon: "🏡", title: "Move In", desc: "Finalise the deal and take ownership" },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-xl p-6 shadow-sm relative">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3">{s.step}</div>
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brokers teaser */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Work With Verified Brokers</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">Every property on SAGECO EVERGREEN is backed by a verified, licensed real estate professional.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/brokers" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Meet Our Brokers</Link>
          <Link href="/broker-register" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Become a Broker</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Property?</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">Browse our listings and book a viewing today. Secure payment via PesaPal — MTN, Airtel, or card.</p>
        <Link href="/properties" className="bg-secondary text-dark font-bold px-10 py-4 rounded-full text-lg hover:opacity-90">View All Properties</Link>
      </section>

    </>
  )
}
