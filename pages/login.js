import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/router"
import SEO from '../components/SEO'

export default function Login() {
  const { signIn, signInWithGoogle, user, profile } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && profile) {
      if (profile.role === "admin") router.replace("/admin")
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

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError("")
    try {
      await signInWithGoogle()
    } catch (err) { setError(err.message); setGoogleLoading(false) }
  }

  return (
    <>
      <SEO
        title="Sign In - SAGECO EVERGREEN"
        description="Sign in to your SAGECO EVERGREEN account to manage properties, bookings, and investments."
        keywords="SAGECO login, real estate account Uganda, property portal login"
        path="/login"
        noindex
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to your SAGECO EVERGREEN account</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">{error}</div>}

          {router.query.confirmed && (
            <div className="bg-green-50 text-green-700 rounded-lg p-3 mb-4 text-sm font-medium">
              ✅ Email confirmed! You can now sign in.
            </div>
          )}

          {/* Google Sign In */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-full font-bold text-base hover:border-gray-400 hover:shadow-sm transition mb-4 disabled:opacity-60">
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            )}
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-4">
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
    </>
  )
}
