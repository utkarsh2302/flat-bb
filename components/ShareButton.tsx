"use client";

import { useState } from "react";

/** WhatsApp / native share for any artefact (unit, cost sheet, receipt…). */
export default function ShareButton({
  text,
  label = "Share on WhatsApp",
  className = "btn btn-tertiary",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const message = `${text}\n${url}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        // fall through to WhatsApp
      }
    }
    if (typeof window !== "undefined") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
      </svg>
      {copied ? "Opening WhatsApp…" : label}
    </button>
  );
}
