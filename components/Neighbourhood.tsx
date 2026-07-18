import { NEIGHBOURHOOD } from "@/lib/data";

/** Trulia-style "what's around" — connectivity buyers actually care about. */
export default function Neighbourhood() {
  return (
    <div className="card p-6">
      <p className="text-[13px] uppercase tracking-wide text-body-mid">The neighbourhood</p>
      <p className="mt-1 text-[18px] font-semibold text-ink">Connected to everything that matters</p>

      {/* Stylised connectivity map */}
      <div className="relative mt-4 h-36 overflow-hidden rounded-md bg-canvas-soft">
        <svg viewBox="0 0 400 150" className="h-full w-full" aria-hidden>
          <path d="M0 110 Q120 90 200 100 T400 80" fill="none" stroke="var(--color-mute)" strokeWidth="6" />
          <path d="M60 0 L120 150" stroke="var(--color-mute)" strokeWidth="4" opacity="0.6" />
          <path d="M260 0 L300 150" stroke="var(--color-mute)" strokeWidth="4" opacity="0.6" />
          <circle cx="200" cy="98" r="9" fill="var(--color-primary)" />
          <circle cx="200" cy="98" r="16" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.4" />
        </svg>
        <span className="absolute left-1/2 top-[58%] -translate-x-1/2 translate-y-2 rounded-full bg-canvas px-2.5 py-0.5 text-[12px] font-semibold text-ink shadow-[var(--shadow-soft)]">
          You are here
        </span>
      </div>

      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {NEIGHBOURHOOD.map((l) => (
          <li key={l.label} className="flex items-start gap-3">
            <span className="text-[18px] leading-none">{l.icon}</span>
            <div>
              <p className="text-[15px] text-ink">{l.label}</p>
              <p className="text-[13px] text-body-mid">{l.distance}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
