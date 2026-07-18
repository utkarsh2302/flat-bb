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

export function ledgerTotals(entries: LedgerEntry[]): LedgerTotals {
  const demanded = entries
    .filter((e) => e.kind === "demand")
    .reduce((t, e) => t + e.amount, 0);
  const paid = entries
    .filter((e) => e.kind === "payment")
    .reduce((t, e) => t - e.amount, 0); // payments are negative
  return { demanded, paid, outstanding: demanded - paid };
}
