"use client";

import { useEffect, useRef, useState } from "react";

interface Frame {
  id: string;
  originalUrl: string;
  sequence: number;
}

interface Props {
  frames: Frame[];
}

// Turntable component: drag horizontally to scrub through the ordered image
// sequence. Pre-loads all frames on mount so playback is jitter-free. Supports
// mouse + touch + auto-rotate when idle.
export default function Product360Viewer({ frames }: Props) {
  const ordered = frames.slice().sort((a, b) => a.sequence - b.sequence);
  const total = ordered.length;

  const [index, setIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const dragStateRef = useRef<{ startX: number; startIndex: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preload every frame so swipes don't pop in.
  useEffect(() => {
    ordered.forEach((f) => {
      const img = new Image();
      img.src = f.originalUrl;
    });
  }, [ordered]);

  // Auto-rotate ticker — pauses while the user is dragging or hovering.
  useEffect(() => {
    if (!autoRotate || total === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 90);
    return () => window.clearInterval(id);
  }, [autoRotate, total]);

  if (total === 0) return null;

  const onPointerDown = (clientX: number) => {
    setAutoRotate(false);
    dragStateRef.current = { startX: clientX, startIndex: index };
  };

  const onPointerMove = (clientX: number) => {
    const drag = dragStateRef.current;
    if (!drag || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 1;
    // Full container width = one full rotation. Adjust for sensitivity.
    const delta = ((clientX - drag.startX) / width) * total;
    let next = Math.round(drag.startIndex + delta) % total;
    if (next < 0) next += total;
    setIndex(next);
  };

  const onPointerUp = () => {
    dragStateRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="aspect-[4/5] sm:aspect-square bg-card border border-border rounded-3xl overflow-hidden relative select-none cursor-ew-resize touch-none"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => {
        if (!dragStateRef.current) setAutoRotate(true);
      }}
      onMouseDown={(e) => onPointerDown(e.clientX)}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={onPointerUp}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) onPointerDown(t.clientX);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) onPointerMove(t.clientX);
      }}
      onTouchEnd={onPointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ordered[index]?.originalUrl}
        alt={`360° frame ${index + 1} of ${total}`}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-card/80 backdrop-blur-sm border border-border rounded-full px-3 py-1">
        Drag to rotate • {index + 1}/{total}
      </div>
    </div>
  );
}
