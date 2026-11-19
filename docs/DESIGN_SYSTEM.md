# Shimmyhands design system

Extracted from the live site in November 2026. It is the single reference for how
every element looks. Tokens and component classes live in
[`src/app/globals.css`](../src/app/globals.css); prices use
[`src/lib/format.ts`](../src/lib/format.ts).

**Rule for new markup:** use a component class for the element (`btn`, `tag`,
`chip`, `eyebrow`, `field`) and add only layout utilities (width, margin,
position). Never re-specify its colour, type size, letter-spacing or padding.

## 1. Colour

The legacy token names are kept so existing markup keeps working. `vermillion`
is historically named: it is the brand **sage green**. New code should use the
semantic names.

| Semantic name (Tailwind) | Legacy name | Light | Dark | Use |
|---|---|---|---|---|
| `primary` | `vermillion` | `#536442` | `#6E8058` | Primary buttons, links, active states |
| `primary-hover` | `vermillion-dark` | `#3E4D31` | `#5A6C46` | Hover and pressed; eyebrow text |
| `primary-soft` | `vermillion-light` | `#6E8058` | `#8A9C72` | Decorative accents |
| `accent` | `gold` | `#A89279` | `#C4A882` | Hairlines, ornaments, badges |
| `surface` | `soft-white` | `#FDF7F4` | `#222018` | Cards, inputs, text on dark |
| `surface-muted` | `cream` | `#F1E3DC` | `#2A2420` | Section bands, hero backgrounds |
| `background` | — | `#F9F2EE` | `#1A1816` | Page background |
| `text` | `charcoal` | `#2E3328` | `#F0E8E2` | Headings, body text |
| `text-muted` | `charcoal-light` | `#4A5240` | `#C8BEB5` | Secondary text |
| `text-subtle` | `warm-gray` | `#7A7670` | `#8A7E74` | Captions, meta, placeholders |
| `success` | `jade` | `#7A8E6A` | `#8A9C72` | Confirmations, nails category |
| `error` | — | `#A3432F` | `#E08A74` | Form errors and destructive actions (at least 4.9:1 on every surface) |
| `whatsapp` | — | `#25D366` | `#25D366` | WhatsApp button only |

Do not use raw hex values or Tailwind's default palette (`red-500`, `green-400`)
in page markup. Error text uses `text-error`; a notice that isn't an error (such as
low stock) uses `text-primary-hover`.

Exceptions, where the colour is the content: the size guide and brow try-on (real nail
and pigment colours), `brow-placeholders.tsx` (skin-tone illustrations), the share
image (`opengraph-image.tsx`, drawn outside the CSS), and the brow selfie camera, a
full-screen black camera view whose green, yellow and red text matches the guide lines it
draws.

## 2. Typography

| Role | Font | Token | Notes |
|---|---|---|---|
| Display | Italiana | `font-serif` / `--font-display` | Page titles and section headings at `text-2xl` and up; never bold |
| Small headings, card titles | Lora 500 | `font-sans font-medium` | Any heading below `text-2xl` |
| Body and UI | Lora | `font-sans` / `--font-body` | Default on `body` |

Italiana is thin and loses legibility below about 24px, so it is kept for large type. The
audit rule `small-display-font` flags `font-serif` without a `text-2xl` or larger size. The
Shimmy wordmark, the seal and the intro animations are exempt.

Type sizes in use: `text-xs` (labels, buttons), `text-sm` (body on phones),
`text-base` (body on desktop), `text-xl`–`text-3xl` (section headings),
`text-3xl`–`text-7xl` (page heroes, scaling up by breakpoint).

### Letter-spacing scale

Every uppercase label uses one of three values. Arbitrary values such as
`tracking-[0.25em]` are not allowed.

| Utility | Value | Use |
|---|---|---|
| `tracking-button` | 0.15em | Buttons, chips, small UI labels |
| `tracking-label` | 0.2em | Tags, large buttons, captions |
| `tracking-eyebrow` | 0.3em | Eyebrow lines above headings |

## 3. Components

### Buttons — `btn` + one variant + optional size

