import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { appendAppMode } from '../lib/appMode'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { icon: '🏡', label: 'All', href: '/properties' },
  { icon: '🏠', label: 'Residential', href: '/properties?category=Residential' },
  { icon: '🏢', label: 'Commercial', href: '/properties?category=Commercial' },
  { icon: '🗺️', label: 'Land', href: '/properties?category=Land' },
  { icon: '📐', label: 'Plot', href: '/properties?category=Plot' },
  { icon: '🌿', label: 'Green Project', href: '/eco' },
  { icon: '✨', label: 'New Listings', href: '/properties?sort=newest' },
  { icon: '⭐', label: 'Featured', href: '/properties?featured=true' },
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

export default function AppHomeScreen({ featured = [] }) {
  const router = useRouter()
  const { user } = useAuth ? useAuth() : { user: null }
  const [q, setQ] = useState('')
  const aHref = (p) => appendAppMode(p)
  const firstName = user && user.user_metadata && user.user_metadata.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : null

  function handleSearch(e) {
    e.preventDefault()
    router.push(aHref(q.trim() ? `/properties?search=${encodeURIComponent(q.trim())}` : '/properties'))
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Greeting */}
      <div style={{ padding: '20px 16px 4px' }}>
        <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600, margin: 0 }}>
          {greeting()}{firstName ? `, ${firstName}` : ''},
        </p>
        <h1 style={{ color: '#111827', fontSize: 24, fontWeight: 800, margin: '2px 0 6px' }}>
          Welcome Back!
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
          Find the perfect property for your future.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ padding: '14px 16px 4px', display: 'flex', gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, location, or description..."
          style={{
            flex: 1, border: '1px solid #e5e7eb', borderRadius: 999,
            padding: '12px 18px', fontSize: 14, outline: 'none', background: '#f9fafb',
          }}
        />
        <button
          type="submit"
          aria-label="Search"
          style={{
            width: 44, height: 44, borderRadius: '50%', background: '#0a3d1f',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {/* Category grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 4px',
        padding: '18px 16px 6px',
      }}>
        {CATEGORIES.map((c) => (
          <Link key={c.label} href={aHref(c.href)} style={{ textDecoration: 'none', textAlign: 'center' }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%', background: '#0a3d1f',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, margin: '0 auto 6px', boxShadow: '0 2px 6px rgba(10,61,31,0.25)',
            }}>
              {c.icon}
            </div>
            <div style={{ color: '#374151', fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Invest banner */}
      <div style={{ padding: '14px 16px 6px' }}>
        <Link href={aHref('/properties')} style={{ textDecoration: 'none' }}>
          <div style={{
            position: 'relative', borderRadius: 18, overflow: 'hidden', minHeight: 140,
            background: 'linear-gradient(135deg, #0a3d1f 0%, #1a6b3c 100%)',
            padding: '20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>
              Invest Today<br />Build Tomorrow
            </h3>
            <p style={{ color: '#d1fae5', fontSize: 13, margin: '0 0 14px' }}>
              Secure, verified properties across Uganda.
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
              background: '#22c55e', color: '#052e13', fontWeight: 700, fontSize: 13,
              padding: '9px 16px', borderRadius: 999,
            }}>
              View Properties →
            </span>
          </div>
        </Link>
      </div>

      {/* Featured Properties */}
      <div style={{ padding: '18px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0 }}>Featured Properties</h2>
        <Link href={aHref('/properties?featured=true')} style={{ color: '#0a3d1f', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          See All
        </Link>
      </div>

      {featured.length === 0 ? (
        <div style={{ margin: '0 16px 24px', padding: 24, background: '#f0fdf4', borderRadius: 16, textAlign: 'center' }}>
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
          display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 24px',
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        }}>
          {featured.slice(0, 8).map((p) => (
            <Link key={p.id} href={aHref(`/property/${p.id}`)} style={{
              flex: '0 0 200px', scrollSnapAlign: 'start', textDecoration: 'none',
              borderRadius: 16, overflow: 'hidden', background: '#fff',
              border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ position: 'relative', height: 120, background: '#e5e7eb' }}>
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.title || 'Property'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#9ca3af' }}>🏠</div>
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title || 'Untitled Property'}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>📍 {p.location || 'Uganda'}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0a3d1f' }}>UGX {formatPrice(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
