import { notFound } from "next/navigation";
import { getTower, unitsOfFloor } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { BackLink, AvailabilityLegend } from "@/components/ui";
import FloorUnits, { type FloorUnit } from "@/components/FloorUnits";

export default async function FloorPage({
  params,
}: {
  params: Promise<{ towerId: string; floor: string }>;
}) {
  const { towerId, floor } = await params;
  const tower = getTower(towerId);
  const floorNum = Number(floor);
  if (!tower || !Number.isInteger(floorNum) || floorNum < 1 || floorNum > tower.floors) {
    notFound();
  }
  const units: FloorUnit[] = unitsOfFloor(towerId, floorNum).map((u) => ({
    id: u.id,
    bhk: u.bhk,
    superSqft: u.superSqft,
    facing: u.facing,
    viewTags: u.viewTags,
    price: unitAllIn(u),
    seedStatus: u.status,
  }));

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
      <BackLink href={`/explore/${towerId}`}>{tower.name} elevation</BackLink>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="t-serif-lg">
          Floor {floorNum} · {tower.name}
        </h1>
        <AvailabilityLegend />
      </div>

      <FloorUnits units={units} />
    </div>
  );
}
