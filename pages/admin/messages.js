import { AdminGate, ADMIN_SECRET } from "../../components/AdminLayout"
import { useState, useEffect } from "react"

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch("/api/admin/get-messages", { headers: { "x-admin-secret": ADMIN_SECRET } })
    const d = await res.json()
    setMessages(d.messages || [])
    setLoading(false)
  }

  async function updateMessage(id, status) {
    const res = await fetch("/api/admin/update-message", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id, status })
    })
    const d = await res.json()
    if (d.ok) { setMsg("Updated!"); fetchMessages() }
    else setMsg("Error: " + d.error)
  }

  const getType = (m) => {
    if ((m.message || "").startsWith("SUBSCRIPTION_INTENT")) return "subscription"
    if (m.status === "subscription_active") return "subscription"
    return "contact"
  }

  const filtered = messages.filter(m => {
    if (filter === "all") return true
    if (filter === "contact") return getType(m) === "contact"
    if (filter === "subscription") return getType(m) === "subscription"
    return m.status === filter
  })

  return (
    <AdminGate title="Messages">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages & Inquiries</h1>
          <p className="text-gray-500 text-sm">{messages.length} total messages</p>
        </div>

        {msg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {msg}
          </div>
        )}

        <div className="flex gap-2 mb-5 flex-wrap">
          {["all", "contact", "subscription", "new", "read", "replied"].map(s => (
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
            {filtered.map(m => {
              const type = getType(m)
              const isSubscription = type === "subscription"
              return (
                <div key={m.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${!m.status || m.status === "new" ? "border-l-4 border-l-primary" : ""}`}>
                  <div className="p-5 flex items-start justify-between gap-3 cursor-pointer"
                    onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-gray-800">{m.name}</p>
                        {isSubscription && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Subscription</span>
                        )}
                        {m.status === "new" && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{m.email}</p>
                      {!isSubscription && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{m.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                        m.status === "replied" ? "bg-green-100 text-green-700" :
                        m.status === "read" ? "bg-gray-100 text-gray-600" :
                        "bg-blue-100 text-blue-700"
                      }`}>{m.status || "new"}</span>
                      <span className="text-gray-400">{expanded === m.id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {expanded === m.id && (
                    <div className="border-t px-5 pb-5 pt-4 bg-gray-50">
                      <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{m.message}</p>
                      <div className="flex gap-3 flex-wrap">
                        <a href={`mailto:${m.email}`}
                          className="text-sm bg-primary text-white px-4 py-2 rounded-full font-bold hover:opacity-90">
                          Reply via Email
                        </a>
                        <button onClick={() => updateMessage(m.id, "read")}
                          className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-50">
                          Mark Read
                        </button>
                        <button onClick={() => updateMessage(m.id, "replied")}
                          className="text-sm border border-green-300 text-green-700 px-4 py-2 rounded-full font-bold hover:bg-green-50">
                          Mark Replied
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-400">No messages found.</div>
            )}
          </div>
        )}
      </div>
    </AdminGate>
  )
}
