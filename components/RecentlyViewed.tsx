"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUnit, getTower } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { unitAllIn } from "@/lib/pricing";
import { getRecent, pushRecent } from "@/lib/recent";

/** Drop this (invisible) on a unit page to record a view. */
export function RecordView({ unitId }: { unitId: string }) {
  useEffect(() => {
    pushRecent(unitId);
  }, [unitId]);
  return null;
}

/** Strip of recently-viewed flats (client, localStorage). */
export default function RecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(getRecent());
  }, []);
  const units = ids.map((id) => getUnit(id)).filter((u): u is NonNullable<typeof u> => Boolean(u)).slice(0, 6);
  if (units.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="text-[13px] uppercase tracking-wide text-body-mid">Recently viewed</p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {units.map((u) => (
          <Link key={u.id} href={`/unit/${u.id}`} className="shrink-0 rounded-lg border border-line bg-canvas px-4 py-3 hover:border-primary">
            <p className="text-[14px] font-semibold text-ink">{u.bhk} BHK · {u.id}</p>
            <p className="text-[12px] text-body-mid">{getTower(u.towerId)?.name} · {inrShort(unitAllIn(u))}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
