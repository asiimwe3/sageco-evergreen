import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Head from "next/head"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default function AdminOfficers() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", role: "officer",
    department: "", bio: "", status: "active"
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    if (authed) fetchOfficers()
  }, [authed])

  async function fetchOfficers() {
    setLoading(true)
    const { data } = await supabase.from("officers").select("*").order("created_at", { ascending: false })
    setOfficers(data || [])
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
      setMsg("Officer added successfully!")
      setForm({ full_name: "", email: "", phone: "", role: "officer", department: "", bio: "", status: "active" })
      setShowForm(false)
      fetchOfficers()
    } else {
      setMsg("Error: " + (d.error || "Failed"))
    }
    setSaving(false)
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

  if (!authed) {
    return (
      <>
        <Head><title>Admin — Officers | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
        <Navbar />
        <div className="max-w-sm mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-primary mb-6">Admin Access</h1>
          <input type="password" placeholder="Enter admin password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-primary outline-none"
          />
          <button onClick={() => { if (password === "sageco2026") setAuthed(true); else alert("Wrong password") }}
            className="w-full bg-primary text-white py-3 rounded-full font-bold hover:opacity-90">
            Enter
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const ROLES = ["officer", "senior_officer", "manager", "director"]
  const DEPTS = ["Sales", "Operations", "Finance", "Marketing", "Legal", "Management"]
  const STATUS_COLORS = { active: "bg-green-100 text-green-700", inactive: "bg-red-100 text-red-600" }

  return (
    <>
      <Head><title>Officers Admin | SAGECO EVERGREEN</title><meta name="robots" content="noindex" /></Head>
      <Navbar />
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Officers Management</h1>
            <p className="text-green-100 text-sm mt-1">{officers.length} officers registered</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:opacity-90">
            {showForm ? "Cancel" : "+ Add Officer"}
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {msg && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Officer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                  {ROLES.map(r => <option key={r} value={r}>{r.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select...</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Bio (optional)</label>
              <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={saving}
              className="mt-6 bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Add Officer"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading officers...</div>
        ) : officers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-500">No officers added yet. Click + Add Officer to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {officers.map(o => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm border p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                  {o.full_name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{o.full_name}</p>
                  <p className="text-xs text-gray-500">{o.role?.replace("_"," ")} · {o.department || "—"}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">{o.email}</p>
                  {o.phone && <p className="text-xs text-gray-400">{o.phone}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-500"}`}>
                      {o.status}
                    </span>
                    <button onClick={() => toggleStatus(o)}
                      className="text-xs text-gray-400 hover:text-primary underline">
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
