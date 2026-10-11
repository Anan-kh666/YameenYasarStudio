# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Yameen Yasar Studio — website (yameenyasar.com)

Marketing site for **Yameen Yasar Studio (يمين يسار)**, a one-person studio run by Anan Kherbek that builds bilingual Arabic/English websites and web apps. The site **is** the portfolio: if its Arabic side is not flawless, nothing else on it is believable. **RTL quality is the #1 acceptance criterion.**

- Audience: (1) Arab small businesses (Gulf, Levant, diaspora) who want a proper bilingual site, (2) foreign businesses that want an Arabic version.
- Goal of every page: get the visitor to message on **WhatsApp** or send the **contact form**.
- Shape: a cinematic intro at `/`, then one long page per locale at `/ar/` and `/en/`.
- Repo: `github.com/Anan-kh666/YameenYasarStudio` (branch `main`). For how the system works end to end, read `ARCHITECTURE.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm install            # Node >= 20.9 (Next 16 requirement)
npm run dev            # http://localhost:3000  → "/" intro, "/ar/", "/en/"
npm run build          # static export → out/   (needs internet: next/font downloads Google Fonts at build time)
npx tsc --noEmit       # typecheck (currently clean)
npm run lint           # ESLint 9 flat config (currently 2 errors, 4 warnings — see Known issues)
npx serve out          # preview the real static output (or: npx wrangler pages dev out)
```

There are no automated tests. "Done" means the Quality floor below passes.

