import Image from "next/image";
import Link from "next/link";
import {
  COMPANY,
  CONTACT,
  PROJECTS,
  PROJECT,
  UNITS,
  availability,
  type PortfolioProject,
} from "@/lib/data";
import SocialProof from "@/components/SocialProof";

export default function HomePage() {
  const live = availability(UNITS);

  return (
    <div>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-[#e9f0f5]">
        <Image
          src="/images/hero-trimurty.webp"
          alt="Trimurty residences rising in Jaipur"
          fill
          priority
          sizes="100vw"
          className="img-cover a-kenburns"
          style={{ objectPosition: "74% center" }}
        />
        {/* Airy light washes — the real render keeps its bright sky; a soft white
            gradient on the left guarantees the dark headline stays legible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(252,252,251,0.97) 0%, rgba(252,252,251,0.9) 30%, rgba(252,252,251,0.5) 52%, rgba(252,252,251,0.08) 70%, transparent 82%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(252,252,251,0.92) 0%, rgba(252,252,251,0.55) 38%, transparent 68%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 py-24 sm:px-8">
          <p className="a-fadeup t-eyebrow text-primary">
            {COMPANY.name} · {COMPANY.city} · Since {COMPANY.since}
          </p>
          <h1 className="a-fadeup d1 t-hero mt-5 max-w-3xl text-ink">
            Expertly crafted living,{" "}
            <span className="t-serif-italic text-primary">at the heart of Jaipur.</span>
          </h1>
          <p className="a-fadeup d2 t-body-lg mt-6 max-w-xl text-body">
            Explore premium residences with live availability, an honest all-in
            price, and a home you can watch rise — reserve in minutes.
          </p>
          <div className="a-fadeup d3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/explore" className="btn btn-primary btn-lg">
              Explore homes
            </Link>
            <a href="#projects" className="btn btn-tertiary btn-lg">
              View our projects
            </a>
          </div>
          <div className="a-fadeup d3 mt-5">
            <SocialProof />
          </div>

          <div className="a-fadeup d4 mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <HeroStat value={`Since ${COMPANY.since}`} label="Trusted in Jaipur" />
            <HeroStat value={COMPANY.homesDelivered} label="Homes delivered" />
            <HeroStat value="8 landmarks" label="Across the city" />
            <HeroStat value="RERA" label="Every project registered" />
          </div>
        </div>

        <div className="a-fadein absolute inset-x-0 bottom-6 flex justify-center">
          <svg className="a-scrollcue text-ink/40" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ───────────────── Portfolio ───────────────── */}
      <section id="projects" className="bg-canvas scroll-mt-16">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="t-eyebrow text-primary">Our projects</p>
            <h2 className="t-serif-xl mt-4">
              Landmarks across Jaipur,{" "}
              <span className="t-serif-italic">crafted to endure.</span>
            </h2>
            <p className="t-body-md mt-4 text-body">
              From boutique C-Scheme addresses to a landmark township on Tonk
              Road — every Trimurty home is designed for the life inside it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} liveAvailable={p.flagship ? live.available : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── The Trimurty app experience ───────────────── */}
      <section className="bg-ink text-on-primary">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
          <div>
            <p className="t-eyebrow text-primary">The Trimurty app</p>
            <h2 className="t-serif-xl mt-4 text-white">
              One app for the entire journey.
            </h2>
            <p className="t-body-md mt-4 text-mute">
              Discover, book, pay, and watch your home rise — without a single
              anxious phone call. Radical transparency, in your pocket.
            </p>
            <div className="mt-9 space-y-6">
              <ValuePoint n="01" title="See it live" body="Tap tower → floor → flat. Real-time availability in Trimurty's own app — no dropdowns, no guessing." />
              <ValuePoint n="02" title="See the real price" body="An itemised, all-inclusive cost sheet — base, floor-rise, PLC, GST, stamp duty. Zero hidden charges." />
              <ValuePoint n="03" title="Watch it rise" body="Geo-tagged, certified weekly photos. You only get a demand letter once you can see the slab is done." />
            </div>
            <Link href="/explore" className="btn btn-primary btn-lg mt-9">
              Start exploring
            </Link>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-lg lg:h-[560px]">
            <Image
              src="/images/premium-and-comfort-living.webp"
              alt="Premium and comfortable living by Trimurty"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="img-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────────────── Lifestyle ───────────────── */}
      <section className="bg-canvas-soft">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="t-eyebrow text-primary">A life well-lived</p>
            <h2 className="t-serif-xl mt-4">Designed around people, not just plans.</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <LifestyleCard image="/images/going-green.jpg" title="Green by design" body="Solar power, EV charging and green-building design across projects." />
            <LifestyleCard image="/images/senior-citizens.jpg" title="For every generation" body="Old-age, child and specially-abled friendly features, thoughtfully built in." />
            <LifestyleCard image="/images/kids-centric.jpg" title="Room to grow" body="Kid-centric spaces, community halls and gathering greens." />
          </div>
        </div>
      </section>

      {/* ───────────────── Stats band ───────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 px-5 py-16 sm:px-8 lg:grid-cols-4">
          <BigStat value={`${new Date().getFullYear() - COMPANY.since}+`} label="Years crafting Jaipur homes" />
          <BigStat value={COMPANY.homesDelivered} label="Families settled in" />
          <BigStat value="8" label="Landmark addresses" />
          <BigStat value="100%" label="RERA-registered" />
        </div>
      </section>

      {/* ───────────────── CTA / contact ───────────────── */}
      <section className="relative overflow-hidden">
        <Image src="/images/kachnar-banner-1920.webp" alt="" fill sizes="100vw" className="img-cover" />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="t-serif-xl text-white">Come home to Trimurty.</h2>
            <p className="t-body-md mt-4 text-mute">
              Explore live availability now, or talk to a relationship manager —
              in Hindi or English, at {PROJECT.name} and every Trimurty address.
            </p>
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/explore" className="btn btn-primary btn-lg">Explore homes</Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("I'd like to know more about Trimurty homes")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light btn-lg"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-white/85">
            <ContactBit label="Call" value={CONTACT.phone} />
            <ContactBit label="Email" value={CONTACT.email} />
            <ContactBit label="Visit" value={CONTACT.office} />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-ink/15 pl-4">
      <p className="text-[18px] font-semibold text-ink tabular">{value}</p>
      <p className="text-[13px] text-body-mid">{label}</p>
    </div>
  );
}

