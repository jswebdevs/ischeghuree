import type { Metadata } from "next";
import OrderForm from "./_OrderForm";
import OrderHero, { type OrderHeroData } from "./_OrderHero";
import { getHomepageConfig, getGlobalSettings } from "@/lib/getSettings";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Order Now",
  description:
    "কাস্টম অর্ডার দিন — পাটের ব্যাগ ও হেয়ার অ্যাক্সেসরিজ, খুচরা বা পাইকারী। Place a custom order for jute bags & hair accessories — retail or wholesale, pick up or home delivery.",
  alternates: { canonical: "/order-now" },
};

/** Resolves ?product=<slug> into a human-readable line for the product-details
 *  field. Falls back to the raw slug if the lookup fails, and to nothing at all
 *  if no product was requested — a direct visit still gets an empty form. */
async function buildProductPrefill(slug?: string): Promise<string> {
  if (!slug) return "";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      next: { revalidate: 120, tags: [`product-${slug}`] },
    });
    if (!res.ok) return slug;
    const json = await res.json();
    const product = json.product || json.data;
    if (!product?.name) return slug;
    return product.productCode ? `${product.name} (${product.productCode})` : product.name;
  } catch {
    return slug;
  }
}

export default async function OrderNowPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const [hp, settings, { product: productSlug }] = await Promise.all([
    getHomepageConfig(),
    getGlobalSettings(),
    searchParams,
  ]);
  const productPrefill = await buildProductPrefill(productSlug);
  const heroConfig = ((hp as { orderHero?: Partial<OrderHeroData> } | null)?.orderHero || {}) as Partial<OrderHeroData>;

  const hero: OrderHeroData = {
    title: heroConfig.title || null,
    subtitle: heroConfig.subtitle || null,
    personName: heroConfig.personName || null,
    phone: heroConfig.phone || settings?.supportPhone || settings?.contactPhone || null,
    email: heroConfig.email || settings?.supportEmail || settings?.contactEmail || null,
    instructions: heroConfig.instructions || null,
    badgeText: heroConfig.badgeText || null,
    imageUrl:
      heroConfig.imageUrl ||
      settings?.logo?.originalUrl ||
      settings?.logo?.thumbUrl ||
      null,
    bottomImageUrl: heroConfig.bottomImageUrl || null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background p-3 md:p-6">
      <div className="max-w-[880px] mx-auto rounded-3xl border border-border overflow-hidden bg-card shadow-theme-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <OrderHero hero={hero} />
          <div className="bg-card flex items-stretch border-t md:border-t-0 md:border-l border-border">
            <div className="w-full">
              <OrderForm defaultProductDetails={productPrefill} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
