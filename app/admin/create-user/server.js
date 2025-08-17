// app/admin/create-user/server.js
'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function createUserServerAction(formData) {
  try {
    // 1. Check if user already exists
    const { data: existingUser, error: lookupError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', formData.email)
      .maybeSingle()

    if (lookupError) throw lookupError
    if (existingUser) {
      return { 
        error: 'User with this email already exists',
        code: 'EMAIL_EXISTS'
      }
    }

    // 2. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
      user_metadata: {
        full_name: formData.full_name
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return { 
        error: authError.message,
        code: 'AUTH_ERROR'
      }
    }

    // 3. Create profile
const { data: profileData, error: profileError } = await supabaseAdmin
  .from('profiles')
  .upsert({
    id: authData.user.id,
    email: formData.email,
    full_name: formData.full_name,
    department: formData.department,
    academic_year: formData.academic_year,
    contact_number: formData.contact_number,
    role: 'user'
    // do NOT include updated_at here
  }, { onConflict: ['id'] })
  .select()
  .single()



    if (profileError) {
      // Rollback auth creation if profile fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      console.error('Profile creation error:', profileError)
      return {
        error: profileError.message,
        code: 'PROFILE_ERROR'
      }
    }

    return { 
      data: profileData,
      success: 'User created successfully!'
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      error: error.message || 'Failed to create user',
      code: 'UNKNOWN_ERROR'
    }
  }
}