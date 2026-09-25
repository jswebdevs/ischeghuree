"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axios";

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
export default function MegaMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
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

  return (
    <div
      ref={containerRef}
      className="hidden md:block border-t border-border/60 bg-background/40"
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

          return (
            <div
              key={cat.id}
              className="relative shrink-0"
              onMouseEnter={() => hasChildren && setOpenId(cat.id)}
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenId(isOpen ? null : cat.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isOpen ? "text-primary bg-primary/10" : "text-foreground hover:text-primary"
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
                  className="flex items-center px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              )}

              {hasChildren && isOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 min-w-56 bg-card border border-border rounded-xl shadow-theme-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={() => setOpenId(null)}
                    className="block px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    সব দেখুন — View all {cat.name}
                  </Link>
                  <ul className="py-1">
                    {children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/categories/${child.slug}`}
                          onClick={() => setOpenId(null)}
                          className="block px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
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
        })}

        <Link
          href="/shop"
          className="shrink-0 ml-auto px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          সব পণ্য — All products
        </Link>
      </nav>
    </div>
  );
}
