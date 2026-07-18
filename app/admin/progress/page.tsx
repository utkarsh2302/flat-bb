"use client";

import { PROGRESS_FEED, getTower } from "@/lib/data";
import MilestoneCertify from "@/components/MilestoneCertify";
import { Eyebrow } from "@/components/ui";

const CERT_TOWER = "T2";

export default function AdminProgress() {
  const tower = getTower(CERT_TOWER)!;
  const evidenceImages = PROGRESS_FEED.filter((p) => p.towerId === CERT_TOWER).map((p) => p.image).slice(0, 3);

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 sm:px-8">
      <Eyebrow>Trust flywheel · live</Eyebrow>
      <h1 className="t-serif-lg mt-2">Certify construction</h1>
      <p className="t-body-sm mt-2 text-body">
        A demand letter can&apos;t be raised until its milestone is certified with photo
        evidence. Certify a stage to auto-generate demands — they appear instantly in
        every booked buyer&apos;s Digital Khata.
      </p>
      <MilestoneCertify
        evidenceImages={evidenceImages.length ? evidenceImages : ["/images/kachnar-banner-1920.webp"]}
        towerName={tower.name}
      />
    </div>
  );
}
