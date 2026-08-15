// SageCo Evergreen — Properties API (direct Supabase, no Base44 proxy)
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const {
    category, featured, search,
    limit = 12, offset = 0, sort = 'newest',
    min_price, max_price,
  } = req.query

  let query = supabaseAdmin
    .from('properties')
    .select('id, title, description, location, price, category, images, featured, bedrooms, bathrooms, area_sqft, status, created_at', { count: 'exact' })
    .eq('status', 'available')
    .range(Number(offset), Number(offset) + Number(limit) - 1)

  if (category && category !== 'All') query = query.eq('category', category)
  if (featured === 'true') query = query.eq('featured', true)
  if (search) query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
  if (min_price) query = query.gte('price', parseFloat(min_price))
  if (max_price) query = query.lte('price', parseFloat(max_price))

  switch (sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'oldest': query = query.order('created_at', { ascending: true }); break
    default: query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[get-properties] Error:', error.message)
    return res.status(500).json({ error: error.message, properties: [], total: 0 })
  }

  return res.status(200).json({
    properties: data || [],
    total: count || 0,
    offset: Number(offset),
    limit: Number(limit),
    hasMore: (Number(offset) + Number(limit)) < (count || 0),
  })
}
