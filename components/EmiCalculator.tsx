"use client";

import { useState } from "react";
import { emi, maxAffordablePrice } from "@/lib/pricing";
import { inr, inrShort } from "@/lib/format";

export default function EmiCalculator({ initialPrice }: { initialPrice: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [rent, setRent] = useState(28000);
  const [budget, setBudget] = useState(85000);

  const loan = Math.round(price * (1 - downPct / 100));
  const monthly = emi(loan, rate, years);
  const totalPaid = monthly * years * 12;
  const totalInterest = totalPaid - loan;

  // Reverse EMI — what a monthly budget can afford
  const maxPrice = maxAffordablePrice(budget, rate, years, downPct);
  const maxLoan = Math.round(maxPrice * (1 - downPct / 100));

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Controls */}
      <div className="space-y-6 rounded-md border border-ink/10 p-6">
        <Slider label="Property price" value={price} min={4000000} max={50000000} step={100000} onChange={setPrice} display={inrShort(price)} />
        <Slider label="Down payment" value={downPct} min={10} max={60} step={5} onChange={setDownPct} display={`${downPct}%  ·  ${inrShort(price * (downPct / 100))}`} />
        <Slider label="Interest rate" value={rate} min={7} max={12} step={0.1} onChange={setRate} display={`${rate.toFixed(1)}%`} />
        <Slider label="Loan tenure" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} years`} />
        <Slider label="Comparable rent / month" value={rent} min={8000} max={120000} step={1000} onChange={setRent} display={inr(rent)} />
        <Slider label="I can pay / month (affordability)" value={budget} min={20000} max={300000} step={5000} onChange={setBudget} display={inr(budget)} />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="rounded-md bg-ink p-6 text-on-primary">
          <p className="text-[13px] uppercase tracking-wide text-mute">Your monthly EMI</p>
          <p className="mt-1 text-[40px] font-semibold leading-none tabular">{inr(monthly)}</p>
          <p className="mt-2 text-[14px] text-mute">on a {inrShort(loan)} loan</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Stat label="Loan amount" value={inrShort(loan)} />
          <Stat label="Total interest" value={inrShort(totalInterest)} />
          <Stat label="Total payable" value={inrShort(totalPaid)} />
          <Stat label="Down payment" value={inrShort(price - loan)} />
        </div>

        <div className="rounded-md bg-canvas-soft p-5">
          <p className="text-[15px] font-semibold text-ink">Buy vs rent</p>
          <p className="mt-2 text-[15px] text-body">
            {monthly <= rent ? (
              <>
                Your EMI (<span className="font-semibold text-ink tabular">{inr(monthly)}</span>) is{" "}
                <span className="font-semibold text-primary">lower than</span> the rent you&apos;d pay —
                and you own the home.
              </>
            ) : (
              <>
                Your EMI is <span className="font-semibold text-ink tabular">{inr(monthly - rent)}</span>{" "}
                more than rent per month, but it builds an asset instead of a receipt.
              </>
            )}
          </p>
        </div>

        <div className="rounded-md bg-canvas-soft p-5">
          <p className="text-[15px] font-semibold text-ink">What you can afford</p>
          <p className="mt-1 text-[14px] text-body">
            At <span className="font-semibold text-ink tabular">{inr(budget)}</span>/month, {rate.toFixed(1)}% for {years} years:
          </p>
          <p className="mt-2 text-[24px] font-semibold text-ink tabular">up to {inrShort(maxPrice)}</p>
          <p className="text-[13px] text-body-mid">≈ {inrShort(maxLoan)} loan + {downPct}% down</p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-ink">{label}</span>
        <span className="text-[15px] font-semibold text-ink tabular">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2 w-full accent-[var(--color-primary)]"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink/10 p-4">
      <p className="text-[13px] text-body-mid">{label}</p>
      <p className="mt-0.5 text-[19px] font-semibold text-ink tabular">{value}</p>
    </div>
  );
}
