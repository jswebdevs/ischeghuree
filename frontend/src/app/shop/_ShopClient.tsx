"use client";

import { useState, useEffect } from "react";
import { Filter, SlidersHorizontal, X, Search } from "lucide-react";
import api from "@/lib/axios";
import ProductCard from "@/components/home/products/ProductCard";
import { useCurrency } from "@/context/SettingsContext";

interface ShopProduct {
  id: string;
  [key: string]: unknown;
}

interface ShopCategory {
  id: string;
  name: string;
  parentId?: string | null;
}

interface ShopFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { symbol } = useCurrency();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  // Accepts explicit filter values so callers that just changed state (e.g.
  // "Clear All") can fetch with the new values instead of this render's
  // stale closure; defaults to the current state.
  const fetchProducts = async (filters?: Partial<ShopFilters>) => {
    const f: ShopFilters = { search, category, minPrice, maxPrice, sort, ...filters };
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          search: f.search || undefined,
          category: f.category || undefined,
          minPrice: f.minPrice || undefined,
          maxPrice: f.maxPrice || undefined,
          sort: f.sort || undefined,
        },
      });
      setProducts(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount and sort change; fetchProducts sets loading state synchronously by design
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchProducts is recreated every render; only `sort` should auto-retrigger, other filters apply on submit
  }, [sort]);

  // Category options for the filter. The products endpoint matches on category
  // **id**, so the option values are ids, not slugs.
  useEffect(() => {
    let cancelled = false;
    api
      .get("/categories")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Losing the category list only costs one filter control.
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    // Fetch with the cleared values directly — state updates haven't rendered
    // yet, so relying on the closure here would refetch with the OLD filters.
    fetchProducts({ search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-theme border-b border-border py-10 md:py-14 mb-6 md:mb-8">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-heading tracking-tight">
            সব পণ্য — <span className="text-primary">All Products</span>
          </h1>
          <p className="text-subheading mt-3 max-w-2xl mx-auto md:mx-0">
            পুরো সংগ্রহ দেখুন — browse the full catalog and request a quote for anything you like.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter-and-sort bar: control on the left, live result count on the
            right — the standard storefront collection header. */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            {showFilters ? "বন্ধ করুন — Close" : "ফিল্টার ও সাজান — Filter and sort"}
          </button>

          <span className="text-xs md:text-sm font-bold text-muted-foreground tabular-nums">
            {loading ? "…" : `${products.length} পণ্য — products`}
          </span>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[1000px] opacity-100 mb-10' : 'max-h-0 opacity-0 mb-0'}`}>
          <form onSubmit={handleApplyFilters} className="bg-card border border-border rounded-2xl p-6 shadow-theme-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                >
                  <option value="">সব ক্যাটাগরি — All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parentId ? `— ${c.name}` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="az">Name: A to Z</option>
                  <option value="za">Name: Z to A</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading">Price Range ({symbol})</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none text-foreground"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl outline-none text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2 text-muted-foreground hover:text-heading font-medium transition-colors"
              >
                Clear All
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-bold shadow-theme-md hover:shadow-theme-lg transition-all hover:-translate-y-0.5"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-card border border-border rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-card border border-dashed border-border rounded-2xl">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-heading">No products found</h2>
            <p className="text-subheading mt-2">Try adjusting your filters or search term.</p>
            <button onClick={handleResetFilters} className="mt-6 text-primary font-semibold hover:underline">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
