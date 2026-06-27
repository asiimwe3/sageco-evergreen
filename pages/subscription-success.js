import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"

const PLAN_NAMES = { basic: "Basic", pro: "Pro", premium: "Premium" }

export default function SubscriptionSuccess() {
  const router = useRouter()
  const { ref, plan, orderTrackingId } = router.query
  const [status, setStatus] = useState("verifying")
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!orderTrackingId || !ref) return
    const verify = async () => {
      try {
        const res = await fetch(`/api/subscriptions/confirm?ref=${ref}&orderTrackingId=${orderTrackingId}&plan=${plan || "basic"}`)
        const data = await res.json()
        if (data.status === "active") {
          setStatus("success")
        } else if (attempts < 5) {
          setAttempts(a => a + 1)
          setTimeout(verify, 3000)
        } else {
          setStatus("pending")
        }
      } catch {
        setStatus("pending")
      }
    }
    verify()
  }, [orderTrackingId, ref])

  const planName = PLAN_NAMES[plan] || "Subscription"

  return (
    <>
      <Head><title>Subscription {status === "success" ? "Activated" : "Processing"} | SAGECO EVERGREEN</title></Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h1>
              <p className="text-gray-500">Please wait while we confirm your subscription.</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-primary mb-2">{planName} Plan Activated!</h1>
              <p className="text-gray-500 mb-2">Your subscription is now active for 30 days.</p>
              <p className="text-gray-400 text-sm mb-6">Ref: {ref}</p>
              <div className="space-y-3">
                <Link href="/broker-register" className="block bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">
                  Set Up Your Broker Profile
                </Link>
                <Link href="/properties" className="block border border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">
                  Browse Properties
                </Link>
              </div>
            </>
          )}
          {status === "pending" && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Being Processed</h1>
              <p className="text-gray-500 mb-2">Your payment is being confirmed. We'll activate your plan shortly.</p>
              <p className="text-gray-400 text-sm mb-6">Ref: {ref}</p>
              <p className="text-sm text-gray-500 mb-4">Contact us at <span className="font-bold text-primary">sagecoevergreen@gmail.com</span> if not activated within 24 hours.</p>
              <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
