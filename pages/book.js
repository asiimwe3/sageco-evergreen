import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"
const BOOKING_FEE = 30000

export default function Book() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" })
  const [status, setStatus] = useState("")

  const isBrokerProperty = !!router.query.broker_id
  const brokerName = router.query.broker_name ? decodeURIComponent(router.query.broker_name) : "Broker"
  const propertyTitle = router.query.title ? decodeURIComponent(router.query.title) : "Property"

  useEffect(() => {
    if (router.query.title) {
      setForm(f => ({ ...f, message: `Viewing request for: ${decodeURIComponent(router.query.title)}` }))
    }
  }, [router.query.title])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("processing")
    try {
      const reference = `VIEWING-${router.query.property || "PROP"}-${Date.now()}`
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: BOOKING_FEE,
          currency: "UGX",
          description: isBrokerProperty
            ? `Property Viewing Fee — via ${brokerName}`
            : `Property Viewing Fee — ${propertyTitle}`,
          email: form.email,
          phone: form.phone,
          first_name: form.name.split(" ")[0],
          last_name: form.name.split(" ").slice(1).join(" ") || "N/A",
          reference,
          callback_url: `${window.location.origin}/payment-success?order=${reference}&broker_id=${router.query.broker_id || ""}&property=${router.query.property || ""}`
        })
      })
      const data = await res.json()
      if (data.redirect_url) {
        // Save booking record before redirecting
        await fetch("/api/save-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            property_id: router.query.property || null,
            property_title: propertyTitle,
            broker_id: router.query.broker_id || null,
            broker_name: isBrokerProperty ? brokerName : null,
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            preferred_date: form.date,
            message: form.message,
            total_amount: BOOKING_FEE,
            business_share: isBrokerProperty ? 10000 : 30000,
            broker_share: isBrokerProperty ? 20000 : 0,
            payment_type: isBrokerProperty ? "broker_property" : "officer_property",
            status: "pending"
          })
        })
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
        <p className="text-gray-500 mb-6">Secure your slot with a viewing fee via PesaPal</p>

        {/* Property card */}
        {router.query.title && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-primary font-bold text-lg">🏡 {propertyTitle}</p>
            {isBrokerProperty && (
              <p className="text-gray-500 text-sm mt-1">Listed by broker: <span className="font-semibold text-gray-700">{brokerName}</span></p>
            )}
          </div>
        )}

        {/* Fee breakdown */}
        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
          <p className="font-bold text-gray-800 mb-3">💳 Viewing Fee Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total viewing fee</span>
              <span className="font-bold">UGX 30,000</span>
            </div>
            <hr />
            {isBrokerProperty ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">To SAGECO (business)</span>
                  <span className="font-semibold text-primary">UGX 10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">To {brokerName}</span>
                  <span className="font-semibold text-green-600">UGX 20,000</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-500">To SAGECO (business)</span>
                <span className="font-semibold text-primary">UGX 30,000</span>
              </div>
            )}
          </div>
        </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea rows={3} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
          </div>
          <button type="submit" disabled={status === "processing"}
            className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
            {status === "processing" ? "Redirecting to PesaPal..." : "Pay UGX 30,000 via PesaPal"}
          </button>
          {status === "error" && <p className="text-red-500 text-sm text-center mt-2">Payment failed. Please try again.</p>}
        </form>
      </div>
      <Footer />
    </>
  )
}
