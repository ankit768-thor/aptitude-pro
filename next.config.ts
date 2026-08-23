import type { NextConfig } from "next";

// Static export for GitHub Pages, served at /aptitude-pro/.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/aptitude-pro",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
