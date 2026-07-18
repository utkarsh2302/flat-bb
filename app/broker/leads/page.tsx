"use client";

import BrokerLeads from "@/components/BrokerLeads";
import { Eyebrow } from "@/components/ui";

export default function BrokerLeadsPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8">
      <Eyebrow>Pipeline</Eyebrow>
      <h1 className="t-serif-lg mt-2">My leads</h1>
      <p className="t-body-sm mt-2 text-body">Tag clients to protect them, book site visits, and reserve on their behalf.</p>
      <div className="mt-6">
        <BrokerLeads />
      </div>
    </div>
  );
}
