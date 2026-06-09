import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Residential', 'Commercial', 'Land', 'Green Project']

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    setLoading(true)
    try {
      const res = await fetch('/api/get-properties')
      const data = await res.json()
      setProperties(Array.isArray(data) ? data : [])
    } catch (e) {
      setProperties([])
    }
    setLoading(false)
  }

  const filtered = filter === 'All' ? properties : properties.filter(p => p.category === filter)

  return (
    <>
      <Head><title>Properties | SAGECO EVERGREEN</title></Head>
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
              className={`px-5 py-2 rounded-full font-medium border transition ${filter === c ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary'}`}>
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
          <div className="text-center py-20 text-gray-400">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏡</div>
            <p className="text-gray-500 text-lg">No properties found in this category yet.</p>
            <Link href="/upload-property" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full font-bold">Be the first to list</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <Link key={p.id} href={`/property/${p.id}`} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 duration-200">
                <div className="relative">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">🏡</div>
                  )}
                  {p.images?.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                      📷 {p.images.length} photos
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs bg-green-100 text-primary px-2 py-1 rounded-full font-medium">{p.category}</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">📍 {p.location}</p>
                  {p.description && <p className="text-gray-400 text-sm mt-2 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between mt-4">
                    {p.price > 0 ? (
                      <span className="text-primary font-bold text-lg">UGX {Number(p.price).toLocaleString()}</span>
                    ) : (
                      <span className="text-primary font-bold">Contact for Price</span>
                    )}
                    <span className="bg-primary text-white text-sm px-4 py-2 rounded-full">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
