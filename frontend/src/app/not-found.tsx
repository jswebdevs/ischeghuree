import Link from "next/link";

// Branded global 404 — bilingual (Bangla-first, English echo) with the
// kite mark drawn inline from the decorative kite facet CSS vars.
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      {/* Drifting kite */}
      <svg
        viewBox="0 0 64 84"
        className="h-28 w-auto animate-float-slow"
        role="img"
        aria-hidden="true"
      >
        <g stroke="hsl(var(--background))" strokeWidth="1.2" strokeLinejoin="round">
          <polygon points="32,3 32,30 9,26" fill="var(--kite-cyan)" />
          <polygon points="32,3 32,30 55,26" fill="var(--kite-orange)" />
          <polygon points="9,26 32,30 32,54" fill="var(--kite-green)" />
          <polygon points="55,26 32,30 32,54" fill="var(--kite-magenta)" />
        </g>
        <line x1="32" y1="3" x2="32" y2="54" stroke="hsl(var(--background))" strokeWidth="1" opacity="0.7" />
        <path
          d="M32 54 C 30 62, 38 64, 34 70 C 31 74.5, 24 74, 26 80"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <div className="space-y-3">
        <p className="font-heading text-6xl font-black tracking-tight text-primary sm:text-7xl">
          ৪০৪
        </p>
        <h1 className="font-heading text-2xl font-bold text-heading sm:text-3xl">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          ঘুড়িটা মনে হয় অন্য আকাশে উড়ে গেছে।
          <span className="mt-1 block text-sm">
            This page doesn&apos;t exist — the kite has drifted to another sky.
          </span>
        </p>
      </div>

      <Link
        href="/"
        className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-theme-md transition-colors hover:bg-primary/90"
      >
        হোমে ফিরে যান — Back to home
      </Link>
    </div>
  );
}
