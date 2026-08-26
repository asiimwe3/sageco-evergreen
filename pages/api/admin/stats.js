import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Unauthorized" })

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
