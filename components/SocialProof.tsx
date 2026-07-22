"use client";

import { useEffect, useState } from "react";
import { useApp, liveAvailability } from "@/lib/store";

export default function SocialProof() {
  const { s } = useApp();
  const [week, setWeek] = useState(0);
  useEffect(() => {
    const cut = Date.now() - 7 * 864e5;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeek(s.bookings.filter((b) => new Date(b.applied).getTime() >= cut).length);
  }, [s.bookings]);
  const { available, pctSold } = liveAvailability(s);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-ink shadow-sm backdrop-blur">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      {week > 0 ? <>🔥 {week} booked this week · </> : null}
      {available} homes left · {pctSold}% sold
    </span>
  );
}
