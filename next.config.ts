import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the trace root: a stray lockfile in a parent directory otherwise makes
  // Next guess the workspace root and warn on every build.
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  typescript: {
    // Type errors should fail the build. Kept explicit so nobody "fixes" a red
    // build by flipping this on.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
