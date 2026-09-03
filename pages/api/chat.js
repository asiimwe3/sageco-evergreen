// SAGECO EVERGREEN — Local Chatbot (no LLM, no external API)
// Trained on app data: properties, brokers, FAQ, company info
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

// ── Company knowledge base ──────────────────────────────────────────
const COMPANY = {
  name: "SAGECO EVERGREEN CO. LTD",
  location: "Kyenjojo, Western Uganda",
  phone: "0750 414 366 (WhatsApp)",
  phone2: "0782 067 425",
  phone3: "0772 002 326 (WhatsApp)",
  email: "sagecoevergreen@gmail.com",
  website: SITE_URL,
  hours: "Monday–Saturday, 8:00 AM – 6:00 PM EAT",
  about: "We are a premier real estate platform connecting property buyers, sellers, and renters with verified brokers across Uganda. We specialize in residential homes, commercial spaces, land, and eco-friendly green developments.",
}

const BOOKING_INFO = {
  cost: "UGX 30,000 total",
  breakdown: "UGX 10,000 to SAGECO EVERGREEN (service fee) + UGX 20,000 to the assigned broker",
  payment: "MTN Mobile Money, Airtel Money, or bank card via PesaPal",
  afterPay: "Your booking is confirmed automatically. The assigned broker will contact you within 24 hours to arrange the viewing.",
  refund: "Bookings are non-refundable once the broker has been notified. To reschedule, WhatsApp 0750 414 366 within 24 hours of booking.",
  url: "/book",
}

const PLANS = [
  { name: "Free", price: "UGX 0", listings: 3, expiry: "No expiry" },
  { name: "Basic", price: "UGX 15,000/month", listings: 10, expiry: "Monthly" },
  { name: "Pro", price: "UGX 25,000/month", listings: 50, expiry: "Monthly" },
  { name: "Premium", price: "UGX 30,000/month", listings: "Unlimited", expiry: "Monthly" },
]

const BROKER_INFO = {
  registration: "Visit /broker-register, fill in your details, upload a profile photo, and pay the registration fee via PesaPal.",
  regFee: "UGX 32,000 (one-time)",
  activationFee: "UGX 45,000 (monthly dashboard subscription)",
  earnings: "UGX 20,000 per confirmed viewing booking",
  payout: "Broker earnings are paid out weekly via Mobile Money. Ensure your phone number is registered in your broker profile.",
  agentEarnings: "UGX 5,000 per direct recruit + UGX 2,000 per indirect recruit (Level 2)",
  withdrawal: "Agents can withdraw earnings via Mobile Money, Bank Transfer, or Cash Pickup. Minimum withdrawal is UGX 1,000. Go to your Agent Dashboard and click Withdraw Funds.",
  withdrawalTime: "Withdrawals are processed within 24-48 hours after admin approval.",
  reviewTime: "Within 48 hours",
}

