"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface HeroImageSliderProps {
  images: string[];
  alt: string;
}

const INTERVAL_MS = 5000;
// Horizontal travel (px) a drag/swipe needs before it counts as a slide change.
const SWIPE_THRESHOLD = 40;

// Hero image slider — only the image rotates; the text stack stays put.
// Slides are stacked and cross-faded via opacity, advancing every 5s in an
// infinite loop. Mouse drag and touch swipe move prev/next, and any manual
// change restarts the 5s timer so the next auto-advance isn't immediate.
export default function HeroImageSlider({ images, alt }: HeroImageSliderProps) {
  const [index, setIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [index, count]);

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    dragStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
  };

  return (
    <div
      className={`relative w-full h-full select-none touch-pan-y ${count > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      aria-roledescription={count > 1 ? "carousel" : undefined}
    >
      {images.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt={count > 1 ? `${alt} (${i + 1}/${count})` : alt}
          fill
          priority={i === 0}
          draggable={false}
          sizes="(max-width: 1024px) 90vw, 520px"
          aria-hidden={i !== index}
          className={`object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === index ? "w-6 bg-primary" : "w-2 bg-card/80 hover:bg-card"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
