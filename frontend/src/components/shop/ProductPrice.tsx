"use client";

import { useCurrency } from "@/context/SettingsContext";

interface ProductPriceProps {
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  priceNote?: string | null;
  /** `card` is the compact form used inside grids and rails. */
  size?: "card" | "block";
  className?: string;
}

export const formatPriceRange = (
  symbol: string,
  min: number | null,
  max: number | null,
): string | null => {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max)
    return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()}`;
  const v = (min ?? max)!;
  return `${symbol}${v.toLocaleString()}`;
};

// Single source of truth for how a catalog price is rendered. The currency
// symbol is never hardcoded — it comes from SettingsContext (৳/BDT by default),
// and a product with no numeric price falls back to its priceNote and then to a
// quote-on-request line, because this catalog is quote-driven.
export default function ProductPrice({
  priceMin,
  priceMax,
  priceNote,
  size = "block",
  className = "",
}: ProductPriceProps) {
  const { symbol } = useCurrency();
  const min = priceMin != null ? Number(priceMin) : null;
  const max = priceMax != null ? Number(priceMax) : null;
  const label = formatPriceRange(symbol, min, max);
  const isRange = min != null && max != null && min !== max;

  const caption = label
    ? isRange
      ? "মূল্য পরিসীমা — Price range"
      : "প্রতি পিস — Per piece"
    : "পাইকারী ও খুচরা — Wholesale & retail";

  const amountClass =
    size === "card"
      ? "text-base md:text-lg font-black text-primary leading-tight"
      : "text-3xl md:text-4xl font-black text-primary tracking-tight leading-none";

  return (
    <div className={className}>
      <span className={`block ${amountClass}`}>
        {label || priceNote || "কোটেশন নিন — Quote on request"}
      </span>
      <span
        className={`block mt-1 text-muted-foreground uppercase tracking-widest font-bold ${
          size === "card" ? "text-[9px] font-medium mt-0.5" : "text-[10px]"
        }`}
      >
        {caption}
      </span>
      {/* When priceNote already stands in for the amount above, repeating it
          here would be noise — only show it alongside a real numeric price. */}
      {label && priceNote && (
        <span className="block mt-1.5 text-xs text-muted-foreground italic">{priceNote}</span>
      )}
    </div>
  );
}
