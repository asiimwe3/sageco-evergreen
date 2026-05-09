import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-secondary">SAGECO EVERGREEN</Link>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-secondary">Home</Link>
          <Link href="/properties" className="hover:text-secondary">Properties</Link>
          <Link href="/brokers" className="hover:text-secondary">Brokers</Link>
          <Link href="/projects" className="hover:text-secondary">Green Projects</Link>
          <Link href="/careers" className="hover:text-secondary">Careers</Link>
          <Link href="/contact" className="hover:text-secondary">Contact</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl">☰</button>
      </div>
      {open && (
        <div className="md:hidden bg-dark px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/properties" onClick={() => setOpen(false)}>Properties</Link>
          <Link href="/brokers" onClick={() => setOpen(false)}>Brokers</Link>
          <Link href="/projects" onClick={() => setOpen(false)}>Green Projects</Link>
          <Link href="/careers" onClick={() => setOpen(false)}>Careers</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  )
}
