import Image from "next/image";
import Link from "next/link";
import { ClipboardList, ArrowUpRight, Layers } from "lucide-react";
import { getFeaturedProducts } from "@/lib/getSettings";
import ProductPrice from "@/components/shop/ProductPrice";

interface FeaturedProduct {
  id: string;
  name?: string;
  slug?: string;
  shortDesc?: string | null;
  productCode?: string | null;
  material?: string | null;
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  priceNote?: string | null;
  featuredImage?: { originalUrl?: string } | null;
}

// A single product given full-width treatment: big square image beside the
// name, price and highlights. The storefront analogue of a variant picker +
// "Add to cart" block, minus the cart — this project takes quote requests.
export default async function FeaturedProductBlock() {
  const products: FeaturedProduct[] = await getFeaturedProducts();
  const product = products[0];

  if (!product) return null;

  const imageUrl = product.featuredImage?.originalUrl;
  const highlights = (product.shortDesc || "")
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-muted/10 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <Link
            href={`/products/${product.slug}`}
            className="group relative block aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-border"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                <Layers className="w-20 h-20" />
              </div>
            )}
          </Link>

          <div className="flex flex-col">
            <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              ফিচার্ড পণ্য — Featured product
            </span>

            <h2 className="font-heading text-2xl md:text-4xl font-bold text-heading leading-tight tracking-tight mb-3">
              {product.name}
            </h2>

            {product.productCode && (
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                কোড — Code: {product.productCode}
              </span>
            )}

            <ProductPrice
              priceMin={product.priceMin}
              priceMax={product.priceMax}
              priceNote={product.priceNote}
              className="mb-6"
            />

            {highlights.length > 0 && (
              <ul className="space-y-2 mb-8">
                {highlights.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-subheading">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/order-now?product=${product.slug ?? ""}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:shadow-theme-lg hover:-translate-y-0.5 transition-all"
              >
                <ClipboardList className="w-4 h-4" />
                অর্ডার করুন — Order This
              </Link>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-border text-xs font-black uppercase tracking-widest text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                বিস্তারিত দেখুন — Details
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
