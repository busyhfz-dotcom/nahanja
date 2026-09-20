"use client";

import { useRef } from "react";
import { experiences, type Experience } from "@/lib/mock-data";
import ExperienceCard from "./ExperienceCard";

interface Props {
  onOpenExperience?: (exp: Experience) => void;
}

export default function FeaturedSection({ onOpenExperience }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const featured = experiences.filter((e) => e.featured);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[oklch(0.87_0.055_88)] md:text-xl">
            تجربه‌های منتخب
          </h2>
          <a
            href="#"
            className="text-xs font-bold text-[var(--gold)] transition hover:underline"
          >
            مشاهده همه &larr;
          </a>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[var(--border)] bg-[var(--glass-strong)] text-[var(--gold)] shadow-lg transition hover:bg-[var(--gold)] hover:text-[var(--ink)] md:grid"
            aria-label="بعدی"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[var(--border)] bg-[var(--glass-strong)] text-[var(--gold)] shadow-lg transition hover:bg-[var(--gold)] hover:text-[var(--ink)] md:grid"
            aria-label="قبلی"
          >
            <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-4 overflow-x-auto pb-4 md:gap-6"
          >
            {featured.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} onOpen={onOpenExperience} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
