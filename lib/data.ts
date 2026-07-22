// In-memory data layer + types. Deterministic seed (stable across renders,
// so no hydration mismatch). No DB tonight — this is the single source of truth.
// Money math lives in pricing.ts (imports these types; this file imports nothing
// from pricing to avoid cycles).

export type Facing = "N" | "E" | "S" | "W" | "NE" | "NW" | "SE" | "SW";
export type UnitStatus = "available" | "held" | "booked";

export interface Unit {
  id: string; // "T1-12A"
  towerId: string;
  floor: number;
  letter: string; // "A".."D"
  bhk: 2 | 3 | 4;
  carpetSqft: number;
  builtupSqft: number;
  superSqft: number;
  facing: Facing;
  vastuEntrance: Facing; // door-facing direction
  corner: boolean;
  viewTags: string[];
  plcPerSqft: number; // preferential-location premium, ₹/sq.ft
  status: UnitStatus;
}

export interface Tower {
  id: string;
  name: string;
  floors: number;
  baseRatePerSqft: number;
  premiumView: string | null; // e.g. "Aravalli view"
  reraNo: string;
}

export interface ProjectCharges {
  clubCharges: number; // fixed
  corpusPerSqft: number; // one-time sinking fund
  advanceMaintPerSqftPerMonth: number;
  advanceMaintMonths: number;
  legalCharges: number; // fixed
  parking2bhk: number;
  parking3bhk: number;
  parking4bhk: number;
}

export interface StatePack {
  state: string;
  gstPct: number; // on construction value
  stampDutyPct: number; // on agreement value
  registrationPct: number;
  tdsThreshold: number; // TDS 194-IA note above this
}

export interface Project {
  id: string;
  builder: string;
  name: string;
  tagline: string;
  city: string;
  locality: string;
  reraNo: string;
  possession: string; // ISO
  heroImage: string;
  charges: ProjectCharges;
  state: StatePack;
}

export interface PortfolioProject {
  id: string;
  name: string;
  config: string;
  locality: string;
  city: string;
  reraNo: string;
  status: "ongoing" | "ready";
  image: string; // clean card thumbnail
  hero?: string; // higher-res image for the project's own detail hero
  flagship?: boolean;
}

export interface Milestone {
  id: string;
  label: string;
  pct: number; // % of consideration triggered
  status: "certified" | "in_progress" | "pending";
  certifiedOn: string | null; // ISO
  evidenceCount: number; // geo-tagged photos on record
}

export interface Booking {
  id: string;
  unitId: string;
  buyerName: string;
  applied: string; // ISO booking date
  plan: "CLP" | "down_payment";
}

export type LedgerKind = "demand" | "payment";
export interface LedgerEntry {
  id: string;
  date: string; // ISO
  kind: LedgerKind;
  particulars: string;
  milestoneId: string | null;
  amount: number; // demand = charge (+), payment = credit (-)
  receiptNo: string | null;
  mode: string | null;
}

export interface DemandLetter {
  id: string;
  milestoneId: string;
  raisedOn: string;
  dueOn: string;
  amount: number;
  paid: boolean;
}

export type SnagStatus = "reported" | "fixing" | "fixed" | "verified";
export interface SnagItem {
  id: string;
  room: string;
  issue: string;
  status: SnagStatus;
}

export interface ProgressPost {
  id: string;
  towerId: string;
  milestone: string;
  date: string;
  caption: string;
  certified: boolean;
  image: string;
}

export type LeadStatus = "new" | "visit_booked" | "eoi" | "booked" | "lost";
export interface Lead {
  id: string;
  name: string;
  phone: string;
  interest: string; // "3 BHK, Aravalli view"
  status: LeadStatus;
  taggedOn: string;
  validityDays: number;
  associateId: string;
}

export interface Associate {
  id: string;
  name: string;
  reraAgentNo: string;
  tier: "gold" | "silver";
  bookings: number;
  gmv: number; // gross booking value sourced
}

export interface CommissionEntry {
  id: string;
  associateId: string;
  unitId: string;
  buyerName: string;
  bookingValue: number;
  ratePct: number;
  stage: "on_booking" | "on_agreement" | "on_20pct";
  status: "accrued" | "invoiced" | "paid";
}