## Stack (decided — don't swap without asking Anan)

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router, TypeScript, `src/` dir, **static export** (`output: "export"`, `images.unoptimized`, `trailingSlash: true`) | next 16.3.6, react 19.2.8 |
| i18n | `next-intl` without middleware (static export can't run it) | 4.14.6 |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, tokens in `globals.css` with `@theme inline` (there is no `tailwind.config`) | tailwindcss ^4 |
| Icons | `lucide-react` only (Menu, X). WhatsApp icon is inline SVG (lucide has no brand icons) | 1.47.0 |
| Fonts | `next/font/google`: Readex Pro (body/UI), Cormorant Garamond 600 (Latin headings), Tajawal 400/700 (Arabic headings) | — |
| Contact form | Web3Forms (client-side POST), key in `NEXT_PUBLIC_WEB3FORMS_KEY` | — |
| Hosting | Cloudflare (Workers & Pages) serving `out/`. Domain already on Cloudflare. **Never Vercel Hobby** — it forbids commercial use. | — |

No other runtime dependencies without asking first: no UI kits, no animation libraries, no CMS. `puppeteer-core` is a dev-only dependency (used for screenshots/OG generation during development, no script in the repo).

## Repo map

```
src/
  app/
    (redirect)/layout.tsx   # root layout #1: <html> for "/" only, noindex, loads intro.css
    (redirect)/page.tsx     # "/" → <IntroPage/> + <noscript> fallback (meta refresh to /ar/)
    (redirect)/intro.css    # all intro styles (layers, lock, reveal video, fade)
    (site)/[locale]/layout.tsx  # root layout #2: <html lang dir>, fonts, metadata, JSON-LD, Header/Footer
    (site)/[locale]/page.tsx    # the one-page site: 8 sections in order
    globals.css             # brand tokens, type scale, RTL base rules, logo + hero animations
    sitemap.ts, robots.ts   # force-static metadata routes
  components/
    IntroPage.tsx           # client: intro state machine (particle words, enter button, question, reveal video)
    HeroFx.tsx              # client: hero floating-letter canvas + mouse spotlight
    Header.tsx              # client: sticky header, anchor nav, mobile disclosure menu
    Footer.tsx
    sections/               # Hero, Problem, Packages, Work, Process, About, Faq, Contact
    ui/                     # Logo, LanguageSwitch (client), WhatsAppButton
  i18n/routing.ts           # locales ["ar","en"], defaultLocale "ar"
  i18n/request.ts           # loads messages/<locale>.json
  lib/site.ts               # ONE place for email, WhatsApp number, socials, launchOffer flag
messages/ar.json, en.json   # every visible string on /ar and /en (same key tree in both)
docs/website-copy.md        # original copy brief — partly OUT OF DATE, see "Copy"
public/brand/               # yy-logo-new.png (header), yy-logo-intro.png (intro finale), favicon-512.png
public/images/              # anan.jpg (About), ambient-silk.mp4 (hero + intro background)
public/og-ar.png, og-en.png # Open Graph images 1200×630
assets/                     # Anan's raw source files (logo jpeg, photo, social handles) — not served
.agents/skills/, .claude/skills/  # Higgsfield AI asset-generation skills (symlinked) — not app code
```

Do not edit or rely on: `out/`, `.next/`, `.open-next/` and `.wrangler/` (leftovers from an OpenNext/wrangler experiment on 2026-10-01; the project does **not** use OpenNext), `tsconfig.tsbuildinfo`, `next-env.d.ts`, and Finder duplicates like `out/en 3/`.

## Routing and languages

- URLs: `/` (intro, `noindex`), `/ar/` (default locale), `/en/`. Every page URL ends with `/`.
- `/ar` and `/en` are generated by `generateStaticParams` in the locale layout. **Call `setRequestLocale(locale)` at the top of every layout and page** under `[locale]`, or static rendering breaks.
- Two route groups = **two root layouts**, each with its own `<html>`. Moving between `/` and `/{locale}/` is always a full page load (`window.location.href`). That is intentional; don't "fix" it with `router.push`.
- `<html lang dir>` is set server-side in the locale layout (`ar` → `rtl`, `en` → `ltr`). Never set direction with JS after load.
- Locale choice on `/`: `localStorage["yy-locale"]` if set, else `navigator.language` starting with `ar` → `/ar/`, otherwise `/en/`.
- `LanguageSwitch` shows the **other** language in its own script ("English" on /ar, "عربي" on /en), keeps the current `#hash`, and saves `yy-locale`.
- hreflang alternates (`ar`, `en`, `x-default` → `/`) and canonical per locale come from `generateMetadata`.

## RTL rules (non-negotiable)

1. Direction comes from `dir` on `<html>`. Components never branch on locale for layout.
2. Use logical utilities and properties: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s rounded-e`, `inset-inline-start`. Never `ml/mr/pl/pr/left/right/text-left/text-right` for anything direction-sensitive. (Exception: the intro page is direction-neutral and uses physical `right` for the Skip button.)
3. Directional icons (arrows, chevrons) flip with `rtl:-scale-x-100`. The logo, numbers, phone numbers, emails, URLs and media controls never flip. `Logo` is wrapped in `dir="ltr"`.
4. Phone numbers, emails and URLs inside Arabic text get `dir="ltr"` (see the email links and the email input).
5. Arabic text is the same size as English, never smaller, never letter-spaced, never `uppercase`.
6. Arabic line-height: body 1.75, headings 1.35 (set globally under `[dir="rtl"]` in `globals.css`).
7. Prices use Western digits in both locales ("300 USD"). Prose keeps the digits exactly as written in the messages files.
8. Test every change in **both** locales before calling it done.

## Brand tokens (dark-only site, no theme toggle)

Defined as CSS variables in `src/app/globals.css` and mapped into Tailwind with `@theme inline`, so `bg-bg text-text bg-crimson text-crimson-bright border-line bg-paper` all work.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#0B0B0B` | Page background |
| `surface` | `#151313` | Cards, inputs, alternating sections |
| `line` | `#2A2424` | Borders, dividers |
| `text` | `#F5F2ED` | Main text on black |
| `text-muted` | `#A3A09B` | Secondary text on black |
| `crimson` | `#8B0D1A` | **Fills only** on black: primary buttons, badges, glows. Text on it = `text` |
| `crimson-bright` | `#E5484D` | Crimson as **text** on black: links, highlights, focus ring |
| `paper` | `#F5F2ED` | Light contrast sections (Problem, FAQ). Text on paper = `bg`; `crimson` IS allowed as text on paper |

Never put `#8B0D1A` text on black (fails contrast). Keep every text pair at WCAG AA.

Type scale (Tailwind classes `text-display/h1/h2/body/small/label`): display 56/60 (hero, `md:` and up), h1 36/44, h2 24/32, body 17/28, small 14/22, label 13/18. Use `font-heading` on every heading: it resolves to Cormorant Garamond in LTR and **Tajawal** in RTL through `--font-heading-family` (Amiri was replaced by Tajawal on Oct 4). Body is `font-sans` = Readex Pro.

Radius: `rounded-xl` buttons/inputs, `rounded-2xl` cards/images, `rounded-full` pills. Section padding `py-16 md:py-24`, content width `max-w-6xl` (`max-w-3xl` for FAQ and Contact).

Logo: the header uses `public/brand/yy-logo-new.png` (crimson/grey, Higgsfield-rendered) with three CSS layers: clip-path reveal, crimson breathing glow, periodic gleam. Never redraw, recolour, crop or mirror logos. The old green/saffron SVG logos were deleted on 2026-10-11 (recoverable from git history). Intro finale: `public/brand/yy-logo-intro.png` (same logo, transparent). Favicon/app icon: `public/brand/favicon-512.png`.

## Design direction

The brand idea is "right to left, left to right": two languages meeting.

- **Intro (`/`)** is the one cinematic exception: crimson particles stream in from the right and build «يمين» (right) on the right half, silver particles stream in from the left and build "Yasar" (left) on the left half (engine: `src/lib/brandField.ts`, letter shapes sampled from the real fonts); the pointer pushes them around. Then an enter button (lock icon), then a "compile" transition: scan beams turn the words into digits, the digits type themselves out as bilingual code (LTR code left, RTL Arabic-Indic number rows right; Arabic side uses digits only so no letter is ever shown un-joined), a progress bar fills from both ends (`0%→100%` / `٠٪→١٠٠٪`) while the question «هل موقعك يتحدث العربية فعلاً، أم يكتفي بالترجمة؟» appears, the code collapses into one horizontal line of light, then a finale where that line's digits render the real logo (crimson/silver digits on its exact pixels), a scan opens the actual logo image with a glow and one light sweep, then a fade into the site. Background: `ambient-silk.mp4`. The mixed-script brand text (Arabic «يمين» + Latin "Yasar") is intentional — don't "fix" it.
- **Hero**: both headlines on both locales. Current language large on its reading side, the other language small on the opposite side; headline words rise out of a blur in reading order, the other language arrives from the opposite side. Background: `ambient-silk.mp4` (crimson + silver silk ribbons, seamless loop, shared with the intro so it's cached), `HeroFx` floating Arabic/Latin letters with pointer parallax, and a mouse spotlight. Hero text lifts/fades on scroll via CSS scroll-driven animation.
- Everything after the hero stays quiet, disciplined and fast. No fade-in on every section, no hover animation on every card. Respect `prefers-reduced-motion` everywhere.
- Packages have real hierarchy: Professional (`business` key) gets a `crimson-bright` border and a "Most popular" badge on a `crimson` fill.
- Process is the only numbered list on the site.
- Avoid generic tells: all-caps eyebrow labels, `→` on buttons, one coloured/italic word in a headline, identical grey-shadow cards, emoji in headings, monospace labels, stock photos.

## Section order and anchors

`#hero` → `#problem` (paper) → `#packages` → `#work` (surface) → `#process` → `#about` (surface) → `#faq` (paper) → `#contact` (surface) → footer. Header nav links to `#packages #work #about #contact`. Changing an `id` breaks the nav and the language switch's hash preservation.

## Copy and messages

- **No hardcoded user-facing strings** in `src/app/(site)` or `src/components/sections`. Every string lives in `messages/ar.json` and `messages/en.json`, which must keep **identical key trees** (they do today). Component key lists (`TIERS`, `CARDS`, `STEPS`, `QUESTIONS`, `PROJECTS`, `PACKAGE_OPTIONS`, `NAV_ITEMS`) must match the JSON.
- Arrays (package features) are read with `t.raw("tier.features") as string[]`.
- Intro strings (brand text, question, "Skip / تخطّي") are hardcoded in `IntroPage.tsx` on purpose: `/` sits outside next-intl and shows both languages at once.
- **`messages/*.json` are the current truth; `docs/website-copy.md` is stale.** Since it was written, the Arabic was rewritten from Levantine colloquial into polished Modern Standard Arabic (commit `4d46749`), "Syrian" was removed from the bio, and the Work section moved from "Zait & Za'atar" to three concept projects. **Do not regenerate messages from the doc** — that would revert those decisions. Change copy in both JSON files, then update the doc to match, and ask Anan before rewording anything.
- Missing info → add `TODO(anan)` and tell Anan. Never invent copy.

## Config (`src/lib/site.ts`)

Holds `url`, `name`, `nameAr`, `email` (hello@yameenyasar.com), `whatsappNumber` (international format, no `+`), `instagram`, `linkedin`, and `launchOffer` (shows/hides the November-offer banner). `whatsappUrl(locale, message)` builds `https://wa.me/<number>?text=<encoded>`; the prefilled text comes from `whatsapp.prefilled` in the messages.

Heads-up: `site.prices` is **not rendered anywhere**. The visible prices are the strings in `messages/*.json` (`packages.*.price`). If prices change, edit both message files (and the AR/EN meta descriptions, which mention "from $300"); `site.prices` only matters if you wire it up.

## Contact form (`sections/Contact.tsx`)

- POSTs `FormData` to `https://api.web3forms.com/submit` with fields `access_key, name, email, business, package, message`. States: idle → sending → success | error, messages from `contact.*`.
- If `NEXT_PUBLIC_WEB3FORMS_KEY` is missing **at build time**, the whole form is replaced by WhatsApp + email buttons. `NEXT_PUBLIC_*` values are inlined during `next build`, so the key must be set in the build environment (e.g. Cloudflare build variables), not just locally.
- Spam: a hidden `_gotcha` field that the client checks before sending. Web3Forms' own honeypot field is `botcheck`; switching to it would also block bots that post directly.

## Intro page invariants (`IntroPage.tsx`) — read before touching

Phases: `init → assemble (2700ms) → lock → [click] unlock (3000ms, compile sequence; sub-steps timed in `brandField.ts`: `T_TYPE`/`T_COMPILE`/`T_COLLAPSE`) → logo (3600ms, finale) → fade (1s) → navigate`. Returning visitors (`localStorage["yy-intro-seen"] === "1"`) start at `lock` with a short fly-in. Reduced-motion users get static DOM text and no canvas; the button navigates directly. Skip navigates immediately. The phase is also a class on `.intro-root` (`phase-lock`, `phase-logo`, …) that drives the CSS.

Returning / reduced-motion are read once through `useSyncExternalStore` with a module-level cache (`getClientEnv`), not with setState in an effect.

Rules (the first comes from a real bug, commit `20f11fe`):
1. **Each phase schedules only its own next timeout.** Scheduling all timeouts in one effect let React's cleanup cancel the later ones, and the lock never appeared.
2. **The finale shows the real logo file, never a generated one.** `public/brand/yy-logo-intro.png` is `yy-logo-new.png` cut out onto transparency with exact colours (an AI-rendered logo video was dropped because it distorted and dimmed the logo). Particles land on its sampled pixels, then a CSS `clip-path` scan opens the image.
3. **Keep the logo in sync with the engine.** `.intro-logo` size (`min(60vw, 880px)`, `84vw` in portrait, centred) must equal `BrandField.logoWidth()`, and its clip animation (0.95s delay, 0.8s, `cubic-bezier(0.65,0,0.35,1)`, ending at `inset(-30% -12%)`) must equal `T_OPEN`/`D_OPEN` and the band in `stepRender`.
4. Always keep a way out: Skip works in every phase, and the `logo` phase always navigates on its timer.
5. The intro no longer plays a reveal video, so the old iOS autoplay rules (play inside the click, never `load()`/`pause()`) only matter again if a video is added back.

## Media pipeline

Brand videos and images were generated with the Higgsfield skills in `.agents/skills/` (GPT Image 2.5 for stills, Seedance 2.5 for video). Before adding any video:
- Encode **H.264, `yuv420p`, `+faststart`** (HEVC fails on Firefox, Chrome on Windows and older Android). Example: `ffmpeg -i in.mov -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an out.mp4`.
- Provide 1920×1080 and 1080×1920 variants for anything full-screen.
- Keep files small (the current `ambient-silk.mp4` is 0.6 MB). Use `muted playsInline` for anything that autoplays.

## Quality floor (check before saying a task is done)

- `npm run build` passes; `out/index.html`, `out/ar/index.html`, `out/en/index.html` exist.
- `npx tsc --noEmit` is clean, and you introduced no new lint errors.
- Both locales checked at 375px and 1280px: no horizontal scroll, nothing mirrored that shouldn't be, Arabic headings in Tajawal.
- Intro checked on desktop, a portrait phone (iOS Safari if possible), with and without `yy-intro-seen`, and with reduced motion on.
- Visible focus ring (2px `crimson-bright`, offset 2px) on every interactive element; skip-to-content link works.
- Lighthouse on `/ar/` and `/en/` (mobile): Accessibility ≥ 95, SEO ≥ 95, Performance ≥ 90.
- Every image has alt text in the current locale; logo alt is the studio name.

## Deployment

Static files only. Production = the contents of `out/` on Cloudflare at `yameenyasar.com`. The repo does not record whether Cloudflare builds from GitHub or `out/` is uploaded with `npx wrangler pages deploy out` (both have been used in this project's tooling). Either way, the build environment needs Node ≥ 20.9, internet access for Google Fonts, and `NEXT_PUBLIC_WEB3FORMS_KEY`. Build command `npm run build`, output directory `out`. Ask Anan which path is live before changing deployment.

## Known issues / open items (verified Oct 2026)

- **Lint errors** (2): `no-html-link-for-pages` on the two `<a>` tags in the `/` noscript block (fine on a static export; add an eslint-disable comment with a reason).
- **OG images are off-brand**: `og-ar.png` / `og-en.png` still show the old green/saffron logo on paper. Regenerate them for the crimson brand.
- Heavy images: `yy-logo-new.png` is 1344×752 / 847 KB for a 32px-tall header logo; `favicon-512.png` is actually 1024×1024 / 528 KB. Export properly sized versions.
- Arabic price strings are inconsistent: "300 USD" (Western) vs «يبدأ من ١٥٠٠ دولار» (Arabic-Indic). Rule 7 says Western digits for prices.
- `launchOffer` says "November offer" — switch `site.launchOffer` to `false` after November 2026.
- Work section: all three cards are "Coming soon" concept placeholders; `work.viewSite` and `public/images/work/` are unused until real projects exist.
- `site.linkedin` is still marked `TODO(anan): verify`. The `whatsappNumber` TODO comment is stale (a number is set).
- Small cleanups: unused `locale` in `Footer.tsx`; unused `locale` parameter in `whatsappUrl`; the About photo's alt text is the section headline rather than Anan's name; font setup is duplicated in both root layouts (keep them in sync or extract to `src/lib/fonts.ts`).

## Working rules

- Small, focused commits with clear messages. **Never commit `.env.local`.**
- Ask Anan before: adding a dependency, changing the stack or hosting, changing brand colours or the logo, changing prices or copy, or touching the intro flow's behaviour.
- When something is ambiguous, pick the option that makes the Arabic experience better, and say what you assumed.
- Anan is a CS student who wants to understand the code: explain what you did in short, plain language, and leave brief comments where a choice isn't obvious (especially RTL, i18n, static export and iOS video).
