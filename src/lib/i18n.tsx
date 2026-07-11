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

   Voice guide for Shimmy:
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
  "nav.wishlist": "Wishlist",
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
    "Where it all began. Fine blade strokes that build gentle fullness — a finish that looks effortless, not obvious.",
  "services.nano.title": "Nano Brows",
  "services.nano.desc":
    "A digital nano-needle delivers strokes so fine that people will simply think you were born with beautiful brows.",
  "services.ombre.title": "Ombre Powder Brows",
  "services.ombre.desc":
    "That soft, powdery finish you love — the one that usually takes 15 minutes every morning. This one stays for up to two years.",
  "services.viewall": "View All Services →",

  // ─── About Snippet (Home) ───
  "about.tag": "Why Shimmy",
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
    "I was really nervous beforehand. She walked me through every step, kept checking I was comfortable, and honestly, it's the best beauty decision I've ever made.",
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
  "home.brows.desc": "Eyebrow embroidery designed for your face. Not a template — yours. Fine strokes, steady hands, brows that look like you.",
  "home.brows.cta": "Explore Brows →",
  "home.nails.title": "Nails by Shimmyhands",
  "home.nails.desc": "Handcrafted press-on nails that feel like fingertip jewellery. Each set designed, each detail painted by hand.",
  "home.nails.cta": "Shop Nails →",
  "home.cta.title.1": "Ready to",
  "home.cta.title.2": "Shimmy",
  "home.cta.desc": "Whether it's brows or nails — we'd love to hear from you.",

  // ─── Nails ───
  "nails.hero.tag": "Press-On Nails, Singapore",
  "nails.hero.title.1": "Nails That Tell",
  "nails.hero.title.2": "a Story.",
  "nails.hero.desc": "Handcrafted press-on nail sets — each one designed and painted by hand. Fingertip jewellery like no other.",
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
  "shop.sizeguide": "Size Guide",
  "shop.sizeguide.title": "Find Your Size",
  "shop.sizeguide.tip": "Measure the widest part of your natural nail. If between sizes, go smaller and file to fit.",
  "shop.sizeguide.close": "Close",
  "shop.sizeguide.blog": "Read the full sizing guide \u2192",
  "shop.restock.title": "Notify me when restocked",
  "shop.restock.btn": "Notify Me",
  "shop.restock.success": "We'll let you know!",

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
  "svc.embroidery.duration": "2–2.5 hours",
  "svc.embroidery.desc":
    "Our signature technique. Fine blade strokes that build gentle fullness one hair at a time — for brows that look like they simply grew that way.",
  "svc.embroidery.inc.1": "Full brow design consultation (we take our time with this)",
  "svc.embroidery.inc.2": "Numbing for a comfortable experience",
  "svc.embroidery.inc.3": "Two-pass layering for realistic depth",
  "svc.embroidery.inc.4": "Take-home aftercare kit",

  "svc.microblading.title": "Microblading",
  "svc.microblading.price": "From $488",
  "svc.microblading.duration": "2–2.5 hours",
  "svc.microblading.desc":
    "Hand-drawn strokes with a manual blade, where each line is crafted to mimic a real hair. The kind of subtle detail that makes your brows look quietly beautiful.",
  "svc.microblading.inc.1": "Brow mapping with symmetry analysis",
  "svc.microblading.inc.2": "Custom pigment colour matching",
  "svc.microblading.inc.3": "Featherlight stroke technique",
  "svc.microblading.inc.4": "Touch-up included within 6–8 weeks",

  "svc.nano.title": "Nano Brows",
  "svc.nano.price": "From $588",
  "svc.nano.duration": "2–3 hours",
  "svc.nano.desc":
    "Our most precise technique. A digital nano-needle places pigment with remarkable accuracy, and it works beautifully on every skin type — including oilier skin where other methods sometimes fade.",
  "svc.nano.inc.1": "Digital precision brow mapping",
  "svc.nano.inc.2": "Nano-needle technology (finest available)",
  "svc.nano.inc.3": "Suitable for all skin types, including oily",
  "svc.nano.inc.4": "Long-lasting results: 18–24 months",

  "svc.ombre.title": "Ombre Powder Brows",
  "svc.ombre.price": "From $488",
  "svc.ombre.duration": "2–2.5 hours",
  "svc.ombre.desc":
    "Lighter at the front, gently deeper at the tail — that soft, powdered look you might spend time creating each morning, except this one stays put for up to two years.",
  "svc.ombre.inc.1": "Custom gradient density",
  "svc.ombre.inc.2": "Soft machine shading technique",
  "svc.ombre.inc.3": "Lovely for those who fill their brows daily",
  "svc.ombre.inc.4": "No daily brow routine needed once healed",

  "svc.shaping.title": "Brow Shaping & Design",
  "svc.shaping.price": "From $48",
  "svc.shaping.duration": "30–45 minutes",
  "svc.shaping.desc":
    "Not quite ready for semi-permanent? This is a lovely place to start. We'll sculpt the perfect arch for your face using threading, waxing, or a combination of both.",
  "svc.shaping.inc.1": "Face shape and bone structure analysis",
  "svc.shaping.inc.2": "Precision brow mapping",
  "svc.shaping.inc.3": "Threading, waxing, or combination technique",
  "svc.shaping.inc.4": "Brow setting gel finish",

  "svc.lip.title": "Lip Blush",
  "svc.lip.price": "From $488",
  "svc.lip.duration": "2–2.5 hours",
  "svc.lip.desc":
    "A soft, semi-permanent tint that gives your lips a gentle flush of colour — like a quiet glow that brightens your whole face.",
  "svc.lip.inc.1": "Lip shape and colour consultation",
  "svc.lip.inc.2": "Custom pigment blending",
  "svc.lip.inc.3": "Numbing for comfort",
  "svc.lip.inc.4": "Touch-up session included",

  // ─── About Page ───
  "aboutpage.tag": "Founder Story",
  "aboutpage.title": "About Shimmy",
  "aboutpage.headline.1": "Meet",
  "aboutpage.headline.2": "Abigail",
  "aboutpage.p1":
    "Before Shimmy, Abigail Chung was the friend everyone came to for nails and lashes. She had a knack for the small, careful details — the kind that turn a set of nails from nice into something people actually notice. She loved it, and she was good at it. Then she got pregnant, and everything paused. Lash fumes, nail dust, long hours hunched over a desk — none of it was compatible with the baby on the way. She needed a new direction.",
  "aboutpage.p2":
    "That's when brows found her. She flew to Foshan, China, and spent over a year training under Yang Yi at one of the country's most respected brow academies. Not a weekend course — a full apprenticeship. She practised on dozens of local clients, learned the art of face mapping from someone who'd been doing it for decades, and built friendships with artists from across the country. It wasn't just technique she picked up there — it was a philosophy. Every face has its own architecture, and the brows should honour it.",
  "aboutpage.p3":
    "She came back to Singapore with a clear purpose: to bring this craft home and do it properly. Brows by Shimmyhands is the result — embroidery, nano, ombre, lip blush — each one mapped to the individual face, never rushed, never templated. The nails came back too, eventually. Clients kept saying, \"you made my brows feel like me — can you do the same for my hands?\" Nails by Shimmyhands was a natural extension of the same standard.",
  "aboutpage.p4":
    "For Abigail, this was never just about brows. It's about the moment a woman looks in the mirror and actually likes what she sees — the quiet confidence that comes from a face that feels right. Beautiful brows won't fix everything, but they're a good first step. And that step is what Shimmy is here to give you.",
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
    "Certified in microblading, nano, ombre, and lip blush techniques — and still adding to that list. Craft doesn't stand still, and neither do we.",
  "aboutpage.cta.title.1": "Ready for Your Brows to",
  "aboutpage.cta.title.2": "Shimmy",
  "aboutpage.cta.desc": "We'd love to create something you'll enjoy waking up to.",
  "aboutpage.cta.btn": "Get in Touch",

  // ─── Gallery Page ───
  "gallery.tag": "Our Work",
  "gallery.title": "Gallery",
  "gallery.desc":
    "Real clients, real brows, no filters. Every pair is designed from scratch — as unique as the person wearing them.",
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
  "contact.wa.desc": "+65 8930 8973 — quickest way to reach us",
  "contact.ig.label": "Instagram",
  "contact.ig.desc": "@shimmyhands.shop — DMs always open",
  "contact.google.label": "Google Reviews",
  "contact.google.desc": "Leave us a review — it means the world",
  "contact.hours.tag": "Studio Hours",
  "contact.hours.mf": "Monday–Friday",
  "contact.hours.mf.time": "10:00 AM–8:00 PM",
  "contact.hours.sat": "Saturday",
  "contact.hours.sat.time": "10:00 AM–6:00 PM",
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
  "footer.contact": "Get in Touch",
  "footer.rights": "All rights reserved.",
  "footer.location": "Singapore",

  // ─── Cookie Consent ───
  "cookie.text": "We use cookies so the site works properly and remembers your preferences. Staying means you're okay with that.",
  "cookie.accept": "Accept",
  "cookie.learn": "Learn More",

  // ─── Stats Bar ───
  "stats.brows": "Brows Shaped",
  "stats.rating": "Average Rating",
  "stats.years": "Years creating brows in SG",

  // ─── Email Capture ───
  "email.placeholder": "Your email address",
  "email.cta": "Get $10 Off",
  "email.success": "Thank you — we'll be in touch!",
  "email.error": "Please enter a valid email address.",
  "email.heading": "Be first to know about new collections — get $10 off your first set.",

  // ─── Before/After ───
  "results.tag": "Transformations",
  "results.title": "Real Results",
  "results.before": "Before",
  "results.after": "After",

  // ─── Booking Form ───
  "book.step.service": "Select a Service",
  "book.step.service.desc": "Choose the service you'd like to book.",
  "book.step.date": "Pick a Date",
  "book.step.date.note": "Sundays are by appointment only. Greyed-out dates are unavailable.",
  "book.step.time": "Choose a Time",
  "book.step.time.loading": "Loading available times...",
  "book.step.time.another": "Choose another date",
  "book.step.time.closed": "Studio is closed on this day.",
  "book.step.time.blocked": "This date is unavailable.",
  "book.step.time.none": "No slots available on this date.",
  "book.step.time.fail": "Failed to load available times. Please try again.",
  "book.step.details": "Your Details",
  "book.step.details.desc": "So we can confirm your appointment.",
  "book.label.name": "Name",
  "book.label.phone": "Phone",
  "book.label.email": "Email",
  "book.label.notes": "Notes",
  "book.label.optional": "(optional)",
  "book.placeholder.name": "Your full name",
  "book.placeholder.phone": "+65 XXXX XXXX",
  "book.placeholder.email": "your@email.com",
  "book.placeholder.notes": "Any preferences or questions?",
  "book.error.required": "Please fill in your name and phone number.",
  "book.review": "Review Booking",
  "book.confirm.title": "Confirm Your Booking",
  "book.confirm.desc": "Please check the details below.",
  "book.label.service": "Service",
  "book.label.date": "Date",
  "book.label.time": "Time",
  "book.submitting": "Submitting...",
  "book.confirm.btn": "Confirm Booking",
  "book.done.title": "Booking Submitted!",
  "book.done.ref": "Booking Reference",
  "book.done.another": "Book Another Appointment",
  "book.error.generic": "Something went wrong. Please try again.",
  "book.error.network": "Network error. Please check your connection and try again.",
  "book.online.tag": "Book Online",
  "book.online.title": "Schedule Your Consultation",

  // ─── Urgency / Availability ───
  "urgency.brows": "Slots are filling up this month — best to book early if you've got a date in mind.",
  "urgency.nails": "Limited sets remaining",

  // ─── Referral ───
  "referral.text": "Love your results? Share your referral link — you both receive $20 off your next visit.",
  "referral.wa.prefix": "Prefer WhatsApp? Message us at",

  // ─── Bundle Offer ───
  "bundle.title": "The Full Shimmy",
  "bundle.desc": "Book any brow service and add a Nails by Shimmyhands set — save $15.",
  "bundle.note": "Mention this offer when you message us on WhatsApp.",
  "bundle.cta": "Claim This Bundle",

  // ─── FAQ ───
  "faq.tag": "Common Questions",
  "faq.title": "Frequently Asked Questions",
  "faq.1.q": "How long does eyebrow embroidery last in Singapore?",
  "faq.1.a": "Results typically last 12 to 18 months depending on skin type and aftercare. Oilier skin types may see earlier fading.",
  "faq.2.q": "What is the difference between nano brows and microblading?",
  "faq.2.a": "Microblading uses a manual blade. Nano brows use a digital nano-needle, producing finer strokes that suit all skin types, including oily skin where microblading may fade faster.",
  "faq.3.q": "Is the eyebrow embroidery procedure painful?",
  "faq.3.a": "We apply numbing cream before we start, and most clients say they barely feel anything — a light scratching at most. We also reapply between passes, so comfort stays consistent the whole way through.",
  "faq.4.q": "How long do Nails by Shimmyhands press-on nails last?",
  "faq.4.a": "With proper application and care, most sets last 1–2 weeks.",
  "faq.5.q": "Can I book a consultation without committing to a service?",
  "faq.5.a": "Absolutely. Just message us and we'll have a proper chat about what you're after — zero commitment, zero pressure.",

  // ─── Service-Specific FAQs ───
  "faq.svc.emb.1.q": "Will eyebrow embroidery scar?",
  "faq.svc.emb.1.a": "No. Eyebrow embroidery only deposits pigment into the upper layers of skin — it doesn't go deep enough to cause scarring when performed by a trained artist with proper aftercare.",
  "faq.svc.emb.2.q": "How soon can I get my brows wet after embroidery?",
  "faq.svc.emb.2.a": "Keep your brows completely dry for the first 7 days. After that, gentle contact with water is fine, but avoid soaking or heavy steam for at least 2 weeks.",

  "faq.svc.mic.1.q": "Does microblading work on oily skin?",
  "faq.svc.mic.1.a": "It can, but oily skin tends to blur and fade microblading strokes faster. If you have oily skin, nano brows are usually a better long-term option.",
  "faq.svc.mic.2.q": "Will microblading look too dark at first?",
  "faq.svc.mic.2.a": "Yes — brows typically appear 30–40% darker immediately after the session. The colour softens significantly as the skin heals over the following 2 weeks.",

  "faq.svc.nano.1.q": "Why are nano brows more expensive?",
  "faq.svc.nano.1.a": "Nano brows use advanced digital equipment with ultra-fine needles that require specialised training. The results are also longer-lasting, typically 18–24 months.",
  "faq.svc.nano.2.q": "Can nano brows be removed?",
  "faq.svc.nano.2.a": "Yes. Nano brow pigment can be removed or lightened through saline removal or laser treatments, though it's best to consult with a professional first.",

  "faq.svc.ombre.1.q": "Does ombre powder look like makeup?",
  "faq.svc.ombre.1.a": "It gives a soft, filled-in finish similar to brow powder — but more subtle and softer than what you'd achieve with daily makeup. It's designed to look like 'your brows, but better'.",
  "faq.svc.ombre.2.q": "Is ombre powder suitable for sparse brows?",
  "faq.svc.ombre.2.a": "Absolutely. Ombre powder is one of the best options for sparse brows because it creates a soft wash of colour that gives the illusion of fullness without relying on existing hair.",

  "faq.svc.shp.1.q": "How often should I get my brows shaped?",
  "faq.svc.shp.1.a": "Every 3–4 weeks is ideal to maintain a clean shape. Hair grows at different rates, so your artist may suggest a schedule that works best for you.",
  "faq.svc.shp.2.q": "Does threading hurt more than waxing?",
  "faq.svc.shp.2.a": "Most people find threading slightly more precise but a little more pinchy than waxing. Both are quick — the sensation lasts only a few seconds per area.",

  "faq.svc.lip.1.q": "How long does lip blush take to heal?",
  "faq.svc.lip.1.a": "Full healing takes about 4–6 weeks. Expect some dryness and flaking in the first week — the true colour emerges around week 3 to 4.",
  "faq.svc.lip.2.q": "Can I choose my lip colour?",
  "faq.svc.lip.2.a": "Yes! We custom-blend pigments during your consultation to match the shade you want — from a natural 'my lips but better' tint to a more noticeable rosy flush.",

  // ─── Glossary ───
  "glossary.nano_needle": "An ultra-fine single needle used in a digital machine to deposit pigment with extreme precision — thinner than a human hair.",
  "glossary.microblading": "A manual technique using a handheld blade to create fine, hair-like incisions that hold pigment, mimicking natural brow hairs.",
  "glossary.ombre_powder": "A machine-based shading technique that creates a soft, gradient brow — lighter at the front, gradually deeper at the tail.",
  "glossary.fan_strokes": "A pattern of strokes that fan outward from the brow's inner corner, mimicking how natural brow hairs grow.",
  "glossary.pigment_retention": "How well the deposited pigment stays visible in the skin over time — affected by skin type, aftercare, and technique.",
  "glossary.numbing_cream": "A topical anaesthetic applied before the procedure to minimise discomfort. Takes about 15 minutes to take full effect.",
  "glossary.touch_up": "A follow-up session (usually 6–8 weeks after the initial procedure) to perfect any areas where pigment may have faded unevenly.",
  "glossary.caviar_finish": "A textured, slightly raised nail art finish that uses tiny beads to create a luxurious, caviar-like surface.",

  // ─── Process Page ───
  "process.tag": "Your Appointment",
  "process.title": "What to Expect",
  "process.bring.title": "What to Bring",
  "process.bring.desc": "Come bare-faced or with minimal brow makeup so we can see your natural hair growth clearly. If you have reference photos of brow shapes you like, bring those along — they help us understand your taste even if the exact shape won't suit your bone structure. Arrive about 10 minutes early so we can get you settled without eating into consultation time. And please eat something beforehand — a 2-hour session on an empty stomach is no fun for anyone.",
  "process.timeline": "Your appointment runs about 2 to 2.5 hours total. Here's what to expect:",
  "process.step.1.title": "Consultation",
  "process.step.1.time": "15 min",
  "process.step.1.desc": "We start with face mapping — measuring your bone structure, brow bone, and facial proportions to find a shape that genuinely belongs on your face. Then we have an honest conversation about what you're after: thicker, more defined, softer? We'll also look at your skin type and lifestyle so we can recommend the right technique. This part sets the tone for everything, so we never skip or rush it.",
  "process.step.2.title": "Design",
  "process.step.2.time": "15 min",
  "process.step.2.desc": "Using a soft pencil, we draw the brow shape directly onto your skin so you can see exactly what the finished result will look like. We adjust height, thickness, arch position, and tail length one change at a time — and we keep redrawing until you're completely happy. You'll have a mirror the entire time. Nothing starts until you say yes, and we genuinely mean that.",
  "process.step.3.title": "Numbing",
  "process.step.3.time": "15 min",
  "process.step.3.desc": "We apply a medical-grade topical numbing cream across the brow area and let you relax while it takes full effect — usually about 15 minutes. Most clients describe the sensation afterwards as a light scratching or mild pressure, nothing sharp. If you're worried about pain, this step is the reason not to be. We reapply numbing between passes too, so comfort stays consistent throughout.",
  "process.step.4.title": "The Procedure",
  "process.step.4.time": "60 min",
  "process.step.4.desc": "This is where it all comes together. We work stroke by stroke, building density and shape gradually rather than all at once. Every few minutes we pause, let you look, and ask how you're feeling. If anything's uncomfortable, we stop and reapply numbing. The pace is deliberately slow — good brow work is about precision, not speed. By the end, the shape you approved in the mirror is now a part of you.",
  "process.step.5.title": "Reveal",
  "process.step.5.time": "5 min",
  "process.step.5.desc": "Mirror time — this is the moment most clients break into a grin. We clean the area gently, let you see the full result, and make any fine adjustments if a stroke needs sharpening or the tail wants a tiny bit more definition. The colour will look bolder right now than it will at full heal; we'll explain exactly how it softens over the next few weeks so there are no surprises.",
  "process.step.6.title": "Aftercare Briefing",
  "process.step.6.time": "10 min",
  "process.step.6.desc": "Before you leave, we walk you through every stage of the healing process — what's normal, what's not, and exactly what to do each day. You'll go home with a printed aftercare guide and a healing kit that includes everything you need for the first week. We also send a digital copy to your phone so you can reference it any time. And if anything comes up during healing, you can always message us directly.",
  "process.healing.title": "After You Leave",
  "process.healing.desc": "Day one: your brows will look 30–40% darker than the final colour — that's completely normal and expected. During week one, light flaking and itching will happen as the surface heals; resist the urge to pick or scratch. The colour may look patchy as scabs come away, but don't worry. By week four, the true colour emerges as the deeper pigment settles into your skin. At 6–8 weeks, you'll come back for a touch-up where we perfect any spots that healed unevenly and lock in the final shape.",
  "process.cta": "Ready to book? We'd love to create something you'll enjoy waking up to.",

  // ─── Process — Extended Journey (Sign-Up to Long-Term) ───
  // Phase headers
  "process.phase.1": "Before Your Appointment",
  "process.phase.2": "At the Studio",
  "process.phase.3": "Your Healing Journey",
  "process.phase.4": "The Touch-Up",
  "process.phase.5": "Long-Term Care",

  // Phase 1: Booking & Prep
  "process.signup.title": "Reach Out",
  "process.signup.time": "Day 1",
  "process.signup.desc": "Message us on WhatsApp at +65 8930 8973 or use the booking form on the brows page. Tell us a little about what you're after — the technique you're considering, any concerns, and the timeline you're working with. We usually reply within a few hours and we never push you towards anything. If you'd like a free 15-minute video consultation before committing to an appointment, just ask.",

  "process.book.title": "Confirm Your Slot",
  "process.book.time": "Within 24 hours",
  "process.book.desc": "Once you've decided on a date, we'll send you a confirmation with the appointment details and a small deposit link to secure the slot (the deposit goes towards your final payment). We'll also email you a pre-appointment guide that explains what to do in the days leading up — and what to avoid. If you need to reschedule, just give us 24 hours' notice and we'll move things around without any fuss.",

  "process.prep.title": "Get Ready",
  "process.prep.time": "48 hours before",
  "process.prep.desc": "Two days before your appointment, ease off anything that thins your blood — alcohol, caffeine, aspirin, fish oil, and vitamin E supplements. These can cause more bleeding during the procedure, which affects pigment retention. The day before, avoid sun exposure on your face. And the morning of, eat a proper meal — a 2-hour session feels much longer on an empty stomach.",

  // Phase 3: Healing Journey (expanded)
  "process.heal.1.title": "Day 1 to 3 — Bold & Tender",
  "process.heal.1.desc": "Your brows will look noticeably darker than the final result — about 30 to 40% bolder. There may be slight swelling and tenderness, which usually settles within 24 hours. Keep the brows dry, apply the aftercare ointment we provide using a clean cotton swab, and avoid touching the area with your hands. No makeup on or around the brows.",

  "process.heal.2.title": "Day 4 to 7 — Peeling & Flaking",
  "process.heal.2.desc": "Light flaking begins. Tiny scabs will form and fall away on their own — this is the surface skin healing over the pigment beneath. Do not pick, scratch, or peel. If you remove a scab early, you can pull pigment out with it and create patchy spots. Itching is normal. Keep applying ointment sparingly. Showering is fine, but avoid direct water on the brows.",

  "process.heal.3.title": "Week 2 to 4 — The Ghosting Phase",
  "process.heal.3.desc": "This is the phase that scares everyone. The colour appears to fade dramatically or disappear entirely. Don't panic. The pigment hasn't gone anywhere — it's settling beneath a fresh layer of skin that's slowly becoming translucent. This is a normal stage of healing and it happens to every client. Resist the urge to message us in alarm (we promise it's coming back).",

  "process.heal.4.title": "Week 4 to 6 — True Colour Returns",
  "process.heal.4.desc": "The pigment blooms back from underneath as the new skin clears. You'll see the actual healed colour for the first time — softer than day one, and likely close to what you'll have for the next year or two. Some areas may have healed lighter or unevenly. That's expected and exactly what your touch-up appointment is for.",

  // Phase 4: Touch-Up
  "process.touchup.title": "The Touch-Up Appointment",
  "process.touchup.time": "Week 6 to 8",
  "process.touchup.desc": "This is included in your first session. We invite you back about 6 to 8 weeks after the initial procedure to perfect the result. We'll assess how the colour settled, fill in any spots that faded unevenly, sharpen lines if needed, and lock in the final shape. The touch-up takes about an hour and uses the same numbing protocol. Aftercare for the touch-up is identical but usually heals faster than the first round.",

  // Phase 5: Long-Term
  "process.longterm.title": "12 to 24 Months Later",
  "process.longterm.desc": "Brow embroidery is semi-permanent — the colour gradually fades over 12 to 24 months as your skin naturally exfoliates. The fade is even, so you'll never have a harsh line or odd patch as it ages. Most clients book a colour refresh about once every 12 to 18 months to keep things looking fresh, which is shorter and lower-cost than starting over. We'll send you a friendly reminder when it's time.",

  "process.longterm.maintain.title": "Daily Maintenance",
  "process.longterm.maintain.desc": "Once fully healed, your brows need almost no special care — but a few habits help them last. Apply SPF near (not directly on) the brows during sun exposure; UV is the biggest cause of premature fading. Avoid harsh exfoliants and retinoids directly on the brow area. And if you ever feel like your brows could use a refresh between sessions, a brow shaping appointment can extend the look of your embroidery for months.",

  "process.faq.cta": "Have questions? Read our",
  "process.faq.link": "brow care articles",

  // ─── Press / As Seen In ───
  "press.title": "As Seen In",

  // ─── Seasonal Banners ───
  "seasonal.cny": "CNY-ready brows — book before the rush",
  "seasonal.spring": "Bridal nail packages available — bespoke sets to match your day",
  "seasonal.summer": "Sun-proof your brows — book a consultation",
  "seasonal.fall": "Year-end glow-up — get your brows sorted before the holidays",
  "seasonal.holiday": "Gift a Shimmy experience this holiday",
  "seasonal.cta.cny": "Book Now",
  "seasonal.cta.spring": "Enquire",
  "seasonal.cta.summer": "Book Now",
  "seasonal.cta.fall": "Book Now",
  "seasonal.cta.holiday": "Shop Gifts",

  // ─── Most Popular Badge ───
  "badge.popular": "Most Popular",

  // ─── Links Page ───
  "links.book": "Book Brow Appointment",
  "links.shop": "Shop Press-On Nails",
  "links.services": "View All Services",
  "links.whatsapp": "WhatsApp Us",
  "links.instagram": "Follow on Instagram",

  // ─── Homepage Buttons ───
  "home.explore.brows": "Explore Brows",
  "home.explore.nails": "Explore Nails",

  // ─── Nails Page Hardcoded ───
  "nails.bts.tag": "Behind the Scenes",
  "nails.bts.title": "See the Artistry",
  "nails.collection.view": "View Collection →",

  // ─── Blog ───
  "blog.tag": "Care Tips & Guides",
  "blog.title": "Beauty Journal",
  "blog.desc": "Honest guides on brow aftercare, press-on nails, and the questions nobody else answers.",
  "blog.readmore": "Read More →",
  "blog.readtime": "min read",
  "blog.related": "You Might Also Like",
  "blog.back": "← Back to Journal",
  "blog.cat.brows": "Brow Care",
  "blog.cat.nails": "Nail Tips",
  "blog.cta": "Have more questions? We're always happy to help.",

  // Article 1: Eyebrow Embroidery Aftercare
  "blog.1.title": "The Complete Eyebrow Embroidery Aftercare Guide",
  "blog.1.desc": "Everything you need to know about caring for your brows after embroidery — from day one through full healing.",
  "blog.1.p1": "The first 24 hours after your eyebrow embroidery are the most important. Your brows will look darker than the final result — this is completely normal. The pigment needs time to settle into the skin, and the colour will soften by 30–40% as it heals.",
  "blog.1.p2": "For the first week, keep your brows dry. Avoid washing your face directly over the brow area — use a damp cloth around it instead. No swimming, saunas, or heavy exercise that causes excessive sweating. When showering, try to keep your face away from the direct stream of water.",
  "blog.1.p3": "Apply the aftercare ointment provided by your artist in a very thin layer, 2–3 times a day using a clean cotton swab. Less is more here — too much ointment can suffocate the skin and affect pigment retention. Just a light, barely-there layer is perfect.",
  "blog.1.p4": "Between days 3 and 7, you'll notice light flaking or scabbing. This is your skin healing naturally. Do not pick, scratch, or peel the flakes — let them fall off on their own. Picking can pull pigment out and leave patchy spots.",
  "blog.1.p5": "Avoid direct sun exposure for at least 2 weeks. UV rays can fade the pigment significantly before it has fully set. If you must be outdoors, wear a wide-brimmed hat. Once healed, applying sunscreen near (not on) your brows helps maintain colour longevity.",
  "blog.1.p6": "Full healing takes about 4–6 weeks. The colour may seem to 'disappear' around week 2 — don't panic. The pigment is still there, settling beneath the surface layer of skin. By week 4, your true colour will emerge. Your touch-up session at 6–8 weeks will perfect any areas that need it.",

  // Article 2: How to Apply Press-On Nails
  "blog.2.title": "How to Apply Press-On Nails Like a Pro",
  "blog.2.desc": "Step-by-step guide to applying handcrafted press-on nails for a salon-quality finish that lasts up to two weeks.",
  "blog.2.p1": "Start with clean, dry nails. Remove any old polish and wash your hands thoroughly. Push back your cuticles gently with a cuticle pusher — this creates more surface area for the adhesive and gives a cleaner, more natural look at the base of the nail.",
  "blog.2.p2": "Lightly buff the surface of each natural nail with a fine nail file. This removes the shine and creates a slightly rough texture that helps the adhesive bond much better. Wipe each nail with an alcohol prep pad to remove any oils or dust. This step makes a huge difference in how long your press-ons last.",
  "blog.2.p3": "Size each press-on nail to your natural nail before applying. The press-on should cover your nail bed edge to edge without overlapping onto the skin. If a nail is slightly too wide, file the sides gently to fit. Getting the right fit is key to both comfort and longevity.",
  "blog.2.p4": "For the longest hold, use nail glue rather than adhesive tabs. Apply a thin, even layer of glue to both your natural nail and the back of the press-on. Press firmly from the cuticle end down to the tip, holding for 15–20 seconds. Apply gentle pressure from each side as well to ensure full contact.",
  "blog.2.p5": "After applying all ten nails, avoid submerging your hands in water for at least one hour. This allows the glue to fully cure. For the best results, wear gloves when washing dishes and avoid using your nails as tools. With proper care, your handcrafted press-ons will look beautiful for 1–2 weeks.",

  // Article 3: Nano Brows vs Microblading
  "blog.3.title": "Nano Brows vs Microblading: Which Is Right for You?",
  "blog.3.desc": "A clear comparison of the two most popular semi-permanent brow techniques to help you choose the best option for your skin type.",
  "blog.3.p1": "Both nano brows and microblading create soft, hair-like strokes — but they use very different tools and techniques. Understanding the difference can help you choose the method that will work best with your skin type and lifestyle.",
  "blog.3.p2": "Microblading uses a handheld tool with tiny blades to create fine incisions in the skin, depositing pigment into each stroke. The result is beautiful, crisp hair strokes. However, microblading works best on normal to dry skin types. On oily skin, the strokes tend to blur and fade faster, sometimes losing their definition within 6–12 months.",
  "blog.3.p3": "Nano brows use a digital machine with a single ultra-fine needle — thinner than a human hair. The needle deposits pigment into the skin with precise, controlled movements. Because the needle punctures are smaller and more consistent than blade cuts, nano brows tend to heal crisper and last longer, typically 18–24 months.",
  "blog.3.p4": "The biggest advantage of nano brows is versatility. They work beautifully on all skin types, including oily and combination skin. The technique causes less trauma to the skin, which means less bleeding during the procedure, faster healing, and better pigment retention over time.",
  "blog.3.p5": "Pain levels are similar for both — numbing cream is applied beforehand, and most clients describe the sensation as mild scratching. Price-wise, nano brows are typically slightly higher due to the advanced equipment, but many clients feel the longer-lasting results make it worthwhile. If you're unsure, book a consultation and we'll help you decide based on your specific skin type and brow goals.",

  // Article 4: How to Remove Press-On Nails
  "blog.4.title": "How to Safely Remove Press-On Nails Without Damage",
  "blog.4.desc": "The gentle way to remove press-on nails that keeps your natural nails healthy and undamaged.",
  "blog.4.p1": "Never force or rip off press-on nails. Pulling them off can tear layers from your natural nail plate, leaving them thin, weak, and painful. With the right approach, removal takes just 10–15 minutes and leaves your nails perfectly intact.",
  "blog.4.p2": "Soak your fingertips in warm water with a few drops of cuticle oil or gentle soap for 10–15 minutes. The warm water softens the adhesive, and the oil helps break the bond. You'll feel the nails start to loosen naturally as the adhesive dissolves.",
  "blog.4.p3": "Once the nails feel loose, gently slide a cuticle pusher or an orange stick underneath from the side — never pry from the tip. Rock it slowly and gently. If a nail resists, soak for a few more minutes rather than forcing it. Patience here protects your natural nails.",
  "blog.4.p4": "After removal, buff away any remaining adhesive gently with a fine nail file. Apply cuticle oil generously and massage it into each nail and the surrounding skin. This restores moisture and keeps your nails strong. Your natural nails should look and feel completely healthy — ready for your next set whenever you like.",

  // Article 5: How to Choose Your Brow Shape
  "blog.5.title": "How to Choose the Right Brow Shape for Your Face",
  "blog.5.desc": "A guide to finding the eyebrow shape that naturally complements your unique face structure and features.",
  "blog.5.p1": "The 'perfect' brow shape doesn't exist in isolation — it depends entirely on your face. Your bone structure, the spacing of your features, and even your natural brow hair pattern all play a role. The goal is enhancement, not transformation.",
  "blog.5.p2": "For round faces, a slightly higher arch creates the illusion of length, adding definition and structure. Avoid very rounded brows, which can make the face appear even rounder. A soft angled shape with a gentle peak works beautifully.",
  "blog.5.p3": "For oval faces, you have the most flexibility — most brow shapes work well. A soft, natural arch that follows your brow bone is usually the most flattering. Avoid over-plucking or making the brows too thin, which can throw off the natural balance.",
  "blog.5.p4": "For square or angular faces, softer, rounded brows help balance strong jawlines and angular features. A curved brow with a low, gentle arch softens the overall look. Avoid sharp angles in the brow, which can make angular features appear harsher.",
  "blog.5.p5": "The best approach is always a professional consultation. Every face is unique, and your brow artist will consider dozens of micro-details — from the distance between your eyes to the height of your forehead. At Shimmy, we always start with a thorough face mapping session before any work begins.",

  // Article 6: How to Choose Your Nail Size
  "blog.6.title": "How to Choose the Right Press-On Nail Size",
  "blog.6.desc": "A simple guide to finding your perfect press-on nail fit for maximum comfort and longevity.",
  "blog.6.p1": "The right size press-on nail should cover your natural nail bed from sidewall to sidewall without touching the skin on either side. If a nail overlaps onto your cuticle area or skin, it will lift prematurely and feel uncomfortable. A slightly smaller fit is always better than too large.",
  "blog.6.p2": "To find your size, measure the widest part of each natural nail. You can do this with a soft measuring tape, or by pressing a piece of clear tape across your nail and marking the edges. Each finger may be a different size — your thumb and middle finger are usually the widest.",
  "blog.6.p3": "When trying on press-on nails, place each one against your natural nail without adhesive first. Check that it sits flush against the nail bed with no gaps at the sides or base. The cuticle edge of the press-on should follow the curve of your cuticle line naturally.",
  "blog.6.p4": "If you're between sizes, go with the smaller one and gently file the sides to match your nail width. This gives a seamless, custom-like fit. A well-fitted press-on nail will feel comfortable, stay put for longer, and look indistinguishable from a professional salon set.",

  // Article 7: Lip Blush — What to Expect
  "blog.7.title": "Lip Blush Singapore: What to Expect and How Long It Lasts",
  "blog.7.desc": "From colour selection to healing — here's exactly what happens during a lip blush appointment and how long the results actually last.",
  "blog.7.p1": "Lip blush is a semi-permanent treatment that deposits soft pigment into the lips to even out tone, define the shape, and add a subtle wash of colour. Think of it as a tinted lip stain that lives in your lips for 2–3 years. The finish is soft and matte — nothing like the dark, lined look of older lip tattoos. Most clients leave looking like they're wearing a sheer lipstick they never have to reapply.",
  "blog.7.p2": "Your appointment starts with colour mapping. We'll show you 4–6 shade options based on your natural lip tone, undertone, and the look you want — whether that's a 'my lips but better' nude, a soft rose, or a deeper berry. The pigment always heals about 40% lighter than it looks on day one, so we choose with healed colour in mind. This part is unhurried — you'll see swatches against your skin before anything else happens.",
  "blog.7.p3": "Numbing happens in two stages: a pre-numb before we draw the outline, then a stronger numb once the lips are open. Sensitivity varies — the lips have more nerve endings than the brows, so some clients describe it as a vibration with mild pinching. It's manageable, and we pause whenever you need. The full session runs about 2 to 2.5 hours, including consultation, numbing, and the actual work.",
  "blog.7.p4": "The first week is the most dramatic. Day 1 to 3, lips look bold and slightly swollen — like you've been eating beetroot. Day 4 to 7, they peel in soft flakes (don't pick) and seem to lose all colour. This is normal. The 'ghosting' phase scares everyone. Then around day 10 to 14, the true colour blooms back from underneath. Your touch-up at 6 to 8 weeks locks in the final shade.",
  "blog.7.p5": "Lip blush typically lasts 2 to 3 years in Singapore's climate, though heavy sun exposure and frequent exfoliating treatments can shorten that. Smokers and clients who use strong actives like retinol or AHAs near the mouth tend to fade faster. A yearly colour boost keeps the shade looking fresh — much shorter and cheaper than a full first session.",
  "blog.7.p6": "Aftercare is simple but strict. Keep lips dry for the first 24 hours, then balm them constantly for the next 10 days — dryness is the biggest culprit behind patchy healing. Avoid spicy food, hot drinks, and direct lip contact (yes, including kissing and oily food) for the first week. Sunscreen on the lips becomes a daily habit afterwards. If you're considering it, message us on WhatsApp at +65 8930 8973 — we'll talk you through colour options before you book.",

  // Article 8: First Eyebrow Embroidery Appointment
  "blog.8.title": "What Happens at Your First Eyebrow Embroidery Appointment",
  "blog.8.desc": "A walkthrough of your first brow embroidery session — what to bring, what we do, and how long the whole thing takes.",
  "blog.8.p1": "Booking your first brow embroidery session can feel like a leap. You're trusting someone with your face for the next year or two. The good news: the appointment is far less mysterious than Instagram makes it look. Most of it is conversation, drawing, and waiting for numbing cream to kick in. The actual pigment work is the shortest part.",
  "blog.8.p2": "Come bare-faced if you can, or with minimal makeup around the brow area. Bring reference photos if you have a shape in mind — but don't worry if you don't. We'll start with face mapping: measuring the symmetry of your features, your brow bone, and the spacing of your eyes. This is where the shape is decided, and it has nothing to do with trends. Your face dictates what works.",
  "blog.8.p3": "Next comes the pencil draw. We sketch the proposed shape onto your skin with a removable brow pencil and hand you a mirror. This is your moment — speak up. Want it slightly thicker at the front? A softer arch? A more defined tail? We redraw until you're 100% happy. Nothing permanent happens until you've signed off on the shape. This step alone can take 20 to 30 minutes.",
  "blog.8.p4": "Once the design is approved, numbing cream goes on for about 15 minutes. You can scroll your phone, sip water, or just rest your eyes. After that, we begin the actual embroidery — strokes for microblading or fine pigment passes for nano brows. Most clients describe the sensation as light scratching. We check in with you constantly, and we'll pause anytime you want a break.",
  "blog.8.p5": "After the first pass, we apply a second layer of pigment, wipe everything clean, and hand you the mirror for the reveal. Expect the colour to look bold — 30 to 40% darker than the final healed result. This is normal and expected. We'll explain everything you're seeing and walk you through what the next 6 weeks will look like as the brows heal and settle.",
  "blog.8.p6": "You'll leave with an aftercare kit, a printed guide, and a follow-up appointment scheduled for 6 to 8 weeks later — that's the touch-up where we perfect anything that healed unevenly. Block out 2.5 to 3 hours for the first session in total. Plan a quiet day after — no gym, no swim, no heavy sweating. If you have any questions before booking, WhatsApp us at +65 8930 8973.",

  // Article 9: Brow Embroidery During Pregnancy
  "blog.9.title": "Brow Embroidery During Pregnancy: What You Need to Know",
  "blog.9.desc": "Whether you can get brows done while pregnant or breastfeeding — and the safer alternatives we recommend until after.",
  "blog.9.p1": "We get asked this a lot, especially in the second trimester when energy is back and the wedding-photo or baby-shower count starts climbing. The honest answer: we don't perform brow embroidery on anyone who is pregnant or breastfeeding. It's not because the pigment itself is dangerous — it's about everything else around the procedure that becomes harder to predict during pregnancy.",
  "blog.9.p2": "Three main reasons. First, the numbing cream we use contains topical anaesthetics like lidocaine, which haven't been studied enough in pregnancy for us to feel comfortable applying them. Second, hormonal changes during pregnancy affect how skin absorbs and holds pigment — the colour can heal unevenly, blotchy, or much darker than intended. Third, the risk of infection, however small, carries higher stakes when you're carrying.",
  "blog.9.p3": "Healing is also unpredictable. Pregnancy increases blood flow and changes skin sensitivity dramatically. Some clients heal beautifully; others end up with patchy retention that needs multiple correction sessions. Spending 2.5 hours getting brows done is also genuinely uncomfortable when you can't lie flat in the third trimester, and we'd rather you enjoy it than tolerate it.",
  "blog.9.p4": "If you have a big event coming up, there are safer options. Brow shaping, threading, and tinting are all fine during pregnancy — they don't break the skin or use anaesthetic. A good tint plus a clean shape can carry you through photos beautifully. Brow lamination is generally considered safe too, though we recommend checking with your doctor if you have a sensitive pregnancy.",
  "blog.9.p5": "Most clients book their embroidery for around 3 to 6 months after birth, or once they've finished breastfeeding. By then your hormones have settled, your skin is back to its usual baseline, and you can actually enjoy the appointment. We're happy to hold a future booking slot for you — WhatsApp us at +65 8930 8973 and we'll pencil you in for when you're ready.",

  // Article 10: Press-On Nails vs Gel Manicure
  "blog.10.title": "Press-On Nails vs Gel Manicure: Which Is Right for You?",
  "blog.10.desc": "Cost, time, durability, and nail health compared — a frank look at when press-ons win, and when gel might suit you better.",
  "blog.10.p1": "The press-on versus gel debate isn't about which is 'better' — they solve different problems. Gel is a salon commitment: you book a 90-minute slot, sit while it's painted and cured, and come back to have it filed off. Press-ons are designed for the woman who wants beautiful nails on her own schedule, without parking in a chair on a Saturday. Both can look incredible. The right choice depends on how you actually live.",
  "blog.10.p2": "On time: gel takes 60 to 120 minutes at a salon, plus travel. A handcrafted press-on set takes 5 to 10 minutes to put on at home, once you've got your size. If your week is back-to-back meetings and a baby's nap schedule, that gap matters. Press-ons also let you switch designs whenever — Monday meeting nails, Saturday wedding nails — without removing anything chemically.",
  "blog.10.p3": "On nail health: gel removal is where most damage happens. Soaking in acetone, filing, and the inevitable peeling all thin the natural nail plate. Done repeatedly without breaks, gel can leave nails weak and brittle. Press-ons skip the acetone soak entirely — they come off with warm water and oil in 10 minutes. Your natural nails get a rest between sets.",
  "blog.10.p4": "On longevity: a good gel manicure lasts 2 to 3 weeks before lifting. Handcrafted press-ons with proper application last 1 to 2 weeks, sometimes longer with careful wear. Gel wins on raw durability — but you can't change the design mid-cycle. Press-ons let you rotate sets, which means you're not stuck with chipped nails before an event.",
  "blog.10.p5": "On design freedom: this is where press-ons pull ahead in Singapore. Salon gel designs are limited to what your tech can paint freehand or with stickers in a single session. Press-ons can be hand-painted in advance with intricate detail — 3D charms, gradient airbrushing, micro-French tips — that simply isn't feasible in a live appointment. Sets like our Lovers' Heartbeat or Ingénue collections take hours of artist time before they reach you.",
  "blog.10.p6": "On cost: a quality gel manicure in Singapore runs $50 to $90. A handcrafted Nails by Shimmyhands set is in a similar range, but it's yours forever — many clients re-wear sets two or three times. If you've ever felt locked into a chipped gel design two weeks into a 3-week stretch, press-ons are worth trying. WhatsApp us at +65 8930 8973 if you'd like help choosing your first set.",

  // Article 11: Make Press-Ons Last Longer
  "blog.11.title": "How to Make Press-On Nails Last Longer (Pro Tips)",
  "blog.11.desc": "Small habits that double the wear time of your press-on nails — from prep to daily routine to bedtime.",
  "blog.11.p1": "If your press-ons keep popping off in three days, the problem is almost always prep — not the nails themselves. The adhesive is fighting against natural oils, moisture, and the curve of your nail. Win those three battles and a well-applied set comfortably hits 10 to 14 days. Here's what actually moves the needle, based on what we see clients get wrong most often.",
  "blog.11.p2": "Skip moisturiser, cuticle oil, and hand cream for at least an hour before applying. Even invisible residue blocks the glue from bonding. Wash your hands with regular soap (not the moisturising kind), then wipe each nail with an alcohol prep pad or 90%+ isopropyl alcohol. The nail surface should feel slightly dry and matte before you start — not glossy. This single step is the biggest determinant of wear time.",
  "blog.11.p3": "Push back cuticles and lightly buff the nail surface. The shine you're sanding away is a smooth layer the glue can't grip onto. A few gentle swipes with a 240-grit buffer is enough — you're not trying to thin the nail, just dull the surface. Wipe again with alcohol after buffing to clear the dust, then move quickly to application before your nails pick up oil again.",
  "blog.11.p4": "Use nail glue, not adhesive tabs, if you want maximum wear. Apply a thin layer of glue to both the natural nail and the press-on. Place the press-on at the cuticle line first, then press down towards the tip while squeezing the sides. Hold firm for 20 seconds per nail. The most common mistake is rushing this step — short hold time means weak bonds and early lifting.",
  "blog.11.p5": "Daily habits matter more than people think. Wear gloves for dishwashing, scrubbing, and hair washing — hot soapy water dissolves glue faster than almost anything else. Don't use your nails as tools to open cans, scratch labels, or pry stickers. Reapply a tiny drop of glue at the first sign of lifting at the edge, rather than waiting for the whole nail to come off. With these habits, even a 2-week set is realistic in Singapore humidity.",

  // Article 12: Best Designs for Singapore Weather
  "blog.12.title": "Best Nail Designs for Singapore Weather (and How to Care)",
  "blog.12.desc": "Humidity, sun, sea — Singapore is rough on nails. Here's which designs hold up best and the small care habits that protect them.",
  "blog.12.p1": "Singapore weather is brutal on nails in a way most beauty content ignores. Constant humidity softens adhesives. Aircon-to-outdoor temperature swings expand and contract the nail bed. Sunscreen, sand, and chlorine all chip away at finishes. The designs that thrive here aren't just pretty — they're built to survive the climate. Here's what we recommend, and how to care for each.",
  "blog.12.p2": "Solid colours and minimalist designs are the workhorses of humid weather. A clean nude, a glossy red, or a soft milky white shows wear far less than complex art does — and if a chip happens at the tip, it's easier to disguise. Our Ingénue collection leans into this for a reason: clean lines, neutral tones, and finishes that look polished even when they're three days into a Bali trip.",
  "blog.12.p3": "If you want texture or detail, look for designs where the art is sealed under multiple top coat layers rather than sitting on top. Hand-painted florals, micro-pearls, and 3D charms can all do well in humidity if they're properly sealed — which is why handcrafted press-ons hold up better than rushed salon nail art. Designs like our Lovers' Heartbeat sets are built with extra topcoat specifically for this.",
  "blog.12.p4": "Avoid foil chrome and raw glitter in the rainy months unless you're staying indoors. Chrome finishes oxidise faster in humidity and can dull within days. Loose glitter without a thick sealing layer catches on hair and clothing and lifts the topcoat with it. If you love the sparkle, choose embedded glitter sets where the pieces are locked inside cured layers.",
  "blog.12.p5": "Daily care makes the biggest difference. Apply a fresh layer of clear top coat every 3 to 4 days — it takes 30 seconds and restores the seal that humidity has slowly broken down. Wear gloves at the beach or pool. Reapply hand cream and cuticle oil at night, not during the day, to keep the nail bed flexible without coating the surface. If you want help picking a set that suits your week, message us on WhatsApp at +65 8930 8973.",

  // ─── Blog 13: Ombre vs Microblading Fading ───
  "blog.13.title": "Ombre Powder Brows vs Microblading: Which Fades Better?",
  "blog.13.desc": "Two popular techniques, two very different fading patterns. Here's how ombre and microblading compare over 12 months and beyond.",
  "blog.13.p1": "If you've spent any time researching semi-permanent brows, you've likely seen both ombre powder brows and microblading recommended. They look quite different when freshly done — microblading mimics individual hair strokes while ombre gives a soft, powdery gradient. But the real difference shows up months later, when they start to fade. Understanding how each technique ages is the single best way to avoid regret, especially in Singapore's humid climate where skin behaves differently from cooler countries.",
  "blog.13.p2": "Microblading fades stroke by stroke. Each incision holds pigment in fine lines, and as your skin regenerates, those lines gradually blur and spread. On dry skin this can look soft and pleasant for 8 to 12 months. On oily skin — and Singapore's humidity pushes most skin oilier — the strokes can blur into a smudgy grey patch within six months. That's not a flaw in the technique; it's physics. Oily skin produces more sebum, which literally pushes pigment out of those shallow cuts faster.",
  "blog.13.p3": "Ombre powder brows fade more evenly because the pigment is deposited in thousands of tiny dots rather than sliced lines. As the colour lightens, it fades like a watercolour wash — getting softer and lighter overall without losing shape definition. After 12 months, most ombre clients still see a gentle tint where the brow shape was, rather than patchy remnants. This is why ombre has become the go-to for clients in tropical climates who want something that ages gracefully.",
  "blog.13.p4": "Longevity also differs. Microblading typically lasts 6 to 12 months before it needs a refresh, partly because the shallow depth of the cuts means pigment sits closer to the surface. Ombre powder brows use a machine that deposits pigment slightly deeper and more consistently, so they tend to hold for 12 to 18 months. Some clients with dry skin report their ombre brows still showing colour at the two-year mark, though that's the exception rather than the rule.",
  "blog.13.p5": "Colour shift is the other factor people rarely discuss upfront. Microblading pigments, particularly cheaper formulations, can turn orange or blue-grey as they break down in the skin. Ombre pigments aren't immune to this, but because the deposit is denser and more uniform, colour shifts tend to be subtler and more predictable. A good practitioner will choose a pigment that's specifically formulated to fade warm or neutral, but technique plays a role in how evenly that breakdown happens.",
  "blog.13.p6": "So which fades better? For most people in Singapore — especially if your skin leans oily or combination — ombre powder brows win on longevity, fade quality, and colour consistency. If you have genuinely dry skin, light hair, and want the most hair-like illusion possible, microblading can still be a great choice. The honest answer is that neither is universally better; it depends on your skin. Drop us a WhatsApp message at +65 8930 8973 and we can talk through what suits you.",

  // ─── Blog 14: Choosing Between Embroidery, Nano, and Ombre ───
  "blog.14.title": "How to Choose: Embroidery, Nano, or Ombre Brows",
  "blog.14.desc": "Three techniques, one face. A straightforward guide to picking the brow method that fits your skin, lifestyle, and the look you actually want.",
  "blog.14.p1": "Walk into any brow studio in Singapore and you'll hear three terms tossed around: eyebrow embroidery, nano brows, and ombre powder brows. They all fall under the semi-permanent umbrella, they all involve pigment deposited into the skin, and they all promise brows you don't have to draw on every morning. But they are not the same technique, and choosing the wrong one for your skin type or lifestyle can mean disappointing results. Here's a clear, no-jargon breakdown to help you decide.",
  "blog.14.p2": "Eyebrow embroidery — sometimes called microblading — uses a handheld blade to create fine hair-like strokes. It's ideal if you have dry to normal skin and want the most realistic individual-hair effect. The strokes sit in shallow cuts, so the look is delicate and feathery when done well. The trade-off is durability: embroidery tends to fade faster than machine-based methods, typically lasting 12 to 18 months, and it doesn't hold up as well on oily skin where sebum pushes pigment out more quickly.",
  "blog.14.p3": "Nano brows use a digital machine with an ultra-fine single needle to create strokes that look similar to embroidery but with more precision and consistency. Because the machine controls depth and speed, the pigment sits more uniformly in the skin. This makes nano brows a strong choice for oily or combination skin types that don't hold manual blade strokes well. They also heal with less trauma to the skin, which means less scabbing and a smoother recovery. Expect them to last 18 to 24 months.",
  "blog.14.p4": "Ombre powder brows skip the hair-stroke look entirely and give you a soft, filled-in gradient — darker at the tail, lighter at the front. Think of it as a permanent version of the powder-brow makeup look. This technique suits almost all skin types, including oily and sensitive, because the pixelated dot pattern holds pigment well and fades evenly. If you normally fill your brows with powder or pencil every morning, ombre gives you that look without the effort. It lasts 12 to 18 months on average.",
  "blog.14.p5": "Lifestyle matters too. If you swim often, sweat heavily at the gym, or live in and out of aircon all day, you want a technique that handles moisture well — that's ombre or nano. If you wear minimal makeup and prefer the most subtle, barely-there effect, embroidery or nano strokes will feel more natural. And if you're simply tired of spending 15 minutes on your brows every morning before work, ombre powder is the fastest route to waking up ready.",
  "blog.14.p6": "Still not sure? That's genuinely fine — it's what consultations are for. We'll look at your skin under good light, talk about your daily routine, and recommend a technique based on what will actually last and look right on your face. No sales pitch, just an honest conversation. Message us on WhatsApp at +65 8930 8973 to set up a time.",

  // ─── Blog 15: Eyebrow Embroidery Touch-Up ───
  "blog.15.title": "Brow Embroidery Touch-Up: When, Why, What to Expect",
  "blog.15.desc": "The 6-8 week follow-up isn't optional fluff — it's where the magic gets locked in. Here's everything that happens and why it matters.",
  "blog.15.p1": "You've had your brow embroidery done, survived the healing, and you're starting to see the true colour settle in. Then your practitioner tells you to come back in 6 to 8 weeks for a touch-up. It's tempting to skip it, especially if your brows already look decent. But that follow-up appointment isn't a cash grab — it's a critical part of the process. Without it, you're essentially leaving your brows at 70% of what they could be. Here's what actually happens during a touch-up and why it makes such a difference.",
  "blog.15.p2": "During the first round, your skin is being introduced to pigment for the first time. Your immune system treats that pigment as a foreign substance and pushes some of it out during healing. How much gets pushed out depends on your skin type, your aftercare, how much you sweated, and even your body chemistry. Almost nobody retains 100% of the pigment from the first session. Some areas will heal lighter, some strokes might fade more than others, and the overall density will be less than what you saw on day one.",
  "blog.15.p3": "The touch-up exists to correct all of that. We assess which areas lost pigment, which strokes need reinforcing, and whether the shape needs any fine-tuning now that it's healed and settled into your skin. Colour can be adjusted too — if the first round healed slightly warmer or cooler than expected, we can calibrate the pigment shade to bring it closer to your ideal tone. Think of the first session as the foundation and the touch-up as the finishing coat.",
  "blog.15.p4": "Timing matters. Coming back too early — say, at 3 or 4 weeks — means the skin hasn't fully healed and the pigment hasn't settled to its true depth. Coming back too late — beyond 10 or 12 weeks — means the pigment has already started its natural fade cycle, so the touch-up has to work harder. The 6 to 8 week window is when the skin is fully healed, the colour is stable, and the pigment is most receptive to a second layer. It's a small window, so try to book it in advance.",
  "blog.15.p5": "The touch-up session itself is usually shorter — about 60 to 90 minutes including numbing. Since your skin has already been through the process once, most clients find the second round less intimidating. Healing is also typically faster and easier because the skin knows what to expect. Flaking tends to be lighter, and the colour settles more predictably. After this second pass, your brows should hold their shape and density for the full lifespan of the technique.",
  "blog.15.p6": "One last thing: the touch-up is usually included in the initial price at most reputable studios, ours included. It's budgeted into the treatment because it's not an add-on — it's part of the process. If a studio charges full price for a mandatory follow-up, that's worth questioning. Want to book your first session knowing the touch-up is already covered? Reach out on WhatsApp at +65 8930 8973.",

  // ─── Blog 16: Makeup Over Semi-Permanent Brows ───
  "blog.16.title": "Can You Wear Makeup Over Semi-Permanent Brows?",
  "blog.16.desc": "Short answer: yes. But timing and products matter, especially during healing. Here's when it's safe and how to do it right.",
  "blog.16.p1": "One of the first questions people ask after getting brow embroidery, nano brows, or ombre powder brows is whether they can still use their brow pencil or powder over the top. The short answer is yes — once healed, you can absolutely layer makeup over semi-permanent brows. Some people do it daily; others only on special occasions. But during the healing phase, the rules are different, and getting this wrong can genuinely affect how well your brows retain pigment and heal.",
  "blog.16.p2": "For the first 7 to 10 days after your procedure, keep all makeup products away from the brow area entirely. That means no brow pencil, no powder, no concealer around the edges, and no foundation overlapping onto the brows. The skin is an open micro-wound during this time, and makeup products — even the ones labelled 'clean' or 'natural' — contain binders, oils, and preservatives that can interfere with pigment retention or introduce bacteria. It's not worth the risk for a week of slightly bare-looking brows.",
  "blog.16.p3": "Between days 10 and 28, you can start wearing face makeup again but still avoid direct contact with the brow area. Foundation can go around the brows, not on them. If you need to conceal redness or unevenness during this stage, a very light dusting of setting powder with a clean brush is the safest option. Avoid cream or liquid products on the brows until at least four full weeks have passed. By then the surface has sealed and the deeper layers are well on their way to stabilising.",
  "blog.16.p4": "Once you're past the four-week mark and fully healed, go ahead and use whatever brow products you like. Pencils, powders, gels, pomades — they'll all sit on top of the semi-permanent pigment without affecting it. Many clients find they need far less product than before; a quick swipe of clear brow gel to set the hairs is often enough. Others enjoy adding a slightly darker pencil stroke at the tail for evening looks. The semi-permanent base means you're enhancing, not building from scratch.",
  "blog.16.p5": "Removal is the only thing to watch. Avoid oil-based makeup removers directly on the brow area long-term, as oils can accelerate pigment fade. Micellar water or a gentle water-based cleanser works well. If you use a cleansing balm on the rest of your face, just wipe around the brows rather than rubbing over them. These small habits won't make or break your results overnight, but they add up over months and can extend the life of your brows by a few extra weeks. Questions about aftercare or products? WhatsApp us at +65 8930 8973.",

  // ─── Blog 17: Eyebrow Embroidery for Men ───
  "blog.17.title": "Eyebrow Embroidery for Men in Singapore",
  "blog.17.desc": "More men are getting their brows done — and no, it doesn't look 'done'. Here's how the approach differs and what to actually expect.",
  "blog.17.p1": "Brow embroidery isn't just for women, and in Singapore the number of men booking appointments has been climbing steadily. Thinning brows, patchy gaps from old scars, or years of over-grooming are the most common reasons — but some guys simply want their face to look more put-together without anyone being able to pinpoint why. The goal for men is almost always the same: make it look like nothing was done at all. That requires a different approach from what you'd do for a female client, and not every studio adjusts for it.",
  "blog.17.p2": "The biggest difference is shape philosophy. Women's brows often involve a defined arch, tapered tail, and deliberate sculpting. Men's brows should follow the natural brow bone with minimal reshaping. We're filling in, not redesigning. The arch stays low and follows whatever your bone structure dictates. The front of the brow stays slightly textured and imperfect rather than clean-edged — because real male brows aren't symmetrical, and making them too neat is what makes brow work look obvious on men.",
  "blog.17.p3": "Stroke direction and spacing matter even more for male clients. The strokes need to be slightly thicker and spaced further apart to mimic natural male hair growth, which is coarser and less dense than female brow hair. Packing strokes too tightly creates that filled-in look that reads as makeup — exactly what most men want to avoid. We also match the stroke angle to your existing hair growth pattern, so the new strokes blend seamlessly with whatever natural hair you still have.",
  "blog.17.p4": "Colour selection is another area where the male approach diverges. Women sometimes choose a shade slightly darker than their natural colour to create definition. For men, we almost always go a half-shade lighter or exactly matching. The reason is simple: men rarely wear any other face makeup, so there's no foundation or concealer softening the contrast. A brow shade that's even slightly too dark against bare skin will look painted on. Going lighter lets the strokes blend into a shadow that reads as fullness rather than product.",
  "blog.17.p5": "The procedure itself is identical — consultation, design, numbing, the work, reveal, aftercare. Most men are surprised by how little discomfort there is once the numbing kicks in. The healing timeline is the same too: darker than expected on day one, some flaking in the first week, true colour by week four. The only practical difference is that men tend to have oilier skin on the brow ridge, which means we sometimes recommend nano brows over manual embroidery for better long-term retention.",
  "blog.17.p6": "If you've been thinking about it but feel self-conscious walking into a brow studio — don't. A good chunk of our weekly bookings are men, and it's been that way for a while. Nobody in the waiting area is going to bat an eye. The whole point is that you walk out looking like a slightly better version of yourself, and nobody needs to know why. Ready to have a chat? Message us on WhatsApp at +65 8930 8973 — no awkwardness, we promise.",

  // ─── Blog 18: Skin Type Affects Brow Results ───
  "blog.18.title": "How Skin Type Affects Your Brow Embroidery Results",
  "blog.18.desc": "Oily, dry, or combination — your skin type changes how brows heal, hold colour, and age. Here's what to expect for each.",
  "blog.18.p1": "Your skin type is probably the single biggest factor in how your brow embroidery turns out — more than the technique used, more than the pigment brand, and yes, more than the skill of the person holding the tool (though that matters plenty). Two clients can sit in the same chair, get the same treatment with the same pigment, and walk away with noticeably different results four weeks later. The difference is almost always skin. Understanding how your skin behaves will set realistic expectations and help you choose the right approach.",
  "blog.18.p2": "Oily skin is the most challenging canvas for brow work, and Singapore's humidity means most of us trend oilier than we would in a cooler climate. Excess sebum production pushes pigment out of the skin faster during healing and continues to break it down over time. Strokes made by a manual blade — traditional embroidery or microblading — tend to blur and spread on oily skin, sometimes losing their crispness within months. If your T-zone gets shiny by midday without any product, you likely fall into this category.",
  "blog.18.p3": "For oily skin, ombre powder brows or nano brows are usually the better bet. The machine-based pixelated deposit sits more securely in the skin than blade cuts, and the overall density means that even if some pigment pushes out, there's enough left to maintain shape and colour. Ombre in particular works well because it doesn't rely on individual stroke definition — it's a gradient, so slight blurring during healing actually enhances the softness rather than ruining the look.",
  "blog.18.p4": "Dry skin is the dream canvas. It holds pigment like a sponge, heals with minimal spreading, and retains stroke definition beautifully over time. If you have dry skin, virtually all techniques — embroidery, nano, ombre — will perform well. Hair-stroke methods look their absolute best on dry skin because the lines stay crisp for months. Healing tends to involve lighter flaking and less patchiness. The one caveat: very dry skin can sometimes heal with slightly more intense colour than expected, because the pigment isn't being diluted by oil during the settle-in phase.",
  "blog.18.p5": "Combination skin — oily in the T-zone, normal or dry on the cheeks — is the most common type we see, and it requires the most nuanced approach. Your brow area might sit right on the border between oily and normal zones, or one brow might be oilier than the other (this is more common than you'd think). We often adjust technique within the same session: slightly deeper deposit on the oilier areas, standard depth on the drier patches. This kind of micro-adjustment is why a consultation matters so much — a one-size approach won't serve combination skin well.",
  "blog.18.p6": "Regardless of type, there are universal truths. Good aftercare improves results for every skin type. Keeping the area dry, avoiding products, and resisting the urge to pick during healing all help pigment settle properly. The touch-up at 6 to 8 weeks is where we correct for anything your skin decided to do on its own. And being honest about your skin during the consultation — even if you think oily skin is less desirable — helps us choose the right technique from the start. Curious about what would work for your skin? WhatsApp us at +65 8930 8973 and we'll figure it out together.",

  // ─── 404 Not Found ───
  "notfound.title": "Page Not Found",
  "notfound.desc": "The page you're looking for doesn't exist.",
  "notfound.brows": "Brows",
  "notfound.nails": "Nails",
  "notfound.shop": "Shop",
  "notfound.contact": "Contact",

  // ─── Launch ───
  "launch.tag": "Coming Soon",
  "launch.title": "A New Collection Is Coming",
  "launch.desc": "Be the first to know. Join the waitlist for exclusive early access.",
  "launch.days": "Days",
  "launch.hours": "Hours",
  "launch.minutes": "Minutes",
  "launch.seconds": "Seconds",
  "launch.notify": "Notify Me at Launch",
  "launch.gallery": "First Look",
  "launch.wa": "Get Early Access via WhatsApp",

  // ─── Mobile Nav Groups ───
  "nav.mobile.info": "Info",
  "nav.mobile.blog": "Blog",

  // ─── Service Comparison Table ───
  "compare.title": "Service",
  "compare.duration": "Duration",
  "compare.longevity": "Longevity",
  "compare.skintype": "Skin Type",
  "compare.price": "Price",
  "compare.longevity.embroidery": "12–18 months",
  "compare.longevity.microblading": "6–12 months",
  "compare.longevity.nano": "18–24 months",
  "compare.longevity.ombre": "12–18 months",
  "compare.longevity.shaping": "4–6 weeks",
  "compare.longevity.lip": "24–36 months",
  "compare.skin.normaldry": "Normal to dry",
  "compare.skin.all": "All types",
  "compare.heading": "Compare Our Services",

  // ─── Brow Try-On ───
  "tryon.tag": "Brow Try-On",
  "tryon.title": "See Your Future Brows",
  "tryon.desc":
    "Upload a photo, pick a style, and see how your brows could look. All processing happens on your device — your photo never leaves your phone.",
  "tryon.upload.title": "Upload Your Photo",
  "tryon.upload.desc": "A clear, front-facing photo works best.",
  "tryon.upload.choose": "Choose File",
  "tryon.upload.camera": "Use Camera",
  "tryon.upload.privacy":
    "Your photo stays on your device. Nothing is uploaded.",
  "tryon.upload.drop": "Drag and drop a photo here",
  "tryon.upload.invalid": "That doesn't look like an image — please try again.",
  "tryon.loading.model": "Warming up the brow scanner...",
  "tryon.detecting": "Finding your brows...",
  "tryon.noface":
    "We couldn't find a face. Try a clearer front-facing photo.",
  "tryon.error.model":
    "Couldn't load the brow scanner. Check your connection and try again.",
  "tryon.tip": "Tip: Use a well-lit, front-facing photo for best results.",
  "tryon.styles.title": "Choose a Style",
  "tryon.control.thickness": "Thickness",
  "tryon.control.intensity": "Colour Depth",
  "tryon.control.arch": "Arch Position",
  "tryon.compare": "Hold to compare",
  "tryon.download": "Download",
  "tryon.share": "Share via WhatsApp",
  "tryon.retry": "Try Another Photo",
  "tryon.cta.title": "Love what you see?",
  "tryon.cta.desc":
    "Book a consultation and let's bring this look to life.",
  "tryon.cta.book": "Book a Consultation",
  "tryon.discover.title": "Try Before You Book",
  "tryon.discover.desc":
    "Upload a photo and see how each brow style suits you — instantly, privately, free.",
  "tryon.discover.cta": "Try on Brow Styles →",
  "tryon.style.nano-soft": "Nano — Soft Natural",
  "tryon.style.nano-defined": "Nano — Defined",
  "tryon.style.microblading-feathered": "Microblading — Feathered",
  "tryon.style.ombre-light": "Ombre — Light",
  "tryon.style.ombre-bold": "Ombre — Bold",
  "tryon.style.embroidery-classic": "Embroidery — Classic",
  "tryon.style.nano-soft.desc":
    "Best for sparse brows or first-timers — looks like you've grown them yourself.",
  "tryon.style.nano-defined.desc":
    "Crisp, defined strokes that read clearly from across the room.",
  "tryon.style.microblading-feathered.desc":
    "Hair-stroke detail. Best on normal-to-dry skin.",
  "tryon.style.ombre-light.desc":
    "Soft makeup-look powder. Easy to live with, no upkeep.",
  "tryon.style.ombre-bold.desc":
    "Defined ombre — like having your brows always 'done'.",
  "tryon.style.embroidery-classic.desc":
    "Our signature. The midpoint between strokes and powder.",
  "tryon.share.message":
    "Hi Shimmy! I tried the brow visualizer and I love the {style} look — can we book a consultation?",
  "tryon.compare.toggle": "Compare",
  "tryon.compare.on": "On",
  "tryon.compare.off": "Off",
  "tryon.compare.hint":
    "Drag the slider left or right to compare with your original.",
  "tryon.control.independent": "Adjust brows independently",
  "tryon.control.arch.left": "Left brow",
  "tryon.control.arch.right": "Right brow",
  "tryon.help.title": "How it works",
  "tryon.help.step1": "Upload a clear, front-facing photo",
  "tryon.help.step2": "Pick your favourite brow style",
  "tryon.help.step3": "Adjust to taste, then save or share",
  "tryon.help.dismiss": "Got it",

  // ─── Pricing & longevity ───
  "tryon.price.from": "From",
  "tryon.longevity.label": "Lasts",
  "tryon.longevity.nano": "12–18 months",
  "tryon.longevity.microblading": "12–18 months",
  "tryon.longevity.ombre": "2–3 years",
  "tryon.longevity.embroidery": "1–2 years",
  "tryon.popular.badge": "Most booked",
  "tryon.tried.this.month": "tried this month",

  // ─── Brow colour picker ───
  "tryon.color.title": "Brow Colour",
  "tryon.color.auburn": "Auburn",
  "tryon.color.soft-brown": "Soft Brown",
  "tryon.color.rich-brown": "Rich Brown",
  "tryon.color.espresso": "Espresso",
  "tryon.color.black-brown": "Black Brown",

  // ─── Live camera capture ───
  "tryon.camera.start": "Take a Photo",
  "tryon.camera.title": "Position Your Face",
  "tryon.camera.guide": "Keep your face inside the circle and look straight ahead.",
  "tryon.camera.capture": "Capture",
  "tryon.camera.retake": "Retake",
  "tryon.camera.cancel": "Cancel",
  "tryon.camera.countdown": "Get ready...",
  "tryon.camera.error":
    "We couldn't access your camera. Check your browser permissions.",

  // ─── A/B compare two styles ───
  "tryon.ab.toggle": "Compare two styles",
  "tryon.ab.left": "Left",
  "tryon.ab.right": "Right",
  "tryon.ab.pick": "Pick a style for each side",
  "tryon.ab.exit": "Exit compare",
  "tryon.ab.winner": "I prefer this one",

  // ─── Branded share card ───
  "tryon.card.brand": "Brows by Shimmyhands",
  "tryon.card.tagline": "Tried at shimmyhands.com",
  "tryon.card.download": "Download Story Card",
  "tryon.card.code": "MENTION TRYON FOR S$50 OFF",

  // ─── Save my look (lead capture) ───
  "tryon.save.title": "Save Your Look",
  "tryon.save.desc":
    "We'll text you a reminder when you're ready to book — no spam, promise.",
  "tryon.save.name": "Name",
  "tryon.save.phone": "Phone (WhatsApp)",
  "tryon.save.email": "Email (optional)",
  "tryon.save.submit": "Save & Get Reminder",
  "tryon.save.success":
    "Saved! We've noted your favourite style — talk soon.",
  "tryon.save.error": "Couldn't save right now. Please try again.",
  "tryon.save.cancel": "Not now",

  // ─── Book this look CTA ───
  "tryon.book.this.look": "Book This Look",
  "tryon.book.note.prefix": "Tried in visualizer:",

  // ─── Face shape quiz ───
  "tryon.quiz.open": "Not sure which style? Take the 30-sec quiz →",
  "tryon.quiz.title": "Find Your Best Brows",
  "tryon.quiz.subtitle":
    "Three quick questions — we'll suggest the styles that flatter you most.",
  "tryon.quiz.next": "Next",
  "tryon.quiz.back": "Back",
  "tryon.quiz.skip": "Skip quiz",
  "tryon.quiz.q1": "Looking in a mirror, your face feels…",
  "tryon.quiz.q1.a": "Shorter / rounder",
  "tryon.quiz.q1.b": "Balanced / oval",
  "tryon.quiz.q1.c": "Longer / narrow",
  "tryon.quiz.q2": "Your jawline is…",
  "tryon.quiz.q2.a": "Soft and rounded",
  "tryon.quiz.q2.b": "Strong and angular",
  "tryon.quiz.q2.c": "Tapered toward a pointed chin",
  "tryon.quiz.q3": "You want your brows to look…",
  "tryon.quiz.q3.a": "Soft and effortless",
  "tryon.quiz.q3.b": "Polished and defined",
  "tryon.quiz.result.title": "Your face shape: {shape}",
  "tryon.quiz.result.subtitle": "We recommend these styles for you:",
  "tryon.quiz.result.try": "Try this style",
  "tryon.quiz.shape.oval": "Oval",
  "tryon.quiz.shape.round": "Round",
  "tryon.quiz.shape.square": "Square",
  "tryon.quiz.shape.heart": "Heart",
  "tryon.quiz.shape.long": "Long",

  // ─── Real client gallery ───
  "tryon.gallery.title": "Real Clients · Real Results",
  "tryon.gallery.subtitle":
    "Synthetic previews show shape — these photos show our actual handwork.",
  "tryon.gallery.before": "Before",
  "tryon.gallery.after": "After",

  // ─── Reviews ───
  "reviews.tag": "Google Reviews",
  "reviews.title": "What Our Clients Say",
  "reviews.on.google": "on Google",
  "reviews.leave": "Leave Us a Review",

  // ─── Instagram Feed ───
  "instagram.tag": "@shimmyhands.shop",
  "instagram.title": "Follow Our Journey",
  "instagram.follow": "Follow @shimmyhands.shop",
  "instagram.post.nano": "Nano Brows",
  "instagram.post.pressons": "Press-On Nails",
  "instagram.post.ombre": "Ombre Brows",
  "instagram.post.studio": "Studio Life",
  "instagram.post.nailart": "Nail Art",
  "instagram.post.bts": "Behind the Scenes",

  // ─── Client Counter ───
  "counter.clients": "Happy Clients",
  "counter.brows": "Brows Crafted",
  "counter.nails": "Nail Sets Sold",

  // ─── Analytics Dashboard ───
  "analytics.title": "Analytics",
  "analytics.period.7d": "7 Days",
  "analytics.period.30d": "30 Days",
  "analytics.period.90d": "90 Days",
  "analytics.page.views": "Page Views",
  "analytics.tryon.completions": "Try-On Completions",
  "analytics.cart.adds": "Cart Adds",
  "analytics.leads.saved": "Leads Saved",
  "analytics.top.pages": "Top Pages",
  "analytics.top.events": "Top Events",
  "analytics.page": "Page",
  "analytics.event": "Event",
  "analytics.count": "Count",
  "analytics.no.data": "No analytics data for this period.",

  // ─── Cron ───
  "cron.abandoned.carts": "Abandoned Cart Recovery",
  "cron.care.reminders": "Post-Appointment Care Reminders",

  // ─── Nav (new pages) ───
  "nav.referral": "Refer a Friend",
  "nav.gift.cards": "Gift Cards",
  "nav.loyalty": "Loyalty",

  // ─── Referral ───
  "referral.tag": "Referral Program",
  "referral.title": "Share the Shimmy Love",
  "referral.desc": "Know someone who deserves beautiful brows? Share your link and you both get $10 off your next session.",
  "referral.how.title": "How It Works",
  "referral.step1.title": "Share Your Link",
  "referral.step1.desc": "Generate your unique referral code and send it to a friend via WhatsApp, text, or however you like.",
  "referral.step2.title": "Friend Books",
  "referral.step2.desc": "Your friend mentions your referral code when they book their first session with us.",
  "referral.step3.title": "You Both Save",
  "referral.step3.desc": "You both get $10 off your next visit. Simple as that.",
  "referral.form.title": "Get Your Referral Code",
  "referral.form.name": "Your Name",
  "referral.form.name.placeholder": "Your first name",
  "referral.form.submit": "Get My Code",
  "referral.form.loading": "Generating...",
  "referral.error": "Something went wrong. Please try again.",
  "referral.success.title": "Your Code Is Ready!",
  "referral.success.desc": "Share this code with friends and you both save $10.",
  "referral.success.code": "Your Referral Code",
  "referral.copy": "Copy Link",
  "referral.copied": "Copied!",
  "referral.share.whatsapp": "Share via WhatsApp",
  "referral.share.message": "Hey! I love my brows from Shimmy Beauty Studio. Use my referral link and we both get $10 off: {link}",
  "referral.welcome.prefix": "You were referred by",
  "referral.welcome.suffix": "! Mention code",
  "referral.welcome.discount": "for $10 off your first session.",

  // ─── Gift Cards ───
  "gift.tag": "Gift Cards",
  "gift.title": "Give the Gift of Beautiful Brows",
  "gift.desc": "A Shimmy gift card is the perfect present for someone who deserves a little self-care. Redeemable for all services.",
  "gift.card.label": "Gift Card",
  "gift.card.value": "Value",
  "gift.value.label": "Card Value",
  "gift.value.custom": "Custom",
  "gift.form.your.name": "Your Name",
  "gift.form.your.name.placeholder": "Your full name",
  "gift.form.your.email": "Your Email",
  "gift.form.your.email.placeholder": "you@example.com",
  "gift.form.recipient.name": "Recipient Name",
  "gift.form.recipient.name.placeholder": "Who is this for?",
  "gift.form.recipient.email": "Recipient Email",
  "gift.form.recipient.email.placeholder": "Their email address",
  "gift.form.message": "Personal Message",
  "gift.form.message.placeholder": "Add a personal note...",
  "gift.form.optional": "optional",
  "gift.purchase.title": "Purchase a Gift Card",
  "gift.purchase.submit": "Purchase Gift Card",
  "gift.purchase.loading": "Processing...",
  "gift.purchase.error": "Something went wrong. Please try again.",
  "gift.purchase.success.title": "Gift Card Created!",
  "gift.purchase.success.desc": "Share the code below with the recipient.",
  "gift.purchase.success.code": "Gift Card Code",
  "gift.share.whatsapp": "Send via WhatsApp",
  "gift.share.message": "Hi {name}! You've been gifted a {value} Shimmy Beauty Studio gift card. Your code is: {code}. Redeem it at shimmyhands.com/gift-cards",
  "gift.check.title": "Check Your Balance",
  "gift.check.code.label": "Gift Card Code",
  "gift.check.code.placeholder": "Enter your code",
  "gift.check.submit": "Check Balance",
  "gift.check.loading": "Checking...",
  "gift.check.balance": "Remaining Balance",
  "gift.check.for": "For",
  "gift.check.active": "Active",
  "gift.check.redeemed": "Fully Redeemed",
  "gift.check.notfound": "Gift card not found. Please check the code.",
  "gift.check.error": "Something went wrong. Please try again.",

  // ─── Loyalty ───
  "loyalty.tag": "Loyalty Rewards",
  "loyalty.title": "Check Your Loyalty Status",
  "loyalty.desc": "Every visit brings you closer to a reward. Enter your phone number to see where you stand.",
  "loyalty.tiers.title": "Reward Tiers",
  "loyalty.tier.visits": "visits",
  "loyalty.tier1.reward": "S$15 Off",
  "loyalty.tier2.reward": "S$30 Off",
  "loyalty.tier3.reward": "Free Touch-Up",
  "loyalty.check.title": "Look Up Your Visits",
  "loyalty.check.phone.label": "Phone Number",
  "loyalty.check.phone.placeholder": "8XXX XXXX",
  "loyalty.check.submit": "Check Status",
  "loyalty.check.loading": "Looking up...",
  "loyalty.error": "Something went wrong. Please try again.",
  "loyalty.no.visits": "We don't have any visits on file for this number yet. Book your first session!",
  "loyalty.book.first": "Book Your First Session",
  "loyalty.total.visits": "Total Visits",
  "loyalty.progress.current": "Progress",
  "loyalty.progress.to.next": "more to next reward",
  "loyalty.next.reward": "Next reward",
  "loyalty.history.title": "Visit History",

  // ─── Blog Search & Filter ───
  "blog.search.placeholder": "Search articles...",
  "blog.filter.all": "All",
  "blog.filter.brows": "Brows",
  "blog.filter.nails": "Nails",
  "blog.tag.page.title": "Articles tagged: {tag}",
  "blog.tag.page.back": "← All Articles",
  "blog.no.results": "No articles found",

  // ─── FAQ Schema — Nails ───
  "faq.nails.1.q": "How long do press-on nails last?",
  "faq.nails.1.a": "With proper application and care, most handcrafted press-on nail sets last 1 to 2 weeks. Using nail glue instead of adhesive tabs and prepping your nails with alcohol extends wear time significantly.",
  "faq.nails.2.q": "Can I reuse press-on nails?",
  "faq.nails.2.a": "Yes! Gently remove any remaining adhesive from the back of the press-on after soaking. Store them in their original box. Most well-made sets can be worn 2 to 3 times.",
  "faq.nails.3.q": "Will press-on nails damage my natural nails?",
  "faq.nails.3.a": "Not if removed properly. Soak in warm water with cuticle oil for 10 to 15 minutes and gently slide them off. Never rip or force press-ons off, as that can tear the nail surface.",
  "faq.nails.4.q": "How do I choose the right size press-on nail?",
  "faq.nails.4.a": "Measure the widest part of each natural nail. The press-on should cover your nail bed edge to edge without overlapping onto skin. If between sizes, choose the smaller one and file to fit.",

  // ─── FAQ Schema — Brows Landing ───
  "faq.brows.1.q": "What types of brow services do you offer?",
  "faq.brows.1.a": "We offer eyebrow embroidery, microblading, nano brows, ombre powder brows, brow shaping and design, and lip blush. Each technique suits different skin types and preferences.",
  "faq.brows.2.q": "How do I know which brow technique is right for me?",
  "faq.brows.2.a": "It depends on your skin type, lifestyle, and the look you want. Oily skin does best with nano or ombre. Dry skin holds all techniques well. We recommend booking a consultation so we can assess your skin and suggest the best fit.",
  "faq.brows.3.q": "How long do semi-permanent brows last?",
  "faq.brows.3.a": "Depending on the technique, results last 6 to 24 months. Microblading typically fades in 6 to 12 months, while nano brows can last 18 to 24 months. A touch-up at 6 to 8 weeks locks in the final result.",
  "faq.brows.4.q": "Is the brow procedure painful?",
  "faq.brows.4.a": "We apply numbing cream before starting, and most clients describe the sensation as light scratching at most. We reapply numbing between passes so comfort stays consistent throughout the session.",
};

