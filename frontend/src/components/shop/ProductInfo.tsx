"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, Check, Share2 } from "lucide-react";
import ProductPrice from "@/components/shop/ProductPrice";

interface ProductInfoData {
  name: string;
  slug?: string | null;
  productCode?: string | null;
  material?: string | null;
  shortDesc?: string | null;
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  priceNote?: string | null;
}

export default function ProductInfo({ product }: { product: ProductInfoData }) {
  const [shared, setShared] = useState(false);

  // Web Share where supported (mobile), clipboard everywhere else. Both paths
  // can reject — a blocked clipboard or a dismissed share sheet — so failure
  // just leaves the button unchanged rather than surfacing an error.
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Dismissed or denied — nothing to report.
    }
  };

  const renderShortDesc = () => {
    if (!product.shortDesc) return null;
    const lines = product.shortDesc.split('\n').filter((line: string) => line.trim() !== '');

    if (lines.length > 1) {
      return (
        <ul className="space-y-2 mb-8">
          {lines.map((line: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-subheading">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{line.replace(/^-\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm sm:text-base text-subheading mb-8 leading-relaxed">{product.shortDesc}</p>;
  };

  return (
    <div className="flex flex-col">
      {/* Brand line above the title, as storefront product pages do. */}
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
        ইচ্ছে ঘুড়ি — Ische Ghuree
      </span>

      {/* No uppercase here — it mangles Bangla glyphs. */}
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-heading leading-tight mb-3 tracking-tight">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {product.productCode && <span>কোড — Code: {product.productCode}</span>}
        {product.material && <span>উপাদান — Material: {product.material}</span>}
      </div>

      <ProductPrice
        priceMin={product.priceMin}
        priceMax={product.priceMax}
        priceNote={product.priceNote}
        className="mb-6"
      />

      <div className="w-full h-px bg-border mb-6" />

      {renderShortDesc()}

      {/* Availability pill — the catalog does no stock counting, so every
          published product reads as available and the quote confirms it. */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> স্টকে আছে — In Stock
        </span>
      </div>

      <div className="flex items-center gap-3 mb-10">
        {/* Carries the slug so the order form opens with this product already
            filled into "কী বানাতে/নিতে চান — Product details". */}
        <Link
          href={`/order-now?product=${product.slug ?? ""}`}
          className="flex-grow h-14 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-theme-lg hover:-translate-y-1 transition-all"
        >
          <ClipboardList className="w-5 h-5" /> অর্ডার করুন — Order This
        </Link>

        <button
          type="button"
          onClick={handleShare}
          aria-label="শেয়ার করুন — Share this product"
          className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {shared ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
