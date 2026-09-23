import "./globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#19332b",
};

export const metadata: Metadata = {
  title: "نهان‌جا | مسیر کشف تو",
  description:
    "نهان‌جا؛ بیش از کتاب. یک تجربه‌ی زنده از کتاب، صدا، جهان و مسیر شخصی شما.",
  keywords: "کتاب, کتاب صوتی, پادکست, ادبیات فارسی, نهان‌جا",
  icons: {
    icon: [
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAQlBMVEVmiGZ3iGZmd2YzRDMRERFVZlUzMyJmd1UzMzNEVUR3iHdmZlVVVUREREQiIiIiMyIRIhEAAAAAEQAiIhEREQBERDPzvlqZAAAD/klEQVRYCZ3BgVrTzBpG0Xfv5HNIUlqjcv+3emaSwl8E1OeslUDU8EghiR2Q2BE+cJoTOg1vVD6Kygf1LXwQ/iycEm1P4RT5VHgvvHFYQheUuxWUT4ROiSHYPGyRk9JJl/AqgHRBDYM2XS5KTIvBU8DQRULAqJCQgAfQ1vRy8bAFUNCmspIACQEi7xk8VYnGSjhp5LTyFTnEjiFGTgqo/Gblg4BNhhg52OhUkL8IUUOnEYcSUBnCl6QLahm7GMttKQWHoLwK4U5QVIhdbQ4RWy0lgYAcwpdkiEM0Am2RO8NfycFmYpphUxkkCf9EomiUeACkS/irKCoawS54ByaIBsMhQOhihw/STCVBUf4TDit3YYiHGO9StgYoXwifCF2s2qItQMIfKJ9Qq6IyhD8RjUN806qWJVW11ZvW6s0mtqW2gNo2W7M5tKaltlqeU9XsNg/xFE5u4U7+k2jsLpcspZw8RfmEXTgYFbGq8lxqiF1TE7oQESJEOrsmoLFDraoli5jgKaHTaIAor+y2ZVETT7XVNRc5CAZQfpfGQZeL4U10mlPyzu2ZB9JdvsvJqTjJ4HXPBeU/zhPdysGpYF1muZsuEHnlMmeLyp1kniB1EVaob5cVllnuagNkSNBpj1AOIUrmJ6h936/TRRCnWn40OrvrTQ0Su1zmPYJdtWZT/H4N9TTN+74XVKv9dtkLVm+FTz8TbVtrTXCZ58iwzN2Pb8Btv03TdJv3+Um4Pnmda5+n5+f52p6n71fg6cevX7/mBXRZonQuQwUu++HnIhbVVr/Xde/my7z/2BdCLYNAqqWEBAgkkOV6vU61FNQzsHrdnK7XuW77fHsOhyCdZUoSDd6hwtOLLHO1drn+FPA27ZNEBaObccgmELpoiESDgW3ff+37vtB53aeAh+CrinztZd/3eQnDNAuER9EKf5C6lJwsPlKj/JuVD6KVKv5v0YryR/LGKO/YWuRrEQIrX7FV5JDwkYryJbUibxLuAgICCooBeSQOaSsQQaIYEBCVeAcYBQSiAg5pnJS7sNJJJ3acwmEFkoACEZRPyLoC8ko5rAyBBIwMK3fyz8IQgdY4BOQ9lQcrjwJEiKWEKCgn6YJ0wQgKBvDAEOmUlb8ID9yUQ2RI+At5JK8iB1n5jTxSHimnyClyt3KXACsQMLxT3xcIEEEgtJI3igfuEk5KF6cnFBJBxIG74BscAh5AMEZNhMhgLQ4QURKbCsEucQgnUZEhFZNo09DFAdSEiOEgjyIypGKAVMkQB17J7+SdNMPQyjBYXROI4is6t/C7NDnYJVHr5brP3y5NbbZta6VGa5kW6WQwdKapdL4JdZv3+fq0LJeql5elmq1errelhUE5GPB/ai4hJui5CRAAAAAASUVORK5CYII=",
        type: "image/png",
      },
    ],
  },
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
