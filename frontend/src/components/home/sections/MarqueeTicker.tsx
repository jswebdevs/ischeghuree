"use client";

import { useEffect, useRef, useState } from "react";
import type { BannerMessage } from "./StickyBanner";

interface MarqueeTickerProps {
  /** Each message carries its own scroll time: seconds to cross the bar,
   *  from entering on the right to fully gone on the left. */
  messages: BannerMessage[];
  /** Font size in px. */
  fontSize: number;
  /** Seconds of empty bar between one message leaving and the next entering. */
  gap: number;
}

// One message at a time: it enters from the right edge and scrolls until it
// has completely left on the left, then the bar waits `gap` seconds before the
// next message starts. Cycles through the list forever.
//
// The motion is two linear animations of equal duration: the wrapper (as wide
// as the bar) slides 100% → 0, moving the text start from the right edge to
// the left edge, while the text slides 0 → -100% of its own width. Together
// the text travels exactly bar width + text width, so it starts fully
// off-screen right and ends fully off-screen left, for any text length.
// Hover-pause comes from the .ig-banner wrapper (see globals.css).
export default function MarqueeTicker({ messages, fontSize, gap }: MarqueeTickerProps) {
  const items = messages.filter((m) => m.text.trim());
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!items.length) return null;
  const current = items[index % items.length];

  const onEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // The inner text's animation bubbles up too; react to the wrapper's only.
    if (e.target !== e.currentTarget) return;
    setRunning(false);
    timer.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % items.length);
      setCycle((c) => c + 1);
      setRunning(true);
    }, gap * 1000);
  };

  const style = { "--ig-marquee-duration": `${current.speed}s` } as React.CSSProperties;

  return (
    <div className="relative flex-1 min-w-0 overflow-hidden leading-normal font-bold" style={{ fontSize: `${fontSize}px` }}>
      {/* Invisible sizer keeps the bar's height while the text is in its gap. */}
      <span className="invisible block whitespace-nowrap" aria-hidden="true">🪁</span>
      {running && (
        <div key={cycle} className="ig-marquee-enter absolute inset-0" style={style} onAnimationEnd={onEnd}>
          <span className="ig-marquee-exit inline-block whitespace-nowrap will-change-transform" style={style}>
            🪁 {current.text}
          </span>
        </div>
      )}
      {/* Reduced motion: no scrolling, just the first message. */}
      <span className="ig-marquee-static hidden absolute inset-0 truncate">🪁 {items[0].text}</span>
    </div>
  );
}
