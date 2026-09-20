"use client";

const dust = [
  { left: "14%", top: "66%", size: 2, delay: "1s", duration: "12s" },
  { left: "22%", top: "74%", size: 3, delay: "4s", duration: "14s" },
  { left: "32%", top: "61%", size: 2, delay: "2s", duration: "11s" },
  { left: "41%", top: "78%", size: 2, delay: "6s", duration: "13s" },
  { left: "52%", top: "68%", size: 3, delay: "3s", duration: "15s" },
  { left: "63%", top: "72%", size: 2, delay: "8s", duration: "12s" },
];

export default function HeroSection() {
  const enterDiscovery = () =>
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[690px] overflow-hidden border-b border-[var(--border)] bg-[#080705] pt-16 md:min-h-[740px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_14%_32%,oklch(0.43_0.08_76/22%),transparent_58%),radial-gradient(ellipse_56%_72%_at_78%_38%,oklch(0.2_0.035_70/36%),transparent_66%)]" />
      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(110deg,transparent_0%,rgba(255,232,182,.2)_48%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dust.map((particle) => (
          <i
            key={particle.left}
            className="absolute rounded-full bg-[var(--gold)] blur-[.4px]"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              animation: `dust-rise ${particle.duration} linear ${particle.delay} infinite`,
              boxShadow: "0 0 8px 2px oklch(0.79 0.115 88 / 42%)",
            }}
          />
        ))}
      </div>

      <div dir="ltr" className="relative mx-auto grid min-h-[624px] max-w-[1500px] items-stretch lg:grid-cols-[1.18fr_.82fr]">
        <div className="relative min-h-[420px] overflow-hidden lg:order-1 lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=88"
            alt="چشم‌انداز گرم و رازآلود نهان‌جا"
            className="absolute inset-0 h-full w-full object-cover object-[34%_50%] brightness-[.76] saturate-[.8]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,4,3,.12),rgba(6,5,3,.06)_38%,rgba(8,7,5,.95)_100%),linear-gradient(0deg,rgba(5,5,4,.86),transparent_44%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_48%,transparent_19%,rgba(0,0,0,.57)_83%)]" />
          <div className="absolute inset-x-5 bottom-6 hidden items-center justify-between border-t border-[oklch(0.79_0.115_88/30%)] pt-4 text-[11px] text-[var(--gold-dim)] lg:flex">
            <span>یک حس</span><span className="text-[var(--gold)]">—</span><span>یک کتاب</span><span className="text-[var(--gold)]">—</span><span>یک جهان</span><span className="text-[var(--gold)]">—</span><span>یک مسیر شخصی</span>
          </div>
        </div>

        <div dir="rtl" className="relative z-10 flex flex-col justify-center px-6 py-14 text-right sm:px-10 lg:order-2 lg:px-14 xl:px-20">
          <p className="mb-5 text-xs font-semibold tracking-[.2em] text-[var(--gold-dim)]">Nahanja / نهان‌جا</p>
          <h1 className="text-gold-gradient max-w-[560px] text-[clamp(2.8rem,5vw,5.75rem)] font-black leading-[1.23] tracking-[-.06em]">
            جایی برای کشف<br />آنچه در تو زنده است
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-[var(--gold-dim)] sm:text-base">
            کتاب‌ها فقط آغاز ماجرا هستند؛ از یک تصویر، صدا یا حس، به جهانی برس که برای تو ساخته شده است.
          </p>
          <button onClick={enterDiscovery} className="group mt-8 inline-flex w-fit items-center gap-4 rounded-full border border-[oklch(0.82_0.11_88/60%)] bg-[linear-gradient(135deg,oklch(0.94_0.08_88),oklch(0.76_0.14_75))] px-6 py-3 text-sm font-extrabold text-[#180e07] shadow-[0_12px_28px_-12px_oklch(0.79_0.115_88/70%)] transition hover:scale-[1.02] hover:shadow-[0_18px_35px_-10px_oklch(0.79_0.115_88/80%)]">
            ورود به جهان نهان‌جا
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
          </button>
          <div className="mt-11 flex items-center gap-3 text-[11px] text-[oklch(0.79_0.115_88/54%)] lg:hidden">
            <span>یک حس</span><span className="text-[var(--gold)]">—</span><span>یک کتاب</span><span className="text-[var(--gold)]">—</span><span>یک جهان</span>
          </div>
        </div>
      </div>
    </section>
  );
}
