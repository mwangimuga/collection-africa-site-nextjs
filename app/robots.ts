import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Answer engines are a real traffic source now. Let them in.
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
