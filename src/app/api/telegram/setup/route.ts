import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 500 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shimmyhands.com";
  const webhookUrl = `${siteUrl}/api/telegram`;

  const res = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
        drop_pending_updates: true,
      }),
    }
  );

  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json(
      { error: "Telegram API error", details: data },
      { status: 502 }
    );
  }

  // Set bot commands menu
  await fetch(
    `https://api.telegram.org/bot${token}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start", description: "Open main menu" },
          { command: "shop", description: "Browse nail collections" },
          { command: "cart", description: "View your shopping cart" },
          { command: "help", description: "Get help" },
        ],
      }),
    }
  );

  return NextResponse.json({
    success: true,
    webhook_url: webhookUrl,
    telegram_response: data,
  });
}

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/getWebhookInfo`
  );
  const data = await res.json();

  return NextResponse.json(data);
}
