import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/properties', label: 'Properties' },
    { href: '/brokers', label: 'Brokers' },
    { href: '/projects', label: 'Green Projects' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ]
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="SAGECO EVERGREEN Logo" width={48} height={48} className="rounded-full object-contain" priority />
          <span className="text-xl font-bold text-primary hidden sm:block">SAGECO <span className="text-secondary">EVERGREEN</span></span>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          {links.map(l => <Link key={l.href} href={l.href} className="text-gray-600 hover:text-primary font-medium">{l.label}</Link>)}
          <Link href="/book" className="bg-primary text-white px-5 py-2 rounded-full hover:opacity-90 font-bold">Book Viewing</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">☰</button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map(l => <Link key={l.href} href={l.href} className="block text-gray-700 font-medium" onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link href="/book" className="block bg-primary text-white text-center py-2 rounded-full font-bold" onClick={() => setOpen(false)}>Book Viewing</Link>
        </div>
      )}
    </nav>
  )
}
