"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import type { ActivityKind } from "@/lib/store";

const DOT: Record<ActivityKind, string> = {
  hold: "bg-mute",
  booking: "bg-primary",
  payment: "bg-ink",
  certify: "bg-primary",
  lead: "bg-mute",
  approval: "bg-ink",
  snag: "bg-mute",
  visit: "bg-primary",
};

export default function NotificationsBell({ light }: { light: boolean }) {
  const { s, reset } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Activity"
        onClick={() => setOpen((v) => !v)}
        className={`press relative rounded-full p-2 transition-colors ${light ? "text-white hover:bg-white/10" : "text-ink hover:bg-canvas-soft"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {s.activity.length > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-canvas" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="menu-pop absolute right-0 z-50 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-lg border border-line bg-canvas shadow-[var(--shadow-lux)]"
            style={{ transformOrigin: "top right" }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-[15px] font-semibold text-ink">Activity</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset all demo data to the starting state?")) {
                    reset();
                    setOpen(false);
                  }
                }}
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                Reset demo
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto py-1">
              {s.activity.length === 0 && (
                <li className="px-4 py-6 text-center text-[14px] text-body">Nothing yet — try booking a flat.</li>
              )}
              {s.activity.slice(0, 12).map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-4 py-2.5 text-[14px]">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[a.kind]}`} />
                  <span className="text-ink">{a.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
