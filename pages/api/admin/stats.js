import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()
  const [props, brokers, bookings, apps, msgs, officers, subs] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("brokers").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("job_applications").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("officers").select("id", { count: "exact", head: true }),
    supabase.from("brokers").select("id", { count: "exact", head: true }).neq("plan", "free"),
  ])
  return res.status(200).json({
    properties: props.count || 0,
    brokers: brokers.count || 0,
    bookings: bookings.count || 0,
    applications: apps.count || 0,
    messages: msgs.count || 0,
    officers: officers.count || 0,
    subscriptions: subs.count || 0,
  })
}
