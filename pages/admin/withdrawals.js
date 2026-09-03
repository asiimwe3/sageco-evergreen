import { useState, useEffect } from 'react'
import { useAppMode } from "../../hooks/useAppMode"
import Navbar from "../../components/Navbar"
import Footer from '../../components/Footer'

export default function AdminWithdrawals() {
  const appMode = useAppMode()
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('pending')
  const [note, setNote] = useState('')

  const loadWithdrawals = async (status) => {
    setLoading(true)
    try {
      const url = `/api/admin/withdrawals${status ? `?status=${status}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setWithdrawals(data.withdrawals || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadWithdrawals(filter) }, [filter])

  const handleAction = async (id, action) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawal_id: id, action, admin_note: note, processed_by: 'admin' })
      })
      const data = await res.json()
      if (data.success) loadWithdrawals(filter)
      setNote('')
    } catch {}
    setLoading(false)
  }

  const formatUGX = (n) => 'UGX ' + (Number(n) || 0).toLocaleString()

  return (
    <>
      {!appMode && <Navbar />}
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-green-800">Withdrawal Management</h1>
          <p className="text-gray-500 mb-6 text-sm">Approve or reject agent withdrawal requests</p>

          <div className="flex gap-2 mb-6">
            {['pending', 'approved', 'rejected', 'all'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === s ? 'bg-green-700 text-white' : 'bg-white border'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && withdrawals.length === 0 && (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No withdrawals found.</div>
          )}

          {withdrawals.length > 0 && (
            <div className="space-y-4">
              {withdrawals.map((w) => (
                <div key={w.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <p className="font-bold text-lg text-green-800">{formatUGX(w.amount)}</p>
                      <p className="text-sm text-gray-600">{w.agent_name} · {w.agent_phone}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {w.method === 'mobile_money' ? 'Mobile Money' : w.method === 'bank_transfer' ? 'Bank Transfer' : 'Cash Pickup'}
                        {w.phone_number ? ' · ' + w.phone_number : ''}
                        {w.account_name ? ' · ' + w.account_name : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Ref: {w.reference} · {new Date(w.created_at).toLocaleString()}</p>
                      {w.admin_note && <p className="text-xs text-orange-600 mt-1">Admin note: {w.admin_note}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${w.status === 'approved' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {w.status.toUpperCase()}
                      </span>
                      {w.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(w.id, 'approve')} disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50">Approve</button>
                          <button onClick={() => handleAction(w.id, 'reject')} disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {!appMode && <Footer />}
    </>
  )
}
