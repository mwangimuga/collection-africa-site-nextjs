import { Montserrat, Source_Serif_4 } from "next/font/google";

/**
 * Fonts are fetched from Google once, at build time, and then self-hosted by
 * Next from your own domain. No request goes to Google at runtime.
 *
 * On a slow connection that first fetch can add several seconds to a cold
 * `npm run dev`. It is cached in .next afterwards. If it is painful — or if
 * your build server has no outbound internet — switch to fully local files:
 * see docs/user-guide.md, "Making local development faster".
 */
export const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Cambria", "Georgia", "serif"],
  adjustFontFallback: true,
});

export const sans = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});
