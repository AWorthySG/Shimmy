# Changelog

All notable changes to this project are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Brow-mapping selfie camera at `/brows/selfie`. It has a fixed green centre line, a mirrored pair of draggable yellow lines and two independent red lines. Head-pose and phone-level checks lock the shutter until the photo is straight. Accepted photos are sent to the artist's Telegram with a measurements file.
- Photo-library option on the brow selfie page. A chosen photo runs through the same face checks, and any check it fails is shown before sending. Large photos are resized to stay within the upload limit.
- Upload protection on the selfie endpoint: same-site requests only, a limit of 6 uploads per 10 minutes per visitor, full JPEG validation and a 15-second Telegram timeout.
- Brow selfies are now sent through the customer's WhatsApp by default. On phones the share sheet opens with the photo and a summary of the checks; on computers the photo is saved and the Shimmyhands chat opens. Telegram upload stays available via `NEXT_PUBLIC_SELFIE_DELIVERY=telegram`.
- The WhatsApp summary now includes a millimetre scale from the iris width (11.7 mm), the cheek-to-cheek face width, head tilt and turn named by the customer's side, and a warning that library photos may be mirrored.
- Guide lines are placed on the face automatically after capture: yellow on the inner eye corners, top red through the brows, bottom red at the base of the nostrils. The customer is asked to check and fine-tune them, and the WhatsApp summary names each line and gives the eye-corner gap and brow-to-nostril distance in mm.
- Site-wide design system (docs/DESIGN_SYSTEM.md): one style each for buttons (5 variants, 3 sizes), tags, filter chips, eyebrow labels and form fields; a three-step letter-spacing scale; semantic colour names. Every page now uses them.
- Prices read the same everywhere: S$49.90 for products and totals, S$10 for promotions.
- Nails hero text is readable on phones; the dark-mode toggle and all buttons meet the 44 px tap-target size; dark-mode labels have stronger contrast.
- Search and sharing: one canonical www address on every page, robots.txt, llms.txt, a complete sitemap, unique titles and descriptions for every blog post, collection and product, share images on all pages, BeautySalon structured data, and no more doubled brand names in titles.
- The contact calendar now loads closed dates; the brow try-on gallery shows real client results instead of empty placeholders.
- All prices and offers use the S$ prefix.
- `npm test` script for unit tests (`node --test`).
- The referral reward reads S$10 on every page (one banner said S$20), and the contact page now states the studio is appointment-only with no walk-ins.
- The contact page and Google search data now show the studio address: 37 Grace Walk, Verdana Villas, Singapore.
- Admin sign-in is checked on the server. The password now comes only from the `ADMIN_SECRET` setting in Vercel and is no longer in the page code; a successful sign-in sets a 12-hour httpOnly session cookie. Five wrong attempts lock that address out for 15 minutes. If `ADMIN_SECRET` is not set, admin access is refused.
- Removed the "someone just booked" pop-ups, which showed invented bookings.
- The "Notify me when restocked" form now saves the email (one sign-up per email and product) and shows an error if saving fails. It needs the `restock_notifications` table from `supabase-schema.sql`.
- Removed the spin-the-wheel and exit pop-ups. The S$10 welcome banner and the cookie notice remain.
- Videos load only when scrolled near, pause when off screen, and show a still image for visitors who ask for reduced motion or data saving. Video files are 40% smaller (7.5 MB to 4.5 MB) with no visible quality change.
- Rewrote the English copy across the site in plainer, more direct language: sentence-case headings and buttons, British spelling, and no stock marketing phrases. Prices, durations, aftercare instructions and client reviews are unchanged.
- Nail collection prices now read "From S$45.00" instead of "From $45", matching the rest of the site.
- Facts that disagreed across pages now match: brow longevity (microblading and embroidery 12 to 18 months, nano 18 to 24 months, ombre 2 to 3 years), lip blush true colour at week 3 to 4, avoiding caffeine and alcohol for 48 hours before, a 2 to 2.5 hour first session and a 60 to 90 minute touch-up. The booking page no longer promises an automatic deposit link.
- The booking form shows real prices instead of "From $XXX", and try-on prices match the services page (embroidery from S$388, microblading from S$488).
- Booking slots now match the stated session lengths (2.5 hours for most brow services, 3 hours for nano), so appointments can't overlap.
- The site now records WhatsApp clicks, submitted bookings, completed try-ons, saved looks, basket adds and email sign-ups. They show in the admin analytics tab and, when `NEXT_PUBLIC_GA_ID` is set, in Google Analytics. The tracking endpoint ignores any other event name.
- Each brow service has its own page at `/brows/services/<service>` (eyebrow embroidery, microblading, nano brows, ombre powder brows, brow shaping, lip blush) with price, session length, how long it lasts, what's included, FAQs and booking buttons. The pages are in the sitemap and carry Service, FAQ and breadcrumb data for search results. The services list links to each one.
- Clients who left an email get a Google review request 14 days after a confirmed appointment. It is sent by the daily care-reminders job and stays off until both `RESEND_API_KEY` and `GOOGLE_REVIEW_URL` are set in Vercel.
- Two new journal articles: "Eyebrow embroidery price in Singapore: what you're paying for" and "Is eyebrow embroidery safe? Risks, side effects and who should wait". Both are in English only for now; the Chinese site shows the English text.
- Every page now follows the design system. Error messages use one brick-red error colour that meets contrast in light and dark mode; corners are square; letter-spacing is on the three-step scale; the try-on, admin and language-toggle buttons and the try-on contact form use the standard button and field styles. `npm run audit:design` checks this, and `npm test` fails if a page breaks it.
- The launch page no longer shows a countdown that restarts at 30 days on every visit, and no longer throws a page error on load. Set `NEXT_PUBLIC_LAUNCH_DATE` (for example `2026-12-20T10:00:00+08:00`) in Vercel to show a real countdown; without it, the page shows only the email sign-up.
- `npm run qa:devices` loads every page on seven device sizes (iPhone SE to a 1920 px desktop) and reports page errors, horizontal scrolling, broken images and a menu that won't open.
- Each brow tattoo service page now covers who it suits, the six appointment steps, aftercare and further reading (about 720 words, up from 130). Brow shaping and lip blush pages gained the parts that apply to them.
- Brow articles end with a box for the service they cover (price, session length, details and booking); nail articles link to the shop.
- The brows and nails intro animations play once per browser session and never with reduced motion, and the page now loads underneath them. The nails page shows its main content in about 1.2 s on a mid-range phone, down from about 4.5 s.
- The desktop header has a Book now button; both header Book buttons open the online booking form.
- Removed the placeholder Instagram grid and the empty "As seen in" press row.
- Phones: the scroll hint no longer overlaps the second hero button, and the back-to-top button no longer stacks over text above the WhatsApp button.
- The brow try-on page no longer jumps when the first-visit tips appear; the tips now sit below the upload box.
- Fixed: with the device's reduce-motion setting on (common on iPhones), every section that fades in on scroll stayed invisible, leaving large blank areas. Those sections now appear straight away with no animation. `npm run qa:devices` now checks for hidden text.
