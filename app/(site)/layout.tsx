import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CompareTray from "@/components/CompareTray";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader panel="client" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CompareTray />
    </>
  );
}
