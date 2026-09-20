"use client";

import { useEffect, useMemo, useState } from "react";
import InkIcon from "@/components/InkIcon";
import { findContent } from "@/lib/mock-data";
import type { LayerSelection } from "@/lib/layers";

const navLinks = [
  { label: "کشف", href: "#discover" },
  { label: "تجربه‌ها", href: "#experiences" },
  { label: "جهان‌ها", href: "#worlds" },
  { label: "مجموعه‌ها", href: "#collections" },
];

type HeaderProps = {
  onOpenLayer: (selection: LayerSelection) => void;
};

export default function Header({ onOpenLayer }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const matches = useMemo(() => findContent(query), [query]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 14);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const openFirstMatch = () => {
    const item = matches[0];
    if (!item) return;
    onOpenLayer({ kind: "experience", slug: item.slug });
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="site-header__inner">
        <a href="#top" className="brand-mark" aria-label="صفحهٔ اصلی نهان‌جا">
          <strong>نهان‌جا</strong>
          <span>Nahanja</span>
        </a>

        <nav className="header-nav" aria-label="ناوبری اصلی">
          {navLinks.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>

        <div className="header-actions">
          <div className="header-search" data-open={searchOpen}>
            <input
              aria-label="جست‌وجو در تجربه‌ها"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openFirstMatch();
                if (event.key === "Escape") setSearchOpen(false);
              }}
              placeholder="مثلاً سکوت یا خانه"
              autoFocus={searchOpen}
            />
          </div>
          <button className="header-icon" type="button" onClick={() => { setSearchOpen((value) => !value); setMobileOpen(false); }} aria-label="جست‌وجو">
            <InkIcon name="search" width={18} height={18} />
          </button>
          <a className="ink-outline hidden sm:inline-flex" href="#journey">مسیر من</a>
          <button className="header-icon mobile-menu" type="button" onClick={() => { setMobileOpen((value) => !value); setSearchOpen(false); }} aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}>
            <InkIcon name={mobileOpen ? "close" : "menu"} width={19} height={19} />
          </button>
        </div>
      </div>

      {(searchOpen || mobileOpen) && (
        <div className="mx-auto max-w-[1536px] px-5 pb-4 md:px-7">
          {searchOpen && (
            <div className="noise-card relative mt-2 max-w-md p-3">
              <p className="m-0 text-sm text-[var(--moss-bright)]">{query ? "نزدیک‌ترین مسیرها" : "با یک کلمه شروع کن"}</p>
              <div className="relative mt-2 grid gap-1">
                {matches.slice(0, 3).map((item) => (
                  <button key={item.id} type="button" onClick={() => { onOpenLayer({ kind: "experience", slug: item.slug }); setSearchOpen(false); }} className="flex items-center justify-between border-b border-[var(--line)] px-1 py-2 text-right text-[var(--paper-bright)] transition hover:text-[var(--acid)]">
                    <span>{item.title}</span><span className="text-[var(--moss-bright)]">↙</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {mobileOpen && (
            <nav className="noise-card relative mt-2 grid gap-1 p-3 md:hidden" aria-label="منوی موبایل">
              {navLinks.map((item) => <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="border-b border-[var(--line)] px-1 py-2 text-[var(--paper-bright)]">{item.label}</a>)}
            </nav>
          )}
        </div>
      )}
    </header>
  );
}
