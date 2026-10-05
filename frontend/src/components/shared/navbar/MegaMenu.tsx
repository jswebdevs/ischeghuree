"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";

// IconRenderer pulls in every react-icons pack; load it lazily (as the mobile
// drawer does) so the header's first paint doesn't wait on it. The placeholder
// reserves the icon's box so the row doesn't shift when it arrives.
const IconRenderer = dynamic(() => import("@/components/shared/IconRenderer"), {
  ssr: false,
  loading: () => <span className="w-5 h-5 inline-block shrink-0" aria-hidden="true" />,
});

export interface CategoryBarConfig {
  bgColor?: string;
  textColor?: string;
}

// Admin-editable via homepageConfig.categoryBar (Storefront → Homepage →
// Category Bar). Defaults: brand kite-orange with white text.
export const CATEGORY_BAR_DEFAULTS = { bgColor: "#f76707", textColor: "#ffffff" };

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const safeColor = (v: string | undefined, fallback: string) =>
  v && HEX_COLOR.test(v) ? v : fallback;

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  children?: MenuCategory[];
}

// Category navigation row under the header, on every screen size. When the
// categories are wider than the screen the row slides: native horizontal
// scrolling (swipe on touch, trackpad on desktop) plus prev/next arrows that
// appear only on the side that has more to show.
//
// Panels open on hover for mouse users and on tap/click for touch and keyboard
// users; Escape, an outside click and scrolling the row all close them.
export default function MegaMenu({ config }: { config?: CategoryBarConfig | null }) {
  const bgColor = safeColor(config?.bgColor, CATEGORY_BAR_DEFAULTS.bgColor);
  const textColor = safeColor(config?.textColor, CATEGORY_BAR_DEFAULTS.textColor);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  // Position/width (px) of the open item within the bar, so the sub-category
  // row sits directly under it and is at least as wide.
  const [anchor, setAnchor] = useState({ left: 0, width: 0 });
  // The panel's final left edge, clamped so it never runs off-screen.
  const [panelLeft, setPanelLeft] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/categories", { params: { tree: "true" } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // A failed category fetch collapses the row rather than breaking the
        // header; the mobile drawer and /categories remain available.
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Which arrows to show, from the track's live scroll metrics. A 2px
  // tolerance because fractional widths rarely land exactly on a bound.
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(max > 2 && el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    // The open panel is positioned against the item it hangs from, so close
    // it once that item slides away.
    const onScroll = () => {
      syncArrows();
      setOpenId(null);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [syncArrows, categories.length]);

  useEffect(() => {
    if (!openId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openId]);

  // Keep the panel inside the bar: start under its item, but shift left when
  // it would overflow the right edge (common on phones).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const box = containerRef.current;
    if (!openId || !panel || !box) return;
    const gutter = 8;
    const maxLeft = box.clientWidth - panel.offsetWidth - gutter;
    setPanelLeft(Math.max(gutter, Math.min(anchor.left, maxLeft)));
  }, [openId, anchor]);

  if (!categories.length) return null;

  const openCat = categories.find((c) => c.id === openId);
  const openChildren = openCat?.children ?? [];

  const slide = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-0 z-10 h-full w-10 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80";

  return (
    <div
      ref={containerRef}
      className="relative border-t border-border/60"
      style={{ backgroundColor: bgColor, color: textColor }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpenId(null);
      }}
    >
      {canPrev && (
        <button
          type="button"
          onClick={() => slide(-1)}
          aria-label="আগের ক্যাটাগরি — Previous categories"
          className={`${arrowClass} left-0`}
          style={{ background: `linear-gradient(to right, ${bgColor} 60%, transparent)` }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <nav
        ref={trackRef}
        aria-label="Product categories"
        className="container mx-auto px-4 flex items-center h-11 md:h-12 overflow-x-auto overscroll-x-contain scrollbar-hide"
      >
        {categories.map((cat, idx) => {
          const children = cat.children ?? [];
          const hasChildren = children.length > 0;
          const isOpen = openId === cat.id;

          const open = (el: HTMLElement) => {
            const box = containerRef.current?.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            if (box) setAnchor({ left: r.left - box.left, width: r.width });
            setOpenId(cat.id);
          };

          const itemClass =
            "flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-base md:text-lg font-bold whitespace-nowrap transition-colors";

          return (
            <div key={cat.id} className="shrink-0 flex items-center">
              {idx > 0 && <span aria-hidden="true" className="text-white/80 text-lg font-light px-0.5 md:px-1">|</span>}
              {/* Hover-open is mouse-only: on touch, the emulated hover would
                  open the panel and the following click would close it again. */}
              <div
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  if (hasChildren) open(e.currentTarget);
                  else setOpenId(null);
                }}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={(e) => (isOpen ? setOpenId(null) : open(e.currentTarget))}
                    className={`${itemClass} cursor-pointer ${isOpen ? "bg-black/15" : "hover:bg-black/10"}`}
                  >
                    <IconRenderer name={cat.icon ?? undefined} className="w-5 h-5 shrink-0" />
                    {cat.name}
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link href={`/categories/${cat.slug}`} className={`${itemClass} hover:bg-black/10`}>
                    <IconRenderer name={cat.icon ?? undefined} className="w-5 h-5 shrink-0" />
                    {cat.name}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Keeps a gap before "All products" once the row overflows and
            ml-auto has no free space left to push it right. */}
        <span aria-hidden="true" className="shrink-0 w-6" />
        <Link
          href="/shop"
          className="shrink-0 ml-auto px-3 py-1.5 rounded-lg text-base md:text-lg font-bold whitespace-nowrap opacity-85 hover:opacity-100 hover:bg-black/10 transition-colors"
        >
          সব পণ্য — All products
        </Link>
      </nav>

      {canNext && (
        <button
          type="button"
          onClick={() => slide(1)}
          aria-label="পরের ক্যাটাগরি — Next categories"
          className={`${arrowClass} right-0`}
          style={{ background: `linear-gradient(to left, ${bgColor} 60%, transparent)` }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Sub-categories: a small row directly under the open item (at least
          as wide as it), with white "|" separators. Rendered outside the nav
          because the nav scrolls horizontally (overflow-x-auto), which would
          clip it. The transparent pt-1.5 keeps a small gap that still counts
          as hovering the menu, so it doesn't close on the way down. */}
      {openCat && openChildren.length > 0 && (
        <div className="absolute top-full z-50 pt-1.5" style={{ left: panelLeft }}>
          <ul
            ref={panelRef}
            className="flex items-center justify-center flex-wrap w-max max-w-[calc(100vw-1rem)] px-2 py-1.5 rounded-lg shadow-theme-lg animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ minWidth: anchor.width, backgroundColor: bgColor, color: textColor }}
          >
            {openChildren.map((child, i) => (
              <li key={child.id} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="text-white/80 text-lg font-light px-1">|</span>}
                <Link
                  href={`/categories/${child.slug}`}
                  onClick={() => setOpenId(null)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md text-base md:text-lg font-bold whitespace-nowrap hover:bg-black/15 transition-colors"
                >
                  <IconRenderer name={child.icon ?? undefined} className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
