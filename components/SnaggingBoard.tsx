"use client";

import { useState } from "react";
import type { SnagStatus } from "@/lib/data";
import { useApp } from "@/lib/store";

const STATUS_LABEL: Record<SnagStatus, string> = {
  reported: "Reported",
  fixing: "Fixing",
  fixed: "Fixed",
  verified: "Verified",
};
const ROOMS = ["Living", "Kitchen", "Master bath", "Bedroom", "Balcony"];

function chipClass(s: SnagStatus): string {
  switch (s) {
    case "reported":
      return "bg-canvas-soft text-ink border border-ink/20";
    case "fixing":
      return "bg-primary text-on-primary";
    case "fixed":
      return "bg-ink/70 text-on-primary";
    case "verified":
      return "bg-ink text-on-primary";
  }
}

export default function SnaggingBoard({ bookingId }: { bookingId: string }) {
  const { s, addSnag, advanceSnag } = useApp();
  const snags = s.snags[bookingId] ?? [];
  const [tab, setTab] = useState<string>("All");
  const [room, setRoom] = useState(ROOMS[0]);
  const [issue, setIssue] = useState("");

  const rooms = ["All", ...Array.from(new Set(snags.map((x) => x.room)))];
  const visible = tab === "All" ? snags : snags.filter((x) => x.room === tab);
  const open = snags.filter((x) => x.status !== "verified").length;

  function add() {
    if (issue.trim().length < 3) return;
    addSnag(bookingId, { id: `s${Date.now()}`, room, issue: issue.trim(), status: "reported" });
    setIssue("");
  }

  return (
    <div>
      <div className="rounded-lg bg-canvas-soft p-4 text-[15px] text-body">
        <span className="font-semibold text-ink tabular">{open}</span> open ·{" "}
        <span className="font-semibold text-ink tabular">{snags.length - open}</span> verified. Tap a room to
        filter, or report a new snag below.
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {rooms.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setTab(r)}
            className={`rounded-full px-4 py-1.5 text-[14px] font-semibold ${
              tab === r ? "bg-ink text-on-primary" : "bg-canvas-soft text-body hover:text-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 && (
          <p className="rounded-lg bg-canvas-soft p-5 text-[15px] text-body">No snags here — looks good!</p>
        )}
        {visible.map((x) => (
          <div key={x.id} className="flex items-center justify-between rounded-lg border border-line bg-canvas p-4">
            <div>
              <p className="text-[13px] text-body-mid">{x.room}</p>
              <p className="text-[16px] text-ink">{x.issue}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${chipClass(x.status)}`}>
                {STATUS_LABEL[x.status]}
              </span>
              {x.status !== "verified" && (
                <button
                  type="button"
                  onClick={() => advanceSnag(bookingId, x.id)}
                  className="rounded-sm border border-line px-2 py-1 text-[12px] text-body hover:text-ink"
                  title="Advance status"
                >
                  Advance →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-line p-5">
        <p className="text-[15px] font-semibold text-ink">📷 Report a snag</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <select value={room} onChange={(e) => setRoom(e.target.value)} className="fld sm:w-44">
            {ROOMS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <input
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe the issue"
            className="fld flex-1"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button type="button" onClick={add} className="btn btn-primary">Add snag</button>
        </div>
      </div>
    </div>
  );
}
