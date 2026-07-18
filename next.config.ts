import type { NextConfig } from "next";

// When building for GitHub Pages we produce a fully static export served from a
// repo sub-path. Locally (dev / `next start`) none of this applies.
const isPages = process.env.PAGES === "true";
const basePath = isPages ? "/flat-bb" : "";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  ...(isPages ? { output: "export", basePath, assetPrefix: `${basePath}/` } : {}),
  // expose the base path to the client (manifest / service worker registration)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
