import { notFound } from "next/navigation";
import { getUnit, getTower, CURRENT_ASSOCIATE } from "@/lib/data";
import { computeCostSheet } from "@/lib/pricing";
import BookingFlow from "@/components/BookingFlow";
import { BackLink } from "@/components/ui";

const EOI_AMOUNT = 51000;

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ broker?: string }>;
}) {
  const { unitId } = await params;
  const { broker } = await searchParams;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const tower = getTower(unit.towerId)!;
  const cost = computeCostSheet(unit);
  const isBroker = broker === "1";

  return (
    <div className="mx-auto max-w-[560px] px-5 py-8 sm:px-8">
      <div className="no-print">
        <BackLink href={isBroker ? "/broker/inventory" : `/unit/${unit.id}`}>
          {isBroker ? "Back to inventory" : "Back to flat"}
        </BackLink>
      </div>
      {isBroker && (
        <p className="mt-3 rounded-lg bg-canvas-soft px-4 py-3 text-[14px] text-body">
          Reserving on behalf of your client — enter <span className="font-semibold text-ink">their</span> details.
        </p>
      )}
      <BookingFlow
        unitId={unit.id}
        title={`${unit.bhk} BHK · ${tower.name}`}
        subtitle={`Floor ${unit.floor} · ${unit.id}`}
        allInPrice={cost.grandTotal}
        eoiAmount={EOI_AMOUNT}
        associateId={isBroker ? CURRENT_ASSOCIATE : undefined}
      />
    </div>
  );
}
