"use client";

import Link from "next/link";
import { getUnit, getTower } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inrShort, sqft } from "@/lib/format";
import { FACING_LABEL } from "@/components/Compass";
import { STATUS_LABEL, statusChipClass } from "@/lib/status";
import HeartButton from "@/components/HeartButton";
import { Eyebrow } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function ShortlistPage() {
  const { s } = useApp();
  const units = s.shortlist.map((id) => getUnit(id)).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const compareHref = `/compare?u=${units.slice(0, 3).map((u) => u.id).join(",")}`;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <Eyebrow>Your shortlist</Eyebrow>
      <h1 className="t-serif-xl mt-2">Saved flats</h1>
      <p className="t-body-md mt-2 text-body">
        The homes you love, in one place — compare them side by side, or reserve when you&apos;re ready.
      </p>

      {units.length === 0 ? (
        <div className="mt-10 card p-10 text-center">
          <p className="text-[40px]">🤍</p>
          <p className="t-serif-md mt-3">Nothing saved yet</p>
          <p className="mt-2 text-[15px] text-body">
            Tap the heart on any flat to save it here. Shortlist a few, then compare.
          </p>
          <Link href="/explore" className="btn btn-primary btn-lg mt-6">Explore homes</Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[15px] text-body"><span className="font-semibold text-ink tabular">{units.length}</span> saved</span>
            {units.length >= 2 && (
              <Link href={compareHref} className="btn btn-secondary !py-2 !px-4 !text-[15px]">Compare {Math.min(units.length, 3)} side by side</Link>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u) => {
              const st = s.unitStatus[u.id] ?? u.status;
              return (
                <Link key={u.id} href={`/unit/${u.id}`} className="group card lift p-5 hover:border-primary">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] text-body-mid">{u.id} · {getTower(u.towerId)!.name}</p>
                      <p className="t-display-sub-sm mt-0.5">{u.bhk} BHK</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-semibold ${statusChipClass(st)}`}>
                      {STATUS_LABEL[st]}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-1 text-[14px]">
                    <div className="flex justify-between"><dt className="text-body-mid">Floor</dt><dd className="text-ink">{u.floor}</dd></div>
                    <div className="flex justify-between"><dt className="text-body-mid">Super area</dt><dd className="text-ink tabular">{sqft(u.superSqft)}</dd></div>
                    <div className="flex justify-between"><dt className="text-body-mid">Facing</dt><dd className="text-ink">{FACING_LABEL[u.facing]}</dd></div>
                  </dl>
                  <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                    <div>
                      <p className="text-[12px] text-body-mid">All-in</p>
                      <p className="text-[19px] font-semibold text-ink tabular">{inrShort(unitAllIn(u))}</p>
                    </div>
                    <HeartButton unitId={u.id} />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
