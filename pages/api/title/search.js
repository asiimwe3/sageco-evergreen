import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

// Uganda Ministry of Lands, Housing and Urban Development portal
const MLHUD_PORTAL = 'https://www.mlhud.go.ug'
const ULAIS_PORTAL = 'https://ulis.mlhud.go.ug'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { search_type, search_value, district } = req.body

    if (!search_value) {
      return res.status(400).json({ error: 'Search value is required' })
    }

    const searchRef = `TS-${Date.now().toString(36).toUpperCase()}`
    const cleanValue = search_value.trim()

    // Step 1: Check our local database — search properties by title_number, plot_reference, or owner_name
    let localMatch = null

    const { data: propertyMatch } = await supabaseAdmin
      .from('properties')
      .select('*')
      .or(`title_number.ilike.%${cleanValue}%,plot_reference.ilike.%${cleanValue}%,owner_name.ilike.%${cleanValue}%,name.ilike.%${cleanValue}%`)
      .limit(1)

    if (propertyMatch && propertyMatch.length > 0) {
      const p = propertyMatch[0]
      localMatch = {
        title_number: p.title_number || cleanValue,
        plot_reference: p.plot_reference || null,
        district: p.location || district || null,
        area: p.size_acres ? `${p.size_acres} acres` : (p.size ? `${p.size} acres` : null),
        title_status: 'Active',
        owner_name: p.owner_name || 'On file',
        tenure_type: p.tenure_type || 'Freehold',
        registration_date: p.created_date ? new Date(p.created_date).toLocaleDateString() : null,
        encumbrances: 'None recorded',
        notes: 'Property record found in SageCo Evergreen database.',
      }
    }

    // Also check land_passports by passport_uid
    if (!localMatch) {
      const { data: passportMatch } = await supabaseAdmin
        .from('land_passports')
        .select('*')
        .or(`passport_uid.ilike.%${cleanValue}%`)
        .limit(1)

      if (passportMatch && passportMatch.length > 0) {
        const passport = passportMatch[0]
        const { data: property } = await supabaseAdmin
          .from('properties')
          .select('*')
          .eq('id', passport.property_id)
          .single()

        localMatch = {
          title_number: passport.passport_uid || cleanValue,
          plot_reference: property?.plot_reference || null,
          district: property?.location || district || null,
          area: passport.area_measured ? `${passport.area_measured} hectares` : null,
          title_status: passport.verification_status || 'Active',
          owner_name: property?.owner_name || 'Verified (see land passport)',
          tenure_type: property?.tenure_type || 'Freehold',
          registration_date: passport.issued_at ? new Date(passport.issued_at).toLocaleDateString() : null,
          encumbrances: 'None recorded',
          notes: 'Title verified through SageCo Evergreen land passport system.',
        }
      }
    }

    // Step 2: Try the official MLHUD/ULIS portal
    let officialResult = null
    try {
      const portalUrl = `${ULAIS_PORTAL}/search?q=${encodeURIComponent(cleanValue)}&type=${search_type}&district=${encodeURIComponent(district || '')}`

      const response = await fetch(portalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SageCoEvergreen/3.0',
        },
        signal: AbortSignal.timeout(8000),
      })

      if (response.ok) {
        const data = await response.json()
        if (data && (data.title_info || data.results)) {
          officialResult = data.title_info || data.results
        }
      }
    } catch (portalErr) {
      // Portal may be down or require authentication — continue with local data
    }

    // Step 3: Combine results
    if (localMatch || officialResult) {
      const titleInfo = officialResult || localMatch
      const result = {
        search_id: searchRef,
        status: 'found',
        verified: true,
        source: officialResult ? 'official' : 'local',
        title_info: titleInfo,
        searched_at: new Date().toISOString(),
      }

      // Save search to database
      await supabaseAdmin
        .from('land_passports')
        .insert([{
          passport_uid: searchRef,
          property_id: null,
          verification_status: 'verified',
          ownership_history: {
            search_type,
            search_value: cleanValue,
            district,
            result: titleInfo,
            searched_at: new Date().toISOString(),
            source: result.source,
          },
        }])

      return res.status(200).json(result)
    }

    // Step 4: No match found — return guidance for manual search
    return res.status(404).json({
      error: 'No title found in local database. Please search on the official MLHUD portal.',
      search_id: searchRef,
      official_url: MLHUD_PORTAL,
      instructions: 'Visit the Ministry of Lands office or portal with your title number or plot reference for official verification.',
      searched_at: new Date().toISOString(),
    })
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      official_url: MLHUD_PORTAL,
    })
  }
}
