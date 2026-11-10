import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prevent a parent package-lock.json (e.g. GitHub/) from being treated as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
