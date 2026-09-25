const REVALIDATE_SETTINGS = 300;  // 5 min — store settings rarely change
const REVALIDATE_PAGE = 120;      // 2 min — admin edits show sooner
const REVALIDATE_THEME    = 60;   // 1 min — admin colour edits (Themes page) show quickly
const REVALIDATE_HOMEPAGE = 120;  // 2 min — admin edits need to show sooner

export async function getGlobalSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: REVALIDATE_SETTINGS, tags: ["settings"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getHomepageConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`, {
      next: { revalidate: REVALIDATE_HOMEPAGE, tags: ["homepage"] },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

export async function getActiveTheme() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/active`, {
      next: { revalidate: REVALIDATE_THEME, tags: ["theme"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`, {
      next: { revalidate: REVALIDATE_PAGE, tags: [`page-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

const REVALIDATE_CATEGORIES = 300; // 5 min — the category tree changes rarely
const REVALIDATE_PRODUCTS = 120;   // 2 min — new products should surface quickly

/** Flat category list. Includes `parentId` and `_count.products`, which is how
 *  the homepage decides which top-level categories are worth a rail. */
export async function getCategoriesFlat() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: REVALIDATE_CATEGORIES, tags: ["categories"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Two-level nested tree (parents → children), each with `featuredImage` —
 *  feeds the header mega-menu and the collection tile grid. */
export async function getCategoryTree() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?tree=true`, {
      next: { revalidate: REVALIDATE_CATEGORIES, tags: ["categories"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Products in one category. NOTE: the API filters on category **id**, not
 *  slug — callers pass the id from getCategoriesFlat()/getCategoryTree(). */
export async function getProductsByCategory(categoryId: string, limit = 12) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${categoryId}&limit=${limit}&page=1`,
      { next: { revalidate: REVALIDATE_PRODUCTS, tags: ["products", `category-products-${categoryId}`] } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    // status=FEATURED: the homepage "Featured" grid shows FEATURED-status
    // products (backend getProducts filters on it), not just the newest 3.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3&page=1&status=FEATURED`, {
      next: { revalidate: 60, tags: ["products"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.products)
      ? json.data.products
      : [];
    return items.slice(0, 3);
  } catch {
    return [];
  }
}