// FAQ knowledge base for keyword matching
const FAQ = [
  { keywords: ["book", "viewing", "view", "visit", "inspection", "site visit"], answer: () =>
    `Booking a Property Viewing\n\n` +
    `Cost: ${BOOKING_INFO.cost}\n` +
    `Breakdown: ${BOOKING_INFO.breakdown}\n` +
    `Payment: ${BOOKING_INFO.payment}\n\n` +
    `${BOOKING_INFO.afterPay}\n\n` +
    `Book here: ${SITE_URL}/book` },
  { keywords: ["pay", "payment", "mtn", "airtel", "mobile money", "card", "pesapal"], answer: () =>
    `Payment Methods\n\n` +
    `We accept:\n` +
    `1. MTN Mobile Money\n` +
    `2. Airtel Money\n` +
    `3. Bank cards (Visa/Mastercard)\n\n` +
    `All payments are processed securely through PesaPal.` },
  { keywords: ["refund", "cancel", "reschedule", "money back"], answer: () =>
    `Refund & Cancellation Policy\n\n` +
    `${BOOKING_INFO.refund}\n\n` +
    `WhatsApp us: 0750 414 366` },
  { keywords: ["list property", "upload property", "sell property", "add property", "list my", "post property"], answer: () =>
    `Listing a Property\n\n` +
    `Go to ${SITE_URL}/upload-property, fill in the property details, upload photos, and submit.\n\n` +
    `Our team reviews and publishes listings within 24 hours. All listings are verified for ownership and accuracy.` },
  { keywords: ["verified", "legit", "genuine", "scam", "trust", "authentic"], answer: () =>
    `Property Verification\n\n` +
    `Yes — every property is reviewed by our team before going live. We verify ownership documents and ensure listing accuracy. Once a property is sold or rented, it's automatically removed.` },
  { keywords: ["negotiate", "negotiable", "bargain", "reduce price", "discount"], answer: () =>
    `Price Negotiation\n\n` +
    `Properties marked "Negotiable" allow price discussion. Contact the broker directly or book a consultation for price negotiations.\n\n` +
    `Book a consultation: ${SITE_URL}/book` },
  { keywords: ["agent", "mlm", "register agent", "become agent", "agent reg", "join agent", "recruit", "downline", "sponsor"], answer: () =>
    `SAGECO Agent Program (MLM)\n\n` +
    `Become a SAGECO Agent and build your own broker network!\n\n` +
    `Registration: ${BROKER_INFO.agentReg}\n` +
    `Earnings: ${BROKER_INFO.agentEarnings}\n\n` +
    `How it works:\n1. Register as an agent (UGX 30,000)\n2. Create your group\n3. Recruit brokers using your referral link\n4. Earn commissions on every recruit\n5. Withdraw earnings to Mobile Money\n\n` +
    `Register: ${SITE_URL}/agents\n` +
    `Dashboard: ${SITE_URL}/agents (login with your Agent ID)` },
  { keywords: ["broker reg", "register as broker", "become broker", "join as broker", "register broker", "how to broker"], answer: () =>
    `Broker Registration\n\n` +
    `${BROKER_INFO.registration}\n\n` +
    `Fees:\n` +
    `1. Registration: ${BROKER_INFO.regFee} (one-time)\n` +
    `2. Dashboard activation: ${BROKER_INFO.activationFee}\n\n` +
    `Earnings: ${BROKER_INFO.earnings}\n` +
    `Review time: ${BROKER_INFO.reviewTime}\n\n` +
    `Register here: ${SITE_URL}/broker-register` },
  { keywords: ["plan", "subscription", "pricing", "broker plan", "listing limit", "how much broker"], answer: () =>
    `Broker Subscription Plans\n\n` +
    PLANS.map((p, i) => `${i + 1}. ${p.name}: ${p.price} — ${p.listings} listings (${p.expiry})`).join("\n") +
    `\n\nSubscribe here: ${SITE_URL}/plans` },
  { keywords: ["withdraw", "withdrawal", "cash out", "cashout", "pull out", "payout method"], answer: () =>
    `Agent Withdrawals\n\n` +
    `${BROKER_INFO.withdrawal}\n\n` +
    `Methods:\n1. Mobile Money (MTN/Airtel)\n2. Bank Transfer\n3. Cash Pickup (Office)\n\n` +
    `Processing time: ${BROKER_INFO.withdrawalTime}\n` +
    `Dashboard: ${SITE_URL}/agents` },
  { keywords: ["earn", "income", "commission", "broker pay", "paid", "payout", "agent pay", "agent earn", "how much agent", "agent income"], answer: () =>
    `Earnings & Withdrawals\n\n` +
    `Broker Earnings:\n` +
    `You earn ${BROKER_INFO.earnings}.\n` +
    `${BROKER_INFO.payout}\n\n` +
    `Agent MLM Earnings:\n` +
    `Direct recruit: ${BROKER_INFO.agentEarnings}\n\n` +
    `To withdraw your earnings:\n` +
    `${BROKER_INFO.withdrawal}` },
  { keywords: ["career", "job open", "opening", "vacancy", "employment", "work for", "hire"], answer: () =>
    `Career Opportunities\n\n` +
    `Check our careers page for current openings: ${SITE_URL}/careers\n\n` +
    `You can also submit a job application through the site.` },
  { keywords: ["green", "eco", "environment", "sustainable"], answer: () =>
    `Green/Eco-Friendly Projects\n\n` +
    `SAGECO EVERGREEN specializes in eco-friendly developments including green housing and sustainable land projects. Check our properties page and filter by "Green Project" category.\n\n` +
    `Browse: ${SITE_URL}/properties?category=Green+Project` },
  { keywords: ["password", "reset password", "forgot"], answer: () =>
    `Password Reset\n\n` +
    `Go to ${SITE_URL}/login and click "Forgot Password". Enter your email and we'll send you a reset link.` },
  { keywords: ["google", "sign in", "login", "account", "sign up"], answer: () =>
    `Account Access\n\n` +
    `Both the login and signup pages support Google Sign-In for quick access.\n\n` +
    `Login: ${SITE_URL}/login\n` +
    `Sign up: ${SITE_URL}/signup` },
  { keywords: ["contact", "phone", "call", "email", "reach", "whatsapp", "talk to", "speak"], answer: () =>
    `Contact SAGECO EVERGREEN\n\n` +
    `Phone/WhatsApp: ${COMPANY.phone}\n` +
    `Alt: ${COMPANY.phone2} / ${COMPANY.phone3}\n` +
    `Email: ${COMPANY.email}\n` +
    `Hours: ${COMPANY.hours}\n` +
    `Location: ${COMPANY.location}\n\n` +
    `Contact form: ${SITE_URL}/contact` },
  { keywords: ["location", "where", "address", "office", "based", "situated"], answer: () =>
    `Our Location\n\n` +
    `SAGECO EVERGREEN is based in ${COMPANY.location}. We serve clients across the entire country.\n\n` +
    `Phone: ${COMPANY.phone}\n` +
    `Email: ${COMPANY.email}` },
  { keywords: ["about", "company", "who are you", "what is sageco", "what do you do"], answer: () =>
    `About SAGECO EVERGREEN\n\n` +
    `${COMPANY.about}\n\n` +
    `Location: ${COMPANY.location}\n` +
    `Phone: ${COMPANY.phone}\n` +
    `Website: ${SITE_URL}` },
  { keywords: ["hours", "open", "closed", "working hours", "available"], answer: () =>
    `Working Hours\n\n` +
    `${COMPANY.hours}\n\n` +
    `The chatbot is available 24/7 for instant answers!` },
]

