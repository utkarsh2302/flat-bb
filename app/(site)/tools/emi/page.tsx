import EmiCalculator from "@/components/EmiCalculator";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "EMI calculator — Trimurty" };

export default async function EmiPage({
  searchParams,
}: {
  searchParams: Promise<{ price?: string }>;
}) {
  const { price } = await searchParams;
  const initial = Number(price);
  const initialPrice = Number.isFinite(initial) && initial > 0 ? initial : 12500000;

  return (
    <div className="mx-auto max-w-[820px] px-6 py-10">
      <Eyebrow>Plan your budget</Eyebrow>
      <h1 className="t-display-lg mt-3">EMI &amp; rent calculator</h1>
      <p className="t-body-md mt-3 max-w-xl text-body">
        See your monthly EMI, and whether buying beats renting. Drag the sliders —
        everything updates instantly.
      </p>
      <EmiCalculator initialPrice={initialPrice} />
    </div>
  );
}
