/** Events the site records. The tracking endpoint drops anything else. */
export const TRACKED_EVENTS = [
  "page_view",
  "whatsapp_click",
  "booking_submitted",
  "tryon_complete",
  "lead_saved",
  "cart_add",
  "email_signup",
] as const;

export type TrackedEvent = (typeof TRACKED_EVENTS)[number];

export interface EventRow {
  event: TrackedEvent;
  page: string | null;
  metadata: Record<string, string> | null;
  session_id: string | null;
}

const MAX_TEXT = 200;
const MAX_META_KEYS = 5;

const shortText = (v: unknown): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, MAX_TEXT) : null;

/**
 * Validates a tracking request body. Returns the row to store, or null when the
 * event is unknown. Text is trimmed to 200 characters and metadata to five
 * string or number values, so the public endpoint can't be used to store junk.
 */
export function toEventRow(body: unknown): EventRow | null {
  if (!body || typeof body !== "object") return null;
  const { event, page, metadata, session_id } = body as Record<string, unknown>;
  if (typeof event !== "string" || !(TRACKED_EVENTS as readonly string[]).includes(event)) return null;

  let meta: Record<string, string> | null = null;
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const entries = Object.entries(metadata)
      .filter(([, v]) => typeof v === "string" || typeof v === "number")
      .slice(0, MAX_META_KEYS)
      .map(([k, v]) => [k.slice(0, 40), String(v).slice(0, MAX_TEXT)] as const);
    meta = entries.length ? Object.fromEntries(entries) : null;
  }

  return {
    event: event as TrackedEvent,
    page: shortText(page),
    metadata: meta,
    session_id: shortText(session_id),
  };
}
