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
  // Left offset (px) of the open item within the bar, so the sub-category row
  // sits directly under it.
  const [anchorLeft, setAnchorLeft] = useState(0);
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
        className="container mx-auto px-4 flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide"
      >
        {categories.map((cat) => {
          const children = cat.children ?? [];
          const hasChildren = children.length > 0;
          const isOpen = openId === cat.id;

          const open = (el: HTMLElement) => {
            const box = containerRef.current?.getBoundingClientRect();
            if (box) setAnchorLeft(el.getBoundingClientRect().left - box.left);
            setOpenId(cat.id);
          };

          return (
            <div
              key={cat.id}
              className="shrink-0"
              onMouseEnter={(e) => (hasChildren ? open(e.currentTarget) : setOpenId(null))}
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={(e) => (isOpen ? setOpenId(null) : open(e.currentTarget))}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isOpen ? "bg-black/15" : "hover:bg-black/10"
                  }`}
                >
                  {cat.name}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={`/categories/${cat.slug}`}
                  className="flex items-center px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black/10 transition-colors"
                >
                  {cat.name}
                </Link>
              )}
            </div>
          );
        })}

        <Link
          href="/shop"
          className="shrink-0 ml-auto px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider opacity-85 hover:opacity-100 hover:bg-black/10 transition-colors"
        >
          সব পণ্য — All products
        </Link>
      </nav>

      {/* Sub-categories: a small row directly under the open item, with white
          "|" separators. Rendered outside the nav because the nav scrolls
          horizontally (overflow-x-auto), which would clip it. */}
      {openCat && openChildren.length > 0 && (
        <ul
          className="absolute top-full z-50 flex items-center w-max max-w-[calc(100%-2rem)] flex-wrap px-2 py-1.5 rounded-b-lg shadow-theme-lg animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ left: anchorLeft, backgroundColor: bgColor, color: textColor }}
        >
          {openChildren.map((child, i) => (
            <li key={child.id} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className="text-white/80 font-light">|</span>}
              <Link
                href={`/categories/${child.slug}`}
                onClick={() => setOpenId(null)}
                className="block px-2.5 py-1 rounded-md text-xs font-bold hover:bg-black/15 transition-colors"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
