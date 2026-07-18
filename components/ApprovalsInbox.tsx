"use client";

import type { ApprovalType } from "@/lib/data";
import { inr } from "@/lib/format";
import { useApp } from "@/lib/store";

const ICON: Record<ApprovalType, string> = {
  discount: "🏷️",
  refund: "↩️",
  certification: "✅",
};

export default function ApprovalsInbox() {
  const { s, decideApproval } = useApp();
  const pending = s.approvals.filter((a) => !a.decision).length;

  return (
    <div>
      <p className="text-[15px] text-body">
        <span className="font-semibold text-ink tabular">{pending}</span> pending ·{" "}
        <span className="tabular">{s.approvals.length - pending}</span> decided
      </p>

      <div className="mt-5 space-y-4">
        {s.approvals.map((a) => (
          <div key={a.id} className={`rounded-lg border p-5 ${a.decision ? "border-line bg-canvas-soft/60" : "border-line bg-canvas"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="text-[22px]">{ICON[a.type]}</span>
                <div>
                  <p className="text-[17px] font-semibold text-ink">{a.title}</p>
                  <p className="mt-1 text-[15px] text-body">{a.detail}</p>
                  <p className="mt-1 text-[13px] text-body-mid">Requested by {a.requestedBy}</p>
                </div>
              </div>
              {a.amount != null && <span className="shrink-0 text-[16px] font-semibold text-ink tabular">{inr(a.amount)}</span>}
            </div>

            {a.decision ? (
              <p className={`mt-4 text-[14px] font-semibold ${a.decision === "approved" ? "text-ink" : "text-primary"}`}>
                {a.decision === "approved" ? "Approved ✓" : "Rejected"} · audit note recorded
              </p>
            ) : (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => decideApproval(a.id, "approved")} className="btn btn-primary">Approve</button>
                <button type="button" onClick={() => decideApproval(a.id, "rejected")} className="btn btn-tertiary">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
