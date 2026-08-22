import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import SEO from '../components/SEO'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

const JOBS = [
  {
    id: "sales-exec-001",
    title: "Sales Executive",
    department: "Sales",
    type: "Full-time",
    location: "Kyenjojo, Uganda",
    summary: "Drive property sales by sourcing clients, conducting viewings, and closing deals for SAGECO EVERGREEN.",
    requirements: ["2+ years sales experience", "Strong communication skills", "Knowledge of local real estate market", "Valid driving permit an advantage"],
    deadline: "2026-06-30"
  },
  {
    id: "property-mgr-001",
    title: "Property Manager",
    department: "Operations",
    type: "Full-time",
    location: "Kyenjojo, Uganda",
    summary: "Oversee day-to-day management of rental and commercial properties including maintenance and tenant relations.",
    requirements: ["3+ years property management experience", "Strong organizational skills", "Ability to manage budgets", "Degree in Real Estate or Business preferred"],
    deadline: "2026-06-30"
  },
  {
    id: "broker-coord-001",
    title: "Broker Coordinator",
    department: "Brokerage",
    type: "Full-time",
    location: "Kyenjojo, Uganda",
    summary: "Support broker network operations — onboarding, payments, listings verification and performance tracking.",
    requirements: ["Experience in real estate or financial services", "Proficient in Excel / Google Sheets", "Attention to detail", "Good interpersonal skills"],
    deadline: "2026-06-30"
  },
  {
    id: "marketing-001",
    title: "Digital Marketing Officer",
    department: "Marketing",
    type: "Full-time",
    location: "Kyenjojo / Remote",
    summary: "Manage social media, run property listing campaigns, and grow SAGECO EVERGREEN digital presence across Uganda.",
    requirements: ["2+ years digital marketing experience", "Social media content creation", "Basic graphic design skills", "SEO knowledge an advantage"],
    deadline: "2026-06-30"
  },
  {
    id: "intern-001",
    title: "Real Estate Intern",
    department: "General",
    type: "Internship",
    location: "Kyenjojo, Uganda",
    summary: "Gain hands-on experience in real estate operations, client servicing, and property documentation.",
    requirements: ["Undergraduate student or recent graduate", "Eager to learn", "Good communication", "Available for at least 3 months"],
    deadline: "2026-06-30"
  },
]

const DEPT_COLORS = {
  Sales: "bg-blue-100 text-blue-700",
  Operations: "bg-yellow-100 text-yellow-700",
  Brokerage: "bg-green-100 text-green-700",
  Marketing: "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-600",
}
const TYPE_COLORS = {
  "Full-time": "bg-green-50 text-green-700 border border-green-200",
  "Internship": "bg-orange-50 text-orange-700 border border-orange-200",
}

export default function Careers() {
  const [filter, setFilter] = useState("All")
  const departments = ["All", "Sales", "Operations", "Brokerage", "Marketing", "General"]
  const filtered = filter === "All" ? JOBS : JOBS.filter(j => j.department === filter)

  return (
    <>
      <SEO
        title="Careers at SAGECO EVERGREEN"
        description="Join SAGECO EVERGREEN team. We are hiring real estate professionals, agents, and tech talent across Uganda. Build your career in Ugandas property sector."
        keywords="careers SAGECO Evergreen, real estate jobs Uganda, property jobs Kampala, real estate careers Kyenjojo"
        path="/careers"
      />
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/careers`} />
        <meta property="og:title" content="Careers at SAGECO EVERGREEN | Real Estate Jobs Uganda" />
        <meta property="og:description" content="Join the SAGECO EVERGREEN team. Explore real estate career opportunities in Uganda." />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Careers at SAGECO EVERGREEN</h1>
        <p className="text-green-100 text-lg">Build your career in real estate with Uganda's growing property company</p>
        <p className="text-green-200 text-sm mt-2">{JOBS.length} open positions · Kyenjojo, Uganda</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 bg-white border border-green-200 rounded-lg p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">For employers</p>
            <h2 className="text-xl font-bold text-gray-800">List a job for UGX 5,000</h2>
            <p className="text-gray-600 text-sm mt-1">
              Employers can submit job details and pay securely through PesaPal.
            </p>
          </div>
          <Link
            href="/post-job"
            className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90 text-center whitespace-nowrap"
          >
            Post a Job
          </Link>
        </div>

        {/* Filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-8">
          {departments.map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-5 py-2 rounded-full font-medium border transition text-sm ${filter === d ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"}`}>
              {d}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-5">
          {filtered.map(job => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${DEPT_COLORS[job.department]}`}>{job.department}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[job.type]}`}>{job.type}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">📍 {job.location} · Deadline: {new Date(job.deadline).toLocaleDateString("en-UG", { day:"numeric", month:"long", year:"numeric" })}</p>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{job.summary}</p>
                  <ul className="mt-3 space-y-1">
                    {job.requirements.map(r => (
                      <li key={r} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="text-primary mt-0.5">✓</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <Link href={`/apply?job_id=${job.id}&title=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}`}
                    className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90 whitespace-nowrap block text-center">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unsolicited CTA */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📬</div>
          <h3 className="text-xl font-bold text-primary mb-2">Don't see your role?</h3>
          <p className="text-gray-600 mb-4">Send your CV and we'll reach out when the right opportunity opens up.</p>
          <Link href={`/apply?job_id=unsolicited&title=${encodeURIComponent("Open Application")}&dept=${encodeURIComponent("General")}`}
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">
            Send Open Application
          </Link>
        </div>
      </div>
    </>
  )
}
