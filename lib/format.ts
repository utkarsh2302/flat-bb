// Indian number / currency / area formatting. Pure, no deps.

/** Full Indian-grouped rupees, no paise: 12345678 -> "₹1,23,45,678". */
export function inr(n: number): string {
  const rounded = Math.round(n);
  return "₹" + new Intl.NumberFormat("en-IN").format(rounded);
}

/** Short lakh/crore form: 12500000 -> "₹1.25 Cr", 8550000 -> "₹85.5 L". */
export function inrShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e7) return "₹" + trim(n / 1e7) + " Cr";
  if (abs >= 1e5) return "₹" + trim(n / 1e5) + " L";
  return inr(n);
}

/** 2 decimals, trailing zeros stripped: 1.25 -> "1.25", 85.5 -> "85.5", 3 -> "3". */
function trim(x: number): string {
  return x
    .toFixed(2)
    .replace(/\.?0+$/, "");
}

/** "1,250 sq.ft" */
export function sqft(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n)) + " sq.ft";
}

/** DD-MM-YYYY (Indian date order). Accepts ISO string or Date. */
export function inDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

/** "12 Jul 2026" — friendly certified-on style. */
export function inDateFriendly(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const mon = date.toLocaleString("en-GB", { month: "short" });
  return `${date.getDate()} ${mon} ${date.getFullYear()}`;
}
