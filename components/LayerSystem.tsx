"use client";

import { useState } from "react";
import type { Experience } from "@/lib/mock-data";
import { books, worlds } from "@/lib/mock-data";

interface Props {
  experience: Experience | null;
  onClose: () => void;
}

type LayerView = "experience" | "book" | "world";

export default function LayerSystem({ experience, onClose }: Props) {
  const [currentView, setCurrentView] = useState<LayerView>("experience");
  const [history, setHistory] = useState<LayerView[]>([]);

  if (!experience) return null;

  const book = books.find((b) => b.title === experience.bookTitle) || books[0];
  const world = worlds.find((w) => w.title === experience.worldTitle) || worlds[0];

  const navigateTo = (view: LayerView) => {
    setHistory((prev) => [...prev, currentView]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentView(prev);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        className="absolute inset-0 border-0 bg-[oklch(0_0_0/70%)] backdrop-blur-[4px]"
        onClick={onClose}
        aria-label="بستن"
      />

      {/* Drawer */}
      <div className="relative mr-auto h-full w-full max-w-[480px] overflow-y-auto border-r border-[oklch(0.79_0.115_88/25%)] bg-[oklch(0.185_0.03_70/97%)] shadow-[0_0_80px_-10px_#000] md:max-w-[520px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[oklch(0.185_0.03_70/95%)] px-5 py-4 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={goBack}
              className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--gold-dim)] transition hover:border-[var(--gold-glow)] hover:text-[var(--gold)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            {/* Layer breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[var(--gold-dim)]">
              <button
                onClick={() => { setCurrentView("experience"); setHistory([]); }}
                className={`transition ${currentView === "experience" ? "text-[var(--gold)] font-bold" : "hover:text-[var(--gold)]"}`}
              >
                تجربه
              </button>
              {(currentView === "book" || currentView === "world") && (
                <>
                  <span className="text-[oklch(0.79_0.115_88/30%)]">/</span>
                  <button
                    onClick={() => { if (currentView !== "book") navigateTo("book"); }}
                    className={`transition ${currentView === "book" ? "text-[var(--gold)] font-bold" : "hover:text-[var(--gold)]"}`}
                  >
                    {currentView === "book" ? "کتاب" : "جهان"}
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--gold-dim)] transition hover:text-[var(--gold)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* ===== Experience View ===== */}
          {currentView === "experience" && (
            <div className="animate-fade-up">
              {/* Art */}
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[oklch(0.79_0.115_88/25%)]">
                <img
                  src={experience.coverImage}
                  alt={experience.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.185_0.03_70)] via-transparent to-transparent" />
                {/* Play button */}
                <button className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2 text-xs font-bold text-[var(--ink)] transition hover:shadow-[0_0_30px_-4px_oklch(0.79_0.115_88/60%)]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  شنیدن
                </button>
              </div>

              {/* Title */}
              <h3 className="mt-5 text-xl font-extrabold leading-relaxed text-[oklch(0.87_0.055_88)]">
                {experience.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--gold)]">
                {experience.author}
              </p>

              {/* Meta tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.mood.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] text-[var(--gold-dim)]"
                  >
                    {m === "calm" ? "آرامش" : m === "think" ? "فکر" : m === "imagine" ? "خیال" : m === "change" ? "تغییر" : m === "travel" ? "سفر" : "الهام"}
                  </span>
                ))}
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] text-[var(--gold-dim)]">
                  {experience.duration}
                </span>
              </div>

              {/* Description */}
              <p className="mt-5 text-xs leading-7 text-[var(--gold-dim)]">
                هر تجربه در نهان‌جا ترکیبی از متن، صدا، و فضاسازی است. گوش کن، بخوان، و اجازه بده جهانی جدید در تو باز شود. از کتاب فقط یک جمله آغاز می‌شود، اما مسیر تا جایی ادامه دارد که خودت بخواهی.
              </p>

              {/* Navigation to deeper layers */}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => navigateTo("book")}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.24_0.032_72/30%)] p-4 text-right transition hover:border-[oklch(0.79_0.115_88/40%)]"
                >
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border border-[oklch(0.79_0.115_88/30%)] bg-[oklch(0.79_0.115_88/10%)] text-[var(--gold)]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{book.title}</p>
                    <p className="text-[10px] text-[var(--gold-dim)]">
                      {book.author} · {book.chaptersCount} فصل
                    </p>
                  </div>
                  <svg className="h-4 w-4 flex-shrink-0 text-[var(--gold-dim)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={() => navigateTo("world")}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.24_0.032_72/30%)] p-4 text-right transition hover:border-[oklch(0.79_0.115_88/40%)]"
                >
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border border-[oklch(0.79_0.115_88/30%)] bg-[oklch(0.79_0.115_88/10%)] text-[var(--gold)]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <circle cx={12} cy={12} r={10} />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{world.title}</p>
                    <p className="text-[10px] text-[var(--gold-dim)]">
                      {world.booksCount} کتاب
                    </p>
                  </div>
                  <svg className="h-4 w-4 flex-shrink-0 text-[var(--gold-dim)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full rounded-full bg-[var(--gold)] py-3 text-sm font-extrabold text-[var(--ink)] transition hover:shadow-[0_0_30px_-4px_oklch(0.79_0.115_88/60%)]">
                  شنیدن کامل
                </button>
                <button className="w-full rounded-full border border-[oklch(0.79_0.115_88/50%)] bg-transparent py-3 text-sm font-extrabold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]">
                  بیشتر بخوان
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 rounded-full border border-[var(--border)] bg-transparent py-2.5 text-[11px] text-[var(--gold-dim)] transition hover:border-[oklch(0.79_0.115_88/40%)] hover:text-[var(--gold)]">
                    شنیدن نمونه
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Book View ===== */}
          {currentView === "book" && (
            <div className="animate-fade-up">
              <div className="relative aspect-[3/4] max-w-[200px] mx-auto overflow-hidden rounded-xl border border-[oklch(0.79_0.115_88/25%)]">
                <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-5 text-center text-xl font-extrabold">{book.title}</h3>
              <p className="mt-1 text-center text-xs text-[var(--gold)]">{book.author}</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--gold-dim)]">
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3 text-[var(--gold)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {book.rating}
                </span>
                <span>·</span>
                <span>{book.chaptersCount} فصل</span>
              </div>
              <p className="mt-5 text-xs leading-7 text-[var(--gold-dim)]">{book.description}</p>

              {/* Chapter list */}
              <div className="mt-8">
                <h4 className="mb-4 text-sm font-bold">فصل‌ها</h4>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: Math.min(5, book.chaptersCount) }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.24_0.032_72/20%)] p-3 transition hover:border-[oklch(0.79_0.115_88/30%)]"
                    >
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg border border-[oklch(0.79_0.115_88/30%)] bg-[oklch(0.79_0.115_88/10%)] text-[10px] font-bold text-[var(--gold)]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold">فصل {i + 1}</p>
                        <p className="text-[9px] text-[var(--gold-dim)]">
                          {Math.floor(Math.random() * 20 + 5)} دقیقه
                        </p>
                      </div>
                      <button className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(0.79_0.115_88/10%)] text-[var(--gold)]">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigateTo("world")}
                className="mt-6 flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[oklch(0.24_0.032_72/30%)] p-4 text-right transition hover:border-[oklch(0.79_0.115_88/40%)]"
              >
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border border-[oklch(0.79_0.115_88/30%)] bg-[oklch(0.79_0.115_88/10%)] text-[var(--gold)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <circle cx={12} cy={12} r={10} />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">رفتن به {world.title}</p>
                  <p className="text-[10px] text-[var(--gold-dim)]">{world.booksCount} کتاب در این جهان</p>
                </div>
                <svg className="h-4 w-4 flex-shrink-0 text-[var(--gold-dim)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </div>
          )}

          {/* ===== World View ===== */}
          {currentView === "world" && (
            <div className="animate-fade-up">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[oklch(0.79_0.115_88/25%)]">
                <img src={world.coverImage} alt={world.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.185_0.03_70)] via-transparent to-transparent" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{world.title}</h3>
              <p className="mt-1 text-xs text-[var(--gold)]">{world.booksCount} کتاب</p>
              <p className="mt-4 text-xs leading-7 text-[var(--gold-dim)]">{world.description}</p>

              {/* Books in this world */}
              <div className="mt-8">
                <h4 className="mb-4 text-sm font-bold">کتاب‌های این جهان</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {books.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-[oklch(0.24_0.032_72/30%)] p-2 transition hover:border-[oklch(0.79_0.115_88/40%)]"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-lg">
                        <img src={b.coverImage} alt={b.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 truncate text-[10px] font-bold">{b.title}</p>
                      <p className="truncate text-[8px] text-[var(--gold-dim)]">{b.author}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-6 w-full rounded-full border border-[oklch(0.79_0.115_88/50%)] bg-transparent py-3 text-sm font-bold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]">
                همه جهان‌ها &larr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
