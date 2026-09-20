"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type EntranceGateProps = { onEnter: () => void };

const specks = [
  [14, 24], [23, 70], [34, 18], [41, 80], [53, 16], [67, 73], [76, 29], [86, 57], [90, 14], [8, 83],
];

export default function EntranceGate({ onEnter }: EntranceGateProps) {
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    };
  }, []);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    leaveTimer.current = window.setTimeout(onEnter, 700);
  };

  return (
    <motion.section
      className="entrance-gate"
      aria-label="ورود به نهان‌جا"
      initial={{ opacity: 0 }}
      animate={leaving ? { opacity: 0, clipPath: "circle(0% at 50% 50%)" } : { opacity: 1 }}
      transition={{ duration: leaving ? 0.7 : 0.5, ease: [0.22, 0.8, 0.2, 1] }}
    >
      <motion.div
        className="entrance-gate__art"
        initial={{ scale: 1.14, opacity: 0 }}
        animate={leaving ? { scale: 1.32, opacity: 0 } : { scale: 1.05, opacity: 1 }}
        transition={{ duration: leaving ? 0.7 : 1.4, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <div className="entrance-gate__wash" />
      <div className="entrance-gate__frame" aria-hidden />
      {specks.map(([left, top], index) => (
        <motion.i
          key={`${left}-${top}`}
          aria-hidden
          style={{ position: "absolute", left: `${left}%`, top: `${top}%`, width: 3, height: 3, borderRadius: 99, background: "#dae6b4" }}
          animate={{ opacity: [0.15, 0.75, 0.15], scale: [0.7, 1.35, 0.7] }}
          transition={{ duration: 2.4 + (index % 3) * 0.6, delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="entrance-gate__content">
        <motion.p className="entrance-gate__annotation" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.7 }}>
          نَهان‌جا / مدخلِ یک جهانِ پنهان
        </motion.p>
        <motion.button
          type="button"
          className="entrance-gate__discover"
          onClick={enter}
          aria-label="کشف؛ ورود به نهان‌جا"
          initial={{ scale: 0.74, rotate: -8, opacity: 0 }}
          animate={leaving ? { scale: 1.34, rotate: 8, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: leaving ? 0 : 0.2, duration: leaving ? 0.65 : 0.92, ease: [0.18, 0.9, 0.25, 1] }}
          whileTap={{ scale: 0.93 }}
        >
          کشف
        </motion.button>
        <motion.p className="entrance-gate__hint" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          از یک تصویر وارد شو؛ شاید به یک کتاب برسی.
        </motion.p>
      </div>
      <span className="entrance-gate__corner entrance-gate__corner--right">۳۵° ۴۲′ N</span>
      <span className="entrance-gate__corner entrance-gate__corner--left">نظربان‌جا / ۰۱</span>
    </motion.section>
  );
}
