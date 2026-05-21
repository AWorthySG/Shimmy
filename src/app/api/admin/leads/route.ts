import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json({ leads: [] });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit")) || 50;
  const offset = Number(request.nextUrl.searchParams.get("offset")) || 0;

  const { data, error, count } = await supabase
    .from("saved_looks")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ leads: [], total: 0 });
  }

  return NextResponse.json({ leads: data ?? [], total: count ?? 0 });
}
