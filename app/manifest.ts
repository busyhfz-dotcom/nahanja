import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "نهان‌جا",
    short_name: "نهان‌جا",
    description: "کشف مسیر شخصی به کتاب، صدا و جهان‌های تازه.",
    start_url: "/",
    display: "standalone",
    background_color: "#101712",
    theme_color: "#101712",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/images/nazar-ban-ja.webp",
        sizes: "1254x1254",
        type: "image/webp",
      },
    ],
  };
}
