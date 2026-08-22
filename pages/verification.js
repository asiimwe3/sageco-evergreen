import Link from "next/link"
import { useState, useEffect } from "react"
import SEO from '../components/SEO'

export default function Verification() {
  const [status, setStatus] = useState(null)
  const [propertyId, setPropertyId] = useState("")

  async function checkStatus() {
    if (!propertyId) return
    const res = await fetch(`/api/verification/status?property_id=${propertyId}`)
    const data = await res.json()
    setStatus(data)
  }

  return (
    <>
      <SEO
        title="Drone Property Verification - GPS Boundary Scanning"
        description="SAGECO EVERGREEN drone verification: LiDAR scans, 3D twins, and GPS-verified boundaries for properties in Uganda. Secure land verification."
        keywords="drone verification Uganda, GPS boundary scanning, property verification, LiDAR land survey Uganda"
        path="/verification"
      />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Drone & Spatial Verification</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Every property undergoes drone mapping, LiDAR scanning, 3D modeling, and GPS-verified boundary certification.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "🛸", title: "Drone Mapping", desc: "High-resolution aerial imagery and topographic maps for every property." },
              { icon: "📡", title: "LiDAR Scanning", desc: "Laser scanning for precise elevation models and terrain analysis." },
              { icon: "🏛️", title: "3D Digital Twins", desc: "Photorealistic 3D models for virtual site visits and verification." },
              { icon: "📍", title: "GPS Boundary Verification", desc: "GeoJSON-encoded property boundaries with GPS coordinate certification." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">How Verification Works</h2>
            <div className="space-y-4">
              {[
                "Our team schedules a drone survey of the property and surrounding area.",
                "LiDAR scans capture precise elevation and terrain data.",
                "GPS coordinates are recorded to create verified boundary GeoJSON.",
                "A 3D digital twin is generated for virtual site visits.",
                "All verification data is stored on the property's Digital Land Passport.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">{i + 1}</div>
                  <p className="text-gray-600 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Check Property Verification Status</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter Property ID"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={checkStatus} className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-800">Check</button>
            </div>
            {status && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${status.status === 'verified' ? 'bg-green-200 text-green-800' : status.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
                  Status: {status.status}
                </span>
                {status.records?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {status.records.map((r, i) => (
                      <div key={i} className="text-sm text-gray-600">
                        {r.verification_type} — {r.verification_status} ({new Date(r.created_at).toLocaleDateString()})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}