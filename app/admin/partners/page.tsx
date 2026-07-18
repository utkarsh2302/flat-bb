"use client";

import { ASSOCIATES } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function AdminPartners() {
  const { s, togglePartner } = useApp();
  const commFor = (id: string) =>
    s.commissions.filter((c) => c.associateId === id).reduce((t, c) => t + (c.bookingValue * c.ratePct) / 100, 0);
  const activeCount = ASSOCIATES.filter((a) => s.partnerActive[a.id] ?? true).length;
  const totalGmv = ASSOCIATES.reduce((t, a) => t + a.gmv, 0);
  const totalComm = ASSOCIATES.reduce((t, a) => t + commFor(a.id), 0);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Channel partners · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Associates</h1>
      <p className="t-body-sm mt-2 text-body">
        Your channel-partner network — RERA status, production, and commission liability. Deactivate a partner to revoke portal &amp; inventory access.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatTile label="Active partners" value={`${activeCount}/${ASSOCIATES.length}`} />
        <StatTile label="Sourced GMV" value={inrShort(totalGmv)} tone="ink" />
        <StatTile label="Commission liability" value={inrShort(totalComm)} tone="alert" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[820px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">RERA agent</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3 text-right">Bookings</th>
              <th className="px-4 py-3 text-right">GMV</th>
              <th className="px-4 py-3 text-right">Commission</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ASSOCIATES.map((a) => {
              const active = s.partnerActive[a.id] ?? true;
              return (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{a.name}</td>
                  <td className="px-4 py-3 text-body">{a.reraAgentNo}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${a.tier === "gold" ? "bg-primary text-on-primary" : "bg-canvas-soft text-ink border border-ink/15"}`}>
                      {a.tier === "gold" ? "Gold" : "Silver"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-body tabular">{a.bookings}</td>
                  <td className="px-4 py-3 text-right text-body tabular">{inrShort(a.gmv)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink tabular">{inrShort(commFor(a.id))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${active ? "text-ink" : "text-body-mid"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-mute"}`} />
                      {active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => togglePartner(a.id)}
                      className="rounded-sm border border-line px-2.5 py-1 text-[12px] font-semibold text-body hover:text-primary press"
                    >
                      {active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
