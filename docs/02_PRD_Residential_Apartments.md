# 02 — PRD: Residential Vertical (Apartments / High-Rise / Group Housing)

**Version:** 1.0 | **Status:** Draft for review | **Owner:** Product
**Applies to:** the white-label platform's three panels — Client (buyer), Associate (broker), Admin (builder) — extended from plots to vertical inventory.

---

## 1. Problem statements

**Buyer:** "I'm spending ₹40L–₹2Cr on something that doesn't exist yet. I can't see which flats are actually available, what the real all-in price is, whether construction is on schedule, or where my money went. Everything is a phone call, a visit, or a WhatsApp forward."

**Builder:** "My inventory lives in an Excel sheet guarded by one sales head. Cost sheets are typed manually and inconsistent. Demand letters go out weeks late and collections lag by crores. My CP (channel partner) network fights over leads. RERA quarterly filings are a scramble. Buyers call my office 30 times between booking and possession."

**Broker/CP:** "I can't see live availability or pricing, so I over-promise. My commission status is opaque. I re-type client details into the builder's forms."

## 2. Goals & success metrics

| Goal | Metric | Target (12 months post-launch per project) |
|---|---|---|
| Digitise inventory & discovery | % of enquiries that used Tower Explorer before site visit | > 60% |
| Online booking adoption | % bookings with digital EOI/token | > 40% |
| Faster collections | Days from milestone certification → demand letter sent | < 24 hours (from 18–40 days industry norm) |
| Buyer trust / NPS | Buyer NPS at 6 months post-booking | > 50 |
| CP productivity | CP-sourced bookings via portal | > 70% of CP bookings |
| Support deflection | Buyer calls to builder office per booking per month | –50% |

## 3. Personas
1. **Buyer (primary):** 28–55, salaried/business, Tier-1/2 India, decides with family, WhatsApp-first, may be NRI. Low patience for clutter; high anxiety about hidden charges and delays.
2. **Builder Admin / Sales Head:** manages inventory, pricing, approvals, collections dashboards.
3. **Builder Finance/CRM exec:** demand letters, receipts, ledgers, RERA filings, bank coordination.
4. **Site Engineer:** uploads milestone progress evidence from mobile, on-site.
5. **Channel Partner (Associate):** registers leads, books site visits, tracks commissions.
6. **Bank/HFC officer (secondary):** consumes demand letters, ledgers, NOC/APF docs for disbursement.

## 4. Feature specification

### EPIC A — Vertical Inventory & Discovery (Client panel)

**A1. Interactive Tower Explorer** *(flagship — the vertical analogue of our plot map)*
- Project page shows master layout → towers as tappable cards/3D blocks.
- Tap a tower → **elevation view**: floors stacked, each floor colour-coded by availability (available / on-hold / booked / sold — same colour language as our plot maps).
- Tap a floor → **floor plate view**: units on the plate with area, type (2/3/4 BHK), facing, price band.
- Tap a unit → **Unit Detail**: furnished-scale floor plan, dimensions per room, carpet/built-up/super area, facing & Vastu orientation compass, floor number, view tags ("Aravalli view", "pool-facing", "road-facing"), PLC applicable, live status, price, cost-sheet CTA, "Book Site Visit" and "Reserve with EOI" CTAs.
- **Filters:** BHK, budget, floor band (low/mid/high), facing (N/E/S/W), Vastu (entrance direction), view, availability.
- Rendering tiers (builder chooses per project budget): Tier-1 SVG/2.5D interactive elevation (our in-house build, default), Tier-2 static-render hotspots, Tier-3 full WebGL 3D twin (partner/premium).

**A2. Experience layer**
- **Sun-path simulation:** slider for time-of-day/season showing light on the selected unit's facing (computed from orientation + floor; no 3D required for Tier-1 — directional heuristic + visual).
- **View from your floor:** drone photos captured at 3–4 heights per tower, mapped to floor bands ("view from 12th floor").
- **360° sample flat tour** embed; **compare units** (up to 3, side-by-side price/area/facing/floor).
- **EMI vs Rent calculator** and loan eligibility estimator on every unit page.
- **Family share:** shareable read-only unit link with cost sheet; opens without login.

