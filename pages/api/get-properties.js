import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // CORS headers — allow WebView and browser
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const {
    category,
    featured,
    search,
    limit = 12,       // FIX: sensible default, not 200
    offset = 0,
    sort = 'newest',
    min_price,
    max_price,
  } = req.query

  let query = supabaseAdmin
    .from('properties')
    .select('id, title, location, price, category, images, featured, is_negotiable, bedrooms, bathrooms, land_acres, area_sqft, status, created_at', { count: 'exact' })
    .eq('status', 'available')
    .range(Number(offset), Number(offset) + Number(limit) - 1)

  // Category filter
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  // Featured filter
  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  // Full-text search
  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Price range
  if (min_price) query = query.gte('price', parseFloat(min_price))
  if (max_price) query = query.lte('price', parseFloat(max_price))

  // Sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'popular':
      query = query.order('views', { ascending: false })
      break
    default: // newest — featured always first
      query = query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[get-properties] Supabase error:', error)
    return res.status(500).json({ error: error.message, code: error.code })
  }

  return res.status(200).json({
    properties: data || [],
    total: count || 0,
    offset: Number(offset),
    limit: Number(limit),
    hasMore: (Number(offset) + Number(limit)) < (count || 0),
  })
}
