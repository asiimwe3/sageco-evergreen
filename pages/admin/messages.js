import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"
import SEO from '../../components/SEO'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState("")
  const [msg, setMsg] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch("/api/admin/get-messages", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setMessages(d.messages || [])
    setLoading(false)
  }

  async function markRead(id) {
    await fetch("/api/admin/update-message", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, status: "read" })
    })
    fetchMessages()
  }

  async function sendReply(id) {
    if (!reply.trim()) return
    const res = await fetch("/api/admin/update-message", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, reply })
    })
    const d = await res.json()
    if (d.ok) { setMsg("✅ Reply saved"); setReply(""); fetchMessages(); setTimeout(() => setMsg(""), 3000) }
  }

  const STATUS_COLORS = {
    unread: "bg-yellow-100 text-yellow-700",
    read: "bg-gray-100 text-gray-600",
    replied: "bg-green-100 text-green-700",
    subscription_pending: "bg-purple-100 text-purple-700"
  }

  const filtered = filter === "all" ? messages : messages.filter(m => m.status === filter)
  const unreadCount = messages.filter(m => m.status === "unread").length

  return (
    <>
      <SEO
        title="Messages - Admin"
        description="Manage contact form messages and inquiries."
        keywords="admin messages SAGECO"
        path="/admin/messages"
        noindex
      />
    <AdminGate title="Messages">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            {unreadCount > 0 && <p className="text-sm text-yellow-600">{unreadCount} unread</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all","unread","read","replied"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${filter === f ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">{msg}</div>}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No messages found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message list */}
            <div className="lg:col-span-1 space-y-2">
              {filtered.map(m => (
                <button key={m.id} onClick={() => { setSelected(m); if (m.status === "unread") markRead(m.id) }}
                  className={`w-full text-left p-4 rounded-xl border transition ${selected?.id === m.id ? 'border-primary bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'} ${m.status === 'unread' ? 'font-semibold' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-800 truncate">{m.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status] || STATUS_COLORS.read}`}>{m.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.email}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{m.message}</p>
                  <p className="text-xs text-gray-300 mt-1">{new Date(m.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>

            {/* Message detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <h2 className="font-bold text-gray-800">{selected.name}</h2>
                      <p className="text-sm text-gray-500">{selected.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`mailto:${selected.email}?subject=Re: Your message to SAGECO EVERGREEN`}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100">Email</a>
                      <a href={`https://wa.me/${selected.email.replace(/\D/g,'')}?text=Hello ${selected.name}, SAGECO EVERGREEN here...`}
                        target="_blank" rel="noopener"
                        className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-100">WhatsApp</a>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>

                  {selected.reply && (
                    <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                      <p className="text-xs font-bold text-green-700 mb-1">Your Reply:</p>
                      <p className="text-sm text-gray-700">{selected.reply}</p>
                      {selected.replied_at && <p className="text-xs text-gray-400 mt-2">{new Date(selected.replied_at).toLocaleString()}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Add Reply / Notes</label>
                    <textarea
                      rows={4}
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      placeholder="Type your reply or internal note..."
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                    <button onClick={() => sendReply(selected.id)}
                      disabled={!reply.trim()}
                      className="mt-2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 disabled:opacity-40">
                      Save Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center text-gray-400">
                  Select a message to view
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminGate>
    </>
  )
}
