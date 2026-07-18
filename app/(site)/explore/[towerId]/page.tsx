import { notFound } from "next/navigation";
import { getTower, floorsOfTower, unitsOfFloor, PROJECT } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import Elevation, { type ElevFloor } from "@/components/Elevation";
import Tower3D, { type Tower3DFloor } from "@/components/Tower3D";
import { BackLink, Eyebrow, AvailabilityLegend } from "@/components/ui";

export async function generateStaticParams() {
  return [{ towerId: "T1" }, { towerId: "T2" }, { towerId: "T3" }];
}

export default async function TowerPage({
  params,
}: {
  params: Promise<{ towerId: string }>;
}) {
  const { towerId } = await params;
  const tower = getTower(towerId);
  if (!tower) notFound();

  const floors: ElevFloor[] = floorsOfTower(towerId).map((f) => ({
    floor: f.floor,
    available: f.available,
    held: f.held,
    booked: f.booked,
    units: f.units.map((u) => ({
      id: u.id,
      letter: u.letter,
      bhk: u.bhk,
      facing: u.facing,
      status: u.status,
      allIn: unitAllIn(u),
    })),
  }));

  // Ascending floors (unit ids only) for the 3D tower — live status is resolved
  // from the store inside the component.
  const floors3d: Tower3DFloor[] = [];
  for (let f = 1; f <= tower.floors; f++) {
    floors3d.push({ floor: f, unitIds: unitsOfFloor(towerId, f).map((u) => u.id) });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-6 pb-10 sm:px-8">
      <BackLink href="/explore">All towers</BackLink>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>{PROJECT.name}</Eyebrow>
          <h1 className="t-serif-xl mt-2">
            {tower.name} <span className="align-middle text-[0.5em] text-body-mid">{tower.id}</span>
          </h1>
          <p className="mt-1 text-[15px] text-body">
            {tower.floors} floors{tower.premiumView ? ` · ${tower.premiumView}` : ""}
          </p>
        </div>
        <div className="hidden sm:block">
          <AvailabilityLegend />
        </div>
      </div>

      <div className="mt-5">
        <Tower3D towerId={tower.id} towerName={tower.name} floors={floors3d} />
      </div>

      <Elevation towerId={tower.id} floors={floors} />
    </div>
  );
}
