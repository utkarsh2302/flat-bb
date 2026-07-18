"use client";

import { PROGRESS_FEED, getUnit, getTower, PROJECT } from "@/lib/data";
import { inr, inrShort, inDateFriendly } from "@/lib/format";
import PhotoBlock from "@/components/PhotoBlock";
import DemandActions from "@/components/DemandActions";
import { BackLink } from "@/components/ui";
import { useApp, primaryBooking, ledgerTotalsFor } from "@/lib/store";

export default function DemandPage() {
  const { s } = useApp();
  const booking = primaryBooking(s);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <BackLink href="/my-home">My Home</BackLink>
        <p className="mt-6 text-[16px] text-body">No booking yet.</p>
      </div>
    );
  }

  const unit = getUnit(booking.unitId)!;
  const tower = getTower(unit.towerId)!;
  const totals = ledgerTotalsFor(s, booking.id);
  const outstanding = totals.outstanding;

  // The most recent certified milestone is the "evidence" behind the demand.
  const certified = [...s.milestones].reverse().find((m) => m.status === "certified");
  const evidence = PROGRESS_FEED.filter((p) => p.towerId === unit.towerId && p.certified).slice(0, 2);

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 sm:px-8">
      <div className="no-print">
        <BackLink href="/my-home">My Home</BackLink>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-canvas p-6 sm:p-8">
        <div className="flex items-start justify-between border-b border-line pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-primary" />
              <span className="text-[18px] font-semibold text-ink">{PROJECT.builder}</span>
            </div>
            <p className="mt-1 text-[14px] text-body">Demand · {booking.id}</p>
          </div>
          <div className="text-right text-[13px] text-body-mid">
            <p className="font-semibold text-ink">{unit.id} · {tower.name}</p>
            <p>Floor {unit.floor}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[13px] uppercase tracking-wide text-body-mid">Amount due</p>
          <p className="text-[34px] font-semibold text-ink tabular">{inr(Math.max(0, outstanding))}</p>
          <p className="text-[14px] text-body tabular">{inrShort(Math.max(0, outstanding))} outstanding on your ledger</p>
        </div>

        {certified && (
          <div className="mt-6 rounded-lg bg-canvas-soft p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-canvas px-3 py-1 text-[13px] font-semibold text-ink">
                ✅ Certified {certified.certifiedOn ? inDateFriendly(certified.certifiedOn) : ""}
              </span>
              <span className="text-[13px] text-body-mid">{certified.evidenceCount} geo-tagged photos on record</span>
            </div>
            <p className="mt-3 text-[16px] text-ink">
              <span className="font-semibold">What got built:</span> {certified.label} on {tower.name}.
            </p>
            <p className="text-[14px] text-body">
              Demands are unlocked <span className="font-semibold text-ink">only</span> after the milestone is certified — the proof is below.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {evidence.map((e) => (
                <div key={e.id} className="overflow-hidden rounded-sm">
                  <PhotoBlock src={e.image} label={e.milestone} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="no-print mt-6">
        <DemandActions bookingId={booking.id} amount={Math.max(0, outstanding)} />
      </div>
    </div>
  );
}
