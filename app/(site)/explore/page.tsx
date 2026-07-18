import Link from "next/link";
import { TOWERS, unitsOfTower, availability } from "@/lib/data";
import { Eyebrow, AvailabilityLegend } from "@/components/ui";

export const metadata = { title: "Explore homes — Trimurty" };

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <Eyebrow>Live inventory</Eyebrow>
      <h1 className="t-display-lg mt-3">Pick a tower to explore</h1>
      <p className="t-body-md mt-3 max-w-xl text-body">
        Tap a tower to see every floor, then every flat — with live availability,
        facing, and all-in price. One tap to the full cost sheet.
      </p>

      <div className="mt-6">
        <AvailabilityLegend />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOWERS.map((t) => {
          const s = availability(unitsOfTower(t.id));
          return (
            <Link
              key={t.id}
              href={`/explore/${t.id}`}
              className="group card lift p-6 hover:border-primary"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="t-display-sub-sm">{t.name}</h2>
                <span className="text-[14px] text-body-mid">{t.id}</span>
              </div>
              <p className="mt-1 text-[15px] text-body">
                {t.floors} floors{t.premiumView ? ` · ${t.premiumView}` : ""}
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Stat n={s.available} label="Available" accent />
                <Stat n={s.held} label="On hold" />
                <Stat n={s.booked} label="Booked" />
              </dl>

              <p className="mt-5 text-[15px] font-semibold text-ink group-hover:text-primary">
                Explore {t.name} →
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <div className="rounded-sm bg-canvas-soft py-3">
      <dd className={`text-[24px] font-semibold tabular ${accent ? "text-primary" : "text-ink"}`}>
        {n}
      </dd>
      <dt className="text-[12px] text-body-mid">{label}</dt>
    </div>
  );
}
