"use client";

import { useMemo, useRef } from "react";
import InkIcon from "@/components/InkIcon";
import ExperienceCard from "@/components/ExperienceCard";
import { experiences, type Experience, type MoodId } from "@/lib/mock-data";
import type { LayerSelection } from "@/lib/layers";

type FeaturedSectionProps = {
  selectedMood: MoodId;
  onOpenLayer: (selection: LayerSelection) => void;
};

export default function FeaturedSection({ selectedMood, onOpenLayer }: FeaturedSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = useMemo(() => {
    const selected = experiences.filter((item) => item.featured && item.mood.includes(selectedMood));
    const rest = experiences.filter((item) => item.featured && !item.mood.includes(selectedMood));
    return [...selected, ...rest];
  }, [selectedMood]);

  const scroll = (direction: number) => scrollRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  const openExperience = (experience: Experience) => onOpenLayer({ kind: "experience", slug: experience.slug });

  return (
    <section id="experiences" className="experience-rail" aria-labelledby="experience-title">
      <div className="experience-rail__head">
        <div>
          <p className="section-kicker">تجربه‌ها / بخشِ قابلِ لمسِ یک کتاب</p>
          <h2 id="experience-title" className="section-title">ردهایی برای ادامه دادن</h2>
          <p>این چیدمان با حس انتخابی تو جابه‌جا می‌شود.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button type="button" className="header-icon" aria-label="کارت قبلی" onClick={() => scroll(1)}><InkIcon name="arrow" width={18} height={18} /></button>
          <button type="button" className="header-icon" aria-label="کارت بعدی" onClick={() => scroll(-1)}><InkIcon name="arrow" className="rotate-180" width={18} height={18} /></button>
        </div>
      </div>
      <div className="experience-rail__viewport">
        <div ref={scrollRef} className="experience-rail__scroll">
          {featured.map((experience, index) => <ExperienceCard key={experience.id} experience={experience} index={index} onOpen={openExperience} />)}
        </div>
      </div>
    </section>
  );
}
