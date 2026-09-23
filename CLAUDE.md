# Yameen Yasar Studio — website (yameenyasar.com)

Marketing site for Yameen Yasar Studio (يمين يسار), a one-person studio run by Anan Kherbek that builds bilingual Arabic/English websites and web apps. The site IS the portfolio: if its Arabic side is not flawless, nothing else on it is believable. Treat RTL quality as the #1 acceptance criterion.

- Audience: (1) Arab small businesses (Gulf, Levant, diaspora) who want a proper bilingual site, (2) foreign businesses that want an Arabic version.
- Primary goal of every page: get the visitor to message on WhatsApp or send the contact form.
- One long page per locale: `/ar` and `/en`.

## Files in this repo you must read

| Path | What it is |
| --- | --- |
| `docs/website-copy.md` | ALL site text, AR + EN, section by section. Source of truth. Never invent or rewrite copy; if something is missing, add a `TODO(anan)` and tell Anan. |
| `public/brand/*.svg` | Final logos. Never redraw, recolour, crop or mirror them. |
| `public/brand/favicon-512.png` | Source for favicon / app icon. |
| `public/images/` | Photos and screenshots Anan adds (see "Inputs still needed"). |

## Stack (decided — don't swap without asking)

- Next.js (latest stable, App Router, TypeScript, `src/` dir), static export: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`.
- Tailwind CSS (latest stable). Use logical utilities only for direction-sensitive spacing/position (see RTL rules).
- `next-intl` for i18n, set up for static export: `[locale]` segment, `generateStaticParams` for `ar` and `en`, `setRequestLocale` in every layout/page. No middleware (static export can't run it).
- Font: Readex Pro via `next/font/google`, subsets `['arabic', 'latin']`, weights 400/500/600, `display: 'swap'`, exposed as CSS variable `--font-sans`. One family for both scripts. No other fonts.
- Contact form: Web3Forms (works on a static site). Key in `.env.local` as `NEXT_PUBLIC_WEB3FORMS_KEY`. If the key is missing, the form shows the WhatsApp and email fallback instead of failing silently.
- Icons: `lucide-react` only, and only where an icon adds meaning.
- No other runtime dependencies without asking Anan first. No UI kits, no animation libraries, no CMS.
- Hosting: Cloudflare (Workers & Pages), deploying the `out/` folder from GitHub. Domain `yameenyasar.com` is already on Cloudflare. Do NOT use Vercel's free Hobby plan: it is for non-commercial use and this is a business site.

## Structure

```
src/
  app/
    [locale]/layout.tsx     # <html lang dir>, font, metadata, header, footer
    [locale]/page.tsx       # the one-page site, sections in order
    page.tsx                # "/" → picks /ar or /en (see Routing)
    icon.png, apple-icon.png (from public/brand/favicon-512.png)
    sitemap.ts, robots.ts
  components/
    sections/ Hero, Problem, Packages, Work, Process, About, Faq, Contact
    ui/       Button, LanguageSwitch, WhatsAppButton, Logo
    Header.tsx, Footer.tsx
  i18n/ routing.ts, request.ts
  lib/ site.ts              # WhatsApp number, email, social URLs, prices (one place)
messages/ ar.json, en.json  # every visible string, built from docs/website-copy.md
```

## Routing and languages

- Locales: `ar` (default fallback) and `en`. Every URL is prefixed: `/ar/`, `/en/`.
- `/` is a tiny static page: a small inline script redirects to `/en/` if `navigator.language` doesn't start with `ar`, otherwise `/ar/`. Include a `<noscript>` with both links. Also remember a manual choice in `localStorage` (`yy-locale`) and prefer it on return visits.
- `<html lang="ar" dir="rtl">` on `/ar`, `<html lang="en" dir="ltr">` on `/en`. Set these in the locale layout, never with JS after load.
- Language switch: shows the OTHER language in its own script — "English" on the Arabic page, "عربي" on the English page. It keeps the current section hash.
- hreflang alternates (`ar`, `en`, `x-default` → `/`) and a canonical per locale via `generateMetadata`.

## RTL rules (non-negotiable)

1. Direction comes from `dir` on `<html>`. Components never branch on locale for layout.
2. Use logical utilities: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s rounded-e`. Never `ml/mr/pl/pr/left/right/text-left/text-right` for anything direction-sensitive.
3. Directional icons (arrows, chevrons, "next") flip in RTL with `rtl:-scale-x-100`. The logo, numbers, phone numbers, emails, URLs, and media controls NEVER flip.
4. Phone numbers, emails and URLs inside Arabic text are wrapped in `<span dir="ltr">` so they don't scramble.
5. Arabic text is the same size as English, never smaller, and never letter-spaced (`tracking-normal` always on Arabic). No `uppercase` anywhere.
6. Arabic line-height needs room for dots and marks: body 1.7–1.8, headings at least 1.3.
7. Prices: Western digits in both locales ("300 USD" / "300 دولار"). Prose keeps the digits exactly as written in `docs/website-copy.md`.
8. Test every change in BOTH locales before calling it done.

