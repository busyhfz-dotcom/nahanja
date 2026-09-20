import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CanonicalPageFrame from "@/components/CanonicalPageFrame";
import JsonLd from "@/components/JsonLd";
import { books, getBookBySlug } from "@/lib/mock-data";
import { bookJsonLd, breadcrumbJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = getBookBySlug((await params).slug);
  if (!book) return {};
  const path = `/book/${book.slug}`;
  return { title: book.title, description: book.description, alternates: { canonical: path }, openGraph: { url: path, title: book.title, description: book.description, images: [book.coverImage] } };
}

export default async function BookPage({ params }: PageProps) {
  const book = getBookBySlug((await params).slug);
  if (!book) notFound();
  const path = `/book/${book.slug}`;
  return (
    <>
      <JsonLd data={[bookJsonLd(book), breadcrumbJsonLd([{ name: "نهان‌جا", path: "/" }, { name: "کتاب", path }])]} />
      <CanonicalPageFrame eyebrow="کتاب" title={book.title} description={book.description} image={book.coverImage} imageAlt={book.title} openLayerHref={`/?layer=book&slug=${book.slug}`} facts={[{ label: "نویسنده", value: book.author }, { label: "فصل", value: `${book.chaptersCount} فصل` }, { label: "سال", value: book.year }]} />
    </>
  );
}
