"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

import BasicInfoPart from "./form-parts/BasicInfoPart";
import StatusTagsPart from "./form-parts/StatusTagsPart";
import DescriptionPart from "./form-parts/DescriptionPart";
import AdditionalInfoPart from "./form-parts/AdditionalInfoPart";
import MediaPart from "./form-parts/MediaPart";
import ImmersiveMediaPart from "./form-parts/ImmersiveMediaPart";
import CategorySidebar from "./form-parts/CategorySidebar";

export interface ProductFormState {
  name: string;
  slug: string;
  productCode: string;
  priceMin: number | string | null;
  priceMax: number | string | null;
  priceNote: string;
  shortDesc: string;
  longDesc: string;
  tags: string[];
  productStatus: string;
  blogUrl: string;
  categoryIds: string[];
  featuredImage?: { id: string; thumbUrl?: string; originalUrl: string };
  galleryImages: { id: string; thumbUrl?: string; originalUrl: string }[];
  attributes: unknown[];
  material: string;
  usage: string;
  usefulness: string;
  awareness: string;
  specifications: string;
  suggestedProducts: string[];
}

// The product record as fetched from the API for edit mode — a superset of
// the form state with relational fields.
export type ProductFormInitialData = Omit<
  Partial<ProductFormState>,
  "specifications" | "suggestedProducts"
> & {
  id: string;
  specifications?: string | { key: string; value: string }[] | null;
  suggestedProducts?: { id: string }[] | string[];
  categories?: { id: string }[] | null;
  featuredImageId?: string | null;
  images?: { id: string; thumbUrl?: string; originalUrl: string }[] | null;
  model3d?: { id: string; originalUrl: string } | null;
  turntableFrames?: { id: string; originalUrl: string; sequence: number }[];
};

export default function ProductForm({ initialData: initialDataProp }: { initialData?: { id: string } | null }) {
  // Callers only guarantee an id; cast to the richer API shape used below.
  const initialData = initialDataProp as ProductFormInitialData | null | undefined;
  const router = useRouter();
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    productCode: "",
    priceMin: "" as number | string | null,
    priceMax: "" as number | string | null,
    priceNote: "",
    shortDesc: "",
    longDesc: "",
    tags: [] as string[],
    productStatus: "DRAFT",
    blogUrl: "",
    categoryIds: [] as string[],
    featuredImage: undefined as { id: string; thumbUrl?: string; originalUrl: string } | undefined,
    galleryImages: [] as { id: string; thumbUrl?: string; originalUrl: string }[],
    attributes: [] as unknown[],
    material: "",
    usage: "",
    usefulness: "",
    awareness: "",
    specifications: "",
    suggestedProducts: [] as string[],
  });

  useEffect(() => {
    if (initialData && !isInitialized) {
      let parsedSpecs = "";
      if (typeof initialData.specifications === "string") {
        parsedSpecs = initialData.specifications;
      } else if (Array.isArray(initialData.specifications)) {
        parsedSpecs = initialData.specifications.map((s) => `${s.key}: ${s.value}`).join("\n");
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration of the form state from the fetched product
      setProduct((prev) => ({
        ...prev,
        ...initialData,
        priceMin:
          initialData.priceMin === null || initialData.priceMin === undefined
            ? ""
            : Number(initialData.priceMin),
        priceMax:
          initialData.priceMax === null || initialData.priceMax === undefined
            ? ""
            : Number(initialData.priceMax),
        priceNote: initialData.priceNote || "",

        categoryIds: initialData.categories?.map((c) => c.id) || initialData.categoryIds || [],
        suggestedProducts: (initialData.suggestedProducts?.map(
          (p: { id: string } | string) => (p as { id: string }).id
        ) ||
          initialData.suggestedProducts ||
          []) as string[],

        featuredImage:
          initialData.featuredImage || initialData.featuredImageId
            ? {
                id: (initialData.featuredImage?.id || initialData.featuredImageId) as string,
                thumbUrl: initialData.featuredImage?.thumbUrl || "",
                originalUrl: initialData.featuredImage?.originalUrl || "",
              }
            : undefined,

        galleryImages:
          initialData.images?.map((img) => ({
            id: img.id,
            thumbUrl: img.thumbUrl,
            originalUrl: img.originalUrl,
          })) || [],

        material: initialData.material || "",
        usage: initialData.usage || "",
        usefulness: initialData.usefulness || "",
        awareness: initialData.awareness || "",
        specifications: parsedSpecs,
      }));

      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  const updateProduct = (fields: Partial<typeof product>) => {
    setProduct((prev) => ({ ...prev, ...fields }));
  };

  const handleSave = async () => {
    if (!product.name || !product.productCode) {
      return Swal.fire("Error", "Product Title and Code are required", "error");
    }

    const cleanPrice = (v: number | string | null | undefined) => {
      if (v === null || v === undefined || v === "" || (typeof v === "number" && Number.isNaN(v))) return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };
    const minN = cleanPrice(product.priceMin);
    const maxN = cleanPrice(product.priceMax);
    if (minN != null && maxN != null && minN > maxN) {
      return Swal.fire("Error", "Min price cannot be greater than max price.", "error");
    }

    setLoading(true);
    try {
      const payload = {
        name: product.name,
        slug: product.slug,
        productCode: product.productCode,
        priceMin: minN,
        priceMax: maxN,
        priceNote: product.priceNote || null,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        tags: product.tags,
        productStatus: product.productStatus,
        blogUrl: product.blogUrl,
        material: product.material,
        usage: product.usage,
        usefulness: product.usefulness,
        awareness: product.awareness,
        specifications: product.specifications,
        attributes: product.attributes,
        categoryIds: product.categoryIds,
        suggestedProducts: product.suggestedProducts,
        featuredImageId: product.featuredImage ? product.featuredImage.id : null,
        galleryImageIds: product.galleryImages.map((img) => img.id).filter(Boolean),
      };

      if (isEdit && initialData) {
        await api.patch(`/products/${initialData.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      Swal.fire("Success", "Product saved successfully", "success");
      router.push("/dashboard/super-admin/products");
    } catch (err) {
      console.error(err);
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      Swal.fire("Error", apiMessage || "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Single-scroll, equal-width 2-column grid (stacks below xl) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <BasicInfoPart product={product} update={updateProduct} />
          <DescriptionPart product={product} update={updateProduct} />
          <MediaPart product={product} update={updateProduct} />
          {isEdit && initialData?.id && (
            <ImmersiveMediaPart
              productId={initialData.id}
              initialModel3d={initialData.model3d}
              initialFrames={initialData.turntableFrames}
            />
          )}
        </div>

        <div className="space-y-8">
          <CategorySidebar product={product} update={updateProduct} />
          <StatusTagsPart product={product} update={updateProduct} />
          <AdditionalInfoPart product={product} update={updateProduct} />
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-30">
        <div className="bg-card border border-border rounded-3xl p-4 shadow-theme-lg">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isEdit ? "Update Changes" : "Publish Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