## Brand tokens

Define as CSS variables in `globals.css` (light by default, dark via `@media (prefers-color-scheme: dark)`) and map them into Tailwind's theme so classes like `bg-paper text-ink bg-yameen` work.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `paper` | `#F6F2EA` | `#121A18` | Page background (never pure white) |
| `surface` | `#FFFFFF` | `#1B2522` | Cards, inputs |
| `line` | `#E2DBCD` | `#2C3834` | Borders, dividers |
| `ink` | `#15201D` | `#F3EFE6` | Text, headings; text on a `yasar` fill |
| `ink-muted` | `#5B6560` | `#A9B3AE` | Secondary text |
| `yameen` | `#0E6B5C` | `#5FD0B6` | Primary: main buttons, links, focus ring |
| `yameen-soft` | `#DCEEE8` | `#123A33` | Tinted highlights |
| `on-yameen` | `#FFFFFF` | `#0B1614` | Text on a `yameen` fill |
| `yasar` | `#E39B2D` | `#E9A845` | Accent, FILLS ONLY (fails contrast as text) |
| `yasar-ink` | `#8A5310` | `#F0B45A` | Accent when it must be text |
| `yasar-soft` | `#FBEBD2` | `#3A2A12` | Launch-offer banner, notices |

All listed text pairs pass WCAG AA in both themes. Use saffron sparingly: one saffron element per screen.

Type scale (px, size/line-height, weight): display 56/60 600 (hero only) · h1 36/44 600 · h2 24/32 600 · body 17/28 400 · small 14/22 400 · label 13/18 500. On mobile, display drops to 36/44.

Spacing steps: 8, 16, 24, 48 (sections: 48 mobile, 96 desktop). Radius: 6px inputs/tags, 12px buttons/cards/images, full for pills.

Logos: header uses `yy-logo-horizontal.svg` (dark theme: `-reversed`), about/footer may use the mark. Minimum sizes: mark 24px, horizontal 32px tall. Clear space = width of the saffron chevron.

## Design direction

The brand idea is "right to left, left to right": two languages meeting. Spend the boldness in ONE place, the hero; keep everything else quiet, disciplined, and fast.

- Hero: both headlines are present on both locales. The current locale's headline is large (display) on its reading side; the other language's headline sits small on the opposite side, aligned to the opposite edge. On desktop they visibly meet in the middle; on mobile they stack (current language first). This is the signature moment — make it excellent, not decorated.
- Decorative motif: the chevron (V) shape from the mark, used large and sparingly (hero background or one section break). Never as a pattern/wallpaper.
- Packages: three cards with real hierarchy — Business is emphasized (yameen border, "Most popular" badge on a `yasar` fill with `ink` text). Not three identical cards.
- Process is a real sequence, so numbered steps are fine there. Don't number anything else.
- Work: each card shows the Arabic and English screenshots side by side — that contrast is the proof.
- Motion: at most one orchestrated moment on load (the hero headlines). Respect `prefers-reduced-motion`. No fade-in on every section, no hover animations on every card.

Avoid these generic tells: all-caps eyebrow labels above headings, `→` appended to buttons/links, one word in a headline coloured or italicised for emphasis, identical cards with the same soft grey shadow everywhere, gradient washes, emoji in headings, monospace labels, stock photos.

