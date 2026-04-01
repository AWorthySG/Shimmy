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
  "contact.wa.desc": "+65 8930 8973 — Quickest way to reach us",
  "contact.ig.label": "Instagram",
  "contact.ig.desc": "@shimmyhands.shop — DMs always open",
  "contact.google.label": "Google Reviews",
  "contact.google.desc": "Leave us a review — it means the world",
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

  // ─── Stats Bar ───
  "stats.brows": "Brows Shaped",
  "stats.rating": "Average Rating",
  "stats.years": "Years in Singapore",

  // ─── Email Capture ───
  "email.placeholder": "Your email address",
  "email.cta": "Get $10 Off",
  "email.success": "Thank you — we will be in touch!",
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
  "book.step.date.note": "Sundays are closed. Greyed-out dates are unavailable.",
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
  "urgency.brows": "Limited slots available this month — book early to secure your preferred date.",
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
  "faq.3.a": "Numbing cream is applied before the procedure. Most clients report minimal discomfort.",
  "faq.4.q": "How long do Nails by Shimmyhands press-on nails last?",
  "faq.4.a": "With proper application and care, most sets last 1 to 2 weeks.",
  "faq.5.q": "Can I book a consultation without committing to a service?",
  "faq.5.a": "Yes. We welcome a no-obligation consultation to discuss what suits you best.",

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
  "blog.desc": "Expert tips on brow aftercare, press-on nail application, and everything in between.",
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
  "blog.3.p1": "Both nano brows and microblading create natural-looking, hair-like strokes — but they use very different tools and techniques. Understanding the difference can help you choose the method that will work best with your skin type and lifestyle.",
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
  "blog.5.p5": "The best approach is always a professional consultation. Every face is unique, and a skilled brow artist considers dozens of micro-details — from the distance between your eyes to the height of your forehead. At Shimmyhands, we always start with a thorough face mapping session before any work begins.",

  // Article 6: How to Choose Your Nail Size
  "blog.6.title": "How to Choose the Right Press-On Nail Size",
  "blog.6.desc": "A simple guide to finding your perfect press-on nail fit for maximum comfort and longevity.",
  "blog.6.p1": "The right size press-on nail should cover your natural nail bed from sidewall to sidewall without touching the skin on either side. If a nail overlaps onto your cuticle area or skin, it will lift prematurely and feel uncomfortable. A slightly smaller fit is always better than too large.",
  "blog.6.p2": "To find your size, measure the widest part of each natural nail. You can do this with a soft measuring tape, or by pressing a piece of clear tape across your nail and marking the edges. Each finger may be a different size — your thumb and middle finger are usually the widest.",
  "blog.6.p3": "When trying on press-on nails, place each one against your natural nail without adhesive first. Check that it sits flush against the nail bed with no gaps at the sides or base. The cuticle edge of the press-on should follow the curve of your cuticle line naturally.",
  "blog.6.p4": "If you're between sizes, go with the smaller one and gently file the sides to match your nail width. This gives a seamless, custom-like fit. A well-fitted press-on nail will feel comfortable, stay put for longer, and look indistinguishable from a professional salon set.",

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
  "contact.prep.2": "请素颜到店，眉毛不要化妆",
  "contact.prep.3": "提前10分钟到，让我们有时间好好聊",
  "contact.prep.4": "如有任何皮肤问题或过敏，请提前告知我们",

  // ─── Footer ───
  "footer.desc": "为你的脸用心设计的眉毛——一次一个预约。",
  "footer.links": "快速导航",
  "footer.contact": "联系方式",
  "footer.rights": "版权所有。",
  "footer.location": "新加坡",

  // ─── Stats Bar ───
  "stats.brows": "眉毛塑造",
  "stats.rating": "平均评分",
  "stats.years": "扎根新加坡",

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
  "book.step.date.note": "周日休息。灰色日期不可预约。",
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
  "blog.desc": "关于眉毛术后护理、穿戴甲使用技巧等专业建议。",
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
  "blog.1.p6": "完全愈合大约需要 4–6 周。第 2 周左右颜色可能看起来好像'消失'了——别紧张，色素还在，只是沉入了皮肤表层下方。到第 4 周，真正的颜色会浮现出来。6–8 周后的补色环节会完善任何需要调整的区域。",

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
  "blog.4.p3": "穿戴甲松动后，从侧面轻轻将甲皮推或橘木棒滑入底部——绝对不要从指尖撬。慢慢轻柔地摇动。如果某片甲还没松，再多泡几分钟，不要硬来。这里的耐心保护的是你的自然指甲。",
  "blog.4.p4": "卸除后，用细磨指甲锉轻轻去除残余粘合剂。大量涂抹甲缘油，按摩到每个指甲和周围皮肤。这样可以恢复水分，保持指甲强韧。你的自然指甲应该看起来完全健康——随时准备好迎接下一套穿戴甲。",

  // 文章 5：如何选择适合的眉形
  "blog.5.title": "如何选择适合你脸型的眉形",
  "blog.5.desc": "找到自然衬托你独特脸型和五官的眉形指南。",
  "blog.5.p1": "完美的眉形不是独立存在的——它完全取决于你的脸。你的骨骼结构、五官间距，甚至自然眉毛的生长方向都会影响。目标是提升，而不是改变。",
  "blog.5.p2": "圆脸适合稍高的眉峰，可以在视觉上拉长脸部，增添立体感和线条感。避免过于圆润的眉毛，那会让脸看起来更圆。带有温柔眉峰的柔和角度效果最好。",
  "blog.5.p3": "椭圆脸的灵活度最高——大多数眉形都很好看。顺着眉骨走势的自然柔和弧度通常最讨喜。避免过度修眉或让眉毛太细，那会打破自然的平衡感。",
  "blog.5.p4": "方脸或棱角分明的脸型，柔和的圆弧眉毛可以平衡强势的下颌线和棱角特征。低弧度温和弯曲的眉毛能柔化整体印象。避免眉毛上的尖锐角度，那会让棱角显得更突兀。",
  "blog.5.p5": "最好的方式始终是专业咨询。每张脸都独一无二，一位优秀的眉毛艺术家会考虑几十个细微之处——从双眼间距到额头高度。在 Shimmyhands，我们总是先进行完整的脸部测量，然后才开始任何操作。",

  // 文章 6：如何选择穿戴甲尺寸
  "blog.6.title": "如何选择适合的穿戴甲尺寸",
  "blog.6.desc": "简单指南帮你找到完美贴合的穿戴甲尺寸，最大化舒适度和持久度。",
  "blog.6.p1": "合适的穿戴甲应该完全覆盖自然甲床，从一侧甲壁到另一侧，但不碰到两侧皮肤。如果穿戴甲溢出到甲缘或皮肤上，它会过早翘起，而且不舒服。稍小的尺寸总比太大好。",
  "blog.6.p2": "要找到你的尺寸，测量每个自然指甲最宽的部分。可以用软尺，或者将一段透明胶带贴在指甲上标记两侧边缘。每根手指的尺寸可能不同——拇指和中指通常最宽。",
  "blog.6.p3": "试穿穿戴甲时，先不涂胶水，将每片甲片放在自然指甲上对比。检查它是否紧贴甲床，两侧和底部没有缝隙。穿戴甲的甲缘边缘应该自然跟随你的甲缘弧度。",
  "blog.6.p4": "如果你介于两个尺寸之间，选择较小的那个，然后轻轻锉磨两侧使其与你的指甲宽度一致。这样可以获得无缝的定制般贴合。合适的穿戴甲佩戴舒适、持久牢固，效果与专业沙龙无异。",

  // ─── 404 未找到 ───
  "notfound.title": "页面未找到",
  "notfound.desc": "您要找的页面不存在。",
  "notfound.brows": "眉毛",
  "notfound.nails": "美甲",
  "notfound.shop": "商店",
  "notfound.contact": "联系我们",

  // ─── Launch ───
  "launch.tag": "即将推出",
  "launch.title": "新系列即将到来",
  "launch.desc": "抢先了解。加入等候名单享受独家提前购买权。",
  "launch.days": "天",
  "launch.hours": "时",
  "launch.minutes": "分",
  "launch.seconds": "秒",
  "launch.notify": "发布时通知我",
  "launch.gallery": "抢先预览",
  "launch.wa": "通过 WhatsApp 获取提前购买权",
};
