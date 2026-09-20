"use client";

import { worlds } from "@/lib/mock-data";

export default function WorldsSection() {
  return (
    <section id="worlds" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[oklch(0.87_0.055_88)] md:text-xl">
            جهان‌ها
          </h2>
          <a href="#" className="text-xs font-bold text-[var(--gold)] transition hover:underline">
            همه جهان‌ها &larr;
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {worlds.map((world) => (
            <button
              key={world.id}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[oklch(0.21_0.032_72/92%)] to-[oklch(0.17_0.026_70/95%)] transition-all duration-300 hover:border-[oklch(0.79_0.115_88/40%)] hover:shadow-[0_20px_50px_-12px_oklch(0_0_0/80%)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={world.coverImage}
                  alt={world.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.17_0.026_70)] via-[oklch(0.17_0.026_70/40%)] to-transparent" />
              </div>
              <div className="p-4 text-right">
                <h3 className="text-sm font-bold text-[oklch(0.87_0.055_88)]">{world.title}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[var(--gold-dim)]">
                  {world.description}
                </p>
                <span className="mt-2 inline-block rounded-full border border-[var(--border)] px-2 py-0.5 text-[9px] text-[var(--gold-dim)]">
                  {world.booksCount} کتاب
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
