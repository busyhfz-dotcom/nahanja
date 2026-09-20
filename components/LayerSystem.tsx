"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import InkIcon, { type InkIconName } from "@/components/InkIcon";
import {
  books,
  collections,
  experiences,
  getBookBySlug,
  getBookForExperience,
  getCollectionBySlug,
  getExperienceBySlug,
  getWorldBySlug,
  getWorldForExperience,
  worlds,
} from "@/lib/mock-data";
import { canonicalHref, type LayerKind, type LayerSelection } from "@/lib/layers";

type LayerSystemProps = {
  selection: LayerSelection | null;
  onClose: () => void;
  onNavigate: (selection: LayerSelection) => void;
};

const labels: Record<LayerKind, string> = {
  experience: "تجربه",
  book: "کتاب",
  world: "جهان",
  collection: "مجموعه",
};

function LayerLink({ selection, title, caption, icon, onNavigate }: {
  selection: LayerSelection;
  title: string;
  caption: string;
  icon: InkIconName;
  onNavigate: (selection: LayerSelection) => void;
}) {
  return (
    <a className="layer-link" href={canonicalHref(selection)} onClick={(event) => { event.preventDefault(); onNavigate(selection); }}>
      <span className="layer-link__glyph"><InkIcon name={icon} width={19} height={19} /></span>
      <span><strong>{title}</strong><small>{caption}</small></span>
      <InkIcon name="arrow" width={17} height={17} />
    </a>
  );
}

function MiniCard({ selection, image, title, onNavigate }: { selection: LayerSelection; image: string; title: string; onNavigate: (selection: LayerSelection) => void }) {
  return (
    <a className="layer-panel__mini-card" href={canonicalHref(selection)} onClick={(event) => { event.preventDefault(); onNavigate(selection); }}>
      <Image src={image} alt={title} width={180} height={240} sizes="150px" />
      <span>{title}</span>
    </a>
  );
}

function ExperienceLayer({ slug, onNavigate }: { slug: string; onNavigate: (selection: LayerSelection) => void }) {
  const experience = getExperienceBySlug(slug) ?? experiences[0];
  const book = getBookForExperience(experience);
  const world = getWorldForExperience(experience);

  return (
    <>
      <p className="layer-panel__eyebrow">تجربه / {experience.duration}</p>
      <h2>{experience.title}</h2>
      <div className="layer-panel__facts">{experience.mood.map((mood) => <span key={mood}>{mood}</span>)}<span>{experience.author}</span></div>
      <p className="layer-panel__description">{experience.excerpt}</p>
      <p className="layer-panel__quote">«{experience.trace}»</p>
      <div className="layer-panel__links">
        <LayerLink selection={{ kind: "book", slug: book.slug }} title={book.title} caption={`${book.author} · ${book.chaptersCount} فصل`} icon="book" onNavigate={onNavigate} />
        <LayerLink selection={{ kind: "world", slug: world.slug }} title={world.title} caption={world.atmosphere} icon="world" onNavigate={onNavigate} />
      </div>
    </>
  );
}

function BookLayer({ slug, onNavigate }: { slug: string; onNavigate: (selection: LayerSelection) => void }) {
  const book = getBookBySlug(slug) ?? books[0];
  const experience = experiences.find((item) => item.bookSlug === book.slug) ?? experiences[0];
  const world = getWorldForExperience(experience);
  return (
    <>
      <div className="layer-panel__book-cover"><Image src={book.coverImage} alt={book.title} fill sizes="260px" /></div>
      <p className="layer-panel__eyebrow">کتاب / {book.year}</p>
      <h2>{book.title}</h2>
      <div className="layer-panel__facts"><span>{book.author}</span><span>{book.chaptersCount} فصل</span><span>امتیاز {book.rating}</span></div>
      <p className="layer-panel__description">{book.description}</p>
      <div className="layer-panel__links">
        <LayerLink selection={{ kind: "experience", slug: experience.slug }} title="ورود از یک تجربه" caption={experience.title} icon="sound" onNavigate={onNavigate} />
        <LayerLink selection={{ kind: "world", slug: world.slug }} title={world.title} caption="جهانِ مرتبط" icon="world" onNavigate={onNavigate} />
      </div>
    </>
  );
}

