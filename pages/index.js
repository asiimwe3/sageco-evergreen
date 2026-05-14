import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "SAGECO EVERGREEN",
  "description": "Premier real estate platform in Uganda — premium homes, commercial spaces, land, and eco-friendly developments.",
  "url": SITE_URL,
  "logo": `${SITE_URL}/og-image.png`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kampala",
    "addressCountry": "UG"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+256700000000",
    "contactType": "customer service",
    "email": "info@sagecoevergreen.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Uganda"
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN | Premium Real Estate Uganda</title>
        <meta name="description" content="Find your dream property in Uganda. SAGECO EVERGREEN connects you with premium homes, commercial spaces, and land across Kampala and beyond." />
        <meta name="keywords" content="real estate Uganda, properties Kampala, buy house Uganda, commercial property Uganda, land for sale Uganda, SAGECO EVERGREEN" />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta property="og:description" content="Find your dream property in Uganda. Premium homes, commercial spaces, and eco-friendly land developments." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="en_UG" />
        <meta property="og:site_name" content="SAGECO EVERGREEN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAGECO EVERGREEN | Premium Real Estate Uganda" />
        <meta name="twitter:description" content="Find your dream property in Uganda. Premium homes, commercial spaces, and eco-friendly land developments." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-green-800 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">Premium real estate in Uganda — homes, commercial spaces, and land with a green future in mind.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-8 py-3 rounded-full hover:opacity-90 text-lg">Browse Properties</Link>
          <Link href="/book" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg">Book a Viewing</Link>
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

      {/* Services */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-2">What We Offer</h2>
        <p className="text-gray-500 text-center mb-10">Everything you need in one place</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🏡", title: "Residential", desc: "Villas, apartments, and family homes across Uganda's finest neighborhoods." },
            { icon: "🏢", title: "Commercial", desc: "Office spaces, retail units, and warehouses for your business needs." },
            { icon: "🌿", title: "Green Projects", desc: "Eco-friendly developments that protect Uganda's natural environment." },
          ].map(s => (
            <div key={s.title} className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{s.title}</h3>
              <p className="text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Property?</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">Browse our listings and book a viewing today. Secure payment via PesaPal.</p>
        <Link href="/properties" className="bg-secondary text-dark font-bold px-10 py-4 rounded-full text-lg hover:opacity-90">View All Properties</Link>
      </section>

      <Footer />
    </>
  )
}
