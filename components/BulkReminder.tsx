"use client";

import { useState } from "react";

export default function BulkReminder({ count }: { count: number }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setSent(true)}
        disabled={sent}
        className="btn btn-primary disabled:opacity-60"
      >
        {sent ? "Reminders sent ✓" : `Send WhatsApp reminder to ${count} defaulters`}
      </button>
      {sent && (
        <span className="text-[14px] text-body">
          {count} reminders queued on WhatsApp + SMS.
        </span>
      )}
    </div>
  );
}
