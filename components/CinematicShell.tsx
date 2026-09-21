"use client";

import { useCallback, useRef, useState } from "react";

const PREVIEW_PATH = "/nahanja-preview.html";

export default function CinematicShell() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);

  const interactivePreviewLoaded = useCallback(() => {
    try {
      return Boolean(
        frameRef.current?.contentDocument
          ?.getElementById("nahanja-app")
          ?.getAttribute("data-screen"),
      );
    } catch {
      return false;
    }
  }, []);

  const verifyPreview = useCallback(() => {
    window.setTimeout(() => {
      if (interactivePreviewLoaded()) {
        setShowRecovery(false);
        return;
      }

      // A one-time cache-busting reload resolves a stale or partially cached preview.
      if (attempt === 0) {
        setAttempt(1);
        return;
      }

      setShowRecovery(true);
    }, 1200);
  }, [attempt, interactivePreviewLoaded]);

  const retry = () => {
    setShowRecovery(false);
    setAttempt((current) => current + 1);
  };

  return (
    <main className="cinematic-shell" style={{ position: "relative" }}>
      <iframe
        key={attempt}
        ref={frameRef}
        src={attempt ? `${PREVIEW_PATH}?refresh=${attempt}` : PREVIEW_PATH}
        title="نهان‌جا؛ مسیر کشف تو"
        className="cinematic-frame"
        allow="autoplay"
        onLoad={verifyPreview}
      />

      {showRecovery && (
        <section
          aria-live="polite"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background:
              "radial-gradient(ellipse at center, rgba(247,246,238,.93), rgba(238,237,225,.86))",
            color: "#254437",
            textAlign: "center",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p style={{ margin: 0, fontSize: 14, letterSpacing: ".05em" }}>
              نهان‌جا
            </p>
            <h1 style={{ margin: "14px 0", fontSize: "clamp(31px, 5vw, 52px)" }}>
              مسیر کشف، آمادهٔ شروع است.
            </h1>
            <p style={{ margin: "0 auto 24px", lineHeight: 2, maxWidth: 430 }}>
              رابط تعاملی در این مرورگر کامل بارگذاری نشد. یک‌بار دیگر آن را
              تازه‌سازی می‌کنیم؛ اطلاعات و انتخاب‌های تو از بین نمی‌روند.
            </p>
            <button
              type="button"
              onClick={retry}
              style={{
                border: 0,
                borderRadius: 999,
                padding: "12px 22px",
                background: "#254437",
                color: "#f7f6ee",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              بارگذاری دوباره
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
