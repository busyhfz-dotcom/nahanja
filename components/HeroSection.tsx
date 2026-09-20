"use client";

import { motion } from "framer-motion";
import InkIcon from "@/components/InkIcon";
import type { LayerSelection } from "@/lib/layers";

type HeroSectionProps = { onOpenLayer: (selection: LayerSelection) => void };

export default function HeroSection({ onOpenLayer }: HeroSectionProps) {
  const discover = () => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section className="hero-atlas" aria-labelledby="home-title">
      <div className="hero-atlas__shell">
        <motion.aside className="hero-atlas__aside" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, ease: [0.22, 0.75, 0.22, 1] }}>
          <div className="hero-atlas__sigil" aria-hidden>ن</div>
          <div className="hero-atlas__aside-copy">
            <span className="section-kicker">اتاقِ آغاز</span>
            <p>این‌جا کتاب مقصد نیست؛ ردّی است که تو را به چیزی نزدیک‌تر می‌کند.</p>
          </div>
          <div className="hero-atlas__coordinates"><span>۰۱ / مدخل</span><span>۴۰° ۲۳′</span></div>
        </motion.aside>

        <div className="hero-atlas__main">
          <motion.p className="hero-atlas__index" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>نقشهٔ احساساتِ خواندنی / ۰۱</motion.p>
          <motion.h1 id="home-title" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.9, ease: [0.15, 0.85, 0.2, 1] }}>
            جایی برای کشف<br />آنچه در تو زنده است
          </motion.h1>
          <motion.p className="hero-atlas__subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }}>
            از یک حس شروع کن. نهان‌جا تصویر، صدا و روایت را کنار هم می‌چیند تا راهِ شخصیِ تو به کتاب باز شود.
          </motion.p>
          <motion.div className="hero-atlas__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}>
            <button type="button" className="ink-button" onClick={discover}>
              دنبال یک حس می‌گردم <InkIcon name="arrow" width={17} height={17} />
            </button>
            <button type="button" className="ink-outline" onClick={() => onOpenLayer({ kind: "experience", slug: "gahi-sokoot" })}>
              یک تجربه را باز کن <InkIcon name="play" width={15} height={15} />
            </button>
          </motion.div>
          <div className="hero-atlas__strata" aria-hidden />
        </div>
      </div>
      <div className="hero-atlas__footer"><span>احساس ← تجربه ← کنجکاوی ← کتاب</span><span>برای خواندنِ بیشتر، اول مکث کن.</span></div>
    </section>
  );
}
