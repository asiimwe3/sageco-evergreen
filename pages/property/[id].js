import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

// ── Server-side data fetch (fixes blank page on first load + SEO) ────────────
export async function getServerSideProps({ params }) {
  const supabase = supabaseAdmin

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    return { notFound: true }
  }

  // Increment view counter (fire-and-forget)
  supabase
    .from('properties')
    .update({ views: (property.views || 0) + 1 })
    .eq('id', params.id)
    .then(() => {})

  // Fetch similar properties (same category, exclude current)
  const { data: similar } = await supabase
    .from('properties')
    .select('id, title, location, price, images, category, bedrooms, bathrooms')
    .eq('category', property.category)
    .eq('status', 'available')
    .neq('id', params.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return {
    props: {
      property,
      similar: similar || [],
    },
  }
}

export default function PropertyDetail({ property, similar }) {
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [copied, setCopied] = useState(false)

  const images = property.images && property.images.length > 0 ? property.images : null

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const msg = `Check out this property on SAGECO EVERGREEN:\n${property.title}\n📍 ${property.location}\n💰 UGX ${Number(property.price).toLocaleString()}\n${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const mapQuery = encodeURIComponent(property.location + ', Uganda')

  return (
    <>
      <Head>
        <title>{property.title} | SAGECO EVERGREEN</title>
        <meta name="description" content={property.description?.slice(0, 160) || `${property.category} property in ${property.location}`} />
        {/* OG tags for social sharing */}
        <meta property="og:title" content={property.title} />
        <meta property="og:description" content={`${property.category} in ${property.location} — UGX ${Number(property.price).toLocaleString()}`} />
        {images?.[0] && <meta property="og:image" content={images[0]} />}
        <meta property="og:type" content="website" />
      </Head>

      {/* Lightbox */}
      {lightbox && images && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-6 text-white text-4xl font-bold z-50" onClick={() => setLightbox(false)}>×</button>
          <button className="absolute left-4 text-white text-5xl font-bold z-50 px-2 hover:text-primary"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length) }}>‹</button>
          <img src={images[activeImg]} alt={property.title}
            className="object-contain rounded-lg"
            style={{ maxHeight: '90vh', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 text-white text-5xl font-bold z-50 px-2 hover:text-primary"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length) }}>›</button>
          <div className="absolute bottom-4 text-white text-sm bg-black bg-opacity-60 px-4 py-1 rounded-full">
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary">Properties</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Image Gallery ─────────────────────────────────────────── */}
          <div>
            {images ? (
              <>
                <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-zoom-in"
                  onClick={() => setLightbox(true)}>
                  <img src={images[activeImg]} alt={property.title}
                    className="w-full h-80 object-cover hover:scale-105 transition duration-300" />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                    {activeImg + 1} / {images.length}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    🔍 Tap to zoom
                  </div>
                  {property.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  )}
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
              <div className="w-full h-80 bg-green-100 rounded-2xl flex items-center justify-center text-7xl">🏡</div>
            )}

            {/* Share buttons */}
            <div className="flex gap-2 mt-4">
              <button onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-full font-semibold hover:opacity-90 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.523 5.853L0 24l6.313-1.496A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.5-5.19-1.374l-.373-.22-3.747.888.937-3.638-.243-.386A9.945 9.945 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Share on WhatsApp
              </button>
              <button onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full font-semibold hover:bg-gray-200 transition">
                {copied ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>

          {/* ── Property Details ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-green-100 text-primary px-3 py-1 rounded-full font-medium">{property.category}</span>
              {property.sub_type && (
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">{property.sub_type}</span>
              )}
              {property.status === 'sold' && (
                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">SOLD</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-3 leading-tight">{property.title}</h1>
            <p className="text-gray-500 mt-1 text-sm">📍 {property.location}</p>
            {property.views > 0 && (
              <p className="text-gray-400 text-xs mt-1">👁 {property.views} view{property.views !== 1 ? 's' : ''}</p>
            )}

            {/* Price */}
            <div className="mt-4">
              {property.price > 0 ? (
                <p className="text-primary text-3xl font-bold">UGX {Number(property.price).toLocaleString()}</p>
              ) : (
                <p className="text-primary text-2xl font-bold">Contact for Price</p>
              )}
              {property.is_negotiable && <p className="text-green-600 text-sm mt-1 font-medium">✅ Price is negotiable</p>}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {property.bedrooms && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🛏</p>
                  <p className="text-sm font-medium text-gray-700">{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</p>
                </div>
              )}
              {property.bathrooms && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🚿</p>
                  <p className="text-sm font-medium text-gray-700">{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</p>
                </div>
              )}
              {property.area_sqft && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">📐</p>
                  <p className="text-sm font-medium text-gray-700">{Number(property.area_sqft).toLocaleString()} sqft</p>
                </div>
              )}
              {property.land_acres && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🌿</p>
                  <p className="text-sm font-medium text-gray-700">{property.land_acres} Acres</p>
                </div>
              )}
              {property.plot_feet && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">📏</p>
                  <p className="text-sm font-medium text-gray-700">{property.plot_feet} ft</p>
                </div>
              )}
              {property.water_available && property.water_available !== 'No' && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">💧</p>
                  <p className="text-sm font-medium text-gray-700">Water: {property.water_available}</p>
                </div>
              )}
              {property.electricity_available && property.electricity_available !== 'No' && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">⚡</p>
                  <p className="text-sm font-medium text-gray-700">Electricity: {property.electricity_available}</p>
                </div>
              )}
              {property.fence && property.fence !== 'No' && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🏗</p>
                  <p className="text-sm font-medium text-gray-700">Fenced</p>
                </div>
              )}
              {property.title_deed && property.title_deed !== 'No' && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">📜</p>
                  <p className="text-sm font-medium text-gray-700">Title Deed</p>
                </div>
              )}
              {property.road_distance_km && (
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl">🛣</p>
                  <p className="text-sm font-medium text-gray-700">{property.road_distance_km}km to road</p>
                </div>
              )}
            </div>

            {/* Contact agent */}
            {(property.contact_name || property.contact_phone) && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-bold text-primary mb-2">Contact Agent</p>
                {property.contact_name && <p className="text-gray-700 text-sm">👤 {property.contact_name}</p>}
                {property.contact_phone && (
                  <a href={`tel:${property.contact_phone}`} className="text-primary font-bold mt-1 block hover:underline">
                    📞 {property.contact_phone}
                  </a>
                )}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mt-6">
              <Link href={`/book?property=${property.id}&title=${encodeURIComponent(property.title)}`}
                className="flex-1 bg-primary text-white text-center py-3 rounded-full font-bold hover:opacity-90 transition">
                📅 Book Viewing
              </Link>
              {property.contact_phone && (
                <a href={`https://wa.me/${property.contact_phone.replace(/\D/g, '')}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 bg-green-500 text-white text-center py-3 rounded-full font-bold hover:opacity-90 transition">
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About this Property</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>
        )}

        {/* All photos grid */}
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

        {/* Google Maps embed */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Location</h2>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              title="Property Location"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">📍 {property.location}</p>
        </div>

        {/* Similar properties */}
        {similar && similar.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Similar {property.category} Properties</h2>
              <Link href={`/properties?category=${encodeURIComponent(property.category)}`}
                className="text-primary text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similar.map(p => (
                <Link key={p.id} href={`/property/${p.id}`}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 duration-200">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-40 bg-green-100 flex items-center justify-center text-4xl">🏡</div>
                  )}
                  <div className="p-4">
                    <span className="text-xs bg-green-100 text-primary px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                    <h3 className="font-bold text-gray-800 text-sm mt-2 line-clamp-2">{p.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">📍 {p.location}</p>
                    <p className="text-primary font-bold text-sm mt-2">
                      {p.price > 0 ? `UGX ${Number(p.price).toLocaleString()}` : 'Contact for Price'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
