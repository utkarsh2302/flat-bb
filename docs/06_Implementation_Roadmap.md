# 06 — Implementation Roadmap: What, When, Who

## Guiding rules
1. **Ship with a design-partner builder each phase** — real project, real buyers, co-marketing rights.
2. **Sell what accelerates the builder's cash first** (booking + collections), then what delights buyers, then commercial.
3. Every module behind per-tenant feature flags → tiered packaging from day one.

---

## Phase 0 — Foundation (Weeks 0–4)
- Generalise inventory model (Unit/Tower/Floor + JSONB attrs); migrate plot projects onto it; regression-test demo app.
- Multi-tenant hardening: module entitlements, per-tenant payment credentials, theming tokens.
- Sign residential design partner (launching high-rise, 100–400 units, RJ or MH).
**Exit:** plots run on the new core; partner signed; state pack RJ/MH configured.

## Phase 1 — Residential Discovery & Booking MVP (Months 1–3)
**Build:** Tower Explorer Tier-1 (SVG) with filters & live status • Unit pages (plans, facing/Vastu, views, compare, family share) • Cost Sheet Generator + PDF/WhatsApp • EOI flow with hold + UPI + receipts + allotment letter • CP portal: live inventory, lead tagging w/ validity, EOI-on-behalf • Admin: tower setup wizard, rate cards, holds/EOI dashboard • EMI-vs-rent calculator • Hindi parity.
**Exit criteria:** partner project live; first 25 digital EOIs; discovery→EOI < 5 min on 4G; tower onboarding < 1 day.

## Phase 2 — Payments, Ledger, Progress ("the money phase", Months 3–6)
**Build:** CLP payment plans + schedule per unit • Milestone certification workflow (site-engineer PWA, offline queue, geo/time-verified photos) • Auto demand letters w/ evidence + payment links + reminders + interest • Digital Khata buyer ledger + receipts • Collections cockpit • Booking completion: full KYC, agreement templates, e-sign/e-stamp adapter • Progress feed + timelapse • RERA quarterly export • Notification service GA (WhatsApp BSP + DLT SMS + email).
**Exit:** demand letters T+24h after certification; ≥ 90% payments auto-posted to ledger; buyer support calls down 30% at partner.
**⚠ Quality gate:** ledger double-entry test suite + reconciliation report signed off by a CA before GA.

## Phase 3 — Lifecycle Completion & Growth (Months 6–9)
**Build:** Possession scheduler + digital snagging + handover vault + society bridge (pre-RWA maintenance billing, Mygate export) • Loan desk (sanction/tranche tracking, bank letter packs) • Referral engine + reward wallet • Portal/Meta lead-source integrations + source ROI • NRI mode (video-KYC, POA checklist) • Admin analytics v1 (funnel, tower heat, CP leaderboard) • Optional React Native wrapper for push.
**Exit:** 3–5 paying residential tenants; NPS > 50 at partner; referral bookings ≥ 5%.

## Phase 4 — Commercial Vertical (Months 9–14)
**4a (9–11): Strata-sold engine** — Stacking Plan explorer w/ commercial attributes (frontage, footfall zone, power) • ROI/yield cost sheets • commercial booking templates (assured-rental addendum) • **Investor payout module** (rent collection → pro-rata owner payouts + statements). Design partner: one Jaipur commercial-complex developer.
**4b (11–14): Lease & mall ops** — Leasing CRM (enquiry→LOI→lease) • Lease admin (escalations, lock-ins, renewal alerts, revenue-share rules) • Bulk GST invoicing + CAM engine (pools, pro-rata, annual reconciliation) • Tenant portal (invoices, payments, tickets, fit-out workflow) • Ops ticketing + PM schedules.
**Exit:** 1 strata complex + 1 mall/high-street asset live; CAM reconciliation validated by client's CA.

## Phase 5 — Intelligence & Moats (Months 14+)
AI lead scoring & next-best-action for sales teams • AI pricing suggestions (velocity-based floor/PLC premiums) • Tenant-mix optimiser & tenant health scores • Footfall integration (camera/sensor) + tenant dashboards • Voice/vernacular AI assistant on WhatsApp ("मेरी अगली किस्त कब है?") • Interior/fit-out marketplace • Predictive delay alerts from progress cadence.

---

## Team plan (lean)
| Phase | Eng | Design | Product | QA | Onboarding/CS |
|---|---|---|---|---|---|
| 0–1 | 4 (2 FE, 2 BE) | 1 | 1 | 1 | 0.5 |
| 2–3 | 6 (+1 BE payments, +1 mobile/PWA) | 1 | 1 | 1–2 | 1 |
| 4 | 7–8 | 1–2 | 1–2 | 2 | 2 |

## Dependencies & procurement checklist
WhatsApp BSP account + template approvals (start Week 2 — lead time!) • Payment-gateway tenant onboarding flow (KYB per builder) • e-sign/e-stamp vendor (Leegality/Digio/Signzy) contract by Month 3 • DLT SMS registration per tenant • Drone-photography partner network (per-project service) • CA advisor for ledger/GST/RERA validation (retainer).

## Top risks to the timeline
1. Ledger correctness delays Phase 2 GA → mitigate with CA sign-off gate + shadow-run against builder's Tally for one month.
2. Design partner's construction pace ≠ our demo needs → keep a second partner warm.
3. 3D expectations set by big-builder demos → sell Tier-1 SVG confidently; price 3D as add-on.
4. Commercial pulled early by a big prospect → resist before Phase 3 exit; strata (4a) is the only acceptable pull-forward since it reuses residential.
