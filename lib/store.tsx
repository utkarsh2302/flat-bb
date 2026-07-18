"use client";

// Live application state — the single source of truth for everything MUTABLE.
// Static config (towers, rate cards, charges, project) stays in data.ts; this
// store holds what changes as people use the app: unit statuses, holds,
// bookings, ledgers, leads, commissions, snags, milestone certification,
// approvals, and an activity feed. Persisted to localStorage so it survives a
// refresh — actions in one panel show up in the others. No backend tonight.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  UNITS,
  TOWERS,
  MILESTONES,
  LEADS,
  COMMISSIONS,
  APPROVALS,
  DEMO_BOOKING,
  DEMO_LEDGER,
  DEMO_SNAGS,
  COLLECTION_ROWS,
  ASSOCIATES,
  getUnit,
  type UnitStatus,
  type LedgerEntry,
  type Lead,
  type LeadStatus,
  type CommissionEntry,
  type Milestone,
  type Approval,
  type SnagItem,
  type SnagStatus,
} from "./data";
import { unitAllIn } from "./pricing";

const PERSIST_KEY = "trimurty.app.v3";
const HOLD_MS = 15 * 60 * 1000;
const EOI = 51000;

export interface Booking {
  id: string;
  unitId: string;
  buyerName: string;
  phone: string;
  applied: string; // ISO
  plan: "CLP" | "down_payment";
  mine: boolean; // shows in "My Home"
  associateId?: string; // set when a broker booked on behalf
}

export type ActivityKind =
  | "hold"
  | "booking"
  | "payment"
  | "certify"
  | "lead"
  | "approval"
  | "snag"
  | "visit";

export interface SiteVisit {
  id: string;
  unitId: string | null;
  name: string;
  phone: string;
  date: string; // ISO date
  slot: string;
}

export interface ActivityEvent {
  id: string;
  at: string; // ISO
  kind: ActivityKind;
  message: string;
}

export interface AppState {
  unitStatus: Record<string, UnitStatus>;
  holds: Record<string, number>; // unitId -> expiry epoch ms
  bookings: Booking[];
  ledgers: Record<string, LedgerEntry[]>; // bookingId -> entries
  snags: Record<string, SnagItem[]>; // bookingId -> snags
  leads: Lead[];
  commissions: CommissionEntry[];
  milestones: Milestone[];
  approvals: (Approval & { decision?: "approved" | "rejected" })[];
  activity: ActivityEvent[];
  shortlist: string[]; // unit ids the buyer saved
  visits: SiteVisit[];
  partnerActive: Record<string, boolean>; // associate id -> active
}

// ── seed ──────────────────────────────────────────────────────────────────
function seed(): AppState {
  const unitStatus: Record<string, UnitStatus> = {};
  for (const u of UNITS) unitStatus[u.id] = u.status;

  const myBooking: Booking = {
    id: DEMO_BOOKING.id,
    unitId: DEMO_BOOKING.unitId,
    buyerName: DEMO_BOOKING.buyerName,
    phone: "98290 00000",
    applied: DEMO_BOOKING.applied,
    plan: DEMO_BOOKING.plan,
    mine: true,
  };

  // Existing buyers across the project (fixed dates -> deterministic, no
  // hydration drift). They make the builder cockpit look like a live project.
  const others = COLLECTION_ROWS.filter((r) => r.unitId !== DEMO_BOOKING.unitId);
  const bookings: Booking[] = [myBooking];
  const ledgers: Record<string, LedgerEntry[]> = { [DEMO_BOOKING.id]: DEMO_LEDGER };
  for (const r of others) {
    const id = `SEED-${r.unitId}`;
    unitStatus[r.unitId] = "booked";
    bookings.push({ id, unitId: r.unitId, buyerName: r.buyerName, phone: "", applied: "2026-04-01", plan: "CLP", mine: false });
    ledgers[id] = [
      { id: `${id}-d`, date: "2026-04-01", kind: "demand", particulars: "Cumulative demand", milestoneId: null, amount: r.demanded, receiptNo: null, mode: null },
      { id: `${id}-p`, date: "2026-05-15", kind: "payment", particulars: "Payments received", milestoneId: null, amount: -r.paid, receiptNo: "RCP-0000", mode: "Bank" },
    ];
  }

  return {
    unitStatus,
    holds: {},
    bookings,
    ledgers,
    snags: { [DEMO_BOOKING.id]: DEMO_SNAGS },
    leads: LEADS,
    commissions: COMMISSIONS,
    milestones: MILESTONES,
    approvals: APPROVALS,
    activity: [
      { id: "a0", at: "2026-07-15T09:00:00", kind: "certify", message: "Aravalli — 10th slab certified" },
      { id: "a1", at: "2026-07-16T11:30:00", kind: "booking", message: "New booking: T2-11B by Ananya Sharma" },
    ],
    shortlist: [],
    visits: [],
    partnerActive: Object.fromEntries(ASSOCIATES.map((a) => [a.id, true])),
  };
}

