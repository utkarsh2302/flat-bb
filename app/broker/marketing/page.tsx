import Image from "next/image";
import { PROJECTS, COMPANY } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import SimDownload from "@/components/SimDownload";
import ShareButton from "@/components/ShareButton";

export const metadata = { title: "Marketing kit — Associate" };

const EXTRAS = [
  { title: "Auto-branded cost sheets", desc: "Every unit's all-in cost sheet, stamped with your name & RERA number.", image: "/images/premium-and-comfort-living.webp" },
  { title: "Social creative pack", desc: "Ready-to-post reels, stories and carousels for WhatsApp & Instagram.", image: "/images/high-living-standards.jpg" },
  { title: "Price list (this month)", desc: "Current rate card, floor-rise & PLC — always the live version.", image: "/images/going-green.jpg" },
];

export default function BrokerMarketing() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Sell more, faster</Eyebrow>
      <h1 className="t-serif-lg mt-2">Marketing kit</h1>
      <p className="t-body-sm mt-2 text-body">
        Brand-approved brochures, creatives and cost sheets — auto-personalised for {COMPANY.name} associates. Download or share straight to WhatsApp.
      </p>

      <h2 className="t-display-sub-sm mt-8">Project brochures</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.slice(0, 6).map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg card">
            <div className="relative h-40">
              <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, 33vw" className="img-cover" />
            </div>
            <div className="p-5">
              <p className="text-[16px] font-semibold text-ink">{p.name}</p>
              <p className="text-[13px] text-body-mid">{p.config} · {p.locality}</p>
              <div className="mt-3 flex gap-2">
                <SimDownload label="Brochure PDF" className="btn btn-tertiary !py-2 !px-3 !text-[14px]" />
                <ShareButton text={`${p.name} by ${COMPANY.name} — ${p.config}, ${p.locality}`} label="Share" className="btn btn-tertiary !py-2 !px-3 !text-[14px]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="t-display-sub-sm mt-10">Sales assets</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        {EXTRAS.map((a) => (
          <div key={a.title} className="overflow-hidden rounded-lg card">
            <div className="relative h-32">
              <Image src={a.image} alt={a.title} fill sizes="(max-width:768px) 100vw, 33vw" className="img-cover" />
            </div>
            <div className="p-5">
              <p className="text-[16px] font-semibold text-ink">{a.title}</p>
              <p className="mt-1 text-[13px] text-body">{a.desc}</p>
              <SimDownload className="btn btn-tertiary mt-3 !py-2 !px-3 !text-[14px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
