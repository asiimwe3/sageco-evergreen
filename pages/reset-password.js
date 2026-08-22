import Link from "next/link"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import SEO from '../components/SEO'

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
          <p className="text-gray-500 mb-6">We sent a password reset link to <span className="font-bold">{email}</span>.</p>
          <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Back to Login</Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <SEO
        title="Reset Password - SAGECO EVERGREEN"
        description="Reset your SAGECO EVERGREEN account password."
        keywords="reset password SAGECO"
        path="/reset-password"
        noindex
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Reset Password</h1>
          <p className="text-gray-500 text-center mb-6">Enter your email and we'll send a reset link</p>
          {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleReset} className="bg-white shadow-md rounded-2xl p-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link href="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </>
  )
}
