import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"

export default function AdminOfficers() {
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", role: "officer",
    department: "", bio: "", status: "active"
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => { fetchOfficers() }, [])

  async function fetchOfficers() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/get-officers", { headers: { "x-admin-secret": ADMIN_SECRET } })
      const d = await res.json()
      setOfficers(d.officers || [])
    } catch (e) { setMsg("Error: " + e.message) }
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    const res = await fetch("/api/admin/add-officer", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify(form)
    })
    const d = await res.json()
    if (res.ok) {
      setMsg("Officer added!")
      setForm({ full_name: "", email: "", phone: "", role: "officer", department: "", bio: "", status: "active" })
      setShowForm(false)
      fetchOfficers()
    } else { setMsg("Error: " + (d.error || "Failed")) }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm("Remove this officer?")) return
    await fetch("/api/admin/add-officer", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    fetchOfficers()
  }

  async function toggleStatus(officer) {
    const newStatus = officer.status === "active" ? "inactive" : "active"
    await fetch("/api/admin/add-officer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id: officer.id, status: newStatus })
    })
    fetchOfficers()
  }

  return (
    <AdminGate title="Officers">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company Officers</h1>
            <p className="text-gray-500 text-sm">{officers.length} team members</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90">
            {showForm ? "Cancel" : "+ Add Officer"}
          </button>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-lg font-bold text-gray-800 md:col-span-2">New Officer</h2>
            {[
              { key: "full_name", label: "Full Name", placeholder: "Full name" },
              { key: "email", label: "Email", placeholder: "email@sageco.co" },
              { key: "phone", label: "Phone", placeholder: "+256..." },
              { key: "department", label: "Department", placeholder: "Sales, Admin..." },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-gray-600 mb-1">{f.label}</label>
                <input required={f.key === "full_name"} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {["officer", "manager", "director", "CEO", "accountant", "receptionist"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={2} placeholder="Short bio..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50">
                {saving ? "Saving..." : "Add Officer"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {officers.map(o => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm border p-5">
                <div className="flex items-center gap-3 mb-3">
                  {o.photo_url ? (
                    <img src={o.photo_url} alt={o.full_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {o.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{o.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{o.role} · {o.department || "—"}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-1">{o.email}</p>
                <p className="text-xs text-gray-400 mb-3">{o.phone}</p>
                {o.bio && <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">"{o.bio}"</p>}
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(o)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border transition ${o.status === "active" ? "border-green-300 text-green-600 hover:bg-green-50" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"}`}>
                    {o.status === "active" ? "✓ Active" : "Inactive"}
                  </button>
                  <button onClick={() => handleDelete(o.id)}
                    className="flex-1 text-xs py-1.5 rounded-lg font-semibold border border-red-200 text-red-500 hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {officers.length === 0 && !loading && (
              <div className="md:col-span-3 text-center py-16 text-gray-400">No officers added yet.</div>
            )}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
