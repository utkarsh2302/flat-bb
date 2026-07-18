# 05 — UI/UX Design Guidelines (Indian Buyer + Builder, Super-Simple, Uncluttered)

## 1. Design philosophy
> **"One screen, one decision."** Every screen answers exactly one buyer question. If a screen answers two, split it.

Anchors: (a) **Trust through visibility** — status, price, progress always live and specific ("Slab 14 of 22 — certified 12 Jul"), never vague ("work in progress"). (b) **WhatsApp-grade familiarity** — patterns Indians already know: cards, green ticks, share buttons, OTP. (c) **Family-legible** — a 55-year-old parent must be able to read any screen handed to them: big type, plain words, Hindi parity. (d) **Premium calm** — real estate apps in India look like classified ads; ours should feel like a bank + a luxury brochure: generous whitespace, few colours, photography-led.

## 2. The buyer journey, screen by screen (apartments)

1. **Project Home** — hero photo/video, 4 trust chips (RERA no. • Possession date • % sold • Live progress), two primary CTAs only: *Explore Flats* / *Book Site Visit*. Everything else below the fold.
2. **Tower Explorer** — full-bleed interactive elevation. Availability colours identical to plot maps (consistency = brand). Sticky filter bar with max 5 filters visible (BHK, Budget, Floor, Facing, More…). Tap targets ≥ 48px — floors are fat horizontal bands, not thin lines.
3. **Floor plate** — units as large tappable shapes with BHK + price-band labels; legend always visible; count of available units on this floor.
4. **Unit page** — order of information mirrors the family conversation: floor plan → price ("all-inclusive ₹X — see full breakup") → facing/Vastu compass → view photos → sun-path → compare/share → CTAs (*Reserve ₹51,000* / *Visit*). Price is **one number first**, breakup one tap away — never a wall of charges.
5. **Cost sheet** — statement-style table, plain-language labels with (?) tooltips in Hindi/English ("Floor rise — ऊंची मंज़िल का अतिरिक्त शुल्क"), grand total boxed, PDF/WhatsApp buttons.
6. **EOI flow** — 3 steps max, progress dots, 15-min countdown visible but not alarming; UPI-first payment; success screen = confetti + allotment card sharable to family WhatsApp group.
7. **My Home (post-booking)** — dashboard of 4 cards only: **Next payment** (amount/date/Pay button), **Construction this week** (latest photo), **My documents**, **Refer & earn**. Everything else in a simple list below.
8. **Progress feed** — reverse-chron photo feed like Instagram; each post: photo, milestone tag, date, ✅ certified badge. Timelapse pinned at top.
9. **Demand letter view** — amount, due date, *what got built* (evidence photos inline), Pay Now, "paying via bank loan?" toggle that shows bank-letter download.
10. **Snagging** — room tabs, tap-to-add snag = camera opens, snag cards with status chips (Reported → Fixing → Fixed → Verified).

## 3. Builder Admin principles
- **Cockpit, not ERP.** Home = 6 numbers max: today's leads, site visits, holds live, bookings MTD, collections MTD vs due, overdue amount. Each drills down.
- Every list has bulk actions + Excel export (builders will demand Excel; give it, but make the app better than Excel).
- **Wizard-first setup:** new tower onboarding as a guided flow (upload floor plate → auto-detect/trace units → assign attributes in a grid editor → rate card → publish). Target: one tower live in < 1 day.
- Approvals inbox pattern (discounts, refunds, milestone certifications) — one place, swipe/click approve with audit note.
- Role-lens: finance user lands on collections; sales head on pipeline; owner on the money view.

## 4. Visual system
- **Theming:** white-label tokens — primary colour, logo, font pair per tenant; our neutral base (deep navy like current demo works well) + status palette fixed platform-wide: green=available, amber=hold/EOI, red=sold, blue=leased/registered (colour-blind-safe shades + always paired with labels/icons).
- **Type:** one variable font supporting Devanagari + Latin (e.g., Noto Sans / Mukta pairing); body ≥ 16px; numerals tabular in ledgers.
- **Density:** max 2 font sizes + 1 accent per card; 8-pt spacing grid; cards over tables on mobile, tables on desktop admin.
- **Iconography:** filled, rounded, universally readable (₹, 🧭 compass for facing, sun for sun-path); avoid abstract fintech icons.
- **Motion:** availability pulse on live units, gentle slab-completion animation in progress feed; no gratuitous animation elsewhere; respect reduced-motion.

## 5. India-specific UX rules
1. **Hindi is a first-class citizen** — parity on every string incl. PDFs; toggle persistent; regional additions config-only.
2. **Lakh/crore formatting everywhere** (₹1.25 Cr, ₹85.5 L), never 12,500,000.
3. **WhatsApp share on every artefact** (unit, cost sheet, receipt, progress photo, referral) — it's our organic distribution.
4. **OTP-only auth for buyers** (no passwords); guest browsing allowed until EOI; truecaller-style prefill where possible.
5. **Low-data mode:** photos lazy + compressed; explorer is vector; works on 3G.
6. **Vastu presented respectfully:** a filter and a compass, factual not preachy.
7. **Trust badges with substance:** RERA number links to the actual RERA portal listing; "escrow-compliant payments" note near pay buttons.
8. **Accessibility:** WCAG 2.1 AA; large-type mode; screens readable in bright sunlight (site visits!) — high contrast, no grey-on-grey.

## 6. Anti-clutter checklist (apply to every screen before ship)
☐ One primary CTA. ☐ ≤ 5 choices visible. ☐ Zero jargon (or tooltip-explained). ☐ Number formatting Indian. ☐ Hindi verified by native speaker. ☐ Loads < 2.5s on 4G. ☐ Thumb-reachable primary action. ☐ Works as a screenshot forwarded on WhatsApp (self-explanatory).
