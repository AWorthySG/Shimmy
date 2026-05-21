import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import type { Context } from "grammy";
import {
  products,
  collections,
  getProductsByCollection,
  type Product,
} from "./products";
import { getSupabase } from "./supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shimmyhands.com";
const WA_NUMBER = "6589308973";

// ─── Bot singleton ───

let bot: Bot | null = null;

export function getBot(): Bot {
  if (bot) return bot;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  bot = new Bot(token);
  registerHandlers(bot);
  return bot;
}

export function getTelegramWebhook() {
  return webhookCallback(getBot(), "std/http");
}

// ─── Cart persistence (Supabase, keyed by tg:<user_id>) ───

interface TgCartItem {
  productId: string;
  quantity: number;
}

async function loadCart(userId: number): Promise<TgCartItem[]> {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from("cart_sessions")
      .select("items")
      .eq("session_id", `tg:${userId}`)
      .single();
    if (data?.items && Array.isArray(data.items)) return data.items;
  } catch {}
  return [];
}

async function saveCart(userId: number, items: TgCartItem[]) {
  try {
    const sb = getSupabase();
    await sb.from("cart_sessions").upsert(
      {
        session_id: `tg:${userId}`,
        items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    );
  } catch {}
}

function resolveCart(
  items: TgCartItem[]
): { product: Product; quantity: number }[] {
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter(Boolean) as { product: Product; quantity: number }[];
}

// ─── Helpers ───

function fmtPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

function productUrl(p: Product) {
  return `${SITE_URL}/nails/shop/${p.collectionHandle}/${p.handle}`;
}

function productImageUrl(p: Product) {
  return `${SITE_URL}${p.images[0]}`;
}

function truncate(s: string, len: number) {
  return s.length > len ? s.slice(0, len - 1) + "…" : s;
}

// ─── Keyboards ───

function mainMenuKb() {
  return new InlineKeyboard()
    .text("🛍 Browse Collections", "collections")
    .text("🔍 All Products", "all_products")
    .row()
    .text("🛒 My Cart", "view_cart")
    .text("💬 Contact Us", "contact")
    .row()
    .url("🌐 Visit Website", SITE_URL);
}

function collectionsKb() {
  const kb = new InlineKeyboard();
  for (const col of collections) {
    kb.text(col.title, `col:${col.handle}`).row();
  }
  kb.text("« Back to Menu", "main_menu");
  return kb;
}

function productListKb(prods: Product[], backAction: string) {
  const kb = new InlineKeyboard();
  for (const p of prods) {
    kb.text(`${p.title} — ${fmtPrice(p.price)}`, `prod:${p.id}`).row();
  }
  kb.text("« Back", backAction);
  return kb;
}

function productDetailKb(p: Product) {
  return new InlineKeyboard()
    .text("🛒 Add to Cart", `add:${p.id}`)
    .text("🔗 View Online", `link:${p.id}`)
    .row()
    .text("« Back to Collection", `col:${p.collectionHandle}`)
    .text("« Menu", "main_menu");
}

function cartKb(items: TgCartItem[]) {
  const kb = new InlineKeyboard();
  for (const item of items) {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) continue;
    kb.text(`➖ ${truncate(prod.title, 20)}`, `cart_rm:${item.productId}`)
      .text(`${item.quantity}×`, `cart_qty:${item.productId}`)
      .text("➕", `cart_add:${item.productId}`)
      .row();
  }
  if (items.length > 0) {
    kb.text("💬 Checkout via WhatsApp", "checkout").row();
    kb.text("🗑 Clear Cart", "clear_cart").text("« Menu", "main_menu");
  } else {
    kb.text("🛍 Browse", "collections").text("« Menu", "main_menu");
  }
  return kb;
}

// ─── Message builders ───

function welcomeText() {
  return [
    "✨ *Welcome to Nails by Shimmyhands* ✨",
    "",
    "Handcrafted press-on nail art from Singapore.",
    "Browse our collections, add to cart, and checkout via WhatsApp\\!",
    "",
    "Tap a button below to get started\\.",
  ].join("\n");
}

function productCaption(p: Product) {
  const lines = [
    `*${escMd(p.title)}*`,
    `_${escMd(p.collection)}_`,
    "",
    escMd(p.description),
    "",
  ];
  if (p.compareAtPrice) {
    lines.push(
      `~${escMd(fmtPrice(p.compareAtPrice))}~ → *${escMd(fmtPrice(p.price))}*`
    );
  } else {
    lines.push(`*${escMd(fmtPrice(p.price))}*`);
  }
  if (p.features.length) {
    lines.push("", p.features.map((f) => `• ${escMd(f)}`).join("\n"));
  }
  return lines.join("\n");
}

