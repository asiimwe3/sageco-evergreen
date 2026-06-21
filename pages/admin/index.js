import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"

const ADMIN_SECRET = "sageco-admin-2026"

const SECTIONS = [
  { href: "/admin/properties",    icon: "🏡", label: "Properties",       desc: "Add, edit, feature, remove listings" },
  { href: "/admin/brokers",       icon: "🤝", label: "Brokers",          desc: "Approve, suspend, manage broker accounts" },
  { href: "/admin/bookings",      icon: "📅", label: "Bookings",         desc: "View & confirm property viewing bookings" },
  { href: "/admin/subscriptions", icon: "💳", label: "Subscriptions",    desc: "Manage broker plans & payment status" },
  { href: "/admin/applications",  icon: "📋", label: "Job Applications", desc: "Review & respond to career applications" },
  { href: "/admin/messages",      icon: "💬", label: "Messages",         desc: "Read & reply to contact form messages" },
  { href: "/admin/officers",      icon: "👔", label: "Officers",         desc: "Manage company team & staff" },
]

const STAT_MAP = {
  "/admin/properties":    ["properties",    "text-primary"],
  "/admin/brokers":       ["brokers",       "text-green-600"],
  "/admin/bookings":      ["bookings",      "text-blue-600"],
  "/admin/subscriptions": ["subscriptions", "text-purple-600"],
  "/admin/applications":  ["applications",  "text-orange-600"],
  "/admin/messages":      ["messages",      "text-red-500"],
  "/admin/officers":      ["officers",      "text-gray-700"],
}

