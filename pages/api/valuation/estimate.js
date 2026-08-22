import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id } = req.body
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const { data: property } = await supabaseAdmin.from('properties').select('*').eq('id', property_id).single()
  if (!property) return res.status(404).json({ error: "Property not found" })

  // Find comparable properties — same category, similar area
  const { data: comparables } = await supabaseAdmin
    .from('properties')
    .select('id, title, price, area_sqft, land_acres, location, category')
    .eq('category', property.category)
    .eq('status', 'available')
    .neq('id', property_id)
    .limit(20)

  let estimatedValue = Number(property.price)
  let confidenceScore = 0.3

  if (comparables && comparables.length > 0) {
    // Calculate average price per sqft or per acre
    const withUnitPrice = comparables.filter(c => Number(c.area_sqft) > 0 || Number(c.land_acres) > 0)
    if (withUnitPrice.length > 0) {
      const unitPrices = withUnitPrice.map(c => {
        const units = Number(c.area_sqft) || Number(c.land_acres) * 43560 || 1
        return Number(c.price) / units
      })
      const avgUnitPrice = unitPrices.reduce((s, p) => s + p, 0) / unitPrices.length
      const propertyUnits = Number(property.area_sqft) || Number(property.land_acres) * 43560 || Number(property.price) / avgUnitPrice
      estimatedValue = Math.round(avgUnitPrice * propertyUnits)
      confidenceScore = Math.min(0.95, 0.3 + (withUnitPrice.length * 0.05))
    }
  }

  // Arable acres estimate (70% of land)
  const landAcres = Number(property.land_acres) || 0
  const arableAcres = landAcres > 0 ? Math.round(landAcres * 0.7 * 100) / 100 : 0

  // Crop suitability based on Uganda regions
  const loc = (property.location || '').toLowerCase()
  let cropSuitability = ['maize', 'beans']
  if (loc.includes('kyenjojo') || loc.includes('fort portal') || loc.includes('kabarole') || loc.includes('western')) {
    cropSuitability = ['bananas', 'coffee', 'tea', 'maize', 'beans']
  } else if (loc.includes('kampala') || loc.includes('central') || loc.includes('wakiso')) {
    cropSuitability = ['coffee', 'maize', 'cassava', 'beans']
  } else if (loc.includes('gulu') || loc.includes('lira') || loc.includes('northern')) {
    cropSuitability = ['rice', 'millet', 'sorghum', 'beans']
  } else if (loc.includes('mbale') || loc.includes('eastern') || loc.includes('jinja'])) {
    cropSuitability = ['rice', 'maize', 'millet', 'beans']
  }

  const { data, error } = await supabaseAdmin
    .from('property_valuations')
    .upsert([{
      property_id,
      estimated_value: estimatedValue,
      confidence_score: Math.round(confidenceScore * 100) / 100,
      comparable_properties: comparables?.slice(0, 5) || [],
      soil_data: { soil_quality: 'estimated', region: property.location },
      climate_risk: loc.includes('eastern') ? 'moderate_drought_risk' : 'low_risk',
      crop_suitability: cropSuitability,
      arable_acres: arableAcres,
      analysis_date: new Date().toISOString().split('T')[0]
    }], { onConflict: 'property_id' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('properties').update({ valuation_estimate: estimatedValue }).eq('id', property_id)
  res.status(200).json({ success: true, valuation: data })
}
