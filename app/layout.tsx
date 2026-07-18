import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import Toaster from "@/components/Toaster";
import ServiceWorker from "@/components/ServiceWorker";
import CommandPalette from "@/components/CommandPalette";
import PlatformExtras from "@/components/PlatformExtras";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Elegant editorial serif for display headings — the luxury voice.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trimurty — Expertly Crafted Premium Living in Jaipur",
  description:
    "Explore Trimurty's premium residences in Jaipur — live availability, honest all-in pricing, photo-verified construction, and reservations in minutes.",
  applicationName: "Trimurty",
  manifest: `${BASE}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Trimurty" },
  icons: { icon: `${BASE}/icon.svg`, apple: `${BASE}/icon.svg` },
};

export const viewport: Viewport = {
  themeColor: "#1c1917",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          {children}
          <Toaster />
          <CommandPalette />
          <PlatformExtras />
        </AppProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
