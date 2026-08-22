import Head from "next/head"
import Link from "next/link"

export default function Passports() {
  return (
    <>
      <Head>
        <title>Digital Land Passports | SAGECO EVERGREEN</title>
        <meta name="description" content="Unique verifiable passport per property with GPS coordinates, drone imagery, ownership history, and verification certificates." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📜 Digital Land Passports</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">A unique verifiable passport for every property — GPS coordinates, drone imagery, ownership history, and verification certificates.</p>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "📍", title: "GPS Coordinates", desc: "Precise GPS coordinates for every property boundary." },
              { icon: "🛸", title: "Drone Imagery", desc: "Aerial photos and survey images from drone verification." },
              { icon: "📋", title: "Ownership History", desc: "Complete chain of ownership records and transfers." },
              { icon: "✅", title: "Verification Certificate", desc: "Official SAGECO verification certificate per passport." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8 max-w-2xl mx-auto">
            <div className="border-2 border-green-700 rounded-xl p-6 bg-green-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">S</div>
                  <div>
                    <div className="font-bold text-green-700">SAGECO EVERGREEN</div>
                    <div className="text-xs text-gray-500">Digital Land Passport</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Passport ID</div>
                  <div className="font-mono text-sm text-gray-700">SAGE-PASS-XXXX</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Property:</span> <span className="font-bold text-gray-700">Sample Title</span></div>
                <div><span className="text-gray-400">Location:</span> <span className="font-bold text-gray-700">Kyenjojo</span></div>
                <div><span className="text-gray-400">GPS:</span> <span className="font-mono text-gray-700">0.6°N, 30.6°E</span></div>
                <div><span className="text-gray-400">Area:</span> <span className="font-bold text-gray-700">2.5 acres</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200 flex items-center justify-between">
                <span className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">✓ Verified</span>
                <span className="text-xs text-gray-400">Survey Date: Aug 2026</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/properties" className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800">Browse Properties with Passports</Link>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}