import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"
import SEO from '../../components/SEO'

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interviewed: "bg-indigo-100 text-indigo-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600"
}

export default function AdminApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")
  const [expanded, setExpanded] = useState(null)
  const [notes, setNotes] = useState("")

  useEffect(() => { fetchApps() }, [])

  async function fetchApps() {
    setLoading(true)
    const res = await fetch("/api/admin/get-applications", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setApps(d.applications || [])
    setLoading(false)
  }

  async function updateApp(id, data) {
    const res = await fetch("/api/admin/update-application", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, ...data })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchApps(); setExpanded(null) }
    else setMsg("Error: " + d.error)
  }

  const filtered = apps.filter(a => filter === "all" || a.status === filter)

  return (
    <>
      <SEO
        title="Job Applications - Admin"
        description="Review job applications for SAGECO EVERGREEN."
        keywords="admin applications SAGECO"
        path="/admin/applications"
        noindex
      />
    <AdminGate title="Job Applications">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
            <p className="text-gray-500 text-sm">{apps.length} total applications</p>
          </div>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <div className="flex gap-2 mb-5 flex-wrap">
          {["all", "new", "reviewing", "shortlisted", "hired", "rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition capitalize ${filter === s ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-500"}`}>
              {s} {s !== "all" && <span className="ml-1 text-xs">({apps.filter(a => a.status === s).length})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-5 flex items-center justify-between flex-wrap gap-3 cursor-pointer"
                  onClick={() => { setExpanded(expanded === a.id ? null : a.id); setNotes(a.notes || "") }}>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-gray-800">{a.full_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLORS[a.status] || STATUS_COLORS.new}`}>
                        {a.status || "new"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{a.job_title || a.department || "General Application"} · {a.email}</p>
                    <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString("en-GB")}</p>
                  </div>
                  <span className="text-gray-400">{expanded === a.id ? "▲" : "▼"}</span>
                </div>

                {expanded === a.id && (
                  <div className="border-t px-5 pb-5 pt-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-400 block">Phone</span><span className="font-semibold">{a.phone}</span></div>
                      <div><span className="text-gray-400 block">Experience</span><span className="font-semibold">{a.experience || "—"}</span></div>
                    </div>
                    {a.cover_letter && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-1 uppercase">Cover Letter</p>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">{a.cover_letter}</p>
                      </div>
                    )}
                    {a.cv_url && (
                      <a href={a.cv_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:underline">
                        📄 Download CV
                      </a>
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-1 uppercase">Admin Notes</p>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                        placeholder="Add internal notes..."
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <select defaultValue=""
                        onChange={e => { if (e.target.value) updateApp(a.id, { status: e.target.value, notes }) }}
                        className="text-sm border rounded-lg px-3 py-2">
                        <option value="">Update Status...</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hire ✓</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <button onClick={() => updateApp(a.id, { notes })}
                        className="text-sm bg-primary text-white px-4 py-2 rounded-full font-bold hover:opacity-90">
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-400">No applications found.</div>
            )}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
