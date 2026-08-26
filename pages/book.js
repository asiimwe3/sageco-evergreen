import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SEO from '../components/SEO'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
const BOOKING_FEE = 30000
const CONSULTATION_FEE = 15000

const TIME_SLOTS = [
  { value: "08:00-10:00", label: "Morning · 8:00 AM – 10:00 AM" },
  { value: "10:00-12:00", label: "Late Morning · 10:00 AM – 12:00 PM" },
  { value: "13:00-15:00", label: "Afternoon · 1:00 PM – 3:00 PM" },
  { value: "15:00-17:00", label: "Late Afternoon · 3:00 PM – 5:00 PM" },
]

const BOOKING_TYPES = [
  { value: "viewing", label: "Property Viewing", icon: "🏡", desc: "Visit and inspect a specific property", fee: BOOKING_FEE },
  { value: "consultation", label: "Consultation", icon: "💬", desc: "Talk to our team about your needs", fee: CONSULTATION_FEE },
  { value: "site_visit", label: "Site Visit", icon: "📍", desc: "Visit a green project or land site", fee: BOOKING_FEE },
]

export default function Book() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "", email: "", phone: "", date: "", timeSlot: "", bookingType: "viewing",
    message: "", whatsappUpdates: true
  })
  const [status, setStatus] = useState("")
  const [step, setStep] = useState(1)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const isBrokerProperty = !!router.query.broker_id
  const brokerName = router.query.broker_name ? decodeURIComponent(router.query.broker_name) : "Broker"
  const propertyTitle = router.query.title ? decodeURIComponent(router.query.title) : "Property"

  useEffect(() => {
    if (router.query.title) {
      setForm(f => ({
        ...f,
        message: `Viewing request for: ${decodeURIComponent(router.query.title)}`,
        bookingType: "viewing"
      }))
    }
  }, [router.query.title])

  const selectedType = BOOKING_TYPES.find(t => t.value === form.bookingType) || BOOKING_TYPES[0]
  const currentFee = isBrokerProperty ? BOOKING_FEE : selectedType.fee

  const businessShare = isBrokerProperty ? 10000 : currentFee
  const brokerShare = isBrokerProperty ? 20000 : 0

  const canProceedStep1 = form.name && form.email && form.phone && form.date && form.timeSlot
  const today = new Date().toISOString().split("T")[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("processing")
    try {
      const reference = `${form.bookingType.toUpperCase()}-${router.query.property || "GEN"}-${Date.now()}`
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentFee,
          currency: "UGX",
          description: isBrokerProperty
            ? `Property Viewing Fee — via ${brokerName}`
            : `${selectedType.label} Fee — ${propertyTitle}`,
          email: form.email,
          phone: form.phone,
          first_name: form.name.split(" ")[0],
          last_name: form.name.split(" ").slice(1).join(" ") || "N/A",
          reference,
          callback_url: `${window.location.origin}/payment-success?order=${reference}&broker_id=${router.query.broker_id || ""}&property=${router.query.property || ""}&type=${form.bookingType}`
        })
      })
      const data = await res.json()
      if (data.redirect_url) {
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
            time_slot: form.timeSlot,
            booking_type: form.bookingType,
            message: form.message,
            whatsapp_updates: form.whatsappUpdates,
            total_amount: currentFee,
            business_share: businessShare,
            broker_share: brokerShare,
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

  // Success screen after payment redirect
  if (confirmedBooking) {
    return (
      <>
        <SEO
        title="Book a Property Viewing"
        description="Book a property viewing or site visit with SAGECO EVERGREEN. Schedule visits to verified properties across Uganda. UGX 30,000 booking fee via MTN MoMo, Airtel Money, or card."
        keywords="book property viewing Uganda, site visit booking, real estate appointment Uganda, property viewing Kyenjojo"
        path="/book"
        breadcrumbs={[{"name": "Home", "path": "/"}, {"name": "Book a Viewing", "path": "/book"}]}
      />
          <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">We've received your booking request. Our team will contact you within 24 hours to confirm.</p>
          <div className="bg-white border rounded-xl p-6 shadow-sm text-left mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-bold">{confirmedBooking.reference}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-semibold capitalize">{confirmedBooking.bookingType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{new Date(confirmedBooking.date).toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{TIME_SLOTS.find(s => s.value === confirmedBooking.timeSlot)?.label || confirmedBooking.timeSlot}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fee Paid</span><span className="font-bold text-primary">UGX {confirmedBooking.fee.toLocaleString()}</span></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">📧 A confirmation has been sent to {confirmedBooking.email}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/properties" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">Browse Properties</a>
            <a href={`https://wa.me/256700000000?text=Hello%20SAGECO%2C%20I%20booked%20a%20${confirmedBooking.bookingType}%20(Ref%3A%20${confirmedBooking.reference})`} target="_blank" rel="noopener"
              className="border-2 border-green-500 text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-500 hover:text-white transition">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
        </>
    )
  }

  return (
    <>
      <Head>
        <title>Book a Property Viewing | SAGECO EVERGREEN</title>
        <meta name="description" content="Book a property viewing, consultation, or site visit with SAGECO EVERGREEN. Secure payment via PesaPal." />
        <link rel="canonical" href={`${SITE_URL}/book`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/book`} />
        <meta property="og:title" content="Book a Property Viewing | SAGECO EVERGREEN" />
        <meta property="og:description" content="Book a property viewing with SAGECO EVERGREEN. Secure payment via PesaPal." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
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

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-primary" : "text-gray-400"}`}>
                {s === 1 ? "Details" : "Payment"}
              </span>
              {s === 1 && <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Booking type selector */}
        {!isBrokerProperty && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <div className="grid grid-cols-1 gap-2">
              {BOOKING_TYPES.map(t => (
                <button key={t.value} type="button"
                  onClick={() => setForm({ ...form, bookingType: t.value })}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${form.bookingType === t.value ? "border-primary bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                  <span className="font-bold text-primary text-sm">UGX {t.fee.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fee breakdown */}
        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
          <p className="font-bold text-gray-800 mb-3">💳 Fee Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total fee</span>
              <span className="font-bold">UGX {currentFee.toLocaleString()}</span>
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
                <span className="font-semibold text-primary">UGX {currentFee.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input required type="tel" placeholder="07XX XXX XXX" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input required type="date" min={today} max={maxDate}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                  <select required value={form.timeSlot}
                    onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
                    <option value="">Select a time slot...</option>
                    {TIME_SLOTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea rows={3} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.whatsappUpdates}
                  onChange={e => setForm({ ...form, whatsappUpdates: e.target.checked })}
                  className="w-4 h-4 rounded text-primary" />
                <span className="text-sm text-gray-600">Send me booking updates via WhatsApp</span>
              </label>
              <button type="button" disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue to Payment →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2">
                <p className="font-bold text-primary mb-2">📋 Booking Summary</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{new Date(form.date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{TIME_SLOTS.find(s => s.value === form.timeSlot)?.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-semibold">{selectedType.label}</span></div>
                  {propertyTitle !== "Property" && (
                    <div className="flex justify-between"><span className="text-gray-500">Property</span><span className="font-semibold">{propertyTitle}</span></div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between"><span className="text-gray-500">Total Fee</span><span className="font-bold text-primary">UGX {currentFee.toLocaleString()}</span></div>
                </div>
              </div>

              <button type="submit" disabled={status === "processing"}
                className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
                {status === "processing" ? "Redirecting to PesaPal..." : `Pay UGX ${currentFee.toLocaleString()} via PesaPal`}
              </button>
              <button type="button" onClick={() => setStep(1)}
                className="w-full text-gray-500 text-sm font-medium hover:text-gray-700">
                ← Back to edit details
              </button>
              {status === "error" && <p className="text-red-500 text-sm text-center mt-2">Payment failed. Please try again.</p>}
            </>
          )}
        </form>
      </div>
    </>
  )
}
