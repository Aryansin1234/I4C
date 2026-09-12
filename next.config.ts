import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // Repo name on GitHub — changes asset paths to /I4C-Website/...
  basePath: isProd ? "/I4C-Website" : "",
  assetPrefix: isProd ? "/I4C-Website/" : "",
  images: {
    unoptimized: true, // required for static export
  },
  trailingSlash: true,
};

export default nextConfig;
