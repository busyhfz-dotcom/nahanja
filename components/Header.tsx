"use client";

import { useState } from "react";

const navLinks = [
  { label: "مجموعه‌ها", href: "#collections" },
  { label: "صداها", href: "#audio" },
  { label: "جهان‌ها", href: "#worlds" },
  { label: "کشف", href: "#discover" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[var(--border)] bg-[var(--glass-strong)] backdrop-blur-xl">
      <div dir="ltr" className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-4 md:px-6 lg:h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2" aria-label="صفحهٔ اصلی نهان‌جا">
          <span className="text-gold-gradient text-xl font-black tracking-tight lg:text-2xl">
            نَهان‌جا
          </span>
          <span dir="ltr" className="hidden text-[10px] tracking-[.22em] text-[var(--gold-dim)] sm:block">
            Nahanja
          </span>
        </a>

        {/* Desktop Nav */}
        <nav dir="rtl" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-[var(--gold-dim)] transition-colors hover:bg-[oklch(0.79_0.115_88/10%)] hover:text-[var(--gold)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div dir="rtl" className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-transparent text-[var(--gold-dim)] transition hover:border-[var(--gold-glow)] hover:text-[var(--gold)]"
            aria-label="جستجو"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Auth Buttons - Desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <button className="rounded-full border border-[oklch(0.79_0.115_88/50%)] bg-transparent px-4 py-1.5 text-xs font-bold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]">
              ورود / ثبت‌نام
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.79_0.115_88/15%)] text-[var(--gold)]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--gold-dim)] md:hidden"
            aria-label="منو"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--glass-strong)] px-4 py-3">
          <div className="relative mx-auto max-w-lg">
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold-dim)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="جستجو در کتاب‌ها، تجربه‌ها، جهان‌ها..."
              className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] py-2.5 pe-4 ps-10 text-sm text-[oklch(0.87_0.055_88)] outline-none placeholder:text-[var(--gold-dim)] focus:border-[var(--gold-glow)]"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-[var(--border)] bg-[var(--glass-strong)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm text-[var(--gold-dim)] transition hover:bg-[oklch(0.79_0.115_88/10%)] hover:text-[var(--gold)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              <button className="w-full rounded-full border border-[oklch(0.79_0.115_88/50%)] bg-transparent py-2.5 text-sm font-bold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--ink)]">
                ورود / ثبت‌نام
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
