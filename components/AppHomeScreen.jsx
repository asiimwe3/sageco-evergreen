import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { appendAppMode } from '../lib/appMode'
import { useAuth } from '../context/AuthContext'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
const INVEST_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop'

const CATEGORIES = [
  { icon: '🌳', color: '#16a34a', bg: '#dcfce7', label1: 'All', label2: 'Properties', href: '/properties' },
  { icon: '🏠', color: '#dc2626', bg: '#fee2e2', label1: 'Residential', label2: 'Homes', href: '/properties?category=Residential' },
  { icon: '🏢', color: '#2563eb', bg: '#dbeafe', label1: 'Commercial', label2: 'Spaces', href: '/properties?category=Commercial' },
  { icon: '📍', color: '#16a34a', bg: '#dcfce7', label1: 'Land', label2: '& Plots', href: '/properties?category=Land' },
  { icon: '📐', color: '#2563eb', bg: '#dbeafe', label1: 'Plot', label2: 'For Sale', href: '/properties?category=Plot' },
  { icon: '🌱', color: '#16a34a', bg: '#dcfce7', label1: 'Green', label2: 'Projects', href: '/eco' },
  { icon: '✨', color: '#d97706', bg: '#fef3c7', label1: 'New', label2: 'Listings', href: '/properties?sort=newest' },
  { icon: '⭐', color: '#ca8a04', bg: '#fef9c3', label1: 'Featured', label2: 'Properties', href: '/properties?featured=true' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatPrice(price) {
  const n = Number(price || 0)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function isRecent(dateStr) {
  if (!dateStr) return false
  const created = new Date(dateStr).getTime()
  return Date.now() - created < 14 * 24 * 60 * 60 * 1000
}

export default function AppHomeScreen({ featured = [] }) {
  const router = useRouter()
  const { user } = useAuth ? useAuth() : { user: null }
  const [q, setQ] = useState('')
  const [liked, setLiked] = useState({})
  const aHref = (p) => appendAppMode(p)
  const firstName = user && user.user_metadata && user.user_metadata.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : (user && user.email ? user.email.split('@')[0] : null)

  function handleSearch(e) {
    e.preventDefault()
    router.push(aHref(q.trim() ? `/properties?search=${encodeURIComponent(q.trim())}` : '/properties'))
  }

  function toggleLike(id) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero — edge-to-edge photo with overlay */}
      <div style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}>
        <img src={HERO_IMAGE} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(5,20,10,0.72) 0%, rgba(5,20,10,0.45) 35%, rgba(5,20,10,0.75) 100%)',
        }} />

        <div style={{ position: 'relative', padding: '18px 16px 0' }}>
          {/* Top bar: logo + quick actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href={aHref('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img src="/logo.jpg" alt="Sageco Evergreen" style={{
                width: 38, height: 38, borderRadius: '50%', objectFit: 'contain', background: '#fff', border: '2px solid rgba(255,255,255,0.9)',
              }} />
              <div style={{ lineHeight: 1.05 }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '0.03em' }}>SAGECO</div>
                <div style={{ color: '#86efac', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em' }}>EVERGREEN</div>
              </div>
            </Link>

            <div style={{ display: 'flex', gap: 8 }}>
              <Link href={aHref('/account')} aria-label="Notifications" style={iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Link>
              <Link href={aHref('/ai-broker')} aria-label="Chat with AI Broker" style={iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Greeting */}
          <p style={{ color: '#e5f5ea', fontSize: 15, fontWeight: 600, margin: '22px 0 4px' }}>
            {greeting()}{firstName ? `, ${firstName}` : ''} 👋
          </p>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            Find Your Perfect <span style={{ color: '#4ade80' }}>Property</span>
          </h1>
          <p style={{ color: '#dcfce7', fontSize: 14, margin: 0, maxWidth: 300 }}>
            Secure, verified properties across Uganda.
          </p>
        </div>

        {/* Search bar — overlaps the bottom edge of the hero */}
        <form onSubmit={handleSearch} style={{
          position: 'absolute', left: 16, right: 16, bottom: -26,
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 999, padding: '6px 6px 6px 18px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, location, or keyword..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, padding: '10px 0', background: 'transparent', color: '#111827' }}
          />
          <Link href={aHref('/properties')} aria-label="Filters" style={{
            width: 40, height: 40, borderRadius: '50%', background: '#0a3d1f',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="white" />
              <line x1="4" y1="12" x2="20" y2="12" /><circle cx="16" cy="12" r="2" fill="white" />
              <line x1="4" y1="18" x2="20" y2="18" /><circle cx="11" cy="18" r="2" fill="white" />
            </svg>
          </Link>
        </form>
      </div>

      {/* spacer for the overlapping search bar */}
      <div style={{ height: 40 }} />

      {/* Browse by category */}
      <div style={{ padding: '4px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>Browse by Category</h2>
        <Link href={aHref('/properties')} style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
          View All ›
        </Link>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        padding: '10px 16px 4px',
      }}>
        {CATEGORIES.map((c) => (
          <Link key={c.label1} href={aHref(c.href)} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '14px 6px 12px', textAlign: 'center',
              border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 19, margin: '0 auto 8px',
              }}>
                {c.icon}
              </div>
              <div style={{ color: '#111827', fontSize: 11.5, fontWeight: 700, lineHeight: 1.25 }}>{c.label1}</div>
              <div style={{ color: '#9ca3af', fontSize: 10.5, fontWeight: 500 }}>{c.label2}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Invest banner */}
      <div style={{ padding: '16px 16px 6px' }}>
        <Link href={aHref('/properties')} style={{ textDecoration: 'none' }}>
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 150,
            background: 'linear-gradient(135deg, #0a3d1f 0%, #0f2e1c 100%)',
            display: 'flex', alignItems: 'stretch',
          }}>
            <div style={{ flex: '1 1 58%', padding: '18px 6px 18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: 19, fontWeight: 800, margin: '0 0 2px', lineHeight: 1.25 }}>
                Invest Today,<br /><span style={{ color: '#4ade80' }}>Build Tomorrow</span>
              </h3>
              <p style={{ color: '#bbf7d0', fontSize: 12, margin: '6px 0 14px', lineHeight: 1.4 }}>
                Join Ugandans building wealth through real estate.
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
                background: '#22c55e', color: '#052e13', fontWeight: 700, fontSize: 12.5,
                padding: '9px 14px', borderRadius: 999,
              }}>
                Explore Properties
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#16a34a',
                }}>→</span>
              </span>
            </div>
            <div style={{ position: 'relative', flex: '0 0 42%' }}>
              <img src={INVEST_IMAGE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', bottom: 8, left: 6, right: 6,
                background: 'rgba(255,255,255,0.95)', borderRadius: 999,
                fontSize: 9.5, fontWeight: 700, color: '#0a3d1f', textAlign: 'center', padding: '4px 4px',
              }}>
                ✅ Verified & Secure
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Featured Properties */}
      <div style={{ padding: '20px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>Featured Properties</h2>
        <Link href={aHref('/properties?featured=true')} style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          See All ›
        </Link>
      </div>

      {featured.length === 0 ? (
        <div style={{ margin: '0 16px 28px', padding: 24, background: '#f0fdf4', borderRadius: 16, textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 12 }}>No featured properties yet.</p>
          <Link href={aHref('/properties')} style={{
            display: 'inline-block', background: '#0a3d1f', color: '#fff', fontWeight: 700,
            padding: '10px 20px', borderRadius: 999, textDecoration: 'none', fontSize: 13,
          }}>
            Browse All Properties
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 28px',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        }}>
          {featured.slice(0, 8).map((p) => {
            const badge = p.featured ? { text: 'FEATURED', bg: '#16a34a' } : isRecent(p.created_date) ? { text: 'NEW', bg: '#2563eb' } : null
            return (
              <div key={p.id} style={{
                position: 'relative', flex: '0 0 190px', scrollSnapAlign: 'start',
                borderRadius: 16, overflow: 'hidden', background: '#fff',
                border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <Link href={aHref(`/property/${p.id}`)} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', height: 112, background: '#e5e7eb' }}>
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.title || 'Property'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#9ca3af' }}>🏠</div>
                    )}
                    {badge && (
                      <span style={{
                        position: 'absolute', top: 8, left: 8, background: badge.bg, color: '#fff',
                        fontSize: 9.5, fontWeight: 800, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 999,
                      }}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  aria-label="Save property"
                  onClick={() => toggleLike(p.id)}
                  style={{
                    position: 'absolute', top: 90, right: 8, width: 26, height: 26, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={liked[p.id] ? '#ef4444' : 'none'} stroke={liked[p.id] ? '#ef4444' : '#6b7280'} strokeWidth="2.3">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <Link href={aHref(`/property/${p.id}`)} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title || 'Untitled Property'}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>📍 {p.location || 'Uganda'}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0a3d1f' }}>UGX {formatPrice(p.price)}</div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
}
