/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
