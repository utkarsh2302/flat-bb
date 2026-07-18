"use client";

import Link from "next/link";
import type { UnitStatus } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/status";
import HeartButton from "@/components/HeartButton";
import { useApp } from "@/lib/store";

/** Thumb-reachable action bar on mobile — the single most important mobile win. */
export default function UnitStickyBar({
  unitId,
  seedStatus,
  grandTotal,
}: {
  unitId: string;
  seedStatus: UnitStatus;
  grandTotal: number;
}) {
  const { s } = useApp();
  const status: UnitStatus = s.unitStatus[unitId] ?? seedStatus;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-body-mid">All-in · {STATUS_LABEL[status]}</p>
          <p className="truncate text-[18px] font-semibold text-ink tabular">{inrShort(grandTotal)}</p>
        </div>
        <HeartButton unitId={unitId} />
        {status === "available" && (
          <Link href={`/unit/${unitId}/book`} className="btn btn-primary">Reserve · ₹51,000</Link>
        )}
        {status === "held" && (
          <Link href={`/unit/${unitId}/book`} className="btn btn-primary">Continue</Link>
        )}
        {status === "booked" && (
          <Link href={`/visit?u=${unitId}`} className="btn btn-secondary">Book a visit</Link>
        )}
      </div>
    </div>
  );
}
