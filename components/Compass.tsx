import type { Facing } from "@/lib/data";

const ANGLE: Record<Facing, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export const FACING_LABEL: Record<Facing, string> = {
  N: "North",
  NE: "North-East",
  E: "East",
  SE: "South-East",
  S: "South",
  SW: "South-West",
  W: "West",
  NW: "North-West",
};

/** A small facing/Vastu compass. The arrow points to the unit's facing. */
export default function Compass({ facing, size = 96 }: { facing: Facing; size?: number }) {
  const rad = (ANGLE[facing] * Math.PI) / 180;
  const cx = 50;
  const cy = 50;
  const tipX = cx + Math.sin(rad) * 30;
  const tipY = cy - Math.cos(rad) * 30;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Facing ${FACING_LABEL[facing]}`}>
      <circle cx="50" cy="50" r="46" fill="var(--color-canvas-soft)" stroke="var(--color-ink)" strokeOpacity="0.15" />
      {(["N", "E", "S", "W"] as const).map((d) => {
        const a = (ANGLE[d] * Math.PI) / 180;
        return (
          <text
            key={d}
            x={50 + Math.sin(a) * 39}
            y={50 - Math.cos(a) * 39 + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight={d === facing ? 700 : 500}
            fill="var(--color-ink)"
            fillOpacity={d === facing ? 1 : 0.55}
          >
            {d}
          </text>
        );
      })}
      <circle cx="50" cy="50" r="3" fill="var(--color-ink)" />
      <line x1="50" y1="50" x2={tipX} y2={tipY} stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={tipX} cy={tipY} r="3.5" fill="var(--color-primary)" />
    </svg>
  );
}
