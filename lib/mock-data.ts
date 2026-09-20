// Content fixtures are deliberately shaped like the future content graph.
// They keep the prototype deterministic while Prisma/API content is connected.

export type MoodId = "calm" | "think" | "imagine" | "change" | "travel" | "inspire";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  bookTitle: string;
  bookSlug: string;
  worldTitle: string;
  worldSlug: string;
  coverImage: string;
  duration: string;
  mood: MoodId[];
  featured: boolean;
  excerpt: string;
  trace: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  description: string;
  rating: number;
  chaptersCount: number;
  year: string;
}

export interface World {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  booksCount: number;
  atmosphere: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  itemsCount: number;
  note: string;
}

export interface MoodCategory {
  id: MoodId;
  label: string;
  icon: string;
  image: string;
  sentence: string;
}

export const moods: MoodCategory[] = [
  { id: "calm", label: "آرام گرفتن", icon: "≈", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", sentence: "برای مکث‌هایی که می‌خواهی آرام‌تر نفس بکشی." },
  { id: "think", label: "فکر کردن", icon: "◌", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", sentence: "برای پرسش‌هایی که هنوز جواب روشنی ندارند." },
  { id: "imagine", label: "خیال", icon: "✦", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop", sentence: "برای قدم گذاشتن به بیرون از واقعیت روزمره." },
  { id: "change", label: "تغییر", icon: "↺", image: "https://images.unsplash.com/photo-1495482432709-15807c8b3e2b?w=400&h=400&fit=crop", sentence: "برای لحظه‌ای که می‌دانی چیزی باید جابه‌جا شود." },
  { id: "travel", label: "سفر", icon: "⌁", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop", sentence: "برای وقتی که دلت یک افق تازه می‌خواهد." },
  { id: "inspire", label: "الهام", icon: "✺", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop", sentence: "برای جرقه‌ای که حرکت بعدی را روشن می‌کند." },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    slug: "gahi-sokoot",
    title: "گاهی سکوت بلندترین پاسخ است",
    subtitle: "شازده کوچولو · آنتوان دوسنت اگزوپری",
    author: "آنتوان دوسنت اگزوپری",
    bookTitle: "شازده کوچولو",
    bookSlug: "shazde-kuchulu",
    worldTitle: "جهان تنهایی",
    worldSlug: "jahane-tanhaei",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&h=760&fit=crop",
    duration: "۵:۳۲",
    mood: ["calm", "think"],
    featured: true,
    excerpt: "در سکوت، گاهی صدایی هست که از هر جوابِ آماده‌ای صادق‌تر به نظر می‌رسد.",
    trace: "برای شب‌هایی که نمی‌خواهی چیزی را توضیح بدهی.",
  },
  {
    id: "exp-2",
    slug: "entekhab",
    title: "انسان همان است که انتخاب می‌کند",
    subtitle: "بیگانه · آلبر کامو",
    author: "آلبر کامو",
    bookTitle: "بیگانه",
    bookSlug: "bigane",
    worldTitle: "جهان تغییر",
    worldSlug: "jahane-taghyir",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=760&fit=crop",
    duration: "۴:۱۸",
    mood: ["change", "think"],
    featured: true,
    excerpt: "انتخاب، حتی وقتی آرام و بی‌صدا اتفاق می‌افتد، شکلِ فردای ما را عوض می‌کند.",
    trace: "برای زمانی که میان دو راه ایستاده‌ای.",
  },
  {
    id: "exp-3",
    slug: "khaneh",
    title: "خانه جایی است که خودت باشی",
    subtitle: "خانهٔ ادریسی‌ها · غزاله علیزاده",
    author: "غزاله علیزاده",
    bookTitle: "خانهٔ ادریسی‌ها",
    bookSlug: "khane-edrisiha",
    worldTitle: "جهان خانه",
    worldSlug: "jahane-khaneh",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=760&fit=crop",
    duration: "۶:۴۵",
    mood: ["calm", "imagine"],
    featured: true,
    excerpt: "خانه می‌تواند یک اتاق، یک بو یا خاطره‌ای باشد که تو را به خودت برمی‌گرداند.",
    trace: "برای وقت‌هایی که دلت جای امنی می‌خواهد.",
  },
  {
    id: "exp-4",
    slug: "seda-ha",
    title: "بعضی صداها هرگز فراموش نمی‌شوند",
    subtitle: "نام تو · ماکوتو شینکای",
    author: "ماکوتو شینکای",
    bookTitle: "نام تو",
    bookSlug: "name-to",
    worldTitle: "جهان خاطره",
    worldSlug: "jahane-khatereh",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=760&fit=crop",
    duration: "۳:۵۵",
    mood: ["imagine", "inspire"],
    featured: true,
    excerpt: "بعضی صداها، از میان سال‌ها عبور می‌کنند و همان‌جا درون ما می‌مانند.",
    trace: "برای باز کردن یک خاطرهٔ فراموش‌شده.",
  },
  {
    id: "exp-5",
    slug: "setareh",
    title: "هر کسی ستاره‌ای دارد که فقط خودش می‌بیند",
    subtitle: "شازده کوچولو · آنتوان دوسنت اگزوپری",
    author: "آنتوان دوسنت اگزوپری",
    bookTitle: "شازده کوچولو",
    bookSlug: "shazde-kuchulu",
    worldTitle: "جهان تنهایی",
    worldSlug: "jahane-tanhaei",
    coverImage: "https://images.unsplash.com/photo-1475274047050-1d0c55b91b7a?w=1200&h=760&fit=crop",
    duration: "۴:۲۲",
    mood: ["inspire", "calm"],
    featured: false,
    excerpt: "همهٔ ستاره‌ها یکسان نیستند؛ بعضی از آن‌ها راهِ بازگشت به یک آرزو هستند.",
    trace: "برای وقتی که می‌خواهی دوباره دوردست را ببینی.",
  },
];

export const books: Book[] = [
  { id: "book-1", title: "شازده کوچولو", slug: "shazde-kuchulu", author: "آنتوان دوسنت اگزوپری", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=820&fit=crop", description: "سفری کوچک و عمیق به قلب انسانیت، دوستی و آنچه با چشم دیده نمی‌شود.", rating: 4.8, chaptersCount: 27, year: "۱۹۴۳" },
  { id: "book-2", title: "بیگانه", slug: "bigane", author: "آلبر کامو", coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=820&fit=crop", description: "داستان مرسو؛ انسانی که جهان را با سکوت و فاصله‌ای بی‌رحمانه نگاه می‌کند.", rating: 4.5, chaptersCount: 11, year: "۱۹۴۲" },
  { id: "book-3", title: "خانهٔ ادریسی‌ها", slug: "khane-edrisiha", author: "غزاله علیزاده", coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=820&fit=crop", description: "روایت خانواده‌ای ایرانی در گذر زمان و دگرگونی‌های آرام و عمیق اجتماعی.", rating: 4.3, chaptersCount: 15, year: "۱۳۷۰" },
  { id: "book-4", title: "بوف کور", slug: "bufe-kur", author: "صادق هدایت", coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=820&fit=crop", description: "سفری تیره و شاعرانه به درون ذهن و مرزهای ناپایدار واقعیت.", rating: 4.7, chaptersCount: 2, year: "۱۳۱۵" },
  { id: "book-5", title: "سووشون", slug: "suvashun", author: "سیمین دانشور", coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&h=820&fit=crop", description: "روایتی از عشق، مقاومت و ایستادن در برابر آنچه زندگی را تنگ می‌کند.", rating: 4.6, chaptersCount: 18, year: "۱۳۴۸" },
  { id: "book-6", title: "نام تو", slug: "name-to", author: "ماکوتو شینکای", coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=820&fit=crop", description: "روایتی تصویری از حافظه، فاصله و پیوندی که زمان را به چالش می‌کشد.", rating: 4.4, chaptersCount: 9, year: "۲۰۱۶" },
];

export const worlds: World[] = [
  { id: "world-1", title: "جهان تنهایی", slug: "jahane-tanhaei", description: "فضایی برای کسانی که در سکوت، خودشان را پیدا می‌کنند.", coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=760&fit=crop", booksCount: 12, atmosphere: "آرام، شبانه، درون‌نگر" },
  { id: "world-2", title: "جهان تغییر", slug: "jahane-taghyir", description: "برای لحظه‌هایی که آماده‌ای نظم قدیمی را آرام‌آرام جابه‌جا کنی.", coverImage: "https://images.unsplash.com/photo-1495482432709-15807c8b3e2b?w=1200&h=760&fit=crop", booksCount: 8, atmosphere: "شفاف، جسور، بیدار" },
  { id: "world-3", title: "جهان خاطره", slug: "jahane-khatereh", description: "سفر به گذشته‌هایی که هنوز زنده‌اند و با یک صدا برمی‌گردند.", coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=760&fit=crop", booksCount: 15, atmosphere: "مه‌آلود، گرم، نوستالژیک" },
  { id: "world-4", title: "جهان خانه", slug: "jahane-khaneh", description: "جایی امن برای بازگشت به ریشه‌ها و پیدا کردن یک اتاق روشن.", coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=760&fit=crop", booksCount: 10, atmosphere: "نرم، نزدیک، پناه‌دهنده" },
];

export const collections: Collection[] = [
  { id: "col-1", title: "ادبیات کلاسیک فارسی", slug: "adabiyat-classic", description: "شاهکارهایی که هنوز در لابه‌لای امروز ما زندگی می‌کنند.", coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&h=760&fit=crop", itemsCount: 24, note: "برای برگشتن به ریشهٔ روایت." },
  { id: "col-2", title: "فلسفه و اندیشه", slug: "falsafe-andisheh", description: "آثاری برای مکث کردن، پرسیدن و دیدنِ زندگی از زاویه‌ای دیگر.", coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=760&fit=crop", itemsCount: 18, note: "برای زمانی که سؤال از جواب مهم‌تر است." },
  { id: "col-3", title: "داستان‌های عاشقانه", slug: "dastanhaye-asheghaneh", description: "روایت‌هایی از نزدیکی، فاصله و آنچه میان دو انسان باقی می‌ماند.", coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1200&h=760&fit=crop", itemsCount: 15, note: "برای خواندنِ لایه‌های ناپیدای رابطه." },
];

export const currentTrack = {
  title: "گاهی سکوت بلندترین پاسخ است",
  author: "شازده کوچولو · آنتوان دوسنت اگزوپری",
  coverImage: experiences[0].coverImage,
  currentTime: "۲:۱۴",
  duration: "۵:۳۲",
  progress: 40,
};

export const getExperienceBySlug = (slug: string) => experiences.find((item) => item.slug === slug);
export const getBookBySlug = (slug: string) => books.find((item) => item.slug === slug);
export const getWorldBySlug = (slug: string) => worlds.find((item) => item.slug === slug);
export const getCollectionBySlug = (slug: string) => collections.find((item) => item.slug === slug);

export const getBookForExperience = (experience: Experience) =>
  getBookBySlug(experience.bookSlug) ?? books[0];

export const getWorldForExperience = (experience: Experience) =>
  getWorldBySlug(experience.worldSlug) ?? worlds[0];

export function findContent(query: string) {
  const normalized = query.trim().toLocaleLowerCase("fa");
  if (!normalized) return experiences.slice(0, 3);
  return experiences.filter((item) =>
    [item.title, item.subtitle, item.author, item.bookTitle, item.worldTitle]
      .join(" ")
      .toLocaleLowerCase("fa")
      .includes(normalized),
  );
}
