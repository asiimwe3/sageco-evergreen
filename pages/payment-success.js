import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

export default function PaymentSuccess() {
  const router = useRouter()
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
        <p className="text-gray-600 mb-2">Your viewing has been booked successfully.</p>
        {router.query.order && <p className="text-gray-400 text-sm mb-8">Order ID: {router.query.order}</p>}
        <p className="text-gray-500 text-sm mb-8">Our team will contact you shortly to confirm the details.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">Browse More Properties</Link>
          <Link href="/" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Go Home</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
