import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

const FAQS = [
  {
    category: "Booking & Payments",
    items: [
      { q: "How much does it cost to book a property viewing?", a: "A property viewing costs UGX 30,000. This covers the booking fee — UGX 10,000 to SAGECO EVERGREEN and UGX 20,000 goes to the assigned broker. A consultation costs UGX 15,000." },
      { q: "What payment methods are accepted?", a: "We accept MTN Mobile Money, Airtel Money, and bank cards through PesaPal — Uganda's trusted payment gateway." },
      { q: "What happens after I pay?", a: "Your booking is confirmed automatically. Our team will contact you within 24 hours to confirm the exact time and location of your viewing." },
      { q: "Can I get a refund if I cancel?", a: "Bookings are non-refundable once the broker has been notified. If you need to reschedule, contact us on WhatsApp at 0750 414 366 within 24 hours of booking." },
      { q: "My payment went through but I haven't heard back — what do I do?", a: "Please WhatsApp us on 0750 414 366 with your booking reference number. We'll confirm your booking status immediately." },
    ]
  },
  {
    category: "Properties",
    items: [
      { q: "How do I list a property?", a: "Click 'List Property' on the Properties page or go to /upload-property. Fill in the details, upload photos, and submit. Our team will review and publish your listing within 24 hours." },
      { q: "Are all listings verified?", a: "Yes. Every property is reviewed by our team before going live. We verify ownership documents and ensure listing accuracy." },
      { q: "Can I negotiate the listed price?", a: "Properties marked 'Negotiable' allow price discussion. Contact the broker directly or book a consultation for price negotiations." },
      { q: "How do I know if a property is still available?", a: "All listed properties on our site have 'Available' status. Once sold or rented, they are removed automatically." },
    ]
  },
  {
    category: "Broker Registration",
    items: [
      { q: "How do I become a SAGECO EVERGREEN broker?", a: "Visit /broker-register, fill in your details and upload a profile photo. Pay the registration fee via PesaPal. Your account will be reviewed and activated within 48 hours." },
      { q: "What are the broker fees?", a: "Registration fee: UGX 32,000 (one-time). Dashboard activation: UGX 45,000 (monthly subscription). You earn UGX 20,000 per confirmed booking." },
      { q: "What are the subscription plan limits?", a: "Free: 3 listings. Basic (UGX 15,000/mo): 10 listings. Pro (UGX 25,000/mo): 50 listings. Premium (UGX 30,000/mo): Unlimited listings." },
      { q: "How do I get paid for bookings?", a: "Broker earnings (UGX 20,000 per confirmed viewing) are paid out weekly via Mobile Money. Ensure your phone number is registered in your broker profile." },
    ]
  },
  {
    category: "Account & Support",
    items: [
      { q: "How do I reset my password?", a: "Go to /login and click 'Forgot Password'. Enter your email and we'll send you a reset link." },
      { q: "Can I sign in with Google?", a: "Yes! Both the login and signup pages support Google Sign-In for quick access." },
      { q: "How do I contact SAGECO EVERGREEN?", a: "Call or WhatsApp us: 0750 414 366 / 0782 067 425 / 0772 002 326. Email: sagecoevergreen@gmail.com. We operate Mon–Sat, 8 AM – 6 PM EAT." },
      { q: "Where is SAGECO EVERGREEN located?", a: "We are based in Kyenjojo, Western Uganda, and serve clients across the entire country." },
    ]
  }
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl overflow-hidden transition ${open ? 'border-primary' : 'border-gray-200'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition">
        <span className={`font-semibold text-sm ${open ? 'text-primary' : 'text-gray-800'}`}>{q}</span>
        <span className={`text-xl font-bold ml-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-45 text-primary' : 'text-gray-400'}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-green-50/30">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All")
  const categories = ["All", ...FAQS.map(f => f.category)]

  const filtered = activeCategory === "All" ? FAQS : FAQS.filter(f => f.category === activeCategory)

  return (
    <>
      <Head>
        <title>FAQ | SAGECO EVERGREEN</title>
        <meta name="description" content="Frequently asked questions about SAGECO EVERGREEN — bookings, payments, property listings, broker registration, and more." />
      </Head>
      <Navbar />

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-green-100">Everything you need to know about SAGECO EVERGREEN</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${activeCategory === c ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filtered.map(section => (
            <div key={section.category}>
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-green-50 border border-green-200 rounded-xl p-8">
          <h3 className="font-bold text-primary text-xl mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-5 text-sm">Our team is available Mon–Sat, 8 AM – 6 PM EAT</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
              className="bg-green-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90">💬 WhatsApp Us</a>
            <Link href="/contact" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90">Send a Message</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
