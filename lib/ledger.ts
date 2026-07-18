// Buyer ledger ("Digital Khata") math. Demands are positive charges, payments
// are negative credits; balance is the running amount still owed.

import type { LedgerEntry } from "./data";

export interface LedgerRow extends LedgerEntry {
  balance: number;
}

export function withRunningBalance(entries: LedgerEntry[]): LedgerRow[] {
  let bal = 0;
  return entries.map((e) => {
    bal += e.amount;
    return { ...e, balance: bal };
  });
}

export interface LedgerTotals {
  demanded: number;
  paid: number;
  outstanding: number;
}

// ── Demand / overdue math ──────────────────────────────────────────────────
export const GRACE_DAYS = 14; // days from demand raised to due
export const OVERDUE_RATE_PCT = 12; // simple interest p.a. on overdue (RERA-typical)

/** Due date = raised date + grace period. */
export function dueOn(dateISO: string): string {
  return new Date(new Date(dateISO).getTime() + GRACE_DAYS * 864e5).toISOString().slice(0, 10);
}

/** Whole days a demand is past its due date (0 if not overdue / today unknown). */
export function overdueDays(dueISO: string, todayISO: string): number {
  if (!todayISO) return 0;
  const d = Math.floor((new Date(todayISO).getTime() - new Date(dueISO).getTime()) / 864e5);
  return d > 0 ? d : 0;
}

/** Simple interest accrued on an overdue amount. */
export function overdueInterest(outstanding: number, days: number): number {
  return Math.round((outstanding * (OVERDUE_RATE_PCT / 100) * days) / 365);
}

export function ledgerTotals(entries: LedgerEntry[]): LedgerTotals {
  const demanded = entries
    .filter((e) => e.kind === "demand")
    .reduce((t, e) => t + e.amount, 0);
  const paid = entries
    .filter((e) => e.kind === "payment")
    .reduce((t, e) => t - e.amount, 0); // payments are negative
  return { demanded, paid, outstanding: demanded - paid };
}
