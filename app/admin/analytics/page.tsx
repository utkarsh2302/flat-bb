"use client";

import { useEffect, useState } from "react";
import { UNITS, TOWERS, ASSOCIATES } from "@/lib/data";
import { unitAllIn } from "@/lib/pricing";
import { inr, inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, liveAvailability, collectionsLive, allDemands } from "@/lib/store";

export default function AdminAnalytics() {
  const { s } = useApp();
  const [today, setToday] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const stats = liveAvailability(s);
  const bookedUnits = UNITS.filter((u) => (s.unitStatus[u.id] ?? u.status) === "booked");
  const bookingValue = bookedUnits.reduce((t, u) => t + unitAllIn(u), 0);
  const coll = collectionsLive(s);
  const collected = coll.reduce((t, r) => t + r.paid, 0);
  const demanded = coll.reduce((t, r) => t + r.demanded, 0);
  const avgTicket = bookedUnits.length ? Math.round(bookingValue / bookedUnits.length) : 0;

  // funnel
  const leads = s.leads.length;
  const visits = s.leads.filter((l) => ["visit_booked", "eoi", "booked"].includes(l.status)).length;
  const eois = s.leads.filter((l) => ["eoi", "booked"].includes(l.status)).length;
  const bookings = s.bookings.length;
  const funnel = [
    { label: "Enquiries", v: leads },
    { label: "Site visits", v: visits },
    { label: "EOIs", v: eois },
    { label: "Bookings", v: bookings },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.v));

  // BHK mix (booked)
  const bhkMix = [2, 3, 4].map((b) => ({ label: `${b} BHK`, v: bookedUnits.filter((u) => u.bhk === b).length }));
  const bhkMax = Math.max(1, ...bhkMix.map((b) => b.v));

  // ageing
  const demands = allDemands(s, today).filter((d) => !d.paid);
  const buckets = [
    { label: "Not due", v: demands.filter((d) => d.overdueDays === 0).reduce((t, d) => t + d.amount, 0) },
    { label: "1–30d", v: demands.filter((d) => d.overdueDays > 0 && d.overdueDays <= 30).reduce((t, d) => t + d.amount, 0) },
    { label: "31–60d", v: demands.filter((d) => d.overdueDays > 30 && d.overdueDays <= 60).reduce((t, d) => t + d.amount, 0) },
    { label: "60d+", v: demands.filter((d) => d.overdueDays > 60).reduce((t, d) => t + d.amount, 0) },
  ];
  const bucketMax = Math.max(1, ...buckets.map((b) => b.v));

  // CP leaderboard
  const board = [...ASSOCIATES].sort((a, b) => b.gmv - a.gmv).slice(0, 5);
  const gmvMax = Math.max(1, ...board.map((a) => a.gmv));

  // bookings by month
  const byMonth = new Map<string, number>();
  for (const b of s.bookings) {
    const m = b.applied.slice(0, 7);
    byMonth.set(m, (byMonth.get(m) ?? 0) + 1);
  }
  const months = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const monthMax = Math.max(1, ...months.map(([, v]) => v));

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Intelligence · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Analytics</h1>
      <p className="t-body-sm mt-2 text-body">Sales velocity, funnel, collections and channel performance — the owner&apos;s money view, updating in real time.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Booking value" value={inrShort(bookingValue)} tone="ink" />
        <StatTile label="Collected" value={inrShort(collected)} sub={`${demanded ? Math.round((collected / demanded) * 100) : 0}% of demanded`} />
        <StatTile label="Absorption" value={`${stats.pctSold}%`} sub={`${stats.available} homes left`} />
        <StatTile label="Avg ticket" value={inrShort(avgTicket)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <Panel title="Sales funnel">
          {funnel.map((f, i) => (
            <BarRow key={f.label} label={f.label} valueLabel={String(f.v)} pct={(f.v / funnelMax) * 100} color={i === funnel.length - 1 ? "bg-primary" : "bg-ink"} />
          ))}
        </Panel>

        {/* Absorption by tower */}
        <Panel title="Absorption by tower">
          {TOWERS.map((t) => {
            const a = liveAvailability(s, UNITS.filter((u) => u.towerId === t.id).map((u) => u.id));
            const seg = (n: number) => `${(n / a.total) * 100}%`;
            return (
              <div key={t.id} className="mb-3 last:mb-0">
                <div className="flex justify-between text-[13px]"><span className="text-body">{t.name}</span><span className="text-body-mid tabular">{a.pctSold}% sold</span></div>
                <div className="mt-1 flex h-3 w-full overflow-hidden rounded-full bg-canvas-soft">
                  <span className="bg-primary" style={{ width: seg(a.available) }} />
                  <span className="bg-mute" style={{ width: seg(a.held) }} />
                  <span className="bg-ink" style={{ width: seg(a.booked) }} />
                </div>
              </div>
            );
          })}
          <p className="mt-3 text-[12px] text-body-mid">Orange available · grey on-hold · ink booked</p>
        </Panel>

        {/* Ageing */}
        <Panel title="Collection ageing (outstanding)">
          {buckets.map((b) => (
            <BarRow key={b.label} label={b.label} valueLabel={inrShort(b.v)} pct={(b.v / bucketMax) * 100} color={b.label === "60d+" ? "bg-primary" : "bg-ink"} />
          ))}
        </Panel>

        {/* CP leaderboard */}
        <Panel title="Channel-partner leaderboard">
          {board.map((a) => (
            <BarRow key={a.id} label={a.name} valueLabel={inrShort(a.gmv)} pct={(a.gmv / gmvMax) * 100} color="bg-ink" />
          ))}
        </Panel>

        {/* BHK mix */}
        <Panel title="Booked by configuration">
          {bhkMix.map((b) => (
            <BarRow key={b.label} label={b.label} valueLabel={String(b.v)} pct={(b.v / bhkMax) * 100} color="bg-primary" />
          ))}
        </Panel>

        {/* Bookings over time */}
        <Panel title="Bookings by month">
          <div className="flex h-40 items-end gap-2">
            {months.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[12px] font-semibold text-ink tabular">{v}</span>
                <div className="w-full rounded-t-sm bg-ink" style={{ height: `${(v / monthMax) * 100}%`, minHeight: 4 }} />
                <span className="text-[11px] text-body-mid">{m.slice(5)}</span>
              </div>
            ))}
            {months.length === 0 && <p className="text-[14px] text-body">No bookings yet.</p>}
          </div>
        </Panel>
      </div>
      <p className="mt-4 text-[13px] text-body-mid">Total demanded {inr(demanded)} · collected {inr(collected)}.</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line p-6">
      <h2 className="t-display-sub-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarRow({ label, valueLabel, pct, color }: { label: string; valueLabel: string; pct: number; color: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-[13px]"><span className="text-body">{label}</span><span className="font-semibold text-ink tabular">{valueLabel}</span></div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-canvas-soft">
        <span className={`block h-full rounded-full ${color}`} style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
    </div>
  );
}
