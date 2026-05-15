import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/router"

export default function Signup() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "", role: "customer" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirm) { setError("Passwords do not match."); return }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return }

    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, full_name: form.full_name, role: form.role })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (success) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
          <p className="text-gray-500 mb-6">We sent a confirmation link to <span className="font-bold text-gray-700">{form.email}</span>. Click it to activate your account.</p>
          <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Go to Login</Link>
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Head><title>Create Account | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
            <p className="text-gray-500 mt-1">Join SAGECO EVERGREEN today</p>
          </div>
          {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
              <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                placeholder="Your full name"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">I am a...</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                <option value="customer">Customer (Buyer / Renter)</option>
                <option value="broker">Broker / Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Min. 6 characters"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password *</label>
              <input required type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
                placeholder="Repeat password"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
