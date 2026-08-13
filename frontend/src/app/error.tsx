"use client";

import { useEffect } from "react";
import Link from "next/link";

// Branded global error boundary — bilingual (Bangla-first, English echo),
// styled with theme tokens only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging/monitoring.
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 text-destructive"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-2xl font-bold text-heading sm:text-3xl">
          কিছু একটা ভুল হয়েছে
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          ঘুড়ির সুতোয় একটু টান পড়েছে — আবার চেষ্টা করুন।
          <span className="mt-1 block text-sm">
            Something went wrong. Please try again.
          </span>
        </p>
        {error?.digest && (
          <p className="text-xs text-muted-foreground/70">Error ID: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-theme-md transition-colors hover:bg-primary/90"
        >
          আবার চেষ্টা করুন — Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground transition-colors hover:bg-muted"
        >
          হোমে ফিরে যান — Back to home
        </Link>
      </div>
    </div>
  );
}
