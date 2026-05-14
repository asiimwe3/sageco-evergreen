import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

export default function Apply() {
  const router = useRouter()
  const jobTitle = router.query.title ? decodeURIComponent(router.query.title) : "Position"
  const department = router.query.dept ? decodeURIComponent(router.query.dept) : ""
  const jobId = router.query.job_id || "unsolicited"

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    experience: "", cover_letter: ""
  })
  const [cvFile, setCvFile] = useState(null)
  const [status, setStatus] = useState("idle") // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    let cv_url = null
    if (cvFile) {
      const reader = new FileReader()
      cv_url = await new Promise(resolve => {
        reader.onload = async (e) => {
          const base64Data = e.target.result.split(",")[1]
          const uploadRes = await fetch("/api/upload-cv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: cvFile.name,
              mimeType: cvFile.type
            })
          })
          if (uploadRes.ok) {
            const d = await uploadRes.json()
            resolve(d.url)
          } else {
            resolve(null)
          }
        }
        reader.readAsDataURL(cvFile)
      })
    }

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        job_title: jobTitle,
        department,
        ...form,
        cv_url
      })
    })

    if (res.ok) {
      setStatus("success")
    } else {
      const d = await res.json()
      setErrorMsg(d.error || "Submission failed. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <>
        <Head><title>Application Submitted | SAGECO EVERGREEN</title></Head>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-2">Thank you for applying for <strong>{jobTitle}</strong>.</p>
          <p className="text-gray-500 text-sm mb-8">Our team will review your application and get back to you within 5 business days.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/careers" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">View More Jobs</Link>
            <Link href="/" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">Go Home</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Apply — {jobTitle} | SAGECO EVERGREEN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <section className="bg-primary text-white py-10 px-4 text-center">
        <p className="text-green-200 text-sm mb-1">Applying for</p>
        <h1 className="text-3xl font-bold">{jobTitle}</h1>
        {department && <p className="text-green-100 mt-1">{department} · SAGECO EVERGREEN</p>}
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
            <input required name="full_name" value={form.full_name} onChange={handleChange}
              placeholder="John Doe"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
              <input required name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@email.com"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
              <input required name="phone" value={form.phone} onChange={handleChange}
                placeholder="+256 700 000000"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Years of Experience</label>
            <select name="experience" value={form.experience} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
              <option value="">Select...</option>
              <option value="Fresh graduate / Intern">Fresh graduate / Intern</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-2 years">1–2 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload CV (PDF or Word)</label>
            <input type="file" accept=".pdf,.doc,.docx"
              onChange={e => setCvFile(e.target.files[0])}
              className="w-full border rounded-lg px-4 py-3 text-sm" />
            <p className="text-xs text-gray-400 mt-1">Optional but recommended. Max 5MB.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cover Letter (optional)</label>
            <textarea name="cover_letter" value={form.cover_letter} onChange={handleChange}
              rows={5} placeholder="Tell us why you are the right fit..."
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>

          {status === "error" && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errorMsg}</div>
          )}

          <button type="submit" disabled={status === "submitting"}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
            {status === "submitting" ? "Submitting..." : "Submit Application →"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Questions? Email us at sagecoevergreen@gmail.com
        </p>
      </div>
      <Footer />
    </>
  )
}
