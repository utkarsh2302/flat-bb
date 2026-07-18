"use client";

import Link from "next/link";
import { useState } from "react";
import { getUnit, getTower, ASSOCIATES } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inr, inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, ledgerTotalsFor } from "@/lib/store";
import BookingDrawer from "@/components/BookingDrawer";

const NAME: Record<string, string> = Object.fromEntries(ASSOCIATES.map((a) => [a.id, a.name]));

export default function AdminBookings() {
  const { s, pay } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const rows = s.bookings.map((b) => {
    const u = getUnit(b.unitId);
    const t = ledgerTotalsFor(s, b.id);
    return { b, unit: u, value: u ? unitAllIn(u) : 0, ...t };
  });
  const totalValue = rows.reduce((x, r) => x + r.value, 0);
  const collected = rows.reduce((x, r) => x + r.paid, 0);
  const outstanding = rows.reduce((x, r) => x + r.outstanding, 0);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8">
      <Eyebrow>Sales operations · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Bookings</h1>
      <p className="t-body-sm mt-2 text-body">
        Every booking across the project — buyer, source, value and collections. Record a payment or cancel and release the unit.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Bookings" value={String(rows.length)} />
        <StatTile label="Booking value" value={inrShort(totalValue)} tone="ink" />
        <StatTile label="Collected" value={inrShort(collected)} />
        <StatTile label="Outstanding" value={inrShort(outstanding)} tone="alert" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[860px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3 text-right">Collected</th>
              <th className="px-4 py-3 text-right">Outstanding</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.b.id} className="border-t border-line align-middle">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{r.b.buyerName}</p>
                  <p className="text-[12px] text-body-mid">{r.b.id} · {r.b.applied}</p>
                </td>
                <td className="px-4 py-3 text-body">
                  {r.unit ? `${r.unit.id} · ${getTower(r.unit.towerId)?.name}` : r.b.unitId}
                  {r.unit ? <span className="block text-[12px] text-body-mid">{r.unit.bhk} BHK</span> : null}
                </td>
                <td className="px-4 py-3">
                  {r.b.associateId ? (
                    <span className="rounded-full bg-canvas-soft px-2.5 py-0.5 text-[12px] text-ink">{NAME[r.b.associateId] ?? "CP"}</span>
                  ) : (
                    <span className="text-[12px] text-body-mid">Direct</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(r.value)}</td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(r.paid)}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink tabular">{inr(r.outstanding)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(r.b.id)}
                      className="rounded-sm bg-ink px-2.5 py-1 text-[12px] font-semibold text-on-primary press"
                    >
                      Open file
                    </button>
                    {r.outstanding > 0 && (
                      <button
                        type="button"
                        onClick={() => pay(r.b.id, r.outstanding, "Payment recorded at office")}
                        className="rounded-sm border border-line px-2.5 py-1 text-[12px] font-semibold text-body hover:text-ink press"
                      >
                        Collect
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-body">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px] text-body-mid">
        Cancelling releases the unit back to available inventory and reverses its commission — reflected instantly across all panels.
        <Link href="/admin/collections" className="ml-1 font-semibold text-primary hover:underline">Open collections →</Link>
      </p>

      <BookingDrawer bookingId={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
