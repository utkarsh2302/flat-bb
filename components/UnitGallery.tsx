"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { planFor, UNIT_GALLERY } from "@/lib/data";

type Item = { src: string; label: string; kind: "plan" | "photo" };

export default function UnitGallery({ bhk }: { bhk: number }) {
  const items: Item[] = [
    { src: planFor(bhk), label: `${bhk} BHK floor plan`, kind: "plan" },
    ...UNIT_GALLERY.map((g) => ({ ...g, kind: "photo" as const })),
  ];
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback((i: number) => setOpen(((i % items.length) + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") show(open + 1);
      if (e.key === "ArrowLeft") show(open - 1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, show]);

  const plan = items[0];

  return (
    <div className="space-y-6">
      {/* Real architect floor plan */}
      <figure className="overflow-hidden rounded-md border border-ink/10 bg-white">
        <button
          type="button"
          onClick={() => show(0)}
          className="press group relative block w-full cursor-zoom-in bg-white"
          aria-label="Open floor plan full-screen"
        >
          <span className="relative block aspect-[1414/1000] w-full">
            <Image src={plan.src} alt={`${bhk} BHK floor plan`} fill sizes="(max-width:1024px) 100vw, 760px" className="object-contain p-3" />
          </span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Tap to zoom
          </span>
        </button>
        <figcaption className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-3">
          <span className="text-[13px] uppercase tracking-wide text-body-mid">Floor plan · {bhk} BHK</span>
          <span className="text-[12px] text-body-mid">Representative unit plan · Trimurty architect drawing</span>
        </figcaption>
      </figure>

      {/* Real interior gallery */}
      <div>
        <p className="text-[13px] uppercase tracking-wide text-body-mid">Inside the home</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.slice(1).map((it, i) => (
            <button
              key={it.src}
              type="button"
              onClick={() => show(i + 1)}
              className="press group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-md bg-canvas-soft"
              aria-label={`Open ${it.label}`}
            >
              <Image src={it.src} alt={it.label} fill sizes="(max-width:640px) 45vw, 240px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-2.5 pb-2 pt-6 text-left text-[12px] font-medium text-white">
                {it.label}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-body-mid">Interiors & elevation are representative renders from Trimurty projects.</p>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="a-fadein fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/92 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={items[open].label}
        >
          <div className="relative h-[82vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[open].src}
              alt={items[open].label}
              fill
              sizes="100vw"
              className={items[open].kind === "plan" ? "object-contain bg-white" : "object-contain"}
              priority
            />
          </div>
          <div className="mt-3 flex items-center gap-4 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => show(open - 1)} className="press rounded-full bg-white/10 px-3 py-1.5 text-[14px] hover:bg-white/20" aria-label="Previous">‹ Prev</button>
            <span className="min-w-[9rem] text-center text-[14px] font-medium">{items[open].label}</span>
            <button type="button" onClick={() => show(open + 1)} className="press rounded-full bg-white/10 px-3 py-1.5 text-[14px] hover:bg-white/20" aria-label="Next">Next ›</button>
          </div>
          <button type="button" onClick={() => setOpen(null)} className="press absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
