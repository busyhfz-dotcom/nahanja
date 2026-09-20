import "./globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b0806",
};

export const metadata: Metadata = {
  title: "نهان‌جا | جایی برای کشف آنچه در تو زنده است",
  description:
    "نهان‌جا؛ بیش از کتاب. یک تجربه‌ی زنده از کتاب، صدا، جهان و مسیر شخصی شما.",
  keywords: "کتاب, کتاب صوتی, پادکست, ادبیات فارسی, نهان‌جا",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
