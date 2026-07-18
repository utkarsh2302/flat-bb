"use client";

import Link from "next/link";
import { ASSOCIATES, CURRENT_ASSOCIATE } from "@/lib/data";
import { inrShort } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp, liveAvailability } from "@/lib/store";

export default function BrokerDashboard() {
  const { s } = useApp();
  const me = ASSOCIATES.find((a) => a.id === CURRENT_ASSOCIATE)!;
  const myLeads = s.leads.filter((l) => l.associateId === CURRENT_ASSOCIATE);
  const visits = myLeads.filter((l) => l.status === "visit_booked").length;
  const eois = myLeads.filter((l) => l.status === "eoi").length;
  const myComm = s.commissions.filter((c) => c.associateId === CURRENT_ASSOCIATE);
  const accrued = myComm.reduce((t, c) => t + (c.bookingValue * c.ratePct) / 100, 0);
  const stats = liveAvailability(s);
  const board = [...ASSOCIATES].sort((a, b) => b.bookings - a.bookings);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
      <Eyebrow>Associate portal</Eyebrow>
      <h1 className="t-serif-lg mt-2">{me.name}</h1>
      <p className="t-body-sm mt-1 text-body">RERA {me.reraAgentNo} · {me.tier === "gold" ? "Gold" : "Silver"} partner</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="My leads" value={String(myLeads.length)} href="/broker/leads" />
        <StatTile label="Site visits" value={String(visits)} sub="booked" href="/broker/leads" />
        <StatTile label="Live EOIs" value={String(eois)} href="/broker/leads" />
        <StatTile label="Commission accrued" value={inrShort(accrued)} tone="ink" href="/broker/commissions" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-lg border border-line p-6">
          <div className="flex items-center justify-between">
            <h2 className="t-display-sub-sm">Live inventory</h2>
            <Link href="/broker/inventory" className="text-[14px] font-semibold text-primary hover:underline">Open →</Link>
          </div>
          <p className="mt-1 text-[15px] text-body">
            <span className="font-semibold text-primary">{stats.available}</span> of {stats.total} flats available across 3 towers.
          </p>
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-canvas-soft">
            <span className="bg-primary" style={{ width: `${(stats.available / stats.total) * 100}%` }} />
            <span className="bg-mute" style={{ width: `${(stats.held / stats.total) * 100}%` }} />
            <span className="bg-ink" style={{ width: `${(stats.booked / stats.total) * 100}%` }} />
          </div>
          <p className="mt-4 text-[15px] text-body">
            Book on behalf of your client with a live cost sheet and EOI — first tag wins, protected for 90 days.
          </p>
          <Link href="/broker/inventory" className="btn btn-primary mt-4">Book for a client</Link>
        </div>

        <div className="rounded-lg bg-canvas-soft p-6">
          <h2 className="t-display-sub-sm">Leaderboard</h2>
          <ol className="mt-4 space-y-2">
            {board.map((a, i) => (
              <li key={a.id} className={`flex items-center justify-between rounded-sm px-3 py-2 text-[15px] ${a.id === CURRENT_ASSOCIATE ? "bg-ink text-on-primary" : "bg-canvas"}`}>
                <span className="flex items-center gap-2"><span className="tabular font-semibold">{i + 1}</span>{a.name}</span>
                <span className="tabular">{a.bookings} · {inrShort(a.gmv)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
