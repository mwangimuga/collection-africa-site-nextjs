import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // Only tree-shake what we actually import from these, which noticeably cuts
  // dev compile time and production bundle size.
  experimental: {
    optimizePackageImports: ["@payloadcms/ui"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Legacy WordPress + old SPA URLs -> new structure. Add to this list as you
  // find 404s in Google Search Console.
  async redirects() {
    return [
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/services/credit-training", destination: "/services/credit-management-training", permanent: true },
      { source: "/services/county-revenue", destination: "/services/county-revenue-maximisation", permanent: true },
      { source: "/services/skip-tracing", destination: "/services/skip-tracing-and-investigation", permanent: true },
      { source: "/services/bulk-sms", destination: "/services/bulk-sms-communication", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
    ];
  },
};

// withPayload mounts the admin panel and its API inside this same app.
export default withPayload(nextConfig, { devBundleServerPackages: false });
