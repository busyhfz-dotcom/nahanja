"use client";

import { moods } from "@/lib/mock-data";

export default function DiscoverySection() {
  return (
    <section id="discover" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section title */}
        <div className="mb-10 text-center">
          <h2 className="text-gold-gradient text-2xl font-extrabold md:text-3xl">
            امروز دنبال چه چیزی هستی؟
          </h2>
        </div>

        {/* Mood circles */}
        <div className="flex justify-center gap-4 overflow-x-auto pb-4 no-scrollbar sm:gap-6 md:gap-8 lg:gap-10">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className="group flex flex-shrink-0 flex-col items-center gap-3 transition"
            >
              {/* Circle image */}
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[var(--border)] transition-all duration-300 group-hover:border-[var(--gold)] group-hover:shadow-[0_0_24px_-4px_oklch(0.79_0.115_88/40%)] sm:h-24 sm:w-24 md:h-28 md:w-28">
                <img
                  src={mood.image}
                  alt={mood.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0_0_0/50%)] to-transparent" />
                {/* Emoji */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-90 md:text-3xl">
                  {mood.icon}
                </span>
              </div>
              {/* Label */}
              <span className="text-xs font-bold text-[var(--gold-dim)] transition group-hover:text-[var(--gold)] sm:text-sm">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
