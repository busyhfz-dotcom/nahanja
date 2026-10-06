import "./globals.css";
import type { Metadata, Viewport } from "next";
import PwaRegistration from "@/components/PwaRegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe5" },
    { media: "(prefers-color-scheme: dark)", color: "#19332b" },
  ],
};

export const metadata: Metadata = {
  applicationName: "نهان‌جا",
  title: "نهان‌جا | مسیر کشف تو",
  description:
    "نهان‌جا؛ بیش از کتاب. یک تجربه‌ی زنده از کتاب، صدا، جهان و مسیر شخصی شما.",
  keywords: "کتاب, کتاب صوتی, پادکست, ادبیات فارسی, نهان‌جا",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نهان‌جا",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
