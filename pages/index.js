import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN - Premier Real Estate Platform</title>
        <meta name="description" content="Discover premium properties, connect with top brokers, and explore green environmental projects with SAGECO EVERGREEN." />
      </Head>
      <Navbar />
      {/* Hero */}
      <section className="bg-primary text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-lg text-gray-200 mb-8">Premium listings, trusted brokers, sustainable futures.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-6 py-3 rounded-lg hover:opacity-90">Browse Properties</Link>
          <Link href="/contact" className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary">Contact Us</Link>
        </div>
      </section>
      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { icon: '🏠', title: 'Premium Listings', desc: 'Residential, commercial & land properties across Uganda' },
          { icon: '🤝', title: 'Expert Brokers', desc: 'Connect with licensed and experienced real estate agents' },
          { icon: '🌿', title: 'Green Projects', desc: 'Environmental initiatives for a sustainable tomorrow' },
        ].map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-8 shadow-sm">
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-primary mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
      <Footer />
    </>
  )
}
