import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Projects() {
  return (
    <>
      <Head><title>Green Projects - SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Environmental Projects</h1>
        <p className="text-gray-500 mb-8">Sustainability at the heart of what we do</p>
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
