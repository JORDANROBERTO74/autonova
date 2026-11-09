import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita que un package-lock.json en un directorio padre (p. ej. GitHub/) se tome como raíz del workspace.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
