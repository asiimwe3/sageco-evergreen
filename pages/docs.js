import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const SECTIONS = [
  {
    id: "getting-started",
    icon: "🚀",
    title: "Getting Started",
    content: [
      {
        heading: "What is SAGECO EVERGREEN?",
        body: "SAGECO EVERGREEN CO. LTD is a premier real estate platform based in Kyenjojo, Uganda. We connect property buyers, sellers, and renters with verified brokers and premium listings across Uganda.",
      },
      {
        heading: "How do I browse properties?",
        body: "Visit the Properties page from the main menu. You can filter by category (Residential, Commercial, Land), location, and price range. Click any listing to view full details including photos, size, and broker contact.",
      },
      {
        heading: "Do I need an account?",
        body: "Browsing properties is free and open to everyone. To book a viewing, subscribe to a plan, or apply for a job, you will need to create a free account.",
      },
    ],
  },
  {
    id: "booking",
    icon: "📅",
    title: "Booking a Viewing",
    content: [
      {
        heading: "How does booking work?",
        body: "Click 'Book a Viewing' on any property page or from the main menu. Fill in your details and select a preferred date. A booking fee of UGX 30,000 is required to confirm your viewing.",
      },
      {
        heading: "How is the booking fee split?",
        body: "The UGX 30,000 booking fee is split as follows: UGX 10,000 goes to SAGECO EVERGREEN as a service fee, and UGX 20,000 goes directly to the assigned broker for their time.",
      },
      {
        heading: "What payment methods are accepted?",
        body: "We accept Mobile Money (MTN & Airtel) and card payments via PesaPal. Payment is secure and you receive a confirmation reference immediately.",
      },
      {
        heading: "What happens after I pay?",
        body: "Your broker will contact you within 24 hours to confirm the exact viewing time and location. You will also receive a payment confirmation to your email.",
      },
    ],
  },
  {
    id: "brokers",
    icon: "🤝",
    title: "Brokers",
    content: [
      {
        heading: "How do I become a broker?",
        body: "Go to the Broker Registration page and fill in your details including your name, phone, specialization, and location. Upload a clear profile photo. A registration fee applies, after which your profile is reviewed and activated.",
      },
      {
        heading: "What plans are available for brokers?",
        body: "We offer three plans: Basic, Pro, and Premium. Higher plans give you more listing visibility, priority placement, and access to more client bookings. See the Plans page for current pricing.",
      },
      {
        heading: "How do brokers get paid?",
        body: "When a client books a viewing for your listing, UGX 20,000 from the booking fee is sent to your registered mobile money number. Payments are processed through PesaPal.",
      },
    ],
  },
  {
    id: "subscriptions",
    icon: "💳",
    title: "Subscriptions & Plans",
    content: [
      {
        heading: "What do subscription plans include?",
        body: "Subscription plans unlock premium features including priority listing placement, access to broker contact details, and early access to new properties. Plans are designed for serious buyers and investors.",
      },
      {
        heading: "How do I subscribe?",
        body: "Go to the Plans page, choose your plan, and complete payment via Mobile Money or card. Your subscription activates immediately after payment confirmation.",
      },
      {
        heading: "Can I cancel my subscription?",
        body: "Subscriptions run for the period purchased. To cancel or enquire about a refund, contact us at sagecoevergreen@gmail.com or call 0750 414 366.",
      },
    ],
  },
  {
    id: "listings",
    icon: "🏡",
    title: "Property Listings",
    content: [
      {
        heading: "How do I list a property?",
        body: "Brokers and admins can add properties via the Upload Property page. Each listing requires a title, description, price, location, category, and at least one photo.",
      },
      {
        heading: "What categories are available?",
        body: "Properties are categorised as Residential, Commercial, or Land. Each category has relevant fields such as bedrooms/bathrooms for residential or area in acres for land.",
      },
      {
        heading: "How are property images handled?",
        body: "Images are securely uploaded to Supabase Storage and served via CDN for fast loading. You can upload multiple images per listing. The first image is used as the cover photo.",
      },
    ],
  },
  {
    id: "admin",
    icon: "⚙️",
    title: "Admin Panel",
    content: [
      {
        heading: "How do I access the admin panel?",
        body: "Go to /admin and enter the admin password. The admin panel lets you manage properties, brokers, bookings, subscriptions, job applications, messages, and officers.",
      },
      {
        heading: "How do I approve a broker?",
        body: "In the admin panel, navigate to the Brokers section. You will see all registered brokers and their payment status. Once registration payment is confirmed, set their status to 'approved' to activate their profile.",
      },
      {
        heading: "How do I manage officers?",
        body: "Go to /admin/officers to add, view, or remove company officers. Officers are internal staff members displayed on the company profile.",
      },
    ],
  },
  {
    id: "contact",
    icon: "📞",
    title: "Contact & Support",
    content: [
      {
        heading: "How do I reach SAGECO EVERGREEN?",
        body: "Phone: 0750 414 366 (WhatsApp), 0782 067 425, 0772 002 326\nEmail: sagecoevergreen@gmail.com\nLocation: Kyenjojo, Uganda\nYou can also use the Contact page on the website or chat with our assistant using the green chat button.",
      },
      {
        heading: "What are your working hours?",
        body: "Our team is available Monday to Saturday, 8:00 AM to 6:00 PM EAT. The chatbot is available 24/7 for instant answers.",
      },
    ],
  },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const current = SECTIONS.find((s) => s.id === activeSection);

  return (
    <>
      <Head>
        <title>Documentation | SAGECO EVERGREEN</title>
        <meta name="description" content="Learn how to use SAGECO EVERGREEN — browse properties, book viewings, register as a broker, and more." />
      </Head>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto">Everything you need to know about using the SAGECO EVERGREEN platform.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center gap-3 transition border-l-4 ${
                  activeSection === s.id
                    ? "border-green-700 bg-green-50 text-green-800"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <span>{current.icon}</span> {current.title}
            </h2>
            <div className="space-y-8">
              {current.content.map((item, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.heading}</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
            <p className="text-gray-700 font-medium mb-3">Still have questions?</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/faq" className="bg-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition">View FAQ</Link>
              <Link href="/contact" className="border border-green-700 text-green-700 px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition">Contact Us</Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
