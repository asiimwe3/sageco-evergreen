import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

export default function BrokerPaymentSuccess() {
  const router = useRouter()
  const { broker_id, type } = router.query
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!broker_id || !type) return
    async function updateBroker() {
      const updates = type === 'activation'
        ? { registration_status: 'active', activation_paid: true, registration_paid: true }
        : { registration_status: 'registered', registration_paid: true }
      await supabase.from('brokers').update(updates).eq('id', broker_id)
      setDone(true)
    }
    updateBroker()
  }, [broker_id, type])

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-md">
          <div className="text-6xl mb-4">{done ? '🎉' : '⏳'}</div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {done ? 'Payment Successful!' : 'Processing...'}
          </h2>
          {done && (
            <>
              <p className="text-gray-500 mb-2">
                {type === 'activation'
                  ? 'Your broker dashboard is now active! You are listed on the brokers page with full dashboard access.'
                  : 'You are now registered as a SAGECO EVERGREEN broker and listed on our brokers page.'}
              </p>
              <a href="/brokers" className="mt-4 inline-block bg-primary text-white px-8 py-3 rounded-full font-bold">View Brokers Page</a>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
