import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { MAX_ADVANCE_DAYS, TIMEZONE } from "@/lib/booking";
import { bookingWindow } from "@/lib/booking-window";

/**
 * GET /api/bookings/blocked-dates
 *
 * Dates the studio is closed within the bookable window, so the contact
 * calendar can grey them out. Only the dates are returned, never the reason.
 */
export async function GET() {
  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json({ dates: [] });
  }

  const { from, to } = bookingWindow(new Date(), MAX_ADVANCE_DAYS, TIMEZONE);
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("date")
    .gte("date", from)
    .lte("date", to)
    .order("date");

  if (error) {
    console.error("blocked-dates:", error.message);
    return NextResponse.json({ dates: [] });
  }

  return NextResponse.json(
    { dates: (data ?? []).map((r) => String(r.date)) },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
