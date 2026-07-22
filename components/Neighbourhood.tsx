import { NEIGHBOURHOOD, PROJECT_GEO } from "@/lib/data";

/** Trulia-style "what's around" — connectivity buyers actually care about. */
export default function Neighbourhood() {
  const { lat, lon } = PROJECT_GEO;
  const bbox = [lon - 0.03, lat - 0.02, lon + 0.03, lat + 0.02].map((n) => n.toFixed(5)).join("%2C");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  const full = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;

  return (
    <div className="card p-6">
      <p className="text-[13px] uppercase tracking-wide text-body-mid">The neighbourhood</p>
      <p className="mt-1 text-[18px] font-semibold text-ink">Connected to everything that matters</p>

      {/* Real interactive map of the actual location */}
      <div className="relative mt-4 h-56 overflow-hidden rounded-md border border-line bg-canvas-soft">
        <iframe
          title={`Map of ${PROJECT_GEO.label}`}
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[12px] text-body-mid">
        <span>📍 {PROJECT_GEO.label}</span>
        <a href={full} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
          Open in maps →
        </a>
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
