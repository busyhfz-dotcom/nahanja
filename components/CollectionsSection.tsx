"use client";

import { collections } from "@/lib/mock-data";

export default function CollectionsSection() {
  return (
    <section id="collections" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[oklch(0.87_0.055_88)] md:text-xl">
            مجموعه‌ها
          </h2>
          <a href="#" className="text-xs font-bold text-[var(--gold)] transition hover:underline">
            مشاهده همه &larr;
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <button
              key={col.id}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[oklch(0.21_0.032_72/92%)] to-[oklch(0.17_0.026_70/95%)] transition-all duration-300 hover:border-[oklch(0.79_0.115_88/40%)]"
            >
              <div className="relative aspect-[2/1] overflow-hidden">
                <img
                  src={col.coverImage}
                  alt={col.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.17_0.026_70)] via-[oklch(0.17_0.026_70/50%)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-right">
                  <h3 className="text-sm font-bold text-[oklch(0.87_0.055_88)]">
                    {col.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-[var(--gold-dim)]">
                    {col.description}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-[oklch(0.79_0.115_88/15%)] px-2.5 py-0.5 text-[9px] font-bold text-[var(--gold)]">
                    {col.itemsCount} اثر
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
