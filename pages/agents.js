import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppMode } from "../hooks/useAppMode"
import Navbar from "../components/Navbar"
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

export default function AgentsPage() {
  const appMode = useAppMode()
  const [view, setView] = useState('landing')
  const [agentId, setAgentId] = useState('')
  const [agentData, setAgentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', location: '', bio: '', sponsor_id: '' })
  const [regResult, setRegResult] = useState(null)
  const [groupForm, setGroupForm] = useState({ name: '', description: '' })
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', method: 'mobile_money', phone_number: '', account_name: '' })
  const [withdrawResult, setWithdrawResult] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [withdrawBalance, setWithdrawBalance] = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('agent_id')
    if (saved) { setAgentId(saved); loadDashboard(saved) }
  }, [])

  const loadDashboard = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/agents/dashboard?agent_id=${id}`)
      const data = await res.json()
      if (res.ok) { setAgentData(data); setView('dashboard'); localStorage.setItem('agent_id', id); loadWithdrawals(id) }
      else { setRegResult({ error: data.error }) }
    } catch { setRegResult({ error: 'Connection error' }) }
    setLoading(false)
  }

  const loadWithdrawals = async (id) => {
    try {
      const res = await fetch(`/api/agents/withdraw?agent_id=${id}`)
      const data = await res.json()
      if (res.ok) { setWithdrawals(data.withdrawals || []); setWithdrawBalance(data.balance || null) }
    } catch {}
  }

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true); setRegResult(null)
    try {
      const res = await fetch('/api/agents/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json(); setRegResult(data)
      if (data.success && data.agent) { setAgentId(data.agent.id); localStorage.setItem('agent_id', data.agent.id); setTimeout(() => loadDashboard(data.agent.id), 1500) }
    } catch { setRegResult({ error: 'Connection error' }) }
    setLoading(false)
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch('/api/agents/create-group', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent_id: agentId, ...groupForm }) })
      const data = await res.json()
      if (data.success) { loadDashboard(agentId); setGroupForm({ name: '', description: '' }) }
    } catch {}
    setLoading(false)
  }

  const handleWithdraw = async (e) => {
    e.preventDefault(); setLoading(true); setWithdrawResult(null)
    try {
      const res = await fetch('/api/agents/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent_id: agentId, ...withdrawForm, amount: parseFloat(withdrawForm.amount) }) })
      const data = await res.json(); setWithdrawResult(data)
      if (data.success) { setWithdrawForm({ amount: '', method: 'mobile_money', phone_number: '', account_name: '' }); loadWithdrawals(agentId); loadDashboard(agentId) }
    } catch { setWithdrawResult({ error: 'Connection error' }) }
    setLoading(false)
  }

  const formatUGX = (n) => 'UGX ' + (Number(n) || 0).toLocaleString()

  // LANDING VIEW
  if (view === 'landing') {
    return (
      <>
        <SEO title="Become a Real Estate Agent in Uganda" description="Join SAGECO EVERGREEN as a real estate agent. Register, create groups, earn commissions, and access powerful broker tools." keywords="real estate agent Uganda, become broker Uganda, property agent registration, SAGECO agents" path="/agents" />
        {!appMode && <Navbar />}
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
          <section className="bg-green-700 text-white py-20 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a SAGECO Agent</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">Build your own broker network. Manage groups. Earn commissions on every recruit.</p>
            <p className="mt-4 text-2xl font-bold bg-green-600 inline-block px-6 py-2 rounded-full">Registration: UGX 30,000</p>
          </section>
          <section className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-green-800">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-5xl mb-4">1️⃣</div><h3 className="font-bold text-lg mb-2">Register as Agent</h3><p className="text-gray-600 text-sm">Pay UGX 30,000 registration fee and activate your agent account.</p></div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-5xl mb-4">2️⃣</div><h3 className="font-bold text-lg mb-2">Create Your Group</h3><p className="text-gray-600 text-sm">Start your own broker group. Recruit brokers and manage them.</p></div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center"><div className="text-5xl mb-4">3️⃣</div><h3 className="font-bold text-lg mb-2">Earn & Withdraw</h3><p className="text-gray-600 text-sm">Earn commissions and withdraw to mobile money anytime.</p></div>
            </div>
            <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-yellow-800">MLM Commission Structure</h3>
              <div className="space-y-2 text-sm">
                <p>✅ <b>Level 1 (Direct recruit):</b> UGX 5,000 per agent registration</p>
                <p>✅ <b>Level 1 (Group bookings):</b> 10% of booking fee per confirmed viewing</p>
                <p>✅ <b>Level 2 (Indirect recruit):</b> UGX 2,000 per agent registration</p>
                <p>✅ <b>Withdrawals:</b> Cash out to Mobile Money (MTN/Airtel) — minimum UGX 1,000</p>
                <p>✅ <b>Group Management:</b> Track all members, view earnings, manage activity</p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <button onClick={() => setView('register')} className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-full font-bold text-lg transition shadow-lg">Register as Agent →</button>
              <p className="mt-3 text-sm text-gray-500">Already an agent? <button onClick={() => { const id = prompt('Enter your Agent ID:'); if (id) loadDashboard(id) }} className="text-green-700 font-bold underline">Go to Dashboard</button></p>
            </div>
          </section>
        </div>
        {!appMode && <Footer />}
      </>
    )
  }

  // REGISTER VIEW
  if (view === 'register') {
    return (
      <>
        {!appMode && <Navbar />}
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold mb-2 text-green-800">Agent Registration</h1>
            <p className="text-gray-500 mb-6 text-sm">Registration fee: UGX 30,000 (pay via PesaPal after submission)</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Full Name *</label><input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              <div><label className="block text-sm font-medium mb-1">Phone *</label><input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="07XX XXX XXX" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Kyenjojo" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              <div><label className="block text-sm font-medium mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell us about yourself..." rows={3} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              <div><label className="block text-sm font-medium mb-1">Sponsor Agent ID (optional)</label><input value={form.sponsor_id} onChange={e => setForm({...form, sponsor_id: e.target.value})} placeholder="ID of agent who referred you" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" /></div>
              {regResult?.error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{regResult.error}</div>}
              {regResult?.success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">{regResult.message}{regResult.agent && <p className="mt-1 text-xs">Your Agent ID: {regResult.agent.id}</p>}</div>}
              <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition">{loading ? 'Registering...' : 'Register as Agent'}</button>
              <button type="button" onClick={() => setView('landing')} className="w-full text-gray-500 font-bold py-2 text-sm">← Back</button>
            </form>
          </div>
        </div>
        {!appMode && <Footer />}
      </>
    )
  }

  // DASHBOARD VIEW
  if (view === 'dashboard' && agentData) {
    const { agent, sponsor, group, downline, commissions, stats } = agentData
    const availableBalance = withdrawBalance?.available_balance ?? 0
    const totalWithdrawn = withdrawBalance?.total_withdrawn ?? 0
    const pendingWithdrawal = withdrawBalance?.pending_withdrawal ?? 0

    return (
      <>
        {!appMode && <Navbar />}
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-green-700 text-white rounded-xl p-6 mb-6">
              <h1 className="text-2xl font-bold">Agent Dashboard</h1>
              <p className="text-green-100">{agent.full_name} | Level {agent.level || 1} | {agent.registration_status?.toUpperCase()}</p>
              <p className="text-xs text-green-200 mt-1">Agent ID: {agent.id}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4"><p className="text-3xl font-bold text-green-700">{stats?.direct_downline || 0}</p><p className="text-sm text-gray-500">Direct Recruits</p></div>
              <div className="bg-white rounded-xl shadow p-4"><p className="text-3xl font-bold text-green-700">{stats?.total_downline || 0}</p><p className="text-sm text-gray-500">Total Downline</p></div>
              <div className="bg-white rounded-xl shadow p-4"><p className="text-3xl font-bold text-yellow-600">{formatUGX(stats?.pending_commissions || 0)}</p><p className="text-sm text-gray-500">Pending</p></div>
              <div className="bg-white rounded-xl shadow p-4"><p className="text-3xl font-bold text-green-600">{formatUGX(stats?.paid_commissions || 0)}</p><p className="text-sm text-gray-500">Paid Out</p></div>
            </div>

            {/* Wallet / Withdrawal Section */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold mb-1">My Wallet</h2>
                  <p className="text-3xl font-bold">{formatUGX(availableBalance)}</p>
                  <p className="text-green-200 text-sm mt-1">Available Balance</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-green-100">Withdrawn: {formatUGX(totalWithdrawn)}</span>
                    <span className="text-green-100">Pending: {formatUGX(pendingWithdrawal)}</span>
                  </div>
                </div>
                <button onClick={() => setShowWithdraw(!showWithdraw)} disabled={availableBalance <= 0} className="bg-white text-green-700 font-bold px-6 py-3 rounded-lg shadow hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition">{showWithdraw ? 'Cancel' : 'Withdraw Funds →'}</button>
              </div>
            </div>

            {/* Withdrawal Form */}
            {showWithdraw && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-green-200">
                <h3 className="font-bold text-lg mb-4 text-green-800">Request Withdrawal</h3>
                <form onSubmit={handleWithdraw} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (UGX) *</label>
                    <input type="number" required min="1000" max={availableBalance} value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} placeholder={`Min UGX 1,000 — Max ${formatUGX(availableBalance)}`} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
                    <select value={withdrawForm.method} onChange={e => setWithdrawForm({...withdrawForm, method: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500">
                      <option value="mobile_money">Mobile Money (MTN/Airtel)</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash_pickup">Cash Pickup (Office)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{withdrawForm.method === 'bank_transfer' ? 'Account Number' : 'Phone Number'}</label>
                    <input value={withdrawForm.phone_number} onChange={e => setWithdrawForm({...withdrawForm, phone_number: e.target.value})} placeholder={withdrawForm.method === 'bank_transfer' ? 'Bank account number' : '07XX XXX XXX'} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" />
                  </div>
                  {withdrawForm.method === 'bank_transfer' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Account Name *</label>
                      <input value={withdrawForm.account_name} onChange={e => setWithdrawForm({...withdrawForm, account_name: e.target.value})} placeholder="Bank account holder name" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-500" />
                    </div>
                  )}
                  {withdrawResult?.error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{withdrawResult.error}</div>}
                  {withdrawResult?.success && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">{withdrawResult.message}{withdrawResult.reference && <p className="mt-1 font-mono text-xs">Ref: {withdrawResult.reference}</p>}</div>}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">Your request will be reviewed by admin. Funds will be sent within 24-48 hours after approval.</div>
                  <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition">{loading ? 'Submitting...' : 'Submit Withdrawal Request'}</button>
                </form>
              </div>
            )}

            {/* Withdrawal History */}
            {withdrawals.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="font-bold text-lg mb-3 text-green-800">Withdrawal History</h2>
                <div className="space-y-2">
                  {withdrawals.map((w, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 text-sm">
                      <div>
                        <p className="font-medium">{formatUGX(w.amount)}</p>
                        <p className="text-xs text-gray-500">{w.method === 'mobile_money' ? 'Mobile Money' : w.method === 'bank_transfer' ? 'Bank Transfer' : 'Cash Pickup'}{w.phone_number ? ' · ' + w.phone_number : ''}</p>
                        <p className="text-xs text-gray-400">{new Date(w.created_at).toLocaleDateString()}{w.reference && ' · Ref: ' + w.reference}</p>
                        {w.admin_note && <p className="text-xs text-orange-600 mt-1">Note: {w.admin_note}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${w.status === 'approved' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{w.status.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-bold text-lg mb-3 text-green-800">My Group</h2>
                {group ? (
                  <div>
                    <p className="font-bold">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.description || 'No description'}</p>
                    <p className="text-sm mt-2">Members: <b>{group.member_count}</b></p>
                    <Link href={`/api/agents/group-members?group_id=${group.id}`} className="text-green-700 text-sm font-bold underline mt-2 inline-block">View Members</Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 text-sm mb-3">You don't have a group yet. Create one to start recruiting brokers.</p>
                    <form onSubmit={handleCreateGroup} className="space-y-3">
                      <input required placeholder="Group name" value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                      <textarea placeholder="Description (optional)" value={groupForm.description} onChange={e => setGroupForm({...groupForm, description: e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500" />
                      <button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">Create Group</button>
                    </form>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-bold text-lg mb-3 text-green-800">My Upline</h2>
                {sponsor ? (<div><p className="font-bold">{sponsor.full_name}</p><p className="text-sm text-gray-500">Level {sponsor.level} | {sponsor.phone}</p></div>) : <p className="text-gray-500 text-sm">No sponsor — you registered directly.</p>}
                <h3 className="font-bold text-sm mt-4 mb-2 text-green-800">Your Referral Link</h3>
                <div className="bg-gray-100 rounded-lg p-2 text-xs break-all">{SITE_URL}/agents?sponsor={agent.id}</div>
                <button onClick={() => navigator.clipboard.writeText(`${SITE_URL}/agents?sponsor=${agent.id}`)} className="text-green-700 text-xs font-bold mt-1 underline">Copy link</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h2 className="font-bold text-lg mb-3 text-green-800">My Downline ({downline?.length || 0})</h2>
              {downline && downline.length > 0 ? (
                <div className="space-y-3">
                  {downline.map((d, i) => (
                    <div key={i} className="border rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{d.full_name}</p>
                        <p className="text-xs text-gray-500">{d.phone} | {d.location || 'N/A'}</p>
                        <p className="text-xs">Status: {d.registration_status} | Level: {d.level} | Recruits: {d.downline_count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No downline yet. Share your referral link to recruit agents.</p>}
            </div>

            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h2 className="font-bold text-lg mb-3 text-green-800">Commission History</h2>
              {commissions && commissions.length > 0 ? (
                <div className="space-y-2">
                  {commissions.map((c, i) => (
                    <div key={i} className="flex justify-between border-b pb-2 text-sm">
                      <div><p className="font-medium">{c.source_type} | Level {c.level}</p><p className="text-xs text-gray-500">{c.description || ''}</p></div>
                      <div className="text-right"><p className="font-bold text-green-700">{formatUGX(c.amount)}</p><p className="text-xs text-gray-500">{c.status}</p></div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No commissions yet. Recruit agents to start earning.</p>}
            </div>

            <div className="text-center mt-6 mb-10">
              <button onClick={() => { localStorage.removeItem('agent_id'); setAgentData(null); setView('landing') }} className="text-red-600 text-sm font-bold underline">Logout</button>
            </div>
          </div>
        </div>
        {!appMode && <Footer />}
      </>
    )
  }

  return null
}
