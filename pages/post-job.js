import Head from "next/head"
import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function PostJob() {
  return (
    <>
      <Head>
        <title>Post a Job Coming Soon | SAGECO EVERGREEN</title>
        <meta
          name="description"
          content="Employers will soon be able to list jobs on SAGECO EVERGREEN for UGX 5,000 per job post."
        />
        <link rel="canonical" href={`${SITE_URL}/post-job`} />
      </Head>
      <Navbar />

      <main className="bg-gray-50">
        <section className="bg-primary text-white px-4 py-16">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-3">
                Coming Soon
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Employers will be able to list jobs on SAGECO EVERGREEN
              </h1>
              <p className="text-green-100 text-lg leading-relaxed max-w-2xl">
                We are preparing a simple job posting service for companies,
                brokers, property owners, and project teams hiring across
                Uganda's real estate and green project sectors.
              </p>
            </div>

            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Listing fee
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">UGX 5,000</span>
                <span className="text-gray-500 font-medium">per job</span>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Each paid job post will be published for applicants to view and
                apply through the careers section.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="bg-white rounded-lg border p-5">
              <h2 className="font-bold text-gray-800 mb-2">Create a job post</h2>
              <p className="text-sm text-gray-600">
                Add the role title, location, job type, deadline, and applicant
                requirements.
              </p>
            </div>
            <div className="bg-white rounded-lg border p-5">
              <h2 className="font-bold text-gray-800 mb-2">Pay per listing</h2>
              <p className="text-sm text-gray-600">
                Pay UGX 5,000 for each job you want published on the platform.
              </p>
            </div>
            <div className="bg-white rounded-lg border p-5">
              <h2 className="font-bold text-gray-800 mb-2">Receive applicants</h2>
              <p className="text-sm text-gray-600">
                Applicants will apply online so employers can review submissions
                quickly.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Need to advertise a job now?
            </h2>
            <p className="text-gray-600 mb-5">
              Contact SAGECO EVERGREEN while online employer posting is being
              prepared.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90"
              >
                Contact Us
              </Link>
              <Link
                href="/careers"
                className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition"
              >
                View Careers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
