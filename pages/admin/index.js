import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"
import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"

const SECTIONS = [
  { href: "/admin/properties",    icon: "🏡", label: "Properties",       desc: "Add, edit, feature, remove listings",        statKey: "properties",    color: "text-primary bg-green-50" },
  { href: "/admin/brokers",       icon: "🤝", label: "Brokers",          desc: "Approve, suspend, manage broker accounts",   statKey: "brokers",       color: "text-blue-700 bg-blue-50" },
  { href: "/admin/bookings",      icon: "📅", label: "Bookings",         desc: "View & confirm property viewing bookings",   statKey: "bookings",      color: "text-indigo-700 bg-indigo-50" },
  { href: "/admin/subscriptions", icon: "💳", label: "Subscriptions",    desc: "Manage broker plans & payment status",       statKey: "subscriptions", color: "text-purple-700 bg-purple-50" },
  { href: "/admin/applications",  icon: "📋", label: "Applications",     desc: "Review & respond to career applications",    statKey: "applications",  color: "text-orange-700 bg-orange-50" },
  { href: "/admin/messages",      icon: "💬", label: "Messages",         desc: "Read & reply to contact form messages",      statKey: "messages",      color: "text-pink-700 bg-pink-50" },
  { href: "/admin/officers",      icon: "👔", label: "Officers",         desc: "Manage company team & staff",                statKey: "officers",      color: "text-teal-700 bg-teal-50" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats", { headers: { "x-admin-secret": ADMIN_SECRET } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <AdminGate title="Admin Dashboard">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">SAGECO EVERGREEN Admin Panel</p>
        </div>

        {/* Revenue Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary to-green-700 text-white rounded-xl p-5">
              <p className="text-green-200 text-xs mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">UGX {(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-green-200 text-xs mt-1">{stats.confirmedBookings || 0} confirmed bookings</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-400 text-xs mb-1">Business Share</p>
              <p className="text-xl font-bold text-primary">UGX {(stats.businessRevenue || 0).toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">Platform earnings</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-400 text-xs mb-1">Broker Share</p>
              <p className="text-xl font-bold text-blue-600">UGX {(stats.brokerRevenue || 0).toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">Paid to brokers</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-gray-400 text-xs mb-1">Pending Revenue</p>
              <p className="text-xl font-bold text-yellow-600">UGX {(stats.pendingRevenue || 0).toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">{stats.pendingBookings || 0} pending bookings</p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {stats && (
          <div className="flex flex-wrap gap-3 mb-8">
            {stats.pendingBookings > 0 && (
              <Link href="/admin/bookings" className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-100 transition">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                {stats.pendingBookings} pending booking{stats.pendingBookings > 1 ? 's' : ''} awaiting confirmation
              </Link>
            )}
            {stats.unreadMessages > 0 && (
              <Link href="/admin/messages" className="flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-100 transition">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? 's' : ''}
              </Link>
            )}
          </div>
        )}

        {/* Booking type breakdown */}
        {stats?.bookingTypes && Object.keys(stats.bookingTypes).length > 0 && (
          <div className="bg-white border rounded-xl p-5 shadow-sm mb-8">
            <h2 className="font-bold text-gray-800 mb-4">Booking Types</h2>
            <div className="space-y-3">
              {Object.entries(stats.bookingTypes).map(([type, count]) => {
                const total = stats.bookings || 1
                const pct = Math.round((count / total) * 100)
                const labels = { viewing: "🏡 Property Viewing", consultation: "💬 Consultation", site_visit: "📍 Site Visit" }
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{labels[type] || type}</span>
                      <span className="font-bold text-gray-800">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SECTIONS.map(s => (
            <Link key={s.href} href={s.href}
              className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition hover:-translate-y-0.5 duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color.split(' ')[1]}`}>
                {s.icon}
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-800">{s.label}</h3>
                {loading ? (
                  <span className="w-6 h-4 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className={`text-lg font-extrabold ${s.color.split(' ')[0]}`}>
                    {stats?.[s.statKey] ?? "–"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminGate>
  )
}
