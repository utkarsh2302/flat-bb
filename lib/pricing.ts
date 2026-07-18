// Pure pricing math: live cost sheet + EMI. No React, no DOM — Node-runnable
// (see pricing.test.ts). Every line is rounded to whole rupees so the grand
// total is exactly the sum of what the buyer sees (no floating-point drift).

import {
  PROJECT,
  getTower,
  type Unit,
} from "./data";

export const FLOOR_RISE_PER_SQFT = 40; // ₹/sq.ft per floor above the 1st

export type CostGroup = "charge" | "tax";
export interface CostLine {
  key: string;
  label: string;
  hindi: string;
  amount: number;
  note?: string;
  group: CostGroup;
}

export interface CostSheet {
  unitId: string;
  ratePerSqft: number;
  superSqft: number;
  charges: CostLine[];
  subtotalBeforeTax: number;
  taxes: CostLine[];
  grandTotal: number;
  perSqftAllIn: number;
  tdsNote: string | null;
}

export function computeCostSheet(unit: Unit): CostSheet {
  const tower = getTower(unit.towerId);
  if (!tower) throw new Error(`Unknown tower for unit ${unit.id}`);
  const c = PROJECT.charges;
  const s = PROJECT.state;
  const area = unit.superSqft;

  const base = round(tower.baseRatePerSqft * area);
  const floorRise = round(FLOOR_RISE_PER_SQFT * (unit.floor - 1) * area);
  const plc = round(unit.plcPerSqft * area);
  const parking =
    unit.bhk === 4 ? c.parking4bhk : unit.bhk === 3 ? c.parking3bhk : c.parking2bhk;
  const club = c.clubCharges;
  const corpus = round(c.corpusPerSqft * area);
  const advanceMaint = round(c.advanceMaintPerSqftPerMonth * c.advanceMaintMonths * area);
  const legal = c.legalCharges;

  const charges: CostLine[] = [
    { key: "base", label: `Base price (${inrRate(tower.baseRatePerSqft)}/sq.ft × ${area})`, hindi: "मूल कीमत", amount: base, group: "charge" },
  ];
  if (floorRise > 0)
    charges.push({ key: "floorRise", label: `Floor-rise charge (floor ${unit.floor})`, hindi: "ऊंची मंज़िल का अतिरिक्त शुल्क", amount: floorRise, group: "charge" });
  if (plc > 0)
    charges.push({ key: "plc", label: "Preferential location charge (view / corner)", hindi: "बेहतर लोकेशन शुल्क", amount: plc, group: "charge" });
  charges.push(
    { key: "parking", label: `Covered parking${unit.bhk === 4 ? " (2 bays)" : ""}`, hindi: "ढका हुआ पार्किंग", amount: parking, group: "charge" },
    { key: "club", label: "Club & amenities", hindi: "क्लब व सुविधाएँ", amount: club, group: "charge" },
    { key: "corpus", label: "Maintenance corpus (one-time)", hindi: "रख-रखाव कोष (एकमुश्त)", amount: corpus, group: "charge" },
    { key: "advMaint", label: `Advance maintenance (${c.advanceMaintMonths} months)`, hindi: "अग्रिम रख-रखाव", amount: advanceMaint, group: "charge" },
    { key: "legal", label: "Legal & documentation", hindi: "कानूनी व दस्तावेज़", amount: legal, group: "charge" },
  );

  const constructionValue = base + floorRise + plc + parking + club;
  const agreementValue = base + floorRise + plc;

  const gst = round((constructionValue * s.gstPct) / 100);
  const stamp = round((agreementValue * s.stampDutyPct) / 100);
  const registration = round((agreementValue * s.registrationPct) / 100);

  const taxes: CostLine[] = [
    { key: "gst", label: `GST (${s.gstPct}%)`, hindi: "जीएसटी", amount: gst, group: "tax" },
    { key: "stamp", label: `Stamp duty (${s.stampDutyPct}%, ${s.state})`, hindi: "स्टाम्प ड्यूटी", amount: stamp, group: "tax" },
    { key: "registration", label: `Registration (${s.registrationPct}%)`, hindi: "रजिस्ट्रेशन", amount: registration, group: "tax" },
  ];

  const subtotalBeforeTax = charges.reduce((t, l) => t + l.amount, 0);
  const grandTotal = subtotalBeforeTax + taxes.reduce((t, l) => t + l.amount, 0);

  const tdsNote =
    agreementValue > s.tdsThreshold
      ? `1% TDS (≈ ₹${new Intl.NumberFormat("en-IN").format(Math.round(agreementValue * 0.01))}) is deductible by you u/s 194-IA and paid to the government — it is part of, not extra to, the price above.`
      : null;

  return {
    unitId: unit.id,
    ratePerSqft: tower.baseRatePerSqft,
    superSqft: area,
    charges,
    subtotalBeforeTax,
    taxes,
    grandTotal,
    perSqftAllIn: Math.round(grandTotal / area),
    tdsNote,
  };
}

/** All-in price for a unit — used for budget filters and headline price. */
export function unitAllIn(unit: Unit): number {
  return computeCostSheet(unit).grandTotal;
}

/** Standard reducing-balance EMI. principal ₹, annual rate %, tenure years. */
export function emi(principal: number, annualRatePct: number, years: number): number {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.round(principal / n);
  const factor = Math.pow(1 + r, n);
  return Math.round((principal * r * factor) / (factor - 1));
}

function round(n: number): number {
  return Math.round(n);
}

function inrRate(n: number): string {
  return "₹" + new Intl.NumberFormat("en-IN").format(n);
}