| Class | Look | Use |
|---|---|---|
| `btn btn-primary` | Sage fill, white text | The main action on a screen |
| `btn btn-secondary` | Sage outline, fills on hover | Secondary actions; Add to bag |
| `btn btn-outline` | Neutral outline, turns sage on hover | Alternative path next to a primary |
| `btn btn-dark` | Charcoal fill | On light imagery where sage lacks contrast |
| `btn btn-light` | White fill, sage text | On dark or sage sections |
| `btn btn-danger` | Brick outline, fills on hover | Destructive actions such as cancelling a booking |
| `btn-sm` | 36 px tall | Inside cards and dense lists |
| `btn-lg` | 44 px+, wider padding | Hero and page-level calls to action |

Decorative effects (`glow-pulse`, `btn-magnetic`, `shine-on-hover`, `shine-sweep`, `shimmer-text`, `sparkle`, `star-spin`) are retired: the audit fails if they come back.

All buttons are square-cornered, uppercase, 12 px text, at least 44 px tall
(except `btn-sm`), show a sage focus ring for keyboard users, and dim to 50%
when disabled. Effect classes (`btn-magnetic`, `shine-on-hover`, `glow-pulse`)
may be added on top.

```tsx
<Link href="/brows" className="btn btn-primary btn-lg w-full sm:w-auto">Book now</Link>
```

### Tags — `tag`, `tag tag-jade`, `tag tag-gold`
Small bordered labels for categories and status: brows posts use `tag`, nails
posts `tag-jade`, featured badges `tag-gold`.

### Filter chips — `chip`, plus `chip-active` for the selected one
Used for shop collection, colour and blog category filters.

### Eyebrow — `eyebrow`
The small uppercase line above section and page headings, in `primary-hover`
at 10 px (12 px from 640 px up).

### Icons — `src/components/icons.tsx`

One line-icon set: 24px grid, 1.5px stroke, square caps, sized to the text (`1em`) and
coloured by `currentColor`. Use `TrailingArrow` after link text and `LeadingArrow` before
back links. Do not use text characters (✦ ◆ ★ ✓ → ↑) as icons, and do not put arrows in
translation strings. Brand logos (WhatsApp, Instagram) keep their own filled marks.

### Form fields — `field`
Text inputs, emails, phone numbers and textareas: surface background, sage
hairline border that darkens on focus, 44 px minimum height, square corners.
Exceptions: the transparent search-overlay input and inputs on dark backgrounds
(the launch page and the selfie camera).

## 4. Shape, spacing and touch

- **Corners:** square for buttons, fields, tags, chips and cards. `rounded-full`
  only for circular icon buttons, avatars and dots.
- **Section padding:** `py-14 sm:py-20` for standard bands, `py-16 sm:py-20 md:py-24`
  for feature sections; horizontal `px-4 sm:px-6`.
- **Touch targets:** every tappable control is at least 44 × 44 px (`touch-target`,
  `min-h-11 min-w-11`, or a `btn`).

## 5. Content conventions

- **Money:** `formatPrice()` for product prices and totals (`S$49.90`, `S$45.00`);
  `formatAmount()` for promotions (`S$10 off`). Always the `S$` prefix.
- **Text over images or video:** put a `soft-white` veil of at least 55% behind
  the text on phones.

## 6. Checking the rules

`npm run audit:design` scans every page and component for default-palette colours, raw
hex values, off-scale letter-spacing, rounded corners on square components, hand-styled
buttons, text inputs without `field`, Italiana below `text-2xl` and text characters used
as icons. `npm test` runs the same scan, so a pull
request that breaks a rule fails its tests. The exceptions above are listed in
`scripts/audit-design-system.mjs`.

## 7. How the site was standardised

`scripts/standardize-classes.mjs` and `scripts/standardize-fields.mjs` rewrote
existing markup onto these classes. Re-running them is safe: elements already
using a component class are skipped.

| Element | Before | After |
|---|---|---|
| Buttons | 85 different class combinations across 107 buttons | 5 variants × 3 sizes |
| Letter-spacing | 13 values | 3 (+ Tailwind's `wide`/`wider`) |
| Form fields | 14 styles | 1 (`field`) + 2 documented exceptions |
| Filter pills | 3 sizes, 3 border strengths | 1 (`chip`) |
| Eyebrow labels | 43 copies of 4 near-identical class strings | 1 (`eyebrow`) |
| Prices | `$49.9`, `$45`, `S$388` mixed | `S$49.90` everywhere |
