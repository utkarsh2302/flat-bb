"use client";

import { useMemo, useState } from "react";
import { TOWERS, UNITS, type UnitStatus } from "@/lib/data";
import { useApp } from "@/lib/store";

function cellClass(status: UnitStatus, selected: boolean): string {
  const base =
    status === "available"
      ? "bg-primary text-on-primary"
      : status === "held"
        ? "bg-canvas-soft text-ink border border-ink/20"
        : "bg-ink text-on-primary/80";
  return `${base} ${selected ? "ring-2 ring-offset-1 ring-primary" : ""}`;
}

export default function UnitGridEditor() {
  const { s, setUnitStatus } = useApp();
  const [tower, setTower] = useState(TOWERS[0].id);
  const [sel, setSel] = useState<Set<string>>(new Set());

  const floors = useMemo(() => {
    const units = UNITS.filter((u) => u.towerId === tower);
    const byFloor = new Map<number, typeof units>();
    for (const u of units) {
      const arr = byFloor.get(u.floor) ?? [];
      arr.push(u);
      byFloor.set(u.floor, arr);
    }
    return [...byFloor.entries()].sort((a, b) => b[0] - a[0]).map(([floor, us]) => ({ floor, units: us.sort((a, b) => a.letter.localeCompare(b.letter)) }));
  }, [tower]);

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  function apply(status: UnitStatus) {
    if (sel.size === 0) return;
    setUnitStatus([...sel], status);
    setSel(new Set());
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center rounded-full bg-canvas-soft p-0.5">
          {TOWERS.map((t) => (
            <button key={t.id} type="button" onClick={() => { setTower(t.id); setSel(new Set()); }} className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${tower === t.id ? "bg-ink text-on-primary" : "text-body hover:text-ink"}`}>
              {t.name}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-body-mid">Tap units to select, then set status. Changes reflect everywhere instantly.</p>
      </div>

      {sel.size > 0 && (
        <div className="menu-pop mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-on-primary" style={{ transformOrigin: "top" }}>
          <span className="text-[14px] font-semibold">{sel.size} selected</span>
          <span className="mx-1 text-mute">→</span>
          <button type="button" onClick={() => apply("available")} className="press rounded-md bg-primary px-3 py-1.5 text-[13px] font-semibold">Set available</button>
          <button type="button" onClick={() => apply("held")} className="press rounded-md bg-canvas px-3 py-1.5 text-[13px] font-semibold text-ink">Put on hold</button>
          <button type="button" onClick={() => apply("booked")} className="press rounded-md border border-white/30 px-3 py-1.5 text-[13px] font-semibold">Mark booked</button>
          <button type="button" onClick={() => setSel(new Set())} className="ml-auto text-[13px] text-mute hover:text-on-primary">Clear</button>
        </div>
      )}

      <div className="mt-4 space-y-1.5">
        {floors.map((f) => (
          <div key={f.floor} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-[13px] font-medium text-body-mid">Floor {f.floor}</span>
            <div className="flex flex-wrap gap-1.5">
              {f.units.map((u) => {
                const st = s.unitStatus[u.id] ?? u.status;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggle(u.id)}
                    title={`${u.id} · ${u.bhk} BHK · ${st}`}
                    className={`press h-8 w-9 rounded-sm text-[11px] font-semibold ${cellClass(st, sel.has(u.id))}`}
                  >
                    {u.letter}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
