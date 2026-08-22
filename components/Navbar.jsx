import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const PRIMARY_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/brokers",    label: "Brokers" },
  { href: "/invest",     label: "Invest" },
  { href: "/plans",      label: "Plans" },
  { href: "/projects",   label: "Projects" },
  { href: "/contact",    label: "Contact" },
]

const MORE_LINKS = [
  { href: "/gps-measure",   label: "GPS Measure" },
  { href: "/title-search",  label: "Title Search" },
  { href: "/agents",        label: "Agents" },
  { href: "/ai-broker",     label: "AI Broker" },
  { href: "/careers",       label: "Careers" },
  { href: "/valuation",     label: "Valuation" },
  { href: "/eco",           label: "Eco Scores" },
  { href: "/escrow",        label: "Escrow" },
  { href: "/verification",  label: "Verification" },
  { href: "/passports",     label: "Land Passports" },
  { href: "/matching",      label: "Property Matching" },
  { href: "/site-visits",   label: "Site Visits" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const isActive = (href) => router.pathname === href

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-green-100">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo — bigger */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.jpg" alt="Sageco Evergreen Ltd" className="h-14 w-14 object-contain rounded-full" />
          <span className="font-extrabold text-primary text-xl leading-tight hidden sm:block">
            SAGECO<br />
            <span className="text-green-600 text-sm font-semibold tracking-widest">EVERGREEN</span>
          </span>
        </Link>

        {/* Desktop nav — bigger text, bigger touch targets */}
        <div className="hidden lg:flex items-center gap-1">
          {PRIMARY_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-4 py-3 rounded-lg text-base font-semibold transition ${isActive(l.href) ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(o => !o)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
              className={`px-4 py-3 rounded-lg text-base font-semibold transition flex items-center gap-1 ${MORE_LINKS.some(l => isActive(l.href)) ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
            >
              More
              <svg className={`w-5 h-5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {MORE_LINKS.map(l => (
                  <Link key={l.href} href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-3 text-base font-medium transition ${isActive(l.href) ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auth + Quick contact — bigger, more prominent */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* WhatsApp quick button */}
          <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
            className="bg-green-500 text-white px-4 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition flex items-center gap-2 pulse-whatsapp">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span className="hidden xl:inline">WhatsApp</span>
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-sm bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold hover:bg-yellow-200 transition">Admin</Link>
              )}
              <Link href="/account"
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-200 hover:border-primary text-base font-medium text-gray-700 transition">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                {profile?.full_name?.split(' ')[0] || 'Account'}
              </Link>
              <button onClick={handleSignOut} className="text-base text-gray-400 hover:text-red-500 transition px-3">Sign out</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-base font-semibold text-gray-700 hover:text-primary px-4 py-3">Sign In</Link>
              <Link href="/book" className="bg-primary text-white px-6 py-3 rounded-full font-bold text-base hover:opacity-90 transition shadow-md">Book Viewing</Link>
            </>
          )}
        </div>

        {/* Mobile toggle — bigger */}
        <button className="lg:hidden p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition" onClick={() => setOpen(o => !o)}>
          {open ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu — bigger text, bigger touch targets */}
      {open && (
        <div className="lg:hidden bg-white border-t-2 border-green-100 px-4 pb-6 pt-3 max-h-[85vh] overflow-y-auto">
          {/* Quick contact bar for mobile */}
          <div className="flex gap-3 mb-4">
            <a href="tel:+256750414366" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-center text-base flex items-center justify-center gap-2">
              📞 Call Now
            </a>
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-center text-base flex items-center justify-center gap-2">
              💬 WhatsApp
            </a>
          </div>

          {PRIMARY_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block py-3.5 px-4 rounded-xl text-lg font-semibold transition ${isActive(l.href) ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider px-4 mb-2">More Features</p>
            {MORE_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`block py-3.5 px-4 rounded-xl text-lg font-medium transition ${isActive(l.href) ? 'text-primary bg-green-50' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="text-base bg-yellow-100 text-yellow-700 px-4 py-3 rounded-xl font-bold text-center">Admin Dashboard</Link>
                )}
                <Link href="/account" onClick={() => setOpen(false)} className="text-base text-gray-700 py-3 px-4 hover:text-primary font-semibold">My Account</Link>
                <button onClick={handleSignOut} className="text-base text-red-500 py-3 px-4 text-left font-semibold">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-base text-gray-700 py-3 px-4 hover:text-primary font-semibold">Sign In</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="text-base text-gray-700 py-3 px-4 hover:text-primary font-semibold">Create Account</Link>
                <Link href="/book" onClick={() => setOpen(false)} className="bg-primary text-white px-5 py-3.5 rounded-full font-bold text-base text-center shadow-md">Book a Viewing</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
