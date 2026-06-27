import Head from "next/head"
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <Head><title>Page Not Found | SAGECO EVERGREEN</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="text-8xl mb-6">🏡</div>
        <h1 className="text-5xl font-bold text-primary mb-3">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Go Home</Link>
          <Link href="/properties" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Browse Properties</Link>
          <Link href="/contact" className="border-2 border-gray-300 text-gray-600 px-8 py-3 rounded-full font-bold hover:border-primary transition">Contact Us</Link>
        </div>
      </div>
    </>
  )
}
