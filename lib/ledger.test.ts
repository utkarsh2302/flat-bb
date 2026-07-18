import { test } from "node:test";
import assert from "node:assert/strict";
import { withRunningBalance, ledgerTotals } from "./ledger";
import { DEMO_LEDGER } from "./data";

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
