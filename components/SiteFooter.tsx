import Link from "next/link";
import Image from "next/image";
import { COMPANY, CONTACT, PROJECTS } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-canvas-soft no-print">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Image src="/images/logo-white-grey.svg" alt="Trimurty" width={30} height={24} className="h-7 w-auto" />
              <span className="text-[19px] font-semibold tracking-[0.22em] text-white">TRIMURTY</span>
            </div>
            <p className="mt-4 text-[16px] leading-relaxed text-mute">
              {COMPANY.tagline}. Crafting landmark homes across {COMPANY.city} since {COMPANY.since}.
            </p>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6 !px-5 !py-2.5 !text-[15px]"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-mute">Projects</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {PROJECTS.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link href={p.flagship ? "/explore" : `/project/${p.id}`} className="text-canvas-soft/90 hover:text-white">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-mute">Get in touch</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-white">{CONTACT.phone}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a>
              </li>
              <li className="text-mute">{CONTACT.office}</li>
              <li className="text-mute">{CONTACT.hours}</li>
            </ul>
            <div className="mt-5 flex gap-3 text-[14px]">
              <Link href="/broker" className="text-canvas-soft/80 hover:text-white">Associate portal</Link>
              <span className="text-white/20">·</span>
              <Link href="/admin" className="text-canvas-soft/80 hover:text-white">Builder cockpit</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.legal}</p>
          <p>Demo experience · in-memory data · payments &amp; documents simulated.</p>
        </div>
      </div>
    </footer>
  );
}
