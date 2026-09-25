import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import IconRenderer from "@/components/shared/IconRenderer";
import { LuPackageOpen } from "react-icons/lu";
import ProductCard from "@/components/home/products/ProductCard";

export const revalidate = 120;

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parentId?: string | null;
}

async function fetchCategory(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
      next: { revalidate: 300, tags: [`category-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.category || json.data || null;
  } catch {
    return null;
  }
}

async function fetchAllCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 300, tags: ["categories"] },
    });
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch {
    return [];
  }
}

async function fetchCategoryProducts(categoryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}`,
      { next: { revalidate: 120, tags: [`category-products-${categoryId}`] } },
    );
    if (!res.ok) return [];
    return (await res.json()).data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) return { title: "Category Not Found" };

  const description =
    category.description || `Explore our ${category.name.toLowerCase()} collection.`;

  return {
    title: category.name,
    description,
    openGraph: { title: category.name, description, type: "website" },
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function SingleCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await fetchCategory(slug);
  if (!category) notFound();

  const [allCats, products] = await Promise.all([
    fetchAllCategories(),
    fetchCategoryProducts(category.id),
  ]);

  const subcategories = allCats.filter((c: Category) => c.parentId === category.id);

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div className="bg-gradient-theme border-b border-border py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-card border border-border rounded-3xl flex items-center justify-center shadow-theme-md shrink-0">
            <IconRenderer name={category.icon} className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-heading mb-3 tracking-tight">
              {category.name}
            </h1>
            <p className="text-subheading max-w-2xl text-base md:text-lg">
              {category.description || `Explore our premium selection of ${category.name.toLowerCase()}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {/* Subcategories as a horizontal pill row — a sub-nav above the grid
            rather than a tile block, so the products stay near the top. */}
        {subcategories.length > 0 && (
          <nav aria-label="Subcategories" className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {subcategories.map((subcat: Category) => (
              <Link
                key={subcat.id}
                href={`/categories/${subcat.slug}`}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <IconRenderer name={subcat.icon} className="w-3.5 h-3.5" />
                {subcat.name}
              </Link>
            ))}
          </nav>
        )}

        <section aria-labelledby="products-heading">
          <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border">
            <h2
              id="products-heading"
              className="font-heading text-lg md:text-xl font-bold text-foreground tracking-tight"
            >
              সব পণ্য — All products
            </h2>
            <span className="text-xs md:text-sm font-bold text-muted-foreground tabular-nums">
              {products.length} পণ্য — products
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((product: { id: string }) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card/50 border border-border border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <LuPackageOpen className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">
                We are currently restocking our {category.name} collection.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
