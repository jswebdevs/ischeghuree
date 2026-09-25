import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

import ProductMediaViewer from "@/components/shop/ProductMediaViewer";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductTabs from "@/components/shop/ProductTabs";
import CollectionRail from "@/components/shared/CollectionRail";
import { getProductsByCategory } from "@/lib/getSettings";

export const revalidate = 120;

interface RelatedProduct {
  id: string;
  name?: string;
  slug?: string;
}

/** Curated suggestions win; otherwise fall back to siblings in the product's
 *  first category so the rail is rarely empty. Self is always excluded. */
async function fetchRelated(product: {
  id: string;
  suggestedProducts?: RelatedProduct[];
  categories?: { id: string }[];
}): Promise<RelatedProduct[]> {
  const suggested = product.suggestedProducts ?? [];
  if (suggested.length > 0) return suggested;

  const categoryId = product.categories?.[0]?.id;
  if (!categoryId) return [];

  const siblings: RelatedProduct[] = await getProductsByCategory(categoryId, 12);
  return siblings.filter((p) => p.id !== product.id).slice(0, 8);
}

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      next: { revalidate: 120, tags: [`product-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.product || json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description =
    product.shortDesc ||
    product.longDesc?.slice(0, 160) ||
    `${product.name} — ইচ্ছে ঘুড়ি | handmade jute bags & hair accessories from Ische Ghuree`;

  const ogImage =
    product.featuredImage?.originalUrl || product.featuredImage?.thumbUrl || undefined;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, alt: product.name }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: product.name,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) notFound();

  const related = await fetchRelated(product);

  return (
    <div className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-[5%] max-w-360">
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary truncate max-w-75">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-start">
          {/* Media sticks while the longer info column scrolls past it. */}
          <div className="lg:sticky lg:top-24">
            <ProductMediaViewer
              featuredImage={product.featuredImage}
              images={product.images || []}
              productName={product.name}
              model3d={product.model3d}
              turntableFrames={product.turntableFrames}
              currentVariation={null}
            />
          </div>
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />

        {related.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <CollectionRail
              title="আরও দেখুন — You may also like"
              products={related}
              viewAllHref="/shop"
            />
          </div>
        )}
      </div>
    </div>
  );
}
