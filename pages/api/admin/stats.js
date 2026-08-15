import { createClient } from "@supabase/supabase-js"
const supabase = createClient("https://eiyexnuhqdscomilwpqg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc")
const ADMIN_SECRET = process.env.ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()

  const [props, brokers, bookings, apps, msgs, officers, subs] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("brokers").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("*"),
    supabase.from("job_applications").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("officers").select("id", { count: "exact", head: true }),
    supabase.from("brokers").select("id", { count: "exact", head: true }).neq("plan", "free"),
  ])

  // Calculate revenue from bookings
  const allBookings = bookings.data || []
  const confirmedBookings = allBookings.filter(b => b.status === "confirmed" || b.status === "completed")
  const pendingBookings = allBookings.filter(b => b.status === "pending")
  const totalRevenue = confirmedBookings.reduce((s, b) => s + (b.total_amount || 0), 0)
  const businessRevenue = confirmedBookings.reduce((s, b) => s + (b.business_share || 0), 0)
  const brokerRevenue = confirmedBookings.reduce((s, b) => s + (b.broker_share || 0), 0)
  const pendingRevenue = pendingBookings.reduce((s, b) => s + (b.total_amount || 0), 0)

  // Booking type breakdown
  const typeBreakdown = allBookings.reduce((acc, b) => {
    const type = b.booking_type || "viewing"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Unread messages count
  const unreadMessages = await supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread")

  return res.status(200).json({
    properties: props.count || 0,
    brokers: brokers.count || 0,
    bookings: bookings.count || 0,
    applications: apps.count || 0,
    messages: msgs.count || 0,
    officers: officers.count || 0,
    subscriptions: subs.count || 0,
    // Enhanced stats
    totalRevenue,
    businessRevenue,
    brokerRevenue,
    pendingRevenue,
    pendingBookings: pendingBookings.length,
    confirmedBookings: confirmedBookings.length,
    bookingTypes: typeBreakdown,
    unreadMessages: unreadMessages.count || 0,
  })
}
