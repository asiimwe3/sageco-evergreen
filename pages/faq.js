import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const FAQS = [
  {
    category: "General",
    items: [
      {
        q: "What is SAGECO EVERGREEN?",
        a: "SAGECO EVERGREEN CO. LTD is a real estate company based in Kyenjojo, Uganda. We help people find, buy, rent, and invest in properties across Uganda through a network of verified brokers.",
      },
      {
        q: "Is this platform free to use?",
        a: "Browsing properties and contacting us is completely free. Booking a viewing costs UGX 30,000. Broker registration and subscription plans have their own fees — see our Plans page for details.",
      },
      {
        q: "Where is SAGECO EVERGREEN located?",
        a: "Our offices are in Kyenjojo, Uganda. You can reach us on 0750 414 366 (WhatsApp), 0782 067 425, or 0772 002 326.",
      },
    ],
  },
  {
    category: "Properties",
    items: [
      {
        q: "How do I find a property?",
        a: "Go to the Properties page and browse all available listings. You can filter by type (Residential, Commercial, Land), location, and price range.",
      },
      {
        q: "Are all listings verified?",
        a: "Yes. All properties on SAGECO EVERGREEN are submitted by approved brokers or our admin team and reviewed before going live.",
      },
      {
        q: "Can I save properties I like?",
        a: "This feature is coming soon. For now, note the property title and contact our team or the assigned broker to express interest.",
      },
      {
        q: "What does 'available' status mean?",
        a: "A property marked 'available' is ready for viewing and has not yet been sold or rented. Status updates as soon as a deal is closed.",
      },
    ],
  },
  {
    category: "Bookings",
    items: [
      {
        q: "How much does a viewing cost?",
        a: "A viewing costs UGX 30,000. This covers the service fee (UGX 10,000 to SAGECO) and broker fee (UGX 20,000 to your assigned broker).",
      },
      {
        q: "What payment methods are supported?",
        a: "We accept MTN Mobile Money, Airtel Money, and card payments through PesaPal. All transactions are secure.",
      },
      {
        q: "How long after paying will I hear from my broker?",
        a: "Your broker will reach out within 24 hours of confirmed payment to schedule the exact viewing time.",
      },
      {
        q: "Can I cancel a booking?",
        a: "To cancel or reschedule, contact us immediately at sagecoevergreen@gmail.com or call 0750 414 366. Refund eligibility depends on timing.",
      },
    ],
  },
  {
    category: "Brokers",
    items: [
      {
        q: "How do I register as a broker?",
        a: "Visit the Broker Registration page, fill in your profile details, upload a photo, and complete the registration payment. Once reviewed, your profile goes live on the platform.",
      },
      {
        q: "How do I get clients as a broker?",
        a: "Clients browse your profile and listings, then pay UGX 30,000 to book a viewing with you. You receive UGX 20,000 per confirmed booking directly to your mobile money.",
      },
      {
        q: "Can I upgrade my broker plan?",
        a: "Yes. Go to the Plans page while logged in and select a higher plan. Upgrading improves your listing visibility and priority in search results.",
      },
      {
        q: "What happens if my registration is rejected?",
        a: "Our team will contact you by email or phone to explain the reason and guide you on resubmitting. Common issues include unclear photos or incomplete information.",
      },
    ],
  },
  {
    category: "Account & Login",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' from the top menu. Enter your email and password, or use 'Continue with Google' for instant access.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the login page, click 'Forgot password?' and enter your email. You will receive a reset link within a few minutes. Check your spam folder if you don't see it.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. All data is stored securely in Supabase with row-level security. Passwords are never stored in plain text. Payments are handled by PesaPal.",
      },
    ],
  },
  {
    category: "Careers",
    items: [
      {
        q: "How do I apply for a job?",
        a: "Visit the Careers page to see current openings. Click on a position and complete the application form. You can attach your CV. Applications are reviewed within 7 working days.",
      },
      {
        q: "Where are your job notifications sent?",
        a: "Application confirmations are sent to your email. Our recruitment team is notified immediately and will contact shortlisted candidates.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left py-4 flex justify-between items-start gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-gray-800 font-medium text-sm leading-relaxed">{q}</span>
        <span className={`text-green-700 text-xl shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="pb-4 text-gray-600 text-sm leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("General");
  const categories = FAQS.map((f) => f.category);
  const current = FAQS.find((f) => f.category === activeCategory);

  return (
    <>
      <Head>
        <title>FAQ | SAGECO EVERGREEN</title>
        <meta name="description" content="Frequently asked questions about SAGECO EVERGREEN — properties, bookings, brokers, subscriptions, and more." />
      </Head>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto">Quick answers to the most common questions about our platform.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-2 mb-8">
          {current.items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Still need help */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-5">Our team is available Monday–Saturday, 8am–6pm EAT.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact" className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition">Contact Us</Link>
            <a href="https://wa.me/256750414366" target="_blank" rel="noreferrer" className="border border-green-700 text-green-700 px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition">WhatsApp Us</a>
            <Link href="/docs" className="border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 transition">Read Docs</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