function cartText(
  resolved: { product: Product; quantity: number }[]
): string {
  if (resolved.length === 0) {
    return "🛒 *Your cart is empty*\n\nBrowse our collections to find your perfect nails\\!";
  }
  let total = 0;
  const lines = resolved.map((r) => {
    const sub = r.product.price * r.quantity;
    total += sub;
    return `• ${escMd(r.product.title)} × ${r.quantity} — ${escMd(fmtPrice(sub))}`;
  });
  return [
    "🛒 *Your Cart*",
    "",
    ...lines,
    "",
    `*Total: ${escMd(fmtPrice(total))}*`,
    "",
    "Use ➕/➖ to adjust, or tap Checkout to order via WhatsApp\\.",
  ].join("\n");
}

function checkoutMessage(
  resolved: { product: Product; quantity: number }[]
): string {
  let total = 0;
  const lines = resolved.map((r) => {
    const sub = r.product.price * r.quantity;
    total += sub;
    return `• ${r.product.title} (${r.product.collection}) × ${r.quantity} — $${sub.toFixed(2)}`;
  });
  return [
    "Hi! I'd like to order from Nails by Shimmyhands 💅",
    "",
    ...lines,
    "",
    `Total: $${total.toFixed(2)}`,
    "",
    "Could you help me confirm availability and arrange payment? Thank you!",
  ].join("\n");
}

