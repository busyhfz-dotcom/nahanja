import Image from "next/image";
import InkIcon from "@/components/InkIcon";
import { worlds } from "@/lib/mock-data";
import { canonicalHref, type LayerSelection } from "@/lib/layers";

type WorldsSectionProps = { onOpenLayer: (selection: LayerSelection) => void };

export default function WorldsSection({ onOpenLayer }: WorldsSectionProps) {
  return (
    <section id="worlds" className="worlds-field" aria-labelledby="worlds-title">
      <div className="worlds-field__head">
        <div>
          <p className="section-kicker">جهان‌ها / حال‌وهوایی که کتاب‌ها در آن نفس می‌کشند</p>
          <h2 id="worlds-title" className="section-title">هر جهان یک درِ دیگر است</h2>
        </div>
        <span className="hidden text-[var(--moss-bright)] sm:block">چهار اتمسفر برای شروع</span>
      </div>
      <div className="worlds-grid">
        {worlds.map((world) => (
          <a key={world.id} className="world-card" href={canonicalHref({ kind: "world", slug: world.slug })} onClick={(event) => { event.preventDefault(); onOpenLayer({ kind: "world", slug: world.slug }); }}>
            <Image src={world.coverImage} alt={world.title} fill sizes="(max-width: 900px) 50vw, 35vw" />
            <div className="world-card__copy">
              <h3>{world.title}</h3>
              <p>{world.description}</p>
              <span>{world.atmosphere} <InkIcon name="arrow" className="inline-block align-middle" width={13} height={13} /></span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
