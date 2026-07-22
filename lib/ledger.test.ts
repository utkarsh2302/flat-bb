import { test } from "node:test";
import assert from "node:assert/strict";
import { withRunningBalance, ledgerTotals, dueOn, overdueDays, overdueInterest, GRACE_DAYS, OVERDUE_RATE_PCT } from "./ledger";
import { DEMO_LEDGER } from "./data";

test("dueOn adds the grace period", () => {
  const raised = "2026-04-01";
  const expected = new Date(new Date(raised).getTime() + GRACE_DAYS * 864e5).toISOString().slice(0, 10);
  assert.equal(dueOn(raised), expected);
});

test("overdueDays: 0 before due, positive after", () => {
  assert.equal(overdueDays("2026-07-01", "2026-06-01"), 0);
  assert.equal(overdueDays("2026-06-01", "2026-07-01"), 30);
  assert.equal(overdueDays("2026-06-01", ""), 0); // unknown today
});

test("overdueInterest is simple interest p.a.", () => {
  assert.equal(overdueInterest(1000000, 365), Math.round((1000000 * OVERDUE_RATE_PCT) / 100));
  assert.equal(overdueInterest(1000000, 0), 0);
});

test("running balance ends at outstanding", () => {
  const rows = withRunningBalance(DEMO_LEDGER);
  const totals = ledgerTotals(DEMO_LEDGER);
  assert.equal(rows[rows.length - 1].balance, totals.outstanding);
});

test("totals: demanded and paid are non-negative and consistent", () => {
  const t = ledgerTotals(DEMO_LEDGER);
  assert.ok(t.demanded > 0);
  assert.ok(t.paid > 0);
  assert.equal(t.outstanding, t.demanded - t.paid);
});

test("running balance never negative for this schedule (demands precede payments)", () => {
  const rows = withRunningBalance(DEMO_LEDGER);
  for (const r of rows) assert.ok(r.balance >= 0, `negative balance at ${r.id}`);
});
