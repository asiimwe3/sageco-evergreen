// MLM Agent Registration — UGX 30,000 registration fee
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { full_name, email, phone, location, bio, photo_url, sponsor_id, registration_ref } = req.body

  if (!full_name || !phone) return res.status(400).json({ error: 'Full name and phone are required' })

  try {
    const { data: existing } = await supabaseAdmin
      .from('agents').select('id, registration_status').eq('phone', phone).limit(1)

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'An agent with this phone number already exists', existing_id: existing[0].id, status: existing[0].registration_status })
    }

    let sponsor = null
    let level = 1
    if (sponsor_id) {
      const { data: sData } = await supabaseAdmin
        .from('agents').select('id, level, registration_status').eq('id', sponsor_id).eq('registration_status', 'active').limit(1)
      if (sData && sData.length > 0) { sponsor = sData[0]; level = (sponsor.level || 1) + 1 }
    }

    const { data: agent, error } = await supabaseAdmin
      .from('agents').insert([{
        full_name, email: email || null, phone, location: location || null, bio: bio || null, photo_url: photo_url || null,
        sponsor_id: sponsor ? sponsor.id : null, upline_id: sponsor ? sponsor.id : null, level,
        registration_status: registration_ref ? 'active' : 'pending', registration_paid: !!registration_ref,
        registration_fee: 30000, registration_ref: registration_ref || null,
      }]).select()

    if (error) return res.status(500).json({ error: error.message })
    const newAgent = agent[0]

    if (sponsor) {
      await supabaseAdmin.from('agent_downline').insert([{ agent_id: sponsor.id, downline_agent_id: newAgent.id, level: 1, status: 'active' }])
      await supabaseAdmin.from('agent_commissions').insert([{ agent_id: sponsor.id, source_agent_id: newAgent.id, source_type: 'registration', amount: 5000, level: 1, status: 'pending', description: 'Commission from ' + full_name + "'s registration" }])
    }

    return res.status(201).json({ success: true, agent: newAgent, message: registration_ref ? 'Agent registered and active!' : 'Registered! Pay UGX 30,000 to activate.' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
