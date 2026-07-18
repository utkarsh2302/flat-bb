"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROJECT } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, liveAvailability, collectionsLive } from "@/lib/store";

export default function AdminCockpit() {
  const { s } = useApp();
  const stats = liveAvailability(s);
  const [weekCount, setWeekCount] = useState(0);
  useEffect(() => {
    const cut = Date.now() - 7 * 864e5;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeekCount(s.bookings.filter((b) => new Date(b.applied).getTime() >= cut).length);
  }, [s.bookings]);
  const newLeads = s.leads.filter((l) => l.status === "new").length;
  const visits = s.leads.filter((l) => l.status === "visit_booked").length;
  const rows = collectionsLive(s);
  const demanded = rows.reduce((t, r) => t + r.demanded, 0);
  const collected = rows.reduce((t, r) => t + r.paid, 0);
  const outstanding = demanded - collected;
  const collectedPct = demanded ? Math.round((collected / demanded) * 100) : 0;
  const pendingApprovals = s.approvals.filter((a) => !a.decision).length;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Cockpit · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">{PROJECT.name}</h1>
      <p className="t-body-sm mt-1 text-body">Six numbers that matter — updating as buyers and associates act. Tap any to drill down.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="New leads" value={String(newLeads)} sub="awaiting first call" href="/admin/collections" />
        <StatTile label="Site visits" value={String(visits)} sub="booked" href="/admin/collections" />
        <StatTile label="Holds live" value={String(stats.held)} sub="15-min holds + EOI" href="/admin/inventory" />
        <StatTile label="Booked units" value={String(stats.booked)} sub={`${stats.pctSold}% of inventory`} href="/admin/inventory" />
        <StatTile label="Collections" value={`${collectedPct}%`} sub={`${inrShort(collected)} of ${inrShort(demanded)}`} tone="ink" href="/admin/collections" />
        <StatTile label="Outstanding" value={inrShort(outstanding)} sub="across all buyers" tone="alert" href="/admin/collections" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-canvas-soft px-5 py-3 text-[14px]">
        <span className="font-semibold text-ink">Velocity</span>
        <span className="text-body"><span className="font-semibold text-ink tabular">{weekCount}</span> booked this week</span>
        <span className="text-body"><span className="font-semibold text-ink tabular">{stats.pctSold}%</span> absorption</span>
        <span className="text-body"><span className="font-semibold text-ink tabular">{stats.available}</span> homes left</span>
        <Link href="/admin/audit" className="ml-auto font-semibold text-primary hover:underline">Audit log →</Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Approvals inbox */}
        <div className="rounded-lg border border-line p-6">
          <div className="flex items-center justify-between">
            <h2 className="t-display-sub-sm">Approvals inbox</h2>
            <Link href="/admin/approvals" className="text-[14px] font-semibold text-primary hover:underline">
              {pendingApprovals} pending →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {s.approvals.filter((a) => !a.decision).slice(0, 3).map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-sm bg-canvas-soft px-4 py-3">
                <span className="text-[15px] text-ink">{a.title}</span>
                {a.amount != null && <span className="text-[14px] font-semibold text-ink tabular">{inrShort(a.amount)}</span>}
              </li>
            ))}
            {pendingApprovals === 0 && <li className="text-[15px] text-body">Inbox zero 🎉</li>}
          </ul>
        </div>

        {/* Live activity */}
        <div className="rounded-lg bg-canvas-soft p-6">
          <h2 className="t-display-sub-sm">Live activity</h2>
          <ul className="mt-4 space-y-3">
            {s.activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-[15px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-ink">{a.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Action href="/admin/inventory" title="Inventory & rate cards" />
        <Action href="/admin/collections" title="Collections cockpit" />
        <Action href="/admin/progress" title="Certify milestones" />
        <Action href="/admin/approvals" title="Approvals" />
      </div>
    </div>
  );
}

function Action({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="rounded-lg bg-canvas-soft p-4 text-[15px] font-semibold text-ink hover:ring-1 hover:ring-primary">
      {title} →
    </Link>
  );
}
