import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/properties", label: "Properties", icon: "🏠" },
  { href: "/admin/brokers", label: "Brokers", icon: "👥" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/applications", label: "Applications", icon: "📋" },
  { href: "/admin/messages", label: "Messages", icon: "💬" },
  { href: "/admin/officers", label: "Officers", icon: "👮" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: "💳" },
  { href: "/admin/fraud", label: "Fraud Check", icon: "🛡️" },
]

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform z-40`}>
        <div className="p-5 border-b border-gray-700">
          <Link href="/admin" className="font-bold text-lg">SAGECO Admin</Link>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${router.pathname === item.href ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-x-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden text-gray-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">← Back to site</Link>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Helper: get admin secret from a secure source (not NEXT_PUBLIC)
// The client-side admin pages should pass this via headers to API routes.
// For now, admin pages read it from a session-based approach or prompt for it.
export function getAdminSecret() {
  if (typeof window === 'undefined') return ''
  // Read from sessionStorage — set during admin login
  return sessionStorage.getItem('sageco_admin_secret') || ''
}
