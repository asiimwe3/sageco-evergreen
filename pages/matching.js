import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

export default function Matching() {
  const [form, setForm] = useState({ budget_min: '', budget_max: '', preferred_location: '', preferred_category: '', min_acres: '', investment_goals: '', user_email: '' })
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search(e) {
    e.preventDefault()
    setLoading(true); setSearched(true)
    const res = await fetch('/api/matching/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMatches(data.matches || [])
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Smart Property Matching | SAGECO EVERGREEN</title>
        <meta name="description" content="AI-powered matching algorithm scores properties against your budget, location, acreage, and investment goals." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎯 Smart Property Matching</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Our AI-powered algorithm scores properties against your budget, location, acreage, and investment goals.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-green-700 mb-4">Tell Us What You Want</h2>
              <form onSubmit={search} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min Budget" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                  <input type="number" placeholder="Max Budget" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                </div>
                <input type="text" placeholder="Preferred Location" value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <select value={form.preferred_category} onChange={e => setForm({...form, preferred_category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Any Category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Plot">Plot</option>
                  <option value="Green Project">Green Project</option>
                </select>
                <input type="number" placeholder="Min Acres" value={form.min_acres} onChange={e => setForm({...form, min_acres: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <textarea placeholder="Investment Goals (e.g. rental income, long-term appreciation)" value={form.investment_goals} onChange={e => setForm({...form, investment_goals: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows="3" />
                <input type="email" placeholder="Your Email (to save matches)" value={form.user_email} onChange={e => setForm({...form, user_email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800">Find Matches</button>
              </form>
            </div>

            <div className="md:col-span-2">
              {loading ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-400">Finding your perfect properties...</div>
              ) : !searched ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-400">
                  <div className="text-5xl mb-3">🎯</div>
                  Fill out the form to get AI-matched property recommendations.
                </div>
              ) : matches.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-400">No matches found. Try adjusting your criteria.</div>
              ) : (
                <div className="space-y-4">
                  {matches.map((p, i) => (
                    <Link key={p.id || i} href={`/property/${p.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition flex">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-32 h-32 object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-32 h-32 bg-green-100 flex items-center justify-center text-3xl flex-shrink-0">🏡</div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800">{p.title}</h3>
                            <p className="text-gray-500 text-sm">{p.location} · UGX {Number(p.price).toLocaleString()}</p>
                          </div>
                          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-bold">{p.match_score}% Match</span>
                        </div>
                        {p.match_reasons?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {p.match_reasons.map((r, j) => (
                              <span key={j} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}