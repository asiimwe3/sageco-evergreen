import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import { useState } from 'react'

const sampleProperties = [
  { id: 1, title: 'Modern Villa - Kololo', price: '$250,000', type: 'For Sale', beds: 4, baths: 3, area: 3200, city: 'Kampala', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400' },
  { id: 2, title: 'Commercial Office - CBD', price: '$5,000/mo', type: 'For Rent', beds: 0, baths: 2, area: 1800, city: 'Kampala', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' },
  { id: 3, title: 'Family Home - Ntinda', price: '$120,000', type: 'For Sale', beds: 3, baths: 2, area: 2100, city: 'Kampala', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400' },
]

export default function Properties() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? sampleProperties : sampleProperties.filter(p => p.type === filter)

  return (
    <>
      <Head><title>Properties - SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Properties</h1>
        <p className="text-gray-500 mb-8">Browse our premium listings</p>
        <div className="flex gap-3 mb-8">
          {['All','For Sale','For Rent'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${filter===f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs bg-secondary text-dark font-bold px-2 py-1 rounded">{p.type}</span>
                <h3 className="text-lg font-bold text-primary mt-2">{p.title}</h3>
                <p className="text-2xl font-bold text-secondary mt-1">{p.price}</p>
                <div className="flex gap-4 text-gray-500 text-sm mt-3">
                  {p.beds > 0 && <span>🛏 {p.beds} beds</span>}
                  <span>🚿 {p.baths} baths</span>
                  <span>📐 {p.area} sqft</span>
                </div>
                <a href={`/book?property=${p.id}`} className="mt-4 block bg-primary text-white text-center py-2 rounded-lg hover:opacity-90">Book Viewing</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