export default function AdminIndex() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [stats, setStats] = useState({})
  const [recentBookings, setRecentBookings] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState("7d")

  useEffect(() => {
    if (authed) {
      fetchStats()
      fetchRecent()
    }
  }, [authed])

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/stats", { headers: { "x-admin-secret": ADMIN_SECRET } })
      const d = await res.json()
      setStats(d)
    } catch {}
    setLoading(false)
  }

  async function fetchRecent() {
    try {
      const [bRes, mRes] = await Promise.all([
        fetch("/api/admin/get-bookings", { headers: { "x-admin-secret": ADMIN_SECRET } }),
        fetch("/api/admin/get-messages", { headers: { "x-admin-secret": ADMIN_SECRET } })
      ])
      const bData = await bRes.json()
      const mData = await mRes.json()
      setRecentBookings((bData.bookings || []).slice(0, 5))
      setRecentMessages((mData.messages || []).filter(m => m.status === "unread").slice(0, 3))
    } catch {}
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Head><title>Admin Login | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">SAGECO EVERGREEN</p>
        </div>
        <input type="password" placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { if (password === "sageco2026") setAuthed(true); else alert("Wrong password") }}}
          className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-primary outline-none" />
        <button onClick={() => { if (password === "sageco2026") setAuthed(true); else alert("Wrong password") }}
          className="w-full bg-primary text-white py-3 rounded-full font-bold hover:opacity-90">
          Enter Admin
        </button>
      </div>
    </div>
  )

  // Calculate revenue from recent bookings
  const confirmedBookings = recentBookings.filter(b => b.status === "confirmed" || b.status === "completed")
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const pendingBookings = recentBookings.filter(b => b.status === "pending")

  // Booking type breakdown
  const bookingTypes = recentBookings.reduce((acc, b) => {
    const type = b.booking_type || "viewing"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <Head><title>Admin Dashboard | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-white py-8 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-200 text-sm mt-1">SAGECO EVERGREEN CO.LTD · Kyenjojo, Uganda</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchStats} className="text-sm text-green-200 hover:text-white border border-green-400 px-4 py-2 rounded-full">
                ↻ Refresh
              </button>
              <a href="/" className="text-sm text-green-200 hover:text-white border border-green-400 px-4 py-2 rounded-full">
                ← Back to Site
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Alert: Pending bookings */}
          {pendingBookings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">{pendingBookings.length} booking{pendingBookings.length > 1 ? "s" : ""} awaiting confirmation</p>
                <p className="text-yellow-600 text-sm">Review and confirm pending property viewings</p>
              </div>
              <Link href="/admin/bookings" className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-600">
                View →
              </Link>
            </div>
          )}

          {/* Alert: Unread messages */}
          {recentMessages.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <p className="font-semibold text-red-800">{recentMessages.length} unread message{recentMessages.length > 1 ? "s" : ""}</p>
                <p className="text-red-600 text-sm">New inquiries from the contact form</p>
              </div>
              <Link href="/admin/messages" className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-600">
                Read →
              </Link>
            </div>
          )}

          {/* Quick stats */}
          {!loading && Object.keys(stats).length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-8">
              {SECTIONS.map(s => {
                const [key, color] = STAT_MAP[s.href] || []
                const count = stats[key]
                if (count === undefined) return null
                return (
                  <Link key={s.href} href={s.href} className="bg-white rounded-xl border p-3 text-center shadow-sm hover:shadow-md transition cursor-pointer">
                    <p className={`text-2xl font-bold ${color}`}>{count}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Revenue & Activity section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">💰 Revenue (Confirmed)</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Live</span>
              </div>
              <p className="text-3xl font-bold text-primary">UGX {totalRevenue.toLocaleString()}</p>
              <p className="text-gray-500 text-sm mt-1">From {confirmedBookings.length} confirmed booking{confirmedBookings.length !== 1 ? "s" : ""}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Business share</span>
                  <span className="font-semibold text-primary">
                    UGX {confirmedBookings.reduce((s, b) => s + (b.business_share || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Broker share</span>
                  <span className="font-semibold text-green-600">
                    UGX {confirmedBookings.reduce((s, b) => s + (b.broker_share || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking types breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="font-bold text-gray-800 mb-4">📊 Booking Types</h2>
              <div className="space-y-3">
                {Object.entries(bookingTypes).length > 0 ? (
                  Object.entries(bookingTypes).map(([type, count]) => {
                    const total = Object.values(bookingTypes).reduce((a, b) => a + b, 0)
                    const pct = Math.round((count / total) * 100)
                    const labels = { viewing: "🏡 Viewings", consultation: "💬 Consultations", site_visit: "📍 Site Visits" }
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{labels[type] || type}</span>
                          <span className="font-semibold">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">No bookings yet</p>
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">🕐 Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-xs text-primary hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {recentBookings.length > 0 ? (
                  recentBookings.map(b => (
                    <div key={b.id} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${b.status === "confirmed" ? "bg-green-500" : b.status === "pending" ? "bg-yellow-500" : b.status === "completed" ? "bg-blue-500" : "bg-red-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{b.customer_name}</p>
                        <p className="text-gray-400 text-xs truncate">{b.property_title || b.booking_type || "Viewing"}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }) : "—"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">No recent bookings</p>
                )}
              </div>
            </div>
          </div>

          {/* Section cards */}
          <h2 className="text-lg font-bold text-gray-800 mb-4">Manage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map(s => {
              const [key, color] = STAT_MAP[s.href] || []
              const count = stats[key]
              return (
                <Link key={s.href} href={s.href}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-6 flex items-start gap-4 group">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-800">{s.label}</h2>
                      {count !== undefined && (
                        <span className={`text-sm font-bold ${color}`}>{count}</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Bottom links */}
          <div className="mt-10 text-center text-sm text-gray-400 space-x-4">
            <a href="/properties" className="hover:text-primary">View Properties</a>
            <span>·</span>
            <a href="/brokers" className="hover:text-primary">View Brokers</a>
            <span>·</span>
            <a href="/plans" className="hover:text-primary">Plans</a>
            <span>·</span>
            <a href="/careers" className="hover:text-primary">Careers</a>
          </div>
        </div>
      </div>
    </>
  )
}
