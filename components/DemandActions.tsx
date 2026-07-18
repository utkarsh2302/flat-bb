"use client";

import { useState } from "react";
import { inr } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function DemandActions({
  bookingId,
  amount,
}: {
  bookingId: string;
  amount: number;
}) {
  const { pay } = useApp();
  const [loan, setLoan] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  if (paid || amount <= 0) {
    return (
      <div className="rounded-lg bg-canvas-soft p-5 text-center">
        <p className="text-[28px]">✅</p>
        <p className="mt-1 text-[18px] font-semibold text-ink">
          {amount <= 0 ? "No dues right now" : "Payment received"}
        </p>
        <p className="text-[15px] text-body">
          {amount <= 0 ? "You're all caught up." : "Your receipt is on WhatsApp and in the ledger."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 rounded-lg bg-canvas-soft p-4 text-[15px] cursor-pointer">
        <input type="checkbox" checked={loan} onChange={(e) => setLoan(e.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />
        <span className="text-ink">I&apos;m paying this via a bank home loan</span>
      </label>

      {loan ? (
        <div className="rounded-lg border border-line p-5">
          <p className="text-[15px] text-body">
            Download the bank demand letter and share it with your loan officer to release this tranche.
          </p>
          <button type="button" onClick={() => window.print()} className="btn btn-secondary mt-4 w-full">
            Download bank demand letter (PDF)
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setPaying(true);
            setTimeout(() => {
              pay(bookingId, amount, "Milestone payment");
              setPaying(false);
              setPaid(true);
            }, 1200);
          }}
          disabled={paying}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {paying ? "Processing…" : `Pay ${inr(amount)} now`}
        </button>
      )}
      <p className="text-center text-[13px] text-body-mid">🔒 Escrow-compliant · goes to the RERA project account</p>
    </div>
  );
}
