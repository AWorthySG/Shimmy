"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Locale = "en" | "zh";

interface I18nContextType {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "zh" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = locale === "en" ? en : zh;
      return dict[key] ?? key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ──────────────────────────────────────────────
   COPY DICTIONARY

   Voice guide for Shimmyhands:
   - Confident, not corporate
   - Warm but direct — like a friend who happens to be an expert
   - Slightly playful, never stiff
   - Short punchy sentences mixed with longer flowing ones
   - Avoid: "natural-looking results", "experienced artist",
     "premium service", "brow specialist" — every SG studio says this
   ────────────────────────────────────────────── */

const en: Record<string, string> = {
  // ─── Nav ───
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.about": "About",
  "nav.gallery": "Gallery",
  "nav.contact": "Contact",
  "nav.availability": "Availability",
  "nav.book": "Book Now",
  "nav.brows": "Brows",
  "nav.nails": "Nails",
  "nav.brows.studio": "Brows by Shimmyhands",
  "nav.nails.studio": "Nails by Shimmyhands",
  "nav.shop": "Shop",

  // ─── Hero ───
  "hero.tag": "Brow Studio, Singapore",
  "hero.title.1": "Brows That Feel",
  "hero.title.2": "Like You.",
  "hero.desc":
    "Every pair we create is shaped around you — your bone structure, your features, your everyday life. Because the best brows are the ones that look like they were always there.",
  "hero.cta.book": "Let's Chat",
  "hero.cta.services": "Explore Services",
  "hero.scroll": "Scroll",

  // ─── Featured Services ───
  "services.tag": "Our Services",
  "services.title": "Find Your Fit",
  "services.embroidery.title": "Eyebrow Embroidery",
  "services.embroidery.desc":
    "Where it all began. Fine blade strokes that build gentle fullness — the kind that looks effortless, not obvious.",
  "services.nano.title": "Nano Brows",
  "services.nano.desc":
    "A digital nano-needle for strokes so fine and natural, people will simply think you were born with beautiful brows.",
  "services.ombre.title": "Ombre Powder Brows",
  "services.ombre.desc":
    "That soft, powdery finish you love — the one that usually takes 15 minutes every morning. This one stays for up to two years.",
  "services.viewall": "View All Services →",

  // ─── About Snippet (Home) ───
  "about.tag": "Why Shimmyhands",
  "about.title.1": "It's All in",
  "about.title.2": "the Details",
  "about.p1":
    "We like to take our time. Where most consultations last a few minutes, ours can take much longer — because we believe getting the shape right is the most important part of the whole process.",
  "about.p2":
    "We're here to help you discover the brows that were always meant to be yours. Not someone else's shape — yours.",
  "about.link": "Our Story →",

  // ─── Testimonials ───
  "testimonials.tag": "Kind Words",
  "testimonials.title": "What Our Clients Say",
  "testimonials.1.text":
    "I'd had embroidery done twice before at other places. Both times I left feeling just okay. This time I left feeling like myself — only better. Such a lovely difference.",
  "testimonials.1.name": "Hui Ling Tan",
  "testimonials.1.service": "Eyebrow Embroidery",
  "testimonials.2.text":
    "My friends keep saying something looks different about me, but they can't quite tell what. That's how you know it's right — it just looks like a better version of you.",
  "testimonials.2.name": "Priya Nair",
  "testimonials.2.service": "Nano Brows",
  "testimonials.3.text":
    "I was really nervous beforehand. She walked me through every step, kept checking I was comfortable, and the result is honestly the best beauty decision I've ever made.",
  "testimonials.3.name": "Nurul Aisyah",
  "testimonials.3.service": "Ombre Powder Brows",

  // ─── CTA ───
  "cta.title.1": "Ready for Your Brows to",
  "cta.title.2": "Shimmy",
  "cta.desc":
    "Send us a message whenever you're ready. No pressure at all — just a friendly conversation about what might work for you.",
  "cta.whatsapp": "WhatsApp Us",
  "cta.instagram": "Follow on Instagram",

  // ─── Home (Unified) ───
  "home.tag": "Beauty Studio, Singapore",
  "home.title.1": "Beauty That Speaks",
  "home.title.2": "Softly.",
  "home.desc": "Two art forms, one philosophy — every detail shaped around you. From brows that frame your face to nails that tell your story.",
  "home.brows.title": "Brows by Shimmyhands",
  "home.brows.desc": "Eyebrow embroidery designed for your face. Not a template — yours. Fine strokes, careful precision, natural results.",
  "home.brows.cta": "Explore Brows →",
  "home.nails.title": "Nails by Shimmyhands",
  "home.nails.desc": "Handcrafted press-on nails that feel like fingertip jewelry. Each set designed, each detail painted by hand.",
  "home.nails.cta": "Shop Nails →",
  "home.cta.title.1": "Ready to",
  "home.cta.title.2": "Shimmy",
  "home.cta.desc": "Whether it's brows or nails — we'd love to hear from you.",

  // ─── Nails ───
  "nails.hero.tag": "Press-On Nails, Singapore",
  "nails.hero.title.1": "Nails That Tell",
  "nails.hero.title.2": "a Story.",
  "nails.hero.desc": "Handcrafted press-on nail sets — each one designed and painted by hand. Fingertip jewelry like no other.",
  "nails.hero.cta": "Shop Collections",
  "nails.shop.tag": "Collections",
  "nails.shop.title": "Shop Press-On Nails",

  // ─── Cart ───
  "cart.title": "Your Bag",
  "cart.empty": "Your bag is empty",
  "cart.checkout": "Checkout",
  "cart.subtotal": "Subtotal",

  // ─── Shop ───
  "shop.all": "All",
  "shop.add": "Add to Bag",
  "shop.added": "Added!",
  "shop.back": "\u2190 Back",
  "shop.back.shop": "\u2190 Back to Shop",
  "shop.back.collection": "\u2190 Back to Collection",
  "shop.also.like": "You May Also Like",
  "shop.filter": "Filter by Collection",
  "shop.handcrafted.tag": "Handcrafted",
  "shop.handcrafted.title": "Made by Hand, Worn with Love",
  "shop.handcrafted.desc": "Every set is designed and painted by hand in our Singapore studio. No moulds, no mass production \u2014 just careful artistry, one nail at a time.",

  // ─── Services Page ───
  "svcpage.tag": "Our Services",
  "svcpage.title": "What We Offer",
  "svcpage.desc":
    "Every session begins with a thoughtful conversation. We'll take the time to understand what suits you before anything else.",
  "svcpage.includes": "What's Included",
  "svcpage.unsure.title": "Not Sure Where to Start?",
  "svcpage.unsure.desc":
    "That's completely okay — it's exactly what the consultation is for. Just drop us a message about what you'd like to change, and we'll work it out together.",

  // ─── Services Data ───
  "svc.embroidery.title": "Eyebrow Embroidery",
  "svc.embroidery.price": "From $388",
  "svc.embroidery.duration": "2 — 2.5 hours",
  "svc.embroidery.desc":
    "Our signature technique. Fine blade strokes that build natural fullness one hair at a time — for brows that look like they simply grew that way.",
  "svc.embroidery.inc.1": "Full brow design consultation (we take our time with this)",
  "svc.embroidery.inc.2": "Numbing for a comfortable experience",
  "svc.embroidery.inc.3": "Two-pass layering for realistic depth",
  "svc.embroidery.inc.4": "Take-home aftercare kit",

  "svc.microblading.title": "Microblading",
  "svc.microblading.price": "From $488",
  "svc.microblading.duration": "2 — 2.5 hours",
  "svc.microblading.desc":
    "Hand-drawn strokes with a manual blade, where each line is crafted to mimic a real hair. The kind of subtle detail that makes your brows look quietly beautiful.",
  "svc.microblading.inc.1": "Brow mapping with symmetry analysis",
  "svc.microblading.inc.2": "Custom pigment colour matching",
  "svc.microblading.inc.3": "Featherlight stroke technique",
  "svc.microblading.inc.4": "Complimentary touch-up within 6 weeks",

  "svc.nano.title": "Nano Brows",
  "svc.nano.price": "From $588",
  "svc.nano.duration": "2 — 3 hours",
  "svc.nano.desc":
    "Our most precise technique. A digital nano-needle places pigment with remarkable accuracy, and it works beautifully on every skin type — including oilier skin where other methods sometimes fade.",
  "svc.nano.inc.1": "Digital precision brow mapping",
  "svc.nano.inc.2": "Nano-needle technology (finest available)",
  "svc.nano.inc.3": "Suitable for all skin types, including oily",
  "svc.nano.inc.4": "Long-lasting results: 18–24 months",

  "svc.ombre.title": "Ombre Powder Brows",
  "svc.ombre.price": "From $488",
  "svc.ombre.duration": "2 — 2.5 hours",
  "svc.ombre.desc":
    "Lighter at the front, gently deeper at the tail — that soft, powdered look you might spend time creating each morning, except this one stays put for up to two years.",
  "svc.ombre.inc.1": "Custom gradient density",
  "svc.ombre.inc.2": "Soft machine shading technique",
  "svc.ombre.inc.3": "Lovely for those who fill their brows daily",
  "svc.ombre.inc.4": "Low maintenance, beautiful results",

  "svc.shaping.title": "Brow Shaping & Design",
  "svc.shaping.price": "From $48",
  "svc.shaping.duration": "30 — 45 minutes",
  "svc.shaping.desc":
    "Not quite ready for semi-permanent? This is a lovely place to start. We'll sculpt the perfect arch for your face using threading, waxing, or a combination of both.",
  "svc.shaping.inc.1": "Face shape and bone structure analysis",
  "svc.shaping.inc.2": "Precision brow mapping",
  "svc.shaping.inc.3": "Threading, waxing, or combination technique",
  "svc.shaping.inc.4": "Brow setting gel finish",

  "svc.lip.title": "Lip Blush",
  "svc.lip.price": "From $488",
  "svc.lip.duration": "2 — 2.5 hours",
  "svc.lip.desc":
    "A soft, semi-permanent tint that gives your lips a gentle flush of colour — like a quiet glow that brightens your whole face.",
  "svc.lip.inc.1": "Lip shape and colour consultation",
  "svc.lip.inc.2": "Custom pigment blending",
  "svc.lip.inc.3": "Numbing for comfort",
  "svc.lip.inc.4": "Touch-up session included",

  // ─── About Page ───
  "aboutpage.tag": "Who We Are",
  "aboutpage.title": "About Shimmyhands",
  "aboutpage.headline.1": "Why We Do",
  "aboutpage.headline.2": "What We Do",
  "aboutpage.p1":
    "Shimmyhands began because we kept seeing the same thing — people leaving studios with brows that didn't quite feel like them. The same shapes, the same arches, the same slightly-too-obvious look.",
  "aboutpage.p2":
    "So we decided to do things differently. We became deeply curious about face shapes, stroke angles, and pigment science — all the small things that make the difference between brows that look done and brows that look like yours.",
  "aboutpage.p3":
    "Every person who sits with us gets the same care: our full attention, an honest conversation, and brows designed thoughtfully for their face. We'd rather take longer and get it right.",
  "aboutpage.values.tag": "How We Work",
  "aboutpage.values.title": "What We Believe In",
  "aboutpage.v1.title": "Careful Precision",
  "aboutpage.v1.desc":
    "We measure twice, three times, sometimes more. Brow mapping is the foundation of everything we do — we believe in getting it right before we begin.",
  "aboutpage.v2.title": "Gentle Honesty",
  "aboutpage.v2.desc":
    "If we think a different shape would suit you better, we'll gently let you know. Our goal is always for you to leave feeling genuinely happy with the result.",
  "aboutpage.v3.title": "Your Comfort Comes First",
  "aboutpage.v3.desc":
    "We always use numbing, and we always check in. The whole experience should feel calm, safe, and unhurried — that matters just as much as the result.",
  "aboutpage.v4.title": "Thoughtful Ingredients",
  "aboutpage.v4.desc":
    "We're particular about our pigments — certified, tested, and chosen because they heal true to colour. Good materials make a real difference in how your brows look and last.",
  "aboutpage.certs.tag": "Credentials",
  "aboutpage.certs.title": "Always Learning",
  "aboutpage.certs.desc":
    "Certified across multiple advanced techniques and always upskilling. We stay curious because our clients deserve the very best we can offer.",
  "aboutpage.cta.title.1": "Ready for Your Brows to",
  "aboutpage.cta.title.2": "Shimmy",
  "aboutpage.cta.desc": "We'd love to create something you'll enjoy waking up to.",
  "aboutpage.cta.btn": "Get in Touch",

  // ─── Gallery Page ───
  "gallery.tag": "Our Work",
  "gallery.title": "Gallery",
  "gallery.desc":
    "Real clients, real brows, no filters. Every pair is designed from scratch — each one is as unique as the person wearing them.",
  "gallery.ig": "See More on Instagram →",
  "gallery.ig.desc":
    "We share our latest work and behind-the-scenes moments on Instagram.",

  // ─── Contact Page ───
  "contact.tag": "Say Hello",
  "contact.title": "We'd Love to Hear from You",
  "contact.desc":
    "Whether you know exactly what you'd like or you're still figuring it out — either way, we're happy to help.",
  "contact.book.title.1": "Book Your",
  "contact.book.title.2": "Session",
  "contact.book.desc":
    "WhatsApp is the quickest way to reach us. Instagram DMs work too. We usually reply within a few hours.",
  "contact.wa.label": "WhatsApp",
  "contact.wa.desc": "+65 1234 5678 — Quickest way to reach us",
  "contact.ig.label": "Instagram",
  "contact.ig.desc": "@shimmyhands.shop — DMs always open",
  "contact.hours.tag": "Studio Hours",
  "contact.hours.mf": "Monday — Friday",
  "contact.hours.mf.time": "10:00 AM — 8:00 PM",
  "contact.hours.sat": "Saturday",
  "contact.hours.sat.time": "10:00 AM — 6:00 PM",
  "contact.hours.sun": "Sunday",
  "contact.hours.sun.time": "By Appointment Only",
  "contact.visit.title": "Visit Us",
  "contact.visit.desc":
    "We're by appointment only — walk-ins are welcome but availability isn't guaranteed, so booking ahead is best.",
  "contact.visit.address.1": "123 Orchard Road, #04-56",
  "contact.visit.address.2": "Singapore 238888",
  "contact.prep.tag": "A Few Things Before You Visit",
  "contact.prep.1": "Try to avoid caffeine and alcohol for 24 hours beforehand",
  "contact.prep.2": "Come with clean, bare brows — no brow makeup please",
  "contact.prep.3": "Arriving 10 minutes early gives us time for a proper chat",
  "contact.prep.4": "Do let us know about any skin conditions or allergies",

  // ─── Footer ───
  "footer.desc":
    "Brows designed for your face — thoughtfully, one appointment at a time.",
  "footer.links": "Quick Links",
  "footer.contact": "Get In Touch",
  "footer.rights": "All rights reserved.",
  "footer.location": "Singapore",
};

const zh: Record<string, string> = {
  // ─── Nav ───
  "nav.home": "首页",
  "nav.services": "服务",
  "nav.about": "关于",
  "nav.gallery": "作品",
  "nav.contact": "联系",
  "nav.availability": "预约时段",
  "nav.book": "立即预约",
  "nav.brows": "眉毛",
  "nav.nails": "美甲",
  "nav.brows.studio": "Brows by Shimmyhands",
  "nav.nails.studio": "Nails by Shimmyhands",
  "nav.shop": "商店",

  // ─── Hero ───
  "hero.tag": "新加坡眉毛工作室",
  "hero.title.1": "属于你的",
  "hero.title.2": "自然美眉。",
  "hero.desc":
    "每一对眉毛都根据你的骨骼结构、五官特征和个人风格用心设计。因为最好的眉毛，是看起来一直就在那里的眉毛。",
  "hero.cta.book": "聊一聊",
  "hero.cta.services": "了解服务",
  "hero.scroll": "下滑",

  // ─── Featured Services ───
  "services.tag": "我们的服务",
  "services.title": "找到适合你的",
  "services.embroidery.title": "绣眉",
  "services.embroidery.desc":
    "一切的起点。精细刀片一笔一画，温柔地打造自然丰盈感——自然得不着痕迹。",
  "services.nano.title": "纳米雾眉",
  "services.nano.desc":
    "数字纳米针带来极其细腻的线条，自然到让人以为你天生就拥有这样的好眉毛。",
  "services.ombre.title": "渐变粉黛眉",
  "services.ombre.desc":
    "你喜欢的那种柔和粉雾感——平时可能要花15分钟来画，而这个可以维持两年。",
  "services.viewall": "查看全部服务 →",

  // ─── About Snippet (Home) ───
  "about.tag": "为什么选择我们",
  "about.title.1": "用心在",
  "about.title.2": "每个细节",
  "about.p1":
    "我们喜欢慢慢来。别的地方咨询可能几分钟就结束了，而我们会花更多时间——因为我们相信，把眉形定好是整个过程中最重要的一步。",
  "about.p2":
    "我们想帮你找到一直属于你的那对眉毛。不是别人的形状，是你自己的。",
  "about.link": "我们的故事 →",

  // ─── Testimonials ───
  "testimonials.tag": "温暖好评",
  "testimonials.title": "客人们怎么说",
  "testimonials.1.text":
    "之前在别的地方做过两次绣眉，每次都觉得还可以吧。这次走出来，觉得像自己——但更好了。感觉很不一样。",
  "testimonials.1.name": "Hui Ling Tan",
  "testimonials.1.service": "绣眉",
  "testimonials.2.text":
    "朋友一直说我好像变了什么，但说不上来具体哪里。这就是最好的效果——看起来只是更好看了。",
  "testimonials.2.name": "Priya Nair",
  "testimonials.2.service": "纳米雾眉",
  "testimonials.3.text":
    "之前真的好紧张。她全程温柔地解释每一步，不断确认我舒不舒服，结果真的是我做过最值得的美容决定。",
  "testimonials.3.name": "Nurul Aisyah",
  "testimonials.3.service": "渐变粉黛眉",

  // ─── CTA ───
  "cta.title.1": "准备好让你的眉毛",
  "cta.title.2": "Shimmy",
  "cta.desc": "随时给我们发消息就好。没有任何压力——只是一场关于你的眉毛的温暖对话。",
  "cta.whatsapp": "WhatsApp 联系",
  "cta.instagram": "关注 Instagram",

  // ─── Home (Unified) ───
  "home.tag": "美容工作室·新加坡",
  "home.title.1": "温柔诉说的",
  "home.title.2": "美丽。",
  "home.desc": "两种艺术，一个理念——每个细节都围绕你而设计。从修饰脸庞的眉毛，到诉说故事的指甲。",
  "home.brows.title": "Brows by Shimmyhands",
  "home.brows.desc": "为你的脸量身设计的绣眉。不是模板——是属于你的。精细线条，用心精准，自然效果。",
  "home.brows.cta": "了解眉毛服务 →",
  "home.nails.title": "Nails by Shimmyhands",
  "home.nails.desc": "手工打造的穿戴甲，如同指尖上的珠宝。每一套都用心设计，每一个细节都手工绘制。",
  "home.nails.cta": "选购美甲 →",
  "home.cta.title.1": "准备好",
  "home.cta.title.2": "Shimmy",
  "home.cta.desc": "无论是眉毛还是美甲——我们都期待你的消息。",

  // ─── Nails ───
  "nails.hero.tag": "穿戴甲·新加坡",
  "nails.hero.title.1": "诉说故事的",
  "nails.hero.title.2": "指甲。",
  "nails.hero.desc": "手工打造的穿戴甲套装——每一套都用心设计和手绘。独一无二的指尖珠宝。",
  "nails.hero.cta": "浏览系列",
  "nails.shop.tag": "系列",
  "nails.shop.title": "选购穿戴甲",

  // ─── Cart ───
  "cart.title": "购物袋",
  "cart.empty": "购物袋是空的",
  "cart.checkout": "结账",
  "cart.subtotal": "小计",

  // ─── Shop ───
  "shop.all": "全部",
  "shop.add": "加入购物袋",
  "shop.added": "已添加！",
  "shop.back": "\u2190 返回",
  "shop.back.shop": "\u2190 返回商店",
  "shop.back.collection": "\u2190 返回系列",
  "shop.also.like": "你可能也喜欢",
  "shop.filter": "按系列筛选",
  "shop.handcrafted.tag": "手工制作",
  "shop.handcrafted.title": "手工制作，用心佩戴",
  "shop.handcrafted.desc": "每一套都在我们的新加坡工作室手工设计和绑制。没有模具，没有批量生产\u2014\u2014只有用心的艺术，一片一片地完成。",

  // ─── Services Page ───
  "svcpage.tag": "我们的服务",
  "svcpage.title": "服务项目",
  "svcpage.desc":
    "每次服务都从一场用心的对话开始。我们会先花时间了解什么适合你，然后才进行下一步。",
  "svcpage.includes": "服务包含",
  "svcpage.unsure.title": "不确定从哪里开始？",
  "svcpage.unsure.desc":
    "完全没关系——这正是咨询的意义所在。告诉我们你想改变什么，我们一起找到最适合你的方案。",

  // ─── Services Data ───
  "svc.embroidery.title": "绣眉",
  "svc.embroidery.price": "从 $388 起",
  "svc.embroidery.duration": "2 — 2.5 小时",
  "svc.embroidery.desc":
    "我们的招牌技法。精细刀片逐根描绘，打造自然丰盈的眉毛——像天生长出来的那样自然。",
  "svc.embroidery.inc.1": "完整眉形设计咨询（我们会花时间好好聊）",
  "svc.embroidery.inc.2": "舒缓麻醉，让你安心放松",
  "svc.embroidery.inc.3": "双层叠加，打造逼真深度",
  "svc.embroidery.inc.4": "带走术后护理套装",

  "svc.microblading.title": "微刀雕眉",
  "svc.microblading.price": "从 $488 起",
  "svc.microblading.duration": "2 — 2.5 小时",
  "svc.microblading.desc":
    "手工逐笔描绘，每一笔都模仿真实毛发。那种安静而美好的细腻感，让你的眉毛看起来自然又精致。",
  "svc.microblading.inc.1": "眉形测量与对称分析",
  "svc.microblading.inc.2": "定制色素颜色匹配",
  "svc.microblading.inc.3": "轻羽毛线条技法",
  "svc.microblading.inc.4": "6周内免费补色",

  "svc.nano.title": "纳米雾眉",
  "svc.nano.price": "从 $588 起",
  "svc.nano.duration": "2 — 3 小时",
  "svc.nano.desc":
    "我们最精细的技术。数字纳米针精准植入色素，效果出色，而且特别适合各种肤质——包括容易让其他技术褪色的油性皮肤。",
  "svc.nano.inc.1": "数字精准眉形设计",
  "svc.nano.inc.2": "纳米针技术（最精细级别）",
  "svc.nano.inc.3": "适合所有肤质，包括油性",
  "svc.nano.inc.4": "持久效果：18–24 个月",

  "svc.ombre.title": "渐变粉黛眉",
  "svc.ombre.price": "从 $488 起",
  "svc.ombre.duration": "2 — 2.5 小时",
  "svc.ombre.desc":
    "前面淡淡的，尾部渐渐加深——就像你每天精心晕染眉粉的效果，只不过这个可以维持两年左右。",
  "svc.ombre.inc.1": "定制渐变浓度",
  "svc.ombre.inc.2": "柔和机器晕染技法",
  "svc.ombre.inc.3": "非常适合每天画眉的你",
  "svc.ombre.inc.4": "好打理，效果美",

  "svc.shaping.title": "眉形设计",
  "svc.shaping.price": "从 $48 起",
  "svc.shaping.duration": "30 — 45 分钟",
  "svc.shaping.desc":
    "还没准备好做半永久？这是一个很好的起点。我们会用线雕、热蜡或两者结合，为你找到最适合的眉形。",
  "svc.shaping.inc.1": "脸型与骨骼结构分析",
  "svc.shaping.inc.2": "精准眉形设计",
  "svc.shaping.inc.3": "线雕、热蜡或组合技法",
  "svc.shaping.inc.4": "眉毛定型凝胶收尾",

  "svc.lip.title": "唇部轻纹",
  "svc.lip.price": "从 $488 起",
  "svc.lip.duration": "2 — 2.5 小时",
  "svc.lip.desc":
    "柔和的半永久唇色，给嘴唇添上一层淡淡的红润——那种安静的光彩，能温柔地点亮整张脸。",
  "svc.lip.inc.1": "唇形与颜色咨询",
  "svc.lip.inc.2": "定制色素调配",
  "svc.lip.inc.3": "舒缓麻醉",
  "svc.lip.inc.4": "包含补色服务",

  // ─── About Page ───
  "aboutpage.tag": "关于我们",
  "aboutpage.title": "关于 Shimmyhands",
  "aboutpage.headline.1": "我们做这件事",
  "aboutpage.headline.2": "是有原因的",
  "aboutpage.p1":
    "Shimmyhands 的诞生，是因为我们总看到同样的情况——人们带着不太像自己的眉毛离开工作室。千篇一律的形状、一样的弧度、那种稍显明显的感觉。",
  "aboutpage.p2":
    "所以我们决定用不同的方式来做。我们对脸型、线条角度和色素科学变得非常好奇——那些让眉毛从「做过的」变成「像你的」的小小细节。",
  "aboutpage.p3":
    "每一位来找我们的客人都会得到同样的用心：全部的专注、真诚的建议，以及为她的脸精心设计的眉毛。我们宁愿多花一点时间，也要做到最好。",
  "aboutpage.values.tag": "我们的工作方式",
  "aboutpage.values.title": "我们相信的",
  "aboutpage.v1.title": "用心精准",
  "aboutpage.v1.desc":
    "我们会量两次、三次、甚至更多。眉形设计是一切的基础——我们相信在开始之前，要先把它做对。",
  "aboutpage.v2.title": "温柔坦诚",
  "aboutpage.v2.desc":
    "如果我们觉得另一个形状可能更适合你，会温和地告诉你。我们的目标始终是让你带着真正的满意离开。",
  "aboutpage.v3.title": "你的舒适最重要",
  "aboutpage.v3.desc":
    "我们一定会用麻醉，也一定会关心你的感受。整个过程应该是平静、安心、不赶时间的——这和结果一样重要。",
  "aboutpage.v4.title": "用心选材",
  "aboutpage.v4.desc":
    "我们对色素很讲究——经过认证和测试，选择它们是因为愈合后颜色准确。好的材料，对眉毛的效果和持久度真的有很大的影响。",
  "aboutpage.certs.tag": "资质认证",
  "aboutpage.certs.title": "持续学习",
  "aboutpage.certs.desc":
    "多项高级技术认证，持续进修。我们保持好奇心，因为客人值得我们做到最好。",
  "aboutpage.cta.title.1": "准备好让你的眉毛",
  "aboutpage.cta.title.2": "Shimmy",
  "aboutpage.cta.desc": "期待为你创造每天醒来都会喜欢的眉毛。",
  "aboutpage.cta.btn": "联系我们",

  // ─── Gallery Page ───
  "gallery.tag": "我们的作品",
  "gallery.title": "作品展示",
  "gallery.desc":
    "真实客人，真实眉毛，没有滤镜。每一对都从零开始设计——每一对都独一无二。",
  "gallery.ig": "更多作品在 Instagram →",
  "gallery.ig.desc": "我们在 Instagram 上分享最新作品和幕后日常。",

  // ─── Contact Page ───
  "contact.tag": "联系我们",
  "contact.title": "期待你的消息",
  "contact.desc": "无论你已经想好了还是还在考虑——我们都很乐意帮忙。",
  "contact.book.title.1": "预约",
  "contact.book.title.2": "你的时间",
  "contact.book.desc":
    "WhatsApp 是最快的联系方式。Instagram 私信也可以。我们通常几小时内回复。",
  "contact.wa.label": "WhatsApp",
  "contact.wa.desc": "+65 1234 5678 — 最快联系方式",
  "contact.ig.label": "Instagram",
  "contact.ig.desc": "@shimmyhands.shop — 私信随时开放",
  "contact.hours.tag": "营业时间",
  "contact.hours.mf": "周一至周五",
  "contact.hours.mf.time": "上午 10:00 — 晚上 8:00",
  "contact.hours.sat": "周六",
  "contact.hours.sat.time": "上午 10:00 — 下午 6:00",
  "contact.hours.sun": "周日",
  "contact.hours.sun.time": "仅限预约",
  "contact.visit.title": "来找我们",
  "contact.visit.desc": "我们采用预约制——也欢迎直接到访，但无法保证有空位，建议提前预约哦。",
  "contact.visit.address.1": "123 Orchard Road, #04-56",
  "contact.visit.address.2": "Singapore 238888",
  "contact.prep.tag": "到店前的小提醒",
  "contact.prep.1": "预约前24小时尽量避免咖啡和酒精",
  "contact.prep.2": "请素颜到店，眉毛不要化妆",
  "contact.prep.3": "提前10分钟到，让我们有时间好好聊",
  "contact.prep.4": "如有任何皮肤问题或过敏，请提前告知我们",

  // ─── Footer ───
  "footer.desc": "为你的脸用心设计的眉毛——一次一个预约。",
  "footer.links": "快速导航",
  "footer.contact": "联系方式",
  "footer.rights": "版权所有。",
  "footer.location": "新加坡",
};
