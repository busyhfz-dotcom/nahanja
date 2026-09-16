import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نهان‌جا | جایی برای رسیدن به کتاب",
  description: "تجربه‌های تصویری، صوتی و روایی برای کشف جهان کتاب‌ها.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
