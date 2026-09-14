import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: ["/experience/", "/book/", "/world/", "/collection/"], disallow: ["/api/", "/studio/", "/journey/"] }, sitemap: "/sitemap.xml" }; }
