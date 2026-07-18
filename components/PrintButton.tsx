"use client";

export default function PrintButton({
  label = "Download PDF",
  className = "btn btn-secondary",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
