import { publicRead, publicCount, SUPA_URL, SUPA_KEY, SUPA_ANON_KEY } from '../../lib/supabaseAdmin.js'

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

  if (req.query.debug === '1') {
    const out = { supaUrl: SUPA_URL, hasService: !!process.env.SUPABASE_SERVICE_ROLE_KEY, hasAnon: !!SUPA_ANON_KEY, serviceKeyLen: (SUPA_KEY||'').length, anonKeyLen: (SUPA_ANON_KEY||'').length, attempts: [] }
    for (const [label, key] of [['service', SUPA_KEY], ['anon', SUPA_ANON_KEY]]) {
      if (!key) { out.attempts.push({ label, skipped: true }); continue }
      try {
        const r = await fetch(`${SUPA_URL}/rest/v1/properties?select=id&limit=2`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
        const t = await r.text()
        out.attempts.push({ label, status: r.status, body: t.slice(0, 120) })
      } catch (e) { out.attempts.push({ label, error: String(e).slice(0, 120) }) }
    }
    return res.status(200).json(out)
  }

  const filters = []
  if (status && status !== 'all') filters.push(`status=eq.${encodeURIComponent(status)}`)
  else if (!status) filters.push('status=eq.available')
  if (category && category !== 'All') filters.push(`category=eq.${encodeURIComponent(category)}`)
  if (min_price) filters.push(`price=gte.${parseInt(min_price, 10)}`)
  if (max_price) filters.push(`price=lte.${parseInt(max_price, 10)}`)
  if (featured === 'true') filters.push('featured=eq.true')
  if (search) {
    const s = encodeURIComponent(search)
    filters.push(`or=(title.ilike.*${s}*,location.ilike.*${s}*,description.ilike.*${s}*)`)
  }

  const orderMap = {
    oldest: 'created_at.asc',
    price_asc: 'price.asc',
    price_desc: 'price.desc',
    popular: 'views.desc.nullslast',
    newest: 'created_at.desc',
  }
  const order = orderMap[sort] || orderMap.newest

  const qs = [...filters, `order=${order}`, `limit=${pageLimit}`, `offset=${pageNum}`].join('&')

  const { data, error } = await publicRead(`properties?select=*&${qs}`)

  if (error) {
    console.error('[get-properties] all read attempts failed:', error)
    return res.status(500).json({ error: 'Could not load properties', detail: error })
  }

  const props = data || []
  const { count } = await publicCount(`properties?select=id&${filters.join('&')}`)

  const total = count || props.length
  const hasMore = pageNum + pageLimit < total

  return res.status(200).json({
    properties: props,
    total,
    hasMore,
  })
}
