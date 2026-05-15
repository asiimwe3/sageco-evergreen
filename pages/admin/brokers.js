import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-600",
  rejected: "bg-gray-100 text-gray-500"
}
const PLAN_COLORS = {
  basic: "bg-gray-100 text-gray-600",
  pro: "bg-green-100 text-green-700",
  premium: "bg-yellow-100 text-yellow-700"
}

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { fetchBrokers() }, [])

  async function fetchBrokers() {
    setLoading(true)
    const res = await fetch("/api/admin/get-brokers", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setBrokers(d.brokers || [])
    setLoading(false)
  }

  async function updateBroker(id, data) {
    const res = await fetch("/api/admin/update-broker", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, ...data })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchBrokers() }
    else setMsg("Error: " + d.error)
  }

  const filtered = brokers.filter(b => {
    const matchStatus = filter === "all" || b.registration_status === filter
    const matchSearch = !search || b.full_name?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <AdminGate title="Brokers">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Brokers</h1>
            <p className="text-gray-500 text-sm">{brokers.length} registered brokers</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <div className="flex gap-3 mb-5 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary flex-1 min-w-48" />
          {["all", "pending", "active", "suspended"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition capitalize ${filter === s ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500"}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-5 flex items-center justify-between flex-wrap gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                  <div className="flex items-center gap-4">
                    {b.photo_url ? (
                      <img src={b.photo_url} alt={b.full_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                        {b.full_name?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{b.full_name}</p>
                      <p className="text-sm text-gray-500">{b.email} · {b.phone}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLORS[b.registration_status] || "bg-gray-100 text-gray-500"}`}>
                          {b.registration_status || "pending"}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${PLAN_COLORS[b.plan] || PLAN_COLORS.basic}`}>
                          {(b.plan || "basic").charAt(0).toUpperCase() + (b.plan || "basic").slice(1)} Plan
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">{expanded === b.id ? "▲" : "▼"}</span>
                </div>

                {expanded === b.id && (
                  <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div><span className="text-gray-400 block">Location</span><span className="font-semibold">{b.location || "—"}</span></div>
                      <div><span className="text-gray-400 block">Specialization</span><span className="font-semibold">{b.specialization || "—"}</span></div>
                      <div><span className="text-gray-400 block">Plan Expires</span><span className="font-semibold">{b.plan_expires_at ? new Date(b.plan_expires_at).toLocaleDateString("en-GB") : "—"}</span></div>
                      <div><span className="text-gray-400 block">Reg. Paid</span><span className="font-semibold">{b.registration_paid ? "Yes ✓" : "No"}</span></div>
                      <div><span className="text-gray-400 block">Activation Paid</span><span className="font-semibold">{b.activation_paid ? "Yes ✓" : "No"}</span></div>
                      <div><span className="text-gray-400 block">Joined</span><span className="font-semibold">{new Date(b.created_at).toLocaleDateString("en-GB")}</span></div>
                    </div>
                    {b.bio && <p className="text-gray-500 text-sm mb-4 italic">"{b.bio}"</p>}
                    <div className="flex gap-3 flex-wrap">
                      <select defaultValue=""
                        onChange={e => { if (e.target.value) updateBroker(b.id, { registration_status: e.target.value }) }}
                        className="text-sm border rounded-lg px-3 py-2">
                        <option value="">Set Status...</option>
                        <option value="active">Approve / Active</option>
                        <option value="pending">Set Pending</option>
                        <option value="suspended">Suspend</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <select defaultValue=""
                        onChange={e => { if (e.target.value) updateBroker(b.id, { plan: e.target.value, activation_paid: true, plan_expires_at: new Date(Date.now()+30*24*60*60*1000).toISOString() }) }}
                        className="text-sm border rounded-lg px-3 py-2">
                        <option value="">Assign Plan...</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-400">No brokers found.</div>
            )}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
