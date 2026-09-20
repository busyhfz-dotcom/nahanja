import type { Collection, Experience, World, Book } from "@/lib/mock-data";

export const siteConfig = {
  name: "نهان‌جا",
  description:
    "نهان‌جا از حس، تصویر و صدا شروع می‌کند تا مسیر شخصی هر انسان به کتاب را باز کند.",
  url: "https://nahanja.vercel.app",
  locale: "fa_IR",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "fa-IR",
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/images/nazar-ban-ja.webp"),
    description: siteConfig.description,
  };
}

export function experienceJsonLd(experience: Experience) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: experience.title,
    headline: experience.title,
    description: experience.excerpt,
    image: experience.coverImage,
    inLanguage: "fa-IR",
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    about: experience.mood,
    url: absoluteUrl(`/experience/${experience.slug}`),
  };
}

export function bookJsonLd(book: Book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    description: book.description,
    image: book.coverImage,
    inLanguage: "fa-IR",
    url: absoluteUrl(`/book/${book.slug}`),
  };
}

export function worldJsonLd(world: World) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: world.title,
    description: world.description,
    image: world.coverImage,
    inLanguage: "fa-IR",
    url: absoluteUrl(`/world/${world.slug}`),
  };
}

export function collectionJsonLd(collection: Collection) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    image: collection.coverImage,
    inLanguage: "fa-IR",
    url: absoluteUrl(`/collection/${collection.slug}`),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
