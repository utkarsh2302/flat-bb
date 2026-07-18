import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="t-eyebrow text-primary">Trimurty</p>
        <h1 className="t-hero mt-4">404</h1>
        <p className="t-body-lg mt-3 max-w-sm text-body">
          This page has moved on — but your next home hasn&apos;t. Let&apos;s get you back.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary btn-lg">Back home</Link>
          <Link href="/explore" className="btn btn-tertiary btn-lg">Explore homes</Link>
        </div>
      </div>
    </main>
  );
}
