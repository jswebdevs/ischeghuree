import CollectionRail from "@/components/shared/CollectionRail";
import { getCategoriesFlat, getProductsByCategory } from "@/lib/getSettings";

/** How many rails the homepage shows before it gets absurdly long. */
const MAX_RAILS = 6;
/** Products fetched per rail — enough for ~3 pages of 4 on a desktop. */
const PER_RAIL = 12;

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  _count?: { products?: number };
}

// One horizontal rail per top-level category, driven entirely by the category
// tree — there is no homepageConfig section to maintain, so a category the
// admin adds shows up here on the next revalidate without any extra setup.
export default async function CollectionRails() {
  const categories: FlatCategory[] = await getCategoriesFlat();

  const railCategories = categories
    .filter((c) => !c.parentId && (c._count?.products ?? 0) > 0)
    .slice(0, MAX_RAILS);

  if (!railCategories.length) return null;

  const productsPerCategory = await Promise.all(
    railCategories.map((c) => getProductsByCategory(c.id, PER_RAIL)),
  );

  const rails = railCategories
    .map((category, i) => ({ category, products: productsPerCategory[i] }))
    // A category can report a product count while every product in it is
    // DRAFT/ARCHIVED — the storefront fetch then returns nothing, so drop it
    // rather than render an empty heading.
    .filter(({ products }) => products.length > 0);

  if (!rails.length) return null;

  return (
    <div className="container mx-auto px-4 divide-y divide-border/60">
      {rails.map(({ category, products }) => (
        <CollectionRail
          key={category.id}
          title={category.name}
          subtitle={category.description}
          products={products}
          viewAllHref={`/categories/${category.slug}`}
        />
      ))}
    </div>
  );
}
