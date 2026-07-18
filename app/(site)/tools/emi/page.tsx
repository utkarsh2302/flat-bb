"use client";

import { useEffect, useState } from "react";
import EmiCalculator from "@/components/EmiCalculator";
import { Eyebrow } from "@/components/ui";

export default function EmiPage() {
  const [price, setPrice] = useState(12500000);

  useEffect(() => {
    const p = Number(new URLSearchParams(window.location.search).get("price"));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Number.isFinite(p) && p > 0) setPrice(p);
  }, []);

  return (
    <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8">
      <Eyebrow>Plan your budget</Eyebrow>
      <h1 className="t-serif-lg mt-3">EMI &amp; rent calculator</h1>
      <p className="t-body-md mt-3 max-w-xl text-body">
        See your monthly EMI, and whether buying beats renting. Drag the sliders — everything updates instantly.
      </p>
      <EmiCalculator key={price} initialPrice={price} />
    </div>
  );
}
