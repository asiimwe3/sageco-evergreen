// SageCo Evergreen — Add Property (direct Supabase, no Base44 proxy)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emldbjqegftrngxypeca.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Auth required' })

    const body = req.body
    const required = ['title', 'price', 'location']
    for (const field of required) {
      if (!body[field]) return res.status(400).json({ error: `Missing: ${field}` })
    }

    const price = parseFloat(body.price)
    if (isNaN(price) || price <= 0) return res.status(400).json({ error: 'Invalid price' })

    const validCategories = ['Residential', 'Commercial', 'Land', 'Green Project']
    if (body.category && !validCategories.includes(body.category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    // Verify user token
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: authHeader }
    })
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' })
    const userData = await userRes.json()

    const { data, error } = await supabaseAdmin.from('properties').insert([{
      title: body.title,
      description: body.description || null,
      price,
      location: body.location,
      category: body.category || 'Residential',
      bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
      bathrooms: body.bathrooms ? parseInt(body.bathrooms) : null,
      area_sqft: body.area_sqft ? parseFloat(body.area_sqft) : null,
      images: body.images || [],
      broker_id: userData.id,
      status: 'available',
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json({ success: true, property: data })
  } catch (err) {
    console.error('[add-property]', err.message)
    return res.status(500).json({ error: 'Failed to add property' })
  }
}
