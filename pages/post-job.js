import Head from "next/head"
import { useState } from "react"
import SEO from '../components/SEO'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
const LISTING_FEE = 5000

const initialForm = {
  employer_name: "",
  contact_name: "",
  email: "",
  phone: "",
  job_title: "",
  department: "",
  job_type: "Full-time",
  location: "",
  deadline: "",
  summary: "",
  requirements: "",
}

export default function PostJob() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")

  const update = (field, value) => setForm({ ...form, [field]: value })

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("processing")
    setError("")

    try {
      const reference = `JOB-${Date.now()}`
      const callbackUrl = `${window.location.origin}/job-post-success?ref=${reference}`

      const intentRes = await fetch("/api/job-posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount_ugx: LISTING_FEE,
          pesapal_ref: reference,
        }),
      })

      const intentData = await intentRes.json()
      if (!intentRes.ok) {
        throw new Error(intentData.error || "Could not save job listing.")
      }

      const payRes = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: LISTING_FEE,
          currency: "UGX",
          description: `SAGECO EVERGREEN Job Listing - ${form.job_title}`,
          email: form.email,
          phone: form.phone,
          first_name: form.contact_name.split(" ")[0] || "Employer",
          last_name: form.contact_name.split(" ").slice(1).join(" ") || form.employer_name,
          reference,
          callback_url: callbackUrl,
        }),
      })

      const payData = await payRes.json()
      if (!payRes.ok || !payData.redirect_url) {
        throw new Error(payData.error || "Payment initiation failed.")
      }

      window.location.href = payData.redirect_url
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
      setStatus("idle")
    }
  }

  return (
    <>
      <SEO
        title="Post a Job - SAGECO EVERGREEN"
        description="Post a real estate job listing on SAGECO EVERGREEN. Reach property professionals across Uganda."
        keywords="post job SAGECO, real estate job listing Uganda, hire property agents Uganda"
        path="/post-job"
        noindex
      />
      <Head>
        </Head>

      <main className="bg-gray-50">
        <section className="bg-primary text-white px-4 py-14">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-3">
                Employer job listings
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Post a job on SAGECO EVERGREEN
              </h1>
              <p className="text-green-100 text-lg leading-relaxed max-w-2xl">
                Reach applicants interested in real estate, brokerage,
                operations, and green project work across Uganda.
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
                Submit your job details, pay securely with PesaPal, and the
                SAGECO team will review the listing for publishing.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-10">
          <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Employer details</h2>
              <p className="text-sm text-gray-500 mt-1">These details help us contact you about the listing.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Employer / Company *</label>
                <input required value={form.employer_name} onChange={e => update("employer_name", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Person *</label>
                <input required value={form.contact_name} onChange={e => update("contact_name", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => update("email", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
                <input required value={form.phone} onChange={e => update("phone", e.target.value)}
                  placeholder="+256 700 000 000"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800">Job details</h2>
              <p className="text-sm text-gray-500 mt-1">This information will be used to prepare the public listing.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Title *</label>
                <input required value={form.job_title} onChange={e => update("job_title", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                <input value={form.department} onChange={e => update("department", e.target.value)}
                  placeholder="Sales, Operations, Marketing..."
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Type *</label>
                <select required value={form.job_type} onChange={e => update("job_type", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location *</label>
                <input required value={form.location} onChange={e => update("location", e.target.value)}
                  placeholder="Kampala, Kyenjojo, Remote..."
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => update("deadline", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Job Summary *</label>
              <textarea required rows={4} value={form.summary} onChange={e => update("summary", e.target.value)}
                placeholder="Briefly describe the role and responsibilities."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Requirements *</label>
              <textarea required rows={5} value={form.requirements} onChange={e => update("requirements", e.target.value)}
                placeholder="List qualifications, experience, and skills required."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-800">Payment due</p>
                  <p className="text-sm text-gray-600">One job listing on SAGECO EVERGREEN</p>
                </div>
                <p className="text-2xl font-bold text-primary">UGX {LISTING_FEE.toLocaleString()}</p>
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{error}</div>}

            <button type="submit" disabled={status === "processing"}
              className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {status === "processing" ? "Redirecting to PesaPal..." : "Submit and Pay UGX 5,000"}
            </button>
          </form>
        </section>
      </main>

    </>
  )
}
