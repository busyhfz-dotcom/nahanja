import Image from "next/image";
import InkIcon from "@/components/InkIcon";
import type { Experience } from "@/lib/mock-data";
import { canonicalHref } from "@/lib/layers";

type ExperienceCardProps = {
  experience: Experience;
  index: number;
  onOpen: (experience: Experience) => void;
};

export default function ExperienceCard({ experience, index, onOpen }: ExperienceCardProps) {
  return (
    <a
      className="experience-card"
      href={canonicalHref({ kind: "experience", slug: experience.slug })}
      onClick={(event) => { event.preventDefault(); onOpen(experience); }}
    >
      <Image className="experience-card__image" src={experience.coverImage} alt={experience.title} fill sizes="(max-width: 700px) 82vw, 344px" />
      <div className="experience-card__content">
        <span className="experience-card__index">ردّ {String(index + 1).padStart(2, "0")}</span>
        <span className="experience-card__play"><InkIcon name="play" width={17} height={17} /></span>
        <h3>{experience.title}</h3>
        <p>{experience.subtitle}</p>
        <div className="experience-card__meta"><span>{experience.worldTitle}</span><span>{experience.duration}</span></div>
      </div>
    </a>
  );
}
