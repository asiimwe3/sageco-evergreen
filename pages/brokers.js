import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

const brokers = [
  { name: 'Sarah Nakato', spec: 'Residential', exp: 8, phone: '+256 700 111 111', rating: 4.9 },
  { name: 'James Otieno', spec: 'Commercial', exp: 12, phone: '+256 700 222 222', rating: 4.8 },
  { name: 'Grace Namutebi', spec: 'Land & Agricultural', exp: 6, phone: '+256 700 333 333', rating: 4.7 },
]

export default function Brokers() {
  return (
    <>
      <Head><title>Brokers - SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Our Brokers</h1>
        <p className="text-gray-500 mb-8">Licensed professionals ready to help you</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brokers.map((b, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="w-20 h-20 bg-primary text-white text-3xl rounded-full flex items-center justify-center mx-auto mb-4">
                {b.name[0]}
              </div>
              <h3 className="text-xl font-bold text-primary">{b.name}</h3>
              <p className="text-secondary font-medium">{b.spec}</p>
              <p className="text-gray-500 text-sm mt-1">{b.exp} years experience</p>
              <p className="text-yellow-500 mt-1">{'★'.repeat(Math.round(b.rating))} {b.rating}</p>
              <a href={`tel:${b.phone}`} className="mt-4 block bg-primary text-white py-2 rounded-lg hover:opacity-90">{b.phone}</a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