// ── actions ───────────────────────────────────────────────────────────────
type Action =
  | { type: "HYDRATE"; state: AppState }
  | { type: "HOLD"; unitId: string }
  | { type: "RELEASE_EXPIRED"; now: number }
  | { type: "BOOK"; unitId: string; buyerName: string; phone: string; mine: boolean; associateId?: string; id?: string }
  | { type: "PAY"; bookingId: string; amount: number; particulars: string }
  | { type: "CERTIFY"; milestoneId: string }
  | { type: "ADD_LEAD"; lead: Lead }
  | { type: "SET_LEAD"; id: string; status: LeadStatus }
  | { type: "ADD_SNAG"; bookingId: string; snag: SnagItem }
  | { type: "ADVANCE_SNAG"; bookingId: string; snagId: string }
  | { type: "DECIDE_APPROVAL"; id: string; decision: "approved" | "rejected" }
  | { type: "TOGGLE_SHORTLIST"; unitId: string }
  | { type: "BOOK_VISIT"; visit: SiteVisit }
  | { type: "CANCEL_BOOKING"; bookingId: string }
  | { type: "TOGGLE_PARTNER"; id: string }
  | { type: "RESET" };

const SNAG_FLOW: SnagStatus[] = ["reported", "fixing", "fixed", "verified"];

