"use client";

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    const isSecureContext =
      window.location.protocol === "https:" || window.location.hostname === "localhost";
    if (!("serviceWorker" in navigator) || !isSecureContext) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // The app remains fully usable online when registration is unavailable.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
