import Image from "next/image";
import { collections } from "@/lib/mock-data";
import { canonicalHref, type LayerSelection } from "@/lib/layers";

type CollectionsSectionProps = { onOpenLayer: (selection: LayerSelection) => void };

export default function CollectionsSection({ onOpenLayer }: CollectionsSectionProps) {
  return (
    <section id="collections" className="collections-field" aria-labelledby="collections-title">
      <div className="collections-field__head">
        <div>
          <p className="section-kicker">مجموعه‌ها / کنار هم گذاشتنِ چند رد</p>
          <h2 id="collections-title" className="section-title">دفترهایی برای یک حسِ ادامه‌دار</h2>
        </div>
      </div>
      <div className="collections-grid">
        {collections.map((collection, index) => (
          <a key={collection.id} className="collection-card" href={canonicalHref({ kind: "collection", slug: collection.slug })} onClick={(event) => { event.preventDefault(); onOpenLayer({ kind: "collection", slug: collection.slug }); }}>
            <Image className="collection-card__image" src={collection.coverImage} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
            <div className="collection-card__copy">
              <span className="collection-card__count">پرونده {String(index + 1).padStart(2, "0")} / {collection.itemsCount} اثر</span>
              <h3>{collection.title}</h3>
              <p>{collection.note}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