## Section notes (order and anchors)

`#hero` → `#problem` → `#packages` → `#work` → `#process` → `#about` → `#faq` → `#contact`, then footer.

- Header: horizontal logo (links to `/{locale}/`), anchor nav (Packages, Work, About, Contact), language switch, WhatsApp button. Sticky, compact on scroll; mobile menu is a simple disclosure.
- WhatsApp: primary CTA everywhere. Link built in `lib/site.ts`: `https://wa.me/<number>?text=<prefilled message in current locale>`. Prefilled AR: "مرحبا، حابب أعرف أكتر عن موقع بلغتين." EN: "Hi, I'd like to know more about a bilingual website."
- Problem: three short cards side by side on desktop, stacked on mobile.
- Packages: launch-offer banner above the cards on `yasar-soft`, controlled by one flag in `lib/site.ts` (`launchOffer: true`) so Anan can switch it off.
- Work: Zait & Za'atar is real; clinic and SaaS are concept projects not built yet — show them as "قريباً / Coming soon" cards until URLs exist. Label concept projects clearly.
- About: real photo of Anan (`public/images/anan.jpg`); until it exists, show the mark on `yameen-soft` — never a stock photo or avatar illustration.
- FAQ: native `<details>/<summary>` accordion (accessible, no JS).
- Contact: labelled fields (not placeholder-only), inline validation messages in the current locale, success and error states from the copy file, honeypot field for spam.

## Quality floor (check before saying a task is done)

- `npm run build` passes with zero type errors; `out/ar/index.html` and `out/en/index.html` exist.
- Both locales checked at 375px and 1280px wide; no horizontal scroll; nothing mirrored that shouldn't be.
- Visible focus ring (2px `yameen`, offset from the element) on every interactive element; skip-to-content link.
- Lighthouse on both locales: Accessibility ≥ 95, SEO ≥ 95, Performance ≥ 90 (mobile).
- Every image has alt text in the current locale; the logo alt is the studio name.
- No hardcoded user-facing strings in components — all from `messages/*.json`.

## SEO

- Title and meta description per locale exactly as in `docs/website-copy.md` section 8.
- Open Graph + Twitter card per locale; OG image 1200×630 on `paper` with the stacked logo (generate a static PNG into `public/og-ar.png` and `public/og-en.png`).
- `sitemap.xml` listing `/ar/` and `/en/` with alternates; `robots.txt` allowing all.
- JSON-LD `ProfessionalService` with name, url, email, and `areaServed: "Worldwide"`.

## First session: milestones (commit after each)

1. Scaffold Next.js + Tailwind + next-intl with static export; `/ar` and `/en` render with correct `lang`/`dir`; `/` redirect works.
2. Tokens, font, dark mode, Header, Footer, language switch.
3. `messages/ar.json` + `messages/en.json` generated from `docs/website-copy.md`.
4. All eight sections built with real copy, placeholders marked `TODO(anan)`.
5. Contact form with Web3Forms + fallback; WhatsApp links.
6. SEO, icons, OG images, sitemap, robots, JSON-LD.
7. Quality floor pass on both locales; write a short list of what's left for Anan.

## Inputs still needed from Anan (use placeholders until provided)

- [ ] WhatsApp number in international format → `lib/site.ts`
- [ ] Web3Forms access key (free, sign up with hello@yameenyasar.com) → `.env.local`
- [ ] Zait & Za'atar live URL + two screenshots (AR and EN, 1600px wide) → `public/images/work/`
- [ ] Photo of Anan (portrait, good light, plain light background) → `public/images/anan.jpg`
- [ ] Instagram and LinkedIn page URLs → `lib/site.ts`

## Working rules

- Read `docs/website-copy.md` before touching any section. If Anan edits copy, update the messages files from it; don't paraphrase.
- Small, focused commits with clear messages. Never commit `.env.local`.
- Ask before: adding a dependency, changing the stack, changing brand colours or the logo, or deviating from the copy.
- When something is ambiguous, pick the option that makes the Arabic experience better, and say what you assumed.
- Explain what you did in short plain language; Anan is a CS student and wants to understand the code, so leave brief comments where a choice isn't obvious (especially RTL and i18n).
