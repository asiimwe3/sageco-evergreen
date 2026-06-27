import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    title: "Platform Overview",
    content: [
      {
        heading: "What is SAGECO EVERGREEN?",
        body: "SAGECO EVERGREEN is a Uganda real estate platform for property listings, verified brokers, viewing bookings, green projects, careers, and employer job posts.",
      },
      {
        heading: "Who can use the platform?",
        body: "Buyers, renters, property owners, brokers, employers, job seekers, and project teams can use the platform. Public pages are open to visitors, while some actions require a form submission or payment.",
      },
      {
        heading: "Main public pages",
        body: "Use Properties for listings, Brokers for broker profiles, Projects for environmental projects, Careers for job opportunities, Post a Job for employer listings, Plans for broker subscriptions, and Contact for support.",
      },
    ],
  },
  {
    id: "properties",
    label: "Properties",
    title: "Property Listings",
    content: [
      {
        heading: "How do I browse properties?",
        body: "Open the Properties page and review available listings by category, location, and price. Listings can include residential, commercial, land, plot, and green project property types.",
      },
      {
        heading: "How do I list a property?",
        body: "Use the Upload Property page to submit title, price, location, category, amenities, contact details, and property images. Submitted listings are stored as pending for review.",
      },
      {
        heading: "How are images optimized?",
        body: "Property images are compressed in the browser before upload, converted to a smaller web image format, limited by file size, and uploaded with long cache headers so public images load faster.",
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    title: "Bookings and Payments",
    content: [
      {
        heading: "How does viewing booking work?",
        body: "Visitors can use Book Viewing to submit their contact details and confirm interest in a property. The booking flow uses PesaPal for secure payment where payment is required.",
      },
      {
        heading: "Which payment methods are supported?",
        body: "Payments are handled by PesaPal and can support mobile money and card payments depending on the active PesaPal configuration.",
      },
      {
        heading: "What happens after payment?",
        body: "The user returns to a confirmation page with a payment reference. The SAGECO team can then follow up through the admin and message records.",
      },
    ],
  },
  {
    id: "brokers",
    label: "Brokers",
    title: "Broker Registration and Plans",
    content: [
      {
        heading: "How does broker registration work?",
        body: "A broker submits profile details and an optional compressed profile photo. After profile creation, the broker pays the registration fee through PesaPal.",
      },
      {
        heading: "What plans are available?",
        body: "Broker plans include Basic, Pro, and Premium. Plans control listing limits and visibility. The Plans page shows current pricing and features.",
      },
      {
        heading: "How are broker photos handled?",
        body: "Broker and officer photos are compressed before upload and stored in Supabase Storage with cache headers for faster repeat loading.",
      },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    title: "Careers and Employer Job Posts",
    content: [
      {
        heading: "How do job seekers apply?",
        body: "Job seekers use the Careers page, choose an open role, and submit an application with contact details, experience, cover letter, and optional CV.",
      },
      {
        heading: "How do employers post jobs?",
        body: "Employers use Post a Job to submit company details, contact details, job title, location, type, summary, deadline, and requirements.",
      },
      {
        heading: "How much does a job post cost?",
        body: "Each employer job listing costs UGX 5,000. After submitting the form, the employer is redirected to PesaPal to complete payment.",
      },
    ],
  },
  {
    id: "green-projects",
    label: "Green Projects",
    title: "Green Projects",
    content: [
      {
        heading: "What green projects are supported?",
        body: "The Projects page highlights agro-forestry partnerships, eco lodge and nature stay sites, solar-ready property development, and community nursery bed opportunities.",
      },
      {
        heading: "How can landowners participate?",
        body: "Landowners can contact SAGECO EVERGREEN with land or property that may fit agro-forestry, eco tourism, renewable energy, or restoration projects.",
      },
      {
        heading: "Can I list a green property?",
        body: "Yes. Use Upload Property and choose Green Project as the category when the property is connected to sustainable development, eco tourism, restoration, or renewable energy.",
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    title: "Admin Operations",
    content: [
      {
        heading: "What can admins manage?",
        body: "The admin area supports properties, brokers, bookings, subscriptions, messages, job applications, and officers.",
      },
      {
        heading: "How are job posts tracked?",
        body: "Employer job post intents are saved as contact message records with a job_post_pending status and a PesaPal reference for follow-up.",
      },
      {
        heading: "What pages should not be indexed?",
        body: "Admin pages, API routes, payment success pages, subscription success pages, and password reset pages are blocked through robots metadata or robots.txt.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    title: "Contact and Support",
    content: [
      {
        heading: "How do I contact SAGECO EVERGREEN?",
        body: "Use the Contact page, email sagecoevergreen@gmail.com, or call the listed company phone numbers. The website chat assistant is also available for quick questions.",
      },
      {
        heading: "What should I include in support messages?",
        body: "Include your name, phone number, email, and any relevant reference number from a booking, job post, broker registration, or subscription payment.",
      },
    ],
  },
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview")
  const current = SECTIONS.find((section) => section.id === activeSection) || SECTIONS[0]

  return (
    <>
      <Head>
        <title>SAGECO EVERGREEN Documentation | Real Estate Platform Help</title>
        <meta
          name="description"
          content="Current documentation for SAGECO EVERGREEN: property listings, broker registration, job posts, payments, uploads, admin tools, and support."
        />
        <link rel="canonical" href={`${SITE_URL}/docs`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/docs`} />
        <meta property="og:title" content="SAGECO EVERGREEN Documentation" />
        <meta property="og:description" content="Learn how to use SAGECO EVERGREEN for properties, brokers, bookings, careers, job posts, and payments." />
      </Head>

      <section className="bg-primary text-white py-14 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          Current guidance for using and managing the SAGECO EVERGREEN platform.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-5 py-3 text-sm font-medium transition border-l-4 ${
                  activeSection === section.id
                    ? "border-primary bg-green-50 text-primary"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">{current.title}</h2>
            <div className="space-y-8">
              {current.content.map((item) => (
                <section key={item.heading}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-6 text-center">
            <p className="text-gray-700 font-medium mb-3">Need more help?</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/faq" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition">View FAQ</Link>
              <Link href="/contact" className="border border-primary text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition">Contact Us</Link>
              <Link href="/post-job" className="border border-primary text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition">Post a Job</Link>
            </div>
          </div>
        </main>
      </div>

    </>
  )
}
