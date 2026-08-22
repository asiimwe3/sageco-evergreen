import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

export default function Brokers() {
  const [brokers, setBrokers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchBrokers() {
      try {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        const res = await fetch(`/api/get-brokers?${params}`)
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()
        setBrokers(data.brokers || [])
      } catch (err) {
        
        setBrokers([])
      } finally {
        setLoading(false)
      }
    }
    fetchBrokers()
  }, [search])

  return (
    <>
      <Head>
        <title>Real Estate Brokers in Uganda | SAGECO EVERGREEN</title>
        <meta name="description" content="Connect with verified real estate professionals in Uganda. Find experienced property brokers and agents through SAGECO EVERGREEN." />
        <link rel="canonical" href={`${SITE_URL}/brokers`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/brokers`} />
        <meta property="og:title" content="Real Estate Brokers in Uganda | SAGECO EVERGREEN" />
        <meta property="og:description" content="Connect with verified real estate professionals in Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Brokers</h1>
        <p className="text-green-100">Connect with verified real estate professionals</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-800">Are you a real estate agent?</p>
            <p className="text-gray-500 text-sm">Register as a SAGECO EVERGREEN broker — UGX 32,000 registration · UGX 45,000 dashboard activation</p>
          </div>
          <Link href="/broker-register" className="bg-secondary text-dark px-6 py-2 rounded-full font-bold hover:opacity-90">Register Now</Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brokers by name, specialization, or location..."
            className="w-full border rounded-full px-5 py-2.5 focus:ring-2 focus:ring-primary outline-none text-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : brokers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👔</div>
            <p className="text-gray-500 text-lg">No registered brokers yet.</p>
            <Link href="/broker-register" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full font-bold">Be the first to register</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map(b => (
              <article key={b.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  {b.photo_url ? (
                    <img src={b.photo_url} alt={b.full_name} className="w-16 h-16 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">👤</div>
                  )}
                  <div>
                    <h2 className="font-bold text-gray-800">{b.full_name}</h2>
                    {b.specialization && <p className="text-sm text-primary">{b.specialization}</p>}
                    {b.location && <p className="text-xs text-gray-500">📍 {b.location}</p>}
                  </div>
                </div>
                {b.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{b.bio}</p>}
                <div className="flex gap-2 flex-wrap">
                  {b.phone && (
                    <a href={`tel:${b.phone}`} className="text-sm bg-green-50 text-primary px-3 py-1 rounded-full hover:bg-green-100">📞 Call</a>
                  )}
                  {b.phone && (
                    <a href={`https://wa.me/${b.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600">💬 WhatsApp</a>
                  )}
                  {b.email && (
                    <a href={`mailto:${b.email}`} className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100">✉️ Email</a>
                  )}
                </div>
                {b.registration_status === "active" && (
                  <span className="mt-3 inline-block text-xs bg-primary text-white px-2 py-1 rounded-full">✓ Verified</span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
