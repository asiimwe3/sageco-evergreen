import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

// Admin secret comes from env var only — never hardcoded in client bundle
export const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ""

const NAV = [
  { href: "/admin", icon: "🏠", label: "Dashboard" },
  { href: "/admin/properties", icon: "🏡", label: "Properties" },
  { href: "/admin/brokers", icon: "🤝", label: "Brokers" },
  { href: "/admin/bookings", icon: "📅", label: "Bookings" },
  { href: "/admin/subscriptions", icon: "💳", label: "Subscriptions" },
  { href: "/admin/applications", icon: "📋", label: "Applications" },
  { href: "/admin/messages", icon: "💬", label: "Messages" },
  { href: "/admin/officers", icon: "👔", label: "Officers" },
]

export function AdminGate({ children, title }) {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  // Check if user has admin role via Supabase Auth
  useEffect(() => {
    if (authLoading) return
    
    if (user && profile?.role === "admin") {
      setAuthed(true)
      setLoading(false)
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, profile, authLoading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head><title>{title} | Admin</title><meta name="robots" content="noindex" /></Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Head><title>{title} | Admin</title><meta name="robots" content="noindex" /></Head>
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
        <p className="text-gray-500 text-sm mb-6">Admin access required</p>
        <p className="text-gray-400 text-sm mb-4">
          You need an admin account to access this area.
        </p>
        <Link href="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">
          Sign In
        </Link>
        <Link href="/admin" className="block mt-4 text-sm text-gray-400 hover:text-primary">← Admin Home</Link>
      </div>
    </div>
  )

  const isActive = (href) => {
    if (href === "/admin") return router.pathname === "/admin"
    return router.pathname.startsWith(href)
  }

  return (
    <>
      <Head><title>{title} | SAGECO Admin</title><meta name="robots" content="noindex" /></Head>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-primary text-white sticky top-0 h-screen py-6 shrink-0">
          <Link href="/admin" className="px-5 mb-6">
            <p className="font-bold text-lg">SAGECO</p>
            <p className="text-green-200 text-xs">Admin Panel</p>
          </Link>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map(n => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(n.href) ? "bg-green-700 text-white" : "hover:bg-green-700/50"}`}>
                <span>{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
          <div className="px-5 mt-4 border-t border-green-700/50 pt-4">
            <a href="/" className="text-xs text-green-300 hover:text-white">← Back to Site</a>
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-bold">SAGECO Admin</Link>
          <div className="flex gap-2 overflow-x-auto text-xs">
            {NAV.slice(1).map(n => (
              <Link key={n.href} href={n.href} className={`whitespace-nowrap px-2 py-1 rounded ${isActive(n.href) ? "bg-green-700" : "hover:bg-green-700"}`}>
                {n.icon} {n.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 md:overflow-auto pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </>
  )
}