function escMd(s: string) {
  return s.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

// ─── Register handlers ───

function registerHandlers(b: Bot) {
  b.command("start", async (ctx) => {
    await ctx.reply(welcomeText(), {
      parse_mode: "MarkdownV2",
      reply_markup: mainMenuKb(),
    });
  });

  b.command("help", async (ctx) => {
    await ctx.reply(
      [
        "*Nails by Shimmyhands Bot* 💅",
        "",
        "/start — Main menu",
        "/shop — Browse collections",
        "/cart — View your cart",
        "/help — This help message",
        "",
        "You can also tap the buttons below any message to navigate\\!",
      ].join("\n"),
      { parse_mode: "MarkdownV2" }
    );
  });

  b.command("shop", async (ctx) => {
    await ctx.reply("*Collections* ✦\n\nChoose a collection to explore:", {
      parse_mode: "MarkdownV2",
      reply_markup: collectionsKb(),
    });
  });

  b.command("cart", handleViewCart);

  // ─── Callback queries ───

  b.callbackQuery("main_menu", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(welcomeText(), {
      parse_mode: "MarkdownV2",
      reply_markup: mainMenuKb(),
    });
  });

  b.callbackQuery("collections", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      "*Collections* ✦\n\nChoose a collection to explore:",
      { parse_mode: "MarkdownV2", reply_markup: collectionsKb() }
    );
  });

  b.callbackQuery("all_products", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      `*All Products* \\(${products.length} items\\)`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: productListKb(products, "main_menu"),
      }
    );
  });

  b.callbackQuery(/^col:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const handle = ctx.match[1];
    const col = collections.find((c) => c.handle === handle);
    const prods = getProductsByCollection(handle);
    if (!col || prods.length === 0) {
      await ctx.editMessageText("Collection not found\\.", {
        parse_mode: "MarkdownV2",
        reply_markup: collectionsKb(),
      });
      return;
    }
    await ctx.editMessageText(
      `*${escMd(col.title)}*\n\n_${escMd(col.description)}_\n\n${prods.length} product${prods.length > 1 ? "s" : ""}:`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: productListKb(prods, "collections"),
      }
    );
  });

  b.callbackQuery(/^prod:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const p = products.find((pr) => pr.id === ctx.match[1]);
    if (!p) return;
    try {
      await ctx.deleteMessage();
    } catch {}
    await ctx.replyWithPhoto(productImageUrl(p), {
      caption: productCaption(p),
      parse_mode: "MarkdownV2",
      reply_markup: productDetailKb(p),
    });
  });

  b.callbackQuery(/^link:(.+)$/, async (ctx) => {
    const p = products.find((pr) => pr.id === ctx.match[1]);
    if (!p) return;
    await ctx.answerCallbackQuery({ url: productUrl(p) });
  });

  // ─── Cart actions ───

  b.callbackQuery(/^add:(.+)$/, async (ctx) => {
    const userId = ctx.from.id;
    const productId = ctx.match[1];
    const p = products.find((pr) => pr.id === productId);
    if (!p) return;

    const cart = await loadCart(userId);
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    await saveCart(userId, cart);
    await ctx.answerCallbackQuery({
      text: `✅ ${p.title} added to cart!`,
    });
  });

  b.callbackQuery(/^cart_add:(.+)$/, async (ctx) => {
    const userId = ctx.from.id;
    const productId = ctx.match[1];
    const cart = await loadCart(userId);
    const existing = cart.find((i) => i.productId === productId);
    if (existing) existing.quantity += 1;
    await saveCart(userId, cart);
    await ctx.answerCallbackQuery();
    const resolved = resolveCart(cart);
    await ctx.editMessageText(cartText(resolved), {
      parse_mode: "MarkdownV2",
      reply_markup: cartKb(cart),
    });
  });

  b.callbackQuery(/^cart_rm:(.+)$/, async (ctx) => {
    const userId = ctx.from.id;
    const productId = ctx.match[1];
    let cart = await loadCart(userId);
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        cart = cart.filter((i) => i.productId !== productId);
      }
    }
    await saveCart(userId, cart);
    await ctx.answerCallbackQuery();
    const resolved = resolveCart(cart);
    await ctx.editMessageText(cartText(resolved), {
      parse_mode: "MarkdownV2",
      reply_markup: cartKb(cart),
    });
  });

  b.callbackQuery(/^cart_qty:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
  });

  b.callbackQuery("view_cart", handleViewCartCallback);

  b.callbackQuery("clear_cart", async (ctx) => {
    const userId = ctx.from.id;
    await saveCart(userId, []);
    await ctx.answerCallbackQuery({ text: "Cart cleared" });
    await ctx.editMessageText(cartText([]), {
      parse_mode: "MarkdownV2",
      reply_markup: cartKb([]),
    });
  });

  b.callbackQuery("checkout", async (ctx) => {
    const userId = ctx.from.id;
    const cart = await loadCart(userId);
    const resolved = resolveCart(cart);
    if (resolved.length === 0) {
      await ctx.answerCallbackQuery({ text: "Your cart is empty!" });
      return;
    }
    const msg = checkoutMessage(resolved);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    await ctx.answerCallbackQuery();
    await ctx.reply(
      `✅ *Order ready\\!*\n\nTap the link below to complete your order on WhatsApp:`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: new InlineKeyboard()
          .url("💬 Open WhatsApp", waUrl)
          .row()
          .text("« Back to Cart", "view_cart")
          .text("« Menu", "main_menu"),
      }
    );
  });

  b.callbackQuery("contact", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      [
        "*Contact Nails by Shimmyhands* 💅",
        "",
        "📱 WhatsApp: \\+65 8930 8973",
        "📸 Instagram: @shimmyhands\\.shop",
        "🌐 Website: shimmyhands\\.com",
        "",
        "We'd love to hear from you\\!",
      ].join("\n"),
      {
        parse_mode: "MarkdownV2",
        reply_markup: new InlineKeyboard()
          .url("💬 WhatsApp", `https://wa.me/${WA_NUMBER}`)
          .url("📸 Instagram", "https://instagram.com/shimmyhands.shop")
          .row()
          .text("« Back to Menu", "main_menu"),
      }
    );
  });

  // Catch-all for unrecognized text
  b.on("message:text", async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    if (text.includes("shop") || text.includes("browse") || text.includes("nails")) {
      await ctx.reply("*Collections* ✦\n\nChoose a collection to explore:", {
        parse_mode: "MarkdownV2",
        reply_markup: collectionsKb(),
      });
    } else if (text.includes("cart") || text.includes("bag")) {
      await handleViewCart(ctx);
    } else {
      await ctx.reply(welcomeText(), {
        parse_mode: "MarkdownV2",
        reply_markup: mainMenuKb(),
      });
    }
  });
}

// ─── Shared cart view handlers ───

async function handleViewCart(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;
  const cart = await loadCart(userId);
  const resolved = resolveCart(cart);
  await ctx.reply(cartText(resolved), {
    parse_mode: "MarkdownV2",
    reply_markup: cartKb(cart),
  });
}

async function handleViewCartCallback(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;
  await ctx.answerCallbackQuery?.();
  const cart = await loadCart(userId);
  const resolved = resolveCart(cart);
  await ctx.editMessageText?.(cartText(resolved), {
    parse_mode: "MarkdownV2",
    reply_markup: cartKb(cart),
  });
}
