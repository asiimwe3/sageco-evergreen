import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id } = req.body
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const { data: property } = await supabaseAdmin.from('properties').select('*').eq('id', property_id).single()
  if (!property) return res.status(404).json({ error: "Property not found" })

  const flags = []

  // 1. Duplicate listing check — same title in similar location
  const { data: dupes } = await supabaseAdmin
    .from('properties')
    .select('id, title, location, price')
    .ilike('title', property.title)
    .neq('id', property_id)

  if (dupes && dupes.length > 0) {
    for (const d of dupes) {
      if (d.location?.toLowerCase() === property.location?.toLowerCase()) {
        flags.push({
          property_id, flag_type: 'duplicate_listing', severity: 'high',
          description: `Duplicate listing found: "${d.title}" at ${d.location}`,
          auto_detected: true, metadata: { duplicate_id: d.id }
        })
      }
    }
  }

  // 2. Suspicious pricing — price = 0 or price < 10% of category average
  const { data: comparables } = await supabaseAdmin
    .from('properties')
    .select('price')
    .eq('category', property.category)
    .eq('status', 'available')
    .neq('id', property_id)

  if (comparables && comparables.length > 0) {
    const avgPrice = comparables.reduce((s, p) => s + Number(p.price || 0), 0) / comparables.length
    if (Number(property.price) === 0) {
      flags.push({
        property_id, flag_type: 'suspicious_pricing', severity: 'high',
        description: `Property listed at UGX 0 — possible error or scam`, auto_detected: true, metadata: { price: 0 }
      })
    } else if (avgPrice > 0 && Number(property.price) < avgPrice * 0.1) {
      flags.push({
        property_id, flag_type: 'suspicious_pricing', severity: 'medium',
        description: `Price UGX ${property.price} is less than 10% of category average (UGX ${avgPrice.toFixed(0)})`,
        auto_detected: true, metadata: { price: property.price, average: avgPrice }
      })
    }
  }

  // 3. Document consistency — title_deed present but location mismatch
  if (!property.title_deed && property.category === 'Land') {
    flags.push({
      property_id, flag_type: 'document_inconsistency', severity: 'medium',
      description: 'Land property without title deed documentation', auto_detected: true
    })
  }

  // Insert flags
  let riskLevel = 'low'
  if (flags.some(f => f.severity === 'high')) riskLevel = 'high'
  else if (flags.some(f => f.severity === 'medium')) riskLevel = 'medium'

  if (flags.length > 0) {
    await supabaseAdmin.from('fraud_flags').insert(flags)
    await supabaseAdmin.from('properties').update({ fraud_risk_level: riskLevel }).eq('id', property_id)
  } else {
    await supabaseAdmin.from('properties').update({ fraud_risk_level: 'low' }).eq('id', property_id)
  }

  res.status(200).json({ success: true, flags, risk_level: riskLevel })
}
