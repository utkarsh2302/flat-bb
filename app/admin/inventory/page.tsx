"use client";

import { TOWERS, PROJECT, getTower, getUnit } from "@/lib/data";
import { FLOOR_RISE_PER_SQFT } from "@/lib/pricing";
import { inr } from "@/lib/format";
import { Eyebrow, AvailabilityLegend } from "@/components/ui";
import { useApp, liveAvailability, towerUnitIds } from "@/lib/store";

export default function AdminInventory() {
  const { s } = useApp();
  const heldIds = Object.entries(s.unitStatus).filter(([, st]) => st === "held").map(([id]) => id);
  const c = PROJECT.charges;
  const st = PROJECT.state;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Setup · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Inventory &amp; rate cards</h1>
      <p className="t-body-sm mt-2 text-body">
        Onboard a tower in under a day: trace units, set the rate card, publish. Availability updates as buyers act.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-display-sub-sm">Availability</h2>
        <AvailabilityLegend />
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[560px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Tower</th>
              <th className="px-4 py-3 text-right">Base rate</th>
              <th className="px-4 py-3 text-right">Available</th>
              <th className="px-4 py-3 text-right">On hold</th>
              <th className="px-4 py-3 text-right">Booked</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {TOWERS.map((t) => {
              const a = liveAvailability(s, towerUnitIds(t.id));
              return (
                <tr key={t.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{t.name} · {t.id}</td>
                  <td className="px-4 py-3 text-right text-body tabular">{inr(t.baseRatePerSqft)}/sq.ft</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary tabular">{a.available}</td>
                  <td className="px-4 py-3 text-right text-body tabular">{a.held}</td>
                  <td className="px-4 py-3 text-right text-body tabular">{a.booked}</td>
                  <td className="px-4 py-3 text-right text-ink tabular">{a.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-line p-6">
          <h3 className="text-[17px] font-semibold text-ink">Charges (project-wide)</h3>
          <dl className="mt-3 space-y-2 text-[15px]">
            <RC k="Floor-rise" v={`${inr(FLOOR_RISE_PER_SQFT)}/sq.ft per floor`} />
            <RC k="Covered parking (2/3 BHK)" v={inr(c.parking3bhk)} />
            <RC k="Covered parking (4 BHK, 2 bays)" v={inr(c.parking4bhk)} />
            <RC k="Club & amenities" v={inr(c.clubCharges)} />
            <RC k="Maintenance corpus" v={`${inr(c.corpusPerSqft)}/sq.ft`} />
            <RC k="Advance maintenance" v={`${inr(c.advanceMaintPerSqftPerMonth)}/sq.ft × ${c.advanceMaintMonths} mo`} />
            <RC k="Legal & documentation" v={inr(c.legalCharges)} />
          </dl>
        </div>
        <div className="rounded-lg border border-line p-6">
          <h3 className="text-[17px] font-semibold text-ink">Taxes &amp; state pack — {st.state}</h3>
          <dl className="mt-3 space-y-2 text-[15px]">
            <RC k="GST (construction value)" v={`${st.gstPct}%`} />
            <RC k="Stamp duty (agreement value)" v={`${st.stampDutyPct}%`} />
            <RC k="Registration" v={`${st.registrationPct}%`} />
            <RC k="TDS 194-IA prompt above" v={inr(st.tdsThreshold)} />
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="t-display-sub-sm">Holds live ({heldIds.length})</h2>
        <p className="text-[14px] text-body">Units on a 15-minute hold or EOI. Auto-release on timeout.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {heldIds.length === 0 && <span className="text-[15px] text-body">No live holds right now.</span>}
          {heldIds.slice(0, 20).map((id) => {
            const u = getUnit(id);
            return (
              <span key={id} className="rounded-full bg-canvas-soft px-3 py-1.5 text-[13px] text-ink">
                {id}{u ? ` · ${u.bhk} BHK · ${getTower(u.towerId)?.name ?? ""}` : ""}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RC({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2 last:border-0">
      <dt className="text-body">{k}</dt>
      <dd className="font-medium text-ink tabular">{v}</dd>
    </div>
  );
}
