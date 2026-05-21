import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/save-look
 * Lead capture from the brow try-on visualizer.
 * Stores name + WhatsApp + (optional) email + chosen style.
 *
 * Required table:
 *
 * CREATE TABLE IF NOT EXISTS saved_looks (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   email TEXT,
 *   style_id TEXT NOT NULL,
 *   style_name TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * ALTER TABLE saved_looks ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Anyone can insert saved looks" ON saved_looks FOR INSERT TO anon WITH CHECK (true);
 */
export async function POST(request: NextRequest) {
  const { name, phone, email, style_id, style_name } = await request.json();

  if (!name || !phone || !style_id || !style_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || name.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (typeof phone !== "string" || !/^[+\d\s\-()]{6,20}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase.from("saved_looks").insert({
    name,
    phone,
    email: email || null,
    style_id,
    style_name,
  });

  if (error) {
    console.log("save-look (table missing?):", error.message);
  }

  return NextResponse.json({ success: true });
}
