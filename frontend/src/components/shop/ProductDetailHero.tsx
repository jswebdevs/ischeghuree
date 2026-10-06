"use client";

import { useMemo, useState } from "react";
import ProductMediaViewer from "@/components/shop/ProductMediaViewer";
import ProductInfo from "@/components/shop/ProductInfo";
import type { StoreVariant } from "@/components/shop/VariantSwatches";

type MediaViewerProps = React.ComponentProps<typeof ProductMediaViewer>;
type InfoProduct = React.ComponentProps<typeof ProductInfo>["product"];

interface ProductDetailHeroProps {
  product: InfoProduct & {
    featuredImage?: MediaViewerProps["featuredImage"];
    images?: MediaViewerProps["images"];
    model3d?: MediaViewerProps["model3d"];
    turntableFrames?: MediaViewerProps["turntableFrames"];
    variantLabel?: string | null;
    variants?: StoreVariant[] | null;
  };
}

// Client half of the product page: owns the selected variation so a swatch
// click can swap the main photo (media column) and the price, availability
// and order link (info column) together. The page itself stays a server
// component for data fetching and metadata.
export default function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const variants = product.variants ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = variants.find((v) => v.id === selectedId) ?? null;

  // The variant's photo leads, with the product's own photos still browsable
  // after it. Memoised: the gallery resets its active image whenever this
  // object's identity changes, so it must only change with the selection.
  const currentVariation = useMemo(() => {
    if (!selected?.image) return null;
    const rest = [product.featuredImage, ...(product.images || [])]
      .map((img) => img?.originalUrl)
      .filter((url): url is string => !!url && url !== selected.image?.originalUrl);
    return { featuredImage: selected.image.originalUrl, gallery: rest };
  }, [selected, product.featuredImage, product.images]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-start">
      {/* Media sticks while the longer info column scrolls past it. */}
      <div className="lg:sticky lg:top-24">
        <ProductMediaViewer
          featuredImage={product.featuredImage}
          images={product.images || []}
          productName={product.name}
          model3d={product.model3d}
          turntableFrames={product.turntableFrames}
          currentVariation={currentVariation}
        />
      </div>
      <ProductInfo
        product={product}
        variantLabel={product.variantLabel}
        variants={variants}
        selectedVariant={selected}
        onSelectVariant={setSelectedId}
      />
    </div>
  );
}
