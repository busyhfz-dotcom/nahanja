import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ir.nahanja.app",
  appName: "نهان‌جا",
  webDir: "mobile-shell",
  server: {
    url: "https://www.nahanja.ir",
    cleartext: false,
    androidScheme: "https",
    allowNavigation: ["nahanja.ir", "www.nahanja.ir"],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#f2efe5",
  },
};

export default config;
