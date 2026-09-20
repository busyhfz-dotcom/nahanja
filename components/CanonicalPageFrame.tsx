import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type CanonicalPageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  openLayerHref: string;
  facts: Array<{ label: string; value: string }>;
  children?: ReactNode;
};

export default function CanonicalPageFrame({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  openLayerHref,
  facts,
  children,
}: CanonicalPageFrameProps) {
  return (
    <main className="canonical-page">
      <div className="canonical-page__grain" aria-hidden />
      <article className="canonical-page__sheet">
        <Link className="canonical-page__back" href="/">
          <span aria-hidden>→</span>
          بازگشت به نهان‌جا
        </Link>
        <div className="canonical-page__grid">
          <div className="canonical-page__copy">
            <p className="canonical-page__eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="canonical-page__description">{description}</p>
            <dl className="canonical-page__facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            {children}
            <Link className="canonical-page__open" href={openLayerHref}>
              باز کردن در لایهٔ نهان‌جا
              <span aria-hidden>↙</span>
            </Link>
          </div>
          <div className="canonical-page__art">
            <Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 43vw" priority />
            <span className="canonical-page__stamp" aria-hidden>نهان‌جا</span>
          </div>
        </div>
      </article>
    </main>
  );
}
