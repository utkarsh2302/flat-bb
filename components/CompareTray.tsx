"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";

/** Floating "compare your saved flats" tray — buyer-only, avoids the unit
    page's sticky reserve bar. */
export default function CompareTray() {
  const pathname = usePathname();
  const { s } = useApp();
  const count = s.shortlist.length;
  if (count < 2) return null;
  if (pathname.startsWith("/unit") || pathname.startsWith("/compare") || pathname.startsWith("/broker") || pathname.startsWith("/admin")) return null;

  const href = `/compare?u=${s.shortlist.slice(0, 3).join(",")}`;
  return (
    <div className="no-print fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <Link href={href} className="menu-pop flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-on-primary shadow-[var(--shadow-lux)]">
        <span className="text-[14px] font-semibold">Compare {Math.min(count, 3)} saved flat{count > 1 ? "s" : ""}</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[12px] font-bold">{count}</span>
        <span className="text-[14px]">→</span>
      </Link>
    </div>
  );
}
