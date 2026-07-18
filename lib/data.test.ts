import { test } from "node:test";
import assert from "node:assert/strict";
import {
  UNITS,
  TOWERS,
  getUnit,
  DEMO_BOOKING,
  COLLECTION_ROWS,
  availability,
  floorsOfTower,
} from "./data";

test("unit ids are unique", () => {
  const ids = new Set(UNITS.map((u) => u.id));
  assert.equal(ids.size, UNITS.length);
});

test("every unit sits on a valid floor of a known tower", () => {
  for (const u of UNITS) {
    const tower = TOWERS.find((t) => t.id === u.towerId);
    assert.ok(tower, `unknown tower ${u.towerId}`);
    assert.ok(u.floor >= 1 && u.floor <= tower!.floors, `${u.id} floor out of range`);
    assert.ok(["available", "held", "booked"].includes(u.status));
    assert.ok([2, 3, 4].includes(u.bhk));
    assert.ok(u.superSqft >= u.builtupSqft && u.builtupSqft >= u.carpetSqft, `${u.id} area order`);
  }
});

test("availability counts partition the set", () => {
  const s = availability(UNITS);
  assert.equal(s.available + s.held + s.booked, s.total);
  assert.equal(s.total, UNITS.length);
});

test("the deep-link demo unit exists and is available", () => {
  const u = getUnit("T1-12A");
  assert.ok(u);
  assert.equal(u!.status, "available");
});

test("demo booking references a real unit", () => {
  assert.ok(getUnit(DEMO_BOOKING.unitId));
});

test("collection rows never show paid exceeding demanded", () => {
  for (const r of COLLECTION_ROWS) {
    assert.ok(r.paid <= r.demanded, `${r.unitId} overpaid`);
    assert.ok(getUnit(r.unitId), `${r.unitId} missing`);
  }
});

test("floorsOfTower is ordered high floor first and complete", () => {
  const f = floorsOfTower("T1");
  assert.equal(f.length, TOWERS.find((t) => t.id === "T1")!.floors);
  assert.equal(f[0].floor, TOWERS.find((t) => t.id === "T1")!.floors);
  assert.equal(f[f.length - 1].floor, 1);
});