**A3. Live Cost Sheet Generator** *(trust feature #1)*
- Itemised: base rate × area, floor-rise charge, PLC (view/corner), parking, club/amenity charges, maintenance corpus + advance maintenance, legal/documentation, GST, stamp duty & registration (state-configurable), TDS note (>₹50L), total all-in.
- One tap: PDF download + WhatsApp share, branded, versioned, with validity date.
- Admin controls: rate cards per tower/floor-band, PLC rules, scheme toggles (e.g., "no floor-rise this month"), approval workflow for discounts beyond X%.

### EPIC B — Digital Booking Engine

**B1. EOI / token flow:** select unit → 15-minute hold timer → KYC-lite (name, phone OTP, PAN) → pay token via UPI/card/netbanking → instant receipt + allotment provisional letter on WhatsApp/email. Configurable: refundable EOI vs booking amount; queue if unit contested; **price-lock** validity (e.g., 7 days to complete booking at locked price).
- Admin: hold-duration config, auto-release, EOI-to-booking conversion dashboard, refund workflow.

**B2. Booking completion:** full KYC (Aadhaar/PAN, co-applicants, photos), payment-plan selection (CLP/down-payment/flexi — templates per project), agreement generation from templates with merge fields, **e-stamp + e-sign (Aadhaar eSign)** where state permits, else print-ready.

**B3. Applicant portal ("My Home"):** the buyer's logged-in home — unit summary, documents vault (allotment, agreement, receipts, demand letters, NOCs), ledger, construction progress, payment schedule, referral, support tickets.

### EPIC C — Payments, Ledger & Collections *(revenue feature #1 for builders)*

**C1. Construction-Linked Payment Autopilot**
- Per-project milestone plan (e.g., booking 10% → plinth 10% → each slab X% → brickwork → finishes → possession) mapped per unit per buyer.
- **Milestone certification workflow:** site engineer marks milestone + uploads evidence → architect/admin certifies → system **auto-generates demand letters** for all affected units with buyer-specific amounts, interest on overdue, due dates → dispatch via WhatsApp + email + in-app, with payment link.
- Auto-reminders (D-7, D-1, overdue with configurable interest), part-payment support, receipt auto-generation, ledger auto-posting.

**C2. Digital Khata (buyer ledger)** — buyer-visible running ledger: every demand, payment, receipt number, mode, date, balance; downloadable statement matching builder books. (Doubles as the bank-ready statement for loan disbursement.)

**C3. Loan desk:** buyer marks "loan-funded"; system tracks sanction → tranche disbursements against demand letters → flags gaps; APF (approved project finance) document pack per bank downloadable; optional lender-partner marketplace (Phase 3).

**C4. Collections cockpit (Admin):** ageing buckets, tower-wise outstanding, milestone-wise collection %, defaulters list, one-click bulk reminders, cancellation workflow with forfeiture rules.

### EPIC D — Verified Construction Progress *(trust flywheel — unique)*
- **Weekly geo-tagged, timestamped photos** per tower uploaded from the site-engineer mobile view; monthly drone shots; auto-compiled **timelapse**.
- Milestone status board per tower visible to every buyer ("Slab 14/22 complete ✅ — certified 12 Jul 2026").
- **Hard link:** a demand letter cannot be issued unless its milestone is certified with evidence — and the buyer sees the evidence *inside* the demand letter. ("Pay because you can see it's built.")
- RERA helper: quarterly progress export (photos + % complete + collections) formatted for state RERA portal filing.

### EPIC E — Possession & Handover
- Possession scheduler (slot booking for inspection), **digital snagging**: room-by-room checklist, photo-tagged snags, builder assignment, rectification status, re-inspection, buyer sign-off.
- OC/CC status displayed; final demand + dues clearance; possession letter e-signed; **"Key Handover" moment screen** (shareable congratulation card — organic marketing).
- Handover vault: warranties (lifts, fittings), manuals, society docs; 5-year structural-defect ticket category per RERA.
- **Society bridge:** builder-run maintenance billing for pre-RWA period; data export to Mygate-class apps at RWA formation.

### EPIC F — Channel Partner (Associate panel) extensions
- CP registration with RERA agent number; **lead tagging with 60/90-day validity** (anti-conflict: first-tag-wins with audit trail — the #1 CP dispute).
- Live inventory + cost-sheet access (prices maskable per CP tier); site-visit booking; EOI on behalf of client.
- **Commission ledger:** slab-wise rules per project, milestone-based payout tracking (on booking / on agreement / on X% collection), invoice upload, TDS visibility.
- CP leaderboard, spot-incentive campaigns, marketing-asset kit (auto-branded creatives per CP).

### EPIC G — Growth
- **Referral engine:** existing customers/residents refer with a personal link; reward wallet (adjust against dues/maintenance or gift). Activates the builder's happy-family base — Riyasat alone has 11,000+ families.
- Lead capture from portals (99acres/MagicBricks/Housing webhooks), Meta/Google lead forms → auto-assignment, dedupe, source ROI dashboard.
- **NRI mode:** country-code onboarding, video-KYC slot booking, POA checklist, remittance instructions, time-zone-aware RM callbacks.

## 5. Non-goals (this PRD)
Society/RWA management (bridge only), rental brokerage residential resale marketplace (keep existing plot-resale pattern), construction-side ERP (procurement/BOQ/contractor billing), interior-design marketplace (Phase 5+ idea).

## 6. Rollout & acceptance
MVP = EPIC A + B1 + cost sheets + F basics (see Doc 06 for sequencing). Each epic ships behind a per-project feature flag so different builders can buy different tiers. Acceptance criteria per story to be detailed in sprint docs; headline acceptance: a buyer can go from discovering a unit to paying an EOI **in under 5 minutes on a mid-range Android phone on 4G, in Hindi**.
