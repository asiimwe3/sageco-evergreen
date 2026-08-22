import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import SEO from '../components/SEO'

export default function BrokerPaymentSuccess() {
  const router = useRouter()
  const { broker_id, type } = router.query
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!broker_id || !type) return
    async function updateBroker() {
      try {
        const res = await fetch("/api/confirm-broker-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ broker_id, type })
        })
        if (res.ok) setDone(true)
        else setError(true)
      } catch {
        setError(true)
      }
    }
    updateBroker()
  }, [broker_id, type])

  return (
    <>
      <SEO
        title="Broker Payment Success"
        description="Your broker registration payment was successful. Welcome to SAGECO EVERGREEN."
        keywords="broker payment success SAGECO"
        path="/broker-payment-success"
        noindex
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-md">
          <div className="text-6xl mb-4">{done ? "🎉" : error ? "❌" : "⏳"}</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            {done ? "Payment Successful!" : error ? "Something went wrong" : "Processing..."}
          </h1>
          {done && (
            <>
              <p className="text-gray-500 mb-2">
                {type === "activation"
                  ? "Your broker dashboard is now active! You are listed on the brokers page with full dashboard access."
                  : "You are now registered as a SAGECO EVERGREEN broker and listed on our brokers page."}
              </p>
              <a href="/brokers" className="mt-4 inline-block bg-primary text-white px-8 py-3 rounded-full font-bold">View Brokers Page</a>
            </>
          )}
          {error && <p className="text-gray-500">Please contact <a href="mailto:info@sagecoevergreen.com" className="text-primary hover:underline">info@sagecoevergreen.com</a> for assistance.</p>}
        </div>
      </div>
    </>
  )
}
