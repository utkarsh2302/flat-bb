"use client";

import Link from "next/link";
import { PROGRESS_FEED, getUnit, getTower } from "@/lib/data";
import { inr, inrShort } from "@/lib/format";
import PhotoBlock from "@/components/PhotoBlock";
import PossessionCountdown from "@/components/PossessionCountdown";
import { Eyebrow } from "@/components/ui";
import { useApp, primaryBooking, ledgerTotalsFor, myBookings } from "@/lib/store";

export default function MyHomePage() {
  const { s } = useApp();
  const booking = primaryBooking(s);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-20 text-center">
        <p className="text-[40px]">🏠</p>
        <h1 className="t-serif-lg mt-3">You haven&apos;t reserved a home yet</h1>
        <p className="t-body-md mt-3 text-body">
          Explore live availability, reserve with a token, and this space becomes your
          home dashboard — payments, construction, documents and more.
        </p>
        <Link href="/explore" className="btn btn-primary btn-lg mt-6">Explore homes</Link>
      </div>
    );
  }

  const unit = getUnit(booking.unitId)!;
  const tower = getTower(unit.towerId)!;
  const totals = ledgerTotalsFor(s, booking.id);
  const certifiedPct = s.milestones.filter((m) => m.status === "certified").reduce((t, m) => t + m.pct, 0);
  const latest = PROGRESS_FEED.find((p) => p.towerId === unit.towerId) ?? PROGRESS_FEED[0];
  const mine = myBookings(s);

  return (
    <div className="mx-auto max-w-[900px] px-5 py-10 sm:px-8">
      <Eyebrow>Booking {booking.id}</Eyebrow>
      <h1 className="t-serif-xl mt-2">
        Welcome back, {booking.buyerName.split(" ")[0]}
      </h1>
      <p className="t-body-md mt-2 text-body">
        {unit.bhk} BHK · {tower.name} · Floor {unit.floor} · {unit.id}
        {mine.length > 1 && <> · <span className="text-body-mid">{mine.length} bookings</span></>}
      </p>
      <div className="mt-3"><PossessionCountdown /></div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Next payment */}
        <div className="rounded-lg bg-ink p-6 text-on-primary">
          <p className="text-[13px] uppercase tracking-wide text-mute">
            {totals.outstanding > 0 ? "Amount outstanding" : "Dues status"}
          </p>
          <p className="mt-1 text-[32px] font-semibold tabular">
            {totals.outstanding > 0 ? inrShort(totals.outstanding) : "All clear ✓"}
          </p>
          <p className="text-[14px] text-mute">
            {totals.outstanding > 0 ? "As per your construction-linked plan" : "No pending demand"}
          </p>
          <Link href="/my-home/demand" className="btn btn-primary mt-4">
            {totals.outstanding > 0 ? "View & pay" : "View ledger"}
          </Link>
        </div>

        {/* Construction */}
        <Link href="/progress" className="group overflow-hidden rounded-lg border border-line bg-canvas">
          <PhotoBlock src={latest.image} label={latest.milestone} />
          <div className="p-5">
            <p className="text-[13px] uppercase tracking-wide text-body-mid">Construction this week</p>
            <p className="mt-1 text-[17px] font-semibold text-ink">{latest.milestone}</p>
            <p className="text-[14px] text-body group-hover:text-ink">See full feed →</p>
          </div>
        </Link>

        <Link href="/my-home/documents" className="rounded-lg border border-line bg-canvas p-6 hover:border-primary">
          <p className="text-[24px]">📄</p>
          <p className="mt-2 text-[17px] font-semibold text-ink">My documents</p>
          <p className="text-[14px] text-body">Allotment, cost sheet, receipts, demand letters.</p>
        </Link>

        <div className="rounded-lg bg-canvas-soft p-6">
          <p className="text-[24px]">🎁</p>
          <p className="mt-2 text-[17px] font-semibold text-ink">Refer &amp; earn</p>
          <p className="text-[14px] text-body">Refer a friend — reward adjusts against your dues.</p>
          <a href="https://wa.me/919509500800?text=Check%20out%20Trimurty%20%E2%80%94%20I%20booked%20here%21" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-semibold text-primary hover:underline">
            Share your link →
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Construction" value={`${certifiedPct}% done`} href="/progress" cta="Track" />
        <MiniStat label="Paid so far" value={inrShort(totals.paid)} href="/my-home/ledger" cta="Open Khata" />
        <MiniStat label="Outstanding" value={inrShort(totals.outstanding)} href="/my-home/ledger" cta="View ledger" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <QuickLink href="/my-home/ledger" title="Digital Khata" body="Your full, bank-grade ledger — every demand, payment and receipt." />
        <QuickLink href="/my-home/snagging" title="Snagging & possession" body="Room-by-room checklist for handover, with rectification status." />
      </div>

      <p className="mt-6 text-[13px] text-body-mid">
        Paid to date {inr(totals.paid)} of {inr(totals.demanded)} demanded.
      </p>
    </div>
  );
}

function MiniStat({ label, value, href, cta }: { label: string; value: string; href: string; cta: string }) {
  return (
    <div className="rounded-lg border border-line p-5">
      <p className="text-[13px] text-body-mid">{label}</p>
      <p className="mt-0.5 text-[22px] font-semibold text-ink tabular">{value}</p>
      <Link href={href} className="mt-1 inline-block text-[14px] font-semibold text-primary hover:underline">
        {cta} →
      </Link>
    </div>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-lg bg-canvas-soft p-6 hover:ring-1 hover:ring-primary">
      <p className="text-[17px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[15px] text-body">{body}</p>
    </Link>
  );
}
