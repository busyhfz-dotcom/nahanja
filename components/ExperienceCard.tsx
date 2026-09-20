"use client";

import type { Experience } from "@/lib/mock-data";

interface Props {
  experience: Experience;
  onOpen?: (exp: Experience) => void;
}

export default function ExperienceCard({ experience, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen?.(experience)}
      className="group relative flex w-[230px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-gradient-to-b from-[oklch(0.21_0.032_72/92%)] to-[oklch(0.17_0.026_70/95%)] text-right transition-all duration-300 hover:-translate-y-1 hover:border-[oklch(0.79_0.115_88/48%)] hover:shadow-[0_20px_50px_-12px_oklch(0_0_0/80%)] sm:w-[250px] md:w-[calc((100%-4.5rem)/4)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={experience.coverImage}
          alt={experience.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.17_0.026_70)] via-transparent to-transparent" />

        {/* Play icon */}
        <div className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full border border-[oklch(0.79_0.115_88/40%)] bg-[oklch(0_0_0/50%)] text-[var(--gold)] opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Duration */}
        <span className="absolute bottom-3 right-3 rounded-full bg-[oklch(0_0_0/60%)] px-2.5 py-1 text-[10px] text-[var(--gold-dim)] backdrop-blur-sm">
          {experience.duration}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3.5 text-right">
        <h3 className="line-clamp-2 text-sm font-bold leading-relaxed text-[oklch(0.87_0.055_88)]">
          {experience.title}
        </h3>
        <p className="text-[11px] text-[var(--gold-dim)]">
          {experience.subtitle}
        </p>
        {/* Tags */}
        <div className="mt-auto flex gap-2 pt-2">
          <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[9px] text-[var(--gold-dim)]">
            کتاب · {experience.bookTitle}
          </span>
          <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[9px] text-[var(--gold-dim)]">
            {experience.worldTitle}
          </span>
        </div>
      </div>
    </button>
  );
}
