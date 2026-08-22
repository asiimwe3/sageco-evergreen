import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user_email, user_phone, budget_min, budget_max, preferred_location, preferred_category, min_acres, investment_goals } = req.body

  const { data: properties } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (!properties || properties.length === 0) return res.status(200).json({ matches: [], message: "No properties available" })

  const scored = properties.map(p => {
    let score = 0
    const reasons = []

    // Budget fit (40%)
    const price = Number(p.price)
    if (budget_min && budget_max) {
      if (price >= Number(budget_min) && price <= Number(budget_max)) { score += 40; reasons.push("Within budget") }
      else if (price <= Number(budget_max) * 1.1) { score += 30; reasons.push("Slightly above budget") }
      else if (price >= Number(budget_min) * 0.9) { score += 20; reasons.push("Below budget range") }
    } else { score += 20 }

    // Location match (25%)
    if (preferred_location) {
      if (p.location?.toLowerCase().includes(preferred_location.toLowerCase())) { score += 25; reasons.push(`Located in ${preferred_location}`) }
    } else { score += 12 }

    // Category match (15%)
    if (preferred_category) {
      if (p.category === preferred_category) { score += 15; reasons.push(`Matches category: ${preferred_category}`) }
    } else { score += 8 }

    // Acreage match (10%)
    if (min_acres && p.land_acres) {
      if (Number(p.land_acres) >= Number(min_acres)) { score += 10; reasons.push(`Meets minimum ${min_acres} acres`) }
    } else { score += 5 }

    // Investment goal alignment (10%)
    if (investment_goals && p.description) {
      const goals = investment_goals.toLowerCase()
      const desc = p.description.toLowerCase()
      const keywords = goals.split(/[,\s]+/).filter(k => k.length > 3)
      let matches = 0
      keywords.forEach(k => { if (desc.includes(k)) matches++ })
      if (matches > 0) { score += 10; reasons.push("Aligns with investment goals") }
    } else { score += 5 }

    return { ...p, match_score: Math.min(100, score), match_reasons: reasons }
  })

  scored.sort((a, b) => b.match_score - a.match_score)
  const topMatches = scored.slice(0, 10)

  if (user_email) {
    await supabaseAdmin.from('property_matches').insert([{
      user_email, user_phone: user_phone || null,
      budget_min: budget_min || null, budget_max: budget_max || null,
      preferred_location: preferred_location || null, preferred_category: preferred_category || null,
      min_acres: min_acres || null, investment_goals: investment_goals || null,
      matched_properties: topMatches.map(p => p.id),
      match_scores: topMatches.map(p => ({ id: p.id, score: p.match_score, reasons: p.match_reasons }))
    }])
  }

  res.status(200).json({ matches: topMatches })
}
