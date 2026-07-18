"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Facing, UnitStatus } from "@/lib/data";
import { floorBandClass, dominantStatus } from "@/lib/status";
import { inrShort } from "@/lib/format";
import { AvailabilityLegend } from "@/components/ui";
import { useApp } from "@/lib/store";

export interface ElevUnit {
  id: string;
  letter: string;
  bhk: 2 | 3 | 4;
  facing: Facing;
  status: UnitStatus;
  allIn: number;
}
export interface ElevFloor {
  floor: number;
  available: number;
  held: number;
  booked: number;
  units: ElevUnit[];
}

const BUDGETS = [
  { label: "Any budget", cap: null as number | null },
  { label: "Under ₹1 Cr", cap: 10000000 },
  { label: "Under ₹1.5 Cr", cap: 15000000 },
  { label: "Under ₹2 Cr", cap: 20000000 },
];

export default function Elevation({
  towerId,
  floors,
}: {
  towerId: string;
  floors: ElevFloor[];
}) {
  const { s } = useApp();
  const [bhk, setBhk] = useState<"any" | 2 | 3 | 4>("any");
  const [facing, setFacing] = useState<"any" | Facing>("any");
  const [budget, setBudget] = useState<number | null>(null);
  const [availOnly, setAvailOnly] = useState(false);

  // live status wins over the seed status baked into props
  const liveStatus = (u: ElevUnit): UnitStatus => s.unitStatus[u.id] ?? u.status;

  const facings = useMemo(() => {
    const set = new Set<Facing>();
    floors.forEach((f) => f.units.forEach((u) => set.add(u.facing)));
    return Array.from(set).sort();
  }, [floors]);

  const filtersOn = bhk !== "any" || facing !== "any" || budget !== null || availOnly;

  const matches = (u: ElevUnit) =>
    (bhk === "any" || u.bhk === bhk) &&
    (facing === "any" || u.facing === facing) &&
    (budget === null || u.allIn <= budget) &&
    (!availOnly || liveStatus(u) === "available");

  const totalMatch = floors.reduce((t, f) => t + f.units.filter(matches).length, 0);

  return (
    <div className="mt-4">
      <p className="t-body-md text-body">Tap a floor to see the flats on it.</p>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 -mx-5 mt-6 border-y border-line bg-canvas/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Segment
            label="BHK"
            value={bhk}
            onChange={setBhk}
            options={[
              { label: "Any", value: "any" as const },
              { label: "2", value: 2 as const },
              { label: "3", value: 3 as const },
              { label: "4", value: 4 as const },
            ]}
          />
          <Segment
            label="Facing"
            value={facing}
            onChange={setFacing}
            options={[
              { label: "Any", value: "any" as const },
              ...facings.map((f) => ({ label: f, value: f })),
            ]}
          />
          <label className="flex items-center gap-2 text-[14px] text-body">
            <span className="font-semibold text-ink">Budget</span>
            <select
              value={budget === null ? "" : String(budget)}
              onChange={(e) => setBudget(e.target.value === "" ? null : Number(e.target.value))}
              className="rounded-sm border border-line bg-canvas px-3 py-1.5 text-[14px] text-ink"
            >
              {BUDGETS.map((b) => (
                <option key={b.label} value={b.cap === null ? "" : String(b.cap)}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[14px] font-semibold text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={availOnly}
              onChange={(e) => setAvailOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Available only
          </label>

          <div className="ml-auto flex items-center gap-3">
            {filtersOn && (
              <>
                <span className="text-[14px] text-body">
                  <span className="font-semibold text-ink tabular">{totalMatch}</span> match
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBhk("any");
                    setFacing("any");
                    setBudget(null);
                    setAvailOnly(false);
                  }}
                  className="text-[14px] font-semibold text-primary hover:underline"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <AvailabilityLegend />
      </div>

      {/* Elevation — floors top to bottom */}
      <div className="mt-5 flex flex-col gap-1.5">
        {floors.map((f) => {
          const statuses = f.units.map(liveStatus);
          const available = statuses.filter((x) => x === "available").length;
          const held = statuses.filter((x) => x === "held").length;
          const dominant = dominantStatus(available, held);
          const dark = dominant === "booked";
          const matchAvail = f.units.filter((u) => matches(u) && liveStatus(u) === "available").length;
          const floorHasMatch = f.units.some(matches);
          return (
            <Link
              key={f.floor}
              href={`/explore/${towerId}/${f.floor}`}
              className={`flex items-center gap-3 rounded-md border px-4 py-3 transition-all ${floorBandClass(
                dominant,
              )} ${filtersOn && !floorHasMatch ? "opacity-40" : ""}`}
            >
              <span className={`w-14 shrink-0 text-[15px] font-semibold ${dark ? "text-on-primary" : "text-ink"}`}>
                Floor {f.floor}
              </span>
              <span className="flex flex-1 flex-wrap gap-1.5">
                {f.units.map((u) => {
                  const on = matches(u);
                  return (
                    <span
                      key={u.id}
                      title={`${u.id} · ${u.bhk} BHK · ${u.facing} · ${inrShort(u.allIn)}`}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-sm text-[12px] font-semibold ${unitSquare(
                        liveStatus(u),
                      )} ${filtersOn && !on ? "opacity-30" : ""}`}
                    >
                      {u.letter}
                    </span>
                  );
                })}
              </span>
              <span className={`hidden sm:block text-[14px] ${dark ? "text-mute" : "text-body"}`}>
                {matchAvail > 0 ? (
                  <span className="font-semibold text-primary">{matchAvail} available</span>
                ) : (
                  "Sold out"
                )}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" className={dark ? "text-mute" : "text-body-mid"} aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function unitSquare(status: UnitStatus): string {
  switch (status) {
    case "available":
      return "bg-primary text-on-primary";
    case "held":
      return "bg-canvas-soft text-ink border border-ink/20";
    case "booked":
      return "bg-ink text-on-primary/80";
  }
}

function Segment<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <div className="flex items-center rounded-full bg-canvas-soft p-0.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1 text-[13px] font-semibold transition-colors ${
              value === o.value ? "bg-ink text-on-primary" : "text-body hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
