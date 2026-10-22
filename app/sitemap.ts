import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/cms";
import { absolute } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getPosts()]);
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absolute("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: absolute("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absolute("/careers"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absolute("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absolute("/ethics"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absolute("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absolute("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: absolute(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absolute(`/insights/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...core, ...servicePages, ...postPages];
}