const zh: Record<string, string> = {
  // ─── Nav ───
  "nav.home": "首页",
  "nav.services": "服务",
  "nav.about": "关于",
  "nav.gallery": "作品",
  "nav.contact": "联系",
  "nav.availability": "预约时段",
  "nav.wishlist": "心愿单",
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
  "shop.handcrafted.desc": "每一套都在我们的新加坡工作室手工设计和绘制。没有模具，没有批量生产\u2014\u2014只有用心的艺术，一片一片地完成。",
  "shop.sizeguide": "尺寸指南",
  "shop.sizeguide.title": "找到你的尺寸",
  "shop.sizeguide.tip": "测量自然指甲最宽处。如果介于两个尺寸之间，选择较小的，再锉磨调整。",
  "shop.sizeguide.close": "关闭",
  "shop.sizeguide.blog": "阅读完整的尺寸指南 \u2192",
  "shop.restock.title": "补货时通知我",
  "shop.restock.btn": "通知我",
  "shop.restock.success": "补货时会通知你！",

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
  "svc.embroidery.duration": "2–2.5 小时",
  "svc.embroidery.desc":
    "我们的招牌技法。精细刀片逐根描绘，打造自然丰盈的眉毛——像天生长出来的那样自然。",
  "svc.embroidery.inc.1": "完整眉形设计咨询（我们会花时间好好聊）",
  "svc.embroidery.inc.2": "贴心麻醉，让你舒适放松",
  "svc.embroidery.inc.3": "双层叠加，打造逼真深度",
  "svc.embroidery.inc.4": "赠送术后护理套装",

  "svc.microblading.title": "微刀雕眉",
  "svc.microblading.price": "从 $488 起",
  "svc.microblading.duration": "2–2.5 小时",
  "svc.microblading.desc":
    "手工逐笔描绘，每一笔都模仿真实毛发。那种安静而美好的细腻感，让你的眉毛看起来自然又精致。",
  "svc.microblading.inc.1": "眉形测量与对称分析",
  "svc.microblading.inc.2": "定制色素颜色匹配",
  "svc.microblading.inc.3": "羽毛般轻盈的线条技法",
  "svc.microblading.inc.4": "6–8 周内包含补色",

  "svc.nano.title": "纳米雾眉",
  "svc.nano.price": "从 $588 起",
  "svc.nano.duration": "2–3 小时",
  "svc.nano.desc":
    "我们最精细的技术。数字纳米针精准植入色素，效果出色，而且特别适合各种肤质——包括容易让其他技术褪色的油性皮肤。",
  "svc.nano.inc.1": "数字精准眉形设计",
  "svc.nano.inc.2": "纳米针技术（最精细级别）",
  "svc.nano.inc.3": "适合所有肤质，包括油性",
  "svc.nano.inc.4": "持久效果：18–24 个月",

  "svc.ombre.title": "渐变粉黛眉",
  "svc.ombre.price": "从 $488 起",
  "svc.ombre.duration": "2–2.5 小时",
  "svc.ombre.desc":
    "前面淡淡的，尾部渐渐加深——就像你每天精心晕染眉粉的效果，只不过这个可以维持两年左右。",
  "svc.ombre.inc.1": "定制渐变浓度",
  "svc.ombre.inc.2": "柔和机器晕染技法",
  "svc.ombre.inc.3": "非常适合每天画眉的你",
  "svc.ombre.inc.4": "好打理，效果美",

  "svc.shaping.title": "眉形设计",
  "svc.shaping.price": "从 $48 起",
  "svc.shaping.duration": "30–45 分钟",
  "svc.shaping.desc":
    "还没准备好做半永久？这是一个很好的起点。我们会用线修、热蜡或两者结合，为你找到最适合的眉形。",
  "svc.shaping.inc.1": "脸型与面部轮廓分析",
  "svc.shaping.inc.2": "精准眉形设计",
  "svc.shaping.inc.3": "线修、热蜡或组合技法",
  "svc.shaping.inc.4": "眉毛定型凝胶收尾",

  "svc.lip.title": "唇釉",
  "svc.lip.price": "从 $488 起",
  "svc.lip.duration": "2–2.5 小时",
  "svc.lip.desc":
    "柔和的半永久唇色，给嘴唇添上一层淡淡的红润——那种安静的光彩，能温柔地点亮整张脸。",
  "svc.lip.inc.1": "唇形与颜色咨询",
  "svc.lip.inc.2": "定制色素调配",
  "svc.lip.inc.3": "舒缓麻醉",
  "svc.lip.inc.4": "包含补色服务",

  // ─── About Page ───
  "aboutpage.tag": "创始人故事",
  "aboutpage.title": "关于 Shimmy",
  "aboutpage.headline.1": "认识",
  "aboutpage.headline.2": "Abigail",
  "aboutpage.p1":
    "在 Shimmy 之前，Abigail Chung 是朋友圈里那个大家都找她做美甲和睫毛的人。她擅长那些细致入微的小细节——能把一套指甲从“还不错”变成“真的好看”的那种。她喜欢这件事，也做得很好。然后她怀孕了，一切就暂停了。嫁接睫毛的胶水味、指甲粉尘、长时间弯腰——这些都跟肚子里的宝宝不兼容。她需要一个新方向。",
  "aboutpage.p2":
    "就在那时候，她遇见了眉毛这门手艺。她飞到中国佛山，在全国最受认可的纹绣学院之一，跟着杨艺老师学了一年多。不是几天的速成班——是正式的跟师学艺。她为几十位当地客人做练习，跟着一位从业几十年的老师学脸部测量，也和全国各地的纹绣师结下了友谊。她在那里带回来的不仅是技术——还有一种理念。每张脸都有自己的结构，眉毛应该尊重它。",
  "aboutpage.p3":
    "回到新加坡后，她的目标很清楚：把这门手艺带回来，认真地做。Brows by Shimmyhands 就是这样来的——绣眉、纳米眉、雾眉、唇釉——每一项都根据你的脸来设计，从不赶工，绝不套模板。美甲后来也回来了。客人总说：“你让我的眉毛变得像我自己——手上也能做到吗？”Nails by Shimmyhands 是同一套标准的自然延伸。",
  "aboutpage.p4":
    "对 Abigail 来说，这从来不只是关于眉毛。而是那个你照镜子时终于觉得好看的瞬间——那种脸对了之后带来的安静的自信。漂亮的眉毛不能解决所有问题，但它是很好的第一步。而这一步，就是 Shimmy 存在的意义。",
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
  "contact.book.title.2": "你的时段",
  "contact.book.desc":
    "WhatsApp 是最快的联系方式。Instagram 私信也可以。我们通常几小时内回复。",
  "contact.wa.label": "WhatsApp",
  "contact.wa.desc": "+65 8930 8973 — 最快联系方式",
  "contact.ig.label": "Instagram",
  "contact.ig.desc": "@shimmyhands.shop — 私信随时开放",
  "contact.google.label": "谷歌评价",
  "contact.google.desc": "留下你的评价——对我们意义重大",
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
  "contact.prep.2": "请勿涂抹眉部彩妆，眉毛保持干净裸妆即可",
  "contact.prep.3": "提前10分钟到，让我们有时间好好聊",
  "contact.prep.4": "如有任何皮肤问题或过敏，请提前告知我们",

  // ─── Footer ───
  "footer.desc": "为你的脸用心设计的眉毛——每一次预约，都用心对待。",
  "footer.links": "快速导航",
  "footer.contact": "联系方式",
  "footer.rights": "版权所有。",
  "footer.location": "新加坡",

  // ─── Cookie Consent ───
  "cookie.text": "我们使用 Cookie 来提升你的体验。继续浏览即表示你同意我们的 Cookie 政策。",
  "cookie.accept": "接受",
  "cookie.learn": "了解更多",

  // ─── Stats Bar ───
  "stats.brows": "已塑造眉数",
  "stats.rating": "平均评分",
  "stats.years": "年扎根新加坡",

  // ─── Email Capture ───
  "email.placeholder": "请输入邮箱地址",
  "email.cta": "领取 $10 优惠",
  "email.success": "谢谢——我们会尽快联系你！",
  "email.error": "请输入有效的邮箱地址。",
  "email.heading": "抢先了解新系列——首次购买立减 $10。",

  // ─── Before/After ───
  "results.tag": "蜕变效果",
  "results.title": "真实效果",
  "results.before": "之前",
  "results.after": "之后",

  // ─── Booking Form ───
  "book.step.service": "选择服务",
  "book.step.service.desc": "选择你想预约的服务。",
  "book.step.date": "选择日期",
  "book.step.date.note": "周日仅限预约。灰色日期不可预约。",
  "book.step.time": "选择时间",
  "book.step.time.loading": "正在加载可用时段...",
  "book.step.time.another": "选择其他日期",
  "book.step.time.closed": "当日休息。",
  "book.step.time.blocked": "该日期不可预约。",
  "book.step.time.none": "该日期暂无可用时段。",
  "book.step.time.fail": "加载失败，请重试。",
  "book.step.details": "填写信息",
  "book.step.details.desc": "方便我们确认你的预约。",
  "book.label.name": "姓名",
  "book.label.phone": "手机号",
  "book.label.email": "邮箱",
  "book.label.notes": "备注",
  "book.label.optional": "（选填）",
  "book.placeholder.name": "你的全名",
  "book.placeholder.phone": "+65 XXXX XXXX",
  "book.placeholder.email": "your@email.com",
  "book.placeholder.notes": "有什么偏好或问题想提前说？",
  "book.error.required": "请填写姓名和手机号。",
  "book.review": "查看预约详情",
  "book.confirm.title": "确认预约",
  "book.confirm.desc": "请确认以下信息。",
  "book.label.service": "服务",
  "book.label.date": "日期",
  "book.label.time": "时间",
  "book.submitting": "提交中...",
  "book.confirm.btn": "确认预约",
  "book.done.title": "预约已提交！",
  "book.done.ref": "预约编号",
  "book.done.another": "再次预约",
  "book.error.generic": "出错了，请重试。",
  "book.error.network": "网络错误，请检查网络后重试。",
  "book.online.tag": "在线预约",
  "book.online.title": "预约你的咨询",

  // ─── Urgency / Availability ───
  "urgency.brows": "本月名额有限——尽早预约锁定你的时间。",
  "urgency.nails": "库存有限",

  // ─── Referral ───
  "referral.text": "喜欢你的效果？分享你的推荐链接——双方各享 $20 优惠。",
  "referral.wa.prefix": "更喜欢 WhatsApp？联系我们",

  // ─── Bundle Offer ───
  "bundle.title": "全套 Shimmy",
  "bundle.desc": "预约任意眉毛服务，加购 Nails by Shimmyhands 穿戴甲——立省 $15。",
  "bundle.note": "WhatsApp 联系我们时请提及此优惠。",
  "bundle.cta": "立即领取",

  // ─── FAQ ───
  "faq.tag": "常见问题",
  "faq.title": "常见问答",
  "faq.1.q": "在新加坡做绣眉能维持多久？",
  "faq.1.a": "效果通常维持 12 至 18 个月，具体取决于肤质和术后护理。油性肤质可能会更早褪色。",
  "faq.2.q": "纳米雾眉和微刀雕眉有什么区别？",
  "faq.2.a": "微刀雕眉使用手工刀片。纳米雾眉使用数字纳米针，线条更细腻，适合所有肤质，包括容易让微刀技术褪色的油性皮肤。",
  "faq.3.q": "绣眉过程会痛吗？",
  "faq.3.a": "操作前会涂抹麻醉膏。大多数客人反映几乎没有不适感。",
  "faq.4.q": "Nails by Shimmyhands 穿戴甲能戴多久？",
  "faq.4.a": "正确佩戴和护理的情况下，大多数套装可以维持 1 到 2 周。",
  "faq.5.q": "可以只做咨询不做服务吗？",
  "faq.5.a": "当然可以。我们欢迎无压力的咨询，帮你了解什么最适合你。",

  // ─── Service-Specific FAQs ───
  "faq.svc.emb.1.q": "绣眉会留疤吗？",
  "faq.svc.emb.1.a": "不会。绣眉只是将色素植入皮肤表层——在专业操作和正确护理下，不会深到留疤的程度。",
  "faq.svc.emb.2.q": "绣眉后多久可以沾水？",
  "faq.svc.emb.2.a": "前 7 天请保持眉毛完全干燥。之后可以轻微接触水，但至少 2 周内避免浸泡或蒸汽。",

  "faq.svc.mic.1.q": "油性皮肤适合微刀雕眉吗？",
  "faq.svc.mic.1.a": "可以做，但油性皮肤容易让微刀线条模糊和褪色更快。如果你是油性肤质，纳米雾眉通常是更好的长期选择。",
  "faq.svc.mic.2.q": "微刀雕眉一开始会不会太深？",
  "faq.svc.mic.2.a": "会的——刚做完的眉毛通常比最终效果深 30–40%。随着皮肤在接下来 2 周内愈合，颜色会明显变浅。",

  "faq.svc.nano.1.q": "为什么纳米雾眉比较贵？",
  "faq.svc.nano.1.a": "纳米雾眉使用先进的数字设备和超细针头，需要专业培训。效果也更持久，通常可维持 18–24 个月。",
  "faq.svc.nano.2.q": "纳米雾眉可以去除吗？",
  "faq.svc.nano.2.a": "可以。纳米雾眉色素可以通过盐水去除或激光治疗来去除或淡化，建议先咨询专业人士。",

  "faq.svc.ombre.1.q": "渐变粉黛眉看起来像化妆吗？",
  "faq.svc.ombre.1.a": "它呈现柔和的填充效果，类似眉粉——但比每天化妆更自然细腻。设计理念是让你看起来“还是你的眉毛，只是更好看了”。",
  "faq.svc.ombre.2.q": "渐变粉黛眉适合眉毛稀疏的人吗？",
  "faq.svc.ombre.2.a": "非常适合。渐变粉黛眉是稀疏眉毛的最佳选择之一，因为它营造出柔和的色彩层次感，不依赖现有毛发就能打造丰盈效果。",

  "faq.svc.shp.1.q": "多久需要修一次眉？",
  "faq.svc.shp.1.a": "理想情况下每 3–4 周一次，以保持整洁的眉形。每个人毛发生长速度不同，你的眉毛师会建议最适合你的频率。",
  "faq.svc.shp.2.q": "线修比热蜡更痛吗？",
  "faq.svc.shp.2.a": "大多数人觉得线修更精准但稍微有点刺痛，比热蜡感觉强一点。两种方式都很快——每个区域的感觉只持续几秒钟。",

  "faq.svc.lip.1.q": "漂唇需要多久恢复？",
  "faq.svc.lip.1.a": "完全恢复大约需要 4–6 周。第一周可能会有干燥和脱皮——真正的颜色会在第 3 到 4 周显现。",
  "faq.svc.lip.2.q": "可以选择唇色吗？",
  "faq.svc.lip.2.a": "当然可以！我们会在咨询时为你定制调配色素，从自然的“裸唇色但更好看”到更明显的玫瑰色调，你来选择。",

  // ─── Glossary ───
  "glossary.nano_needle": "数字机器中使用的超细单针，精准植入色素——比头发丝还细。",
  "glossary.microblading": "一种手工技术，使用手持刀片创造细小的毛发状切口来填入色素，模仿自然眉毛。",
  "glossary.ombre_powder": "一种机器晕染技术，打造柔和的渐变眉——前端较浅，尾部渐渐加深。",
  "glossary.fan_strokes": "从眉头向外扇形展开的线条样式，模仿自然眉毛的生长方向。",
  "glossary.pigment_retention": "植入色素在皮肤中保持可见的程度——受肤质、术后护理和技术影响。",
  "glossary.numbing_cream": "操作前涂抹的外用麻醉膏，减少不适感。大约 15 分钟后完全生效。",
  "glossary.touch_up": "补色环节（通常在首次操作后 6–8 周），完善色素可能不均匀褪色的区域。",
  "glossary.caviar_finish": "一种纹理凸起的美甲工艺，使用微小珠子打造奢华的鱼子酱质感表面。",

  // ─── Process Page ───
  "process.tag": "你的预约",
  "process.title": "流程一览",
  "process.bring.title": "出门前准备",
  "process.bring.desc": "请素颜或仅化淡妆前来，这样我们能清楚看到你天然的眉毛生长方向。如果你有喜欢的眉形参考图，也请带上——它们能帮我们了解你的审美偏好，即使那个形状未必适合你的骨骼结构。请提前 10 分钟到达，这样可以从容安顿，不占用咨询时间。另外，来之前请记得吃点东西——空腹坐 2 小时真的不太好受。",
  "process.timeline": "整个预约大约需要 2 到 2.5 小时，以下是详细流程：",
  "process.step.1.title": "咨询",
  "process.step.1.time": "15 分钟",
  "process.step.1.desc": "我们从面部测量开始——分析你的骨骼结构、眉骨和面部比例，找到真正属于你的眉形。然后我们会坦诚聊聊你的期望：想要更浓密、更立体、还是更柔和？我们还会评估你的肤质和日常习惯，推荐最适合的技术。这一步决定了所有后续环节的走向，所以我们绝不会跳过或赶时间。",
  "process.step.2.title": "设计",
  "process.step.2.time": "15 分钟",
  "process.step.2.desc": "我们用柔软的铅笔直接在你的皮肤上画出眉形，让你清楚看到最终效果的预览。高度、粗细、眉弓位置、眉尾长度——我们一项一项调整，反复修改，直到你完全满意。全程你手边都有镜子。在你点头说好之前，什么都不会开始——这一点我们是认真的。",
  "process.step.3.title": "麻醉",
  "process.step.3.time": "15 分钟",
  "process.step.3.desc": "我们在眉毛区域涂抹医用级外用麻醉膏，让你放松等待它完全生效——通常需要 15 分钟左右。大多数客人形容之后的感觉是轻微的刮擦或压迫感，不会尖锐。如果你担心疼痛，这一步就是你不用担心的理由。操作过程中每一轮之间我们还会补涂麻醉，确保全程舒适。",
  "process.step.4.title": "操作",
  "process.step.4.time": "60 分钟",
  "process.step.4.desc": "所有准备到这里汇聚。我们逐笔描绘，层层递进地构建密度和形状，而不是一步到位。每隔几分钟我们会暂停，让你看看效果，问问你的感受。如果有任何不适，我们会立即停下补涂麻醉。节奏故意放慢——好的眉毛靠的是精准，不是速度。到最后，你在镜子里认可的那个形状，已经成了你的一部分。",
  "process.step.5.title": "揭晓",
  "process.step.5.time": "5 分钟",
  "process.step.5.desc": "照镜子的时刻——大多数客人到这一步都会忍不住笑。我们轻柔清洁眉毛区域，让你看到完整效果，如有需要会做细微调整，比如线条需要更锐利或眉尾需要多一点定义。当下的颜色会比完全愈合后深；我们会详细解释接下来几周颜色如何变柔和，让你不会有任何意外。",
  "process.step.6.title": "术后说明",
  "process.step.6.time": "10 分钟",
  "process.step.6.desc": "离开之前，我们会带你了解愈合的每一个阶段——什么是正常的、什么不是、每天该做什么。你会带走一份打印的术后护理指南和一套愈合套装，里面包含第一周所需的一切。我们还会发送电子版到你的手机，方便随时查看。如果愈合期间有任何问题，随时可以直接联系我们。",
  "process.healing.title": "离开之后",
  "process.healing.desc": "第一天：你的眉毛会比最终颜色深 30–40%——这完全正常，不用担心。第一周，表皮愈合时会有轻微脱皮和发痒；请忍住不要抠或挠。痂皮脱落时颜色可能看起来不均匀，但别着急。到了第四周，深层色素在皮肤中沉淀，真正的颜色就会显现。6–8 周后，你会回来做补色，我们会完善任何愈合不均匀的地方，锁定最终形状。",
  "process.cta": "准备好预约了吗？我们很期待为你打造每天醒来都会喜欢的眉毛。",

  // ─── Process — 完整旅程（从报名到长期护理） ───
  "process.phase.1": "预约前",
  "process.phase.2": "在工作室",
  "process.phase.3": "你的愈合旅程",
  "process.phase.4": "补色环节",
  "process.phase.5": "长期护理",

  "process.signup.title": "联系我们",
  "process.signup.time": "第 1 天",
  "process.signup.desc": "WhatsApp 联系我们 +65 8930 8973，或使用眉毛页面的预约表单。告诉我们你想了解什么——考虑的技法、任何顾虑、以及时间安排。我们通常几小时内会回复，绝不会推销。如果你想在确定预约前先进行 15 分钟的免费视讯咨询，告诉我们就好。",

  "process.book.title": "确认时段",
  "process.book.time": "24 小时内",
  "process.book.desc": "确定日期后，我们会发送预约详情确认，以及一个小额订金链接来锁定时段（订金会抵扣最终费用）。我们也会用邮件发送预约前指南，说明事前几天要做和要避免的事项。如果需要改期，提前 24 小时告诉我们，我们会顺利帮你调整。",

  "process.prep.title": "事前准备",
  "process.prep.time": "前 48 小时",
  "process.prep.desc": "预约前两天，请减少会让血液变稀的东西——酒精、咖啡因、阿司匹林、鱼油、维他命 E 补充剂。这些会让操作时出血增加，影响留色。前一天避免脸部日晒。预约当天早上请好好吃一顿——空腹坐 2 小时会感觉特别漫长。",

  // 阶段 3：愈合旅程（详细分阶段）
  "process.heal.1.title": "第 1–3 天 — 颜色浓烈，可能稍微肿胀",
  "process.heal.1.desc": "眉毛看起来会比最终效果明显深色——大约深 30% 到 40%。可能会有轻微的肿胀和压痛感，通常 24 小时内会消退。保持眉毛干燥，用干净棉签薄薄涂抹我们提供的修护膏，避免用手碰触。眉部和周围不要化妆。",

  "process.heal.2.title": "第 4–7 天 — 脱皮与结痂",
  "process.heal.2.desc": "开始轻微脱皮。细小痂皮会自行形成并脱落——这是表层皮肤在底层色素之上愈合的过程。请不要抠、不要抓、不要撕。提早撕掉痂皮可能把色素一起带走，造成斑驳。痒是正常的。继续少量涂抹修护膏。可以洗澡，但避免水直接冲到眉毛。",

  "process.heal.3.title": "第 2–4 周 — 消色期",
  "process.heal.3.desc": "这个阶段会让所有人都心慌。颜色看起来明显变淡甚至完全消失。别紧张。色素并没有跑掉——它正沉在一层新的、慢慢变透明的皮肤底下。这是愈合的正常阶段，每位客人都会经历。请忍住马上私讯我们的冲动（我们保证颜色会回来）。",

  "process.heal.4.title": "第 4–6 周 — 真色浮现",
  "process.heal.4.desc": "随著新皮肤变清透，色素从下方重新浮现。你将第一次看到真正愈合后的颜色——比第一天柔和，也很接近你接下来一到两年会拥有的样子。可能某些区域比较淡或不均匀。这是预期之中的，正是补色环节存在的原因。",

  // 阶段 4：补色
  "process.touchup.title": "补色预约",
  "process.touchup.time": "第 6–8 周",
  "process.touchup.desc": "这一环节已包含在你的第一次费用中。我们会邀请你在初次操作后约 6 到 8 周回来精修效果。我们会评估愈合后的颜色、补上褪色不均的地方、必要时锐化线条、并定下最终眉形。补色大约一小时，使用相同的麻醉流程。术后护理与第一次相同，但通常愈合得更快。",

  // 阶段 5：长期
  "process.longterm.title": "12 到 24 个月之后",
  "process.longterm.desc": "绣眉是半永久的——颜色会随著皮肤自然代谢，在 12 到 24 个月间逐渐变淡。褪色是均匀的，老化时不会出现生硬的线条或奇怪的斑块。大多数客人每 12 至 18 个月回来做一次补色保养，比从头再做一次更短也更省。到时候我们会发送温馨提醒。",

  "process.longterm.maintain.title": "日常维护",
  "process.longterm.maintain.desc": "完全愈合后，眉毛几乎不需要特别护理——但几个习惯能让效果更持久。日晒时在眉毛附近（不要直接擦在上面）涂防晒；紫外线是早期褪色的最大原因。避免在眉部区域直接使用刺激性去角质或维 A 酸产品。如果你觉得两次操作之间想让眉毛重新精神起来，可以预约一次修眉，能延长绣眉效果数月之久。",

  "process.faq.cta": "还有问题？阅读我们的",
  "process.faq.link": "眉毛护理文章",

  // ─── Press / As Seen In ───
  "press.title": "媒体报道",

  // ─── Seasonal Banners ───
  "seasonal.cny": "新年焕新眉——趁早预约不排队",
  "seasonal.spring": "新娘美甲套餐——为你的大日子量身订制",
  "seasonal.summer": "夏日防晒眉——预约咨询",
  "seasonal.fall": "新季节新面貌——焕新你的眉毛",
  "seasonal.holiday": "送一份 Shimmy 体验作为节日礼物",
  "seasonal.cta.cny": "立即预约",
  "seasonal.cta.spring": "立即咨询",
  "seasonal.cta.summer": "立即预约",
  "seasonal.cta.fall": "立即预约",
  "seasonal.cta.holiday": "选购礼品",

  // ─── Most Popular Badge ───
  "badge.popular": "最受欢迎",

  // ─── Links Page ───
  "links.book": "预约眉毛服务",
  "links.shop": "选购穿戴甲",
  "links.services": "查看全部服务",
  "links.whatsapp": "WhatsApp 联系",
  "links.instagram": "关注 Instagram",

  // ─── Homepage Buttons ───
  "home.explore.brows": "了解眉毛",
  "home.explore.nails": "了解美甲",

  // ─── Nails Page Hardcoded ───
  "nails.bts.tag": "幕后花絮",
  "nails.bts.title": "感受手工艺术",
  "nails.collection.view": "查看系列 →",

  // ─── Blog ───
  "blog.tag": "护理技巧与指南",
  "blog.title": "美丽日志",
  "blog.desc": "关于眉毛术后护理、穿戴甲使用技巧，以及那些别人不太讲的问题。",
  "blog.readmore": "阅读全文 →",
  "blog.readtime": "分钟阅读",
  "blog.related": "你可能也想看",
  "blog.back": "← 返回日志",
  "blog.cat.brows": "眉毛护理",
  "blog.cat.nails": "美甲技巧",
  "blog.cta": "还有更多问题？我们随时乐意帮忙。",

  // 文章 1：绣眉术后护理
  "blog.1.title": "绣眉术后完全护理指南",
  "blog.1.desc": "从第一天到完全恢复，关于绣眉后护理你需要知道的一切。",
  "blog.1.p1": "绣眉后的前 24 小时最为关键。你的眉毛看起来会比最终效果深很多——这完全正常。色素需要时间融入皮肤，愈合过程中颜色会自然变浅 30–40%。",
  "blog.1.p2": "第一周请保持眉毛干燥。洗脸时避免直接冲洗眉毛区域——用湿毛巾轻轻擦拭周围即可。不要游泳、蒸桑拿或剧烈运动导致大量出汗。淋浴时尽量让脸部避开水流直冲。",
  "blog.1.p3": "使用纹绣师提供的修复膏，每天用干净棉签薄薄涂抹 2–3 次。少即是多——过多的修复膏会堵塞皮肤，影响留色效果。轻轻一层，几乎看不出来的薄度就刚好。",
  "blog.1.p4": "第 3 到第 7 天，你会注意到轻微的脱皮或结痂。这是皮肤自然愈合的过程。千万不要抠、挠或撕掉皮屑——让它们自然脱落。抠掉可能会把色素带走，留下不均匀的斑点。",
  "blog.1.p5": "至少 2 周内避免阳光直射。紫外线会在色素完全稳定之前大幅度加速褪色。如果必须外出，请戴宽檐帽。痊愈后，在眉毛附近（而非眉毛上）涂抹防晒霜有助于延长持色时间。",
  "blog.1.p6": "完全愈合大约需要 4–6 周。第 2 周左右颜色可能看起来好像“消失”了——别紧张，色素还在，只是沉入了皮肤表层下方。到第 4 周，真正的颜色会浮现出来。6–8 周后的补色环节会完善任何需要调整的区域。",

  // 文章 2：如何佩戴穿戴甲
  "blog.2.title": "如何像专业人士一样佩戴穿戴甲",
  "blog.2.desc": "一步步教你佩戴手工穿戴甲，打造沙龙级效果，维持长达两周。",
  "blog.2.p1": "从干净干燥的指甲开始。去除旧甲油，彻底洗手。用甲皮推轻轻推回甲缘——这样可以增加粘合面积，让穿戴甲根部看起来更干净自然。",
  "blog.2.p2": "用细磨指甲锉轻轻打磨每个指甲表面，去除光泽并创造略微粗糙的质地，帮助粘合剂更好地附着。用酒精棉片擦拭每个指甲，去除油脂和灰尘。这一步对穿戴甲的持久度影响巨大。",
  "blog.2.p3": "佩戴前先将每片穿戴甲对准你的指甲试大小。穿戴甲应该完全覆盖甲床，从一侧到另一侧，但不要溢出到皮肤上。如果稍微偏大，轻轻锉磨两侧使其贴合。合适的尺寸是舒适和持久的关键。",
  "blog.2.p4": "为了最长的持久度，使用指甲胶而非粘贴片。在你的自然指甲和穿戴甲背面都薄薄涂一层胶水。从甲缘端向指尖按压，保持 15–20 秒。同时从两侧轻轻施压，确保完全贴合。",
  "blog.2.p5": "佩戴完所有十片指甲后，至少一小时内避免将手浸入水中，让胶水充分固化。为了最佳效果，洗碗时戴手套，避免用指甲当工具。细心护理下，你的手工穿戴甲可以美丽维持 1–2 周。",

  // 文章 3：纳米雾眉 vs 微刀雕眉
  "blog.3.title": "纳米雾眉 vs 微刀雕眉：哪个更适合你？",
  "blog.3.desc": "两种最热门半永久眉毛技术的清晰对比，帮你根据肤质选择最佳方案。",
  "blog.3.p1": "纳米雾眉和微刀雕眉都能创造自然逼真的毛发般线条——但使用的工具和技术截然不同。了解区别可以帮你选择最适合自己肤质和生活方式的方法。",
  "blog.3.p2": "微刀雕眉使用手持刀片工具在皮肤上创造细小切口，将色素沉入每道线条。效果是漂亮清晰的毛发纹路。但微刀技术最适合中性至干性肤质。油性皮肤上，线条容易模糊褪色，有时 6–12 个月内就会失去清晰度。",
  "blog.3.p3": "纳米雾眉使用数字机器配合单根超细针——比头发丝还细。针头以精确可控的方式将色素送入皮肤。由于针孔比刀片切口更小更均匀，纳米雾眉的愈合效果通常更清晰、维持更久，一般 18–24 个月。",
  "blog.3.p4": "纳米雾眉最大的优势是适用性广。它适合所有肤质，包括油性和混合性肌肤。这种技术对皮肤的创伤更小，意味着操作中出血更少、愈合更快、色素留存更好。",
  "blog.3.p5": "两者的疼痛感相似——事前都会涂抹麻醉膏，大多数客人形容感觉像轻微的刮擦。价格方面，纳米雾眉因先进设备通常略高一些，但许多客人觉得更持久的效果物有所值。如果不确定，预约一次咨询，我们会根据你的具体肤质和眉毛目标帮你决定。",

  // 文章 4：如何安全卸除穿戴甲
  "blog.4.title": "如何安全卸除穿戴甲而不伤指甲",
  "blog.4.desc": "温和卸除穿戴甲的正确方法，让你的自然指甲保持健康完好。",
  "blog.4.p1": "千万不要硬拽或撕掉穿戴甲。强行拉扯会撕裂自然指甲的甲层，让指甲变薄、脆弱甚至疼痛。用正确的方法，卸甲只需 10–15 分钟，指甲完好无损。",
  "blog.4.p2": "将指尖浸泡在温水中，加几滴甲缘油或温和洗手液，浸泡 10–15 分钟。温水软化粘合剂，油脂帮助分解粘合力。你会感觉到穿戴甲随着粘合剂溶解而自然松动。",
  "blog.4.p3": "穿戴甲松动后，用甲皮推或橘木棒从侧面轻轻滑入甲片底部——绝对不要从指尖撬。慢慢轻柔地摇动。如果某片甲还没松，再多泡几分钟，不要硬来。这里的耐心保护的是你的自然指甲。",
  "blog.4.p4": "卸除后，用细磨指甲锉轻轻去除残余粘合剂。大量涂抹甲缘油，按摩到每个指甲和周围皮肤。这样可以恢复水分，保持指甲强韧。你的自然指甲应该看起来完全健康——随时准备好迎接下一套穿戴甲。",

  // 文章 5：如何选择适合的眉形
  "blog.5.title": "如何选择适合你脸型的眉形",
  "blog.5.desc": "找到自然衬托你独特脸型和五官的眉形指南。",
  "blog.5.p1": "完美的眉形不是独立存在的——它完全取决于你的脸。你的骨骼结构、五官间距，甚至自然眉毛的生长方向都会影响。目标是提升，而不是改变。",
  "blog.5.p2": "圆脸适合稍高的眉峰，可以在视觉上拉长脸部，增添立体感和线条感。避免过于圆润的眉毛，那会让脸看起来更圆。带有温柔眉峰的柔和角度效果最好。",
  "blog.5.p3": "椭圆脸的灵活度最高——大多数眉形都很好看。顺着眉骨走势的自然柔和弧度通常最讨喜。避免过度修眉或让眉毛太细，那会打破自然的平衡感。",
  "blog.5.p4": "方脸或棱角分明的脸型，柔和的圆弧眉毛可以平衡强势的下颌线和棱角特征。低弧度温和弯曲的眉毛能柔化整体印象。避免眉毛上的尖锐角度，那会让棱角显得更突兀。",
  "blog.5.p5": "最好的方式始终是专业咨询。每张脸都独一无二，一位优秀的眉毛艺术家会考虑几十个细微之处——从双眼间距到额头高度。在 Shimmy，我们总是先进行完整的脸部测量，然后才开始任何操作。",

  // 文章 6：如何选择穿戴甲尺寸
  "blog.6.title": "如何选择适合的穿戴甲尺寸",
  "blog.6.desc": "简单指南帮你找到完美贴合的穿戴甲尺寸，最大化舒适度和持久度。",
  "blog.6.p1": "合适的穿戴甲应该完全覆盖自然甲床，从一侧甲壁到另一侧，但不碰到两侧皮肤。如果穿戴甲溢出到甲缘或皮肤上，它会过早翘起，而且不舒服。稍小的尺寸总比太大好。",
  "blog.6.p2": "要找到你的尺寸，测量每个自然指甲最宽的部分。可以用软尺，或者将一段透明胶带贴在指甲上标记两侧边缘。每根手指的尺寸可能不同——拇指和中指通常最宽。",
  "blog.6.p3": "试穿穿戴甲时，先不涂胶水，将每片甲片放在自然指甲上对比。检查它是否紧贴甲床，两侧和底部没有缝隙。穿戴甲的甲缘边缘应该自然跟随你的甲缘弧度。",
  "blog.6.p4": "如果你介于两个尺寸之间，选择较小的那个，然后轻轻锉磨两侧使其与你的指甲宽度一致。这样可以获得无缝的定制般贴合。合适的穿戴甲佩戴舒适、持久牢固，效果与专业沙龙无异。",

  // 文章 7：唇釉
  "blog.7.title": "新加坡唇釉：体验流程与持久时长",
  "blog.7.desc": "从选色到愈合——一次完整的唇釉预约会经历什么，效果到底能维持多久。",
  "blog.7.p1": "唇釉是一种半永久美容项目，将柔和的色素植入唇部，均匀肤色、勾勒唇形、增添一层若有似无的色泽。可以把它想象成一支持续 2–3 年、长在你唇上的染唇液。质感柔和哑光——和老式纹唇那种深色描边完全不是一回事。大多数客人离开时，看起来就像涂了一层永远不用补的薄透唇彩。",
  "blog.7.p2": "预约从选色开始。我们会根据你的天然唇色、底调和想要的效果，给你看 4–6 个色号——可能是接近原唇的裸色、柔和的玫瑰，或更深的莓果调。色素愈合后会比第一天浅约 40%，所以我们以愈合后的颜色为目标来挑色。这一步绝不催促——你会先在自己肤色上看试色，然后才进行后续操作。",
  "blog.7.p3": "麻醉分两次进行：勾勒轮廓前先做一次预麻，唇部打开后再做一次更强力的麻醉。敏感度因人而异——嘴唇的神经末梢比眉毛多，有些客人形容像震动伴随轻微刺痛。完全可以承受，需要休息时我们随时暂停。整个过程约 2 到 2.5 小时，包括咨询、麻醉和实际操作。",
  "blog.7.p4": "第一周变化最戏剧化。第 1–3 天，唇色饱和略带浮肿——像刚吃完甜菜根。第 4–7 天，会以柔软的薄片脱皮（别抠），看起来颜色全消失了。这是正常的。这个褪色幻象期会吓到每一个人。然后大约第 10–14 天，真正的颜色从底层慢慢浮现。6–8 周后的补色会锁定最终色调。",
  "blog.7.p5": "在新加坡的气候下，唇釉一般能维持 2 到 3 年，但频繁的阳光暴晒和去角质护理会缩短持久度。吸烟者，以及在嘴唇周围使用 A 醇、果酸等强效成分的客人，褪色会更快。每年做一次补色就能保持颜色鲜润——比第一次完整操作时间更短、价格也更低。",
  "blog.7.p6": "术后护理简单但要严格遵守。前 24 小时保持嘴唇干燥，接下来 10 天频繁涂润唇膏——干燥是导致愈合不均的最大元凶。第一周避免辛辣食物、热饮、和嘴唇直接接触的东西（是的，包括接吻和油腻食物）。之后涂唇部防晒就成了日常习惯。如果你在考虑预约，WhatsApp 联系我们 +65 8930 8973——预约前我们会先帮你过一遍选色。",

  // 文章 8：首次绣眉预约
  "blog.8.title": "你的第一次绣眉预约会经历什么",
  "blog.8.desc": "首次绣眉的全流程介绍——需要带什么、我们做什么、整个过程要多久。",
  "blog.8.p1": "第一次预约绣眉确实是一步大跨越。你要把接下来一两年的脸交给一个人。好消息是：实际预约远没有 Instagram 上看起来那么神秘。大部分时间都在聊天、画稿、等麻醉膏起效。真正上色素的环节反而最短。",
  "blog.8.p2": "如果可以的话素颜来，或者眉毛区域只画淡妆。如果心里有想要的形状，可以带参考图——没有也没关系。我们会先做脸部测量：五官对称度、眉骨位置、双眼间距。眉形就是在这一步确定的，和潮流无关。你的脸决定什么形状适合你。",
  "blog.8.p3": "接下来是铅笔画稿。我们用可擦的眉笔在你皮肤上勾出建议的眉形，然后给你一面镜子。这是你的时刻——有想法就说。希望眉头再粗一点？眉峰更柔和？眉尾更明确？我们会一直改到你 100% 满意。在你点头之前，一切都还可以擦掉。这一步本身可能就要 20 到 30 分钟。",
  "blog.8.p4": "设计敲定后，敷麻醉膏约 15 分钟。你可以刷手机、喝水，或者闭眼休息。然后正式开始绣眉——微刀的线条，或纳米针的色素铺陈。大多数客人形容感觉像轻微的刮擦。整个过程我们会不断和你确认，你随时想休息我们就停。",
  "blog.8.p5": "完成第一遍后，我们再上一层色素，擦拭干净，给你镜子看效果。颜色看起来会很饱和——比最终愈合的颜色深 30 到 40%。这是正常的、预期内的现象。我们会解释你看到的一切，并带你走一遍接下来 6 周眉毛愈合、稳定的变化过程。",
  "blog.8.p6": "你会带着一套护理产品、印刷指南，以及一个 6–8 周后的复诊预约离开——那次补色我们会修整愈合不均的地方。第一次预约请预留 2.5 到 3 小时。当天后续安排得清静些——不要去健身房、不要游泳、不要大量出汗。预约前有任何问题，欢迎 WhatsApp 联系 +65 8930 8973。",

  // 文章 9：孕期绣眉
  "blog.9.title": "孕期可以绣眉吗？你需要知道的事",
  "blog.9.desc": "怀孕或哺乳期能不能做绣眉——以及在那之前我们推荐的更安全替代方案。",
  "blog.9.p1": "这个问题我们经常被问到，尤其是孕中期精力恢复、婚礼或宝宝派对一个接一个的时候。直白地说：我们不为怀孕或哺乳期的客人做绣眉。原因不是色素本身有危险——而是操作中其他环节在孕期会变得更难预测。",
  "blog.9.p2": "主要有三个原因。第一，我们使用的麻醉膏含利多卡因等局部麻醉剂，孕期使用的研究还不够充分，我们不敢用。第二，孕期激素变化会影响皮肤吸收和留色——颜色可能愈合不均、斑驳，或比预期深很多。第三，感染风险无论多小，对孕妇来说后果都更严重。",
  "blog.9.p3": "愈合也变得难以预测。孕期血流增加，皮肤敏感度变化很大。有些客人愈合得很漂亮；有些会出现留色斑驳，需要多次修补。而且孕晚期没法平躺时，2.5 小时的预约本身就很难受，我们宁愿你享受这个过程而不是硬扛。",
  "blog.9.p4": "如果有重要场合临近，有更安全的选择。眉毛修形、线面、染眉都可以在孕期进行——它们都不破皮、也不用麻醉。一次好的染眉加干净的修形，足以让你在照片里美美的。眉毛拉直也通常被认为是安全的，但如果你的孕期比较敏感，建议先咨询医生。",
  "blog.9.p5": "大多数客人会在产后 3 到 6 个月、或者结束哺乳后再来做绣眉。那时激素已经平稳，皮肤回到日常基线，你也能真正享受这次预约。我们很乐意为你保留一个未来的预约名额——WhatsApp 联系 +65 8930 8973，等你准备好了我们就帮你排进去。",

  // 文章 10：穿戴甲 vs 光疗甲
  "blog.10.title": "穿戴甲 vs 光疗甲：哪个更适合你？",
  "blog.10.desc": "价格、时间、持久度、指甲健康——直白比较穿戴甲什么时候赢，什么时候光疗更适合你。",
  "blog.10.p1": "穿戴甲和光疗甲的对比，其实不是哪个更好的问题——它们解决的是不同问题。光疗是沙龙时间投入：你预约 90 分钟的位子，坐着让人涂、烤、固，再回来卸甲。穿戴甲是为那种想随时拥有美甲、又不愿意星期六被钉在椅子上的女生设计的。两者都可以很美。选哪个取决于你实际的生活方式。",
  "blog.10.p2": "时间上：光疗在沙龙要 60 到 120 分钟，再加来回路程。一套手工穿戴甲在家 5 到 10 分钟就能戴好——前提是你已经知道自己的尺寸。如果你的一周排满了会议加宝宝的午睡时间，这个差距很关键。穿戴甲还可以随时换设计——周一开会甲，周六婚礼甲——完全不用化学卸甲。",
  "blog.10.p3": "指甲健康上：光疗最伤指甲的环节是卸甲。丙酮泡、打磨、还有不可避免的剥落，都会让自然甲变薄。长期反复做光疗不休息，指甲会越来越脆弱。穿戴甲完全省掉丙酮浸泡——温水加油 10 分钟就能取下。你的自然甲在两套之间可以好好休息。",
  "blog.10.p4": "持久度上：一次好的光疗能撑 2 到 3 周才翘起。手工穿戴甲在正确佩戴下能撑 1 到 2 周，小心使用可以更久。光疗在纯耐用度上胜出——但你没法中途换设计。穿戴甲让你轮换不同款式，活动前不会被一片崩了的指甲卡住。",
  "blog.10.p5": "设计自由度上：这是穿戴甲在新加坡明显占优的地方。沙龙的光疗设计受限于美甲师在一次预约内能徒手画或贴的内容。穿戴甲可以提前手绘精致的细节——3D 饰品、渐变喷绘、迷你法式——这些在现场预约里几乎做不到。像我们 Lovers Heartbeat 或 Ingénue 系列，每一套都凝聚了艺术家数小时的工时。",
  "blog.10.p6": "价格上：新加坡一次高质量的光疗大约 50 到 90 新币。一套手工的 Nails by Shimmyhands 价位差不多，但是是你永久保存的——很多客人会反复戴两三次。如果你曾在 3 周光疗周期里第二周就被崩了的设计困住过，穿戴甲值得一试。需要帮你选第一套？WhatsApp 联系 +65 8930 8973。",

  // 文章 11：让穿戴甲更持久
  "blog.11.title": "如何让穿戴甲戴得更久（专业小贴士）",
  "blog.11.desc": "几个能让穿戴甲佩戴时间翻倍的小习惯——从准备工作到日常细节，再到睡前护理。",
  "blog.11.p1": "如果你的穿戴甲总是三天就掉，问题几乎都出在准备工作——而不是穿戴甲本身。粘合剂要对抗的是天然油脂、水分，以及你的指甲弧度。把这三件事做对，一套佩戴得当的穿戴甲轻松能撑 10 到 14 天。下面是真正起作用的几点，基于我们看到客人最常做错的地方。",
  "blog.11.p2": "佩戴前至少一小时不要涂护手霜、甲油、或任何手部保养品。哪怕是肉眼看不见的残留也会阻碍胶水粘合。用普通肥皂（不要润肤型）洗手，然后用酒精棉片或 90% 以上的异丙醇擦拭每个指甲。指甲表面应该是略微干燥、哑光的——不是亮的。这一步是决定佩戴时长最关键的因素。",
  "blog.11.p3": "推回甲缘皮，轻轻打磨指甲表面。你磨掉的那层光泽，正是胶水抓不住的光滑层。用 240 目的指甲锉轻刷几下就够了——不是要把指甲磨薄，只是让表面变哑光。打磨后再用酒精擦一遍清除粉尘，然后迅速进入佩戴步骤，免得指甲又重新分泌油脂。",
  "blog.11.p4": "想要最长佩戴时间，用指甲胶，不要用粘贴片。在自然指甲和穿戴甲背面都薄薄涂一层胶。先把穿戴甲对准甲缘线放下，然后向指尖按压同时挤压两侧。每片用力按住 20 秒。最常见的错误就是赶时间——按压不够的结果就是粘合弱、早早翘起。",
  "blog.11.p5": "日常习惯比想象中更重要。洗碗、清洁、洗头时戴手套——热的肥皂水溶解胶水比几乎任何东西都快。不要把指甲当工具开罐头、刮标签、撬贴纸。一发现边缘有点翘就立刻补一小滴胶水，不要等整片掉了才处理。养成这些习惯，新加坡的湿气下戴满 2 周都很现实。",

  // 文章 12：适合新加坡气候的美甲设计
  "blog.12.title": "适合新加坡气候的美甲设计（以及如何护理）",
  "blog.12.desc": "湿气、暴晒、海水——新加坡对指甲极不友好。哪些设计最耐造，以及保护它们的小习惯。",
  "blog.12.p1": "新加坡的天气对指甲的摧残程度，大多数美甲内容都避而不谈。常年的湿气会软化粘合剂。冷气和户外的温差让甲床不断热胀冷缩。防晒霜、沙子、泳池氯水都在慢慢磨损甲面。能在这里挺住的设计不只是好看——它们是为这种气候量身打造的。下面是我们的推荐，以及对应的护理方式。",
  "blog.12.p2": "纯色和极简设计是湿热天气里的主力。一抹干净的裸色、一抹亮泽的红、一抹温和的奶白，磨损起来远不如复杂图案显眼——就算指尖崩了一小角，也更容易遮掩。我们的 Ingénue 系列就走这条线：干净的线条、中性的色调、连去巴厘岛玩到第三天也依然精致的质感。",
  "blog.12.p3": "想要质感或细节，请选择艺术部分封在多层亮油下、而不是浮在表面的设计。手绘花、微珍珠、3D 饰品，只要封层做得好，都能在湿气里表现出色——这也是手工穿戴甲比沙龙赶工美甲耐用的原因。像我们的 Lovers Heartbeat 系列，就是专门多加了几层亮油来对抗潮湿。",
  "blog.12.p4": "雨季少选金属箔铬色和散粉亮片，除非你只待在室内。铬色在湿气下氧化更快，几天内就会变暗。没有厚封层的散粉亮片容易勾到头发和衣服，连带把封层都掀起来。如果你喜欢闪亮感，选那种粉碎被嵌进固化层里的成品。",
  "blog.12.p5": "日常护理才是真正的差别所在。每 3 到 4 天补一层透明亮油——只要 30 秒，就能修复湿气慢慢破坏的封层。去海边或泳池请戴手套。护手霜和甲缘油晚上用，不要白天用，可以保持甲床柔韧的同时不影响甲面。需要帮你挑一套适合你这周的设计？WhatsApp 联系我们 +65 8930 8973。",

  // ─── 文章 13：雾眉 vs 微刺绣褪色对比 ───
  "blog.13.title": "雾眉 vs 微刺绣：哪个褪色更好看？",
  "blog.13.desc": "两种热门技术，两种截然不同的褪色轨迹。12 个月后，雾眉和微刺绣的对比一目了然。",
  "blog.13.p1": "如果你研究过半永久眉毛，一定看到过雾眉（ombre powder brows）和微刺绣（microblading）两种推荐。刚做完时它们看起来很不一样——微刺绣模拟单根毛发，而雾眉呈现柔和的粉雾渐变。但真正的差异要几个月后才显现，当它们开始褪色的时候。了解每种技术如何老化，是避免后悔最好的办法，尤其在新加坡的潮湿气候下，皮肤的表现跟凉爽国家完全不同。",
  "blog.13.p2": "微刺绣是逐笔褪色。每一道切口留住色素，随着皮肤新陈代谢，线条会逐渐模糊和扩散。干性皮肤上这可以在 8 到 12 个月内保持柔和好看的状态。但在油性皮肤上——新加坡的湿度会让大多数人皮肤偏油——那些线条可能在六个月内就糊成灰灰的一片。这不是技术的缺陷，而是物理规律：油性皮肤分泌更多皮脂，会把浅层切口中的色素更快地推出来。",
  "blog.13.p3": "雾眉褪色更均匀，因为色素是以成千上万个微小点阵而非切线的方式沉积的。颜色变淡时，整体像水彩一样柔和褪去——变浅变柔但不失形状。12 个月后，大多数雾眉客人仍能看到眉形位置有一层温和的色调，而不是零星残留。这就是为什么在热带气候下，想要优雅褪色的客人越来越多选择雾眉。",
  "blog.13.p4": "持久度也不同。微刺绣通常在 6 到 12 个月后就需要补色，部分原因是浅层切口让色素更靠近皮肤表面。雾眉使用机器将色素沉积得稍深且更均匀，所以通常能维持 12 到 18 个月。有些干性皮肤的客人反映两年后雾眉仍有颜色，但那属于例外而非常态。",
  "blog.13.p5": "色素偏移是另一个很少提前讨论的因素。微刺绣色素——尤其是比较便宜的配方——在皮肤内分解时可能偏橘或偏蓝灰。雾眉色素也不能完全免疫，但因为沉积更密更均匀，色移往往更细微、更可预测。好的从业者会选择专门调配为偏暖或偏中性褪色的色素，但技术本身也影响着分解的均匀程度。",
  "blog.13.p6": "那到底哪个褪得更好？对于新加坡大多数人——尤其是偏油性或混合性肤质——雾眉在持久度、褪色质量和颜色一致性上都更胜一筹。如果你确实是干性皮肤、毛发颜色浅、想要最接近毛发的仿真效果，微刺绣仍然是不错的选择。诚实的答案是：两者没有绝对的好坏，取决于你的皮肤。WhatsApp 联系我们 +65 8930 8973，我们可以聊聊适合你的方案。",

  // ─── 文章 14：选择刺绣、纳米还是雾眉 ───
  "blog.14.title": "刺绣、纳米、雾眉：怎么选适合自己的？",
  "blog.14.desc": "三种技术，一张脸。根据肤质、生活方式和你真正想要的效果，做出最实际的选择。",
  "blog.14.p1": "走进新加坡任何一家眉毛工作室，你都会听到三个术语：眉毛刺绣（embroidery）、纳米眉（nano brows）和雾眉（ombre powder brows）。它们都属于半永久范畴，都是将色素植入皮肤，都承诺你不用每天早上画眉。但它们不是同一种技术，选错了适合你肤质或生活方式的那一种，可能意味着令人失望的结果。这里是一份清晰、没有行话的对比，帮你做决定。",
  "blog.14.p2": "眉毛刺绣——有时也叫微刺绣——使用手持刀片创造仿真毛发线条。如果你是干性到中性皮肤，且想要最逼真的单根毛发效果，它最理想。线条落在浅层切口中，做得好的话看起来精致而羽毛般轻盈。代价是耐久性：刺绣通常比机器技术褪色更快，一般维持 12 到 18 个月，在油性皮肤上因为皮脂更快推出色素，表现也不如机器方法。",
  "blog.14.p3": "纳米眉使用数码仪器配合超细单针来创造线条，效果跟刺绣类似，但精度和一致性更高。由于机器控制了深度和速度，色素在皮肤中分布更均匀。这使纳米眉成为油性或混合性肤质——那些手工刀片线条留不住的皮肤——的有力选择。愈合时对皮肤的损伤也更小，结痂更少，恢复更顺畅。预计维持 18 到 24 个月。",
  "blog.14.p4": "雾眉完全跳过了毛发线条的概念，给你一个柔和的填充渐变——尾部深、前端浅。可以理解为你每天画的粉雾眉妆的永久版。这种技术适合几乎所有肤质，包括油性和敏感性，因为像素化的点阵沉积能很好地锁住色素，且褪色均匀。如果你平时每天早上用眉粉或眉笔填眉，雾眉能免去这个步骤。平均维持 12 到 18 个月。",
  "blog.14.p5": "生活方式也很重要。如果你经常游泳、健身出汗多、或整天出入冷气房，你需要一种对湿气耐受力强的技术——那就是雾眉或纳米眉。如果你日常妆容很淡，偏好最细微、几乎看不出来的效果，刺绣或纳米线条会感觉更自然。如果你只是厌倦了每天早上花 15 分钟画眉再出门上班，雾眉是最快速的'醒来就准备好'路线。",
  "blog.14.p6": "还是拿不定主意？真的没关系——这正是咨询环节存在的意义。我们会在好的灯光下观察你的皮肤，聊聊你的日常习惯，然后根据什么真正能持久、在你脸上真正好看来推荐技术。没有推销话术，只有一场坦诚的对话。WhatsApp 联系我们 +65 8930 8973 预约时间。",

  // ─── 文章 15：眉毛刺绣补色 ───
  "blog.15.title": "眉毛刺绣补色：什么时候、为什么、怎么回事",
  "blog.15.desc": "6-8 周的复诊不是可有可无的——它才是锁定效果的关键。这里是你需要知道的一切。",
  "blog.15.p1": "你做完了眉毛刺绣，熬过了愈合期，开始看到真正的颜色沉淀。然后你的操作师告诉你 6 到 8 周后回来补色。跳过它的念头很诱人，尤其如果你的眉毛已经看起来不错的话。但这次复诊不是在赚你的钱——它是整个流程中至关重要的一环。没有它，你的眉毛基本上只停留在潜力的 70%。以下是补色时真正会发生什么，以及它为什么如此重要。",
  "blog.15.p2": "第一次操作时，你的皮肤是第一次接触色素。你的免疫系统把色素当作异物，在愈合过程中把一部分排出体外。排出多少取决于你的肤质、术后护理、出汗量，甚至身体代谢。几乎没有人能在第一次就 100% 留住色素。有些区域会愈合偏浅，有些线条褪得比其他的多，整体密度会比第一天看到的低。",
  "blog.15.p3": "补色就是为了纠正这一切。我们评估哪些区域掉了色素、哪些线条需要加强、以及形状在愈合沉淀到皮肤后是否需要微调。颜色也可以调整——如果第一轮愈合后偏暖或偏冷，我们可以校准色素色号，使其更接近你的理想色调。把第一次想象成打底，补色就是面漆。",
  "blog.15.p4": "时间点很关键。太早回来——比如 3 或 4 周——皮肤还没完全愈合，色素还没沉淀到真正的深度。太晚回来——超过 10 或 12 周——色素已经开始自然褪色周期，补色需要付出更多努力。6 到 8 周的窗口期是皮肤完全愈合、颜色稳定、色素最容易接受第二层的时候。这个窗口不大，所以尽量提前预约。",
  "blog.15.p5": "补色本身通常更短——包括麻醉在内大约 60 到 90 分钟。由于皮肤已经经历过一次，大多数客人觉得第二轮没那么紧张。愈合通常也更快更轻松，因为皮肤知道该怎么应对了。脱皮往往更轻微，颜色沉淀更可预测。经过这第二遍，你的眉毛形状和密度应该能维持到该技术的完整寿命。",
  "blog.15.p6": "最后一点：在大多数正规工作室，补色费已经包含在首次价格里，我们也是如此。它被算进治疗预算是因为它不是附加服务——它是流程的一部分。如果一家工作室对必要的复诊收全价，这值得打个问号。想预约首次操作并且知道补色已经包含？WhatsApp 联系我们 +65 8930 8973。",

  // ─── 文章 16：半永久眉上能化妆吗 ───
  "blog.16.title": "半永久眉毛上还能化妆吗？",
  "blog.16.desc": "简短回答：能。但时机和产品有讲究，尤其是愈合期。这里是安全做法和正确时间线。",
  "blog.16.p1": "做完眉毛刺绣、纳米眉或雾眉后，大家问得最多的一个问题就是：还能不能在上面用眉笔或眉粉？简短回答是可以——愈合之后，你完全可以在半永久眉毛上叠加化妆品。有些人天天这么做，有些只在特殊场合。但在愈合阶段，规则不一样，做错了真的会影响色素留存和愈合效果。",
  "blog.16.p2": "操作后的头 7 到 10 天，所有化妆品都不要碰眉毛区域。这意味着不用眉笔、不用眉粉、不在边缘涂遮瑕、不让粉底碰到眉毛。这段时间皮肤是微创伤口，化妆品——即使标注'clean'或'天然'的——都含有粘合剂、油脂和防腐剂，可能干扰色素留存或引入细菌。为了一周稍微素净一点的眉毛冒这个险，不值得。",
  "blog.16.p3": "第 10 到 28 天之间，你可以恢复底妆，但仍然避免直接接触眉毛区域。粉底可以涂在眉毛周围，不要涂在上面。如果需要在这个阶段遮盖发红或不均匀，用干净刷子轻轻扫一层定妆粉是最安全的选择。避免在眉毛上使用膏状或液体产品，至少等到满四周。到那时表面已经封口，深层也在顺利稳定中。",
  "blog.16.p4": "四周过后完全愈合了，想用什么眉毛产品都行。眉笔、眉粉、眉胶、眉膏——它们都会坐在半永久色素上面而不会影响它。很多客人发现需要的产品比以前少得多；快速刷一层透明眉胶定型就够了。也有人喜欢晚妆时在眉尾加一笔深色眉笔。半永久底色意味着你是在增强，不是从零开始画。",
  "blog.16.p5": "卸妆是唯一需要注意的。长期避免在眉毛区域使用含油卸妆产品，因为油分会加速色素褪色。卸妆水或温和的水基洁面乳效果很好。如果你在脸上其他部位用卸妆膏，擦到眉毛时绕过去而不是直接揉。这些小习惯不会一夜之间决定效果，但几个月累积下来，可以让你的眉毛多维持几周。有关术后护理或产品的问题？WhatsApp 联系我们 +65 8930 8973。",

  // ─── 文章 17：新加坡男性眉毛刺绣 ───
  "blog.17.title": "新加坡男士眉毛刺绣：你需要知道的",
  "blog.17.desc": "越来越多男性在做眉毛——不，看起来不会很'假'。这里是方法上的不同和真实的期望值。",
  "blog.17.p1": "眉毛刺绣不是女生的专利，在新加坡预约做眉毛的男性数量一直在稳步上升。眉毛变稀、旧伤疤导致的断裂、多年过度修眉是最常见的原因——但也有些男生只是想让自己的脸看起来更精神，又不想让人看出来为什么。男性的目标几乎总是一样的：让它看起来什么都没做。这需要跟女性客人完全不同的操作思路，而不是每家工作室都会做出调整。",
  "blog.17.p2": "最大的区别在于形状理念。女性眉毛通常有清晰的弓形、渐细的尾部和刻意的塑造。男性眉毛应该沿着自然眉骨走，做最小程度的改造。我们是在填充，不是在重新设计。弓度保持低位，跟随骨骼结构的自然走势。眉头保持稍微有纹理、不完美的状态，而不是整齐划一——因为真实的男性眉毛本来就不对称，做得太整齐反而是男性眉毛做完后看起来假的最大原因。",
  "blog.17.p3": "线条方向和间距对男性客人更为关键。线条需要稍粗一些、间距更大一些，以模拟男性天然更粗糙、更稀疏的眉毛生长模式。排列太紧密会产生填充妆感——恰恰是大多数男性想要避免的。我们还会把线条角度匹配你现有的毛发生长方向，这样新线条能跟你保留的天然眉毛无缝融合。",
  "blog.17.p4": "选色也是男性方案的不同之处。女性有时会选比天然颜色稍深的色号来增加立体感。对男性，我们几乎总是选浅半度或完全匹配的颜色。原因很简单：男性很少化其他底妆，没有粉底或遮瑕来柔化反差。即使只深一点点的眉色，在裸露的皮肤上也会显得像画上去的。选浅一些，让线条融入一种阴影感，读起来是充盈而不是产品。",
  "blog.17.p5": "操作过程本身是一样的——咨询、设计、麻醉、操作、揭晓、术后说明。大多数男性客人对麻醉生效后的轻微感觉感到意外——远没有想象中那么痛。愈合时间线也一样：第一天比预期深、第一周有些脱皮、第四周显现真正颜色。唯一的实际区别是男性眉骨处的皮肤往往更油，所以我们有时会推荐纳米眉而非手工刺绣，以获得更好的长期留色效果。",
  "blog.17.p6": "如果你一直在犹豫，但走进眉毛工作室觉得不自在——别担心。我们每周的预约中有不少是男性客人，这已经是常态了。候诊区没有人会多看你一眼。重点就是你走出来看起来是一个稍微更好的自己，而没人需要知道为什么。想聊聊？WhatsApp 联系我们 +65 8930 8973——没有尴尬，我们保证。",

  // ─── 文章 18：肤质如何影响眉毛效果 ───
  "blog.18.title": "肤质如何影响你的眉毛刺绣效果",
  "blog.18.desc": "油性、干性还是混合性——你的肤质决定了眉毛如何愈合、留色和老化。每种类型的具体预期。",
  "blog.18.p1": "你的肤质可能是眉毛刺绣效果最大的决定因素——比所用技术重要、比色素品牌重要，是的，也比操作者的手艺重要（虽然手艺当然也很关键）。两个客人坐在同一把椅子上，接受完全一样的操作、用完全一样的色素，四周后走出来的效果可能明显不同。差异几乎总是因为皮肤。了解你的皮肤会如何表现，能帮你设定合理期望并选择正确的方案。",
  "blog.18.p2": "油性皮肤是眉毛操作最具挑战性的画布，而新加坡的湿度让我们大多数人比在凉爽气候中更偏油。过多的皮脂分泌在愈合期间更快地把色素推出皮肤，并且持续分解色素。手工刀片做的线条——传统刺绣或微刺绣——在油性皮肤上容易模糊和扩散，有时几个月内就失去清晰度。如果你的 T 区到中午不用任何产品就开始泛油，你很可能属于这一类。",
  "blog.18.p3": "对于油性皮肤，雾眉或纳米眉通常是更好的选择。机器做的像素化沉积比刀片切口更牢固地停留在皮肤中，整体密度意味着即使部分色素被排出，仍有足够多的留下来维持形状和颜色。雾眉效果尤其好，因为它不依赖单根线条的清晰度——它是一个渐变，愈合时的轻微模糊实际上增强了柔和感，而不是毁掉效果。",
  "blog.18.p4": "干性皮肤是梦想画布。它像海绵一样留住色素，愈合时扩散极少，线条清晰度能长期保持。如果你是干性皮肤，几乎所有技术——刺绣、纳米、雾眉——都能表现出色。毛发线条类方法在干性皮肤上最好看，因为线条能保持数月不模糊。愈合往往脱皮更轻、不均匀感更少。唯一的注意点：非常干的皮肤有时会愈合出比预期更浓的颜色，因为色素没有被油脂在沉淀过程中稀释。",
  "blog.18.p5": "混合性皮肤——T 区偏油、两颊中性或偏干——是我们最常见的类型，也是需要最细致处理的。你的眉毛区域可能刚好在油性和中性区域的交界，或者一边眉毛比另一边更油（这比你想象的常见得多）。我们经常在同一次操作中调整技术：在更油的区域稍微深入一些，在更干的区域按标准深度。这种微调就是为什么咨询如此重要——一刀切的方法对混合性皮肤行不通。",
  "blog.18.p6": "不论什么肤质，有些规律是通用的。好的术后护理对每种肤质都能改善效果。保持区域干燥、避免使用产品、忍住愈合期抠挠的冲动——这些都能帮助色素正确沉淀。6 到 8 周的补色是我们纠正皮肤自行发挥的环节。而在咨询时坦诚你的肤质——即使你觉得油性皮肤不够理想——能帮我们从一开始就选对技术。想知道什么适合你的皮肤？WhatsApp 联系我们 +65 8930 8973，我们一起搞定。",

  // ─── 404 未找到 ───
  "notfound.title": "页面未找到",
  "notfound.desc": "你要找的页面不存在。",
  "notfound.brows": "眉毛",
  "notfound.nails": "美甲",
  "notfound.shop": "商店",
  "notfound.contact": "联系我们",

  // ─── Launch ───
  "launch.tag": "即将推出",
  "launch.title": "新系列即将到来",
  "launch.desc": "抢先了解。加入等候名单享受独家提前购买权。",
  "launch.days": "天",
  "launch.hours": "小时",
  "launch.minutes": "分",
  "launch.seconds": "秒",
  "launch.notify": "发布时通知我",
  "launch.gallery": "抢先预览",
  "launch.wa": "通过 WhatsApp 获取提前购买权",

  // ─── 手机导航分组 ───
  "nav.mobile.info": "信息",
  "nav.mobile.blog": "博客",

  // ─── 服务对比表 ───
  "compare.title": "服务",
  "compare.duration": "时长",
  "compare.longevity": "持久度",
  "compare.skintype": "肤质",
  "compare.price": "价格",
  "compare.longevity.embroidery": "12–18 个月",
  "compare.longevity.microblading": "6–12 个月",
  "compare.longevity.nano": "18–24 个月",
  "compare.longevity.ombre": "12–18 个月",
  "compare.longevity.shaping": "4–6 周",
  "compare.longevity.lip": "24–36 个月",
  "compare.skin.normaldry": "中性至干性",
  "compare.skin.all": "所有肤质",
  "compare.heading": "服务对比",

  // ─── Brow Try-On ───
  "tryon.tag": "眉毛试戴",
  "tryon.title": "预览你的新眉毛",
  "tryon.desc":
    "上传照片，选择风格，立刻看到不同眉形戴在你脸上的效果。所有处理都在你的设备上完成——照片绝不会离开你的手机。",
  "tryon.upload.title": "上传你的照片",
  "tryon.upload.desc": "清晰的正面照效果最好。",
  "tryon.upload.choose": "选择文件",
  "tryon.upload.camera": "使用相机",
  "tryon.upload.privacy": "你的照片只留在你的设备上，不会上传到任何地方。",
  "tryon.upload.drop": "将照片拖到这里",
  "tryon.upload.invalid": "这看起来不是一张图片——请重试。",
  "tryon.loading.model": "正在准备眉毛识别...",
  "tryon.detecting": "正在识别眉毛...",
  "tryon.noface": "未能检测到人脸，请尝试更清晰的正面照。",
  "tryon.error.model": "无法加载眉毛识别工具，请检查网络后重试。",
  "tryon.tip": "提示：使用光线良好的正面照片效果最佳。",
  "tryon.styles.title": "选择风格",
  "tryon.control.thickness": "粗细",
  "tryon.control.intensity": "颜色深浅",
  "tryon.control.arch": "眉峰位置",
  "tryon.compare": "按住对比",
  "tryon.download": "下载",
  "tryon.share": "通过 WhatsApp 分享",
  "tryon.retry": "试另一张照片",
  "tryon.cta.title": "喜欢这个效果吗？",
  "tryon.cta.desc": "预约咨询，让我们把这个样子变为现实。",
  "tryon.cta.book": "预约咨询",
  "tryon.discover.title": "先试戴，再预约",
  "tryon.discover.desc":
    "上传一张照片，看看每种眉形戴在你脸上的样子——快速、私密、免费。",
  "tryon.discover.cta": "试戴眉形 →",
  "tryon.style.nano-soft": "纳米眉 — 自然柔和",
  "tryon.style.nano-defined": "纳米眉 — 立体清晰",
  "tryon.style.microblading-feathered": "微刀雕 — 羽毛感",
  "tryon.style.ombre-light": "雾眉 — 浅色",
  "tryon.style.ombre-bold": "雾眉 — 浓重",
  "tryon.style.embroidery-classic": "绣眉 — 经典",
  "tryon.style.nano-soft.desc":
    "适合稀疏眉或第一次做的人——像自己长出来的一样自然。",
  "tryon.style.nano-defined.desc": "线条清晰立体，远远就能看出来。",
  "tryon.style.microblading-feathered.desc":
    "毛流感细节，最适合中性到干性肌肤。",
  "tryon.style.ombre-light.desc": "柔和的眉粉感效果，日常戴起来轻松，不用打理。",
  "tryon.style.ombre-bold.desc": "立体雾感眉——像每天都精心化好妆。",
  "tryon.style.embroidery-classic.desc": "我们的招牌——线条与雾感之间的平衡。",
  "tryon.share.message":
    "你好 Shimmy！我用了眉毛试戴工具，很喜欢 {style} 这个风格——可以预约咨询吗？",
  "tryon.compare.toggle": "对比",
  "tryon.compare.on": "开",
  "tryon.compare.off": "关",
  "tryon.compare.hint": "左右拖动滑块，与原图对比。",
  "tryon.control.independent": "分别调整左右眉",
  "tryon.control.arch.left": "左眉",
  "tryon.control.arch.right": "右眉",
  "tryon.help.title": "如何使用",
  "tryon.help.step1": "上传一张清晰的正面照",
  "tryon.help.step2": "挑一个你喜欢的眉形",
  "tryon.help.step3": "微调到你满意为止，然后保存或分享",
  "tryon.help.dismiss": "明白了",

  // ─── 价格和持久度 ───
  "tryon.price.from": "起价",
  "tryon.longevity.label": "持久",
  "tryon.longevity.nano": "12–18 个月",
  "tryon.longevity.microblading": "12–18 个月",
  "tryon.longevity.ombre": "2–3 年",
  "tryon.longevity.embroidery": "1–2 年",
  "tryon.popular.badge": "最受欢迎",
  "tryon.tried.this.month": "人本月试戴",

  // ─── 眉色选择 ───
  "tryon.color.title": "眉色",
  "tryon.color.auburn": "赤褐色",
  "tryon.color.soft-brown": "柔棕色",
  "tryon.color.rich-brown": "深棕色",
  "tryon.color.espresso": "浓棕色",
  "tryon.color.black-brown": "黑棕色",

  // ─── 即时拍照 ───
  "tryon.camera.start": "立即拍照",
  "tryon.camera.title": "调整你的位置",
  "tryon.camera.guide": "把脸保持在圆圈内，直视前方。",
  "tryon.camera.capture": "拍照",
  "tryon.camera.retake": "重拍",
  "tryon.camera.cancel": "取消",
  "tryon.camera.countdown": "准备好...",
  "tryon.camera.error":
    "无法访问相机，请检查浏览器权限。",

  // ─── 两个风格对比 ───
  "tryon.ab.toggle": "对比两种风格",
  "tryon.ab.left": "左",
  "tryon.ab.right": "右",
  "tryon.ab.pick": "为每边挑一个风格",
  "tryon.ab.exit": "退出对比",
  "tryon.ab.winner": "我更喜欢这个",

  // ─── 品牌分享卡 ───
  "tryon.card.brand": "Brows by Shimmyhands",
  "tryon.card.tagline": "试戴自 shimmyhands.com",
  "tryon.card.download": "下载故事卡",
  "tryon.card.code": "提及试戴可享 S$50 折扣",

  // ─── 保存你的样子 ───
  "tryon.save.title": "保存你的样子",
  "tryon.save.desc":
    "等你准备好预约时，我们会发提醒——保证不发垃圾消息。",
  "tryon.save.name": "姓名",
  "tryon.save.phone": "电话（WhatsApp）",
  "tryon.save.email": "邮箱（可选）",
  "tryon.save.submit": "保存并获取提醒",
  "tryon.save.success":
    "保存成功！我们记下你喜欢的风格了——回头联系。",
  "tryon.save.error": "暂时无法保存，请再试一次。",
  "tryon.save.cancel": "暂不",

  // ─── 预约这个样子 ───
  "tryon.book.this.look": "预约这个样子",
  "tryon.book.note.prefix": "试戴中选定：",

  // ─── 面型小测试 ───
  "tryon.quiz.open": "不确定哪个风格？做个 30 秒测试 →",
  "tryon.quiz.title": "找到最适合你的眉形",
  "tryon.quiz.subtitle": "三个快速问题——我们会推荐最显瘦你的风格。",
  "tryon.quiz.next": "下一题",
  "tryon.quiz.back": "返回",
  "tryon.quiz.skip": "跳过测试",
  "tryon.quiz.q1": "对着镜子看，你的脸感觉…",
  "tryon.quiz.q1.a": "较短／较圆",
  "tryon.quiz.q1.b": "匀称／椭圆",
  "tryon.quiz.q1.c": "较长／窄",
  "tryon.quiz.q2": "你的下巴线条…",
  "tryon.quiz.q2.a": "柔和圆润",
  "tryon.quiz.q2.b": "硬朗有棱角",
  "tryon.quiz.q2.c": "下巴尖窄",
  "tryon.quiz.q3": "你想要的眉形…",
  "tryon.quiz.q3.a": "自然轻松",
  "tryon.quiz.q3.b": "精致立体",
  "tryon.quiz.result.title": "你的脸型：{shape}",
  "tryon.quiz.result.subtitle": "我们为你推荐这些风格：",
  "tryon.quiz.result.try": "试这个风格",
  "tryon.quiz.shape.oval": "椭圆型",
  "tryon.quiz.shape.round": "圆型",
  "tryon.quiz.shape.square": "方型",
  "tryon.quiz.shape.heart": "心型",
  "tryon.quiz.shape.long": "长型",

  // ─── 真实客户案例 ───
  "tryon.gallery.title": "真实客户・真实效果",
  "tryon.gallery.subtitle":
    "合成预览展示形状——这些照片展示我们的实际作品。",
  "tryon.gallery.before": "之前",
  "tryon.gallery.after": "之后",

  // ─── Reviews ───
  "reviews.tag": "Google 评价",
  "reviews.title": "客人们怎么说",
  "reviews.on.google": "Google 评分",
  "reviews.leave": "给我们留评价",

  // ─── Instagram Feed ───
  "instagram.tag": "@shimmyhands.shop",
  "instagram.title": "关注我们的旅程",
  "instagram.follow": "关注 @shimmyhands.shop",
  "instagram.post.nano": "纳米雾眉",
  "instagram.post.pressons": "穿戴甲",
  "instagram.post.ombre": "渐变粉黛眉",
  "instagram.post.studio": "工作室日常",
  "instagram.post.nailart": "美甲艺术",
  "instagram.post.bts": "幕后花絮",

  // ─── Client Counter ───
  "counter.clients": "满意客户",
  "counter.brows": "眉毛打造",
  "counter.nails": "美甲套装售出",

  // ─── Analytics Dashboard ───
  "analytics.title": "数据分析",
  "analytics.period.7d": "7天",
  "analytics.period.30d": "30天",
  "analytics.period.90d": "90天",
  "analytics.page.views": "页面浏览",
  "analytics.tryon.completions": "试戴完成",
  "analytics.cart.adds": "加入购物车",
  "analytics.leads.saved": "保存的线索",
  "analytics.top.pages": "热门页面",
  "analytics.top.events": "热门事件",
  "analytics.page": "页面",
  "analytics.event": "事件",
  "analytics.count": "次数",
  "analytics.no.data": "此时间段暂无数据。",

  // ─── Cron ───
  "cron.abandoned.carts": "废弃购物车恢复",
  "cron.care.reminders": "术后护理提醒",

  // ─── 导航（新页面）───
  "nav.referral": "推荐朋友",
  "nav.gift.cards": "礼品卡",
  "nav.loyalty": "会员积分",

  // ─── 推荐计划 ───
  "referral.tag": "推荐计划",
  "referral.title": "分享 Shimmy 的美丽",
  "referral.desc": "认识值得拥有美丽眉毛的朋友？分享你的链接，你们都能享受下次服务减 $10。",
  "referral.how.title": "如何参与",
  "referral.step1.title": "分享你的链接",
  "referral.step1.desc": "生成你的专属推荐码，通过 WhatsApp、短信或任何方式发送给朋友。",
  "referral.step2.title": "朋友预约",
  "referral.step2.desc": "你的朋友在首次预约时提及你的推荐码。",
  "referral.step3.title": "双方优惠",
  "referral.step3.desc": "你们都能在下次到店时享受 $10 优惠。就这么简单。",
  "referral.form.title": "获取你的推荐码",
  "referral.form.name": "你的名字",
  "referral.form.name.placeholder": "你的名字",
  "referral.form.submit": "获取推荐码",
  "referral.form.loading": "生成中...",
  "referral.error": "出了点问题，请再试一次。",
  "referral.success.title": "你的推荐码已生成！",
  "referral.success.desc": "分享给朋友，你们都能省 $10。",
  "referral.success.code": "你的推荐码",
  "referral.copy": "复制链接",
  "referral.copied": "已复制！",
  "referral.share.whatsapp": "通过 WhatsApp 分享",
  "referral.share.message": "嗨！我在 Shimmy 做的眉毛超好看。用我的推荐链接，我们都能减 $10：{link}",
  "referral.welcome.prefix": "你是由",
  "referral.welcome.suffix": "推荐的！提及代码",
  "referral.welcome.discount": "即可享首次服务减 $10。",

  // ─── 礼品卡 ───
  "gift.tag": "礼品卡",
  "gift.title": "送出美丽眉毛的礼物",
  "gift.desc": "Shimmy 礼品卡是送给值得宠爱自己的人的完美礼物。适用于所有服务。",
  "gift.card.label": "礼品卡",
  "gift.card.value": "面值",
  "gift.value.label": "卡面值",
  "gift.value.custom": "自定义",
  "gift.form.your.name": "你的名字",
  "gift.form.your.name.placeholder": "你的全名",
  "gift.form.your.email": "你的邮箱",
  "gift.form.your.email.placeholder": "you@example.com",
  "gift.form.recipient.name": "收礼人姓名",
  "gift.form.recipient.name.placeholder": "送给谁？",
  "gift.form.recipient.email": "收礼人邮箱",
  "gift.form.recipient.email.placeholder": "对方的邮箱地址",
  "gift.form.message": "个人留言",
  "gift.form.message.placeholder": "写一段祝福...",
  "gift.form.optional": "可选",
  "gift.purchase.title": "购买礼品卡",
  "gift.purchase.submit": "购买礼品卡",
  "gift.purchase.loading": "处理中...",
  "gift.purchase.error": "出了点问题，请再试一次。",
  "gift.purchase.success.title": "礼品卡已创建！",
  "gift.purchase.success.desc": "将下方代码分享给收礼人。",
  "gift.purchase.success.code": "礼品卡代码",
  "gift.share.whatsapp": "通过 WhatsApp 发送",
  "gift.share.message": "{name} 你好！你收到了一张 {value} 的 Shimmy 礼品卡。代码是：{code}。在 shimmyhands.com/gift-cards 兑换",
  "gift.check.title": "查询余额",
  "gift.check.code.label": "礼品卡代码",
  "gift.check.code.placeholder": "输入你的代码",
  "gift.check.submit": "查询余额",
  "gift.check.loading": "查询中...",
  "gift.check.balance": "剩余余额",
  "gift.check.for": "持卡人",
  "gift.check.active": "有效",
  "gift.check.redeemed": "已全部兑换",
  "gift.check.notfound": "未找到礼品卡，请检查代码。",
  "gift.check.error": "出了点问题，请再试一次。",

  // ─── 会员积分 ───
  "loyalty.tag": "会员奖励",
  "loyalty.title": "查看你的会员状态",
  "loyalty.desc": "每次到店都离奖励更近一步。输入手机号查看你的积分进度。",
  "loyalty.tiers.title": "奖励等级",
  "loyalty.tier.visits": "次到店",
  "loyalty.tier1.reward": "减 S$15",
  "loyalty.tier2.reward": "减 S$30",
  "loyalty.tier3.reward": "免费补色",
  "loyalty.check.title": "查询到店记录",
  "loyalty.check.phone.label": "手机号",
  "loyalty.check.phone.placeholder": "8XXX XXXX",
  "loyalty.check.submit": "查询状态",
  "loyalty.check.loading": "查询中...",
  "loyalty.error": "出了点问题，请再试一次。",
  "loyalty.no.visits": "此号码暂无到店记录。预约你的第一次服务吧！",
  "loyalty.book.first": "预约第一次服务",
  "loyalty.total.visits": "总到店次数",
  "loyalty.progress.current": "进度",
  "loyalty.progress.to.next": "次即可获得下一个奖励",
  "loyalty.next.reward": "下一个奖励",
  "loyalty.history.title": "到店记录",

  // ─── 博客搜索与筛选 ───
  "blog.search.placeholder": "搜索文章...",
  "blog.filter.all": "全部",
  "blog.filter.brows": "眉毛",
  "blog.filter.nails": "美甲",
  "blog.tag.page.title": "标签文章：{tag}",
  "blog.tag.page.back": "← 所有文章",
  "blog.no.results": "未找到文章",

  // ─── FAQ Schema — 美甲 ───
  "faq.nails.1.q": "穿戴甲可以维持多久？",
  "faq.nails.1.a": "正确使用和护理下，大多数手工穿戴甲套装可维持1至2周。使用指甲胶而非胶贴，并用酒精预处理指甲，可以显著延长使用时间。",
  "faq.nails.2.q": "穿戴甲可以重复使用吗？",
  "faq.nails.2.a": "可以！浸泡后轻轻去除穿戴甲背面的残余胶水，存放在原包装盒中。大多数优质套装可以佩戴2至3次。",
  "faq.nails.3.q": "穿戴甲会损伤我的自然指甲吗？",
  "faq.nails.3.a": "正确拆卸就不会。将手指浸泡在加了指缘油的温水中10至15分钟，然后轻轻滑下。绝对不要强行撕拉穿戴甲，否则可能会撕裂指甲表面。",
  "faq.nails.4.q": "如何选择合适的穿戴甲尺寸？",
  "faq.nails.4.a": "测量每个自然指甲最宽处。穿戴甲应覆盖整个甲床，两侧不超出皮肤。如果介于两个尺寸之间，选小的再锉磨调整。",

  // ─── FAQ Schema — 眉毛首页 ───
  "faq.brows.1.q": "你们提供哪些眉毛服务？",
  "faq.brows.1.a": "我们提供绣眉、微刀雕眉、纳米雾眉、渐变粉黛眉、眉形设计和唇部红润。每种技术适合不同的肤质和偏好。",
  "faq.brows.2.q": "我怎么知道哪种眉毛技术适合我？",
  "faq.brows.2.a": "这取决于你的肤质、生活方式和想要的效果。油性皮肤最适合纳米雾眉或渐变粉黛眉。干性皮肤各种技术都能很好保持。建议预约咨询，我们可以评估你的皮肤并推荐最适合的方案。",
  "faq.brows.3.q": "半永久眉毛能维持多久？",
  "faq.brows.3.a": "根据技术不同，效果可维持6至24个月。微刀雕眉通常在6至12个月内褪色，而纳米雾眉可维持18至24个月。6至8周的补色可以锁定最终效果。",
  "faq.brows.4.q": "眉毛操作过程痛吗？",
  "faq.brows.4.a": "我们在开始前会涂抹麻醉霜，大多数客人形容感觉只是轻微的刮擦感。我们会在每次操作之间重新涂抹麻醉霜，确保全程舒适。",
};
