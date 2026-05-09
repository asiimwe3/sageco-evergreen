import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Contact() {
  return (
    <>
      <Head><title>Contact - SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">Get in touch with our team</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div><span className="text-2xl">📧</span><p className="font-bold mt-1">Email</p><p className="text-gray-600">info@sagecoevergreen.com</p></div>
            <div><span className="text-2xl">📞</span><p className="font-bold mt-1">Phone</p><p className="text-gray-600">+256 700 000 000</p></div>
            <div><span className="text-2xl">📍</span><p className="font-bold mt-1">Address</p><p className="text-gray-600">Kampala, Uganda</p></div>
          </div>
          <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <input placeholder="Your Name" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <textarea rows={4} placeholder="Message" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-bold">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
