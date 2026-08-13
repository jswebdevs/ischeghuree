"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Image as ImageIcon, Box, RotateCw } from "lucide-react";
import ProductGallery, { type ProductVariation } from "./ProductGallery";
import Product360Viewer from "./Product360Viewer";

// 3D viewer is heavy (R3F + drei + three) and uses browser APIs — load it
// only on the client and only when the user picks the 3D tab.
const Product3DViewer = dynamic(() => import("./Product3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[4/5] sm:aspect-square bg-card border border-border rounded-3xl animate-pulse" />
  ),
});

interface Props {
  productName: string;
  featuredImage?: { originalUrl: string; thumbUrl?: string };
  images: { originalUrl: string; thumbUrl?: string }[];
  model3d?: { id: string; originalUrl: string } | null;
  turntableFrames?: { id: string; originalUrl: string; sequence: number }[];
  currentVariation?: ProductVariation | null;
}

type Tab = "photos" | "3d" | "360";

export default function ProductMediaViewer({
  productName,
  featuredImage,
  images,
  model3d,
  turntableFrames,
  currentVariation,
}: Props) {
  const has3d = !!model3d?.originalUrl;
  const has360 = (turntableFrames?.length ?? 0) >= 8;

  const [tab, setTab] = useState<Tab>("photos");

  // If neither immersive option exists, render the gallery alone — no tabs UI.
  if (!has3d && !has360) {
    return (
      <ProductGallery
        featuredImage={featuredImage}
        images={images}
        productName={productName}
        currentVariation={currentVariation}
      />
    );
  }

  return (
    <div className="space-y-3 lg:sticky lg:top-24 z-10">
      {/* Tab strip */}
      <div className="flex gap-2 flex-wrap">
        <TabButton active={tab === "photos"} onClick={() => setTab("photos")} icon={<ImageIcon className="w-3.5 h-3.5" />} label="Photos" />
        {has3d && (
          <TabButton active={tab === "3d"} onClick={() => setTab("3d")} icon={<Box className="w-3.5 h-3.5" />} label="3D" />
        )}
        {has360 && (
          <TabButton active={tab === "360"} onClick={() => setTab("360")} icon={<RotateCw className="w-3.5 h-3.5" />} label="360°" />
        )}
      </div>

      {tab === "photos" && (
        <ProductGallery
          featuredImage={featuredImage}
          images={images}
          productName={productName}
          currentVariation={currentVariation}
        />
      )}
      {tab === "3d" && has3d && <Product3DViewer url={model3d!.originalUrl} />}
      {tab === "360" && has360 && <Product360Viewer frames={turntableFrames!} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
