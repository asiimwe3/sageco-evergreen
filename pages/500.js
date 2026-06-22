import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"

export default function ServerError() {
  return (
    <>
      <Head><title>Server Error | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="text-7xl mb-6">⚠️</div>
        <h1 className="text-5xl font-bold text-primary mb-3">500</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
        <p className="text-gray-500 mb-8 max-w-md">Our server hit an unexpected error. Our team has been notified. Please try again in a moment.</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Go Home</Link>
          <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
            className="bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90">WhatsApp Support</a>
        </div>
      </div>
      <Footer />
    </>
  )
}
