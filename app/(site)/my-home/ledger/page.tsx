"use client";

import { getUnit, getTower, PROJECT } from "@/lib/data";
import { withRunningBalance, ledgerTotals } from "@/lib/ledger";
import { inr, inrShort, inDate } from "@/lib/format";
import ShareButton from "@/components/ShareButton";
import PrintButton from "@/components/PrintButton";
import { BackLink } from "@/components/ui";
import { useApp, primaryBooking } from "@/lib/store";

export default function LedgerPage() {
  const { s } = useApp();
  const booking = primaryBooking(s);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-16">
        <BackLink href="/my-home">My Home</BackLink>
        <p className="mt-6 text-[16px] text-body">No booking yet — reserve a home to open your Khata.</p>
      </div>
    );
  }

  const unit = getUnit(booking.unitId)!;
  const tower = getTower(unit.towerId)!;
  const entries = s.ledgers[booking.id] ?? [];
  const rows = withRunningBalance(entries);
  const totals = ledgerTotals(entries);

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8">
      <div className="no-print">
        <BackLink href="/my-home">My Home</BackLink>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="t-serif-lg">Digital Khata</h1>
          <p className="t-body-sm mt-1 text-body">
            {booking.buyerName} · {unit.id} · {tower.name}
          </p>
        </div>
        <p className="text-[13px] text-body-mid">RERA {PROJECT.reraNo}</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Total label="Demanded" value={inrShort(totals.demanded)} />
        <Total label="Paid" value={inrShort(totals.paid)} />
        <Total label="Outstanding" value={inrShort(totals.outstanding)} accent />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Particulars</th>
              <th className="px-4 py-3 text-right">Demand</th>
              <th className="px-4 py-3 text-right">Payment</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Receipt</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="whitespace-nowrap px-4 py-3 text-body">{inDate(r.date)}</td>
                <td className="px-4 py-3 text-ink">{r.particulars}</td>
                <td className="px-4 py-3 text-right text-ink">{r.kind === "demand" ? inr(r.amount) : "—"}</td>
                <td className="px-4 py-3 text-right text-ink">{r.kind === "payment" ? inr(-r.amount) : "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink">{inr(r.balance)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-body-mid">{r.receiptNo ? `${r.receiptNo} · ${r.mode}` : "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink/15 bg-canvas-soft font-semibold text-ink">
              <td className="px-4 py-3" colSpan={4}>Outstanding balance</td>
              <td className="px-4 py-3 text-right tabular" colSpan={2}>{inr(totals.outstanding)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-4 text-[13px] text-body-mid">
        This statement matches the builder&apos;s books and is accepted by your home-loan bank for disbursement.
      </p>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <PrintButton label="Download statement (PDF)" />
        <ShareButton text={`My Trimurty ledger — outstanding ${inrShort(totals.outstanding)}`} />
      </div>
    </div>
  );
}

function Total({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${accent ? "bg-ink text-on-primary" : "bg-canvas-soft"}`}>
      <p className={`text-[12px] uppercase tracking-wide ${accent ? "text-mute" : "text-body-mid"}`}>{label}</p>
      <p className={`mt-0.5 text-[22px] font-semibold tabular ${accent ? "text-on-primary" : "text-ink"}`}>{value}</p>
    </div>
  );
}
