"use client";

import Link from "next/link";
import type { UnitStatus } from "@/lib/data";
import { inr, inrShort } from "@/lib/format";
import { STATUS_LABEL, statusChipClass } from "@/lib/status";
import ShareButton from "@/components/ShareButton";
import HeartButton from "@/components/HeartButton";
import { useApp } from "@/lib/store";

export default function UnitBookingCard({
  unitId,
  seedStatus,
  bhk,
  towerName,
  grandTotal,
  perSqftAllIn,
  monthly,
}: {
  unitId: string;
  seedStatus: UnitStatus;
  bhk: number;
  towerName: string;
  grandTotal: number;
  perSqftAllIn: number;
  monthly: number;
}) {
  const { s } = useApp();
  const status: UnitStatus = s.unitStatus[unitId] ?? seedStatus;

  return (
    <div className="rounded-lg bg-canvas-soft p-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] uppercase tracking-wide text-body-mid">All-inclusive price</p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${statusChipClass(status)}`}>
          {status === "available" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />}
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="mt-1 text-[40px] font-semibold leading-none text-ink tabular">{inrShort(grandTotal)}</p>
      <p className="mt-1 text-[15px] text-body tabular">
        {inr(grandTotal)} · {inr(perSqftAllIn)}/sq.ft all-in
      </p>
      <Link href={`/unit/${unitId}/cost-sheet`} className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-primary hover:underline">
        See full cost breakup →
      </Link>

      <div className="mt-5 rounded-sm bg-canvas px-4 py-3">
        <p className="text-[14px] text-body">On 80% home loan @ 8.5% / 20 yrs</p>
        <p className="text-[18px] font-semibold text-ink tabular">≈ {inr(monthly)}/month</p>
        <Link href={`/tools/emi?price=${grandTotal}`} className="text-[14px] font-semibold text-primary hover:underline">
          Adjust in EMI calculator →
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {status === "available" && (
          <>
            <Link href={`/unit/${unitId}/book`} className="btn btn-primary">
              Reserve with ₹51,000 EOI
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/visit?u=${unitId}`} className="btn btn-tertiary">Book a visit</Link>
              <HeartButton unitId={unitId} variant="chip" className="w-full" />
            </div>
            <ShareButton text={`${bhk} BHK at ${towerName}, ${inrShort(grandTotal)} all-in`} label="Share this flat" className="btn btn-tertiary w-full" />
          </>
        )}
        {status === "held" && (
          <>
            <div className="rounded-md bg-canvas-soft px-4 py-3 text-[15px] text-body">
              This flat is <span className="font-semibold text-ink">on hold</span>. If this is your hold, finish your reservation before it expires.
            </div>
            <Link href={`/unit/${unitId}/book`} className="btn btn-primary">Continue reservation</Link>
            <HeartButton unitId={unitId} variant="chip" className="w-full" />
          </>
        )}
        {status === "booked" && (
          <>
            <div className="rounded-md bg-canvas-soft px-4 py-3 text-[15px] text-body">
              This flat is <span className="font-semibold text-ink">booked</span>. Save it to get notified if it frees up, or see other available flats.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HeartButton unitId={unitId} variant="chip" className="w-full" />
              <Link href={`/explore/${unitId.split("-")[0]}`} className="btn btn-secondary">See available</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
