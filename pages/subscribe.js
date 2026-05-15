import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://sageco-evergreen-rho.vercel.app"

const PLAN_CONFIG = {
  basic:   { name: "Basic",   price: 15000, features: "3 listings · Standard profile · 1 month" },
  pro:     { name: "Pro",     price: 25000, features: "10 listings · Featured profile · 1 month" },
  premium: { name: "Premium", price: 30000, features: "Unlimited listings · Top placement · 1 month" },
}

export default function Subscribe() {
  const router = useRouter()
  const plan = router.query.plan || "basic"
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.basic

  const [form, setForm] = useState({ full_name: "", email: "", phone: "", broker_id: "" })
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [mode, setMode] = useState("new") // "new" or "existing"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("processing")
    setError("")

    try {
      const reference = `SUB-${plan.toUpperCase()}-${Date.now()}`
      const callbackUrl = `${window.location.origin}/subscription-success?ref=${reference}&plan=${plan}`

      // Initiate PesaPal payment — uses EXISTING initiate.js, untouched
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: config.price,
          currency: "UGX",
          description: `SAGECO ${config.name} Plan Subscription`,
          email: form.email,
          phone: form.phone,
          first_name: form.full_name.split(" ")[0],
          last_name: form.full_name.split(" ").slice(1).join(" ") || "Broker",
          reference,
          callback_url: callbackUrl
        })
      })

      const data = await res.json()

      if (data.redirect_url) {
        // Save subscription intent before redirect
        await fetch("/api/subscriptions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            amount_ugx: config.price,
            pesapal_ref: reference,
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            broker_id: form.broker_id || null,
          })
        })
        window.location.href = data.redirect_url
      } else {
        setError(data.error || "Payment initiation failed. Please try again.")
        setStatus("")
      }
    } catch (err) {
      setError("Something went wrong: " + err.message)
      setStatus("")
    }
  }

  const badgeColor = plan === "premium" ? "bg-yellow-400 text-gray-900"
    : plan === "pro" ? "bg-primary text-white"
    : "bg-gray-100 text-gray-700"

  return (
    <>
      <Head>
        <title>Subscribe — {config.name} Plan | SAGECO EVERGREEN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${badgeColor}`}>
          {config.name} Plan
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Complete Your Subscription</h1>
        <p className="text-gray-500 mb-6">{config.features}</p>

        {/* Plan summary */}
        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
          <p className="font-bold text-gray-800 mb-3">💳 Payment Summary</p>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Plan</span>
            <span className="font-semibold">{config.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Duration</span>
            <span className="font-semibold">1 Month</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between">
            <span className="text-gray-700 font-bold">Total</span>
            <span className="text-primary font-bold text-lg">UGX {config.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("new")}
            className={`flex-1 py-2 rounded-full text-sm font-bold border transition ${mode === "new" ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600"}`}>
            New Subscriber
          </button>
          <button
            onClick={() => setMode("existing")}
            className={`flex-1 py-2 rounded-full text-sm font-bold border transition ${mode === "existing" ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600"}`}>
            Existing Broker
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
            <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
              placeholder="Your full name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="your@email.com"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
            <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              placeholder="+256 700 000 000"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          {mode === "existing" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Broker ID</label>
              <input value={form.broker_id} onChange={e => setForm({...form, broker_id: e.target.value})}
                placeholder="Your existing broker ID"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          )}
          <button type="submit" disabled={status === "processing"}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
            {status === "processing" ? "Redirecting to PesaPal..." : `Pay UGX ${config.price.toLocaleString()} via PesaPal`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Secure payment via PesaPal · Uganda · UGX
          </p>
        </form>
      </div>
      <Footer />
    </>
  )
}
