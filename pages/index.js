import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN | Premium Real Estate Uganda</title>
        <meta name="description" content="Find your dream property in Uganda. SAGECO EVERGREEN connects you with premium homes, commercial spaces, and land." />
      </Head>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-green-800 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">Premium real estate in Uganda — homes, commercial spaces, and land with a green future in mind.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/properties" className="bg-secondary text-dark font-bold px-8 py-3 rounded-full hover:opacity-90 text-lg">Browse Properties</Link>
          <Link href="/book" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary text-lg">Book a Viewing</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['500+','Properties Listed'],['200+','Happy Clients'],['15+','Expert Brokers'],['10+','Years Experience']].map(([n,l]) => (
            <div key={l} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary">{n}</div>
              <div className="text-gray-500 text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-2">What We Offer</h2>
        <p className="text-gray-500 text-center mb-10">Everything you need in one place</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🏡', title: 'Residential', desc: 'Villas, apartments, and family homes across Uganda\'s finest neighborhoods.' },
            { icon: '🏢', title: 'Commercial', desc: 'Office spaces, retail units, and warehouses for your business needs.' },
            { icon: '🌿', title: 'Green Projects', desc: 'Eco-friendly developments that protect Uganda\'s natural environment.' },
          ].map(s => (
            <div key={s.title} className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{s.title}</h3>
              <p className="text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Property?</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">Browse our listings and book a viewing today. Secure payment via PesaPal.</p>
        <Link href="/properties" className="bg-secondary text-dark font-bold px-10 py-4 rounded-full text-lg hover:opacity-90">View All Properties</Link>
      </section>

      <Footer />
    </>
  )
}
