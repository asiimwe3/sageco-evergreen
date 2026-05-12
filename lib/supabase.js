import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://emldbjqegftrngxypeca.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

let supabase
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (e) {
  supabase = { from: () => ({ select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: { message: 'Not configured' } }) }) }
}

export { supabase }
