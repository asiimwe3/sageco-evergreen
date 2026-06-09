import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

export default function PropertyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/get-property?id=${id}`)
      .then(r => r.json())
      .then(data => { setProperty(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">Loading property...</div>
      <Footer />
    </>
  )

  if (!property || property.error) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🏡</div>
        <p className="text-gray-500 text-lg">Property not found.</p>
        <Link href="/properties" className="mt-4 bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">Back to Properties</Link>
      </div>
      <Footer />
    </>
  )

  const images = property.images && property.images.length > 0 ? property.images : null

  return (
    <>
      <Head>
        <title>{property.title} | SAGECO EVERGREEN</title>
        <meta name="description" content={property.description} />
      </Head>
      <Navbar />

      {/* Lightbox */}
      {lightbox && images && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-6 text-white text-4xl font-bold z-50" onClick={() => setLightbox(false)}>×</button>
          <button className="absolute left-4 text-white text-4xl font-bold z-50 px-2"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length) }}>‹</button>
          <img src={images[activeImg]} alt={property.title}
            className="max-h-screen-90 max-w-screen-90 object-contain rounded-lg"
            style={{maxHeight:'90vh',maxWidth:'90vw'}}
            onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 text-white text-4xl font-bold z-50 px-2"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length) }}>›</button>
          <div className="absolute bottom-4 text-white text-sm">{activeImg + 1} / {images.length}</div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/properties" className="text-primary font-medium hover:underline mb-6 inline-block">← Back to Properties</Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {images ? (
              <>
                <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-zoom-in"
                  onClick={() => setLightbox(true)}>
                  <img src={images[activeImg]} alt={property.title}
                    className="w-full h-72 object-cover hover:scale-105 transition duration-300" />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {activeImg + 1} / {images.length}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    🔍 Tap to zoom
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <img key={i} src={img} alt={`Photo ${i + 1}`}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition ${activeImg === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-72 bg-green-100 rounded-2xl flex items-center justify-center text-7xl">🏡</div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-xs bg-green-100 text-primary px-3 py-1 rounded-full font-medium">{property.category}</span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3">{property.title}</h1>
            <p className="text-gray-500 mt-1 text-sm">📍 {property.location}</p>

            <div className="mt-4">
              {property.price > 0 ? (
                <p className="text-primary text-3xl font-bold">UGX {Number(property.price).toLocaleString()}</p>
              ) : (
                <p className="text-primary text-2xl font-bold">Contact for Price</p>
              )}
              {property.is_negotiable && <p className="text-green-600 text-sm mt-1">✅ Price is negotiable</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              {property.bedrooms && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🛏</p>
                  <p className="text-sm font-medium text-gray-700">{property.bedrooms} Bedrooms</p>
                </div>
              )}
              {property.bathrooms && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🚿</p>
                  <p className="text-sm font-medium text-gray-700">{property.bathrooms} Bathrooms</p>
                </div>
              )}
              {property.land_acres && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">📐</p>
                  <p className="text-sm font-medium text-gray-700">{property.land_acres} Acres</p>
                </div>
              )}
              {property.water_available && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">💧</p>
                  <p className="text-sm font-medium text-gray-700">Water Available</p>
                </div>
              )}
              {property.electricity_available && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">⚡</p>
                  <p className="text-sm font-medium text-gray-700">Electricity</p>
                </div>
              )}
              {property.fence && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🏗</p>
                  <p className="text-sm font-medium text-gray-700">Fenced</p>
                </div>
              )}
              {property.title_deed && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">📜</p>
                  <p className="text-sm font-medium text-gray-700">Title Deed</p>
                </div>
              )}
            </div>

            {(property.contact_name || property.contact_phone) && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-bold text-primary mb-1">Contact Agent</p>
                {property.contact_name && <p className="text-gray-700 text-sm">👤 {property.contact_name}</p>}
                {property.contact_phone && (
                  <a href={`tel:${property.contact_phone}`} className="text-primary font-bold mt-1 block">📞 {property.contact_phone}</a>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Link href={`/book?property=${property.id}&title=${encodeURIComponent(property.title)}`}
                className="flex-1 bg-primary text-white text-center py-3 rounded-full font-bold hover:opacity-90 transition">
                Book Viewing
              </Link>
              {property.contact_phone && (
                <a href={`https://wa.me/${property.contact_phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex-1 bg-green-500 text-white text-center py-3 rounded-full font-bold hover:opacity-90 transition">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {property.description && (
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About this Property</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>
        )}

        {images && images.length > 1 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Photos ({images.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`Photo ${i + 1}`}
                  onClick={() => { setActiveImg(i); setLightbox(true) }}
                  className="w-full h-40 object-cover rounded-xl cursor-pointer hover:opacity-90 transition duration-200 shadow-sm" />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
