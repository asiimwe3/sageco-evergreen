import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

const COMPANY = {
  name: "SAGECO EVERGREEN CO. LTD",
  location: "Kyenjojo, Western Uganda",
  phone: "0750 414 366 (WhatsApp)",
  phone2: "0782 067 425",
  email: "sagecoevergreen@gmail.com",
  hours: "Monday-Saturday, 8:00 AM - 6:00 PM EAT",
  about: "We are a premier real estate platform connecting property buyers, sellers, and renters with verified brokers across Uganda."
}

const BOOKING = {
  cost: "UGX 30,000 total (UGX 10,000 service fee + UGX 20,000 to broker)",
  payment: "MTN Mobile Money, Airtel Money, or bank card via PesaPal",
  url: "/book"
}

const BROKER_INFO = {
  regFee: "UGX 32,000 (one-time)",
  activationFee: "UGX 45,000 (monthly dashboard)",
  url: "/broker-register"
}

const PLANS = [
  { name: "Free", price: "UGX 0", listings: 3 },
  { name: "Basic", price: "UGX 15,000/month", listings: 10 },
  { name: "Pro", price: "UGX 25,000/month", listings: 50 },
  { name: "Premium", price: "UGX 30,000/month", listings: "Unlimited" }
]

function detectIntent(msg) {
  const m = msg.toLowerCase()
  if (/\b(buy|find|search|looking|show|browse|list).{0,20}(propert|land|house|home|plot|commercial|land)\b/.test(m) ||
      /\b(propert|land|house|home|plot)\b.*\b(for sale|available|in|near|at)\b/.test(m)) return 'property_search'
  if (/\b(book|viewing|visit|inspect|site visit)\b/.test(m)) return 'booking'
  if (/\b(broker|agent).{0,15}(register|join|become|sign up)\b/.test(m) || /\b(register|join|become).{0,10}(broker|agent)\b/.test(m)) return 'broker_register'
  if (/\b(plan|pricing|subscription|how much.{0,15}broker)\b/.test(m)) return 'pricing'
  if (/\b(contact|phone|call|whatsapp|email|reach|address|location|where)\b/.test(m)) return 'contact'
  if (/\b(invest|fractional|shares|token)\b/.test(m)) return 'investment'
  if (/\b(escrow|secure payment|milestone)\b/.test(m)) return 'escrow'
  if (/\b(passport|verification|verify|drone|certified|genuine|legit)\b/.test(m)) return 'verification'
  return 'general'
}

async function searchProperties(query) {
  let q = supabaseAdmin.from('properties').select('*').eq('status', 'available')
  // Extract price mention
  const priceMatch = query.match(/(\d+)\s*(million|m|k|000)/i)
  if (priceMatch) {
    let max = parseInt(priceMatch[1])
    if (/million|m/i.test(priceMatch[0])) max *= 1000000
    else if (/k/i.test(priceMatch[0])) max *= 1000
    q = q.lte('price', max)
  }
  // Extract location
  const locations = ['kyenjojo', 'kampala', 'fort portal', 'kabarole', 'mbarara', 'jinja', 'entebbe', 'gulu', 'mbale', 'mukono']
  const loc = locations.find(l => query.toLowerCase().includes(l))
  if (loc) q = q.ilike('location', `%${loc}%`)
  // Extract category
  if (/land|plot/.test(query.toLowerCase())) q = q.eq('category', 'Land')
  else if (/house|home|residential/.test(query.toLowerCase())) q = q.eq('category', 'Residential')
  else if (/commercial|office|shop/.test(query.toLowerCase())) q = q.eq('category', 'Commercial')
  else if (/green|eco/.test(query.toLowerCase())) q = q.eq('category', 'Green Project')

  const { data } = await q.order('created_at', { ascending: false }).limit(5)
  return data || []
}

function formatProperties(props) {
  if (props.length === 0) return "I couldn't find any properties matching your search. Try browsing all listings at /properties or tell me your budget and preferred location."
  return props.map(p => `🏠 ${p.title}\n   📍 ${p.location}\n   💰 UGX ${Number(p.price).toLocaleString()}\n   📂 ${p.category}\n   🔗 View: /property/${p.id}`).join('\n\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { message, user_phone, user_email } = req.body
  if (!message) return res.status(400).json({ error: "message required" })

  const intent = detectIntent(message)
  let reply = ""
  let lead_captured = false
  let matched_properties = []

  switch (intent) {
    case 'property_search': {
      const props = await searchProperties(message)
      matched_properties = props
      reply = `Here are properties I found for you:\n\n${formatProperties(props)}`
      break
    }
    case 'booking':
      reply = `📋 Booking a Property Viewing\n\nCost: ${BOOKING.cost}\nPayment: ${BOOKING.payment}\n\nAfter booking, a verified broker contacts you within 24 hours.\n\nBook here: ${BOOKING.url}`
      break
    case 'broker_register':
      reply = `🏢 Broker Registration\n\n1. Visit ${BROKER_INFO.url}\n2. Fill in your details and upload a photo\n3. Pay registration fee: ${BROKER_INFO.regFee}\n4. Dashboard activation: ${BROKER_INFO.activationFee}\n\nWe review applications within 48 hours.`
      break
    case 'pricing':
      reply = `💳 Broker Plans\n\n${PLANS.map(p => `${p.name}: ${p.price} (${p.listings} listings)`).join('\n')}\n\nVisit /plans for details.`
      break
    case 'contact':
      reply = `📞 Contact SAGECO EVERGREEN\n\nPhone: ${COMPANY.phone}\nPhone 2: ${COMPANY.phone2}\nEmail: ${COMPANY.email}\nLocation: ${COMPANY.location}\nHours: ${COMPANY.hours}\nWhatsApp: https://wa.me/256750414366`
      break
    case 'investment':
      reply = `📊 Tokenized Fractional Investment\n\nBuy fractional shares of land properties with token-based ownership tracking and ROI projections.\n\nExplore investments at /invest`
      break
    case 'escrow':
      reply = `🔒 Programmable Escrow\n\nSecure escrow with milestone-based fund release, GPS-verified site visits, and MTN MoMo/Airtel Money support.\n\nLearn more at /escrow`
      break
    case 'verification':
      reply = `🛰️ Drone & Spatial Verification\n\nEvery property undergoes drone mapping, GPS-verified boundaries, and digital land passport certification.\n\nLearn more at /verification`
      break
    default:
      reply = `Hi! I'm the SAGECO EVERGREEN AI Broker. I can help you:\n\n🔍 Search for properties (try: "land in Kyenjojo under 5 million")\n📋 Book a viewing\n🏢 Register as a broker\n📊 Explore investment opportunities\n🛰️ Learn about property verification\n📞 Get contact info\n\nWhat can I help you with?`
  }

  // Capture leads
  if (user_phone || user_email) {
    const phoneRegex = /\b(\+?256|0)[\d\s]{8,12}\b/g
    const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/
    const phone = user_phone || message.match(phoneRegex)?.[0] || null
    const email = user_email || message.match(emailRegex)?.[0] || null

    if (phone || email) {
      const { error } = await supabaseAdmin.from('broker_followups').insert([{
        customer_name: 'AI Broker Lead',
        customer_phone: phone,
        customer_email: email,
        inquiry_type: intent,
        message,
        status: 'pending'
      }])
      if (!error) lead_captured = true
    }
  }

  res.status(200).json({ reply, intent, matched_properties, lead_captured })
}