// ─────────────────────────────────────────────────────────────────────────────
// Static config
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY = {
  name: "Trimurty",
  legal: "Trimurty Colonizers & Builders Pvt. Ltd.",
  tagline: "Expertly Crafted Premium Living",
  city: "Jaipur",
  since: 1985,
  homesDelivered: "7,500+",
  logo: "/images/logo.svg",
  logoWhite: "/images/logo-white-grey.svg",
};

export const CONTACT = {
  phone: "+91 95095 00800",
  phoneAlt: "+91 90576 79000",
  email: "sales@trimurty.com",
  office: "601 Geeta Enclave, G-8, Vinoba Marg, C-Scheme, Jaipur 302001",
  hours: "Mon–Sat 10am–7pm · Sun 10am–3:30pm",
  whatsapp: "919509500800",
};

// Hero banners + lifestyle imagery (real Trimurty photography in /public/images).
export const HERO_IMAGES = [
  "/images/crimson-banner-1920.webp",
  "/images/banner-5-1920.webp",
  "/images/kachnar-banner-1920.webp",
];

// Real architect floor plans (Trimurty CAD drawings, /public/images/plans).
// Representative unit plans by configuration — labelled as such on the page.
export function planFor(bhk: number): string {
  if (bhk >= 4) return "/images/plans/unit-4bhk.webp";
  if (bhk === 3) return "/images/plans/unit-3bhk.webp";
  return "/images/plans/unit-2bhk.webp";
}

// Real interior/exterior renders (Trimurty, /public/images/rooms) for the unit gallery.
export const UNIT_GALLERY: { src: string; label: string }[] = [
  { src: "/images/rooms/drawing-dining.webp", label: "Living & dining" },
  { src: "/images/rooms/bedroom.webp", label: "Master bedroom" },
  { src: "/images/rooms/kitchen.webp", label: "Modular kitchen" },
  { src: "/images/rooms/bathroom.webp", label: "Bathroom" },
  { src: "/images/rooms/balcony.webp", label: "Balcony" },
  { src: "/images/rooms/facade.webp", label: "Building facade" },
];

export const PROJECT: Project = {
  id: "the-greater-jagatpura",
  builder: "Trimurty",
  name: "The Greater Jagatpura",
  tagline: "A landmark township rising on Tonk Road",
  city: "Jaipur",
  locality: "Shivdaspura, Tonk Road",
  reraNo: "RAJ/P/2024/2926",
  possession: "2027-12-01",
  heroImage: "/images/banner-5-1920.webp",
  charges: {
    clubCharges: 150000,
    corpusPerSqft: 50,
    advanceMaintPerSqftPerMonth: 3.5,
    advanceMaintMonths: 12,
    legalCharges: 25000,
    parking2bhk: 350000,
    parking3bhk: 350000,
    parking4bhk: 600000,
  },
  state: {
    state: "Rajasthan",
    gstPct: 5,
    stampDutyPct: 6,
    registrationPct: 1,
    tdsThreshold: 5000000,
  },
};

export const TOWERS: Tower[] = [
  {
    id: "T1",
    name: "Amer",
    floors: 18,
    baseRatePerSqft: 8200,
    premiumView: "Aravalli view",
    reraNo: "RAJ/P/2024/2926-T1",
  },
  {
    id: "T2",
    name: "Aravalli",
    floors: 18,
    baseRatePerSqft: 7400,
    premiumView: "Central-green view",
    reraNo: "RAJ/P/2024/2926-T2",
  },
  {
    id: "T3",
    name: "Nahargarh",
    floors: 16,
    baseRatePerSqft: 6800,
    premiumView: null,
    reraNo: "RAJ/P/2024/2926-T3",
  },
];

