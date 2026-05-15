import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Head from "next/head"
import { useState, useEffect } from "react"
import Link from "next/link"

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

const PLAN_BADGE = {
  basic: "bg-gray-100 text-gray-600",
  pro: "bg-green-100 text-green-700",
  premium: "bg-yellow-100 text-yellow-700"
}

export default function AdminSubscriptions() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [brokers, setBrokers] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [tab, setTab] = useState("active")

  useEffect(() => { if (authed) fetchData() }, [authed])

  async function fetchData() {
    setLoading(true)
    const [bRes, pRes] = await Promise.all([
      fetch("/api/admin/get-officers", { headers: { "x-admin-secret": ADMIN_SECRET } }),
      fetch("/api/subscriptions/pending", { headers: { "x-admin-secret": ADMIN_SECRET } })
    ])
    const bData = await bRes.json()
    const pData = await pRes.json()

    // Get brokers with plan info
    const brokRes = await fetch("/api/admin/get-brokers", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const brokData = await brokRes.json()
    setBrokers(brokData.brokers || [])
    setPending(pData.pending || [])
    setLoading(false)
  }

  async function activatePlan(brokerId, plan) {
    const res = await fetch("/api/subscriptions/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ broker_id: brokerId, plan })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Plan activated!"); fetchData() }
    else setMsg("Error: " + d.error)
  }

  if (!authed) {
    return (
      <>
        <Head><title>Subscriptions Admin | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
        <Navbar />
        <div className="max-w-sm mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-primary mb-6">Admin Access</h1>
          <input type="password" placeholder="Enter admin password"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { if (password === "sageco2026") setAuthed(true); else alert("Wrong password") }}}
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-primary outline-none" />
          <button onClick={() => { if (password === "sageco2026") setAuthed(true); else alert("Wrong password") }}
            className="w-full bg-primary text-white py-3 rounded-full font-bold hover:opacity-90">Enter</button>
        </div>
        <Footer />
      </>
    )
  }

  const activeBrokers = brokers.filter(b => b.plan && b.plan !== "basic" || b.activation_paid)
  const expiredBrokers = brokers.filter(b => b.plan_expires_at && new Date(b.plan_expires_at) < new Date())

  return (
    <>
      <Head><title>Subscriptions Admin | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
      <Navbar />
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-green-100 text-sm mt-1">{brokers.length} brokers · {pending.length} pending payments</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/officers" className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm hover:opacity-90">
              Officers
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Brokers", value: brokers.length, color: "text-primary" },
            { label: "Active Plans", value: activeBrokers.length, color: "text-green-600" },
            { label: "Expired Plans", value: expiredBrokers.length, color: "text-red-500" },
            { label: "Pending Payments", value: pending.length, color: "text-yellow-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wide">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["active","pending","all"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-bold border transition ${tab === t ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : tab === "pending" ? (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No pending subscription payments.</div>
            ) : pending.map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-bold text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.email} · {p.plan} plan</p>
                  <p className="text-xs text-gray-400">Ref: {p.ref}</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Pending Payment</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Broker</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {brokers
                  .filter(b => tab === "all" || b.activation_paid || (b.plan && b.plan !== "basic"))
                  .map(b => {
                    const expired = b.plan_expires_at && new Date(b.plan_expires_at) < new Date()
                    return (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{b.full_name}</p>
                          <p className="text-gray-400 text-xs">{b.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${PLAN_BADGE[b.plan] || PLAN_BADGE.basic}`}>
                            {(b.plan || "basic").charAt(0).toUpperCase() + (b.plan || "basic").slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            b.registration_status === "active" ? "bg-green-100 text-green-700" :
                            expired ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                          }`}>
                            {b.registration_status === "active" ? (expired ? "Expired" : "Active") : b.registration_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {b.plan_expires_at ? new Date(b.plan_expires_at).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            onChange={e => { if (e.target.value) activatePlan(b.id, e.target.value) }}
                            className="text-xs border rounded-lg px-2 py-1 text-gray-600"
                            defaultValue="">
                            <option value="">Activate plan...</option>
                            <option value="basic">Basic (15k)</option>
                            <option value="pro">Pro (25k)</option>
                            <option value="premium">Premium (30k)</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
