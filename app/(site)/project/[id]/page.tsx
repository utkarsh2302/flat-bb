import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProject, PROJECTS, CONTACT } from "@/lib/data";
import { BackLink } from "@/components/ui";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

const AMENITIES = [
  "Green-building design",
  "Gym & community hall",
  "Automated security & access",
  "Solar power & EV charging",
  "Power backup for commons",
  "Senior, child & specially-abled friendly",
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getPortfolioProject(id);
  if (!p) notFound();
  const others = PROJECTS.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[62svh] min-h-[420px] items-end overflow-hidden">
        <Image src={p.hero ?? p.image} alt={`${p.name} by Trimurty`} fill priority sizes="100vw" className="img-cover a-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/30" />
        <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-12 sm:px-8">
          <span
            className={`inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${
              p.status === "ready" ? "bg-primary text-on-primary" : "glass-dark text-white"
            }`}
          >
            {p.status === "ready" ? "Ready to move" : "Under construction"}
          </span>
          <h1 className="t-hero mt-4 text-white">{p.name}</h1>
          <p className="t-body-lg mt-3 text-white/85">{p.config}</p>
          <p className="mt-1 text-[15px] text-white/70">{p.locality}, {p.city} · RERA {p.reraNo}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8">
        <div className="no-print">
          <BackLink href="/#projects">All projects</BackLink>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* About + amenities */}
          <div>
            <p className="t-eyebrow text-primary">About</p>
            <h2 className="t-serif-lg mt-3">Crafted for the life inside it.</h2>
            <p className="t-body-md mt-4 text-body">
              {p.name} brings Trimurty&apos;s signature of considered design and
              premium finishes to {p.locality}. Thoughtful layouts, generous light,
              and amenities built around real families — a {p.city} address that
              speaks for itself.
            </p>

            <h3 className="t-display-sub-sm mt-10">Amenities</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {AMENITIES.map((a) => (
                <li key={a} className="flex items-center gap-2.5 rounded-md bg-canvas-soft px-4 py-3 text-[15px] text-ink">
                  <span className="text-primary">✦</span> {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiry card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line p-6 shadow-[var(--shadow-soft)]">
              <p className="t-eyebrow text-primary">Enquire</p>
              <p className="mt-2 t-serif-md">Talk to us about {p.name}</p>
              <p className="mt-2 text-[15px] text-body">
                Get the price list, floor plans and a private site visit — in Hindi
                or English.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {p.flagship && (
                  <Link href="/explore" className="btn btn-primary">Explore live availability</Link>
                )}
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`I'm interested in ${p.name} (${p.reraNo})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${p.flagship ? "btn-tertiary" : "btn-primary"}`}
                >
                  Enquire on WhatsApp
                </a>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="btn btn-tertiary">
                  Call {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* More projects */}
        <div className="mt-16">
          <h3 className="t-serif-lg">More Trimurty addresses</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} href={o.flagship ? "/explore" : `/project/${o.id}`} className="group overflow-hidden rounded-lg lift">
                <div className="relative h-48">
                  <Image src={o.image} alt={o.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="img-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="t-serif-md text-white">{o.name}</p>
                    <p className="text-[13px] text-white/75">{o.locality}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
