import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emldbjqegftrngxypeca.supabase.co'

// Anon client for public reads
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjQzNTIsImV4cCI6MjA5MzkwMDM1Mn0.cofNEj5g3n9ls2HTXFXQG1_IXPUdLINDtYr820u2MtM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client - only use server-side (API routes)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
