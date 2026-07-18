"use client";

import { getUnit, getTower } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inr, inrShort, inDate } from "@/lib/format";
import { useApp, ledgerTotalsFor } from "@/lib/store";

type LineStatus = "paid" | "raised" | "due" | "upcoming";
const LINE_LABEL: Record<LineStatus, string> = { paid: "Paid", raised: "Raised", due: "Due", upcoming: "Upcoming" };
function lineChip(s: LineStatus): string {
  switch (s) {
    case "paid": return "bg-ink text-on-primary";
    case "raised": return "bg-primary text-on-primary";
    case "due": return "bg-canvas-soft text-ink border border-ink/15";
    case "upcoming": return "bg-canvas-soft text-body-mid";
  }
}

export default function BookingDrawer({ bookingId, onClose }: { bookingId: string | null; onClose: () => void }) {
  const { s, pay, raiseDemand, cancelBooking } = useApp();
  if (!bookingId) return null;
  const booking = s.bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  const unit = getUnit(booking.unitId);
  const tower = unit ? getTower(unit.towerId) : undefined;
  const allIn = unit ? unitAllIn(unit) : 0;
  const totals = ledgerTotalsFor(s, booking.id);
  const entries = s.ledgers[booking.id] ?? [];

  // CLP schedule from the milestone plan (pure — no running mutation in render)
  const rawSchedule = s.milestones.map((m) => ({
    m,
    amount: Math.round((allIn * m.pct) / 100),
    hasDemand: entries.some((e) => e.kind === "demand" && e.milestoneId === m.id),
  }));
  const schedule = rawSchedule.map((r, i) => {
    const cumThrough = rawSchedule.slice(0, i + 1).reduce((t, x) => t + (x.hasDemand ? x.amount : 0), 0);
    const status: LineStatus = r.hasDemand
      ? totals.paid >= cumThrough
        ? "paid"
        : "raised"
      : r.m.status === "certified"
        ? "due"
        : "upcoming";
    return { m: r.m, amount: r.amount, status };
  });

  return (
    <>
      <div className="drawer-overlay fixed inset-0 z-[60] bg-ink/40" onClick={onClose} />
      <aside className="drawer fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col overflow-y-auto bg-canvas shadow-[var(--shadow-lux)]">
        <div className="sticky top-0 flex items-start justify-between border-b border-line bg-canvas/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-[12px] uppercase tracking-wide text-body-mid">{booking.id}</p>
            <p className="t-serif-md">{booking.buyerName}</p>
            <p className="text-[14px] text-body">
              {unit ? `${unit.bhk} BHK · ${tower?.name} · Floor ${unit.floor} · ${unit.id}` : booking.unitId}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="press rounded-full p-2 text-body hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          {/* KYC + agreement */}
          <section>
            <p className="text-[13px] uppercase tracking-wide text-body-mid">KYC &amp; documents</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
              <Tag ok>PAN verified</Tag>
              <Tag ok>Aadhaar eKYC</Tag>
              <Tag ok>Allotment letter</Tag>
              <Tag>Agreement · awaiting e-sign</Tag>
              <Tag>Co-applicant: spouse</Tag>
            </div>
          </section>

          {/* Money summary */}
          <section className="grid grid-cols-3 gap-3">
            <Money label="Value" value={inrShort(allIn)} />
            <Money label="Collected" value={inrShort(totals.paid)} />
            <Money label="Outstanding" value={inrShort(totals.outstanding)} accent />
          </section>

          {/* CLP schedule */}
          <section>
            <div className="flex items-center justify-between">
              <p className="text-[13px] uppercase tracking-wide text-body-mid">Construction-linked plan</p>
              <p className="text-[12px] text-body-mid">{booking.plan}</p>
            </div>
            <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
              {schedule.map(({ m, amount, status }) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] text-ink">{m.label}</p>
                    <p className="text-[12px] text-body-mid tabular">{m.pct}% · {inr(amount)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${lineChip(status)}`}>{LINE_LABEL[status]}</span>
                    {status === "due" && (
                      <button type="button" onClick={() => raiseDemand(booking.id, m.id)} className="press rounded-sm bg-ink px-2 py-1 text-[11px] font-semibold text-on-primary">
                        Raise
                      </button>
                    )}
                    {status === "raised" && (
                      <button type="button" onClick={() => pay(booking.id, amount, `${m.label} payment`)} className="press rounded-sm border border-line px-2 py-1 text-[11px] font-semibold text-body hover:text-primary">
                        Collect
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Ledger */}
          <section>
            <p className="text-[13px] uppercase tracking-wide text-body-mid">Ledger</p>
            <ul className="mt-2 space-y-1.5 text-[13px]">
              {entries.slice().reverse().map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3">
                  <span className="text-body">{inDate(e.date)} · {e.particulars}</span>
                  <span className={`tabular ${e.kind === "payment" ? "text-ink" : "text-body-mid"}`}>
                    {e.kind === "payment" ? inr(e.amount) : `+${inr(e.amount)}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Danger */}
          <section className="border-t border-line pt-4">
            <button
              type="button"
              onClick={() => { if (confirm(`Cancel ${booking.id} and release ${booking.unitId}?`)) { cancelBooking(booking.id); onClose(); } }}
              className="press w-full rounded-lg border border-line py-2.5 text-[14px] font-semibold text-body hover:border-primary hover:text-primary"
            >
              Cancel booking &amp; release unit
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}

function Tag({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${ok ? "bg-canvas-soft text-ink" : "bg-canvas-soft text-body-mid"}`}>
      {ok && <span className="text-primary">✓</span>}
      {children}
    </span>
  );
}

function Money({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${accent ? "bg-ink text-on-primary" : "bg-canvas-soft"}`}>
      <p className={`text-[11px] uppercase tracking-wide ${accent ? "text-mute" : "text-body-mid"}`}>{label}</p>
      <p className={`mt-0.5 text-[16px] font-semibold tabular ${accent ? "text-on-primary" : "text-ink"}`}>{value}</p>
    </div>
  );
}
