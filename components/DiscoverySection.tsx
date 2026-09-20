"use client";

import { moods } from "@/lib/mock-data";

export default function DiscoverySection() {
  return (
    <section id="discover" className="relative overflow-hidden bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,oklch(0.25_0.04_70/30%),transparent_65%)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section title */}
        <div className="mb-10 text-center">
          <h2 className="text-gold-gradient text-2xl font-extrabold md:text-3xl">
            امروز دنبال چه چیزی هستی؟
          </h2>
        </div>

        {/* Mood circles */}
        <div className="flex justify-center gap-5 overflow-x-auto pb-4 no-scrollbar sm:gap-7 md:gap-9 lg:gap-11">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className="group flex flex-shrink-0 flex-col items-center gap-3 transition"
            >
              {/* Circle image */}
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[oklch(0.79_0.115_88/45%)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--gold)] group-hover:shadow-[0_0_24px_-4px_oklch(0.79_0.115_88/40%)] sm:h-20 sm:w-20 md:h-[88px] md:w-[88px]">
                <img
                  src={mood.image}
                  alt={mood.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_10%,rgba(0,0,0,.38)_100%)]" />
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
