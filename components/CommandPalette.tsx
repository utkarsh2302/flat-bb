"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNITS, getTower } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { unitAllIn } from "@/lib/pricing";
import { useApp } from "@/lib/store";

interface Result {
  id: string;
  label: string;
  sub: string;
  href: string;
  kind: string;
}

const PAGES: Result[] = [
  { id: "p-explore", label: "Explore homes", sub: "Buyer", href: "/explore", kind: "Page" },
  { id: "p-shortlist", label: "Shortlist", sub: "Buyer", href: "/shortlist", kind: "Page" },
  { id: "p-myhome", label: "My Home", sub: "Buyer", href: "/my-home", kind: "Page" },
  { id: "p-emi", label: "EMI calculator", sub: "Buyer", href: "/tools/emi", kind: "Page" },
  { id: "p-visit", label: "Book a site visit", sub: "Buyer", href: "/visit", kind: "Page" },
  { id: "p-cockpit", label: "Builder cockpit", sub: "Admin", href: "/admin", kind: "Page" },
  { id: "p-bookings", label: "Bookings", sub: "Admin", href: "/admin/bookings", kind: "Page" },
  { id: "p-demands", label: "Demand letters", sub: "Admin", href: "/admin/demands", kind: "Page" },
  { id: "p-collections", label: "Collections", sub: "Admin", href: "/admin/collections", kind: "Page" },
  { id: "p-partners", label: "Channel partners", sub: "Admin", href: "/admin/partners", kind: "Page" },
  { id: "p-broker", label: "Associate dashboard", sub: "Associate", href: "/broker", kind: "Page" },
];

export default function CommandPalette() {
  const router = useRouter();
  const { s } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    const pages = PAGES.filter((p) => !term || p.label.toLowerCase().includes(term) || p.sub.toLowerCase().includes(term)).slice(0, 5);
    const units = term
      ? UNITS.filter((u) => u.id.toLowerCase().includes(term) || `${u.bhk} bhk`.includes(term) || getTower(u.towerId)?.name.toLowerCase().includes(term))
          .slice(0, 6)
          .map<Result>((u) => ({ id: `u-${u.id}`, label: `${u.id} · ${u.bhk} BHK`, sub: `${getTower(u.towerId)?.name} · ${inrShort(unitAllIn(u))}`, href: `/unit/${u.id}`, kind: "Flat" }))
      : [];
    const bookings = term
      ? s.bookings.filter((b) => b.buyerName.toLowerCase().includes(term) || b.unitId.toLowerCase().includes(term))
          .slice(0, 4)
          .map<Result>((b) => ({ id: `b-${b.id}`, label: b.buyerName, sub: `${b.id} · ${b.unitId}`, href: "/admin/bookings", kind: "Booking" }))
      : [];
    const leads = term
      ? s.leads.filter((l) => l.name.toLowerCase().includes(term))
          .slice(0, 3)
          .map<Result>((l) => ({ id: `l-${l.id}`, label: l.name, sub: `Lead · ${l.interest}`, href: "/admin/leads", kind: "Lead" }))
      : [];
    return [...units, ...bookings, ...leads, ...pages];
  }, [q, s.bookings, s.leads]);

  function go(r: Result) {
    setOpen(false);
    router.push(r.href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <div className="drawer-overlay absolute inset-0 bg-ink/40" />
      <div className="menu-pop relative w-full max-w-lg overflow-hidden rounded-lg border border-line bg-canvas shadow-[var(--shadow-lux)]" style={{ transformOrigin: "top" }} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && results[active]) go(results[active]);
          }}
          placeholder="Search flats, buyers, leads, pages…"
          className="w-full border-b border-line bg-canvas px-5 py-4 text-[16px] text-ink outline-none placeholder:text-body-mid"
        />
        <ul className="max-h-[52vh] overflow-y-auto py-1">
          {results.length === 0 && <li className="px-5 py-6 text-center text-[14px] text-body">No matches. Try a flat id, a name, or a page.</li>}
          {results.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left ${i === active ? "bg-canvas-soft" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium text-ink">{r.label}</span>
                  <span className="block truncate text-[13px] text-body-mid">{r.sub}</span>
                </span>
                <span className="shrink-0 rounded-full bg-canvas-soft px-2 py-0.5 text-[11px] font-semibold text-body">{r.kind}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-5 py-2 text-[12px] text-body-mid">↑↓ to navigate · ↵ to open · esc to close</div>
      </div>
    </div>
  );
}
