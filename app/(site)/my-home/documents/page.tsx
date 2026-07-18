"use client";

import Link from "next/link";
import { inDate } from "@/lib/format";
import { BackLink, Eyebrow } from "@/components/ui";
import { useApp, primaryBooking } from "@/lib/store";

interface Doc {
  name: string;
  date: string;
  href: string;
  kind: string;
}

export default function DocumentsPage() {
  const { s } = useApp();
  const booking = primaryBooking(s);

  if (!booking) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <BackLink href="/my-home">My Home</BackLink>
        <p className="mt-6 text-[16px] text-body">No booking yet.</p>
      </div>
    );
  }

  const receipts = (s.ledgers[booking.id] ?? []).filter((l) => l.receiptNo);
  const docs: Doc[] = [
    { name: "Provisional allotment letter", date: booking.applied, href: "#", kind: "Allotment" },
    { name: "Cost sheet", date: booking.applied, href: `/unit/${booking.unitId}/cost-sheet`, kind: "Pricing" },
    { name: "Digital Khata (ledger)", date: booking.applied, href: "/my-home/ledger", kind: "Statement" },
    { name: "Latest demand", date: booking.applied, href: "/my-home/demand", kind: "Demand" },
    ...receipts.map((r) => ({ name: `Receipt ${r.receiptNo} — ${r.particulars}`, date: r.date, href: "#", kind: "Receipt" })),
  ];

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 sm:px-8">
      <BackLink href="/my-home">My Home</BackLink>
      <Eyebrow>Vault</Eyebrow>
      <h1 className="t-serif-lg mt-2">My documents</h1>
      <p className="t-body-sm mt-2 text-body">Every document in one place — always available, shareable on WhatsApp.</p>

      <div className="mt-6 divide-y divide-line rounded-lg border border-line">
        {docs.map((d, i) => {
          const isLink = d.href !== "#";
          const Inner = (
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-[20px]">📄</span>
                <div>
                  <p className="text-[16px] font-medium text-ink">{d.name}</p>
                  <p className="text-[13px] text-body-mid">{d.kind} · {inDate(d.date)}</p>
                </div>
              </div>
              <span className="text-[14px] font-semibold text-primary">{isLink ? "Open →" : "Download"}</span>
            </div>
          );
          return isLink ? (
            <Link key={i} href={d.href} className="block hover:bg-canvas-soft">{Inner}</Link>
          ) : (
            <div key={i}>{Inner}</div>
          );
        })}
      </div>
      <p className="mt-4 text-[13px] text-body-mid">Downloads are simulated in this demo. Real signed PDFs generate tomorrow.</p>
    </div>
  );
}
