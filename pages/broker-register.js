import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function BrokerRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', location: '', specialization: '', bio: ''
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [brokerId, setBrokerId] = useState(null)
  const [paymentType, setPaymentType] = useState('registration')
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

    // Use server-side API route to bypass RLS
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

  async function initiatePayment(type) {
    setLoading(true)
    setPaymentType(type)
    const amount = type === 'registration' ? 32000 : 45000
    const description = type === 'registration' ? 'Broker Registration Fee' : 'Broker Dashboard Activation'

    const res = await fetch('/api/pesapal/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'UGX',
        description,
        email: form.email,
        phone: form.phone,
        first_name: form.full_name.split(' ')[0],
        last_name: form.full_name.split(' ').slice(1).join(' ') || 'N/A',
        reference: `BROKER-${type.toUpperCase()}-${brokerId?.slice(0,8) || Date.now()}`,
        callback_url: `${window.location.origin}/broker-payment-success?broker_id=${brokerId}&type=${type}`
      })
    })
    const data = await res.json()
    setLoading(false)
    if (data.redirect_url) {
      window.location.href = data.redirect_url
    } else {
      setError('Payment initiation failed. Please try again.')
    }
  }

  return (
    <>
      <Head><title>Broker Registration | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">Broker Registration</h1>
        <p className="text-green-100 mt-2">Join SAGECO EVERGREEN as a verified real estate broker</p>
      </section>

      <div className="max-w-xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Profile Details', 'Pay & Activate'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step > i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`font-medium text-sm ${step > i ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
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
                {loading ? 'Saving...' : 'Continue to Payment →'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Profile Saved!</h2>
            <p className="text-gray-500 mb-8">Choose a payment option to get started:</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

            <div className="space-y-4">
              <div className="border-2 border-primary rounded-xl p-6 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-primary">Broker Registration</h3>
                  <span className="text-2xl font-bold text-primary">UGX 32,000</span>
                </div>
                <ul className="text-gray-500 text-sm space-y-1 mb-4">
                  <li>✅ Listed on our Brokers page</li>
                  <li>✅ Verified broker badge</li>
                  <li>✅ Clients can find & contact you</li>
                </ul>
                <button onClick={() => initiatePayment('registration')} disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50">
                  {loading && paymentType === 'registration' ? 'Redirecting...' : 'Pay UGX 32,000 via PesaPal'}
                </button>
              </div>

              <div className="border-2 border-secondary rounded-xl p-6 text-left bg-yellow-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">Dashboard Activation</h3>
                  <span className="text-2xl font-bold">UGX 45,000</span>
                </div>
                <ul className="text-gray-500 text-sm space-y-1 mb-4">
                  <li>✅ Everything in Registration</li>
                  <li>✅ Personal broker dashboard</li>
                  <li>✅ Upload & manage your listings</li>
                  <li>✅ Priority placement in search</li>
                </ul>
                <button onClick={() => initiatePayment('activation')} disabled={loading}
                  className="w-full bg-secondary text-dark py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50">
                  {loading && paymentType === 'activation' ? 'Redirecting...' : 'Pay UGX 45,000 via PesaPal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="pb-16" />
      <Footer />
    </>
  )
}
