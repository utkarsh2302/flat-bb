"use client";

import { useApp } from "@/lib/store";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-10-9.2C.6 8.9 2 5.5 5.2 5.5c2 0 3.2 1.2 3.9 2.2.6.9.9 1.3.9 1.3s.3-.4.9-1.3c.7-1 1.9-2.2 3.9-2.2 3.2 0 4.6 3.4 3.2 6.3C19.5 16.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeartButton({
  unitId,
  variant = "icon",
  className = "",
}: {
  unitId: string;
  variant?: "icon" | "chip";
  className?: string;
}) {
  const { s, toggleShortlist } = useApp();
  const saved = s.shortlist.includes(unitId);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShortlist(unitId);
  };

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={`btn ${saved ? "btn-secondary" : "btn-tertiary"} ${className}`}
      >
        <Heart filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      className={`press grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors ${
        saved ? "bg-primary text-on-primary" : "bg-canvas/85 text-ink ring-1 ring-line hover:text-primary"
      } ${className}`}
    >
      <Heart filled={saved} />
    </button>
  );
}
