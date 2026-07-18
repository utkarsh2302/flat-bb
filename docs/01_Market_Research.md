# 01 — Market Research: Indian Builder Software for Apartments, Commercial & Malls

## 1. Segments and who serves them today

### 1.1 Builder CRMs (pre-sales + post-sales) — the crowded middle
| Player | What they do | Weakness we exploit |
|---|---|---|
| **Sell.Do** | AI-first real-estate-exclusive CRM: lead management, AI call analysis (extracts budget/BHK/possession timeline from calls), site-visit scheduling, online booking module, post-sales (KYC, docs, loans), broker module, RERA-ready. Positioned #1 for mid-to-large developers. | Internal tool first; buyer-facing experience is generic; not white-label consumer-grade; expensive for small builders. |
| **DaeBuild** | 200+ developers, 100,000+ units, 1,500+ projects. Full builder journey: pre-sales, booking/invoicing, demand letters, unit blocking, floor-plan pricing, construction-milestone payment tracking, RERA docs, white-label buyer mobile app with account statements. | Closest functional competitor. But dated UX, ERP-feel, no interactive 3D inventory, no strong consumer web experience, weak on discovery/marketing side. |
| **HomeLead** | WhatsApp-native CRM for mid-size builders, AI features, full lifecycle, transparent pricing. | CRM-centric; buyer experience thin; no 3D; no commercial vertical. |
| **LeadSquared / Salesforce / HubSpot** | Generic lead automation, used by large developers. | Not real-estate-native; heavy customisation cost; zero buyer-facing product. |
| **Tranquil, PropFlo, In4Suite (ERP)** | Sales automation / full construction ERP. | ERP complexity, poor UX, long implementations. |

**Takeaway:** the CRM war is won on internal features. Nobody wins on the *buyer's phone screen*. Our plot product already lives there.

### 1.2 Digital booking / online unit selection
Online apartment booking flows exist (e.g., IRIS-type portals): buyer does KYC → token payment → tower selection → unit selection → 10-minute hold → cost sheet + payment schedule → block unit → email/SMS receipts, allotment letter. This proved Indian buyers *will* book flats online when the flow is trustworthy. But these are clunky portals bolted onto CRMs, not delightful branded apps. COVID-era digital launches (large listing platforms ran online booking events) normalised EOI + refundable token online.

### 1.3 3D / digital twin sales platforms
- **PropVR** (India/UAE/KSA; used by Prestige, Brigade), **SolidTwin**, global players like **3DEstate** and **R2U**: browser-based interactive 3D of the whole building — every unit, floor, view, live availability, finish configurators, sunlight-by-time-of-day simulation. 3DEstate reports website conversion uplifts of 50–200% with a 3D twin.
- These are **content/visualisation vendors** — they don't own booking, payments, ledger, CRM or post-sales. Builders must stitch 3–4 vendors together.

**Takeaway:** the single biggest whitespace is **3D inventory + transactions + lifecycle in one white-label product**. We can start with a pragmatic 2.5D/SVG tower explorer (like our plot maps) and upgrade to full 3D per project budget.

### 1.4 Post-sales, payments & compliance
- **RERA reality:** payments must follow Construction-Linked Plans; builders upload quarterly progress to state RERA portals; demand letters must match certified milestones; mismatched records can qualify the RERA audit with penalties up to 5% of project cost. Manual demand letters typically delay collections by 18–40 days per booking — on a ₹70L ticket with a 10% milestone, that's ₹7L per booking stuck per week.
- Buyers are told (by banks, media) to verify the milestone before paying a demand letter — visits, photos, progress reports. **Builders who *prove* progress get paid faster.** This is the insight behind our verified-progress → demand-letter gating feature.
- Home loans on under-construction property disburse tranche-wise against demand letters; final disbursement typically requires the OC. Buyers juggle builder + bank + their own ledger with zero tooling.
- Possession: pre-possession inspection, snagging list before signing the possession letter, OC verification, maintenance start dates. Entirely offline/WhatsApp today; a major dispute zone and NPS killer.

### 1.5 Post-possession community management
**Mygate** (27,000+ societies) and peers own society/RWA management: maintenance billing, visitor management, facility booking, accounting. We should **not** compete here in Phase 1–3; instead, offer a "society bridge": builder-run maintenance billing during the pre-RWA period (builder legally manages the society for ~1–2 years post-possession), then export/integrate to Mygate-class tools. This pre-RWA window is a genuine unserved gap.

### 1.6 Commercial & mall management
- Global: **Yardi Voyager, MRI, RealPage, VTS** — lease administration, CAM reconciliation, percentage/revenue-share rent, tenant portals, foot-traffic analytics. Enterprise price points, long implementations, not localised (GST invoicing, Indian lease customs, stamp duty).
- India: **In4Suite Mall Management** (term sheets, revenue-share agreements, bulk rental invoicing, food-court POS integration, WhatsApp bots, tenant portal), **Property-xRM** (interactive stacking plan, digital walkthroughs, LOD attachments). Both are ERP-grade, sold to large mall operators.
- **Unserved:** (a) mid-market malls and high-street commercial complexes in Tier-2 cities (Jaipur has dozens); (b) **strata-sold commercial** — units sold to small investors with assured-rental or lease-management promises. This model is everywhere in Rajasthan/NCR and has *no* dedicated software: the developer must sell units like residential, then run leasing like a mall, then distribute rent to hundreds of investor-owners. That's three products in one — and it's exactly our sweet spot (sales engine + leasing engine + ledger).

## 2. Buyer-side behaviour (India-specific)
1. **WhatsApp is the OS.** Every artefact (cost sheet, receipt, demand letter, progress photo) must be a WhatsApp-shareable card/PDF. CRMs without native WhatsApp create untracked parallel threads.
2. **Family purchase.** Average 3–5 decision-makers; shareable links and a guest "family view" of a shortlisted unit matter.
3. **Vastu, floor, direction, view** are primary filters for flats — most portals bury them.
4. **Trust deficit** is the dominant emotion for under-construction purchases post-2016 (stalled projects era). Transparency features are conversion features.
5. **NRI money** is large in Jaipur/Navi Mumbai corridors: remote booking, video KYC, POA workflows, foreign remittance guidance.
6. **Hindi/vernacular first** for Tier-2; our EN/हिं toggle is already ahead of nearly all competitors.

## 3. Sizing & pricing signals
- Indian CRMs price from ~₹1,500–₹4,000/user/month (Sell.Do class) to lakhs/year for ERPs; DaeBuild-class white-label app deals run ₹3–15L/year per developer. Mall ERPs (In4Suite/Yardi) run ₹10L–₹1Cr+ implementations.
- Our model (per-project or per-unit SaaS + setup fee for 3D content) can undercut ERPs while charging *more* than plain CRMs because we replace 3–4 vendors (CRM + booking portal + 3D vendor + buyer app).

## 4. Conclusions feeding the PRDs
1. Lead with the **buyer experience** (Tower Explorer + booking + transparency); back office follows the data.
2. **Collections automation** (CLP → demand letters → ledger → payments) is the module builders will *pay the most for* — it directly accelerates crores of cash flow.
3. **Verified construction progress** is our trust flywheel, unique in market.
4. Enter commercial via **strata-sold complexes** (reuses our sales engine) before pure mall ERP features.
5. Don't build society management; bridge to it.
