"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUnit, getTower, PROJECT } from "@/lib/data";
import { inDateFriendly } from "@/lib/format";
import { BackLink, Eyebrow } from "@/components/ui";
import { useApp } from "@/lib/store";

const SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"];

export default function VisitPage() {
  const { bookVisit } = useApp();
  const [unitId, setUnitId] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ date: string; slot: string } | null>(null);

  useEffect(() => {
    // Read the (optional) unit param + today's date on mount — client-only.
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnitId(p.get("u"));
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const unit = unitId ? getUnit(unitId) : undefined;
  const tower = unit ? getTower(unit.towerId) : undefined;

  function submit() {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile.";
    if (!date) e.date = "Pick a date.";
    setErr(e);
    if (Object.keys(e).length) return;
    bookVisit({ id: `V${Date.now()}`, unitId, name: name.trim(), phone: phone.trim(), date, slot });
    setDone({ date, slot });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-[560px] px-5 py-16 text-center sm:px-8">
        <p className="text-[40px]">📅</p>
        <h1 className="t-serif-lg mt-3">Visit requested</h1>
        <p className="t-body-md mt-3 text-body">
          Thanks {name.split(" ")[0]} — we&apos;ll confirm your visit on{" "}
          <span className="font-semibold text-ink">{inDateFriendly(done.date)} at {done.slot}</span> over WhatsApp.
          {unit ? <> We&apos;ll have {unit.bhk} BHK {unit.id} ready to show you.</> : null}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/explore" className="btn btn-primary">Keep exploring</Link>
          {unit && <Link href={`/unit/${unit.id}`} className="btn btn-tertiary">Back to the flat</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-5 py-8 sm:px-8">
      <BackLink href={unit ? `/unit/${unit.id}` : "/explore"}>Back</BackLink>
      <Eyebrow>Free &amp; no obligation</Eyebrow>
      <h1 className="t-serif-lg mt-2">Book a site visit</h1>
      <p className="t-body-sm mt-2 text-body">
        See the sample flat, the actual unit, and the neighbourhood — with a relationship manager, in Hindi or English.
      </p>

      {unit && tower && (
        <div className="mt-5 rounded-lg bg-canvas-soft p-4 text-[15px]">
          <span className="font-semibold text-ink">{unit.bhk} BHK · {tower.name}</span>
          <span className="text-body"> · Floor {unit.floor} · {unit.id}</span>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <Field label="Your name" error={err.name}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="fld" autoComplete="name" />
        </Field>
        <Field label="Mobile number" error={err.phone}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" placeholder="10-digit mobile" className="fld" autoComplete="tel" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred date" error={err.date}>
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="fld" />
          </Field>
          <Field label="Time slot">
            <select value={slot} onChange={(e) => setSlot(e.target.value)} className="fld">
              {SLOTS.map((sName) => (
                <option key={sName}>{sName}</option>
              ))}
            </select>
          </Field>
        </div>
        <button type="button" onClick={submit} className="btn btn-primary btn-lg w-full">
          Request visit
        </button>
        <p className="text-center text-[13px] text-body-mid">
          {PROJECT.name}, {PROJECT.locality} · we&apos;ll call to confirm.
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-[13px] text-primary">{error}</span>}
    </label>
  );
}
