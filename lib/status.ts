// Availability status expressed WITHIN the Zapier palette (no second accent):
// orange = available (actionable), cream = on-hold, ink = booked. Always
// paired with a text label so it is colour-blind safe.

import type { UnitStatus } from "./data";

export const STATUS_LABEL: Record<UnitStatus, string> = {
  available: "Available",
  held: "On hold",
  booked: "Booked",
};

/** Small pill classes for unit cards / detail. */
export function statusChipClass(s: UnitStatus): string {
  switch (s) {
    case "available":
      return "bg-primary text-on-primary";
    case "held":
      return "bg-canvas-soft text-ink border border-ink/15";
    case "booked":
      return "bg-ink text-on-primary";
  }
}

/** A tappable floor band in the elevation view. */
export function floorBandClass(dominant: UnitStatus): string {
  switch (dominant) {
    case "available":
      return "bg-canvas border-ink/10 text-ink hover:border-primary";
    case "held":
      return "bg-canvas-soft border-ink/10 text-ink hover:border-ink/30";
    case "booked":
      return "bg-ink border-ink text-on-primary/90";
  }
}

/** Dominant status for a floor: available wins, else held, else booked. */
export function dominantStatus(available: number, held: number): UnitStatus {
  if (available > 0) return "available";
  if (held > 0) return "held";
  return "booked";
}
