/** Days after a confirmed appointment that we ask for a Google review. */
export const REVIEW_REQUEST_AFTER_DAYS = 14;

/** The appointment date (YYYY-MM-DD, UTC) whose clients get a review request today. */
export function reviewRequestDate(today: Date): string {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - REVIEW_REQUEST_AFTER_DAYS);
  return d.toISOString().split("T")[0];
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Only http(s) links are allowed into the email. */
export function isSafeReviewUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildReviewEmail(input: { name: string; service: string; reviewUrl: string }) {
  const name = escapeHtml(input.name.trim() || "there");
  const service = escapeHtml(input.service);
  const url = escapeHtml(input.reviewUrl);
  const subject = "How are your new brows settling in?";
  const text =
    `Hi ${input.name.trim() || "there"},\n\n` +
    `It's been two weeks since your ${input.service} appointment. We hope the healing has gone smoothly.\n\n` +
    `If you're happy with the result, a short Google review helps other people find us:\n${input.reviewUrl}\n\n` +
    `If anything doesn't look right, reply to this email or WhatsApp us on +65 8930 8973 and we'll sort it out at your touch-up.\n\n` +
    `Shimmyhands`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2E3328;">
      <p style="line-height: 1.6;">Hi ${name},</p>
      <p style="line-height: 1.6;">It's been two weeks since your ${service} appointment. We hope the healing has gone smoothly.</p>
      <p style="line-height: 1.6;">If you're happy with the result, a short Google review helps other people find us.</p>
      <p style="margin: 24px 0;"><a href="${url}" style="background: #536442; color: #fff; padding: 12px 20px; text-decoration: none;">Leave a review</a></p>
      <p style="line-height: 1.6; color: #666;">If anything doesn't look right, reply to this email or WhatsApp us on +65 8930 8973 and we'll sort it out at your touch-up.</p>
      <p style="margin-top: 24px; font-size: 12px; color: #999;">Shimmyhands</p>
    </div>`;
  return { subject, text, html };
}
