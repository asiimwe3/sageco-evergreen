import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const links = [
    { href: '/properties', label: 'Properties' },
    { href: '/brokers', label: 'Brokers' },
    { href: '/plans', label: 'Plans' },
    { href: '/projects', label: 'Green Projects' },
    { href: '/careers', label: 'Careers' },
    { href: '/docs', label: 'Docs' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="SAGECO EVERGREEN Logo" width={48} height={48} className="rounded-full object-contain" priority />
          <span className="text-xl font-bold text-primary hidden sm:block">SAGECO <span className="text-secondary">EVERGREEN</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-gray-600 hover:text-primary font-medium">{l.label}</Link>
          ))}
          <Link href="/book" className="bg-primary text-white px-5 py-2 rounded-full hover:opacity-90 font-bold">Book Viewing</Link>
          {user ? (
            <Link href="/account" className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {(profile?.full_name || user.email)?.[0]?.toUpperCase()}
              </span>
              Account
            </Link>
          ) : (
            <Link href="/login" className="border border-primary text-primary px-4 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition">
              Sign In
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">☰</button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="block text-gray-700 font-medium" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/book" className="block bg-primary text-white text-center py-2 rounded-full font-bold" onClick={() => setOpen(false)}>Book Viewing</Link>
          {user ? (
            <Link href="/account" className="block border border-primary text-primary text-center py-2 rounded-full font-bold" onClick={() => setOpen(false)}>My Account</Link>
          ) : (
            <>
              <Link href="/login" className="block border border-primary text-primary text-center py-2 rounded-full font-bold" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/signup" className="block bg-green-50 text-primary text-center py-2 rounded-full font-bold" onClick={() => setOpen(false)}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
