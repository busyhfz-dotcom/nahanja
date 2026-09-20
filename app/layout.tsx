import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/seo";

const farDastan = localFont({
  src: "./fonts/Far_Dastan.ttf",
  variable: "--font-far-dastan",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#101712",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "نهان‌جا | جایی برای کشف آنچه در تو زنده است",
    template: "%s | نهان‌جا",
  },
  description: siteConfig.description,
  keywords: ["کتاب", "کتاب صوتی", "تجربهٔ کتاب", "ادبیات فارسی", "نهان‌جا", "کشف کتاب"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "نهان‌جا | جایی برای کشف آنچه در تو زنده است",
    description: siteConfig.description,
    images: [{ url: "/images/nazar-ban-ja.webp", width: 1254, height: 1254, alt: "نظربان‌جا؛ مدخل نهان‌جا" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "نهان‌جا | تجربه‌ای برای رسیدن به کتاب",
    description: siteConfig.description,
    images: ["/images/nazar-ban-ja.webp"],
  },
  category: "books and culture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${farDastan.variable} antialiased`}>{children}</body>
    </html>
  );
}
