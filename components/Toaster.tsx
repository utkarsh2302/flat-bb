"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import type { ActivityKind } from "@/lib/store";

const MEANINGFUL: Set<ActivityKind> = new Set(["booking", "payment", "certify", "approval", "lead", "visit"]);
const ICON: Record<ActivityKind, string> = {
  booking: "🏡",
  payment: "💸",
  certify: "📸",
  approval: "✅",
  lead: "👤",
  hold: "⏳",
  snag: "🛠️",
  visit: "📅",
};

interface T {
  id: string;
  message: string;
  kind: ActivityKind;
  closing: boolean;
}

export default function Toaster() {
  const { s } = useApp();
  const [toasts, setToasts] = useState<T[]>([]);
  const seen = useRef<string | null>(null);

  useEffect(() => {
    const top = s.activity[0];
    if (!top) return;
    // Skip whatever is already there on first mount — only toast NEW actions.
    if (seen.current === null) {
      seen.current = top.id;
      return;
    }
    if (top.id === seen.current) return;
    seen.current = top.id;
    if (!MEANINGFUL.has(top.kind)) return;

    const t: T = { id: top.id, message: top.message, kind: top.kind, closing: false };
    // Bridging a store event to transient toast UI — enqueue is the point here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToasts((prev) => [t, ...prev].slice(0, 3));
    const dismiss = setTimeout(() => close(top.id), 3800);
    return () => clearTimeout(dismiss);
  }, [s.activity]);

  function close(id: string) {
    setToasts((prev) => prev.map((x) => (x.id === id ? { ...x, closing: true } : x)));
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 320);
  }

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          data-closing={t.closing}
          className="toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-canvas px-4 py-3 shadow-[var(--shadow-lux)]"
        >
          <span className="text-[18px] leading-none">{ICON[t.kind]}</span>
          <p className="flex-1 text-[14px] leading-snug text-ink">{t.message}</p>
          <button
            type="button"
            onClick={() => close(t.id)}
            aria-label="Dismiss"
            className="press -mr-1 -mt-0.5 shrink-0 rounded-sm p-1 text-body-mid hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
