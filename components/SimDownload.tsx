"use client";

import { useState } from "react";

export default function SimDownload({ label = "Download", className = "btn btn-tertiary" }: { label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "prep" | "done">("idle");
  return (
    <button
      type="button"
      disabled={state === "prep"}
      onClick={() => {
        setState("prep");
        setTimeout(() => setState("done"), 900);
        setTimeout(() => setState("idle"), 2600);
      }}
      className={`${className} disabled:opacity-70`}
    >
      {state === "idle" ? label : state === "prep" ? "Preparing…" : "Downloaded ✓"}
    </button>
  );
}
