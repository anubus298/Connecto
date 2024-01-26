const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ekfltxjgxftrkugxgflm.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
