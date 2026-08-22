import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"
import SEO from '../../components/SEO'

const STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  rescheduled: "bg-purple-100 text-purple-700 border-purple-200",
  no_show: "bg-gray-100 text-gray-600 border-gray-200"
}

const TYPE_LABELS = {
  viewing: "🏡 Property Viewing",
  consultation: "💬 Consultation",
  site_visit: "📍 Site Visit"
}

const TIME_SLOTS = {
  "08:00-10:00": "Morning · 8–10 AM",
  "10:00-12:00": "Late Morning · 10 AM–12 PM",
  "13:00-15:00": "Afternoon · 1–3 PM",
  "15:00-17:00": "Late Afternoon · 3–5 PM"
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [adminNote, setAdminNote] = useState("")

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const res = await fetch("/api/admin/get-bookings", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setBookings(d.bookings || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const updates = { id, status }
    if (status === "confirmed") updates.confirmed_at = new Date().toISOString()
    if (status === "cancelled") updates.cancelled_at = new Date().toISOString()

    const res = await fetch("/api/admin/update-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify(updates)
    })
    const d = await res.json()
    if (d.ok) {
      setMsg(`✅ Booking ${status}`)
      fetchBookings()
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status, ...updates })
      }
      setTimeout(() => setMsg(""), 3000)
    }
    else setMsg("❌ Error: " + d.error)
  }

  async function saveAdminNote(id) {
    const res = await fetch("/api/admin/update-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, admin_notes: adminNote })
    })
    const d = await res.json()
    if (d.ok) {
      setMsg("✅ Note saved")
      fetchBookings()
      setTimeout(() => setMsg(""), 3000)
    }
  }

  function exportCSV() {
    const headers = ["Reference", "Customer", "Email", "Phone", "Property", "Broker", "Date", "Time Slot", "Type", "Amount", "Business Share", "Broker Share", "Status", "Created"]
    const rows = filtered.map(b => [
      b.reference || "",
      b.customer_name || "",
      b.customer_email || "",
      b.customer_phone || "",
      b.property_title || "",
      b.broker_name || "",
      b.preferred_date || "",
      TIME_SLOTS[b.time_slot] || b.time_slot || "",
      TYPE_LABELS[b.booking_type]?.replace(/[^a-zA-Z ]/g, "").trim() || b.booking_type || "",
      b.total_amount || 0,
      b.business_share || 0,
      b.broker_share || 0,
      b.status || "",
      new Date(b.created_at).toLocaleString()
    ])

    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sageco-bookings-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === "all" || b.status === filter
    const matchesSearch = !search ||
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.reference?.toLowerCase().includes(search.toLowerCase()) ||
      b.property_title?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalRevenue = bookings.filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const pendingRevenue = bookings.filter(b => b.status === "pending")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)

  return (
    <>
      <SEO
        title="Manage Bookings - Admin"
        description="Manage property viewing bookings and site visits."
        keywords="admin bookings SAGECO"
        path="/admin/bookings"
        noindex
      />
    <AdminGate title="Bookings">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500 text-sm">{bookings.length} total · UGX {totalRevenue.toLocaleString()} confirmed · UGX {pendingRevenue.toLocaleString()} pending</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchBookings} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50">
              ↻ Refresh
            </button>
            <button onClick={exportCSV} disabled={filtered.length === 0}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 disabled:opacity-50">
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("❌") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total", count: bookings.length, color: "text-gray-800", bg: "bg-gray-50" },
            { label: "Pending", count: bookings.filter(b => b.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Confirmed", count: bookings.filter(b => b.status === "confirmed").length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Completed", count: bookings.filter(b => b.status === "completed").length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Cancelled", count: bookings.filter(b => b.status === "cancelled").length, color: "text-red-500", bg: "bg-red-50" },
            { label: "No Show", count: bookings.filter(b => b.status === "no_show").length, color: "text-gray-500", bg: "bg-gray-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl border p-3 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <input type="text" placeholder="🔍 Search by name, email, reference..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          {["all", "pending", "confirmed", "completed", "cancelled", "rescheduled", "no_show"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition capitalize ${filter === s ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Property / Type</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedBooking(b); setAdminNote(b.admin_notes || "") }}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{b.customer_name}</p>
                      <p className="text-gray-400 text-xs">{b.customer_email}</p>
                      <p className="text-gray-400 text-xs">{b.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.property_title || "—"}</p>
                      <p className="text-gray-400 text-xs">{TYPE_LABELS[b.booking_type] || b.booking_type || "Viewing"}</p>
                      {b.broker_name && <p className="text-gray-400 text-xs">Broker: {b.broker_name}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.preferred_date ? (
                        <>
                          <p>{new Date(b.preferred_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="text-xs text-gray-400">{TIME_SLOTS[b.time_slot] || b.time_slot || "—"}</p>
                        </>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-primary">UGX {(b.total_amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Biz: {(b.business_share || 0).toLocaleString()} · Broker: {(b.broker_share || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        {b.status?.replace("_", " ") || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {b.status === "pending" && (
                          <button onClick={() => updateStatus(b.id, "confirmed")}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600">
                            ✓ Confirm
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button onClick={() => updateStatus(b.id, "completed")}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-blue-600">
                            ✓ Done
                          </button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button onClick={() => updateStatus(b.id, "cancelled")}
                            className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold hover:bg-red-200">
                            ✕ Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-400">
                {search ? "No bookings match your search." : "No bookings found."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 text-xs">Reference</p>
                    <p className="font-semibold">{selectedBooking.reference || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize border ${STATUS_COLORS[selectedBooking.status] || "bg-gray-100"}`}>
                      {selectedBooking.status?.replace("_", " ") || "pending"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Type</p>
                    <p className="font-semibold">{TYPE_LABELS[selectedBooking.booking_type] || selectedBooking.booking_type || "Viewing"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Created</p>
                    <p className="font-semibold">{new Date(selectedBooking.created_at).toLocaleString("en-GB")}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-1">Customer</p>
                <p className="font-semibold text-gray-800">{selectedBooking.customer_name}</p>
                <p className="text-gray-600">{selectedBooking.customer_email}</p>
                <p className="text-gray-600">{selectedBooking.customer_phone}</p>
                {selectedBooking.whatsapp_updates && (
                  <p className="text-green-600 text-xs mt-1">✓ Opted in for WhatsApp updates</p>
                )}
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-1">Property</p>
                <p className="font-semibold">{selectedBooking.property_title || "—"}</p>
                {selectedBooking.broker_name && <p className="text-gray-600 text-sm">Broker: {selectedBooking.broker_name}</p>}
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-1">Schedule</p>
                <p className="font-semibold">
                  {selectedBooking.preferred_date ? new Date(selectedBooking.preferred_date).toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "—"}
                </p>
                <p className="text-gray-600 text-sm">{TIME_SLOTS[selectedBooking.time_slot] || selectedBooking.time_slot || "Time not specified"}</p>
              </div>

              {selectedBooking.message && (
                <div className="border-t pt-3">
                  <p className="text-gray-400 text-xs mb-1">Customer Message</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedBooking.message}</p>
                </div>
              )}

              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-1">Payment</p>
                <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-bold text-primary">UGX {(selectedBooking.total_amount || 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Business share</span><span>UGX {(selectedBooking.business_share || 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Broker share</span><span>UGX {(selectedBooking.broker_share || 0).toLocaleString()}</span></div>
              </div>

              {/* Admin notes */}
              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-1">Admin Notes</p>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add internal notes (not visible to customer)..."
                  rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                <button onClick={() => saveAdminNote(selectedBooking.id)}
                  className="mt-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200">
                  Save Note
                </button>
              </div>

              {/* Quick actions */}
              <div className="border-t pt-3">
                <p className="text-gray-400 text-xs mb-2">Quick Actions</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedBooking.status !== "confirmed" && selectedBooking.status !== "completed" && (
                    <button onClick={() => updateStatus(selectedBooking.id, "confirmed")}
                      className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-green-600">
                      ✓ Confirm Booking
                    </button>
                  )}
                  {selectedBooking.status === "confirmed" && (
                    <button onClick={() => updateStatus(selectedBooking.id, "completed")}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600">
                      ✓ Mark Completed
                    </button>
                  )}
                  {selectedBooking.status === "pending" && (
                    <button onClick={() => updateStatus(selectedBooking.id, "rescheduled")}
                      className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-600">
                      ↻ Reschedule
                    </button>
                  )}
                  {(selectedBooking.status === "confirmed" || selectedBooking.status === "completed") && (
                    <button onClick={() => updateStatus(selectedBooking.id, "no_show")}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-600">
                      🚫 No Show
                    </button>
                  )}
                  {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                    <button onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-200">
                      ✕ Cancel
                    </button>
                  )}
                  <a href={`https://wa.me/${selectedBooking.customer_phone?.replace(/[^0-9]/g, '').replace(/^0/, '256')}`}
                    target="_blank" rel="noopener"
                    className="border border-green-500 text-green-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-50">
                    💬 WhatsApp
                  </a>
                  <a href={`mailto:${selectedBooking.customer_email}?subject=Your%20SAGECO%20Booking%20${selectedBooking.reference || ""}`}
                    className="border border-blue-500 text-blue-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50">
                    📧 Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminGate>
    </>
  )
}
