import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10000,
    period: 'month',
    color: 'border-gray-300',
    btnClass: 'bg-gray-700 text-white',
    features: ['Listed on Brokers page', 'Verified broker badge', 'Clients can contact you', 'Up to 5 property listings'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20000,
    period: 'month',
    color: 'border-primary',
    btnClass: 'bg-primary text-white',
    badge: '⭐ Popular',
    features: ['Everything in Basic', 'Up to 20 listings', 'Priority placement in search', 'Listing analytics'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 30000,
    period: 'month',
    color: 'border-yellow-400',
    btnClass: 'bg-yellow-500 text-white',
    badge: '👑 Best Value',
    features: ['Everything in Pro', 'Unlimited listings', 'Featured on homepage', 'Bulk property uploads', 'Dedicated support'],
  },
]

export default function BrokerRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', location: '', specialization: '', bio: ''
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [brokerId, setBrokerId] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmitProfile(e) {
    e.preventDefault()
    setError('')
    if (!form.full_name || !form.email || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)

    let photo_url = null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const fileName = `broker-${Date.now()}.${ext}`
      const { data } = await supabase.storage.from('broker-photos').upload(fileName, photoFile, { upsert: true })
      if (data) {
        const { data: urlData } = supabase.storage.from('broker-photos').getPublicUrl(fileName)
        photo_url = urlData.publicUrl
      }
    }

    const res = await fetch('/api/register-broker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photo_url })
    })
    const result = await res.json()

    if (!res.ok || result.error) {
      setError('Failed to register: ' + (result.error || 'Unknown error'))
      setLoading(false)
      return
    }

    setBrokerId(result.broker.id)
    setLoading(false)
    setStep(2)
  }

  async function handleRegistrationPayment() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/pesapal/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 20000,
        currency: 'UGX',
        description: 'Broker Account Registration',
        email: form.email,
        phone: form.phone,
        first_name: form.full_name.split(' ')[0],
        last_name: form.full_name.split(' ').slice(1).join(' ') || 'N/A',
        reference: `BROKER-REG-${brokerId?.slice(0,8) || Date.now()}`,
        callback_url: `${window.location.origin}/broker-payment-success?broker_id=${brokerId}&type=registration`
      })
    })
    const data = await res.json()
    setLoading(false)
    if (data.redirect_url) {
      window.location.href = data.redirect_url
    } else {
      setError('Payment failed: ' + (data.error || 'Please try again'))
    }
  }

  async function handlePlanPayment(plan) {
    setLoading(true)
    setSelectedPlan(plan.id)
    setError('')
    const res = await fetch('/api/pesapal/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: plan.price,
        currency: 'UGX',
        description: `Broker Dashboard - ${plan.name} Plan (Monthly)`,
        email: form.email,
        phone: form.phone,
        first_name: form.full_name.split(' ')[0],
        last_name: form.full_name.split(' ').slice(1).join(' ') || 'N/A',
        reference: `BROKER-PLAN-${plan.id.toUpperCase()}-${brokerId?.slice(0,8) || Date.now()}`,
        callback_url: `${window.location.origin}/broker-payment-success?broker_id=${brokerId}&type=activation&plan=${plan.id}`
      })
    })
    const data = await res.json()
    setLoading(false)
    if (data.redirect_url) {
      window.location.href = data.redirect_url
    } else {
      setError('Payment failed: ' + (data.error || 'Please try again'))
    }
  }

  const steps = ['Profile', 'Account Open', 'Dashboard Plan']

  return (
    <>
      <Head><title>Broker Registration | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">Broker Registration</h1>
        <p className="text-green-100 mt-2">Join SAGECO EVERGREEN as a verified real estate broker</p>
      </section>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`font-medium text-xs hidden sm:block ${step > i ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-6 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* STEP 1 - Profile */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+256 700 000000"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Kampala"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Specialization</label>
                  <select name="specialization" value={form.specialization} onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                    <option value="">Select...</option>
                    {['Residential','Commercial','Land','Rentals','All Properties'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Profile Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])}
                  className="w-full border rounded-lg px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Short Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  placeholder="Tell clients about yourself..."
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Profile →'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 - Account Registration Payment */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Open Your Broker Account</h2>
            <p className="text-gray-500 mb-6">Pay a one-time registration fee to activate your broker profile on SAGECO EVERGREEN.</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

            <div className="border-2 border-primary rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-xl text-primary">Account Registration</h3>
                <span className="text-3xl font-bold text-primary">UGX 20,000</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">One-time fee — never charged again</p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>✅ Verified broker profile created</li>
                <li>✅ Listed on the SAGECO brokers directory</li>
                <li>✅ Clients can find and contact you</li>
                <li>✅ Access to choose a dashboard plan</li>
              </ul>
            </div>

            <button onClick={handleRegistrationPayment} disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50 mb-4">
              {loading ? 'Redirecting to PesaPal...' : 'Pay UGX 20,000 & Open Account'}
            </button>

            <button onClick={() => setStep(3)}
              className="w-full border border-gray-300 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 text-sm">
              Skip for now — choose a plan first
            </button>
          </div>
        )}

        {/* STEP 3 - Dashboard Subscription Plans */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-primary mb-2">Choose Your Dashboard Plan</h2>
              <p className="text-gray-500">Monthly subscription — cancel anytime. Manage your listings & grow your business.</p>
            </div>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <div key={plan.id} className={`bg-white rounded-2xl shadow-md border-2 ${plan.color} p-6 relative`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-1">UGX {plan.price.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm mb-4">per month</div>
                  <ul className="text-gray-600 text-sm space-y-2 mb-6">
                    {plan.features.map(f => <li key={f}>✅ {f}</li>)}
                  </ul>
                  <button
                    onClick={() => handlePlanPayment(plan)}
                    disabled={loading}
                    className={`w-full py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50 ${plan.btnClass}`}>
                    {loading && selectedPlan === plan.id ? 'Redirecting...' : `Choose ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="pb-16" />
      <Footer />
    </>
  )
}
