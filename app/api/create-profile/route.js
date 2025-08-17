import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";  // service role client

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name, dept, year, phone } = body;

    // 1. Create user in Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // 2. Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([
        {
          id: authUser.user.id, // must match auth.users.id
          email,
          name: name || null,
          dept: dept || null,
          year: year || null,
          phone: phone || null,
        },
      ]);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, user: authUser.user });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
