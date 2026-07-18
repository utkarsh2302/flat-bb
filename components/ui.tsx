import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="t-eyebrow text-primary">{children}</p>;
}

/** A trust chip: small icon + label + value (RERA no., possession, % sold…). */
export function TrustChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-canvas-soft px-4 py-3">
      <p className="text-[12px] uppercase tracking-wide text-body-mid">{label}</p>
      <p className="mt-0.5 text-[16px] font-semibold text-ink tabular">{value}</p>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-6 ${className}`}>{children}</div>
  );
}

/** Availability legend — always visible so colours are never guessed. */
export function AvailabilityLegend() {
  const items: { cls: string; label: string }[] = [
    { cls: "bg-primary", label: "Available" },
    { cls: "bg-canvas-soft border border-ink/20", label: "On hold" },
    { cls: "bg-ink", label: "Booked" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-[14px] text-body">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2">
          <span className={`inline-block h-3.5 w-3.5 rounded-[4px] ${i.cls}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** Primary CTA rendered as a link. */
export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
}) {
  return (
    <Link href={href} className={`btn btn-${variant} ${className}`}>
      {children}
    </Link>
  );
}

/** KPI tile for cockpit / dashboard grids. */
export function StatTile({
  label,
  value,
  sub,
  href,
  tone = "plain",
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  tone?: "plain" | "ink" | "alert";
}) {
  const cls =
    tone === "ink"
      ? "bg-ink text-on-primary shadow-[var(--shadow-soft)]"
      : tone === "alert"
        ? "card ring-1 ring-primary/40"
        : "card";
  const body = (
    <div className={`rounded-lg p-5 ${cls} ${href ? "transition-shadow hover:shadow-[var(--shadow-lux)]" : ""}`}>
      <p className={`text-[13px] uppercase tracking-wide ${tone === "ink" ? "text-mute" : "text-body-mid"}`}>
        {label}
      </p>
      <p className={`mt-1 text-[28px] font-semibold leading-none tabular ${tone === "ink" ? "text-on-primary" : "text-ink"}`}>
        {value}
      </p>
      {sub && <p className={`mt-1.5 text-[13px] ${tone === "ink" ? "text-mute" : "text-body"}`}>{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

/** Back link used at the top of drill-down pages. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[15px] text-body hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </Link>
  );
}
