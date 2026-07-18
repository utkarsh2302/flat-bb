# Flat BB — White-label PropTech super-app

A builder-branded buyer super-app for the Indian real estate lifecycle
(Discover → Book → Pay → Watch it rise → Take keys). Three panels: **Client
(buyer)**, **Associate (broker/CP)**, **Admin (builder)**. Full product spec
lives in [docs/](docs/).

## North-star principles (do not drift)

1. **VERY user-friendly, every panel, always.** This is the #1 rule. One
   screen = one decision. ≤5 choices visible. One primary CTA per screen. Zero
   jargon (or tooltip-explained). Big, legible type. Thumb-reachable actions.
   A screen must be self-explanatory even as a forwarded WhatsApp screenshot.
   Family-legible: a 55-year-old co-decider must understand any screen.
2. **Brand: Trimurty (Jaipur), premium.** This instance is white-labelled for
   **Trimurty** — real company, real projects, real RERA, real photos (in
   `/public/images`, sourced from trimurty.com). Real contact + portfolio live in
   `lib/data.ts` (`COMPANY`, `CONTACT`, `PROJECTS`). Flagship interactive project:
   **The Greater Jagatpura**.
3. **Design = Zapier foundation + premium editorial layer.** Base tokens from
   [docs/DESIGN-zapier.md](docs/DESIGN-zapier.md): warm-cream canvas, deep coffee
   ink, single orange CTA (`#ff4f00`), 12px radius, no second chromatic accent,
   no pill buttons. Elevated for luxury real estate: **Fraunces serif** for
   display headings (`.t-hero`, `.t-serif-*`), Inter for body/UI; **real
   photography** carries the premium feel (cinematic full-bleed hero with a
   scrim, `next/image` everywhere — never cheap SVG/gradient placeholders);
   restrained motion (`.a-fadeup`, `.a-kenburns`). Availability status stays
   within palette (orange = available, cream = on-hold, ink = booked), always
   label-paired (colour-blind safe).
4. **Motion = Emil Kowalski's design engineering** (skills in `.agents/skills/`:
   emil-design-eng, apple-design, animation-vocabulary, improve/review-animations).
   Rules that are now baked into `globals.css` and must be kept: custom easing
   tokens `--e-out` / `--e-in-out` / `--e-drawer` (never plain `ease-in`);
   `scale(0.97)` press feedback on every `.btn` (`.press`/`scale(0.94)` for icon
   buttons); UI transitions ≤ 300ms; animate only `transform`/`opacity`; hover
   lifts gated behind `@media (hover:hover) and (pointer:fine)`; menus/dropdowns
   are origin-aware (`.menu-pop` + `transform-origin` at the trigger, enter via
   `@starting-style` from `scale(0.97)`, never `scale(0)`); action feedback via
   the Sonner-style `<Toaster/>` (booking/payment/certify/approval/lead);
   `prefers-reduced-motion` keeps opacity, drops movement. Match motion to
   frequency — never animate high-frequency/keyboard actions.
5. **Trust through visibility.** Status, price, progress always live and
   specific ("Slab 14 of 22 — certified 12 Jul"), never vague.
6. **Indian conventions:** ₹ lakh/crore formatting everywhere (₹1.25 Cr), never
   raw digits. Tabular numerals in ledgers. WhatsApp share on every artefact.

## Tech / state of build

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (CSS-first `@theme`).
- **Live app state: `lib/store.tsx`** (React context + reducer + `localStorage`).
  This is the mutable source of truth — unit statuses, holds, bookings, ledgers,
  leads, commissions, snags, milestone certification, approvals, activity feed.
  Static config (towers, rate cards, charges, project, portfolio) stays in
  `lib/data.ts`. Actions flow across ALL panels: a buyer booking flips the unit
  to booked (elevation, floor plate, admin), seeds a ledger, shows in My Home;
  admin certifying a milestone drops demands into every booked buyer's Khata;
  broker "reserve for client" creates a booking + commission. Persists on refresh.
- Pages that show live state are client components reading `useApp()`; dynamic
  routes stay server (params) and pass data into a client child.
- **Simulated behind clean seams** (tomorrow's backend): payments, e-sign,
  WhatsApp send, PDFs. GitHub / Vercel / Supabase deferred — do not add tonight.
- Money logic (cost sheet, EMI, ledger) lives in pure functions and is unit-tested.
- Testing: `node:test` for logic, `scripts/smoke.sh` for SSR route coverage,
  Playwright (`scripts/shots.mjs`) for mobile+desktop screenshots.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (must stay clean)
- `npm test` — node:test logic suite (see `lib/*.test.ts`)
- `npm run smoke` — SSR smoke over every route (server must be running; `BASE=` to override port)
- `node scripts/e2e.mjs` — Playwright end-to-end data-flow test (book → My Home → unit booked → admin → pay)
- `node scripts/shots.mjs` — Playwright screenshots (server on :3000; `BASE=` to override) → scratchpad/shots
