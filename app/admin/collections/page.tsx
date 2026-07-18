"use client";

import { getTower, TOWERS } from "@/lib/data";
import { inr, inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import BulkReminder from "@/components/BulkReminder";
import { useApp, collectionsLive } from "@/lib/store";
import { downloadCsv } from "@/lib/csv";

export default function AdminCollections() {
  const { s } = useApp();
  const rows = collectionsLive(s);
  const demanded = rows.reduce((t, r) => t + r.demanded, 0);
  const collected = rows.reduce((t, r) => t + r.paid, 0);
  const outstanding = demanded - collected;
  const defaulters = rows.filter((r) => r.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding);
  const overdueAmt = defaulters.reduce((t, r) => t + r.outstanding, 0);

  const byTower = TOWERS.map((t) => ({
    tower: t,
    outstanding: rows.filter((r) => r.towerId === t.id).reduce((sum, r) => sum + r.outstanding, 0),
  })).filter((b) => b.outstanding > 0);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>Cash flow · live</Eyebrow>
          <h1 className="t-serif-lg mt-2">Collections cockpit</h1>
          <p className="t-body-sm mt-2 max-w-xl text-body">Where the money is, what&apos;s outstanding, and one tap to chase it. Updates as buyers pay.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCsv("trimurty-collections.csv", [
              ["Buyer", "Unit", "Tower", "Demanded", "Paid", "Outstanding"],
              ...rows.map((r) => [r.buyerName, r.unitId, getTower(r.towerId)?.name ?? "", r.demanded, r.paid, r.outstanding]),
            ])
          }
          className="btn btn-tertiary !py-2 !px-4 !text-[14px]"
        >
          ⤓ Export CSV
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Demanded" value={inrShort(demanded)} />
        <StatTile label="Collected" value={inrShort(collected)} tone="ink" />
        <StatTile label="Outstanding" value={inrShort(outstanding)} />
        <StatTile label="Buyers with dues" value={String(defaulters.length)} tone="alert" />
      </div>

      <div className="mt-6 rounded-lg border border-line p-6">
        <h2 className="t-display-sub-sm">Outstanding by tower</h2>
        <div className="mt-4 space-y-3">
          {byTower.length === 0 && <p className="text-[15px] text-body">All towers fully collected.</p>}
          {byTower.map((b) => {
            const pct = outstanding ? (b.outstanding / outstanding) * 100 : 0;
            return (
              <div key={b.tower.id}>
                <div className="flex justify-between text-[14px]">
                  <span className="text-body">{b.tower.name} · {b.tower.id}</span>
                  <span className="font-semibold text-ink tabular">{inrShort(b.outstanding)}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-canvas-soft">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-display-sub-sm">Buyers with dues ({defaulters.length}) · {inrShort(overdueAmt)}</h2>
        <BulkReminder count={defaulters.length} />
      </div>
      <div className="mt-3 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3 text-right">Demanded</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((r) => (
              <tr key={r.bookingId} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{r.buyerName}</td>
                <td className="px-4 py-3 text-body">{r.unitId} · {getTower(r.towerId)?.name ?? ""}</td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(r.demanded)}</td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(r.paid)}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink tabular">{inr(r.outstanding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
