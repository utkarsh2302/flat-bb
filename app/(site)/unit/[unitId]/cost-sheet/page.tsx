import { notFound } from "next/navigation";
import { getUnit, getTower, PROJECT, UNITS } from "@/lib/data";

export function generateStaticParams() {
  return UNITS.map((u) => ({ unitId: u.id }));
}
import { computeCostSheet } from "@/lib/pricing";
import { inr, inrShort, sqft, inDateFriendly } from "@/lib/format";
import { FACING_LABEL } from "@/components/Compass";
import ShareButton from "@/components/ShareButton";
import PrintButton from "@/components/PrintButton";
import { BackLink, LinkButton } from "@/components/ui";

export default async function CostSheetPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);
  if (!unit) notFound();
  const tower = getTower(unit.towerId)!;
  const cost = computeCostSheet(unit);
  // Server component, rendered per request — "now + 7 days" is intentional.
  // eslint-disable-next-line react-hooks/purity
  const validTill = inDateFriendly(new Date(Date.now() + 7 * 864e5));

  return (
    <div className="mx-auto max-w-[820px] px-6 py-8">
      <div className="no-print">
        <BackLink href={`/unit/${unit.id}`}>Back to flat</BackLink>
      </div>

      <div className="mt-4 rounded-md border border-ink/15 bg-canvas p-6 sm:p-8">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b border-ink/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-primary" />
              <span className="text-[20px] font-semibold text-ink">{PROJECT.builder}</span>
            </div>
            <p className="mt-1 text-[15px] text-body">{PROJECT.name}, {PROJECT.city}</p>
            <p className="text-[13px] text-body-mid">RERA {PROJECT.reraNo}</p>
          </div>
          <div className="text-right">
            <p className="t-eyebrow text-primary">Cost sheet</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">{unit.id}</p>
            <p className="text-[13px] text-body-mid">Valid till {validTill}</p>
          </div>
        </div>

        {/* Unit summary */}
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] sm:grid-cols-4">
          <Summary k="Type" v={`${unit.bhk} BHK`} />
          <Summary k="Tower / Floor" v={`${tower.name} · ${unit.floor}`} />
          <Summary k="Super area" v={sqft(unit.superSqft)} />
          <Summary k="Facing" v={FACING_LABEL[unit.facing]} />
        </dl>

        {/* Charges */}
        <table className="mt-6 w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink/15 text-left">
              <th className="py-2 font-semibold text-ink">Particulars</th>
              <th className="py-2 text-right font-semibold text-ink">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cost.charges.map((l) => (
              <LineRow key={l.key} label={l.label} hindi={l.hindi} amount={l.amount} />
            ))}
            <tr className="border-t border-ink/15">
              <td className="py-2.5 font-semibold text-ink">Sub-total (before taxes)</td>
              <td className="py-2.5 text-right font-semibold text-ink tabular">{inr(cost.subtotalBeforeTax)}</td>
            </tr>
            {cost.taxes.map((l) => (
              <LineRow key={l.key} label={l.label} hindi={l.hindi} amount={l.amount} />
            ))}
          </tbody>
        </table>

        {/* Grand total */}
        <div className="mt-4 flex items-center justify-between rounded-md bg-ink px-5 py-4 text-on-primary">
          <div>
            <p className="text-[13px] uppercase tracking-wide text-mute">Grand total (all-inclusive)</p>
            <p className="text-[14px] text-mute tabular">{inrShort(cost.grandTotal)} · {inr(cost.perSqftAllIn)}/sq.ft</p>
          </div>
          <p className="text-[26px] font-semibold tabular">{inr(cost.grandTotal)}</p>
        </div>

        {cost.tdsNote && (
          <p className="mt-4 rounded-sm bg-canvas-soft px-4 py-3 text-[14px] text-body">
            <span className="font-semibold text-ink">TDS note:</span> {cost.tdsNote}
          </p>
        )}

        <p className="mt-4 text-[13px] text-body-mid">
          Prices are indicative and inclusive of the charges listed above. No hidden
          charges. Taxes as per prevailing government rates.
        </p>
      </div>

      {/* Actions */}
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <PrintButton />
        <ShareButton
          text={`Cost sheet for ${unit.bhk} BHK ${unit.id} at ${tower.name} — ${inrShort(cost.grandTotal)} all-in`}
        />
        {unit.status === "available" && (
          <LinkButton href={`/unit/${unit.id}/book`}>Reserve with EOI</LinkButton>
        )}
      </div>
    </div>
  );
}

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-wide text-body-mid">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}

function LineRow({ label, hindi, amount }: { label: string; hindi: string; amount: number }) {
  return (
    <tr className="border-b border-ink/5">
      <td className="py-2.5 pr-4">
        <span className="text-ink">{label}</span>
        <span className="block text-[13px] text-body-mid">{hindi}</span>
      </td>
      <td className="py-2.5 text-right text-ink tabular">{inr(amount)}</td>
    </tr>
  );
}