function WorldLayer({ slug, onNavigate }: { slug: string; onNavigate: (selection: LayerSelection) => void }) {
  const world = getWorldBySlug(slug) ?? worlds[0];
  const relatedExperiences = experiences.filter((item) => item.worldSlug === world.slug);
  const displayBooks = books.slice(0, 3);
  return (
    <>
      <p className="layer-panel__eyebrow">جهان / {world.atmosphere}</p>
      <h2>{world.title}</h2>
      <div className="layer-panel__facts"><span>{world.booksCount} کتاب پیوندخورده</span><span>در حال گسترش</span></div>
      <p className="layer-panel__description">{world.description}</p>
      <div className="layer-panel__links">
        {relatedExperiences.slice(0, 2).map((experience) => <LayerLink key={experience.id} selection={{ kind: "experience", slug: experience.slug }} title={experience.title} caption="ورود با یک تجربه" icon="sound" onNavigate={onNavigate} />)}
      </div>
      <div className="layer-panel__mini-grid">
        {displayBooks.map((book) => <MiniCard key={book.id} selection={{ kind: "book", slug: book.slug }} image={book.coverImage} title={book.title} onNavigate={onNavigate} />)}
      </div>
    </>
  );
}

function CollectionLayer({ slug, onNavigate }: { slug: string; onNavigate: (selection: LayerSelection) => void }) {
  const collection = getCollectionBySlug(slug) ?? collections[0];
  const displayBooks = books.slice(0, 3);
  return (
    <>
      <p className="layer-panel__eyebrow">مجموعه / {collection.itemsCount} اثر</p>
      <h2>{collection.title}</h2>
      <div className="layer-panel__facts"><span>پروندهٔ انتخابی</span><span>{collection.note}</span></div>
      <p className="layer-panel__description">{collection.description}</p>
      <div className="layer-panel__mini-grid">
        {displayBooks.map((book) => <MiniCard key={book.id} selection={{ kind: "book", slug: book.slug }} image={book.coverImage} title={book.title} onNavigate={onNavigate} />)}
      </div>
      <div className="layer-panel__links">
        <LayerLink selection={{ kind: "world", slug: worlds[0].slug }} title="ادامه در جهان تنهایی" caption="لایهٔ بعدی این مجموعه" icon="world" onNavigate={onNavigate} />
      </div>
    </>
  );
}

function getLayerArt(selection: LayerSelection) {
  if (selection.kind === "experience") return getExperienceBySlug(selection.slug)?.coverImage ?? experiences[0].coverImage;
  if (selection.kind === "book") return getBookBySlug(selection.slug)?.coverImage ?? books[0].coverImage;
  if (selection.kind === "world") return getWorldBySlug(selection.slug)?.coverImage ?? worlds[0].coverImage;
  return getCollectionBySlug(selection.slug)?.coverImage ?? collections[0].coverImage;
}

export default function LayerSystem({ selection, onClose, onNavigate }: LayerSystemProps) {
  useEffect(() => {
    if (!selection) return;
    const previous = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
    };
  }, [selection, onClose]);

  return (
    <AnimatePresence>
      {selection && (
        <>
          <motion.button className="layer-backdrop" type="button" aria-label="بستن لایه" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} />
          <div className="layer-shell">
            <motion.section
              className="layer-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="layer-title"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="layer-panel__art">
                <Image src={getLayerArt(selection)} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" priority />
                <span className="layer-panel__stamp">لایه</span>
              </div>
              <div className="layer-panel__body">
                <div className="layer-panel__top">
                  <div className="layer-panel__crumbs">
                    <button type="button" data-active={selection.kind === "experience"} onClick={() => onNavigate({ kind: "experience", slug: experiences[0].slug })}>تجربه</button>
                    <span>·</span>
                    <button type="button" data-active={selection.kind === "book"} onClick={() => onNavigate({ kind: "book", slug: books[0].slug })}>کتاب</button>
                    <span>·</span>
                    <button type="button" data-active={selection.kind === "world"} onClick={() => onNavigate({ kind: "world", slug: worlds[0].slug })}>جهان</button>
                    <span>·</span>
                    <button type="button" data-active={selection.kind === "collection"} onClick={() => onNavigate({ kind: "collection", slug: collections[0].slug })}>مجموعه</button>
                  </div>
                  <button type="button" className="layer-panel__close" onClick={onClose} aria-label="بستن"><InkIcon name="close" width={18} height={18} /></button>
                </div>
                <motion.div key={`${selection.kind}:${selection.slug}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <span className="sr-only" id="layer-title">{labels[selection.kind]}</span>
                  {selection.kind === "experience" && <ExperienceLayer slug={selection.slug} onNavigate={onNavigate} />}
                  {selection.kind === "book" && <BookLayer slug={selection.slug} onNavigate={onNavigate} />}
                  {selection.kind === "world" && <WorldLayer slug={selection.slug} onNavigate={onNavigate} />}
                  {selection.kind === "collection" && <CollectionLayer slug={selection.slug} onNavigate={onNavigate} />}
                </motion.div>
              </div>
            </motion.section>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
