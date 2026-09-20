export default function Footer() {
  return (
    <footer id="journey" className="border-t border-[var(--border)] bg-[var(--ink)] pb-32 pt-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-gold-gradient text-xl font-black">نَهان‌جا</h3>
            <p className="mt-2 max-w-xs text-xs leading-7 text-[var(--gold-dim)]">
              بیش از کتاب. یک تجربه عمیق‌تر از تو.
            </p>
            <p className="mt-4 text-[10px] text-[oklch(0.79_0.115_88/30%)]">
              More than Books. A Deeper You.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="mb-3 font-bold text-[oklch(0.87_0.055_88)]">محصول</h4>
              <ul className="space-y-2 text-[var(--gold-dim)]">
                <li><a href="#" className="transition hover:text-[var(--gold)]">کشف</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">جهان‌ها</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">مجموعه‌ها</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">صداها</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-bold text-[oklch(0.87_0.055_88)]">نهان‌جا</h4>
              <ul className="space-y-2 text-[var(--gold-dim)]">
                <li><a href="#" className="transition hover:text-[var(--gold)]">درباره ما</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">تماس</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">حریم خصوصی</a></li>
                <li><a href="#" className="transition hover:text-[var(--gold)]">قوانین</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-3 text-xs font-bold text-[oklch(0.87_0.055_88)]">
              عضویت در خبرنامه
            </h4>
            <p className="mb-3 text-[10px] text-[var(--gold-dim)]">
              هر هفته یک تجربه تازه، یک کتاب جدید
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs text-[oklch(0.87_0.055_88)] outline-none placeholder:text-[var(--gold-dim)] focus:border-[var(--gold-glow)]"
              />
              <button className="rounded-full bg-[var(--gold)] px-4 py-2 text-xs font-bold text-[var(--ink)] transition hover:shadow-[0_0_20px_-4px_oklch(0.79_0.115_88/60%)]">
                عضویت
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-[10px] text-[oklch(0.79_0.115_88/30%)]">
          تمامی حقوق محفوظ است &copy; نهان‌جا ۱۴۰۵
        </div>
      </div>
    </footer>
  );
}
