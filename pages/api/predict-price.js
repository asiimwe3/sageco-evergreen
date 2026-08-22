import { UGANDA_DISTRICTS, findNearestTown, matchDistrict, haversineKm } from '../../lib/uganda-districts.js'

/**
 * AI Price Prediction API
 *
 * Predicts a fair property price using public data:
 * - Distance from nearest town/city center (Haversine)
 * - Road access distance
 * - Electricity availability
 * - Water availability
 * - Title deed type
 * - Fence/wall
 * - Property category & size
 * - District base prices (URA, UBOS, market listings)
 *
 * Also flags overpriced listings to prevent cheating.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Support both POST (from form) and GET (query params for quick check)
  const body = req.method === 'POST' ? req.body : req.query

  const {
    lat,
    lng,
    location,
    category = 'Land',
    sub_type,
    land_acres,
    area_sqft,
    plot_feet,
    price, // user's asking price (for cheating check)
    water_available,
    electricity_available,
    road_distance_km,
    fence,
    title_deed,
  } = body

  // Determine GPS coordinates
  let gpsLat = parseFloat(lat)
  let gpsLng = parseFloat(lng)

  // If no GPS, try to match district from location string
  if ((!gpsLat || !gpsLng) && location) {
    const district = matchDistrict(location)
    if (district) {
      gpsLat = district.lat
      gpsLng = district.lng
    }
  }

  if (!gpsLat || !gpsLng) {
    return res.status(400).json({
      error: 'GPS coordinates or location are required. Please provide lat, lng or a recognizable location name.',
    })
  }

  // Find nearest town
  const nearest = findNearestTown(gpsLat, gpsLng)
  if (!nearest) {
    return res.status(400).json({ error: 'Could not determine nearest town. Please provide valid Ugandan coordinates.' })
  }

  // ── Calculate size in acres ──────────────────────────────────────────
  let acres = parseFloat(land_acres) || 0
  if (!acres && area_sqft) {
    acres = parseFloat(area_sqft) / 43560
  }
  if (!acres && plot_feet) {
    // Parse "50x100" format → 50*100 sqft → acres
    const match = plot_feet.match(/(\d+)\s*[xX×]\s*(\d+)/)
    if (match) {
      acres = (parseInt(match[1]) * parseInt(match[2])) / 43560
    }
  }
  if (!acres) acres = 1 // default to 1 acre if no size given

  // ── Base price per acre from district data ───────────────────────────
  let basePricePerAcre = nearest.basePricePerAcre

  // ── Factor 1: Distance from town center ──────────────────────────────
  let distMultiplier = 1.0
  const distKm = nearest.distanceKm
  if (distKm < 1) distMultiplier = 1.40
  else if (distKm < 5) distMultiplier = 1.20
  else if (distKm < 15) distMultiplier = 1.00
  else if (distKm < 30) distMultiplier = 0.90
  else if (distKm < 50) distMultiplier = 0.80
  else distMultiplier = 0.65

  // ── Factor 2: Road access ────────────────────────────────────────────
  let roadMultiplier = 1.0
  const roadDist = parseFloat(road_distance_km)
  if (roadDist != null && !isNaN(roadDist)) {
    if (roadDist < 0.5) roadMultiplier = 1.30
    else if (roadDist < 2) roadMultiplier = 1.15
    else if (roadDist < 5) roadMultiplier = 1.00
    else if (roadDist < 10) roadMultiplier = 0.90
    else roadMultiplier = 0.75
  }

  // ── Factor 3: Electricity ─────────────────────────────────────────────
  let elecMultiplier = 1.0
  if (electricity_available === 'Yes') elecMultiplier = 1.15
  else if (electricity_available === 'Nearby') elecMultiplier = 1.05
  else if (electricity_available === 'No') elecMultiplier = 0.90

  // ── Factor 4: Water ──────────────────────────────────────────────────
  let waterMultiplier = 1.0
  if (water_available === 'Yes') waterMultiplier = 1.12
  else if (water_available === 'Nearby') waterMultiplier = 1.04
  else if (water_available === 'No') waterMultiplier = 0.95

  // ── Factor 5: Title deed ─────────────────────────────────────────────
  let titleMultiplier = 1.0
  if (title_deed) {
    const td = title_deed.toLowerCase()
    if (td.includes('freehold')) titleMultiplier = 1.10
    else if (td.includes('leasehold')) titleMultiplier = 1.05
    else if (td.includes('mailo')) titleMultiplier = 1.03
    else if (td.includes('agreement')) titleMultiplier = 0.95
    else if (td.includes('no title')) titleMultiplier = 0.85
  }

  // ── Factor 6: Fence/wall ─────────────────────────────────────────────
  let fenceMultiplier = 1.0
  if (fence) {
    if (fence.toLowerCase().includes('full')) fenceMultiplier = 1.05
    else if (fence.toLowerCase().includes('partial')) fenceMultiplier = 1.02
  }

  // ── Factor 7: Property category ──────────────────────────────────────
  let categoryMultiplier = 1.0
  const cat = (category || '').toLowerCase()
  if (cat.includes('commercial')) categoryMultiplier = 1.50
  else if (cat.includes('residential')) categoryMultiplier = 1.20
  else if (cat.includes('green')) categoryMultiplier = 0.85
  else if (cat.includes('plot')) categoryMultiplier = 1.10
  // Land = 1.0 (base)

  // ── Factor 8: Sub-type adjustments ───────────────────────────────────
  if (sub_type) {
    const st = sub_type.toLowerCase()
    if (st.includes('commercial') || st.includes('shop') || st.includes('office')) categoryMultiplier *= 1.15
    else if (st.includes('farm') || st.includes('forest') || st.includes('swamp')) categoryMultiplier *= 0.80
    else if (st.includes('corner') || st.includes('road front')) categoryMultiplier *= 1.08
  }

  // ── Factor 9: Size economy of scale ──────────────────────────────────
  // Larger plots have lower per-acre prices
  let sizeMultiplier = 1.0
  if (acres > 50) sizeMultiplier = 0.70
  else if (acres > 20) sizeMultiplier = 0.80
  else if (acres > 10) sizeMultiplier = 0.88
  else if (acres > 5) sizeMultiplier = 0.95
  // < 5 acres = base price

  // ── Calculate predicted price ────────────────────────────────────────
  const adjustedPricePerAcre = basePricePerAcre
    * distMultiplier
    * roadMultiplier
    * elecMultiplier
    * waterMultiplier
    * titleMultiplier
    * fenceMultiplier
    * categoryMultiplier
    * sizeMultiplier

  // Total predicted price
  const predictedPrice = Math.round(adjustedPricePerAcre * acres)

  // Price range (±15% for uncertainty)
  const lowPrice = Math.round(predictedPrice * 0.85)
  const highPrice = Math.round(predictedPrice * 1.15)

  // ── Confidence score ─────────────────────────────────────────────────
  let confidenceFactors = 0
  if (gpsLat && gpsLng) confidenceFactors++
  if (acres > 0) confidenceFactors++
  if (water_available) confidenceFactors++
  if (electricity_available) confidenceFactors++
  if (road_distance_km) confidenceFactors++
  if (title_deed) confidenceFactors++
  if (fence) confidenceFactors++
  // Base confidence from GPS precision (closer to a town = higher confidence)
  const proximityConfidence = distKm < 10 ? 0.85 : distKm < 30 ? 0.70 : 0.55
  const dataCompleteness = confidenceFactors / 7
  const confidence = Math.round((proximityConfidence * 0.6 + dataCompleteness * 0.4) * 100) / 100

  // ── Cheating / overprice detection ───────────────────────────────────
  let priceAssessment = null
  if (price && parseFloat(price) > 0) {
    const askingPrice = parseFloat(price)
    const ratio = askingPrice / predictedPrice
    if (ratio > 2.0) {
      priceAssessment = {
        status: 'severely_overpriced',
        label: '⚠️ Severely Overpriced',
        message: `This price is ${Math.round(ratio * 100)}% of the AI predicted fair value. Buyers should be cautious.`,
        color: 'red',
      }
    } else if (ratio > 1.5) {
      priceAssessment = {
        status: 'overpriced',
        label: '⚡ Above Market Rate',
        message: `This price is ${Math.round(ratio * 100)}% of the AI predicted fair value. Consider negotiating.`,
        color: 'orange',
      }
    } else if (ratio > 1.15) {
      priceAssessment = {
        status: 'slightly_high',
        label: '📈 Slightly Above Market',
        message: `This price is close to the AI predicted fair value but slightly high.`,
        color: 'yellow',
      }
    } else if (ratio >= 0.85) {
      priceAssessment = {
        status: 'fair',
        label: '✅ Fair Price',
        message: `This price is within the AI predicted fair value range.`,
        color: 'green',
      }
    } else {
      priceAssessment = {
        status: 'good_deal',
        label: '🎉 Below Market (Good Deal)',
        message: `This price is below the AI predicted fair value — potential good deal for buyers.`,
        color: 'green',
      }
    }
  }

  // ── Factor breakdown for transparency ───────────────────────────────
  const factors = [
    { name: 'District Base Price', value: `UGX ${basePricePerAcre.toLocaleString()}/acre`, detail: nearest.name },
    { name: 'Distance from Town', multiplier: distMultiplier, detail: `${distKm} km from ${nearest.name}` },
    { name: 'Road Access', multiplier: roadMultiplier, detail: road_distance_km ? `${road_distance_km} km from main road` : 'Not specified' },
    { name: 'Electricity', multiplier: elecMultiplier, detail: electricity_available || 'Not specified' },
    { name: 'Water', multiplier: waterMultiplier, detail: water_available || 'Not specified' },
    { name: 'Title Deed', multiplier: titleMultiplier, detail: title_deed || 'Not specified' },
    { name: 'Fence/Wall', multiplier: fenceMultiplier, detail: fence || 'Not specified' },
    { name: 'Property Type', multiplier: categoryMultiplier, detail: category + (sub_type ? ` (${sub_type})` : '') },
    { name: 'Size Scale', multiplier: sizeMultiplier, detail: `${acres.toFixed(2)} acres` },
  ]

  return res.status(200).json({
    success: true,
    prediction: {
      predictedPrice,
      priceRange: { low: lowPrice, mid: predictedPrice, high: highPrice },
      pricePerAcre: Math.round(adjustedPricePerAcre),
      confidence,
      nearestTown: nearest.name,
      distanceToTown: distKm,
      districtRegion: nearest.region,
      districtTier: nearest.tier,
      factors,
      priceAssessment,
      acres: parseFloat(acres.toFixed(4)),
    },
  })
}
