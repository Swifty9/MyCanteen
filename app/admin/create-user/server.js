// app/admin/create-user/server.js
'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function createAuthUser({ email, password, full_name, role }) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,   // ✅ Correct key
      user_metadata: {
        full_name,
        role
      }
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (err) {
    console.error('Error creating auth user:', err.message)
    return { success: false, error: err.message }
  }
}
