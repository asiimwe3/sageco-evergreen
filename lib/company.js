/**
 * SAGECO EVERGREEN — Shared company constants
 * Import from here instead of duplicating across API routes and pages.
 */

export const COMPANY = {
  name: "SAGECO EVERGREEN CO. LTD",
  location: "Kyenjojo, Western Uganda",
  phone: "0750 414 366 (WhatsApp)",
  phone2: "0782 067 425",
  phone3: "0772 002 326 (WhatsApp)",
  email: "sagecoevergreen@gmail.com",
  hours: "Monday-Saturday, 8:00 AM - 6:00 PM EAT",
  about: "We are a premier real estate platform connecting property buyers, sellers, and renters with verified brokers across Uganda.",
}

export const BOOKING = {
  cost: "UGX 30,000 total (UGX 10,000 service fee + UGX 20,000 to broker)",
  payment: "MTN Mobile Money, Airtel Money, or bank card via PesaPal",
  url: "/book",
}

export const BROKER_INFO = {
  regFee: "UGX 32,000 (one-time)",
  activationFee: "UGX 45,000 (monthly dashboard)",
  url: "/broker-register",
}

export const PLANS = [
  { name: "Free", price: "UGX 0", listings: 3 },
  { name: "Basic", price: "UGX 15,000/month", listings: 10 },
  { name: "Pro", price: "UGX 25,000/month", listings: 50 },
  { name: "Premium", price: "UGX 30,000/month", listings: "Unlimited" },
]

/**
 * Verify a Supabase auth token from the Authorization header.
 * Returns { user, error } — user is null if invalid.
 */
export async function verifyAuth(authHeader, supabaseUrl, supabaseKey) {
  if (!authHeader) return { user: null, error: "No auth header" }
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: authHeader }
    })
    if (!res.ok) return { user: null, error: "Invalid token" }
    const user = await res.json()
    return { user, error: null }
  } catch (e) {
    return { user: null, error: "Auth verification failed" }
  }
}

/**
 * Check admin secret from request headers.
 */
export function checkAdminSecret(req) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return false
  }
  return true
}
