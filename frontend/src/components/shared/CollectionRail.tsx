"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard, { type CardProduct } from "@/components/home/products/ProductCard";

interface CollectionRailProps {
  title: string;
  /** Optional second line under the title (English gloss, category description). */
  subtitle?: string | null;
  products: CardProduct[];
  /** Where "সব দেখুন — View all" points. Omit to hide the link. */
  viewAllHref?: string;
  /** Renders as <h2> on the homepage, <h3> when nested under a page heading. */
  headingLevel?: "h2" | "h3";
}

// Horizontal product rail — native CSS scroll-snap rather than a JS slider, so
// trackpad, touch and keyboard scrolling all work for free and a page with six
// rails ships no extra runtime. The buttons and counter are progressive
// enhancement on top of a track that is already usable without them.
export default function CollectionRail({
  title,
  subtitle,
  products,
  viewAllHref,
  headingLevel = "h2",
}: CollectionRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const Heading = headingLevel;
  // Category names contain spaces (and Bangla), which are not valid in an id —
  // useId gives the heading a stable, collision-free one to be labelled by.
  const headingId = useId();

  // Recomputes the arrow-disabled flags and the "n / of m" counter from the
  // track's live scroll metrics. Called on mount, on scroll and on resize.
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;

    // A 2px tolerance: fractional layout widths mean scrollLeft rarely lands
    // exactly on either bound.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max <= 2 || el.scrollLeft >= max - 2);

    const pages = el.clientWidth > 0 ? Math.max(Math.ceil(el.scrollWidth / el.clientWidth), 1) : 1;
    setPageCount(pages);
    // Derive the page from scroll *progress*, not scrollLeft/clientWidth: the
    // last page is only partly scrollable (max/clientWidth < pages - 1), so the
    // naive ratio can never report the final page.
    const progress = max <= 2 ? 0 : Math.min(Math.max(el.scrollLeft / max, 0), 1);
    setPage(Math.min(pages, Math.round(progress * (pages - 1)) + 1));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const scrollByPage = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="py-8 md:py-10" aria-labelledby={headingId}>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <Heading
            id={headingId}
            className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-heading tracking-tight truncate"
          >
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-1 text-xs md:text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {pageCount > 1 && (
            <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest tabular-nums">
              {page} / of {pageCount}
            </span>
          )}
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label={`${title} — previous products`}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label={`${title} — next products`}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item widths are percentages of the track, so ~2 cards show on a phone,
          3 on a tablet and 4 on a desktop — the same density as the grids.
          The track is full-bleed (-mx-4) with px-4 padding back; scroll-px-4
          makes snapping honour that padding, otherwise the first card snaps
          flush to the viewport edge. */}
      <div
        ref={trackRef}
        className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 scrollbar-hide -mx-4 px-4 pb-2"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23.5%]"
          >
            <ProductCard product={p} compact />
          </div>
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-5 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-xs font-black uppercase tracking-widest text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            সব দেখুন — View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
