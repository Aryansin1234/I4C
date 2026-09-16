import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: false,  // prevents double-invoke that breaks GSAP/DOM libs
  basePath: isProd ? "/I4C" : "",
  assetPrefix: isProd ? "/I4C/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
