import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fully static site: `npm run build` writes a deployable folder to `out/`.
  output: "export",
  // No image server on static hosting; images in public/ are already compressed WebP.
  images: { unoptimized: true },
};

export default nextConfig;
