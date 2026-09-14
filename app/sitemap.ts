import type { MetadataRoute } from "next"; import { catalog, contentHref } from "../lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap { const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://nahanja.ir"; return [{ url: origin, lastModified: new Date() }, ...catalog.map((item) => ({ url: origin + contentHref(item), lastModified: new Date() }))]; }
