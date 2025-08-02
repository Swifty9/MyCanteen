// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ❌ REMOVE setUserRole from here — it's admin-only and will silently fail

export const getUserRole = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user?.user_metadata?.role
}
