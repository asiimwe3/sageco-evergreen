import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { category, featured, search, limit = 100, offset = 0 } = req.query

  let query = supabaseAdmin
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1)

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json(data || [])
}
