"use client";

import { ASSOCIATES, type LeadStatus } from "@/lib/data";
import { inDate } from "@/lib/format";
import { Eyebrow, StatTile } from "@/components/ui";
import { useApp } from "@/lib/store";

const NAME: Record<string, string> = Object.fromEntries(ASSOCIATES.map((a) => [a.id, a.name]));
const STAGES: { key: LeadStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "visit_booked", label: "Visit booked" },
  { key: "eoi", label: "EOI" },
  { key: "booked", label: "Booked" },
  { key: "lost", label: "Lost" },
];

export default function AdminLeads() {
  const { s, setLead } = useApp();
  const count = (k: LeadStatus) => s.leads.filter((l) => l.status === k).length;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8">
      <Eyebrow>CRM · live pipeline</Eyebrow>
      <h1 className="t-serif-lg mt-2">Leads</h1>
      <p className="t-body-sm mt-2 text-body">
        Every enquiry across direct and channel-partner sources, in one pipeline. Move a lead through stages — the funnel updates live.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {STAGES.map((st) => (
          <StatTile key={st.key} label={st.label} value={String(count(st.key))} tone={st.key === "booked" ? "ink" : "plain"} />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[820px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Tagged</th>
              <th className="px-4 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {s.leads.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                <td className="px-4 py-3 text-body tabular">{l.phone}</td>
                <td className="px-4 py-3 text-body">{l.interest}</td>
                <td className="px-4 py-3 text-body">{NAME[l.associateId] ?? "Direct"}</td>
                <td className="px-4 py-3 text-body tabular">{inDate(l.taggedOn)}</td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) => setLead(l.id, e.target.value as LeadStatus)}
                    className="rounded-sm border border-line bg-canvas px-2 py-1 text-[13px] font-semibold text-ink"
                  >
                    {STAGES.map((st) => (
                      <option key={st.key} value={st.key}>{st.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
