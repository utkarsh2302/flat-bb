# 04 — TRD: Technical Requirements & Architecture

**Version:** 1.0 | Assumes current stack ≈ Next.js (Vercel) frontend + API backend, three panels (client/broker/admin), multi-tenant white-label.

## 1. Architecture principles
1. **One platform, many verticals:** plots, apartments and commercial share a **generalised inventory core**; verticals differ by unit attributes and lifecycle workflows, enabled by feature flags per tenant/project.
2. **Multi-tenant white-label:** tenant = builder brand. Isolation at DB row level (`tenant_id` everywhere) + per-tenant theming (logo, palette, domain), per-tenant module entitlements, per-tenant payment-gateway credentials (money must settle to the *builder's* account, ideally the RERA-designated project account).
3. **Event-driven lifecycle:** unit/booking/payment state changes emit events → notification service (WhatsApp/SMS/email/push), ledger postings, webhooks. Prevents the "CRM says X, buyer sees Y" drift.
4. **Mobile-first, low-bandwidth:** SSR + aggressive image optimisation; Tower Explorer as SVG/vector by default (KBs, not MBs); 3D as progressive enhancement.
5. **Audit everything:** immutable audit log on pricing, status, ledger, and milestone certifications — this is what makes us "RERA-audit-ready" as a selling point.

## 2. Core data model (key entities)

```
Tenant (builder) ─┬─ Project ─┬─ Phase ─┬─ Tower ─┬─ Floor ─┬─ Unit
                  │           │         │         │         └─ UnitAttribute (typed, per vertical)
                  │           │         │         └─ MilestonePlan ─ Milestone ─ MilestoneEvidence
                  │           │         └─ RateCard / PLCRule / SchemeRule
                  │           └─ Document (templates & generated)
                  ├─ Party (buyer/co-applicant/investor/tenant-brand/CP) + KYC
                  ├─ Lead ─ Activity ─ SiteVisit         (pre-sales)
                  ├─ Hold ─ EOI ─ Booking ─ Agreement    (transaction)
                  ├─ PaymentPlan ─ ScheduleLine ─ DemandLetter ─ Payment ─ Receipt ─ LedgerEntry
                  ├─ Loan (sanction, tranches)
                  ├─ SnagList ─ SnagItem ─ Possession
                  ├─ Lease (commercial) ─ EscalationRule ─ RevenueShareRule ─ CAMPool ─ Invoice
                  ├─ PayoutRun ─ OwnerPayout (strata investor distribution)
                  ├─ CommissionRule ─ CommissionLedger (CP)
                  └─ Referral / Ticket / Notification / AuditLog
```

**Unit generalisation:** `Unit(type: plot|apartment|shop|office|kiosk, status, area_carpet, area_builtup, area_super, facing, floor_id, price_base, attrs JSONB)`. Vertical-specific attributes (Vastu entrance, frontage_ft, power_kw, footfall_zone…) live in typed JSONB validated per vertical schema — one inventory engine, three verticals. **Unit status machine:** `available → held(expiry) → eoi → booked → agreement → registered → possessed` (residential) / `available → loi → leased → fitout → trading → vacated` (lease). Concurrency: holds acquired via atomic DB transaction with TTL; single source of truth — the same status the buyer sees is the one sales sees.

## 3. Services / modules
- **Inventory Service** (units, status machine, holds w/ TTL release jobs)
- **Pricing Service** (rate cards, floor-rise, PLC, schemes, cost-sheet render → PDF)
- **Booking Service** (EOI, KYC, agreements; e-sign/e-stamp adapters)
- **Ledger & Billing Service** (double-entry postings; demand letters; receipts; commercial invoicing/CAM; GST fields; interest engine)
- **Progress Service** (milestones, evidence upload w/ EXIF geo/time verification, certification workflow, RERA export)
- **Notification Service** (WhatsApp Business API via BSP e.g. Gupshup/Interakt; SMS DLT-registered; email; FCM push; template manager per tenant)
- **Payments Adapter** (Razorpay/Cashfree/PayU per tenant; UPI intent; webhooks → ledger; refunds)
- **CP/Commission Service**; **Lease Service** (commercial); **Payout Service** (investor distributions)
- **Analytics** (event pipeline → warehouse; dashboards)
- **Media pipeline** (uploads → transcode/compress; drone video → timelapse job; CDN)

## 4. Key integrations
| Need | Options (India) |
|---|---|
| Payments/UPI | Razorpay, Cashfree, PayU (route to builder's account; escrow-aware) |
| WhatsApp Business | Meta Cloud API via Gupshup / Interakt / WATI |
| e-Sign / e-Stamp | Aadhaar eSign (NSDL/Protean via Signzy, Leegality, Digio); SHCIL e-stamp where state-supported |
| KYC | PAN verify, Aadhaar OKYC, video-KYC (Signzy/HyperVerge) for NRI |
| Maps | Google Maps / Mappls (MapmyIndia) |
| Lead sources | 99acres/MagicBricks/Housing lead APIs, Meta Lead Ads, Google Ads webhooks |
| Accounting | Tally export (XML), Zoho Books API |
| Society bridge | Mygate/NoBrokerHood data export (CSV/API where available) |
| 3D premium tier | PropVR/SolidTwin-class embed, or in-house Three.js viewer with GLB models |

## 5. Non-functional requirements
- **Performance:** LCP < 2.5s on 4G mid-range Android; Tower Explorer interactive < 1s after load; API p95 < 300ms.
- **Scale:** design for 100 tenants × 50 projects × 2,000 units; booking-day spikes (launch events) 500 concurrent holds — load-test the hold path.
- **Availability:** 99.9%; payment and ledger paths idempotent (webhook retries).
- **Security:** OWASP ASVS L2; RBAC per panel + field-level (CP price masking); PII encryption at rest; DPDP Act 2023 compliance (consent records, data-deletion workflow, purpose limitation); OTP + optional TOTP for admin; signed URLs for documents; complete audit trail.
- **Compliance:** GST-correct invoices; TDS (194-IA) prompts on receipts > ₹50L; RERA quarterly export formats per state (config-driven); DLT-registered SMS templates.
- **Localisation:** i18n framework with EN/HI at parity; number formats in lakh/crore; dates DD-MM-YYYY; more languages config-only.
- **Offline-tolerant site app:** site-engineer progress uploads must queue offline and sync (construction sites have poor networks).

## 6. Platform surfaces
- **Buyer:** responsive PWA (installable) → optional React Native wrapper later for push-notification reliability.
- **Admin & CP:** responsive web; CP needs a strong mobile web experience (they live in the field).
- **Site engineer:** dedicated minimal PWA (camera-first, offline queue).

## 7. Migration & reuse from plots
Reusable as-is (~60%): auth/OTP, tenant theming, project CMS, map/SVG interaction engine (extend from parcel polygons to floor plates), lead/enquiry, broker portal shell, resale, track-booking, notification plumbing. New: floor/tower hierarchy, pricing engine, ledger/demand system, progress service, possession, lease/CAM/payout. Plot projects migrate onto the generalised Unit model in Phase 1 (regression-test the demo app).

## 8. Risks & mitigations
| Risk | Mitigation |
|---|---|
| 3D content cost per project scares mid-market builders | Tier-1 SVG explorer default; 3D as paid add-on |
| Payment disputes on EOI refunds | Clear refund policy engine + automated refunds + audit trail |
| WhatsApp template rejections / policy changes | BSP relationship + fallback SMS/email for every critical message |
| State-wise RERA/stamp variance | Config-driven state packs; launch states: RJ + MH first |
| Builder data quality (Excel imports) | Guided importer with validation + onboarding service team |
| Ledger correctness (money!) | Double-entry design, immutable postings, reconciliation reports, extensive test suite before Phase 2 GA |
