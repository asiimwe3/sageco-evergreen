import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Book() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "", amount: "50000" })
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (router.query.title) {
      setForm(f => ({ ...f, message: `Viewing request for: ${router.query.title}` }))
    }
  }, [router.query.title])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("processing")
    try {
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          currency: "UGX",
          description: form.message || "Property Viewing Fee",
          first_name: form.name.split(" ")[0],
          last_name: form.name.split(" ").slice(1).join(" ") || "N/A",
          reference: `VIEWING-${router.query.property || "PROP"}-${Date.now()}`
        })
      })
      const data = await res.json()
      if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <Head>
        <title>Book a Property Viewing | SAGECO EVERGREEN</title>
        <meta name="description" content="Book a property viewing with SAGECO EVERGREEN. Secure payment via PesaPal." />
        <link rel="canonical" href={`${SITE_URL}/book`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/book`} />
        <meta property="og:title" content="Book a Property Viewing | SAGECO EVERGREEN" />
        <meta property="og:description" content="Book a property viewing with SAGECO EVERGREEN. Secure payment via PesaPal." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Book a Viewing</h1>
        <p className="text-gray-500 mb-8">Pay a viewing fee securely via PesaPal</p>
        {router.query.title && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-primary font-bold">🏡 {decodeURIComponent(router.query.title)}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
            <input required type="date" min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Viewing Fee (UGX)</label>
            <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}>
              <option value="50000">UGX 50,000 — Standard</option>
              <option value="100000">UGX 100,000 — Premium</option>
              <option value="200000">UGX 200,000 — VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea rows={3} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          </div>
          <button type="submit" disabled={status === "processing"}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
            {status === "processing" ? "Redirecting to PesaPal..." : "Pay with PesaPal"}
          </button>
          {status === "error" && <p className="text-red-500 text-sm text-center">Payment failed. Please try again.</p>}
        </form>
      </div>
      <Footer />
    </>
  )
}
