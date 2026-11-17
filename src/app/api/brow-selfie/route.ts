import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/brow-selfie
 * Receives the guided selfie from /brows/selfie and forwards it to the
 * artist's phone through a Telegram bot.
 *
 * The photo is sent with sendDocument, not sendPhoto: Telegram recompresses
 * and resizes photos, which would distort measurements.
 *
 * Env (server only, never NEXT_PUBLIC_):
 *   TELEGRAM_BOT_TOKEN  token from @BotFather
 *   TELEGRAM_CHAT_ID    the artist's chat id with the bot
 */

// Vercel caps request bodies at 4.5 MB; the client compresses to stay under 4 MB.
const MAX_BYTES = 4_400_000;
const TELEGRAM_TIMEOUT_MS = 15_000;

/*
 * Basic abuse protection. The limit is per server instance, so it slows a
 * flood rather than stopping it outright; add a Vercel Firewall rate-limit
 * rule on this path for a hard limit.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function sendDocument(token: string, body: FormData) {
  return fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ error: "Upload is not configured" }, { status: 503 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again in a few minutes" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const photo = form.get("photo");
  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const meta = String(form.get("meta") ?? "");

  if (!(photo instanceof File) || photo.size === 0 || photo.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photo missing or too large" }, { status: 400 });
  }
  const head = new Uint8Array(await photo.slice(0, 3).arrayBuffer());
  const tail = new Uint8Array(await photo.slice(-2).arrayBuffer());
  if (head[0] !== 0xff || head[1] !== 0xd8 || head[2] !== 0xff || tail[0] !== 0xff || tail[1] !== 0xd9) {
    return NextResponse.json({ error: "Photo must be a JPEG" }, { status: 400 });
  }
  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!/^[+\d\s\-()]{6,20}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }
  if (meta.length > 4000) {
    return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
  }

  let summary = "";
  try {
    const m = JSON.parse(meta);
    summary = [
      `Image: ${m.image?.width}×${m.image?.height}px`,
      m.pose
        ? `Head tilt ${m.pose.rollDeg}°, turn ${m.pose.yaw}, centre ${m.pose.centreX}`
        : "Pose: not measured",
      m.tilt ? `Phone β ${m.tilt.beta}°, γ ${m.tilt.gamma}°` : "Phone tilt: no sensor",
      m.guidesPx
        ? `Green x=${m.guidesPx.greenX}, yellow x=${m.guidesPx.yellowLeftX}/${m.guidesPx.yellowRightX}, red y=${m.guidesPx.redAY}/${m.guidesPx.redBY}`
        : "",
      m.checksPassed === false ? "⚠ Sent with checks NOT all passed" : "All checks passed",
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    summary = "Metadata unreadable";
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = name.replace(/[^\w-]+/g, "_").slice(0, 40) || "client";
  const caption = `Brow selfie: ${name} (${phone})\n${summary}`.slice(0, 1024);

  const tg = new FormData();
  tg.append("chat_id", chatId);
  tg.append("caption", caption);
  tg.append("document", photo, `${safeName}_${stamp}.jpg`);

  try {
    const res = await sendDocument(token, tg);
    if (!res.ok) {
      console.error("brow-selfie: Telegram returned", res.status);
      return NextResponse.json({ error: "Could not deliver photo" }, { status: 502 });
    }
  } catch (err) {
    console.error("brow-selfie: Telegram request failed", err);
    return NextResponse.json({ error: "Could not deliver photo" }, { status: 502 });
  }

  // Full metadata as a JSON file, for the measurement step.
  const metaForm = new FormData();
  metaForm.append("chat_id", chatId);
  metaForm.append(
    "document",
    new Blob([meta || "{}"], { type: "application/json" }),
    `${safeName}_${stamp}.json`,
  );
  await sendDocument(token, metaForm).catch(() => undefined);

  return NextResponse.json({ success: true });
}
