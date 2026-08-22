import Link from "next/link"
import { useState } from "react"
import SEO from '../components/SEO'

export default function SiteVisits() {
  const [form, setForm] = useState({ property_id: '', visitor_name: '', visitor_email: '', visitor_phone: '', visit_type: 'physical', scheduled_date: '' })
  const [result, setResult] = useState(null)

  async function submit(e) {
    e.preventDefault()
    const res = await fetch('/api/site-visits/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <>
      <SEO
        title="Remote Site Visits - Physical, Virtual and Drone Visits"
        description="Book remote site visits with SAGECO EVERGREEN: physical, virtual, and drone visits with GPS check-in verification for properties across Uganda."
        keywords="site visit Uganda, virtual property tour, drone site visit, property viewing Uganda, GPS check-in property"
        path="/site-visits"
      />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🛰️ Remote Site-Visit Technology</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Schedule physical, virtual, or drone site visits with GPS check-in verification and auto-generated reports.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🚶", title: "Physical Visit", desc: "Traditional in-person site visit with GPS check-in verification on arrival." },
              { icon: "🎥", title: "Virtual Visit", desc: "Live video tour with a broker — view the property from anywhere in the world." },
              { icon: "🛸", title: "Drone Visit", desc: "Aerial drone survey with 3D mapping and boundary verification." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-green-700 mb-4">How It Works</h2>
              <div className="space-y-3">
                {["Choose your visit type — physical, virtual, or drone.", "Schedule a date and time that works for you.", "Receive confirmation with visit details.", "On visit day, check in with GPS verification.", "Receive an auto-generated visit report after completion."].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-700 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">{i + 1}</div>
                    <p className="text-gray-600 text-sm pt-1">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-green-700 mb-4">Schedule a Visit</h2>
              <form onSubmit={submit} className="space-y-3">
                <input required type="text" placeholder="Property ID" value={form.property_id} onChange={e => setForm({...form, property_id: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                <input required type="text" placeholder="Your Name" value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                <input required type="email" placeholder="Your Email" value={form.visitor_email} onChange={e => setForm({...form, visitor_email: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                <input type="tel" placeholder="Phone" value={form.visitor_phone} onChange={e => setForm({...form, visitor_phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                <select value={form.visit_type} onChange={e => setForm({...form, visit_type: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                  <option value="physical">Physical Visit</option>
                  <option value="virtual">Virtual Visit</option>
                  <option value="drone">Drone Visit</option>
                </select>
                <input required type="datetime-local" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800">Schedule Visit</button>
              </form>
              {result?.success && <div className="mt-3 bg-green-50 rounded-lg p-3 text-sm text-green-700">✓ Visit scheduled! ID: {result.visit.id}</div>}
              {result?.error && <div className="mt-3 bg-red-50 rounded-lg p-3 text-sm text-red-700">{result.error}</div>}
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