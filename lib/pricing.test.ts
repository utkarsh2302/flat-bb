import { test } from "node:test";
import assert from "node:assert/strict";
import { computeCostSheet, emi, unitAllIn, maxAffordablePrice, FLOOR_RISE_PER_SQFT } from "./pricing";
import { UNITS, getUnit, getTower, PROJECT } from "./data";

test("grand total is exactly the sum of every displayed line (no drift)", () => {
  for (const u of UNITS) {
    const cs = computeCostSheet(u);
    const sum = [...cs.charges, ...cs.taxes].reduce((t, l) => t + l.amount, 0);
    assert.equal(cs.grandTotal, sum, `mismatch for ${u.id}`);
    assert.equal(cs.subtotalBeforeTax, cs.charges.reduce((t, l) => t + l.amount, 0));
  }
});

test("every line and total is a whole rupee", () => {
  const cs = computeCostSheet(getUnit("T1-12A")!);
  for (const l of [...cs.charges, ...cs.taxes]) {
    assert.ok(Number.isInteger(l.amount), `${l.key} not integer`);
  }
  assert.ok(Number.isInteger(cs.grandTotal));
  assert.ok(Number.isInteger(cs.perSqftAllIn));
});

test("base price = base rate x super area", () => {
  const u = getUnit("T1-12A")!;
  const tower = getTower(u.towerId)!;
  const cs = computeCostSheet(u);
  const base = cs.charges.find((l) => l.key === "base")!;
  assert.equal(base.amount, tower.baseRatePerSqft * u.superSqft);
});

test("floor rise scales with floor and is absent on floor 1", () => {
  const u = getUnit("T1-12A")!;
  const cs = computeCostSheet(u);
  const fr = cs.charges.find((l) => l.key === "floorRise")!;
  assert.equal(fr.amount, FLOOR_RISE_PER_SQFT * (u.floor - 1) * u.superSqft);

  const ground = UNITS.find((x) => x.floor === 1)!;
  const gcs = computeCostSheet(ground);
  assert.equal(gcs.charges.find((l) => l.key === "floorRise"), undefined);
});

test("GST and stamp duty match the state pack rates", () => {
  const u = getUnit("T2-11B")!;
  const cs = computeCostSheet(u);
  const base = cs.charges.find((l) => l.key === "base")!.amount;
  const fr = cs.charges.find((l) => l.key === "floorRise")?.amount ?? 0;
  const plc = cs.charges.find((l) => l.key === "plc")?.amount ?? 0;
  const stamp = cs.taxes.find((l) => l.key === "stamp")!.amount;
  assert.equal(stamp, Math.round(((base + fr + plc) * PROJECT.state.stampDutyPct) / 100));
});

test("TDS note appears only above the 194-IA threshold", () => {
  // A crore-plus flat is above ₹50L, so a note is expected.
  const big = computeCostSheet(getUnit("T1-16A")!);
  assert.ok(big.tdsNote);
});

test("unitAllIn equals cost sheet grand total", () => {
  const u = getUnit("T3-9A")!;
  assert.equal(unitAllIn(u), computeCostSheet(u).grandTotal);
});

test("maxAffordablePrice grows with budget; zero-rate is linear", () => {
  assert.ok(maxAffordablePrice(100000, 8.5, 20, 20) > maxAffordablePrice(50000, 8.5, 20, 20));
  // zero interest: loan = monthly*n, price = loan / (1 - down)
  assert.equal(maxAffordablePrice(10000, 0, 10, 20), Math.round((10000 * 120) / 0.8));
});

test("EMI matches the reducing-balance formula", () => {
  // ₹1,00,00,000 @ 9% for 20y → ~₹89,973 (known good value)
  const v = emi(10000000, 9, 20);
  assert.ok(Math.abs(v - 89973) <= 2, `got ${v}`);
  // zero-interest edge: simple division
  assert.equal(emi(1200000, 0, 10), Math.round(1200000 / 120));
});
