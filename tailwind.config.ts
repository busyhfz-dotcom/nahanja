import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0806",
          2: "#130d08",
        },
        gold: {
          DEFAULT: "oklch(0.79 0.115 88)",
          dim: "oklch(0.62 0.045 85)",
          bright: "oklch(0.92 0.09 92)",
          glow: "oklch(0.79 0.115 88 / 34%)",
        },
        card: "oklch(0.185 0.03 70)",
        surface: "oklch(0.24 0.032 72)",
        border: "oklch(0.79 0.115 88 / 22%)",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "Tahoma", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 3.2s ease-in-out infinite",
        "dust-rise": "dust-rise 14s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        "dust-rise": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "12%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(-46vh) translateX(2rem)",
            opacity: "0",
          },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
