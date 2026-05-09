import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'

export default function PaymentSuccess() {
  const router = useRouter()
  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">Your viewing has been booked successfully.</p>
        <p className="text-gray-500 text-sm mb-8">Order ID: {router.query.order}</p>
        <a href="/properties" className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90">Browse More Properties</a>
      </div>
      <Footer />
    </>
  )
}
