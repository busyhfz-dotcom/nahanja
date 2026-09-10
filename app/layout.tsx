import './globals.css';

export const metadata = {
  title: 'نهان‌جا | Nahanja',
  description: 'Premium cinematic Persian book and audiobook platform',
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
