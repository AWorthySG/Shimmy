/** YYYY-MM-DD for `date` in the given IANA time zone. */
export function isoDateIn(date: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** First and last bookable dates: today (in the studio's time zone) to today + days. */
export function bookingWindow(now: Date, days: number, timeZone: string): { from: string; to: string } {
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return { from: isoDateIn(now, timeZone), to: isoDateIn(end, timeZone) };
}
