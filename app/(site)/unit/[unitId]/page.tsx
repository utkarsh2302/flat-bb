import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit, getTower, UNITS } from "@/lib/data";
import { computeCostSheet, emi } from "@/lib/pricing";
import { sqft, inr } from "@/lib/format";
import { vastuScore } from "@/lib/vastu";
import Compass, { FACING_LABEL } from "@/components/Compass";
import SunPath from "@/components/SunPath";
import UnitBookingCard from "@/components/UnitBookingCard";
import UnitStickyBar from "@/components/UnitStickyBar";
import Neighbourhood from "@/components/Neighbourhood";
import UnitGallery from "@/components/UnitGallery";
import Breadcrumbs from "@/components/Breadcrumbs";
import PossessionCountdown from "@/components/PossessionCountdown";
import { RecordView } from "@/components/RecentlyViewed";

export function generateStaticParams() {
  return UNITS.map((u) => ({ unitId: u.id }));
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const tower = getTower(unit.towerId)!;
  const cost = computeCostSheet(unit);
  const monthly = emi(Math.round(cost.grandTotal * 0.8), 8.5, 20);
  const vastu = vastuScore(unit.facing, unit.vastuEntrance);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-6 pb-28 sm:px-8 sm:pb-8">
      <RecordView unitId={unit.id} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Explore", href: "/explore" },
          { label: tower.name, href: `/explore/${unit.towerId}` },
          { label: `Floor ${unit.floor}`, href: `/explore/${unit.towerId}/${unit.floor}` },
          { label: `${unit.bhk} BHK · ${unit.id}` },
        ]}
      />

      <h1 className="t-display-lg mt-3">
        {unit.bhk} BHK · {tower.name}
      </h1>
      <p className="t-body-md mt-1 text-body">
        {unit.id} · Floor {unit.floor} · {sqft(unit.superSqft)} super
        {unit.viewTags.length > 0 ? ` · ${unit.viewTags.join(" · ")}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PossessionCountdown />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-3 py-1 text-[13px] font-medium text-ink">
          🧭 Vastu {vastu.score}/100 · {vastu.label}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-3 py-1 text-[13px] font-medium text-ink">
          ₹{inr(cost.perSqftAllIn).replace("₹", "")}/sq.ft all-in · no hidden charges
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: plan, sun-path */}
        <div className="space-y-6">
          <UnitGallery bhk={unit.bhk} />
          <SunPath facing={unit.facing} />
          <Neighbourhood />
        </div>

        {/* Right: price + facts + CTAs */}
        <div className="space-y-5">
          <UnitBookingCard
            unitId={unit.id}
            seedStatus={unit.status}
            bhk={unit.bhk}
            towerName={tower.name}
            grandTotal={cost.grandTotal}
            perSqftAllIn={cost.perSqftAllIn}
            monthly={monthly}
          />

          {/* Facing / Vastu */}
          <div className="rounded-md border border-ink/10 p-6">
            <div className="flex items-center gap-5">
              <Compass facing={unit.facing} />
              <div>
                <p className="text-[13px] uppercase tracking-wide text-body-mid">Facing & Vastu</p>
                <p className="mt-1 text-[18px] font-semibold text-ink">
                  {FACING_LABEL[unit.facing]} facing
                </p>
                <p className="text-[15px] text-body">
                  Main door towards {FACING_LABEL[unit.vastuEntrance]}
                  {unit.corner ? " · Corner unit" : ""}
                </p>
                <Link
                  href={`/compare?u=${unit.id}`}
                  className="mt-2 inline-block text-[14px] font-semibold text-primary hover:underline"
                >
                  Compare with other flats →
                </Link>
              </div>
            </div>
          </div>

          {/* Area breakdown */}
          <div className="rounded-md border border-ink/10 p-6">
            <p className="text-[13px] uppercase tracking-wide text-body-mid">Area</p>
            <dl className="mt-3 space-y-2 text-[15px]">
              <AreaRow k="Carpet area" v={sqft(unit.carpetSqft)} />
              <AreaRow k="Built-up area" v={sqft(unit.builtupSqft)} />
              <AreaRow k="Super built-up" v={sqft(unit.superSqft)} strong />
            </dl>
          </div>
        </div>
      </div>

      <UnitStickyBar unitId={unit.id} seedStatus={unit.status} grandTotal={cost.grandTotal} />
    </div>
  );
}

function AreaRow({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between border-b border-ink/5 pb-2 last:border-0">
      <dt className="text-body">{k}</dt>
      <dd className={`tabular ${strong ? "font-semibold text-ink" : "text-ink"}`}>{v}</dd>
    </div>
  );
}

