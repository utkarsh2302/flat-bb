"use client";

import { useState } from "react";
import type { LeadStatus } from "@/lib/data";
import { CURRENT_ASSOCIATE } from "@/lib/data";
import { inDate } from "@/lib/format";
import { useApp } from "@/lib/store";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  visit_booked: "Visit booked",
  eoi: "EOI paid",
  booked: "Booked",
  lost: "Lost",
};

function chipClass(s: LeadStatus): string {
  switch (s) {
    case "new":
      return "bg-canvas-soft text-ink border border-ink/20";
    case "visit_booked":
      return "bg-ink/70 text-on-primary";
    case "eoi":
      return "bg-primary text-on-primary";
    case "booked":
      return "bg-ink text-on-primary";
    case "lost":
      return "bg-canvas-soft text-body-mid";
  }
}

function validTill(taggedOn: string, days: number): string {
  return inDate(new Date(new Date(taggedOn).getTime() + days * 864e5));
}

export default function BrokerLeads() {
  const { s, addLead } = useApp();
  const leads = s.leads.filter((l) => l.associateId === CURRENT_ASSOCIATE);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [err, setErr] = useState("");

  function add() {
    if (name.trim().length < 3) return setErr("Enter the client's name.");
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) return setErr("Enter a valid 10-digit mobile.");
    setErr("");
    addLead({
      id: `L${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      interest: interest.trim() || "Not specified",
      status: "new",
      taggedOn: new Date().toISOString().slice(0, 10),
      validityDays: 90,
      associateId: CURRENT_ASSOCIATE,
    });
    setName("");
    setPhone("");
    setInterest("");
  }

  return (
    <div>
      <div className="rounded-lg border border-line p-5">
        <p className="text-[15px] font-semibold text-ink">Tag a new lead</p>
        <p className="text-[13px] text-body-mid">First tag wins — your client is protected for 90 days once tagged.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" className="fld" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile" inputMode="numeric" className="fld" />
          <input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Interest (e.g. 3 BHK)" className="fld" />
          <button type="button" onClick={add} className="btn btn-primary">Tag lead</button>
        </div>
        {err && <p className="mt-2 text-[13px] text-primary">{err}</p>}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[720px] text-[14px]">
          <thead>
            <tr className="bg-canvas-soft text-left text-[12px] uppercase tracking-wide text-body-mid">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Protected till</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                <td className="px-4 py-3 text-body tabular">{l.phone}</td>
                <td className="px-4 py-3 text-body">{l.interest}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${chipClass(l.status)}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-body tabular">{validTill(l.taggedOn, l.validityDays)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
