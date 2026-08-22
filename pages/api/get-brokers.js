import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin.js'

/**
 * Public brokers API — no admin secret required.
 * Returns registered/active brokers for the public brokers page.
 */
export default async function handler(req, res) {
  const { search, status, limit, offset } = req.query

  const pageNum = Math.max(0, parseInt(offset, 10) || 0)
  const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 50))

  let query = supabase
    .from('brokers')
    .select('*', { count: 'exact' })

  // Filter by registration status — default to registered + active
  if (status) {
    if (status !== 'all') {
      query = query.eq('registration_status', status)
    }
  } else {
    query = query.in('registration_status', ['registered', 'active'])
  }

  // Search
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,specialization.ilike.%${search}%,location.ilike.%${search}%`)
  }

  // Sort by created_at desc
  query = query.order('created_at', { ascending: false })

  // Pagination
  query = query.range(pageNum, pageNum + pageLimit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('[get-brokers] Supabase error:', error)
    return res.status(200).json({ brokers: [], total: 0 })
  }

  return res.status(200).json({
    brokers: data || [],
    total: count || 0,
  })
}
