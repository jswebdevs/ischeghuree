"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axios";

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
  children?: MenuCategory[];
}

// Desktop category navigation. The mobile equivalent is MobileCategoryDrawer,
// which is untouched — this row is hidden below md.
//
// Panels open on hover for mouse users and on click for keyboard/touch users;
// Escape and an outside click both close, matching the search dropdown's
// behaviour in Navbar.tsx.
export default function MegaMenu({ config }: { config?: CategoryBarConfig | null }) {
  const bgColor = safeColor(config?.bgColor, CATEGORY_BAR_DEFAULTS.bgColor);
  const textColor = safeColor(config?.textColor, CATEGORY_BAR_DEFAULTS.textColor);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  // Position/width (px) of the open item within the bar, so the sub-category
  // row sits directly under it and is at least as wide.
  const [anchor, setAnchor] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!openId) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [openId]);

  if (!categories.length) return null;

  const openCat = categories.find((c) => c.id === openId);
  const openChildren = openCat?.children ?? [];

  return (
    <div
      ref={containerRef}
      className="hidden md:block relative border-t border-border/60"
      style={{ backgroundColor: bgColor, color: textColor }}
      onMouseLeave={() => setOpenId(null)}
    >
      <nav
        aria-label="Product categories"
        className="container mx-auto px-4 flex items-center h-12 overflow-x-auto scrollbar-hide"
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

          return (
            <div key={cat.id} className="shrink-0 flex items-center">
              {idx > 0 && <span aria-hidden="true" className="text-white/80 text-lg font-light px-1">|</span>}
              <div onMouseEnter={(e) => (hasChildren ? open(e.currentTarget) : setOpenId(null))}>
                {hasChildren ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={(e) => (isOpen ? setOpenId(null) : open(e.currentTarget))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-lg font-bold transition-colors ${
                      isOpen ? "bg-black/15" : "hover:bg-black/10"
                    }`}
                  >
                    {cat.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex items-center px-3 py-1.5 rounded-lg text-lg font-bold hover:bg-black/10 transition-colors"
                  >
                    {cat.name}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        <Link
          href="/shop"
          className="shrink-0 ml-auto px-3 py-1.5 rounded-lg text-lg font-bold opacity-85 hover:opacity-100 hover:bg-black/10 transition-colors"
        >
          সব পণ্য — All products
        </Link>
      </nav>

      {/* Sub-categories: a small row directly under the open item (at least
          as wide as it), with white "|" separators. Rendered outside the nav
          because the nav scrolls horizontally (overflow-x-auto), which would
          clip it. The transparent pt-1.5 keeps a small gap that still counts
          as hovering the menu, so it doesn't close on the way down. */}
      {openCat && openChildren.length > 0 && (
        <div className="absolute top-full z-50 pt-1.5" style={{ left: anchor.left }}>
          <ul
            className="flex items-center justify-center flex-wrap w-max max-w-[90vw] px-2 py-1.5 rounded-lg shadow-theme-lg animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ minWidth: anchor.width, backgroundColor: bgColor, color: textColor }}
          >
            {openChildren.map((child, i) => (
              <li key={child.id} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="text-white/80 text-lg font-light px-1">|</span>}
                <Link
                  href={`/categories/${child.slug}`}
                  onClick={() => setOpenId(null)}
                  className="block px-3 py-1 rounded-md text-lg font-bold hover:bg-black/15 transition-colors"
                >
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
