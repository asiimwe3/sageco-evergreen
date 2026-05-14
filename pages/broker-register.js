import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 10000,
    period: "month",
    color: "border-gray-300",
    btnClass: "bg-gray-700 text-white",
    features: [
      "Listed on Brokers page",
      "Verified broker badge",
      "Clients can contact you directly",
      "Up to 5 property listings",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 20000,
    period: "month",
    color: "border-primary",
    btnClass: "bg-primary text-white",
    badge: "⭐ Popular",
    features: [
      "Everything in Basic",
      "Up to 20 property listings",
      "Priority placement in search",
      "Listing analytics dashboard",
      "Bulk property uploads",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 30000,
    period: "month",
    color: "border-yellow-400",
    btnClass: "bg-yellow-500 text-white",
    badge: "👑 Best Value",
    features: [
      "Everything in Pro",
      "Unlimited property listings",
      "Featured on homepage",
      "Dedicated support",
      "Early access to new features",
    ],
  },
]

export default function BrokerRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", location: "", specialization: "", bio: ""
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [brokerId, setBrokerId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmitProfile(e) {
    e.preventDefault()
    setError("")
    if (!form.full_name || !form.email || !form.phone) {
      setError("Please fill in all required fields.")
      return
    }
    setLoading(true)

    let photo_url = null
    if (photoFile) {
      try {
        const reader = new FileReader()
        photo_url = await new Promise((resolve) => {
          const timer = setTimeout(() => resolve(null), 8000) // 8s timeout
          reader.onload = async (e) => {
            clearTimeout(timer)
            try {
              const base64Data = e.target.result.split(",")[1]
              const uploadRes = await fetch("/api/upload-photo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fileData: base64Data,
                  fileName: photoFile.name,
                  mimeType: photoFile.type
                })
              })
              const d = await uploadRes.json()
              resolve(d.url || null)
            } catch { resolve(null) }
          }
          reader.onerror = () => { clearTimeout(timer); resolve(null) }
          reader.readAsDataURL(photoFile)
        })
      } catch { photo_url = null }
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout
      const res = await fetch("/api/register-broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo_url }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      const result = await res.json()

      if (!res.ok || result.error) {
        setError("Failed to register: " + (result.error || "Unknown error"))
        setLoading(false)
        return
      }

      setBrokerId(result.broker.id)
      setLoading(false)
      setStep(2)
    } catch (err) {
      setError(err.name === "AbortError"
        ? "Registration timed out. Please check your connection and try again."
        : "An error occurred. Please try again.")
      setLoading(false)
    }
  }

  async function handleRegistrationPayment() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/pesapal/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 20000,
        currency: "UGX",
        description: "Broker Account Registration Fee",
        email: form.email,
        phone: form.phone,
        first_name: form.full_name.split(" ")[0],
        last_name: form.full_name.split(" ").slice(1).join(" ") || "N/A",
        reference: `BROKER-REG-${brokerId?.slice(0,8) || Date.now()}`,
        callback_url: `${window.location.origin}/broker-payment-success?broker_id=${brokerId}&type=registration`
      })
    })
    const data = await res.json()
    setLoading(false)
    if (data.redirect_url) {
      window.location.href = data.redirect_url
    } else {
      setError("Payment failed: " + (data.error || "Please try again"))
    }
  }

  async function handlePlanPayment(plan) {
    setLoading(true)
    setError("")
    const res = await fetch("/api/pesapal/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: plan.price,
        currency: "UGX",
        description: `Broker ${plan.name} Plan — Monthly`,
        email: form.email,
        phone: form.phone,
        first_name: form.full_name.split(" ")[0],
        last_name: form.full_name.split(" ").slice(1).join(" ") || "N/A",
        reference: `BROKER-PLAN-${plan.id.toUpperCase()}-${brokerId?.slice(0,8) || Date.now()}`,
        callback_url: `${window.location.origin}/broker-payment-success?broker_id=${brokerId}&type=activation&plan=${plan.id}`
      })
    })
    const data = await res.json()
    setLoading(false)
    if (data.redirect_url) {
      window.location.href = data.redirect_url
    } else {
      setError("Payment failed: " + (data.error || "Please try again"))
    }
  }

  const steps = ["Profile", "Registration Fee", "Choose Plan"]

  return (
    <>
      <Head>
        <title>Broker Registration | SAGECO EVERGREEN</title>
        <meta name="description" content="Register as a verified broker on SAGECO EVERGREEN. List properties, reach clients, and grow your real estate business in Uganda." />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">Broker Registration</h1>
        <p className="text-green-100 mt-2">Join SAGECO EVERGREEN as a verified real estate broker</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`font-medium text-xs hidden sm:block ${step === i + 1 ? "text-primary" : "text-gray-400"}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Profile */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Your Profile</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+256 700 000000"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Kampala"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Specialization</label>
                  <select name="specialization" value={form.specialization} onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select...</option>
                    {["Residential","Commercial","Land","Rentals","All Properties"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Profile Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])}
                  className="w-full border rounded-lg px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Short Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  placeholder="Tell clients about yourself..."
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
                {loading ? (photoFile ? "Uploading photo..." : "Saving...") : "Continue →"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 — Registration Fee (UGX 20,000 one-time) */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Open Your Broker Account</h2>
            <p className="text-gray-500 mb-6">Pay a one-time registration fee to activate your verified broker profile.</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <div className="border-2 border-primary rounded-xl p-6 mb-6 text-left space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Registration Fee</span><span className="font-bold">UGX 20,000</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Type</span><span className="font-bold text-green-600">One-time</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Payment</span><span className="font-bold">PesaPal (MTN / Airtel / Card)</span></div>
              <hr className="my-2" />
              <p className="text-xs text-gray-400">Includes: verified badge, broker profile listing, client contact access.</p>
            </div>
            <button onClick={handleRegistrationPayment} disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {loading ? "Redirecting..." : "Pay UGX 20,000 via PesaPal →"}
            </button>
            <button onClick={() => setStep(1)} className="mt-3 text-sm text-gray-400 hover:text-gray-600">← Back to profile</button>
          </div>
        )}

        {/* STEP 3 — Choose Monthly Plan */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Choose Your Dashboard Plan</h2>
            <p className="text-center text-gray-500 mb-8">Billed monthly via PesaPal. Cancel anytime.</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map(plan => (
                <div key={plan.id} className={`border-2 ${plan.color} rounded-2xl p-6 flex flex-col relative`}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{plan.badge}</span>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-3xl font-extrabold text-primary mb-1">
                    UGX {plan.price.toLocaleString()}
                    <span className="text-base font-normal text-gray-400">/mo</span>
                  </div>
                  <ul className="mt-4 mb-6 space-y-2 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handlePlanPayment(plan)} disabled={loading}
                    className={`w-full py-3 rounded-full font-bold ${plan.btnClass} hover:opacity-90 disabled:opacity-50`}>
                    {loading ? "..." : `Choose ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
