'use server'

import supabaseAdmin from '@/app/utils/supabase-admin'

export async function createUserServerAction({ name, email, password }) {
  try {
    // Step 1: Create user in Auth
    const { data: userData, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'user' }, // ✅ SET role
    })

    if (error) return { error: error.message }

    // Step 2: Insert into your `users` table
    const insertResult = await supabaseAdmin.from('users').insert({
      id: userData.user.id,
      email,
      full_name: name,
      role: 'user'
    })

    if (insertResult.error) {
      return { error: insertResult.error.message }
    }

    return { success: true }
  } catch (err) {
    return { error: 'Internal server error' }
  }
}
