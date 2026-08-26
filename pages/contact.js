import { useState } from "react"
import Link from "next/link"
import SEO from '../components/SEO'

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `${form.subject ? `[${form.subject}] ` : ""}${form.message}${form.phone ? `\nPhone: ${form.phone}` : ""}`
        })
      })
      const d = await res.json()
      if (d.success) {
        setStatus("success")
        setForm({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        setStatus("error:" + (d.error || "Please try again."))
      }
    } catch {
      setStatus("error:Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <>
      <SEO
        title="Contact SAGECO EVERGREEN"
        description="Get in touch with SAGECO EVERGREEN for property inquiries, viewings, and consultations. Call 0750 414 366 or WhatsApp us. Based in Kyenjojo, Uganda."
        keywords="contact SAGECO Evergreen, real estate contact Uganda, property inquiry Kyenjojo, WhatsApp property Uganda"
        path="/contact"
        breadcrumbs={[{"name": "Home", "path": "/"}, {"name": "Contact", "path": "/contact"}]}
      />

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-green-100">We're here to help — Mon to Sat, 8 AM – 6 PM EAT</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
          <div className="space-y-5">
            {[
              { icon: "📍", label: "Address", value: "Kyenjojo, Western Uganda" },
              { icon: "📞", label: "Phone / WhatsApp", value: "0750 414 366 · 0782 067 425 · 0772 002 326", href: "tel:+256750414366" },
              { icon: "📧", label: "Email", value: "sagecoevergreen@gmail.com", href: "mailto:sagecoevergreen@gmail.com" },
              { icon: "🕐", label: "Working Hours", value: "Monday – Saturday, 8:00 AM – 6:00 PM EAT" },
            ].map(c => (
              <div key={c.label} className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-gray-800 font-medium hover:text-primary transition text-sm">{c.value}</a>
                  ) : (
                    <p className="text-gray-800 font-medium text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-bold text-primary mb-2">🚀 Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link href="/book" className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">📅 Book a Property Viewing</Link>
              <Link href="/broker-register" className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">🤝 Register as a Broker</Link>
              <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-green-600 font-medium hover:underline">💬 WhatsApp Us Now</a>
              <Link href="/faq" className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">❓ View FAQ</Link>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Send Us a Message</h2>

          {status === "success" ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-primary mb-2">Message Sent!</h3>
              <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
              <button onClick={() => setStatus("")} className="text-primary font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.startsWith("error:") && (
                <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{status.slice(6)}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="0750 414 366"
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select a subject</option>
                  <option>Property Inquiry</option>
                  <option>Broker Registration</option>
                  <option>Booking Support</option>
                  <option>Payment Issue</option>
                  <option>Career / Jobs</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-full font-bold text-base hover:opacity-90 disabled:opacity-50 transition">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
