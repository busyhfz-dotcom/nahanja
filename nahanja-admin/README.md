# پنل مستقل مدیریت نهان‌جا

این پوشه دو برنامهٔ جدا دارد:

- `api/`: API تحریریه برای Railway. تنها این برنامه به Neon متصل می‌شود.
- `web/`: پنل فارسی برای پروژهٔ جداگانهٔ Vercel.

مدل داده و محتوای اولیه در `db/0001_schema.sql` و `db/0002_seed.sql` قرار دارند. موجودی دقیق سایت در `docs/inventory.md` است. پروژهٔ Neon مستقل `nahanja-content` با شناسهٔ `lucky-wave-16672147`، دیتابیس `nahanja_content` و شاخهٔ `staging` با شناسهٔ `br-quiet-feather-b1wlx1wk` ساخته و روی هر دو شاخه seed اجرا شده است. سرویس خالی Railway `nahanja-cms-api/cms-api` ساخته و `DATABASE_URL` اصلی در آن ثبت شده، ولی هنوز منبع کد یا دامنهٔ عمومی ندارد.

## راه‌اندازی

1. برای Google یک **Web application OAuth Client ID** معتبر بسازید یا شناسهٔ موجود را تأیید کنید. دامنهٔ واقعی پنل را در Authorized JavaScript origins اضافه کنید. API مقدار `GOOGLE_CLIENT_ID` و پنل مقدار `VITE_GOOGLE_CLIENT_ID` یکسان می‌گیرند. نخستین مدیر در Neon با ایمیل اعلام‌شده به‌صورت pending ثبت شده و فقط پس از ورود Google با ایمیل تأییدشده و شناسهٔ client درست فعال می‌شود.
2. در Vercel یک Blob store برای مدیای عمومی ایجاد و `BLOB_READ_WRITE_TOKEN` آن را **فقط** به سرویس API در Railway بدهید. کلید Blob و Neon به مرورگر یا build پنل نروند.
3. API را از `api/` در Railway مستقر کنید. `DATABASE_URL` pooled قبلاً روی سرویس خالی ثبت شده است؛ `GOOGLE_CLIENT_ID`, `ADMIN_ORIGIN`, `CMS_PUBLIC_URL`, `BLOB_READ_WRITE_TOKEN` هنوز باید تنظیم شوند. `CMS_PUBLIC_URL` آدرس HTTPS خود API است تا Vercel Blob callback را به آن بفرستد. فرمان اجرا `npm start` و healthcheck مسیر `/health` است.
4. `web/` را به‌عنوان پروژهٔ مستقل Vercel با framework Vite و output `dist` منتشر کنید. `VITE_CMS_API_URL` باید به آدرس HTTPS API Railway و `VITE_GOOGLE_CLIENT_ID` به شناسهٔ Google اشاره کند. مقدار دقیق origin پنل را در `ADMIN_ORIGIN` API ثبت کنید.
5. ابتدا در staging یک کتاب و جلد آزمایشی بسازید، preview و انتشار را بررسی کنید، سپس API و پنل production را فعال کنید. سایت عمومی فعلی هنوز HTML ثابت را نمایش می‌دهد. برای اثرگذاری تغییرات پنل بر سایت باید adapter دریافت `/v1/public/release` با fallback به محتوای ثابت در repo سایت پیاده و آزموده شود.

## امکانات موجود در کد

API: فهرست و جست‌وجوی محتوا، ایجاد و ویرایش نسخه‌دار، حذف نرم و بازیابی، انتشار و لغو انتشار اتمیک release، خروجی عمومی فقط از release فعال، کتابخانه و آپلود مستقیم Vercel Blob، ویرایش alt/caption، رویدادهای audit، کنترل نقش و تأیید Google ID token. درخواست بدون ورود به مسیر مدیریت پاسخ 401 می‌گیرد.

پنل: گروه‌بندی انواع محتوا، فیلتر وضعیت و جست‌وجو، ویرایش JSON محتوای واقعی، تنظیم روابط و ترتیب، انتخاب فایل برای جلد/تصویر/صوت/ویدئو، بارگذاری فایل، پیش‌نمایش draft، انتشار، لغو انتشار و زباله‌دان. پیش‌نمایش فعلی یک کارت محتوایی در پنل است؛ برای دیدن **همان صفحهٔ عمومی** با draft، adapter سایت و نشست preview کوتاه‌مدت هنوز لازم است.

ورود اطلاعات به‌صورت JSON انجام می‌شود تا تمام فیلدهای موجود بدون حذف شدن قابل‌ویرایش باشند. فرم‌های فارسی اختصاصی برای هر نوع، کامل‌کردن `ui_copy` و متن کامل صفحه‌ها، ابزار مدیریت نقش‌ها و workflow بررسی آثار اعضا مرحلهٔ بعد هستند. افزوده‌شدن `podcast` و `video` به مدل، به‌معنای وجود فایل صوتی/ویدئویی واقعی در سایت فعلی نیست.

## API

| مسیر | دسترسی | کاربرد |
|---|---|---|
| `GET /v1/public/release` | عمومی | فقط نسخهٔ منتشرشده، همراه روابط و مدیا |
| `GET /v1/admin/me`, `/types`, `/items`, `/items/:id` | مدیر | هویت، نوع‌ها، فهرست و جزئیات draft/published |
| `POST /v1/admin/items`, `PUT /v1/admin/items/:id` | owner/editor | ایجاد و ویرایش نسخه‌دار با کنترل نسخهٔ همزمان |
| `DELETE /v1/admin/items/:id`, `POST .../restore` | owner/editor | زباله‌دان و بازیابی |
| `POST .../publish`, `POST .../unpublish` | owner/publisher | ساخت release جدید و تعویض اتمیک |
| `POST /v1/admin/upload`, `GET /v1/admin/media`, `PUT /v1/admin/media/:id` | owner/editor برای نوشتن | آپلود، فهرست و شرح مدیا |

برای اجرا در سیستم محلی: `npm install` در هر دو پوشه، سپس `npm start` در `api/` و `npm run dev` در `web/`. متغیرها را بر اساس فایل‌های نمونه تنظیم کنید. رمزها در این مخزن یا سند ذخیره نشده‌اند.

## آزمون انجام‌شده

- Build رابط Vite و syntax check API موفق.
- DDL و seed روی Neon staging و شاخهٔ اصلی: ۴۶ محتوا، ۱۰۵ رابطه، ۳۹ محتوای منتشرشده، ۳ کتاب.
- آزمون محلی PostgreSQL سازگار: ایجاد، ویرایش با کنترل نسخه، انتشار، لغو انتشار، حذف و بازیابی موفق.
- API محلی با Neon staging: `/health` سالم، `/v1/public/release` دارای ۳۹ مورد/۳ کتاب، `/v1/admin/items` بدون هویت پاسخ 401.
- آزمون مرورگر خودکار در این محیط به‌خاطر خطای اتصال ابزار مرورگر کامل نشد؛ پاسخ HTTP خروجی build برابر 200 بود. ورود Google و بارگذاری واقعی Blob هنوز به شناسهٔ OAuth و Blob store نیاز دارند.

