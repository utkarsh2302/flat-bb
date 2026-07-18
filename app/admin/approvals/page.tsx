"use client";

import ApprovalsInbox from "@/components/ApprovalsInbox";
import { Eyebrow } from "@/components/ui";

export default function AdminApprovals() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-8 sm:px-8">
      <Eyebrow>One inbox</Eyebrow>
      <h1 className="t-serif-lg mt-2">Approvals</h1>
      <p className="t-body-sm mt-2 text-body">
        Discounts, refunds and milestone certifications — approve or reject in one place, every decision audit-logged.
      </p>
      <div className="mt-6">
        <ApprovalsInbox />
      </div>
    </div>
  );
}
