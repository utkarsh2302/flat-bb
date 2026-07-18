import Image from "next/image";
import { notFound } from "next/navigation";
import { getTower, floorsOfTower, PROJECT } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import Elevation, { type ElevFloor } from "@/components/Elevation";
import { BackLink } from "@/components/ui";

export async function generateStaticParams() {
  return [{ towerId: "T1" }, { towerId: "T2" }, { towerId: "T3" }];
}

const TOWER_IMAGE: Record<string, string> = {
  T1: "/images/divinity.jpg",
  T2: "/images/kachnar.webp",
  T3: "/images/valeria.webp",
};

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

  return (
    <div>
      {/* Project banner */}
      <section className="relative h-52 overflow-hidden sm:h-64">
        <Image
          src={TOWER_IMAGE[tower.id] ?? "/images/divinity.jpg"}
          alt={`${tower.name} tower, ${PROJECT.name}`}
          fill
          priority
          sizes="100vw"
          className="img-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1280px] px-5 pb-6 sm:px-8">
            <p className="t-eyebrow text-white/80">{PROJECT.name}</p>
            <h1 className="t-serif-xl mt-2 text-white">
              {tower.name}{" "}
              <span className="align-middle text-[0.5em] text-white/60">{tower.id}</span>
            </h1>
            <p className="mt-1 text-[15px] text-white/80">
              {tower.floors} floors{tower.premiumView ? ` · ${tower.premiumView}` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8">
        <BackLink href="/explore">All towers</BackLink>
        <Elevation towerId={tower.id} floors={floors} />
      </div>
    </div>
  );
}
