import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit, getTower } from "@/lib/data";
import { computeCostSheet, emi } from "@/lib/pricing";
import { sqft } from "@/lib/format";
import Compass, { FACING_LABEL } from "@/components/Compass";
import SunPath from "@/components/SunPath";
import UnitBookingCard from "@/components/UnitBookingCard";
import UnitStickyBar from "@/components/UnitStickyBar";
import Neighbourhood from "@/components/Neighbourhood";
import { BackLink } from "@/components/ui";

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

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-8 pb-28 sm:px-8 sm:pb-8">
      <BackLink href={`/explore/${unit.towerId}/${unit.floor}`}>
        Floor {unit.floor}, {tower.name}
      </BackLink>

      <h1 className="t-display-lg mt-3">
        {unit.bhk} BHK · {tower.name}
      </h1>
      <p className="t-body-md mt-1 text-body">
        {unit.id} · Floor {unit.floor} · {sqft(unit.superSqft)} super
        {unit.viewTags.length > 0 ? ` · ${unit.viewTags.join(" · ")}` : ""}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: plan, sun-path */}
        <div className="space-y-6">
          <FloorPlan bhk={unit.bhk} />
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

function FloorPlan({ bhk }: { bhk: number }) {
  return (
    <div className="rounded-md bg-canvas-soft p-6">
      <p className="text-[13px] uppercase tracking-wide text-body-mid">Floor plan · {bhk} BHK</p>
      <svg viewBox="0 0 420 260" className="mt-3 w-full" role="img" aria-label={`${bhk} BHK floor plan`}>
        <g stroke="var(--color-ink)" strokeWidth="2.5" fill="none" strokeOpacity="0.5">
          <rect x="20" y="20" width="380" height="220" rx="4" />
          {/* living */}
          <rect x="20" y="20" width="200" height="130" fill="var(--color-mute)" fillOpacity="0.15" />
          {/* bedrooms */}
          <rect x="220" y="20" width="180" height="90" fill="var(--color-canvas)" />
          <line x1="310" y1="20" x2="310" y2="110" />
          {/* kitchen + bath */}
          <rect x="20" y="150" width="120" height="90" fill="var(--color-canvas)" />
          <rect x="140" y="150" width="80" height="90" fill="var(--color-canvas)" />
          <rect x="220" y="110" width="180" height="130" fill="var(--color-mute)" fillOpacity="0.1" />
        </g>
        <g fontSize="11" fill="var(--color-body)" fontWeight="600">
          <text x="60" y="90">Living / Dining</text>
          <text x="235" y="65">Bed 1</text>
          <text x="325" y="65">Bed 2</text>
          <text x="45" y="200">Kitchen</text>
          <text x="150" y="200">Bath</text>
          <text x="270" y="180">{bhk >= 3 ? "Bed 3 / Balcony" : "Balcony"}</text>
        </g>
      </svg>
      <p className="mt-2 text-[13px] text-body-mid">Indicative layout — not to scale.</p>
    </div>
  );
}
