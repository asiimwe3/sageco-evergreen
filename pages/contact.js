import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus("sent")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      <Head>
        <title>Contact Us | SAGECO EVERGREEN</title>
        <meta name="description" content="Contact SAGECO EVERGREEN CO.LTD in Kyenjojo, Uganda. Call +256 750 414 366, email sagecoevergreen@gmail.com or visit us for real estate services." />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact Us | SAGECO EVERGREEN" />
        <meta property="og:description" content="Contact SAGECO EVERGREEN CO.LTD in Kyenjojo, Uganda for real estate services." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-green-100">Get in touch with our team</p>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <address className="bg-gray-50 rounded-xl p-6 space-y-5 not-italic">
            <div>
              <span className="text-2xl">📍</span>
              <p className="font-bold mt-1">Location</p>
              <p className="text-gray-600">Kyenjojo, Uganda</p>
              <a
                href="https://maps.google.com/?q=Kyenjojo,Uganda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >View on Google Maps →</a>
            </div>
            <div>
              <span className="text-2xl">📧</span>
              <p className="font-bold mt-1">Email</p>
              <a href="mailto:sagecoevergreen@gmail.com" className="text-gray-600 hover:text-primary">sagecoevergreen@gmail.com</a>
            </div>
            <div>
              <span className="text-2xl">📞</span>
              <p className="font-bold mt-1">Phone</p>
              <div className="flex items-center gap-3 mt-1">
                <a href="tel:+256750414366" className="text-gray-600 hover:text-primary">+256 750 414 366</a>
                <a href="https://wa.me/256750414366" target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full hover:bg-green-600">WhatsApp</a>
              </div>
              <a href="tel:+256782067425" className="block text-gray-600 hover:text-primary mt-1">+256 782 067 425</a>
              <div className="flex items-center gap-3 mt-1">
                <a href="tel:+256772002326" className="text-gray-600 hover:text-primary">+256 772 002 326</a>
                <a href="https://wa.me/256772002326" target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full hover:bg-green-600">WhatsApp</a>
              </div>
            </div>
            <div>
              <span className="text-2xl">🐦</span>
              <p className="font-bold mt-1">Social</p>
              <a href="https://twitter.com/PropertyMasterUg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@PropertyMasterUg</a>
            </div>
          </address>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
            {status === "sent" && <div className="bg-green-50 text-green-700 p-3 rounded-lg">✅ Message sent! We will be in touch.</div>}
            {status === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-lg">Failed to send. Please try again.</div>}
            <input required placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <textarea required rows={4} placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary" />
            <button disabled={status === "sending"}
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 font-bold disabled:opacity-50">
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-10 rounded-xl overflow-hidden shadow-md">
          <iframe
            title="SAGECO EVERGREEN Location — Kyenjojo, Uganda"
            src="https://maps.google.com/maps?q=Kyenjojo,Uganda&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
