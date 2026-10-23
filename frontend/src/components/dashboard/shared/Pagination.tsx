"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Page buttons to show: first, last, and a window around the current page,
// with null marking a gap ("…").
function pageList(page: number, totalPages: number): (number | null)[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  /** Shown when there are no records, e.g. "No orders". */
  emptyLabel?: string;
}

// Pagination bar for dashboard lists: "Showing x–y of N" plus numbered page
// buttons (1 … 4 5 6 … 12) and prev/next. Always rendered, even with one page.
// md:pr-24 keeps the buttons clear of the floating chat button, which sits
// fixed in the bottom-right corner on desktop.
export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  disabled = false,
  emptyLabel = "Nothing to show",
}: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = Math.max(totalPages, 1);

  return (
    <div className="shrink-0 px-4 md:pr-24 py-3 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-xs font-bold text-muted-foreground tabular-nums">
        {total > 0 ? `Showing ${from}–${to} of ${total}` : emptyLabel}
      </span>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || disabled}
          aria-label="Previous page"
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {pageList(page, pages).map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`h-9 min-w-9 px-2 rounded-lg border text-sm font-bold tabular-nums transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages || disabled}
          aria-label="Next page"
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