// ── Intent detection helpers ─────────────────────────────────────────
function normalize(text) {
  return text.toLowerCase().trim()
}

function contains(text, keywords) {
  return keywords.some(kw => text.includes(kw))
}

function formatPrice(price) {
  if (!price || price === 0) return "Price on request"
  return `UGX ${Number(price).toLocaleString()}`
}

function formatProperty(p, index) {
  let line = `${index}. ${p.title}`
  line += `\n   Location: ${p.location || "N/A"}`
  line += `\n   Price: ${formatPrice(p.price)}`
  line += `\n   Category: ${p.category || "N/A"}`
  if (p.bedrooms) line += `\n   Bedrooms: ${p.bedrooms}`
  if (p.bathrooms) line += `\n   Bathrooms: ${p.bathrooms}`
  if (p.area_sqft) line += `\n   Area: ${p.area_sqft} sqft`
  if (p.description) {
    const desc = p.description.length > 120 ? p.description.slice(0, 120) + "..." : p.description
    line += `\n   ${desc}`
  }
  line += `\n   View: ${SITE_URL}/property/${p.id}`
  return line
}

// ── Main handler ────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { message, history = [] } = req.body
  if (!message) return res.status(400).json({ error: "Message required" })

  const msg = normalize(message)

  try {
    // Fetch app data — use allSettled so one failed query doesn't crash everything
    const results = await Promise.allSettled([
      supabaseAdmin
        .from("properties")
        .select("id, title, location, price, category, status, bedrooms, bathrooms, area_sqft, description")
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseAdmin
        .from("brokers")
        .select("full_name, phone, email, specialization, location, plan, registration_status")
        .eq("registration_status", "approved")
        .limit(20),
      supabaseAdmin
        .from("officers")
        .select("full_name, role, department, bio")
        .eq("status", "active")
        .limit(10),
      supabaseAdmin
        .from("job_applications")
        .select("job_title, department")
        .limit(10),
    ])

    const properties = results[0].status === "fulfilled" ? (results[0].value.data || []) : []
    const brokers = results[1].status === "fulfilled" ? (results[1].value.data || []) : []
    const officers = results[2].status === "fulfilled" ? (results[2].value.data || []) : []
    const applications = results[3].status === "fulfilled" ? (results[3].value.data || []) : []

    const availableProperties = properties.filter(p => p.status === "available")
    const approvedBrokers = brokers
    const openJobs = [...new Set(applications.map(a => `${a.job_title} (${a.department})`))]

    let reply = ""

    // ── PROPERTY SEARCH ──
    if (contains(msg, ["property", "properties", "land", "house", "home", "plot", "apartment", "show available", "listings", "buy"])) {

      let filtered = availableProperties
      let categoryMatch = false

      if (contains(msg, ["residential", "house", "home", "apartment", "villa", "family home"])) {
        filtered = availableProperties.filter(p => (p.category || "").toLowerCase().includes("resident"))
        categoryMatch = true
      } else if (contains(msg, ["commercial", "office", "retail", "warehouse", "shop"])) {
        filtered = availableProperties.filter(p => (p.category || "").toLowerCase().includes("commerc"))
        categoryMatch = true
      } else if (contains(msg, ["land", "plot", "acre", "farm"])) {
        filtered = availableProperties.filter(p => (p.category || "").toLowerCase().includes("land") || (p.category || "").toLowerCase().includes("plot"))
        categoryMatch = true
      } else if (contains(msg, ["green", "eco", "environment"])) {
        filtered = availableProperties.filter(p => (p.category || "").toLowerCase().includes("green"))
        categoryMatch = true
      }

      // Check for location filter
      const locations = ["kyenjojo", "kampala", "mpunda", "katooke", "butunduzi", "fort portal", "mubende"]
      for (const loc of locations) {
        if (msg.includes(loc)) {
          const locFiltered = filtered.filter(p => (p.location || "").toLowerCase().includes(loc))
          if (locFiltered.length > 0) filtered = locFiltered
          break
        }
      }

      // Check for price range
      const priceMatch = msg.match(/(\d+)\s*(million|m|000)/i)
      if (priceMatch) {
        let maxPrice = parseInt(priceMatch[1])
        if (msg.includes("million") || (priceMatch[0].includes("m") && !priceMatch[0].includes("000"))) maxPrice *= 1000000
        const priceFiltered = filtered.filter(p => p.price > 0 && p.price <= maxPrice)
        if (priceFiltered.length > 0) filtered = priceFiltered
      }

      if (filtered.length > 0) {
        const count = Math.min(filtered.length, 5)
        reply = `Available Properties (${filtered.length} found${categoryMatch ? " in this category" : ""})\n\n`
        reply += filtered.slice(0, count).map((p, i) => formatProperty(p, i + 1)).join("\n\n")
        if (filtered.length > count) {
          reply += `\n\n...and ${filtered.length - count} more. Browse all: ${SITE_URL}/properties`
        }
      } else {
        reply = `No properties found matching your search.\n\nBrowse all available properties here: ${SITE_URL}/properties`
      }
    }

    // ── BROKER LISTING ──
    else if (contains(msg, ["list broker", "show broker", "find broker", "brokers near", "available broker", "who are the broker", "approved broker"])) {
      if (approvedBrokers.length > 0) {
        reply = `Approved Brokers (${approvedBrokers.length})\n\n`
        reply += approvedBrokers.slice(0, 8).map((b, i) =>
          `${i + 1}. ${b.full_name}\n` +
          `   Specialization: ${b.specialization || "General"}\n` +
          `   Location: ${b.location || "N/A"}\n` +
          `   Phone: ${b.phone || "N/A"}\n` +
          `   Plan: ${b.plan || "Free"}`
        ).join("\n\n")
      } else {
        reply = "No approved brokers at the moment. Check back soon or register as a broker yourself!\n\nRegister here: " + SITE_URL + "/broker-register"
      }
    }

    // ── CAREER / JOB OPENINGS ──
    else if (contains(msg, ["career", "job", "opening", "vacancy", "employment", "work for", "hire", "apply", "position"])) {
      if (openJobs.length > 0) {
        reply = `Current Job Openings\n\n`
        reply += openJobs.map((j, i) => `${i + 1}. ${j}`).join("\n")
        reply += `\n\nApply here: ${SITE_URL}/careers`
      } else {
        reply = `No open positions at the moment. Check our careers page for updates: ${SITE_URL}/careers`
      }
    }

    // ── OFFICERS / TEAM ──
    else if (contains(msg, ["officer", "team", "staff", "who works", "management", "leadership", "head of"])) {
      if (officers.length > 0) {
        reply = `Our Team\n\n`
        reply += officers.map((o, i) =>
          `${i + 1}. ${o.full_name} — ${o.role}${o.department ? `, ${o.department}` : ""}${o.bio ? `\n   ${o.bio.slice(0, 100)}` : ""}`
        ).join("\n\n")
      } else {
        reply = "Team information is not available at the moment. Contact us for details."
      }
    }

    // ── FAQ KEYWORD MATCHING ──
    else {
      let bestMatch = null
      let bestScore = 0

      for (const faq of FAQ) {
        let score = 0
        for (const kw of faq.keywords) {
          if (msg.includes(kw)) {
            score += kw.split(" ").length
          }
        }
        if (score > bestScore) {
          bestScore = score
          bestMatch = faq
        }
      }

      if (bestMatch && bestScore > 0) {
        reply = bestMatch.answer()
      } else {
        // ── FALLBACK / GREETING ──
        if (contains(msg, ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "how are you"])) {
          reply = `Hello! Welcome to SAGECO EVERGREEN! \u{1F44B}\n\nI'm your virtual assistant. I can help you with:\n\n1. Finding available properties\n2. Broker information & registration\n3. Booking a property viewing\n4. Subscription plans & pricing\n5. Career opportunities\n6. Contact details\n\nWhat would you like to know?`
        } else if (contains(msg, ["thank", "thanks", "appreciate", "great", "awesome", "perfect", "helpful"])) {
          reply = "You're welcome! Is there anything else I can help you with? You can also reach us on WhatsApp: 0750 414 366"
        } else if (contains(msg, ["bye", "goodbye", "see you", "later", "that's all", "done"])) {
          reply = "Goodbye! Feel free to chat again anytime. For urgent matters, WhatsApp us: 0750 414 366 \u{1F44B}"
        } else {
          reply = `I'm here to help with SAGECO EVERGREEN services! I can assist with:\n\n1. Properties — search available listings\n2. Brokers — find or become a broker\n3. Booking — how to book a viewing\n4. Pricing — subscription plans\n5. Careers — job openings\n6. Contact — reach our team\n\nAsk me about any of these, or try: "Show available properties"`
        }
      }
    }

    return res.status(200).json({ reply })

  } catch (err) {
    console.error("Chat error:", err.message)
    return res.status(200).json({
      reply: "Sorry, I'm having trouble right now. Please call us on 0750 414 366 or email sagecoevergreen@gmail.com"
    })
  }
}
