// ==========================================
// Mock Data for Nahanja Platform
// ==========================================

export interface Experience {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  bookTitle: string;
  worldTitle: string;
  coverImage: string;
  audioSrc?: string;
  duration: string;
  mood: string[];
  featured: boolean;
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
}

export interface World {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  booksCount: number;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  itemsCount: number;
}

export interface MoodCategory {
  id: string;
  label: string;
  icon: string;
  image: string;
}

export const moods: MoodCategory[] = [
  { id: "calm", label: "آرامش", icon: "🌊", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop" },
  { id: "think", label: "فکر کردن", icon: "💭", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { id: "imagine", label: "خیال", icon: "✨", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&h=200&fit=crop" },
  { id: "change", label: "تغییر", icon: "🔄", image: "https://images.unsplash.com/photo-1495482432709-15807c8b3e2b?w=200&h=200&fit=crop" },
  { id: "travel", label: "سفر", icon: "🌍", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop" },
  { id: "inspire", label: "الهام", icon: "💡", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=200&fit=crop" },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "گاهی سکوت بلندترین پاسخ است",
    subtitle: "شازده کوچولو - آنتوان دوسنت اگزوپری",
    author: "آنتوان دوسنت اگزوپری",
    bookTitle: "شازده کوچولو",
    worldTitle: "جهان تنهایی",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop",
    duration: "5:32",
    mood: ["calm", "think"],
    featured: true,
  },
  {
    id: "exp-2",
    title: "انسان همان است که انتخاب می‌کند",
    subtitle: "بیگانه - آلبر کامو",
    author: "آلبر کامو",
    bookTitle: "بیگانه",
    worldTitle: "جهان تغییر",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&h=400&fit=crop",
    duration: "4:18",
    mood: ["change", "think"],
    featured: true,
  },
  {
    id: "exp-3",
    title: "خانه جایی است که خودت باشی",
    subtitle: "خانه‌ی ادریسی‌ها - غزاله علیزاده",
    author: "غزاله علیزاده",
    bookTitle: "خانه‌ی ادریسی‌ها",
    worldTitle: "جهان خانه",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    duration: "6:45",
    mood: ["calm", "imagine"],
    featured: true,
  },
  {
    id: "exp-4",
    title: "بعضی صداها هرگز فراموش نمی‌شوند",
    subtitle: "نام تو - ماکوتو شینکای",
    author: "ماکوتو شینکای",
    bookTitle: "نام تو",
    worldTitle: "جهان خاطره",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    duration: "3:55",
    mood: ["imagine", "inspire"],
    featured: true,
  },
  {
    id: "exp-5",
    title: "هر کسی ستاره‌ای دارد که فقط خودش می‌بیند",
    subtitle: "شازده کوچولو - آنتوان دوسنت اگزوپری",
    author: "آنتوان دوسنت اگزوپری",
    bookTitle: "شازده کوچولو",
    worldTitle: "جهان تنهایی",
    coverImage: "https://images.unsplash.com/photo-1475274047050-1d0c55b91b7a?w=600&h=400&fit=crop",
    duration: "4:22",
    mood: ["inspire", "calm"],
    featured: false,
  },
];

export const books: Book[] = [
  {
    id: "book-1",
    title: "شازده کوچولو",
    slug: "shazde-kuchulu",
    author: "آنتوان دوسنت اگزوپری",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    description: "داستان شازده کوچولو از سیاره‌ای کوچک، سفری درونی به قلب انسانیت",
    rating: 4.8,
    chaptersCount: 27,
  },
  {
    id: "book-2",
    title: "بیگانه",
    slug: "bigane",
    author: "آلبر کامو",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    description: "مرسو، مردی که با بی‌تفاوتی به زندگی نگاه می‌کرد",
    rating: 4.5,
    chaptersCount: 11,
  },
  {
    id: "book-3",
    title: "خانه ادریسی‌ها",
    slug: "khane-edrisiha",
    author: "غزاله علیزاده",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop",
    description: "روایت خانواده‌ای ایرانی در گذر زمان و تحولات اجتماعی",
    rating: 4.3,
    chaptersCount: 15,
  },
  {
    id: "book-4",
    title: "بوف کور",
    slug: "bufe-kur",
    author: "صادق هدایت",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    description: "شاهکار ادبیات فارسی، سفری به اعماق ذهن و روان انسان",
    rating: 4.7,
    chaptersCount: 2,
  },
  {
    id: "book-5",
    title: "سووشون",
    slug: "suvashun",
    author: "سیمین دانشور",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop",
    description: "داستان عشق و مقاومت در شیراز دوران جنگ جهانی دوم",
    rating: 4.6,
    chaptersCount: 18,
  },
];

export const worlds: World[] = [
  {
    id: "world-1",
    title: "جهان تنهایی",
    slug: "jahane-tanhaei",
    description: "فضایی برای کسانی که در سکوت، خودشان را پیدا می‌کنند",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    booksCount: 12,
  },
  {
    id: "world-2",
    title: "جهان تغییر",
    slug: "jahane-taghyir",
    description: "برای لحظه‌هایی که آماده‌ی دگرگونی هستی",
    coverImage: "https://images.unsplash.com/photo-1495482432709-15807c8b3e2b?w=600&h=400&fit=crop",
    booksCount: 8,
  },
  {
    id: "world-3",
    title: "جهان خاطره",
    slug: "jahane-khatereh",
    description: "سفر به گذشته‌هایی که هنوز زنده‌اند",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    booksCount: 15,
  },
  {
    id: "world-4",
    title: "جهان خانه",
    slug: "jahane-khaneh",
    description: "جایی امن برای بازگشت به ریشه‌ها",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    booksCount: 10,
  },
];

export const collections: Collection[] = [
  {
    id: "col-1",
    title: "ادبیات کلاسیک فارسی",
    slug: "adabiyat-classic",
    description: "شاهکارهای جاودانه ادبیات فارسی",
    coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop",
    itemsCount: 24,
  },
  {
    id: "col-2",
    title: "فلسفه و اندیشه",
    slug: "falsafe-andisheh",
    description: "آثاری برای تفکر عمیق‌تر درباره زندگی",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
    itemsCount: 18,
  },
  {
    id: "col-3",
    title: "داستان‌های عاشقانه",
    slug: "dastanhaye-asheghaneh",
    description: "عشق در تمام ابعادش",
    coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=400&fit=crop",
    itemsCount: 15,
  },
];

// Current playing track for audio player
export const currentTrack = {
  title: "گاهی سکوت بلندترین پاسخ است",
  author: "شازده کوچولو - آنتوان دوسنت اگزوپری",
  coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop",
  currentTime: "2:14",
  duration: "5:32",
  progress: 40,
};
