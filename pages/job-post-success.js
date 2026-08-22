import Link from "next/link"
import { useRouter } from "next/router"
import SEO from '../components/SEO'

export default function JobPostSuccess() {
  const router = useRouter()
  const ref = router.query.ref

  return (
    <>
      <SEO
        title="Job Posted Successfully"
        description="Your job posting was successfully created on SAGECO EVERGREEN."
        keywords="job post success SAGECO"
        path="/job-post-success"
        noindex
      />
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border rounded-lg shadow-sm p-8">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Payment submitted</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Your job listing has been received</h1>
          <p className="text-gray-600 mb-4">
            Thank you for posting a job with SAGECO EVERGREEN. Our team will
            review the listing and prepare it for publishing.
          </p>
          {ref && <p className="text-sm text-gray-500 mb-8">Reference: <span className="font-semibold">{ref}</span></p>}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/careers" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
              View Careers
            </Link>
            <Link href="/post-job" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition">
              Post Another Job
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
