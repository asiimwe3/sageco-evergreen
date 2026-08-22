import Head from "next/head"
import { useState, useEffect } from "react"
import Link from "next/link"

const ADMIN_SECRET = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_ADMIN_SECRET || "") : ""

export default function FraudDashboard() {
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  async function fetchFlags() {
    setLoading(true)
    const res = await fetch(`/api/fraud/list${filter ? `?severity=${filter}` : ''}`, {
      headers: { "x-admin-secret": ADMIN_SECRET }
    })
    const data = await res.json()
    setFlags(data.flags || [])
    setLoading(false)
  }

  useEffect(() => { fetchFlags() }, [filter])

  return (
    <>
      <Head><title>Fraud Detection Dashboard | SAGECO Admin</title></Head>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">🛡️ Fraud Detection Dashboard</h1>
            <Link href="/admin" className="text-green-700 hover:underline">← Admin Home</Link>
          </div>

          <div className="flex gap-2 mb-4">
            {[{label: "All", val: ""}, {label: "High", val: "high"}, {label: "Medium", val: "medium"}, {label: "Low", val: "low"}].map(f => (
              <button key={f.val} onClick={() => setFilter(f.val)}
                className={`px-4 py-2 rounded-lg font-bold ${filter === f.val ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading flags...</div>
          ) : flags.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">✅ No fraud flags detected</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Property</th>
                    <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Severity</th>
                    <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Description</th>
                    <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {flags.map((f, i) => (
                    <tr key={f.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{f.properties?.title || f.property_id?.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.flag_type?.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${f.severity === 'high' ? 'bg-red-200 text-red-800' : f.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                          {f.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.description}</td>
                      <td className="px-4 py-3 text-sm">
                        {f.resolved ? <span className="text-green-600">✓ Resolved</span> : <span className="text-orange-600">⚠ Open</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}