function ev(kind: ActivityKind, message: string): ActivityEvent {
  return { id: `e${Date.now()}${Math.floor(Math.random() * 1000)}`, at: new Date().toISOString(), kind, message };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "HOLD": {
      const u = getUnit(action.unitId);
      if (!u) return state;
      return {
        ...state,
        unitStatus: { ...state.unitStatus, [action.unitId]: "held" },
        holds: { ...state.holds, [action.unitId]: Date.now() + HOLD_MS },
        activity: [ev("hold", `${action.unitId} held for a buyer (15 min)`), ...state.activity].slice(0, 40),
      };
    }

    case "RELEASE_EXPIRED": {
      const expired = Object.entries(state.holds).filter(([, exp]) => exp <= action.now).map(([id]) => id);
      if (expired.length === 0) return state;
      const unitStatus = { ...state.unitStatus };
      const holds = { ...state.holds };
      for (const id of expired) {
        // only release if still just "held" (not converted to booked)
        if (unitStatus[id] === "held") unitStatus[id] = "available";
        delete holds[id];
      }
      return { ...state, unitStatus, holds };
    }

    case "BOOK": {
      const u = getUnit(action.unitId);
      if (!u) return state;
      const allIn = unitAllIn(u);
      const bookingDemand = Math.round(allIn * 0.1);
      const id = action.id ?? `BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      const holds = { ...state.holds };
      delete holds[action.unitId];
      const booking: Booking = {
        id,
        unitId: action.unitId,
        buyerName: action.buyerName,
        phone: action.phone,
        applied: new Date().toISOString().slice(0, 10),
        plan: "CLP",
        mine: action.mine,
        associateId: action.associateId,
      };
      const ledger: LedgerEntry[] = [
        { id: `${id}-d0`, date: booking.applied, kind: "demand", particulars: "On booking (10%)", milestoneId: "m-booking", amount: bookingDemand, receiptNo: null, mode: null },
        { id: `${id}-p0`, date: booking.applied, kind: "payment", particulars: "EOI / token", milestoneId: "m-booking", amount: -EOI, receiptNo: `RCP-${Math.floor(Math.random() * 9000) + 1000}`, mode: "UPI" },
      ];
      const commissions = action.associateId
        ? [
            {
              id: `C${Date.now()}`,
              associateId: action.associateId,
              unitId: action.unitId,
              buyerName: action.buyerName,
              bookingValue: allIn,
              ratePct: 2,
              stage: "on_booking" as const,
              status: "accrued" as const,
            },
            ...state.commissions,
          ]
        : state.commissions;
      return {
        ...state,
        unitStatus: { ...state.unitStatus, [action.unitId]: "booked" },
        holds,
        bookings: [booking, ...state.bookings],
        ledgers: { ...state.ledgers, [id]: ledger },
        commissions,
        activity: [ev("booking", `New booking: ${action.unitId} by ${action.buyerName}${action.associateId ? " (via associate)" : ""}`), ...state.activity].slice(0, 40),
      };
    }

    case "PAY": {
      const existing = state.ledgers[action.bookingId] ?? [];
      const entry: LedgerEntry = {
        id: `${action.bookingId}-p${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        kind: "payment",
        particulars: action.particulars,
        milestoneId: null,
        amount: -Math.abs(action.amount),
        receiptNo: `RCP-${Math.floor(Math.random() * 9000) + 1000}`,
        mode: "UPI",
      };
      return {
        ...state,
        ledgers: { ...state.ledgers, [action.bookingId]: [...existing, entry] },
        activity: [ev("payment", `Payment received: ₹${action.amount.toLocaleString("en-IN")} on ${action.bookingId}`), ...state.activity].slice(0, 40),
      };
    }

    case "CERTIFY": {
      const m = state.milestones.find((x) => x.id === action.milestoneId);
      if (!m || m.status === "certified") return state;
      const milestones = state.milestones.map((x) =>
        x.id === action.milestoneId ? { ...x, status: "certified" as const, certifiedOn: new Date().toISOString().slice(0, 10) } : x,
      );
      // Generate a demand for every booked unit, sized by the milestone %.
      const ledgers = { ...state.ledgers };
      let affected = 0;
      for (const b of state.bookings) {
        if (state.unitStatus[b.unitId] !== "booked") continue;
        const u = getUnit(b.unitId);
        if (!u) continue;
        const amount = Math.round((unitAllIn(u) * m.pct) / 100);
        const entry: LedgerEntry = {
          id: `${b.id}-dm${action.milestoneId}`,
          date: new Date().toISOString().slice(0, 10),
          kind: "demand",
          particulars: `${m.label} (${m.pct}%)`,
          milestoneId: m.id,
          amount,
          receiptNo: null,
          mode: null,
        };
        ledgers[b.id] = [...(ledgers[b.id] ?? []), entry];
        affected++;
      }
      return {
        ...state,
        milestones,
        ledgers,
        activity: [ev("certify", `${m.label} certified — demand letters sent to ${affected} buyers`), ...state.activity].slice(0, 40),
      };
    }

    case "ADD_LEAD":
      return {
        ...state,
        leads: [action.lead, ...state.leads],
        activity: [ev("lead", `New lead tagged: ${action.lead.name}`), ...state.activity].slice(0, 40),
      };

    case "SET_LEAD":
      return { ...state, leads: state.leads.map((l) => (l.id === action.id ? { ...l, status: action.status } : l)) };

    case "ADD_SNAG":
      return {
        ...state,
        snags: { ...state.snags, [action.bookingId]: [action.snag, ...(state.snags[action.bookingId] ?? [])] },
        activity: [ev("snag", `Snag reported: ${action.snag.room} — ${action.snag.issue}`), ...state.activity].slice(0, 40),
      };

    case "ADVANCE_SNAG": {
      const list = state.snags[action.bookingId] ?? [];
      return {
        ...state,
        snags: {
          ...state.snags,
          [action.bookingId]: list.map((s) =>
            s.id === action.snagId
              ? { ...s, status: SNAG_FLOW[Math.min(SNAG_FLOW.indexOf(s.status) + 1, SNAG_FLOW.length - 1)] }
              : s,
          ),
        },
      };
    }

    case "DECIDE_APPROVAL":
      return {
        ...state,
        approvals: state.approvals.map((a) => (a.id === action.id ? { ...a, decision: action.decision } : a)),
        activity: [ev("approval", `Approval ${action.decision}: ${state.approvals.find((a) => a.id === action.id)?.title ?? ""}`), ...state.activity].slice(0, 40),
      };

    case "TOGGLE_SHORTLIST": {
      const has = state.shortlist.includes(action.unitId);
      return {
        ...state,
        shortlist: has
          ? state.shortlist.filter((id) => id !== action.unitId)
          : [action.unitId, ...state.shortlist],
      };
    }

    case "BOOK_VISIT":
      return {
        ...state,
        visits: [action.visit, ...state.visits],
        activity: [ev("visit", `Site visit booked: ${action.visit.name}${action.visit.unitId ? ` · ${action.visit.unitId}` : ""} (${action.visit.slot})`), ...state.activity].slice(0, 40),
      };

    case "CANCEL_BOOKING": {
      const b = state.bookings.find((x) => x.id === action.bookingId);
      if (!b) return state;
      const ledgers = { ...state.ledgers };
      delete ledgers[action.bookingId];
      return {
        ...state,
        unitStatus: { ...state.unitStatus, [b.unitId]: "available" },
        bookings: state.bookings.filter((x) => x.id !== action.bookingId),
        ledgers,
        commissions: state.commissions.filter((c) => c.unitId !== b.unitId),
        activity: [ev("booking", `Booking cancelled: ${b.unitId} (${b.buyerName}) — unit released`), ...state.activity].slice(0, 40),
      };
    }

    case "TOGGLE_PARTNER":
      return {
        ...state,
        partnerActive: { ...state.partnerActive, [action.id]: !(state.partnerActive[action.id] ?? true) },
      };

    case "RESET":
      return seed();

    default:
      return state;
  }
}

