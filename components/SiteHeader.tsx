"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationsBell from "@/components/NotificationsBell";
import { useApp } from "@/lib/store";

type Panel = "client" | "broker" | "admin";

const NAV: Record<Panel, { href: string; label: string }[]> = {
  client: [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Homes" },
    { href: "/progress", label: "Construction" },
    { href: "/tools/emi", label: "EMI" },
    { href: "/my-home", label: "My Home" },
  ],
  broker: [
    { href: "/broker", label: "Dashboard" },
    { href: "/broker/leads", label: "Leads" },
    { href: "/broker/inventory", label: "Inventory" },
    { href: "/broker/bookings", label: "Bookings" },
    { href: "/broker/commissions", label: "Commissions" },
    { href: "/broker/marketing", label: "Marketing" },
  ],
  admin: [
    { href: "/admin", label: "Cockpit" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/inventory", label: "Inventory" },
    { href: "/admin/collections", label: "Collections" },
    { href: "/admin/demands", label: "Demands" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/partners", label: "Partners" },
    { href: "/admin/approvals", label: "Approvals" },
    { href: "/admin/progress", label: "Progress" },
    { href: "/admin/audit", label: "Audit" },
  ],
};

const PANELS: { key: Panel; href: string; label: string }[] = [
  { key: "client", href: "/", label: "Buyer" },
  { key: "broker", href: "/broker", label: "Associate" },
  { key: "admin", href: "/admin", label: "Builder" },
];

export default function SiteHeader({ panel }: { panel: Panel }) {
  const pathname = usePathname();
  const { s } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = panel === "client" && pathname === "/";
  const savedCount = s.shortlist.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light (white text over the hero photo) only on the home hero, un-scrolled.
  const light = isHome && !scrolled && !open;
  const isActive = (href: string) =>
    href === "/" || href === "/broker" || href === "/admin"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          light ? "bg-transparent" : "glass border-b border-line"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href={panel === "client" ? "/" : `/${panel}`} className="flex items-center gap-2.5 shrink-0">
              <Image
                src={light ? "/images/logo-white-grey.svg" : "/images/logo.svg"}
                alt="Trimurty"
                width={30}
                height={24}
                priority
                className="h-7 w-auto"
              />
              <span className={`text-[19px] font-semibold tracking-[0.22em] ${light ? "text-white" : "text-ink"}`}>
                TRIMURTY
              </span>
            </Link>

            <nav className="no-scrollbar mx-2 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
              {NAV[panel].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-sm px-3 py-2 text-[15px] transition-colors ${
                    isActive(item.href)
                      ? light
                        ? "text-white font-semibold"
                        : "text-ink font-semibold"
                      : light
                        ? "text-white/75 hover:text-white"
                        : "text-body hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              {panel === "client" && (
                <Link
                  href="/shortlist"
                  aria-label={`Saved (${savedCount})`}
                  className={`press relative rounded-full p-2 transition-colors ${light ? "text-white hover:bg-white/10" : "text-ink hover:bg-canvas-soft"}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={savedCount > 0 ? "currentColor" : "none"} aria-hidden>
                    <path d="M12 21s-7.5-4.6-10-9.2C.6 8.9 2 5.5 5.2 5.5c2 0 3.2 1.2 3.9 2.2.6.9.9 1.3.9 1.3s.3-.4.9-1.3c.7-1 1.9-2.2 3.9-2.2 3.2 0 4.6 3.4 3.2 6.3C19.5 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  {savedCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                      {savedCount}
                    </span>
                  )}
                </Link>
              )}
              <NotificationsBell light={light} />
              <PanelSwitcher current={panel} light={light} />
              {panel === "client" && (
                <Link href="/explore" className="hidden sm:inline-flex btn btn-primary !px-4 !py-2 !text-[15px]">
                  Explore homes
                </Link>
              )}
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={`press md:hidden rounded-sm border p-2 ${light ? "border-white/40 text-white" : "border-line text-ink"}`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <nav className="menu-pop md:hidden pb-4 flex flex-col gap-1" style={{ transformOrigin: "top" }}>
              {NAV[panel].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-sm px-3 py-3 text-[16px] ${
                    isActive(item.href) ? "bg-canvas-soft text-ink font-semibold" : "text-body"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {panel === "client" && (
                <Link href="/explore" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
                  Explore homes
                </Link>
              )}
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                {PANELS.map((p) => (
                  <Link
                    key={p.key}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                      panel === p.key ? "bg-ink text-on-primary" : "bg-canvas-soft text-body"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      {/* Spacer so fixed header doesn't cover content (except over the home hero) */}
      {!isHome && <div className="h-16" />}
    </>
  );
}

function PanelSwitcher({ current, light }: { current: Panel; light: boolean }) {
  return (
    <div className={`hidden sm:flex items-center rounded-full p-0.5 ${light ? "bg-white/15" : "bg-canvas-soft"}`}>
      {PANELS.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          title={`${p.label} panel`}
          className={`rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
            current === p.key
              ? "bg-ink text-on-primary"
              : light
                ? "text-white/80 hover:text-white"
                : "text-body hover:text-ink"
          }`}
        >
          {p.label}
        </Link>
      ))}
    </div>
  );
}
