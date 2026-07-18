"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { ActivityKind } from "@/lib/store";

const KINDS: { key: ActivityKind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "booking", label: "Bookings" },
  { key: "payment", label: "Payments" },
  { key: "certify", label: "Demands & certification" },
  { key: "approval", label: "Approvals" },
  { key: "hold", label: "Holds" },
  { key: "lead", label: "Leads" },
  { key: "visit", label: "Visits" },
];

const DOT: Record<ActivityKind, string> = {
  booking: "bg-primary", payment: "bg-ink", certify: "bg-primary", approval: "bg-ink",
  hold: "bg-mute", lead: "bg-mute", snag: "bg-mute", visit: "bg-primary",
};

export default function AdminAudit() {
  const { s } = useApp();
  const [filter, setFilter] = useState<ActivityKind | "all">("all");
  const rows = s.activity.filter((a) => filter === "all" || a.kind === filter);

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8">
      <Eyebrow>Compliance · immutable</Eyebrow>
      <h1 className="t-serif-lg mt-2">Audit log</h1>
      <p className="t-body-sm mt-2 text-body">
        A tamper-evident trail of every material action — bookings, payments, demands, certifications and approvals. Exactly what makes the platform RERA-audit-ready.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            onClick={() => setFilter(k.key)}
            className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${filter === k.key ? "bg-ink text-on-primary" : "bg-canvas-soft text-body hover:text-ink"}`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <ol className="mt-6 space-y-0 rounded-lg border border-line">
        {rows.map((a) => (
          <li key={a.id} className="flex items-start gap-3 border-b border-line px-5 py-3.5 last:border-0">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[a.kind]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] text-ink">{a.message}</p>
              <p className="text-[12px] text-body-mid">
                {new Date(a.at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · {a.kind}
              </p>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="px-5 py-10 text-center text-body">No events for this filter yet.</li>}
      </ol>
    </div>
  );
}
