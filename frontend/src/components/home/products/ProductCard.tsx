"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, ClipboardList } from "lucide-react";
import ProductPrice from "@/components/shop/ProductPrice";

export interface CardProduct {
  id: string;
  name?: string;
  slug?: string;
  featuredImage?: { originalUrl: string } | null;
  material?: string | null;
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  priceNote?: string | null;
  productStatus?: string | null;
  tags?: string[] | null;
}

interface ProductCardProps {
  product: CardProduct;
  /** Rails render tighter padding than grids; the media ratio stays square either way. */
  compact?: boolean;
}

// Status badge, top-left of the media — the catalog equivalent of a storefront
// "Sale"/"New" flag. Only publicly meaningful statuses get a badge; ACTIVE is
// the unremarkable default and deliberately renders nothing.
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  NEW: { label: "নতুন — New", className: "bg-kite-green/90 text-white" },
  HOT: { label: "জনপ্রিয় — Popular", className: "bg-kite-orange/90 text-white" },
  FEATURED: { label: "ফিচার্ড — Featured", className: "bg-primary text-primary-foreground" },
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const imageUrl = product.featuredImage?.originalUrl;
  const material = product.material;
  const badge = product.productStatus ? STATUS_BADGE[product.productStatus] : undefined;

  return (
    <article className="group relative h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-theme-md transition-all duration-300">
      {/* Square media — the whole tile is the link target, so the card body
          below is plain markup and the Order button can stay a real anchor
          without nesting one inside another. */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted/20"
        aria-label={product.name}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name ?? ""}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <Layers className="w-12 h-12" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
          {material && (
            <span className="px-2 py-0.5 bg-background/75 backdrop-blur-md border border-border rounded-full text-[9px] font-bold text-foreground/80 uppercase tracking-wider">
              {material}
            </span>
          )}
        </div>
      </Link>

      <div className={`flex-1 flex flex-col ${compact ? "p-3" : "p-4"}`}>
        <h3 className="font-heading text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Price sits directly under the name in a single column — storefront
            convention — rather than sharing a row with the CTA. */}
        <ProductPrice
          priceMin={product.priceMin}
          priceMax={product.priceMax}
          priceNote={product.priceNote}
          size="card"
          className="mt-2 mb-3"
        />

        <Link
          href={`/order-now?product=${product.slug ?? ""}`}
          className="mt-auto inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary/10 text-primary text-[10px] md:text-[11px] font-black uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          অর্ডার করুন — Order This
        </Link>
      </div>
    </article>
  );
}
