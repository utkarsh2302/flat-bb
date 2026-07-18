"use client";

import { inDateFriendly } from "@/lib/format";
import PhotoBlock from "@/components/PhotoBlock";
import { useApp } from "@/lib/store";

export default function MilestoneCertify({
  evidenceImages,
  towerName,
}: {
  evidenceImages: string[];
  towerName: string;
}) {
  const { s, certify } = useApp();
  const affected = Object.values(s.unitStatus).filter((x) => x === "booked").length;

  return (
    <ol className="mt-6 space-y-3">
      {s.milestones.map((m) => {
        const isCertified = m.status === "certified";
        const isCertifiable = m.status === "in_progress";
        return (
          <li key={m.id} className={`rounded-lg border p-5 ${isCertifiable ? "border-primary/40 bg-canvas" : "border-line bg-canvas-soft/60"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold ${isCertified ? "bg-ink text-on-primary" : isCertifiable ? "bg-primary text-on-primary" : "bg-canvas-soft text-body-mid"}`}>
                  {isCertified ? "✓" : ""}
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-ink">{m.label}</p>
                  <p className="text-[13px] text-body-mid">
                    {m.pct}% trigger ·{" "}
                    {isCertified
                      ? `Certified ${m.certifiedOn ? inDateFriendly(m.certifiedOn) : "just now"}`
                      : isCertifiable
                        ? `${m.evidenceCount} photos uploaded — awaiting certification`
                        : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {isCertifiable && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {evidenceImages.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-sm">
                      <PhotoBlock src={src} label={`${towerName} evidence`} />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => certify(m.id)} className="btn btn-primary mt-4">
                  Certify &amp; release demand letters
                </button>
                <p className="mt-2 text-[13px] text-body-mid">
                  This will generate a {m.pct}% demand for {affected} booked buyers, each with the evidence attached.
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
