"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { experiences, moods, type MoodId } from "@/lib/mock-data";
import type { LayerSelection } from "@/lib/layers";

type DiscoverySectionProps = {
  selectedMood: MoodId;
  onSelectMood: (mood: MoodId) => void;
  onOpenLayer: (selection: LayerSelection) => void;
};

export default function DiscoverySection({ selectedMood, onSelectMood, onOpenLayer }: DiscoverySectionProps) {
  const selected = moods.find((mood) => mood.id === selectedMood) ?? moods[0];
  const nextExperience = experiences.find((experience) => experience.mood.includes(selectedMood)) ?? experiences[0];

  return (
    <section id="discover" className="discovery-map" aria-labelledby="discovery-title">
      <div className="discovery-map__inner">
        <div className="discovery-map__intro">
          <p className="section-kicker">دروازهٔ کشف / از بیرون به درون</p>
          <h2 id="discovery-title" className="section-title">امروز دنبال<br />چه چیزی هستی؟</h2>
          <p>{selected.sentence}</p>
          <div className="discovery-map__selected">اکنون: <strong>{selected.label}</strong></div>
          <button type="button" className="ink-outline" onClick={() => onOpenLayer({ kind: "experience", slug: nextExperience.slug })}>
            باز کردن یک ردّ مرتبط <span aria-hidden>↙</span>
          </button>
        </div>

        <div className="discovery-map__orbital" aria-label="مسیرهای کشف">
          {moods.map((mood, index) => (
            <motion.button
              type="button"
              key={mood.id}
              className="mood-orb"
              data-active={selectedMood === mood.id}
              onClick={() => onSelectMood(mood.id)}
              aria-pressed={selectedMood === mood.id}
              initial={{ opacity: 0, scale: 0.74 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Image src={mood.image} alt="" fill sizes="140px" />
              <span>{mood.icon}</span>
              <small>{mood.label}</small>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
