import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

export default function Valuation() {
  const [propertyId, setPropertyId] = useState('')
  const [valuation, setValuation] = useState(null)
  const [loading, setLoading] = useState(false)

  async function estimate(e) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/valuation/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId })
    })
    const data = await res.json()
    setValuation(data.valuation || null)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Predictive Valuation & Arable Analytics | SAGECO EVERGREEN</title>
        <meta name="description" content="AI + comparable + satellite analysis with soil data, climate risk scoring, and crop suitability per acreage." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📈 Predictive Valuation & Arable Analytics</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">AI + comparable + satellite analysis with soil data, climate risk scoring, and crop suitability per acreage.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🤖", title: "AI + Comparable Analysis", desc: "Estimated value based on comparable properties and AI modeling." },
              { icon: "🛰️", title: "Satellite & Soil Data", desc: "Soil quality, climate risk, and satellite imagery analysis." },
              { icon: "🌾", title: "Crop Suitability", desc: "Region-specific crop recommendations based on Uganda's agricultural zones." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-4">Get a Valuation</h2>
            <form onSubmit={estimate} className="flex gap-3">
              <input required type="text" placeholder="Enter Property ID" value={propertyId} onChange={e => setPropertyId(e.target.value)} className="flex-1 border rounded-lg px-4 py-2" />
              <button type="submit" className="bg-green-700 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-800">{loading ? 'Analyzing...' : 'Estimate'}</button>
            </form>
          </div>

          {valuation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">Valuation Results</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">Estimated Value</span><span className="font-bold text-green-700 text-lg">UGX {Number(valuation.estimated_value).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Confidence Score</span><span className="font-bold">{Math.round((valuation.confidence_score || 0) * 100)}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Arable Acres</span><span className="font-bold">{valuation.arable_acres || 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Climate Risk</span><span className="font-bold text-gray-600">{(valuation.climate_risk || '').replace(/_/g, ' ')}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">Crop Suitability</h3>
                <div className="flex flex-wrap gap-2">
                  {(valuation.crop_suitability || []).map((crop, i) => (
                    <span key={i} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">🌾 {crop}</span>
                  ))}
                </div>
                <h4 className="font-bold text-gray-600 mt-4 mb-2 text-sm">Comparable Properties Used</h4>
                <div className="text-sm text-gray-400">{(valuation.comparable_properties || []).length} comparables analyzed</div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}