// ── context ─────────────────────────────────────────────────────────────────
interface Ctx {
  s: AppState;
  ready: boolean;
  hold: (unitId: string) => void;
  book: (a: { unitId: string; buyerName: string; phone: string; mine: boolean; associateId?: string; id?: string }) => void;
  pay: (bookingId: string, amount: number, particulars: string) => void;
  certify: (milestoneId: string) => void;
  addLead: (lead: Lead) => void;
  setLead: (id: string, status: LeadStatus) => void;
  addSnag: (bookingId: string, snag: SnagItem) => void;
  advanceSnag: (bookingId: string, snagId: string) => void;
  decideApproval: (id: string, decision: "approved" | "rejected") => void;
  toggleShortlist: (unitId: string) => void;
  bookVisit: (visit: SiteVisit) => void;
  cancelBooking: (bookingId: string) => void;
  togglePartner: (id: string) => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, seed);
  // hydrate from localStorage after mount (avoids SSR mismatch)
  const [ready, setReady] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) as AppState });
    } catch {
      /* ignore */
    }
    setReady();
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s, ready]);

  // auto-release expired holds
  useEffect(() => {
    const t = setInterval(() => dispatch({ type: "RELEASE_EXPIRED", now: Date.now() }), 15000);
    return () => clearInterval(t);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      s,
      ready,
      hold: (unitId) => dispatch({ type: "HOLD", unitId }),
      book: (a) => dispatch({ type: "BOOK", ...a }),
      pay: (bookingId, amount, particulars) => dispatch({ type: "PAY", bookingId, amount, particulars }),
      certify: (milestoneId) => dispatch({ type: "CERTIFY", milestoneId }),
      addLead: (lead) => dispatch({ type: "ADD_LEAD", lead }),
      setLead: (id, status) => dispatch({ type: "SET_LEAD", id, status }),
      addSnag: (bookingId, snag) => dispatch({ type: "ADD_SNAG", bookingId, snag }),
      advanceSnag: (bookingId, snagId) => dispatch({ type: "ADVANCE_SNAG", bookingId, snagId }),
      decideApproval: (id, decision) => dispatch({ type: "DECIDE_APPROVAL", id, decision }),
      toggleShortlist: (unitId) => dispatch({ type: "TOGGLE_SHORTLIST", unitId }),
      bookVisit: (visit) => dispatch({ type: "BOOK_VISIT", visit }),
      cancelBooking: (bookingId) => dispatch({ type: "CANCEL_BOOKING", bookingId }),
      togglePartner: (id) => dispatch({ type: "TOGGLE_PARTNER", id }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [s, ready],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}

// ── derived selectors ───────────────────────────────────────────────────────
export function liveAvailability(s: AppState, unitIds?: string[]) {
  const ids = unitIds ?? Object.keys(s.unitStatus);
  let available = 0, held = 0, booked = 0;
  for (const id of ids) {
    const st = s.unitStatus[id];
    if (st === "available") available++;
    else if (st === "held") held++;
    else if (st === "booked") booked++;
  }
  const total = ids.length;
  return { total, available, held, booked, pctSold: total ? Math.round((booked / total) * 100) : 0 };
}

export function myBookings(s: AppState): Booking[] {
  return s.bookings.filter((b) => b.mine);
}

export function primaryBooking(s: AppState): Booking | null {
  return myBookings(s)[0] ?? null;
}

export interface CollectionRowLive {
  bookingId: string;
  buyerName: string;
  unitId: string;
  towerId: string;
  demanded: number;
  paid: number;
  outstanding: number;
}

export function collectionsLive(s: AppState): CollectionRowLive[] {
  return s.bookings.map((b) => {
    const t = ledgerTotalsFor(s, b.id);
    const u = getUnit(b.unitId);
    return {
      bookingId: b.id,
      buyerName: b.buyerName,
      unitId: b.unitId,
      towerId: u?.towerId ?? "",
      demanded: t.demanded,
      paid: t.paid,
      outstanding: t.outstanding,
    };
  });
}

export function ledgerTotalsFor(s: AppState, bookingId: string) {
  const entries = s.ledgers[bookingId] ?? [];
  const demanded = entries.filter((e) => e.kind === "demand").reduce((t, e) => t + e.amount, 0);
  const paid = entries.filter((e) => e.kind === "payment").reduce((t, e) => t - e.amount, 0);
  return { demanded, paid, outstanding: demanded - paid };
}

export function towerUnitIds(towerId: string): string[] {
  return UNITS.filter((u) => u.towerId === towerId).map((u) => u.id);
}

export { TOWERS };
