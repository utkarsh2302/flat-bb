import type { Facing } from "./data";

// Vastu heuristic — North-East is most auspicious; entrance direction adds a
// small bonus. Purely indicative, presented factually (a real Indian buyer
// decision input, per the UX guidelines).
const FACING_SCORE: Record<Facing, number> = {
  NE: 94, N: 88, E: 86, NW: 76, SE: 74, W: 68, S: 62, SW: 60,
};
const GOOD_ENTRANCE: Facing[] = ["N", "E", "NE"];

export function vastuScore(facing: Facing, entrance: Facing): { score: number; label: string } {
  const base = FACING_SCORE[facing] ?? 70;
  const score = Math.min(99, base + (GOOD_ENTRANCE.includes(entrance) ? 4 : 0));
  const label = score >= 90 ? "Excellent" : score >= 80 ? "Very good" : score >= 70 ? "Good" : "Fair";
  return { score, label };
}
