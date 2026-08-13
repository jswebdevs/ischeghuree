"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard, { type CardProduct } from "@/components/home/products/ProductCard";

interface FeaturedProductsProps {
  initialProducts?: CardProduct[];
}

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const [products, setProducts] = useState<CardProduct[]>(initialProducts || []);
  // An empty server result also triggers the client fallback fetch: the
  // server-side getFeaturedProducts() returns [] on API failure, which is
  // indistinguishable from "no products" — retrying from the browser costs
  // one request when the catalog is legitimately empty, but recovers the
  // section whenever only the build/ISR-time fetch failed.
  const [loading, setLoading] = useState(!initialProducts?.length);

  useEffect(() => {
    if (!initialProducts?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronous loading flag before the client-side fetch kicks off
      setLoading(true);
      api
        .get("/products?limit=3&page=1")
        .then((res) => {
          const items = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.data?.products)
            ? res.data.data.products
            : [];
          setProducts(items.slice(0, 3));
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [initialProducts]);

  return (
    <section className="py-20 md:py-24 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-muted/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4 md:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" /> ফিচার্ড · Featured
          </motion.div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-heading">
            পছন্দের <span className="text-primary">সংগ্রহ</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground tracking-[0.2em] uppercase">
            Featured — jute bags &amp; hair accessories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted/30 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
          >
            সব দেখুন — View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
