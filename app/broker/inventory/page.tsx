"use client";

import Link from "next/link";
import { TOWERS, UNITS, getTower } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inrShort, sqft } from "@/lib/format";
import { FACING_LABEL } from "@/components/Compass";
import { Eyebrow, AvailabilityLegend } from "@/components/ui";
import { useApp, liveAvailability, towerUnitIds } from "@/lib/store";

export default function BrokerInventory() {
  const { s } = useApp();
  const available = UNITS.filter((u) => (s.unitStatus[u.id] ?? u.status) === "available").sort((a, b) =>
    a.towerId === b.towerId ? a.floor - b.floor : a.towerId.localeCompare(b.towerId),
  );

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Real-time</Eyebrow>
      <h1 className="t-serif-lg mt-2">Live inventory</h1>
      <p className="t-body-sm mt-2 text-body">
        The same availability your client sees. Reserve on their behalf — the booking and
        your commission appear instantly.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {TOWERS.map((t) => {
          const a = liveAvailability(s, towerUnitIds(t.id));
          return (
            <div key={t.id} className="rounded-lg bg-canvas-soft p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-[17px] font-semibold text-ink">{t.name}</p>
                <span className="text-[13px] text-body-mid">{t.id}</span>
              </div>
              <p className="mt-2 text-[15px] text-body">
                <span className="text-[22px] font-semibold text-primary tabular">{a.available}</span> available · {a.total} total
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <AvailabilityLegend />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[720px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Tower</th>
              <th className="px-4 py-3">Floor</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Facing</th>
              <th className="px-4 py-3">Super area</th>
              <th className="px-4 py-3 text-right">All-in</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {available.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{u.id}</td>
                <td className="px-4 py-3 text-body">{getTower(u.towerId)!.name}</td>
                <td className="px-4 py-3 text-body tabular">{u.floor}</td>
                <td className="px-4 py-3 text-body">{u.bhk} BHK</td>
                <td className="px-4 py-3 text-body">{FACING_LABEL[u.facing]}</td>
                <td className="px-4 py-3 text-body tabular">{sqft(u.superSqft)}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink tabular">{inrShort(unitAllIn(u))}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/unit/${u.id}/book?broker=1`} className="text-[13px] font-semibold text-primary hover:underline">
                    Reserve for client →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-body-mid">{available.length} flats available now.</p>
    </div>
  );
}
