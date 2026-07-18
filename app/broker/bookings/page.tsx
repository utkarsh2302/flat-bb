"use client";

import Link from "next/link";
import { CURRENT_ASSOCIATE, getUnit, getTower } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inr, inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, ledgerTotalsFor } from "@/lib/store";

const STATUS_LABEL: Record<string, string> = { accrued: "Accrued", invoiced: "Invoiced", paid: "Paid" };

export default function BrokerBookings() {
  const { s } = useApp();
  const mine = s.bookings.filter((b) => b.associateId === CURRENT_ASSOCIATE);
  const commFor = (unitId: string) => s.commissions.find((c) => c.unitId === unitId && c.associateId === CURRENT_ASSOCIATE);
  const value = mine.reduce((t, b) => t + (getUnit(b.unitId) ? unitAllIn(getUnit(b.unitId)!) : 0), 0);
  const commission = mine.reduce((t, b) => { const c = commFor(b.unitId); return t + (c ? (c.bookingValue * c.ratePct) / 100 : 0); }, 0);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Your clients</Eyebrow>
      <h1 className="t-serif-lg mt-2">Client bookings</h1>
      <p className="t-body-sm mt-2 text-body">
        Bookings you&apos;ve sourced — their collection progress and the commission each one earns you.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatTile label="Bookings" value={String(mine.length)} />
        <StatTile label="Booking value" value={inrShort(value)} tone="ink" />
        <StatTile label="Your commission" value={inrShort(commission)} tone="alert" />
      </div>

      {mine.length === 0 ? (
        <div className="mt-8 card p-10 text-center">
          <p className="text-[15px] text-body">No bookings yet. Reserve a flat for a client from live inventory.</p>
          <Link href="/broker/inventory" className="btn btn-primary mt-4">Open inventory</Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[760px] text-[14px]">
            <thead>
              <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-right">Outstanding</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3">Payout</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((b) => {
                const u = getUnit(b.unitId);
                const t = ledgerTotalsFor(s, b.id);
                const c = commFor(b.unitId);
                return (
                  <tr key={b.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium text-ink">{b.buyerName}</td>
                    <td className="px-4 py-3 text-body">{b.unitId}{u ? ` · ${getTower(u.towerId)?.name}` : ""}</td>
                    <td className="px-4 py-3 text-right text-body tabular">{u ? inr(unitAllIn(u)) : "—"}</td>
                    <td className="px-4 py-3 text-right text-body tabular">{inr(t.outstanding)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink tabular">{c ? inr((c.bookingValue * c.ratePct) / 100) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-canvas-soft px-2.5 py-0.5 text-[12px] font-semibold text-ink">{c ? STATUS_LABEL[c.status] : "—"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
