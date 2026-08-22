import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id } = req.body
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const { data: property } = await supabaseAdmin.from('properties').select('*').eq('id', property_id).single()
  if (!property) return res.status(404).json({ error: "Property not found" })

  const acres = Number(property.land_acres) || Number(property.area_sqft) / 43560 || 1
  const isGreen = property.category === 'Green Project'
  const isLand = property.category === 'Land' || property.category === 'Plot'

  // Carbon potential: higher for larger land and green projects
  const carbonScore = Math.min(100, Math.round((acres * 8) + (isGreen ? 30 : 10)))

  // Reforestation potential
  const reforestation = acres > 5 ? 'high' : acres > 1 ? 'medium' : 'low'

  // Agroforestry suitability
  const agroforestry = isLand || isGreen ? 'suitable' : 'limited'

  // Renewable energy suitability — larger land = better for solar
  const renewable = acres > 2 ? 'high' : acres > 0.5 ? 'medium' : 'low'

  // Soil quality estimate (simplified for Uganda)
  const soilQuality = property.location?.toLowerCase().includes('kyenjojo') ? 'fertile_loam' :
    property.location?.toLowerCase().includes('kampala') ? 'red_clay' : 'mixed_loam'

  // Biodiversity index
  const biodiversity = Math.min(1, Math.round((acres * 0.05 + (isGreen ? 0.3 : 0.1)) * 100) / 100)

  // Climate risk score (lower is better — Uganda is generally low risk)
  const climateRisk = isGreen ? 15 : 25

  const { data, error } = await supabaseAdmin
    .from('eco_scores')
    .upsert([{
      property_id,
      carbon_potential_score: carbonScore,
      reforestation_potential: reforestation,
      agroforestry_suitability: agroforestry,
      renewable_energy_suitability: renewable,
      soil_quality: soilQuality,
      biodiversity_index: biodiversity,
      climate_risk_score: climateRisk,
      analysis_data: { acres, category: property.category, location: property.location }
    }], { onConflict: 'property_id' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('properties').update({ eco_score: carbonScore }).eq('id', property_id)
  res.status(200).json({ success: true, scores: data })
}
