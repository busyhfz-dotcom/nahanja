import type { MetadataRoute } from "next";
import { collections, experiences, books, worlds } from "@/lib/mock-data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date("2026-09-20T00:00:00.000Z");
  const staticRoutes = ["/"];
  const contentRoutes = [
    ...experiences.map((item) => `/experience/${item.slug}`),
    ...books.map((item) => `/book/${item.slug}`),
    ...worlds.map((item) => `/world/${item.slug}`),
    ...collections.map((item) => `/collection/${item.slug}`),
  ];

  return [...staticRoutes, ...contentRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified: updatedAt,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
