"use client";

import { useState } from "react";
import { currentTrack } from "@/lib/mock-data";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(currentTrack.progress);
  const [volume, setVolume] = useState(66);

  return (
    <div id="audio" className="fixed inset-x-0 bottom-0 z-30 border-t border-[oklch(0.79_0.115_88/25%)] bg-[oklch(0.185_0.03_70/90%)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4 md:px-6">
        {/* Now playing info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 md:min-w-[200px] md:flex-none">
          {/* Cover */}
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[oklch(0.79_0.115_88/30%)] bg-gradient-to-b from-[var(--surface)] to-[var(--card)] md:h-12 md:w-12">
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-[oklch(0.87_0.055_88)] md:text-xs">
              {currentTrack.title}
            </p>
            <p className="truncate text-[9px] text-[var(--gold-dim)] md:text-[10px]">
              {currentTrack.author}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="order-first flex items-center gap-1.5 md:order-none md:gap-2">
          {/* Shuffle */}
          <button className="hidden h-8 w-8 place-items-center text-[var(--gold-dim)] transition hover:text-[var(--gold)] md:grid">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="m16 3 4 4-4 4M20 7H4m16 14-4-4 4-4m-4 4H4" />
            </svg>
          </button>
          {/* Previous */}
          <button className="grid h-8 w-8 place-items-center text-[var(--gold-dim)] transition hover:text-[var(--gold)]">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)] transition hover:shadow-[0_0_20px_-2px_oklch(0.79_0.115_88/60%)]"
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          {/* Next */}
          <button className="grid h-8 w-8 place-items-center text-[var(--gold-dim)] transition hover:text-[var(--gold)]">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z" />
            </svg>
          </button>
          {/* Repeat */}
          <button className="hidden h-8 w-8 place-items-center text-[var(--gold-dim)] transition hover:text-[var(--gold)] md:grid">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="m17 1 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4m14 4v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex w-full flex-1 items-center gap-3 md:w-auto" dir="ltr">
          <span className="w-8 text-left text-[10px] tabular-nums text-[var(--gold-dim)]">
            {currentTrack.currentTime}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="audio-range flex-1"
            style={{
              background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${progress}%, var(--surface) ${progress}%, var(--surface) 100%)`,
            }}
          />
          <span className="w-8 text-right text-[10px] tabular-nums text-[var(--gold-dim)]">
            {currentTrack.duration}
          </span>
        </div>

        {/* Extra controls */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Like */}
          <button className="grid h-8 w-8 place-items-center text-[var(--gold-dim)] transition hover:text-[var(--gold)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Speed */}
          <button className="rounded-full border border-[oklch(0.79_0.115_88/40%)] px-2 py-0.5 text-[9px] font-bold text-[var(--gold)]">
            1x
          </button>
          {/* Volume */}
          <div className="flex items-center gap-2">
            <button className="text-[var(--gold-dim)]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M11 5 6 9H2v6h4l5 4zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
            <div className="h-1 w-16 overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full bg-[var(--gold)]"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