// The full Trimurty portfolio — real projects, real RERA, real photos.
export const PROJECTS: PortfolioProject[] = [
  { id: "the-greater-jagatpura", name: "The Greater Jagatpura", config: "2, 3 & 4 BHK residences", locality: "Shivdaspura, Tonk Road", city: "Jaipur", reraNo: "RAJ/P/2024/2926", status: "ongoing", image: "/images/greater-jagatpura.webp", flagship: true },
  { id: "crimson", name: "Crimson", config: "3 BHK Smart Residences", locality: "Devi Marg, Bani Park", city: "Jaipur", reraNo: "RAJ/P/2024/3196", status: "ongoing", image: "/images/crimson-thumbnail-350.webp", hero: "/images/crimson-banner-1920.webp" },
  { id: "kachnar", name: "Kachnar", config: "3 & 4 BHK residences", locality: "Hospital Road, C-Scheme", city: "Jaipur", reraNo: "RAJ/P/2023/2827", status: "ongoing", image: "/images/kachnar.webp", hero: "/images/kachnar-banner-1920.webp" },
  { id: "divinity", name: "Divinity", config: "3 & 4 BHK residences", locality: "Malviya Marg, C-Scheme", city: "Jaipur", reraNo: "RAJ/P/2021/1622", status: "ongoing", image: "/images/divinity.jpg" },
  { id: "valeria", name: "Valeria", config: "3 & 4 BHK residences", locality: "Azad Marg, C-Scheme", city: "Jaipur", reraNo: "RAJ/P/2022/1926", status: "ready", image: "/images/valeria.webp" },
  { id: "ariana", name: "Ariana", config: "2 & 3 BHK residences", locality: "Jagatpura", city: "Jaipur", reraNo: "RAJ/P/2017/017", status: "ready", image: "/images/ariana.jpg" },
  { id: "arabella", name: "Arabella", config: "2 & 3 BHK residences", locality: "Panipech", city: "Jaipur", reraNo: "RAJ/P/2017/027", status: "ready", image: "/images/arabella.webp" },
  { id: "gulmohar", name: "Gulmohar", config: "3 & 4 BHK residences", locality: "Bani Park", city: "Jaipur", reraNo: "RAJ/P/2017/569", status: "ready", image: "/images/gulmohar.jpg" },
];

export function getPortfolioProject(id: string): PortfolioProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}

// Neighbourhood / connectivity for the flagship (Shivdaspura, Tonk Road).
export interface Landmark {
  icon: string;
  label: string;
  distance: string;
}
export const NEIGHBOURHOOD: Landmark[] = [
  { icon: "✈️", label: "Jaipur International Airport", distance: "12 km · 20 min" },
  { icon: "🛣️", label: "Tonk Road / NH-52", distance: "2 min" },
  { icon: "🎓", label: "JECRC University", distance: "4 km" },
  { icon: "🏫", label: "Sanskar & Warburg schools", distance: "3 km" },
  { icon: "🏥", label: "Eternal & Narayana hospitals", distance: "8 km" },
  { icon: "🛍️", label: "World Trade Park mall", distance: "14 km" },
  { icon: "🏢", label: "Sitapura IT & Industrial hub", distance: "6 km" },
  { icon: "🚇", label: "Proposed metro corridor", distance: "5 min" },
];

