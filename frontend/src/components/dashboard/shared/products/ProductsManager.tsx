"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, Loader2, Search } from "lucide-react";
import Swal from "sweetalert2";
import type { AxiosError } from "axios";
import ProductTable, { type ProductSort } from "./ProductTable";
import CountBadge from "@/components/dashboard/shared/CountBadge";
import Pagination from "@/components/dashboard/shared/Pagination";

interface ProductRow {
  id: string;
  [key: string]: unknown;
}

const PAGE_SIZES = [10, 20, 50, 100] as const;

export default function ProductsManager({ basePath }: { basePath: string }) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(20);
  const [sort, setSort] = useState<ProductSort>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // Catalog-wide count for the title badge; only refreshed by unfiltered
  // fetches so a search doesn't shrink it.
  const [catalogTotal, setCatalogTotal] = useState<number | null>(null);

  // Debounce typing so each keystroke doesn't fire a request; a new search
  // always starts from page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { page, limit, ...(search ? { search } : {}), ...(sort ? { sort } : {}) },
      });
      const pages = res.data.pagination?.totalPages || 1;
      // Deleting the last row of the last page leaves it empty: step back.
      if (page > pages && pages >= 1 && (res.data.pagination?.total ?? 0) > 0) {
        setPage(pages);
        return;
      }
      setProducts(res.data.data || []);
      setTotal(res.data.pagination?.total ?? 0);
      if (!search) setCatalogTotal(res.data.pagination?.total ?? 0);
      setTotalPages(pages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount and whenever page/limit/search/sort change
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product and all its variations will be permanently deleted. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`);

      Swal.fire({
        title: "Deleted!",
        text: "The product has been removed from your inventory.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      });

      fetchProducts();
    } catch (error) {
      console.error("Failed to delete:", error);

      const axiosError = error as AxiosError<{ message?: string }>;
      Swal.fire({
        title: "Error!",
        text: axiosError.response?.data?.message || "Failed to delete product.",
        icon: "error",
        confirmButtonColor: "hsl(var(--primary))",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      });
    }
  };


  return (
    // Fills the dashboard's content area: title, search and the pagination
    // bar stay put; only the product rows scroll (the region below).
    <div className="h-full min-h-0 flex flex-col max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
            Products
            <CountBadge count={catalogTotal} label="products" />
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Manage inventory, pricing, and variations</p>
        </div>

        <Link
          href={`${basePath}/products/create`}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-theme-md hover:scale-105 transition-all shadow-theme-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search + page size */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or code (incl. variation codes)…"
            aria-label="Search products"
            className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground shrink-0">
          Per page
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex-1 min-h-0 bg-card border border-border rounded-2xl shadow-theme-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-10">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Loading products...</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto p-4 md:p-0">
            <ProductTable
              products={products}
              onDelete={handleDelete}
              basePath={basePath}
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                setPage(1);
              }}
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          disabled={loading}
          emptyLabel="No products"
        />
      </div>
    </div>
  );
}
