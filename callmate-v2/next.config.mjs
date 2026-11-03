/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Brand assets are public and may be loaded cross-origin (press kit, app-store forms).
  async headers() {
    return [{ source: "/brand/:path*", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }, { key: "Cache-Control", value: "public, max-age=86400" }] }];
  },
};

export default nextConfig;
