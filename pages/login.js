import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/router"

export default function Login() {
  const { signIn, user, profile } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && profile) {
      if (profile.role === "admin") router.replace("/admin/officers")
      else router.replace("/account")
    }
  }, [user, profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signIn({ email: form.email, password: form.password })
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Head><title>Sign In | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to your SAGECO EVERGREEN account</p>
          </div>
          {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          {router.query.confirmed && (
            <div className="bg-green-50 text-green-700 rounded-lg p-3 mb-4 text-sm font-medium">
              Email confirmed! You can now sign in.
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Your password"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="flex justify-end">
              <Link href="/reset-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
