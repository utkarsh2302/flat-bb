"use client";

import { useEffect, useState } from "react";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
}

export default function PlatformExtras() {
  const [scrolled, setScrolled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [installEvt, setInstallEvt] = useState<BIPEvent | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    const onOnline = () => setOffline(!navigator.onLine);
    const onInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BIPEvent);
    };
    onScroll();
    onOnline();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOnline);
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOnline);
      window.removeEventListener("beforeinstallprompt", onInstall);
    };
  }, []);

  return (
    <>
      {offline && (
        <div className="fixed inset-x-0 top-0 z-[70] bg-ink px-4 py-2 text-center text-[13px] font-medium text-on-primary">
          You&apos;re offline — showing your last-loaded data.
        </div>
      )}

      <div className="no-print fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
        {installEvt && (
          <button
            type="button"
            onClick={async () => { await installEvt.prompt(); setInstallEvt(null); }}
            className="btn btn-secondary !py-2 !px-3 !text-[13px] shadow-[var(--shadow-lux)]"
          >
            ⤓ Install app
          </button>
        )}
        {scrolled && (
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="press grid h-10 w-10 place-items-center rounded-full border border-line bg-canvas text-ink shadow-[var(--shadow-lux)]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path d="M9 14V4M4 9l5-5 5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </>
  );
}
