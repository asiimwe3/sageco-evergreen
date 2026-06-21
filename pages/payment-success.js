import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

const TYPE_LABELS = {
  viewing: "Property Viewing",
  consultation: "Consultation",
  site_visit: "Site Visit"
}

export default function PaymentSuccess() {
  const router = useRouter()
  const bookingType = router.query.type || "viewing"
  const typeLabel = TYPE_LABELS[bookingType] || "Booking"

  return (
    <>
      <Head>
        <title>Payment Successful | SAGECO EVERGREEN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">Your {typeLabel.toLowerCase()} has been booked successfully.</p>
        {router.query.order && <p className="text-gray-400 text-sm mb-4">Order ID: {router.query.order}</p>}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
          <p className="font-semibold text-primary mb-2">📋 What happens next?</p>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Our team will review your booking within 24 hours</li>
            <li>We'll contact you to confirm the exact time and location</li>
            <li>You'll receive updates via email{router.query.broker_id ? " and WhatsApp" : ""}</li>
            <li>Bring a valid ID to the viewing/visit</li>
          </ol>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">Browse More Properties</Link>
          <a href={`https://wa.me/256700000000?text=Hello%20SAGECO%2C%20I%20just%20completed%20a%20${typeLabel}%20booking%20(Ref%3A%20${router.query.order || ""})`}
            target="_blank" rel="noopener"
            className="border-2 border-green-500 text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-500 hover:text-white transition">
            💬 WhatsApp Us
          </a>
          <Link href="/" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Go Home</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
