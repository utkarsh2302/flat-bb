import type { UnitStatus } from "@/lib/data";
import { STATUS_LABEL, statusChipClass } from "@/lib/status";

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: UnitStatus;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-3 py-1 text-[13px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad} ${statusChipClass(
        status,
      )}`}
    >
      {status === "available" && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}
