# نَهان‌جا (Nahanja)

Premium cinematic Persian book and audiobook platform.

## Current Stage
Prototype imported from the cinematic UI concept.

## Mobile apps

- iPhone/iPad: open `https://www.nahanja.ir` in Safari and choose **Add to Home Screen**. The installed PWA uses the full-screen layout, safe-area spacing and an offline fallback.
- Android: run `npm ci`, then `npm run android:sync`. Open the generated project with `npm run android:open`, or run the **Android debug APK** GitHub workflow to receive a debug APK artifact.
- Android package id: `ir.nahanja.app`.
- Both mobile apps load the production Nahanja content, so CMS publications appear without shipping a new app version.

## Roadmap
- Next.js + TypeScript migration
- Tailwind + shadcn/ui design system
- CMS integration
- Secure audiobook streaming
- Production deployment
