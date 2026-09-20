import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CanonicalPageFrame from "@/components/CanonicalPageFrame";
import JsonLd from "@/components/JsonLd";
import { getWorldBySlug, worlds } from "@/lib/mock-data";
import { breadcrumbJsonLd, worldJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return worlds.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const world = getWorldBySlug((await params).slug);
  if (!world) return {};
  const path = `/world/${world.slug}`;
  return { title: world.title, description: world.description, alternates: { canonical: path }, openGraph: { url: path, title: world.title, description: world.description, images: [world.coverImage] } };
}

export default async function WorldPage({ params }: PageProps) {
  const world = getWorldBySlug((await params).slug);
  if (!world) notFound();
  const path = `/world/${world.slug}`;
  return (
    <>
      <JsonLd data={[worldJsonLd(world), breadcrumbJsonLd([{ name: "نهان‌جا", path: "/" }, { name: "جهان", path }])]} />
      <CanonicalPageFrame eyebrow="جهان" title={world.title} description={world.description} image={world.coverImage} imageAlt={world.title} openLayerHref={`/?layer=world&slug=${world.slug}`} facts={[{ label: "اتمسفر", value: world.atmosphere }, { label: "کتاب‌های پیوندخورده", value: `${world.booksCount} کتاب` }]} />
    </>
  );
}
