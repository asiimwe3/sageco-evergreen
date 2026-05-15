import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"

const STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700"
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const res = await fetch("/api/admin/get-bookings", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setBookings(d.bookings || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const res = await fetch("/api/admin/update-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, status })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchBookings() }
    else setMsg("Error: " + d.error)
  }

  const filtered = bookings.filter(b => filter === "all" || b.status === filter)
  const totalRevenue = bookings.filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)

  return (
    <AdminGate title="Bookings">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500 text-sm">{bookings.length} total · UGX {totalRevenue.toLocaleString()} confirmed revenue</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", count: bookings.length, color: "text-gray-800" },
            { label: "Pending", count: bookings.filter(b => b.status === "pending").length, color: "text-yellow-600" },
            { label: "Confirmed", count: bookings.filter(b => b.status === "confirmed").length, color: "text-green-600" },
            { label: "Completed", count: bookings.filter(b => b.status === "completed").length, color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border p-4 text-center shadow-sm">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition capitalize ${filter === s ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500"}`}>
              {s}
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
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{b.customer_name}</p>
                      <p className="text-gray-400 text-xs">{b.customer_email}</p>
                      <p className="text-gray-400 text-xs">{b.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.property_title || "—"}</p>
                      <p className="text-gray-400 text-xs">{b.broker_name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-primary">UGX {(b.total_amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Biz: {(b.business_share||0).toLocaleString()} · Broker: {(b.broker_share||0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-500"}`}>
                        {b.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select defaultValue="" onChange={e => { if (e.target.value) updateStatus(b.id, e.target.value) }}
                        className="text-xs border rounded-lg px-2 py-1">
                        <option value="">Update...</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-400">No bookings found.</div>
            )}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
