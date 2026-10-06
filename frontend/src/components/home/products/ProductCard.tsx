"use client";

import { useState } from "react";
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
  variants?: CardVariant[] | null;
}

export interface CardVariant {
  id: string;
  name: string;
  colorHex?: string | null;
  isAvailable?: boolean;
  image?: { originalUrl: string; thumbUrl?: string | null } | null;
}

// How many swatches fit on one line of the narrowest card (two-column grid on
// a 375px phone) before the rest collapse into "+N".
const MAX_CARD_SWATCHES = 4;

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
  const variants = product.variants ?? [];
  // selectedId sticks (click/tap); previewId follows the mouse. The photo
  // shows the previewed variation first, then the selected one, then the
  // product's own — a variation without a photo leaves the photo unchanged.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const selected = variants.find((v) => v.id === selectedId) ?? null;
  const shown = variants.find((v) => v.id === previewId) ?? selected;
  const imageUrl = shown?.image?.originalUrl || product.featuredImage?.originalUrl;

  // A chosen variation travels with both links, so the product page opens on
  // it and the order form names it.
  const variantQuery = selected ? `variant=${encodeURIComponent(selected.id)}` : "";
  const productHref = `/products/${product.slug}${variantQuery ? `?${variantQuery}` : ""}`;
  const orderHref = `/order-now?product=${encodeURIComponent(product.slug ?? "")}${variantQuery ? `&${variantQuery}` : ""}`;
  const extraSwatches = Math.max(variants.length - MAX_CARD_SWATCHES, 0);
  const material = product.material;
  const badge = product.productStatus ? STATUS_BADGE[product.productStatus] : undefined;

  return (
    <article className="group relative h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-theme-md transition-all duration-300">
      {/* Square media — the whole tile is the link target, so the card body
          below is plain markup and the Order button can stay a real anchor
          without nesting one inside another. */}
      <Link
        href={productHref}
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
          <Link href={productHref}>{product.name}</Link>
        </h3>

        {/* Price sits directly under the name in a single column — storefront
            convention — rather than sharing a row with the CTA. */}
        <ProductPrice
          priceMin={product.priceMin}
          priceMax={product.priceMax}
          priceNote={product.priceNote}
          size="card"
          className={variants.length > 0 ? "mt-2 mb-2" : "mt-2 mb-3"}
        />

        {variants.length > 0 && (
          <div
            role="radiogroup"
            aria-label={`${product.name ?? ""} — অপশন / options`}
            className="flex items-center gap-1 mb-3"
            onMouseLeave={() => setPreviewId(null)}
          >
            {variants.slice(0, MAX_CARD_SWATCHES).map((v) => {
              const isSelected = v.id === selectedId;
              const available = v.isAvailable !== false;
              const thumb = v.image?.thumbUrl || v.image?.originalUrl;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={available ? v.name : `${v.name} — unavailable`}
                  title={available ? v.name : `${v.name} — unavailable`}
                  disabled={!available}
                  onMouseEnter={() => setPreviewId(v.id)}
                  onClick={() => setSelectedId(isSelected ? null : v.id)}
                  className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0.5 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected ? "border-primary border-2" : "border-border hover:border-primary/60"
                  }`}
                >
                  <span
                    className="block w-full h-full rounded-full bg-muted bg-cover bg-center"
                    style={
                      v.colorHex
                        ? { backgroundColor: v.colorHex }
                        : thumb
                          ? { backgroundImage: `url("${thumb}")` }
                          : undefined
                    }
                  />
                  {!available && (
                    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-full h-px bg-foreground/70 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
            {extraSwatches > 0 && (
              <Link
                href={productHref}
                className="text-[10px] font-bold text-muted-foreground hover:text-primary px-1"
                aria-label={`আরও ${extraSwatches}টি অপশন — ${extraSwatches} more options`}
              >
                +{extraSwatches}
              </Link>
            )}
          </div>
        )}

        <Link
          href={orderHref}
          className="mt-auto inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary/10 text-primary text-[10px] md:text-[11px] font-black uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          অর্ডার করুন — Order This
        </Link>
      </div>
    </article>
  );
}
