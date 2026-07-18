# 03 — PRD: Commercial Vertical (Commercial Complexes, Retail, Malls)

**Version:** 1.0 | **Status:** Draft for review
**Key insight:** Indian commercial splits into two business models, and we must serve both — often in the *same building*:

- **Model 1 — Strata-sold:** developer sells shops/offices to individual investors (dominant in Tier-2: Jaipur commercial complexes, high-street retail). Sales journey ≈ residential; then leasing + rent distribution to investor-owners.
- **Model 2 — Lease-only (mall/Grade-A):** developer retains ownership and leases to brands. Journey = leasing CRM + lease admin + CAM + tenant operations.

No Indian product handles Model 1 end-to-end; global ERPs (Yardi/MRI) and Indian ERPs (In4Suite, Property-xRM) partially handle Model 2 at enterprise prices. Our entry: **Model 1 first (reuses our residential engine ~70%), then Model 2 modules.**

---

## 1. Personas
1. **Investor-buyer:** buys a 300 sq.ft shop for rental yield; cares about ROI, assured-rental terms, tenant quality, monthly payout.
2. **Brand/tenant:** national chain or local retailer; cares about location, frontage, footfall, fit-out timeline, CAM transparency.
3. **Mall/leasing manager:** occupancy, tenant mix, revenue-share collection, renewals.
4. **Mall operations head:** CAM, tickets, housekeeping/security vendors, events.
5. **Broker/IPC:** commercial leasing brokers with mandate tracking.

## 2. Goals & metrics
| Goal | Metric | Target |
|---|---|---|
| Digitise commercial sales (Model 1) | % strata units sold with digital cost sheet/EOI | > 50% |
| Leasing velocity (Model 2) | Enquiry → LOI cycle time | –30% |
| Collections | Rent+CAM collected by due date | > 92% |
| Investor trust | Payout statement disputes / month | < 2% of owners |
| Occupancy intelligence | Vacancy visible in real time | 100% units |

## 3. Feature specification

### EPIC H — Commercial Inventory & Discovery
**H1. Interactive Stacking Plan / Mall Map** — the commercial Tower Explorer:
- Floor-wise interactive plates: units coloured by status (available / LOI / leased / sold / fit-out / trading).
- Unit attributes commercial buyers actually filter by: **frontage (ft), floor, visibility rating, footfall zone (atrium/anchor-adjacent/corridor), ceiling height, power load (kW), HVAC provision, food-court/F&B permission, washroom access, signage rights**.
- Anchor tenants shown on map (a Zudio on the map sells the adjacent units) — with tenant-logo permissioning.
- Same rendering tiers as residential (SVG default → 3D premium); digital walkthroughs per unit.

**H2. Commercial cost sheet / ROI sheet (Model 1)**
- Itemised price + GST (commercial GST rules) + stamp duty; **rental-yield calculator**: expected rent/sq.ft, assured-rental scheme terms (X% for Y years), payback period, comparison vs FD. Downloadable, WhatsApp-shareable — the investor's decision document.

**H3. Digital booking (Model 1)** — reuse residential EPIC B with commercial templates (allotment, builder-buyer agreement, assured-rental addendum, tripartite investor-developer-tenant formats).

### EPIC I — Leasing Lifecycle (Model 2 + post-sale Model 1)
**I1. Leasing CRM:** brand enquiry pipeline (enquiry → site visit → proposal → term sheet → LOI → agreement → fit-out → trading); mandate/broker tracking; brand database with category tags.
**I2. Lease administration:**
- Lease objects with: term, lock-in, rent-free/fit-out period, security deposit, **escalation rules** (e.g., 15%/3 years or 5%/year), **revenue-share / percentage rent** (min. guarantee vs % of sales, whichever higher), CAM rate, marketing fund contribution, exclusivity/negative covenants, renewal/termination notices.
- Auto-alerts: escalation due, lock-in expiry, renewal window (T-180/90/30), insurance & fire-NOC expiry.
- Document vault per lease; amendment history.
**I3. Tenant sales reporting (for revenue share):** tenant portal monthly sales declaration + POS-integration option; auto-computation of percentage rent; variance flags.

### EPIC J — Billing, CAM & Finance
- **Bulk invoicing:** rent + CAM + electricity/water sub-meter reads + chilled water/HVAC + marketing fund, GST-compliant invoices (place-of-supply, RCM cases), e-invoice ready.
- **CAM engine:** cost pools (housekeeping, security, common power, AMC) → pro-rata by leasable area or custom shares → monthly provisional + annual reconciliation statement per tenant.
- Collections cockpit: ageing, interest on delay, cheque-bounce workflow, deposit adjustments.
- **Investor payout module (Model 1 — unique):** rent collected from tenant → TDS → management fee → pro-rata distribution to unit owners; monthly **owner payout statement** ("your shop earned ₹41,250 this month"); annual statements for ITR. This module alone can win every strata developer in Rajasthan/NCR.

### EPIC K — Tenant & Operations Portal
- Tenant app/portal: invoices & online payment, ticket raising (with SLA tracking), fit-out approval workflow (drawing submission → approvals → deposit → permit-to-work), staff/vehicle passes, event & marketing calendar, sales upload.
- Ops: ticket assignment to vendors, preventive-maintenance schedules (lifts, DG, fire), checklist audits with photos.
- **Footfall dashboard (Phase 5):** integrate counting cameras/sensors; share zone-wise footfall with tenants (transparency = retention) and use in leasing pitches.

### EPIC L — Analytics for the asset owner
Occupancy & vacancy heat map, trading density (sales/sq.ft where reported), category mix vs target mix, expiring-lease revenue at risk, CAM recovery %, collection efficiency, tenant health scores (late payments + falling sales = churn risk).

## 4. Non-goals
Full construction ERP, mall POS systems (integrate only), parking systems (integrate), 24/7 helpdesk BPO. Multiplex/entertainment ticketing.

## 5. Sequencing (see Doc 06)
Phase 4a: EPIC H + Model-1 booking + investor payout (fastest revenue, max reuse). Phase 4b: lease admin + CAM + tenant portal. Phase 5: revenue-share/POS, footfall, analytics AI.
