import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CanonicalPageFrame from "@/components/CanonicalPageFrame";
import JsonLd from "@/components/JsonLd";
import { experiences, getExperienceBySlug } from "@/lib/mock-data";
import { breadcrumbJsonLd, experienceJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const experience = getExperienceBySlug((await params).slug);
  if (!experience) return {};
  const path = `/experience/${experience.slug}`;
  return {
    title: experience.title,
    description: experience.excerpt,
    alternates: { canonical: path },
    openGraph: { url: path, title: experience.title, description: experience.excerpt, images: [experience.coverImage] },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const experience = getExperienceBySlug((await params).slug);
  if (!experience) notFound();
  const path = `/experience/${experience.slug}`;
  return (
    <>
      <JsonLd data={[experienceJsonLd(experience), breadcrumbJsonLd([{ name: "نهان‌جا", path: "/" }, { name: "تجربه", path }])]} />
      <CanonicalPageFrame
        eyebrow="تجربهٔ نهان‌جا"
        title={experience.title}
        description={experience.excerpt}
        image={experience.coverImage}
        imageAlt={experience.title}
        openLayerHref={`/?layer=experience&slug=${experience.slug}`}
        facts={[{ label: "کتاب", value: experience.bookTitle }, { label: "جهان", value: experience.worldTitle }, { label: "زمان", value: experience.duration }]}
      >
        <p className="canonical-page__trace">«{experience.trace}»</p>
      </CanonicalPageFrame>
    </>
  );
}
