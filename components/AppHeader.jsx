import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { appendAppMode } from '../lib/appMode'

export default function AppHeader({ title, showBack = true, showSearch = true, showNotif = true }) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const isHome = router.pathname === '/'

  const aHref = (p) => appendAppMode(p)

  function handleBack() {
    if (window.history.length > 1) router.back()
    else router.push(aHref('/'))
  }

  function handleSearch(e) {
    e.preventDefault()
    if (q.trim()) {
      router.push(aHref(`/properties?search=${encodeURIComponent(q.trim())}`))
      setSearchOpen(false)
      setQ('')
    }
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 999,
      background: '#0a3d1f',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: 56 }}>

        {/* Back */}
        <div style={{ width: 40 }}>
          {showBack && !isHome && (
            <button onClick={handleBack} aria-label="Back" style={btn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Logo */}
        <Link href={aHref('/')} style={{ textDecoration: 'none', flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <img src="/logo.jpg" alt="Sageco Evergreen" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'contain' }} />
          <div style={{ lineHeight: 1.1, textAlign: 'left' }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '0.05em' }}>SAGECO</div>
            <div style={{ color: '#86efac', fontWeight: 600, fontSize: 9, letterSpacing: '0.2em' }}>EVERGREEN</div>
          </div>
        </Link>

        {/* Icons */}
        <div style={{ display: 'flex', gap: 4, width: 80, justifyContent: 'flex-end' }}>
          {showSearch && (
            <button onClick={() => setSearchOpen(v => !v)} aria-label="Search" style={btn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          )}
          {showNotif && (
            <Link href={aHref('/account')} style={{ display: 'flex' }}>
              <button style={btn} aria-label="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search properties, location…" autoFocus
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Go
            </button>
          </div>
        </form>
      )}
    </header>
  )
}

const btn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 38, height: 38, borderRadius: '50%',
  background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
}
