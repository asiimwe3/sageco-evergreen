import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { supabase } from "../lib/supabase"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const categories = ["All", "Residential", "Commercial", "Land", "Green Project"]

  useEffect(() => { fetchProperties() }, [])

  async function fetchProperties() {
    setLoading(true)
    const { data, error } = await supabase
      .from("properties").select("*").eq("status", "available")
      .order("created_at", { ascending: false })
    if (!error) setProperties(data || [])
    setLoading(false)
  }

  const filtered = filter === "All" ? properties : properties.filter(p => p.category === filter)

  return (
    <>
      <Head>
        <title>Properties for Sale & Rent in Uganda | SAGECO EVERGREEN</title>
        <meta name="description" content="Browse premium residential, commercial, and land properties across Uganda. Filter by category and book a viewing online with SAGECO EVERGREEN." />
        <link rel="canonical" href={`${SITE_URL}/properties`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/properties`} />
        <meta property="og:title" content="Properties for Sale & Rent in Uganda | SAGECO EVERGREEN" />
        <meta property="og:description" content="Browse premium residential, commercial, and land properties across Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Properties</h1>
        <p className="text-green-100">Browse available properties across Uganda</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full font-medium border transition ${filter === c ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Upload CTA */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-primary">Are you a property owner?</p>
            <p className="text-gray-500 text-sm">List your property on SAGECO EVERGREEN for free</p>
          </div>
          <Link href="/upload-property" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">List Property</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏡</div>
            <p className="text-gray-500 text-lg">No properties found in this category yet.</p>
            <Link href="/upload-property" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full font-bold">Be the first to list</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <article key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={`${p.title} - ${p.location}`} className="w-full h-48 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl" aria-label="Property image placeholder">🏡</div>
                )}
                <div className="p-5">
                  <span className="text-xs bg-green-100 text-primary px-2 py-1 rounded-full font-medium">{p.category}</span>
                  <h2 className="text-lg font-bold text-gray-800 mt-2">{p.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">📍 {p.location}</p>
                  {p.bedrooms && <p className="text-gray-400 text-sm mt-1">🛏 {p.bedrooms} beds · 🚿 {p.bathrooms} baths</p>}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-primary font-bold text-lg">UGX {Number(p.price).toLocaleString()}</span>
                    <Link href={`/book?property=${p.id}&title=${encodeURIComponent(p.title)}${p.broker_id ? "&broker_id="+p.broker_id+"&broker_name="+encodeURIComponent(p.broker_name||"Broker") : ""}`} className="bg-primary text-white text-sm px-4 py-2 rounded-full hover:opacity-90">Book Viewing</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

