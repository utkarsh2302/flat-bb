"use client";

import { useEffect, useState } from "react";
import { getTower } from "@/lib/data";
import { inr, inrShort, inDate } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, allDemands, type DemandRow } from "@/lib/store";

export default function AdminDemands() {
  const { s, raiseDemandAll, sendReminder } = useApp();
  const [today, setToday] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const rows = allDemands(s, today);
  const outstanding = rows.filter((r) => !r.paid).reduce((t, r) => t + r.amount, 0);
  const overdueRows = rows.filter((r) => !r.paid && r.overdueDays > 0);
  const overdueAmt = overdueRows.reduce((t, r) => t + r.amount, 0);
  const interestAccrued = rows.reduce((t, r) => t + r.interest, 0);

  // certified milestones with booked units still un-billed
  const booked = s.bookings.filter((b) => s.unitStatus[b.unitId] === "booked");
  const pendingFor = (mid: string) =>
    booked.filter((b) => !(s.ledgers[b.id] ?? []).some((e) => e.kind === "demand" && e.milestoneId === mid)).length;
  const generatable = s.milestones.filter((m) => m.status === "certified" && pendingFor(m.id) > 0);

  const remindRows = (list: DemandRow[]) =>
    list.map((r) => ({ bookingId: r.bookingId, demandId: r.demandId, to: r.buyerName }));

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8">
      <Eyebrow>Collections engine · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Demand letters</h1>
      <p className="t-body-sm mt-2 text-body">
        Generate milestone demands in bulk, watch interest accrue on overdue dues, and chase collections on WhatsApp, SMS or email — with a full dispatch log.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Outstanding demands" value={inrShort(outstanding)} />
        <StatTile label="Overdue" value={inrShort(overdueAmt)} sub={`${overdueRows.length} demands`} tone="alert" />
        <StatTile label="Interest accrued" value={inrShort(interestAccrued)} sub="@ 12% p.a." />
        <StatTile label="Reminders sent" value={String(s.reminders.length)} tone="ink" />
      </div>

      {/* Bulk generate */}
      <div className="mt-6 rounded-lg border border-line p-6">
        <h2 className="t-display-sub-sm">Generate demands</h2>
        <p className="mt-1 text-[14px] text-body">Certified milestones with un-billed booked units. One tap raises &amp; dispatches to every affected buyer.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {generatable.length === 0 && <p className="text-[15px] text-body">All certified milestones are fully billed. ✓</p>}
          {generatable.map((m) => (
            <button key={m.id} type="button" onClick={() => raiseDemandAll(m.id)} className="press rounded-lg border border-line bg-canvas px-4 py-2.5 text-[14px] font-semibold text-ink hover:border-primary">
              {m.label} · {m.pct}% <span className="text-primary">→ {pendingFor(m.id)} units</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reminder cadence */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-canvas-soft p-5">
        <div>
          <p className="text-[15px] font-semibold text-ink">Chase overdue ({overdueRows.length})</p>
          <p className="text-[13px] text-body-mid">Sends a reminder with the evidence-linked demand + payment link.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={overdueRows.length === 0} onClick={() => sendReminder(remindRows(overdueRows), "whatsapp")} className="btn btn-primary !py-2 !px-4 !text-[14px] disabled:opacity-50">WhatsApp all</button>
          <button type="button" disabled={overdueRows.length === 0} onClick={() => sendReminder(remindRows(overdueRows), "sms")} className="btn btn-tertiary !py-2 !px-4 !text-[14px] disabled:opacity-50">SMS</button>
          <button type="button" disabled={overdueRows.length === 0} onClick={() => sendReminder(remindRows(overdueRows), "email")} className="btn btn-tertiary !py-2 !px-4 !text-[14px] disabled:opacity-50">Email</button>
        </div>
      </div>

      {/* Demands table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[900px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Milestone</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Interest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reminders</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.bookingId}-${r.demandId}`} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{r.buyerName}</td>
                <td className="px-4 py-3 text-body">{r.unitId} · {getTower(r.towerId)?.name ?? ""}</td>
                <td className="px-4 py-3 text-body">{r.milestoneLabel}</td>
                <td className="px-4 py-3 text-right text-body tabular">{inr(r.amount)}</td>
                <td className="px-4 py-3 text-body tabular">{inDate(r.dueOn)}</td>
                <td className="px-4 py-3 text-right text-body tabular">{r.interest > 0 ? inr(r.interest) : "—"}</td>
                <td className="px-4 py-3">
                  {r.paid ? (
                    <span className="rounded-full bg-ink px-2.5 py-0.5 text-[12px] font-semibold text-on-primary">Paid</span>
                  ) : r.overdueDays > 0 ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[12px] font-semibold text-on-primary">Overdue {r.overdueDays}d</span>
                  ) : (
                    <span className="rounded-full bg-canvas-soft px-2.5 py-0.5 text-[12px] font-semibold text-ink border border-ink/15">Outstanding</span>
                  )}
                </td>
                <td className="px-4 py-3 text-body-mid tabular">{r.remindersCount > 0 ? `${r.remindersCount} sent` : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {!r.paid && (
                    <button type="button" onClick={() => sendReminder([{ bookingId: r.bookingId, demandId: r.demandId, to: r.buyerName }], "whatsapp")} className="press rounded-sm border border-line px-2.5 py-1 text-[12px] font-semibold text-body hover:text-primary">Remind</button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-body">No demands raised yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Dispatch log */}
      {s.reminders.length > 0 && (
        <div className="mt-8">
          <h2 className="t-display-sub-sm">Dispatch log</h2>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
            {s.reminders.slice(0, 12).map((r) => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2.5 text-[14px]">
                <span className="text-ink">Reminder → {r.to}</span>
                <span className="text-body-mid">{r.channel} · {new Date(r.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
