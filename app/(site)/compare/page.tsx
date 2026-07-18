"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUnit, getTower, UNITS, type Unit } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inr, inrShort, sqft } from "@/lib/format";
import { FACING_LABEL } from "@/components/Compass";
import StatusBadge from "@/components/StatusBadge";
import { Eyebrow } from "@/components/ui";

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("u") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(u.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3));
  }, []);

  const units = ids.map((id) => getUnit(id)).filter((x): x is Unit => Boolean(x));
  const suggestions = UNITS.filter((x) => x.status === "available" && !ids.includes(x.id)).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-10 sm:px-8">
      <Eyebrow>Side by side</Eyebrow>
      <h1 className="t-serif-lg mt-3">Compare flats</h1>
      <p className="t-body-md mt-3 max-w-xl text-body">
        Compare up to 3 flats on price, area, facing and floor — the way a family actually decides.
      </p>

      {units.length === 0 ? (
        <p className="mt-8 card p-6 text-[16px] text-body">
          No flats picked yet. Open any flat and tap <span className="font-semibold text-ink">“Compare”</span>, or add one below.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40" />
                {units.map((unit) => (
                  <th key={unit.id} className="p-3 text-left align-bottom">
                    <p className="text-[13px] text-body-mid">{unit.id}</p>
                    <p className="t-display-sub-sm">{unit.bhk} BHK</p>
                    <p className="text-[14px] text-body">{getTower(unit.towerId)!.name}</p>
                    <div className="mt-1"><StatusBadge status={unit.status} size="sm" /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="All-in price" units={units} render={(u) => <span className="text-[18px] font-semibold text-ink tabular">{inrShort(unitAllIn(u))}</span>} />
              <CompareRow label="Exact price" units={units} render={(u) => <span className="tabular">{inr(unitAllIn(u))}</span>} />
              <CompareRow label="Price / sq.ft" units={units} render={(u) => <span className="tabular">{inr(Math.round(unitAllIn(u) / u.superSqft))}</span>} />
              <CompareRow label="Super area" units={units} render={(u) => sqft(u.superSqft)} />
              <CompareRow label="Carpet area" units={units} render={(u) => sqft(u.carpetSqft)} />
              <CompareRow label="Facing" units={units} render={(u) => FACING_LABEL[u.facing]} />
              <CompareRow label="Floor" units={units} render={(u) => `${u.floor}`} />
              <CompareRow label="View" units={units} render={(u) => (u.viewTags.length ? u.viewTags.join(", ") : "—")} />
              <CompareRow
                label=""
                units={units}
                render={(u) => (
                  <Link href={`/unit/${u.id}`} className="text-[14px] font-semibold text-primary hover:underline">Open flat →</Link>
                )}
              />
            </tbody>
          </table>
        </div>
      )}

      {units.length < 3 && suggestions.length > 0 && (
        <div className="mt-10">
          <p className="text-[15px] font-semibold text-ink">Add another flat</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  const next = [...ids, s.id].slice(0, 3);
                  setIds(next);
                  window.history.replaceState(null, "", `/compare?u=${next.join(",")}`);
                }}
                className="press rounded-full border border-line bg-canvas px-4 py-2 text-[14px] text-ink hover:border-primary"
              >
                + {s.id} · {s.bhk} BHK · {inrShort(unitAllIn(s))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, units, render }: { label: string; units: Unit[]; render: (u: Unit) => React.ReactNode }) {
  return (
    <tr>
      <td className="border-t border-line p-3 text-[14px] font-medium text-body-mid">{label}</td>
      {units.map((u) => (
        <td key={u.id} className="border-t border-line p-3 text-[15px] text-ink">{render(u)}</td>
      ))}
    </tr>
  );
}
