import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const NAV_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/gps-measure", label: "GPS Measure" },
  { href: "/title-search", label: "Title Search" },
  { href: "/brokers",    label: "Brokers" },
  { href: "/agents",     label: "Agents" },
  { href: "/ai-broker",  label: "AI Broker" },
  { href: "/invest",      label: "Invest" },
  { href: "/plans",      label: "Plans" },
  { href: "/projects",   label: "Projects" },
  { href: "/careers",    label: "Careers" },
  { href: "/contact",    label: "Contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Sageco Evergreen Ltd" className="h-12 w-12 object-contain rounded-full" />
          <span className="font-extrabold text-primary text-lg leading-tight hidden sm:block">
            SAGECO<br />
            <span className="text-green-600 text-xs font-semibold tracking-widest">EVERGREEN</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${router.pathname === l.href ? 'text-primary bg-green-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold hover:bg-yellow-200">Admin</Link>
              )}
              <Link href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary text-sm font-medium text-gray-700 transition">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                {profile?.full_name?.split(' ')[0] || 'Account'}
              </Link>
              <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-red-500 transition px-2">Sign out</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2">Sign In</Link>
              <Link href="/book" className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition">Book Viewing</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setOpen(o => !o)}>
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition ${router.pathname === l.href ? 'text-primary bg-green-50' : 'text-gray-600 hover:text-primary'}`}>
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="text-sm bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg font-bold">Admin Dashboard</Link>
                )}
                <Link href="/account" onClick={() => setOpen(false)} className="text-sm text-gray-600 py-2 px-3 hover:text-primary font-medium">My Account</Link>
                <button onClick={handleSignOut} className="text-sm text-red-500 py-2 px-3 text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-gray-600 py-2 px-3 hover:text-primary font-medium">Sign In</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="text-sm text-gray-600 py-2 px-3 hover:text-primary font-medium">Create Account</Link>
                <Link href="/book" onClick={() => setOpen(false)} className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm text-center">Book a Viewing</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
