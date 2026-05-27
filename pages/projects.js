import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

const PROJECTS = [
  {
    title: "Agro-Forestry Land Partnerships",
    location: "Western Uganda",
    status: "Open for partners",
    summary: "Connect landowners and investors with tree-based farming projects that protect soil, improve yields, and create long-term land value.",
    focus: ["Tree planting", "Soil protection", "Farmer income"],
  },
  {
    title: "Eco Lodge and Nature Stay Sites",
    location: "Kyenjojo and surrounding districts",
    status: "Site identification",
    summary: "Identify scenic, low-impact land suitable for eco lodges, nature stays, camping, and responsible tourism developments.",
    focus: ["Eco tourism", "Low-impact building", "Local jobs"],
  },
  {
    title: "Solar-Ready Property Development",
    location: "Uganda",
    status: "Planning",
    summary: "Promote properties that can support solar installations, reliable water systems, and lower operating costs for homes and businesses.",
    focus: ["Solar power", "Water systems", "Efficient buildings"],
  },
  {
    title: "Community Nursery Beds",
    location: "Kyenjojo",
    status: "Community proposal",
    summary: "Support local seedling production for fruit trees, shade trees, boundary planting, and restoration of degraded land.",
    focus: ["Seedlings", "Youth work", "Restoration"],
  },
]

const IMPACT = [
  ["4", "Project tracks"],
  ["UGX", "Local investment focus"],
  ["Green", "Property category"],
  ["Open", "Partner enquiries"],
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "SAGECO EVERGREEN Green Projects",
  description: "Green real estate and environmental project opportunities in Uganda, including agro-forestry, eco tourism, solar-ready property, and nursery beds.",
  url: `${SITE_URL}/projects`,
  publisher: {
    "@type": "Organization",
    name: "SAGECO EVERGREEN",
    url: SITE_URL,
  },
}

export default function Projects() {
  return (
    <>
      <Head>
        <title>Green Projects Uganda | SAGECO EVERGREEN</title>
        <meta
          name="description"
          content="Explore SAGECO EVERGREEN green projects in Uganda: agro-forestry, eco lodges, solar-ready property, nursery beds, and sustainable real estate partnerships."
        />
        <meta
          name="keywords"
          content="green projects Uganda, eco real estate Uganda, agroforestry land Uganda, solar property Uganda, sustainable development Uganda"
        />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/projects`} />
        <meta property="og:title" content="Green Projects Uganda | SAGECO EVERGREEN" />
        <meta property="og:description" content="Agro-forestry, eco tourism, solar-ready property, and sustainable real estate partnerships in Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Navbar />

      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-center">
          <div>
            <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-3">
              Sustainable real estate
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Green Projects in Uganda
            </h1>
            <p className="text-green-100 text-lg leading-relaxed max-w-2xl">
              SAGECO EVERGREEN connects land, property, and investment
              opportunities with practical environmental projects that create
              long-term value for communities and property owners.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/contact" className="bg-secondary text-dark font-bold px-6 py-3 rounded-full hover:opacity-90">
                Partner With Us
              </Link>
              <Link href="/properties" className="border-2 border-white text-white font-bold px-6 py-3 rounded-full hover:bg-white hover:text-primary transition">
                View Green Listings
              </Link>
            </div>
          </div>

          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-3">Project priorities</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span className="font-bold text-primary">01</span> Protect land value through responsible development.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">02</span> Support green property, agro-forestry, and eco tourism.</li>
              <li className="flex gap-2"><span className="font-bold text-primary">03</span> Connect partners with practical, local opportunities.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACT.map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Active green project areas</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            These project areas are ready for enquiries from landowners,
            investors, brokers, community groups, and environmental partners.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.title} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{project.location}</p>
                </div>
                <span className="text-xs font-bold bg-green-50 text-primary border border-green-200 px-3 py-1 rounded-full">
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {project.focus.map((item) => (
                  <span key={item} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12 bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Submit a green project opportunity
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have land for agro-forestry, an eco tourism site, a
                renewable energy property opportunity, or a community
                restoration idea, contact the SAGECO EVERGREEN team for review.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link href="/contact" className="bg-primary text-white text-center px-6 py-3 rounded-full font-bold hover:opacity-90">
                Contact the Team
              </Link>
              <Link href="/upload-property" className="border-2 border-primary text-primary text-center px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">
                List Green Property
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
