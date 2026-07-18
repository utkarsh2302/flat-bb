import { test } from "node:test";
import assert from "node:assert/strict";
import { inr, inrShort, sqft, inDate } from "./format";

test("inr groups the Indian way with a rupee sign", () => {
  assert.equal(inr(12345678), "₹1,23,45,678");
  assert.equal(inr(51000), "₹51,000");
  assert.equal(inr(1234.6), "₹1,235"); // rounds
});

test("inrShort uses crore/lakh and trims trailing zeros", () => {
  assert.equal(inrShort(12500000), "₹1.25 Cr");
  assert.equal(inrShort(8550000), "₹85.5 L");
  assert.equal(inrShort(10000000), "₹1 Cr");
  assert.equal(inrShort(45000), "₹45,000"); // below a lakh -> full form
});

test("sqft appends the unit", () => {
  assert.equal(sqft(1650), "1,650 sq.ft");
});

test("inDate is DD-MM-YYYY", () => {
  assert.equal(inDate("2026-07-08"), "08-07-2026");
});
