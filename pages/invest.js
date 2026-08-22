import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Invest() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [calcShares, setCalcShares] = useState(1)
  const [calcPrice, setCalcPrice] = useState(50000)

  useEffect(() => {
    fetch('/api/investments/list?active_only=true')
      .then(r => r.json())
      .then(data => { setInvestments(data.investments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Head>
        <title>Fractional Investment | SAGECO EVERGREEN</title>
        <meta name="description" content="Buy fractional shares of land properties with token-based ownership tracking and ROI projections." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">📊 Tokenized Fractional Investment</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Buy fractional shares of land properties with token-based ownership tracking and ROI projections.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {[
              { n: "1", t: "Browse Offerings", d: "Explore available land investment opportunities" },
              { n: "2", t: "Buy Shares", d: "Purchase fractional shares starting from UGX 50,000" },
              { n: "3", t: "Track Ownership", d: "Monitor your investments through your dashboard" },
              { n: "4", t: "Earn Returns", d: "Receive ROI as land value appreciates" },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="bg-green-100 text-green-700 font-bold rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">{s.n}</div>
                <h3 className="font-bold text-gray-800 mb-1">{s.t}</h3>
                <p className="text-gray-500 text-sm">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="font-bold text-gray-700 mb-4">Investment Calculator</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Price per Share (UGX)</label>
                <input type="number" value={calcPrice} onChange={e => setCalcPrice(Number(e.target.value))} className="border rounded-lg px-3 py-2 w-40" />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Number of Shares</label>
                <input type="number" value={calcShares} onChange={e => setCalcShares(Number(e.target.value))} className="border rounded-lg px-3 py-2 w-40" />
              </div>
              <div className="bg-green-50 rounded-lg px-6 py-2">
                <div className="text-sm text-gray-500">Total Investment</div>
                <div className="text-xl font-bold text-green-700">UGX {(calcShares * calcPrice).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-700 mb-6">Active Offerings</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading offerings...</div>
          ) : investments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">
              No active investment offerings yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map(inv => (
                <div key={inv.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                  {inv.properties?.images?.[0] ? (
                    <img src={inv.properties.images[0]} alt={inv.properties.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">📊</div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{inv.properties?.title || 'Property'}</h3>
                    <p className="text-gray-500 text-sm">{inv.properties?.location}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                      <div><span className="text-gray-400">Per Share:</span> <span className="font-bold text-green-700">UGX {Number(inv.price_per_share).toLocaleString()}</span></div>
                      <div><span className="text-gray-400">Available:</span> <span className="font-bold">{inv.shares_available}/{inv.total_shares}</span></div>
                      {inv.roi_projection && <div><span className="text-gray-400">ROI:</span> <span className="font-bold text-green-600">{inv.roi_projection}%</span></div>}
                      <div><span className="text-gray-400">Min:</span> <span className="font-bold">{inv.min_shares} shares</span></div>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-700 h-full" style={{ width: `${((inv.total_shares - inv.shares_available) / inv.total_shares * 100)}%` }} />
                    </div>
                    <button className="w-full mt-4 bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800">Invest Now</button>
                  </div>
                </div>
              ))}
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