import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Projects() {
  return (
    <>
      <Head>
        <title>Green Environmental Projects | SAGECO EVERGREEN Uganda</title>
        <meta name="description" content="Discover SAGECO EVERGREEN green initiatives and eco-friendly real estate developments in Uganda. Sustainability at the heart of what we do." />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/projects`} />
        <meta property="og:title" content="Green Environmental Projects | SAGECO EVERGREEN Uganda" />
        <meta property="og:description" content="Discover SAGECO EVERGREEN eco-friendly real estate developments in Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Environmental Projects</h1>
        <p className="text-green-100">Sustainability at the heart of what we do</p>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-primary text-white rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-gray-200">Our green initiatives are being documented. Check back soon.</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
