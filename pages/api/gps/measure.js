import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      property_id,
      coordinates,
      area_sqm,
      perimeter_m,
      boundary_geojson,
    } = req.body

    if (!coordinates || coordinates.length < 3) {
      return res.status(400).json({ error: 'At least 3 GPS coordinates are required' })
    }

    // Format GPS coordinates string
    const gpsString = coordinates
      .map((c, i) => `P${i + 1}: ${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`)
      .join(' | ')

    // Calculate acres and hectares
    const acres = area_sqm / 4046.86
    const hectares = area_sqm / 10000

    // Save to land_passports table
    const { data, error } = await supabaseAdmin
      .from('land_passports')
      .insert([{
        property_id: property_id || null,
        gps_coordinates: { type: 'Point', coordinates: [coordinates[0].lng, coordinates[0].lat], all_points: coordinates },
        boundary_coordinates: boundary_geojson || {
          type: 'Polygon',
          coordinates: [coordinates.map(c => [c.lng, c.lat]).concat([[coordinates[0].lng, coordinates[0].lat]])],
        },
        boundary_records: boundary_geojson || {
          type: 'Polygon',
          coordinates: [coordinates.map(c => [c.lng, c.lat]).concat([[coordinates[0].lng, coordinates[0].lat]])],
        },
        area_measured: hectares, // store in hectares
        survey_date: new Date().toISOString().split('T')[0],
        verification_status: 'draft',
        ownership_history: {
          measured_at: new Date().toISOString(),
          total_points: coordinates.length,
          perimeter_m: perimeter_m,
          area_sqm: area_sqm,
        },
      }])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Also update property if property_id is provided
    if (property_id) {
      await supabaseAdmin
        .from('properties')
        .update({
          gps_coordinates: gpsString,
          boundary_geojson: boundary_geojson,
          updated_date: new Date().toISOString(),
        })
        .eq('id', property_id)
    }

    return res.status(200).json({
      success: true,
      passport_id: data?.[0]?.id,
      measurements: {
        area_sqm: Number(area_sqm.toFixed(2)),
        area_acres: Number(acres.toFixed(4)),
        area_hectares: Number(hectares.toFixed(4)),
        perimeter_m: Number(perimeter_m.toFixed(2)),
        points_count: coordinates.length,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
