"use client";

import Image from "next/image";
import { useState } from "react";
import InkIcon from "@/components/InkIcon";
import { currentTrack } from "@/lib/mock-data";

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(currentTrack.progress);

  return (
    <aside id="audio" className="audio-dock" aria-label="پخش‌کنندهٔ نهان‌جا">
      <Image className="audio-dock__cover" src={currentTrack.coverImage} alt="" width={56} height={56} />
      <div className="audio-dock__copy">
        <strong>{currentTrack.title}</strong>
        <span>{currentTrack.author} · {currentTrack.currentTime} از {currentTrack.duration}</span>
      </div>
      <div className="audio-dock__controls">
        <div className="audio-dock__meter" aria-hidden><i style={{ width: `${progress}%` }} /></div>
        <input className="sr-only" aria-label="موقعیت پخش" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} />
        <button type="button" className="audio-dock__play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "توقف" : "پخش"}>
          {playing ? <span className="text-sm">Ⅱ</span> : <InkIcon name="play" width={17} height={17} />}
        </button>
      </div>
    </aside>
  );
}
