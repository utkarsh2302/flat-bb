import { test } from "node:test";
import assert from "node:assert/strict";
import { vastuScore } from "./vastu";

test("North-East scores higher than South-West", () => {
  assert.ok(vastuScore("NE", "E").score > vastuScore("SW", "S").score);
});

test("score stays within 0–99 and is labelled", () => {
  const v = vastuScore("N", "N");
  assert.ok(v.score > 0 && v.score <= 99);
  assert.ok(["Excellent", "Very good", "Good", "Fair"].includes(v.label));
});

test("an auspicious entrance never lowers the score", () => {
  assert.ok(vastuScore("E", "N").score >= vastuScore("E", "S").score);
});