// Construction milestones shared across the project (CLP trigger schedule).
export const MILESTONES: Milestone[] = [
  { id: "m-booking", label: "Booking", pct: 10, status: "certified", certifiedOn: "2026-01-15", evidenceCount: 0 },
  { id: "m-plinth", label: "Plinth completed", pct: 10, status: "certified", certifiedOn: "2026-03-20", evidenceCount: 8 },
  { id: "m-slab5", label: "5th slab cast", pct: 15, status: "certified", certifiedOn: "2026-05-28", evidenceCount: 10 },
  { id: "m-slab10", label: "10th slab cast", pct: 15, status: "certified", certifiedOn: "2026-07-08", evidenceCount: 12 },
  { id: "m-slab14", label: "14th slab cast", pct: 10, status: "in_progress", certifiedOn: null, evidenceCount: 6 },
  { id: "m-brickwork", label: "Brickwork", pct: 15, status: "pending", certifiedOn: null, evidenceCount: 0 },
  { id: "m-finishes", label: "Internal finishes", pct: 15, status: "pending", certifiedOn: null, evidenceCount: 0 },
  { id: "m-possession", label: "Possession", pct: 10, status: "pending", certifiedOn: null, evidenceCount: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic unit generation
// ─────────────────────────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface LetterSpec {
  letter: string;
  bhk: 2 | 3 | 4;
  carpet: number;
  built: number;
  sup: number;
  corner: boolean;
  facing: Facing;
  vastu: Facing;
}

const BASE_LETTERS: LetterSpec[] = [
  { letter: "A", bhk: 3, carpet: 1180, built: 1357, sup: 1650, corner: true, facing: "NE", vastu: "E" },
  { letter: "B", bhk: 2, carpet: 820, built: 943, sup: 1150, corner: false, facing: "E", vastu: "N" },
  { letter: "C", bhk: 2, carpet: 840, built: 966, sup: 1180, corner: false, facing: "W", vastu: "N" },
  { letter: "D", bhk: 3, carpet: 1230, built: 1414, sup: 1720, corner: true, facing: "SW", vastu: "S" },
];

// Top-3 floors: A/D become 4BHK penthouses.
const PENTHOUSE: Record<string, LetterSpec> = {
  A: { letter: "A", bhk: 4, carpet: 1720, built: 1978, sup: 2400, corner: true, facing: "NE", vastu: "E" },
  D: { letter: "D", bhk: 4, carpet: 1760, built: 2024, sup: 2450, corner: true, facing: "SW", vastu: "S" },
};

function statusFor(floor: number, floors: number, r: number): UnitStatus {
  // Lower floors mostly sold; higher floors mostly available; some holds.
  const height = floor / floors; // 0..1
  const soldChance = 0.75 - height * 0.6; // 0.75 low -> 0.15 top
  if (r < soldChance) return "booked";
  if (r < soldChance + 0.12) return "held";
  return "available";
}

function buildUnits(): Unit[] {
  const units: Unit[] = [];
  for (const tower of TOWERS) {
    const rng = mulberry32(hashSeed(tower.id));
    for (let floor = 1; floor <= tower.floors; floor++) {
      const isTop = floor > tower.floors - 3;
      for (const base of BASE_LETTERS) {
        const spec = isTop && PENTHOUSE[base.letter] ? PENTHOUSE[base.letter] : base;
        const highFloor = floor >= 10;
        const plcPerSqft =
          (spec.corner ? 150 : 0) + (highFloor && tower.premiumView ? 120 : 0);
        const viewTags: string[] = [];
        if (highFloor && tower.premiumView) viewTags.push(tower.premiumView);
        if (spec.corner) viewTags.push("Corner");
        if (floor <= 6 && base.letter === "B") viewTags.push("Pool-facing");
        units.push({
          id: `${tower.id}-${floor}${spec.letter}`,
          towerId: tower.id,
          floor,
          letter: spec.letter,
          bhk: spec.bhk,
          carpetSqft: spec.carpet,
          builtupSqft: spec.built,
          superSqft: spec.sup,
          facing: spec.facing,
          vastuEntrance: spec.vastu,
          corner: spec.corner,
          viewTags,
          plcPerSqft,
          status: statusFor(floor, tower.floors, rng()),
        });
      }
    }
  }
  return units;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const UNITS: Unit[] = buildUnits();

// Force one known available unit for demos/tests (deep-linkable).
const demoAvailable = UNITS.find((u) => u.id === "T1-12A");
if (demoAvailable) demoAvailable.status = "available";

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export function getTower(id: string): Tower | undefined {
  return TOWERS.find((t) => t.id === id);
}

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function unitsOfTower(towerId: string): Unit[] {
  return UNITS.filter((u) => u.towerId === towerId);
}

export function unitsOfFloor(towerId: string, floor: number): Unit[] {
  return UNITS.filter((u) => u.towerId === towerId && u.floor === floor).sort(
    (a, b) => a.letter.localeCompare(b.letter),
  );
}

export interface FloorSummary {
  floor: number;
  units: Unit[];
  available: number;
  held: number;
  booked: number;
}

/** Floors of a tower, highest first (matches an elevation view). */
export function floorsOfTower(towerId: string): FloorSummary[] {
  const tower = getTower(towerId);
  if (!tower) return [];
  const out: FloorSummary[] = [];
  for (let floor = tower.floors; floor >= 1; floor--) {
    const units = unitsOfFloor(towerId, floor);
    out.push({
      floor,
      units,
      available: units.filter((u) => u.status === "available").length,
      held: units.filter((u) => u.status === "held").length,
      booked: units.filter((u) => u.status === "booked").length,
    });
  }
  return out;
}

export interface AvailabilityStats {
  total: number;
  available: number;
  held: number;
  booked: number;
  pctSold: number;
}

export function availability(units: Unit[] = UNITS): AvailabilityStats {
  const total = units.length;
  const available = units.filter((u) => u.status === "available").length;
  const held = units.filter((u) => u.status === "held").length;
  const booked = units.filter((u) => u.status === "booked").length;
  return {
    total,
    available,
    held,
    booked,
    pctSold: total ? Math.round((booked / total) * 100) : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo buyer booking (drives the "My Home" post-booking area)
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_BOOKING: Booking = {
  id: "BK-2026-0087",
  unitId: "T2-11B",
  buyerName: "Ananya Sharma",
  applied: "2026-01-15",
  plan: "CLP",
};

export const DEMO_LEDGER: LedgerEntry[] = [
  { id: "l1", date: "2026-01-15", kind: "demand", particulars: "On booking (10%)", milestoneId: "m-booking", amount: 985000, receiptNo: null, mode: null },
  { id: "l2", date: "2026-01-15", kind: "payment", particulars: "EOI / token", milestoneId: "m-booking", amount: -51000, receiptNo: "RCP-1001", mode: "UPI" },
  { id: "l3", date: "2026-01-22", kind: "payment", particulars: "Booking balance", milestoneId: "m-booking", amount: -934000, receiptNo: "RCP-1044", mode: "NEFT" },
  { id: "l4", date: "2026-03-22", kind: "demand", particulars: "Plinth completed (10%)", milestoneId: "m-plinth", amount: 985000, receiptNo: null, mode: null },
  { id: "l5", date: "2026-03-30", kind: "payment", particulars: "Plinth stage", milestoneId: "m-plinth", amount: -985000, receiptNo: "RCP-1190", mode: "Bank loan" },
  { id: "l6", date: "2026-05-30", kind: "demand", particulars: "5th slab cast (15%)", milestoneId: "m-slab5", amount: 1477500, receiptNo: null, mode: null },
  { id: "l7", date: "2026-06-05", kind: "payment", particulars: "5th slab stage", milestoneId: "m-slab5", amount: -1477500, receiptNo: "RCP-1355", mode: "Bank loan" },
  { id: "l8", date: "2026-07-10", kind: "demand", particulars: "10th slab cast (15%)", milestoneId: "m-slab10", amount: 1477500, receiptNo: null, mode: null },
];

export const DEMO_DEMAND: DemandLetter = {
  id: "DL-2026-0311",
  milestoneId: "m-slab10",
  raisedOn: "2026-07-10",
  dueOn: "2026-07-24",
  amount: 1477500,
  paid: false,
};

export const DEMO_SNAGS: SnagItem[] = [
  { id: "s1", room: "Living", issue: "Hairline crack near window frame", status: "fixing" },
  { id: "s2", room: "Kitchen", issue: "Chimney point not wired", status: "reported" },
  { id: "s3", room: "Master bath", issue: "Tap leaks slightly", status: "fixed" },
  { id: "s4", room: "Balcony", issue: "Railing paint chipped", status: "verified" },
];

export const PROGRESS_FEED: ProgressPost[] = [
  { id: "p1", towerId: "T2", milestone: "Slab 14 of 18", date: "2026-07-15", caption: "14th floor slab shuttering in progress — casting next week.", certified: false, image: "/images/kachnar-banner-1920.webp" },
  { id: "p2", towerId: "T2", milestone: "Slab 10 of 18", date: "2026-07-08", caption: "10th slab cast and cured. Certified by the project architect.", certified: true, image: "/images/banner-5-1920.webp" },
  { id: "p3", towerId: "T1", milestone: "Slab 12 of 18", date: "2026-07-06", caption: "Amer tower crossing the 12th floor.", certified: true, image: "/images/crimson-banner-1920.webp" },
  { id: "p4", towerId: "T2", milestone: "Slab 5 of 18", date: "2026-05-28", caption: "5th slab complete — podium and parking done below.", certified: true, image: "/images/high-living-standards.jpg" },
  { id: "p5", towerId: "T3", milestone: "Plinth completed", date: "2026-04-02", caption: "Nahargarh tower plinth completed.", certified: true, image: "/images/going-green.jpg" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Associates + leads + commissions (broker panel)
// ─────────────────────────────────────────────────────────────────────────────

export const ASSOCIATES: Associate[] = [
  { id: "A1", name: "Verma Realty", reraAgentNo: "RAJ/A/2024/118", tier: "gold", bookings: 14, gmv: 168000000 },
  { id: "A2", name: "Deepak Estates", reraAgentNo: "RAJ/A/2024/205", tier: "silver", bookings: 6, gmv: 71000000 },
  { id: "A3", name: "Marwar Homes", reraAgentNo: "RAJ/A/2025/061", tier: "silver", bookings: 4, gmv: 44000000 },
];

export const CURRENT_ASSOCIATE = "A1";

export const LEADS: Lead[] = [
  { id: "L1", name: "Rohit Malviya", phone: "98290 11223", interest: "3 BHK, Aravalli view", status: "eoi", taggedOn: "2026-07-12", validityDays: 90, associateId: "A1" },
  { id: "L2", name: "Sana Kadri", phone: "99280 44551", interest: "2 BHK, high floor", status: "visit_booked", taggedOn: "2026-07-14", validityDays: 90, associateId: "A1" },
  { id: "L3", name: "Prakash Jain", phone: "94140 88123", interest: "4 BHK penthouse", status: "new", taggedOn: "2026-07-16", validityDays: 90, associateId: "A1" },
  { id: "L4", name: "Meena Rathore", phone: "90019 22007", interest: "3 BHK, Lake view", status: "booked", taggedOn: "2026-06-02", validityDays: 90, associateId: "A1" },
  { id: "L5", name: "Imran Shaikh", phone: "70140 55190", interest: "2 BHK, budget ₹90L", status: "new", taggedOn: "2026-07-17", validityDays: 90, associateId: "A2" },
];

export const COMMISSIONS: CommissionEntry[] = [
  { id: "C1", associateId: "A1", unitId: "T2-11B", buyerName: "Ananya Sharma", bookingValue: 9850000, ratePct: 2, stage: "on_20pct", status: "paid" },
  { id: "C2", associateId: "A1", unitId: "T1-14D", buyerName: "Meena Rathore", bookingValue: 15600000, ratePct: 2, stage: "on_agreement", status: "invoiced" },
  { id: "C3", associateId: "A1", unitId: "T3-9A", buyerName: "Rohit Malviya", bookingValue: 11200000, ratePct: 1.5, stage: "on_booking", status: "accrued" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Admin: collections + approvals inbox
// ─────────────────────────────────────────────────────────────────────────────

export interface CollectionRow {
  buyerName: string;
  unitId: string;
  towerId: string;
  demanded: number;
  paid: number;
  overdueDays: number; // 0 = current
}

export const COLLECTION_ROWS: CollectionRow[] = [
  { buyerName: "Ananya Sharma", unitId: "T2-11B", towerId: "T2", demanded: 5910000, paid: 4432500, overdueDays: 0 },
  { buyerName: "Meena Rathore", unitId: "T1-14D", towerId: "T1", demanded: 7020000, paid: 5616000, overdueDays: 12 },
  { buyerName: "Rohit Malviya", unitId: "T3-9A", towerId: "T3", demanded: 3360000, paid: 3360000, overdueDays: 0 },
  { buyerName: "Kabir Nathani", unitId: "T1-7C", towerId: "T1", demanded: 4100000, paid: 2870000, overdueDays: 34 },
  { buyerName: "Fatima Qureshi", unitId: "T2-5A", towerId: "T2", demanded: 4620000, paid: 3234000, overdueDays: 7 },
  { buyerName: "Suresh Bhati", unitId: "T3-12D", towerId: "T3", demanded: 5040000, paid: 2520000, overdueDays: 61 },
];

export type ApprovalType = "discount" | "refund" | "certification";
export interface Approval {
  id: string;
  type: ApprovalType;
  title: string;
  detail: string;
  requestedBy: string;
  amount: number | null;
}

export const APPROVALS: Approval[] = [
  { id: "AP1", type: "discount", title: "Discount 4% on T1-16A", detail: "Verma Realty requests ₹5.6L off for a ready buyer (penthouse).", requestedBy: "Verma Realty (CP)", amount: 560000 },
  { id: "AP2", type: "refund", title: "EOI refund — T2-3C", detail: "Buyer cancelled within cooling-off; refund token per policy.", requestedBy: "Ananya (Finance)", amount: 51000 },
  { id: "AP3", type: "certification", title: "Certify 14th slab — T2", detail: "Site engineer uploaded 6 geo-tagged photos. Certify to release demands.", requestedBy: "Site engineer (T2)", amount: null },
  { id: "AP4", type: "discount", title: "Waive floor-rise — T3-4B", detail: "Launch-scheme waiver of floor-rise for early booking.", requestedBy: "Deepak Estates (CP)", amount: 118000 },
];
