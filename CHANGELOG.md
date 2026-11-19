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
