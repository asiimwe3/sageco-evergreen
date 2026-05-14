import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Careers() {
  return (
    <>
      <Head>
        <title>Careers at SAGECO EVERGREEN | Real Estate Jobs Uganda</title>
        <meta name="description" content="Join the SAGECO EVERGREEN team. Explore career opportunities in real estate, sales, and technology in Uganda." />
        <link rel="canonical" href={`${SITE_URL}/careers`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/careers`} />
        <meta property="og:title" content="Careers at SAGECO EVERGREEN | Real Estate Jobs Uganda" />
        <meta property="og:description" content="Join the SAGECO EVERGREEN team. Explore career opportunities in real estate in Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Careers</h1>
        <p className="text-green-100">Join the SAGECO EVERGREEN team</p>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-primary mb-2">No Open Positions Right Now</h2>
          <p className="text-gray-600 mb-4">Send your CV to <a href="mailto:careers@sagecoevergreen.com" className="text-primary hover:underline">careers@sagecoevergreen.com</a> and we will get in touch.</p>
          <a href="mailto:careers@sagecoevergreen.com" className="inline-block bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">Send Your CV</a>
        </div>
      </div>
      <Footer />
    </>
  )
}
