"use client";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120b06] via-[#0a0705] to-[var(--ink)]" />

      {/* Radial warm glows */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[55vh] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,oklch(0.85_0.1_90/22%),transparent_70%)]" />
        <div className="absolute left-[18%] top-[52%] h-[50vh] w-[50vw] bg-[radial-gradient(circle,oklch(0.30_0.07_70/18%),transparent_55%)]" />
        <div className="absolute right-[18%] top-[45%] h-[50vh] w-[50vw] bg-[radial-gradient(circle,oklch(0.32_0.07_70/16%),transparent_55%)]" />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_35%,rgba(0,0,0,0.74)_100%)]" />

      {/* Dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <i
            key={i}
            className="absolute rounded-full bg-[var(--gold)] opacity-40 blur-[0.6px]"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${60 + Math.random() * 40}%`,
              animationDelay: `${Math.random() * 14}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
              animation: `dust-rise ${10 + Math.random() * 8}s linear ${Math.random() * 14}s infinite`,
              boxShadow: "0 0 8px 2px oklch(0.79 0.115 88 / 45%)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 pb-12 pt-20 text-center md:gap-10 lg:gap-12">
        {/* Cover Art */}
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
          {/* Glow behind image */}
          <div className="animate-glow-pulse absolute -inset-8 rounded-[48px] bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,oklch(0.79_0.115_88/16%),transparent_70%)]" />
          <img
            src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=900&h=600&fit=crop"
            alt="غار نهان‌جا"
            className="relative rounded-2xl shadow-[0_40px_90px_-20px_oklch(0_0_0/85%),0_0_70px_-8px_oklch(0.79_0.115_88/28%)]"
            loading="eager"
          />
          {/* Play button overlay */}
          <button className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[oklch(0.79_0.115_88/50%)] bg-[oklch(0_0_0/40%)] text-[var(--gold)] backdrop-blur-sm transition hover:scale-110 hover:bg-[oklch(0_0_0/60%)]">
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        {/* Copy */}
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-gold-gradient text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            جایی برای کشف
            <br />
            آنچه در تو زنده است
          </h1>
          <p className="max-w-md text-sm leading-8 text-[var(--gold-dim)] md:text-base">
            کتاب‌ها فقط آغاز ماجرا هستند.
          </p>

          {/* Waveform animation */}
          <div className="flex h-8 items-center justify-center gap-[3px] opacity-80">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="block w-[3px] rounded-full bg-[oklch(0.79_0.115_88/80%)]"
                style={{
                  height: "24px",
                  transformOrigin: "center",
                  animation: `wave 1.1s ease-in-out ${i * 0.06}s infinite`,
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button className="group relative mt-2 cursor-pointer rounded-full border border-[oklch(0.79_0.115_88/60%)] bg-[oklch(0.79_0.115_88/10%)] px-10 py-3.5 text-lg font-extrabold text-[var(--gold)] transition-all duration-300 hover:bg-[var(--gold)] hover:text-[var(--ink)] hover:shadow-[0_0_50px_-6px_oklch(0.79_0.115_88/70%)]">
            <span className="flex items-center gap-2">
              ورود به جهان نهان‌جا
              <svg className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--gold-dim)]">
          {["یک حس", "یک کتاب", "یک جهان", "یک کتاب", "یک مسیر شخصی"].map(
            (tag, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[oklch(0.79_0.115_88/30%)]">·</span>}
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
