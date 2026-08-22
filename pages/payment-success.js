import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import SEO from '../components/SEO'

const TYPE_LABELS = {
  viewing: "Property Viewing",
  consultation: "Consultation",
  site_visit: "Site Visit"
}

export default function PaymentSuccess() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState(null)

  const bookingType = router.query.type || "viewing"
  const typeLabel = TYPE_LABELS[bookingType] || "Booking"
  const ref = router.query.OrderMerchantReference || router.query.order || ""
  const trackingId = router.query.OrderTrackingId || ""

  useEffect(() => {
    if (!router.isReady) return
    if (trackingId) {
      // Verify with PesaPal
      fetch(`/api/pesapal/confirm?orderTrackingId=${trackingId}&orderMerchantReference=${ref}`)
        .then(r => r.json())
        .then(d => { setPaymentStatus(d.status); setVerifying(false) })
        .catch(() => { setPaymentStatus("Completed"); setVerifying(false) })
    } else {
      setVerifying(false)
      setPaymentStatus("Completed")
    }
  }, [router.isReady, trackingId, ref])

  if (verifying) return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    </>
  )

  const success = !paymentStatus || paymentStatus === "Completed" || paymentStatus === "COMPLETED"

  return (
    <>
      <SEO
        title="Payment Successful"
        description="Your payment was processed successfully via PesaPal. Thank you for using SAGECO EVERGREEN."
        keywords="payment success SAGECO"
        path="/payment-success"
        noindex
      />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">{success ? "✅" : "⏳"}</div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          {success ? "Payment Successful!" : "Payment Pending"}
        </h1>
        <p className="text-gray-600 mb-2">
          {success
            ? `Your ${typeLabel.toLowerCase()} has been confirmed.`
            : "Your payment is being processed. You'll receive a confirmation shortly."}
        </p>
        {ref && <p className="text-gray-400 text-sm mb-1">Reference: <span className="font-mono font-bold text-gray-600">{ref}</span></p>}
        {trackingId && <p className="text-gray-400 text-xs mb-4">Tracking ID: {trackingId}</p>}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-left">
            <p className="font-semibold text-primary mb-3">📋 What happens next?</p>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-green-600 font-bold">1.</span> Our team reviews your booking within 24 hours</li>
              <li className="flex gap-2"><span className="text-green-600 font-bold">2.</span> We'll call/WhatsApp you to confirm exact time & location</li>
              <li className="flex gap-2"><span className="text-green-600 font-bold">3.</span> You'll receive a booking confirmation on your email</li>
              <li className="flex gap-2"><span className="text-green-600 font-bold">4.</span> Bring a valid ID to the {typeLabel.toLowerCase()}</li>
            </ol>
          </div>
        )}

        {!success && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 text-left">
            <p className="font-semibold text-yellow-800 mb-2">⏳ Payment is being verified</p>
            <p className="text-sm text-yellow-700">If you completed the payment, it may take a few minutes to reflect. Your booking will be confirmed automatically once payment is verified. For immediate help, contact us on WhatsApp.</p>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/properties" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">Browse Properties</Link>
          <a href="https://wa.me/256750414366?text=Hello%20SAGECO%2C%20I%20just%20made%20a%20booking%20(Ref%3A%20${ref})"
            target="_blank" rel="noopener"
            className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
            💬 WhatsApp Us
          </a>
          <Link href="/" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Home</Link>
        </div>
      </div>
    </>
  )
}
