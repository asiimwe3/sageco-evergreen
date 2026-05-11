import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Brokers() {
  const [brokers, setBrokers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrokers() {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .in('registration_status', ['registered', 'active'])
        .order('created_at', { ascending: false })
      if (!error) setBrokers(data || [])
      setLoading(false)
    }
    fetchBrokers()
  }, [])

  return (
    <>
      <Head><title>Brokers | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Brokers</h1>
        <p className="text-green-100">Connect with verified real estate professionals</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Register CTA */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-800">Are you a real estate agent?</p>
            <p className="text-gray-500 text-sm">Register as a SAGECO EVERGREEN broker — UGX 32,000 registration · UGX 45,000 dashboard activation</p>
          </div>
          <Link href="/broker-register" className="bg-secondary text-dark px-6 py-2 rounded-full font-bold hover:opacity-90">Register Now</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading brokers...</div>
        ) : brokers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👔</div>
            <p className="text-gray-500 text-lg">No registered brokers yet.</p>
            <Link href="/broker-register" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full font-bold">Be the first broker</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map(b => (
              <div key={b.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center">
                {b.photo_url ? (
                  <img src={b.photo_url} alt={b.full_name} className="w-24 h-24 rounded-full mx-auto object-cover mb-4" />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-green-100 flex items-center justify-center text-4xl mb-4">👤</div>
                )}
                <h3 className="text-xl font-bold text-gray-800">{b.full_name}</h3>
                <p className="text-primary text-sm font-medium mt-1">{b.specialization || 'Real Estate Agent'}</p>
                <p className="text-gray-400 text-sm mt-1">📍 {b.location}</p>
                {b.bio && <p className="text-gray-500 text-sm mt-3 line-clamp-2">{b.bio}</p>}
                <div className="mt-4 flex gap-2 justify-center">
                  {b.registration_status === 'active' && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">✅ Active</span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">📞 {b.phone}</span>
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
