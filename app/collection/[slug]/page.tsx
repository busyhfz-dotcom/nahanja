import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CanonicalPageFrame from "@/components/CanonicalPageFrame";
import JsonLd from "@/components/JsonLd";
import { collections, getCollectionBySlug } from "@/lib/mock-data";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collection = getCollectionBySlug((await params).slug);
  if (!collection) return {};
  const path = `/collection/${collection.slug}`;
  return { title: collection.title, description: collection.description, alternates: { canonical: path }, openGraph: { url: path, title: collection.title, description: collection.description, images: [collection.coverImage] } };
}

export default async function CollectionPage({ params }: PageProps) {
  const collection = getCollectionBySlug((await params).slug);
  if (!collection) notFound();
  const path = `/collection/${collection.slug}`;
  return (
    <>
      <JsonLd data={[collectionJsonLd(collection), breadcrumbJsonLd([{ name: "نهان‌جا", path: "/" }, { name: "مجموعه", path }])]} />
      <CanonicalPageFrame eyebrow="مجموعه" title={collection.title} description={collection.description} image={collection.coverImage} imageAlt={collection.title} openLayerHref={`/?layer=collection&slug=${collection.slug}`} facts={[{ label: "تعداد اثر", value: `${collection.itemsCount} اثر` }, { label: "یادداشت", value: collection.note }]} />
    </>
  );
}
