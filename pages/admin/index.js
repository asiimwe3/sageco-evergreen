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

export default function AdminIndex() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authed) fetchStats()
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

  const STAT_MAP = {
    "/admin/properties":    ["properties",    "text-primary"],
    "/admin/brokers":       ["brokers",       "text-green-600"],
    "/admin/bookings":      ["bookings",      "text-blue-600"],
    "/admin/subscriptions": ["subscriptions", "text-purple-600"],
    "/admin/applications":  ["applications",  "text-orange-600"],
    "/admin/messages":      ["messages",      "text-red-500"],
    "/admin/officers":      ["officers",      "text-gray-700"],
  }

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
            <a href="/" className="text-sm text-green-200 hover:text-white border border-green-400 px-4 py-2 rounded-full">
              ← Back to Site
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Quick stats */}
          {!loading && Object.keys(stats).length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-8">
              {SECTIONS.map(s => {
                const [key, color] = STAT_MAP[s.href] || []
                const count = stats[key]
                if (count === undefined) return null
                return (
                  <div key={s.href} className="bg-white rounded-xl border p-3 text-center shadow-sm">
                    <p className={`text-2xl font-bold ${color}`}>{count}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Section cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map(s => {
              const [key, color] = STAT_MAP[s.href] || []
              const count = stats[key]
              return (
                <Link key={s.href} href={s.href}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-6 flex items-start gap-4">
                  <span className="text-4xl">{s.icon}</span>
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
