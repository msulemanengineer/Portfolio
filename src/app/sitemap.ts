import type { MetadataRoute } from "next";
import { engineering } from "@/content/engineering";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number]> = [
    ["", 1],
    ["/intelligence", 0.9],
    ["/engineering", 0.9],
    ["/about", 0.8],
    ["/lab", 0.7],
    ["/contact", 0.7],
  ];
  return [
    ...pages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: now, priority })),
    ...engineering.systems.map((s) => ({ url: `${SITE_URL}/work/${s.id}`, lastModified: now, priority: 0.6 })),
  ];
}
