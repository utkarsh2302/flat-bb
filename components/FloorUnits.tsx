"use client";

import Link from "next/link";
import Image from "next/image";
import type { Facing, UnitStatus } from "@/lib/data";
import { planFor } from "@/lib/data";
import { inrShort, sqft } from "@/lib/format";
import { FACING_LABEL } from "@/components/Compass";
import { STATUS_LABEL, statusChipClass } from "@/lib/status";
import { useApp } from "@/lib/store";
import HeartButton from "@/components/HeartButton";

export interface FloorUnit {
  id: string;
  bhk: 2 | 3 | 4;
  superSqft: number;
  facing: Facing;
  viewTags: string[];
  price: number;
  seedStatus: UnitStatus;
}

export default function FloorUnits({ units }: { units: FloorUnit[] }) {
  const { s } = useApp();
  const status = (u: FloorUnit): UnitStatus => s.unitStatus[u.id] ?? u.seedStatus;
  const available = units.filter((u) => status(u) === "available").length;

  return (
    <>
      <p className="t-body-md mt-2 text-body">
        {available} of {units.length} flats available on this floor.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {units.map((u) => {
          const st = status(u);
          const booked = st === "booked";
          return (
            <Link
              key={u.id}
              href={`/unit/${u.id}`}
              className={`group flex flex-col rounded-lg border p-5 transition-all ${
                booked
                  ? "border-line bg-canvas-soft/60"
                  : "card lift hover:border-primary"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-body-mid">{u.id}</p>
                  <p className="t-display-sub-sm mt-0.5">{u.bhk} BHK</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-semibold ${statusChipClass(st)}`}>
                  {st === "available" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />}
                  {STATUS_LABEL[st]}
                </span>
              </div>

              <FloorPlanMini bhk={u.bhk} />

              <dl className="mt-3 space-y-1 text-[14px]">
                <Row k="Super area" v={sqft(u.superSqft)} />
                <Row k="Facing" v={FACING_LABEL[u.facing]} />
                {u.viewTags.length > 0 && <Row k="View" v={u.viewTags.join(", ")} />}
              </dl>

              <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                <div>
                  <p className="text-[12px] text-body-mid">All-in</p>
                  <p className="text-[19px] font-semibold text-ink tabular">{inrShort(u.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HeartButton unitId={u.id} />
                  <span className="text-[14px] font-semibold text-ink group-hover:text-primary">
                    {booked ? "View" : "View flat"} →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-body-mid">{k}</dt>
      <dd className="font-medium text-ink">{v}</dd>
    </div>
  );
}

function FloorPlanMini({ bhk }: { bhk: 2 | 3 | 4 }) {
  return (
    <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-sm bg-white ring-1 ring-ink/5">
      <Image
        src={planFor(bhk)}
        alt={`${bhk} BHK floor plan`}
        fill
        sizes="(max-width:640px) 90vw, 260px"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
      />
    </div>
  );
}
