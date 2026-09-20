"use client";

import type { ReactNode } from "react";

const items: { label: string; href: string; icon: ReactNode }[] = [
  { label: "خانه", href: "#top", icon: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /> },
  { label: "کشف", href: "#discover", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></> },
  { label: "صداها", href: "#audio", icon: <><path d="M12 3v12" /><path d="M8 7v4M16 6v6M4 9v1M20 8v3" /></> },
  { label: "مسیر من", href: "#journey", icon: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21c.5-4 3-6 7-6s6.5 2 7 6" /></> },
];

export default function MobileDock() {
  return (
    <nav aria-label="ناوبری موبایل" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-[oklch(0.79_0.115_88/25%)] bg-[oklch(0.13_0.025_68/92%)] px-2 py-2 shadow-[0_18px_38px_-8px_rgba(0,0,0,.8)] backdrop-blur-xl md:hidden">
      {items.map((item) => (
        <a key={item.label} href={item.href} className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] text-[var(--gold-dim)] transition hover:bg-[oklch(0.79_0.115_88/10%)] hover:text-[var(--gold)]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">{item.icon}</svg>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
