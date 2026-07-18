import { PROGRESS_FEED, MILESTONES, getTower } from "@/lib/data";
import { inDateFriendly } from "@/lib/format";
import { Eyebrow } from "@/components/ui";
import PhotoBlock from "@/components/PhotoBlock";

export const metadata = { title: "Construction progress — Trimurty" };

export default function ProgressPage() {
  const certifiedPct = MILESTONES.filter((m) => m.status === "certified").reduce((t, m) => t + m.pct, 0);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-10">
      <Eyebrow>Watch your home rise</Eyebrow>
      <h1 className="t-display-lg mt-3">Construction updates</h1>
      <p className="t-body-md mt-3 text-body">
        Geo-tagged, timestamped photos — certified by the project architect. This
        is the same evidence that unlocks your demand letters.
      </p>

      {/* Timelapse (pinned) */}
      <div className="mt-8 overflow-hidden rounded-md bg-ink text-on-primary">
        <PhotoBlock src="/images/crimson-banner-1920.webp" tall label="Weekly timelapse" priority />
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="text-[13px] uppercase tracking-wide text-mute">Pinned</p>
            <p className="text-[18px] font-semibold">Full site timelapse · updated weekly</p>
          </div>
          <span className="text-[15px] font-semibold text-primary">▶ Play</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mt-6 rounded-md bg-canvas-soft p-5">
        <div className="flex items-center justify-between text-[15px]">
          <span className="font-semibold text-ink">Overall construction</span>
          <span className="font-semibold text-ink tabular">{certifiedPct}% certified</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-canvas">
          <span className="block h-full rounded-full bg-primary" style={{ width: `${certifiedPct}%` }} />
        </div>
      </div>

      {/* Feed */}
      <div className="mt-8 space-y-6">
        {PROGRESS_FEED.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-md border border-ink/10 bg-canvas">
            <PhotoBlock src={p.image} label={`${getTower(p.towerId)?.name} · ${p.milestone}`} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[17px] font-semibold text-ink">{p.milestone}</p>
                {p.certified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-canvas-soft px-3 py-1 text-[13px] font-semibold text-ink">
                    ✅ Certified
                  </span>
                ) : (
                  <span className="rounded-full bg-canvas-soft px-3 py-1 text-[13px] text-body">In progress</span>
                )}
              </div>
              <p className="mt-2 text-[15px] text-body">{p.caption}</p>
              <p className="mt-2 text-[13px] text-body-mid">
                {getTower(p.towerId)?.name} tower · {inDateFriendly(p.date)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
