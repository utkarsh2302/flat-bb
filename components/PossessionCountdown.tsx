"use client";

import { useEffect, useState } from "react";
import { PROJECT } from "@/lib/data";

export default function PossessionCountdown({ className = "" }: { className?: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(Math.ceil((new Date(PROJECT.possession).getTime() - Date.now()) / 864e5));
  }, []);
  if (days == null) return null;
  const months = Math.max(0, Math.round(days / 30));
  const text = days <= 0 ? "Ready for possession" : `~${months} months to possession`;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-3 py-1 text-[13px] font-medium text-ink ${className}`}>
      🔑 {text}
    </span>
  );
}
