import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })

  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: error.message })
  return res.status(200).json(data)
}
