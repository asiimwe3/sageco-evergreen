import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin.js'

/**
 * Public properties API — no admin secret required.
 * Supports search, category filter, price range, sorting, and pagination.
 */
export default async function handler(req, res) {
  const {
    search,
    category,
    status,
    sort = 'newest',
    limit = '12',
    offset = '0',
    min_price,
    max_price,
    featured,
  } = req.query

  const pageNum = Math.max(0, parseInt(offset, 10) || 0)
  const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12))

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })

  // Only show available properties by default (hide sold/rented)
  if (status && status !== 'all') {
    query = query.eq('status', status)
  } else if (!status) {
    query = query.eq('status', 'available')
  }

  // Category filter
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  // Search
  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Price range
  if (min_price) {
    query = query.gte('price', parseInt(min_price, 10))
  }
  if (max_price) {
    query = query.lte('price', parseInt(max_price, 10))
  }

  // Featured filter
  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  // Sorting
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
      query = query.order('views', { ascending: false })
      break
    default: // newest
      query = query.order('created_at', { ascending: false })
  }

  // Pagination
  query = query.range(pageNum, pageNum + pageLimit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('[get-properties] Supabase error:', error)
    return res.status(200).json({ properties: [], total: 0, hasMore: false })
  }

  const total = count || 0
  const hasMore = pageNum + pageLimit < total

  return res.status(200).json({
    properties: data || [],
    total,
    hasMore,
  })
}
