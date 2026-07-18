"use client";

import { useState } from "react";
import type { Facing } from "@/lib/data";

const FACING_AZIMUTH: Record<Facing, number> = {
  N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315,
};

/** Directional sun-path heuristic (no 3D): sun swings E→S→W through the day. */
export default function SunPath({ facing }: { facing: Facing }) {
  const [hour, setHour] = useState(9);
  const sunAz = 90 + ((hour - 6) / 12) * 180; // 6:00 East → 18:00 West
  const face = FACING_AZIMUTH[facing];
  const diff = Math.min(Math.abs(face - sunAz), 360 - Math.abs(face - sunAz));
  const direct = diff < 50;
  const t = (hour - 6) / 12; // 0..1 across the arc
  const sunX = 20 + t * 260;
  const sunY = 90 - Math.sin(t * Math.PI) * 60;

  const label = (() => {
    if (hour < 12) return direct ? "Bright morning sun" : "Soft morning light";
    if (hour < 15) return direct ? "Strong midday sun" : "Indirect midday light";
    return direct ? "Warm evening sun" : "Cool, shaded evening";
  })();

  return (
    <div className="rounded-md bg-canvas-soft p-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-ink">Sun on your {facing} facing</p>
        <p className="text-[14px] text-body">{formatHour(hour)}</p>
      </div>
      <svg viewBox="0 0 300 110" className="mt-3 w-full" role="img" aria-label="Sun path across the day">
        <line x1="20" y1="92" x2="280" y2="92" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M20 92 Q150 2 280 92" fill="none" stroke="var(--color-mute)" strokeWidth="2" strokeDasharray="4 5" />
        <text x="20" y="106" fontSize="10" fill="var(--color-body-mid)" textAnchor="middle">6am · E</text>
        <text x="150" y="106" fontSize="10" fill="var(--color-body-mid)" textAnchor="middle">Noon · S</text>
        <text x="280" y="106" fontSize="10" fill="var(--color-body-mid)" textAnchor="middle">6pm · W</text>
        <circle cx={sunX} cy={sunY} r="9" fill={direct ? "var(--color-primary)" : "var(--color-mute)"} />
      </svg>
      <input
        type="range"
        min={6}
        max={18}
        step={1}
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        aria-label="Time of day"
        className="mt-2 w-full accent-[var(--color-primary)]"
      />
      <p className="mt-2 text-[15px] text-ink">
        <span className="font-semibold">{label}.</span>{" "}
        <span className="text-body">
          {direct ? "This flat gets direct sunlight now." : "No harsh direct sun at this hour."}
        </span>
      </p>
    </div>
  );
}

function formatHour(h: number): string {
  const suffix = h < 12 ? "am" : "pm";
  const hr = h <= 12 ? h : h - 12;
  return `${hr}:00 ${suffix}`;
}
