import { notFound } from "next/navigation";
import { getUnit, getTower, UNITS } from "@/lib/data";
import { computeCostSheet } from "@/lib/pricing";
import BookingFlow from "@/components/BookingFlow";
import { BackLink } from "@/components/ui";

const EOI_AMOUNT = 51000;

export function generateStaticParams() {
  return UNITS.map((u) => ({ unitId: u.id }));
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const tower = getTower(unit.towerId)!;
  const cost = computeCostSheet(unit);

  return (
    <div className="mx-auto max-w-[560px] px-5 py-8 sm:px-8">
      <div className="no-print">
        <BackLink href={`/unit/${unit.id}`}>Back to flat</BackLink>
      </div>
      <BookingFlow
        unitId={unit.id}
        title={`${unit.bhk} BHK · ${tower.name}`}
        subtitle={`Floor ${unit.floor} · ${unit.id}`}
        allInPrice={cost.grandTotal}
        eoiAmount={EOI_AMOUNT}
      />
    </div>
  );
}
