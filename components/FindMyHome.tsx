"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UNITS, getTower } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inrShort, sqft } from "@/lib/format";
import { useApp } from "@/lib/store";

const BUDGETS = [
  { label: "Any budget", cap: Infinity },
  { label: "Under ₹1 Cr", cap: 10000000 },
  { label: "₹1–1.5 Cr", cap: 15000000 },
  { label: "₹1.5–2 Cr", cap: 20000000 },
  { label: "Above ₹2 Cr", cap: Infinity, floor: 20000000 },
];

export default function FindMyHome() {
  const { s } = useApp();
  const [bhk, setBhk] = useState<"any" | 2 | 3 | 4>("any");
  const [bi, setBi] = useState(0);

  const matches = useMemo(() => {
    const b = BUDGETS[bi];
    const floor = (b as { floor?: number }).floor ?? 0;
    return UNITS.filter((u) => (s.unitStatus[u.id] ?? u.status) === "available")
      .filter((u) => bhk === "any" || u.bhk === bhk)
      .map((u) => ({ u, price: unitAllIn(u) }))
      .filter(({ price }) => price <= b.cap && price >= floor)
      .sort((a, z) => a.price - z.price)
      .slice(0, 6);
  }, [bhk, bi, s.unitStatus]);

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="text-[15px] font-semibold text-ink">Find my home</p>
        <Seg label="BHK" value={bhk} onChange={setBhk} options={[{ l: "Any", v: "any" as const }, { l: "2", v: 2 as const }, { l: "3", v: 3 as const }, { l: "4", v: 4 as const }]} />
        <label className="flex items-center gap-2 text-[14px]">
          <span className="font-semibold text-ink">Budget</span>
          <select value={bi} onChange={(e) => setBi(Number(e.target.value))} className="rounded-sm border border-line bg-canvas px-3 py-1.5 text-[14px] text-ink">
            {BUDGETS.map((b, i) => (<option key={b.label} value={i}>{b.label}</option>))}
          </select>
        </label>
        <span className="ml-auto text-[14px] text-body"><span className="font-semibold text-primary tabular">{matches.length}</span> best matches</span>
      </div>

      {matches.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(({ u, price }) => (
            <Link key={u.id} href={`/unit/${u.id}`} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-[14px] hover:border-primary">
              <span className="text-ink">{u.bhk} BHK · {getTower(u.towerId)?.name} · {sqft(u.superSqft)}</span>
              <span className="font-semibold text-ink tabular">{inrShort(price)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Seg<T extends string | number>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { l: string; v: T }[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <div className="flex items-center rounded-full bg-canvas-soft p-0.5">
        {options.map((o) => (
          <button key={String(o.v)} type="button" onClick={() => onChange(o.v)} className={`rounded-full px-3 py-1 text-[13px] font-semibold ${value === o.v ? "bg-ink text-on-primary" : "text-body hover:text-ink"}`}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}
