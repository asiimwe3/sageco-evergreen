import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"
import SEO from '../../components/SEO'

const STATUS_BADGE = {
  available: "bg-green-100 text-green-700",
  sold: "bg-gray-100 text-gray-500",
  rented: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700"
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => { fetchProps() }, [])

  async function fetchProps() {
    setLoading(true)
    const res = await fetch("/api/admin/get-properties", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setProperties(d.properties || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const res = await fetch("/api/admin/update-property", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, status })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchProps() }
    else setMsg("Error: " + d.error)
  }

  async function toggleFeatured(id, current) {
    const res = await fetch("/api/admin/update-property", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, featured: !current })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchProps() }
    else setMsg("Error: " + d.error)
  }

  async function deleteProperty(id) {
    if (!confirm("Delete this property? This cannot be undone.")) return
    const res = await fetch("/api/admin/delete-property", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Deleted."); fetchProps() }
    else setMsg("Error: " + d.error)
  }

  const filtered = properties.filter(p => {
    const matchStatus = filter === "all" || p.status === filter
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <>
      <SEO
        title="Manage Properties - Admin"
        description="Manage property listings on SAGECO EVERGREEN."
        keywords="admin properties SAGECO"
        path="/admin/properties"
        noindex
      />
    <AdminGate title="Properties">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
            <p className="text-gray-500 text-sm">{properties.length} total listings</p>
          </div>
          <a href="/upload-property" className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90">
            + Add Property
          </a>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary flex-1 min-w-48" />
          {["all", "available", "sold", "rented", "pending"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition capitalize ${filter === s ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500"}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading properties...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl">🏡</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{p.title}</h3>
                    {p.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full shrink-0 font-bold">Featured</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{p.location}</p>
                  <p className="text-primary font-bold mb-3">UGX {Number(p.price).toLocaleString()}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                      className="text-xs border rounded-lg px-2 py-1 flex-1">
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => toggleFeatured(p.id, p.featured)}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border transition ${p.featured ? "border-yellow-400 text-yellow-600 hover:bg-yellow-50" : "border-gray-300 text-gray-500 hover:border-yellow-400 hover:text-yellow-600"}`}>
                      {p.featured ? "★ Unfeature" : "☆ Feature"}
                    </button>
                    <button onClick={() => deleteProperty(p.id)}
                      className="flex-1 text-xs py-1.5 rounded-lg font-semibold border border-red-200 text-red-500 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
