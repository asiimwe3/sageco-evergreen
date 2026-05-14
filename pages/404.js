import Link from "next/link"
import Head from "next/head"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | SAGECO EVERGREEN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <div>
          <div className="text-7xl mb-6">🏡</div>
          <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            This page does not exist or may have been moved. Let us help you find your dream property.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Go Home</Link>
            <Link href="/properties" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Browse Properties</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
