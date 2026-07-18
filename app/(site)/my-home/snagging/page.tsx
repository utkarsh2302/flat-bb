"use client";

import SnaggingBoard from "@/components/SnaggingBoard";
import { BackLink, Eyebrow } from "@/components/ui";
import { useApp, primaryBooking } from "@/lib/store";

export default function SnaggingPage() {
  const { s } = useApp();
  const booking = primaryBooking(s);

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 sm:px-8">
      <BackLink href="/my-home">My Home</BackLink>
      <Eyebrow>Possession</Eyebrow>
      <h1 className="t-serif-lg mt-2">Snagging checklist</h1>
      <p className="t-body-sm mt-2 text-body">
        Walk your home room by room. Snap a photo of anything to fix — we track it to
        rectification and re-inspection, then you sign off.
      </p>
      <div className="mt-6">
        {booking ? (
          <SnaggingBoard bookingId={booking.id} />
        ) : (
          <p className="rounded-lg bg-canvas-soft p-5 text-[15px] text-body">Reserve a home to start your snag list.</p>
        )}
      </div>
    </div>
  );
}
