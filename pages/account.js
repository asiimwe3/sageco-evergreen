import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"
import SEO from '../components/SEO'

const PLAN_BADGE = {
  basic: "bg-gray-100 text-gray-600",
  pro: "bg-green-100 text-green-700",
  premium: "bg-yellow-100 text-yellow-700"
}

export default function Account() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [brokerInfo, setBrokerInfo] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [user, loading])

  useEffect(() => {
    if (!user || !profile) return
    loadData()
  }, [user, profile])

  async function loadData() {
    setDataLoading(true)
    // Load bookings for this user's email
    if (user?.email) {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false })
      setBookings(data || [])
    }
    // If broker, load broker profile
    if (profile?.role === "broker" && user?.email) {
      const { data } = await supabase
        .from("brokers")
        .select("*")
        .eq("email", user.email)
        .single()
      setBrokerInfo(data || null)
    }
    setDataLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const isExpired = brokerInfo?.plan_expires_at && new Date(brokerInfo.plan_expires_at) < new Date()
  const planName = brokerInfo?.plan ? (brokerInfo.plan.charAt(0).toUpperCase() + brokerInfo.plan.slice(1)) : "Basic"

  return (
    <>
      <SEO
        title="My Account - SAGECO EVERGREEN"
        description="Manage your SAGECO EVERGREEN account, view bookings, properties, and investments."
        keywords="SAGECO account, property dashboard Uganda"
        path="/account"
        noindex
      />

      {/* Header */}
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-2xl font-bold">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xl font-bold">{profile?.full_name || "My Account"}</p>
              <p className="text-green-200 text-sm">{user?.email}</p>
              <span className="text-xs bg-green-700 px-2 py-0.5 rounded-full capitalize">{profile?.role || "customer"}</span>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="border border-white text-white px-5 py-2 rounded-full font-bold hover:bg-white hover:text-primary transition text-sm">
            Sign Out
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* BROKER DASHBOARD */}
        {profile?.role === "broker" && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Broker Dashboard</h2>
            {!brokerInfo ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <p className="font-bold text-yellow-800 mb-2">Complete Your Broker Profile</p>
                <p className="text-yellow-700 text-sm mb-4">You&apos;re signed up as a broker but haven&apos;t registered your profile yet.</p>
                <Link href="/broker-register" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90 text-sm">
                  Register as Broker →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Plan</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${PLAN_BADGE[brokerInfo.plan || "basic"]}`}>
                    {planName}
                  </span>
                  {isExpired && <p className="text-red-500 text-xs mt-2">Plan expired!</p>}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                  <p className={`font-bold capitalize ${brokerInfo.registration_status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                    {brokerInfo.registration_status || "Pending"}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Plan Expires</p>
                  <p className="font-bold text-gray-700">
                    {brokerInfo.plan_expires_at ? new Date(brokerInfo.plan_expires_at).toLocaleDateString("en-GB") : "N/A"}
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              <Link href="/plans" className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90">
                {brokerInfo ? "Upgrade Plan" : "View Plans"}
              </Link>
              <Link href="/upload-property" className="border border-primary text-primary px-5 py-2 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition">
                List a Property
              </Link>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {profile?.role === "broker" ? "Your Property Bookings" : "My Property Viewings"}
          </h2>
          {dataLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="bg-white rounded-xl border p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center">
              <div className="text-4xl mb-3">🏡</div>
              <p className="text-gray-500 mb-4">No bookings yet.</p>
              <Link href="/properties" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-gray-800">{b.property_title || "Property Viewing"}</p>
                    <p className="text-sm text-gray-500">
                      {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString("en-GB") : "Date TBD"} ·
                      UGX {(b.total_amount || 30000).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">Ref: {b.reference}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" :
                    b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {(b.status || "pending").charAt(0).toUpperCase() + (b.status || "pending").slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK LINKS */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/properties", icon: "🏡", label: "Browse Properties" },
            { href: "/book", icon: "📅", label: "Book Viewing" },
            { href: "/plans", icon: "📋", label: "Subscription Plans" },
            { href: "/contact", icon: "💬", label: "Contact Support" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="bg-white rounded-xl border p-4 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{l.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{l.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
