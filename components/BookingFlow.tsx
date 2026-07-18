"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { inr, inrShort, inDateFriendly } from "@/lib/format";
import { CURRENT_ASSOCIATE } from "@/lib/data";
import ShareButton from "@/components/ShareButton";
import { useApp } from "@/lib/store";

type Step = 0 | 1 | 2 | 3; // KYC, OTP, Pay, Done
const HOLD_SECONDS = 15 * 60;
const STEP_LABELS = ["Your details", "Verify phone", "Pay token"];

export default function BookingFlow({
  unitId,
  title,
  subtitle,
  allInPrice,
  eoiAmount,
}: {
  unitId: string;
  title: string;
  subtitle: string;
  allInPrice: number;
  eoiAmount: number;
}) {
  const [associateId, setAssociateId] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<Step>(0);
  const [left, setLeft] = useState(HOLD_SECONDS);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState<{ bookingId: string; lockTill: string } | null>(null);
  const { hold, book } = useApp();

  // Starting a reservation places a live 15-min hold on the unit — visible in
  // the elevation and the builder cockpit immediately. Also detect broker mode.
  useEffect(() => {
    hold(unitId);
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p.get("broker") === "1") setAssociateId(CURRENT_ASSOCIATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  // Hold countdown — stops once booked.
  useEffect(() => {
    if (step === 3) return;
    if (left <= 0) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [left, step]);

  const expired = left <= 0 && step !== 3;

  function submitKyc() {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(pan.trim())) e.pan = "Enter a valid PAN (e.g. ABCDE1234F).";
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(1);
  }

  function verifyOtp() {
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "Enter the 6-digit code. (Demo: any 6 digits work.)" });
      return;
    }
    setErrors({});
    setStep(2);
  }

  function pay() {
    setPaying(true);
    // Simulated gateway — real Razorpay/UPI drops in here tomorrow.
    setTimeout(() => {
      const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      const lockTill = inDateFriendly(new Date(Date.now() + 7 * 864e5));
      // Create the real booking: unit -> booked, ledger seeded. A buyer booking
      // shows in My Home; an associate booking adds a commission instead.
      book({ unitId, buyerName: name.trim(), phone: phone.trim(), mine: !associateId, associateId, id: bookingId });
      setReceipt({ bookingId, lockTill });
      setPaying(false);
      setStep(3);
    }, 1400);
  }

  if (expired) {
    return (
      <div className="mt-6 rounded-md border border-ink/15 bg-canvas p-8 text-center">
        <p className="t-display-sub-sm">Your hold expired</p>
        <p className="mt-2 text-[16px] text-body">
          The 15-minute hold on {unitId} has ended. You can start again — the flat may still be available.
        </p>
        <Link href={`/unit/${unitId}`} className="btn btn-primary mt-6">
          Try again
        </Link>
      </div>
    );
  }

  if (step === 3 && receipt) {
    return (
      <AllotmentCard
        bookingId={receipt.bookingId}
        lockTill={receipt.lockTill}
        unitId={unitId}
        title={title}
        name={name}
        eoiAmount={eoiAmount}
        allInPrice={allInPrice}
      />
    );
  }

  return (
    <div className="mt-4">
      {associateId && (
        <p className="mb-4 rounded-md bg-canvas-soft px-4 py-3 text-[14px] text-body">
          Reserving on behalf of your client — enter <span className="font-semibold text-ink">their</span> details.
        </p>
      )}
      {/* Summary + hold timer */}
      <div className="rounded-md bg-canvas-soft p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[18px] font-semibold text-ink">{title}</p>
            <p className="text-[14px] text-body">{subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-wide text-body-mid">Held for you</p>
            <p className="text-[20px] font-semibold text-ink tabular">{mmss(left)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3 text-[15px]">
          <span className="text-body">Token now · price locked 7 days</span>
          <span className="font-semibold text-ink tabular">{inr(eoiAmount)}</span>
        </div>
      </div>

      {/* Progress dots */}
      <ol className="mt-6 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${
                i <= step ? "bg-primary text-on-primary" : "bg-canvas-soft text-body-mid"
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-[13px] ${i === step ? "font-semibold text-ink" : "text-body-mid"}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-md border border-ink/15 bg-canvas p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name" error={errors.name}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As per PAN" className="fld" autoComplete="name" />
            </Field>
            <Field label="Mobile number" error={errors.phone}>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" placeholder="10-digit mobile" className="fld" autoComplete="tel" />
            </Field>
            <Field label="PAN" error={errors.pan}>
              <input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" className="fld uppercase" maxLength={10} />
            </Field>
            <button type="button" onClick={submitKyc} className="btn btn-primary w-full">
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-[16px] text-body">
              We sent a 6-digit code to <span className="font-semibold text-ink">{phone}</span>.
            </p>
            <Field label="Enter OTP" error={errors.otp}>
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="6-digit code" className="fld tabular" />
            </Field>
            <button type="button" onClick={verifyOtp} className="btn btn-primary w-full">
              Verify & continue
            </button>
            <button type="button" onClick={() => setStep(0)} className="w-full text-[14px] text-body hover:text-ink">
              Change details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-[16px] text-body">
              Pay a refundable token of <span className="font-semibold text-ink">{inr(eoiAmount)}</span> to lock{" "}
              <span className="font-semibold text-ink">{inrShort(allInPrice)}</span> for 7 days.
            </p>
            <div className="grid grid-cols-3 gap-2 text-[13px]">
              {["UPI", "Card", "Netbanking"].map((m, i) => (
                <div key={m} className={`rounded-sm border px-3 py-2 text-center ${i === 0 ? "border-primary bg-canvas-soft font-semibold text-ink" : "border-ink/15 text-body"}`}>
                  {m}
                </div>
              ))}
            </div>
            <button type="button" onClick={pay} disabled={paying} className="btn btn-primary w-full disabled:opacity-60">
              {paying ? "Processing…" : `Pay ${inr(eoiAmount)} via UPI`}
            </button>
            <p className="text-center text-[13px] text-body-mid">🔒 Escrow-compliant · refundable per policy</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AllotmentCard({
  bookingId,
  lockTill,
  unitId,
  title,
  name,
  eoiAmount,
  allInPrice,
}: {
  bookingId: string;
  lockTill: string;
  unitId: string;
  title: string;
  name: string;
  eoiAmount: number;
  allInPrice: number;
}) {
  return (
    <div className="mt-6 text-center">
      <p className="text-[40px]">🎉</p>
      <h1 className="t-display-md mt-2">Flat reserved!</h1>
      <p className="mt-2 text-[16px] text-body">
        Your allotment letter is on its way to WhatsApp.
      </p>

      <div className="mt-6 rounded-md bg-ink p-6 text-left text-on-primary">
        <div className="flex items-center justify-between">
          <span className="t-eyebrow text-primary">Provisional allotment</span>
          <span className="text-[13px] text-mute">{bookingId}</span>
        </div>
        <p className="mt-3 text-[22px] font-semibold">{title}</p>
        <p className="text-[15px] text-mute">{unitId} · {name || "Buyer"}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-[15px]">
          <div>
            <dt className="text-mute text-[13px]">Token paid</dt>
            <dd className="font-semibold tabular">{inr(eoiAmount)}</dd>
          </div>
          <div>
            <dt className="text-mute text-[13px]">Price locked</dt>
            <dd className="font-semibold tabular">{inrShort(allInPrice)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-mute text-[13px]">Lock valid till</dt>
            <dd className="font-semibold">{lockTill}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <ShareButton text={`I just reserved ${title} (${unitId}) at Trimurty! 🎉`} label="Share with family" className="btn btn-primary" />
        <Link href="/my-home" className="btn btn-tertiary">
          Go to My Home
        </Link>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-[13px] text-primary">{error}</span>}
    </label>
  );
}

function mmss(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}