function ProjectCard({ p, liveAvailable }: { p: PortfolioProject; liveAvailable?: number }) {
  const href = p.flagship ? "/explore" : `/project/${p.id}`;
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-lg lift ${p.flagship ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
    >
      <div className={`relative ${p.flagship ? "h-80 lg:h-full lg:min-h-[560px]" : "h-72"}`}>
        <Image
          src={p.image}
          alt={`${p.name} by Trimurty, ${p.locality}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="img-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold ${
            p.status === "ready" ? "bg-primary text-on-primary" : "glass-dark text-white"
          }`}
        >
          {p.status === "ready" ? "Ready to move" : "Under construction"}
        </span>
        {p.flagship && liveAvailable !== undefined && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-ink">
            {liveAvailable} homes available
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className={`text-white ${p.flagship ? "t-serif-lg" : "t-serif-md"}`}>{p.name}</h3>
          <p className="mt-1 text-[14px] text-white/85">{p.config}</p>
          <p className="text-[13px] text-white/70">{p.locality} · RERA {p.reraNo}</p>
          <p className="mt-3 text-[14px] font-semibold text-white">
            {p.flagship ? "Explore live inventory" : "View project"} →
          </p>
        </div>
      </div>
    </Link>
  );
}

function ValuePoint({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <span className="t-serif-md shrink-0 text-primary">{n}</span>
      <div>
        <p className="text-[19px] font-semibold text-white">{title}</p>
        <p className="mt-1 text-[16px] text-mute">{body}</p>
      </div>
    </div>
  );
}

function LifestyleCard({ image, title, body }: { image: string; title: string; body: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-canvas lift">
      <div className="relative h-56">
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="img-cover" />
      </div>
      <div className="p-6">
        <h3 className="t-serif-md">{title}</h3>
        <p className="mt-2 text-[16px] text-body">{body}</p>
      </div>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 text-center lg:px-6">
      <p className="t-serif-xl text-primary">{value}</p>
      <p className="mt-2 text-[15px] text-body">{label}</p>
    </div>
  );
}

function ContactBit({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] uppercase tracking-wide text-white/55">{label}</p>
      <p className="text-[15px] font-medium">{value}</p>
    </div>
  );
}
