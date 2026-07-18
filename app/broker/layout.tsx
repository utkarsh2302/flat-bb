import SiteHeader from "@/components/SiteHeader";

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader panel="broker" />
      <main className="flex-1">{children}</main>
    </>
  );
}
