import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Careers() {
  return (
    <>
      <Head><title>Careers - SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Careers</h1>
        <p className="text-gray-500 mb-8">Join the SAGECO EVERGREEN team</p>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">💼</div>
          <h2 className="text-2xl font-bold text-primary mb-2">No Open Positions Right Now</h2>
          <p className="text-gray-600">Send your CV to careers@sagecoevergreen.com and we will get in touch.</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
