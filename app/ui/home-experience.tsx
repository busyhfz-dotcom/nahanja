"use client";

import { useState } from "react";

type Layer = "experience" | "book" | "world" | null;

const featuredExperiences = [
  { title: "برای شب‌هایی که خواب نمی‌آید", feeling: "بی‌خوابی · آرامش", duration: "۳ دقیقه شنیدن", hue: "violet" },
  { title: "یک خانه، یک غیبت، یک نامه", feeling: "دلتنگی · خانه", duration: "۴ دقیقه خواندن", hue: "amber" },
  { title: "جایی میان ترس و شروع‌کردن", feeling: "تردید · شجاعت", duration: "۲ دقیقه شنیدن", hue: "blue" },
];

const worlds = ["خانه‌هایی که حرف می‌زنند", "تنهاییِ روشن", "شروع از نو", "شهر در مه"];

const layerCopy = {
  experience: { eyebrow: "تجربه", title: "برای شب‌هایی که خواب نمی‌آید", text: "صدایی کوتاه برای لحظه‌ای که ذهن، اتاق را ترک نمی‌کند." },
  book: { eyebrow: "کتاب مرتبط", title: "چراغ‌ها را من خاموش می‌کنم", text: "روایتی صمیمی از خانه، سکوت و چیزهایی که گفته نمی‌شوند." },
  world: { eyebrow: "جهان", title: "خانه‌هایی که حرف می‌زنند", text: "مسیرهایی از کتاب‌ها، صداها و تجربه‌هایی که بوی خانه دارند." },
};

export function HomeExperience() {
  const [layer, setLayer] = useState<Layer>(null);
  const active = layer ? layerCopy[layer] : null;

  return (
    <main>
      <nav className="nav" aria-label="ناوبری اصلی">
        <a className="wordmark" href="#entrance">نهان‌جا</a>
        <div className="nav-links"><a href="#experiences">کشف‌ها</a><a href="#worlds">جهان‌ها</a><a href="#voices">صداها</a></div>
        <button className="quiet-button">مسیر من</button>
      </nav>

      <section id="entrance" className="entrance">
        <div className="aurora" aria-hidden="true" />
        <p className="eyebrow">ورود به جهان کتاب</p>
        <h1>گاهی یک صدا،<br />آغازِ رسیدن به یک کتاب است.</h1>
        <p className="lede">نهان‌جا از احساس شروع می‌کند؛ از یک تصویر، یک مکث یا روایتی که شما را به کتابی نزدیک‌تر می‌کند.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#gateway">امشب چه حسی داری؟ <span>←</span></a>
          <button className="audio-button" onClick={() => setLayer("experience")}><span className="play-dot">▶</span> شنیدن یک لحظه</button>
        </div>
        <p className="scroll-note">برای کشف، آرام پایین بروید</p>
      </section>

      <section id="gateway" className="gateway section">
        <p className="eyebrow">دروازهٔ کشف</p>
        <h2>از کجا وارد شویم؟</h2>
        <div className="feeling-grid">
          {["دلم آرامش می‌خواهد", "چیزی رازآلود", "می‌خواهم شروع کنم", "دنبال یک صدای آشنا"].map((feeling, index) => (
            <button key={feeling} className={"feeling feeling-" + index} onClick={() => setLayer(index === 3 ? "experience" : "world")}>{feeling}<span>↙</span></button>
          ))}
        </div>
      </section>

      <section id="experiences" className="section experiences">
        <div className="section-heading"><div><p className="eyebrow">تجربه‌های منتخب</p><h2>پیش از انتخاب، کمی زندگی‌شان کنید.</h2></div><button className="text-button">همهٔ تجربه‌ها ←</button></div>
        <div className="experience-grid">
          {featuredExperiences.map((item, index) => <button className={"experience-card " + item.hue} key={item.title} onClick={() => setLayer(index === 1 ? "book" : "experience")}>
            <span className="card-number">۰{index + 1}</span><span className="sound-mark">◌</span><span className="card-copy"><small>{item.feeling}</small><strong>{item.title}</strong><em>{item.duration}</em></span>
          </button>)}
        </div>
      </section>

      <section id="worlds" className="section world-section">
        <p className="eyebrow">جهان‌ها</p><h2>مسیرهایی برای گم‌شدنِ خوب.</h2>
        <div className="world-list">{worlds.map((world, index) => <button key={world} onClick={() => setLayer("world")}><span>۰{index + 1}</span>{world}<i>←</i></button>)}</div>
      </section>

      <section id="voices" className="section voices">
        <div><p className="eyebrow">صداها</p><h2>بعضی کتاب‌ها، اول باید شنیده شوند.</h2><p>پیش‌نمایش‌ها و روایت‌های کوتاه؛ برای اینکه پیش از خواندن، با جهان یک کتاب نفس بکشید.</p></div>
        <button className="record" onClick={() => setLayer("experience")} aria-label="شنیدن روایت کوتاه"><span>▶</span><small>۰۲:۱۸</small></button>
      </section>

      <section className="section manifesto"><p>نهان‌جا کتابفروشی نیست. جایی‌ست برای آن لحظه‌ای که یک انسان، دوباره با کتاب ارتباط می‌گیرد.</p></section>

      {active && <div className="layer-backdrop" role="dialog" aria-modal="true" aria-label={active.eyebrow} onClick={() => setLayer(null)}>
        <article className="layer-panel" onClick={(event) => event.stopPropagation()}>
          <button className="layer-close" onClick={() => setLayer(null)} aria-label="بستن">×</button>
          <p className="eyebrow">{active.eyebrow}</p><h2>{active.title}</h2><p>{active.text}</p>
          <div className="layer-path"><button onClick={() => setLayer("experience")}>تجربه</button><span>←</span><button onClick={() => setLayer("book")}>کتاب</button><span>←</span><button onClick={() => setLayer("world")}>جهان</button></div>
          <button className="primary-button" onClick={() => setLayer(layer === "experience" ? "book" : "world")}>ادامهٔ کشف <span>←</span></button>
        </article>
      </div>}
    </main>
  );
}
