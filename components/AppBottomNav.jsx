import { useRouter } from 'next/router'
import Link from 'next/link'
import { appendAppMode } from '../lib/appMode'

const TABS = [
  { href: '/',           label: 'Home',       icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/properties', label: 'Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h-4' },
  { href: '/agents',      label: 'Agents',    icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-8 4 4 0 008 0zm6-3a4 4 0 00-3-3.87' },
  { href: '/brokers',     label: 'Brokers',   icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href: '/account',     label: 'Account',   icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function AppBottomNav() {
  const router = useRouter()
  const current = router.pathname

  return (
    <nav id="app-bottom-nav" style={{
      background: '#0a3d1f',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.25)',
    }}>
      {TABS.map(tab => {
        const isActive = current === tab.href ||
          (tab.href === '/properties' && current.startsWith('/property')) ||
          (tab.href === '/agents' && current === '/agents') ||
          (tab.href === '/brokers' && current.startsWith('/broker'))
        const color = isActive ? '#4ade80' : '#94a3b8'
        const a = appendAppMode(tab.href)
        return (
          <Link key={tab.href} href={a} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, height: 56,
            textDecoration: 'none', gap: 2,
            WebkitTapHighlightColor: 'transparent',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeWidth: isActive ? 2.5 : 2 }}>
              <path d={tab.icon} />
            </svg>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color, letterSpacing: '0.02em' }}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
