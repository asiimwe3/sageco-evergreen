import Head from "next/head"
import Link from "next/link"

export default function Eco() {
  return (
    <>
      <Head>
        <title>Eco-Land Investment Intelligence | SAGECO EVERGREEN</title>
        <meta name="description" content="Carbon potential scoring, reforestation analysis, agroforestry systems, and renewable energy suitability per property." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🌿 Eco-Land Investment Intelligence</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Carbon potential scoring, reforestation analysis, agroforestry systems, and renewable energy suitability for every property.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "🌍", title: "Carbon Potential", desc: "Score (0-100) based on land acreage, vegetation, and green project classification." },
              { icon: "🌳", title: "Reforestation Analysis", desc: "Assessment of reforestation potential — high, medium, or low based on acreage." },
              { icon: "🌾", title: "Agroforestry Systems", desc: "Suitability for combining agriculture with tree planting for sustainable land use." },
              { icon: "☀️", title: "Renewable Energy", desc: "Solar and wind energy suitability based on land size and location." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Sample Eco Score Card</h2>
            <div className="space-y-4">
              {[
                { label: "Carbon Potential", value: 75, color: "bg-green-600" },
                { label: "Biodiversity Index", value: 60, color: "bg-emerald-500" },
                { label: "Climate Risk (inverted)", value: 85, color: "bg-teal-500" },
                { label: "Renewable Energy Suitability", value: 70, color: "bg-lime-500" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">{m.label}</span>
                    <span className="text-sm font-bold text-gray-700">{m.value}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-gray-400">Reforestation</div><div className="font-bold text-green-700">High</div></div>
              <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-gray-400">Agroforestry</div><div className="font-bold text-green-700">Suitable</div></div>
              <div className="bg-green-50 rounded-lg p-3"><div className="text-xs text-gray-400">Soil Quality</div><div className="font-bold text-green-700">Fertile Loam</div></div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/properties" className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800">Browse Properties with Eco Scores</Link>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}