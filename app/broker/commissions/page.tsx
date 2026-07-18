"use client";

import { CURRENT_ASSOCIATE } from "@/lib/data";
import { inr, inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp } from "@/lib/store";

const STAGE_LABEL: Record<string, string> = {
  on_booking: "On booking",
  on_agreement: "On agreement",
  on_20pct: "On 20% collected",
};
const STATUS_LABEL: Record<string, string> = {
  accrued: "Accrued",
  invoiced: "Invoiced",
  paid: "Paid",
};

function statusChip(s: string): string {
  if (s === "paid") return "bg-ink text-on-primary";
  if (s === "invoiced") return "bg-primary text-on-primary";
  return "bg-canvas-soft text-ink border border-ink/20";
}

export default function BrokerCommissions() {
  const { s } = useApp();
  const mine = s.commissions.filter((c) => c.associateId === CURRENT_ASSOCIATE);
  const amount = (bv: number, r: number) => (bv * r) / 100;
  const total = mine.reduce((t, c) => t + amount(c.bookingValue, c.ratePct), 0);
  const paid = mine.filter((c) => c.status === "paid").reduce((t, c) => t + amount(c.bookingValue, c.ratePct), 0);
  const pending = total - paid;

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8">
      <Eyebrow>Earnings</Eyebrow>
      <h1 className="t-serif-lg mt-2">Commission ledger</h1>
      <p className="t-body-sm mt-2 text-body">Slab-wise rates, milestone-based payouts, and TDS — all transparent, no follow-up calls.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatTile label="Total earned" value={inrShort(total)} tone="ink" />
        <StatTile label="Paid out" value={inrShort(paid)} />
        <StatTile label="Pending" value={inrShort(pending)} tone="alert" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[720px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3 text-right">Booking value</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Commission</th>
              <th className="px-4 py-3">Payout stage</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{c.unitId}</td>
                <td className="px-4 py-3 text-body">{c.buyerName}</td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(c.bookingValue)}</td>
                <td className="px-4 py-3 text-right text-body tabular">{c.ratePct}%</td>
                <td className="px-4 py-3 text-right font-semibold text-ink tabular">{inr(amount(c.bookingValue, c.ratePct))}</td>
                <td className="px-4 py-3 text-body">{STAGE_LABEL[c.stage]}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${statusChip(c.status)}`}>{STATUS_LABEL[c.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-lg bg-canvas-soft p-5 text-[15px] text-body">
        <p className="font-semibold text-ink">How payouts work</p>
        <p className="mt-1">
          Commission is released in stages — a slice on booking, a slice on registered agreement, and the balance once
          the buyer has paid 20%. TDS is deducted and reflected against your PAN automatically.
        </p>
      </div>
    </div>
  );
}
